import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
const rise = 0.2
const lowerSteps = 8
const upperSteps = 8
for (let i = 0; i < lowerSteps; i++) {
  const z = -1.5 + 0.19 * (i + 0.5)
  const y = rise * (i + 1)
  parts.push(box(1.1, 0.06, 0.21, -0.55, y - 0.03, z, C.oak, { mat: 'wood' }))
  parts.push(box(1.0, rise - 0.02, 0.035, -0.55, y - rise / 2, z - 0.095, C.cream))
}
parts.push(box(1.3, 0.16, 1.0, -0.55, 1.68, 0.3, C.concrete, { mat: 'stone' }))
for (let i = 0; i < upperSteps; i++) {
  const x = -0.55 + 0.2 * (i + 0.5)
  const y = 1.8 + rise * (i + 1)
  parts.push(box(0.22, 0.06, 1.0, x, y - 0.03, 0.8, C.oak, { mat: 'wood' }))
  parts.push(box(0.035, rise - 0.02, 0.95, x - 0.1, y - rise / 2, 0.8, C.cream))
}
for (const side of [-1, 1]) {
  const x = side * 0.58
  for (let i = 0; i < 5; i++) {
    const z = -1.4 + i * 0.36
    parts.push(cyl(0.017, 0.017, 0.9, x, 0.5 + i * 0.2 + 0.45, z, C.blackMetal, { mat: 'metal' }, 8))
    parts.push(cyl(0.017, 0.017, 0.9, x, 2.25, z, C.blackMetal, { mat: 'metal' }, 8))
  }
  parts.push(box(0.06, 0.06, 1.15, x, 0.98, -1.0, C.walnut, { mat: 'wood' }))
  parts.push(box(0.06, 0.06, 1.15, x, 2.0, -1.0, C.walnut, { mat: 'wood' }))
}
parts.push(box(1.3, 0.06, 0.06, -0.55, 1.0, -1.62, C.walnut, { mat: 'wood' }))
parts.push(box(0.06, 0.9, 0.06, 0.06, 2.35, 1.35, C.blackMetal, { mat: 'metal' }))
parts.push(box(0.06, 0.06, 1.1, 0.06, 2.78, 0.85, C.walnut, { mat: 'wood' }))
parts.push(box(0.95, 0.06, 0.95, -0.55, 1.75, 0.3, C.oak, { mat: 'wood' }))

// nosing strips, landing trim, newel caps and rail brackets
for (let i = 0; i < lowerSteps; i++) {
  const z = -1.5 + 0.19 * (i + 0.5)
  const y = rise * (i + 1)
  parts.push(box(1.02, 0.007, 0.02, -0.55, y + 0.003, z + 0.095 - 0.012, C.brass, { mat: 'metal' }))
  parts.push(box(0.86, 0.004, 0.01, -0.55, y + 0.008, z + 0.095 - 0.05, '#6d665b', { mat: 'stone' }))
}
for (let i = 0; i < upperSteps; i++) {
  const x = -0.55 + 0.2 * (i + 0.5)
  const y = 1.8 + rise * (i + 1)
  parts.push(box(0.02, 0.007, 0.92, x + 0.1 - 0.012, y + 0.003, 0.8, C.brass, { mat: 'metal' }))
  parts.push(box(0.01, 0.004, 0.8, x + 0.1 - 0.05, y + 0.008, 0.8, '#6d665b', { mat: 'stone' }))
}
parts.push(box(0.06, 0.01, 0.94, -0.06, 1.788, 0.3, C.brass, { mat: 'metal' }))
parts.push(box(0.94, 0.01, 0.06, -0.55, 1.788, 0.77, C.brass, { mat: 'metal' }))
for (const side of [-1, 1]) {
  const x = side * 0.58
  parts.push(cyl(0.045, 0.055, 0.04, x, 1.0, -1.4, C.brass, { mat: 'metal' }, 14))
  parts.push(cyl(0.045, 0.055, 0.04, x, 2.38, 1.35, C.brass, { mat: 'metal' }, 14))
  parts.push(sphere(0.014, x, 1.03, -1.4, C.steel, { mat: 'metal' }, 8))
  parts.push(sphere(0.014, x, 2.81, 1.35, C.steel, { mat: 'metal' }, 8))
  for (let i = 0; i < 4; i++) {
    const z = -1.3 + i * 0.42
    parts.push(box(0.07, 0.03, 0.1, x + side * 0.02, 0.97 + i * 0.2, z, C.blackMetal, { mat: 'metal' }))
  }
}

export default defineModel({
  id: 'stair-l',
  name: 'L 形转角楼梯',
  category: 'structure',
  tags: ['stairs', 'corner stair', '楼梯', '转角楼梯'],
  footprint: [2.4, 3.2],
  height: 3.42,
  placement: 'indoor',
  parts,
})
