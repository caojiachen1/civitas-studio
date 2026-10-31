import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * U 形双跑楼梯。两跑各 9 级，踢面 0.16 / 踏面 0.30；半层平台 2.4 x 1.2，
 * 顶面 1.44，二层 2.88。中间梯井 0.15。所有栏杆柱脚落在踏面中心，
 * 柱高 0.82 = 0.90 - RISE/2，扶手中线从起步前缘的 0.90 起坡，正好穿过全部柱顶。
 * 梯梁用 Math.hypot 反算斜长，梁顶低于踏步前缘 1cm，下端切至地面。
 */
const RISE = 0.16
const TREAD = 0.3
const STEPS = 9
const FLIGHT_W = 1.1
const WELL = 0.15
const CX = (FLIGHT_W + WELL) / 2 // 0.625
const Z0 = 1.95 // 起步前缘
const LAND_TOP = RISE * STEPS // 1.44
const TOP = LAND_TOP * 2 // 2.88
const ZL0 = Z0 - TREAD * STEPS // -0.75，平台前缘
const ZL1 = ZL0 - 1.2 // -1.95，平台后缘
const ANG = Math.atan(RISE / TREAD)
const STR_H = 0.22
const STR_W = 0.07
const DROP = 0.01 + STR_H / 2 / Math.cos(ANG)
const PH = 0.9 - RISE / 2 // 0.82，柱顶落在扶手中线上

const lowerTop = (i: number) => RISE * (i + 1)
const lowerZ = (i: number) => Z0 - TREAD * (i + 0.5)
const lowerFront = (i: number) => Z0 - TREAD * i
const upperTop = (i: number) => LAND_TOP + RISE * (i + 1)
const upperZ = (i: number) => ZL0 + TREAD * (i + 0.5)
const upperFront = (i: number) => ZL0 + TREAD * i
const lowerNose = (z: number) => RISE + (Z0 - z) * (RISE / TREAD)
const upperNose = (z: number) => LAND_TOP + RISE + (z - ZL0) * (RISE / TREAD)
const lowerRail = (z: number) => 0.9 + (Z0 - z) * (RISE / TREAD)
const upperRail = (z: number) => LAND_TOP + 0.9 + (z - ZL0) * (RISE / TREAD)

const parts: Part[] = []

// 两跑：踏板 / 踢面 / 黄铜防滑条
for (let i = 0; i < STEPS; i++) {
  const top = lowerTop(i)
  const z = lowerZ(i)
  const front = lowerFront(i)
  parts.push(box(FLIGHT_W, 0.06, TREAD, -CX, top - 0.03, z, C.oak, { mat: 'wood' }))
  parts.push(box(FLIGHT_W - 0.06, RISE - 0.02, 0.035, -CX, top - RISE / 2, front - 0.0175, C.cream))
  parts.push(box(FLIGHT_W - 0.08, 0.008, 0.02, -CX, top + 0.004, front - 0.014, C.brass, { mat: 'metal' }))

  const utop = upperTop(i)
  const uz = upperZ(i)
  const ufront = upperFront(i)
  parts.push(box(FLIGHT_W, 0.06, TREAD, CX, utop - 0.03, uz, C.oak, { mat: 'wood' }))
  parts.push(box(FLIGHT_W - 0.06, RISE - 0.02, 0.035, CX, utop - RISE / 2, ufront + 0.0175, C.cream))
  parts.push(box(FLIGHT_W - 0.08, 0.008, 0.02, CX, utop + 0.004, ufront + 0.014, C.brass, { mat: 'metal' }))
}

// 半层平台 + 铜条 + 平台梁 + 支柱
parts.push(box(2.4, 0.16, 1.2, 0, LAND_TOP - 0.08, (ZL0 + ZL1) / 2, C.concrete, { mat: 'stone' }))
parts.push(box(2.28, 0.008, 0.025, 0, LAND_TOP + 0.004, ZL0 - 0.012, C.brass, { mat: 'metal' }))
for (const z of [-0.95, -1.75]) {
  parts.push(box(2.4, 0.16, 0.12, 0, 1.2, z, C.walnut, { mat: 'wood' }))
}
for (const x of [-0.95, 0.95]) {
  parts.push(box(0.12, 1.12, 0.12, x, 0.56, -1.75, C.walnut, { mat: 'wood' }))
  parts.push(box(0.28, 0.03, 0.28, x, 0.015, -1.75, C.graphite, { mat: 'metal' }))
}

