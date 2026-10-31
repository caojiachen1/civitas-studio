import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js'
import { STLExporter } from 'three/addons/exporters/STLExporter.js'
import { createBlankDocument, useEditor, uid } from '../editor/store'
import { BUILDING_TEMPLATES } from '../editor/buildings'
import { createSampleDocument, SAMPLE_VIEW } from '../editor/sample'
import { getEditorScene } from '../editor/engineRef'
import { useRuntime } from '../editor/runtime'
import { auditAutomationIds } from '../ui/automation'
import { isTauriHost } from '../editor/platform'
import {
  getProjectPayload,
  buildExportScene,
  importModelFromBytes,
  parseProjectText,
  type ExportFormat,
} from '../editor/fileIO'
import { CATALOG_MODELS, MODEL_MAP, getModel, getModelFootprints } from '../models/registry'
import { loadCustomAsset } from '../models/custom'
import { buildSceneContext, modelName } from '../ai/context'
import { executePlan, planHasDestructive, planShouldFocus } from '../ai/executor'
import { resolveColor } from '../editor/colors'
import { parsePlanContent } from '../ai/planParse'
import type { AiAction, AiActionPlan, AiExecutionResult, AiRoomType } from '../ai/types'
import { ROOM_TYPE_LABELS } from '../ai/types'
import { completeLevelRooms, roomCompletionSummary } from '../editor/plan'
import { cutFloorOpening } from '../editor/slabHoles'
import { slabHoleFits } from '../editor/builders/slabs'
import {
  checkObjectPlacement,
  checkOpeningPlacement,
  checkPathPlacement,
  checkWallPlacement,
} from '../editor/validation'
import { captureViewNames, captureViews } from '../editor/capture'
import { createOpeningEntity, createSlabEntity, createWallEntity } from '../editor/entityOps'
import { DOOR_STYLES, SLAB_STYLES, WINDOW_STYLES } from '../editor/types'
import type {
  BuildingTemplateId,
  EditorSettings,
  Entity,
  ModelDef,
  ObjectEntity,
  OpeningEntity,
  PathEntity,
  RoofEntity,
  RoofFinish,
  SlabEntity,
  SlabHole,
  SlabStyle,
  Vec2,
  WallEntity,
} from '../editor/types'

export interface McpToolSpec {
  name: string
  title: string
  description: string
  inputSchema: Record<string, unknown>
}

type Args = Record<string, unknown>

const num = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback
}

const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback)
const bool = (value: unknown, fallback = false) => (typeof value === 'boolean' ? value : fallback)

function getContext() {
  const state = useEditor.getState()
  const target = getEditorScene()?.getView().target ?? [0, 0, 0]
  return buildSceneContext(state.doc, state.doc.activeLevelId, [target[0], target[2]], state.selectedId)
}

function selectedPayload() {
  const state = useEditor.getState()
  const entity = state.selectedId ? state.doc.entities[state.selectedId] : null
  if (!entity) return null
  if (entity.kind === 'building') {
    return {
      id: entity.id,
      kind: entity.kind,
      levelId: entity.levelId,
      name: entity.name,
      templateId: entity.templateId,
      x: entity.x,
      z: entity.z,
      rot: entity.rot,
      width: entity.width,
      depth: entity.depth,
      floors: entity.floors,
      floorHeight: entity.floorHeight,
      interiorEntityCount: Object.keys(entity.interior.entities).length,
      displayName: entity.name,
    }
  }
  return {
    ...entity,
    displayName:
      entity.kind === 'object'
        ? modelName(entity.modelId)
        : entity.kind === 'wall'
          ? '墙体'
          : entity.kind === 'path'
            ? '路径'
            : entity.kind,
  }
}

function sceneSummary() {
  const state = useEditor.getState()
  const counts: Record<string, number> = {}
  for (const entity of Object.values(state.doc.entities)) {
    counts[entity.kind] = (counts[entity.kind] ?? 0) + 1
  }
  return {
    projectName: state.doc.projectName,
    counts,
    activeLevelId: state.doc.activeLevelId,
    levels: state.doc.levels,
    selectedId: state.selectedId,
    tool: state.tool,
    dirty: state.dirty,
    settings: state.settings,
    buildingSession: state.buildingSession
      ? {
          buildingId: state.buildingSession.buildingId,
          name: state.buildingSession.name,
          mode: state.buildingSession.mode,
          floors: state.buildingSession.floors,
        }
      : null,
    history: {
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      undo: state.past.slice(-6).map((entry) => entry.label),
      redo: state.future.slice(0, 6).map((entry) => entry.label),
    },
  }
}

function executeForMcp(
  actions: AiAction[],
  reply: string,
  allowDestructive = false,
): AiExecutionResult & { scene?: ReturnType<typeof sceneSummary> } {
  const plan: AiActionPlan = { reply, actions, mode: 'local' }
  const result = executePlan(plan, { allowDestructive })
  if (result.ok && planShouldFocus(plan) && result.focusIds.length > 0) {
    window.requestAnimationFrame(() => getEditorScene()?.focusEntityIds(result.focusIds))
  }
  return { ...result, scene: sceneSummary() }
}

function toolResult(payload: unknown, summary?: string) {
  return { ok: true, summary, data: payload, scene: sceneSummary() }
}

function errorResult(message: string) {
  return { ok: false, error: message, scene: sceneSummary() }
}

function entitySummary(entity: Entity) {
  const base: Record<string, unknown> = { id: entity.id, kind: entity.kind }
  if (entity.kind !== 'opening') base.levelId = entity.levelId
  if (entity.kind === 'object') {
    base.modelId = entity.modelId
    base.name = modelName(entity.modelId)
    base.x = entity.x
    base.z = entity.z
    base.rot = entity.rot
    base.scale = entity.scale
    base.scaleY = entity.scaleY ?? 1
  } else if (entity.kind === 'slab' || entity.kind === 'roof') {
    base.x = entity.x
    base.z = entity.z
    base.w = entity.w
    base.d = entity.d
    base.rot = entity.rot
    base.style = entity.kind === 'slab' ? entity.style : entity.style
    if (entity.kind === 'slab') base.holeCount = (entity.holes ?? []).length
  } else if (entity.kind === 'wall') {
    base.a = entity.a
    base.b = entity.b
    base.height = entity.height
    base.color = entity.color
  } else if (entity.kind === 'path') {
    base.pathType = entity.pathType
    base.points = entity.points
    base.width = entity.width
    base.closed = entity.closed
  } else if (entity.kind === 'building') {
    base.name = entity.name
    base.templateId = entity.templateId
    base.x = entity.x
    base.z = entity.z
    base.rot = entity.rot
    base.floors = entity.floors
    base.width = entity.width
    base.depth = entity.depth
  } else if (entity.kind === 'opening') {
    base.type = entity.type
    base.wallId = entity.wallId
    base.style = entity.style
    base.width = entity.width
    base.height = entity.height
    if (entity.type === 'door') {
      base.openAngle = entity.openAngle ?? 0
      base.hinge = entity.hinge ?? 'left'
    }
  }
  return base
}

