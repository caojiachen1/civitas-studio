import * as THREE from 'three'
import type { Entity, PathEntity, Vec2 } from './types'

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export function dist2(a: Vec2, b: Vec2) {
  const dx = a[0] - b[0]
  const dz = a[1] - b[1]
  return Math.sqrt(dx * dx + dz * dz)
}

export function pointSegmentDistance(p: Vec2, a: Vec2, b: Vec2): number {
  const vx = b[0] - a[0]
  const vz = b[1] - a[1]
  const lenSq = vx * vx + vz * vz
  if (lenSq < 1e-8) return dist2(p, a)
  const t = clamp(((p[0] - a[0]) * vx + (p[1] - a[1]) * vz) / lenSq, 0, 1)
  return Math.hypot(p[0] - (a[0] + vx * t), p[1] - (a[1] + vz * t))
}

export function projectPointOnSegment(p: Vec2, a: Vec2, b: Vec2) {
  const vx = b[0] - a[0]
  const vz = b[1] - a[1]
  const lenSq = vx * vx + vz * vz
  const t = lenSq < 1e-8 ? 0 : clamp(((p[0] - a[0]) * vx + (p[1] - a[1]) * vz) / lenSq, 0, 1)
  return { t, point: [a[0] + vx * t, a[1] + vz * t] as Vec2, distance: dist2(p, [a[0] + vx * t, a[1] + vz * t]) }
}

export function snapAngle(from: Vec2, to: Vec2, stepDeg: number, toleranceDeg: number): Vec2 {
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const len = Math.hypot(dx, dz)
  if (len < 1e-5) return to
  const angle = Math.atan2(dz, dx)
  const step = (stepDeg * Math.PI) / 180
  const snapped = Math.round(angle / step) * step
  const diff = Math.abs(angle - snapped)
  if (diff > (toleranceDeg * Math.PI) / 180) return to
  return [from[0] + Math.cos(snapped) * len, from[1] + Math.sin(snapped) * len]
}

export function snapValue(v: number, step: number) {
  return Math.round(v / step) * step
}

export interface OBB {
  x: number
  z: number
  hw: number
  hd: number
  rot: number
}

function obbAxes(o: OBB): [Vec2, Vec2] {
  const c = Math.cos(o.rot)
  const s = Math.sin(o.rot)
  return [
    [c, -s],
    [s, c],
  ]
}

export function obbOverlap(a: OBB, b: OBB, margin = 0): boolean {
  const axesA = obbAxes(a)
  const axesB = obbAxes(b)
  const axes: Vec2[] = [axesA[0], axesA[1], axesB[0], axesB[1]]
  const dx = b.x - a.x
  const dz = b.z - a.z
  for (const axis of axes) {
    const projA = a.hw * Math.abs(axesA[0][0] * axis[0] + axesA[0][1] * axis[1]) + a.hd * Math.abs(axesA[1][0] * axis[0] + axesA[1][1] * axis[1])
    const projB = b.hw * Math.abs(axesB[0][0] * axis[0] + axesB[0][1] * axis[1]) + b.hd * Math.abs(axesB[1][0] * axis[0] + axesB[1][1] * axis[1])
    const d = Math.abs(dx * axis[0] + dz * axis[1])
    if (d > projA + projB + margin) return false
  }
  return true
}

export interface PathSample {
  pos: THREE.Vector3
  tangent: THREE.Vector3
  flatTangent: THREE.Vector3
  side: THREE.Vector3
  distance: number
  u: number
}

export interface PathBundle {
  samples: PathSample[]
  length: number
  curve: THREE.CatmullRomCurve3
}

const pathCache = new WeakMap<PathEntity, PathBundle>()

function bridgeProfile(u: number, height: number) {
  if (u <= 0 || u >= 1) return 0
  const ramp = 0.27
  if (u < ramp) {
    const t = u / ramp
    return height * t * t * (3 - 2 * t)
  }
  if (u > 1 - ramp) {
    const t = (1 - u) / ramp
    return height * t * t * (3 - 2 * t)
  }
  return height
}

