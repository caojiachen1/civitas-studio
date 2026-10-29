import { getModel, getModelFootprints } from '../models/registry'
import { createBuildingEntity, getBuildingTemplate } from './buildings'
import { furnishInterior } from './furnish'
import { landscapeBuilding } from './landscape'
import { distanceToPathCenter, isPointOnRoad, isPointOnWater, obbOverlap } from './geom'
import { objectOBB } from './validation'
import type {
  BuildingEntity,
  BuildingTemplateId,
  EditorDocument,
  Entity,
  ObjectEntity,
  PathEntity,
  RoofFinish,
  SlabEntity,
  Vec2,
} from './types'

export type CityPresetId = 'lakeside' | 'downtown' | 'garden' | 'riverside'
export type CitySize = 'small' | 'medium' | 'large'

export interface CityGenOptions {
  preset: CityPresetId
  size: CitySize
  furnished: boolean
  streetTrees: boolean
  streetLights: boolean
  vehicles: boolean
}

export interface CityGenResult {
  entities: Entity[]
  center: Vec2
  width: number
  depth: number
  buildings: number
  paths: number
  props: number
  name: string
}

export interface CityPreset {
  id: CityPresetId
  name: string
  subtitle: string
}

export const CITY_PRESETS: CityPreset[] = [
  { id: 'lakeside', name: '湖畔小镇', subtitle: '坡顶住宅 · 中央池塘 · 林荫街道' },
  { id: 'downtown', name: '都市街区', subtitle: '玻璃塔楼 · 中央广场 · 网格路网' },
  { id: 'garden', name: '花园住区', subtitle: '低密住宅 · 花园庭院 · 社区公园' },
  { id: 'riverside', name: '滨水新城', subtitle: '沿河塔楼 · 滨水步道 · 跨河桥' },
]

export const DEFAULT_CITY_OPTIONS: CityGenOptions = {
  preset: 'lakeside',
  size: 'medium',
  furnished: true,
  streetTrees: true,
  streetLights: true,
  vehicles: true,
}

export function cityFootprint(options: CityGenOptions): { width: number; depth: number } {
  const [cols, rows] = GRID[options.size]
  return {
    width: cols * BLOCK + (options.preset === 'riverside' ? 90 : 30),
    depth: rows * BLOCK + (options.preset === 'riverside' ? 170 : 30),
  }
}

const GRID: Record<CitySize, [number, number]> = {
  small: [2, 2],
  medium: [3, 2],
  large: [3, 3],
}

const BLOCK = 50
const ROAD_WIDTH = 7.2
const SETBACK = 9
const RESIDENTIAL_FACADES = ['#e8e0d2', '#f1efea', '#d6c3a3', '#bd8a73', '#a8b5a1', '#c7a9a3']
const DOWNTOWN_FACADES = ['#f1efea', '#b9b7b0', '#aab2b6', '#565b5d', '#55606e', '#8f989d']
const FINISHES: RoofFinish[] = ['terracotta', 'slate', 'charcoal', 'copper', 'shingle']
const TREE_IDS = ['tree-oak', 'tree-maple', 'tree-birch', 'tree-pine', 'tree-willow']
const CAR_IDS = ['car-sedan', 'car-suv', 'car-hatchback', 'taxi', 'car-van']

function cid(prefix: string): string {
  const raw =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  return `city_${prefix}_${raw}`
}

function rng(seed: number) {
  let state = seed >>> 0 || 1
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: () => number, list: T[]): T {
  return list[Math.floor(random() * list.length) % list.length]
}

function makePath(
  levelId: string,
  pathType: PathEntity['pathType'],
  points: Vec2[],
  options: Partial<PathEntity> = {},
): PathEntity {
  return {
    id: cid('path'),
    kind: 'path',
    levelId,
    pathType,
    points,
    width: pathType === 'river' ? 12 : pathType === 'footpath' ? 2.2 : ROAD_WIDTH,
    style: pathType === 'river' ? 'river' : pathType === 'footpath' ? 'stone' : 'urban',
    sidewalk: pathType === 'road',
    lanes: 2,
    bridgeHeight: 2.6,
    railings: pathType === 'bridge',
    ...options,
  }
}

