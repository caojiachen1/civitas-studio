import { layoutForRoom, type LayoutItem } from '../ai/layouts'
import type { AiRoomType } from '../ai/types'
import { getModel, getModelFootprints } from '../models/registry'
import { detectRooms, type DetectedRoom } from './builders/rooms'
import { obbOverlap, pointInPolygon } from './geom'
import { objectOBB, wallOBB } from './validation'
import type {
  BuildingInterior,
  EditorDocument,
  Entity,
  ObjectEntity,
  OpeningEntity,
  Vec2,
  WallEntity,
} from './types'

export interface FurnishResult {
  entities: ObjectEntity[]
  rooms: number
  items: number
  skipped: number
}

const ZERO: FurnishResult = { entities: [], rooms: 0, items: 0, skipped: 0 }

function fid(): string {
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  return `furnish_${raw}`
}

function roomTypeFor(room: DetectedRoom, rank: number, floorIndex: number): AiRoomType {
  const area = room.area
  if (floorIndex === 0) {
    if (rank === 0) return 'living'
    if (rank === 1) return area >= 5.5 ? 'kitchen' : 'bathroom'
    if (rank === 2 && area >= 8) return 'dining'
    if (area < 6) return 'bathroom'
    return 'office'
  }
  if (rank === 0 && area >= 8) return 'bedroom'
  if (area >= 7) return 'bedroom'
  if (area >= 5) return 'office'
  return 'bathroom'
}

function openPlanItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  const deskD = getModel('desk')?.footprint[1] ?? 1.2
  const chairD = getModel('office-chair')?.footprint[1] ?? 1.2
  items.push({ modelId: 'desk', lx: 0, lz: -depth / 2 + 0.75 + deskD / 2, rot: 0 })
  items.push({
    modelId: 'office-chair',
    lx: 0,
    lz: -depth / 2 + 0.75 + deskD + chairD / 2 + 0.3,
    rot: Math.PI,
  })
  const sofaD = getModel('sofa-3')?.footprint[1] ?? 2.2
  items.push({ modelId: 'sofa-3', lx: width / 2 - 0.7 - sofaD / 2, lz: depth * 0.16, rot: -Math.PI / 2 })
  items.push({ modelId: 'coffee-table', lx: width / 2 - 0.7 - sofaD - 0.7, lz: depth * 0.16, rot: -Math.PI / 2 })
  items.push({ modelId: 'bookshelf', lx: -width / 2 + 0.9, lz: 0, rot: Math.PI / 2 })
  items.push({ modelId: 'potted-plant', lx: -width * 0.34, lz: -depth * 0.36, rot: 0 })
  items.push({ modelId: 'potted-plant', lx: width * 0.34, lz: -depth * 0.36, rot: 0 })
  items.push({ modelId: 'potted-plant', lx: width * 0.36, lz: depth * 0.36, rot: 0 })
  items.push({ modelId: 'floor-lamp', lx: width / 2 - 1.1, lz: -depth * 0.3, rot: 0 })
  return items
}

function localToWorld(cx: number, cz: number, rot: number, lx: number, lz: number): Vec2 {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  return [cx + lx * c + lz * s, cz - lx * s + lz * c]
}

function doorPoints(walls: Map<string, WallEntity>, openings: OpeningEntity[]): Vec2[] {
  const points: Vec2[] = []
  for (const opening of openings) {
    if (opening.type !== 'door') continue
    const wall = walls.get(opening.wallId)
    if (!wall) continue
    const dx = wall.b[0] - wall.a[0]
    const dz = wall.b[1] - wall.a[1]
    const length = Math.hypot(dx, dz)
    if (length < 0.01) continue
    const t = Math.min(1, Math.max(0, opening.offset / length))
    points.push([wall.a[0] + dx * t, wall.a[1] + dz * t])
  }
  return points
}

function isNested(room: DetectedRoom, rooms: DetectedRoom[]): boolean {
  return rooms.some(
    (other) =>
      other !== room &&
      other.area > room.area &&
      pointInPolygon(room.rect.center[0], room.rect.center[1], other.polygon),
  )
}

