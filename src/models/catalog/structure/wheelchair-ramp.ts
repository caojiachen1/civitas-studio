import { box, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

// 1:9 accessible ramp rising from +z (street level) to -z (landing), with
// anti-slip battens, tactile warning pad, twin handrails and underside props.
const DECK = '#b8b4a8'
const DECK_EDGE = '#9b978b'
const METAL = '#575d61'
const METAL_LIGHT = '#8c9498'
const WOOD = '#8a6a48'
const RUBBER = '#4f5351'
const TACTILE = '#bda06a'

const Z_LOW = 1.9
const Z_HIGH = -1.75
const RISE = 0.4
const GRADE = RISE / (Z_LOW - Z_HIGH)
const ANGLE = Math.atan(GRADE)
const TOP_LOW = 0.095
const topAt = (z: number) => TOP_LOW + (Z_LOW - z) * GRADE

const RUN = Z_LOW - Z_HIGH
const SLOPE_LEN = RUN / Math.cos(ANGLE)
const MID_Z = (Z_LOW + Z_HIGH) / 2
const DECK_Y = (topAt(Z_LOW) + topAt(Z_HIGH)) / 2 - 0.04 / Math.cos(ANGLE)

const parts: Part[] = []

// Sloped deck slab with raised kerbs and steel stringers underneath.
parts.push(box(1.9, 0.08, SLOPE_LEN, 0, DECK_Y, MID_Z, DECK, { mat: 'stone', rot: [ANGLE, 0, 0] }))
for (const side of [-1, 1]) {
  parts.push(
    box(0.06, 0.12, SLOPE_LEN, side * 0.945, DECK_Y + 0.06, MID_Z, DECK_EDGE, {
      mat: 'stone',
      rot: [ANGLE, 0, 0],
    }),
  )
  parts.push(
    box(0.08, 0.1, 1.5, side * 0.7, 0.34, -1.1, METAL, {
      mat: 'metal',
      rot: [ANGLE, 0, 0],
    }),
  )
}

// 底部支撑: paired posts and cross ties under the high half of the ramp.
const LEG_Z = [-1.5, -0.9]
for (const lz of LEG_Z) {
  const legH = topAt(lz) - 0.13
  for (const side of [-1, 1]) {
    parts.push(box(0.07, legH, 0.07, side * 0.72, legH / 2, lz, METAL, { mat: 'metal' }))
    parts.push(box(0.14, 0.02, 0.14, side * 0.72, 0.01, lz, METAL_LIGHT, { mat: 'metal' }))
  }
  parts.push(box(1.51, 0.05, 0.05, 0, 0.13, lz, METAL, { mat: 'metal' }))
}

// Top landing, edge angle and its two legs.
parts.push(box(2.0, 0.08, 0.28, 0, 0.455, -1.86, DECK, { mat: 'stone' }))
parts.push(box(2.0, 0.03, 0.03, 0, 0.51, -1.985, METAL_LIGHT, { mat: 'metal' }))
for (const side of [-1, 1]) {
  parts.push(box(0.09, 0.42, 0.09, side * 0.7, 0.21, -1.86, METAL, { mat: 'metal' }))
}

// Bottom threshold plate, anti-slip battens and tactile warning pad.
parts.push(box(1.9, 0.03, 0.14, 0, 0.078, 1.92, DECK_EDGE, { mat: 'stone' }))
for (const az of [-1.5, -1.0, -0.5, 0, 0.5, 1.0]) {
  parts.push(
    box(1.76, 0.012, 0.05, 0, topAt(az) + 0.007, az, RUBBER, { mat: 'matte', rot: [ANGLE, 0, 0] }),
  )
}
parts.push(box(1.7, 0.014, 0.22, 0, topAt(1.65) + 0.008, 1.65, TACTILE, { mat: 'matte', rot: [ANGLE, 0, 0] }))

// Twin handrails on both sides: timber cap, steel mid rail, posts and plates.
const RAIL_X = 0.97
for (const side of [-1, 1]) {
  parts.push(
    box(0.06, 0.05, 3.72, side * RAIL_X, topAt(MID_Z) + 0.577, MID_Z, WOOD, {
      mat: 'wood',
      rot: [ANGLE, 0, 0],
    }),
  )
  parts.push(
    box(0.04, 0.035, 3.72, side * RAIL_X, topAt(MID_Z) + 0.33, MID_Z, METAL, {
      mat: 'metal',
      rot: [ANGLE, 0, 0],
    }),
  )
}
for (const pz of [-1.62, -0.54, 0.54, 1.62]) {
  for (const side of [-1, 1]) {
    parts.push(box(0.05, 0.555, 0.05, side * RAIL_X, topAt(pz) + 0.2775, pz, METAL, { mat: 'metal' }))
    parts.push(
      box(0.1, 0.02, 0.1, side * RAIL_X, topAt(pz) + 0.01, pz, METAL_LIGHT, { mat: 'metal' }),
    )
  }
}
for (const ez of [-1.774, 1.924]) {
  for (const side of [-1, 1]) {
    parts.push(
      box(0.075, 0.05, 0.075, side * RAIL_X, topAt(ez) + 0.577, ez, METAL, { mat: 'metal' }),
    )
  }
}

// Hazard edges along the kerbs and warning bars on the landing.
for (const side of [-1, 1]) {
  parts.push(
    box(0.045, 0.006, SLOPE_LEN - 0.1, side * 0.94, DECK_Y + 0.126, MID_Z, TACTILE, {
      mat: 'matte',
      rot: [ANGLE, 0, 0],
    }),
  )
}
for (const x of [-0.6, 0, 0.6]) {
  parts.push(box(0.36, 0.008, 0.05, x, 0.499, -1.9, TACTILE, { mat: 'matte' }))
}

// End plates close the timber handrail caps.
const railEnds = [
  [-1.86, ANGLE],
  [1.9, -ANGLE],
]
for (const side of [-1, 1]) {
  for (const [ez, tilt] of railEnds) {
    parts.push(
      box(0.08, 0.07, 0.03, side * RAIL_X, topAt(ez) + 0.577, ez, METAL_LIGHT, {
        mat: 'metal',
        rot: [tilt, 0, 0],
      }),
    )
  }
}

// Anchor bolts at the ramp feet.
for (const lz of LEG_Z) {
  for (const side of [-1, 1]) {
    parts.push(
      box(0.024, 0.03, 0.024, side * 0.72, 0.025, lz + 0.045, METAL_LIGHT, { mat: 'metal' }),
    )
  }
}

export default defineModel({
  id: 'wheelchair-ramp',
  name: '无障碍坡道',
  category: 'structure',
  tags: ['ramp', 'wheelchair ramp', 'accessible', '无障碍坡道', '坡道', '扶手', '防滑条'],
  footprint: [2.2, 4.0],
  height: 1.1,
  placement: 'any',
  parts,
})
