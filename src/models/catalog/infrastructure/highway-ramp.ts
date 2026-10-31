import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 30m 落地引道：桥面顶由 z=-15 的 7.2m 线性降到 z=+15 的 0.4m。
 * 倾斜角 atan2(6.8, 30)；所有坡上构件绕 X 旋转该角度，位置由 (法向 v, 纵向 u)
 * 反算：y = 3.8 + v·cosθ − u·sinθ，z = u·cosθ + v·sinθ。
 * 高半段为钢混箱梁 + 单排桥墩，低半段落到挡土墙内的填方上；墙顶严格贴梁底。
 */
const LEN = 30
const DROP = 6.8
const TOP_HI = 7.2
const TOP_LO = 0.4
const THETA = Math.atan2(DROP, LEN)
const COS = Math.cos(THETA)
const SIN = Math.sin(THETA)
const RUN = Math.hypot(LEN, DROP)
const PIVOT = (TOP_HI + TOP_LO) / 2 // 3.8
const DECK_T = 0.38
const DECK_VERT = DECK_T * COS
const ASPHALT = '#3a3d40'
const LINE = '#e8e6df'
const TILT: [number, number, number] = [THETA, 0, 0]

const yAt = (v: number, u: number) => PIVOT + v * COS - u * SIN
const zAt = (v: number, u: number) => u * COS + v * SIN
const topAt = (z: number) => PIVOT - z * Math.tan(THETA)

const parts: Part[] = []

// 桥面板 + 沥青（v=0 为铺装顶面）
parts.push(box(9, 0.3, RUN, 0, yAt(-0.23, 0), zAt(-0.23, 0), C.concrete, { mat: 'stone', rot: TILT }))
parts.push(box(8.3, 0.08, RUN, 0, yAt(-0.04, 0), zAt(-0.04, 0), ASPHALT, { rot: TILT }))

// 两侧 1.1m 护栏 + 顶部钢扶手 + 内侧踢脚
for (const s of [-1, 1]) {
  parts.push(box(0.34, 1.18, RUN, s * 4.32, yAt(0.51, 0), zAt(0.51, 0), C.concrete, { mat: 'stone', rot: TILT }))
  parts.push(box(0.06, 0.12, RUN, s * 4.32, yAt(1.16, 0), zAt(1.16, 0), C.steel, { mat: 'metal', rot: TILT }))
  parts.push(box(0.1, 0.18, RUN, s * 4.12, yAt(0.09, 0), zAt(0.09, 0), C.stone, { mat: 'stone', rot: TILT }))
}

// 护栏立柱，每 5m 一道
for (const u of [-12, -7, -2, 3, 8, 13]) {
  for (const s of [-1, 1]) {
    parts.push(box(0.38, 1.1, 0.24, s * 4.31, yAt(0.55, u), zAt(0.55, u), C.cream, { mat: 'stone', rot: TILT }))
  }
}

// 高半段箱梁边梁（低端切到挡土墙顶之上）
for (const s of [-1, 1]) {
  parts.push(box(0.45, 0.62, 10.8, s * 4.15, yAt(-0.69, -9.9), zAt(-0.69, -9.9), C.concrete, { mat: 'stone', rot: TILT }))
}

// 桥墩：承台、双柱、柱头、盖梁、系梁；盖梁顶稍嵌入边梁底，斜面全宽接触
const PIER_Z = -9.5
const SOFFIT = topAt(PIER_Z) - DECK_VERT - 0.62 * COS
parts.push(box(6.8, 0.9, 2.2, 0, 0.45, PIER_Z, C.concrete, { mat: 'stone' }))
const CAP_TOP = SOFFIT + 0.172 // 盖梁顶略高于梁底，保证斜面全宽接触
parts.push(box(8.6, 0.85, 1.5, 0, CAP_TOP - 0.425, PIER_Z, C.concrete, { mat: 'stone' }))
parts.push(box(3.9, 0.55, 0.65, 0, 2.5, PIER_Z, C.concrete, { mat: 'stone' }))
for (const x of [-2.6, 2.6]) {
  parts.push(cyl(1.3, 1.3, 3.13, x, 2.465, PIER_Z, C.concrete, { mat: 'stone' }, 20))
  parts.push(cyl(0.84, 0.72, 0.3, x, 4.178, PIER_Z, C.concrete, { mat: 'stone' }, 20))
  parts.push(cyl(0.78, 0.84, 0.18, x, 1.0, PIER_Z, C.concrete, { mat: 'stone' }, 20))
}

// 挡土墙（prism：px = −z，随后绕 Y 转 90°，深度方向即 X）
const LOW_Z = 15
const FILL_Z = -4.5
const wallTop = (z: number) => topAt(z) - DECK_VERT
const wallProfile: [number, number][] = [
  [-LOW_Z, 0],
  [-FILL_Z, 0],
  [-FILL_Z, wallTop(FILL_Z)],
  [-LOW_Z, wallTop(LOW_Z)],
]
for (const s of [-1, 1]) {
  parts.push(prism(wallProfile, 0.4, s * 4.3, 0, 0, C.concrete, { mat: 'stone', rot: [0, Math.PI / 2, 0] }))
}
const fillProfile: [number, number][] = [
  [-14.5, 0],
  [-FILL_Z, 0],
  [-FILL_Z, wallTop(FILL_Z) - 0.02],
  [-14.5, wallTop(14.5) - 0.02],
]
parts.push(prism(fillProfile, 8.2, 0, 0, 0, C.soil, { mat: 'stone', rot: [0, Math.PI / 2, 0] }))

// 挡土墙竖向分缝 + 泄水孔
for (const z of [-3.5, 0.5, 4.5, 8.5, 12.5]) {
  const h = wallTop(z) - 0.2
  for (const s of [-1, 1]) {
    parts.push(box(0.06, h, 0.3, s * 4.47, 0.06 + h / 2, z, C.stone, { mat: 'stone' }))
  }
}
for (const z of [-2, 2, 6, 10]) {
  for (const s of [-1, 1]) {
    parts.push(box(0.03, 0.12, 0.1, s * 4.48, 0.45, z, C.graphite))
  }
}

// 坡面标线 + 排水口 + 高端伸缩缝
for (const s of [-1, 1]) {
  parts.push(box(0.12, 0.006, RUN, s * 3.86, yAt(0.003, 0), zAt(0.003, 0), LINE, { rot: TILT }))
}
for (const u of [-11, -3.5, 4, 11.5]) {
  parts.push(box(0.15, 0.012, 2.4, 0, yAt(0.006, u), zAt(0.006, u), LINE, { rot: TILT }))
}
for (const u of [-8, 8]) {
  for (const s of [-1, 1]) {
    parts.push(box(0.3, 0.014, 0.5, s * 3.95, yAt(0.007, u), zAt(0.007, u), C.graphite, { mat: 'metal', rot: TILT }))
  }
}
parts.push(box(8.3, 0.02, 0.14, 0, yAt(0.01, -15.2), zAt(0.01, -15.2), ASPHALT, { rot: TILT }))
parts.push(box(8.3, 0.016, 0.2, 0, yAt(0.012, -14.98), zAt(0.012, -14.98), C.steel, { mat: 'metal', rot: TILT }))

export default defineModel({
  id: 'highway-ramp',
  name: '高架落地引道',
  category: 'infrastructure',
  tags: ['highway', 'ramp', 'approach', '引道', '落地', '挡土墙'],
  footprint: [9, 30.4],
  height: 8.39,
  placement: 'outdoor',
  parts,
})
