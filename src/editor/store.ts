import { create } from 'zustand'
import {
  DOOR_STYLES,
  LEVEL_HEIGHT,
  PATH_PRESETS,
  WINDOW_STYLES,
  type BuildingSession,
  type BuildingTemplateId,
  type CustomAsset,
  type EditorDocument,
  type EditorSettings,
  type Entity,
  type Level,
  type ModelCategory,
  type PathOptions,
  type PathType,
  type PlacementDefaults,
  type RoofStyle,
  type SlabStyle,
  type ToolId,
} from './types'
import { buildLevelCopy } from './plan'
import {
  cityDocWithInterior,
  createBuildingEntity,
  getBuildingTemplate,
  interiorToWorld,
} from './buildings'

export function uid(prefix = 'e'): string {
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  return `${prefix}_${raw}`
}

export function createBlankDocument(): EditorDocument {
  const level: Level = { id: 'level-0', name: '一层', elevation: 0 }
  return {
    schemaVersion: 1,
    projectName: '未命名城市',
    levels: [level],
    activeLevelId: level.id,
    entities: {},
    entityOrder: [],
    customAssets: [],
  }
}

interface DocSnapshot {
  projectName: string
  levels: Level[]
  activeLevelId: string
  entities: Record<string, Entity>
  entityOrder: string[]
}

interface HistoryEntry {
  label: string
  doc: DocSnapshot
}

export interface EditorState {
  doc: EditorDocument
  tool: ToolId
  activeModelId: string | null
  selectedId: string | null
  toolOptions: PlacementDefaults
  settings: EditorSettings
  past: HistoryEntry[]
  future: HistoryEntry[]
  revision: number
  dirty: boolean
  buildingSession: BuildingSession | null

  setTool: (tool: ToolId, modelId?: string | null) => void
  setActiveModel: (modelId: string) => void
  select: (id: string | null) => void
  setProjectName: (name: string) => void

  setWallDefaults: (patch: Partial<PlacementDefaults['wall']>) => void
  setSlabDefaults: (patch: Partial<PlacementDefaults['slab']>) => void
  setOpeningDefaults: (patch: Partial<PlacementDefaults['openings']>) => void
  setRoofDefaults: (patch: Partial<PlacementDefaults['roof']>) => void
  setPathOptions: (patch: Partial<PathOptions>) => void
  setPlanOptions: (patch: Partial<PlacementDefaults['plan']>) => void
  placeBuilding: (templateId: BuildingTemplateId, x: number, z: number, rot?: number) => string | null
  placeSkyline: (centerX: number, centerZ: number, count?: number) => number
  enterBuilding: (id: string) => void
  exitBuilding: () => void
  setBuildingMode: (mode: BuildingSession['mode']) => void
  setPathType: (type: PathType) => void
  setDoorStyle: (style: string) => void
  setWindowStyle: (style: string) => void
  setRoofStyle: (style: RoofStyle) => void
  setSlabStyle: (style: SlabStyle) => void
  patchSettings: (patch: Partial<EditorSettings>) => void

  beginHistory: (label?: string) => void
  addEntity: (entity: Entity, history?: boolean) => void
  addEntities: (entities: Entity[], history?: boolean) => void
  updateEntity: (id: string, patch: Record<string, unknown>, history?: boolean) => void
  removeEntity: (id: string, history?: boolean) => void
  removeEntities: (ids: string[], history?: boolean) => void
  duplicateSelected: () => void
  undo: () => void
  redo: () => void

  setActiveLevel: (id: string) => void
  addLevel: (history?: boolean) => void
  duplicateLevel: (sourceLevelId: string, options?: { withFurniture?: boolean }) => boolean
  updateLevel: (id: string, patch: Partial<Level>) => void
  deleteLevel: (id: string) => void
  registerCustomAsset: (asset: CustomAsset) => void
  loadDocument: (doc: EditorDocument) => void
  newProject: (doc?: EditorDocument) => void
  markClean: () => void
}

const defaultOptions: PlacementDefaults = {
  wall: { height: LEVEL_HEIGHT, thickness: 0.16, color: '#e8e0d2' },
  slab: { style: 'wood', thickness: 0.2 },
  openings: {
    doorStyle: DOOR_STYLES[0].id,
    windowStyle: WINDOW_STYLES[0].id,
    doorOpenAngle: 0,
    doorHinge: 'left',
  },
  roof: { style: 'gable', finish: 'terracotta', pitch: 32, overhang: 0.45 },
  path: {
    type: 'road',
    width: PATH_PRESETS.road.width,
    style: PATH_PRESETS.road.style,
    sidewalk: true,
    lanes: 2,
    bridgeHeight: 2.6,
    railings: true,
  },
  plan: {
    autoSlab: true,
    autoDoor: true,
    autoWindow: true,
    autoRoof: false,
  },
}

