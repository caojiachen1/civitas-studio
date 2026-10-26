import { create } from 'zustand'
import {
  DOOR_STYLES,
  LEVEL_HEIGHT,
  PATH_PRESETS,
  WINDOW_STYLES,
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

  setTool: (tool: ToolId, modelId?: string | null) => void
  setActiveModel: (modelId: string) => void
  select: (id: string | null) => void
  setProjectName: (name: string) => void

  setWallDefaults: (patch: Partial<PlacementDefaults['wall']>) => void
  setSlabDefaults: (patch: Partial<PlacementDefaults['slab']>) => void
  setOpeningDefaults: (patch: Partial<PlacementDefaults['openings']>) => void
  setRoofDefaults: (patch: Partial<PlacementDefaults['roof']>) => void
  setPathOptions: (patch: Partial<PathOptions>) => void
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
}

const defaultSettings: EditorSettings = {
  gridSnap: true,
  angleSnap: true,
  showGrid: true,
  showRoofs: true,
  isolateLevel: false,
  shadows: true,
  quality: 'auto',
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
      const level: Level = {
        id: uid('level'),
        name: `第${s.doc.levels.length + 1}层`,
        elevation: top + LEVEL_HEIGHT,
      }
      return {
        doc: {
          ...s.doc,
          levels: [...s.doc.levels, level],
          activeLevelId: level.id,
        },
        selectedId: null,
        revision: s.revision + 1,
        dirty: true,
      }
    })
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
      selectedId: null,
      past: [],
      future: [],
      revision: s.revision + 1,
      dirty: false,
      tool: 'select',
      activeModelId: null,
    })),

  newProject: (doc = createBlankDocument()) =>
    set((s) => ({
      doc: structuredClone(doc),
      selectedId: null,
      past: [],
      future: [],
      revision: s.revision + 1,
      dirty: false,
      tool: 'select',
      activeModelId: null,
      toolOptions: { ...s.toolOptions, path: { ...s.toolOptions.path, type: 'road' } },
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
