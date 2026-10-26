import { MODEL_MAP } from '../models/registry'
import type { PathType, RoofFinish, RoofStyle, Vec2 } from '../editor/types'
import type { AiAction, AiActionPlan, AiMode, AiRoomType } from './types'

const ROOM_TYPES = new Set<AiRoomType>([
  'living',
  'bedroom',
  'kitchen',
  'dining',
  'bathroom',
  'office',
  'generic',
])
const PATH_TYPES = new Set<PathType>(['road', 'river', 'bridge', 'footpath', 'fence'])
const ROOF_STYLES = new Set<RoofStyle>(['gable', 'hip', 'flat', 'shed'])
const ROOF_FINISHES = new Set<RoofFinish>(['terracotta', 'slate', 'charcoal', 'copper', 'shingle'])

function number(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback
}

function optionalNumber(value: unknown, min: number, max: number): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : undefined
}

function optionalBool(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function points(value: unknown): Vec2[] | undefined {
  if (!Array.isArray(value)) return undefined
  const result: Vec2[] = []
  for (const entry of value.slice(0, 24)) {
    if (!Array.isArray(entry) || entry.length < 2) continue
    const x = Number(entry[0])
    const z = Number(entry[1])
    if (!Number.isFinite(x) || !Number.isFinite(z)) continue
    result.push([Math.min(270, Math.max(-270, x)), Math.min(270, Math.max(-270, z))])
  }
  return result.length >= 2 ? result : undefined
}

function normalizeAction(raw: unknown, warnings: string[]): AiAction | null {
  if (!raw || typeof raw !== 'object') return null
  const input = raw as Record<string, unknown>
  const type = typeof input.type === 'string' ? input.type : ''
  switch (type) {
    case 'build_villa':
      return {
        type,
        centerX: optionalNumber(input.centerX, -260, 260),
        centerZ: optionalNumber(input.centerZ, -260, 260),
        width: number(input.width, 16, 10, 30),
        depth: number(input.depth, 9, 6, 18),
        withPool: optionalBool(input.withPool) ?? false,
        withGarden: optionalBool(input.withGarden) ?? false,
        withCarport: optionalBool(input.withCarport) ?? false,
      }
    case 'build_room': {
      const roomType = ROOM_TYPES.has(input.roomType as AiRoomType)
        ? (input.roomType as AiRoomType)
        : 'generic'
      return {
        type,
        roomType,
        centerX: optionalNumber(input.centerX, -260, 260),
        centerZ: optionalNumber(input.centerZ, -260, 260),
        width: optionalNumber(input.width, 2.4, 22),
        depth: optionalNumber(input.depth, 2.4, 22),
        roof: optionalBool(input.roof) ?? true,
        furnish: optionalBool(input.furnish) ?? true,
      }
    }
    case 'furnish_room':
      return {
        type,
        roomType: ROOM_TYPES.has(input.roomType as AiRoomType)
          ? (input.roomType as AiRoomType)
          : undefined,
        centerX: optionalNumber(input.centerX, -260, 260),
        centerZ: optionalNumber(input.centerZ, -260, 260),
      }
    case 'place_model': {
      const modelId = typeof input.modelId === 'string' ? input.modelId : ''
      if (!MODEL_MAP.has(modelId)) {
        warnings.push(`忽略未知模型 ${modelId || '(空)'}`)
        return null
      }
      return {
        type,
        modelId,
        x: optionalNumber(input.x, -270, 270),
        z: optionalNumber(input.z, -270, 270),
        rot: optionalNumber(input.rot, -Math.PI * 20, Math.PI * 20),
        scale: optionalNumber(input.scale, 0.2, 8),
      }
    }
    case 'draw_path': {
      const pathType = PATH_TYPES.has(input.pathType as PathType)
        ? (input.pathType as PathType)
        : null
      if (!pathType) return null
      return {
        type,
        pathType,
        points: points(input.points),
        width: optionalNumber(input.width, 0.1, 40),
        closed: optionalBool(input.closed),
        style: typeof input.style === 'string' ? input.style.slice(0, 30) : undefined,
        sidewalk: optionalBool(input.sidewalk),
        lanes: input.lanes === 4 ? 4 : input.lanes === 2 ? 2 : undefined,
        bridgeHeight: optionalNumber(input.bridgeHeight, 0.8, 20),
        railings: optionalBool(input.railings),
        length: optionalNumber(input.length, 4, 90),
        curve: optionalNumber(input.curve, -20, 20),
        centerX: optionalNumber(input.centerX, -260, 260),
        centerZ: optionalNumber(input.centerZ, -260, 260),
      }
    }
    case 'add_pond':
      return {
        type,
        centerX: optionalNumber(input.centerX, -260, 260),
        centerZ: optionalNumber(input.centerZ, -260, 260),
        radius: optionalNumber(input.radius, 3, 32),
      }
    case 'add_roof':
      return {
        type,
        x: optionalNumber(input.x, -270, 270),
        z: optionalNumber(input.z, -270, 270),
        style: ROOF_STYLES.has(input.style as RoofStyle) ? (input.style as RoofStyle) : undefined,
        finish: ROOF_FINISHES.has(input.finish as RoofFinish)
          ? (input.finish as RoofFinish)
          : undefined,
        pitch: optionalNumber(input.pitch, 0, 65),
      }
    case 'add_vegetation':
      return {
        type,
        centerX: optionalNumber(input.centerX, -260, 260),
        centerZ: optionalNumber(input.centerZ, -260, 260),
        radius: optionalNumber(input.radius, 4, 45),
        count: optionalNumber(input.count, 1, 20),
      }
    case 'add_level':
      return { type }
    case 'set_active_level': {
      const index = optionalNumber(input.index, 0, 20)
      return { type, index: index === undefined ? undefined : Math.max(0, Math.round(index)) }
    }
    case 'modify_selected':
      return {
        type,
        rotateByDeg: optionalNumber(input.rotateByDeg, -720, 720),
        color: typeof input.color === 'string' ? input.color.slice(0, 20) : undefined,
        x: optionalNumber(input.x, -270, 270),
        z: optionalNumber(input.z, -270, 270),
        scale: optionalNumber(input.scale, 0.2, 8),
        height: optionalNumber(input.height, 0.6, 8),
        width: optionalNumber(input.width, 0.4, 120),
        depth: optionalNumber(input.depth, 0.4, 120),
        pitch: optionalNumber(input.pitch, 0, 65),
        finish: ROOF_FINISHES.has(input.finish as RoofFinish)
          ? (input.finish as RoofFinish)
          : undefined,
        openAngle: optionalNumber(input.openAngle, -135, 135),
        hinge: input.hinge === 'left' || input.hinge === 'right' ? input.hinge : undefined,
      }
    case 'delete_selected':
      return { type }
    case 'clear_level':
      return { type }
    case 'undo':
      return { type }
    case 'redo':
      return { type }
    case 'focus_all':
      return { type }
    default:
      if (type) warnings.push(`忽略未知动作 ${type}`)
      return null
  }
}

function extractJson(text: string): string | null {
  const start = text.indexOf('{')
  if (start < 0) return null
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
    } else if (ch === '"') {
      inString = true
    } else if (ch === '{') {
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return null
}

export function parsePlanContent(content: string, mode: AiMode): AiActionPlan {
  const trimmed = content.trim()
  const jsonText = extractJson(trimmed)
  if (!jsonText) {
    return { reply: trimmed || '模型没有返回内容。', actions: [], mode }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    return { reply: trimmed, actions: [], mode }
  }
  if (!parsed || typeof parsed !== 'object') {
    return { reply: trimmed, actions: [], mode }
  }
  const root = parsed as Record<string, unknown>
  const reply =
    typeof root.reply === 'string'
      ? root.reply
      : typeof root.message === 'string'
        ? root.message
        : '已完成计划。'
  const rawActions = Array.isArray(root.actions)
    ? root.actions
    : Array.isArray(root.plan)
      ? root.plan
      : []
  const warnings: string[] = []
  const actions: AiAction[] = []
  for (const raw of rawActions.slice(0, 24)) {
    const action = normalizeAction(raw, warnings)
    if (action) actions.push(action)
  }
  return { reply, actions, mode, warnings }
}
