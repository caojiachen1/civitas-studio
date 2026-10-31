import { getEditorScene } from './engineRef'
import type { SceneCaptureOptions } from './engine'

export type Vec3Tuple = [number, number, number]

export interface SceneShot {
  label: string
  mime: string
  data: string
  width: number
  height: number
  eye: Vec3Tuple
  target: Vec3Tuple
}

export interface CaptureFocus {
  center: Vec3Tuple
  radius: number
  source: 'entity' | 'point' | 'scene' | 'camera'
}

export interface CaptureRequest {
  id?: string
  x?: number
  y?: number
  z?: number
  views?: string[]
  ring?: number
  distance?: number
  elevation?: number
  maxSize?: number
  clean?: boolean
  includeCurrent?: boolean
}

const VIEW_ORDER = [
  'overview',
  'top',
  'north',
  'east',
  'south',
  'west',
  'northeast',
  'southeast',
  'southwest',
  'northwest',
] as const

export type CaptureViewName = (typeof VIEW_ORDER)[number] | 'current'

export function isCaptureViewName(value: string): value is CaptureViewName {
  return value === 'current' || (VIEW_ORDER as readonly string[]).includes(value)
}

export function captureViewNames(): CaptureViewName[] {
  return ['current', ...VIEW_ORDER]
}

export function settleScene(frames = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = Math.max(0, frames)
    const step = () => {
      if (remaining <= 0) {
        resolve()
        return
      }
      remaining--
      window.requestAnimationFrame(step)
    }
    step()
  })
}

export function resolveCaptureFocus(request: CaptureRequest): CaptureFocus {
  const scene = getEditorScene()
  if (request.id) {
    const bounds = scene?.getEntityBounds(request.id)
    if (!bounds) throw new Error(`未找到构件 ${request.id} 的可见几何。`)
    return {
      center: bounds.center,
      radius: Math.max(1.2, Math.hypot(...bounds.size) / 2),
      source: 'entity',
    }
  }
  if (
    typeof request.x === 'number' &&
    Number.isFinite(request.x) &&
    typeof request.z === 'number' &&
    Number.isFinite(request.z)
  ) {
    return {
      center: [request.x, request.y ?? 1.6, request.z],
      radius: 8,
      source: 'point',
    }
  }
  const bounds = scene?.getSceneBounds()
  if (bounds) {
    return {
      center: bounds.center,
      radius: Math.max(2, Math.hypot(...bounds.size) / 2),
      source: 'scene',
    }
  }
  const target = scene?.getView().target ?? [0, 0.5, 0]
  return { center: [target[0], target[1], target[2]], radius: 8, source: 'camera' }
}

function defaultDistance(focus: CaptureFocus): number {
  return Math.min(200, Math.max(5, focus.radius * 2.5))
}

function polarPosition(
  center: Vec3Tuple,
  distance: number,
  azimuthDeg: number,
  elevationDeg: number,
): Vec3Tuple {
  const azimuth = (azimuthDeg * Math.PI) / 180
  const elevation = (Math.max(4, Math.min(86, elevationDeg)) * Math.PI) / 180
  const horizontal = Math.cos(elevation) * distance
  return [
    center[0] + Math.sin(azimuth) * horizontal,
    center[1] + Math.sin(elevation) * distance,
    center[2] + Math.cos(azimuth) * horizontal,
  ]
}

function presetEye(
  name: Exclude<CaptureViewName, 'current'>,
  center: Vec3Tuple,
  distance: number,
): Vec3Tuple {
  if (name === 'top') {
    return [center[0], center[1] + distance * 1.15, center[2] + 0.01]
  }
  if (name === 'overview') {
    return polarPosition(center, distance, 45, 34)
  }
  const azimuth: Record<string, number> = {
    north: 0,
    east: 90,
    south: 180,
    west: 270,
    northeast: 45,
    southeast: 135,
    southwest: 225,
    northwest: 315,
  }
  return polarPosition(center, distance, azimuth[name] ?? 0, 16)
}

