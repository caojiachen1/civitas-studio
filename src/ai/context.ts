import type { EditorDocument, Vec2, WallEntity } from '../editor/types'
import { detectRooms, type DetectedRoom } from '../editor/builders/rooms'
import { pointInPolygon } from '../editor/geom'
import { CATALOG_MODELS, MODEL_MAP } from '../models/registry'
import type { AiRoomContext, AiSceneContext } from './types'
import type { RoomFrame } from './layouts'

export interface RoomHit {
  frame: RoomFrame
  polygon: Vec2[]
  area: number
  maxWallHeight: number
  rect: DetectedRoom['rect']
}

export function roomsForDocument(doc: EditorDocument, levelId: string): DetectedRoom[] {
  const walls = Object.values(doc.entities).filter(
    (entity): entity is WallEntity => entity.kind === 'wall' && entity.levelId === levelId,
  )
  return detectRooms(walls)
}

export function roomAt(
  doc: EditorDocument,
  levelId: string,
  point: Vec2,
): RoomHit | null {
  const rooms = roomsForDocument(doc, levelId)
  const containing = rooms.filter((room) => pointInPolygon(point[0], point[1], room.polygon))
  containing.sort((a, b) => a.area - b.area)
  const room = containing[0]
  if (!room) return null
  return {
    frame: {
      cx: room.rect.center[0],
      cz: room.rect.center[1],
      width: room.rect.width,
      depth: room.rect.depth,
      rot: room.rect.rot,
    },
    polygon: room.polygon,
    area: room.area,
    maxWallHeight: room.maxWallHeight,
    rect: room.rect,
  }
}

export function nearestRoom(
  doc: EditorDocument,
  levelId: string,
  anchor: Vec2,
  maxDistance = 80,
): RoomHit | null {
  const rooms = roomsForDocument(doc, levelId)
  let best: { room: DetectedRoom; score: number } | null = null
  for (const room of rooms) {
    const inside = pointInPolygon(anchor[0], anchor[1], room.polygon)
    const distance = Math.hypot(room.rect.center[0] - anchor[0], room.rect.center[1] - anchor[1])
    if (!inside && distance > maxDistance) continue
    const score = inside ? -1 : distance
    if (!best || score < best.score) best = { room, score }
  }
  if (!best) return null
  return {
    frame: {
      cx: best.room.rect.center[0],
      cz: best.room.rect.center[1],
      width: best.room.rect.width,
      depth: best.room.rect.depth,
      rot: best.room.rect.rot,
    },
    polygon: best.room.polygon,
    area: best.room.area,
    maxWallHeight: best.room.maxWallHeight,
    rect: best.room.rect,
  }
}

export function modelName(id: string): string {
  return MODEL_MAP.get(id)?.name ?? id
}

export function buildSceneContext(
  doc: EditorDocument,
  activeLevelId: string,
  cameraTarget: Vec2,
  selectedId: string | null,
): AiSceneContext {
  const counts: Record<string, number> = {}
  for (const entity of Object.values(doc.entities)) {
    counts[entity.kind] = (counts[entity.kind] ?? 0) + 1
  }
  const active = doc.levels.find((level) => level.id === activeLevelId) ?? doc.levels[0]
  const selected = selectedId ? doc.entities[selectedId] : null
  const rooms: AiRoomContext[] = roomsForDocument(doc, activeLevelId)
    .map((room) => ({
      centerX: room.rect.center[0],
      centerZ: room.rect.center[1],
      width: room.rect.width,
      depth: room.rect.depth,
      rot: room.rect.rot,
      area: room.area,
    }))
    .slice(0, 12)
  let selectedInfo: AiSceneContext['selected'] = null
  if (selected) {
    selectedInfo = {
      kind: selected.kind,
      name: selected.kind === 'object' ? modelName(selected.modelId) : selected.kind,
    }
    if (selected.kind === 'object') {
      selectedInfo.x = selected.x
      selectedInfo.z = selected.z
      selectedInfo.rot = selected.rot
      selectedInfo.modelId = selected.modelId
    } else if (selected.kind === 'slab' || selected.kind === 'roof') {
      selectedInfo.x = selected.x
      selectedInfo.z = selected.z
      selectedInfo.rot = selected.rot
    } else if (selected.kind === 'wall') {
      selectedInfo.x = (selected.a[0] + selected.b[0]) / 2
      selectedInfo.z = (selected.a[1] + selected.b[1]) / 2
    }
  }
  return {
    projectName: doc.projectName,
    activeLevel: { id: active.id, name: active.name, elevation: active.elevation },
    levels: doc.levels.map((level) => ({
      name: level.name,
      elevation: level.elevation,
      active: level.id === active.id,
      entities: Object.values(doc.entities).filter(
        (entity) => entity.kind !== 'opening' && entity.levelId === level.id,
      ).length,
    })),
    counts,
    selected: selectedInfo,
    cameraTarget,
    rooms,
  }
}

export function catalogPromptText(): string {
  const grouped = new Map<string, string[]>()
  for (const model of CATALOG_MODELS) {
    const list = grouped.get(model.category) ?? []
    list.push(`${model.id}=${model.name}`)
    grouped.set(model.category, list)
  }
  return [...grouped.entries()]
    .map(([category, entries]) => `${category}: ${entries.join(', ')}`)
    .join('\n')
}
