import {
  type Entity,
  type PathEntity,
  type PathType,
  type RoofFinish,
  type RoofStyle,
  type Vec2,
} from '../editor/types'
import { useEditor, uid } from '../editor/store'
import { getEditorScene } from '../editor/engineRef'
import { getModel } from '../models/registry'
import { getPathBundle } from '../editor/geom'
import { roomAt, nearestRoom, roomsForDocument, type RoomHit } from './context'
import { SceneBuilder } from './builder'
import { resolveColor } from '../editor/colors'
import { createOpeningEntity, createSlabEntity, createWallEntity } from '../editor/entityOps'
import {
  defaultRoomSize,
  layoutForRoom,
  placeLayout,
  roomFloorStyle,
  type LayoutItem,
  type RoomFrame,
} from './layouts'
import {
  DESTRUCTIVE_ACTIONS,
  ROOM_TYPE_LABELS,
  type AiAction,
  type AiActionPlan,
  type AiExecutionResult,
  type AiRoomType,
} from './types'

interface Outcome {
  notes: string[]
  warnings: string[]
  created: Entity[]
  changed: boolean
}

interface ExecuteOptions {
  allowDestructive?: boolean
}

const KIND_LABELS: Record<string, string> = {
  wall: '墙面',
  opening: '门窗',
  object: '构件',
  path: '路径',
  slab: '楼板',
  roof: '屋顶',
}

const KIND_ORDER = ['wall', 'opening', 'object', 'path', 'slab', 'roof']

function num(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.min(max, Math.max(min, parsed))
}

function fmt(value: number) {
  return value.toFixed(1)
}

function anchorPoint(): Vec2 {
  const target = getEditorScene()?.getView().target
  return target ? [target[0], target[2]] : [0, 0]
}

function cameraAnchor(): Vec2 {
  return anchorPoint()
}

function outcomeFromBuilder(builder: SceneBuilder, note: string): Outcome {
  const created = builder.newEntities.slice()
  builder.commit()
  return {
    notes: [note],
    warnings: [...builder.warnings],
    created,
    changed: created.length > 0,
  }
}

