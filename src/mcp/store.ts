import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { isTauriHost } from '../editor/platform'
import { startMcpBridge } from './bridge'

export interface McpCallLog {
  timestamp: number
  tool: string
  ok: boolean
  durationMs: number
  error?: string | null
}

export interface McpStatus {
  running: boolean
  port: number
  tokenRequired: boolean
  log: McpCallLog[]
}

export interface McpSettings {
  port: number
  token: string
  autoStart: boolean
}

interface McpStore {
  available: boolean
  settings: McpSettings
  status: McpStatus
  busy: boolean
  lastError: string
  setSettings: (patch: Partial<McpSettings>) => void
  refresh: () => Promise<void>
  start: () => Promise<void>
  stop: () => Promise<void>
}

const SETTINGS_KEY = 'civitas-studio:mcp-settings:v1'

const defaults: McpSettings = { port: 8971, token: '', autoStart: true }

function readSettings(): McpSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<McpSettings>
    return {
      port: Number.isFinite(parsed.port) ? Number(parsed.port) : defaults.port,
      token: typeof parsed.token === 'string' ? parsed.token : defaults.token,
      autoStart: typeof parsed.autoStart === 'boolean' ? parsed.autoStart : defaults.autoStart,
    }
  } catch {
    return defaults
  }
}

function persist(settings: McpSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // storage unavailable
  }
}

export const useMcp = create<McpStore>()((set, get) => ({
  available: isTauriHost(),
  settings: readSettings(),
  status: { running: false, port: 0, tokenRequired: false, log: [] },
  busy: false,
  lastError: '',
  setSettings: (patch) =>
    set((state) => {
      const settings = { ...state.settings, ...patch }
      persist(settings)
      return { settings }
    }),
  refresh: async () => {
    if (!isTauriHost()) return
    try {
      const status = await invoke<McpStatus>('mcp_status')
      set({ status })
    } catch (error) {
      set({ lastError: error instanceof Error ? error.message : String(error) })
    }
  },
  start: async () => {
    if (!isTauriHost()) {
      set({ lastError: 'MCP 服务只在桌面应用中可用。' })
      return
    }
    if (get().busy) return
    set({ busy: true, lastError: '' })
    try {
      const { port, token } = get().settings
      const status = await invoke<McpStatus>('mcp_start', { port, token })
      set({ status })
    } catch (error) {
      set({ lastError: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ busy: false })
    }
  },
  stop: async () => {
    if (!isTauriHost()) return
    if (get().busy) return
    set({ busy: true })
    try {
      const status = await invoke<McpStatus>('mcp_stop')
      set({ status })
    } catch (error) {
      set({ lastError: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ busy: false })
    }
  },
}))

let initialized = false

export async function initMcp() {
  if (!isTauriHost() || initialized) return
  initialized = true
  await startMcpBridge()
  const store = useMcp.getState()
  await store.refresh()
  if (useMcp.getState().settings.autoStart && !useMcp.getState().status.running) {
    await useMcp.getState().start()
  }
}
