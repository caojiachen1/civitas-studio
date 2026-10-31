import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
const SEG = 24
const R = 3.8
const WATER = '#7fb6c0'
const tile = { mat: 'stone' as const }
const water = { mat: 'glass' as const }

// Ø8 m basin: 24 wall segments, 0.5 m high, with coping and floor
for (let i = 0; i < SEG; i++) {
  const a = (i / SEG) * Math.PI * 2
  const x = Math.sin(a) * R
  const z = Math.cos(a) * R
  parts.push(box(1.05, 0.5, 0.36, x, 0.25, z, C.stone, { ...tile, rot: [0, a, 0] }))
  parts.push(box(1.06, 0.08, 0.4, x, 0.54, z, C.cream, { ...tile, rot: [0, a, 0] }))
  if (i % 2 === 0) {
    parts.push(box(0.62, 0.26, 0.012, Math.sin(a) * 3.985, 0.27, Math.cos(a) * 3.985, '#8e9a94', { ...tile, rot: [0, a, 0] }))
  }
}
parts.push(cyl(3.62, 3.62, 0.12, 0, 0.06, 0, '#8f9187', { mat: 'stone' }, 40))
parts.push(cyl(3.6, 3.6, 0.02, 0, 0.44, 0, WATER, { ...water }, 40))
for (let i = 0; i < 4; i++) {
  const a = (i / 4) * Math.PI * 2 + Math.PI / 8
  parts.push(box(3.4, 0.006, 0.02, Math.sin(a) * 1.8, 0.125, Math.cos(a) * 1.8, '#7c7f76', { mat: 'stone', rot: [0, a, 0] }))
}

// tiered centre: Ø3 basin, Ø2 basin, Ø1 basin and finial
parts.push(cyl(1.36, 1.2, 0.36, 0, 0.3, 0, '#a6a49a', tile, 32))
parts.push(cyl(1.5, 1.2, 0.14, 0, 0.52, 0, C.stone, tile, 32))
parts.push(cyl(1.42, 1.42, 0.02, 0, 0.565, 0, WATER, { ...water }, 32))
parts.push(torus(1.5, 0.035, 0, 0.59, 0, C.cream, { ...tile, rot: [Math.PI / 2, 0, 0] }, 40))

parts.push(cyl(0.5, 0.32, 0.5, 0, 0.84, 0, C.stone, tile, 24))
parts.push(cyl(1.0, 0.74, 0.12, 0, 1.06, 0, C.stone, tile, 32))
parts.push(cyl(0.93, 0.93, 0.02, 0, 1.115, 0, WATER, { ...water }, 32))
parts.push(torus(1.0, 0.03, 0, 1.125, 0, C.cream, { ...tile, rot: [Math.PI / 2, 0, 0] }, 32))

parts.push(cyl(0.28, 0.2, 0.32, 0, 1.28, 0, C.stone, tile, 20))
parts.push(cyl(0.5, 0.34, 0.1, 0, 1.4, 0, C.stone, tile, 24))
parts.push(cyl(0.44, 0.44, 0.02, 0, 1.445, 0, WATER, { ...water }, 24))
parts.push(torus(0.5, 0.025, 0, 1.455, 0, C.cream, { ...tile, rot: [Math.PI / 2, 0, 0] }, 28))
parts.push(cyl(0.12, 0.08, 0.18, 0, 1.53, 0, C.brass, { mat: 'metal' }, 16))
parts.push(sphere(0.07, 0, 1.62, 0, C.brass, { mat: 'metal' }, 16))
parts.push(cyl(0.012, 0.018, 0.18, 0, 1.71, 0, '#d6eef3', { mat: 'emissive' }, 10))

// four cascades from the middle bowl into the lower bowl
for (let i = 0; i < 4; i++) {
  const a = (i / 4) * Math.PI * 2 + Math.PI / 4
  parts.push(cyl(0.012, 0.016, 0.54, Math.sin(a) * 0.95, 0.85, Math.cos(a) * 0.95, WATER, { ...water }, 8))
}

// eight perimeter jets with brass nozzles
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2
  const x = Math.sin(a) * 2.8
  const z = Math.cos(a) * 2.8
  parts.push(cyl(0.045, 0.055, 0.05, x, 0.465, z, C.brass, { mat: 'metal' }, 12))
  parts.push(cyl(0.018, 0.018, 0.33, x, 0.285, z, C.steel, { mat: 'metal' }, 8))
  parts.push(cyl(0.012, 0.02, 0.66, x, 0.79, z, '#cfe9ef', { mat: 'emissive' }, 8))
  parts.push(sphere(0.025, x, 1.13, z, '#dff3f6', { mat: 'emissive' }, 8))
}

// four submerged uplights aimed at the centre bowls
for (let i = 0; i < 4; i++) {
  const a = (i / 4) * Math.PI * 2 + Math.PI / 4
  const x = Math.sin(a) * 2.1
  const z = Math.cos(a) * 2.1
  parts.push(cyl(0.06, 0.06, 0.02, x, 0.13, z, C.steel, { mat: 'metal' }, 16))
  parts.push(cyl(0.045, 0.045, 0.008, x, 0.145, z, '#ffe9c4', { mat: 'emissive' }, 16))
}

// bronze inlet plate on the outer wall
parts.push(rbox(0.34, 0.16, 0.02, 0.006, 0, 0.24, 3.99, C.brass, { mat: 'metal', side: 'double' }))

export default defineModel({
  id: 'plaza-fountain',
  name: '广场喷泉',
  category: 'outdoor',
  tags: ['fountain', 'plaza', 'water', '喷泉', '广场', '水景'],
  footprint: [8, 8],
  height: 1.8,
  placement: 'outdoor',
  parts,
})
