import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  Bot,
  Check,
  CheckCircle2,
  Cloud,
  Cpu,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Play,
  Plug,
  RefreshCw,
  Send,
  Settings2,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from 'lucide-react'
import './ai.css'
import { useAi } from '../ai/store'
import { useEditor } from '../editor/store'
import { McpPanel } from './McpPanel'
import { sendAiMessage, executeAiMessage } from '../ai/service'
import { actionLabel, DESTRUCTIVE_ACTIONS, type AiChatMessage } from '../ai/types'
import { testLlmConnection } from '../ai/llm'

const SUGGESTIONS = [
  '建一栋带泳池的现代别墅',
  '建一个 6×5 的卧室并布置家具',
  '画一条弯曲的河流',
  '在附近种 8 棵树',
  '在河上画一座桥',
  '场景里现在有什么？',
  '看看现在的场景，说说哪里还能改进',
]

const VISION_LABELS: Record<string, string> = {
  current: '当前视角',
  overview: '总览',
  top: '俯视',
  north: '北',
  east: '东',
  south: '南',
  west: '西',
  northeast: '东北',
  southeast: '东南',
  southwest: '西南',
  northwest: '西北',
  result: '结果快照',
}

function VisionStrip({ message }: { message: AiChatMessage }) {
  if ((!message.images || message.images.length === 0) && !message.snapshot) return null
  return (
    <div className="ai-vision-strip">
      {message.images?.map((shot, index) => (
        <figure key={`${shot.label}-${index}`}>
          <img src={shot.dataUrl} alt={VISION_LABELS[shot.label] ?? shot.label} />
          <figcaption>{VISION_LABELS[shot.label] ?? shot.label}</figcaption>
        </figure>
      ))}
      {message.snapshot && (
        <figure className="is-result">
          <img src={message.snapshot.dataUrl} alt="结果快照" />
          <figcaption>{VISION_LABELS.result}</figcaption>
        </figure>
      )}
    </div>
  )
}

function PlanCard({ message }: { message: AiChatMessage }) {
  const plan = message.plan
  const busy = useAi((state) => state.busy)
  const autoExecute = useAi((state) => state.settings.autoExecute)
  if (!plan || plan.actions.length === 0) return null
  const result = message.result
  const status = message.status ?? 'ready'
  const destructive = plan.actions.some((action) => DESTRUCTIVE_ACTIONS.has(action.type))
  const warnings = [...new Set([...(plan.warnings ?? []), ...(result?.warnings ?? [])])]
  return (
    <div className={`ai-plan ${destructive ? 'is-destructive' : ''}`}>
      <div className="ai-plan-head">
        <span>
          <Wand2 size={13} /> 执行计划
        </span>
        <em>{plan.actions.length} 步</em>
      </div>
      <div className="ai-action-list">
        {plan.actions.map((action, index) => (
          <div
            key={`${action.type}-${index}`}
            className={`ai-action-item ${DESTRUCTIVE_ACTIONS.has(action.type) ? 'is-danger' : ''}`}
          >
            <span className="ai-action-index">{index + 1}</span>
            <span>{actionLabel(action)}</span>
          </div>
        ))}
      </div>
      {warnings.length > 0 && (
        <div className="ai-plan-warnings">
          {warnings.slice(0, 5).map((warning) => (
            <span key={warning}>
              <AlertTriangle size={12} /> {warning}
            </span>
          ))}
        </div>
      )}
      {status === 'ready' && (!autoExecute || busy) && (
        <button
          type="button"
          className="ai-execute-button"
          disabled={busy}
          onClick={() => void executeAiMessage(message.id)}
        >
          {busy ? <Loader2 size={14} className="spin" /> : <Play size={14} />}
          执行计划
        </button>
      )}
      {status === 'executing' && (
        <div className="ai-plan-status">
          <Loader2 size={13} className="spin" /> 正在操作场景…
        </div>
      )}
      {status === 'executed' && result && (
        <div className="ai-plan-result">
          <span className="ai-result-title">
            <CheckCircle2 size={14} /> 已完成
          </span>
          <p>{result.summary}</p>
          <span className="ai-undo-hint">按 Ctrl+Z 可以撤销这一步 AI 操作</span>
        </div>
      )}
      {status === 'failed' && (
        <div className="ai-plan-error">
          <AlertCircle size={14} /> {result?.error ?? '执行失败'}
        </div>
      )}
      {status === 'cancelled' && (
        <div className="ai-plan-status is-cancelled">已取消执行</div>
      )}
    </div>
  )
}

