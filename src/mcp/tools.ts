import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js'
import { STLExporter } from 'three/addons/exporters/STLExporter.js'
import { createBlankDocument, useEditor } from '../editor/store'
import { BUILDING_TEMPLATES } from '../editor/buildings'
import { createSampleDocument, SAMPLE_VIEW } from '../editor/sample'
import { getEditorScene } from '../editor/engineRef'
import { isTauriHost } from '../editor/platform'
import { getProjectPayload, buildExportScene, type ExportFormat } from '../editor/fileIO'
import { CATALOG_MODELS, MODEL_MAP } from '../models/registry'
import { buildSceneContext, modelName } from '../ai/context'
import { executePlan, planHasDestructive, planShouldFocus } from '../ai/executor'
import { parsePlanContent } from '../ai/planParse'
import type { AiAction, AiActionPlan, AiExecutionResult, AiRoomType } from '../ai/types'
import { ROOM_TYPE_LABELS } from '../ai/types'
import type { BuildingTemplateId, Entity } from '../editor/types'

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
  } else if (entity.kind === 'slab' || entity.kind === 'roof') {
    base.x = entity.x
    base.z = entity.z
    base.w = entity.w
    base.d = entity.d
    base.rot = entity.rot
    base.style = entity.kind === 'slab' ? entity.style : entity.style
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

function screenshot(maxSize = 1280): { mime: string; data: string; width: number; height: number } {
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
  return { mime: 'image/jpeg', data: dataUrl.split(',')[1] ?? '', width, height }
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
      },
    },
  },
  {
    name: 'set_camera',
    title: '设置相机',
    description: 'Set the orbit camera target/distance/orbit angles in metres and radians.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
        distance: { type: 'number' },
        azimuth: { type: 'number' },
        polar: { type: 'number' },
      },
    },
  },
  {
    name: 'get_screenshot',
    title: '截取场景画面',
    description: 'Render a JPEG snapshot of the current viewport and return it as base64. Useful for visual feedback loops.',
    inputSchema: {
      type: 'object',
      properties: {
        maxSize: { type: 'number', description: 'Longest edge in pixels, default 1280.' },
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
    description: 'Place a whole building as one entity. It can be moved/rotated as a unit and entered for shell/interior editing.',
    inputSchema: {
      type: 'object',
      required: ['templateId'],
      properties: {
        templateId: { type: 'string', enum: ['villa', 'townhouse', 'office', 'tower'] },
        x: { type: 'number' },
        z: { type: 'number' },
        rot: { type: 'number' },
      },
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
      'Execute a list of editor actions as one atomic history step. Use this for complex multi-step modeling. Action types: build_villa, build_room, furnish_room, place_model, draw_path, add_pond, add_roof, add_vegetation, add_level, set_active_level, modify_selected, delete_selected, clear_level, undo, redo, focus_all. clear_level requires allowDestructive=true.',
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
        const entities = includeEntities
          ? Object.values(useEditor.getState().doc.entities).slice(0, limit).map(entitySummary)
          : undefined
        return toolResult({ context, selection: selectedPayload(), entities, entityLimit: limit })
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
        const current = engine.getView()
        const target = Array.isArray(args.target) && args.target.length >= 3
          ? [Number(args.target[0]), Number(args.target[1]), Number(args.target[2])] as [number, number, number]
          : current.target
        const view = {
          target,
          distance: num(args.distance, current.distance, 1.6, 220),
          azimuth: num(args.azimuth, current.azimuth, -Math.PI * 20, Math.PI * 20),
          polar: num(args.polar, current.polar, 0.16, 1.47),
        }
        engine.setView(view)
        return toolResult({ view })
      }
      case 'get_screenshot':
        return toolResult(screenshot(num(args.maxSize, 1280, 320, 2560)))
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
        if (!MODEL_MAP.has(modelId)) return errorResult(`未知 modelId：${modelId}`)
        return runSingle(
          {
            type: 'place_model',
            modelId,
            x: args.x === undefined ? undefined : num(args.x, 0, -270, 270),
            z: args.z === undefined ? undefined : num(args.z, 0, -270, 270),
            rot: args.rot === undefined ? undefined : num(args.rot, 0, -Math.PI * 20, Math.PI * 20),
            scale: num(args.scale, 1, 0.2, 8),
          },
          `MCP place_model ${modelId}`,
        )
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
      case 'delete_selected':
        return runSingle({ type: 'delete_selected' }, 'MCP delete_selected')
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
        const x = num(args.x, 0, -400, 400)
        const z = num(args.z, 0, -400, 400)
        const rot = num(args.rot, 0, -Math.PI * 2, Math.PI * 2)
        const id = useEditor.getState().placeBuilding(templateId as BuildingTemplateId, x, z, rot)
        if (!id) return errorResult('当前楼层无法放置建筑。')
        window.requestAnimationFrame(() => getEditorScene()?.focusEntityIds([id]))
        return toolResult({ id, templateId, scene: sceneSummary() }, `已放置建筑 ${templateId}`)
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
