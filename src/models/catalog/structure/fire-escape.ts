import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 消防疏散钢梯：两跑各 8 级，踢面 0.17 / 踏面 0.28，半层平台 1.36。
 * 梯宽 0.96，之字形布置。踏板用 3 根细扁钢格栅 + 铜质前缘防滑条近似，
 * 每级都有独立踢板。梯梁贴着踏步前缘斜向布置；6 根外挑钢柱、平台梁、
 * 顶部横梁与斜撑把平台和上跑托住，另设平台护栏和顶部护栏。全黑金属。
 */
const RISE = 0.17
const TREAD = 0.28
const STEPS = 8
const FW = 0.96
const HALF = 0.52
const LAND_TOP = RISE * STEPS // 1.36
const TOP = LAND_TOP * 2 // 2.72
const Z0 = 1.72
const ZL0 = Z0 - TREAD * STEPS // -0.52
const ZL1 = ZL0 - 1.2 // -1.72
const ANG = Math.atan(RISE / TREAD)
const drop = 0.008 + 0.08 / Math.cos(ANG)
const parts: Part[] = []

const stepTop = (i: number) => RISE * (i + 1)
const lowZ = (i: number) => Z0 - TREAD * (i + 0.5)
const lowFront = (i: number) => Z0 - TREAD * i
const upZ = (i: number) => ZL0 + TREAD * (i + 0.5)
const upFront = (i: number) => ZL0 + TREAD * i
const lowNose = (z: number) => RISE + (Z0 - z) * (RISE / TREAD)
const upNose = (z: number) => LAND_TOP + RISE + (z - ZL0) * (RISE / TREAD)
const lowRail = (z: number) => 0.9 + (Z0 - z) * (RISE / TREAD)
const upRail = (z: number) => LAND_TOP + 0.9 + (z - ZL0) * (RISE / TREAD)

// 格栅踏板：3 根扁钢 + 铜前缘 + 踢板
for (let i = 0; i < STEPS; i++) {
  const top = stepTop(i)
  for (const dz of [-0.09, 0, 0.09]) {
    parts.push(box(FW - 0.08, 0.03, 0.06, -HALF, top - 0.015, lowZ(i) + dz, C.steel, { mat: 'metal' }))
    parts.push(box(FW - 0.08, 0.03, 0.06, HALF, LAND_TOP + stepTop(i) - 0.015, upZ(i) + dz, C.steel, { mat: 'metal' }))
  }
  parts.push(box(FW - 0.02, 0.03, 0.05, -HALF, top - 0.015, lowFront(i) - 0.025, C.brass, { mat: 'metal' }))
  parts.push(box(FW - 0.02, 0.03, 0.05, HALF, LAND_TOP + top - 0.015, upFront(i) + 0.025, C.brass, { mat: 'metal' }))
  parts.push(box(FW - 0.04, RISE - 0.02, 0.022, -HALF, top - RISE / 2, lowFront(i) - 0.011, C.blackMetal, { mat: 'metal' }))
  parts.push(box(FW - 0.04, RISE - 0.02, 0.022, HALF, LAND_TOP + top - RISE / 2, upFront(i) + 0.011, C.blackMetal, { mat: 'metal' }))
}

// 半层平台、平台梁
parts.push(box(2.2, 0.08, 1.2, 0, LAND_TOP - 0.04, (ZL0 + ZL1) / 2, C.steel, { mat: 'metal' }))
for (const z of [-0.62, -1.12, -1.62]) {
  parts.push(box(2.2, 0.16, 0.1, 0, 1.2, z, C.blackMetal, { mat: 'metal' }))
}

// 梯梁
const lowLen = 1.82 * Math.hypot(1, RISE / TREAD)
for (const x of [-0.98, -0.06]) {
  parts.push(box(0.06, 0.16, lowLen, x, lowNose(0.67) - drop, 0.67, C.blackMetal, { mat: 'metal', rot: [ANG, 0, 0] }))
}
const upLen = 1.96 * Math.hypot(1, RISE / TREAD)
for (const x of [0.06, 0.98]) {
  parts.push(box(0.06, 0.16, upLen, x, upNose(0.46) - drop, 0.46, C.blackMetal, { mat: 'metal', rot: [-ANG, 0, 0] }))
}