function ChatMessageView({ message }: { message: AiChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`ai-message ${isUser ? 'is-user' : 'is-assistant'}`}>
      <span className={`ai-avatar ${isUser ? 'is-user' : ''}`}>
        {isUser ? '你' : <Bot size={15} />}
      </span>
      <div className="ai-message-body">
        <div className="ai-bubble">
          {message.status === 'thinking' ? (
            <span className="ai-thinking">
              <i />
              <i />
              <i />
            </span>
          ) : (
            <span className="ai-message-text">{message.content}</span>
          )}
        </div>
        <VisionStrip message={message} />
        <PlanCard message={message} />
      </div>
    </div>
  )
}

function SettingsView({ onBack }: { onBack: () => void }) {
  const settings = useAi((state) => state.settings)
  const setSettings = useAi((state) => state.setSettings)
  const busy = useAi((state) => state.busy)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null)

  const runTest = async () => {
    if (testing) return
    setTesting(true)
    setTestResult(null)
    try {
      const content = await testLlmConnection(settings)
      setTestResult({ ok: true, text: `连接正常：${content}` })
    } catch (error) {
      setTestResult({
        ok: false,
        text: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="ai-settings">
      <div className="ai-settings-head">
        <button type="button" className="ai-back" onClick={onBack}>
          ← 返回对话
        </button>
        <span className="eyebrow">COPILOT SETTINGS</span>
      </div>
      <section>
        <h3>规划引擎</h3>
        <div className="ai-engine-choice">
          <button
            type="button"
            className={settings.mode === 'local' ? 'is-active' : ''}
            onClick={() => setSettings({ mode: 'local' })}
          >
            <Cpu size={18} />
            <span>
              <strong>内置规划器</strong>
              <small>离线可用 · 不发送任何数据</small>
            </span>
            {settings.mode === 'local' && <Check size={14} />}
          </button>
          <button
            type="button"
            className={settings.mode === 'llm' ? 'is-active' : ''}
            onClick={() => setSettings({ mode: 'llm' })}
          >
            <Cloud size={18} />
            <span>
              <strong>大语言模型</strong>
              <small>OpenAI 兼容接口 · 更强的语义理解</small>
            </span>
            {settings.mode === 'llm' && <Check size={14} />}
          </button>
        </div>
        <p className="ai-settings-note">
          内置规划器识别中文建造指令并生成编辑器动作；大模型模式会让你用自己的接口把指令和场景摘要转换为动作计划。
        </p>
      </section>

      {settings.mode === 'llm' && (
        <section className="ai-provider-section">
          <h3>接口配置</h3>
          <label className="ai-field">
            <span>Base URL</span>
            <input
              value={settings.baseUrl}
              placeholder="https://api.openai.com/v1"
              onChange={(event) => setSettings({ baseUrl: event.target.value })}
              spellCheck={false}
            />
          </label>
          <label className="ai-field">
            <span>模型</span>
            <input
              value={settings.model}
              placeholder="gpt-4o-mini"
              onChange={(event) => setSettings({ model: event.target.value })}
              spellCheck={false}
            />
          </label>
          <label className="ai-field">
            <span>API Key</span>
            <div className="ai-secret-field">
              <KeyRound size={13} />
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                placeholder="sk-…（本地模型可留空）"
                onChange={(event) => setSettings({ apiKey: event.target.value })}
                spellCheck={false}
                autoComplete="off"
              />
              <button type="button" onClick={() => setShowKey((visible) => !visible)} aria-label="显示或隐藏 API Key">
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>
          <label className="ai-field">
            <span>温度 · {settings.temperature.toFixed(2)}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(event) => setSettings({ temperature: Number(event.target.value) })}
            />
          </label>
          <button type="button" className="ai-test-button" disabled={testing || busy} onClick={runTest}>
            {testing ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
            测试连接
          </button>
          {testResult && (
            <div className={`ai-test-result ${testResult.ok ? 'is-ok' : 'is-error'}`}>
              {testResult.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              <span>{testResult.text}</span>
            </div>
          )}
          <p className="ai-settings-note is-warning">
            云端模式会把当前场景摘要、组件库清单和你的指令发送到你配置的接口。API Key 只保存在本机 localStorage，不会写入项目文件。支持 OpenAI 兼容的 /v1/chat/completions 接口，也可填 Ollama 等本地地址。
          </p>
        </section>
      )}

      <section>
        <h3>行为</h3>
        <button
          type="button"
          className={`ai-setting-toggle ${settings.autoExecute ? 'is-on' : ''}`}
          onClick={() => setSettings({ autoExecute: !settings.autoExecute })}
        >
          <span>
            <strong>生成后自动执行</strong>
            <small>关闭后每次计划都需要手动点击执行</small>
          </span>
          <span className="switch">
            <span className="switch-knob" />
          </span>
        </button>
      </section>

      <section>
        <h3>场景视觉</h3>
        <div className="ai-vision-choice">
          {(
            [
              { id: 'off', label: '关闭' },
              { id: 'current', label: '当前视角' },
              { id: 'multi', label: '多角度' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              className={settings.vision === option.id ? 'is-active' : ''}
              onClick={() => setSettings({ vision: option.id })}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="ai-settings-note">
          开启后，大模型模式会在每次指令前截取实时画面一起发送，并在执行完成后附上结果快照。「多角度」会同时发送总览、俯视和东南西北六个视角。截图只发给你自己配置的模型接口。
        </p>
      </section>
    </div>
  )
}

export function AiDrawer() {
  const open = useAi((state) => state.open)
  const setOpen = useAi((state) => state.setOpen)
  const settings = useAi((state) => state.settings)
  const messages = useAi((state) => state.messages)
  const busy = useAi((state) => state.busy)
  const clearMessages = useAi((state) => state.clearMessages)
  const setSettings = useAi((state) => state.setSettings)
  const [view, setView] = useState<'chat' | 'settings' | 'mcp'>('chat')
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        useAi.getState().setOpen(!useAi.getState().open)
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && useAi.getState().open) {
        const target = event.target
        const editingText =
          (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) &&
          target.value.length > 0
        if (!editingText) {
          event.preventDefault()
          event.stopPropagation()
          const editor = useEditor.getState()
          if (event.shiftKey) editor.redo()
          else editor.undo()
        }
      }
      if (event.key === 'Escape' && useAi.getState().open) {
        const target = event.target
        if (target instanceof HTMLElement && target.closest('.modal-backdrop')) return
        event.stopPropagation()
        useAi.getState().setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [])

  useEffect(() => {
    if (open && view === 'chat') {
      window.setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open, view])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  if (!open) return null

  const send = async (text?: string) => {
    const value = (text ?? input).trim()
    if (!value || busy) return
    setInput('')
    await sendAiMessage(value)
  }

  const runSuggestion = (suggestion: string) => {
    if (busy) return
    setView('chat')
    void send(suggestion)
  }

  return (
    <aside className="ai-drawer" data-ui-scope="ai-drawer">
      <div className="ai-header">
        <span className="ai-header-icon">
          <Sparkles size={18} />
        </span>
        <div className="ai-title">
          <span className="eyebrow">CIVITAS COPILOT</span>
          <h2>AI 场景操作员</h2>
        </div>
        <span className={`ai-mode-pill ${settings.mode === 'llm' ? 'is-llm' : ''}`}>
          {settings.mode === 'llm' ? <Cloud size={11} /> : <Cpu size={11} />}
          {settings.mode === 'llm' ? settings.model || 'LLM' : '内置'}
        </span>
        <div className="ai-head-actions">
          <button
            type="button"
            className={view === 'mcp' ? 'is-active' : ''}
            title="MCP / 外部 Agent 接入"
            onClick={() => setView((current) => (current === 'mcp' ? 'chat' : 'mcp'))}
          >
            <Plug size={15} />
          </button>
          <button
            type="button"
            className={view === 'settings' ? 'is-active' : ''}
            title="AI 设置"
            onClick={() => setView((current) => (current === 'settings' ? 'chat' : 'settings'))}
          >
            <Settings2 size={15} />
          </button>
          <button type="button" title="关闭 (Esc)" data-automation-id="ai-close" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      {view === 'settings' ? (
        <SettingsView onBack={() => setView('chat')} />
      ) : view === 'mcp' ? (
        <McpPanel onBack={() => setView('chat')} />
      ) : (
        <>
          <div className="ai-chat-scroll" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="ai-welcome">
                <span className="ai-welcome-orb">
                  <Bot size={22} />
                </span>
                <span className="eyebrow">NATURAL LANGUAGE → SCENE ACTIONS</span>
                <h3>直接告诉我，你想建什么</h3>
                <p>
                  我会搜索空地、生成建筑与家具、绘制曲线道路和水系，并通过受控的编辑器动作完成。
                  不做任意代码执行，所有修改都能用 Ctrl+Z 一步撤销。
                </p>
                <div className="ai-suggestions">
                  {SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => runSuggestion(suggestion)}>
                      <ArrowUp size={12} />
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="ai-welcome-note">
                  <Sparkles size={13} />
                  场景已就绪，AI 会在当前视野附近寻找空隙建造。外部 Agent 可通过右上角插头接入 MCP / HTTP API。
                </div>
              </div>
            ) : (
              <div className="ai-messages">
                {messages.map((message) => (
                  <ChatMessageView key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>

          <div className="ai-composer">
            <div className="ai-input-wrap">
              <textarea
                ref={inputRef}
                rows={2}
                placeholder="例如：建一栋 16×9 米带泳池的别墅，再把周围种上树…"
                value={input}
                disabled={busy}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void send()
                  }
                }}
              />
              <button
                type="button"
                className="ai-send"
                disabled={busy || !input.trim()}
                onClick={() => void send()}
                title="发送 (Enter)"
              >
                {busy ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
              </button>
            </div>
            <div className="ai-composer-foot">
              <button
                type="button"
                className={`ai-auto-toggle ${settings.autoExecute ? 'is-on' : ''}`}
                onClick={() => setSettings({ autoExecute: !settings.autoExecute })}
                title="切换生成后自动执行"
              >
                <span className="status-indicator" />
                {settings.autoExecute ? '自动执行' : '执行前确认'}
              </button>
              <span className={`ai-vision-pill ${settings.vision === 'off' ? 'is-off' : ''}`} title="在 AI 设置中调整场景视觉">
                <Eye size={11} />
                {settings.vision === 'off' ? '无视觉' : settings.vision === 'multi' ? '多角度视觉' : '当前视角视觉'}
              </span>
              <span className="ai-shortcut">Enter 发送 · Shift+Enter 换行</span>
              {messages.length > 0 && (
                <button
                  type="button"
                  className="ai-clear"
                  title="清除对话记录"
                  onClick={() => {
                    if (window.confirm('清除当前 AI 对话记录？场景不会被修改。')) clearMessages()
                  }}
                >
                  <Trash2 size={12} /> 清空
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