function resolveRoom(
  doc = useEditor.getState().doc,
  actionX?: number,
  actionZ?: number,
): RoomHit | null {
  const levelId = doc.activeLevelId
  if (typeof actionX === 'number' && typeof actionZ === 'number') {
    return roomAt(doc, levelId, [actionX, actionZ])
  }
  const selectedId = useEditor.getState().selectedId
  const selected = selectedId ? doc.entities[selectedId] : null
  if (selected && (selected.kind === 'object' || selected.kind === 'slab' || selected.kind === 'roof')) {
    const hit = roomAt(doc, levelId, [selected.x, selected.z])
    if (hit) return hit
  }
  if (selected?.kind === 'wall') {
    const room = roomsForDocument(doc, levelId).find((item) => item.wallIds.includes(selected.id))
    if (room) {
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
  }
  return nearestRoom(doc, levelId, cameraAnchor(), 70)
}

function describeFrame(frame: RoomFrame) {
  return `${fmt(frame.width)} × ${fmt(frame.depth)} m`
}

function noteSkippedItems(builder: SceneBuilder, intended: number, placed: number) {
  if (intended > placed) {
    builder.warnings.push(`${intended - placed} 件家具因空间不足或与墙体/家具碰撞被跳过`)
  }
}

export function planHasDestructive(plan: AiActionPlan): boolean {
  return plan.actions.some((action) => DESTRUCTIVE_ACTIONS.has(action.type))
}

export function planShouldFocus(plan: AiActionPlan): boolean {
  return plan.actions.some((action) =>
    [
      'build_villa',
      'build_room',
      'furnish_room',
      'draw_path',
      'add_pond',
      'add_vegetation',
      'add_roof',
      'add_wall',
      'add_slab',
    ].includes(action.type),
  )
}

export function executePlan(plan: AiActionPlan, options: ExecuteOptions = {}): AiExecutionResult {
  const warnings = [...(plan.warnings ?? [])]
  const actions = plan.actions.slice(0, 24)
  if (plan.actions.length > actions.length) warnings.push('动作数量过多，超出部分已忽略。')
  if (actions.length === 0) {
    return { ok: true, summary: '没有需要执行的操作。', warnings, created: 0, focusIds: [] }
  }
  if (planHasDestructive(plan) && !options.allowDestructive) {
    return {
      ok: false,
      summary: '操作已取消',
      warnings,
      created: 0,
      focusIds: [],
      error: '该计划包含清空楼层的危险操作，需要确认后才能执行。',
    }
  }

  const undoish = actions.filter((action) => action.type === 'undo' || action.type === 'redo')
  if (undoish.length > 0) {
    if (actions.length > 1) {
      return {
        ok: false,
        summary: '操作未执行',
        warnings,
        created: 0,
        focusIds: [],
        error: '撤销/重做不能与其他动作组合执行。',
      }
    }
    const store = useEditor.getState()
    if (undoish[0].type === 'undo') store.undo()
    else store.redo()
    return {
      ok: true,
      summary: undoish[0].type === 'undo' ? '已撤销上一步操作。' : '已重做一步操作。',
      warnings,
      created: 0,
      focusIds: [],
    }
  }

  const onlyFocus = actions.every((action) => action.type === 'focus_all')
  if (onlyFocus) {
    getEditorScene()?.focusAll()
    return { ok: true, summary: '已将相机移动到全览位置。', warnings, created: 0, focusIds: [] }
  }

  const mutating = actions.some((action) => action.type !== 'focus_all')
  const store = useEditor.getState()
  if (mutating) store.beginHistory(`AI · ${plan.reply.slice(0, 22) || '场景操作'}`)

  const created: Entity[] = []
  const notes: string[] = []
  const focusIds: string[] = []
  let changed = false

  try {
    for (const action of actions) {
      if (action.type === 'focus_all') {
        getEditorScene()?.focusAll()
        continue
      }
      const outcome = applyAction(action)
      notes.push(...outcome.notes)
      warnings.push(...outcome.warnings)
      if (outcome.changed) changed = true
      if (outcome.created.length > 0) {
        if (created.length + outcome.created.length > 600) {
          throw new Error('单次 AI 操作生成的构件过多，请拆分成多次操作。')
        }
        created.push(...outcome.created)
        focusIds.push(...outcome.created.map((entity) => entity.id))
      }
    }
  } catch (error) {
    if (mutating) store.undo()
    return {
      ok: false,
      summary: 'AI 操作失败，场景已回滚',
      warnings: [...new Set(warnings)].slice(0, 12),
      created: 0,
      focusIds: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }

  if (mutating && !changed && created.length === 0) {
    // A history entry with no change is pointless; undo the no-op snapshot.
    store.undo()
  }

  const counts: Record<string, number> = {}
  for (const entity of created) counts[entity.kind] = (counts[entity.kind] ?? 0) + 1
  const breakdown = KIND_ORDER.filter((kind) => counts[kind])
    .map((kind) => `${KIND_LABELS[kind]} ${counts[kind]}`)
    .join('、')
  const parts = notes.filter(Boolean)
  let summary = parts.length > 0 ? parts.join('；') : '完成 AI 场景操作。'
  if (created.length > 0) summary += `。新增 ${created.length} 个构件（${breakdown}）`
  if (warnings.length > 0) summary += `。${Math.min(warnings.length, 9)} 条提示`
  return {
    ok: true,
    summary: `${summary}。`,
    warnings: [...new Set(warnings)].slice(0, 14),
    created: created.length,
    focusIds,
  }
}

function applyAction(action: AiAction): Outcome {
  switch (action.type) {
    case 'build_room':
      return buildRoom(action)
    case 'build_villa':
      return buildVilla(action)
    case 'furnish_room':
      return furnishRoom(action)
    case 'place_model':
      return placeModel(action)
    case 'add_wall':
      return addWall(action)
    case 'add_opening':
      return addOpening(action)
    case 'add_slab':
      return addSlab(action)
    case 'draw_path':
      return drawPath(action)
    case 'add_pond':
      return addPond(action)
    case 'add_roof':
      return addRoof(action)
    case 'add_vegetation':
      return addVegetation(action)
    case 'add_level': {
      const before = useEditor.getState().doc.levels.length
      useEditor.getState().addLevel(false)
      const count = useEditor.getState().doc.levels.length
      return {
        notes: [`新增楼层（当前共 ${count} 层）`],
        warnings: [],
        created: [],
        changed: count !== before,
      }
    }
    case 'set_active_level': {
      const doc = useEditor.getState().doc
      const index = Math.min(doc.levels.length - 1, Math.max(0, Math.round(action.index ?? 0)))
      const level = doc.levels[index]
      if (!level) throw new Error('楼层编号无效。')
      useEditor.getState().setActiveLevel(level.id)
      return { notes: [`切换到${level.name}`], warnings: [], created: [], changed: true }
    }
    case 'modify_selected':
      return modifySelected(action)
    case 'delete_selected':
      return deleteSelected()
    case 'clear_level':
      return clearLevel()
    case 'focus_all':
      getEditorScene()?.focusAll()
      return { notes: ['全览场景'], warnings: [], created: [], changed: false }
    case 'undo':
    case 'redo':
      throw new Error('撤销/重做不能与其他动作组合执行。')
  }
}

function addWall(action: Extract<AiAction, { type: 'add_wall' }>): Outcome {
  const wall = createWallEntity({
    id: action.id,
    a: action.a,
    b: action.b,
    height: action.height,
    thickness: action.thickness,
    color: action.color,
    levelId: action.levelId,
  })
  useEditor.getState().addEntity(wall, false)
  const length = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
  return {
    notes: [`绘制墙体（${fmt(length)} m）`],
    warnings: [],
    created: [wall],
    changed: true,
  }
}

function addOpening(action: Extract<AiAction, { type: 'add_opening' }>): Outcome {
  const opening = createOpeningEntity({
    wallId: action.wallId,
    openingType: action.openingType,
    style: action.style,
    offset: action.offset,
    width: action.width,
    height: action.height,
    sill: action.sill,
    openAngle: action.openAngle,
    hinge: action.hinge,
  })
  useEditor.getState().addEntity(opening, false)
  return {
    notes: [`在墙上开出${opening.type === 'door' ? '门' : '窗'}`],
    warnings: [],
    created: [opening],
    changed: true,
  }
}

function addSlab(action: Extract<AiAction, { type: 'add_slab' }>): Outcome {
  const slab = createSlabEntity({
    x: action.x,
    z: action.z,
    width: action.width,
    depth: action.depth,
    rot: action.rot,
    thickness: action.thickness,
    style: action.style,
    levelId: action.levelId,
    holes: action.holes?.map((hole, index) => ({
      id: `hole-${uid('hole')}-${index}`,
      x: hole.x,
      z: hole.z,
      w: hole.w,
      d: hole.d,
      rot: hole.rot ?? 0,
    })),
  })
  useEditor.getState().addEntity(slab, false)
  return {
    notes: [`绘制楼板（${fmt(slab.w)} × ${fmt(slab.d)} m）`],
    warnings: [],
    created: [slab],
    changed: true,
  }
}

function buildRoom(action: Extract<AiAction, { type: 'build_room' }>): Outcome {
  const doc = useEditor.getState().doc
  const levelId = doc.activeLevelId
  const roomType: AiRoomType = action.roomType ?? 'generic'
  const defaults = defaultRoomSize(roomType)
  const width = num(action.width, defaults[0], 2.4, 22)
  const depth = num(action.depth, defaults[1], 2.4, 22)
  const builder = new SceneBuilder(doc, levelId)
  const preferred: Vec2 = [action.centerX ?? cameraAnchor()[0], action.centerZ ?? cameraAnchor()[1]]
  const free = builder.findFreeArea(preferred, width + 2.4, depth + 2.4, 1.1)
  if (!free) throw new Error('附近没有足够的空地放置这个房间，请移动相机后再试。')
  if (Math.hypot(free[0] - preferred[0], free[1] - preferred[1]) > 2) {
    builder.warnings.push('指定位置附近已有建筑或道路，房间已自动放到最近的空地。')
  }
  const [cx, cz] = free
  const hw = width / 2
  const hd = depth / 2
  const north = builder.addWall([cx - hw, cz - hd], [cx + hw, cz - hd])
  builder.addWall([cx + hw, cz - hd], [cx + hw, cz + hd])
  const south = builder.addWall([cx - hw, cz + hd], [cx + hw, cz + hd])
  builder.addWall([cx - hw, cz + hd], [cx - hw, cz - hd])
  builder.addOpening('door', south, 'single', width / 2)
  if (width >= 7.2) {
    builder.addOpening('window', north, 'wide', width * 0.3)
    builder.addOpening('window', north, 'wide', width * 0.7)
  } else if (width >= 2.4) {
    builder.addOpening('window', north, width >= 4.4 ? 'wide' : 'standard', width / 2)
  }
  builder.addSlab([cx, cz], width, depth, roomFloorStyle(roomType))
  if (action.roof !== false) {
    const flat = roomType === 'bathroom' || roomType === 'kitchen' || roomType === 'office'
    builder.addRoof(
      [cx, cz],
      width + 0.9,
      depth + 0.9,
      builder.elevation + 3.2 + 0.02,
      flat ? 'flat' : 'gable',
      flat ? 'slate' : 'terracotta',
    )
  }
  if (action.furnish !== false) {
    const items = layoutForRoom(roomType, width, depth)
    const placed = placeLayout(builder, { cx, cz, width, depth, rot: 0 }, items)
    noteSkippedItems(builder, items.length, placed)
  }
  const title = ROOM_TYPE_LABELS[roomType]
  const verb = action.furnish === false ? '建造' : '建造并布置'
  return outcomeFromBuilder(
    builder,
    `在 (${fmt(cx)}, ${fmt(cz)}) ${verb} ${title}（${fmt(width)} × ${fmt(depth)} m）`,
  )
}

function addVillaOpenings(
  builder: SceneBuilder,
  walls: {
    north: ReturnType<SceneBuilder['addWall']>
    south: ReturnType<SceneBuilder['addWall']>
    east: ReturnType<SceneBuilder['addWall']>
    west: ReturnType<SceneBuilder['addWall']>
    p1: ReturnType<SceneBuilder['addWall']>
    p2: ReturnType<SceneBuilder['addWall']>
  },
  width: number,
  depth: number,
) {
  builder.addOpening('door', walls.south, 'sliding', width / 2)
  builder.addOpening('window', walls.south, 'wide', width * 0.2)
  builder.addOpening('window', walls.south, 'wide', width * 0.8)
  builder.addOpening('window', walls.north, 'wide', width * 0.25)
  builder.addOpening('window', walls.north, 'picture', width * 0.5)
  builder.addOpening('window', walls.north, 'wide', width * 0.75)
  builder.addOpening('window', walls.east, 'standard', depth * 0.32)
  builder.addOpening('window', walls.east, 'standard', depth * 0.7)
  builder.addOpening('window', walls.west, 'standard', depth * 0.32)
  builder.addOpening('window', walls.west, 'standard', depth * 0.7)
  const p1Length = Math.hypot(walls.p1.b[0] - walls.p1.a[0], walls.p1.b[1] - walls.p1.a[1])
  const p2Length = Math.hypot(walls.p2.b[0] - walls.p2.a[0], walls.p2.b[1] - walls.p2.a[1])
  builder.addOpening('door', walls.p1, 'single', p1Length - 1.15)
  builder.addOpening('door', walls.p2, 'single', p2Length - 1.15)
}

function addFurnitureZone(
  builder: SceneBuilder,
  frame: RoomFrame,
  items: LayoutItem[],
): { intended: number; placed: number } {
  const placed = placeLayout(builder, frame, items)
  return { intended: items.length, placed }
}

function buildVilla(action: Extract<AiAction, { type: 'build_villa' }>): Outcome {
  const doc = useEditor.getState().doc
  const levelId = doc.activeLevelId
  const width = num(action.width, 16, 10, 30)
  const depth = num(action.depth, 9, 6, 18)
  const builder = new SceneBuilder(doc, levelId)
  const preferred: Vec2 = [action.centerX ?? cameraAnchor()[0], action.centerZ ?? cameraAnchor()[1]]
  const free = builder.findFreeArea(preferred, width + 3.5, depth + 9, 1.8)
  if (!free) throw new Error('附近没有足够大的地块建造别墅，请先把相机移到更开阔的位置。')
  if (Math.hypot(free[0] - preferred[0], free[1] - preferred[1]) > 2.5) {
    builder.warnings.push('别墅已自动放到当前视野附近的空地上。')
  }
  const [cx, cz] = free
  const x0 = cx - width / 2
  const x1 = cx + width / 2
  const z0 = cz - depth / 2
  const z1 = cz + depth / 2
  const north = builder.addWall([x0, z0], [x1, z0], '#e8e0d2')
  const east = builder.addWall([x1, z0], [x1, z1], '#e8e0d2')
  const south = builder.addWall([x0, z1], [x1, z1], '#e8e0d2')
  const west = builder.addWall([x0, z1], [x0, z0], '#e8e0d2')
  const px1 = cx - width * 0.11
  const px2 = cx + width * 0.19
  const pz = cz + depth * 0.12
  const p1 = builder.addWall([px1, z0], [px1, pz], '#a8b5a1')
  const p2 = builder.addWall([px2, z0], [px2, pz], '#d6c3a3')
  addVillaOpenings(builder, { north, south, east, west, p1, p2 }, width, depth)
  builder.addSlab([cx, cz], width - 0.15, depth - 0.15, 'wood')
  const deckD = Math.min(4, Math.max(3.2, depth * 0.4))
  const deckW = Math.min(width * 0.5, 8.5)
  const deckZ = z1 + deckD / 2 + 0.1
  builder.addSlab([cx, deckZ], deckW, deckD, 'deck')
  builder.addRoof([cx, cz], width + 1.25, depth + 1.25, builder.elevation + 3.22, 'gable', 'slate')

  let intended = 0
  let placed = 0
  const leftW = px1 - x0
  const living = addFurnitureZone(
    builder,
    { cx: x0 + leftW / 2, cz: cz - 0.1, width: Math.max(3.2, leftW - 0.28), depth: depth - 1.0, rot: 0 },
    layoutForRoom('living', Math.max(3.2, leftW - 0.28), depth - 1.0),
  )
  intended += living.intended
  placed += living.placed
  const middleW = Math.max(2.8, (px2 - px1) - 0.26)
  const kitchen = addFurnitureZone(
    builder,
    { cx: cx + width * 0.04, cz: cz - depth * 0.16, width: middleW, depth: Math.min(4.5, depth * 0.45), rot: 0 },
    layoutForRoom('kitchen', middleW, Math.min(4.5, depth * 0.45)),
  )
  intended += kitchen.intended
  placed += kitchen.placed
  if (depth >= 7.5) {
    const dining = addFurnitureZone(
      builder,
      { cx: cx + width * 0.04, cz: cz + depth * 0.27, width: middleW, depth: Math.min(3.8, depth * 0.3), rot: 0 },
      layoutForRoom('dining', middleW, Math.min(3.8, depth * 0.3)),
    )
    intended += dining.intended
    placed += dining.placed
  }
  const rightW = x1 - px2
  const bedroom = addFurnitureZone(
    builder,
    { cx: px2 + rightW / 2, cz: cz - 0.15, width: Math.max(2.9, rightW - 0.28), depth: depth - 1.0, rot: 0 },
    layoutForRoom('bedroom', Math.max(2.9, rightW - 0.28), depth - 1.0),
  )
  intended += bedroom.intended
  placed += bedroom.placed
  noteSkippedItems(builder, intended, placed)

  builder.addObject('patio-table', cx, deckZ, 0)
  builder.addObject('garden-chair', cx - 1.25, deckZ, Math.PI / 2)
  builder.addObject('garden-chair', cx + 1.25, deckZ, -Math.PI / 2)
  builder.addObject('patio-umbrella', cx, deckZ, 0)
  builder.addObject('planter-box', cx - deckW / 2 + 0.8, deckZ + deckD / 2 - 0.5, 0)
  builder.addObject('planter-box', cx + deckW / 2 - 0.8, deckZ + deckD / 2 - 0.5, 0)

  if (action.withPool) {
    const candidates: Vec2[] = [
      [cx + width / 2 + 6, cz + 1],
      [cx + width / 2 + 6, cz - 5],
      [cx - width / 2 - 6, cz + 1],
      [cx - width / 2 - 6, cz - 5],
      [cx, cz + depth / 2 + 11],
    ]
    if (!candidates.some((point) => builder.addObject('swimming-pool', point[0], point[1], 0))) {
      builder.warnings.push('泳池周围空间不足，未能放置。')
    }
  }
  if (action.withCarport) {
    const candidates: Vec2[] = [
      [cx - width / 2 - 5.5, cz - 1],
      [cx - width / 2 - 5.5, cz + 6],
      [cx + width / 2 + 5.5, cz - 6],
    ]
    if (!candidates.some((point) => builder.addObject('carport', point[0], point[1], 0))) {
      builder.warnings.push('车棚周围空间不足，未能放置。')
    }
  }
  if (action.withGarden) {
    const gardenCount = addVegetationToBuilder(builder, [cx + width / 2 + 9, cz + 2], 6, 10)
    if (gardenCount === 0) builder.warnings.push('别墅周边没有剩出足够的绿化空间。')
  }

  return outcomeFromBuilder(
    builder,
    `在 (${fmt(cx)}, ${fmt(cz)}) 建造了一栋 ${fmt(width)} × ${fmt(depth)} m 的现代别墅，包含客餐厅、卧室、厨房、木平台和屋顶`,
  )
}

function furnishRoom(action: Extract<AiAction, { type: 'furnish_room' }>): Outcome {
  const doc = useEditor.getState().doc
  const room = resolveRoom(doc, action.centerX, action.centerZ)
  if (!room) {
    throw new Error('附近没有找到由墙体围合的房间。请先让我建一个房间，或选中房间内的家具再试。')
  }
  const roomType: AiRoomType = action.roomType ?? 'living'
  const builder = new SceneBuilder(doc, doc.activeLevelId)
  const items = layoutForRoom(roomType, room.frame.width, room.frame.depth)
  const placed = placeLayout(builder, room.frame, items)
  noteSkippedItems(builder, items.length, placed)
  if (placed === 0) {
    builder.warnings.push('没有家具能被放下，房间可能已经有家具或空间太窄。')
  }
  return outcomeFromBuilder(
    builder,
    `将 ${describeFrame(room.frame)} 的房间布置为${ROOM_TYPE_LABELS[roomType]}`,
  )
}

function findIndoorPlacement(builder: SceneBuilder, modelId: string, scale: number): Vec2 | null {
  const doc = useEditor.getState().doc
  const room = resolveRoom(doc)
  if (!room) return null
  const model = getModel(modelId)
  if (!model) return null
  const frame = room.frame
  const candidates: { lx: number; lz: number; rot: number }[] = []
  const halfW = frame.width / 2
  const halfD = frame.depth / 2
  const depth = model.footprint[1]
  const wallGap = 0.16 + 0.035 + depth / 2
  if (model.wallAlign) {
    for (const offset of [0, -0.22, 0.22]) {
      candidates.push({ lx: halfW * offset * 2, lz: -halfD + wallGap, rot: 0 })
      candidates.push({ lx: halfW * offset * 2, lz: halfD - wallGap, rot: Math.PI })
      candidates.push({ lx: -halfW + wallGap, lz: halfD * offset * 2, rot: Math.PI / 2 })
      candidates.push({ lx: halfW - wallGap, lz: halfD * offset * 2, rot: -Math.PI / 2 })
    }
  } else {
    for (const step of [0, 0.22, -0.22]) {
      for (const rotOffset of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
        candidates.push({ lx: halfW * step, lz: halfD * step, rot: rotOffset })
      }
    }
  }
  for (const candidate of candidates) {
    const c = Math.cos(frame.rot)
    const s = Math.sin(frame.rot)
    const x = frame.cx + candidate.lx * c + candidate.lz * s
    const z = frame.cz - candidate.lx * s + candidate.lz * c
    const placed = builder.addObject(modelId, x, z, candidate.rot + frame.rot, scale)
    if (placed) {
      if (model.wallAlign) builder.warnings.push('家具已自动贴合房间墙面放置。')
      return [x, z]
    }
  }
  return null
}

function placeOnRoad(builder: SceneBuilder, modelId: string, anchor: Vec2, scale: number): Vec2 | null {
  const paths = builder.sameLevelEntities().filter(
    (entity): entity is PathEntity =>
      entity.kind === 'path' && (entity.pathType === 'road' || entity.pathType === 'bridge'),
  )
  paths.sort((a, b) => {
    const da = Math.hypot(a.points[0][0] - anchor[0], a.points[0][1] - anchor[1])
    const db = Math.hypot(b.points[0][0] - anchor[0], b.points[0][1] - anchor[1])
    return da - db
  })
  for (const path of paths) {
    const bundle = getPathBundle(path)
    const samples = [...bundle.samples].sort((a, b) => {
      const da = Math.hypot(a.pos.x - anchor[0], a.pos.z - anchor[1])
      const db = Math.hypot(b.pos.x - anchor[0], b.pos.z - anchor[1])
      return da - db
    })
    for (const sample of samples.slice(0, 40)) {
      const rot = Math.atan2(sample.flatTangent.x, sample.flatTangent.z)
      if (builder.addObject(modelId, sample.pos.x, sample.pos.z, rot, scale)) {
        return [sample.pos.x, sample.pos.z]
      }
    }
  }
  return null
}

function placeOnWater(builder: SceneBuilder, modelId: string, anchor: Vec2, scale: number): Vec2 | null {
  const rivers = builder
    .sameLevelEntities()
    .filter((entity): entity is PathEntity => entity.kind === 'path' && entity.pathType === 'river')
  rivers.sort((a, b) => {
    const da = Math.hypot(a.points[0][0] - anchor[0], a.points[0][1] - anchor[1])
    const db = Math.hypot(b.points[0][0] - anchor[0], b.points[0][1] - anchor[1])
    return da - db
  })
  for (const river of rivers) {
    const bundle = getPathBundle(river)
    if (river.closed) {
      let sx = 0
      let sz = 0
      for (const sample of bundle.samples) {
        sx += sample.pos.x
        sz += sample.pos.z
      }
      const x = sx / bundle.samples.length
      const z = sz / bundle.samples.length
      if (builder.addObject(modelId, x, z, 0, scale)) return [x, z]
    } else {
      for (const sample of bundle.samples) {
        const rot = Math.atan2(sample.flatTangent.x, sample.flatTangent.z)
        if (builder.addObject(modelId, sample.pos.x, sample.pos.z, rot, scale)) {
          return [sample.pos.x, sample.pos.z]
        }
      }
    }
  }
  return null
}

function placeOnGround(builder: SceneBuilder, modelId: string, anchor: Vec2, rot: number, scale: number): Vec2 | null {
  for (let radius = 0; radius <= 32; radius += 1.6) {
    const count = radius === 0 ? 1 : 10
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + radius * 0.3
      const x = anchor[0] + Math.cos(angle) * radius
      const z = anchor[1] + Math.sin(angle) * radius
      for (const rotation of [rot, rot + Math.PI / 2, rot + Math.PI, rot - Math.PI / 2]) {
        if (builder.addObject(modelId, x, z, rotation, scale)) return [x, z]
      }
    }
  }
  return null
}

function placeModel(action: Extract<AiAction, { type: 'place_model' }>): Outcome {
  const doc = useEditor.getState().doc
  const model = getModel(action.modelId)
  if (!model) throw new Error(`组件库中不存在模型 ${action.modelId}。`)
  const builder = new SceneBuilder(doc, doc.activeLevelId)
  const scale = num(action.scale, 1, 0.2, 8)
  let rot = typeof action.rot === 'number' ? action.rot : 0
  let placedAt: Vec2 | null = null
  if (typeof action.x === 'number' && typeof action.z === 'number') {
    const rx = num(action.x, 0, -270, 270)
    const rz = num(action.z, 0, -270, 270)
    if (builder.addObject(model.id, rx, rz, rot, scale)) {
      placedAt = [rx, rz]
    } else {
      placedAt = placeOnGround(builder, model.id, [rx, rz], rot, scale)
      if (placedAt) builder.warnings.push('指定位置被占用，模型已就近调整。')
    }
  }
  if (!placedAt) {
    const anchor = cameraAnchor()
    if (model.placement === 'on-road') placedAt = placeOnRoad(builder, model.id, anchor, scale)
    else if (model.placement === 'on-water') placedAt = placeOnWater(builder, model.id, anchor, scale)
    else if (model.placement === 'indoor') placedAt = findIndoorPlacement(builder, model.id, scale)
    else placedAt = placeOnGround(builder, model.id, anchor, rot, scale)
    if (placedAt) rot = builder.newEntities[builder.newEntities.length - 1]?.kind === 'object' ? (builder.newEntities[builder.newEntities.length - 1] as { rot: number }).rot : rot
  }
  if (!placedAt) {
    if (model.placement === 'indoor') {
      throw new Error('附近没有可以放置这件室内家具的房间。可以先建造一个房间，或把相机移到房间中央。')
    }
    throw new Error('附近没有合法且不重叠的放置位置。')
  }
  return outcomeFromBuilder(builder, `放置「${model.name}」于 (${fmt(placedAt[0])}, ${fmt(placedAt[1])})`)
}

const DEFAULT_WIDTHS: Record<PathType, number> = {
  road: 7.2,
  river: 9,
  bridge: 6.4,
  footpath: 2.1,
  fence: 0.16,
}

function pathOptions(action: Extract<AiAction, { type: 'draw_path' }>, pathType: PathType, closed: boolean): Omit<PathEntity, 'id' | 'levelId' | 'points'> {
  const width = num(action.width, DEFAULT_WIDTHS[pathType], pathType === 'fence' ? 0.08 : 0.8, 40)
  return {
    kind: 'path',
    pathType,
    width,
    style:
      action.style ??
      (pathType === 'river'
        ? 'river'
        : pathType === 'fence'
          ? 'wood'
          : pathType === 'footpath'
            ? 'stone'
            : 'urban'),
    sidewalk: action.sidewalk ?? pathType === 'road',
    lanes: pathType === 'road' || pathType === 'bridge' ? (action.lanes === 4 ? 4 : 2) : 2,
    bridgeHeight: num(action.bridgeHeight, 2.6, 0.8, 20),
    railings: action.railings ?? (pathType === 'bridge' || pathType === 'fence'),
    closed,
  }
}

function drawPath(action: Extract<AiAction, { type: 'draw_path' }>): Outcome {
  const doc = useEditor.getState().doc
  const builder = new SceneBuilder(doc, doc.activeLevelId)
  const pathType = action.pathType
  const anchor = cameraAnchor()
  let points: Vec2[] | undefined
  let note = ''
  let closed = Boolean(action.closed)
  if (action.points && action.points.length >= 2) {
    points = action.points.map((point) => [num(point[0], 0, -270, 270), num(point[1], 0, -270, 270)])
  } else if (pathType === 'bridge') {
    const river = builder.nearestRiver(anchor, 120)
    if (river) {
      const bundle = getPathBundle(river)
      const sample = [...bundle.samples].sort(
        (a, b) =>
          Math.hypot(a.pos.x - anchor[0], a.pos.z - anchor[1]) -
          Math.hypot(b.pos.x - anchor[0], b.pos.z - anchor[1]),
      )[0]
      const reach = river.width / 2 + 5.2
      points = [
        [sample.pos.x - sample.side.x * reach, sample.pos.z - sample.side.z * reach],
        [sample.pos.x + sample.side.x * reach, sample.pos.z + sample.side.z * reach],
      ]
      note = '跨越附近河道的桥梁'
    } else {
      const free = builder.findFreeArea(anchor, 20, 14, 2)
      if (!free) throw new Error('附近没有空间放置桥梁。')
      points = [
        [free[0] - 8, free[1]],
        [free[0] + 8, free[1]],
      ]
      builder.warnings.push('附近没有河流，已放置一座高架桥。')
      note = '高架桥'
    }
  } else {
    const defaults: Record<string, [number, number]> = {
      road: [26, 2.4],
      river: [34, 4.5],
      footpath: [14, 1.2],
      fence: [14, 0.8],
    }
    const [defaultLen, defaultCurve] = defaults[pathType]
    const length = num(action.length, defaultLen, 4, 90)
    const curve = num(action.curve, defaultCurve, -20, 20)
    const width = num(action.width, DEFAULT_WIDTHS[pathType], 0.1, 40)
    const searchW = closed ? length + width + 12 : length + 12
    const searchD = closed ? length + width + 12 : width + Math.abs(curve) * 2 + 14
    const free = builder.findFreeArea(
      [action.centerX ?? anchor[0], action.centerZ ?? anchor[1]],
      searchW,
      searchD,
      1.2,
    )
    if (!free) throw new Error('附近没有足够的空地绘制这条路径，请移动相机后再试。')
    if (closed) {
      const rx = length / 2
      const rz = Math.max(3.5, rx * 0.6)
      points = []
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        points.push([free[0] + Math.cos(angle) * rx, free[1] + Math.sin(angle) * rz])
      }
    } else if (Math.abs(curve) < 0.1) {
      points = [
        [free[0] - length / 2, free[1]],
        [free[0] + length / 2, free[1]],
      ]
    } else {
      points = [
        [free[0] - length / 2, free[1]],
        [free[0], free[1] + curve],
        [free[0] + length / 2, free[1]],
      ]
    }
    note = `${closed ? '闭合' : ''}${pathType === 'river' ? '河流' : pathType === 'road' ? '城市道路' : pathType === 'footpath' ? '步道' : '围栏'}`
  }
  const options = pathOptions(action, pathType, closed)
  const path = builder.addPath({ ...options, points: points ?? [] })
  if (!path) throw new Error(builder.warnings[builder.warnings.length - 1] ?? '路径未创建。')
  if (!note) note = pathType === 'river' ? '河流' : pathType === 'road' ? '城市道路' : pathType === 'footpath' ? '步道' : pathType === 'bridge' ? '桥梁' : '围栏'
  return outcomeFromBuilder(builder, `绘制${note}`)
}

