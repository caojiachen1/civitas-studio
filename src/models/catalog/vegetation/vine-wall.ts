import { C, box, cyl, defineModel, ico, rbox, sphere } from '../../kit'

const WOOD = '#7b6146'
const VINE = '#6b7a4d'
const LEAVES = [C.leaf, C.leafDeep, C.leafLight, '#7d9a5a']

const leaves: [number, number, number][] = [
  [-0.72, 1.0, 0.11],
  [-0.5, 1.35, 0.1],
  [-0.55, 1.8, 0.09],
  [-0.25, 0.9, 0.1],
  [-0.15, 1.45, 0.12],
  [0.05, 1.9, 0.09],
  [0.28, 1.1, 0.11],
  [0.45, 1.55, 0.1],
  [0.6, 2.0, 0.09],
  [0.68, 1.3, 0.1],
  [0.15, 2.2, 0.11],
]

const flowers: [number, number, number][] = [
  [-0.6, 1.6, 0.06],
  [0.2, 1.7, 0.06],
  [0.55, 1.0, 0.06],
  [-0.05, 1.25, 0.06],
]

export default defineModel({
  id: 'vine-wall',
  name: '爬藤墙',
  category: 'vegetation',
  tags: ['vine wall', 'trellis', 'climbing plant', '爬藤墙', '藤蔓', '花架'],
  footprint: [2.0, 0.3],
  height: 2.4,
  placement: 'outdoor',
  parts: [
    // slim timber trellis
    rbox(0.07, 2.35, 0.07, 0.01, -0.93, 1.225, -0.09, WOOD, { mat: 'wood' }),
    rbox(0.07, 2.35, 0.07, 0.01, 0.93, 1.225, -0.09, WOOD, { mat: 'wood' }),
    box(1.86, 0.06, 0.05, 0, 0.7, -0.09, WOOD, { mat: 'wood' }),
    box(1.86, 0.06, 0.05, 0, 1.7, -0.09, WOOD, { mat: 'wood' }),
    box(0.045, 2.1, 0.04, -0.45, 1.2, -0.09, WOOD, { mat: 'wood' }),
    box(0.045, 2.1, 0.04, 0.45, 1.2, -0.09, WOOD, { mat: 'wood' }),
    box(0.035, 1.4, 0.025, 0, 1.2, -0.09, WOOD, { mat: 'wood', rot: [0, 0, 0.55] }),
    box(0.035, 1.4, 0.025, 0, 1.2, -0.09, WOOD, { mat: 'wood', rot: [0, 0, -0.55] }),
    // main vines climbing the lattice
    cyl(0.012, 0.018, 1.95, -0.7, 0.995, -0.03, VINE, { mat: 'wood' }, 6),
    cyl(0.012, 0.018, 2.2, -0.32, 1.12, -0.03, VINE, { mat: 'wood' }, 6),
    cyl(0.012, 0.018, 2.05, 0.15, 1.045, -0.03, VINE, { mat: 'wood' }, 6),
    cyl(0.012, 0.018, 2.3, 0.58, 1.17, -0.03, VINE, { mat: 'wood' }, 6),
    // side runners
    cyl(0.008, 0.012, 0.4, -0.5, 1.3, -0.01, VINE, { mat: 'wood', rot: [0, 0, -0.9] }, 5),
    cyl(0.008, 0.012, 0.36, 0.36, 1.85, -0.01, VINE, { mat: 'wood', rot: [0, 0, 0.9] }, 5),
    // leaf clusters pinned across the trellis
    ...leaves.map(([x, y, r], i) =>
      ico(r, x, y, 0.02, LEAVES[i % 4], { mat: 'foliage', rot: [0.2, i * 0.9, 0.15] }, 1),
    ),
    // a few pale blooms
    ...flowers.map(([x, y, z], i) =>
      sphere(0.028, x, y, z, i % 2 === 0 ? '#d9b3b6' : '#c9a099', { mat: 'matte' }, 8),
    ),
    // mulch strip at the foot of the trellis
    box(1.9, 0.05, 0.24, 0, 0.025, 0.0, C.soil, { mat: 'matte' }),
  ],
})