export function getPathBundle(entity: PathEntity): PathBundle {
  const cached = pathCache.get(entity)
  if (cached) return cached
  const pts = entity.points.map((p) => new THREE.Vector3(p[0], 0, p[1]))
  let curve: THREE.CatmullRomCurve3
  if (pts.length === 2) {
    curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0)
  } else {
    curve = new THREE.CatmullRomCurve3(pts, Boolean(entity.closed), 'catmullrom', 0.5)
  }
  const roughLength = curve.getLength()
  const divisions = Math.max(16, Math.min(760, Math.ceil(roughLength / 0.32)))
  const samples: PathSample[] = []
  let prev: THREE.Vector3 | null = null
  for (let i = 0; i <= divisions; i++) {
    const u = i / divisions
    const pos = curve.getPointAt(u)
    if (entity.pathType === 'bridge') pos.y = bridgeProfile(u, entity.bridgeHeight)
    const tangent = curve.getTangentAt(u).normalize()
    const flatTangent = new THREE.Vector3(tangent.x, 0, tangent.z)
    if (flatTangent.lengthSq() < 1e-6) flatTangent.set(1, 0, 0)
    flatTangent.normalize()
    const side = new THREE.Vector3(flatTangent.z, 0, -flatTangent.x)
    const distance = prev ? prev.distanceTo(pos) + (samples[samples.length - 1]?.distance ?? 0) : 0
    samples.push({ pos, tangent, flatTangent: flatTangent.clone(), side, distance, u })
    prev = pos
  }
  const length = samples[samples.length - 1]?.distance ?? 0
  const bundle = { samples, length, curve }
  pathCache.set(entity, bundle)
  return bundle
}

export function distanceToPathCenter(x: number, z: number, entity: PathEntity): number {
  const bundle = getPathBundle(entity)
  let best = Number.POSITIVE_INFINITY
  for (const sample of bundle.samples) {
    const d = Math.hypot(sample.pos.x - x, sample.pos.z - z)
    if (d < best) best = d
  }
  return best
}

export function isPointOnWater(x: number, z: number, entities: Entity[], margin = 0): boolean {
  for (const entity of entities) {
    if (entity.kind !== 'path' || entity.pathType !== 'river') continue
    if (entity.closed) {
      const points = getPathBundle(entity).samples.map((sample) => [sample.pos.x, sample.pos.z] as Vec2)
      if (pointInPolygon(x, z, points)) return true
      continue
    }
    if (distanceToPathCenter(x, z, entity) < entity.width / 2 + margin) return true
  }
  return false
}

export function isPointOnRoad(x: number, z: number, entities: Entity[], margin = 0.35): boolean {
  for (const entity of entities) {
    if (entity.kind !== 'path' || (entity.pathType !== 'road' && entity.pathType !== 'bridge')) continue
    const extra = entity.sidewalk ? 1.4 : 0
    if (distanceToPathCenter(x, z, entity) < entity.width / 2 + extra + margin) return true
  }
  return false
}

export function isPointOnFootpath(x: number, z: number, entities: Entity[], margin = 0.2): boolean {
  for (const entity of entities) {
    if (entity.kind !== 'path' || (entity.pathType !== 'footpath' && entity.pathType !== 'fence')) continue
    if (distanceToPathCenter(x, z, entity) < entity.width / 2 + margin) return true
  }
  return false
}

function segmentsIntersect(a: Vec2, b: Vec2, c: Vec2, d: Vec2) {
  const cross = (p: Vec2, q: Vec2, r: Vec2) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
  const d1 = cross(c, d, a)
  const d2 = cross(c, d, b)
  const d3 = cross(a, b, c)
  const d4 = cross(a, b, d)
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
}

