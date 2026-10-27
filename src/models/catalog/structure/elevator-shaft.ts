import { C, box, cyl, defineModel, torus } from '../../kit'
import type { Part } from '../../../editor/types'

// Open steel elevator shaft: four-post frame with glazed back and sides, a
// twin-panel sliding door on the +z face, call station, floor indicator and
// visible car guide rails inside the enclosure.
const STEEL = '#5f686c'
const STEEL_DARK = '#3d4245'
const CONCRETE = '#a9a79f'
const DOOR = '#a8afb2'
const DISPLAY = '#2f3335'
const LAMP = '#d8d3c2'
const GLASS = C.glass

const SH = 3.2
const HALF = 1.03
const parts: Part[] = []

// Four corner columns.
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(box(0.14, SH, 0.14, sx * HALF, SH / 2, sz * HALF, STEEL, { mat: 'metal' }))
  }
}

// Perimeter rings: base, mid landing and head.
function ring(y: number, h: number, t: number) {
  for (const sz of [-1, 1]) {
    parts.push(box(2.2, h, t, 0, y, sz * HALF, STEEL_DARK, { mat: 'metal' }))
  }
  for (const sx of [-1, 1]) {
    parts.push(box(t, h, 1.92, sx * HALF, y, 0, STEEL_DARK, { mat: 'metal' }))
  }
}
ring(0.06, 0.12, 0.14)
ring(1.5, 0.08, 0.1)
ring(3.14, 0.12, 0.14)

// Side cross braces in the yz plane.
for (const sx of [-1, 1]) {
  parts.push(box(0.05, 0.05, 1.9, sx * 1.04, 0.8, 0, STEEL, { mat: 'metal', rot: [0.55, 0, 0] }))
}

// Glazing on three sides, with mullions and a transom.
parts.push(box(1.9, 2.55, 0.02, 0, 1.42, -HALF, GLASS, { mat: 'glass' }))
for (const sx of [-1, 1]) {
  parts.push(box(0.02, 2.55, 1.9, sx * HALF, 1.42, 0, GLASS, { mat: 'glass' }))
}
for (const sx of [-1, 1]) {
  parts.push(box(0.04, 2.55, 0.04, sx * 0.62, 1.42, -HALF, STEEL_DARK, { mat: 'metal' }))
  for (const sz of [-1, 1]) {
    parts.push(box(0.04, 2.55, 0.04, sx * HALF, 1.42, sz * 0.62, STEEL_DARK, { mat: 'metal' }))
  }
}
parts.push(box(1.9, 0.04, 0.05, 0, 1.42, -1.025, STEEL_DARK, { mat: 'metal' }))
for (const sx of [-1, 1]) {
  parts.push(box(0.05, 0.04, 1.9, sx * 1.025, 1.42, 0, STEEL_DARK, { mat: 'metal' }))
}

// Sliding door: two brushed panels with recessed grooves.
for (const sx of [-1, 1]) {
  parts.push(box(0.54, 2.02, 0.05, sx * 0.275, 1.06, 1.05, DOOR, { mat: 'metal' }))
  parts.push(box(0.42, 1.55, 0.008, sx * 0.275, 1.08, 1.079, STEEL_DARK, { mat: 'metal' }))
}

// Door frame, casing and the header panel above the opening.
for (const sx of [-1, 1]) {
  parts.push(box(0.1, 2.2, 0.12, sx * 0.61, 1.1, 1.03, STEEL, { mat: 'metal' }))
  parts.push(box(0.09, 2.36, 0.03, sx * 0.7, 1.18, 1.075, STEEL_DARK, { mat: 'metal' }))
}
parts.push(box(1.32, 0.14, 0.12, 0, 2.17, 1.03, STEEL, { mat: 'metal' }))
parts.push(box(1.5, 0.12, 0.03, 0, 2.39, 1.075, STEEL_DARK, { mat: 'metal' }))
parts.push(box(1.36, 0.38, 0.08, 0, 2.58, 1.04, STEEL_DARK, { mat: 'metal' }))

// 楼层指示器: dark display, three warm segments and two arrow keys.
parts.push(box(0.34, 0.16, 0.012, 0, 2.6, 1.085, DISPLAY, { mat: 'gloss' }))
parts.push(box(0.06, 0.012, 0.006, 0, 2.63, 1.092, LAMP, { mat: 'matte' }))
parts.push(box(0.06, 0.012, 0.006, 0, 2.6, 1.092, LAMP, { mat: 'matte' }))
parts.push(box(0.012, 0.05, 0.006, -0.03, 2.615, 1.092, LAMP, { mat: 'matte' }))
for (const sx of [-1, 1]) {
  parts.push(box(0.05, 0.025, 0.008, sx * 0.22, 2.6, 1.088, LAMP, { mat: 'matte', rot: [0, 0, Math.PI / 4] }))
}

// 呼叫按钮 on the right casing: plate, button and brass ring.
parts.push(box(0.1, 0.26, 0.006, 0.72, 1.15, 1.091, STEEL_DARK, { mat: 'metal' }))
parts.push(cyl(0.028, 0.028, 0.006, 0.72, 1.19, 1.097, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14))
parts.push(torus(0.038, 0.004, 0.72, 1.19, 1.096, C.brass, { mat: 'metal' }, 18))

// Door track, floor sill and the concrete threshold.
parts.push(box(1.2, 0.06, 0.08, 0, 2.1, 1.05, STEEL, { mat: 'metal' }))
parts.push(box(1.3, 0.02, 0.16, 0, 0.01, 1.02, CONCRETE, { mat: 'stone' }))

// 导轨: T-section car rails with brackets, visible through the glazing.
for (const sx of [-1, 1]) {
  parts.push(box(0.02, 2.7, 0.1, sx * 0.58, 1.4, -0.55, STEEL, { mat: 'metal' }))
  parts.push(box(0.1, 2.7, 0.02, sx * 0.58, 1.4, -0.61, STEEL_DARK, { mat: 'metal' }))
  parts.push(box(0.12, 0.04, 0.1, sx * 0.58, 0.45, -0.66, STEEL, { mat: 'metal' }))
}

// Machine unit, sheave and the counterweight.
parts.push(box(0.5, 0.22, 0.36, 0, 2.92, -0.4, STEEL_DARK, { mat: 'metal' }))
parts.push(cyl(0.15, 0.15, 0.06, 0, 2.75, -0.4, STEEL, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 20))
parts.push(box(0.18, 0.6, 0.12, 0.82, 1.6, -0.55, STEEL, { mat: 'metal' }))

// Anchor bolts at the front feet.
for (const sx of [-1, 1]) {
  parts.push(cyl(0.014, 0.014, 0.03, sx * 0.9, 0.135, 1.03, C.brass, { mat: 'metal' }, 8))
}

export default defineModel({
  id: 'elevator-shaft',
  name: '电梯井',
  category: 'structure',
  tags: ['elevator', 'lift', 'shaft', 'elevator shaft', '电梯井', '电梯', '井道', '导轨'],
  footprint: [2.2, 2.2],
  height: 3.2,
  placement: 'indoor',
  parts,
})