function addPond(action: Extract<AiAction, { type: 'add_pond' }>): Outcome {
  const doc = useEditor.getState().doc
  const builder = new SceneBuilder(doc, doc.activeLevelId)
  const radius = num(action.radius, 9, 3, 32)
  const anchor: Vec2 = [action.centerX ?? cameraAnchor()[0], action.centerZ ?? cameraAnchor()[1]]
  const free = builder.findFreeArea(anchor, radius * 2 + 6, radius * 2 + 6, 1.5)
  if (!free) throw new Error('附近没有足够的空地开挖池塘。')
  const points: Vec2[] = []
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2
    const variation = 0.9 + ((i * 7) % 5) * 0.035
    points.push([free[0] + Math.cos(angle) * radius * variation, free[1] + Math.sin(angle) * radius * variation * 0.72])
  }
  const path = builder.addPath({
    kind: 'path',
    pathType: 'river',
    points,
    width: 9,
    style: 'river',
    sidewalk: false,
    lanes: 2,
    bridgeHeight: 2.6,
    railings: false,
    closed: true,
  })
  if (!path) throw new Error('池塘与已有道路或水系冲突，未能创建。')
  return outcomeFromBuilder(builder, `在 (${fmt(free[0])}, ${fmt(free[1])}) 开挖了一个池塘`)
}

