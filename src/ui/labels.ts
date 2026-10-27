import { getModel } from '../models/registry'
import { useEditor } from '../editor/store'
import {
  SLAB_STYLES,
  type Entity,
  type PathType,
  type RoofFinish,
  type RoofStyle,
  type SlabStyle,
  type ToolId,
} from '../editor/types'

export const TOOL_LABELS: Record<ToolId, string> = {
  select: '选择',
  plan: '平面房间',
  wall: '墙体',
  slab: '楼板',
  door: '门',
  window: '窗',
  roof: '屋顶',
  path: '路径',
  object: '放置组件',
  erase: '擦除',
}

export function pathTypeLabel(type: PathType | string): string {
  if (type === 'road') return '城市道路'
  if (type === 'river') return '河流'
  if (type === 'bridge') return '桥梁'
  if (type === 'footpath') return '人行步道'
  if (type === 'fence') return '围栏与绿篱'
  return String(type)
}

export function slabStyleLabel(style: SlabStyle): string {
  return SLAB_STYLES.find((item) => item.id === style)?.name ?? style
}

export const ROOF_STYLE_LABELS: Record<RoofStyle, string> = {
  gable: '双坡屋顶',
  hip: '四坡屋顶',
  flat: '平屋顶',
  shed: '单坡屋顶',
}

export const ROOF_FINISH_LABELS: Record<RoofFinish, string> = {
  terracotta: '陶土瓦',
  slate: '青石板',
  charcoal: '炭黑金属',
  copper: '氧化铜',
  shingle: '木瓦',
}

export function entityDisplayName(entity: Entity): string {
  switch (entity.kind) {
    case 'wall':
      return '墙体'
    case 'opening':
      return entity.type === 'door' ? '门' : '窗'
    case 'path':
      return pathTypeLabel(entity.pathType)
    case 'slab':
      return `${slabStyleLabel(entity.style)}楼板`
    case 'roof':
      return ROOF_STYLE_LABELS[entity.style]
    case 'object': {
      const model = getModel(entity.modelId)
      if (model) return model.name
      const asset = useEditor.getState().doc.customAssets.find((item) => item.id === entity.modelId)
      return asset?.name ?? '导入模型'
    }
    default:
      return '构件'
  }
}

export function toolLabelForState(tool: ToolId, activeModelId: string | null): string {
  if (tool === 'object') {
    const model = getModel(activeModelId)
    if (model) return model.name
    const asset = useEditor.getState().doc.customAssets.find((item) => item.id === activeModelId)
    return asset?.name ?? '放置组件'
  }
  return TOOL_LABELS[tool]
}
