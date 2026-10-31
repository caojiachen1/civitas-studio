import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 12m clear-span highway sign gantry, long axis on Z (13m truss overall).
 * Two Ø0.4 tapered legs on 1.2 x 0.9 concrete footings, a 0.54m deep
 * parallel-chord truss (2 chords + 10 zig-zag diagonals + 11 verticals),
 * two green direction panels with a maintenance walkway and railing behind.
 * Lowest sign edge 5.55m, top chord 7.50m.
 */
const SPAN = 13
const LEG_Z = [-6, 6]
const LEG_TOP = 7.2
const LEG_BOTTOM = 0.19
const LEG_H = LEG_TOP - LEG_BOTTOM
const BOTTOM_Y = 6.9
const TOP_Y = 7.44
const PANEL = SPAN / 10
const RISE = TOP_Y - BOTTOM_Y
const DIAG = Math.hypot(PANEL, RISE)
const DIAG_ANGLE = Math.atan2(PANEL, RISE)
const GREEN = '#1f5c3d'
const STEEL = '#b9bec1'
const parts: Part[] = []

for (const z of LEG_Z) {
  parts.push(box(1.2, 0.15, 0.9, 0, 0.075, z, C.concrete, { mat: 'stone' }))
  parts.push(box(0.72, 0.04, 0.72, 0, 0.17, z, C.graphite, { mat: 'metal' }))
  for (const dx of [-0.26, 0.26]) {
    for (const dz of [-0.26, 0.26]) {
      parts.push(cyl(0.015, 0.015, 0.05, dx, 0.215, z + dz, C.steel, { mat: 'metal' }, 8))
    }
  }
  // four base gussets
  for (const dx of [-0.19, 0.19]) {
    parts.push(box(0.02, 0.35, 0.18, dx, 0.36, z, STEEL, { mat: 'metal' }))
  }
  for (const dz of [-0.19, 0.19]) {
    parts.push(box(0.18, 0.35, 0.02, 0, 0.36, z + dz, STEEL, { mat: 'metal' }))
  }
  // tapered leg and riser up to the top chord
  parts.push(cyl(0.17, 0.2, LEG_H, 0, LEG_BOTTOM + LEG_H / 2, z, STEEL, { mat: 'metal' }, 20))
  parts.push(cyl(0.1, 0.1, TOP_Y - LEG_TOP, 0, (LEG_TOP + TOP_Y) / 2, z, STEEL, { mat: 'metal' }, 12))
}

// truss chords
for (const y of [BOTTOM_Y, TOP_Y]) {
  parts.push(cyl(0.06, 0.06, SPAN, 0, y, 0, STEEL, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14))
}

// zig-zag diagonals: each spans one 1.3m bay and lands on both chord centre lines
for (let i = 0; i < 10; i++) {
  const z = -SPAN / 2 + PANEL * (i + 0.5)
  parts.push(
    cyl(0.045, 0.045, DIAG, 0, (BOTTOM_Y + TOP_Y) / 2, z, STEEL, {
      mat: 'metal',
      rot: [i % 2 === 0 ? DIAG_ANGLE : -DIAG_ANGLE, 0, 0],
    }, 10),
  )
}

// vertical web members at every node
for (let i = 0; i <= 10; i++) {
  parts.push(cyl(0.035, 0.035, RISE, 0, (BOTTOM_Y + TOP_Y) / 2, -SPAN / 2 + PANEL * i, STEEL, { mat: 'metal' }, 8))
}

// two green direction panels mounted 0.16m in front of the truss plane,
// lowest edge 5.55m, carried by two cantilever arms off the bottom chord
const SIGN_X = 0.16
for (const z of [-3.15, 3.15]) {
  parts.push(box(0.06, 1.2, 2.6, SIGN_X, 6.15, z, GREEN, { mat: 'matte' }))
  // white border, inset from the edges
  parts.push(box(0.006, 0.05, 2.5, SIGN_X + 0.032, 6.71, z, C.white, { mat: 'matte' }))
  parts.push(box(0.006, 0.05, 2.5, SIGN_X + 0.032, 5.59, z, C.white, { mat: 'matte' }))
  for (const dz of [-1.25, 1.25]) {
    parts.push(box(0.006, 1.1, 0.05, SIGN_X + 0.032, 6.15, z + dz, C.white, { mat: 'matte' }))
  }
  // three lines of legend
  for (const [y, w] of [[6.42, 2.0], [6.15, 1.6], [5.88, 1.2]]) {
    parts.push(box(0.006, 0.08, w, SIGN_X + 0.033, y, z, C.white, { mat: 'matte' }))
  }
  // back stiffener ribs and two hanger posts
  for (const dz of [-0.8, 0, 0.8]) {
    parts.push(box(0.04, 1.05, 0.05, SIGN_X - 0.05, 6.15, z + dz, C.graphite, { mat: 'metal' }))
  }
  for (const dz of [-0.95, 0.95]) {
    parts.push(box(0.05, 0.15, 0.08, SIGN_X, 6.825, z + dz, STEEL, { mat: 'metal' }))
    parts.push(box(0.22, 0.06, 0.08, 0.05, 6.865, z + dz, STEEL, { mat: 'metal' }))
  }
}

// maintenance walkway resting on the bottom chord, with railing on the outside
parts.push(box(0.54, 0.06, 6, 0.33, 6.99, 0, C.graphite, { mat: 'metal' }))
for (const z of [-3, -1.5, 0, 1.5, 3]) {
  parts.push(box(0.04, 0.34, 0.04, 0.58, 7.19, z, STEEL, { mat: 'metal' }))
}
for (const y of [7.2, 7.36]) {
  parts.push(box(0.04, 0.04, 6, 0.58, y, 0, STEEL, { mat: 'metal' }))
}
parts.push(box(0.02, 0.1, 6, 0.59, 7.06, 0, STEEL, { mat: 'metal' }))
for (const z of [-2, 0, 2]) {
  parts.push(box(0.16, 0.04, 0.06, 0.1, 6.945, z, STEEL, { mat: 'metal' }))
}

export default defineModel({
  id: 'overhead-gantry',
  name: '高速标志门架',
  category: 'infrastructure',
  tags: ['gantry', 'sign bridge', 'truss', '门架', '高速', '标志', '桁架'],
  footprint: [1.2, 13],
  height: 7.5,
  placement: 'outdoor',
  parts,
})
