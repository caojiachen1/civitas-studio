use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    response::{
        sse::{Event, KeepAlive, Sse},
        IntoResponse, Response,
    },
    routing::{get, post},
    Json, Router,
};
use serde::Serialize;
use serde_json::{json, Value};
use std::{
    collections::{HashMap, VecDeque},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Emitter, State as TauriState};
use tokio::sync::oneshot;
use tokio_stream::{wrappers::IntervalStream, StreamExt};
use tower_http::cors::CorsLayer;

#[derive(Default, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct McpStatus {
    pub running: bool,
    pub port: u16,
    pub token_required: bool,
    pub log: Vec<CallLog>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CallLog {
    pub timestamp: u64,
    pub tool: String,
    pub ok: bool,
    pub duration_ms: u64,
    pub error: Option<String>,
}

pub struct McpManager {
    pending: tokio::sync::Mutex<HashMap<String, oneshot::Sender<Result<Value, String>>>>,
    shutdown: Mutex<Option<oneshot::Sender<()>>>,
    info: Mutex<McpStatus>,
    log: Mutex<VecDeque<CallLog>>,
    counter: AtomicU64,
}

impl Default for McpManager {
    fn default() -> Self {
        Self {
            pending: tokio::sync::Mutex::new(HashMap::new()),
            shutdown: Mutex::new(None),
            info: Mutex::new(McpStatus::default()),
            log: Mutex::new(VecDeque::new()),
            counter: AtomicU64::new(0),
        }
    }
}

impl McpManager {
    fn stop(&self) {
        if let Some(sender) = self.shutdown.lock().unwrap().take() {
            let _ = sender.send(());
        }
        self.info.lock().unwrap().running = false;
    }

    fn status(&self) -> McpStatus {
        let mut info = self.info.lock().unwrap().clone();
        info.log = self.log.lock().unwrap().iter().cloned().collect();
        info
    }

    fn push_log(&self, entry: CallLog) {
        let mut log = self.log.lock().unwrap();
        log.push_front(entry);
        while log.len() > 80 {
            log.pop_back();
        }
    }
}

#[derive(Clone)]
struct ServerState {
    app: AppHandle,
    manager: Arc<McpManager>,
    token: String,
}

#[tauri::command]
pub fn mcp_status(manager: TauriState<'_, Arc<McpManager>>) -> McpStatus {
    manager.status()
}

#[tauri::command]
pub async fn mcp_stop(manager: TauriState<'_, Arc<McpManager>>) -> Result<McpStatus, String> {
    manager.stop();
    Ok(manager.status())
}

#[tauri::command]
pub async fn mcp_start(
    app: AppHandle,
    manager: TauriState<'_, Arc<McpManager>>,
    port: u16,
    token: String,
) -> Result<McpStatus, String> {
    manager.stop();
    tokio::time::sleep(Duration::from_millis(220)).await;
    let base_port = if port == 0 { 8971 } else { port };
    let mut listener = None;
    let mut chosen_port = base_port;
    for offset in 0..24u16 {
        let candidate = base_port.saturating_add(offset);
        if let Ok(bound) = tokio::net::TcpListener::bind(("127.0.0.1", candidate)).await {
            listener = Some(bound);
            chosen_port = candidate;
            break;
        }
    }
    let listener = listener.ok_or_else(|| "无法绑定 127.0.0.1 上的 MCP 端口。".to_string())?;
    let manager_arc = manager.inner().clone();
    {
        let mut info = manager_arc.info.lock().unwrap();
        info.running = true;
        info.port = chosen_port;
        info.token_required = !token.trim().is_empty();
    }
    let state = Arc::new(ServerState {
        app,
        manager: manager_arc.clone(),
        token: token.trim().to_string(),
    });
    let router = Router::new()
        .route(
            "/mcp",
            post(handle_mcp)
                .get(handle_sse)
                .delete(handle_delete),
        )
        .route("/api", get(handle_discovery))
        .route("/api/tools/{tool}", post(handle_rest_tool))
        .layer(CorsLayer::permissive())
        .with_state(state);
    let (shutdown_tx, shutdown_rx) = oneshot::channel::<()>();
    *manager_arc.shutdown.lock().unwrap() = Some(shutdown_tx);
    let task_manager = manager_arc.clone();
    tauri::async_runtime::spawn(async move {
        tokio::select! {
            result = axum::serve(listener, router) => {
                if let Err(error) = result {
                    eprintln!("mcp server error: {error}");
                }
            }
            _ = shutdown_rx => {}
        }
        task_manager.info.lock().unwrap().running = false;
    });
    Ok(manager_arc.status())
}

