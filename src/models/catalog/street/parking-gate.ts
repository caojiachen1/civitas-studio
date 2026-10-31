import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []
const BX = -1.85 // booth centre
const FRAME = C.graphite
const ARM_ANGLE = (15 * Math.PI) / 180

// 1.6 m booth on the left, 3.5 m boom raised 15 degrees from a 1.1 m drive cabinet
parts.push(box(1.7, 0.1, 1.7, BX, 0.05, 0, '#a8a59d', { mat: 'stone' }))
parts.push(box(1.5, 0.06, 1.5, BX, 0.13, 0, '#8e8b82', { mat: 'stone' }))

// booth walls with window openings
parts.push(box(1.6, 0.95, 0.06, BX, 0.575, 0.77, C.cream, { mat: 'matte' }))
parts.push(box(1.6, 0.25, 0.06, BX, 2.175, 0.77, C.cream, { mat: 'matte' }))
parts.push(box(0.3, 1.0, 0.06, -2.5, 1.55, 0.77, C.cream, { mat: 'matte' }))
parts.push(box(0.3, 1.0, 0.06, -1.2, 1.55, 0.77, C.cream, { mat: 'matte' }))
parts.push(box(0.06, 0.95, 1.6, -1.08, 0.575, 0, C.cream, { mat: 'matte' }))
parts.push(box(0.06, 0.25, 1.6, -1.08, 2.175, 0, C.cream, { mat: 'matte' }))
parts.push(box(0.06, 1.0, 0.3, -1.08, 1.55, -0.65, C.cream, { mat: 'matte' }))
parts.push(box(0.06, 1.0, 0.3, -1.08, 1.55, 0.65, C.cream, { mat: 'matte' }))
parts.push(box(1.6, 2.2, 0.06, BX, 1.2, -0.77, C.cream, { mat: 'matte' }))
parts.push(box(0.06, 2.2, 1.6, -2.62, 1.2, 0, C.cream, { mat: 'matte' }))
parts.push(box(1.5, 0.04, 1.5, BX, 2.29, 0, C.white, { mat: 'matte' }))
for (const x of [-2.65, -1.05]) {
  for (const z of [-0.8, 0.8]) {
    parts.push(box(0.1, 2.2, 0.1, x, 1.2, z, C.navy, { mat: 'gloss' }))
  }
}

// front window glazing in a metal frame with a central mullion
parts.push(box(1.0, 1.0, 0.02, BX, 1.55, 0.77, C.glass, { mat: 'glass' }))
parts.push(box(1.08, 0.05, 0.05, BX, 1.065, 0.785, FRAME, { mat: 'metal' }))
parts.push(box(1.08, 0.05, 0.05, BX, 2.035, 0.785, FRAME, { mat: 'metal' }))
parts.push(box(0.05, 1.0, 0.05, -2.37, 1.55, 0.785, FRAME, { mat: 'metal' }))
parts.push(box(0.05, 1.0, 0.05, -1.33, 1.55, 0.785, FRAME, { mat: 'metal' }))
parts.push(box(0.04, 1.0, 0.04, BX, 1.55, 0.785, FRAME, { mat: 'metal' }))

// side window facing the boom
parts.push(box(0.02, 1.0, 1.0, -1.08, 1.55, 0, C.glass, { mat: 'glass' }))
parts.push(box(0.05, 0.05, 1.08, -1.065, 1.065, 0, FRAME, { mat: 'metal' }))
parts.push(box(0.05, 0.05, 1.08, -1.065, 2.035, 0, FRAME, { mat: 'metal' }))
parts.push(box(0.05, 1.0, 0.05, -1.065, 1.55, -0.51, FRAME, { mat: 'metal' }))
parts.push(box(0.05, 1.0, 0.05, -1.065, 1.55, 0.51, FRAME, { mat: 'metal' }))
parts.push(box(0.04, 1.0, 0.04, -1.065, 1.55, 0, FRAME, { mat: 'metal' }))