function addRoof(action: Extract<AiAction, { type: 'add_roof' }>): Outcome {
  const doc = useEditor.getState().doc
  const room = resolveRoom(doc, action.x, action.z)
  if (!room) throw new Error('附近没有找到由墙体围合的房间，无法生成屋顶。')
  const existing = Object.values(doc.entities).some(
    (entity) =>
      entity.kind === 'roof' &&
      entity.levelId === doc.activeLevelId &&
      Math.abs(entity.x - room.rect.center[0]) < 1.2 &&
      Math.abs(entity.z - room.rect.center[1]) < 1.2,
  )
  if (existing) throw new Error('这个房间的上方已经有一个屋顶了。')
  const builder = new SceneBuilder(doc, doc.activeLevelId)
  const style: RoofStyle = action.style ?? 'gable'
  const finish: RoofFinish = action.finish ?? 'terracotta'
  const pitch = num(action.pitch, 28, 0, 65)
  builder.addRoof(
    [room.rect.center[0], room.rect.center[1]],
    room.frame.width + 0.9,
    room.frame.depth + 0.9,
    builder.elevation + room.maxWallHeight + 0.02,
    style,
    finish,
    pitch,
    room.frame.rot,
  )
  return outcomeFromBuilder(builder, `为 ${describeFrame(room.frame)} 的房间生成屋顶`)
}