function shotLabel(name: string) {
  const labels: Record<string, string> = {
    current: 'current',
    overview: 'overview',
    top: 'top',
    north: 'north',
    east: 'east',
    south: 'south',
    west: 'west',
    northeast: 'northeast',
    southeast: 'southeast',
    southwest: 'southwest',
    northwest: 'northwest',
  }
  return labels[name] ?? name
}

function captureAt(
  label: string,
  options: SceneCaptureOptions,
  eye: Vec3Tuple,
  target: Vec3Tuple,
): SceneShot {
  const scene = getEditorScene()
  if (!scene) throw new Error('场景尚未就绪。')
  const image = scene.capture(options)
  return {
    label,
    mime: image.mime,
    data: image.base64,
    width: image.width,
    height: image.height,
    eye,
    target,
  }
}

export async function captureViews(request: CaptureRequest = {}): Promise<{
  shots: SceneShot[]
  focus: CaptureFocus
}> {
  const scene = getEditorScene()
  if (!scene) throw new Error('场景尚未就绪。')
  await settleScene()
  const focus = resolveCaptureFocus(request)
  const distance = Math.max(1.6, Math.min(220, request.distance ?? defaultDistance(focus)))
  const maxSize = Math.max(96, Math.min(4096, request.maxSize ?? 1024))
  const clean = request.clean ?? true
  const names = (request.views ?? []).filter(isCaptureViewName)
  const ring = Math.max(0, Math.min(16, Math.round(request.ring ?? 0)))
  const shots: SceneShot[] = []
  const labels = new Set<string>()
  const camera = scene.getCameraPosition()

  const push = (shot: SceneShot) => {
    if (labels.has(shot.label)) return
    labels.add(shot.label)
    shots.push(shot)
  }

  if (request.includeCurrent || names.includes('current')) {
    push(
      captureAt('current', { maxSize, clean, format: 'jpeg' }, camera, [
        focus.center[0],
        focus.center[1],
        focus.center[2],
      ]),
    )
  }

  for (const name of names) {
    if (name === 'current') continue
    const eye = presetEye(name, focus.center, distance)
    push(captureAt(shotLabel(name), { eye, target: focus.center, maxSize, clean }, eye, focus.center))
  }

  if (ring > 0) {
    const elevation = request.elevation ?? 30
    for (let index = 0; index < ring; index++) {
      const azimuth = (index / ring) * 360
      const eye = polarPosition(focus.center, distance, azimuth, elevation)
      push(
        captureAt(
          `ring-${Math.round(azimuth)}`,
          { eye, target: focus.center, maxSize, clean },
          eye,
          focus.center,
        ),
      )
    }
  }

  if (shots.length === 0) {
    push(
      captureAt('current', { maxSize, clean, format: 'jpeg' }, camera, [
        focus.center[0],
        focus.center[1],
        focus.center[2],
      ]),
    )
    const eye = presetEye('overview', focus.center, distance)
    push(captureAt('overview', { eye, target: focus.center, maxSize, clean }, eye, focus.center))
  }

  return { shots, focus }
}

export async function captureVisionImages(
  mode: 'off' | 'current' | 'multi',
  maxSize = 720,
  target?: { id?: string; x?: number; y?: number; z?: number },
): Promise<{ dataUrl: string; label: string }[]> {
  if (mode === 'off') return []
  const views =
    mode === 'current'
      ? ['current']
      : ['current', 'overview', 'top', 'north', 'east', 'south', 'west']
  const { shots } = await captureViews({
    ...target,
    views,
    maxSize,
    clean: true,
    includeCurrent: mode === 'current',
  })
  return shots.map((shot) => ({
    dataUrl: `data:${shot.mime};base64,${shot.data}`,
    label: shot.label,
  }))
}
