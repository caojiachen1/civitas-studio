import type { DoorHinge, PathType, RoofFinish, RoofStyle, SlabStyle, Vec2 } from '../editor/types'
import { MODEL_MAP } from '../models/registry'

export type AiMode = 'local' | 'llm'
export type AiVisionMode = 'off' | 'current' | 'multi'

export interface AiVisionShot {
  dataUrl: string
  label: string
}

export type AiRoomType =
  | 'living'
  | 'bedroom'
  | 'kitchen'
  | 'dining'
  | 'bathroom'
  | 'office'
  | 'generic'

export type AiAction =
  | {
      type: 'build_villa'
      centerX?: number
      centerZ?: number
      width?: number
      depth?: number
      withPool?: boolean
      withGarden?: boolean
      withCarport?: boolean
    }
  | {
      type: 'build_room'
      roomType?: AiRoomType
      centerX?: number
      centerZ?: number
      width?: number
      depth?: number
      roof?: boolean
      furnish?: boolean
    }
  | {
      type: 'furnish_room'
      roomType?: AiRoomType
      centerX?: number
      centerZ?: number
      width?: number
      depth?: number
    }
  | { type: 'place_model'; modelId: string; x?: number; z?: number; rot?: number; scale?: number }
  | {
      type: 'add_wall'
      id?: string
      a: Vec2
      b: Vec2
      height?: number
      thickness?: number
      color?: string
      levelId?: string
    }
  | {
      type: 'add_opening'
      wallId: string
      openingType: 'door' | 'window'
      style?: string
      offset?: number
      width?: number
      height?: number
      sill?: number
      openAngle?: number
      hinge?: DoorHinge
    }
  | {
      type: 'add_slab'
      x: number
      z: number
      width?: number
      depth?: number
      rot?: number
      thickness?: number
      style?: SlabStyle
      levelId?: string
      holes?: { x: number; z: number; w: number; d: number; rot?: number }[]
    }
  | {
      type: 'draw_path'
      pathType: PathType
      points?: Vec2[]
      width?: number
      closed?: boolean
      style?: string
      sidewalk?: boolean
      lanes?: number
      bridgeHeight?: number
      railings?: boolean
      length?: number
      curve?: number
      centerX?: number
      centerZ?: number
    }
  | { type: 'add_pond'; centerX?: number; centerZ?: number; radius?: number }
  | {
      type: 'add_roof'
      x?: number
      z?: number
      style?: RoofStyle
      finish?: RoofFinish
      pitch?: number
    }
  | { type: 'add_vegetation'; centerX?: number; centerZ?: number; radius?: number; count?: number }
  | { type: 'add_level' }
  | { type: 'set_active_level'; index?: number }
  | {
      type: 'modify_selected'
      rotateByDeg?: number
      color?: string
      x?: number
      z?: number
      scale?: number
      height?: number
      width?: number
      depth?: number
      pitch?: number
      finish?: RoofFinish
      openAngle?: number
      hinge?: 'left' | 'right'
    }
  | { type: 'delete_selected' }
  | { type: 'clear_level' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'focus_all' }

export interface AiActionPlan {
  reply: string
  actions: AiAction[]
  mode: AiMode
  warnings?: string[]
}

export type AiMessageStatus = 'thinking' | 'ready' | 'executing' | 'executed' | 'failed' | 'cancelled' | 'info'

export interface AiExecutionResult {
  ok: boolean
  summary: string
  warnings: string[]
  created: number
  focusIds: string[]
  error?: string
}

export interface AiChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  plan?: AiActionPlan
  status?: AiMessageStatus
  result?: AiExecutionResult
  images?: AiVisionShot[]
  snapshot?: AiVisionShot
}

export interface AiSettings {
  mode: AiMode
  baseUrl: string
  apiKey: string
  model: string
  temperature: number
  autoExecute: boolean
  vision: AiVisionMode
}

export interface AiRoomContext {
  centerX: number
  centerZ: number
  width: number
  depth: number
  rot: number
  area: number
}

export interface AiSceneContext {
  projectName: string
  activeLevel: { id: string; name: string; elevation: number }
  levels: { name: string; elevation: number; active: boolean; entities: number }[]
  counts: Record<string, number>
  selected: null | {
    kind: string
    name: string
    x?: number
    z?: number
    rot?: number
    modelId?: string
  }
  cameraTarget: Vec2
  rooms: AiRoomContext[]
}

export const ROOM_TYPE_LABELS: Record<AiRoomType, string> = {
  living: '客厅',
  bedroom: '卧室',
  kitchen: '厨房',
  dining: '餐厅',
  bathroom: '卫生间',
  office: '书房',
  generic: '房间',
}

export const DESTRUCTIVE_ACTIONS = new Set<AiAction['type']>(['clear_level'])

export function actionLabel(action: AiAction): string {
  switch (action.type) {
    case 'build_villa':
      return `建造别墅 ${action.width ?? 16} × ${action.depth ?? 9} m`
    case 'build_room':
      return `建造并布置${ROOM_TYPE_LABELS[action.roomType ?? 'generic']}`
    case 'furnish_room':
      return `布置${ROOM_TYPE_LABELS[action.roomType ?? 'living']}`
    case 'place_model':
      return `放置「${MODEL_MAP.get(action.modelId)?.name ?? action.modelId}」`
    case 'add_wall':
      return `绘制墙体（${Math.hypot(action.b[0] - action.a[0], action.b[1] - action.a[1]).toFixed(1)} m）`
    case 'add_opening':
      return action.openingType === 'door' ? '在墙上开门' : '在墙上开窗'
    case 'add_slab':
      return `绘制楼板 ${action.width ?? 6} × ${action.depth ?? 4} m`
    case 'draw_path': {
      const labels: Record<string, string> = {
        road: '道路',
        river: '河流',
        bridge: '桥梁',
        footpath: '步道',
        fence: '围栏',
      }
      return `绘制${labels[action.pathType] ?? action.pathType}`
    }
    case 'add_pond':
      return '开挖池塘'
    case 'add_roof':
      return '生成屋顶'
    case 'add_vegetation':
      return `种植 ${action.count ?? 6} 株植被`
    case 'add_level':
      return '新增楼层'
    case 'set_active_level':
      return `切换至第 ${(action.index ?? 0) + 1} 层`
    case 'modify_selected':
      if (action.openAngle !== undefined) {
        return action.openAngle === 0 ? '关闭选中的门' : `把门打开到 ${action.openAngle}°`
      }
      return '修改选中构件'
    case 'delete_selected':
      return '删除选中构件'
    case 'clear_level':
      return '清空当前楼层'
    case 'undo':
      return '撤销'
    case 'redo':
      return '重做'
    case 'focus_all':
      return '全览场景'
  }
}