export function addVegetationToBuilder(
  builder: SceneBuilder,
  center: Vec2,
  count: number,
  radius: number,
): number {
  const types = [
    'tree-oak',
    'tree-birch',
    'bush-round',
    'tree-maple',
    'flower-bed',
    'tree-pine',
    'bush-round',
    'tree-palm',
  ]
  const requested = Math.min(20, Math.max(1, Math.round(count)))
  let placed = 0
  for (let i = 0; i < requested; i++) {
    const modelId = types[i % types.length]
    const def = getModel(modelId)
    if (!def) continue
    const searchAnchor: Vec2 = [
      center[0] + Math.cos(i * 2.399963) * Math.min(radius * 0.35, 6),
      center[1] + Math.sin(i * 2.399963) * Math.min(radius * 0.35, 6),
    ]
    const spot = builder.findFreeArea(
      searchAnchor,
      def.footprint[0] + 1.1,
      def.footprint[1] + 1.1,
      0.35,
    )
    if (!spot) continue
    if (builder.addObject(modelId, spot[0], spot[1], (i * 0.73) % (Math.PI * 2))) {
      placed++
      continue
    }
    // A second, smaller species often fits where the first tree did not.
    const fallbackId = i % 3 === 0 ? 'bush-round' : 'flower-bed'
    const fallback = getModel(fallbackId)
    if (!fallback) continue
    const fallbackSpot = builder.findFreeArea(
      searchAnchor,
      fallback.footprint[0] + 0.7,
      fallback.footprint[1] + 0.7,
      0.25,
    )
    if (fallbackSpot && builder.addObject(fallbackId, fallbackSpot[0], fallbackSpot[1], i * 0.5)) {
      placed++
    }
  }
  return placed
}