function screenshot(maxSize = 1280): {
  mime: string
  width: number
  height: number
  images: { label: string; mime: string; width: number; height: number; data: string }[]
} {
  const source = document.querySelector('canvas.scene-canvas') as HTMLCanvasElement | null
  if (!source) throw new Error('场景画布尚未就绪。')
  const ratio = Math.min(1, maxSize / Math.max(source.width, source.height))
  const width = Math.max(1, Math.round(source.width * ratio))
  const height = Math.max(1, Math.round(source.height * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建截图画布。')
  ctx.fillStyle = '#202020'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(source, 0, 0, width, height)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.86)
  return {
    mime: 'image/jpeg',
    width,
    height,
    images: [
      {
        label: 'current',
        mime: 'image/jpeg',
        width,
        height,
        data: dataUrl.split(',')[1] ?? '',
      },
    ],
  }
}

function base64OfBytes(bytes: Uint8Array) {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

async function saveBytes(path: string, bytes: Uint8Array) {
  if (!isTauriHost()) throw new Error('文件写入仅支持桌面版。')
  const { invoke } = await import('@tauri-apps/api/core')
  await invoke('save_file', { path, base64Data: base64OfBytes(bytes) })
}

async function exportBytes(format: ExportFormat): Promise<{ bytes: Uint8Array; ext: string }> {
  const doc = useEditor.getState().doc
  const root = await buildExportScene(doc)
  if (root.children.length === 0) throw new Error('场景为空，无法导出。')
  if (format === 'glb' || format === 'gltf') {
    const exporter = new GLTFExporter()
    const result = await exporter.parseAsync(root, {
      binary: format === 'glb',
      onlyVisible: true,
      maxTextureSize: 2048,
    })
    if (format === 'glb') {
      if (!(result instanceof ArrayBuffer)) throw new Error('GLB 生成失败。')
      return { bytes: new Uint8Array(result), ext: 'glb' }
    }
    return { bytes: new TextEncoder().encode(JSON.stringify(result, null, 2)), ext: 'gltf' }
  }
  if (format === 'obj') {
    const text = new OBJExporter().parse(root)
    return { bytes: new TextEncoder().encode(text), ext: 'obj' }
  }
  const text = new STLExporter().parse(root, { binary: false }) as string
  return { bytes: new TextEncoder().encode(text), ext: 'stl' }
}

async function readFileBytes(path: string): Promise<ArrayBuffer> {
  if (!isTauriHost()) throw new Error('按路径读取文件仅支持桌面版。')
  const { invoke } = await import('@tauri-apps/api/core')
  const base64 = await invoke<string>('read_file_base64', { path })
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

function asPoint(value: unknown): Vec2 | null {
  if (!Array.isArray(value) || value.length < 2) return null
  const x = Number(value[0])
  const z = Number(value[1])
  if (!Number.isFinite(x) || !Number.isFinite(z)) return null
  return [Math.min(280, Math.max(-280, x)), Math.min(280, Math.max(-280, z))]
}

function asPointList(value: unknown): Vec2[] | null {
  if (!Array.isArray(value)) return null
  const points: Vec2[] = []
  for (const entry of value.slice(0, 40)) {
    const point = asPoint(entry)
    if (point) points.push(point)
  }
  return points.length >= 2 ? points : null
}

function asVec3(value: unknown): [number, number, number] | null {
  if (!Array.isArray(value) || value.length < 3) return null
  const vector = [Number(value[0]), Number(value[1]), Number(value[2])]
  return vector.every((item) => Number.isFinite(item)) ? (vector as [number, number, number]) : null
}

function parseHoles(value: unknown): SlabHole[] | null {
  if (value === undefined) return null
  if (!Array.isArray(value) || value.length > 12) return null
  const holes: SlabHole[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') return null
    const input = entry as Args
    const x = Number(input.x)
    const z = Number(input.z)
    const w = Number(input.w ?? input.width)
    const d = Number(input.d ?? input.depth)
    if (![x, z, w, d].every((item) => Number.isFinite(item))) return null
    if (w < 0.2 || d < 0.2) return null
    holes.push({
      id: typeof input.id === 'string' && input.id.trim() ? input.id.trim().slice(0, 64) : uid('hole'),
      x: Math.min(400, Math.max(-400, x)),
      z: Math.min(400, Math.max(-400, z)),
      w: Math.min(40, w),
      d: Math.min(40, d),
      rot: Number.isFinite(Number(input.rot)) ? Number(input.rot) : 0,
    })
  }
  return holes
}

function levelIdFromArgs(args: Args): string {
  const state = useEditor.getState()
  return typeof args.levelId === 'string' &&
    state.doc.levels.some((level) => level.id === args.levelId)
    ? args.levelId
    : state.doc.activeLevelId
}

function findLevel(args: Args) {  const state = useEditor.getState()
  if (typeof args.levelId === 'string') {
    return state.doc.levels.find((level) => level.id === args.levelId) ?? null
  }
  if (typeof args.index === 'number') {
    return state.doc.levels[Math.round(num(args.index, 0, 0, state.doc.levels.length - 1))] ?? null
  }
  return state.doc.levels.find((level) => level.id === state.doc.activeLevelId) ?? null
}

function objectModel(modelId: string): ModelDef | null {
  const builtin = getModel(modelId)
  if (builtin) return builtin
  const asset = useEditor.getState().doc.customAssets.find((item) => item.id === modelId)
  if (!asset) return null
  return {
    id: asset.id,
    name: asset.name,
    category: 'custom',
    footprint: asset.footprint,
    height: asset.height,
    placement: 'any',
    parts: [],
  }
}

function objectFootprints(): Map<string, [number, number]> {
  const footprints = getModelFootprints()
  for (const asset of useEditor.getState().doc.customAssets) footprints.set(asset.id, asset.footprint)
  return footprints
}

function placeObject(modelId: string, x: number, z: number, rot: number, scale: number, scaleY = 1) {
  const state = useEditor.getState()
  const model = objectModel(modelId)
  if (!model) return { error: `未知 modelId：${modelId}` }
  const check = checkObjectPlacement(
    model,
    x,
    z,
    rot,
    scale,
    state.doc.activeLevelId,
    Object.values(state.doc.entities),
    objectFootprints(),
  )
  if (!check.valid) return { error: `无法放置：${check.reason}` }
  const entity: ObjectEntity = {
    id: uid('obj'),
    kind: 'object',
    levelId: state.doc.activeLevelId,
    modelId,
    x,
    z,
    rot,
    scale,
    scaleY: scaleY === 1 ? undefined : scaleY,
  }
  state.beginHistory('放置模型')
  state.addEntity(entity, false)
  state.select(entity.id)
  return { entity }
}

interface EntityPatchOutcome {
  patch?: Record<string, unknown>
  error?: string
}

function buildEntityPatch(entity: Entity, args: Args): EntityPatchOutcome {
  const state = useEditor.getState()
  const entities = Object.values(state.doc.entities)
  const patch: Record<string, unknown> = {}
  const levelId =
    typeof args.levelId === 'string'
      ? state.doc.levels.some((level) => level.id === args.levelId)
        ? args.levelId
        : '__invalid__'
      : undefined
  if (levelId === '__invalid__') return { error: '未知 levelId。' }
  const rotation =
    args.rotDeg !== undefined
      ? (num(args.rotDeg, 0, -3600, 3600) * Math.PI) / 180
      : args.rot !== undefined
        ? num(args.rot, 0, -Math.PI * 20, Math.PI * 20)
        : undefined

  if (entity.kind === 'wall') {
    const a = args.a !== undefined ? asPoint(args.a) : entity.a
    const b = args.b !== undefined ? asPoint(args.b) : entity.b
    if (!a || !b) return { error: '墙体控制点必须是 [x, z]。' }
    const next: WallEntity = {
      ...entity,
      a,
      b,
      height: args.height !== undefined ? num(args.height, entity.height, 0.6, 8) : entity.height,
      thickness:
        args.thickness !== undefined ? num(args.thickness, entity.thickness, 0.06, 0.6) : entity.thickness,
      color: typeof args.color === 'string' ? resolveColor(args.color) ?? entity.color : entity.color,
      levelId: levelId ?? entity.levelId,
    }
    const check = checkWallPlacement(next.a, next.b, next.thickness, next.levelId, entities, entity.id)
    if (!check.valid) return { error: check.reason }
    Object.assign(patch, {
      a: next.a,
      b: next.b,
      height: next.height,
      thickness: next.thickness,
      color: next.color,
      levelId: next.levelId,
    })
    return { patch }
  }

  if (entity.kind === 'opening') {
    const wall = state.doc.entities[entity.wallId]
    if (!wall || wall.kind !== 'wall') return { error: '门窗所属墙体不存在。' }
    const styles = entity.type === 'door' ? DOOR_STYLES : WINDOW_STYLES
    const style =
      typeof args.style === 'string' ? styles.find((item) => item.id === args.style) ?? null : null
    if (args.style !== undefined && !style) return { error: `未知门窗样式：${str(args.style)}` }
    const base = style ?? styles.find((item) => item.id === entity.style) ?? styles[0]
    const width = args.width !== undefined ? num(args.width, entity.width, 0.3, 8) : style ? base.width : entity.width
    const height =
      args.height !== undefined ? num(args.height, entity.height, 0.3, 4) : style ? base.height : entity.height
    const sill =
      entity.type === 'window'
        ? args.sill !== undefined
          ? num(args.sill, entity.sill, 0, 3)
          : style
            ? (base as { sill: number }).sill
            : entity.sill
        : 0
    const wallLength = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
    const offset =
      args.offset !== undefined
        ? num(args.offset, entity.offset, 0.1, wallLength - 0.1)
        : style
          ? Math.min(wallLength - width / 2 - 0.1, Math.max(width / 2 + 0.1, entity.offset))
          : entity.offset
    const check = checkOpeningPlacement(
      wall,
      offset,
      width,
      height,
      sill,
      entities.filter((item) => item.kind === 'opening'),
      entity.id,
    )
    if (!check.valid) return { error: check.reason }
    patch.offset = offset
    patch.width = width
    patch.height = height
    patch.sill = sill
    if (style) patch.style = style.id
    if (args.openAngle !== undefined) patch.openAngle = num(args.openAngle, 0, -135, 135)
    if (args.hinge === 'left' || args.hinge === 'right') patch.hinge = args.hinge
    return { patch }
  }

  if (entity.kind === 'object') {
    const x = args.x !== undefined ? num(args.x, entity.x, -280, 280) : entity.x
    const z = args.z !== undefined ? num(args.z, entity.z, -280, 280) : entity.z
    const rot = rotation ?? entity.rot
    const scale = args.scale !== undefined ? num(args.scale, entity.scale, 0.2, 8) : entity.scale
    const scaleY =
      args.scaleY !== undefined ? num(args.scaleY, entity.scaleY ?? 1, 0.2, 6) : (entity.scaleY ?? 1)
    const nextLevelId = levelId ?? entity.levelId
    const model = objectModel(entity.modelId)
    if (model) {
      const check = checkObjectPlacement(
        model,
        x,
        z,
        rot,
        scale,
        nextLevelId,
        entities,
        objectFootprints(),
        entity.id,
      )
      if (!check.valid) return { error: check.reason }
    }
    Object.assign(patch, { x, z, rot, scale, scaleY: scaleY === 1 ? undefined : scaleY, levelId: nextLevelId })
    return { patch }
  }

  if (entity.kind === 'slab') {
    const style = typeof args.style === 'string' ? args.style : ''
    if (style && !SLAB_STYLES.some((item) => item.id === style)) return { error: `未知楼板材质：${style}` }
    const x = args.x !== undefined ? num(args.x, entity.x, -280, 280) : entity.x
    const z = args.z !== undefined ? num(args.z, entity.z, -280, 280) : entity.z
    const w =
      args.width !== undefined
        ? num(args.width, entity.w, 0.3, 200)
        : args.w !== undefined
          ? num(args.w, entity.w, 0.3, 200)
          : entity.w
    const d =
      args.depth !== undefined
        ? num(args.depth, entity.d, 0.3, 200)
        : args.d !== undefined
          ? num(args.d, entity.d, 0.3, 200)
          : entity.d
    const rot = rotation ?? entity.rot
    const thickness =
      args.thickness !== undefined ? num(args.thickness, entity.thickness, 0.04, 1) : entity.thickness
    const holes = args.holes === undefined ? entity.holes : parseHoles(args.holes)
    if (args.holes !== undefined && !holes) return { error: 'holes 必须是 1..12 个有效矩形洞口。' }
    if (holes?.length) {
      const candidate: SlabEntity = { ...entity, x, z, w, d, rot, thickness, holes }
      for (const hole of holes) {
        if (!slabHoleFits(candidate, hole)) {
          return { error: '洞口超出楼板范围，或楼板尺寸不足以包含该洞口。' }
        }
      }
    }
    Object.assign(patch, {
      x,
      z,
      w,
      d,
      rot,
      thickness,
      style: (style || entity.style) as SlabStyle,
      levelId: levelId ?? entity.levelId,
    })
    if (args.holes !== undefined) patch.holes = holes ?? []
    return { patch }
  }

  if (entity.kind === 'roof') {
    const styles = ['gable', 'hip', 'flat', 'shed']
    const finishes = ['terracotta', 'slate', 'charcoal', 'copper', 'shingle']
    if (args.style !== undefined && !styles.includes(str(args.style))) return { error: '未知屋顶形式。' }
    if (args.finish !== undefined && !finishes.includes(str(args.finish))) return { error: '未知屋面材质。' }
    Object.assign(patch, {
      x: args.x !== undefined ? num(args.x, entity.x, -280, 280) : entity.x,
      z: args.z !== undefined ? num(args.z, entity.z, -280, 280) : entity.z,
      w: args.width !== undefined ? num(args.width, entity.w, 0.5, 200) : args.w !== undefined ? num(args.w, entity.w, 0.5, 200) : entity.w,
      d: args.depth !== undefined ? num(args.depth, entity.d, 0.5, 200) : args.d !== undefined ? num(args.d, entity.d, 0.5, 200) : entity.d,
      rot: rotation ?? entity.rot,
      style: (str(args.style) || entity.style) as RoofEntity['style'],
      finish: (str(args.finish) || entity.finish) as RoofFinish,
      pitch: args.pitch !== undefined ? num(args.pitch, entity.pitch, 0, 70) : entity.pitch,
      eaveY: args.eaveY !== undefined ? num(args.eaveY, entity.eaveY, -10, 120) : entity.eaveY,
      overhang: args.overhang !== undefined ? num(args.overhang, entity.overhang, 0, 2) : entity.overhang,
      levelId: levelId ?? entity.levelId,
    })
    return { patch }
  }

  if (entity.kind === 'path') {
    const next: PathEntity = {
      ...entity,
      points: args.points !== undefined ? asPointList(args.points) ?? entity.points : entity.points,
      width: args.width !== undefined ? num(args.width, entity.width, 0.1, 45) : entity.width,
      style: typeof args.style === 'string' ? args.style.slice(0, 30) : entity.style,
      sidewalk: args.sidewalk !== undefined ? bool(args.sidewalk, entity.sidewalk) : entity.sidewalk,
      lanes: args.lanes !== undefined ? (Number(args.lanes) === 4 ? 4 : 2) : entity.lanes,
      bridgeHeight:
        args.bridgeHeight !== undefined ? num(args.bridgeHeight, entity.bridgeHeight, 0.8, 20) : entity.bridgeHeight,
      railings: args.railings !== undefined ? bool(args.railings, entity.railings) : entity.railings,
      closed: args.closed !== undefined ? bool(args.closed, Boolean(entity.closed)) : entity.closed,
      levelId: levelId ?? entity.levelId,
    }
    if (next.closed && next.points.length < 3) return { error: '闭合路径至少需要 3 个控制点。' }
    const check = checkPathPlacement(next, entities, entity.id)
    if (!check.valid) return { error: check.reason }
    Object.assign(patch, {
      points: next.points,
      width: next.width,
      style: next.style,
      sidewalk: next.sidewalk,
      lanes: next.lanes,
      bridgeHeight: next.bridgeHeight,
      railings: next.railings,
      closed: next.closed,
      levelId: next.levelId,
    })
    return { patch }
  }

  if (entity.kind === 'building') {
    Object.assign(patch, {
      x: args.x !== undefined ? num(args.x, entity.x, -400, 400) : entity.x,
      z: args.z !== undefined ? num(args.z, entity.z, -400, 400) : entity.z,
      rot: rotation ?? entity.rot,
      levelId: levelId ?? entity.levelId,
    })
    if (typeof args.name === 'string' && args.name.trim()) patch.name = args.name.trim().slice(0, 60)
    return { patch }
  }

  return { error: '不支持修改该构件。' }
}

function updateEntityFromArgs(args: Args) {
  const state = useEditor.getState()
  const id = str(args.id)
  const entity = state.doc.entities[id]
  if (!entity) return { error: `未找到构件：${id || '(空)'}` }
  const built = buildEntityPatch(entity, args)
  if (built.error || !built.patch) return { error: built.error ?? '没有可修改的字段。' }
  state.beginHistory('修改构件')
  state.updateEntity(id, built.patch, false)
  state.select(id)
  return { id, patch: built.patch }
}

export const MCP_TOOLS: McpToolSpec[] = [
  {
    name: 'get_scene',
    title: '读取场景摘要',
    description:
      'Return the current project summary: levels, counts, camera target, selected entity, detected rooms and optionally all entities. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        includeEntities: { type: 'boolean', description: 'Include entity list (default false).' },
        entityLimit: { type: 'number', description: 'Max entities to return (default 300, max 1000).' },
        levelId: { type: 'string', description: 'Only entities on this level (openings follow their wall).' },
        kind: { type: 'string', description: 'Only this entity kind: wall/opening/object/path/slab/roof/building.' },
        modelId: { type: 'string', description: 'Only objects with this catalog/custom model id.' },
      },
    },
  },
  {
    name: 'get_entity',
    title: '读取单个构件',
    description:
      'Return one entity by id with all editable fields, its level, floor openings when it is a wall, and its world bounds. Read-only.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string' } },
    },
  },
  {
    name: 'list_ui_controls',
    title: '列出 UI 控件与 automation id',
    description:
      'Return every interactive control in the app with its Windows UIA automation id, role, accessible name, disabled state, scope/group and screen rect. Use these ids with UIA or an accessibility agent. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        includeHidden: { type: 'boolean', description: 'Include controls without a visible box (default false).' },
        query: { type: 'string', description: 'Filter by automation id, name, role or group.' },
        limit: { type: 'number', description: 'Max controls to return (default 500, max 1000).' },
      },
    },
  },
  {
    name: 'list_models',
    title: '列出组件库',
    description: 'List available model IDs with names, category, footprint and placement rule. Use the returned id for place_model.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        query: { type: 'string', description: 'Match id, name or tag.' },
        placement: { type: 'string', enum: ['indoor', 'outdoor', 'on-road', 'on-water', 'any'] },
      },
    },
  },
  {
    name: 'get_selection',
    title: '读取当前选中构件',
    description: 'Return the selected entity and its editable fields.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'select_entity',
    title: '选中构件',
    description: 'Select an entity by id, or select the nearest entity with a given model id. Returns the selection.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        modelId: { type: 'string' },
        x: { type: 'number' },
        z: { type: 'number' },
        clear: { type: 'boolean', description: 'Clear the current selection instead.' },
      },
    },
  },
  {
    name: 'set_camera',
    title: '设置相机',
    description:
      'Move the live orbit camera. Use target/distance/azimuth/polar, an explicit eye + target point, top=true for a top-down plan view, or focusId to frame one entity.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        eye: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        distance: { type: 'number' },
        azimuth: { type: 'number' },
        polar: { type: 'number' },
        top: { type: 'boolean', description: 'Switch to the near top-down plan view.' },
        focusId: { type: 'string', description: 'Frame this entity id with the camera.' },
      },
    },
  },
  {
    name: 'focus_selection',
    title: '聚焦当前选中',
    description: 'Frame the currently selected entity with the camera.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'set_transform_mode',
    title: '切换变换手柄',
    description: 'Switch the selected-object gizmo between translate and rotate.',
    inputSchema: {
      type: 'object',
      required: ['mode'],
      properties: { mode: { type: 'string', enum: ['translate', 'rotate'] } },
    },
  },
  {
    name: 'get_screenshot',
    title: '截取场景画面',
    description:
      'Render a JPEG of the live viewport (or from a supplied eye/target/view) and return it as MCP image content plus base64 in the payload. Use clean=true to hide selection/gizmo overlays.',
    inputSchema: {
      type: 'object',
      properties: {
        maxSize: { type: 'number', description: 'Longest edge in pixels, default 1280.' },
        clean: { type: 'boolean', description: 'Hide selection boxes, gizmos and ghost previews (default false).' },
        view: {
          type: 'object',
          properties: {
            target: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
            distance: { type: 'number' },
            azimuth: { type: 'number' },
            polar: { type: 'number' },
          },
        },
        eye: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        target: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        fov: { type: 'number', description: 'Vertical field of view in degrees (24-90).' },
      },
    },
  },
  {
    name: 'capture_views',
    title: '多角度查看场景',
    description:
      'Capture several labelled JPEG views of the scene or one entity for visual inspection. Pick preset views (overview/top/north/east/south/west/corners), an orbiting ring of N angles, or the current camera. Images come back as MCP image content; eye/target for each shot are included.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Frame this entity id (building, room wall, model…).' },
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
        views: {
          type: 'array',
          items: { type: 'string', enum: captureViewNames() },
          description: 'Preset viewpoints. Default: current + overview.',
        },
        ring: { type: 'number', minimum: 2, maximum: 16, description: 'Capture N evenly spaced orbit views.' },
        elevation: { type: 'number', minimum: 4, maximum: 86, description: 'Ring camera elevation in degrees (default 30).' },
        distance: { type: 'number', description: 'Camera distance in metres; defaults to fit the target.' },
        maxSize: { type: 'number', description: 'Longest edge per image, default 1024.' },
        clean: { type: 'boolean', description: 'Hide selection/gizmo overlays (default true).' },
        includeCurrent: { type: 'boolean', description: 'Also capture the live viewport camera.' },
      },
    },
  },
  {
    name: 'build_villa',
    title: '建造别墅',
    description: 'Build and furnish a complete single-storey modern villa near the camera (or at centerX/centerZ), with optional pool, carport and garden.',
    inputSchema: {
      type: 'object',
      properties: {
        width: { type: 'number', minimum: 10, maximum: 30 },
        depth: { type: 'number', minimum: 6, maximum: 18 },
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
        withPool: { type: 'boolean' },
        withCarport: { type: 'boolean' },
        withGarden: { type: 'boolean' },
      },
    },
  },
  {
    name: 'build_room',
    title: '建造房间',
    description: 'Build one enclosed, optionally furnished room with a door, window, floor and roof. Omit coordinates to auto-place on free land.',
    inputSchema: {
      type: 'object',
      properties: {
        roomType: { type: 'string', enum: ['living', 'bedroom', 'kitchen', 'dining', 'bathroom', 'office', 'generic'] },
        width: { type: 'number', minimum: 2.4, maximum: 22 },
        depth: { type: 'number', minimum: 2.4, maximum: 22 },
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
        roof: { type: 'boolean' },
        furnish: { type: 'boolean' },
      },
    },
  },
  {
    name: 'add_wall',
    title: '绘制墙体',
    description:
      'Draw one parametric wall segment between two [x,z] points on the active (or given) level. Validates overlaps and water. Combine several calls through apply_actions for a single undo step.',
    inputSchema: {
      type: 'object',
      required: ['a', 'b'],
      properties: {
        id: { type: 'string', description: 'Optional stable id so later actions can reference this wall.' },
        a: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 },
        b: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 },
        height: { type: 'number', minimum: 0.6, maximum: 8 },
        thickness: { type: 'number', minimum: 0.06, maximum: 0.6 },
        color: { type: 'string', description: 'Hex color or Chinese/English wall color name.' },
        levelId: { type: 'string' },
      },
    },
  },
  {
    name: 'add_opening',
    title: '开出门窗',
    description:
      'Cut a door or window into an existing wall. Offset is measured from wall point A; omit it to centre the opening. Validates wall bounds, height and overlaps.',
    inputSchema: {
      type: 'object',
      required: ['wallId', 'openingType'],
      properties: {
        wallId: { type: 'string' },
        openingType: { type: 'string', enum: ['door', 'window'] },
        style: { type: 'string', description: 'Door style id (single/double/sliding/glass/garage) or window style id (standard/wide/picture/slim/small).' },
        offset: { type: 'number', description: 'Distance from wall point A in metres.' },
        width: { type: 'number' },
        height: { type: 'number' },
        sill: { type: 'number', description: 'Window sill height in metres.' },
        openAngle: { type: 'number', minimum: -135, maximum: 135, description: 'Door leaf angle; 0 = closed.' },
        hinge: { type: 'string', enum: ['left', 'right'] },
      },
    },
  },
  {
    name: 'add_slab',
    title: '绘制楼板',
    description:
      'Add a rectangular floor slab/platform at the active (or given) level. Optional holes cut real stair/atrium voids through the slab.',
    inputSchema: {
      type: 'object',
      required: ['x', 'z'],
      properties: {
        x: { type: 'number' },
        z: { type: 'number' },
        width: { type: 'number', minimum: 0.3, maximum: 200, description: 'Width along X (default 6).' },
        depth: { type: 'number', minimum: 0.3, maximum: 200, description: 'Depth along Z (default 4).' },
        rot: { type: 'number', description: 'Rotation in radians.' },
        rotDeg: { type: 'number', description: 'Rotation in degrees (overrides rot).' },
        thickness: { type: 'number', minimum: 0.04, maximum: 1 },
        style: { type: 'string', enum: SLAB_STYLES.map((item) => item.id) },
        levelId: { type: 'string' },
        holes: {
          type: 'array',
          maxItems: 12,
          description: 'World-space rectangular holes cut through the slab.',
          items: {
            type: 'object',
            required: ['x', 'z'],
            properties: {
              x: { type: 'number' },
              z: { type: 'number' },
              w: { type: 'number' },
              d: { type: 'number' },
              width: { type: 'number' },
              depth: { type: 'number' },
              rot: { type: 'number' },
            },
          },
        },
      },
    },
  },
  {
    name: 'cut_floor_opening',
    title: '楼板开洞 / 楼梯井',
    description:
      'Cut a real rectangular opening through the slab above the active (or fromLevelId) level, or through all levels above for an elevator shaft. Use this after placing a stair/escalator, or with levelId to cut a specific level.',
    inputSchema: {
      type: 'object',
      required: ['x', 'z', 'width', 'depth'],
      properties: {
        x: { type: 'number' },
        z: { type: 'number' },
        width: { type: 'number', minimum: 0.4, maximum: 40 },
        depth: { type: 'number', minimum: 0.4, maximum: 40 },
        rot: { type: 'number', description: 'Opening rotation in radians (world-space).' },
        levelId: { type: 'string', description: 'Cut exactly this level instead of the next level above.' },
        fromLevelId: { type: 'string', description: 'Source level for above/allAbove (default active level).' },
        allAbove: { type: 'boolean', description: 'Cut every level above the source level (elevator shaft).' },
      },
    },
  },
  {
    name: 'furnish_room',
    title: '布置房间',
    description: 'Furnish an existing enclosed room near the camera or at centerX/centerZ. Existing furniture is respected.',
    inputSchema: {
      type: 'object',
      properties: {
        roomType: { type: 'string', enum: ['living', 'bedroom', 'kitchen', 'dining', 'bathroom', 'office', 'generic'] },
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
      },
    },
  },
  {
    name: 'place_model',
    title: '放置组件',
    description: 'Place one catalog model. Omit x/z to automatically find a legal spot (indoor objects go to the nearest room, vehicles to roads, boats to water).',
    inputSchema: {
      type: 'object',
      required: ['modelId'],
      properties: {
        modelId: { type: 'string' },
        x: { type: 'number' },
        z: { type: 'number' },
        rot: { type: 'number', description: 'Rotation in radians.' },
        scale: { type: 'number', minimum: 0.2, maximum: 8 },
        scaleY: { type: 'number', minimum: 0.2, maximum: 6, description: 'Vertical-only scale (stairs/elevators can be stretched to floor height).' },
      },
    },
  },
  {
    name: 'draw_path',
    title: '绘制路径',
    description: 'Draw a road, river, bridge, footpath or fence. Omit points to auto-generate a gentle curve near the camera; a bridge with no points crosses the nearest river.',
    inputSchema: {
      type: 'object',
      required: ['pathType'],
      properties: {
        pathType: { type: 'string', enum: ['road', 'river', 'bridge', 'footpath', 'fence'] },
        points: { type: 'array', items: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 }, maxItems: 24 },
        width: { type: 'number' },
        closed: { type: 'boolean' },
        sidewalk: { type: 'boolean' },
        lanes: { type: 'number', enum: [2, 4] },
        bridgeHeight: { type: 'number' },
        railings: { type: 'boolean' },
        length: { type: 'number' },
        curve: { type: 'number' },
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
      },
    },
  },
  {
    name: 'add_pond',
    title: '开挖池塘',
    description: 'Create a natural closed pond.',
    inputSchema: {
      type: 'object',
      properties: {
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
        radius: { type: 'number', minimum: 3, maximum: 32 },
      },
    },
  },
  {
    name: 'add_roof',
    title: '生成屋顶',
    description: 'Generate a roof for an existing room near the camera (or at x/z).',
    inputSchema: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        z: { type: 'number' },
        style: { type: 'string', enum: ['gable', 'hip', 'flat', 'shed'] },
        finish: { type: 'string', enum: ['terracotta', 'slate', 'charcoal', 'copper', 'shingle'] },
        pitch: { type: 'number' },
      },
    },
  },
  {
    name: 'add_vegetation',
    title: '种植植被',
    description: 'Plant trees, bushes and flower beds around an area while avoiding buildings and roads.',
    inputSchema: {
      type: 'object',
      properties: {
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
        radius: { type: 'number', minimum: 4, maximum: 45 },
        count: { type: 'number', minimum: 1, maximum: 20 },
      },
    },
  },
  {
    name: 'add_level',
    title: '新增楼层',
    description: 'Add a new storey above the top level and make it active.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'set_active_level',
    title: '切换楼层',
    description: 'Set the active level by zero-based index.',
    inputSchema: {
      type: 'object',
      required: ['index'],
      properties: { index: { type: 'number', minimum: 0 } },
    },
  },
  {
    name: 'update_level',
    title: '修改楼层',
    description: 'Rename a level or change its elevation. Identify the level by levelId or zero-based index.',
    inputSchema: {
      type: 'object',
      properties: {
        levelId: { type: 'string' },
        index: { type: 'number', minimum: 0 },
        name: { type: 'string' },
        elevation: { type: 'number', minimum: -20, maximum: 300 },
      },
    },
  },
  {
    name: 'duplicate_level',
    title: '复制楼层平面',
    description:
      'Copy walls, doors/windows and slabs from one level to a new level above the top storey (same as the Plan panel\'s copy-to-new-floor). Optionally include furniture.',
    inputSchema: {
      type: 'object',
      properties: {
        levelId: { type: 'string' },
        index: { type: 'number', minimum: 0 },
        withFurniture: { type: 'boolean' },
      },
    },
  },
  {
    name: 'delete_level',
    title: '删除楼层',
    description: 'Delete an empty level. Fails if the level still contains entities or it is the only level.',
    inputSchema: {
      type: 'object',
      properties: {
        levelId: { type: 'string' },
        index: { type: 'number', minimum: 0 },
      },
    },
  },
  {
    name: 'complete_rooms',
    title: '补全闭合房间',
    description:
      'Detect closed wall loops on a level and add missing slabs, doors, windows or a top-storey roof according to the plan options (set_plan_options).',
    inputSchema: {
      type: 'object',
      properties: { levelId: { type: 'string' } },
    },
  },
  {
    name: 'set_plan_options',
    title: '设置平面补全选项',
    description: 'Set auto slab/door/window/roof behaviour used by complete_rooms and plan drawing.',
    inputSchema: {
      type: 'object',
      properties: {
        autoSlab: { type: 'boolean' },
        autoDoor: { type: 'boolean' },
        autoWindow: { type: 'boolean' },
        autoRoof: { type: 'boolean' },
      },
    },
  },
  {
    name: 'modify_selected',
    title: '修改选中构件',
    description:
      'Modify the selected entity: rotate by degrees, change wall color, move, scale, resize a slab/roof, change roof pitch/finish, or set a selected door open angle (-135..135, 0 = closed) and hinge side.',
    inputSchema: {
      type: 'object',
      properties: {
        rotateByDeg: { type: 'number' },
        color: { type: 'string', description: 'Hex color or Chinese/English wall color name.' },
        x: { type: 'number' },
        z: { type: 'number' },
        scale: { type: 'number' },
        height: { type: 'number' },
        width: { type: 'number' },
        depth: { type: 'number' },
        pitch: { type: 'number' },
        finish: { type: 'string', enum: ['terracotta', 'slate', 'charcoal', 'copper', 'shingle'] },
        openAngle: {
          type: 'number',
          minimum: -135,
          maximum: 135,
          description: 'Door leaf opening angle in degrees; 0 = closed, negative swings to the other side.',
        },
        hinge: { type: 'string', enum: ['left', 'right'], description: 'Door hinge side.' },
      },
    },
  },
  {
    name: 'update_entity',
    title: '编辑任意构件',
    description:
      'Edit any entity by id with kind-aware validation — the API equivalent of the Inspector. Walls take a/b/height/thickness/color; openings take style/offset/width/height/sill/openAngle/hinge; objects take x/z/rot/scale/scaleY; slabs take x/z/width/depth/rot/thickness/style/holes; roofs take dimensions/rot/style/finish/pitch/eaveY/overhang; paths take points/width/style/sidewalk/lanes/bridgeHeight/railings/closed; buildings take x/z/rot/name. All entities accept levelId.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        levelId: { type: 'string' },
        a: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 },
        b: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 },
        x: { type: 'number' },
        z: { type: 'number' },
        rot: { type: 'number', description: 'Rotation in radians.' },
        rotDeg: { type: 'number', description: 'Rotation in degrees (overrides rot).' },
        scale: { type: 'number' },
        scaleY: { type: 'number', minimum: 0.2, maximum: 6, description: 'Vertical-only scale for objects.' },
        width: { type: 'number' },
        height: { type: 'number' },
        depth: { type: 'number' },
        w: { type: 'number', description: 'Slab/roof width alias.' },
        d: { type: 'number', description: 'Slab/roof depth alias.' },
        thickness: { type: 'number' },
        color: { type: 'string' },
        style: { type: 'string' },
        finish: { type: 'string', enum: ['terracotta', 'slate', 'charcoal', 'copper', 'shingle'] },
        pitch: { type: 'number' },
        eaveY: { type: 'number' },
        overhang: { type: 'number' },
        offset: { type: 'number' },
        sill: { type: 'number' },
        openAngle: { type: 'number', minimum: -135, maximum: 135 },
        hinge: { type: 'string', enum: ['left', 'right'] },
        points: { type: 'array', items: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 }, maxItems: 40 },
        sidewalk: { type: 'boolean' },
        lanes: { type: 'number', enum: [2, 4] },
        bridgeHeight: { type: 'number' },
        railings: { type: 'boolean' },
        closed: { type: 'boolean' },
        name: { type: 'string', description: 'Building display name.' },
        holes: {
          type: 'array',
          maxItems: 12,
          description: 'Replace slab holes with these world-space rectangles (empty array removes holes).',
          items: {
            type: 'object',
            required: ['x', 'z'],
            properties: {
              id: { type: 'string' },
              x: { type: 'number' },
              z: { type: 'number' },
              w: { type: 'number' },
              d: { type: 'number' },
              width: { type: 'number' },
              depth: { type: 'number' },
              rot: { type: 'number' },
            },
          },
        },
      },
    },
  },
  {
    name: 'duplicate_selected',
    title: '复制选中构件',
    description: 'Duplicate the selected object/slab/roof/wall/path/building and select the copy.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'delete_entities',
    title: '批量删除构件',
    description: 'Delete one or more entities by id. Deleting a wall also removes its doors/windows. Undoable.',
    inputSchema: {
      type: 'object',
      required: ['ids'],
      properties: { ids: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 200 } },
    },
  },
  {
    name: 'delete_selected',
    title: '删除选中构件',
    description: 'Delete the selected entity. Undoable.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'clear_level',
    title: '清空当前楼层',
    description: 'Delete all entities on the active level. Destructive: requires confirm=true.',
    inputSchema: {
      type: 'object',
      required: ['confirm'],
      properties: { confirm: { type: 'boolean', const: true } },
    },
  },
  {
    name: 'undo',
    title: '撤销',
    description: 'Undo one editor history step.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'redo',
    title: '重做',
    description: 'Redo one editor history step.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'focus_all',
    title: '全览场景',
    description: 'Frame the whole scene with the camera.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'set_quality',
    title: '设置画质',
    description: 'Set render quality (auto/high/balanced/low).',
    inputSchema: {
      type: 'object',
      required: ['quality'],
      properties: { quality: { type: 'string', enum: ['auto', 'high', 'balanced', 'low'] } },
    },
  },
  {
    name: 'list_building_templates',
    title: '建筑模板列表',
    description: 'List the built-in whole-building templates (villa, townhouse, office, tower) with size and floor count.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'place_building',
    title: '放置整栋建筑',
    description:
      'Place a whole building as one entity. It can be moved/rotated as a unit and entered for shell/interior editing. Optionally set floors, façade color, roof finish, window style, and auto-furnish/garden.',
    inputSchema: {
      type: 'object',
      required: ['templateId'],
      properties: {
        templateId: { type: 'string', enum: ['villa', 'townhouse', 'office', 'tower'] },
        x: { type: 'number' },
        z: { type: 'number' },
        rot: { type: 'number' },
        floors: { type: 'number', minimum: 1, maximum: 24 },
        wallColor: { type: 'string' },
        roofFinish: { type: 'string', enum: ['terracotta', 'slate', 'charcoal', 'copper', 'shingle'] },
        windowStyle: { type: 'string', enum: ['standard', 'wide', 'picture', 'slim', 'small'] },
        furnished: { type: 'boolean' },
        garden: { type: 'boolean' },
      },
    },
  },
  {
    name: 'place_skyline',
    title: '生成天际线',
    description:
      'Place a row of 3-8 whole buildings with varied tower heights around a centre point (defaults to the camera target). Same as the Buildings panel skyline button.',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', minimum: 3, maximum: 8 },
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
      },
    },
  },
  {
    name: 'generate_city',
    title: '一键生成城市',
    description:
      'Generate a complete city district in one undo step: road grid, buildings, park/pond or plaza, street trees, lamps and cars. Presets: lakeside, downtown, garden, riverside.',
    inputSchema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: ['lakeside', 'downtown', 'garden', 'riverside'] },
        size: { type: 'string', enum: ['small', 'medium', 'large'] },
        centerX: { type: 'number' },
        centerZ: { type: 'number' },
        furnished: { type: 'boolean' },
        streetTrees: { type: 'boolean' },
        streetLights: { type: 'boolean' },
        vehicles: { type: 'boolean' },
      },
    },
  },
  {
    name: 'furnish_building',
    title: '一键精装',
    description:
      'Furnish closed rooms automatically. With id, furnishes every floor inside that building; without id, furnishes the active level.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        maxFloors: { type: 'number', minimum: 1, maximum: 40 },
      },
    },
  },
  {
    name: 'landscape_building',
    title: '布置建筑庭院',
    description:
      'Add a front path, trees, flower beds, lamps, benches and (for office/tower) a plaza around the given building, avoiding roads and existing props.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string' } },
    },
  },
  {
    name: 'enter_building',
    title: '进入建筑内部',
    description: 'Enter a building instance and switch the editor to its own floors (shell/interior editing).',
    inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
  },
  {
    name: 'exit_building',
    title: '退出建筑内部',
    description: 'Save the current building interior and return to the city scene.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'set_building_mode',
    title: '切换建筑编辑模式',
    description: 'Inside a building, switch between shell (walls/windows/doors/stairs) and interior (furniture) views.',
    inputSchema: {
      type: 'object',
      required: ['mode'],
      properties: { mode: { type: 'string', enum: ['shell', 'interior'] } },
    },
  },
  {
    name: 'set_visual_style',
    title: '设置画面风格',
    description: 'Switch the scene visual style: mono, daylight, sunset or blueprint.',
    inputSchema: {
      type: 'object',
      required: ['style'],
      properties: { style: { type: 'string', enum: ['mono', 'daylight', 'sunset', 'blueprint'] } },
    },
  },
  {
    name: 'apply_actions',
    title: '执行动作计划',
    description:
      'Execute a list of editor actions as one atomic history step. Use this for complex multi-step modeling. Action types: build_villa, build_room, furnish_room, place_model, add_wall, add_opening, add_slab, draw_path, add_pond, add_roof, add_vegetation, add_level, set_active_level, modify_selected, delete_selected, clear_level, undo, redo, focus_all. clear_level requires allowDestructive=true.',
    inputSchema: {
      type: 'object',
      required: ['actions'],
      properties: {
        actions: { type: 'array', items: { type: 'object' }, maxItems: 24 },
        allowDestructive: { type: 'boolean' },
      },
    },
  },
  {
    name: 'set_settings',
    title: '设置编辑器开关',
    description:
      'Change editor settings: snapping, grid, shadows, level isolation, roof visibility, plan mode, render quality and visual style.',
    inputSchema: {
      type: 'object',
      properties: {
        gridSnap: { type: 'boolean' },
        angleSnap: { type: 'boolean' },
        showGrid: { type: 'boolean' },
        showRoofs: { type: 'boolean' },
        isolateLevel: { type: 'boolean' },
        planMode: { type: 'boolean', description: 'Lock the top-down plan workspace on/off.' },
        shadows: { type: 'boolean' },
        quality: { type: 'string', enum: ['auto', 'high', 'balanced', 'low'] },
        visualStyle: { type: 'string', enum: ['mono', 'daylight', 'sunset', 'blueprint'] },
      },
    },
  },
  {
    name: 'set_project_name',
    title: '重命名项目',
    description: 'Set the project name shown in the top bar and saved into .civitas files.',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string' } },
    },
  },
  {
    name: 'open_project',
    title: '打开项目文件',
    description: 'Load a .civitas/.json project from an absolute path, replacing the current document. Destructive: requires confirm=true.',
    inputSchema: {
      type: 'object',
      required: ['path', 'confirm'],
      properties: {
        path: { type: 'string' },
        confirm: { type: 'boolean', const: true },
      },
    },
  },
  {
    name: 'import_model',
    title: '导入 3D 模型',
    description:
      'Import a GLB/glTF/OBJ/STL file into the project custom catalog. Optionally place it immediately with x/z/rot/scale. Returns the custom modelId for later place_model calls.',
    inputSchema: {
      type: 'object',
      required: ['path'],
      properties: {
        path: { type: 'string' },
        name: { type: 'string', description: 'Optional display name; defaults to the file name.' },
        x: { type: 'number' },
        z: { type: 'number' },
        rot: { type: 'number' },
        scale: { type: 'number', minimum: 0.2, maximum: 8 },
      },
    },
  },
  {
    name: 'save_project',
    title: '保存项目',
    description: 'Save the current .civitas project to an absolute file path on this machine.',
    inputSchema: {
      type: 'object',
      required: ['path'],
      properties: { path: { type: 'string' } },
    },
  },
  {
    name: 'export_scene',
    title: '导出场景文件',
    description: 'Export the scene to an absolute file path as glb, gltf, obj or stl.',
    inputSchema: {
      type: 'object',
      required: ['format', 'path'],
      properties: {
        format: { type: 'string', enum: ['glb', 'gltf', 'obj', 'stl'] },
        path: { type: 'string' },
      },
    },
  },
  {
    name: 'new_project',
    title: '新建项目',
    description: 'Replace the current document with a blank or sample project. Destructive: requires confirm=true.',
    inputSchema: {
      type: 'object',
      required: ['confirm'],
      properties: {
        sample: { type: 'boolean' },
        confirm: { type: 'boolean', const: true },
      },
    },
  },
]

