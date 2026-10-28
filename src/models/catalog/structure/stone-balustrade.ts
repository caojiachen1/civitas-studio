import { box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

// Warm limestone balustrade: continuous plinth, vase balusters between three
// posts, moulded handrail and visible mortise seams at the rail joints.
const STONE = '#b4b0a4'
const STONE_DARK = '#918d81'
const STONE_LIGHT = '#c7c2b3'
const MORTAR = '#7f7c72'
const SEAM = '#6e6b62'

const parts: Part[] = []

// 地栿: two-course plinth with a recessed mortar joint.
parts.push(box(2.4, 0.08, 0.32, 0, 0.04, 0, STONE_DARK, { mat: 'stone' }))
parts.push(box(2.34, 0.02, 0.3, 0, 0.09, 0, MORTAR, { mat: 'stone' }))
parts.push(box(2.36, 0.05, 0.3, 0, 0.115, 0, STONE, { mat: 'stone' }))

// Lower rail (地栿上枋) with a chamfered top edge.
parts.push(box(2.32, 0.025, 0.26, 0, 0.1475, 0, STONE_DARK, { mat: 'stone' }))
parts.push(box(2.26, 0.09, 0.22, 0, 0.195, 0, STONE, { mat: 'stone' }))
parts.push(box(2.2, 0.015, 0.2, 0, 0.2475, 0, STONE_LIGHT, { mat: 'stone' }))

// Upper handrail: bead, deep rail body and a slightly wider coping.
parts.push(box(2.22, 0.025, 0.21, 0, 0.9525, 0, STONE_DARK, { mat: 'stone' }))
parts.push(box(2.2, 0.11, 0.24, 0, 1.02, 0, STONE, { mat: 'stone' }))
parts.push(box(2.26, 0.045, 0.28, 0, 1.0975, 0, STONE_LIGHT, { mat: 'stone' }))

// 宝瓶柱: 8 turned balusters, 4 in each bay between the posts.
const BALUSTER_X = [0.215, 0.415, 0.615, 0.815]
for (const side of [-1, 1]) {
  for (const bx of BALUSTER_X) {
    const x = side * bx
    parts.push(cyl(0.055, 0.065, 0.05, x, 0.27, 0, STONE, { mat: 'stone' }, 14))
    parts.push(cyl(0.078, 0.05, 0.18, x, 0.385, 0, STONE_LIGHT, { mat: 'stone' }, 14))
    parts.push(cyl(0.036, 0.05, 0.4, x, 0.675, 0, STONE, { mat: 'stone' }, 14))
    parts.push(cyl(0.058, 0.038, 0.06, x, 0.905, 0, STONE_LIGHT, { mat: 'stone' }, 14))
  }
}

// 望柱: end posts plus a centre post, each with base, shaft, neck, cap and
// a recessed carved panel on the outer face.
const POST_X = [-1.06, 0, 1.06]
for (const px of POST_X) {
  parts.push(box(0.26, 0.09, 0.3, px, 0.185, 0, STONE, { mat: 'stone' }))
  parts.push(box(0.2, 0.72, 0.22, px, 0.59, 0, STONE, { mat: 'stone' }))
  parts.push(box(0.24, 0.03, 0.26, px, 0.965, 0, STONE_LIGHT, { mat: 'stone' }))
  parts.push(box(0.28, 0.06, 0.3, px, 1.01, 0, STONE, { mat: 'stone' }))
  parts.push(box(0.2, 0.08, 0.22, px, 1.08, 0, STONE_LIGHT, { mat: 'stone' }))
  parts.push(box(0.1, 0.3, 0.012, px, 0.58, 0.116, STONE_DARK, { mat: 'stone' }))
}

// 榫接缝: dark joints where the rail sections are pegged together.
for (const sx of [-0.56, 0.56]) {
  parts.push(box(0.008, 0.115, 0.245, sx, 1.02, 0, SEAM, { mat: 'stone' }))
  parts.push(box(0.008, 0.085, 0.225, sx, 0.195, 0, SEAM, { mat: 'stone' }))
}

// Carved rosettes enliven the post panels.
for (const px of POST_X) {
  parts.push(cyl(0.052, 0.052, 0.012, px, 0.58, 0.123, STONE_LIGHT, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 16))
  parts.push(sphere(0.017, px, 0.58, 0.133, STONE, { mat: 'stone' }, 10))
}

// Ground-line grime and lead caps over the rail joints.
for (const sz of [-1, 1]) {
  parts.push(box(2.34, 0.024, 0.006, 0, 0.012, sz * 0.162, '#6f6c63', { mat: 'stone' }))
}
for (const sx of [-0.56, 0.56]) {
  parts.push(box(0.03, 0.006, 0.28, sx, 1.121, 0, '#7d7a70', { mat: 'metal' }))
}

export default defineModel({
  id: 'stone-balustrade',
  name: '石栏杆',
  category: 'structure',
  tags: ['stone balustrade', 'balustrade', 'railing', 'stone', '石栏杆', '望柱', '宝瓶柱', '栏杆'],
  footprint: [2.4, 0.32],
  height: 1.12,
  placement: 'any',
  parts,
})