function addVegetation(action: Extract<AiAction, { type: 'add_vegetation' }>): Outcome {
  const doc = useEditor.getState().doc
  const builder = new SceneBuilder(doc, doc.activeLevelId)
  const center: Vec2 = [action.centerX ?? cameraAnchor()[0], action.centerZ ?? cameraAnchor()[1]]
  const radius = num(action.radius, 14, 4, 45)
  const count = num(action.count, 6, 1, 20)
  const placed = addVegetationToBuilder(builder, center, count, radius)
  if (placed === 0) throw new Error('附近没有可种植的空地，或该区域已被道路和建筑占满。')
  if (placed < count) builder.warnings.push(`只有 ${placed} 株植被找到了合适的位置。`)
  return outcomeFromBuilder(builder, `在 (${fmt(center[0])}, ${fmt(center[1])}) 周边种植了 ${placed} 株植被`)
}

function modifySelected(action: Extract<AiAction, { type: 'modify_selected' }>): Outcome {
  const state = useEditor.getState()
  const selected = state.selectedId ? state.doc.entities[state.selectedId] : null
  if (!selected) throw new Error('当前没有选中的构件，请先选中要修改的对象。')
  const patch: Record<string, unknown> = {}
  if (typeof action.rotateByDeg === 'number' && Number.isFinite(action.rotateByDeg)) {
    if (
      selected.kind === 'object' ||
      selected.kind === 'slab' ||
      selected.kind === 'roof' ||
      selected.kind === 'building'
    ) {
      patch.rot = selected.rot + (action.rotateByDeg * Math.PI) / 180
    }
  }
  if (
    (action.x !== undefined || action.z !== undefined) &&
    (selected.kind === 'object' ||
      selected.kind === 'slab' ||
      selected.kind === 'roof' ||
      selected.kind === 'building')
  ) {
    if (action.x !== undefined) patch.x = num(action.x, 0, -270, 270)
    if (action.z !== undefined) patch.z = num(action.z, 0, -270, 270)
  }
  if (action.scale !== undefined && selected.kind === 'object') patch.scale = num(action.scale, 1, 0.2, 8)
  if (action.height !== undefined && selected.kind === 'wall') patch.height = num(action.height, 3.2, 0.6, 8)
  if (action.width !== undefined && (selected.kind === 'slab' || selected.kind === 'roof')) {
    patch.w = num(action.width, 1, 0.4, 120)
  }
  if (action.depth !== undefined && (selected.kind === 'slab' || selected.kind === 'roof')) {
    patch.d = num(action.depth, 1, 0.4, 120)
  }
  if (action.pitch !== undefined && selected.kind === 'roof') patch.pitch = num(action.pitch, 28, 0, 65)
  if (action.finish && selected.kind === 'roof') patch.finish = action.finish
  if (action.openAngle !== undefined || action.hinge) {
    if (selected.kind !== 'opening' || selected.type !== 'door') throw new Error('开启角度只适用于门。')
    if (action.openAngle !== undefined) patch.openAngle = num(action.openAngle, 0, -135, 135)
    if (action.hinge) patch.hinge = action.hinge
  }
  if (action.color) {
    if (selected.kind !== 'wall') throw new Error('当前颜色修改只支持墙体。')
    const color = resolveColor(action.color)
    if (!color) throw new Error(`无法识别颜色「${action.color}」。`)
    patch.color = color
  }
  if (Object.keys(patch).length === 0) throw new Error('没有可应用的修改参数。')
  state.updateEntity(selected.id, patch, false)
  return {
    notes: [
      `修改了选中的${
        selected.kind === 'wall'
          ? '墙体'
          : selected.kind === 'object'
            ? '构件'
            : selected.kind === 'opening'
              ? selected.type === 'door'
                ? '门'
                : '窗'
              : selected.kind
      }`,
    ],
    warnings: [],
    created: [],
    changed: true,
  }
}