export function findCityAnchor(
  doc: EditorDocument,
  levelId: string,
  width: number,
  depth: number,
  preferred: Vec2,
): Vec2 {
  const entities = Object.values(doc.entities).filter(
    (entity) => entity.kind === 'opening' || entity.levelId === levelId,
  )
  const footprints = getModelFootprints()
  for (const asset of doc.customAssets) footprints.set(asset.id, asset.footprint)
  const areaFree = (cx: number, cz: number): boolean => {
    const pad = 12
    const rect = { x: cx, z: cz, hw: width / 2 + pad, hd: depth / 2 + pad, rot: 0 }
    if (Math.abs(cx) + rect.hw > 270 || Math.abs(cz) + rect.hd > 270) return false
    for (const entity of entities) {
      if (entity.kind === 'path') {
        const half = entity.width / 2 + (entity.sidewalk ? 1.4 : 0) + 2
        for (const point of entity.points) {
          if (Math.abs(point[0] - cx) < rect.hw + half && Math.abs(point[1] - cz) < rect.hd + half) return false
        }
        continue
      }
      if (entity.kind === 'opening') continue
      if (entity.kind === 'building') {
        if (obbOverlap(rect, objectOBB(entity.x, entity.z, entity.rot, entity.width, entity.depth), 4)) return false
        continue
      }
      if (entity.kind === 'wall') {
        const minX = Math.min(entity.a[0], entity.b[0])
        const maxX = Math.max(entity.a[0], entity.b[0])
        const minZ = Math.min(entity.a[1], entity.b[1])
        const maxZ = Math.max(entity.a[1], entity.b[1])
        if (Math.abs((minX + maxX) / 2 - cx) < rect.hw + (maxX - minX) / 2 + 2 &&
            Math.abs((minZ + maxZ) / 2 - cz) < rect.hd + (maxZ - minZ) / 2 + 2) return false
        continue
      }
      if (entity.kind === 'object') {
        const fp = footprints.get(entity.modelId)
        if (!fp) continue
        if (obbOverlap(rect, objectOBB(entity.x, entity.z, entity.rot, fp[0], fp[1], entity.scale), 1.5)) return false
        continue
      }
      if (entity.kind === 'slab' || entity.kind === 'roof') {
        if (obbOverlap(rect, { x: entity.x, z: entity.z, hw: entity.w / 2, hd: entity.d / 2, rot: entity.rot }, 2)) return false
      }
    }
    return true
  }
  if (areaFree(preferred[0], preferred[1])) return preferred
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const entity of entities) {
    if (entity.kind === 'opening') continue
    if (entity.kind === 'path') {
      for (const point of entity.points) {
        minX = Math.min(minX, point[0])
        maxX = Math.max(maxX, point[0])
        minZ = Math.min(minZ, point[1])
        maxZ = Math.max(maxZ, point[1])
      }
    } else if (entity.kind === 'building') {
      minX = Math.min(minX, entity.x - entity.width / 2)
      maxX = Math.max(maxX, entity.x + entity.width / 2)
      minZ = Math.min(minZ, entity.z - entity.depth / 2)
      maxZ = Math.max(maxZ, entity.z + entity.depth / 2)
    } else if (entity.kind === 'wall') {
      minX = Math.min(minX, entity.a[0], entity.b[0])
      maxX = Math.max(maxX, entity.a[0], entity.b[0])
      minZ = Math.min(minZ, entity.a[1], entity.b[1])
      maxZ = Math.max(maxZ, entity.a[1], entity.b[1])
    } else if (entity.kind === 'object' || entity.kind === 'slab' || entity.kind === 'roof') {
      minX = Math.min(minX, entity.x)
      maxX = Math.max(maxX, entity.x)
      minZ = Math.min(minZ, entity.z)
      maxZ = Math.max(maxZ, entity.z)
    }
  }
  if (Number.isFinite(maxX)) {
    const midX = (minX + maxX) / 2
    const midZ = (minZ + maxZ) / 2
    const adjacent: Vec2[] = [
      [maxX + width / 2 + 26, midZ],
      [minX - width / 2 - 26, midZ],
      [midX, maxZ + depth / 2 + 26],
      [midX, minZ - depth / 2 - 26],
    ]
    for (const candidate of adjacent) {
      if (areaFree(candidate[0], candidate[1])) return candidate
    }
  }
  for (let radius = 30; radius <= 210; radius += 30) {
    for (let index = 0; index < 16; index++) {
      const angle = (index / 16) * Math.PI * 2 + radius * 0.11
      const x = preferred[0] + Math.cos(angle) * radius
      const z = preferred[1] + Math.sin(angle) * radius
      if (areaFree(x, z)) return [x, z]
    }
  }
  if (!Number.isFinite(maxX)) return preferred
  return [Math.min(240, maxX + width / 2 + 24), (minZ + maxZ) / 2]
}

