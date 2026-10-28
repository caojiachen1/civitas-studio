import * as THREE from 'three'
import { GeometryCollector, stripGeometry } from '../collector'
import { polygonArea, polygonCentroid, type PathSample } from '../geom'
import type { Vec2 } from '../types'

/**
 * Shared material palette handed over by paths.ts so that every detail keeps using
 * the module level material cache (one merged bucket per material).
 */
export interface PathDetailMaterials {
  curb: THREE.Material
  lineWhite: THREE.Material
  lineYellow: THREE.Material
  gutter: THREE.Material
  tactile: THREE.Material
  soil: THREE.Material
  drain: THREE.Material
  metal: THREE.Material
  stud: THREE.Material
  riverbed: THREE.Material
  bankEarth: THREE.Material
  bankGrass: THREE.Material
  bankMud: THREE.Material
  bankSand: THREE.Material
  reed: THREE.Material
  reedTop: THREE.Material
  rock: THREE.Material
  joint: THREE.Material
  marker: THREE.Material
  foliage: THREE.Material
  trunk: THREE.Material
}

export interface CarriagewaySpec {
  width: number
  lanes: number
  style: string
  closed?: boolean
  crossings?: boolean
  seed: number
}

export interface BridgeDeckSpec {
  width: number
  sidewalk: boolean
}

interface PathPoint {
  pos: THREE.Vector3
  side: THREE.Vector3
}

const CANOPY_GEO = new THREE.IcosahedronGeometry(1, 0)
const ROCK_GEO = new THREE.IcosahedronGeometry(1, 0)

/** Deterministic 0..1 hash, used for every scatted detail. */
function hash01(index: number, salt = 0): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function pathTotal(samples: PathSample[]): number {
  return samples.length > 0 ? samples[samples.length - 1].distance : 0
}

/** Interpolated frame at a world distance along the sampled path. */
function pointAtDistance(samples: PathSample[], distance: number): PathPoint {
  const first = samples[0]
  const last = samples[samples.length - 1]
  if (distance <= first.distance) return { pos: first.pos.clone(), side: first.side.clone() }
  if (distance >= last.distance) return { pos: last.pos.clone(), side: last.side.clone() }
  let lo = 0
  let hi = samples.length - 1
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1
    if (samples[mid].distance <= distance) lo = mid
    else hi = mid
  }
  const a = samples[lo]
  const b = samples[hi]
  const span = Math.max(1e-6, b.distance - a.distance)
  const t = (distance - a.distance) / span
  return {
    pos: a.pos.clone().lerp(b.pos, t),
    side: a.side.clone().lerp(b.side, t).normalize(),
  }
}

/** Samples that are at least `spacing` metres apart (world distance, not sample index). */
function spacedSamples(
  samples: PathSample[],
  spacing: number,
  phase = 0,
  start = 0,
  end = pathTotal(samples),
): PathSample[] {
  const result: PathSample[] = []
  if (samples.length < 2 || spacing <= 0) return result
  let next = start + phase
  for (const sample of samples) {
    if (sample.distance > end + 1e-4) break
    if (sample.distance + 1e-4 >= next) {
      result.push(sample)
      next = sample.distance + spacing
    }
  }
  return result
}

/** Flat quad detail between two distances and two lateral offsets. */
function addBand(
  col: GeometryCollector,
  samples: PathSample[],
  d0: number,
  d1: number,
  left: number,
  right: number,
  y: number,
  material: THREE.Material,
) {
  if (d1 - d0 <= 1e-4 || samples.length < 2) return
  const a = pointAtDistance(samples, d0)
  const b = pointAtDistance(samples, d1)
  if (a.pos.distanceToSquared(b.pos) < 1e-8) return
  const positions = [
    a.pos.x + a.side.x * left,
    a.pos.y + y,
    a.pos.z + a.side.z * left,
    a.pos.x + a.side.x * right,
    a.pos.y + y,
    a.pos.z + a.side.z * right,
    b.pos.x + b.side.x * left,
    b.pos.y + y,
    b.pos.z + b.side.z * left,
    b.pos.x + b.side.x * right,
    b.pos.y + y,
    b.pos.z + b.side.z * right,
  ]
  const uv = [left, d0, right, d0, left, d1, right, d1]
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geometry.setIndex([0, 2, 1, 2, 3, 1])
  geometry.computeVertexNormals()
  col.add(geometry, material)
}

