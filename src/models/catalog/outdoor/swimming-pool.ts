import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
parts.push(box(7, 0.12, 4.4, 0, 0.06, 0, C.concrete, { mat: 'stone' }))
parts.push(box(5.9, 0.42, 3.3, 0, 0.27, 0, '#b8c7c5', { mat: 'ceramic' }))
parts.push(box(5.36, 0.05, 2.76, 0, 0.14, 0, '#87b4bc', { mat: 'glass' }))
parts.push(box(5.38, 0.03, 2.78, 0, 0.36, 0, '#6eafba', { mat: 'glass', opacity: 0.52 }))
// coping rim
parts.push(box(6.4, 0.12, 0.55, 0, 0.46, -1.78, C.stone, { mat: 'stone' }))
parts.push(box(6.4, 0.12, 0.55, 0, 0.46, 1.78, C.stone, { mat: 'stone' }))
parts.push(box(0.55, 0.12, 3.0, -2.93, 0.46, 0, C.stone, { mat: 'stone' }))
parts.push(box(0.55, 0.12, 3.0, 2.93, 0.46, 0, C.stone, { mat: 'stone' }))
// steps
for (let i = 0; i < 3; i++) {
  parts.push(box(1.0, 0.13 * (3 - i), 0.36, -2.1, 0.2 + i * 0.08, -1.0 + i * 0.36, C.stone, { mat: 'stone' }))
}
// ladder
parts.push(cyl(0.03, 0.03, 1.4, 2.55, 1.05, -1.56, C.steel, { mat: 'metal' }, 10))
parts.push(cyl(0.03, 0.03, 1.4, 2.9, 1.05, -1.56, C.steel, { mat: 'metal' }, 10))
for (let i = 0; i < 4; i++) {
  parts.push(box(0.4, 0.035, 0.035, 2.725, 0.55 + i * 0.28, -1.56, C.steel, { mat: 'metal' }))
}
// small water spouts and ripples
for (const x of [-1.8, 0, 1.8]) {
  parts.push(cyl(0.03, 0.03, 0.36, x, 0.55, -1.63, C.brass, { mat: 'metal' }, 8))
  parts.push(sphere(0.055, x, 0.73, -1.63, '#cfe6e8', { mat: 'glass', opacity: 0.65 }, 8))
}
parts.push(box(1.2, 0.07, 0.55, -2.4, 0.15, 2.2, C.oak, { mat: 'wood' }))
parts.push(box(0.42, 0.35, 0.42, -3.0, 0.35, 2.2, C.terracotta, { mat: 'ceramic' }))
for (let i = 0; i < 5; i++) parts.push(cyl(0.02, 0.03, 0.65, -3.0 + (i - 2) * 0.06, 0.8, 2.2 + (i % 2) * 0.06, C.leaf, { mat: 'foliage' }, 6))

export default defineModel({
  id: 'swimming-pool',
  name: '庭院泳池',
  category: 'outdoor',
  tags: ['pool', 'swimming', '泳池', '水池'],
  footprint: [7, 4.4],
  height: 1.8,
  placement: 'outdoor',
  parts,
})