interface CityDraft {
  levelId: string
  entities: Entity[]
  buildings: BuildingEntity[]
  paths: PathEntity[]
  props: ObjectEntity[]
  footprints: Map<string, [number, number]>
}

function buildingOBB(entity: BuildingEntity) {
  return objectOBB(entity.x, entity.z, entity.rot, entity.width, entity.depth)
}

function propFits(draft: CityDraft, x: number, z: number, clearance = 0.7, mode: 'normal' | 'road' = 'normal'): boolean {
  if (mode !== 'road' && isPointOnWater(x, z, draft.entities, 0.3)) return false
  if (mode === 'normal' && isPointOnRoad(x, z, draft.entities, clearance)) return false
  for (const path of draft.paths) {
    if (path.pathType !== 'footpath') continue
    if (distanceToPathCenter(x, z, path) < path.width / 2 + 0.35) return false
  }
  for (const building of draft.buildings) {
    if (obbOverlap(objectOBB(x, z, 0, 1.2, 1.2), buildingOBB(building), 0.4)) return false
  }
  for (const prop of draft.props) {
    const fp = draft.footprints.get(prop.modelId)
    if (!fp) continue
    if (obbOverlap(objectOBB(x, z, 0, 1.2, 1.2), objectOBB(prop.x, prop.z, prop.rot, fp[0], fp[1], prop.scale), 0.4)) {
      return false
    }
  }
  return true
}

function addProp(
  draft: CityDraft,
  modelId: string,
  x: number,
  z: number,
  rot: number,
  clearance = 0.7,
  mode: 'normal' | 'road' = 'normal',
): boolean {
  const model = getModel(modelId)
  if (!model) return false
  if (!propFits(draft, x, z, clearance, mode)) return false
  const prop: ObjectEntity = {
    id: cid('obj'),
    kind: 'object',
    levelId: draft.levelId,
    modelId,
    x,
    z,
    rot,
    scale: 1,
  }
  draft.props.push(prop)
  draft.entities.push(prop)
  return true
}

function addLandscape(draft: CityDraft, building: BuildingEntity) {
  const result = landscapeBuilding(building, draft.entities)
  draft.entities.push(...result.entities)
  for (const entity of result.entities) {
    if (entity.kind === 'object') draft.props.push(entity)
    else if (entity.kind === 'path') draft.paths.push(entity)
  }
}

