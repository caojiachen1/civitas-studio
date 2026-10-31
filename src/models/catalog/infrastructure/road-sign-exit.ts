import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * Exit sign on a 5.2m cantilever, long axis on X.
 * Ø0.28 pole 6.5m on a Ø0.6 base plate, tapered box arm at 6.25m,
 * knee brace and upper tie, 4 x 2m green panel with white border,
 * three text lines, a white exit arrow, back ribs, hangers and a top beacon.
 */
const POLE_X = -2.45
const ARM_Y = 6.25
const STEEL = '#b9bec1'
const GREEN = '#1f5c3d'
const parts: Part[] = []

// base plate, six anchor bolts with washers, pole and arm collar
parts.push(cyl(0.3, 0.3, 0.04, POLE_X, 0.02, 0, C.graphite, { mat: 'metal' }, 24))
for (let i = 0; i < 6; i++) {
  const a = (Math.PI * 2 * i) / 6
  const bx = POLE_X + Math.cos(a) * 0.24
  const bz = Math.sin(a) * 0.24
  parts.push(cyl(0.016, 0.016, 0.03, bx, 0.055, bz, C.steel, { mat: 'metal' }, 8))
  parts.push(cyl(0.024, 0.024, 0.004, bx, 0.041, bz, C.graphite, { mat: 'metal' }, 10))
}
parts.push(cyl(0.12, 0.14, 6.46, POLE_X, 3.27, 0, STEEL, { mat: 'metal' }, 20))
parts.push(cyl(0.16, 0.16, 0.14, POLE_X, ARM_Y, 0, C.graphite, { mat: 'metal' }, 16))

// tapered cantilever arm (thick end at the pole) and end cap
parts.push(
  cyl(0.11, 0.08, 5.2, 0.15, ARM_Y, 0, STEEL, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
)
parts.push(cyl(0.082, 0.082, 0.02, 2.74, ARM_Y, 0, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16))

// knee brace near the pole and an upper tie that clears the panel
const KNEE_LEN = Math.hypot(0.75, 0.78)
parts.push(
  cyl(0.06, 0.06, KNEE_LEN, -2.075, 5.79, 0, STEEL, {
    mat: 'metal',
    rot: [0, 0, -Math.atan2(0.75, 0.78)],
  }, 12),
)
const TIE_LEN = Math.hypot(2.35, 0.2)
parts.push(
  cyl(0.045, 0.045, TIE_LEN, -1.275, 6.3, 0, STEEL, {
    mat: 'metal',
    rot: [0, 0, -Math.atan2(2.35, 0.2)],
  }, 10),
)

// 4 x 2m green panel
parts.push(box(4, 2, 0.1, 0.65, 5.05, 0, GREEN, { mat: 'matte' }))
const FACE_Z = 0.052
parts.push(box(3.9, 0.06, 0.008, 0.65, 5.995, FACE_Z, C.white, { mat: 'matte' }))
parts.push(box(3.9, 0.06, 0.008, 0.65, 4.105, FACE_Z, C.white, { mat: 'matte' }))
for (const x of [-1.295, 2.595]) {
  parts.push(box(0.06, 1.9, 0.008, x, 5.05, FACE_Z, C.white, { mat: 'matte' }))
}

// three lines of white legend on the left half
parts.push(box(1.5, 0.16, 0.006, -0.3, 5.55, 0.053, C.white, { mat: 'matte' }))
parts.push(box(1.2, 0.14, 0.006, -0.45, 5.2, 0.053, C.white, { mat: 'matte' }))
parts.push(box(0.9, 0.14, 0.006, -0.6, 4.85, 0.053, C.white, { mat: 'matte' }))

// white exit arrow pointing right
parts.push(box(1, 0.16, 0.006, 1.55, 5.2, 0.053, C.white, { mat: 'matte' }))
parts.push(box(0.5, 0.13, 0.006, 2.25, 5.36, 0.053, C.white, { mat: 'matte', rot: [0, 0, -Math.PI / 4] }))
parts.push(box(0.5, 0.13, 0.006, 2.25, 5.04, 0.053, C.white, { mat: 'matte', rot: [0, 0, Math.PI / 4] }))

// hangers from the two arm rails, and back stiffeners
for (const x of [-0.7, 0.65, 2]) {
  parts.push(box(0.07, 0.16, 0.12, x, 6.1, 0, STEEL, { mat: 'metal' }))
}
for (const x of [-1, 0.65, 2.3]) {
  parts.push(box(0.07, 1.85, 0.08, x, 5.05, -0.09, C.graphite, { mat: 'metal' }))
}
for (const y of [4.2, 5.9]) {
  parts.push(box(3.8, 0.07, 0.06, 0.65, y, -0.08, C.graphite, { mat: 'metal' }))
}

// pole-top beacon, total height 6.8m
parts.push(cyl(0.15, 0.15, 0.02, POLE_X, 6.51, 0, C.graphite, { mat: 'metal' }, 16))
parts.push(cyl(0.07, 0.09, 0.07, POLE_X, 6.555, 0, C.graphite, { mat: 'metal' }, 16))
parts.push(sphere(0.105, POLE_X, 6.695, 0, '#ffd9a0', { mat: 'emissive' }, 16))

export default defineModel({
  id: 'road-sign-exit',
  name: '出口悬臂指示牌',
  category: 'infrastructure',
  tags: ['sign', 'exit', 'cantilever', '出口', '指示牌', '高速'],
  footprint: [5.5, 0.6],
  height: 6.8,
  placement: 'outdoor',
  parts,
})
