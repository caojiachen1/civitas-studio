import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * L 形转角楼梯：
 *  - 下层 8 级：x ∈ [-1.10, 0.00]，z 从 -1.5 到 0.1，tread 0.2，rise 0.2，末级顶面 1.6；
 *  - 转角平台：x ∈ [-1.20, 0.10]，z ∈ [0.10, 1.10]，顶面 1.6，板厚 0.16；
 *  - 上层 8 级：z ∈ [0.10, 1.10]，x 从 -0.55 到 1.05，首级顶面 1.8，末级 3.2。
 * 栏杆坐标全部由踏步边缘反算：下层立柱 x = -1.08 / -0.02（距踏步边缘 2cm），
 * 上层立柱 z = 0.12 / 1.08（距踏步边缘 2cm），柱底在踏面中心，柱高 0.80。
 * 扶手斜率与踏步前缘一致（1.6 / 1.6 = 1），柱顶恰好落在扶手中心线上。
 */
const RISE = 0.2
const TREAD = 0.2
const FLIGHT = 8
const LAND_TOP = 1.6
const LAND_T = 0.16

// 下层
const LOW_X = -0.55
const LOW_W = 1.1
const LOW_Z0 = -1.5
const LOW_Z1 = 0.1
const LOW_POST_X = [LOW_X - LOW_W / 2 + 0.02, LOW_X + LOW_W / 2 - 0.02] // -1.08 / -0.02
const LOW_RAIL_END = [LOW_Z1, LOW_Z1 - 0.03] // 东侧让开上层踏步 3cm
const lowStepTop = (i: number) => RISE * (i + 1)
const lowStepZ = (i: number) => LOW_Z0 + TREAD * (i + 0.5)
const lowRailY = (z: number) => 0.9 + (z - LOW_Z0) // 斜率 1，z = -1.5 处 0.9
const lowNoseY = (z: number) => RISE + (z - LOW_Z0)

// 上层
const UP_Z0 = 0.1
const UP_Z1 = 1.1
const UP_ZC = (UP_Z0 + UP_Z1) / 2 // 0.6
const UP_X0 = -0.55
const UP_X1 = 1.05
const UP_POST_Z = [UP_Z0 + 0.02, UP_Z1 - 0.02] // 0.12 / 1.08
const upStepTop = (i: number) => LAND_TOP + RISE * (i + 1) // 1.8 ... 3.2
const upStepX = (i: number) => UP_X0 + TREAD * (i + 0.5)
const upRailY = (x: number) => 2.5 + (x - UP_X0) // 斜率 1，x = -0.55 处 2.5
const upNoseY = (x: number) => 1.8 + (x - UP_X0)

// 平台栏杆
const LAND_Z0 = 0.1
const LAND_RAIL_X = -1.16 // 距平台西边缘 4cm
const LAND_RAIL_Z = UP_Z1 - 0.02 // 1.08，距平台北边缘 2cm
const LAND_RAIL_Y = LAND_TOP + 0.9 // 2.5

const parts: Part[] = []

// 下层踏板 / 踢面 / 黄铜防滑条
for (let i = 0; i < FLIGHT; i++) {
  const top = lowStepTop(i)
  const z = lowStepZ(i)
  const front = LOW_Z0 + TREAD * i
  parts.push(box(LOW_W, 0.06, TREAD, LOW_X, top - 0.03, z, C.oak, { mat: 'wood' }))
  parts.push(box(LOW_W - 0.1, RISE - 0.02, 0.035, LOW_X, top - RISE / 2, front + 0.0175, C.cream))
  parts.push(box(LOW_W - 0.08, 0.008, 0.02, LOW_X, top + 0.004, front + 0.014, C.brass, { mat: 'metal' }))
}

// 转角平台
const LAND_CX = (-1.2 + 0.1) / 2 // -0.55
const LAND_CZ = (UP_Z0 + UP_Z1) / 2 // 0.6
parts.push(box(1.3, LAND_T, 1.0, LAND_CX, LAND_TOP - LAND_T / 2, LAND_CZ, C.concrete, { mat: 'stone' }))
parts.push(box(0.05, 0.01, 0.96, -1.19, LAND_TOP + 0.005, LAND_CZ, C.brass, { mat: 'metal' }))
parts.push(box(1.26, 0.01, 0.05, LAND_CX, LAND_TOP + 0.005, 1.09, C.brass, { mat: 'metal' }))

