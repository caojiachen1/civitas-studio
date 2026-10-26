import { C, box, cyl, defineModel, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = [
  box(2.4, 0.07, 0.1, 0, 1.02, 0, C.walnut, { mat: 'wood' }),
  box(2.4, 0.045, 0.06, 0, 0.12, 0, C.blackMetal, { mat: 'metal' }),
  box(2.36, 0.035, 0.05, 0, 0.82, 0, C.blackMetal, { mat: 'metal' }),
]
for (const x of [-1.15, 1.15]) {
  parts.push(box(0.1, 1.06, 0.1, x, 0.53, 0, C.blackMetal, { mat: 'metal' }))
  parts.push(box(0.15, 0.045, 0.15, x, 1.07, 0, C.brass, { mat: 'metal' }))
}
for (let i = 0; i < 15; i++) {
  const x = -1.02 + (2.04 * i) / 14
  parts.push(cyl(0.012, 0.012, 0.87, x, 0.55, 0, C.blackMetal, { mat: 'metal' }, 6))
}
parts.push(box(1.98, 0.035, 0.035, 0, 0.72, 0, C.brass, { mat: 'metal' }))
parts.push(box(0.09, 0.16, 0.18, -1.15, 0.09, 0, C.blackMetal, { mat: 'metal' }))
parts.push(box(0.09, 0.16, 0.18, 1.15, 0.09, 0, C.blackMetal, { mat: 'metal' }))

// decorative scroll rings and brass collars on the posts
for (const x of [-0.55, 0.55]) {
  parts.push(torus(0.055, 0.009, x, 0.58, 0, C.brass, { mat: 'metal' }, 18))
  parts.push(torus(0.028, 0.007, x, 0.58, 0, C.brass, { mat: 'metal' }, 16))
}
for (const x of [-1.15, 1.15]) {
  parts.push(cyl(0.072, 0.072, 0.022, x, 0.42, 0, C.brass, { mat: 'metal' }, 16))
  parts.push(cyl(0.072, 0.072, 0.022, x, 0.96, 0, C.brass, { mat: 'metal' }, 16))
}
for (const x of [-1.15, 1.15]) {
  parts.push(box(0.13, 0.02, 0.18, x, 0.012, 0, C.graphite, { mat: 'metal' }))
  parts.push(sphere(0.011, x - 0.04, 0.03, 0.07, C.steel, { mat: 'metal' }, 8))
  parts.push(sphere(0.011, x + 0.04, 0.03, 0.07, C.steel, { mat: 'metal' }, 8))
}

export default defineModel({
  id: 'railing-section',
  name: '室内栏杆',
  category: 'structure',
  tags: ['railing', 'guardrail', '栏杆', '扶手'],
  footprint: [2.4, 0.18],
  height: 1.09,
  placement: 'indoor',
  parts,
})
