export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export type ToolId =
  | 'select'
  | 'plan'
  | 'building'
  | 'wall'
  | 'slab'
  | 'door'
  | 'window'
  | 'roof'
  | 'path'
  | 'object'
  | 'erase'

export type ModelCategory =
  | 'living'
  | 'bedroom'
  | 'dining'
  | 'kitchen'
  | 'bathroom'
  | 'office'
  | 'laundry'
  | 'outdoor'
  | 'vegetation'
  | 'street'
  | 'infrastructure'
  | 'vehicles'
  | 'structure'
  | 'custom'

export type PlacementRule = 'any' | 'indoor' | 'outdoor' | 'on-road' | 'on-water'

export type SurfaceKind =
  | 'matte'
  | 'fabric'
  | 'leather'
  | 'wood'
  | 'metal'
  | 'glass'
  | 'ceramic'
  | 'stone'
  | 'foliage'
  | 'gloss'
  | 'emissive'

export interface PartOptions {
  mat?: SurfaceKind
  rot?: Vec3
  opacity?: number
  side?: 'front' | 'back' | 'double'
}

export type Part =
  | { shape: 'box'; size: Vec3; pos: Vec3; color: string; opts?: PartOptions }
  | { shape: 'rbox'; size: Vec3; radius: number; pos: Vec3; color: string; opts?: PartOptions }
  | {
      shape: 'cyl'
      rTop: number
      rBottom: number
      h: number
      seg: number
      pos: Vec3
      color: string
      opts?: PartOptions
    }
  | { shape: 'sphere'; r: number; seg: number; pos: Vec3; color: string; opts?: PartOptions }
  | { shape: 'ico'; r: number; detail: number; pos: Vec3; color: string; opts?: PartOptions }
  | { shape: 'cone'; r1: number; r2: number; h: number; seg: number; pos: Vec3; color: string; opts?: PartOptions }
  | { shape: 'torus'; r: number; tube: number; seg: number; pos: Vec3; color: string; opts?: PartOptions }
  | { shape: 'prism'; points: Vec2[]; depth: number; pos: Vec3; color: string; opts?: PartOptions }

export interface ModelDef {
  id: string
  name: string
  category: ModelCategory
  tags?: string[]
  footprint: [number, number]
  height: number
  placement?: PlacementRule
  wallAlign?: boolean
  noCollide?: boolean
  shadow?: boolean
  parts: Part[]
}

export interface Level {
  id: string
  name: string
  elevation: number
}

export interface WallEntity {
  id: string
  kind: 'wall'
  levelId: string
  a: Vec2
  b: Vec2
  height: number
  thickness: number
  color: string
}

export type DoorHinge = 'left' | 'right'

export interface OpeningEntity {
  id: string
  kind: 'opening'
  type: 'door' | 'window'
  wallId: string
  offset: number
  width: number
  height: number
  sill: number
  style: string
  openAngle?: number
  hinge?: DoorHinge
}

export interface ObjectEntity {
  id: string
  kind: 'object'
  levelId: string
  modelId: string
  x: number
  z: number
  rot: number
  scale: number
}

export interface SlabEntity {
  id: string
  kind: 'slab'
  levelId: string
  x: number
  z: number
  w: number
  d: number
  rot: number
  thickness: number
  style: SlabStyle
}

export type SlabStyle = 'wood' | 'oak' | 'concrete' | 'tile' | 'stone' | 'deck'

export interface RoofEntity {
  id: string
  kind: 'roof'
  levelId: string
  x: number
  z: number
  w: number
  d: number
  rot: number
  style: RoofStyle
  finish: RoofFinish
  pitch: number
  eaveY: number
  overhang: number
}

export type RoofStyle = 'gable' | 'hip' | 'flat' | 'shed'

export type RoofFinish = 'terracotta' | 'slate' | 'charcoal' | 'copper' | 'shingle'

