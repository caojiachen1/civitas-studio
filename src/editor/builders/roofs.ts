import * as THREE from 'three'
import { GeometryCollector } from '../collector'
import { getPlainMaterial, getSurfaceMaterial } from '../../models/kit'
import type { RoofEntity, RoofFinish, RoofStyle } from '../types'

const FINISHES: Record<RoofFinish, { name: string; color: string; metalness: number; roughness: number; line: string }> = {
  terracotta: { name: '陶土瓦', color: '#a75f46', metalness: 0, roughness: 0.8, line: '#7f4534' },
  slate: { name: '青石板', color: '#5f686b', metalness: 0.02, roughness: 0.72, line: '#424a4c' },
  charcoal: { name: '炭黑金属', color: '#41474a', metalness: 0.42, roughness: 0.42, line: '#2d3234' },
  copper: { name: '氧化铜', color: '#6d8b7b', metalness: 0.35, roughness: 0.55, line: '#526d5f' },
  shingle: { name: '木瓦', color: '#6c5b48', metalness: 0, roughness: 0.88, line: '#4f4234' },
}

const fascia = getSurfaceMaterial('matte', '#e4dccd')
const gutterMat = getSurfaceMaterial('metal', '#4d5153')
const warmWall = getSurfaceMaterial('matte', '#ddd4c3')
const flatGravel = getPlainMaterial('#a7a39a', { roughness: 0.96 })

function finishMaterial(finish: RoofFinish, doubleSide = false) {
  const def = FINISHES[finish]
  return getSurfaceMaterial(def.metalness > 0.2 ? 'metal' : 'matte', def.color, 1, doubleSide ? 'double' : 'front')
}

function lineMaterial(finish: RoofFinish) {
  return getPlainMaterial(FINISHES[finish].line, { roughness: 0.88 })
}

