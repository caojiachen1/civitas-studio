import {
  DOOR_STYLES,
  WINDOW_STYLES,
  type EditorDocument,
  type Entity,
  type Level,
  type OpeningEntity,
  type PlanOptions,
  type PlacementDefaults,
  type RoofEntity,
  type SlabEntity,
  type Vec2,
  type WallEntity,
} from './types'
import { checkOpeningPlacement } from './validation'
import { pointInPolygon } from './geom'
import { detectRooms, type DetectedRoom } from './builders/rooms'

export interface PlanRect {
  x: number
  z: number
  w: number
  d: number
}

export interface RoomCompletion {
  entities: Entity[]
  rooms: number
  slabs: number
  roofs: number
  doors: number
  windows: number
}

function plannedId(prefix: string): string {
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  return `${prefix}_${raw}`
}

function makeWall(levelId: string, a: Vec2, b: Vec2, defaults: PlacementDefaults): WallEntity {
  return {
    id: plannedId('plan-wall'),
    kind: 'wall',
    levelId,
    a,
    b,
    height: defaults.wall.height,
    thickness: defaults.wall.thickness,
    color: defaults.wall.color,
  }
}

function makeSlab(
  levelId: string,
  rect: PlanRect,
  defaults: PlacementDefaults,
  rot = 0,
): SlabEntity {
  return {
    id: plannedId('plan-slab'),
    kind: 'slab',
    levelId,
    x: rect.x,
    z: rect.z,
    w: rect.w,
    d: rect.d,
    rot,
    thickness: defaults.slab.thickness,
    style: defaults.slab.style,
  }
}

function makeRoof(
  levelId: string,
  elevation: number,
  rect: PlanRect,
  defaults: PlacementDefaults,
  rot = 0,
  wallHeight = defaults.wall.height,
): RoofEntity {
  const overhang = defaults.roof.overhang * 2
  return {
    id: plannedId('plan-roof'),
    kind: 'roof',
    levelId,
    x: rect.x,
    z: rect.z,
    w: rect.w + overhang,
    d: rect.d + overhang,
    rot,
    style: defaults.roof.style,
    finish: defaults.roof.finish,
    pitch: defaults.roof.pitch,
    eaveY: elevation + wallHeight + 0.02,
    overhang: defaults.roof.overhang,
  }
}

function addOpening(
  type: 'door' | 'window',
  wall: WallEntity,
  existing: OpeningEntity[],
  defaults: PlacementDefaults,
): OpeningEntity | null {
  const styleId =
    type === 'door' ? defaults.openings.doorStyle : defaults.openings.windowStyle
  const styles = type === 'door' ? DOOR_STYLES : WINDOW_STYLES
  const style = styles.find((item) => item.id === styleId) ?? styles[0]
  const length = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
  const width = style.width
  const height = style.height
  const sill = type === 'window' ? (style as { sill: number }).sill : 0
  const offset = length / 2
  const check = checkOpeningPlacement(wall, offset, width, height, sill, existing)
  if (!check.valid) return null
  const opening: OpeningEntity = {
    id: plannedId('plan-opening'),
    kind: 'opening',
    type,
    wallId: wall.id,
    offset,
    width,
    height,
    sill,
    style: style.id,
  }
  if (type === 'door') {
    opening.openAngle = defaults.openings.doorOpenAngle
    opening.hinge = defaults.openings.doorHinge
  }
  return opening
}

export function isTopLevel(doc: EditorDocument, levelId: string): boolean {
  const level = doc.levels.find((item) => item.id === levelId)
  if (!level) return false
  const top = doc.levels.reduce((max, item) => Math.max(max, item.elevation), level.elevation)
  return Math.abs(level.elevation - top) < 0.001
}

const near = (a: Vec2, b: Vec2) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= 0.12

