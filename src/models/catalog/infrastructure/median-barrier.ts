import { C, box, cyl, defineModel, ico } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 6m central reservation, long axis on Z.
 * 1.2 x 0.35 concrete base, 0.13 high planting kerbs, soil bed,
 * six clipped shrubs and six anti-glare panels (0.55 high) between
 * seven 0.05 square posts that reach 1.10m.
 */
const MODULE_LEN = 6
const BASE_H = 0.35
const PANEL_BOTTOM = 0.55
const PANEL_TOP = 1.1
const POST_Z = [-3, -2, -1, 0, 1, 2, 3]
const parts: Part[] = []

// base and planting trough
parts.push(box(1.2, BASE_H, MODULE_LEN, 0, BASE_H / 2, 0, C.concrete, { mat: 'stone' }))
for (const x of [-0.5, 0.5]) {
  parts.push(box(0.16, 0.13, 5.9, x, 0.415, 0, C.concrete, { mat: 'stone' }))
  parts.push(box(0.18, 0.02, 5.9, x, 0.49, 0, '#c6c4bd', { mat: 'stone' }))
}
parts.push(box(0.82, 0.12, 5.84, 0, 0.41, 0, C.soil, { mat: 'matte' }))

// trough end walls
for (const z of [-2.95, 2.95]) {
  parts.push(box(0.82, 0.14, 0.06, 0, 0.42, z, C.concrete, { mat: 'stone' }))
}

// transverse joints on the outer faces
for (const z of [-2, 2]) {
  for (const x of [-0.601, 0.601]) {
    parts.push(box(0.004, 0.3, 0.012, x, 0.18, z, '#8f8d86', { mat: 'stone' }))
  }
}

// end-face reflectors
for (const z of [-3.001, 3.001]) {
  parts.push(box(0.12, 0.1, 0.006, -0.3, 0.25, z, '#f2f2ee', { mat: 'gloss' }))
  parts.push(box(0.12, 0.1, 0.006, 0.3, 0.25, z, '#c4453c', { mat: 'gloss' }))
}

// central posts with base plates and two anchors each
for (const z of POST_Z) {
  parts.push(box(0.05, 0.75, 0.05, 0, 0.725, z, C.graphite, { mat: 'metal' }))
  parts.push(box(0.12, 0.02, 0.12, 0, 0.36, z, C.graphite, { mat: 'metal' }))
  for (const dx of [-0.038, 0.038]) {
    parts.push(cyl(0.008, 0.008, 0.02, dx, 0.38, z, C.steel, { mat: 'metal' }, 8))
  }
}

// anti-glare panels, one per bay, resting against both posts
for (let i = 0; i < 6; i++) {
  const z = -2.5 + i
  parts.push(box(0.02, PANEL_TOP - PANEL_BOTTOM, 0.95, 0, (PANEL_BOTTOM + PANEL_TOP) / 2, z, '#4a5f4d', { mat: 'matte' }))
}

// six low shrubs, two ico lobes each, embedded in the soil
const SHRUB_Z = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]
SHRUB_Z.forEach((z, i) => {
  const x = i % 2 === 0 ? 0.2 : -0.2
  parts.push(ico(0.2, x, 0.58, z, C.leaf, { mat: 'foliage' }, 1))
  parts.push(ico(0.12, x - Math.sign(x) * 0.12, 0.62, z + 0.12, C.leafDeep, { mat: 'foliage' }, 1))
})

export default defineModel({
  id: 'median-barrier',
  name: '中央分隔带',
  category: 'infrastructure',
  tags: ['median', 'barrier', 'anti-glare', '中央分隔带', '高速公路', '绿化'],
  footprint: [1.2, 6],
  height: 1.1,
  placement: 'outdoor',
  parts,
})
