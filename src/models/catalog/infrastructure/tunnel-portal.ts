import { C, box, defineModel, ico, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 隧道洞口：净宽 12、净高 7，矢高 4.8 的割圆拱（R=6.15，圆心 y=0.85）。
 * 洞门墙总宽 16、高 8.2；拱圈由 14 块混凝土楔块沿圆心角拼成，
 * 墙垛用逐层收窄的 box 填到拱背外侧。洞内 8m 暗色衬砌 + 顶灯，
 * 顶部覆土 + 绿化缓坡最高 9.0；两翼为分级挡土翼墙。
 */
const OPEN_W = 12
const OPEN_H = 7
const SPRING_Y = 2.2
const R_IN = ((OPEN_W / 2) ** 2 + (OPEN_H - SPRING_Y) ** 2) / (2 * (OPEN_H - SPRING_Y)) // 6.15
const CY = OPEN_H - R_IN // 0.85
const RING_T = 0.7
const R_OUT = R_IN + RING_T
const PHI0 = Math.atan2(SPRING_Y - CY, OPEN_W / 2)
const SPAN = Math.PI - PHI0 * 2
const VOUS = 14
const DVOUS = SPAN / VOUS
const FACE_Z = -5
const RING_D = 0.64
const RING_Z = FACE_Z + RING_D / 2
const WALL_T = 0.56
const WALL_Z = FACE_Z + 0.08 + WALL_T / 2
const ASPHALT = '#3a3d40'
const LINE = '#e8e6df'

const parts: Part[] = []

// 拱圈：径向厚 0.7 的楔块，绕 Z 转动到切线角
for (let i = 0; i < VOUS; i++) {
  const phi = PHI0 + (i + 0.5) * DVOUS
  const rMid = R_IN + RING_T / 2
  const chord = 2 * rMid * Math.sin(DVOUS / 2) * 1.06
  parts.push(
    box(RING_T, chord, RING_D, rMid * Math.cos(phi), CY + rMid * Math.sin(phi), RING_Z, C.cream, {
      mat: 'stone',
      rot: [0, 0, phi],
    }),
  )
}

// 拱脚石垛与基座
for (const s of [-1, 1]) {
  parts.push(box(0.7, SPRING_Y, RING_D, s * 6.35, SPRING_Y / 2, RING_Z, C.cream, { mat: 'stone' }))
  parts.push(box(0.7, 0.15, RING_D, s * 6.35, 0.075, RING_Z, C.stone, { mat: 'stone' }))
}

// 洞门墙：按 0.5m 一行填到拱背之外，两翼对称；顶部整片压顶
for (let i = 0; i < 10; i++) {
  const y0 = SPRING_Y + i * 0.5
  const y1 = y0 + 0.5
  const xStart = Math.sqrt(Math.max(0, R_OUT * R_OUT - (y1 - CY) ** 2))
  for (const s of [-1, 1]) {
    parts.push(box(8 - xStart, 0.5, WALL_T, s * (8 + xStart) / 2, (y0 + y1) / 2, WALL_Z, C.concrete, { mat: 'stone' }))
  }
}
parts.push(box(16, 1.0, WALL_T, 0, 7.7, WALL_Z, C.concrete, { mat: 'stone' }))
parts.push(box(16, 0.15, 0.68, 0, 8.275, FACE_Z + 0.34, C.cream, { mat: 'stone' }))

// 门楣标牌与落水管
parts.push(box(3.0, 0.4, 0.04, 0, 7.95, -4.93, C.navy, { mat: 'gloss' }))
parts.push(box(2.7, 0.1, 0.01, 0, 7.95, -4.953, C.white, { mat: 'gloss' }))
for (const s of [-1, 1]) {
  parts.push(box(0.08, 7.4, 0.04, s * 6.8, 3.75, -4.93, C.graphite, { mat: 'metal' }))
}

// 两翼分级挡土墙 + 压顶
for (const s of [-1, 1]) {
  const steps = [
    { h: 4.2, z: -3.75 },
    { h: 2.8, z: -1.25 },
    { h: 1.5, z: 1.25 },
  ]
  for (const st of steps) {
    parts.push(box(0.5, st.h, 2.5, s * 7.75, st.h / 2, st.z, C.concrete, { mat: 'stone' }))
    parts.push(box(0.5, 0.1, 2.5, s * 7.75, st.h + 0.05, st.z, C.cream, { mat: 'stone' }))
  }
}

// 8m 暗色内衬：侧墙 + 9 条拱顶板 + 路缘
const TUN_Z = -0.4
for (const s of [-1, 1]) {
  parts.push(box(0.3, SPRING_Y, 8, s * 6.15, SPRING_Y / 2, TUN_Z, C.ink, { mat: 'stone' }))
  parts.push(box(0.3, 0.2, 8, s * 5.75, 0.13, TUN_Z, C.stone, { mat: 'stone' }))
}
const R_V = 6.2
for (let i = 0; i < 9; i++) {
  const phi = PHI0 + (i + 0.5) * (SPAN / 9)
  const chord = 2 * R_V * Math.sin(SPAN / 18) * 1.05
  parts.push(
    box(0.12, chord, 8, R_V * Math.cos(phi), CY + R_V * Math.sin(phi), TUN_Z, C.ink, {
      mat: 'stone',
      rot: [0, 0, phi],
    }),
  )
}

// 洞顶灯（4 组）与沥青路面、洞内标线
for (const z of [-3.8, 0.4]) {
  for (const s of [-1, 1]) {
    parts.push(box(0.4, 0.3, 1.9, s * 2.4, 6.35, z, C.blackMetal, { mat: 'metal' }))
    parts.push(box(0.3, 0.02, 1.7, s * 2.4, 6.19, z, C.cream, { mat: 'emissive' }))
  }
}
parts.push(box(12, 0.03, 10, 0, 0.015, 0, ASPHALT))
for (const z of [-2.5, 0, 2.5]) {
  parts.push(box(0.15, 0.006, 1.8, 0, 0.033, z, LINE))
}

// 覆土 + 绿化缓坡（最高 9.0）
parts.push(box(15.6, 1.0, 9, 0, 8.0, 0.2, C.soil, { mat: 'stone' }))
parts.push(rbox(15.4, 0.7, 3.0, 0.2, 0, 8.5, -2.8, C.leaf, { mat: 'foliage', side: 'double' }))
parts.push(rbox(12.6, 0.8, 3.4, 0.2, 0, 8.55, -0.2, C.leaf, { mat: 'foliage', side: 'double' }))
parts.push(rbox(9.0, 0.7, 3.0, 0.2, 0, 8.65, 2.4, C.leafDeep, { mat: 'foliage', side: 'double' }))
for (const x of [-4, 0, 4]) {
  parts.push(ico(0.12, x, 8.8, -3.2, C.leafDeep, { mat: 'foliage' }, 1))
}

// 翼墙顶灌木
for (const s of [-1, 1]) {
  const tops = [
    { h: 4.2, z: -3.75 },
    { h: 2.8, z: -1.25 },
    { h: 1.5, z: 1.25 },
  ]
  for (const t of tops) {
    parts.push(ico(0.22, s * 7.75, t.h + 0.32, t.z, C.leaf, { mat: 'foliage' }, 1))
  }
}

export default defineModel({
  id: 'tunnel-portal',
  name: '隧道洞口',
  category: 'infrastructure',
  tags: ['tunnel', 'portal', '拱门', '隧道', '洞口', '山体'],
  footprint: [16, 10],
  height: 9,
  placement: 'outdoor',
  parts,
})
