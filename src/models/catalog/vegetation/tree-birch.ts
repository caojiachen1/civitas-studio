import { C, box, cyl, defineModel, ico } from '../../kit'

const BARK_WHITE = '#e8e3d5'
const BARK_SHADE = '#d5cfbf'
const MARK = '#413e35'
const AIRY_A = '#9cb877'
const AIRY_B = '#aac385'
const AIRY_C = '#8da96b'
const AIRY_D = '#b4c98f'

// Dark lenticel marks wrapped deterministically around the white trunk.
const marks = Array.from({ length: 9 }, (_, i) => {
  const a = i * 2.39996 + 0.4
  const y = 0.45 + i * 0.27
  const r = y < 2.0 ? 0.152 : 0.114
  return box(
    0.13,
    0.04,
    0.06,
    Math.cos(a) * r,
    y,
    Math.sin(a) * r,
    MARK,
    { rot: [0, -(a + Math.PI / 2), 0] },
  )
})

export default defineModel({
  id: 'tree-birch',
  name: '白桦',
  category: 'vegetation',
  tags: ['tree', 'birch', '白桦', '乔木', '浅色树干'],
  footprint: [2.6, 2.6],
  height: 5.8,
  placement: 'outdoor',
  parts: [
    cyl(0.14, 0.19, 2.0, 0, 1.0, 0, BARK_WHITE, { mat: 'wood' }, 10),
    cyl(0.09, 0.13, 1.75, 0.03, 2.78, 0.01, BARK_SHADE, { mat: 'wood', rot: [0, 0, -0.05] }, 10),
    ...marks,
    // one broad scar and a low dark band
    box(0.09, 0.1, 0.035, 0.12, 1.42, 0.06, '#34322c', { rot: [0, -0.9, 0.1] }),
    box(0.03, 0.1, 0.09, -0.16, 0.82, 0, '#34322c', { rot: [0.2, 0, 0] }),
    // slender, upswept limbs rooted inside the trunk and reaching the crown
    cyl(0.045, 0.085, 1.02, -0.31, 3.475, 0.12, BARK_SHADE, { mat: 'wood', rot: [0.2, 0, 0.58] }, 8),
    cyl(0.04, 0.08, 1.0, 0.3, 3.45, -0.09, BARK_WHITE, { mat: 'wood', rot: [-0.18, 0, -0.55] }, 8),
    cyl(0.03, 0.06, 0.88, 0.075, 3.575, 0.28, BARK_SHADE, { mat: 'wood', rot: [0.5, 0, -0.17] }, 8),
    cyl(0.02, 0.04, 0.85, 0.03, 3.925, 0.02, BARK_WHITE, { mat: 'wood', rot: [0.06, 0, 0.07] }, 6),
    // airy, broken light-green crown
    ico(0.5, 0, 4.68, 0.02, AIRY_A, { mat: 'foliage' }, 1),
    ico(0.44, 0.55, 4.3, 0.2, AIRY_B, { mat: 'foliage' }, 1),
    ico(0.43, -0.52, 4.32, -0.18, AIRY_C, { mat: 'foliage' }, 1),
    ico(0.38, 0.12, 4.22, 0.62, AIRY_A, { mat: 'foliage' }, 0),
    ico(0.36, -0.18, 4.18, -0.6, AIRY_B, { mat: 'foliage' }, 0),
    ico(0.3, 0.7, 3.98, 0.1, C.leafLight, { mat: 'foliage' }, 0),
    ico(0.28, -0.68, 4.02, 0.05, AIRY_D, { mat: 'foliage' }, 0),
    ico(0.34, 0.72, 4.72, -0.25, AIRY_D, { mat: 'foliage' }, 0),
    ico(0.33, -0.68, 4.7, 0.32, AIRY_C, { mat: 'foliage' }, 0),
    ico(0.42, 0, 5.3, 0, AIRY_D, { mat: 'foliage' }, 1),
    ico(0.3, 0.38, 5.02, 0.42, AIRY_A, { mat: 'foliage' }, 0),
    ico(0.29, -0.4, 5.1, -0.3, AIRY_C, { mat: 'foliage' }, 0),
    ico(0.28, 0.45, 4.4, -0.55, AIRY_D, { mat: 'foliage' }, 0),
    ico(0.3, -0.45, 4.3, 0.58, AIRY_C, { mat: 'foliage' }, 0),
    ico(0.26, 0.16, 3.95, 0.5, AIRY_A, { mat: 'foliage' }, 0),
    ico(0.28, 0.25, 5.5, 0.08, AIRY_D, { mat: 'foliage' }, 0),
  ],
})
