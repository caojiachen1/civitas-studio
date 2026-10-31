import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * Direction sign on a single Ø0.1 pole.
 * 2.2 x 1.2m blue panel, white border, three legend lines plus an arrow,
 * two back rails clamped to the pole with two long brackets, base plate.
 * Panel top 3.35m.
 */
const POLE_X = -0.95
const POLE_Z = -0.05
const PANEL_Y = 2.75
const BLUE = '#2f5f8a'
const parts: Part[] = []

// base plate, anchors, collar and pole
parts.push(box(0.2, 0.02, 0.2, POLE_X, 0.01, 0, C.graphite, { mat: 'metal' }))
for (const dx of [-0.07, 0.07]) {
  for (const dz of [-0.07, 0.07]) {
    parts.push(cyl(0.009, 0.009, 0.016, POLE_X + dx, 0.028, dz, C.steel, { mat: 'metal' }, 8))
    parts.push(cyl(0.015, 0.015, 0.003, POLE_X + dx, 0.0215, dz, C.graphite, { mat: 'metal' }, 10))
  }
}
parts.push(cyl(0.07, 0.075, 0.06, POLE_X, 0.05, POLE_Z, C.graphite, { mat: 'metal' }, 16))
parts.push(cyl(0.045, 0.05, 2.98, POLE_X, 1.51, POLE_Z, '#b9bec1', { mat: 'metal' }, 18))
parts.push(cyl(0.048, 0.048, 0.03, POLE_X, 3.015, POLE_Z, C.graphite, { mat: 'metal' }, 14))

// blue panel
parts.push(box(2.2, 1.2, 0.05, 0, PANEL_Y, 0.025, BLUE, { mat: 'matte' }))
parts.push(box(2.1, 0.04, 0.006, 0, 3.33, 0.053, C.white, { mat: 'matte' }))
parts.push(box(2.1, 0.04, 0.006, 0, 2.17, 0.053, C.white, { mat: 'matte' }))
for (const x of [-1.06, 1.06]) {
  parts.push(box(0.04, 1.12, 0.006, x, PANEL_Y, 0.053, C.white, { mat: 'matte' }))
}

// three white legend lines
parts.push(box(1.45, 0.1, 0.006, -0.2, 2.98, 0.053, C.white, { mat: 'matte' }))
parts.push(box(1.1, 0.09, 0.006, -0.37, 2.76, 0.053, C.white, { mat: 'matte' }))
parts.push(box(0.8, 0.09, 0.006, -0.52, 2.56, 0.053, C.white, { mat: 'matte' }))

// white directional arrow on the right
parts.push(box(0.45, 0.08, 0.006, 0.62, 2.76, 0.053, C.white, { mat: 'matte' }))
parts.push(box(0.24, 0.09, 0.006, 0.83, 2.84, 0.053, C.white, { mat: 'matte', rot: [0, 0, -Math.PI / 4] }))
parts.push(box(0.24, 0.09, 0.006, 0.83, 2.68, 0.053, C.white, { mat: 'matte', rot: [0, 0, Math.PI / 4] }))

// back rails and horizontal stiffeners
for (const x of [-0.6, 0.6]) {
  parts.push(box(0.05, 1.15, 0.05, x, PANEL_Y, -0.005, C.graphite, { mat: 'metal' }))
}
for (const y of [2.3, 3.2]) {
  parts.push(box(1.2, 0.04, 0.03, 0, y, -0.045, C.graphite, { mat: 'metal' }))
}

// pole clamps and long brackets tying both rails back to the pole
for (const y of [2.3, 2.9]) {
  parts.push(box(0.11, 0.05, 0.1, POLE_X, y, POLE_Z, C.graphite, { mat: 'metal' }))
  parts.push(box(1.6, 0.04, 0.04, -0.175, y, -0.01, C.graphite, { mat: 'metal' }))
  for (const dx of [-0.04, 0.04]) {
    parts.push(cyl(0.006, 0.006, 0.01, POLE_X + dx, y, -0.095, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6))
  }
}

// four bolts through the panel into the rails
for (const x of [-0.6, 0.6]) {
  for (const y of [2.4, 3.1]) {
    parts.push(cyl(0.005, 0.005, 0.008, x, y, 0.053, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6))
  }
}

export default defineModel({
  id: 'road-sign-direction',
  name: '指路标志牌',
  category: 'infrastructure',
  tags: ['sign', 'direction', 'guide', '指路', '标志牌', '蓝牌'],
  footprint: [2.2, 0.2],
  height: 3.4,
  placement: 'outdoor',
  parts,
})
