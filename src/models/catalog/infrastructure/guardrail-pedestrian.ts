import { box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 2.5m galvanised pedestrian guardrail, long axis on Z.
 * Two Ø0.05 rails between 0.08 square posts, Ø0.018 bars every 0.12m,
 * base plate and four anchors at each post. Top of the top rail is 1.10m.
 */
const MODULE_LEN = 2.5
const POST = 0.08
const POST_H = 1.1
const END_Z = MODULE_LEN / 2 - POST / 2
const RAIL_LEN = MODULE_LEN - POST * 2
const TOP_RAIL_Y = 1.075
const BOTTOM_RAIL_Y = 0.22
const GALV = '#b9bec1'

const parts: Part[] = []

for (const z of [-END_Z, END_Z]) {
  parts.push(box(POST, POST_H, POST, 0, POST_H / 2, z, GALV, { mat: 'metal' }))
  parts.push(box(0.12, 0.02, 0.12, 0, 0.01, z, '#8e969b', { mat: 'metal' }))
  parts.push(box(0.09, 0.01, 0.09, 0, 1.095, z, '#8e969b', { mat: 'metal' }))
  for (const dx of [-0.042, 0.042]) {
    for (const dz of [-0.042, 0.042]) {
      parts.push(cyl(0.009, 0.009, 0.016, dx, 0.028, z + dz, '#6f777c', { mat: 'metal' }, 8))
    }
  }
}

// two horizontal rails running between the posts
for (const y of [TOP_RAIL_Y, BOTTOM_RAIL_Y]) {
  parts.push(
    cyl(0.025, 0.025, RAIL_LEN, 0, y, 0, GALV, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
  )
  // collars where the rails meet the posts
  for (const z of [-1.15, 1.15]) {
    parts.push(
      cyl(0.032, 0.032, 0.04, 0, y, z, '#8e969b', { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    )
  }
}

// vertical bars, 20 at 0.12m centres between the posts
const BAR_Z0 = -1.14
for (let i = 0; i < 20; i++) {
  const z = BAR_Z0 + i * 0.12
  parts.push(cyl(0.009, 0.009, 0.88, 0, 0.635, z, GALV, { mat: 'metal' }, 8))
}

export default defineModel({
  id: 'guardrail-pedestrian',
  name: '人行道钢护栏',
  category: 'infrastructure',
  tags: ['guardrail', 'pedestrian', 'steel', '护栏', '人行道', '镀锌'],
  footprint: [0.12, 2.5],
  height: 1.1,
  placement: 'outdoor',
  parts,
})
