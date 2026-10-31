import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 270° 环形匝道：外缘 R14、内缘 R7，单车道宽 7m，桥面顶 1.2m。
 * 缺口朝东北（0°–90°），弧从 90° 扫到 360°；27 段 box 每 10° 一段，
 * 段长取 R10.5 处弦长 + 0.12 搭接。外侧波形梁护栏立柱每 2 段一根，
 * 内侧低路缘；4 个矮墩（承台 + 双柱 + 盖梁）从地面托住桥面。
 */
const R_OUT = 14
const R_IN = 7
const R_MID = (R_IN + R_OUT) / 2 // 10.5
const PHI0 = Math.PI / 2
const SWEEP = (Math.PI * 3) / 2
const N = 27
const STEP = SWEEP / N
const SEG_D = 2 * R_MID * Math.sin(STEP / 2) + 0.12
const DECK_TOP = 1.2
const ASPHALT = '#3a3d40'
const LINE = '#e8e6df'

const at = (phi: number, xl: number): [number, number] => [
  (R_MID + xl) * Math.cos(phi),
  (R_MID + xl) * Math.sin(phi),
]
const rotY = (phi: number): [number, number, number] => [0, -phi, 0]

const parts: Part[] = []

// 桥面板 / 沥青 / 内侧低路缘
for (let i = 0; i < N; i++) {
  const phi = PHI0 + (i + 0.5) * STEP
  const [x, z] = at(phi, 0)
  parts.push(box(7, 0.28, SEG_D, x, 1.0, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  parts.push(box(6.4, 0.06, SEG_D, x, 1.17, z, ASPHALT, { rot: rotY(phi) }))
  const [cx, cz] = at(phi, -3.35)
  parts.push(box(0.3, 0.22, SEG_D, cx, DECK_TOP - 0.06 + 0.11, cz, C.cream, { mat: 'stone', rot: rotY(phi) }))
}

// 外侧波形梁：每段一根横梁，立柱每 2 段一根
for (let i = 0; i < N; i++) {
  const phi = PHI0 + (i + 0.5) * STEP
  const [rx, rz] = at(phi, 3.33)
  parts.push(box(0.07, 0.3, SEG_D, rx, 1.83, rz, C.steel, { mat: 'metal', rot: rotY(phi) }))
  if (i % 2 === 0) {
    const [px, pz] = at(phi, 3.42)
    parts.push(box(0.1, 1.06, 0.12, px, 1.67, pz, C.blackMetal, { mat: 'metal', rot: rotY(phi) }))
  }
}

// 车道虚线
for (let i = 0; i < 10; i++) {
  const phi = PHI0 + (i + 0.5) * (SWEEP / 10)
  const [x, z] = at(phi, 0)
  parts.push(box(0.14, 0.01, 1.4, x, DECK_TOP + 0.005, z, LINE, { rot: rotY(phi) }))
}

// 4 个矮墩：承台 + 双柱 + 盖梁
for (const deg of [140, 195, 250, 305]) {
  const phi = (deg * Math.PI) / 180
  const [x, z] = at(phi, 0)
  parts.push(box(4.4, 0.2, 1.2, x, 0.1, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  parts.push(box(5.4, 0.3, 0.9, x, 0.71, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  for (const s of [-1, 1]) {
    const [px, pz] = at(phi, s * 1.8)
    parts.push(cyl(0.5, 0.5, 0.36, px, 0.38, pz, C.concrete, { mat: 'stone' }, 16))
  }
}

// 两端封头 + 排水口
for (const phi of [PHI0, PHI0 + SWEEP]) {
  const [x, z] = at(phi, 0)
  parts.push(box(7, 0.34, 0.16, x, 1.03, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
}
for (const deg of [120, 200, 280, 340]) {
  const phi = (deg * Math.PI) / 180
  const [x, z] = at(phi, 3.05)
  parts.push(box(0.28, 0.014, 0.45, x, DECK_TOP + 0.007, z, C.graphite, { mat: 'metal', rot: rotY(phi) }))
}

export default defineModel({
  id: 'cloverleaf-loop',
  name: '苜蓿叶环形匝道',
  category: 'infrastructure',
  tags: ['cloverleaf', 'loop', 'ramp', '苜蓿叶', '环岛', '匝道'],
  footprint: [28.1, 28.1],
  height: 2.2,
  placement: 'outdoor',
  parts,
})
