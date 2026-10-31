import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * Speed limit sign, 0.6m disc on a Ø0.076 pole.
 * White disc + red annulus + white centre, black "60" legend, rear frame
 * rails clamped to the pole, base plate with four anchors. Height 2.9m.
 */
const POLE_H = 2.6
const POLE_Z = -0.03
const SIGN_Y = 2.55
const parts: Part[] = []

// base plate, anchors, pole collar and pole
parts.push(box(0.2, 0.02, 0.2, 0, 0.01, 0, C.graphite, { mat: 'metal' }))
for (const dx of [-0.07, 0.07]) {
  for (const dz of [-0.07, 0.07]) {
    parts.push(cyl(0.009, 0.009, 0.016, dx, 0.028, dz, C.steel, { mat: 'metal' }, 8))
    parts.push(cyl(0.015, 0.015, 0.003, dx, 0.0215, dz, C.graphite, { mat: 'metal' }, 10))
  }
}
parts.push(cyl(0.055, 0.06, 0.06, 0, 0.05, POLE_Z, C.graphite, { mat: 'metal' }, 16))
parts.push(cyl(0.034, 0.038, POLE_H, 0, POLE_H / 2, POLE_Z, '#b9bec1', { mat: 'metal' }, 16))
parts.push(cyl(0.037, 0.037, 0.03, 0, 2.615, POLE_Z, C.graphite, { mat: 'metal' }, 12))

// flat discs: white face, red ring, white centre
const DISC_ROT: [number, number, number] = [Math.PI / 2, 0, 0]
parts.push(cyl(0.3, 0.3, 0.02, 0, SIGN_Y, 0.03, C.white, { mat: 'matte', rot: DISC_ROT }, 40))
parts.push(cyl(0.27, 0.27, 0.012, 0, SIGN_Y, 0.045, '#c4453c', { mat: 'gloss', rot: DISC_ROT }, 40))
parts.push(cyl(0.225, 0.225, 0.01, 0, SIGN_Y, 0.054, C.white, { mat: 'matte', rot: DISC_ROT }, 40))

// black "60" made from flat bar segments
parts.push(box(0.09, 0.018, 0.006, -0.06, 2.65, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.018, 0.2, 0.006, -0.096, 2.55, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.09, 0.018, 0.006, -0.06, 2.45, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.07, 0.018, 0.006, -0.06, 2.53, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.018, 0.06, 0.006, -0.024, 2.49, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.09, 0.018, 0.006, 0.06, 2.65, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.09, 0.018, 0.006, 0.06, 2.45, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.018, 0.2, 0.006, 0.024, 2.55, 0.061, C.ink, { mat: 'matte' }))
parts.push(box(0.018, 0.2, 0.006, 0.096, 2.55, 0.061, C.ink, { mat: 'matte' }))

// rear frame rails and two clamps on the pole
for (const x of [-0.12, 0.12]) {
  parts.push(box(0.04, 0.85, 0.03, x, 2.475, 0.005, C.graphite, { mat: 'metal' }))
}
for (const y of [2.3, 2.55]) {
  parts.push(box(0.11, 0.05, 0.1, 0, y, POLE_Z, C.graphite, { mat: 'metal' }))
  parts.push(box(0.32, 0.03, 0.04, 0, y, 0, C.graphite, { mat: 'metal' }))
  for (const x of [-0.04, 0.04]) {
    parts.push(cyl(0.006, 0.006, 0.01, x, y, -0.085, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6))
  }
}

// four bolts through the disc into the frame rails
for (const x of [-0.12, 0.12]) {
  for (const y of [2.35, 2.75]) {
    parts.push(cyl(0.005, 0.005, 0.008, x, y, 0.063, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6))
  }
}

export default defineModel({
  id: 'road-sign-speed',
  name: '限速标志牌',
  category: 'infrastructure',
  tags: ['sign', 'speed limit', 'traffic', '限速', '标志牌', '交通'],
  footprint: [0.6, 0.2],
  height: 2.9,
  placement: 'outdoor',
  parts,
})
