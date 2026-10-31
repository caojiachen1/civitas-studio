import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * Full-storey U-shaped stair: 14 + 14 risers at 4.6 / 28 m, two 1.1 m flights
 * around a 1.2 m landing, plus a top landing that meets the upper slab edge.
 * Unlike stair-u / stair-open-double, the top step reaches the full 4.6 m storey,
 * so it can connect real floor openings without a missing flight.
 */
const STEPS = 14
const RISE = 4.6 / (STEPS * 2)
const TREAD = 0.22
const FLIGHT_W = 1.1
const WELL = 0.15
const CX = (FLIGHT_W + WELL) / 2
const Z0 = 2.1
const LAND_TOP = RISE * STEPS
const ZL0 = Z0 - TREAD * STEPS
const LAND_D = 1.09
const ZL1 = ZL0 - LAND_D
const TOP = RISE * STEPS * 2
const ANG = Math.atan(RISE / TREAD)
const RAIL_H = 0.9
const POST_H = RAIL_H - RISE / 2
const parts: Part[] = []

const lowTop = (i: number) => RISE * (i + 1)
const lowZ = (i: number) => Z0 - TREAD * (i + 0.5)
const lowFront = (i: number) => Z0 - TREAD * i
const upTop = (i: number) => LAND_TOP + RISE * (i + 1)
const upZ = (i: number) => ZL1 + TREAD * (i + 0.5)
const upFront = (i: number) => ZL1 + TREAD * i

// Lower and upper flights: treads, risers and brass nosing.
for (const side of [-1, 1]) {
  const x = side * CX
  const lower = side < 0
  for (let i = 0; i < STEPS; i++) {
    const top = lower ? lowTop(i) : upTop(i)
    const z = lower ? lowZ(i) : upZ(i)
    const front = lower ? lowFront(i) : upFront(i)
    parts.push(box(FLIGHT_W, 0.06, TREAD, x, top - 0.03, z, C.oak, { mat: 'wood' }))
    parts.push(box(FLIGHT_W - 0.06, RISE - 0.02, 0.035, x, top - RISE / 2, front + (lower ? -0.0175 : 0.0175), C.cream))
    parts.push(box(FLIGHT_W - 0.08, 0.008, 0.02, x, top + 0.004, front + (lower ? -0.014 : 0.014), C.brass, { mat: 'metal' }))
  }
}

// Half landing and top landing (top landing closes the hole up to the slab edge).
parts.push(box(2.6, 0.16, LAND_D, 0, LAND_TOP - 0.08, (ZL0 + ZL1) / 2, C.concrete, { mat: 'stone' }))
parts.push(box(2.6, 0.16, 1.2, 0, TOP - 0.08, 1.5, C.concrete, { mat: 'stone' }))
for (const z of [ZL0 - 0.012, ZL1 + 0.012, 0.9]) {
  parts.push(box(2.48, 0.008, 0.025, 0, (z === 0.9 ? TOP : LAND_TOP) + 0.004, z, C.brass, { mat: 'metal' }))
}

// Support posts under the half landing.
for (const x of [-0.95, 0.95]) {
  parts.push(box(0.12, LAND_TOP - 0.16, 0.12, x, (LAND_TOP - 0.16) / 2, -1.55, C.walnut, { mat: 'wood' }))
  parts.push(box(0.28, 0.03, 0.28, x, 0.015, -1.55, C.graphite, { mat: 'metal' }))
}

// Stringers.
for (const side of [-1, 1]) {
  const x = side * CX
  const lower = side < 0
  for (const dx of [-0.51, 0.51]) {
    const top = lower ? lowTop(STEPS - 1) : upTop(STEPS - 1)
    const z = lower ? (Z0 + ZL0) / 2 : (ZL1 + upZ(STEPS - 1)) / 2
    const len = (Z0 - ZL0) / Math.cos(ANG)
    parts.push(box(0.07, 0.2, len, x + dx, top - 0.18, z, C.walnut, {
      mat: 'wood',
      rot: [lower ? ANG : -ANG, 0, 0],
    }))
  }
}

// Balustrade posts and inclined rails on both flights.
for (const side of [-1, 1]) {
  const xBase = side * CX
  const lower = side < 0
  for (const dx of [-0.51, 0.51]) {
    const x = xBase + dx
    for (let i = 0; i < STEPS; i++) {
      const y = lower ? lowTop(i) : upTop(i)
      const z = lower ? lowZ(i) : upZ(i)
      parts.push(cyl(0.018, 0.018, POST_H, x, y + POST_H / 2, z, C.blackMetal, { mat: 'metal' }, 8))
    }
    const startY = (lower ? 0 : LAND_TOP) + RAIL_H
    const endY = (lower ? LAND_TOP : TOP) + RAIL_H
    const startZ = lower ? Z0 : ZL1
    const endZ = lower ? ZL0 : upZ(STEPS - 1)
    const len = Math.hypot(endZ - startZ, endY - startY)
    parts.push(box(0.06, 0.06, len, x, (startY + endY) / 2, (startZ + endZ) / 2, C.walnut, {
      mat: 'wood',
      rot: [lower ? ANG : -ANG, 0, 0],
    }))
  }
}

// Landing railings and posts.
for (const x of [-1.2, 1.2]) {
  parts.push(box(0.06, 0.06, LAND_D - 0.03, x, LAND_TOP + RAIL_H, (ZL0 + ZL1) / 2, C.walnut, { mat: 'wood' }))
  for (const z of [ZL0 - 0.02, (ZL0 + ZL1) / 2, ZL1 + 0.02]) {
    parts.push(cyl(0.018, 0.018, RAIL_H, x, LAND_TOP + RAIL_H / 2, z, C.blackMetal, { mat: 'metal' }, 8))
  }
}
parts.push(box(2.4, 0.06, 0.06, 0, LAND_TOP + RAIL_H, ZL1 + 0.03, C.walnut, { mat: 'wood' }))

// Top landing guard rails on both sides.
for (const x of [-1.2, 1.2]) {
  parts.push(box(0.06, 0.06, 1.2, x, TOP + RAIL_H, 1.5, C.walnut, { mat: 'wood' }))
  for (const z of [0.92, 2.08]) {
    parts.push(cyl(0.018, 0.018, RAIL_H, x, TOP + RAIL_H / 2, z, C.blackMetal, { mat: 'metal' }, 8))
  }
  parts.push(cyl(0.025, 0.028, 0.9, x, TOP + 0.45, 2.06, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(sphere(0.032, x, TOP + 0.94, 2.06, C.brass, { mat: 'metal' }, 12))
}

export default defineModel({
  id: 'stair-u-full',
  name: '全层高 U 形楼梯',
  category: 'structure',
  tags: ['stairs', 'full storey', 'switchback', '楼梯', '全层高', '双跑', '楼板洞'],
  footprint: [2.6, 4.2],
  height: 5.5,
  placement: 'indoor',
  parts,
})
