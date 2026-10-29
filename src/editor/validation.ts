import type { Entity, ModelDef, PathEntity, Vec2, WallEntity } from './types'
import {
  distanceToPathCenter,
  dist2,
  getPathBundle,
  isPointOnWater,
  obbOverlap,
  pathCenterlinesCross,
  type OBB,
} from './geom'

export interface CheckResult {
  valid: boolean
  reason: string
}

const OK: CheckResult = { valid: true, reason: '' }

export function wallOBB(wall: WallEntity): OBB {
  const len = dist2(wall.a, wall.b)
  const angle = Math.atan2(wall.b[1] - wall.a[1], wall.b[0] - wall.a[0])
  return {
    x: (wall.a[0] + wall.b[0]) / 2,
    z: (wall.a[1] + wall.b[1]) / 2,
    hw: len / 2,
    hd: wall.thickness / 2,
    rot: -angle,
  }
}

export function objectOBB(x: number, z: number, rot: number, w: number, d: number, scale = 1): OBB {
  return { x, z, hw: (w * scale) / 2, hd: (d * scale) / 2, rot }
}

function onAsphalt(x: number, z: number, entities: Entity[]): boolean {
  for (const entity of entities) {
    if (entity.kind !== 'path' || (entity.pathType !== 'road' && entity.pathType !== 'bridge')) continue
    if (distanceToPathCenter(x, z, entity) < entity.width / 2 - 0.05) return true
  }
  return false
}

export function checkWallPlacement(
  a: Vec2,
  b: Vec2,
  thickness: number,
  levelId: string,
  entities: Entity[],
  ignoreId?: string,
): CheckResult {
  const length = dist2(a, b)
  if (length < 0.25) return { valid: false, reason: '墙体太短（至少 0.25 m）' }
  if (isPointOnWater(a[0], a[1], entities) || isPointOnWater(b[0], b[1], entities)) {
    return { valid: false, reason: '不能在河面上建造墙体' }
  }
  const mid: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  if (isPointOnWater(mid[0], mid[1], entities)) {
    return { valid: false, reason: '不能在河面上建造墙体' }
  }
  const obb = wallOBB({ id: '', kind: 'wall', levelId, a, b, height: 1, thickness, color: '' })
  for (const entity of entities) {
    if (entity.kind === 'wall' && entity.levelId === levelId && entity.id !== ignoreId) {
      const angleA = Math.atan2(b[1] - a[1], b[0] - a[0])
      const angleB = Math.atan2(entity.b[1] - entity.a[1], entity.b[0] - entity.a[0])
      const parallel = Math.abs(Math.sin(angleA - angleB)) < 0.02
      if (parallel) {
        const existing = wallOBB(entity)
        if (obbOverlap(obb, existing, -0.035)) {
          const dx = Math.abs(obb.x - existing.x)
          const dz = Math.abs(obb.z - existing.z)
          if (dx < (obb.hw + existing.hw) * 0.9 && dz < 0.3) {
            return { valid: false, reason: '这段墙与已有墙体重叠' }
          }
        }
      }
    }
  }
  return OK
}

export function checkObjectPlacement(
  model: ModelDef,
  x: number,
  z: number,
  rot: number,
  scale: number,
  levelId: string,
  entities: Entity[],
  footprints: Map<string, [number, number]>,
  ignoreId?: string,
): CheckResult {
  if (Math.abs(x) > 280 || Math.abs(z) > 280) return { valid: false, reason: '超出可建造范围' }
  const rule = model.placement ?? 'any'
  const water = isPointOnWater(x, z, entities, 0.05)
  const asphalt = onAsphalt(x, z, entities)
  if (rule === 'on-water' && !water) return { valid: false, reason: '需要放置在河面上' }
  if (rule === 'on-road' && !asphalt) return { valid: false, reason: '需要放置在道路上' }
  if (rule !== 'on-water' && water) return { valid: false, reason: '不能放置在水面上' }
  if (rule !== 'on-road' && asphalt) {
    if (rule === 'indoor' || rule === 'outdoor') return { valid: false, reason: '请将其放置在路边的地面上' }
  }
  if (model.noCollide) return OK
  const obb = objectOBB(x, z, rot, model.footprint[0], model.footprint[1], scale)
  for (const entity of entities) {
    if (entity.id === ignoreId) continue
    if (entity.kind === 'object' && entity.levelId === levelId) {
      const fp = footprints.get(entity.modelId)
      if (!fp) continue
      const other = objectOBB(entity.x, entity.z, entity.rot, fp[0], fp[1], entity.scale)
      if (obbOverlap(obb, other, -0.012)) return { valid: false, reason: '与已有物件重叠' }
    }
    if (entity.kind === 'wall' && entity.levelId === levelId) {
      if (obbOverlap(obb, wallOBB(entity), -0.025)) return { valid: false, reason: '与墙体碰撞' }
    }
  }
  return OK
}

export function checkOpeningPlacement(
  wall: WallEntity,
  offset: number,
  width: number,
  height: number,
  sill: number,
  openings: Entity[],
  ignoreId?: string,
): CheckResult {
  const length = dist2(wall.a, wall.b)
  if (offset - width / 2 < 0.12) return { valid: false, reason: '距离墙体端点太近' }
  if (offset + width / 2 > length - 0.12) return { valid: false, reason: '距离墙体端点太近' }
  if (sill + height > wall.height - 0.06) return { valid: false, reason: '洞口超出墙体高度' }
  for (const entity of openings) {
    if (entity.kind !== 'opening' || entity.wallId !== wall.id || entity.id === ignoreId) continue
    const aMin = offset - width / 2
    const aMax = offset + width / 2
    const bMin = entity.offset - entity.width / 2
    const bMax = entity.offset + entity.width / 2
    if (aMin < bMax + 0.1 && aMax > bMin - 0.1) return { valid: false, reason: '与已有门窗重叠' }
  }
  return OK
}

