import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 立交 Y 形桥墩：承台 3.4×3.6，双柱 Φ1.4 从承台顶 1.0 升到 4.5，
 * 两条斜撑沿 Z 向外张开到 ±3.6、顶面 6.1，托住 9m 长盖梁（6.1–6.8）。
 * 盖梁上 4 组支座垫石 + 支座板，顶面正好 7.2（桥面梁底标高）。
 * 斜撑轴线长度 = hypot(2.1, 1.6) = 2.64，端点严格落在柱顶与盖梁底。
 */
const PILE_TOP = 1.0
const COL_TOP = 4.5
const CAP_BOT = 6.1
const CAP_TOP = 6.8
const SEAT = 7.2
const ARM_RISE = CAP_BOT - COL_TOP // 1.6
const ARM_SPREAD = 2.1 // 1.5 → 3.6
const ARM_LEN = Math.hypot(ARM_SPREAD, ARM_RISE)
const ARM_ANGLE = Math.atan2(ARM_SPREAD, ARM_RISE)
const ARM_MID_Z = 1.5 + ARM_SPREAD / 2 // 2.55
const YELLOW = '#e0b23a'

const parts: Part[] = []

// 承台与柱脚
parts.push(box(3.4, 1.0, 5.0, 0, 0.5, 0, C.concrete, { mat: 'stone' }))
for (const z of [-1.5, 1.5]) {
  parts.push(cyl(1.4, 1.4, COL_TOP - PILE_TOP, 0, (PILE_TOP + COL_TOP) / 2, z, C.concrete, { mat: 'stone' }, 22))
  parts.push(cyl(0.87, 0.9, 0.12, 0, PILE_TOP + 0.05, z, C.stone, { mat: 'stone' }, 22))
  parts.push(cyl(0.72, 0.72, 0.24, 0, 1.6, z, YELLOW, { mat: 'matte' }, 22))
  parts.push(cyl(0.86, 0.72, 0.3, 0, COL_TOP + 0.02, z, C.concrete, { mat: 'stone' }, 22))
}
parts.push(box(1.2, 0.55, 3.0, 0, 3.3, 0, C.concrete, { mat: 'stone' }))

// 两条 Y 形斜撑：柱顶 (±1.5, 4.5) → 盖梁底 (±3.6, 6.1)
for (const s of [-1, 1]) {
  parts.push(
    cyl(0.55, 0.8, ARM_LEN, 0, (COL_TOP + CAP_BOT) / 2, s * ARM_MID_Z, C.concrete, {
      mat: 'stone',
      rot: [s * ARM_ANGLE, 0, 0],
    }, 20),
  )
  parts.push(cyl(0.84, 0.84, 0.18, 0, COL_TOP + 0.01, s * 1.5, C.concrete, { mat: 'stone' }, 20))
}

// 盖梁
parts.push(box(2.2, CAP_TOP - CAP_BOT, 9, 0, (CAP_BOT + CAP_TOP) / 2, 0, C.concrete, { mat: 'stone' }))
for (const s of [-1, 1]) {
  for (let i = 0; i < 5; i++) {
    parts.push(box(0.03, 0.38, 0.12, s * 1.11, 6.45, -3 + i * 1.5, C.graphite))
  }
}

// 支座垫石 + 支座板，4 组顶面 7.2
for (const z of [-2.8, 2.8]) {
  for (const x of [-0.75, 0.75]) {
    parts.push(box(0.8, 0.32, 0.7, x, 6.96, z, C.cream, { mat: 'stone' }))
    parts.push(box(0.7, SEAT - 6.8 - 0.32, 0.6, x, 7.16, z, C.blackMetal, { mat: 'metal' }))
  }
}

// 承台泄水孔与柱身检修铭牌
for (const s of [-1, 1]) {
  parts.push(box(0.06, 0.14, 0.18, s * 1.67, 0.45, 0, C.ink))
}
parts.push(box(0.02, 0.4, 0.7, 0.71, 2.2, 1.5, C.blackMetal, { mat: 'metal' }))

export default defineModel({
  id: 'flyover-pier',
  name: '立交桥墩',
  category: 'infrastructure',
  tags: ['flyover', 'pier', 'viaduct', '桥墩', '立交', 'Y 形'],
  footprint: [3.4, 9],
  height: 7.2,
  placement: 'outdoor',
  parts,
})
