import { getModel, getModelFootprints } from '../models/registry'
import { buildingEntrance } from './buildings'
import { distanceToPathCenter, isPointOnRoad, isPointOnWater, obbOverlap } from './geom'
import { objectOBB } from './validation'
import type {
  BuildingEntity,
  Entity,
  ObjectEntity,
  PathEntity,
  SlabEntity,
  Vec2,
} from './types'

export interface LandscapeResult {
  entities: Entity[]
  props: number
  path: boolean
}

function lid(prefix: string): string {
  const raw =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  return `land_${prefix}_${raw}`
}

const TREES = ['tree-oak', 'tree-maple', 'tree-birch', 'tree-pine', 'tree-willow']

function hashSeed(text: string): number {
  let hash = 2166136261
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seeded(seed: number) {
  let state = seed || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function landscapeBuilding(building: BuildingEntity, existing: Entity[]): LandscapeResult {
  const entities: Entity[] = []
  const footprints = getModelFootprints()
  const entrance = buildingEntrance(building)
  const rightX = Math.cos(building.rot)
  const rightZ = -Math.sin(building.rot)
  const halfW = building.width / 2
  const random = seeded(hashSeed(building.id) * 7 + Math.round(building.x * 13 + building.z * 29))
  const levelEntities = existing.filter((entity) => entity.kind === 'opening' || entity.levelId === building.levelId)
  const paths = levelEntities.filter((entity): entity is PathEntity => entity.kind === 'path')
  const obstacles = levelEntities.filter(
    (entity): entity is ObjectEntity => entity.kind === 'object',
  )
  const buildings = levelEntities.filter(
    (entity): entity is BuildingEntity => entity.kind === 'building' && entity.id !== building.id,
  )

  const clearOfPaths = (x: number, z: number, margin: number): boolean => {
    if (isPointOnWater(x, z, levelEntities, margin)) return false
    if (isPointOnRoad(x, z, levelEntities, margin)) return false
    return paths.every((path) => {
      if (path.pathType === 'road' || path.pathType === 'bridge' || path.pathType === 'river') return true
      return distanceToPathCenter(x, z, path) > path.width / 2 + margin
    })
  }

  const clearOfPropsOnly = (x: number, z: number, size: number): boolean => {
    const obb = objectOBB(x, z, 0, size, size)
    for (const other of buildings) {
      if (obbOverlap(obb, objectOBB(other.x, other.z, other.rot, other.width, other.depth), 0.9)) return false
    }
    for (const other of obstacles) {
      const fp = footprints.get(other.modelId)
      if (!fp) continue
      if (obbOverlap(obb, objectOBB(other.x, other.z, other.rot, fp[0], fp[1], other.scale), 0.3)) return false
    }
    return true
  }

  const clearOfProps = (x: number, z: number, size: number): boolean => {
    const obb = objectOBB(x, z, 0, size, size)
    const buildingOBB = objectOBB(building.x, building.z, building.rot, building.width, building.depth)
    if (obbOverlap(obb, buildingOBB, 0.3)) return false
    return clearOfPropsOnly(x, z, size)
  }

  const pushObject = (modelId: string, x: number, z: number, rot: number, clearance = 1.2) => {
    const model = getModel(modelId)
    if (!model) return
    if (!clearOfPaths(x, z, clearance)) return
    if (!clearOfProps(x, z, Math.max(model.footprint[0], model.footprint[1]))) return
    const object: ObjectEntity = {
      id: lid('obj'),
      kind: 'object',
      levelId: building.levelId,
      modelId,
      x,
      z,
      rot,
      scale: 1,
    }
    obstacles.push(object)
    entities.push(object)
  }

  const plaza = building.templateId === 'office' || building.templateId === 'tower'
  if (plaza) {
    const slab: SlabEntity = {
      id: lid('slab'),
      kind: 'slab',
      levelId: building.levelId,
      x: building.x,
      z: building.z,
      w: building.width + 7,
      d: building.depth + 7,
      rot: building.rot,
      thickness: 0.14,
      style: 'stone',
    }
    const c = Math.cos(slab.rot)
    const s = Math.sin(slab.rot)
    const corners: Vec2[] = ([
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ] as [number, number][]).map(([sx, sz]) => [
      slab.x + (sx * slab.w * 0.5) * c + (sz * slab.d * 0.5) * s,
      slab.z - (sx * slab.w * 0.5) * s + (sz * slab.d * 0.5) * c,
    ])
    if (corners.every((point) => clearOfPaths(point[0], point[1], 0.25))) entities.push(slab)
  }

  const startX = entrance.x + entrance.dirX * 0.35
  const startZ = entrance.z + entrance.dirZ * 0.35
  const endX = entrance.x + entrance.dirX * 3.2
  const endZ = entrance.z + entrance.dirZ * 3.2
  const pathClear =
    clearOfPaths(startX, startZ, 0.3) &&
    clearOfPaths(entrance.x + entrance.dirX * 1.8, entrance.z + entrance.dirZ * 1.8, 0.3) &&
    clearOfPaths(endX, endZ, 0.3) &&
    clearOfPropsOnly(startX, startZ, 1.6) &&
    clearOfPropsOnly(endX, endZ, 1.6)
  if (pathClear && !plaza) {
    const path: PathEntity = {
      id: lid('path'),
      kind: 'path',
      levelId: building.levelId,
      pathType: 'footpath',
      points: [
        [startX, startZ],
        [entrance.x + entrance.dirX * 1.8 + rightX * 0.25, entrance.z + entrance.dirZ * 1.8 + rightZ * 0.25],
        [endX, endZ],
      ],
      width: 1.5,
      style: 'stone',
      sidewalk: false,
      lanes: 2,
      bridgeHeight: 2.6,
      railings: false,
    }
    entities.push(path)
    paths.push(path)
  }

  const treeAt = (side: number, front: number, clearance = 1.2) => {
    const modelId = TREES[Math.floor(random() * TREES.length)]
    const x = entrance.x + rightX * side + entrance.dirX * front
    const z = entrance.z + rightZ * side + entrance.dirZ * front
    pushObject(modelId, x, z, random() * Math.PI * 2, clearance)
  }
  treeAt(-(halfW + 2.2 + random()), 1.5 + random())
  treeAt(halfW + 2.2 + random(), 1.2 + random())
  treeAt(-(halfW + 2.6), -(4.5 + random() * 2))
  treeAt(halfW + 2.6, -(4.2 + random() * 2))

  if (!plaza) {
    pushObject('flower-bed', entrance.x + rightX * -2.6 + entrance.dirX * 1.9, entrance.z + rightZ * -2.6 + entrance.dirZ * 1.9, building.rot)
    pushObject('flower-bed', entrance.x + rightX * 2.6 + entrance.dirX * 1.9, entrance.z + rightZ * 2.6 + entrance.dirZ * 1.9, building.rot)
    pushObject(
      'bench-park',
      entrance.x + rightX * (halfW + 1.9) + entrance.dirX * 1.6,
      entrance.z + rightZ * (halfW + 1.9) + entrance.dirZ * 1.6,
      building.rot + Math.PI / 2,
      0.8,
    )
  } else {
    pushObject('street-planter', entrance.x + rightX * -6.2 + entrance.dirX * 2.2, entrance.z + rightZ * -6.2 + entrance.dirZ * 2.2, building.rot, 0.8)
    pushObject('street-planter', entrance.x + rightX * 6.2 + entrance.dirX * 2.2, entrance.z + rightZ * 6.2 + entrance.dirZ * 2.2, building.rot, 0.8)
    pushObject('bench-park', entrance.x + rightX * -(halfW + 2.6) + entrance.dirX * 1.8, entrance.z + rightZ * -(halfW + 2.6) + entrance.dirZ * 1.8, building.rot + Math.PI / 2, 0.8)
    pushObject('bench-park', entrance.x + rightX * (halfW + 2.6) + entrance.dirX * 1.8, entrance.z + rightZ * (halfW + 2.6) + entrance.dirZ * 1.8, building.rot - Math.PI / 2, 0.8)
  }

  pushObject('streetlight', entrance.x + rightX * 2.9 + entrance.dirX * 2.4, entrance.z + rightZ * 2.9 + entrance.dirZ * 2.4, building.rot, 0.8)
  pushObject('trash-bin', entrance.x + rightX * -3.1 + entrance.dirX * 2.2, entrance.z + rightZ * -3.1 + entrance.dirZ * 2.2, building.rot, 0.8)

  return {
    entities,
    props: entities.filter((entity) => entity.kind === 'object').length,
    path: entities.some((entity) => entity.kind === 'path'),
  }
}