// 平台支撑柱
for (const x of [-1.08, -0.02]) {
  parts.push(box(0.09, LAND_TOP - LAND_T, 0.09, x, (LAND_TOP - LAND_T) / 2, 0.95, C.walnut, { mat: 'wood' }))
  parts.push(box(0.18, 0.03, 0.18, x, 0.015, 0.95, C.graphite, { mat: 'metal' }))
}

// 下层梯梁（贴着踏步外缘，顶边压在前缘线上；下端切至地面）
const LOW_STR_Z0 = -1.379
const LOW_STR_Z1 = -0.09
const LOW_STR_CZ = (LOW_STR_Z0 + LOW_STR_Z1) / 2
const LOW_STR_LEN = (LOW_STR_Z1 - LOW_STR_Z0) * Math.SQRT2
const STR_DROP = 0.01 + 0.11 / Math.cos(Math.PI / 4) // 中心线相对前缘线的下沉量
for (const x of [-1.135, 0.035]) {
  parts.push(
    box(0.07, 0.22, LOW_STR_LEN, x, lowNoseY(LOW_STR_CZ) - STR_DROP, LOW_STR_CZ, C.walnut, {
      mat: 'wood',
      rot: [-Math.PI / 4, 0, 0],
    }),
  )
}

// 上层踏板 / 踢面 / 黄铜防滑条
for (let i = 0; i < FLIGHT; i++) {
  const top = upStepTop(i)
  const x = upStepX(i)
  const front = UP_X0 + TREAD * i
  parts.push(box(TREAD, 0.06, 1.0, x, top - 0.03, UP_ZC, C.oak, { mat: 'wood' }))
  parts.push(box(0.035, RISE - 0.02, 0.95, front + 0.0175, top - RISE / 2, UP_ZC, C.cream))
  parts.push(box(0.02, 0.008, 0.92, front + 0.014, top + 0.004, UP_ZC, C.brass, { mat: 'metal' }))
}

// 上层梯梁
const UP_STR_X0 = -0.55
const UP_STR_X1 = 0.86
const UP_STR_CX = (UP_STR_X0 + UP_STR_X1) / 2
const UP_STR_LEN = (UP_STR_X1 - UP_STR_X0) * Math.SQRT2
for (const z of [0.065, 1.135]) {
  parts.push(
    box(UP_STR_LEN, 0.22, 0.07, UP_STR_CX, upNoseY(UP_STR_CX) - STR_DROP, z, C.walnut, {
      mat: 'wood',
      rot: [0, 0, Math.PI / 4],
    }),
  )
}

// 下层栏杆立柱（每级一根，柱底落在踏面中心，柱高 0.80）
for (const x of LOW_POST_X) {
  for (let i = 0; i < FLIGHT; i++) {
    const bottom = lowStepTop(i)
    parts.push(cyl(0.018, 0.018, 0.8, x, bottom + 0.4, lowStepZ(i), C.blackMetal, { mat: 'metal' }, 8))
    parts.push(cyl(0.03, 0.033, 0.02, x, bottom + 0.01, lowStepZ(i), C.brass, { mat: 'metal' }, 10))
  }
}

// 下层倾斜扶手：西侧接到平台接头，东侧在离上层踏步 3cm 处收头
LOW_POST_X.forEach((x, idx) => {
  const endZ = LOW_RAIL_END[idx]
  const len = (endZ - LOW_Z0) * Math.SQRT2
  const cz = (LOW_Z0 + endZ) / 2
  parts.push(box(0.07, 0.06, len, x, lowRailY(cz), cz, C.walnut, { mat: 'wood', rot: [-Math.PI / 4, 0, 0] }))
})

