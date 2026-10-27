import { C, box, cyl, defineModel, torus } from '../../kit'
import type { Part } from '../../../editor/types'

// Low-saturation clay brick chimney with concrete footing, corbelled cap,
// terracotta flue pot and a small metal clean-out door with visible brickwork.
const BRICK = '#a1735e'
const BRICK_DARK = '#8a6150'
const MORTAR = '#c7c0b1'
const CONCRETE = '#b3b0a7'
const CAP = '#928e82'
const METAL = '#43484a'
const DOOR = '#7c8183'

const BODY_H = 2.0
const BODY_CY = 0.22 + BODY_H / 2
const parts: Part[] = []

// Footing, plinth and shaft.
parts.push(box(0.8, 0.12, 0.8, 0, 0.06, 0, CONCRETE, { mat: 'stone' }))
parts.push(box(0.72, 0.1, 0.72, 0, 0.17, 0, BRICK_DARK, { mat: 'stone' }))
parts.push(box(0.56, BODY_H, 0.56, 0, BODY_CY, 0, BRICK, { mat: 'stone' }))

// Corner quoins in a darker brick tone.
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(box(0.07, BODY_H, 0.07, sx * 0.245, BODY_CY, sz * 0.245, BRICK_DARK, { mat: 'stone' }))
  }
}

// Horizontal mortar courses.
for (const cy of [0.4, 0.68, 0.96, 1.24, 1.52, 1.8, 2.08]) {
  parts.push(box(0.566, 0.008, 0.566, 0, cy, 0, MORTAR, { mat: 'stone' }))
}

// Staggered vertical joints on the front and back faces.
for (const cy of [0.54, 1.1, 1.66]) {
  const ox = cy === 1.1 ? 0.14 : -0.14
  for (const sz of [-1, 1]) {
    parts.push(box(0.008, 0.12, 0.006, ox, cy, sz * 0.283, MORTAR, { mat: 'stone' }))
  }
}

// Corbelled shoulders, cap slab and crown.
parts.push(box(0.64, 0.06, 0.64, 0, 2.25, 0, BRICK_DARK, { mat: 'stone' }))
parts.push(box(0.7, 0.05, 0.7, 0, 2.305, 0, BRICK, { mat: 'stone' }))
parts.push(box(0.72, 0.1, 0.72, 0, 2.38, 0, CAP, { mat: 'stone' }))
parts.push(box(0.62, 0.05, 0.62, 0, 2.455, 0, CAP, { mat: 'stone' }))

// Terracotta flue pot, rim and the dark flue mouth.
parts.push(cyl(0.115, 0.135, 0.12, 0, 2.54, 0, C.terracotta, { mat: 'ceramic' }, 18))
parts.push(torus(0.11, 0.008, 0, 2.592, 0, C.terracotta, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 20))
parts.push(cyl(0.09, 0.09, 0.01, 0, 2.594, 0, '#3b3733', { mat: 'matte' }, 16))

// Galvanised strap bands with rivets.
for (const sy of [0.72, 1.32, 1.92]) {
  parts.push(box(0.575, 0.025, 0.575, 0, sy, 0, METAL, { mat: 'metal' }))
}
for (const sy of [0.72, 1.32, 1.92]) {
  for (const sx of [-1, 1]) {
    parts.push(cyl(0.009, 0.009, 0.012, sx * 0.18, sy, 0.29, '#9aa1a4', { mat: 'metal' }, 8))
  }
}

// 检修门: recessed metal clean-out door with frame, hinges, handle and sill.
parts.push(box(0.3, 0.4, 0.02, 0, 0.8, 0.276, MORTAR, { mat: 'stone' }))
parts.push(box(0.24, 0.34, 0.03, 0, 0.8, 0.29, DOOR, { mat: 'metal' }))
parts.push(box(0.3, 0.03, 0.03, 0, 0.995, 0.286, METAL, { mat: 'metal' }))
parts.push(box(0.3, 0.03, 0.03, 0, 0.605, 0.286, METAL, { mat: 'metal' }))
parts.push(box(0.03, 0.42, 0.03, -0.135, 0.8, 0.286, METAL, { mat: 'metal' }))
parts.push(box(0.03, 0.42, 0.03, 0.135, 0.8, 0.286, METAL, { mat: 'metal' }))
parts.push(box(0.04, 0.02, 0.02, 0.085, 0.8, 0.312, METAL, { mat: 'metal' }))
for (const hy of [0.72, 0.88]) {
  parts.push(box(0.016, 0.05, 0.02, -0.118, hy, 0.306, '#9aa1a4', { mat: 'metal' }))
}
parts.push(box(0.36, 0.03, 0.06, 0, 0.585, 0.29, CONCRETE, { mat: 'stone' }))

// Cap drip grooves on the projecting cap slab.
for (const sx of [-1, 1]) {
  parts.push(box(0.008, 0.012, 0.72, sx * 0.357, 2.345, 0, '#7b776c', { mat: 'stone' }))
}

export default defineModel({
  id: 'chimney',
  name: '烟囱',
  category: 'structure',
  tags: ['chimney', 'flue', 'brick', '烟囱', '烟道', '砖砌', '检修门'],
  footprint: [0.8, 0.8],
  height: 2.6,
  placement: 'any',
  parts,
})
