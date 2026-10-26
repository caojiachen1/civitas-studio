import * as THREE from 'three'
import { GeometryCollector } from '../collector'
import { dist2 } from '../geom'
import { getSurfaceMaterial } from '../../models/kit'
import type { OpeningEntity, WallEntity } from '../types'

const frameMat = getSurfaceMaterial('matte', '#eee8dc')
const trimMat = getSurfaceMaterial('matte', '#d2c8b6')
const baseMat = getSurfaceMaterial('matte', '#b9ac94')
const glassMat = getSurfaceMaterial('glass', '#9fc3c8')
const metalMat = getSurfaceMaterial('metal', '#8f989d')
const doorWood = getSurfaceMaterial('wood', '#b08e68')
const doorDark = getSurfaceMaterial('matte', '#4c5254')
const garageMat = getSurfaceMaterial('matte', '#cbc7bc')
const doorMetal = getSurfaceMaterial('metal', '#4e565a')

interface SortedOpening extends OpeningEntity {
  left: number
  right: number
}

function addBaseboard(col: GeometryCollector, x1: number, x2: number, sill: number, thickness: number) {
  if (sill > 0.16 || x2 - x1 < 0.08) return
  const w = x2 - x1
  const cx = (x1 + x2) / 2
  col.addBox(w, 0.1, 0.02, cx, 0.05, thickness / 2 + 0.01, baseMat)
  col.addBox(w, 0.1, 0.02, cx, 0.05, -thickness / 2 - 0.01, baseMat)
}

function addWindowDetail(
  col: GeometryCollector,
  op: SortedOpening,
  thickness: number,
  wallHeight: number,
) {
  const w = op.width
  const h = op.height
  const cx = (op.left + op.right) / 2
  const cy = op.sill + h / 2
  const frame = 0.065
  const depth = thickness + 0.035
  const fz = 0
  col.addBox(frame, h + frame, depth, cx - w / 2 + frame / 2, cy, fz, frameMat)
  col.addBox(frame, h + frame, depth, cx + w / 2 - frame / 2, cy, fz, frameMat)
  col.addBox(w, frame, depth, cx, op.sill + h - frame / 2, fz, frameMat)
  col.addBox(w, frame, depth, cx, op.sill + frame / 2, fz, frameMat)
  const glassH = Math.max(0.1, h - frame * 2)
  const glassW = Math.max(0.1, w - frame * 2)
  col.addBox(glassW, glassH, 0.028, cx, cy, 0, glassMat)
  const paneCount = Math.max(1, Math.min(4, op.style === 'picture' ? 2 : op.style === 'wide' ? 3 : op.style === 'slim' ? 1 : 2))
  for (let i = 1; i < paneCount; i++) {
    const px = op.left + (w * i) / paneCount
    col.addBox(0.04, glassH, depth - 0.02, px, cy, fz, frameMat)
  }
  col.addBox(w + 0.14, 0.045, thickness + 0.16, cx, op.sill - 0.022, 0, trimMat)
  col.addBox(w + 0.08, 0.05, thickness + 0.06, cx, op.sill + h + 0.025, 0, trimMat)
  if (op.sill < 0.6 && wallHeight > 2) {
    col.addBox(w, 0.04, 0.03, cx, wallHeight - 0.04, thickness / 2 + 0.015, trimMat)
  }
}

interface HingeFrame {
  x: number
  direction: 1 | -1
  angle: number
}

function hingeFrameFor(op: SortedOpening, cx: number, leafW: number): HingeFrame {
  const left = (op.hinge ?? 'left') === 'left'
  const direction = left ? 1 : -1
  const open = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(op.openAngle ?? 0, -135, 135))
  return {
    x: left ? cx - leafW / 2 : cx + leafW / 2,
    direction,
    angle: open * direction,
  }
}

function addHingedBox(
  col: GeometryCollector,
  frame: HingeFrame,
  w: number,
  h: number,
  d: number,
  distance: number,
  y: number,
  z: number,
  material: THREE.Material,
) {
  const localX = distance * frame.direction
  const cos = Math.cos(frame.angle)
  const sin = Math.sin(frame.angle)
  col.addBox(
    w,
    h,
    d,
    frame.x + localX * cos + z * sin,
    y,
    -localX * sin + z * cos,
    material,
    frame.angle,
  )
}

function addLeafBox(
  col: GeometryCollector,
  frame: HingeFrame,
  leafW: number,
  w: number,
  h: number,
  d: number,
  y: number,
  z: number,
  material: THREE.Material,
) {
  addHingedBox(col, frame, w, h, d, leafW / 2, y, z, material)
}