/** Strip between two distances, resampled so long details follow curves. */
function addLiveStrip(
  col: GeometryCollector,
  samples: PathSample[],
  d0: number,
  d1: number,
  left: number,
  right: number,
  y: number,
  material: THREE.Material,
  step = 2,
) {
  if (d1 - d0 <= 1e-4) return
  const count = Math.max(1, Math.ceil((d1 - d0) / step))
  const points: PathPoint[] = []
  for (let i = 0; i <= count; i++) points.push(pointAtDistance(samples, d0 + ((d1 - d0) * i) / count))
  col.add(stripGeometry(points, left, right, y), material)
}

function addContinuousLine(
  col: GeometryCollector,
  samples: PathSample[],
  offset: number,
  width: number,
  y: number,
  material: THREE.Material,
) {
  if (samples.length < 2) return
  col.add(stripGeometry(samples, offset - width / 2, offset + width / 2, y), material)
}

function addDashes(
  col: GeometryCollector,
  samples: PathSample[],
  offset: number,
  material: THREE.Material,
  dash: number,
  gap: number,
  width: number,
  y: number,
) {
  const total = pathTotal(samples)
  for (let start = 1.1; start < total - 0.8; start += dash + gap) {
    addLiveStrip(col, samples, start, Math.min(total - 0.4, start + dash), offset - width / 2, offset + width / 2, y, material)
  }
}

/** Intersections are only decorated for a deterministic subset of roads. */
export function roadCrossingCenters(spec: CarriagewaySpec, total: number): number[] {
  if (spec.crossings === false || spec.closed) return []
  if (spec.style === 'stone' || spec.width < 4.6 || total < 38) return []
  if (hash01(spec.seed, 3) > 0.35) return []
  return [4.9, total - 4.9]
}

function addCrossing(
  col: GeometryCollector,
  samples: PathSample[],
  center: number,
  half: number,
  y: number,
  nearStart: boolean,
  m: PathDetailMaterials,
) {
  const span = 4.4
  const barWidth = 0.52
  const pitch = 1.12
  for (let i = 0; i < 4; i++) {
    const d0 = center - span / 2 + i * pitch
    addBand(col, samples, d0, d0 + barWidth, -half + 0.55, half - 0.55, y + 0.0012, m.lineWhite)
  }
  const stop = nearStart ? center - span / 2 - 0.95 : center + span / 2 + 0.55
  addBand(col, samples, stop, stop + 0.38, -half + 0.55, half - 0.55, y + 0.0012, m.lineWhite)
}

