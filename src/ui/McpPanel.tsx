import { useEffect, useState } from 'react'
import {
  Copy,
  Loader2,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  Square,
  Terminal,
} from 'lucide-react'
import { useMcp } from '../mcp/store'
import { MCP_TOOLS } from '../mcp/tools'
import { useRuntime } from '../editor/runtime'
import './mcp.css'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { hour12: false })
}

export function McpPanel({ onBack }: { onBack: () => void }) {
  const available = useMcp((state) => state.available)
  const settings = useMcp((state) => state.settings)
  const setSettings = useMcp((state) => state.setSettings)
  const status = useMcp((state) => state.status)
  const busy = useMcp((state) => state.busy)
  const lastError = useMcp((state) => state.lastError)
  const refresh = useMcp((state) => state.refresh)
  const start = useMcp((state) => state.start)
  const stop = useMcp((state) => state.stop)
  const toast = useRuntime((state) => state.toast)
  const [showToken, setShowToken] = useState(false)
  const port = status.running ? status.port : settings.port
  const endpoint = `http://127.0.0.1:${port || 8971}/mcp`
  const baseUrl = `http://127.0.0.1:${port || 8971}`
  const tokenHeader = settings.token.trim()
    ? `,\n      "headers": { "Authorization": "Bearer ${settings.token.trim()}" }`
    : ''
  const mcpConfig = `{
  "mcpServers": {
    "civitas-studio": {
      "url": "${endpoint}"${tokenHeader}
    }
  }
}`
  const restExample = `curl -X POST ${baseUrl}/api/tools/build_room \\
  -H "Content-Type: application/json"${settings.token.trim() ? ` \\\n  -H "Authorization: Bearer ${settings.token.trim()}"` : ''} \\
  -d '{"roomType":"bedroom","width":5,"depth":4.5,"furnish":true}'`

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => void refresh(), 3000)
    return () => window.clearInterval(timer)
  }, [refresh])

  const copy = async (text: string, label: string) => {
    const ok = await copyText(text)
    toast(ok ? `${label}已复制` : '复制失败', ok ? 'success' : 'error')
  }

  return (
    <div className="mcp-panel" data-ui-scope="mcp-panel">
      <div className="ai-settings-head">
        <button type="button" className="ai-back" onClick={onBack}>
          ← 返回对话
        </button>
        <span className="eyebrow">MCP · AGENT API</span>
      </div>

      {!available && (
        <div className="mcp-unavailable">
          <ShieldCheck size={18} />
          <div>
            <strong>MCP 服务仅在桌面版中运行</strong>
            <p>打包后的 Civitas Studio 会在本机启动 127.0.0.1 上的 MCP/HTTP 服务，供任意第三方 Agent 接入。</p>
          </div>
        </div>
      )}

      <div className={`mcp-status-card ${status.running ? 'is-running' : ''}`}>
        <span className="mcp-status-icon">
          <Server size={18} />
        </span>
        <div>
          <span className="eyebrow">MCP SERVER</span>
          <h3>{status.running ? '服务运行中' : '服务未启动'}</h3>
          <p>{status.running ? `监听 127.0.0.1:${status.port}` : '外部 Agent 暂时无法连接'}</p>
        </div>
        <span className="mcp-status-pill">{status.running ? 'ONLINE' : 'OFFLINE'}</span>
      </div>

      <div className="mcp-endpoint">
        <code>{endpoint}</code>
        <button type="button" onClick={() => void copy(endpoint, 'MCP 地址')} title="复制 MCP 地址">
          <Copy size={13} />
        </button>
      </div>

      <div className="mcp-action-row">
        {status.running ? (
          <>
            <button type="button" className="mcp-primary is-stop" data-automation-id="mcp-stop" disabled={busy} onClick={() => void stop()}>
              {busy ? <Loader2 size={14} className="spin" /> : <Square size={13} />} 停止服务
            </button>
            <button type="button" className="mcp-secondary" data-automation-id="mcp-start" disabled={busy} onClick={() => void start()}>
              {busy ? <Loader2 size={14} className="spin" /> : <RefreshCw size={13} />} 重启
            </button>
          </>
        ) : (
          <button
            type="button"
            className="mcp-primary"
            disabled={!available || busy}
            onClick={() => void start()}
          >
            {busy ? <Loader2 size={14} className="spin" /> : <Play size={13} />} 启动 MCP 服务
          </button>
        )}
        <button type="button" className="mcp-secondary" data-automation-id="mcp-refresh" onClick={() => void refresh()}>
          <RefreshCw size={13} /> 刷新
        </button>
      </div>

      {lastError && <div className="mcp-error">{lastError}</div>}

      <section className="mcp-section">
        <h3>服务设置</h3>
        <label className="mcp-field">
          <span>端口</span>
          <input
            type="number"
            min={1024}
            max={65535}
            value={settings.port}
            onChange={(event) => setSettings({ port: Math.max(1024, Math.min(65535, Number(event.target.value) || 8971)) })}
          />
        </label>
        <label className="mcp-field">
          <span>访问令牌（可选）</span>
          <div className="mcp-token-field">
            <input
              type={showToken ? 'text' : 'password'}
              placeholder="留空则仅依赖 127.0.0.1 本地访问限制"
              value={settings.token}
              onChange={(event) => setSettings({ token: event.target.value })}
              autoComplete="off"
            />
            <button type="button" onClick={() => setShowToken((value) => !value)}>
              {showToken ? '隐藏' : '显示'}
            </button>
          </div>
        </label>
        <button
          type="button"
          className={`ai-setting-toggle ${settings.autoStart ? 'is-on' : ''}`}
          onClick={() => setSettings({ autoStart: !settings.autoStart })}
        >
          <span>
            <strong>启动应用时自动开启</strong>
            <small>端口和令牌在重启服务后生效</small>
          </span>
          <span className="switch">
            <span className="switch-knob" />
          </span>
        </button>
      </section>

      <section className="mcp-section">
        <h3>连接 MCP Agent</h3>
        <p className="mcp-note">
          支持 Streamable HTTP MCP（POST <span className="mono">/mcp</span>，GET <span className="mono">/mcp</span> 用于 SSE）。
          将下面的配置粘贴到你的 Agent 客户端中，或直接调用 REST 接口。
        </p>
        <div className="mcp-code-head">
          <span>mcpServers 配置</span>
          <button type="button" onClick={() => void copy(mcpConfig, 'MCP 配置')}>
            <Copy size={12} /> 复制
          </button>
        </div>
        <pre className="mcp-code">{mcpConfig}</pre>
        <div className="mcp-code-head">
          <span>REST 调用示例</span>
          <button type="button" onClick={() => void copy(restExample, 'REST 示例')}>
            <Copy size={12} /> 复制
          </button>
        </div>
        <pre className="mcp-code">{restExample}</pre>
        <p className="mcp-note">
          其他接口：<span className="mono">GET /api</span> 发现文档，<span className="mono">POST /api/tools/&lt;name&gt;</span> 直接调用工具。
        </p>
      </section>

      <section className="mcp-section">
        <h3>
          <Terminal size={12} /> 可用工具 · {MCP_TOOLS.length}
        </h3>
        <div className="mcp-tool-cloud">
          {MCP_TOOLS.map((tool) => (
            <span key={tool.name}>{tool.name}</span>
          ))}
        </div>
        <p className="mcp-note">
          先调用 <span className="mono">get_scene</span> 与 <span className="mono">list_models</span> 获取上下文；复杂的多步建模可用
          <span className="mono"> apply_actions</span> 作为单步撤销提交。
        </p>
      </section>

      <section className="mcp-section">
        <h3>最近调用</h3>
        {status.log.length === 0 ? (
          <div className="mcp-empty">等待外部 Agent 调用…</div>
        ) : (
          <div className="mcp-log">
            {status.log.slice(0, 24).map((entry, index) => (
              <div className="mcp-log-row" key={`${entry.timestamp}-${index}`}>
                <span className={`mcp-log-dot ${entry.ok ? 'is-ok' : 'is-error'}`} />
                <span className="mcp-log-time">{formatTime(entry.timestamp)}</span>
                <span className="mcp-log-tool">{entry.tool}</span>
                <span className="mcp-log-duration">{entry.durationMs} ms</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
