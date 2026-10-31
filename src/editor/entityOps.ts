import { useEditor, uid } from './store'
import {
  DOOR_STYLES,
  SLAB_STYLES,
  WINDOW_STYLES,
  type DoorHinge,
  type OpeningEntity,
  type SlabEntity,
  type SlabStyle,
  type Vec2,
  type WallEntity,
} from './types'
import { checkOpeningPlacement, checkWallPlacement } from './validation'
import { resolveColor } from './colors'

export interface WallInput {
  id?: string
  a: Vec2
  b: Vec2
  height?: number
  thickness?: number
  color?: string
  levelId?: string
}

export interface OpeningInput {
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

export interface SlabInput {
  x: number
  z: number
  width?: number
  depth?: number
  rot?: number
  thickness?: number
  style?: string
  levelId?: string
}

function clampNumber(value: number | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

export function createWallEntity(input: WallInput): WallEntity {
  const state = useEditor.getState()
  const levelId =
    input.levelId && state.doc.levels.some((level) => level.id === input.levelId)
      ? input.levelId
      : state.doc.activeLevelId
  const height = clampNumber(input.height, state.toolOptions.wall.height, 0.6, 8)
  const thickness = clampNumber(input.thickness, state.toolOptions.wall.thickness, 0.06, 0.6)
  const color = input.color === undefined ? state.toolOptions.wall.color : resolveColor(input.color)
  if (!color) throw new Error(`无法识别的墙体颜色：${input.color}`)
  const id = input.id?.trim() || uid('wall')
  if (state.doc.entities[id]) throw new Error(`墙体 id 已存在：${id}`)
  const check = checkWallPlacement(
    input.a,
    input.b,
    thickness,
    levelId,
    Object.values(state.doc.entities),
  )
  if (!check.valid) throw new Error(check.reason)
  return {
    id,
    kind: 'wall',
    levelId,
    a: input.a,
    b: input.b,
    height,
    thickness,
    color,
  }
}

export function createOpeningEntity(input: OpeningInput): OpeningEntity {
  const state = useEditor.getState()
  const wall = state.doc.entities[input.wallId]
  if (!wall || wall.kind !== 'wall') throw new Error('未找到 wallId 对应的墙体。')
  const styles = input.openingType === 'door' ? DOOR_STYLES : WINDOW_STYLES
  const style =
    input.style === undefined ? null : styles.find((item) => item.id === input.style) ?? null
  if (input.style !== undefined && !style) throw new Error(`未知门窗样式：${input.style}`)
  const base = style ?? styles[0]
  const width = clampNumber(input.width, base.width, 0.3, 8)
  const height = clampNumber(input.height, base.height, 0.3, 4)
  const sill =
    input.openingType === 'window'
      ? clampNumber(input.sill, (base as { sill: number }).sill, 0, 3)
      : 0
  const wallLength = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
  const offset =
    input.offset === undefined
      ? Math.min(wallLength - width / 2 - 0.1, Math.max(width / 2 + 0.1, wallLength / 2))
      : clampNumber(input.offset, wallLength / 2, 0.1, wallLength - 0.1)
  const check = checkOpeningPlacement(
    wall,
    offset,
    width,
    height,
    sill,
    Object.values(state.doc.entities),
  )
  if (!check.valid) throw new Error(check.reason)
  const opening: OpeningEntity = {
    id: uid('opening'),
    kind: 'opening',
    type: input.openingType,
    wallId: wall.id,
    offset,
    width,
    height,
    sill,
    style: base.id,
  }
  if (input.openingType === 'door') {
    opening.openAngle = clampNumber(input.openAngle, 0, -135, 135)
    opening.hinge = input.hinge === 'right' ? 'right' : 'left'
  }
  return opening
}

export function createSlabEntity(input: SlabInput): SlabEntity {
  const state = useEditor.getState()
  const levelId =
    input.levelId && state.doc.levels.some((level) => level.id === input.levelId)
      ? input.levelId
      : state.doc.activeLevelId
  const style = input.style ?? 'wood'
  if (!SLAB_STYLES.some((item) => item.id === style)) throw new Error(`未知楼板材质：${style}`)
  return {
    id: uid('slab'),
    kind: 'slab',
    levelId,
    x: input.x,
    z: input.z,
    w: clampNumber(input.width, 6, 0.3, 200),
    d: clampNumber(input.depth, 4, 0.3, 200),
    rot: input.rot ?? 0,
    thickness: clampNumber(input.thickness, 0.2, 0.04, 1),
    style: style as SlabStyle,
  }
}
