import { defineModel, box } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * Zebra crossing, 4m wide x 7.2m long.
 * Eight 4 x 0.45m bars at 0.9m pitch (0.45m paint, 0.45m gap) plus a 0.3m
 * stop line, all 20mm thick and laid on the ground. Each bar is laid as four
 * 1m thermoplastic bays with a 6mm construction seam, so the 4m run closes
 * exactly on the footprint and still reads as one continuous stripe.
 */
const WIDTH = 4
const BAR_W = 0.45
const PITCH = 0.9
const THICK = 0.02
const BAY_W = 0.994
const BAY_X = [-1.5, -0.5, 0.5, 1.5]
const PAINT = '#f2f2ee'
const parts: Part[] = []

// eight bars, first one starting at z = -3.6
for (let i = 0; i < 8; i++) {
  const z = -3.6 + BAR_W / 2 + i * PITCH
  for (const x of BAY_X) {
    parts.push(box(BAY_W, THICK, BAR_W, x, THICK / 2, z, PAINT, { mat: 'matte' }))
  }
}

// stop line 0.3m deep, 0.15m beyond the last bar
for (const x of BAY_X) {
  parts.push(box(BAY_W, THICK, 0.3, x, THICK / 2, 3.45, PAINT, { mat: 'matte' }))
}

export default defineModel({
  id: 'crosswalk',
  name: '斑马线',
  category: 'infrastructure',
  tags: ['crosswalk', 'zebra', 'road marking', '斑马线', '人行横道', '标线'],
  footprint: [WIDTH, 7.2],
  height: 0.02,
  placement: 'on-road',
  parts,
})
