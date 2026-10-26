use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::{Deserialize, Serialize};
use std::fs;
use std::time::Duration;

mod mcp;

#[tauri::command]
fn save_file(path: String, base64_data: String) -> Result<(), String> {
    let bytes = STANDARD.decode(base64_data).map_err(|e| e.to_string())?;
    fs::write(path, bytes).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_file_base64(path: String) -> Result<String, String> {
    let bytes = fs::read(path).map_err(|e| e.to_string())?;
    Ok(STANDARD.encode(bytes))
}

#[derive(Deserialize, Serialize)]
struct AiMessage {
    role: String,
    content: String,
}

#[tauri::command]
async fn ai_chat(
    base_url: String,
    api_key: String,
    model: String,
    messages: Vec<AiMessage>,
    temperature: f32,
) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(15))
        .timeout(Duration::from_secs(120))
        .build()
        .map_err(|error| format!("创建网络客户端失败：{error}"))?;
    let body = serde_json::json!({
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 1800,
    });
    let mut request = client
        .post(&base_url)
        .header("Content-Type", "application/json")
        .json(&body);
    if !api_key.trim().is_empty() {
        request = request.bearer_auth(api_key.trim());
    }
    let response = request
        .send()
        .await
        .map_err(|error| format!("无法连接模型接口：{error}"))?;
    let status = response.status();
    let text = response
        .text()
        .await
        .map_err(|error| format!("读取模型响应失败：{error}"))?;
    if !status.is_success() {
        let snippet: String = text.chars().take(600).collect();
        return Err(format!("接口返回 {}：{}", status.as_u16(), snippet));
    }
    let json: serde_json::Value =
        serde_json::from_str(&text).map_err(|error| format!("接口响应不是有效 JSON：{error}"))?;
    json.get("choices")
        .and_then(|choices| choices.get(0))
        .and_then(|choice| choice.get("message"))
        .and_then(|message| message.get("content"))
        .and_then(|content| content.as_str())
        .map(|content| content.to_string())
        .ok_or_else(|| "模型响应中缺少 choices[0].message.content。".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(std::sync::Arc::new(mcp::McpManager::default()))
        .invoke_handler(tauri::generate_handler![
            save_file,
            read_file_base64,
            ai_chat,
            mcp::mcp_status,
            mcp::mcp_start,
            mcp::mcp_stop,
            mcp::mcp_respond
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
