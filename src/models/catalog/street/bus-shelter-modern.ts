import { C, box, cyl, defineModel, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []
const FRAME = C.graphite
const GLOW = '#ffe9c4'

// 3.6 m glazed shelter: 4 posts, 3 back panes, 3-seat bench, 3.0 m roof
parts.push(box(3.8, 0.06, 1.7, 0, 0.03, 0, C.concrete, { mat: 'stone' }))
parts.push(box(3.0, 0.012, 0.24, 0, 0.066, 0.58, '#9a988f', { mat: 'stone' }))

for (const x of [-1.75, 1.75]) {
  for (const z of [-0.62, 0.62]) {
    parts.push(rounded(0.08, 2.76, 0.08, 0.012, x, 1.44, z, FRAME, { mat: 'metal' }))
    parts.push(rounded(0.18, 0.025, 0.18, 0.008, x, 0.073, z, C.steel, { mat: 'metal' }))
    parts.push(cyl(0.011, 0.011, 0.02, x + 0.05, 0.09, z, C.graphite, { mat: 'metal' }, 8))
    parts.push(cyl(0.011, 0.011, 0.02, x - 0.05, 0.09, z, C.graphite, { mat: 'metal' }, 8))
  }
}

// three back glass panes with mullions and top/bottom rails
for (const x of [-1.15, 0, 1.15]) {
  parts.push(box(1.06, 1.94, 0.02, x, 1.45, -0.63, C.glass, { mat: 'glass' }))
}
for (const x of [-0.575, 0.575]) {
  parts.push(rounded(0.06, 2.02, 0.07, 0.008, x, 1.45, -0.62, FRAME, { mat: 'metal' }))
}
parts.push(rounded(3.42, 0.06, 0.08, 0.01, 0, 0.47, -0.62, FRAME, { mat: 'metal' }))
parts.push(rounded(3.42, 0.06, 0.08, 0.01, 0, 2.45, -0.62, FRAME, { mat: 'metal' }))
for (const x of [-1.15, 0, 1.15]) {
  parts.push(box(1.0, 0.08, 0.006, x, 1.28, -0.617, '#e9e6dd', { mat: 'matte' }))
  parts.push(box(1.0, 0.08, 0.006, x, 1.43, -0.617, '#e9e6dd', { mat: 'matte' }))
}
// patch fittings at the pane corners
for (const x of [-1.7, -0.6, 0.6, 1.7]) {
  for (const y of [0.56, 2.36]) {
    parts.push(rounded(0.04, 0.05, 0.03, 0.006, x, y, -0.615, C.steel, { mat: 'metal' }))
  }
}

// flat metal roof, raised light monitor and drip fascia
parts.push(rounded(3.76, 0.08, 1.64, 0.03, 0, 2.86, 0, C.graphite, { mat: 'metal' }))
parts.push(rounded(3.5, 0.09, 0.9, 0.025, 0, 2.945, 0, C.steel, { mat: 'metal' }))
parts.push(box(3.44, 0.012, 0.84, 0, 2.995, 0, '#c3cac7', { mat: 'metal' }))
parts.push(box(3.76, 0.1, 0.045, 0, 2.88, 0.815, FRAME, { mat: 'metal' }))
parts.push(box(3.76, 0.1, 0.045, 0, 2.88, -0.815, FRAME, { mat: 'metal' }))

// three-seat timber bench on a steel frame
for (const x of [-0.82, 0, 0.82]) {
  parts.push(rounded(0.74, 0.06, 0.42, 0.015, x, 0.47, -0.26, C.oak, { mat: 'wood' }))
  parts.push(rounded(0.74, 0.27, 0.05, 0.015, x, 0.67, -0.45, C.oak, { mat: 'wood', rot: [-0.12, 0, 0] }))
  parts.push(rounded(0.7, 0.035, 0.3, 0.01, x, 0.42, -0.25, FRAME, { mat: 'metal' }))
}
for (const x of [-1.2, 0, 1.2]) {
  parts.push(rounded(0.055, 0.36, 0.44, 0.01, x, 0.25, -0.26, FRAME, { mat: 'metal' }))
  parts.push(rounded(0.16, 0.02, 0.16, 0.006, x, 0.071, -0.26, C.steel, { mat: 'metal' }))
}

// backlit advert panel on the right end, framed in metal
parts.push(rounded(0.16, 1.42, 0.96, 0.02, 1.62, 1.55, 0, FRAME, { mat: 'metal' }))
parts.push(box(0.012, 1.28, 0.84, 1.706, 1.55, 0, '#e8dfcb', { mat: 'emissive' }))
parts.push(box(0.012, 0.52, 0.56, 1.713, 1.64, 0.08, C.sage))
parts.push(box(0.012, 0.06, 0.6, 1.713, 1.24, -0.06, C.navy))
parts.push(box(0.012, 0.04, 0.4, 1.713, 1.15, 0.06, C.red))
for (const z of [-0.5, 0.5]) {
  parts.push(rounded(0.04, 1.46, 0.05, 0.008, 1.7, 1.55, z, C.steel, { mat: 'metal' }))
}

// hanging route board under the roof
for (const x of [-0.05, 0.85]) {
  parts.push(cyl(0.01, 0.01, 0.16, x, 2.74, 0.62, C.steel, { mat: 'metal' }, 8))
}
parts.push(rounded(1.1, 0.36, 0.05, 0.015, 0.4, 2.56, 0.63, C.cream, { mat: 'matte' }))
parts.push(box(0.62, 0.035, 0.008, 0.28, 2.63, 0.658, C.ink))
parts.push(box(0.42, 0.02, 0.008, 0.18, 2.57, 0.658, C.graphite))
parts.push(cyl(0.04, 0.04, 0.008, 0.77, 2.63, 0.66, C.red, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 16))
parts.push(cyl(0.04, 0.04, 0.008, 0.77, 2.54, 0.66, C.sage, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 16))

// timetable sheet behind the glass
parts.push(rounded(0.52, 0.72, 0.02, 0.01, 1.15, 1.55, -0.605, C.cream, { mat: 'matte' }))
for (let i = 0; i < 5; i++) {
  parts.push(box(0.34, 0.014, 0.004, 1.15, 1.76 - i * 0.09, -0.592, C.ink))
}

// twin LED battens under the roof
for (const x of [-0.9, 0.9]) {
  parts.push(rounded(0.72, 0.04, 0.09, 0.01, x, 2.79, 0.18, C.steel, { mat: 'metal' }))
  parts.push(box(0.62, 0.012, 0.05, x, 2.766, 0.18, GLOW, { mat: 'emissive' }))
}

// litter bin and tactile pad at the kerb
parts.push(cyl(0.13, 0.12, 0.46, 1.55, 0.29, 0.55, C.graphite, { mat: 'metal' }, 16))
parts.push(cyl(0.14, 0.14, 0.04, 1.55, 0.54, 0.55, C.steel, { mat: 'metal' }, 16))

export default defineModel({
  id: 'bus-shelter-modern',
  name: '现代公交候车亭',
  category: 'street',
  tags: ['bus', 'shelter', 'stop', '候车亭', '公交', '玻璃'],
  footprint: [3.8, 1.7],
  height: 3.0,
  placement: 'outdoor',
  parts,
})