// 梯梁：梁顶贴着踏步前缘线，斜长用 hypot 反算
const lowerLen = (1.75 + 0.45) * Math.hypot(1, RISE / TREAD)
parts.push(box(STR_W, STR_H, lowerLen, -1.21, lowerNose(0.65) - DROP, 0.65, C.walnut, { mat: 'wood', rot: [ANG, 0, 0] }))
parts.push(box(STR_W, STR_H, lowerLen, -0.11, lowerNose(0.65) - DROP, 0.65, C.walnut, { mat: 'wood', rot: [ANG, 0, 0] }))
const upperLen = 2.4 * Math.hypot(1, RISE / TREAD)
parts.push(box(STR_W, STR_H, upperLen, 1.21, upperNose(0.45) - DROP, 0.45, C.walnut, { mat: 'wood', rot: [-ANG, 0, 0] }))
parts.push(box(STR_W, STR_H, upperLen, 0.11, upperNose(0.45) - DROP, 0.45, C.walnut, { mat: 'wood', rot: [-ANG, 0, 0] }))

// 栏杆立柱：每级踏面两侧各一根
for (const x of [-1.14, -0.1]) {
  for (let i = 0; i < STEPS; i++) {
    const y = lowerTop(i)
    parts.push(cyl(0.018, 0.018, PH, x, y + PH / 2, lowerZ(i), C.blackMetal, { mat: 'metal' }, 8))
  }
}
for (const x of [0.1, 1.14]) {
  for (let i = 0; i < STEPS; i++) {
    const y = upperTop(i)
    parts.push(cyl(0.018, 0.018, PH, x, y + PH / 2, upperZ(i), C.blackMetal, { mat: 'metal' }, 8))
  }
}

// 倾斜扶手：中心线严格穿过柱顶
const lowerRailLen = Math.hypot(Z0 - lowerZ(8), lowerRail(lowerZ(8)) - lowerRail(Z0))
for (const x of [-1.14, -0.1]) {
  parts.push(box(0.06, 0.06, lowerRailLen, x, (lowerRail(Z0) + lowerRail(lowerZ(8))) / 2, (Z0 + lowerZ(8)) / 2, C.walnut, {
    mat: 'wood',
    rot: [ANG, 0, 0],
  }))
}
const upperRailEnd = 1.9
const upperRailLen = Math.hypot(upperRailEnd - ZL0, upperRail(upperRailEnd) - upperRail(ZL0))
for (const x of [0.1, 1.14]) {
  parts.push(box(0.06, 0.06, upperRailLen, x, (upperRail(ZL0) + upperRail(upperRailEnd)) / 2, (ZL0 + upperRailEnd) / 2, C.walnut, {
    mat: 'wood',
    rot: [-ANG, 0, 0],
  }))
}

// 起步 / 平台转折 / 顶部大立柱，柱底均落在踏面或地面
const newels: [number, number, number][] = [
  [-1.14, 0, Z0], [-0.1, 0, Z0],
  [-1.14, LAND_TOP, lowerZ(8)], [-0.1, LAND_TOP, lowerZ(8)],
  [0.1, LAND_TOP, ZL0], [1.14, LAND_TOP, ZL0],
  [0.1, TOP, 1.9], [1.14, TOP, 1.9],
]
for (const [x, base, z] of newels) {
  parts.push(cyl(0.025, 0.028, 0.9, x, base + 0.45, z, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(cyl(0.055, 0.06, 0.025, x, base + 0.0125, z, C.graphite, { mat: 'metal' }, 14))
  parts.push(sphere(0.032, x, base + 0.93, z, C.brass, { mat: 'metal' }, 12))
}

// 平台三面水平扶手 + 立柱
for (const x of [-1.16, 1.16]) {
  parts.push(box(0.06, 0.06, ZL0 - ZL1 - 0.03, x, LAND_TOP + 0.9, (ZL0 + ZL1) / 2, C.walnut, { mat: 'wood' }))
  for (const z of [-1.36, -1.84]) {
    parts.push(cyl(0.018, 0.018, 0.9, x, LAND_TOP + 0.45, z, C.blackMetal, { mat: 'metal' }, 8))
  }
}
parts.push(box(2.28, 0.06, 0.06, 0, LAND_TOP + 0.9, ZL1 + 0.03, C.walnut, { mat: 'wood' }))
parts.push(cyl(0.018, 0.018, 0.9, 0, LAND_TOP + 0.45, ZL1 + 0.03, C.blackMetal, { mat: 'metal' }, 8))
// 下层外侧扶手与平台扶手之间的 8cm 高差接头
const JOG_LEN = Math.hypot(0.15, 0.08)
parts.push(box(0.06, 0.06, JOG_LEN, -1.15, 2.3, -0.675, C.walnut, { mat: 'wood', rot: [Math.atan2(0.08, 0.15), 0, 0] }))

export default defineModel({
  id: 'stair-u',
  name: 'U 形双跑楼梯',
  category: 'structure',
  tags: ['stairs', 'u-shaped', 'switchback', '楼梯', '双跑', '平台'],
  footprint: [2.6, 4.0],
  height: 3.85,
  placement: 'indoor',
  parts,
})