export function createPlanRoom(
  rect: PlanRect,
  level: Level,
  doc: EditorDocument,
  defaults: PlacementDefaults,
  options: PlanOptions,
  topLevel: boolean,
): Entity[] {
  const x0 = rect.x - rect.w / 2
  const x1 = rect.x + rect.w / 2
  const z0 = rect.z - rect.d / 2
  const z1 = rect.z + rect.d / 2
  const existingWalls = Object.values(doc.entities).filter(
    (entity): entity is WallEntity => entity.kind === 'wall' && entity.levelId === level.id,
  )
  const createdWalls: WallEntity[] = []
  const walls = ([
    [[x0, z0], [x1, z0]],
    [[x1, z0], [x1, z1]],
    [[x1, z1], [x0, z1]],
    [[x0, z1], [x0, z0]],
  ] as [Vec2, Vec2][]).map(([a, b]) => {
    const shared = existingWalls.find(
      (wall) =>
        (near(a, wall.a) && near(b, wall.b)) || (near(a, wall.b) && near(b, wall.a)),
    )
    if (shared) return shared
    const wall = makeWall(level.id, a, b, defaults)
    createdWalls.push(wall)
    return wall
  })
  const wallIds = new Set(walls.map((wall) => wall.id))
  const newWallIds = new Set(createdWalls.map((wall) => wall.id))
  const existingOpenings = Object.values(doc.entities).filter(
    (entity): entity is OpeningEntity =>
      entity.kind === 'opening' && wallIds.has(entity.wallId),
  )
  const openingPool: OpeningEntity[] = [...existingOpenings]
  const createdOpenings: OpeningEntity[] = []
  const entities: Entity[] = [...createdWalls]

  if (options.autoDoor) {
    const order = [2, 0, 1, 3]
    for (const index of order) {
      if (!newWallIds.has(walls[index].id)) continue
      const door = addOpening('door', walls[index], openingPool, defaults)
      if (door) {
        openingPool.push(door)
        createdOpenings.push(door)
        break
      }
    }
  }
  if (options.autoWindow) {
    const doorWallId = createdOpenings.find((item) => item.type === 'door')?.wallId
    for (const wall of walls) {
      if (wall.id === doorWallId || !newWallIds.has(wall.id)) continue
      const window = addOpening('window', wall, openingPool, defaults)
      if (window) {
        openingPool.push(window)
        createdOpenings.push(window)
      }
    }
  }

  const duplicateSlab = Object.values(doc.entities).some(
    (entity) =>
      entity.kind === 'slab' &&
      entity.levelId === level.id &&
      Math.abs(entity.x - rect.x) < 0.25 &&
      Math.abs(entity.z - rect.z) < 0.25,
  )
  if (options.autoSlab && !duplicateSlab) entities.push(makeSlab(level.id, rect, defaults))
  if (options.autoRoof && topLevel) {
    const duplicateRoof = Object.values(doc.entities).some(
      (entity) =>
        entity.kind === 'roof' &&
        entity.levelId === level.id &&
        Math.abs(entity.x - rect.x) < 0.25 &&
        Math.abs(entity.z - rect.z) < 0.25,
    )
    if (!duplicateRoof) entities.push(makeRoof(level.id, level.elevation, rect, defaults))
  }
  entities.push(...createdOpenings)
  return entities
}

function wallLength(wall: WallEntity): number {
  return Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
}