function runSingle(action: AiAction, reply: string, allowDestructive = false) {
  return executeForMcp([action], reply, allowDestructive)
}

export async function runMcpTool(name: string, args: Args): Promise<unknown> {
  try {
    switch (name) {
      case 'get_scene': {
        const context = getContext()
        const includeEntities = bool(args.includeEntities)
        const limit = Math.round(num(args.entityLimit, 300, 1, 1000))
        const levelFilter = str(args.levelId)
        const kindFilter = str(args.kind)
        const modelFilter = str(args.modelId)
        const state = useEditor.getState()
        const levelOf = (entity: Entity): string | undefined => {
          if (entity.kind !== 'opening') return entity.levelId
          const wall = state.doc.entities[entity.wallId]
          return wall?.kind === 'wall' ? wall.levelId : undefined
        }
        const filtered = Object.values(state.doc.entities).filter((entity) => {
          if (kindFilter && entity.kind !== kindFilter) return false
          if (modelFilter && (entity.kind !== 'object' || entity.modelId !== modelFilter)) return false
          if (levelFilter && levelOf(entity) !== levelFilter) return false
          return true
        })
        const entities = includeEntities ? filtered.slice(0, limit).map(entitySummary) : undefined
        return toolResult({
          context,
          perf: useRuntime.getState().perf,
          render: getEditorScene()?.getRenderDiagnostics() ?? null,
          view: getEditorScene()?.getView() ?? null,
          cameraEye: getEditorScene()?.getCameraPosition() ?? null,
          selection: selectedPayload(),
          entities,
          entityTotal: filtered.length,
          entityLimit: limit,
        })
      }
      case 'get_entity': {
        const id = str(args.id)
        const entity = useEditor.getState().doc.entities[id]
        if (!entity) return errorResult(`未找到构件：${id || '(空)'}`)
        const payload = entitySummary(entity)
        if (entity.kind === 'wall') {
          Object.assign(payload, {
            openings: Object.values(useEditor.getState().doc.entities)
              .filter((item): item is OpeningEntity => item.kind === 'opening' && item.wallId === id)
              .map(entitySummary),
          })
        }
        return toolResult({
          entity: { ...entity, ...payload },
          bounds: getEditorScene()?.getEntityBounds(id) ?? null,
        })
      }
      case 'list_ui_controls': {
        const audit = auditAutomationIds({
          includeHidden: bool(args.includeHidden, false),
          query: str(args.query),
          limit: Math.round(num(args.limit, 500, 1, 1000)),
        })
        return toolResult({
          total: audit.total,
          interactive: audit.interactive,
          missing: audit.missing,
          duplicates: audit.duplicates,
          count: audit.controls.length,
          controls: audit.controls,
        })
      }
      case 'list_models': {
        const category = str(args.category).toLowerCase()
        const query = str(args.query).toLowerCase()
        const placement = str(args.placement)
        const models = CATALOG_MODELS.filter((model) => {
          if (category && model.category !== category) return false
          if (placement && model.placement !== placement) return false
          if (!query) return true
          return `${model.id} ${model.name} ${(model.tags ?? []).join(' ')}`.toLowerCase().includes(query)
        }).map((model) => ({
          id: model.id,
          name: model.name,
          category: model.category,
          tags: model.tags,
          footprint: model.footprint,
          height: model.height,
          placement: model.placement,
          wallAlign: Boolean(model.wallAlign),
        }))
        const custom = useEditor.getState().doc.customAssets.map((asset) => ({
          id: asset.id,
          name: asset.name,
          category: 'custom',
          footprint: asset.footprint,
          height: asset.height,
          placement: 'any',
        }))
        return toolResult({ models: [...models, ...custom], count: models.length + custom.length })
      }
      case 'get_selection':
        return toolResult({ selection: selectedPayload() })
      case 'select_entity': {
        const state = useEditor.getState()
        if (bool(args.clear)) {
          state.select(null)
          return toolResult({ selection: null })
        }
        let target: Entity | null = null
        if (typeof args.id === 'string') target = state.doc.entities[args.id] ?? null
        else if (typeof args.modelId === 'string') {
          const near = [num(args.x, 0, -300, 300), num(args.z, 0, -300, 300)]
          target = Object.values(state.doc.entities)
            .filter((entity) => entity.kind === 'object' && entity.modelId === args.modelId)
            .sort((a, b) => {
              if (a.kind !== 'object' || b.kind !== 'object') return 0
              return (
                Math.hypot(a.x - near[0], a.z - near[1]) - Math.hypot(b.x - near[0], b.z - near[1])
              )
            })[0] ?? null
        }
        if (!target) return errorResult('没有找到匹配的构件。')
        state.select(target.id)
        return toolResult({ selection: selectedPayload() })
      }
      case 'set_camera': {
        const engine = getEditorScene()
        if (!engine) return errorResult('场景尚未就绪。')
        if (typeof args.focusId === 'string') {
          if (!useEditor.getState().doc.entities[args.focusId]) return errorResult('未找到该构件。')
          engine.focusEntityIds([args.focusId])
          return toolResult({ view: engine.getView(), focusId: args.focusId })
        }
        if (bool(args.top)) {
          engine.topView()
        }
        const current = engine.getView()
        const target = asVec3(args.target) ?? current.target
        const eye = asVec3(args.eye)
        let distance = current.distance
        let azimuth = current.azimuth
        let polar = current.polar
        if (eye) {
          const dx = eye[0] - target[0]
          const dy = eye[1] - target[1]
          const dz = eye[2] - target[2]
          distance = Math.min(220, Math.max(1.6, Math.hypot(dx, dy, dz)))
          polar = Math.min(1.47, Math.max(0.16, Math.acos(Math.max(-1, Math.min(1, dy / distance)))))
          azimuth = Math.atan2(dx, dz)
        }
        const view = {
          target,
          distance: eye ? distance : num(args.distance, current.distance, 1.6, 220),
          azimuth: eye ? azimuth : num(args.azimuth, current.azimuth, -Math.PI * 20, Math.PI * 20),
          polar: eye ? polar : num(args.polar, current.polar, 0.16, 1.47),
        }
        engine.setView(view)
        return toolResult({ view })
      }
      case 'focus_selection': {
        const engine = getEditorScene()
        if (!engine) return errorResult('场景尚未就绪。')
        if (!useEditor.getState().selectedId) return errorResult('当前没有选中的构件。')
        engine.focusSelection()
        return toolResult({ view: engine.getView(), selectedId: useEditor.getState().selectedId })
      }
      case 'set_transform_mode': {
        const engine = getEditorScene()
        if (!engine) return errorResult('场景尚未就绪。')
        const mode = str(args.mode, 'translate')
        if (mode !== 'translate' && mode !== 'rotate') return errorResult('mode 必须是 translate 或 rotate。')
        engine.setTransformMode(mode)
        return toolResult({ mode })
      }
      case 'get_screenshot': {
        const engine = getEditorScene()
        const maxSize = Math.round(num(args.maxSize, 1280, 160, 2560))
        const view = args.view && typeof args.view === 'object' ? args.view as Args : null
        const eye = asVec3(args.eye)
        const target = asVec3(args.target)
        const customView = view
          ? {
              target: asVec3(view.target) ?? engine?.getView().target ?? [0, 0.5, 0],
              distance: num(view.distance, engine?.getView().distance ?? 30, 1.6, 220),
              azimuth: num(view.azimuth, engine?.getView().azimuth ?? 0.4, -Math.PI * 20, Math.PI * 20),
              polar: num(view.polar, engine?.getView().polar ?? 1, 0.16, 1.47),
            }
          : null
        if (engine && (customView || eye || bool(args.clean) || args.fov !== undefined)) {
          const shot = engine.capture({
            ...(customView ? { view: customView } : {}),
            ...(eye ? { eye, target: target ?? customView?.target ?? engine.getView().target } : {}),
            fov: args.fov === undefined ? undefined : num(args.fov, 48, 24, 90),
            maxSize,
            clean: bool(args.clean, false),
          })
          return toolResult({
            mime: shot.mime,
            width: shot.width,
            height: shot.height,
            images: [
              {
                label: 'custom',
                mime: shot.mime,
                width: shot.width,
                height: shot.height,
                eye: eye ?? engine.getCameraPosition(),
                target: target ?? customView?.target ?? engine.getView().target,
                data: shot.base64,
              },
            ],
          })
        }
        return toolResult(screenshot(maxSize))
      }
      case 'capture_views': {
        const shots = await captureViews({
          id: typeof args.id === 'string' ? args.id : undefined,
          x: args.x === undefined ? undefined : num(args.x, 0, -280, 280),
          y: args.y === undefined ? undefined : num(args.y, 0, -20, 300),
          z: args.z === undefined ? undefined : num(args.z, 0, -280, 280),
          views: Array.isArray(args.views) ? args.views.filter((item): item is string => typeof item === 'string') : undefined,
          ring: args.ring === undefined ? 0 : Math.round(num(args.ring, 0, 0, 16)),
          distance: args.distance === undefined ? undefined : num(args.distance, 30, 1.6, 220),
          elevation: args.elevation === undefined ? undefined : num(args.elevation, 30, 4, 86),
          maxSize: Math.round(num(args.maxSize, 1024, 160, 2560)),
          clean: bool(args.clean, true),
          includeCurrent: bool(args.includeCurrent),
        })
        const images = shots.shots.map((shot) => ({
          label: shot.label,
          mime: shot.mime,
          width: shot.width,
          height: shot.height,
          eye: shot.eye,
          target: shot.target,
          data: shot.data,
        }))
        return toolResult(
          { focus: shots.focus, count: images.length, images },
          `已生成 ${images.length} 个视角：${images.map((image) => image.label).join('、')}`,
        )
      }
      case 'build_villa':
        return runSingle(
          {
            type: 'build_villa',
            width: num(args.width, 16, 10, 30),
            depth: num(args.depth, 9, 6, 18),
            centerX: args.centerX === undefined ? undefined : num(args.centerX, 0, -260, 260),
            centerZ: args.centerZ === undefined ? undefined : num(args.centerZ, 0, -260, 260),
            withPool: bool(args.withPool),
            withCarport: bool(args.withCarport),
            withGarden: bool(args.withGarden, true),
          },
          'MCP build_villa',
        )
      case 'build_room': {
        const roomType = (
          typeof args.roomType === 'string' ? args.roomType : 'generic'
        ) as AiRoomType
        return runSingle(
          {
            type: 'build_room',
            roomType,
            width: num(args.width, 5, 2.4, 22),
            depth: num(args.depth, 4, 2.4, 22),
            centerX: args.centerX === undefined ? undefined : num(args.centerX, 0, -260, 260),
            centerZ: args.centerZ === undefined ? undefined : num(args.centerZ, 0, -260, 260),
            roof: bool(args.roof, true),
            furnish: bool(args.furnish, true),
          },
          `MCP build_room ${ROOM_TYPE_LABELS[roomType] ?? roomType}`,
        )
      }
      case 'add_wall': {
        const a = asPoint(args.a)
        const b = asPoint(args.b)
        if (!a || !b) return errorResult('墙体端点 a/b 必须是 [x, z]。')
        const state = useEditor.getState()
        const wall = createWallEntity({
          id: typeof args.id === 'string' ? args.id : undefined,
          a,
          b,
          height: args.height === undefined ? undefined : num(args.height, 3.2, 0.6, 8),
          thickness: args.thickness === undefined ? undefined : num(args.thickness, 0.16, 0.06, 0.6),
          color: typeof args.color === 'string' ? args.color : undefined,
          levelId: typeof args.levelId === 'string' ? args.levelId : undefined,
        })
        state.beginHistory('绘制墙体')
        state.addEntity(wall, false)
        state.select(wall.id)
        return toolResult(
          { id: wall.id, wall },
          `已绘制墙体（${Math.hypot(b[0] - a[0], b[1] - a[1]).toFixed(2)} m）`,
        )
      }
      case 'add_opening': {
        const openingType = str(args.openingType)
        if (openingType !== 'door' && openingType !== 'window') {
          return errorResult('openingType 必须是 door 或 window。')
        }
        const state = useEditor.getState()
        const opening = createOpeningEntity({
          wallId: str(args.wallId),
          openingType,
          style: typeof args.style === 'string' ? args.style : undefined,
          offset: args.offset === undefined ? undefined : num(args.offset, 0, 0.1, 80),
          width: args.width === undefined ? undefined : num(args.width, 1, 0.3, 8),
          height: args.height === undefined ? undefined : num(args.height, 2, 0.3, 4),
          sill: args.sill === undefined ? undefined : num(args.sill, 0.9, 0, 3),
          openAngle: args.openAngle === undefined ? undefined : num(args.openAngle, 0, -135, 135),
          hinge: args.hinge === 'right' ? 'right' : args.hinge === 'left' ? 'left' : undefined,
        })
        state.beginHistory('开出门窗')
        state.addEntity(opening, false)
        state.select(opening.id)
        return toolResult(
          { id: opening.id, opening },
          `已在墙体上开出${openingType === 'door' ? '门' : '窗'}（${opening.style}）`,
        )
      }
      case 'add_slab': {
        const state = useEditor.getState()
        const x = num(args.x, 0, -280, 280)
        const z = num(args.z, 0, -280, 280)
        const width = num(args.width, 6, 0.3, 200)
        const depth = num(args.depth, 4, 0.3, 200)
        const rot =
          args.rotDeg !== undefined
            ? (num(args.rotDeg, 0, -3600, 3600) * Math.PI) / 180
            : num(args.rot, 0, -Math.PI * 20, Math.PI * 20)
        const thickness = num(args.thickness, 0.2, 0.04, 1)
        const style = str(args.style, 'wood')
        const holes = args.holes === undefined ? undefined : parseHoles(args.holes) ?? undefined
        if (args.holes !== undefined && !holes) {
          return errorResult('holes 必须是 1..12 个有效矩形洞口。')
        }
        if (holes?.length) {
          const candidate: SlabEntity = {
            id: 'candidate',
            kind: 'slab',
            levelId: levelIdFromArgs(args),
            x,
            z,
            w: width,
            d: depth,
            rot,
            thickness,
            style: style as SlabStyle,
            holes,
          }
          for (const hole of holes) {
            if (!slabHoleFits(candidate, hole)) {
              return errorResult('洞口超出楼板范围，或楼板尺寸不足以包含该洞口。')
            }
          }
        }
        const slab = createSlabEntity({
          x,
          z,
          width,
          depth,
          rot,
          thickness,
          style,
          levelId: typeof args.levelId === 'string' ? args.levelId : undefined,
          holes,
        })
        state.beginHistory('绘制楼板')
        state.addEntity(slab, false)
        state.select(slab.id)
        return toolResult(
          { id: slab.id, slab },
          holes?.length
            ? `已绘制楼板（${slab.w} × ${slab.d} m，${holes.length} 个洞口）`
            : `已绘制楼板（${slab.w} × ${slab.d} m）`,
        )
      }
      case 'cut_floor_opening': {
        const result = cutFloorOpening({
          x: num(args.x, 0, -400, 400),
          z: num(args.z, 0, -400, 400),
          width: num(args.width, 3, 0.4, 40),
          depth: num(args.depth, 3, 0.4, 40),
          rot: args.rot === undefined ? 0 : num(args.rot, 0, -Math.PI * 2, Math.PI * 2),
          levelId: typeof args.levelId === 'string' ? args.levelId : undefined,
          fromLevelId: typeof args.fromLevelId === 'string' ? args.fromLevelId : undefined,
          allAbove: bool(args.allAbove),
        })
        if ('error' in result) return errorResult(result.error)
        const levelNames = result.levels
          .map((id) => useEditor.getState().doc.levels.find((level) => level.id === id)?.name ?? id)
          .join('、')
        return toolResult(
          result,
          `已在 ${levelNames} 开洞（${result.slabs.length} 块楼板）`,
        )
      }
      case 'furnish_room': {
        const roomType = (
          typeof args.roomType === 'string' ? args.roomType : 'living'
        ) as AiRoomType
        return runSingle(
          {
            type: 'furnish_room',
            roomType,
            centerX: args.centerX === undefined ? undefined : num(args.centerX, 0, -260, 260),
            centerZ: args.centerZ === undefined ? undefined : num(args.centerZ, 0, -260, 260),
          },
          'MCP furnish_room',
        )
      }
      case 'place_model': {
        const modelId = str(args.modelId)
        const x = args.x === undefined ? undefined : num(args.x, 0, -270, 270)
        const z = args.z === undefined ? undefined : num(args.z, 0, -270, 270)
        const rot = num(args.rot, 0, -Math.PI * 20, Math.PI * 20)
        const scale = num(args.scale, 1, 0.2, 8)
        const scaleY = num(args.scaleY, 1, 0.2, 6)
        if (MODEL_MAP.has(modelId)) {
          const result = runSingle(
            {
              type: 'place_model',
              modelId,
              x,
              z,
              rot,
              scale,
            },
            `MCP place_model ${modelId}`,
          )
          if (scaleY !== 1 && result.ok && result.focusIds[0]) {
            useEditor.getState().updateEntity(result.focusIds[0], { scaleY }, false)
            result.scene = sceneSummary()
            result.summary = `${result.summary ?? ''}（高度缩放 ${scaleY.toFixed(2)}）`
          }
          return result
        }
        if (useEditor.getState().doc.customAssets.some((asset) => asset.id === modelId)) {
          const target = getEditorScene()?.getView().target ?? [0, 0, 0]
          const spot: [number, number] = [x ?? target[0], z ?? target[2]]
          const placed = placeObject(modelId, spot[0], spot[1], rot, scale, scaleY)
          if (placed.error) return errorResult(placed.error)
          return toolResult({ id: placed.entity!.id, custom: true, entity: placed.entity })
        }
        return errorResult(`未知 modelId：${modelId}`)
      }
      case 'draw_path': {
        const pathType = str(args.pathType) as 'road' | 'river' | 'bridge' | 'footpath' | 'fence'
        if (!['road', 'river', 'bridge', 'footpath', 'fence'].includes(pathType)) {
          return errorResult('pathType 必须是 road/river/bridge/footpath/fence。')
        }
        const points = Array.isArray(args.points)
          ? (args.points as unknown[][])
              .filter((point) => Array.isArray(point) && point.length >= 2)
              .map((point) => [num(point[0], 0, -270, 270), num(point[1], 0, -270, 270)] as [number, number])
          : undefined
        return runSingle(
          {
            type: 'draw_path',
            pathType,
            points: points && points.length >= 2 ? points : undefined,
            width: args.width === undefined ? undefined : num(args.width, 6, 0.1, 40),
            closed: bool(args.closed),
            sidewalk: args.sidewalk === undefined ? undefined : bool(args.sidewalk),
            lanes: args.lanes === 4 ? 4 : args.lanes === 2 ? 2 : undefined,
            bridgeHeight: args.bridgeHeight === undefined ? undefined : num(args.bridgeHeight, 2.6, 0.8, 20),
            railings: args.railings === undefined ? undefined : bool(args.railings),
            length: args.length === undefined ? undefined : num(args.length, 20, 4, 90),
            curve: args.curve === undefined ? undefined : num(args.curve, 0, -20, 20),
            centerX: args.centerX === undefined ? undefined : num(args.centerX, 0, -260, 260),
            centerZ: args.centerZ === undefined ? undefined : num(args.centerZ, 0, -260, 260),
          },
          `MCP draw_path ${pathType}`,
        )
      }
      case 'add_pond':
        return runSingle(
          {
            type: 'add_pond',
            centerX: args.centerX === undefined ? undefined : num(args.centerX, 0, -260, 260),
            centerZ: args.centerZ === undefined ? undefined : num(args.centerZ, 0, -260, 260),
            radius: num(args.radius, 9, 3, 32),
          },
          'MCP add_pond',
        )
      case 'add_roof':
        return runSingle(
          {
            type: 'add_roof',
            x: args.x === undefined ? undefined : num(args.x, 0, -270, 270),
            z: args.z === undefined ? undefined : num(args.z, 0, -270, 270),
            style: typeof args.style === 'string' ? (args.style as 'gable' | 'hip' | 'flat' | 'shed') : undefined,
            finish: typeof args.finish === 'string' ? (args.finish as 'terracotta' | 'slate' | 'charcoal' | 'copper' | 'shingle') : undefined,
            pitch: args.pitch === undefined ? undefined : num(args.pitch, 28, 0, 65),
          },
          'MCP add_roof',
        )
      case 'add_vegetation':
        return runSingle(
          {
            type: 'add_vegetation',
            centerX: args.centerX === undefined ? undefined : num(args.centerX, 0, -260, 260),
            centerZ: args.centerZ === undefined ? undefined : num(args.centerZ, 0, -260, 260),
            radius: num(args.radius, 14, 4, 45),
            count: num(args.count, 6, 1, 20),
          },
          'MCP add_vegetation',
        )
      case 'add_level':
        return runSingle({ type: 'add_level' }, 'MCP add_level')
      case 'set_active_level':
        return runSingle(
          { type: 'set_active_level', index: num(args.index, 0, 0, 20) },
          'MCP set_active_level',
        )
      case 'update_level': {
        const level = findLevel(args)
        if (!level) return errorResult('未找到该楼层。')
        const patch: { name?: string; elevation?: number } = {}
        if (args.name !== undefined) {
          const name = str(args.name).trim().slice(0, 40)
          if (!name) return errorResult('楼层名称不能为空。')
          patch.name = name
        }
        if (args.elevation !== undefined) patch.elevation = num(args.elevation, level.elevation, -20, 300)
        if (Object.keys(patch).length === 0) return errorResult('至少提供 name 或 elevation。')
        useEditor.getState().updateLevel(level.id, patch)
        return toolResult({ level: { ...level, ...patch } }, `已更新${patch.name ?? level.name}`)
      }
      case 'duplicate_level': {
        const level = findLevel(args)
        if (!level) return errorResult('未找到该楼层。')
        const before = useEditor.getState().doc.levels.map((item) => item.id)
        const ok = useEditor.getState().duplicateLevel(level.id, {
          withFurniture: bool(args.withFurniture),
        })
        if (!ok) return errorResult('该楼层没有可复制的墙体、门窗或楼板。')
        const next = useEditor.getState()
        const created = next.doc.levels.find((item) => !before.includes(item.id))
        const entityCount = created
          ? Object.values(next.doc.entities).filter(
              (entity) => entity.kind !== 'opening' && entity.levelId === created.id,
            ).length
          : 0
        return toolResult(
          {
            levelId: created?.id ?? next.doc.activeLevelId,
            name: created?.name,
            elevation: created?.elevation,
            entities: entityCount,
          },
          `已复制${level.name}平面到${created?.name ?? '新楼层'}`,
        )
      }
      case 'delete_level': {
        const level = findLevel(args)
        if (!level) return errorResult('未找到该楼层。')
        const before = useEditor.getState().doc.levels.length
        useEditor.getState().deleteLevel(level.id)
        const after = useEditor.getState().doc.levels.length
        if (after === before) {
          return errorResult('该楼层仍有构件，或它是唯一楼层，无法删除。')
        }
        return toolResult({ removed: level.id }, `已删除${level.name}`)
      }
      case 'complete_rooms': {
        const state = useEditor.getState()
        const levelId =
          typeof args.levelId === 'string' &&
          state.doc.levels.some((level) => level.id === args.levelId)
            ? args.levelId
            : state.doc.activeLevelId
        const result = completeLevelRooms(state.doc, levelId, state.toolOptions, state.toolOptions.plan)
        if (result.entities.length > 0) {
          state.beginHistory('补全房间')
          state.addEntities(result.entities, false)
        }
        return toolResult(
          {
            levelId,
            rooms: result.rooms,
            slabs: result.slabs,
            roofs: result.roofs,
            doors: result.doors,
            windows: result.windows,
            ids: result.entities.map((entity) => entity.id),
          },
          result.entities.length > 0
            ? `补全 ${result.rooms} 个房间：${roomCompletionSummary(result)}`
            : result.rooms > 0
              ? '这些房间已经完整，没有需要补全的构件。'
              : '没有检测到闭合房间。',
        )
      }
      case 'set_plan_options': {
        const patch: Record<string, boolean> = {}
        for (const key of ['autoSlab', 'autoDoor', 'autoWindow', 'autoRoof'] as const) {
          if (args[key] !== undefined) patch[key] = bool(args[key])
        }
        if (Object.keys(patch).length === 0) return errorResult('至少提供一项平面补全选项。')
        useEditor.getState().setPlanOptions(patch)
        return toolResult({ plan: useEditor.getState().toolOptions.plan })
      }
      case 'modify_selected':
        return runSingle(
          {
            type: 'modify_selected',
            rotateByDeg: args.rotateByDeg === undefined ? undefined : num(args.rotateByDeg, 0, -720, 720),
            color: typeof args.color === 'string' ? args.color : undefined,
            x: args.x === undefined ? undefined : num(args.x, 0, -270, 270),
            z: args.z === undefined ? undefined : num(args.z, 0, -270, 270),
            scale: args.scale === undefined ? undefined : num(args.scale, 1, 0.2, 8),
            height: args.height === undefined ? undefined : num(args.height, 3.2, 0.6, 8),
            width: args.width === undefined ? undefined : num(args.width, 6, 0.4, 120),
            depth: args.depth === undefined ? undefined : num(args.depth, 4, 0.4, 120),
            pitch: args.pitch === undefined ? undefined : num(args.pitch, 28, 0, 65),
            finish: typeof args.finish === 'string' ? (args.finish as 'terracotta' | 'slate' | 'charcoal' | 'copper' | 'shingle') : undefined,
            openAngle: args.openAngle === undefined ? undefined : num(args.openAngle, 0, -135, 135),
            hinge: args.hinge === 'left' || args.hinge === 'right' ? args.hinge : undefined,
          },
          'MCP modify_selected',
        )
      case 'update_entity': {
        const updated = updateEntityFromArgs(args)
        if (updated.error) return errorResult(updated.error)
        const kind = useEditor.getState().doc.entities[updated.id!]?.kind ?? 'entity'
        return toolResult(
          { id: updated.id, patch: updated.patch, selection: selectedPayload() },
          `已修改${kind} ${updated.id}`,
        )
      }
      case 'delete_selected':
        return runSingle({ type: 'delete_selected' }, 'MCP delete_selected')
      case 'duplicate_selected': {
        const state = useEditor.getState()
        if (!state.selectedId) return errorResult('当前没有选中的构件。')
        state.duplicateSelected()
        const next = useEditor.getState()
        return toolResult(
          { selectedId: next.selectedId, selection: selectedPayload() },
          next.selectedId ? `已复制为 ${next.selectedId}` : '该构件无法复制。',
        )
      }
      case 'delete_entities': {
        const ids = Array.isArray(args.ids)
          ? args.ids.filter((item): item is string => typeof item === 'string')
          : []
        const state = useEditor.getState()
        const existing = ids.filter((id) => Boolean(state.doc.entities[id]))
        if (existing.length === 0) return errorResult('没有找到可删除的构件。')
        state.removeEntities(existing, true)
        return toolResult(
          { removed: existing, missing: ids.filter((id) => !existing.includes(id)) },
          `已删除 ${existing.length} 个构件`,
        )
      }
      case 'clear_level':
        if (args.confirm !== true) return errorResult('清空楼层需要 confirm=true。')
        return runSingle({ type: 'clear_level' }, 'MCP clear_level', true)
      case 'undo':
        return runSingle({ type: 'undo' }, 'MCP undo')
      case 'redo':
        return runSingle({ type: 'redo' }, 'MCP redo')
      case 'focus_all':
        return runSingle({ type: 'focus_all' }, 'MCP focus_all')
      case 'list_building_templates':
        return toolResult({
          templates: BUILDING_TEMPLATES.map((template) => ({
            id: template.id,
            name: template.name,
            subtitle: template.subtitle,
            width: template.width,
            depth: template.depth,
            floors: template.floors,
            floorHeight: template.floorHeight,
          })),
        })
      case 'place_building': {
        const templateId = str(args.templateId)
        if (!BUILDING_TEMPLATES.some((template) => template.id === templateId)) {
          return errorResult('未知建筑模板。')
        }
        const x = num(args.x, getEditorScene()?.getView().target[0] ?? 0, -400, 400)
        const z = num(args.z, getEditorScene()?.getView().target[2] ?? 0, -400, 400)
        const rot = num(args.rot, 0, -Math.PI * 2, Math.PI * 2)
        const template = BUILDING_TEMPLATES.find((item) => item.id === templateId)!
        const id = useEditor.getState().placeBuilding(templateId as BuildingTemplateId, x, z, rot, {
          floors: args.floors === undefined ? template.floors : Math.round(num(args.floors, template.floors, 1, 24)),
          wallColor: typeof args.wallColor === 'string' ? args.wallColor : undefined,
          roofFinish: ['terracotta', 'slate', 'charcoal', 'copper', 'shingle'].includes(str(args.roofFinish))
            ? (str(args.roofFinish) as 'terracotta' | 'slate' | 'charcoal' | 'copper' | 'shingle')
            : undefined,
          windowStyle: ['standard', 'wide', 'picture', 'slim', 'small'].includes(str(args.windowStyle))
            ? str(args.windowStyle)
            : undefined,
          furnished: bool(args.furnished, false),
          garden: bool(args.garden, false),
        })
        if (!id) return errorResult('当前楼层无法放置建筑。')
        window.requestAnimationFrame(() => getEditorScene()?.focusEntityIds([id]))
        return toolResult({ id, templateId, scene: sceneSummary() }, `已放置建筑 ${templateId}`)
      }
      case 'place_skyline': {
        const view = getEditorScene()?.getView()
        const count = Math.round(num(args.count, 6, 3, 8))
        const centerX = num(args.centerX, view?.target[0] ?? 0, -240, 240)
        const centerZ = num(args.centerZ, view?.target[2] ?? 0, -240, 240)
        const placed = useEditor.getState().placeSkyline(centerX, centerZ, count)
        if (!placed) return errorResult('当前无法放置天际线：请先退出建筑内部编辑。')
        window.requestAnimationFrame(() => getEditorScene()?.focusAll())
        return toolResult(
          { count: placed, centerX, centerZ },
          `已生成 ${placed} 栋建筑的天际线`,
        )
      }
      case 'generate_city': {
        const preset = str(args.preset, 'lakeside')
        const size = str(args.size, 'medium')
        if (!['lakeside', 'downtown', 'garden', 'riverside'].includes(preset)) {
          return errorResult('preset 必须是 lakeside、downtown、garden 或 riverside。')
        }
        if (!['small', 'medium', 'large'].includes(size)) {
          return errorResult('size 必须是 small、medium 或 large。')
        }
        const view = getEditorScene()?.getView()
        const center: [number, number] = [
          num(args.centerX, view?.target[0] ?? 0, -240, 240),
          num(args.centerZ, view?.target[2] ?? 0, -240, 240),
        ]
        const result = useEditor.getState().generateCity(
          {
            preset: preset as 'lakeside' | 'downtown' | 'garden' | 'riverside',
            size: size as 'small' | 'medium' | 'large',
            furnished: bool(args.furnished, true),
            streetTrees: bool(args.streetTrees, true),
            streetLights: bool(args.streetLights, true),
            vehicles: bool(args.vehicles, true),
          },
          center,
        )
        if (!result) return errorResult('当前无法生成城市：请先退出建筑内部编辑。')
        window.requestAnimationFrame(() => getEditorScene()?.focusAll())
        return toolResult(
          {
            name: result.name,
            center: result.center,
            size: [result.width, result.depth],
            buildings: result.buildings,
            paths: result.paths,
            props: result.props,
            scene: sceneSummary(),
          },
          `已生成${result.name}：${result.buildings} 栋建筑、${result.props} 个街景构件`,
        )
      }
      case 'furnish_building': {
        const id = str(args.id)
        if (id) {
          const building = useEditor.getState().doc.entities[id]
          if (!building || building.kind !== 'building') return errorResult('未找到该建筑。')
          const result = useEditor
            .getState()
            .furnishBuilding(id, Math.round(num(args.maxFloors, 40, 1, 40)))
          return toolResult(
            { buildingId: id, rooms: result.rooms, items: result.items, scene: sceneSummary() },
            result.items > 0 ? `已精装「${building.name}」：${result.items} 件家具` : '没有可精装的闭合房间。',
          )
        }
        const result = useEditor.getState().furnishLevel()
        return toolResult(
          { levelId: useEditor.getState().doc.activeLevelId, rooms: result.rooms, items: result.items, scene: sceneSummary() },
          result.items > 0 ? `已精装当前楼层：${result.items} 件家具` : '当前层没有可精装的闭合房间。',
        )
      }
      case 'landscape_building': {
        const id = str(args.id)
        const building = id ? useEditor.getState().doc.entities[id] : null
        if (!building || building.kind !== 'building') return errorResult('未找到该建筑。')
        const result = useEditor.getState().landscapeSelectedBuilding(id)
        if (!result) return errorResult('未找到该建筑。')
        if (result.entities.length === 0) {
          return toolResult(
            { buildingId: id, props: 0, path: false, alreadyLandscaped: true, scene: sceneSummary() },
            `「${building.name}」周边已有庭院或空间不足，未新增构件`,
          )
        }
        return toolResult(
          { buildingId: id, props: result.props, path: result.path, scene: sceneSummary() },
          `已为「${building.name}」布置 ${result.props} 个庭院构件`,
        )
      }
      case 'enter_building': {
        const id = str(args.id)
        if (!id) return errorResult('必须提供建筑 id。')
        useEditor.getState().enterBuilding(id)
        const session = useEditor.getState().buildingSession
        if (!session || session.buildingId !== id) {
          return errorResult(useEditor.getState().buildingSession ? '请先退出当前建筑。' : '未找到该建筑。')
        }
        return toolResult({ session: { buildingId: session.buildingId, name: session.name, floors: session.floors, mode: session.mode, levels: useEditor.getState().doc.levels }, scene: sceneSummary() }, `已进入「${session.name}」`)
      }
      case 'exit_building': {
        if (!useEditor.getState().buildingSession) return errorResult('当前不在建筑内部。')
        useEditor.getState().exitBuilding()
        return toolResult({ scene: sceneSummary() }, '已退出建筑')
      }
      case 'set_building_mode': {
        if (!useEditor.getState().buildingSession) return errorResult('当前不在建筑内部。')
        const mode = str(args.mode, 'interior')
        if (!['shell', 'interior'].includes(mode)) return errorResult('mode 必须是 shell 或 interior。')
        useEditor.getState().setBuildingMode(mode as 'shell' | 'interior')
        return toolResult({ mode })
      }
      case 'set_visual_style': {
        const style = str(args.style, 'mono')
        if (!['mono', 'daylight', 'sunset', 'blueprint'].includes(style)) {
          return errorResult('style 必须是 mono/daylight/sunset/blueprint。')
        }
        useEditor.getState().patchSettings({ visualStyle: style as 'mono' | 'daylight' | 'sunset' | 'blueprint' })
        return toolResult({ style })
      }
      case 'set_quality': {
        const quality = str(args.quality, 'auto')
        if (!['auto', 'high', 'balanced', 'low'].includes(quality)) {
          return errorResult('quality 必须是 auto/high/balanced/low。')
        }
        useEditor.getState().patchSettings({ quality: quality as 'auto' | 'high' | 'balanced' | 'low' })
        return toolResult({ quality })
      }
      case 'set_settings': {
        const patch: Record<string, unknown> = {}
        for (const key of ['gridSnap', 'angleSnap', 'showGrid', 'showRoofs', 'isolateLevel', 'planMode', 'shadows'] as const) {
          if (args[key] !== undefined) patch[key] = bool(args[key])
        }
        if (args.quality !== undefined) {
          const quality = str(args.quality)
          if (!['auto', 'high', 'balanced', 'low'].includes(quality)) return errorResult('未知 quality。')
          patch.quality = quality
        }
        if (args.visualStyle !== undefined) {
          const style = str(args.visualStyle)
          if (!['mono', 'daylight', 'sunset', 'blueprint'].includes(style)) return errorResult('未知 visualStyle。')
          patch.visualStyle = style
        }
        if (Object.keys(patch).length === 0) return errorResult('没有提供任何设置项。')
        useEditor.getState().patchSettings(patch as Partial<EditorSettings>)
        return toolResult({ settings: useEditor.getState().settings })
      }
      case 'set_project_name': {
        const name = str(args.name).trim().slice(0, 80)
        if (!name) return errorResult('项目名称不能为空。')
        useEditor.getState().setProjectName(name)
        return toolResult({ projectName: name }, `项目已重命名为「${name}」`)
      }
      case 'open_project': {
        if (args.confirm !== true) return errorResult('打开项目会替换当前场景，需要 confirm=true。')
        const path = str(args.path)
        if (!path) return errorResult('必须提供绝对文件路径 path。')
        const bytes = await readFileBytes(path)
        const { doc, view } = parseProjectText(new TextDecoder().decode(bytes))
        useEditor.getState().loadDocument(doc)
        const engine = getEditorScene()
        if (engine) {
          if (view) engine.setView(view)
          else engine.focusAll()
        }
        return toolResult(
          { path, projectName: doc.projectName, levels: doc.levels.length, counts: sceneSummary().counts },
          `已打开「${doc.projectName}」`,
        )
      }
      case 'import_model': {
        const path = str(args.path)
        if (!path) return errorResult('必须提供模型文件绝对路径 path。')
        const bytes = await readFileBytes(path)
        const fileName = path.split(/[\\/]/).pop() ?? 'imported-model.glb'
        const asset = await importModelFromBytes(fileName, bytes)
        const displayName = str(args.name).trim()
        if (displayName) asset.name = displayName.slice(0, 60)
        const loaded = await loadCustomAsset(asset)
        if (!loaded) return errorResult('模型解析成功，但加载到场景失败。')
        useEditor.getState().registerCustomAsset(asset)
        let placedId: string | null = null
        if (args.x !== undefined || args.z !== undefined) {
          const placed = placeObject(
            asset.id,
            num(args.x, 0, -270, 270),
            num(args.z, 0, -270, 270),
            num(args.rot, 0, -Math.PI * 20, Math.PI * 20),
            num(args.scale, 1, 0.2, 8),
          )
          if (placed.error) {
            return toolResult(
              {
                modelId: asset.id,
                name: asset.name,
                footprint: asset.footprint,
                height: asset.height,
                placed: false,
                warning: placed.error,
              },
              `已导入「${asset.name}」，但指定位置无法放置：${placed.error}`,
            )
          }
          placedId = placed.entity!.id
        }
        return toolResult(
          {
            modelId: asset.id,
            name: asset.name,
            footprint: asset.footprint,
            height: asset.height,
            placedId,
          },
          `已导入「${asset.name}」`,
        )
      }
      case 'apply_actions': {
        if (!Array.isArray(args.actions) || args.actions.length === 0) {
          return errorResult('actions 必须是非空数组。')
        }
        const parsed = parsePlanContent(
          JSON.stringify({ reply: 'MCP apply_actions', actions: args.actions }),
          'local',
        )
        if (parsed.actions.length === 0) {
          return errorResult(`没有可执行的动作。${parsed.warnings?.join('；') ?? ''}`)
        }
        const allow = bool(args.allowDestructive)
        if (planHasDestructive(parsed) && !allow) {
          return errorResult('计划包含危险操作，请传 allowDestructive=true。')
        }
        const result = executeForMcp(parsed.actions, 'MCP apply_actions', allow)
        return result
      }
      case 'save_project': {
        const path = str(args.path)
        if (!path) return errorResult('必须提供绝对文件路径 path。')
        const payload = getProjectPayload(getEditorScene())
        await saveBytes(path, new TextEncoder().encode(JSON.stringify(payload, null, 2)))
        useEditor.getState().markClean()
        return toolResult({ path, bytes: JSON.stringify(payload).length }, `已保存项目到 ${path}`)
      }
      case 'export_scene': {
        const format = str(args.format) as ExportFormat
        const path = str(args.path)
        if (!['glb', 'gltf', 'obj', 'stl'].includes(format)) return errorResult('format 必须是 glb/gltf/obj/stl。')
        if (!path) return errorResult('必须提供绝对文件路径 path。')
        const exported = await exportBytes(format)
        await saveBytes(path, exported.bytes)
        return toolResult({ path, format, bytes: exported.bytes.length }, `已导出 ${format.toUpperCase()} 到 ${path}`)
      }
      case 'new_project': {
        if (args.confirm !== true) return errorResult('新建项目需要 confirm=true。')
        const store = useEditor.getState()
        store.newProject(bool(args.sample) ? createSampleDocument() : createBlankDocument())
        store.setTool('select')
        getEditorScene()?.setView(bool(args.sample) ? SAMPLE_VIEW : { target: [0, 0.5, 0], distance: 32, azimuth: 0.4, polar: 1.0 })
        return toolResult(sceneSummary(), bool(args.sample) ? '已载入示例项目' : '已新建空白项目')
      }
      default:
        return errorResult(`未知工具：${name}`)
    }
  } catch (error) {
    return errorResult(error instanceof Error ? error.message : String(error))
  }
}

export function mcpToolsPayload() {
  return {
    tools: MCP_TOOLS.map(({ name, title, description, inputSchema }) => ({
      name,
      title,
      description,
      inputSchema,
    })),
  }
}