function addParkBlock(draft: CityDraft, cx: number, cz: number, preset: CityPresetId, random: () => number) {
  const centerX = cx
  const centerZ = cz
  if (preset === 'downtown') {
    const slab: SlabEntity = {
      id: cid('slab'),
      kind: 'slab',
      levelId: draft.levelId,
      x: centerX,
      z: centerZ,
      w: 32,
      d: 32,
      rot: 0,
      thickness: 0.12,
      style: 'stone',
    }
    draft.entities.push(slab)
    addProp(draft, 'fountain', centerX, centerZ, 0, 0.2)
    for (let index = 0; index < 4; index++) {
      const angle = (index / 4) * Math.PI * 2 + Math.PI / 4
      addProp(draft, 'bench-park', centerX + Math.cos(angle) * 8.5, centerZ + Math.sin(angle) * 8.5, -angle + Math.PI / 2, 0.3)
      addProp(draft, 'street-planter', centerX + Math.cos(angle + 0.4) * 13.5, centerZ + Math.sin(angle + 0.4) * 13.5, 0, 0.3)
    }
    addProp(draft, 'street-clock', centerX + 10.5, centerZ - 10.5, 0, 0.3)
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]) {
      addProp(draft, pick(random, TREE_IDS), centerX + sx * 13.8, centerZ + sz * 13.8, random() * 6.28, 0.3)
    }
    return
  }
  if (preset === 'garden') {
    const ring: Vec2[] = []
    for (let index = 0; index < 20; index++) {
      const angle = (index / 20) * Math.PI * 2
      ring.push([centerX + Math.cos(angle) * 12, centerZ + Math.sin(angle) * 12])
    }
    const ringPath = makePath(draft.levelId, 'footpath', ring, { width: 1.8, closed: true })
    draft.paths.push(ringPath)
    draft.entities.push(ringPath)
    for (let index = 0; index < 5; index++) {
      const angle = (index / 5) * Math.PI * 2
      addProp(draft, 'bench-park', centerX + Math.cos(angle) * 13.4, centerZ + Math.sin(angle) * 13.4, -angle + Math.PI / 2, 0.2)
    }
    addProp(draft, 'gazebo', centerX, centerZ, 0, 0.2)
    addProp(draft, 'flower-bed', centerX + 6.5, centerZ + 5.5, 0, 0.2)
    addProp(draft, 'flower-bed', centerX - 6.5, centerZ - 5.5, 0, 0.2)
    for (let index = 0; index < 8; index++) {
      const angle = (index / 8) * Math.PI * 2 + 0.2
      addProp(draft, pick(random, TREE_IDS), centerX + Math.cos(angle) * 14.6, centerZ + Math.sin(angle) * 14.6, random() * 6.28, 0.2)
    }
    return
  }
  const pondPoints: Vec2[] = []
  const wobble = [1, 0.9, 1.06, 0.94, 1.02, 0.88, 1.04, 0.96, 1.08, 0.92, 1, 0.9]
  for (let index = 0; index < wobble.length; index++) {
    const angle = (index / wobble.length) * Math.PI * 2
    pondPoints.push([centerX + Math.cos(angle) * 8.4 * wobble[index], centerZ + Math.sin(angle) * 8.4 * wobble[index]])
  }
  const pond = makePath(draft.levelId, 'river', pondPoints, { width: 2, closed: true })
  draft.paths.push(pond)
  draft.entities.push(pond)
  const promenade: Vec2[] = []
  for (let index = 0; index < 20; index++) {
    const angle = (index / 20) * Math.PI * 2
    promenade.push([centerX + Math.cos(angle) * 11.4, centerZ + Math.sin(angle) * 11.4])
  }
  const walk = makePath(draft.levelId, 'footpath', promenade, { width: 1.8, closed: true })
  draft.paths.push(walk)
  draft.entities.push(walk)
  for (let index = 0; index < 4; index++) {
    const angle = (index / 4) * Math.PI * 2 + Math.PI / 5
    addProp(draft, 'bench-park', centerX + Math.cos(angle) * 13, centerZ + Math.sin(angle) * 13, -angle + Math.PI / 2, 0.2)
  }
  for (let index = 0; index < 9; index++) {
    const angle = (index / 9) * Math.PI * 2 + 0.3
    addProp(draft, pick(random, TREE_IDS), centerX + Math.cos(angle) * 14.8, centerZ + Math.sin(angle) * 14.8, random() * 6.28, 0.2)
  }
}

