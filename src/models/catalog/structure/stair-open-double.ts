import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 双分式（剪刀式对称）楼梯：中央一跑 8 级到 1.28m 半层平台，
 * 平台后左右各一跑 6 级到 2.24m。中央梯段宽 1.2，两侧梯段宽 1.1，
 * 平台宽 4.2。中间由中央梯段的两道扶手与两侧内扶手形成分隔。
 * 柱高 0.82 = 0.90 - RISE/2，扶手中线从起步前缘 0.90 起坡，精确穿过柱顶。
 */
const RISE = 0.16
const TREAD = 0.28
const LOW = 8
const UPP = 6
const LAND_TOP = RISE * LOW // 1.28
const Z0 = 1.67
const ZL0 = Z0 - LOW * TREAD // -0.57
const ZL1 = ZL0 - 1.1 // -1.67
const ANG = Math.atan(RISE / TREAD)
const PH = 0.9 - RISE / 2
const SIDE_X = 1.55
const parts: Part[] = []

const lowTop = (i: number) => RISE * (i + 1)
const lowZ = (i: number) => Z0 - TREAD * (i + 0.5)
const lowFront = (i: number) => Z0 - TREAD * i
const upTop = (i: number) => LAND_TOP + RISE * (i + 1)
const upZ = (i: number) => ZL0 + TREAD * (i + 0.5)
const upFront = (i: number) => ZL0 + TREAD * i
const lowNose = (z: number) => RISE + (Z0 - z) * (RISE / TREAD)
const upNose = (z: number) => LAND_TOP + RISE + (z - ZL0) * (RISE / TREAD)
const lowRail = (z: number) => 0.9 + (Z0 - z) * (RISE / TREAD)
const upRail = (z: number) => LAND_TOP + 0.9 + (z - ZL0) * (RISE / TREAD)

// 中央梯段
for (let i = 0; i < LOW; i++) {
  const top = lowTop(i)
  const z = lowZ(i)
  const front = lowFront(i)
  parts.push(box(1.2, 0.06, TREAD, 0, top - 0.03, z, C.oak, { mat: 'wood' }))
  parts.push(box(1.14, RISE - 0.02, 0.035, 0, top - RISE / 2, front - 0.0175, C.cream))
  parts.push(box(1.12, 0.008, 0.02, 0, top + 0.004, front - 0.014, C.brass, { mat: 'metal' }))
}

// 两侧上部梯段
for (const side of [-1, 1]) {
  const x = side * SIDE_X
  for (let i = 0; i < UPP; i++) {
    const top = upTop(i)
    const z = upZ(i)
    const front = upFront(i)
    parts.push(box(1.1, 0.06, TREAD, x, top - 0.03, z, C.oak, { mat: 'wood' }))
    parts.push(box(1.04, RISE - 0.02, 0.035, x, top - RISE / 2, front + 0.0175, C.cream))
    parts.push(box(1.02, 0.008, 0.02, x, top + 0.004, front + 0.014, C.brass, { mat: 'metal' }))
  }
}

// 半层平台、铜条、平台梁与支柱
parts.push(box(4.2, 0.16, 1.1, 0, LAND_TOP - 0.08, (ZL0 + ZL1) / 2, C.concrete, { mat: 'stone' }))
parts.push(box(4.08, 0.008, 0.025, 0, LAND_TOP + 0.004, ZL0 - 0.012, C.brass, { mat: 'metal' }))
parts.push(box(4.08, 0.008, 0.025, 0, LAND_TOP + 0.004, ZL1 + 0.012, C.brass, { mat: 'metal' }))
for (const z of [-0.82, -1.42]) {
  parts.push(box(4.2, 0.16, 0.12, 0, 1.12, z, C.walnut, { mat: 'wood' }))
}
for (const x of [-1.8, -0.6, 0.6, 1.8]) {
  parts.push(box(0.12, 1.04, 0.12, x, 0.52, -1.42, C.walnut, { mat: 'wood' }))
  parts.push(box(0.28, 0.03, 0.28, x, 0.015, -1.42, C.graphite, { mat: 'metal' }))
}