export type PathType = 'road' | 'footpath' | 'river' | 'bridge' | 'fence'

export interface PathEntity {
  id: string
  kind: 'path'
  levelId: string
  pathType: PathType
  points: Vec2[]
  width: number
  style: string
  sidewalk: boolean
  lanes: number
  bridgeHeight: number
  railings: boolean
  closed?: boolean
}

export type BuildingTemplateId = 'villa' | 'townhouse' | 'office' | 'tower'
export type BuildingMode = 'shell' | 'interior'

export interface BuildingStyleOverrides {
  wallColor?: string
  roofFinish?: RoofFinish
  windowStyle?: string
}

export interface BuildingPlacementOptions extends BuildingStyleOverrides {
  floors?: number
  furnished?: boolean
  garden?: boolean
}

export interface BuildingDraft {
  templateId: BuildingTemplateId
  floors: number
  wallColor: string
  roofFinish: RoofFinish
  windowStyle: string
  furnished: boolean
  garden: boolean
}

export interface BuildingInterior {
  levels: Level[]
  entities: Record<string, Entity>
  entityOrder: string[]
  shellWallIds: string[]
}

export interface BuildingEntity {
  id: string
  kind: 'building'
  levelId: string
  x: number
  z: number
  rot: number
  templateId: BuildingTemplateId
  name: string
  width: number
  depth: number
  floors: number
  floorHeight: number
  interior: BuildingInterior
}

export type Entity =
  | WallEntity
  | OpeningEntity
  | ObjectEntity
  | SlabEntity
  | RoofEntity
  | PathEntity
  | BuildingEntity

export interface CustomAsset {
  id: string
  name: string
  dataUrl: string
  footprint: [number, number]
  height: number
}

export interface EditorDocument {
  schemaVersion: 1
  projectName: string
  levels: Level[]
  activeLevelId: string
  entities: Record<string, Entity>
  entityOrder: string[]
  customAssets: CustomAsset[]
}

export interface ViewState {
  target: Vec3
  distance: number
  azimuth: number
  polar: number
}

export interface BuildingSession {
  buildingId: string
  name: string
  templateId: BuildingTemplateId
  cityDoc: EditorDocument
  cityLevelId: string
  baseElevation: number
  center: Vec2
  width: number
  depth: number
  floors: number
  floorHeight: number
  shellWallIds: string[]
  mode: BuildingMode
}

export interface ProjectFile {
  app: 'civitas-studio'
  version: 1
  doc: EditorDocument
  view?: ViewState
  savedAt: number
}

export interface PathOptions {
  type: PathType
  width: number
  style: string
  sidewalk: boolean
  lanes: number
  bridgeHeight: number
  railings: boolean
}

export type RenderQuality = 'auto' | 'high' | 'balanced' | 'low'
export type VisualStyle = 'mono' | 'daylight' | 'sunset' | 'blueprint'

export interface EditorSettings {
  gridSnap: boolean
  angleSnap: boolean
  showGrid: boolean
  showRoofs: boolean
  isolateLevel: boolean
  planMode: boolean
  shadows: boolean
  quality: RenderQuality
  visualStyle: VisualStyle
}

export interface WallDefaults {
  height: number
  thickness: number
  color: string
}

export interface SlabDefaults {
  style: SlabStyle
  thickness: number
}

export interface OpeningDefaults {
  doorStyle: string
  windowStyle: string
  doorOpenAngle: number
  doorHinge: DoorHinge
}

export interface RoofDefaults {
  style: RoofStyle
  finish: RoofFinish
  pitch: number
  overhang: number
}

export interface PlanOptions {
  autoSlab: boolean
  autoDoor: boolean
  autoWindow: boolean
  autoRoof: boolean
}

export interface PlacementDefaults {
  wall: WallDefaults
  slab: SlabDefaults
  openings: OpeningDefaults
  roof: RoofDefaults
  path: PathOptions
  plan: PlanOptions
}