function addStreetFurniture(
  draft: CityDraft,
  options: CityGenOptions,
  grid: { startX: number; startZ: number; width: number; depth: number; cols: number; rows: number },
  random: () => number,
) {
  const { startX, startZ, width, depth, cols, rows } = grid
  const lineX = (index: number) => startX + index * BLOCK
  const lineZ = (index: number) => startZ + index * BLOCK
  const nearIntersection = (x: number, z: number): boolean => {
    for (let col = 0; col <= cols; col++) {
      if (Math.abs(x - lineX(col)) > 8.5) continue
      for (let row = 0; row <= rows; row++) {
        if (Math.abs(z - lineZ(row)) < 8.5) return true
      }
    }
    return false
  }
  const outside = ROAD_WIDTH / 2 + 1.4 + 1.35
  if (options.streetTrees) {
    for (let row = 0; row <= rows; row++) {
      const z = lineZ(row)
      const side = row % 2 === 0 ? 1 : -1
      for (let x = startX - 8; x <= startX + width + 8; x += 15) {
        if (nearIntersection(x, z + side * outside)) continue
        addProp(draft, pick(random, TREE_IDS), x, z + side * outside, random() * 6.28, 0.5)
      }
    }
    for (let col = 0; col <= cols; col++) {
      const x = lineX(col)
      const side = col % 2 === 0 ? -1 : 1
      for (let z = startZ - 8; z <= startZ + depth + 8; z += 15) {
        if (nearIntersection(x + side * outside, z)) continue
        addProp(draft, pick(random, TREE_IDS), x + side * outside, z, random() * 6.28, 0.5)
      }
    }
  }
  if (options.streetLights) {
    for (let row = 0; row <= rows; row++) {
      const z = lineZ(row)
      for (let x = startX - 4; x <= startX + width + 4; x += 30) {
        if (nearIntersection(x, z)) continue
        addProp(draft, 'streetlight', x, z + outside * (row % 2 === 0 ? -1 : 1), row % 2 === 0 ? Math.PI : 0, 0.4)
      }
    }
    for (let col = 0; col <= cols; col++) {
      const x = lineX(col)
      for (let z = startZ - 4; z <= startZ + depth + 4; z += 30) {
        if (nearIntersection(x, z)) continue
        addProp(draft, 'streetlight', x + outside * (col % 2 === 0 ? 1 : -1), z, col % 2 === 0 ? -Math.PI / 2 : Math.PI / 2, 0.4)
      }
    }
  }
  if (options.vehicles) {
    const count = Math.max(4, Math.round((cols + rows) * 2.2))
    for (let index = 0; index < count; index++) {
      const horizontal = random() > 0.35
      const lane = ROAD_WIDTH / 2 - 1.25
      if (horizontal) {
        const row = Math.floor(random() * (rows + 1))
        const x = startX + 16 + random() * (width - 32)
        const offset = random() > 0.5 ? lane : -lane
        const z = lineZ(row) + offset
        if (nearIntersection(x, z)) continue
        addProp(draft, pick(random, CAR_IDS), x, z, offset > 0 ? Math.PI / 2 : -Math.PI / 2, 0.2, 'road')
      } else {
        const col = Math.floor(random() * (cols + 1))
        const z = startZ + 16 + random() * (depth - 32)
        const offset = random() > 0.5 ? lane : -lane
        const x = lineX(col) + offset
        if (nearIntersection(x, z)) continue
        addProp(draft, pick(random, CAR_IDS), x, z, offset > 0 ? Math.PI : 0, 0.2, 'road')
      }
    }
  }
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      if (random() > 0.5) continue
      const x = lineX(col) + outside
      const z = lineZ(row) + outside * (random() > 0.5 ? 1 : -1)
      if (nearIntersection(x, z)) continue
      addProp(draft, random() > 0.5 ? 'trash-bin' : 'fire-hydrant', x, z, random() * 6.28, 0.4)
    }
  }
}

