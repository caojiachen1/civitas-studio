import { C, box, cyl, defineModel, torus } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 12m high-mast highway light.
 * 1.2m square footing, 8 anchor bolts, Ø0.3 -> Ø0.16 tapered pole,
 * four 1.2m lamp arms on a ring at 11.45m with emissive undersides,
 * 0.55m maintenance platform with railing at 10.5m, and a 10m access ladder.
 * Lamp footprint 2.6m across, pole top 12m.
 */
const H = 12
const POLE_BOTTOM = 0.24
const POLE_H = H - POLE_BOTTOM
const ARM_Y = 11.45
const STEEL = '#b9bec1'
const parts: Part[] = []

// footing, flange, anchors and base gussets
parts.push(box(1.2, 0.2, 1.2, 0, 0.1, 0, C.concrete, { mat: 'stone' }))
parts.push(cyl(0.36, 0.36, 0.04, 0, 0.22, 0, C.graphite, { mat: 'metal' }, 24))
for (let i = 0; i < 8; i++) {
  const a = (Math.PI * 2 * i) / 8
  const x = Math.cos(a) * 0.27
  const z = Math.sin(a) * 0.27
  parts.push(cyl(0.014, 0.014, 0.06, x, 0.27, z, C.steel, { mat: 'metal' }, 8))
  parts.push(cyl(0.022, 0.022, 0.004, x, 0.244, z, C.graphite, { mat: 'metal' }, 10))
}
for (const s of [-1, 1]) {
  parts.push(box(0.02, 0.3, 0.16, s * 0.19, 0.375, 0, C.graphite, { mat: 'metal' }))
  parts.push(box(0.16, 0.3, 0.02, 0, 0.375, s * 0.19, C.graphite, { mat: 'metal' }))
}

// tapered pole, top cap, access door and hinges
parts.push(cyl(0.08, 0.15, POLE_H, 0, POLE_BOTTOM + POLE_H / 2, 0, STEEL, { mat: 'metal' }, 24))
parts.push(cyl(0.085, 0.09, 0.06, 0, H - 0.03, 0, C.graphite, { mat: 'metal' }, 16))
parts.push(box(0.12, 0.3, 0.02, 0, 0.8, 0.145, C.graphite, { mat: 'metal' }))
for (const s of [-1, 1]) {
  parts.push(box(0.02, 0.03, 0.01, s * 0.05, 0.93, 0.158, C.steel, { mat: 'metal' }))
}

// maintenance platform, brackets and railing
parts.push(cyl(0.55, 0.55, 0.05, 0, 10.5, 0, C.graphite, { mat: 'metal' }, 28))
for (let i = 0; i < 4; i++) {
  const a = (Math.PI / 2) * i
  parts.push(
    box(0.48, 0.05, 0.06, Math.cos(a) * 0.28, 10.46, Math.sin(a) * 0.28, STEEL, {
      mat: 'metal',
      rot: [0, a, 0],
    }),
  )
}
for (let i = 0; i < 8; i++) {
  const a = (Math.PI / 4) * i
  parts.push(box(0.035, 0.66, 0.035, Math.cos(a) * 0.52, 10.855, Math.sin(a) * 0.52, STEEL, { mat: 'metal' }))
}
for (const y of [10.86, 11.18]) {
  parts.push(torus(0.52, 0.022, 0, y, 0, STEEL, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32))
}

// ladder on the outside of the platform, 33 rungs at 0.3m
for (const z of [-0.18, 0.18]) {
  parts.push(box(0.035, 10, 0.035, 0.6, 6.2, z, STEEL, { mat: 'metal' }))
}
for (let i = 0; i < 33; i++) {
  parts.push(box(0.05, 0.025, 0.42, 0.6, 1.35 + i * 0.3, 0, STEEL, { mat: 'metal' }))
}
for (const y of [1.4, 4, 7, 9.5]) {
  for (const z of [-0.18, 0.18]) {
    parts.push(box(0.52, 0.05, 0.05, 0.34, y, z, STEEL, { mat: 'metal' }))
  }
}
for (const z of [-0.18, 0.18]) {
  parts.push(box(0.16, 0.05, 0.05, 0.55, 10.52, z, STEEL, { mat: 'metal' }))
}

// collar and four arms with diagonal braces
parts.push(cyl(0.12, 0.12, 0.12, 0, ARM_Y, 0, C.graphite, { mat: 'metal' }, 16))
const ARM_ROT: [number, number, number][] = [
  [0, 0, -Math.PI / 2],
  [0, 0, Math.PI / 2],
  [Math.PI / 2, 0, 0],
  [-Math.PI / 2, 0, 0],
]
const BRACE_ROT: [number, number, number][] = [
  [0, 0, -1.066],
  [0, 0, 1.066],
  [1.066, 0, 0],
  [-1.066, 0, 0],
]
const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]
const BRACE_LEN = Math.hypot(0.85, 0.47)
for (let i = 0; i < 4; i++) {
  const [dx, dz] = DIRS[i]
  parts.push(cyl(0.045, 0.05, 1.2, dx * 0.6, ARM_Y, dz * 0.6, STEEL, { mat: 'metal', rot: ARM_ROT[i] }, 12))
  parts.push(
    cyl(0.032, 0.032, BRACE_LEN, dx * 0.475, 11.185, dz * 0.475, STEEL, {
      mat: 'metal',
      rot: BRACE_ROT[i],
    }, 10),
  )
  // luminaire body, hood and emissive underside at 1.15m radius
  parts.push(box(0.28, 0.16, 0.28, dx * 1.15, 11.42, dz * 1.15, C.graphite, { mat: 'metal' }))
  parts.push(box(0.3, 0.04, 0.3, dx * 1.15, 11.5, dz * 1.15, C.graphite, { mat: 'metal' }))
  parts.push(box(0.22, 0.012, 0.22, dx * 1.15, 11.335, dz * 1.15, '#ffe9b8', { mat: 'emissive' }))
}

export default defineModel({
  id: 'highway-light',
  name: '高杆路灯',
  category: 'infrastructure',
  tags: ['streetlight', 'high mast', 'highway', '路灯', '高杆灯', '照明'],
  footprint: [2.6, 2.6],
  height: 12,
  placement: 'outdoor',
  parts,
})