/** Lane markings, crossings and reflective studs. */
export function addCarriagewayMarkings(
  col: GeometryCollector,
  samples: PathSample[],
  spec: CarriagewaySpec,
  surfaceY: number,
  m: PathDetailMaterials,
) {
  if (samples.length < 2) return
  const total = pathTotal(samples)
  const half = spec.width / 2
  const y = surfaceY + 0.004
  const stone = spec.style === 'stone'

  if (!stone) {
    if (spec.lanes >= 4) {
      addContinuousLine(col, samples, -0.16, 0.11, y, m.lineYellow)
      addContinuousLine(col, samples, 0.16, 0.11, y, m.lineYellow)
      const divider = Math.min(half / 2, half - 0.85)
      if (divider > 0.45) {
        addDashes(col, samples, -divider, m.lineWhite, 3, 4.4, 0.13, y)
        addDashes(col, samples, divider, m.lineWhite, 3, 4.4, 0.13, y)
      }
    } else {
      addDashes(col, samples, 0, m.lineYellow, 4, 6, 0.12, y)
    }
    const edge = Math.max(0.35, half - 0.5)
    addContinuousLine(col, samples, -edge, 0.12, y, m.lineWhite)
    addContinuousLine(col, samples, edge, 0.12, y, m.lineWhite)

    const centers = roadCrossingCenters(spec, total)
    for (const center of centers) addCrossing(col, samples, center, half, y, center < total / 2, m)

    const studLines = spec.lanes >= 4 ? [-edge, -half / 2, half / 2, edge] : [-edge, edge]
    studLines.forEach((offset, lineIndex) => {
      for (let d = 5.5 + lineIndex * 3.1; d < total - 2.5; d += 15) {
        addBand(col, samples, d, d + 0.18, offset - 0.055, offset + 0.055, y + 0.002, m.stud)
      }
    })
  }
}

function addDrain(
  col: GeometryCollector,
  samples: PathSample[],
  distance: number,
  lateral: number,
  y: number,
  m: PathDetailMaterials,
) {
  addBand(col, samples, distance - 0.32, distance + 0.32, lateral - 0.19, lateral + 0.19, y + 0.0018, m.drain)
  addBand(col, samples, distance - 0.25, distance + 0.25, lateral - 0.13, lateral + 0.13, y + 0.003, m.metal)
  for (let k = -1; k <= 1; k++) {
    const slot = distance + k * 0.09
    addBand(col, samples, slot - 0.017, slot + 0.017, lateral - 0.12, lateral + 0.12, y + 0.0038, m.drain)
  }
}

/** Gutter channel and storm drains at fixed world spacing. */
export function addRoadEdgeDetails(
  col: GeometryCollector,
  samples: PathSample[],
  spec: CarriagewaySpec,
  surfaceY: number,
  m: PathDetailMaterials,
) {
  const total = pathTotal(samples)
  if (samples.length < 2 || total < 1) return
  const half = spec.width / 2
  const gutter = spec.style === 'stone' ? 0.34 : 0.4
  const y = surfaceY + 0.004
  col.add(stripGeometry(samples, -half, -half + gutter, y), m.gutter)
  col.add(stripGeometry(samples, half - gutter, half, y), m.gutter)

  for (const sideSign of [-1, 1]) {
    const lateral = sideSign * (half - gutter * 0.55)
    let distance = sideSign > 0 ? 6.5 : 17.5
    while (distance < total - 3) {
      addDrain(col, samples, distance, lateral, y, m)
      distance += 24
    }
  }
}

function addCanopy(
  col: GeometryCollector,
  x: number,
  y: number,
  z: number,
  radius: number,
  rotY: number,
  material: THREE.Material,
) {
  const geometry = CANOPY_GEO.clone()
  geometry.scale(radius, radius * 0.82, radius)
  geometry.rotateY(rotY)
  geometry.translate(x, y, z)
  col.add(geometry, material)
}

