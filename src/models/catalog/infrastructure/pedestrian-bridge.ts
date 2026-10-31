import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 人行天桥：净跨 16m（柱中心 z=±8），桥面宽 3m、顶面 6.0m；
 * 钢箱梁 + 玻璃/金属栏杆（顶 7.2）。两端在桥侧各挂一部两跑楼梯：
 * 38 级、级高 6.0/38≈0.158、踏面 0.3，两跑各 18 踏面，中间 1.2m 平台。
 * 楼梯沿 Z 向桥内下折，分别挂在东/西两侧，因此总平面仍为 7×18。
 * 踏步用锯齿 prism 生成，坡面扶手由踏步前缘线反算，柱底落在踏面上。
 */
const RISE = 6 / 38
const TREAD = 0.3
const STEPS = 18
const FLIGHT_RUN = STEPS * TREAD // 5.4
const FLIGHT_RISE = 3.0
const RAIL_H = 0.9
const RAIL_LEN = Math.hypot(FLIGHT_RUN, FLIGHT_RISE)
const RAIL_ANGLE = Math.atan2(FLIGHT_RISE, FLIGHT_RUN)
const DECK_TOP = 6.0
const STAIR_X = 2.5
const STAIR_W = 2.0

const flightProfile = (zt: number, yt: number, zb: number, yb: number, underBot: number) => {
  const dir = Math.sign(zb - zt) // 踏步推进方向
  const pts: [number, number][] = [
    [-zt, yt - 0.3],
    [-zt, yt],
  ]
  let z = zt
  let y = yt
  for (let i = 0; i < STEPS; i++) {
    y -= RISE
    pts.push([-z, y])
    z += dir * TREAD
    pts.push([-z, y])
  }
  pts.push([-zb, yb])
  if (underBot > 0) pts.push([-zb, yb - underBot])
  return pts
}

const stepTop = (zt: number, yt: number, z: number) => {
  const i = Math.min(STEPS - 1, Math.floor(Math.abs(z - zt) / TREAD))
  return yt - RISE * (i + 1)
}
const railY = (zt: number, yt: number, z: number) =>
  yt + RAIL_H - (Math.abs(z - zt) / FLIGHT_RUN) * FLIGHT_RISE

const parts: Part[] = []

// 钢箱梁：底板、腹板、桥面板、铺装、端部横隔板
parts.push(box(2.3, 0.1, 18, 0, 5.33, 0, C.graphite, { mat: 'metal' }))
for (const x of [-1.05, 1.05]) {
  parts.push(box(0.14, 0.52, 18, x, 5.64, 0, C.graphite, { mat: 'metal' }))
}
parts.push(box(3.0, 0.06, 18, 0, 5.93, 0, C.steel, { mat: 'metal' }))
parts.push(box(2.9, 0.04, 17.8, 0, 5.98, 0, C.stone, { mat: 'stone' }))
for (const z of [-8.95, 8.95]) {
  parts.push(box(2.3, 0.58, 0.1, 0, 5.65, z, C.graphite, { mat: 'metal' }))
}

// 4 根圆柱 + 独立承台 + 横梁 + 支座垫板
for (const z of [-8, 8]) {
  parts.push(box(3.2, 0.35, 0.7, 0, 5.065, z, C.graphite, { mat: 'metal' }))
  for (const x of [-1.15, 1.15]) {
    parts.push(box(0.9, 0.25, 0.9, x, 0.125, z, C.concrete, { mat: 'stone' }))
    parts.push(cyl(0.45, 0.45, 4.64, x, 2.57, z, C.graphite, { mat: 'metal' }, 18))
    parts.push(box(0.4, 0.04, 0.5, x, 5.26, z, C.blackMetal, { mat: 'metal' }))
  }
}

