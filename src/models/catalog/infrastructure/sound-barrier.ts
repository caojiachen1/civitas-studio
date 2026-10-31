import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 4m highway sound barrier, long axis on Z.
 * Two H-section steel posts (0.24 wide, 4.2 high) on 0.3 base plates,
 * 1m concrete plinth, four 0.75m glass panels with five horizontal rails,
 * and a 0.2m acoustic cap. Total height 4.2m, 4m module.
 */
const MODULE_LEN = 4
const POST_Z = [-1.9, 1.9]
const STEEL = '#b9bec1'
const PANEL_LEN = 3.66
const parts: Part[] = []

for (const z of POST_Z) {
  // H post: two flanges across X, recessed web along Z
  for (const dz of [-0.06, 0.06]) {
    parts.push(box(0.24, 4.17, 0.02, 0, 2.115, z + dz, STEEL, { mat: 'metal' }))
  }
  parts.push(box(0.03, 4.17, 0.1, 0, 2.115, z, STEEL, { mat: 'metal' }))
  parts.push(box(0.3, 0.03, 0.2, 0, 0.015, z, C.graphite, { mat: 'metal' }))

  for (const dx of [-0.11, 0.11]) {
    for (const dz of [-0.07, 0.07]) {
      parts.push(cyl(0.012, 0.012, 0.035, dx, 0.047, z + dz, C.steel, { mat: 'metal' }, 8))
    }
  }

  // base gussets between flange and base plate
  for (const dx of [-0.11, 0.11]) {
    parts.push(box(0.02, 0.3, 0.18, dx, 0.18, z, STEEL, { mat: 'metal' }))
  }

  // white / red reflectors screwed to the road-side flange
  parts.push(box(0.006, 0.12, 0.08, 0.123, 1.15, z, '#f2f2ee', { mat: 'gloss' }))
  parts.push(box(0.006, 0.12, 0.08, 0.123, 1.0, z, '#c4453c', { mat: 'gloss' }))
}

// 1m concrete plinth between the posts
parts.push(box(0.12, 1.0, PANEL_LEN, 0, 0.5, 0, C.concrete, { mat: 'stone' }))

// plinth formwork joints and weep holes
for (const z of [-0.9, 0.9]) {
  for (const x of [-0.061, 0.061]) {
    parts.push(box(0.004, 0.9, 0.012, x, 0.5, z, '#8f8d86', { mat: 'stone' }))
  }
}
for (const z of [-1.2, 1.2]) {
  parts.push(box(0.004, 0.03, 0.05, 0.061, 0.14, z, '#5f5e58', { mat: 'stone' }))
}

// four 3m-high acoustic glass panels, 0.75m each
for (let i = 0; i < 4; i++) {
  parts.push(box(0.04, 0.75, PANEL_LEN, 0, 1.375 + i * 0.75, 0, C.glass, { mat: 'glass' }))
}

// horizontal division rails at every panel joint
for (const y of [1.0, 1.75, 2.5, 3.25, 4.0]) {
  parts.push(box(0.08, 0.1, 3.7, 0.02, y, 0, STEEL, { mat: 'metal' }))
}

// acoustic cap with drip lips
parts.push(box(0.3, 0.16, MODULE_LEN, 0, 4.12, 0, STEEL, { mat: 'metal' }))
for (const x of [-0.15, 0.15]) {
  parts.push(box(0.02, 0.04, MODULE_LEN, x, 4.06, 0, C.graphite, { mat: 'metal' }))
}

export default defineModel({
  id: 'sound-barrier',
  name: '声屏障',
  category: 'infrastructure',
  tags: ['sound barrier', 'noise wall', 'highway', '声屏障', '隔音', '高速公路'],
  footprint: [0.3, 4],
  height: 4.2,
  placement: 'outdoor',
  parts,
})