export function completeLevelRooms(
  doc: EditorDocument,
  levelId: string,
  defaults: PlacementDefaults,
  options: PlanOptions,
): RoomCompletion {
  const level = doc.levels.find((item) => item.id === levelId)
  const result: RoomCompletion = { entities: [], rooms: 0, slabs: 0, roofs: 0, doors: 0, windows: 0 }
  if (!level) return result
  const entities = Object.values(doc.entities)
  const walls = entities.filter(
    (entity): entity is WallEntity => entity.kind === 'wall' && entity.levelId === levelId,
  )
  const rooms = detectRooms(walls)
  if (rooms.length === 0) return result
  const topLevel = isTopLevel(doc, levelId)
  const slabs = entities.filter(
    (entity): entity is SlabEntity => entity.kind === 'slab' && entity.levelId === levelId,
  )
  const roofs = entities.filter(
    (entity): entity is RoofEntity => entity.kind === 'roof' && entity.levelId === levelId,
  )
  const openings = entities.filter(
    (entity): entity is OpeningEntity => entity.kind === 'opening',
  )
  const roomWallIds = new Set(walls.map((wall) => wall.id))

  for (const room of rooms) {
    result.rooms++
    const inside = (x: number, z: number) => pointInPolygon(x, z, room.polygon)
    const roomRect: PlanRect = {
      x: room.rect.center[0],
      z: room.rect.center[1],
      w: room.rect.width,
      d: room.rect.depth,
    }
    if (options.autoSlab && !slabs.some((slab) => inside(slab.x, slab.z))) {
      const slab = makeSlab(levelId, roomRect, defaults, room.rect.rot)
      slabs.push(slab)
      result.entities.push(slab)
      result.slabs++
    }
    if (
      options.autoRoof &&
      topLevel &&
      !roofs.some((roof) => inside(roof.x, roof.z))
    ) {
      const roof = makeRoof(levelId, level.elevation, roomRect, defaults, room.rect.rot, room.maxWallHeight)
      roofs.push(roof)
      result.entities.push(roof)
      result.roofs++
    }

    const roomOpenings = openings.filter(
      (opening) => roomWallIds.has(opening.wallId) && room.wallIds.includes(opening.wallId),
    )
    const sortedWalls = [...walls]
      .filter((wall) => room.wallIds.includes(wall.id))
      .sort((a, b) => wallLength(b) - wallLength(a))

    if (options.autoDoor && !roomOpenings.some((opening) => opening.type === 'door')) {
      for (const wall of sortedWalls) {
        const door = addOpening('door', wall, openings, defaults)
        if (door) {
          openings.push(door)
          result.entities.push(door)
          result.doors++
          roomOpenings.push(door)
          break
        }
      }
    }
    if (options.autoWindow && !roomOpenings.some((opening) => opening.type === 'window')) {
      const doorWallId = roomOpenings.find((opening) => opening.type === 'door')?.wallId
      for (const wall of sortedWalls) {
        if (wall.id === doorWallId) continue
        const window = addOpening('window', wall, openings, defaults)
        if (window) {
          openings.push(window)
          result.entities.push(window)
          result.windows++
          break
        }
      }
    }
  }
  return result
}

export function buildLevelCopy(
  entities: Entity[],
  sourceLevelId: string,
  targetLevelId: string,
  withFurniture = false,
): Entity[] {
  const wallMap = new Map<string, string>()
  const copies: Entity[] = []
  const sourceWalls = entities.filter(
    (entity): entity is WallEntity => entity.kind === 'wall' && entity.levelId === sourceLevelId,
  )
  for (const wall of sourceWalls) {
    const id = plannedId('plan-wall')
    wallMap.set(wall.id, id)
    copies.push({ ...wall, id, levelId: targetLevelId })
  }
  for (const entity of entities) {
    if (entity.kind === 'opening' && wallMap.has(entity.wallId)) {
      copies.push({
        ...entity,
        id: plannedId('plan-opening'),
        wallId: wallMap.get(entity.wallId)!,
      })
    } else if (entity.kind === 'slab' && entity.levelId === sourceLevelId) {
      copies.push({ ...entity, id: plannedId('plan-slab'), levelId: targetLevelId })
    } else if (withFurniture && entity.kind === 'object' && entity.levelId === sourceLevelId) {
      copies.push({ ...entity, id: plannedId('plan-object'), levelId: targetLevelId })
    }
  }
  return copies
}

export function roomCompletionSummary(result: RoomCompletion): string {
  const parts: string[] = []
  if (result.slabs) parts.push(`${result.slabs} 块楼板`)
  if (result.roofs) parts.push(`${result.roofs} 个屋顶`)
  if (result.doors) parts.push(`${result.doors} 扇门`)
  if (result.windows) parts.push(`${result.windows} 扇窗`)
  return parts.length ? parts.join('、') : '没有需要补全的房间'
}

export function detectedRoomCount(doc: EditorDocument, levelId: string): number {
  const walls = Object.values(doc.entities).filter(
    (entity): entity is WallEntity => entity.kind === 'wall' && entity.levelId === levelId,
  )
  return detectRooms(walls).length
}

export type { DetectedRoom }
