import { C, box, cyl, defineModel, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []
const DECK = 0.8
const GLOW = '#ffe9c4'

// 8 x 5 m stage, 0.8 m high, 25 deck boards at 0.2 m centres, three front steps
parts.push(box(7.96, 0.72, 4.96, 0, 0.36, -0.5, C.walnut, { mat: 'wood' }))
for (let i = 0; i < 25; i++) {
  const z = -2.9 + i * 0.2
  parts.push(box(8, 0.045, 0.18, 0, DECK - 0.0225, z, i % 6 === 0 ? '#a97f51' : C.oak, { mat: 'wood' }))
}
parts.push(box(8.04, 0.1, 0.05, 0, 0.74, 1.99, C.ink, { mat: 'gloss' }))
for (const x of [-4.01, 4.01]) {
  parts.push(box(0.05, 0.68, 4.96, x, 0.34, -0.5, C.ink, { mat: 'gloss' }))
}
for (let i = 0; i < 3; i++) {
  const h = 0.2 * (3 - i)
  parts.push(box(3, h, 0.4167, 0, h / 2, 2.2083 + i * 0.4167, C.walnut, { mat: 'wood' }))
  parts.push(box(3.06, 0.03, 0.05, 0, h + 0.005, 2.4167 + i * 0.4167, C.ink, { mat: 'gloss' }))
  parts.push(box(2.7, 0.012, 0.012, 0, h + 0.024, 2.412 + i * 0.4167, '#e0b23a', { mat: 'emissive' }))
}

// rear truss: two towers, three chords, diagonal braces and rigging clamps
for (const x of [-3.4, 3.4]) {
  parts.push(box(0.45, 0.05, 0.3, x, DECK + 0.025, -2.85, C.graphite, { mat: 'metal' }))
  parts.push(box(0.12, 3.35, 0.12, x, DECK + 1.675, -2.85, C.steel, { mat: 'metal' }))
  parts.push(box(0.2, 0.06, 0.2, x, 4.18, -2.85, C.graphite, { mat: 'metal' }))
}
for (const y of [1.55, 2.75, 4.05]) {
  parts.push(box(6.92, 0.1, 0.1, 0, y, -2.85, C.steel, { mat: 'metal' }))
}
for (const side of [-1, 1]) {
  parts.push(cyl(0.026, 0.026, 2.5, side * 2.3, 2.15, -2.85, C.steel, { mat: 'metal', rot: [0, 0, side * 1.07] }, 8))
  parts.push(cyl(0.026, 0.026, 2.5, side * 2.3, 3.35, -2.85, C.steel, { mat: 'metal', rot: [0, 0, -side * 1.07] }, 8))
}
for (const x of [-2.0, 2.0]) {
  parts.push(rounded(0.18, 0.07, 0.14, 0.02, x, 4.08, -2.85, C.blackMetal, { mat: 'metal' }))
  parts.push(cyl(0.015, 0.015, 0.08, x, 4.15, -2.85, C.steel, { mat: 'metal' }, 8))
  parts.push(box(0.08, 0.04, 0.08, x, 4.21, -2.85, '#ffe9c4', { mat: 'emissive' }))
}

// PA stacks flanking the stage on the ground
for (const side of [-1, 1]) {
  parts.push(box(0.5, 0.8, 0.62, side * 4.24, 0.4, 0.9, C.ink, { mat: 'gloss' }))
  parts.push(box(0.46, 0.5, 0.52, side * 4.24, 1.05, 0.9, C.ink, { mat: 'gloss' }))
  parts.push(box(0.4, 0.16, 0.06, side * 4.24, 1.38, 1.18, C.blackMetal, { mat: 'metal' }))
  parts.push(box(0.44, 0.03, 0.02, side * 4.24, 0.08, 1.22, C.steel, { mat: 'metal' }))
}

// four footlights at the downstage edge
for (const x of [-2.4, -0.8, 0.8, 2.4]) {
  parts.push(rounded(0.18, 0.04, 0.18, 0.01, x, DECK + 0.02, 1.86, C.graphite, { mat: 'metal' }))
  parts.push(cyl(0.018, 0.018, 0.1, x, DECK + 0.09, 1.86, C.steel, { mat: 'metal' }, 8))
  parts.push(rounded(0.2, 0.11, 0.19, 0.03, x, DECK + 0.16, 1.86, C.blackMetal, { mat: 'metal' }))
  parts.push(box(0.15, 0.02, 0.13, x, DECK + 0.105, 1.86, GLOW, { mat: 'emissive' }))
  parts.push(box(0.05, 0.04, 0.04, x + 0.09, DECK + 0.16, 1.86, C.steel, { mat: 'metal' }))
  parts.push(cyl(0.008, 0.008, 0.1, x, DECK + 0.2, 1.83, C.steel, { mat: 'metal', rot: [0.6, 0, 0] }, 6))
}

// monitor wedges facing the performers and a cable run
for (const x of [-2.2, 2.2]) {
  parts.push(rbox(0.5, 0.26, 0.36, 0.03, x, DECK + 0.13, 0.55, C.ink, { mat: 'gloss', side: 'double' }))
  parts.push(box(0.4, 0.03, 0.28, x, DECK + 0.28, 0.55, C.blackMetal, { mat: 'metal' }))
}
parts.push(box(7.6, 0.035, 0.035, 0, DECK + 0.0175, -2.55, C.graphite, { mat: 'matte' }))
parts.push(box(0.06, 0.05, 0.18, 2.9, DECK + 0.025, -2.62, C.steel, { mat: 'metal' }))

export default defineModel({
  id: 'outdoor-stage',
  name: '露天舞台',
  category: 'outdoor',
  tags: ['stage', 'concert', 'amphitheatre', '舞台', '演出', '桁架'],
  footprint: [9, 6.5],
  height: 4.2,
  placement: 'outdoor',
  parts,
})
