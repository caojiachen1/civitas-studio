import { create } from 'zustand'
import type { Vec3 } from './types'

export interface Toast {
  id: number
  message: string
  tone: 'info' | 'success' | 'warn' | 'error'
}

export interface PerfStats {
  fps: number
  drawCalls: number
  triangles: number
  objects: number
  quality?: 'high' | 'balanced' | 'low'
}

interface RuntimeState {
  hint: string
  snapLabel: string
  invalidReason: string
  cursor: Vec3 | null
  perf: PerfStats
  toasts: Toast[]
  helpOpen: boolean
  setHint: (hint: string, snapLabel?: string, invalidReason?: string) => void
  setCursor: (cursor: Vec3 | null) => void
  setPerf: (perf: PerfStats) => void
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  setHelpOpen: (open: boolean) => void
}

let toastId = 1

export const useRuntime = create<RuntimeState>()((set) => ({
  hint: '选择工具开始建造，或从左侧组件库挑选家具',
  snapLabel: '',
  invalidReason: '',
  cursor: null,
  perf: { fps: 0, drawCalls: 0, triangles: 0, objects: 0, quality: 'balanced' },
  toasts: [],
  helpOpen: false,
  setHint: (hint, snapLabel = '', invalidReason = '') =>
    set((s) =>
      s.hint === hint && s.snapLabel === snapLabel && s.invalidReason === invalidReason
        ? s
        : { hint, snapLabel, invalidReason },
    ),
  setCursor: (cursor) => set({ cursor }),
  setPerf: (perf) => set({ perf }),
  toast: (message, tone = 'info') => {
    const id = toastId++
    set((s) => ({ toasts: [...s.toasts.slice(-3), { id, message, tone }] }))
    window.setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3800)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setHelpOpen: (helpOpen) => set({ helpOpen }),
}))