function addSurface(col: GeometryCollector, vertices: THREE.Vector3[], material: THREE.Material) {
  const positions: number[] = []
  const uvs: number[] = []
  vertices.forEach((v, i) => {
    positions.push(v.x, v.y, v.z)
    uvs.push(i % 2, Math.floor(i / 2))
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(vertices.length === 4 ? [0, 1, 2, 0, 2, 3] : [0, 1, 2])
  geo.computeVertexNormals()
  col.add(geo, material)
}

function addGableTriangles(
  col: GeometryCollector,
  w: number,
  d: number,
  rise: number,
  material: THREE.Material,
  xOffset: number,
  thickness = 0.1,
) {
  for (const sign of [-1, 1]) {
    const x = sign * (w / 2 - thickness / 2) + xOffset
    addSurface(
      col,
      [
        new THREE.Vector3(x, 0, -d / 2),
        new THREE.Vector3(x, 0, d / 2),
        new THREE.Vector3(x, rise, 0),
      ],
      material,
    )
  }
}

function addRidge(col: GeometryCollector, len: number, y: number, finish: RoofFinish, alongX = true) {
  col.addBox(alongX ? len : 0.28, 0.1, alongX ? 0.28 : len, 0, y, 0, lineMaterial(finish))
}

function addGable(col: GeometryCollector, entity: RoofEntity, rise: number, angle: number) {
  const { w, d } = entity
  const slopeLen = Math.hypot(d / 2, rise)
  const finish = finishMaterial(entity.finish)
  const lines = lineMaterial(entity.finish)
  for (const sign of [1, -1]) {
    col.addBox(w, 0.16, slopeLen, 0, rise / 2 + 0.055, (sign * d) / 4, finish, 0, sign * angle)
    const count = Math.max(4, Math.round((d / 2) / 0.55))
    for (let i = 1; i < count; i++) {
      const t = i / count
      const z = (sign * d * t) / 2
      const y = rise * (1 - t) + 0.14
      col.addBox(w - 0.08, 0.022, 0.055, 0, y, z, lines, 0, sign * angle)
    }
  }
  addGableTriangles(col, w, d, rise - 0.02, warmWall, 0, 0.08)
  addRidge(col, w + 0.12, rise + 0.1, entity.finish)
  for (const sign of [1, -1]) {
    col.addBox(w + 0.16, 0.12, 0.14, 0, -0.02, (sign * d) / 2, gutterMat)
    col.addBox(w + 0.12, 0.09, 0.06, 0, -0.1, (sign * d) / 2, fascia)
  }
}

function addHip(col: GeometryCollector, entity: RoofEntity, rise: number) {
  const { w, d } = entity
  const ridgeHalf = Math.max(0.05, (w - d) / 2)
  const ridgeA = new THREE.Vector3(-ridgeHalf, rise, 0)
  const ridgeB = new THREE.Vector3(ridgeHalf, rise, 0)
  const a = new THREE.Vector3(-w / 2, 0, -d / 2)
  const b = new THREE.Vector3(w / 2, 0, -d / 2)
  const c = new THREE.Vector3(w / 2, 0, d / 2)
  const dd = new THREE.Vector3(-w / 2, 0, d / 2)
  const mat = finishMaterial(entity.finish, true)
  addSurface(col, [b, c, ridgeB], mat)
  addSurface(col, [dd, a, ridgeA], mat)
  addSurface(col, [c, dd, ridgeA, ridgeB], mat)
  addSurface(col, [a, b, ridgeB, ridgeA], mat)
  addSurface(col, [b, a, dd, c], finishMaterial(entity.finish, true))
  addRidge(col, Math.max(0.2, w - d), rise + 0.07, entity.finish)
  for (const [p1, p2] of [
    [a, b],
    [b, c],
    [c, dd],
    [dd, a],
  ] as [THREE.Vector3, THREE.Vector3][]) {
    col.addBeam(
      new THREE.Vector3(p1.x, -0.06, p1.z),
      new THREE.Vector3(p2.x, -0.06, p2.z),
      0.12,
      0.18,
      fascia,
    )
  }
}

function addFlat(col: GeometryCollector, entity: RoofEntity) {
  const { w, d } = entity
  col.addBox(w, 0.22, d, 0, -0.11, 0, fascia)
  col.addBox(w - 0.4, 0.015, d - 0.4, 0, 0.01, 0, flatGravel)
  const ph = 0.58
  const t = 0.2
  col.addBox(w, ph, t, 0, ph / 2 - 0.02, d / 2 - t / 2, warmWall)
  col.addBox(w, ph, t, 0, ph / 2 - 0.02, -d / 2 + t / 2, warmWall)
  col.addBox(t, ph, d - t * 2, w / 2 - t / 2, ph / 2 - 0.02, 0, warmWall)
  col.addBox(t, ph, d - t * 2, -w / 2 + t / 2, ph / 2 - 0.02, 0, warmWall)
  col.addBox(w + 0.06, 0.06, t + 0.06, 0, ph - 0.02, d / 2 - t / 2, fascia)
  col.addBox(w + 0.06, 0.06, t + 0.06, 0, ph - 0.02, -d / 2 + t / 2, fascia)
  col.addBox(t + 0.06, 0.06, d + 0.06, w / 2 - t / 2, ph - 0.02, 0, fascia)
  col.addBox(t + 0.06, 0.06, d + 0.06, -w / 2 + t / 2, ph - 0.02, 0, fascia)
}

function addShed(col: GeometryCollector, entity: RoofEntity, rise: number) {
  const { w, d } = entity
  const slopeLen = Math.hypot(d, rise)
  const angle = Math.atan2(rise, d)
  const finish = finishMaterial(entity.finish)
  const lines = lineMaterial(entity.finish)
  col.addBox(w, 0.16, slopeLen, 0, rise / 2 + 0.05, 0, finish, 0, -angle)
  const count = Math.max(4, Math.round(d / 0.6))
  for (let i = 1; i < count; i++) {
    const t = i / count
    col.addBox(w - 0.08, 0.022, 0.055, 0, rise * t + 0.14, -d / 2 + d * t, lines, 0, -angle)
  }
  addGableTriangles(col, w, d, rise, warmWall, 0, 0.08)
  col.addBox(w + 0.14, 0.12, 0.14, 0, -0.02, -d / 2, gutterMat)
  col.addBox(w + 0.14, 0.12, 0.14, 0, rise - 0.02, d / 2, gutterMat)
}

export function roofRise(entity: Pick<RoofEntity, 'style' | 'pitch' | 'd'>): number {
  if (entity.style === 'flat') return 0
  if (entity.style === 'shed') return Math.tan((entity.pitch * Math.PI) / 180) * entity.d
  return Math.tan((entity.pitch * Math.PI) / 180) * (entity.d / 2)
}

export function buildRoof(entity: RoofEntity): THREE.Group {
  const col = new GeometryCollector()
  const rise = roofRise(entity)
  const angle = Math.atan2(rise, entity.d / 2)
  if (entity.style === 'gable') addGable(col, entity, rise, angle)
  else if (entity.style === 'hip') addHip(col, entity, rise)
  else if (entity.style === 'flat') addFlat(col, entity)
  else addShed(col, entity, rise)
  const group = col.build({ name: 'roof' })
  group.position.set(entity.x, entity.eaveY, entity.z)
  group.rotation.y = entity.rot
  group.userData.entityId = entity.id
  return group
}

export function roofFinishName(finish: RoofFinish) {
  return FINISHES[finish].name
}

export function roofStyleName(style: RoofStyle) {
  return style === 'gable' ? '双坡' : style === 'hip' ? '四坡' : style === 'flat' ? '平顶' : '单坡'
}