#[tauri::command]
pub async fn mcp_respond(
    manager: TauriState<'_, Arc<McpManager>>,
    id: String,
    ok: bool,
    result: Option<Value>,
    error: Option<String>,
) -> Result<(), String> {
    let sender = manager.pending.lock().await.remove(&id);
    if let Some(sender) = sender {
        let payload = if ok {
            Ok(result.unwrap_or(Value::Null))
        } else {
            Err(error.unwrap_or_else(|| "工具执行失败".to_string()))
        };
        let _ = sender.send(payload);
    }
    Ok(())
}

fn is_authorized(headers: &HeaderMap, token: &str) -> bool {
    if token.is_empty() {
        return true;
    }
    if let Some(value) = headers.get("authorization").and_then(|v| v.to_str().ok()) {
        if let Some(rest) = value.strip_prefix("Bearer ") {
            if rest.trim() == token {
                return true;
            }
        }
    }
    if let Some(value) = headers.get("x-mcp-token").and_then(|v| v.to_str().ok()) {
        if value.trim() == token {
            return true;
        }
    }
    false
}

fn unauthorized() -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(json!({ "error": "invalid or missing MCP token" })),
    )
        .into_response()
}

async fn dispatch(
    state: &ServerState,
    method: &str,
    tool: Option<String>,
    args: Value,
) -> Result<Value, String> {
    let seq = state.manager.counter.fetch_add(1, Ordering::Relaxed);
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    let id = format!("{now:x}-{seq:x}");
    let (tx, rx) = oneshot::channel();
    state.manager.pending.lock().await.insert(id.clone(), tx);
    let payload = json!({
        "id": id,
        "method": method,
        "tool": tool,
        "args": args,
    });
    state
        .app
        .emit("mcp:request", payload)
        .map_err(|error| format!("无法把请求发送到编辑器：{error}"))?;
    match tokio::time::timeout(Duration::from_secs(120), rx).await {
        Ok(Ok(result)) => result,
        Ok(Err(_)) => Err("MCP 请求通道已关闭。".to_string()),
        Err(_) => {
            state.manager.pending.lock().await.remove(&id);
            Err("工具执行超时（120 秒）。".to_string())
        }
    }
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

fn rpc_result(id: Value, result: Value) -> Value {
    json!({ "jsonrpc": "2.0", "id": id, "result": result })
}

fn rpc_error(id: Value, code: i64, message: &str) -> Value {
    json!({
        "jsonrpc": "2.0",
        "id": id,
        "error": { "code": code, "message": message }
    })
}

async fn call_tool(state: &ServerState, name: &str, args: Value) -> Result<Value, String> {
    let started = Instant::now();
    let result = dispatch(state, "tools/call", Some(name.to_string()), args).await;
    let duration_ms = started.elapsed().as_millis() as u64;
    let ok = match &result {
        Ok(value) => value.get("ok").and_then(|v| v.as_bool()).unwrap_or(true),
        Err(_) => false,
    };
    state.manager.push_log(CallLog {
        timestamp: now_ms(),
        tool: name.to_string(),
        ok,
        duration_ms,
        error: result.as_ref().err().cloned(),
    });
    result
}

async fn handle_mcp(
    State(state): State<Arc<ServerState>>,
    headers: HeaderMap,
    Json(payload): Json<Value>,
) -> Response {
    if !is_authorized(&headers, &state.token) {
        return unauthorized();
    }
    let id = payload.get("id").cloned();
    let method = payload.get("method").and_then(|v| v.as_str()).unwrap_or("");
    if method.starts_with("notifications/") {
        return StatusCode::ACCEPTED.into_response();
    }
    let Some(id) = id else {
        return StatusCode::ACCEPTED.into_response();
    };
    let response = match method {
        "initialize" => {
            let requested = payload
                .get("params")
                .and_then(|p| p.get("protocolVersion"))
                .and_then(|v| v.as_str())
                .unwrap_or("2025-06-18");
            rpc_result(
                id,
                json!({
                    "protocolVersion": requested,
                    "capabilities": { "tools": {} },
                    "serverInfo": {
                        "name": "civitas-studio",
                        "title": "Civitas Studio",
                        "version": env!("CARGO_PKG_VERSION")
                    }
                }),
            )
        }
        "ping" => rpc_result(id, json!({})),
        "tools/list" => match dispatch(&state, "tools/list", None, json!({})).await {
            Ok(result) => rpc_result(id, result),
            Err(error) => rpc_error(id, -32603, &error),
        },
        "tools/call" => {
            let params = payload.get("params").cloned().unwrap_or_else(|| json!({}));
            let name = params
                .get("name")
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();
            if name.is_empty() {
                rpc_error(id, -32602, "tools/call requires params.name")
            } else {
                let args = params.get("arguments").cloned().unwrap_or_else(|| json!({}));
                match call_tool(&state, &name, args).await {
                    Ok(value) => {
                        let is_error = value
                            .get("ok")
                            .and_then(|v| v.as_bool())
                            .map(|ok| !ok)
                            .unwrap_or(false);
                        let text = serde_json::to_string_pretty(&value)
                            .unwrap_or_else(|_| "{}".to_string());
                        rpc_result(
                            id,
                            json!({
                                "content": [{ "type": "text", "text": text }],
                                "structuredContent": value,
                                "isError": is_error
                            }),
                        )
                    }
                    Err(error) => rpc_error(id, -32000, &error),
                }
            }
        }
        _ => rpc_error(id, -32601, &format!("unknown method: {method}")),
    };
    Json(response).into_response()
}

async fn handle_sse(
    State(state): State<Arc<ServerState>>,
    headers: HeaderMap,
) -> Response {
    if !is_authorized(&headers, &state.token) {
        return unauthorized();
    }
    let stream = IntervalStream::new(tokio::time::interval(Duration::from_secs(20)))
        .map(|_| Ok::<Event, std::convert::Infallible>(Event::default().comment("keepalive")));
    Sse::new(stream)
        .keep_alive(KeepAlive::default())
        .into_response()
}

async fn handle_delete() -> StatusCode {
    StatusCode::OK
}

async fn handle_discovery(
    State(state): State<Arc<ServerState>>,
    headers: HeaderMap,
) -> Response {
    if !is_authorized(&headers, &state.token) {
        return unauthorized();
    }
    Json(json!({
        "name": "civitas-studio",
        "version": env!("CARGO_PKG_VERSION"),
        "description": "Civitas Studio 3D city and building editor",
        "transport": "mcp-http",
        "mcp": "/mcp",
        "rest": "/api/tools/{tool}",
        "auth": if state.token.is_empty() { "none" } else { "bearer" }
    }))
    .into_response()
}

async fn handle_rest_tool(
    State(state): State<Arc<ServerState>>,
    headers: HeaderMap,
    Path(tool): Path<String>,
    Json(args): Json<Value>,
) -> Response {
    if !is_authorized(&headers, &state.token) {
        return unauthorized();
    }
    match call_tool(&state, &tool, args).await {
        Ok(value) => Json(value).into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "ok": false, "error": error })),
        )
            .into_response(),
    }
}
