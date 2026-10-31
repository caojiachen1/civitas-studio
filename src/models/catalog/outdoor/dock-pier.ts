import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []

// 2.4 m x 8 m deck, 0.14 m boards at 0.16 m centres (0.02 m gaps), platform to 4.3 m
const DECK_TOP = 0.42
for (let i = 0; i < 50; i++) {
  const z = -4.22 + i * 0.16
  const len = 2.38 + (i % 3) * 0.02
  const color = i % 11 === 0 ? C.walnut : i % 4 === 0 ? '#a97f51' : C.oak
  parts.push(box(len, 0.045, 0.14, 0, DECK_TOP - 0.0225, z, color, { mat: 'wood' }))
}
for (let i = 0; i < 4; i++) {
  parts.push(box(2.78, 0.045, 0.14, 0, DECK_TOP - 0.0225, 3.78 + i * 0.15, C.oak, { mat: 'wood' }))
}

// longitudinal stringers and platform bearers
for (const x of [-0.8, 0, 0.8]) {
  parts.push(box(0.12, 0.16, 7.9, x, 0.3, -0.3, C.walnut, { mat: 'wood' }))
  parts.push(box(0.12, 0.16, 0.55, x, 0.3, 4.0, C.walnut, { mat: 'wood' }))
}
for (const x of [-1.19, 1.19]) {
  parts.push(box(0.05, 0.12, 7.95, x, 0.38, -0.3, C.walnut, { mat: 'wood' }))
}

// five pairs of Ø0.2 piles, 0.9 m proud of the deck, with caps and cross heads
const PILES = [-4.1, -2.1, -0.1, 1.9, 3.9]
for (const z of PILES) {
  for (const x of [-1.15, 1.15]) {
    parts.push(cyl(0.1, 0.1, 1.3, x, 0.65, z, C.walnut, { mat: 'wood' }, 14))
    parts.push(cyl(0.12, 0.12, 0.03, x, 1.285, z, '#5c4130', { mat: 'wood' }, 14))
  }
  parts.push(box(2.5, 0.08, 0.16, 0, 0.32, z, C.walnut, { mat: 'wood' }))
}

// cross bracing between pile pairs
for (const x of [-1.15, 1.15]) {
  for (const dir of [-1, 1]) {
    parts.push(cyl(0.035, 0.035, 2.12, x, 0.55, -3.1, '#6f4e36', { mat: 'wood', rot: [dir * 1.91, 0, 0] }, 8))
  }
}

// four timber mooring cleats
for (const z of [-2.6, 2.9]) {
  for (const x of [-1.0, 1.0]) {
    parts.push(box(0.18, 0.025, 0.18, x, DECK_TOP + 0.0125, z, C.graphite, { mat: 'metal' }))
    parts.push(cyl(0.06, 0.07, 0.2, x, DECK_TOP + 0.125, z, C.walnut, { mat: 'wood' }, 12))
    parts.push(cyl(0.09, 0.06, 0.04, x, DECK_TOP + 0.245, z, C.oak, { mat: 'wood' }, 12))
  }
}

// entry ladder at the platform end
for (const x of [-0.25, 0.25]) {
  parts.push(cyl(0.022, 0.022, 0.46, x, 0.23, 4.31, C.steel, { mat: 'metal' }, 8))
}
for (let i = 0; i < 4; i++) {
  parts.push(box(0.5, 0.03, 0.035, 0, 0.08 + i * 0.1, 4.31, C.steel, { mat: 'metal' }))
}

// worn rope coil parked on the landing
parts.push(cyl(0.16, 0.16, 0.06, 1.05, DECK_TOP + 0.03, 4.16, '#b9a07a', { mat: 'matte' }, 14))
parts.push(cyl(0.1, 0.1, 0.07, 1.05, DECK_TOP + 0.065, 4.16, '#9d8460', { mat: 'matte' }, 12))

export default defineModel({
  id: 'dock-pier',
  name: '木栈桥码头',
  category: 'outdoor',
  tags: ['pier', 'dock', 'jetty', '码头', '栈桥', '木栈道'],
  footprint: [2.8, 8.6],
  height: 1.3,
  placement: 'outdoor',
  parts,
})
