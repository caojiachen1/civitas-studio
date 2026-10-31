import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []
const GLOW = '#ffe9c4'
const PAINT = C.graphite
const ARM_RISE = 0.09 // arm tilt ~5 degrees

// 0.56 x 0.4 m footing, 9 m mast (Ø0.20 -> Ø0.12), two 2.2 m arms, luminaires at ±2.13 m
parts.push(box(0.56, 0.3, 0.4, 0, 0.15, 0, '#a8a59d', { mat: 'stone' }))
parts.push(box(0.6, 0.04, 0.4, 0, 0.31, 0, C.concrete, { mat: 'stone' }))
parts.push(cyl(0.17, 0.19, 0.05, 0, 0.355, 0, C.steel, { mat: 'metal' }, 24))
parts.push(cyl(0.1, 0.1, 0.06, 0, 0.41, 0, C.graphite, { mat: 'metal' }, 24))
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(cyl(0.014, 0.014, 0.07, sx * 0.13, 0.4, sz * 0.13, C.steel, { mat: 'metal' }, 8))
    parts.push(cyl(0.022, 0.022, 0.012, sx * 0.13, 0.44, sz * 0.13, C.graphite, { mat: 'metal' }, 8))
  }
}

// tapered mast from y 0.44 to 8.96
parts.push(cyl(0.06, 0.1, 8.52, 0, 4.7, 0, PAINT, { mat: 'metal' }, 24))
parts.push(torus(0.097, 0.012, 0, 0.56, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24))
parts.push(torus(0.075, 0.01, 0, 3.1, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24))
parts.push(torus(0.063, 0.008, 0, 8.84, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24))

// inspection hatch, hinges, warning label
parts.push(rounded(0.082, 0.27, 0.02, 0.008, 0, 0.94, 0.09, C.steel, { mat: 'metal' }))
parts.push(cyl(0.009, 0.009, 0.012, 0, 1.04, 0.101, C.graphite, { mat: 'metal' }, 8))
parts.push(cyl(0.009, 0.009, 0.012, 0, 0.84, 0.101, C.graphite, { mat: 'metal' }, 8))
parts.push(box(0.036, 0.05, 0.004, 0.02, 0.98, 0.101, '#e0b23a', { mat: 'matte' }))

// twin arms and luminaires
for (const side of [-1, 1]) {
  const dirX = Math.cos(ARM_RISE)
  const dirY = Math.sin(ARM_RISE)
  const startX = side * 0.09
  const startY = 8.66
  const centerX = side * (0.09 + dirX * 1.0)
  const centerY = startY + dirY * 1.0
  parts.push(sphere(0.078, startX, startY, 0, C.graphite, { mat: 'metal' }, 16))
  parts.push(cyl(0.045, 0.058, 2.02, centerX, centerY, 0, PAINT, { mat: 'metal', rot: [0, 0, -side * (Math.PI / 2 - ARM_RISE)] }, 16))
  parts.push(sphere(0.052, side * 2.08, 8.84, 0, C.graphite, { mat: 'metal' }, 16))
  // forged arm gusset at the mast
  parts.push(cyl(0.016, 0.016, 0.4, side * 0.24, 8.72, 0, C.steel, { mat: 'metal', rot: [0, 0, -side * 1.2] }, 8))
  // luminaire housing and canopy
  parts.push(rounded(0.56, 0.13, 0.28, 0.04, side * 2.13, 8.88, 0, C.blackMetal, { mat: 'metal' }))
  parts.push(rounded(0.5, 0.035, 0.24, 0.012, side * 2.13, 8.955, 0, C.steel, { mat: 'metal' }))
  parts.push(rbox(0.44, 0.018, 0.2, 0.006, side * 2.13, 8.808, 0, GLOW, { mat: 'emissive', side: 'double' }))
  parts.push(rounded(0.47, 0.02, 0.23, 0.008, side * 2.13, 8.826, 0, C.blackMetal, { mat: 'metal' }))
  // photocell and side trim
  parts.push(cyl(0.026, 0.026, 0.022, side * 2.13, 8.982, 0, C.graphite, { mat: 'metal' }, 12))
  parts.push(sphere(0.016, side * 2.13, 8.997, 0, '#cfdcd4', { mat: 'gloss' }, 10))
  parts.push(cyl(0.011, 0.011, 0.03, side * 2.37, 8.88, 0, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8))
  // small drain slot under the lens
  parts.push(box(0.05, 0.008, 0.03, side * 2.03, 8.813, 0.085, C.graphite))
}

// reflective band below the arms and a small pole plate
parts.push(torus(0.066, 0.02, 0, 7.9, 0, '#e0b23a', { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 24))
parts.push(rounded(0.13, 0.09, 0.012, 0.004, 0, 1.55, 0.084, C.cream, { mat: 'matte' }))
parts.push(box(0.09, 0.014, 0.004, 0, 1.57, 0.092, C.ink))

export default defineModel({
  id: 'streetlight-double',
  name: '双臂路灯',
  category: 'street',
  tags: ['streetlight', 'lamp', '路灯', '照明', '双臂'],
  footprint: [4.8, 0.4],
  height: 9.2,
  placement: 'outdoor',
  parts,
})
