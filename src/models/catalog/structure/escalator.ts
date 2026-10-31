import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part, Vec2 } from '../../../editor/types'

/*
 * 自动扶梯：30° 倾角，提升 4.0m，水平投影 6.93m，上下端各 0.34m 盖板，总深 7.6m。
 * 20 级梯级，水平节距 0.4·cos30°，每级含踏板、踢板与铜防滑条；梯级按斜面依次抬升。
 * 两侧斜桁架、上下端支撑柱、玻璃栏板（平行四边形 prism，垂直面）+ 黑色扶手带。
 * 扶手带顶 4.63m。
 */
const ANG = Math.PI / 6
const RISE = 4
const STEPS = 20
const PITCH = 0.4 * Math.cos(ANG)
const Z_LOW = 3.46
const STEP_RISE = RISE / STEPS
const LINE = (z: number) => (Z_LOW - z) * Math.tan(ANG)
const parts: Part[] = []

// 梯级：踏板 + 踢板 + 防滑条
for (let i = 0; i < STEPS; i++) {
  const front = Z_LOW - i * PITCH
  const top = STEP_RISE * (i + 1)
  const z = front - PITCH / 2
  parts.push(box(1.0, 0.05, PITCH, 0, top - 0.025, z, C.steel, { mat: 'metal' }))
  parts.push(box(1.0, STEP_RISE, 0.025, 0, top - STEP_RISE / 2, front - 0.0125, C.graphite, { mat: 'metal' }))
  parts.push(box(0.96, 0.008, 0.03, 0, top + 0.004, front - 0.016, C.brass, { mat: 'metal' }))
}

// 梯级带底衬（沿斜面旋转的钢板）
parts.push(box(0.98, 0.06, 6.0, 0, 1.92, 0, C.graphite, { mat: 'metal', rot: [ANG, 0, 0] }))

// 下端起步段三角裙板，填实第一批梯级下方的空隙
const footPts: Vec2[] = [
  [-Z_LOW, 0],
  [-(Z_LOW - 0.56), 0],
  [-(Z_LOW - 0.56), 0.56 * Math.tan(ANG)],
]
for (const side of [-1, 1]) {
  parts.push(prism(footPts, 0.02, side * 0.58, 0, 0, C.graphite, { mat: 'metal', rot: [0, Math.PI / 2, 0] }))
}

// 两侧斜桁架
const TRUSS_Z0 = 2.9
const TRUSS_Z1 = -2.9
const TRUSS_LEN = (TRUSS_Z0 - TRUSS_Z1) / Math.cos(ANG)
for (const side of [-1, 1]) {
  parts.push(box(0.1, 0.16, TRUSS_LEN, side * 0.55, 1.848, (TRUSS_Z0 + TRUSS_Z1) / 2, C.blackMetal, {
    mat: 'metal',
    rot: [ANG, 0, 0],
  }))
}

// 桁架下弦横向支撑与落地柱
for (const z of [2.6, -2.6]) {
  const top = 1.848 + (0 - z) * Math.tan(ANG) - 0.092
  for (const x of [-0.5, 0.5]) {
    parts.push(box(0.08, top, 0.08, x, top / 2, z, C.blackMetal, { mat: 'metal' }))
    parts.push(box(0.18, 0.025, 0.18, x, 0.0125, z, C.graphite, { mat: 'metal' }))
  }
  parts.push(box(1.08, 0.07, 0.07, 0, top - 0.035, z, C.blackMetal, { mat: 'metal' }))
}

// 上端平台支撑柱
for (const x of [-0.5, 0.5]) {
  parts.push(box(0.08, 3.88, 0.08, x, 1.94, -3.56, C.blackMetal, { mat: 'metal' }))
  parts.push(box(0.18, 0.025, 0.18, x, 0.0125, -3.56, C.graphite, { mat: 'metal' }))
}

// 玻璃栏板：剖面为平行四边形，垂直面，底边贴着梯级线，顶边高 0.55
const glassPts: Vec2[] = [
  [-Z_LOW, 0],
  [Z_LOW, RISE],
  [Z_LOW, RISE + 0.55],
  [-Z_LOW, 0.55],
]
for (const side of [-1, 1]) {
  parts.push(prism(glassPts, 0.025, side * 0.55, 0, 0, C.glass, { mat: 'glass', side: 'double', rot: [0, Math.PI / 2, 0] }))
  parts.push(box(0.12, 0.08, 8.0, side * 0.55, 2.585, 0, C.blackMetal, { mat: 'metal', rot: [ANG, 0, 0] }))
  parts.push(box(0.03, 0.18, 6.6, side * 0.57, 1.885, 0, C.graphite, { mat: 'metal', rot: [ANG, 0, 0] }))
  for (const z of [2.4, 0.8, -0.8, -2.4]) {
    parts.push(box(0.05, 0.6, 0.05, side * 0.55, LINE(z) + 0.3, z, C.graphite, { mat: 'metal' }))
  }
}

// 上下端盖板 / 梳齿板 / 封头
parts.push(box(1.2, 0.06, 0.34, 0, 0.03, 3.63, C.graphite, { mat: 'metal' }))
parts.push(box(1.2, 0.12, 0.34, 0, 3.94, -3.63, C.graphite, { mat: 'metal' }))
parts.push(box(1.0, 0.03, 0.12, 0, 0.06, Z_LOW + 0.02, C.brass, { mat: 'metal' }))
parts.push(box(1.0, 0.03, 0.12, 0, RISE - 0.04, -Z_LOW - 0.02, C.brass, { mat: 'metal' }))
for (const side of [-1, 1]) {
  parts.push(cyl(0.04, 0.04, 0.08, side * 0.55, 0.585, Z_LOW + 0.04, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12))
  parts.push(cyl(0.04, 0.04, 0.08, side * 0.55, 4.585, -Z_LOW - 0.04, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12))
}

export default defineModel({
  id: 'escalator',
  name: '自动扶梯',
  category: 'structure',
  tags: ['escalator', 'vertical transport', '自动扶梯', '电梯', '扶梯'],
  footprint: [1.2, 7.6],
  height: 4.63,
  placement: 'indoor',
  parts,
})