export function furnishLevelEntities(
  entities: Entity[],
  levelId: string,
  floorIndex = 0,
  options?: { openPlan?: boolean },
): FurnishResult {
  const walls = entities.filter(
    (entity): entity is WallEntity => entity.kind === 'wall' && entity.levelId === levelId,
  )
  const allRooms = detectRooms(walls)
  const rooms = allRooms.filter((room) => !isNested(room, allRooms))
  if (rooms.length === 0) return ZERO
  const footprints = getModelFootprints()
  const wallMap = new Map(walls.map((wall) => [wall.id, wall]))
  const openings = entities.filter(
    (entity): entity is OpeningEntity =>
      entity.kind === 'opening' && wallMap.has(entity.wallId),
  )
  const doors = doorPoints(wallMap, openings)
  const existing = entities.filter(
    (entity): entity is ObjectEntity => entity.kind === 'object' && entity.levelId === levelId,
  )
  const occupied = existing
    .filter((entity) => !getModel(entity.modelId)?.noCollide)
    .map((entity) => {
      const fp = footprints.get(entity.modelId) ?? [1, 1]
      return objectOBB(entity.x, entity.z, entity.rot, fp[0], fp[1], entity.scale)
    })
  const created: ObjectEntity[] = []
  let skipped = 0

  const ordered = [...rooms].sort((a, b) => b.area - a.area)
  ordered.forEach((room, rank) => {
    if (room.area < 3.2) return
    const width = Math.max(2.2, room.rect.width)
    const depth = Math.max(2.2, room.rect.depth)
    const openPlan = Boolean(options?.openPlan) && width >= 8 && depth >= 8
    const type = openPlan ? 'office' : roomTypeFor(room, rank, floorIndex)
    const items = openPlan
      ? openPlanItems(width, depth)
      : type === 'kitchen' && room.area >= 26
        ? [...layoutForRoom('kitchen', width, depth), ...layoutForRoom('dining', width, depth)]
        : layoutForRoom(type, width, depth)
    for (const item of items) {
      const model = getModel(item.modelId)
      if (!model) {
        skipped++
        continue
      }
      const [x, z] = localToWorld(room.rect.center[0], room.rect.center[1], room.rect.rot, item.lx, item.lz)
      if (!pointInPolygon(x, z, room.polygon)) {
        skipped++
        continue
      }
      if (doors.some((door) => Math.hypot(door[0] - x, door[1] - z) < 1.55)) {
        skipped++
        continue
      }
      const obb = objectOBB(x, z, item.rot + room.rect.rot, model.footprint[0], model.footprint[1], item.scale ?? 1)
      if (!model.noCollide) {
        if (walls.some((wall) => wall.levelId === levelId && obbOverlap(obb, wallOBB(wall), -0.035))) {
          skipped++
          continue
        }
        if (occupied.some((other) => obbOverlap(obb, other, -0.02))) {
          skipped++
          continue
        }
      }
      const object: ObjectEntity = {
        id: fid(),
        kind: 'object',
        levelId,
        modelId: item.modelId,
        x,
        z,
        rot: item.rot + room.rect.rot,
        scale: item.scale ?? 1,
      }
      created.push(object)
      if (!model.noCollide) occupied.push(obb)
    }
  })

  return {
    entities: created,
    rooms: rooms.length,
    items: created.length,
    skipped,
  }
}

export function furnishInterior(
  interior: BuildingInterior,
  options?: { maxFloors?: number; openPlan?: boolean },
): FurnishResult {
  const maxFloors = Math.max(1, Math.min(40, options?.maxFloors ?? 3))
  const result: FurnishResult = { entities: [], rooms: 0, items: 0, skipped: 0 }
  const all = Object.values(interior.entities)
  const levels = [...interior.levels].sort((a, b) => a.elevation - b.elevation).slice(0, maxFloors)
  levels.forEach((level, index) => {
    const furnished = furnishLevelEntities(all, level.id, index, { openPlan: options?.openPlan })
    result.rooms += furnished.rooms
    result.items += furnished.items
    result.skipped += furnished.skipped
    for (const entity of furnished.entities) {
      interior.entities[entity.id] = entity
      interior.entityOrder.push(entity.id)
      result.entities.push(entity)
    }
  })
  return result
}

export function furnishActiveLevel(
  doc: EditorDocument,
  levelId: string,
  options?: { openPlan?: boolean },
): FurnishResult {
  const levelIndex = [...doc.levels].sort((a, b) => a.elevation - b.elevation).findIndex((level) => level.id === levelId)
  return furnishLevelEntities(Object.values(doc.entities), levelId, Math.max(0, levelIndex), options)
}