function addTreePit(
  col: GeometryCollector,
  samples: PathSample[],
  distance: number,
  lateral: number,
  topY: number,
  seed: number,
  m: PathDetailMaterials,
) {
  const size = 0.62
  const frame = 0.06
  const inner = size / 2 - frame
  const y = topY + 0.014
  addBand(col, samples, distance - inner, distance + inner, lateral - inner, lateral + inner, topY + 0.012, m.soil)
  addBand(col, samples, distance - size / 2, distance + size / 2, lateral - size / 2, lateral - size / 2 + frame, y, m.curb)
  addBand(col, samples, distance - size / 2, distance + size / 2, lateral + size / 2 - frame, lateral + size / 2, y, m.curb)
  addBand(col, samples, distance - size / 2, distance - size / 2 + frame, lateral - size / 2, lateral + size / 2, y, m.curb)
  addBand(col, samples, distance + size / 2 - frame, distance + size / 2, lateral - size / 2, lateral + size / 2, y, m.curb)

  if (hash01(seed, 7) < 0.36) return
  const point = pointAtDistance(samples, distance)
  const x = point.pos.x + point.side.x * lateral
  const z = point.pos.z + point.side.z * lateral
  const base = topY + 0.01
  const height = 1.35 + hash01(seed, 8) * 0.55
  col.addBox(0.07, height, 0.07, x, base + height / 2, z, m.trunk, hash01(seed, 9) * 0.8)
  const crown = 0.46 + hash01(seed, 10) * 0.16
  addCanopy(col, x, base + height + crown * 0.55, z, crown, hash01(seed, 11) * Math.PI, m.foliage)
  addCanopy(col, x + 0.16, base + height + crown * 1.05, z - 0.1, crown * 0.68, hash01(seed, 12) * Math.PI, m.foliage)
}

/** Tactile guide strips, street tree pits and crossing warning pads. */
export function addSidewalkDetails(
  col: GeometryCollector,
  samples: PathSample[],
  spec: CarriagewaySpec,
  half: number,
  topY: number,
  m: PathDetailMaterials,
) {
  const total = pathTotal(samples)
  if (samples.length < 2 || total < 2.5) return
  col.add(stripGeometry(samples, half + 0.26, half + 0.58, topY + 0.01), m.tactile)
  col.add(stripGeometry(samples, -half - 0.58, -half - 0.26, topY + 0.01), m.tactile)

  const crossings = roadCrossingCenters(spec, total)
  const nearCrossing = (distance: number) => crossings.some((center) => Math.abs(distance - center) < 3.1)

  for (const sideSign of [-1, 1]) {
    const phase = sideSign > 0 ? 6.4 : 2.2
    const spots = spacedSamples(samples, 9.4, phase, 0, total - 1.4)
    let slot = sideSign > 0 ? 0 : 57
    for (const spot of spots) {
      slot += 1
      if (hash01(slot, 5) < 0.16) continue
      if (nearCrossing(spot.distance)) continue
      addTreePit(col, samples, spot.distance, sideSign * (half + 0.91), topY, slot, m)
    }
  }

  for (const center of crossings) {
    for (const sideSign of [-1, 1]) {
      for (const endSign of [-1, 1]) {
        const distance = center + endSign * 2.45
        addBand(
          col,
          samples,
          distance - 0.21,
          distance + 0.21,
          sideSign * (half + 0.24),
          sideSign * (half + 0.62),
          topY + 0.014,
          m.tactile,
        )
      }
    }
  }
}

function addReedClump(
  col: GeometryCollector,
  x: number,
  y: number,
  z: number,
  seed: number,
  m: PathDetailMaterials,
) {
  const blades = 3 + Math.floor(hash01(seed, 21) * 3)
  for (let k = 0; k < blades; k++) {
    const height = 0.5 + hash01(seed + k, 22) * 0.65
    const bx = x + (hash01(seed + k, 23) - 0.5) * 0.4
    const bz = z + (hash01(seed + k, 24) - 0.5) * 0.4
    col.addBox(
      0.035,
      height,
      0.035,
      bx,
      y + height / 2,
      bz,
      k % 3 === 0 ? m.reedTop : m.reed,
      hash01(seed + k, 25) * 0.7,
      (hash01(seed + k, 26) - 0.5) * 0.24,
    )
  }
}

function addRock(
  col: GeometryCollector,
  x: number,
  y: number,
  z: number,
  size: number,
  rotY: number,
  m: PathDetailMaterials,
) {
  const geometry = ROCK_GEO.clone()
  geometry.scale(size, size * 0.62, size * 0.82)
  geometry.rotateY(rotY)
  geometry.translate(x, y, z)
  col.add(geometry, m.rock)
}