const defaultSettings: EditorSettings = {
  gridSnap: true,
  angleSnap: true,
  showGrid: true,
  showRoofs: true,
  isolateLevel: false,
  planMode: false,
  shadows: true,
  quality: 'auto',
  visualStyle: 'mono',
}

function takeSnapshot(state: EditorState): DocSnapshot {
  return {
    projectName: state.doc.projectName,
    levels: structuredClone(state.doc.levels),
    activeLevelId: state.doc.activeLevelId,
    entities: structuredClone(state.doc.entities),
    entityOrder: [...state.doc.entityOrder],
  }
}

function withSnapshot(state: EditorState, snap: DocSnapshot): Partial<EditorState> {
  const selected = state.selectedId && snap.entities[state.selectedId] ? state.selectedId : null
  const hasLevel = snap.levels.some((l) => l.id === snap.activeLevelId)
  return {
    doc: {
      ...state.doc,
      projectName: snap.projectName,
      levels: snap.levels,
      activeLevelId: hasLevel ? snap.activeLevelId : (snap.levels[0]?.id ?? 'level-0'),
      entities: snap.entities,
      entityOrder: snap.entityOrder,
    },
    selectedId: selected,
    revision: state.revision + 1,
    dirty: true,
  }
}

export const useEditor = create<EditorState>()((set, get) => ({
  doc: createBlankDocument(),
  tool: 'select',
  activeModelId: null,
  selectedId: null,
  toolOptions: defaultOptions,
  settings: defaultSettings,
  past: [],
  future: [],
  revision: 0,
  dirty: false,
  buildingSession: null,

  setTool: (tool, modelId = null) =>
    set((s) => ({
      tool,
      activeModelId: tool === 'object' ? (modelId ?? s.activeModelId) : null,
      selectedId: tool === 'select' ? s.selectedId : null,
    })),

  setActiveModel: (modelId) => set({ tool: 'object', activeModelId: modelId, selectedId: null }),

  select: (id) =>
    set((s) => ({
      selectedId: id,
      tool: id && s.tool === 'erase' ? 'select' : s.tool,
      activeModelId: id ? null : s.activeModelId,
    })),

  setProjectName: (name) =>
    set((s) => ({ doc: { ...s.doc, projectName: name }, dirty: true, revision: s.revision + 1 })),

  setWallDefaults: (patch) => set((s) => ({ toolOptions: { ...s.toolOptions, wall: { ...s.toolOptions.wall, ...patch } } })),
  setSlabDefaults: (patch) => set((s) => ({ toolOptions: { ...s.toolOptions, slab: { ...s.toolOptions.slab, ...patch } } })),
  setOpeningDefaults: (patch) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, openings: { ...s.toolOptions.openings, ...patch } } })),
  setRoofDefaults: (patch) => set((s) => ({ toolOptions: { ...s.toolOptions, roof: { ...s.toolOptions.roof, ...patch } } })),
  setPathOptions: (patch) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, path: { ...s.toolOptions.path, ...patch } } })),
  setPlanOptions: (patch) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, plan: { ...s.toolOptions.plan, ...patch } } })),

  placeBuilding: (templateId, x, z, rot = 0) => {
    const state = get()
    if (state.buildingSession) return null
    const level = state.doc.levels.find((item) => item.id === state.doc.activeLevelId) ?? state.doc.levels[0]
    if (!level) return null
    const template = getBuildingTemplate(templateId)
    const count = Object.values(state.doc.entities).filter((entity) => entity.kind === 'building').length
    const entity = createBuildingEntity(
      templateId,
      level.id,
      x,
      z,
      rot,
      `${template.name} ${count + 1}`,
    )
    state.beginHistory('放置建筑')
    state.addEntity(entity, false)
    state.select(entity.id)
    return entity.id
  },

  placeSkyline: (centerX, centerZ, count = 6) => {
    const state = get()
    if (state.buildingSession) return 0
    const level = state.doc.levels.find((item) => item.id === state.doc.activeLevelId) ?? state.doc.levels[0]
    if (!level) return 0
    const picks: { id: BuildingTemplateId; floors: number }[] = [
      { id: 'tower', floors: 12 },
      { id: 'tower', floors: 8 },
      { id: 'office', floors: 6 },
      { id: 'tower', floors: 16 },
      { id: 'townhouse', floors: 3 },
      { id: 'tower', floors: 10 },
      { id: 'villa', floors: 2 },
      { id: 'tower', floors: 14 },
    ]
    const total = Math.max(3, Math.min(picks.length, Math.round(count)))
    const selected = picks.slice(0, total)
    const gap = 5
    const widths = selected.map((pick) => getBuildingTemplate(pick.id).width)
    const span = widths.reduce((sum, width) => sum + width, 0) + gap * (total - 1)
    let cursor = centerX - span / 2
    const entities = selected.map((pick, index) => {
      const width = widths[index]
      const entity = createBuildingEntity(
        pick.id,
        level.id,
        cursor + width / 2,
        centerZ,
        0,
        `${getBuildingTemplate(pick.id).name} ${index + 1}`,
        pick.floors,
      )
      cursor += width + gap
      return entity
    })
    state.beginHistory('生成天际线')
    state.addEntities(entities, false)
    state.select(null)
    return entities.length
  },

  enterBuilding: (id) => {
    const state = get()
    if (state.buildingSession) return
    const cityDoc = structuredClone(state.doc)
    const building = cityDoc.entities[id]
    if (!building || building.kind !== 'building') return
    const level = cityDoc.levels.find((item) => item.id === building.levelId)
    const baseElevation = level?.elevation ?? 0
    const world = interiorToWorld(building.interior, building, baseElevation, cityDoc.customAssets)
    if (world.levels.length === 0) return
    const session: BuildingSession = {
      buildingId: id,
      name: building.name,
      templateId: building.templateId,
      cityDoc,
      cityLevelId: cityDoc.activeLevelId,
      baseElevation,
      center: [building.x, building.z],
      width: building.width,
      depth: building.depth,
      floors: building.floors,
      floorHeight: building.floorHeight,
      shellWallIds: [...building.interior.shellWallIds],
      mode: 'interior',
    }
    set((s) => ({
      doc: world,
      buildingSession: session,
      activeLevelId: world.levels[0].id,
      selectedId: null,
      tool: 'select',
      activeModelId: null,
      past: [],
      future: [],
      revision: s.revision + 1,
      settings: { ...s.settings, planMode: false },
    }))
  },

  exitBuilding: () => {
    const state = get()
    const session = state.buildingSession
    if (!session) return
    const city = cityDocWithInterior(session, state.doc)
    set((s) => ({
      doc: city,
      buildingSession: null,
      activeLevelId: session.cityLevelId,
      selectedId: session.buildingId,
      tool: 'select',
      activeModelId: null,
      past: [],
      future: [],
      revision: s.revision + 1,
      dirty: true,
      settings: { ...s.settings, planMode: false },
    }))
  },

  setBuildingMode: (mode) =>
    set((s) =>
      s.buildingSession
        ? { buildingSession: { ...s.buildingSession, mode } }
        : {},
    ),

  setPathType: (type) =>
    set((s) => {
      const preset = PATH_PRESETS[type]
      return {
        tool: 'path',
        selectedId: null,
        toolOptions: {
          ...s.toolOptions,
          path: {
            ...s.toolOptions.path,
            type,
            width: preset.width,
            style: preset.style,
            railings: type === 'bridge' || type === 'fence' ? true : s.toolOptions.path.railings,
          },
        },
      }
    }),
  setDoorStyle: (style) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, openings: { ...s.toolOptions.openings, doorStyle: style } } })),
  setWindowStyle: (style) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, openings: { ...s.toolOptions.openings, windowStyle: style } } })),
  setRoofStyle: (style) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, roof: { ...s.toolOptions.roof, style } } })),
  setSlabStyle: (style) =>
    set((s) => ({ toolOptions: { ...s.toolOptions, slab: { ...s.toolOptions.slab, style } } })),
  patchSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

  beginHistory: (label = '编辑') =>
    set((s) => ({
      past: [...s.past.slice(-49), { label, doc: takeSnapshot(s) }],
      future: [],
    })),

  addEntity: (entity, history = true) => {
    if (history) get().beginHistory('添加')
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [entity.id]: entity },
        entityOrder: [...s.doc.entityOrder, entity.id],
      },
      revision: s.revision + 1,
      dirty: true,
    }))
  },

  addEntities: (entities, history = true) => {
    if (entities.length === 0) return
    if (history) get().beginHistory('添加')
    set((s) => {
      const map = { ...s.doc.entities }
      for (const entity of entities) map[entity.id] = entity
      return {
        doc: { ...s.doc, entities: map, entityOrder: [...s.doc.entityOrder, ...entities.map((e) => e.id)] },
        revision: s.revision + 1,
        dirty: true,
      }
    })
  },

  updateEntity: (id, patch, history = false) => {
    const existing = get().doc.entities[id]
    if (!existing) return
    if (history) get().beginHistory('修改')
    set((s) => ({
      doc: {
        ...s.doc,
        entities: { ...s.doc.entities, [id]: { ...existing, ...patch } as Entity },
      },
      revision: s.revision + 1,
      dirty: true,
    }))
  },

  removeEntity: (id, history = true) => get().removeEntities([id], history),

  removeEntities: (ids, history = true) => {
    if (ids.length === 0) return
    if (history) get().beginHistory('删除')
    set((s) => {
      const entities = { ...s.doc.entities }
      const toRemove = new Set(ids)
      for (const id of ids) {
        const entity = entities[id]
        if (entity?.kind === 'wall') {
          for (const [otherId, other] of Object.entries(entities)) {
            if (other.kind === 'opening' && other.wallId === id) toRemove.add(otherId)
          }
        }
      }
      for (const id of toRemove) delete entities[id]
      return {
        doc: {
          ...s.doc,
          entities,
          entityOrder: s.doc.entityOrder.filter((id) => !toRemove.has(id)),
        },
        selectedId: s.selectedId && toRemove.has(s.selectedId) ? null : s.selectedId,
        revision: s.revision + 1,
        dirty: true,
      }
    })
  },

  duplicateSelected: () => {
    const s = get()
    const source = s.selectedId ? s.doc.entities[s.selectedId] : null
    if (!source || source.kind === 'opening') return
    s.beginHistory('复制')
    const clone = structuredClone(source)
    clone.id = uid(source.kind)
    if (clone.kind === 'object') {
      clone.x += 0.7
      clone.z += 0.7
    } else if (clone.kind === 'slab' || clone.kind === 'roof') {
      clone.x += 0.7
      clone.z += 0.7
    } else if (clone.kind === 'building') {
      clone.x += clone.width + 4
      clone.name = `${clone.name} 副本`
    } else if (clone.kind === 'wall') {
      clone.a = [clone.a[0] + 0.7, clone.a[1] + 0.7]
      clone.b = [clone.b[0] + 0.7, clone.b[1] + 0.7]
    } else if (clone.kind === 'path') {
      clone.points = clone.points.map((p) => [p[0] + 0.7, p[1] + 0.7] as [number, number])
    }
    set((prev) => ({
      doc: {
        ...prev.doc,
        entities: { ...prev.doc.entities, [clone.id]: clone },
        entityOrder: [...prev.doc.entityOrder, clone.id],
      },
      selectedId: clone.id,
      revision: prev.revision + 1,
      dirty: true,
    }))
  },

  undo: () =>
    set((s) => {
      const previous = s.past[s.past.length - 1]
      if (!previous) return s
      const current = takeSnapshot(s)
      return {
        ...withSnapshot(s, previous.doc),
        past: s.past.slice(0, -1),
        future: [{ label: previous.label, doc: current }, ...s.future].slice(0, 50),
      }
    }),

  redo: () =>
    set((s) => {
      const next = s.future[0]
      if (!next) return s
      const current = takeSnapshot(s)
      return {
        ...withSnapshot(s, next.doc),
        past: [...s.past.slice(-49), { label: next.label, doc: current }],
        future: s.future.slice(1),
      }
    }),

  setActiveLevel: (id) =>
    set((s) => ({ doc: { ...s.doc, activeLevelId: id }, selectedId: null })),

  addLevel: (history = true) => {
    if (history) get().beginHistory('新增楼层')
    set((s) => {
      const top = s.doc.levels.reduce((max, l) => Math.max(max, l.elevation), 0)
      const step = s.buildingSession?.floorHeight ?? LEVEL_HEIGHT
      const level: Level = {
        id: uid('level'),
        name: `第${s.doc.levels.length + 1}层`,
        elevation: top + step,
      }
      let entities = s.doc.entities
      if (s.buildingSession) {
        entities = { ...entities }
        for (const [id, entity] of Object.entries(entities)) {
          if (entity.kind !== 'roof') continue
          const roofLevel = s.doc.levels.find((item) => item.id === entity.levelId)
          if (!roofLevel || Math.abs(roofLevel.elevation - top) > 0.001) continue
          entities[id] = { ...entity, levelId: level.id, eaveY: entity.eaveY + step }
        }
      }
      return {
        doc: {
          ...s.doc,
          levels: [...s.doc.levels, level],
          activeLevelId: level.id,
          entities,
        },
        selectedId: null,
        revision: s.revision + 1,
        dirty: true,
      }
    })
  },

  duplicateLevel: (sourceLevelId, options) => {
    const state = get()
    const source = state.doc.levels.find((level) => level.id === sourceLevelId)
    if (!source) return false
    const targetId = uid('level')
    const copies = buildLevelCopy(
      Object.values(state.doc.entities),
      sourceLevelId,
      targetId,
      options?.withFurniture ?? false,
    )
    if (copies.length === 0) return false
    get().beginHistory('复制楼层平面')
    set((s) => {
      const top = s.doc.levels.reduce((max, level) => Math.max(max, level.elevation), 0)
      const level: Level = {
        id: targetId,
        name: `第${s.doc.levels.length + 1}层`,
        elevation: top + (s.buildingSession?.floorHeight ?? LEVEL_HEIGHT),
      }
      const entities = { ...s.doc.entities }
      for (const entity of copies) entities[entity.id] = entity
      return {
        doc: {
          ...s.doc,
          levels: [...s.doc.levels, level],
          activeLevelId: level.id,
          entities,
          entityOrder: [...s.doc.entityOrder, ...copies.map((entity) => entity.id)],
        },
        selectedId: null,
        revision: s.revision + 1,
        dirty: true,
      }
    })
    return true
  },

  updateLevel: (id, patch) =>
    set((s) => ({
      doc: { ...s.doc, levels: s.doc.levels.map((l) => (l.id === id ? { ...l, ...patch } : l)) },
      revision: s.revision + 1,
      dirty: true,
    })),

  deleteLevel: (id) => {
    const snapshot = get()
    if (snapshot.doc.levels.length <= 1) return
    const relevant = Object.values(snapshot.doc.entities).filter(
      (e) => e.kind !== 'opening' && e.levelId === id,
    )
    const wallIds = new Set(relevant.filter((e) => e.kind === 'wall').map((e) => e.id))
    const openings = Object.values(snapshot.doc.entities).filter(
      (e) => e.kind === 'opening' && wallIds.has(e.wallId),
    )
    if (relevant.length + openings.length > 0) return
    get().beginHistory('删除楼层')
    set((s) => {
      const levels = s.doc.levels.filter((l) => l.id !== id)
      return {
        doc: {
          ...s.doc,
          levels,
          activeLevelId: s.doc.activeLevelId === id ? levels[0].id : s.doc.activeLevelId,
        },
        revision: s.revision + 1,
        dirty: true,
      }
    })
  },

  registerCustomAsset: (asset) =>
    set((s) => ({
      doc: { ...s.doc, customAssets: [...s.doc.customAssets.filter((a) => a.id !== asset.id), asset] },
      revision: s.revision + 1,
      dirty: true,
    })),

  loadDocument: (doc) =>
    set((s) => ({
      doc: structuredClone(doc),
      buildingSession: null,
      selectedId: null,
      past: [],
      future: [],
      revision: s.revision + 1,
      dirty: false,
      tool: 'select',
      activeModelId: null,
      settings: { ...s.settings, planMode: false },
    })),

  newProject: (doc = createBlankDocument()) =>
    set((s) => ({
      doc: structuredClone(doc),
      buildingSession: null,
      selectedId: null,
      past: [],
      future: [],
      revision: s.revision + 1,
      dirty: false,
      tool: 'select',
      activeModelId: null,
      toolOptions: { ...s.toolOptions, path: { ...s.toolOptions.path, type: 'road' } },
      settings: { ...s.settings, planMode: false },
    })),

  markClean: () => set({ dirty: false }),
}))

export const MODEL_CATEGORY_LABELS: Record<ModelCategory, string> = {
  living: '客厅',
  bedroom: '卧室',
  dining: '餐厅',
  kitchen: '厨房',
  bathroom: '卫浴',
  office: '书房',
  laundry: '洗衣房',
  outdoor: '户外生活',
  vegetation: '植被园艺',
  street: '街道设施',
  vehicles: '交通工具',
  structure: '结构构件',
  custom: '导入模型',
}