export interface DoorStyleDef {
  id: string
  name: string
  width: number
  height: number
  glass?: boolean
  double?: boolean
}

export interface WindowStyleDef {
  id: string
  name: string
  width: number
  height: number
  sill: number
  panes?: number
}

export const DOOR_STYLES: DoorStyleDef[] = [
  { id: 'single', name: '单开门', width: 0.95, height: 2.15 },
  { id: 'double', name: '双开门', width: 1.7, height: 2.25, double: true },
  { id: 'sliding', name: '推拉玻璃门', width: 1.8, height: 2.3, glass: true, double: true },
  { id: 'glass', name: '玻璃门', width: 1.05, height: 2.2, glass: true },
  { id: 'garage', name: '车库门', width: 3.2, height: 2.35 },
]

export const WINDOW_STYLES: WindowStyleDef[] = [
  { id: 'standard', name: '标准窗', width: 1.25, height: 1.25, sill: 0.95, panes: 2 },
  { id: 'wide', name: '宽景窗', width: 2.1, height: 1.35, sill: 0.85, panes: 3 },
  { id: 'picture', name: '落地景观窗', width: 2.6, height: 1.9, sill: 0.35, panes: 2 },
  { id: 'slim', name: '竖长窗', width: 0.8, height: 1.65, sill: 0.8, panes: 1 },
  { id: 'small', name: '高窗', width: 0.9, height: 0.7, sill: 1.75, panes: 1 },
]

export const WALL_COLORS = [
  { id: 'ivory', name: '暖白', color: '#e8e0d2' },
  { id: 'chalk', name: '白垩', color: '#f1efea' },
  { id: 'sage', name: '灰绿', color: '#a8b5a1' },
  { id: 'sand', name: '沙岩', color: '#d6c3a3' },
  { id: 'clay', name: '陶土', color: '#bd8a73' },
  { id: 'navy', name: '深海蓝', color: '#55606e' },
  { id: 'graphite', name: '石墨', color: '#565b5d' },
  { id: 'rose', name: '灰粉', color: '#c7a9a3' },
]

export const SLAB_STYLES: { id: SlabStyle; name: string; color: string; top: string; roughness: number }[] = [
  { id: 'wood', name: '浅色木地板', color: '#a88864', top: '#c4a67e', roughness: 0.55 },
  { id: 'oak', name: '橡木地板', color: '#8a6847', top: '#b08c62', roughness: 0.5 },
  { id: 'concrete', name: '清水混凝土', color: '#6b6d6e', top: '#b7b8b4', roughness: 0.9 },
  { id: 'tile', name: '石材瓷砖', color: '#b9b7af', top: '#d8d5cc', roughness: 0.35 },
  { id: 'stone', name: '天然石材', color: '#7d7c74', top: '#a9a79b', roughness: 0.65 },
  { id: 'deck', name: '户外木平台', color: '#6b5540', top: '#987654', roughness: 0.75 },
]

export const PATH_PRESETS: Record<PathType, { name: string; width: number; style: string }> = {
  road: { name: '城市道路', width: 7.2, style: 'urban' },
  footpath: { name: '人行步道', width: 2.2, style: 'stone' },
  river: { name: '河流', width: 9, style: 'river' },
  bridge: { name: '桥梁', width: 7.2, style: 'urban' },
  fence: { name: '围栏 / 绿篱', width: 0.16, style: 'wood' },
}

export const ROOF_STYLES: { id: RoofStyle; name: string; hint: string }[] = [
  { id: 'gable', name: '双坡屋顶', hint: '经典人字屋顶' },
  { id: 'hip', name: '四坡屋顶', hint: '四面倾斜的包覆屋顶' },
  { id: 'flat', name: '平屋顶', hint: '带女儿墙的现代屋顶' },
  { id: 'shed', name: '单坡屋顶', hint: '简洁的单向坡面' },
]

export const LEVEL_HEIGHT = 3.2