/** River banks: layered mud/sand/grass, reeds, rocks and silt patches. */
export function addRiverBankDetails(
  col: GeometryCollector,
  samples: PathSample[],
  width: number,
  m: PathDetailMaterials,
) {
  const total = pathTotal(samples)
  if (samples.length < 2 || total < 1.5) return
  const half = width / 2
  col.add(stripGeometry(samples, -half - 3.2, half + 3.2, 0.012), m.bankEarth)
  col.add(stripGeometry(samples, -half - 3.0, -half - 1.25, 0.022), m.bankGrass)
  col.add(stripGeometry(samples, half + 1.25, half + 3.0, 0.022), m.bankGrass)
  col.add(stripGeometry(samples, -half - 1.25, -half - 0.5, 0.028), m.bankSand)
  col.add(stripGeometry(samples, half + 0.5, half + 1.25, 0.028), m.bankSand)
  col.add(stripGeometry(samples, -half - 0.5, -half + 0.16, 0.032), m.bankMud)
  col.add(stripGeometry(samples, half - 0.16, half + 0.5, 0.032), m.bankMud)

  let index = 0
  for (let distance = 2.2; distance < total - 1.6; distance += 3.1, index++) {
    if (hash01(index, 11) < 0.32) continue
    const sideSign = index % 2 === 0 ? 1 : -1
    const point = pointAtDistance(samples, distance)
    const offset = sideSign * (half - 0.02 + hash01(index, 12) * 0.62)
    addReedClump(
      col,
      point.pos.x + point.side.x * offset,
      0.045,
      point.pos.z + point.side.z * offset,
      index,
      m,
    )
  }

  index = 0
  for (let distance = 4.1; distance < total - 2; distance += 4.7, index++) {
    const sideSign = index % 2 === 0 ? -1 : 1
    const point = pointAtDistance(samples, distance)
    const offset = sideSign * (half + 0.12 + hash01(index, 31) * 0.5)
    const size = 0.2 + hash01(index, 32) * 0.32
    addRock(
      col,
      point.pos.x + point.side.x * offset,
      0.03 + size * 0.28,
      point.pos.z + point.side.z * offset,
      size,
      hash01(index, 33) * Math.PI,
      m,
    )
    if (hash01(index, 34) > 0.74) {
      const offset2 = offset + sideSign * 0.34
      addRock(
        col,
        point.pos.x + point.side.x * offset2,
        0.025 + size * 0.2,
        point.pos.z + point.side.z * offset2,
        size * 0.6,
        hash01(index, 35) * Math.PI,
        m,
      )
    }
  }

  index = 0
  for (let distance = 5.6; distance < total - 2; distance += 6.8, index++) {
    const sideSign = index % 2 === 0 ? 1 : -1
    const lat0 = sideSign * (half + 0.6 + hash01(index, 41) * 1.5)
    const lat1 = lat0 + sideSign * (0.4 + hash01(index, 42) * 0.7)
    addBand(col, samples, distance - 0.4, distance + 0.5, Math.min(lat0, lat1), Math.max(lat0, lat1), 0.031, m.bankMud)
  }
}

function buildPolygon(points: Vec2[], yOffset: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  points.forEach((point, index) => {
    if (index === 0) shape.moveTo(point[0], -point[1])
    else shape.lineTo(point[0], -point[1])
  })
  shape.closePath()
  const geometry = new THREE.ShapeGeometry(shape)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, yOffset, 0)
  geometry.computeVertexNormals()
  return geometry
}

function expandPolygon(points: Vec2[], center: Vec2, extra: number): Vec2[] {
  return points.map((point) => {
    const dx = point[0] - center[0]
    const dz = point[1] - center[1]
    const length = Math.hypot(dx, dz) || 1
    return [point[0] + (dx / length) * extra, point[1] + (dz / length) * extra]
  })
}

