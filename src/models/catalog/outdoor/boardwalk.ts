import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
const DECK = 0.3

// 1.8 m x 4 m walkway: 25 cross boards at 0.16 m centres, rails at 1.05 m
for (let i = 0; i < 25; i++) {
  const z = -1.92 + i * 0.16
  const len = 1.78 + (i % 3) * 0.01
  const color = i % 7 === 0 ? '#a97f51' : C.oak
  parts.push(box(len, 0.045, 0.14, 0, DECK - 0.0225, z, color, { mat: 'wood' }))
}

// two longitudinal bearers, outer fascia and six short legs
for (const x of [-0.55, 0.55]) {
  parts.push(box(0.12, 0.14, 3.9, x, 0.19, 0, C.walnut, { mat: 'wood' }))
  for (const z of [-1.7, 0, 1.7]) {
    parts.push(box(0.14, 0.12, 0.14, x, 0.06, z, '#5c4130', { mat: 'wood' }))
  }
}
for (const x of [-0.91, 0.91]) {
  parts.push(box(0.04, 0.1, 3.96, x, 0.25, 0, C.walnut, { mat: 'wood' }))
}

// rail posts, top / mid / bottom rails and base plates
for (const x of [-0.86, 0.86]) {
  for (const z of [-1.86, -0.62, 0.62, 1.86]) {
    parts.push(box(0.09, 0.7, 0.09, x, DECK + 0.35, z, C.walnut, { mat: 'wood' }))
    parts.push(box(0.18, 0.03, 0.18, x, DECK + 0.015, z, C.graphite, { mat: 'metal' }))
    parts.push(cyl(0.012, 0.012, 0.02, x + 0.06, DECK + 0.035, z, C.steel, { mat: 'metal' }, 8))
    parts.push(cyl(0.012, 0.012, 0.02, x - 0.06, DECK + 0.035, z, C.steel, { mat: 'metal' }, 8))
  }
  parts.push(box(0.1, 0.1, 3.86, x, 1.0, 0, C.oak, { mat: 'wood' }))
  parts.push(box(0.05, 0.05, 3.82, x, 0.66, 0, C.walnut, { mat: 'wood' }))
  parts.push(box(0.05, 0.05, 3.82, x, 0.36, 0, C.walnut, { mat: 'wood' }))
}

// diagonal rail braces in each bay
for (const x of [-0.86, 0.86]) {
  for (const dir of [-1, 1]) {
    parts.push(cyl(0.024, 0.024, 1.36, x, 0.68, 0, C.walnut, { mat: 'wood', rot: [dir * 1.0, 0, 0] }, 8))
  }
}

export default defineModel({
  id: 'boardwalk',
  name: '木栈道',
  category: 'outdoor',
  tags: ['boardwalk', 'walkway', 'timber', '木栈道', '栈道', '木平台'],
  footprint: [1.9, 4],
  height: 1.05,
  placement: 'outdoor',
  parts,
})
