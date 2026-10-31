import { create } from 'zustand'
import type { AiChatMessage, AiSettings } from './types'

const SETTINGS_KEY = 'civitas-studio:ai-settings:v1'

const defaults: AiSettings = {
  mode: 'local',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.3,
  autoExecute: true,
  vision: 'current',
}

function readSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<AiSettings>
    return {
      ...defaults,
      ...parsed,
      mode: parsed.mode === 'llm' ? 'llm' : 'local',
      temperature: typeof parsed.temperature === 'number' ? parsed.temperature : defaults.temperature,
      vision:
        parsed.vision === 'off' || parsed.vision === 'multi' || parsed.vision === 'current'
          ? parsed.vision
          : defaults.vision,
    }
  } catch {
    return defaults
  }
}

function persistSettings(settings: AiSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // private mode / storage full
  }
}

interface AiState {
  open: boolean
  settings: AiSettings
  messages: AiChatMessage[]
  busy: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  setSettings: (patch: Partial<AiSettings>) => void
  addMessage: (message: AiChatMessage) => void
  patchMessage: (id: string, patch: Partial<AiChatMessage>) => void
  clearMessages: () => void
  setBusy: (busy: boolean) => void
}

export const useAi = create<AiState>()((set) => ({
  open: false,
  settings: readSettings(),
  messages: [],
  busy: false,
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  setSettings: (patch) =>
    set((state) => {
      const settings = { ...state.settings, ...patch }
      persistSettings(settings)
      return { settings }
    }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  patchMessage: (id, patch) =>
    set((state) => ({
      messages: state.messages.map((message) => (message.id === id ? { ...message, ...patch } : message)),
    })),
  clearMessages: () => set({ messages: [] }),
  setBusy: (busy) => set({ busy }),
}))