/** Pond shore details: mud/sand/grass rings, rocks, reeds and lily pads. */
export function addPondShoreDetails(col: GeometryCollector, samples: PathSample[], m: PathDetailMaterials) {
  if (samples.length < 4) return
  const boundary: Vec2[] = samples.map((sample) => [sample.pos.x, sample.pos.z])
  const center = polygonCentroid(boundary)
  col.add(buildPolygon(boundary, 0.006), m.riverbed)
  col.add(buildPolygon(expandPolygon(boundary, center, 2.6), 0.012), m.bankEarth)
  col.add(buildPolygon(expandPolygon(boundary, center, 1.35), 0.022), m.bankGrass)
  col.add(buildPolygon(expandPolygon(boundary, center, 0.82), 0.028), m.bankSand)
  col.add(buildPolygon(expandPolygon(boundary, center, 0.46), 0.034), m.bankMud)

  const total = pathTotal(samples)
  let index = 0
  for (let distance = 1.2; distance < total - 1.2; distance += 2.7, index++) {
    const point = pointAtDistance(samples, distance)
    const dx = point.pos.x - center[0]
    const dz = point.pos.z - center[1]
    const length = Math.hypot(dx, dz) || 1
    const outwardX = dx / length
    const outwardZ = dz / length
    if (index % 3 === 0) {
      const offset = 0.22 + hash01(index, 51) * 0.55
      const size = 0.22 + hash01(index, 52) * 0.3
      addRock(
        col,
        point.pos.x + outwardX * offset,
        0.03 + size * 0.28,
        point.pos.z + outwardZ * offset,
        size,
        hash01(index, 53) * Math.PI,
        m,
      )
    } else if (hash01(index, 54) > 0.34) {
      const offset = 0.32 + hash01(index, 55) * 0.5
      addReedClump(
        col,
        point.pos.x + outwardX * offset,
        0.04,
        point.pos.z + outwardZ * offset,
        1000 + index,
        m,
      )
    }
  }

  let radius = 0
  for (const point of boundary) radius = Math.max(radius, Math.hypot(point[0] - center[0], point[1] - center[1]))
  const pads = Math.min(9, Math.max(2, Math.floor(total / 9)))
  for (let i = 0; i < pads; i++) {
    const angle = hash01(i, 61) * Math.PI * 2
    const spread = radius * (0.18 + hash01(i, 62) * 0.5)
    const x = center[0] + Math.cos(angle) * spread
    const z = center[1] + Math.sin(angle) * spread
    const pad = new THREE.CircleGeometry(0.22 + hash01(i, 63) * 0.2, 7)
    pad.rotateX(-Math.PI / 2)
    pad.rotateY(hash01(i, 64) * Math.PI)
    pad.translate(x, 0.091, z)
    col.add(pad, m.foliage)
  }
}

/**
 * Pond water surface built as concentric rings toward the centroid: uv.x runs from
 * 0 in the middle to 1 at the exact shoreline, which the shared water shader uses
 * for depth tinting and animated foam.
 */