// 6 根外挑钢柱 + 柱脚 + 顶部横梁 + 平台斜撑
for (const x of [-1.04, 1.04]) {
  for (const z of [-1.62, -0.62]) {
    parts.push(box(0.07, 1.12, 0.07, x, 0.56, z, C.blackMetal, { mat: 'metal' }))
    parts.push(box(0.2, 0.03, 0.2, x, 0.015, z, C.graphite, { mat: 'metal' }))
  }
  parts.push(box(0.07, 2.58, 0.07, x, 1.29, 1.44, C.blackMetal, { mat: 'metal' }))
  parts.push(box(0.2, 0.03, 0.2, x, 0.015, 1.44, C.graphite, { mat: 'metal' }))
}
parts.push(box(2.15, 0.08, 0.08, 0, 2.62, 1.44, C.blackMetal, { mat: 'metal' }))
for (const z of [-1.62, -0.62]) {
  const brace = box(2.1, 0.05, 0.05, 0, 0.64, z, C.graphite, { mat: 'metal', rot: [0, 0, 0.42] })
  parts.push(brace)
}

// 平台护栏：5 根立柱 + 三面扶手
for (const [x, z] of [[-1.08, -1.68], [0, -1.68], [1.08, -1.68], [-1.08, -1.1], [1.08, -1.1]] as [number, number][]) {
  parts.push(box(0.05, 1.1, 0.05, x, LAND_TOP + 0.55, z, C.blackMetal, { mat: 'metal' }))
}
parts.push(box(2.22, 0.06, 0.06, 0, LAND_TOP + 1.1, -1.68, C.blackMetal, { mat: 'metal' }))
for (const side of [-1, 1]) {
  parts.push(box(0.06, 0.06, ZL0 - ZL1 - 0.02, side * 1.08, LAND_TOP + 1.1, (ZL0 + ZL1) / 2, C.blackMetal, { mat: 'metal' }))
}

// 两跑扶手：每侧 3 根立柱，柱顶落在倾斜中线上；转折处设大立柱
for (const x of [-0.96, -0.08]) {
  for (const i of [0, 4, 7]) {
    parts.push(cyl(0.018, 0.018, 0.815, x, stepTop(i) + 0.4075, lowZ(i), C.blackMetal, { mat: 'metal' }, 8))
  }
}
for (const x of [0.08, 0.96]) {
  for (const i of [0, 4, 7]) {
    parts.push(cyl(0.018, 0.018, 0.815, x, LAND_TOP + stepTop(i) + 0.4075, upZ(i), C.blackMetal, { mat: 'metal' }, 8))
  }
}
const lowRailLen = (Z0 - ZL0) * Math.hypot(1, RISE / TREAD)
for (const x of [-0.96, -0.08]) {
  parts.push(box(0.055, 0.055, lowRailLen, x, (lowRail(Z0) + lowRail(ZL0)) / 2, (Z0 + ZL0) / 2, C.blackMetal, { mat: 'metal', rot: [ANG, 0, 0] }))
}
const upRailLen = (Z0 - ZL0) * Math.hypot(1, RISE / TREAD)
for (const x of [0.08, 0.96]) {
  parts.push(box(0.055, 0.055, upRailLen, x, (upRail(ZL0) + upRail(Z0)) / 2, (ZL0 + Z0) / 2, C.blackMetal, { mat: 'metal', rot: [-ANG, 0, 0] }))
}

// 起步 / 平台转折 / 顶部大立柱
const newels: [number, number, number][] = [
  [-0.96, 0, Z0], [-0.08, 0, Z0], [0.08, TOP, Z0], [0.96, TOP, Z0],
  [-0.96, LAND_TOP, ZL0], [-0.08, LAND_TOP, ZL0], [0.08, LAND_TOP, ZL0], [0.96, LAND_TOP, ZL0],
]
for (const [x, base, z] of newels) {
  parts.push(cyl(0.025, 0.028, 0.9, x, base + 0.45, z, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(sphere(0.03, x, base + 0.92, z, C.brass, { mat: 'metal' }, 10))
}

// 顶部护栏：立在上跑末级踏面上，高 1.1
for (const x of [0.08, 0.52, 0.96]) {
  parts.push(box(0.05, 1.1, 0.05, x, TOP + 0.55, 1.7, C.blackMetal, { mat: 'metal' }))
}
parts.push(box(0.96, 0.06, 0.06, 0.52, TOP + 1.08, 1.7, C.blackMetal, { mat: 'metal' }))
parts.push(box(0.96, 0.045, 0.045, 0.52, TOP + 0.56, 1.7, C.blackMetal, { mat: 'metal' }))

export default defineModel({
  id: 'fire-escape',
  name: '消防疏散钢梯',
  category: 'structure',
  tags: ['fire escape', 'stairs', 'steel', '消防梯', '疏散楼梯', '钢梯'],
  footprint: [2.2, 3.6],
  height: 3.83,
  placement: 'outdoor',
  parts,
})