function pointInOBB(x: number, z: number, obb: OBB, margin: number): boolean {
  const dx = x - obb.x
  const dz = z - obb.z
  const c = Math.cos(obb.rot)
  const s = Math.sin(obb.rot)
  const lx = dx * c - dz * s
  const lz = dx * s + dz * c
  return Math.abs(lx) <= obb.hw + margin && Math.abs(lz) <= obb.hd + margin
}

export function checkBuildingPlacement(
  building: { x: number; z: number; rot: number; width: number; depth: number },
  levelId: string,
  entities: Entity[],
  footprints: Map<string, [number, number]>,
  ignoreId?: string,
): CheckResult {
  if (Math.abs(building.x) + building.width / 2 > 275 || Math.abs(building.z) + building.depth / 2 > 275) {
    return { valid: false, reason: '超出可建造范围' }
  }
  const obb = objectOBB(building.x, building.z, building.rot, building.width, building.depth)
  const c = Math.cos(building.rot)
  const s = Math.sin(building.rot)
  const halfW = building.width / 2
  const halfD = building.depth / 2
  const corners: Vec2[] = [
    [building.x, building.z],
    ...([[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]).map(
      ([sx, sz]) =>
        [
          building.x + sx * halfW * c + sz * halfD * s,
          building.z - sx * halfW * s + sz * halfD * c,
        ] as Vec2,
    ),
  ]
  for (const point of corners) {
    if (isPointOnWater(point[0], point[1], entities, 0.2)) {
      return { valid: false, reason: '建筑不能建在水面上' }
    }
  }
  for (const entity of entities) {
    if (entity.id === ignoreId) continue
    if (entity.kind === 'path') {
      const half = entity.width / 2 + (entity.pathType === 'road' || entity.pathType === 'bridge' ? 1.6 : 0.4)
      const bundle = getPathBundle(entity)
      for (const sample of bundle.samples) {
        if (pointInOBB(sample.pos.x, sample.pos.z, obb, half + 0.3)) {
          return {
            valid: false,
            reason: entity.pathType === 'river' ? '建筑不能压在水面上' : '建筑不能压在道路上',
          }
        }
      }
      continue
    }
    if (entity.kind === 'opening') continue
    if (entity.kind === 'wall') {
      if (entity.levelId === levelId && obbOverlap(obb, wallOBB(entity), -0.03)) {
        return { valid: false, reason: '与已有墙体碰撞' }
      }
      continue
    }
    if (entity.kind === 'building') {
      if (obbOverlap(obb, objectOBB(entity.x, entity.z, entity.rot, entity.width, entity.depth), 0.3)) {
        return { valid: false, reason: '与已有建筑重叠' }
      }
      continue
    }
    if (entity.kind === 'object') {
      if (entity.levelId !== levelId) continue
      const fp = footprints.get(entity.modelId)
      if (!fp) continue
      if (obbOverlap(obb, objectOBB(entity.x, entity.z, entity.rot, fp[0], fp[1], entity.scale), -0.02)) {
        return { valid: false, reason: '与已有物件重叠' }
      }
      continue
    }
    if (entity.kind === 'slab' || entity.kind === 'roof') {
      if (entity.levelId !== levelId) continue
      if (obbOverlap(obb, { x: entity.x, z: entity.z, hw: entity.w / 2, hd: entity.d / 2, rot: entity.rot }, -0.04)) {
        return { valid: false, reason: '与已有楼板或屋顶重叠' }
      }
    }
  }
  return OK
}

export function checkPathPlacement(path: PathEntity, entities: Entity[], ignoreId?: string): CheckResult {
  if (path.points.length < 2) return { valid: false, reason: '路径至少需要两个控制点' }
  let length = 0
  for (let i = 0; i < path.points.length - 1; i++) length += dist2(path.points[i], path.points[i + 1])
  if (length < 1.2) return { valid: false, reason: '路径太短' }
  if (path.pathType === 'bridge') {
    if (path.bridgeHeight < 0.8) return { valid: false, reason: '桥面高度过低' }
    return OK
  }
  for (const entity of entities) {
    if (entity.id === ignoreId || entity.kind !== 'path') continue
    if (entity.pathType === 'bridge' && entity.id === ignoreId) continue
    if (path.pathType === 'river') {
      if (entity.pathType !== 'river' && entity.pathType !== 'bridge' && pathCenterlinesCross(path, entity)) {
        return { valid: false, reason: '河流与已建道路/步道相交' }
      }
    } else {
      if (entity.pathType === 'river' && pathCenterlinesCross(path, entity)) {
        return {
          valid: false,
          reason: path.pathType === 'road' ? '道路跨越河流，请改用桥梁' : '此处跨越河流，无法铺设',
        }
      }
    }
    if (path.pathType === 'fence' && entity.pathType === 'footpath' && pathCenterlinesCross(path, entity)) {
      return { valid: false, reason: '围栏不能横穿步道' }
    }
    if (path.pathType === 'footpath' && entity.pathType === 'fence' && pathCenterlinesCross(path, entity)) {
      return { valid: false, reason: '步道不能横穿围栏' }
    }
  }
  return OK
}

