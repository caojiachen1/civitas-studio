import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 90° 高架弯道：内缘 R18、外缘 R27，桥宽 9m，桥面顶 7.2m。
 * 圆心放在 (-13.5, -13.5)，弧从 0° 扫到 90°，因此包围盒正好 27×27。
 * 14 段 box 沿切线角拼装，相邻段中心距取弦长并增加 0.30m 搭接，
 * 顶面按奇偶段错开 1mm，避免共面闪烁。2 个桥墩分别设在 30°/60°。
 */
const R_IN = 18
const R_OUT = 27
const R_MID = (R_IN + R_OUT) / 2 // 22.5
const CX = -13.32
const CZ = -13.32
const N = 14
const SWEEP = Math.PI / 2
const STEP = SWEEP / N
const SEG_D = 2 * R_MID * Math.sin(STEP / 2) + 0.3
const DECK_TOP = 7.2
const ASPHALT = '#3a3d40'
const LINE = '#e8e6df'

const at = (phi: number, xl: number): [number, number] => [
  CX + (R_MID + xl) * Math.cos(phi),
  CZ + (R_MID + xl) * Math.sin(phi),
]
const rotY = (phi: number): [number, number, number] => [0, -phi, 0]

const parts: Part[] = []

// 箱梁：底板、双腹板、桥面板、沥青；内外护栏与顶部钢扶手
for (let i = 0; i < N; i++) {
  const phi = (i + 0.5) * STEP
  const [x, z] = at(phi, 0)
  const dy = (i % 2) * 0.001
  parts.push(box(8.4, 0.32, SEG_D, x, 5.82, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  for (const s of [-1, 1]) {
    const [wx, wz] = at(phi, s * 4.05)
    parts.push(box(0.4, 0.84, SEG_D, wx, 6.4, wz, C.concrete, { mat: 'stone', rot: rotY(phi) }))
    const [px, pz] = at(phi, s * 4.33)
    parts.push(box(0.34, 1.18, SEG_D, px, DECK_TOP + 0.51 + dy, pz, C.concrete, { mat: 'stone', rot: rotY(phi) }))
    parts.push(box(0.06, 0.1, SEG_D, px, DECK_TOP + 1.15 + dy, pz, C.steel, { mat: 'metal', rot: rotY(phi) }))
  }
  parts.push(box(9, 0.3, SEG_D, x, 6.97 + dy, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  parts.push(box(8.3, 0.08, SEG_D, x, 7.16 + dy, z, ASPHALT, { rot: rotY(phi) }))
}

// 护栏立柱（15°/75°，内外各一）
for (const deg of [15, 75]) {
  const phi = (deg * Math.PI) / 180
  for (const s of [-1, 1]) {
    const [x, z] = at(phi, s * 4.44)
    parts.push(box(0.12, 1.1, 0.3, x, DECK_TOP + 0.55, z, C.cream, { mat: 'stone', rot: rotY(phi) }))
  }
}

// 车道虚线
for (let i = 0; i < 5; i++) {
  const phi = ((i + 0.5) * SWEEP) / 5
  const [x, z] = at(phi, 0)
  parts.push(box(0.15, 0.012, 2.4, x, DECK_TOP + 0.006, z, LINE, { rot: rotY(phi) }))
}

// 排水口
for (const deg of [25, 65]) {
  const phi = (deg * Math.PI) / 180
  for (const s of [-1, 1]) {
    const [x, z] = at(phi, s * 3.95)
    parts.push(box(0.3, 0.014, 0.5, x, DECK_TOP + 0.007, z, C.graphite, { mat: 'metal', rot: rotY(phi) }))
  }
}

// 两端伸缩缝
for (const phi of [0, Math.PI / 2]) {
  const [x, z] = at(phi, 0)
  parts.push(box(8.3, 0.02, 0.14, x, DECK_TOP + 0.01, z, ASPHALT, { rot: rotY(phi) }))
}

// 2 个桥墩：承台、双柱、柱头、盖梁、系梁
for (const deg of [30, 60]) {
  const phi = (deg * Math.PI) / 180
  const [x, z] = at(phi, 0)
  parts.push(box(7.0, 0.9, 2.4, x, 0.45, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  parts.push(box(8.8, 0.8, 1.6, x, 5.26, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  parts.push(box(3.9, 0.55, 0.65, x, 2.5, z, C.concrete, { mat: 'stone', rot: rotY(phi) }))
  for (const s of [-1, 1]) {
    const [cx, cz] = at(phi, s * 2.6)
    parts.push(cyl(1.4, 1.4, 3.66, cx, 2.73, cz, C.concrete, { mat: 'stone' }, 20))
    parts.push(cyl(0.86, 0.74, 0.3, cx, 4.71, cz, C.concrete, { mat: 'stone' }, 20))
    parts.push(cyl(0.82, 0.88, 0.18, cx, 1.0, cz, C.concrete, { mat: 'stone' }, 20))
  }
}

export default defineModel({
  id: 'highway-curve',
  name: '高架弯道段',
  category: 'infrastructure',
  tags: ['highway', 'curve', 'viaduct', '弯道', '高架', '匝道'],
  footprint: [27.5, 27.5],
  height: 8.4,
  placement: 'outdoor',
  parts,
})
