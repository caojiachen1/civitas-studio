import { C, box, cyl, defineModel, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []
const COLS = [-0.92, -0.46, 0, 0.46, 0.92]
const ROWS = [0.4, 0.95, 1.5]

// 2.4 x 0.5 x 1.95 cabinet, 3 rows x 5 lockers (0.42 x 0.50 doors), canopy to 2.3 m
parts.push(box(2.5, 0.12, 0.64, 0, 0.06, 0, '#a8a59d', { mat: 'stone' }))
parts.push(box(2.46, 0.03, 0.6, 0, 0.13, 0, C.graphite, { mat: 'metal' }))
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(cyl(0.02, 0.02, 0.02, sx * 1.05, 0.05, sz * 0.24, C.steel, { mat: 'metal' }, 8))
  }
}

// cabinet shell and dark recessed face
parts.push(rounded(2.4, 1.95, 0.5, 0.03, 0, 1.1, 0, C.navy, { mat: 'gloss' }))
parts.push(box(2.34, 1.86, 0.016, 0, 1.11, 0.251, '#2f363c', { mat: 'matte' }))
parts.push(box(0.035, 1.95, 0.02, -1.18, 1.1, 0.253, C.graphite, { mat: 'metal' }))
parts.push(box(0.035, 1.95, 0.02, 1.18, 1.1, 0.253, C.graphite, { mat: 'metal' }))

// fifteen locker doors, handles, status LEDs and number plates
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 5; c++) {
    const x = COLS[c]
    const y = ROWS[r]
    parts.push(rounded(0.42, 0.5, 0.022, 0.01, x, y, 0.266, '#c9cdc4', { mat: 'gloss' }))
    parts.push(box(0.34, 0.006, 0.004, x, y + 0.24, 0.278, '#8f968f'))
    parts.push(box(0.032, 0.13, 0.028, x + 0.16, y - 0.02, 0.286, C.graphite, { mat: 'metal' }))
    parts.push(cyl(0.008, 0.008, 0.008, x + 0.16, y + 0.13, 0.28, '#79d6b1', { mat: 'emissive' }, 8))
    parts.push(box(0.11, 0.022, 0.008, x - 0.11, y - 0.185, 0.28, C.cream, { mat: 'matte' }))
    parts.push(box(0.06, 0.006, 0.004, x - 0.11, y - 0.185, 0.286, C.ink))
  }
}

// touch screen in the header band, with bezel and UI bars
parts.push(rounded(0.68, 0.24, 0.05, 0.015, 0, 1.88, 0.265, C.graphite, { mat: 'metal' }))
parts.push(box(0.58, 0.16, 0.012, 0, 1.88, 0.294, '#dfeae4', { mat: 'emissive' }))
parts.push(box(0.34, 0.022, 0.006, -0.08, 1.915, 0.302, C.navy))
parts.push(box(0.22, 0.016, 0.006, -0.14, 1.876, 0.302, '#6f9a86'))
parts.push(box(0.1, 0.03, 0.006, 0.21, 1.86, 0.302, C.navy))
parts.push(rounded(0.22, 0.075, 0.012, 0.008, 0, 1.78, 0.27, C.cream, { mat: 'matte' }))
parts.push(box(0.16, 0.012, 0.004, 0, 1.79, 0.278, C.red))

// rain canopy with drip edge and brackets
parts.push(rounded(2.56, 0.08, 0.78, 0.02, 0, 2.11, 0, C.graphite, { mat: 'metal' }))
parts.push(box(2.56, 0.035, 0.05, 0, 2.075, 0.375, C.steel, { mat: 'metal' }))
for (const side of [-1, 1]) {
  parts.push(cyl(0.02, 0.02, 0.18, side * 1.12, 2.0, 0.3, C.steel, { mat: 'metal', rot: [Math.PI / 4, 0, 0] }, 8))
}

// illuminated brand sign above the canopy
parts.push(rounded(1.3, 0.15, 0.06, 0.02, 0, 2.23, 0.26, C.cream, { mat: 'matte' }))
parts.push(box(0.72, 0.03, 0.008, -0.14, 2.24, 0.294, C.navy))
parts.push(box(0.4, 0.018, 0.008, -0.3, 2.2, 0.294, '#6f9a86'))
parts.push(box(0.18, 0.06, 0.008, 0.44, 2.23, 0.294, C.red))
parts.push(cyl(0.012, 0.012, 0.02, 0, 2.23, 0.23, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8))

// side vent louvres and leveling foot
for (let i = 0; i < 4; i++) {
  parts.push(box(0.006, 0.03, 0.3, 1.203, 0.35 + i * 0.05, 0, C.graphite, { mat: 'metal' }))
}
parts.push(box(0.006, 0.02, 0.3, -1.203, 0.4, 0, C.graphite, { mat: 'metal' }))
parts.push(cyl(0.03, 0.03, 0.1, 0, 0.05, -0.28, C.steel, { mat: 'metal' }, 10))
parts.push(box(0.09, 0.12, 0.02, 0.4, 1.88, 0.29, C.graphite, { mat: 'metal' }))
parts.push(box(0.05, 0.06, 0.006, 0.4, 1.88, 0.302, '#79d6b1', { mat: 'emissive' }))

export default defineModel({
  id: 'parcel-locker',
  name: '快递柜',
  category: 'street',
  tags: ['parcel', 'locker', 'delivery', '快递柜', '储物柜'],
  footprint: [2.6, 0.8],
  height: 2.3,
  placement: 'outdoor',
  parts,
})
