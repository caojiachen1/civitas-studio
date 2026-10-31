import type { ModelCategory, ModelDef } from '../editor/types'

const modules = import.meta.glob<{ default: ModelDef }>('./catalog/**/*.ts', { eager: true })

export const CATALOG_MODELS: ModelDef[] = Object.values(modules)
  .map((m) => m.default)
  .filter((m): m is ModelDef => Boolean(m?.id))

export const MODEL_MAP = new Map<string, ModelDef>(CATALOG_MODELS.map((model) => [model.id, model]))

export const CATALOG_SECTIONS: {
  id: string
  title: string
  subtitle: string
  categories: ModelCategory[]
}[] = [
  {
    id: 'interior',
    title: '室内陈设',
    subtitle: '家具、橱柜与软装',
    categories: ['living', 'bedroom', 'dining', 'kitchen', 'bathroom', 'office', 'laundry'],
  },
  {
    id: 'outdoor',
    title: '户外与园艺',
    subtitle: '庭院家具、植物与景观',
    categories: ['outdoor', 'vegetation'],
  },
  {
    id: 'city',
    title: '城市设施',
    subtitle: '街道、车辆与公共空间',
    categories: ['street', 'infrastructure', 'vehicles'],
  },
  {
    id: 'structure',
    title: '结构构件',
    subtitle: '楼梯、立柱与建筑细部',
    categories: ['structure'],
  },
]

export function getModelsByCategory(category: ModelCategory): ModelDef[] {
  return CATALOG_MODELS.filter((m) => m.category === category)
}

export function searchModels(query: string): ModelDef[] {
  const q = query.trim().toLowerCase()
  if (!q) return CATALOG_MODELS
  return CATALOG_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.category.includes(q) ||
      (m.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  )
}

export function getModel(id: string | null): ModelDef | null {
  if (!id) return null
  return MODEL_MAP.get(id) ?? null
}

export function getModelFootprints(): Map<string, [number, number]> {
  return new Map(CATALOG_MODELS.map((m) => [m.id, m.footprint]))
}