function addSingleDoorLeaf(col: GeometryCollector, frame: HingeFrame, leafW: number, leafH: number) {
  addLeafBox(col, frame, leafW, leafW, leafH, 0.045, leafH / 2, 0.005, doorWood)
  const inset = 0.1
  addLeafBox(col, frame, leafW, leafW - inset * 2, leafH * 0.32, 0.018, leafH * 0.68, 0.031, trimMat)
  addLeafBox(col, frame, leafW, leafW - inset * 2, leafH * 0.38, 0.018, leafH * 0.3, 0.031, trimMat)
  addHingedBox(col, frame, 0.026, 0.16, 0.065, leafW - 0.12, 1.02, 0.045, metalMat)
}

function addGlassDoorLeaf(col: GeometryCollector, frame: HingeFrame, leafW: number, leafH: number) {
  const stile = 0.045
  addLeafBox(col, frame, leafW, leafW, leafH, 0.03, leafH / 2, 0.006, glassMat)
  for (const distance of [stile / 2, leafW - stile / 2, leafW / 2]) {
    addHingedBox(col, frame, stile, leafH, 0.06, distance, leafH / 2, 0.028, doorMetal)
  }
  addLeafBox(col, frame, leafW, leafW, 0.045, 0.06, leafH - 0.022, 0.028, doorMetal)
  addLeafBox(col, frame, leafW, leafW, 0.05, 0.06, 0.025, 0.028, doorMetal)
  addHingedBox(col, frame, 0.035, 0.09, 0.035, leafW - 0.14, 1.02, 0.08, metalMat)
  addLeafBox(col, frame, leafW, leafW, 0.055, 0.06, leafH + 0.01, 0, metalMat)
  addLeafBox(col, frame, leafW, leafW + 0.06, 0.028, 0.16, 0.014, 0, doorMetal)
}

function addDoubleDoorLeaves(
  col: GeometryCollector,
  op: SortedOpening,
  cx: number,
  leafW: number,
  leafH: number,
) {
  const half = leafW / 2 - 0.012
  const outerLeft = hingeFrameFor({ ...op, hinge: 'left' }, cx, leafW)
  const outerRight = hingeFrameFor({ ...op, hinge: 'right' }, cx, leafW)
  for (const frame of [outerLeft, outerRight]) {
    addLeafBox(col, frame, half, half, leafH, 0.045, leafH / 2, 0, doorWood)
    addLeafBox(col, frame, half, half - 0.12, leafH - 0.25, 0.018, leafH / 2 + 0.05, 0.028, trimMat)
    addHingedBox(col, frame, 0.025, 0.16, 0.06, half - 0.06, 1.03, 0.05, metalMat)
  }
}

function addSlidingPanel(
  col: GeometryCollector,
  x: number,
  z: number,
  w: number,
  h: number,
  handle: boolean,
) {
  const stile = 0.045
  col.addBox(w, h, 0.03, x, h / 2, z, glassMat)
  col.addBox(stile, h, 0.06, x - w / 2 + stile / 2, h / 2, z + 0.014, doorMetal)
  col.addBox(stile, h, 0.06, x + w / 2 - stile / 2, h / 2, z + 0.014, doorMetal)
  col.addBox(w, 0.045, 0.06, x, h - 0.022, z + 0.014, doorMetal)
  col.addBox(w, 0.05, 0.06, x, 0.025, z + 0.014, doorMetal)
  if (handle) col.addBox(0.035, 0.22, 0.04, x - w / 2 + 0.09, 1.05, z + 0.05, metalMat)
}

function addSlidingDoorLeaves(
  col: GeometryCollector,
  cx: number,
  leafW: number,
  leafH: number,
  thickness: number,
  openAngle: number,
) {
  const panelW = leafW / 2 - 0.012
  const travel = (Math.abs(openAngle) / 135) * panelW * 0.92
  const slide = openAngle < 0 ? -travel : travel
  const fixedX = cx - leafW / 4 + 0.006
  const movingX = cx + leafW / 4 - 0.006 + slide
  const innerZ = thickness / 2 + 0.022
  const outerZ = thickness / 2 + 0.055
  addSlidingPanel(col, fixedX, innerZ, panelW, leafH - 0.02, false)
  addSlidingPanel(col, movingX, outerZ, panelW, leafH - 0.02, true)
  col.addBox(leafW + 0.06, 0.05, 0.06, cx, leafH + 0.01, outerZ, doorMetal)
  col.addBox(leafW + 0.06, 0.028, 0.16, cx, 0.014, 0, doorMetal)
}