function addWaterfront(
  draft: CityDraft,
  grid: { startX: number; startZ: number; width: number; depth: number },
  random: () => number,
  options: CityGenOptions,
) {
  const { startX, startZ, width, depth } = grid
  const riverZ = startZ + depth + 30
  const river: Vec2[] = [
    [startX - 45, riverZ + 4],
    [startX + width * 0.22, riverZ - 3],
    [startX + width * 0.56, riverZ + 3],
    [startX + width + 45, riverZ - 2],
  ]
  const riverPath = makePath(draft.levelId, 'river', river, { width: 13 })
  draft.paths.push(riverPath)
  draft.entities.push(riverPath)
  const promenadePoints: Vec2[] = river.map(([x, z]) => [x, z - 13] as Vec2)
  const promenade = makePath(draft.levelId, 'footpath', promenadePoints, { width: 2.4 })
  draft.paths.push(promenade)
  draft.entities.push(promenade)
  for (let index = 0; index < 6; index++) {
    const x = startX + 6 + (width - 12) * (index / 5)
    addProp(draft, pick(random, TREE_IDS), x, riverZ - 17.5, random() * 6.28, 0.3)
    if (index % 2 === 0) {
      addProp(draft, 'bench-park', x + 2.5, riverZ - 15.2, Math.PI, 0.3)
    }
  }
  const bridgeX = startX + Math.max(1, Math.floor(width / BLOCK / 2)) * BLOCK
  const connector = makePath(draft.levelId, 'road', [[bridgeX, startZ + depth], [bridgeX, riverZ - 15]], {
    width: 7.2,
    sidewalk: true,
  })
  draft.paths.push(connector)
  draft.entities.push(connector)
  const bridge = makePath(draft.levelId, 'bridge', [[bridgeX, riverZ - 15], [bridgeX, riverZ + 17]], {
    width: 7.2,
    sidewalk: true,
    railings: true,
    bridgeHeight: 2.4,
  })
  draft.paths.push(bridge)
  draft.entities.push(bridge)
  for (let index = 0; index < 2; index++) {
    const boat: ObjectEntity = {
      id: cid('obj'),
      kind: 'object',
      levelId: draft.levelId,
      modelId: 'boat',
      x: bridgeX - 22 + index * 34,
      z: riverZ + (index === 0 ? 2.5 : -2.2),
      rot: index === 0 ? 0.22 : -0.15,
      scale: 1,
    }
    draft.props.push(boat)
    draft.entities.push(boat)
  }
  const bankTemplates: BuildingTemplateId[] = ['villa', 'townhouse', 'villa']
  let cursor = startX + 8
  for (let index = 0; index < bankTemplates.length; index++) {
    const template = getBuildingTemplate(bankTemplates[index])
    if (cursor + template.width > startX + width - 8) break
    const x = cursor + template.width / 2
    const z = riverZ + 22 + template.depth / 2
    const building = createBuildingEntity(
      template.id,
      draft.levelId,
      x,
      z,
      Math.PI,
      `滨水住宅 ${index + 1}`,
      template.id === 'villa' ? 2 : 3,
      {
        wallColor: pick(random, RESIDENTIAL_FACADES),
        roofFinish: pick(random, FINISHES),
      },
    )
    if (options.furnished) {
      furnishInterior(building.interior, { maxFloors: 2, openPlan: template.glassy })
    }
    draft.buildings.push(building)
    draft.entities.push(building)
    addLandscape(draft, building)
    cursor += template.width + 9
  }
}