export function pathCenterlinesCross(a: PathEntity, b: PathEntity): boolean {
  const sa = getPathBundle(a).samples
  const sb = getPathBundle(b).samples
  const stepA = Math.max(1, Math.floor(sa.length / 40))
  const stepB = Math.max(1, Math.floor(sb.length / 40))
  for (let i = 0; i < sa.length - 1; i += stepA) {
    const p1: Vec2 = [sa[i].pos.x, sa[i].pos.z]
    const p2: Vec2 = [sa[i + 1].pos.x, sa[i + 1].pos.z]
    for (let j = 0; j < sb.length - 1; j += stepB) {
      const q1: Vec2 = [sb[j].pos.x, sb[j].pos.z]
      const q2: Vec2 = [sb[j + 1].pos.x, sb[j + 1].pos.z]
      if (segmentsIntersect(p1, p2, q1, q2)) return true
    }
  }
  return false
}

export function pointInPolygon(x: number, z: number, polygon: Vec2[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]
    const zi = polygon[i][1]
    const xj = polygon[j][0]
    const zj = polygon[j][1]
    const intersects = zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi + 1e-12) + xi
    if (intersects) inside = !inside
  }
  return inside
}

export function polygonArea(polygon: Vec2[]): number {
  let area = 0
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    area += (polygon[j][0] + polygon[i][0]) * (polygon[j][1] - polygon[i][1])
  }
  return area / 2
}

export function polygonCentroid(polygon: Vec2[]): Vec2 {
  let cx = 0
  let cz = 0
  let a = 0
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const f = polygon[j][0] * polygon[i][1] - polygon[i][0] * polygon[j][1]
    a += f
    cx += (polygon[j][0] + polygon[i][0]) * f
    cz += (polygon[j][1] + polygon[i][1]) * f
  }
  if (Math.abs(a) < 1e-8) {
    let sx = 0
    let sz = 0
    polygon.forEach((p) => {
      sx += p[0]
      sz += p[1]
    })
    return [sx / polygon.length, sz / polygon.length]
  }
  return [cx / (3 * a), cz / (3 * a)]
}

export function convexHull(points: Vec2[]): Vec2[] {
  if (points.length <= 3) return points
  const sorted = [...points].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]))
  const cross = (o: Vec2, a: Vec2, b: Vec2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Vec2[] = []
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper: Vec2[] = []
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop()
    upper.push(p)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

export function minAreaRect(points: Vec2[]): { center: Vec2; width: number; depth: number; rot: number } {
  const hull = convexHull(points)
  let best = { center: [0, 0] as Vec2, width: 1, depth: 1, rot: 0, area: Number.POSITIVE_INFINITY }
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i]
    const b = hull[(i + 1) % hull.length]
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0])
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    let minU = Number.POSITIVE_INFINITY
    let maxU = Number.NEGATIVE_INFINITY
    let minV = Number.POSITIVE_INFINITY
    let maxV = Number.NEGATIVE_INFINITY
    for (const p of hull) {
      const u = p[0] * c + p[1] * s
      const v = -p[0] * s + p[1] * c
      minU = Math.min(minU, u)
      maxU = Math.max(maxU, u)
      minV = Math.min(minV, v)
      maxV = Math.max(maxV, v)
    }
    const w = maxU - minU
    const d = maxV - minV
    const area = w * d
    if (area < best.area) {
      const center: Vec2 = [((minU + maxU) / 2) * c - ((minV + maxV) / 2) * s, ((minU + maxU) / 2) * s + ((minV + maxV) / 2) * c]
      best = { center, width: w, depth: d, rot: -angle, area }
    }
  }
  return { center: best.center, width: best.width, depth: best.depth, rot: best.rot }
}

export function nearestPointOnWalls(
  x: number,
  z: number,
  entities: Entity[],
  maxDistance: number,
): { wallId: string; distance: number; point: Vec2; offset: number; length: number; wall: Entity } | null {
  let best: { wallId: string; distance: number; point: Vec2; offset: number; length: number; wall: Entity } | null = null
  for (const entity of entities) {
    if (entity.kind !== 'wall') continue
    const { t, point, distance } = projectPointOnSegment([x, z], entity.a, entity.b)
    if (distance > maxDistance) continue
    if (!best || distance < best.distance) {
      const length = dist2(entity.a, entity.b)
      best = { wallId: entity.id, distance, point, offset: t * length, length, wall: entity }
    }
  }
  return best
}
