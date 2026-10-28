import { C, box, cyl, defineModel, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = [
  box(3.4, 0.08, 6.0, 0, 0.04, 0, C.concrete, { mat: 'stone' }),
  box(3.0, 0.02, 5.6, 0, 0.09, 0, '#8c958b', { mat: 'stone' }),
]
for (const x of [-1.45, 1.45]) {
  for (const z of [-2.6, 2.6]) {
    parts.push(box(0.16, 2.6, 0.16, x, 1.4, z, C.blackMetal, { mat: 'metal' }))
    parts.push(cyl(0.2, 0.24, 0.11, x, 0.14, z, C.stone, { mat: 'stone' }, 12))
    parts.push(box(0.28, 0.08, 0.28, x, 2.72, z, C.steel, { mat: 'metal' }))
  }
  parts.push(box(0.18, 0.26, 5.6, x, 2.62, 0, C.walnut, { mat: 'wood' }))
}
for (let i = 0; i < 9; i++) {
  parts.push(box(3.2, 0.07, 0.28, 0, 2.82 + (i % 3) * 0.02, -2.5 + i * 0.64, C.oak, { mat: 'wood', rot: [0.035, 0, 0] }))
}
parts.push(box(3.0, 0.035, 5.4, 0, 2.92, 0, '#b7c9c8', { mat: 'glass', opacity: 0.22 }))
parts.push(box(0.7, 1.0, 0.4, 1.1, 0.6, -2.25, C.graphite, { mat: 'metal' }))
parts.push(box(0.5, 0.18, 0.36, 1.1, 1.22, -2.25, C.steel, { mat: 'metal' }))
parts.push(cyl(0.035, 0.035, 0.65, -1.35, 0.55, 2.35, C.brass, { mat: 'metal' }, 10))
parts.push(box(0.32, 0.18, 0.22, -1.35, 0.9, 2.35, C.blackMetal, { mat: 'metal' }))
parts.push(box(1.4, 0.05, 0.34, -0.8, 1.4, -2.35, C.oak, { mat: 'wood' }))
parts.push(box(0.5, 0.35, 0.3, -0.35, 1.6, -2.35, C.terracotta, { mat: 'ceramic' }))

// rafters under the slatted roof, front gutter with a downspout, hose reel and wheel stop
for (const x of [-1.1, 0, 1.1]) {
  parts.push(box(0.08, 0.06, 5.7, x, 2.755, 0, C.walnut, { mat: 'wood' }))
}
parts.push(box(3.24, 0.09, 0.12, 0, 2.8, 2.74, C.graphite, { mat: 'metal' }))
parts.push(cyl(0.035, 0.035, 2.62, 1.6, 1.44, 2.78, C.graphite, { mat: 'metal' }, 10))
parts.push(cyl(0.035, 0.035, 0.2, 1.6, 0.16, 2.68, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10))
parts.push(torus(0.15, 0.032, -1.36, 1.5, -2.6, '#3f5b52', { mat: 'matte', rot: [0, Math.PI / 2, 0] }, 18))
parts.push(box(1.6, 0.1, 0.16, 0, 0.14, 2.36, C.concrete, { mat: 'stone' }))

export default defineModel({
  id: 'carport',
  name: '现代车棚',
  category: 'outdoor',
  tags: ['carport', 'garage', '车棚', '车库'],
  footprint: [3.4, 6.0],
  height: 2.98,
  placement: 'outdoor',
  parts,
})
