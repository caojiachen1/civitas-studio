import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []
const LENS = '#3f5560'

// 6 m mast (Ø0.14) on a 0.5 m footing, 1.34 m cantilever arm carrying dome + bullet cameras
parts.push(box(0.5, 0.32, 0.5, 0, 0.16, 0, '#a8a59d', { mat: 'stone' }))
parts.push(box(0.54, 0.03, 0.5, 0, 0.335, 0, C.concrete, { mat: 'stone' }))
parts.push(cyl(0.19, 0.2, 0.03, 0, 0.365, 0, C.steel, { mat: 'metal' }, 24))
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(cyl(0.013, 0.013, 0.05, sx * 0.14, 0.395, sz * 0.14, C.steel, { mat: 'metal' }, 8))
  }
}
// protective bollard sleeve at the foot
parts.push(cyl(0.105, 0.115, 0.5, 0, 0.63, 0, C.graphite, { mat: 'metal' }, 20))
parts.push(torus(0.108, 0.01, 0, 0.87, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24))

// mast and top fitting
parts.push(cyl(0.07, 0.07, 5.72, 0, 3.26, 0, C.steel, { mat: 'metal' }, 20))
parts.push(cyl(0.072, 0.072, 0.06, 0, 6.15, 0, C.graphite, { mat: 'metal' }, 20))
parts.push(coneCap())
parts.push(cyl(0.012, 0.018, 0.2, 0, 6.23, 0, C.steel, { mat: 'metal' }, 8))
parts.push(sphere(0.014, 0, 6.335, 0, C.graphite, { mat: 'metal' }, 8))

// 1.34 m cantilever arm with gusset and end caps
parts.push(cyl(0.036, 0.036, 1.34, 0, 5.72, 0, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16))
parts.push(cylinderX(0.05, 0.05, 0.06, -0.67, 5.72, 0, C.graphite))
parts.push(cylinderX(0.05, 0.05, 0.06, 0.67, 5.72, 0, C.graphite))
parts.push(cyl(0.018, 0.018, 0.5, -0.18, 5.5, 0, C.steel, { mat: 'metal', rot: [0, 0, 0.6] }, 8))
parts.push(cyl(0.018, 0.018, 0.5, 0.18, 5.5, 0, C.steel, { mat: 'metal', rot: [0, 0, -0.6] }, 8))

// dome camera (left) with bracket, housing and sun hood
parts.push(rounded(0.1, 0.05, 0.12, 0.02, -0.5, 5.685, 0, C.steel, { mat: 'metal' }))
parts.push(cyl(0.026, 0.026, 0.16, -0.5, 5.58, 0, C.graphite, { mat: 'metal' }, 12))
parts.push(rounded(0.26, 0.03, 0.26, 0.012, -0.5, 5.52, 0, C.white, { mat: 'gloss' }))
parts.push(cyl(0.12, 0.105, 0.1, -0.5, 5.455, 0, C.white, { mat: 'gloss' }, 20))
parts.push(sphere(0.105, -0.5, 5.42, 0, '#22303a', { mat: 'glass' }, 20))
parts.push(cyl(0.05, 0.05, 0.02, -0.5, 5.4, 0, LENS, { mat: 'emissive' }, 16))
parts.push(rounded(0.3, 0.025, 0.28, 0.01, -0.5, 5.545, 0, C.graphite, { mat: 'metal' }))
parts.push(box(0.06, 0.014, 0.004, -0.5, 5.545, 0.142, C.steel))

// bullet camera (right) facing +Z, with sunshield and wall mount
parts.push(rounded(0.1, 0.05, 0.1, 0.02, 0.5, 5.685, 0, C.steel, { mat: 'metal' }))
parts.push(cyl(0.026, 0.026, 0.14, 0.5, 5.6, 0, C.graphite, { mat: 'metal' }, 12))
parts.push(cyl(0.075, 0.075, 0.05, 0.5, 5.52, 0.05, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16))
parts.push(cyl(0.062, 0.062, 0.32, 0.5, 5.52, 0.06, C.white, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 16))
parts.push(cyl(0.066, 0.066, 0.02, 0.5, 5.52, 0.22, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16))
parts.push(cyl(0.05, 0.05, 0.012, 0.5, 5.52, 0.232, LENS, { mat: 'emissive' }, 16))
parts.push(rounded(0.17, 0.024, 0.34, 0.01, 0.5, 5.596, 0.09, C.graphite, { mat: 'metal' }))

// pole-mounted equipment cabinet with vents, lock and straps
parts.push(rounded(0.36, 0.5, 0.2, 0.02, 0, 3.0, 0.15, C.cream, { mat: 'gloss' }))
parts.push(rounded(0.33, 0.4, 0.02, 0.01, 0, 3.02, 0.255, C.white, { mat: 'gloss' }))
parts.push(box(0.3, 0.006, 0.004, 0, 2.9, 0.268, C.graphite))
for (let i = 0; i < 5; i++) {
  parts.push(box(0.2, 0.008, 0.006, 0.04, 3.12 + i * 0.035, 0.268, C.graphite, { mat: 'metal' }))
}
parts.push(cyl(0.016, 0.016, 0.02, -0.13, 2.98, 0.268, C.steel, { mat: 'metal' }, 10))
parts.push(box(0.03, 0.06, 0.012, 0.13, 3.0, 0.275, C.graphite, { mat: 'metal' }))
parts.push(rounded(0.4, 0.04, 0.24, 0.012, 0, 3.26, 0.15, C.graphite, { mat: 'metal' }))
parts.push(rounded(0.4, 0.04, 0.24, 0.012, 0, 2.74, 0.15, C.graphite, { mat: 'metal' }))
parts.push(box(0.05, 0.14, 0.006, 0, 3.28, 0.275, '#d9b25f', { mat: 'matte' }))

// conduit down the mast with clamps
parts.push(cyl(0.022, 0.022, 2.45, 0.078, 1.68, 0, C.graphite, { mat: 'metal' }, 10))
for (let i = 0; i < 4; i++) {
  parts.push(torus(0.026, 0.008, 0.078, 0.7 + i * 0.7, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12))
}
parts.push(cyl(0.024, 0.024, 0.16, 0.078, 1.68, 0, C.graphite, { mat: 'metal', rot: [0, 0, 0.9] }, 10))
parts.push(rounded(0.2, 0.16, 0.03, 0.01, 0, 2.35, 0.072, C.cream, { mat: 'matte' }))
parts.push(box(0.14, 0.012, 0.004, 0, 2.37, 0.089, C.ink))
parts.push(box(0.1, 0.01, 0.004, 0, 2.34, 0.089, C.ink))

function coneCap(): Part {
  return cyl(0.03, 0.07, 0.06, 0, 6.18, 0, C.graphite, { mat: 'metal' }, 20)
}

function cylinderX(rTop: number, rBottom: number, h: number, x: number, y: number, z: number, color: string): Part {
  return cyl(rTop, rBottom, h, x, y, z, color, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16)
}

export default defineModel({
  id: 'cctv-pole',
  name: '监控立杆',
  category: 'street',
  tags: ['cctv', 'camera', 'surveillance', '监控', '摄像头', '立杆'],
  footprint: [1.4, 0.5],
  height: 6.3,
  placement: 'outdoor',
  parts,
})