// 桥面玻璃/金属栏杆：立柱 9 根/侧，玻璃连续板，顶部扶手
for (const z of [-8.5, -6.375, -4.25, -2.125, 0, 2.125, 4.25, 6.375, 8.5]) {
  for (const s of [-1, 1]) {
    parts.push(box(0.06, 1.12, 0.06, s * 1.44, 6.56, z, C.blackMetal, { mat: 'metal' }))
  }
}
for (const s of [-1, 1]) {
  parts.push(box(0.02, 0.95, 17.0, s * 1.44, 6.545, 0, C.glass, { mat: 'glass' }))
  parts.push(box(0.08, 0.08, 17.2, s * 1.44, 7.16, 0, C.steel, { mat: 'metal' }))
  parts.push(box(0.06, 0.1, 17.0, s * 1.44, 6.05, 0, C.blackMetal, { mat: 'metal' }))
}

// 两部两跑楼梯（east=+1 / west=-1），踏步 prism 沿 X 挤出 2m
for (const s of [-1, 1]) {
  const zt1 = s * 8.4
  const zb1 = s * 3.0
  const zt2 = s * 1.8
  const zb2 = -s * 3.6
  parts.push(prism(flightProfile(zt1, DECK_TOP, zb1, 3.0, 0.3), STAIR_W, s * STAIR_X, 0, 0, C.graphite, {
    mat: 'metal',
    rot: [0, Math.PI / 2, 0],
  }))
  parts.push(prism(flightProfile(zt2, 3.0, zb2, 0, 0), STAIR_W, s * STAIR_X, 0, 0, C.graphite, {
    mat: 'metal',
    rot: [0, Math.PI / 2, 0],
  }))
  parts.push(box(STAIR_W, 0.1, 0.6, s * STAIR_X, 5.95, s * 8.7, C.graphite, { mat: 'metal' }))
  parts.push(box(STAIR_W, 0.12, 1.2, s * STAIR_X, 2.94, s * 2.4, C.graphite, { mat: 'metal' }))

  // 中间平台柱
  for (const x of [s * 1.9, s * 3.1]) {
    parts.push(box(0.22, 0.02, 0.22, x, 0.01, s * 2.4, C.blackMetal, { mat: 'metal' }))
    parts.push(cyl(0.07, 0.07, 2.86, x, 1.45, s * 2.4, C.blackMetal, { mat: 'metal' }, 10))
  }

  // 两跑扶手 + 立柱 + 平台扶手
  const railX = [s * STAIR_X - 0.95, s * STAIR_X + 0.95]
  const runs = [
    { zt: zt1, yt: DECK_TOP, zb: zb1, zc: s * 5.7, yc: 5.4, posts: [s * 8.2, s * 5.7, s * 3.2] },
    { zt: zt2, yt: 3.0, zb: zb2, zc: -s * 0.9, yc: 2.4, posts: [s * 1.5, -s * 0.9, -s * 3.3] },
  ]
  for (const run of runs) {
    for (const x of railX) {
      parts.push(box(0.06, 0.06, RAIL_LEN, x, run.yc, run.zc, C.blackMetal, {
        mat: 'metal',
        rot: [-s * RAIL_ANGLE, 0, 0],
      }))
      for (const z of run.posts) {
        const bottom = stepTop(run.zt, run.yt, z)
        const top = railY(run.zt, run.yt, z)
        parts.push(cyl(0.018, 0.018, top - bottom, x, (top + bottom) / 2, z, C.blackMetal, { mat: 'metal' }, 8))
      }
    }
  }
  for (const x of railX) {
    parts.push(box(0.06, 0.06, 1.2, x, 3.9, s * 2.4, C.blackMetal, { mat: 'metal' }))
    parts.push(cyl(0.018, 0.018, 0.9, x, 3.45, s * 2.4, C.blackMetal, { mat: 'metal' }, 8))
  }
}

export default defineModel({
  id: 'pedestrian-bridge',
  name: '人行天桥',
  category: 'infrastructure',
  tags: ['footbridge', 'pedestrian', 'bridge', '天桥', '人行', '钢桥'],
  footprint: [7, 18],
  height: 7.2,
  placement: 'outdoor',
  parts,
})