// rear door, counter and roof
parts.push(box(0.74, 1.96, 0.035, BX, 1.1, -0.815, C.sage, { mat: 'matte' }))
parts.push(box(0.86, 0.05, 0.05, BX, 2.09, -0.81, FRAME, { mat: 'metal' }))
parts.push(box(0.12, 0.025, 0.05, -1.62, 1.05, -0.845, C.steel, { mat: 'metal' }))
parts.push(box(0.9, 0.06, 0.34, BX, 1.04, 0.36, C.oak, { mat: 'wood' }))
parts.push(box(0.06, 0.86, 0.06, -2.2, 0.59, 0.36, FRAME, { mat: 'metal' }))
parts.push(box(0.06, 0.86, 0.06, -1.5, 0.59, 0.36, FRAME, { mat: 'metal' }))
parts.push(rounded(1.72, 0.1, 1.72, 0.03, BX, 2.35, 0, FRAME, { mat: 'metal' }))
parts.push(rounded(1.76, 0.08, 1.76, 0.02, BX, 2.44, 0, C.navy, { mat: 'metal' }))
parts.push(box(1.56, 0.03, 1.56, BX, 2.485, 0, C.steel, { mat: 'metal' }))
for (const x of [-2.62, -1.08]) {
  parts.push(cyl(0.028, 0.028, 2.05, x, 1.125, 0.83, C.steel, { mat: 'metal' }, 8))
}

// drive cabinet, footing and pivot fork
parts.push(box(0.5, 0.12, 0.5, -0.88, 0.06, 0, '#a8a59d', { mat: 'stone' }))
parts.push(rounded(0.35, 1.1, 0.35, 0.03, -0.88, 0.67, 0, C.white, { mat: 'gloss' }))
parts.push(box(0.3, 0.06, 0.3, -0.88, 0.16, 0, C.graphite, { mat: 'metal' }))
for (const z of [-0.11, 0.11]) {
  parts.push(box(0.12, 0.24, 0.04, -0.88, 1.24, z, FRAME, { mat: 'metal' }))
}
parts.push(cyl(0.045, 0.045, 0.3, -0.88, 1.3, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12))
// card reader, vents, fixings
parts.push(rounded(0.15, 0.22, 0.05, 0.01, -0.88, 0.9, 0.19, FRAME, { mat: 'metal' }))
parts.push(box(0.1, 0.11, 0.01, -0.88, 0.93, 0.218, '#cfe3da', { mat: 'emissive' }))
for (let i = 0; i < 3; i++) {
  parts.push(box(0.22, 0.012, 0.006, -0.88, 0.36 + i * 0.035, 0.177, C.graphite, { mat: 'metal' }))
}
parts.push(cyl(0.012, 0.012, 0.06, -0.75, 0.15, 0.12, C.steel, { mat: 'metal' }, 8))

// red/white striped boom, seven 0.5 m segments
const ARM_LEN = 3.5
const startX = -0.88
const startY = 1.3
const dirX = Math.cos(ARM_ANGLE)
const dirY = Math.sin(ARM_ANGLE)
for (let i = 0; i < 7; i++) {
  const t = 0.25 + i * 0.5
  parts.push(cyl(0.045, 0.045, 0.5, startX + dirX * t, startY + dirY * t, 0, i % 2 === 0 ? C.red : C.cream, { mat: 'gloss', rot: [0, 0, -(Math.PI / 2 - ARM_ANGLE)] }, 12))
}
parts.push(sphere(0.06, startX + dirX * ARM_LEN, startY + dirY * ARM_LEN, 0, C.red, { mat: 'gloss' }, 12))
parts.push(cyl(0.06, 0.06, 0.06, startX + dirX * 0.18, startY + dirY * 0.18, 0, C.steel, { mat: 'metal', rot: [0, 0, -(Math.PI / 2 - ARM_ANGLE)] }, 12))
// diagonal support stay from the cabinet to the boom
parts.push(cyl(0.022, 0.022, 1.05, -0.5, 0.95, 0.12, C.steel, { mat: 'metal', rot: [0, 0, -0.42] }, 8))
parts.push(box(0.1, 0.06, 0.06, -0.71, 0.5, 0.12, C.graphite, { mat: 'metal' }))
// boom rest cradle beside the lane
parts.push(box(0.24, 0.03, 0.24, 2.5, 0.015, 0, C.graphite, { mat: 'metal' }))
parts.push(cyl(0.035, 0.035, 0.9, 2.5, 0.48, 0, C.graphite, { mat: 'metal' }, 10))
parts.push(box(0.16, 0.05, 0.16, 2.5, 0.95, 0, C.steel, { mat: 'metal' }))

export default defineModel({
  id: 'parking-gate',
  name: '停车场道闸',
  category: 'street',
  tags: ['gate', 'barrier', 'parking', '道闸', '停车场', '闸杆'],
  footprint: [5.4, 1.8],
  height: 2.5,
  placement: 'outdoor',
  parts,
})