// 梯梁
const lowDrop = 0.01 + 0.09 / Math.cos(ANG)
const lowLen = 1.84 * Math.hypot(1, RISE / TREAD)
for (const x of [-0.635, 0.635]) {
  parts.push(box(0.07, 0.18, lowLen, x, lowNose(0.63) - lowDrop, 0.63, C.walnut, { mat: 'wood', rot: [ANG, 0, 0] }))
}
const upLen = 1.4 * Math.hypot(1, RISE / TREAD)
for (const side of [-1, 1]) {
  for (const x of [SIDE_X - 0.51, SIDE_X + 0.51]) {
    parts.push(box(0.07, 0.18, upLen, side * x, upNose(0.13) - lowDrop, 0.13, C.walnut, { mat: 'wood', rot: [-ANG, 0, 0] }))
  }
}

// 中央梯段扶手立柱
for (const x of [-0.56, 0.56]) {
  for (let i = 0; i < LOW; i++) {
    const y = lowTop(i)
    parts.push(cyl(0.018, 0.018, PH, x, y + PH / 2, lowZ(i), C.blackMetal, { mat: 'metal' }, 8))
  }
}
// 两侧上部扶手立柱（内、外各一道）
for (const side of [-1, 1]) {
  for (const dx of [-0.51, 0.51]) {
    const x = side * (SIDE_X + dx)
    for (let i = 0; i < UPP; i++) {
      const y = upTop(i)
      parts.push(cyl(0.018, 0.018, PH, x, y + PH / 2, upZ(i), C.blackMetal, { mat: 'metal' }, 8))
    }
  }
}

// 倾斜扶手，端部中心线穿过柱顶
const lowRailLen = Math.hypot(Z0 - lowZ(LOW - 1), lowRail(lowZ(LOW - 1)) - lowRail(Z0))
for (const x of [-0.56, 0.56]) {
  parts.push(box(0.06, 0.06, lowRailLen, x, (lowRail(Z0) + lowRail(lowZ(LOW - 1))) / 2, (Z0 + lowZ(LOW - 1)) / 2, C.walnut, {
    mat: 'wood',
    rot: [ANG, 0, 0],
  }))
}
const upRailLen = Math.hypot(upZ(UPP - 1) - ZL0, upRail(upZ(UPP - 1)) - upRail(ZL0))
for (const side of [-1, 1]) {
  for (const dx of [-0.51, 0.51]) {
    const x = side * (SIDE_X + dx)
    parts.push(box(0.06, 0.06, upRailLen, x, (upRail(ZL0) + upRail(upZ(UPP - 1))) / 2, (ZL0 + upZ(UPP - 1)) / 2, C.walnut, {
      mat: 'wood',
      rot: [-ANG, 0, 0],
    }))
  }
}

// 起步柱与平台角柱
for (const [x, base, z] of [
  [-0.56, 0, Z0], [0.56, 0, Z0],
  [-0.56, LAND_TOP, ZL0], [0.56, LAND_TOP, ZL0],
  [-2.06, LAND_TOP, ZL1 + 0.03], [2.06, LAND_TOP, ZL1 + 0.03],
] as [number, number, number][]) {
  parts.push(cyl(0.025, 0.028, 0.9, x, base + 0.45, z, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(cyl(0.055, 0.06, 0.025, x, base + 0.0125, z, C.graphite, { mat: 'metal' }, 14))
  parts.push(sphere(0.032, x, base + 0.93, z, C.brass, { mat: 'metal' }, 12))
}

// 平台三面水平扶手与立柱，上接两侧上行扶手
for (const side of [-1, 1]) {
  const x = side * 2.06
  parts.push(box(0.06, 0.06, ZL0 - ZL1 - 0.03, x, LAND_TOP + 0.9, (ZL0 + ZL1) / 2, C.walnut, { mat: 'wood' }))
  for (const z of [-0.92, -1.36]) {
    parts.push(cyl(0.018, 0.018, 0.9, x, LAND_TOP + 0.45, z, C.blackMetal, { mat: 'metal' }, 8))
  }
}
parts.push(box(4.08, 0.06, 0.06, 0, LAND_TOP + 0.9, ZL1 + 0.03, C.walnut, { mat: 'wood' }))
parts.push(cyl(0.018, 0.018, 0.9, 0, LAND_TOP + 0.45, ZL1 + 0.03, C.blackMetal, { mat: 'metal' }, 8))

export default defineModel({
  id: 'stair-open-double',
  name: '双分式楼梯',
  category: 'structure',
  tags: ['stairs', 'double stair', 'bifurcated', '双分', '剪刀楼梯', '对称楼梯'],
  footprint: [4.2, 3.4],
  height: 3.09,
  placement: 'indoor',
  parts,
})