function deleteSelected(): Outcome {
  const state = useEditor.getState()
  if (!state.selectedId) throw new Error('当前没有选中的构件。')
  const entity = state.doc.entities[state.selectedId]
  if (!entity) throw new Error('选中的构件已经不存在。')
  state.removeEntity(entity.id, false)
  return { notes: ['删除了选中的构件'], warnings: [], created: [], changed: true }
}

function clearLevel(): Outcome {
  const state = useEditor.getState()
  const levelId = state.doc.activeLevelId
  const level = state.doc.levels.find((item) => item.id === levelId)
  const ids = Object.values(state.doc.entities)
    .filter((entity) => entity.kind !== 'opening' && entity.levelId === levelId)
    .map((entity) => entity.id)
  if (ids.length === 0) {
    return { notes: ['当前楼层已经是空的'], warnings: [], created: [], changed: false }
  }
  state.removeEntities(ids, false)
  return {
    notes: [`清空了${level?.name ?? '当前楼层'}（移除 ${ids.length} 个构件及其门窗）`],
    warnings: [],
    created: [],
    changed: true,
  }
}

export function actionRequiresSelection(action: AiAction): boolean {
  return action.type === 'modify_selected' || action.type === 'delete_selected'
}

export function summarizeRoom(room: RoomHit): string {
  return `${ROOM_TYPE_LABELS.living} · ${describeFrame(room.frame)}`
}