export function pondWaterGeometry(samples: PathSample[], yOffset: number): THREE.BufferGeometry {
  const raw: Vec2[] = samples.map((sample) => [sample.pos.x, sample.pos.z])
  const geometry = new THREE.BufferGeometry()
  if (raw.length < 4) return geometry
  const step = Math.max(1, Math.ceil(raw.length / 220))
  const boundary: Vec2[] = []
  for (let i = 0; i < raw.length; i += step) boundary.push(raw[i])
  if (boundary.length > 3) {
    const first = boundary[0]
    const last = boundary[boundary.length - 1]
    if (Math.hypot(first[0] - last[0], first[1] - last[1]) < 1e-3) boundary.pop()
  }
  if (boundary.length < 3) return geometry

  const center = polygonCentroid(raw)
  const ccw = polygonArea(raw) > 0
  const rings = [1, 0.66, 0.36, 0.12]
  const segments = boundary.length
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (const factor of rings) {
    for (const point of boundary) {
      const x = center[0] + (point[0] - center[0]) * factor
      const z = center[1] + (point[1] - center[1]) * factor
      positions.push(x, yOffset, z)
      uvs.push(factor, (x + z) * 0.25)
    }
  }
  const centerIndex = positions.length / 3
  positions.push(center[0], yOffset, center[1])
  uvs.push(0, (center[0] + center[1]) * 0.25)

  for (let ring = 0; ring < rings.length - 1; ring++) {
    const base = ring * segments
    const next = base + segments
    for (let i = 0; i < segments; i++) {
      const j = (i + 1) % segments
      if (ccw) {
        indices.push(base + i, next + i, base + j)
        indices.push(base + j, next + i, next + j)
      } else {
        indices.push(base + i, base + j, next + i)
        indices.push(base + j, next + j, next + i)
      }
    }
  }
  const innerBase = (rings.length - 1) * segments
  for (let i = 0; i < segments; i++) {
    const j = (i + 1) % segments
    if (ccw) indices.push(innerBase + i, centerIndex, innerBase + j)
    else indices.push(innerBase + i, innerBase + j, centerIndex)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** River surface with a normalised lateral UV (-1..1) and metric flow coordinate. */
export function waterRibbonGeometry(
  samples: PathSample[],
  half: number,
  yOffset: number,
): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  let run = 0
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]
    if (i > 0) run += sample.pos.distanceTo(samples[i - 1].pos)
    positions.push(
      sample.pos.x - sample.side.x * half,
      sample.pos.y + yOffset,
      sample.pos.z - sample.side.z * half,
      sample.pos.x + sample.side.x * half,
      sample.pos.y + yOffset,
      sample.pos.z + sample.side.z * half,
    )
    uvs.push(-1, run, 1, run)
    if (i < samples.length - 1) {
      const base = i * 2
      indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function railingPosts(samples: PathSample[], spacing: number): PathSample[] {
  const total = pathTotal(samples)
  const posts = spacedSamples(samples, spacing, 0, 0, total - 0.35)
  const last = samples[samples.length - 1]
  if (posts.length > 0 && last.distance - posts[posts.length - 1].distance > 0.5) posts.push(last)
  return posts
}

/** Railings use world distance spacing so dense curve sampling cannot over-populate posts. */
export function addBridgeRailing(
  col: GeometryCollector,
  samples: PathSample[],
  deckHalf: number,
  m: PathDetailMaterials,
) {
  if (samples.length < 2) return
  const posts = railingPosts(samples, 2.4)
  for (const sideSign of [-1, 1]) {
    const offset = sideSign * (deckHalf - 0.12)
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const angle = Math.atan2(-post.flatTangent.z, post.flatTangent.x)
      const x = post.pos.x + post.side.x * offset
      const z = post.pos.z + post.side.z * offset
      col.addBox(0.09, 1.08, 0.09, x, post.pos.y + 0.54, z, m.metal, angle)
      if (i % 4 === 1) {
        const markerOffset = offset + sideSign * 0.06
        col.addBox(
          0.075,
          0.075,
          0.03,
          post.pos.x + post.side.x * markerOffset,
          post.pos.y + 0.9,
          post.pos.z + post.side.z * markerOffset,
          m.marker,
          angle,
        )
      }
    }
    for (let i = 0; i < posts.length - 1; i++) {
      const a = posts[i]
      const b = posts[i + 1]
      const ax = a.pos.x + a.side.x * offset
      const az = a.pos.z + a.side.z * offset
      const bx = b.pos.x + b.side.x * offset
      const bz = b.pos.z + b.side.z * offset
      for (const railY of [0.55, 1.02]) {
        col.addBeam(
          new THREE.Vector3(ax, a.pos.y + railY, az),
          new THREE.Vector3(bx, b.pos.y + railY, bz),
          0.06,
          0.075,
          m.metal,
        )
      }
    }
  }
}

/** Bridge piers at a fixed world spacing, also used by countBridgePiers(). */
export function bridgePierPoints(samples: PathSample[], elevation: number): THREE.Vector3[] {
  const total = pathTotal(samples)
  const result: THREE.Vector3[] = []
  if (total < 8) return result
  for (let distance = 6.5; distance < total - 5; distance += 13) {
    const point = pointAtDistance(samples, distance)
    if (point.pos.y + elevation >= 0.9) result.push(point.pos)
  }
  return result
}

/** Expansion joints, drainage holes, bridgehead curbs, delineators. */
export function addBridgeDeckDetails(
  col: GeometryCollector,
  samples: PathSample[],
  spec: BridgeDeckSpec,
  m: PathDetailMaterials,
) {
  const total = pathTotal(samples)
  if (samples.length < 2 || total < 4) return
  const half = spec.width / 2
  const deckHalf = half + (spec.sidewalk ? 1.35 : 0.25)
  const asphaltTop = 0.035

  const joints: number[] = []
  if (total > 10) {
    for (let distance = 3.4; distance < total - 3.2; distance += 17.5) joints.push(distance)
    joints.push(total - 3.4)
  }
  for (const distance of joints) {
    addBand(col, samples, distance - 0.065, distance + 0.065, -half + 0.1, half - 0.1, asphaltTop + 0.003, m.joint)
    addBand(col, samples, distance - 0.1, distance - 0.065, -half + 0.1, half - 0.1, asphaltTop + 0.0036, m.metal)
    addBand(col, samples, distance + 0.065, distance + 0.1, -half + 0.1, half - 0.1, asphaltTop + 0.0036, m.metal)
  }

  for (const sideSign of [-1, 1]) {
    const lateral = sideSign * (half - 0.16)
    let distance = sideSign > 0 ? 2.8 : 8.2
    while (distance < total - 1.5) {
      addBand(col, samples, distance - 0.16, distance + 0.16, lateral - 0.15, lateral + 0.15, asphaltTop + 0.0022, m.joint)
      addBand(col, samples, distance - 0.11, distance + 0.11, lateral - 0.1, lateral + 0.1, asphaltTop + 0.0032, m.metal)
      distance += 11
    }
  }

  if (total > 10) {
    for (const sideSign of [-1, 1]) {
      for (const start of [0.4, total - 2.8]) {
        const lat0 = sideSign * (half + 0.08)
        const lat1 = sideSign * (Math.min(half + 0.42, deckHalf - 0.04))
        const left = Math.min(lat0, lat1)
        const right = Math.max(lat0, lat1)
        for (let k = 0; k < 8; k++) {
          addBand(
            col,
            samples,
            start + k * 0.3,
            start + k * 0.3 + 0.3,
            left,
            right,
            0.0475,
            k % 2 === 0 ? m.lineYellow : m.joint,
          )
        }
      }
    }
  }

  for (const distance of [1.1, total - 1.1]) {
    for (const sideSign of [-1, 1]) {
      const point = pointAtDistance(samples, distance)
      const lateral = sideSign * (deckHalf - 0.3)
      const x = point.pos.x + point.side.x * lateral
      const z = point.pos.z + point.side.z * lateral
      col.addBox(0.07, 0.9, 0.07, x, point.pos.y + 0.45, z, m.metal)
      col.addBox(0.09, 0.09, 0.09, x, point.pos.y + 0.93, z, m.marker)
    }
  }
}

/** Slab joints on stone footpaths (gravel paths stay unjointed). */
export function addFootpathDetails(
  col: GeometryCollector,
  samples: PathSample[],
  width: number,
  style: string,
  m: PathDetailMaterials,
) {
  if (style === 'gravel' || samples.length < 2) return
  const total = pathTotal(samples)
  const half = width / 2
  for (let distance = 2.2; distance < total - 1; distance += 2.5) {
    addBand(col, samples, distance - 0.017, distance + 0.017, -half + 0.09, half - 0.09, 0.061, m.joint)
  }
}
