import { C, box, cyl, defineModel, ico, rbox, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
for (const x of [-1.5, 1.5]) {
  for (const z of [-1.5, 1.5]) {
    parts.push(box(0.16, 2.55, 0.16, x, 1.275, z, C.walnut, { mat: 'wood' }))
    parts.push(box(0.26, 0.1, 0.26, x, 0.06, z, C.stone, { mat: 'stone' }))
  }
  parts.push(box(0.15, 0.22, 3.3, x, 2.6, 0, C.walnut, { mat: 'wood' }))
  parts.push(box(0.18, 0.16, 3.3, x, 2.82, 0, C.oak, { mat: 'wood' }))
}
for (let i = 0; i < 10; i++) {
  parts.push(box(3.5, 0.055, 0.09, 0, 2.94, -1.55 + i * 0.34, C.oak, { mat: 'wood' }))
}
for (const z of [-1.5, 1.5]) {
  parts.push(box(3.3, 0.13, 0.14, 0, 2.7, z, C.walnut, { mat: 'wood' }))
}
parts.push(box(2.0, 0.06, 0.55, 0, 0.48, 1.15, C.oak, { mat: 'wood' }))
for (const x of [-0.85, 0.85]) {
  parts.push(box(0.08, 0.44, 0.45, x, 0.24, 1.15, C.walnut, { mat: 'wood' }))
}
parts.push(cyl(0.28, 0.3, 0.42, -0.85, 0.21, -1.1, C.terracotta, { mat: 'ceramic' }, 16))
parts.push(cyl(0.22, 0.26, 0.5, 0.8, 0.25, -1.15, C.clay, { mat: 'ceramic' }, 16))
for (let i = 0; i < 8; i++) {
  const x = -0.85 + Math.sin(i * 2.1) * 0.32
  parts.push(ico(0.26 + (i % 3) * 0.08, x, 0.7 + (i % 4) * 0.1, -1.1 + Math.cos(i * 1.7) * 0.24, i % 2 ? C.leaf : C.leafLight, { mat: 'foliage' }, 0))
}
for (let i = 0; i < 5; i++) {
  parts.push(ico(0.16, -1.58 + (i % 2) * 0.1, 2.4 - i * 0.25, -1.4 + i * 0.45, C.leafDeep, { mat: 'foliage' }, 0))
}
parts.push(box(0.05, 1.2, 0.05, -1.5, 1.2, -1.5, C.walnut, { mat: 'wood' }))
parts.push(box(0.05, 0.05, 2.7, -1.52, 1.35, -0.2, C.walnut, { mat: 'wood' }))

// bench cushion and a folded throw
parts.push(rbox(1.9, 0.06, 0.5, 0.02, 0, 0.54, 1.15, C.linen, { mat: 'fabric' }))
parts.push(rbox(0.4, 0.075, 0.5, 0.03, 0.66, 0.61, 1.15, C.blush, { mat: 'fabric', rot: [0, 0.08, 0] }))
// string lights strung beneath the rafters
parts.push(cyl(0.004, 0.004, 3.2, 0, 2.86, 0, C.blackMetal, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 6))
for (const z of [-1.5, -0.9, -0.3, 0.3, 0.9, 1.5]) {
  parts.push(sphere(0.022, 0, 2.845, z, '#ffe0a8', { mat: 'emissive' }, 8))
}
// climbing vine on the front-left post
parts.push(cyl(0.008, 0.008, 1.35, -1.57, 1.2, 1.59, C.leafDeep, { mat: 'foliage', rot: [0, 0, 0.04] }, 6))
for (const y of [0.75, 1.05, 1.35, 1.65]) {
  parts.push(ico(0.09, -1.6, y, 1.62, y > 1.2 ? C.leaf : C.leafLight, { mat: 'foliage' }, 0))
}
// forged bolt heads pinning the beams to the posts
for (const x of [-1.59, 1.59]) {
  for (const z of [-1.5, 1.5]) {
    parts.push(cyl(0.018, 0.018, 0.025, x, 2.36, z, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8))
  }
}
// hanging planter under the front beam
parts.push(cyl(0.005, 0.005, 0.24, 0.9, 2.515, 1.5, C.blackMetal, { mat: 'metal' }, 6))
parts.push(cyl(0.13, 0.09, 0.16, 0.9, 2.32, 1.5, C.terracotta, { mat: 'ceramic' }, 16))
parts.push(torus(0.126, 0.01, 0.9, 2.398, 1.5, C.clay, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 16))
parts.push(ico(0.16, 0.9, 2.45, 1.5, C.leaf, { mat: 'foliage' }, 1))
parts.push(ico(0.09, 1.02, 2.34, 1.46, C.leafLight, { mat: 'foliage' }, 0))

export default defineModel({
  id: 'pergola',
  name: '木制凉棚',
  category: 'outdoor',
  tags: ['pergola', 'arbor', '凉棚', '花架'],
  footprint: [3.5, 3.4],
  height: 2.99,
  placement: 'outdoor',
  parts,
})