function addGarageLeaf(col: GeometryCollector, cx: number, leafW: number, leafH: number) {
  col.addBox(leafW, leafH, 0.055, cx, leafH / 2, 0, garageMat)
  for (let i = 1; i <= 4; i++) {
    col.addBox(leafW - 0.1, 0.035, 0.012, cx, (leafH * i) / 5, 0.033, doorDark)
  }
  col.addBox(leafW - 0.08, 0.06, 0.07, cx, leafH - 0.04, 0.02, metalMat)
}

function addDoorDetail(col: GeometryCollector, op: SortedOpening, thickness: number) {
  const w = op.width
  const h = op.height
  const cx = (op.left + op.right) / 2
  const frame = 0.06
  const depth = thickness + 0.03
  col.addBox(frame, h + frame, depth, cx - w / 2 + frame / 2, h / 2, 0, frameMat)
  col.addBox(frame, h + frame, depth, cx + w / 2 - frame / 2, h / 2, 0, frameMat)
  col.addBox(w, frame, depth, cx, h - frame / 2, 0, frameMat)

  const leafW = Math.max(0.2, w - frame * 2 - 0.02)
  const leafH = Math.max(0.2, h - frame - 0.03)
  const openAngle = THREE.MathUtils.clamp(op.openAngle ?? 0, -135, 135)

  if (op.style === 'garage') {
    addGarageLeaf(col, cx, leafW, leafH)
  } else if (op.style === 'sliding') {
    addSlidingDoorLeaves(col, cx, leafW, leafH, thickness, openAngle)
  } else if (op.style === 'double') {
    addDoubleDoorLeaves(col, op, cx, leafW, leafH)
  } else if (op.style === 'glass') {
    addGlassDoorLeaf(col, hingeFrameFor(op, cx, leafW), leafW, leafH)
  } else {
    addSingleDoorLeaf(col, hingeFrameFor(op, cx, leafW), leafW, leafH)
  }
  col.addBox(w + 0.1, 0.028, thickness + 0.1, cx, 0.014, 0, trimMat)
}

export function buildWall(wall: WallEntity, openings: OpeningEntity[], elevation: number): THREE.Group {
  const length = dist2(wall.a, wall.b)
  const dx = (wall.b[0] - wall.a[0]) / (length || 1)
  const dz = (wall.b[1] - wall.a[1]) / (length || 1)
  const col = new GeometryCollector()
  const wallMat = getSurfaceMaterial('matte', wall.color)
  const t = wall.thickness
  const h = wall.height

  const sorted: SortedOpening[] = openings
    .map((op) => {
      const w = Math.min(op.width, Math.max(0.25, length - 0.16))
      const center = Math.min(length - w / 2 - 0.08, Math.max(w / 2 + 0.08, op.offset))
      return { ...op, left: center - w / 2, right: center + w / 2, width: w }
    })
    .filter((op) => op.right - op.left > 0.1)
    .sort((a, b) => a.left - b.left)

  let cursor = 0
  for (const op of sorted) {
    const left = Math.max(cursor, op.left)
    const right = Math.min(length, op.right)
    if (left > cursor + 0.005) {
      const w = left - cursor
      col.addBox(w, h, t, (cursor + left) / 2, h / 2, 0, wallMat)
      addBaseboard(col, cursor, left, 0, t)
    }
    const openingW = right - left
    if (openingW > 0.05) {
      if (op.sill > 0.02) {
        col.addBox(openingW, op.sill, t, (left + right) / 2, op.sill / 2, 0, wallMat)
        addBaseboard(col, left, right, 0, t)
      }
      const top = Math.min(h, op.sill + op.height)
      if (top < h - 0.005) {
        col.addBox(openingW, h - top, t, (left + right) / 2, (h + top) / 2, 0, wallMat)
      }
      const detail = { ...op, left, right, width: openingW, height: Math.min(op.height, h - op.sill - 0.03) }
      if (op.type === 'window') addWindowDetail(col, detail, t, h)
      else addDoorDetail(col, detail, t)
    }
    cursor = Math.max(cursor, right)
  }
  if (cursor < length - 0.005) {
    const w = length - cursor
    col.addBox(w, h, t, cursor + w / 2, h / 2, 0, wallMat)
    addBaseboard(col, cursor, length, 0, t)
  }

  col.addBox(t, h, t, 0, h / 2, 0, wallMat)
  col.addBox(t, h, t, length, h / 2, 0, wallMat)
  col.addBox(length, 0.035, 0.02, length / 2, 0.11, t / 2 + 0.011, trimMat)
  col.addBox(length, 0.035, 0.02, length / 2, 0.11, -t / 2 - 0.011, trimMat)

  const group = col.build({ name: 'wall' })
  group.position.set(wall.a[0], elevation, wall.a[1])
  group.rotation.y = -Math.atan2(dz, dx)
  group.userData.entityId = wall.id
  group.userData.wallLength = length
  return group
}