// 下层起步大立柱（Ø0.05，黄铜球头）
for (const x of LOW_POST_X) {
  parts.push(cyl(0.025, 0.028, 0.9, x, 0.45, LOW_Z0, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(cyl(0.055, 0.06, 0.025, x, 0.0125, LOW_Z0, C.graphite, { mat: 'metal' }, 14))
  parts.push(sphere(0.032, x, 0.93, LOW_Z0, C.brass, { mat: 'metal' }, 12))
}

// 东侧扶手收头立柱（柱底落在最后一级踏面靠北 3cm 处，柱顶接扶手）
{
  const x = LOW_POST_X[1]
  const endZ = LOW_RAIL_END[1]
  const top = lowRailY(endZ)
  parts.push(cyl(0.018, 0.018, top - LAND_TOP, x, (top + LAND_TOP) / 2, endZ, C.blackMetal, { mat: 'metal' }, 8))
  parts.push(sphere(0.026, x, top + 0.02, endZ, C.brass, { mat: 'metal' }, 10))
}

// 平台西侧水平扶手（与下层西扶手在 z = 0.1 处同高相接）
const LAND_WEST_LEN = LAND_RAIL_Z - LAND_Z0 // 0.98
parts.push(box(0.07, 0.06, LAND_WEST_LEN, LAND_RAIL_X, LAND_RAIL_Y, (LAND_Z0 + LAND_RAIL_Z) / 2, C.walnut, { mat: 'wood' }))
// 转向接头：把下层扶手（x = -1.08）横接到平台扶手（x = -1.16）
const LAND_JOG = LAND_RAIL_X - LOW_POST_X[0] // -0.08
parts.push(box(Math.abs(LAND_JOG), 0.06, 0.07, (LAND_RAIL_X + LOW_POST_X[0]) / 2, LAND_RAIL_Y, LAND_Z0, C.walnut, { mat: 'wood' }))
// 平台北侧水平扶手（东端与上层扶手起点同高相接）
const LAND_NORTH_LEN = 1.16 + UP_X0 // 0.61
parts.push(box(LAND_NORTH_LEN, 0.06, 0.07, (-1.16 + UP_X0) / 2, LAND_RAIL_Y, LAND_RAIL_Z, C.walnut, { mat: 'wood' }))

// 平台栏杆立柱：西侧每 ~0.25m 一根，北侧补齐
const LAND_POST_Z = [LAND_Z0, 0.35, 0.6, 0.85, LAND_RAIL_Z]
for (const z of LAND_POST_Z) {
  parts.push(cyl(0.018, 0.018, 0.9, LAND_RAIL_X, LAND_TOP + 0.45, z, C.blackMetal, { mat: 'metal' }, 8))
  parts.push(cyl(0.03, 0.033, 0.02, LAND_RAIL_X, LAND_TOP + 0.01, z, C.brass, { mat: 'metal' }, 10))
}
for (const x of [-0.855]) {
  parts.push(cyl(0.018, 0.018, 0.9, x, LAND_TOP + 0.45, LAND_RAIL_Z, C.blackMetal, { mat: 'metal' }, 8))
  parts.push(cyl(0.03, 0.033, 0.02, x, LAND_TOP + 0.01, LAND_RAIL_Z, C.brass, { mat: 'metal' }, 10))
}

// 上层栏杆立柱（每级一根，柱底落在踏面中心，柱高 0.80）
for (const z of UP_POST_Z) {
  for (let i = 0; i < FLIGHT; i++) {
    const bottom = upStepTop(i)
    parts.push(cyl(0.018, 0.018, 0.8, upStepX(i), bottom + 0.4, z, C.blackMetal, { mat: 'metal' }, 8))
    parts.push(cyl(0.03, 0.033, 0.02, upStepX(i), bottom + 0.01, z, C.brass, { mat: 'metal' }, 10))
  }
}

// 上层倾斜扶手：x = -0.55 (y=2.5) → x = 1.05 (y=4.1)
const UP_RAIL_LEN = (UP_X1 - UP_X0) * Math.SQRT2
for (const z of UP_POST_Z) {
  parts.push(box(UP_RAIL_LEN, 0.06, 0.07, (UP_X0 + UP_X1) / 2, upRailY((UP_X0 + UP_X1) / 2), z, C.walnut, {
    mat: 'wood',
    rot: [0, 0, Math.PI / 4],
  }))
}

// 上层起点 / 终点大立柱（Ø0.05，黄铜球头）
for (const z of UP_POST_Z) {
  parts.push(cyl(0.025, 0.028, 0.9, -0.57, LAND_TOP + 0.45, z, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(sphere(0.032, -0.57, LAND_TOP + 0.93, z, C.brass, { mat: 'metal' }, 12))
  parts.push(cyl(0.025, 0.028, 0.9, 1.03, 3.2 + 0.45, z, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(sphere(0.032, 1.03, 3.2 + 0.93, z, C.brass, { mat: 'metal' }, 12))
}

export default defineModel({
  id: 'stair-l',
  name: 'L 形转角楼梯',
  category: 'structure',
  tags: ['stairs', 'corner stair', 'l-shaped', 'handrail', '楼梯', '转角楼梯'],
  footprint: [2.45, 3.2],
  height: 4.2,
  placement: 'indoor',
  parts,
})