export function generateCity(
  options: CityGenOptions,
  levelId: string,
  center: Vec2,
): CityGenResult {
  const [cols, rows] = GRID[options.size]
  const width = cols * BLOCK
  const depth = rows * BLOCK
  const startX = center[0] - width / 2
  const startZ = center[1] - depth / 2
  const random = rng(Math.round(center[0] * 3 + center[1] * 7) + cols * 31 + rows * 17 + options.preset.length * 101)
  const draft: CityDraft = {
    levelId,
    entities: [],
    buildings: [],
    paths: [],
    props: [],
    footprints: getModelFootprints(),
  }

  const lineX = (index: number) => startX + index * BLOCK
  const lineZ = (index: number) => startZ + index * BLOCK
  for (let col = 0; col <= cols; col++) {
    const road = makePath(
      draft.levelId,
      'road',
      [
        [lineX(col), startZ - 14],
        [lineX(col), startZ + depth + 14],
      ],
      {
        width: ROAD_WIDTH,
        sidewalk: true,
        lanes: col === Math.floor(cols / 2) ? 4 : 2,
      },
    )
    draft.paths.push(road)
    draft.entities.push(road)
  }
  for (let row = 0; row <= rows; row++) {
    const road = makePath(
      draft.levelId,
      'road',
      [
        [startX - 14, lineZ(row)],
        [startX + width + 14, lineZ(row)],
      ],
      { width: ROAD_WIDTH, sidewalk: true, lanes: row === 0 ? 4 : 2 },
    )
    draft.paths.push(road)
    draft.entities.push(road)
  }

  if (options.preset === 'riverside') {
    addWaterfront(draft, { startX, startZ, width, depth }, random, options)
  }
  addStreetFurniture(draft, options, { startX, startZ, width, depth, cols, rows }, random)

  const parkCol = Math.min(cols - 1, Math.floor((cols - 1) / 2))
  const parkRow = Math.min(rows - 1, Math.floor((rows - 1) / 2))
  addParkBlock(
    draft,
    lineX(parkCol) + BLOCK / 2,
    lineZ(parkRow) + BLOCK / 2,
    options.preset,
    random,
  )

  let buildingIndex = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (col === parkCol && row === parkRow) continue
      const blockCenterX = lineX(col) + BLOCK / 2
      const blockCenterZ = lineZ(row) + BLOCK / 2
      const faceNorth = (col + row) % 2 === 0
      const downtown =
        options.preset === 'downtown' || (options.preset === 'riverside' && row === rows - 1)
      if (downtown) {
        const templateId: BuildingTemplateId = random() > 0.35 ? 'tower' : 'office'
        const template = getBuildingTemplate(templateId)
        const floors = templateId === 'tower' ? 6 + Math.floor(random() * 9) : 4 + Math.floor(random() * 5)
        const x = blockCenterX + (random() - 0.5) * 2
        const z = blockCenterZ + (random() - 0.5) * 2
        const building = createBuildingEntity(template.id, draft.levelId, x, z, faceNorth ? 0 : Math.PI, `${template.name} ${++buildingIndex}`, floors, {
          wallColor: pick(random, DOWNTOWN_FACADES),
          roofFinish: template.roofStyle === 'flat' ? 'charcoal' : pick(random, FINISHES),
          windowStyle: 'picture',
        })
        if (options.furnished) {
          furnishInterior(building.interior, { maxFloors: 2, openPlan: template.glassy })
        }
        draft.buildings.push(building)
        draft.entities.push(building)
        addLandscape(draft, building)
        continue
      }
      const pair = (col + row) % 2 === 0
      const candidates: BuildingTemplateId[] = []
      const firstTemplate: BuildingTemplateId = random() > 0.4 ? 'villa' : 'townhouse'
      candidates.push(firstTemplate)
      if (pair) {
        candidates.push(random() > 0.5 ? 'villa' : 'townhouse')
      }
      const rotation = faceNorth ? 0 : Math.PI
      let cursor = blockCenterX
      const totalWidth = candidates.reduce((sum, id) => sum + getBuildingTemplate(id).width, 0) + (candidates.length - 1) * 3.5
      cursor = blockCenterX - totalWidth / 2
      for (const templateId of candidates) {
        const template = getBuildingTemplate(templateId)
        if (cursor + template.width > startX + width + SETBACK + 2) break
        const z = faceNorth ? lineZ(row + 1) - SETBACK - template.depth / 2 : lineZ(row) + SETBACK + template.depth / 2
        const floorsBase = templateId === 'villa' ? 2 : 3
        const floors = Math.max(1, floorsBase + (random() > 0.55 ? 1 : 0))
        const building = createBuildingEntity(
          template.id,
          draft.levelId,
          cursor + template.width / 2,
          z,
          rotation,
          `${template.name} ${++buildingIndex}`,
          floors,
          {
            wallColor: pick(random, RESIDENTIAL_FACADES),
            roofFinish: pick(random, FINISHES),
            windowStyle: random() > 0.6 ? 'wide' : 'standard',
          },
        )
        if (options.furnished) {
          furnishInterior(building.interior, { maxFloors: 3, openPlan: template.glassy })
        }
        draft.buildings.push(building)
        draft.entities.push(building)
        addLandscape(draft, building)
        cursor += template.width + 3.5
      }
    }
  }

  if (draft.buildings.length > 0) {
    const removed = new Set<string>()
    const buildingObbs = draft.buildings.map((building) =>
      objectOBB(building.x, building.z, building.rot, building.width, building.depth),
    )
    for (const prop of draft.props) {
      const fp = draft.footprints.get(prop.modelId) ?? [1, 1]
      const propObb = objectOBB(prop.x, prop.z, prop.rot, fp[0], fp[1], prop.scale)
      if (buildingObbs.some((obb) => obbOverlap(propObb, obb, 0.2))) removed.add(prop.id)
    }
    if (removed.size > 0) {
      draft.props = draft.props.filter((prop) => !removed.has(prop.id))
      draft.entities = draft.entities.filter((entity) => !(entity.kind === 'object' && removed.has(entity.id)))
    }
  }

  const name = CITY_PRESETS.find((item) => item.id === options.preset)?.name ?? '城市'
  return {
    entities: draft.entities,
    center: [center[0], center[1]],
    width,
    depth,
    buildings: draft.buildings.length,
    paths: draft.paths.length,
    props: draft.props.length,
    name,
  }
}
