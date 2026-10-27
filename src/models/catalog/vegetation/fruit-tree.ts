import { C, cone, cyl, defineModel, ico, sphere } from '../../kit'

const BARK = '#6d5039'
const BARK_DARK = '#5a412f'
const BARK_LIGHT = '#7f6045'

const roots: [number, number, number][] = [
  [0.42, 0.3, 0.42],
  [0.72, -0.35, 0.4],
  [1.55, 0.4, 0.38],
  [2.1, -0.3, 0.45],
]

const canopy: [number, number, number, number][] = [
  [0, 3.35, 0, 1.05],
  [-0.85, 3.1, 0.35, 0.75],
  [0.85, 3.15, -0.25, 0.78],
  [0.2, 3.05, 0.9, 0.7],
  [-0.3, 3.0, -0.95, 0.72],
  [-0.7, 3.75, 0.55, 0.62],
  [0.75, 3.7, 0.6, 0.6],
  [0.1, 3.85, -0.7, 0.58],
  [0.45, 4.0, -0.1, 0.5],
  [-1.1, 3.55, -0.4, 0.42],
]

const fruits: [number, number, number][] = [
  [1.58, 2.92, -0.17],
  [-1.54, 2.83, 0.54],
  [0.34, 2.7, 1.49],
  [-0.52, 2.71, -1.58],
  [1.11, 3.58, 1.06],
  [-1.44, 3.68, -0.61],
  [-1.01, 4.12, 0.93],
  [0.27, 4.08, -1.2],
  [0.7, 4.25, 0.25],
]

const grass: [number, number, number][] = [
  [-0.5, 0.5, 0.3],
  [0.55, 0.4, 0.26],
  [-0.6, -0.45, 0.22],
  [0.5, -0.55, 0.28],
]

export default defineModel({
  id: 'fruit-tree',
  name: '果树',
  category: 'vegetation',
  tags: ['fruit tree', 'orchard', 'apple', '果树', '苹果树', '乔木'],
  footprint: [3.6, 3.6],
  height: 4.5,
  placement: 'outdoor',
  parts: [
    // buttress roots
    ...roots.map(([a, r, h], i) =>
      cyl(0.05, 0.13, h, Math.cos(a) * r, h * 0.55, Math.sin(a) * r, i % 2 === 0 ? BARK : BARK_DARK, {
        mat: 'wood',
        rot: [0, -a, 0.85],
      }, 8),
    ),
    // short stout trunk and upper leader
    cyl(0.17, 0.27, 1.6, 0, 0.85, 0, BARK, { mat: 'wood' }, 12),
    cyl(0.11, 0.17, 0.78, 0.03, 1.9, 0.02, BARK_LIGHT, { mat: 'wood', rot: [0.02, 0, 0.05] }, 10),
    // four main boughs opening into a vase shape
    cyl(0.05, 0.1, 1.4, 0.32, 1.95, 0.05, BARK_LIGHT, { mat: 'wood', rot: [0.2, 0, -0.72] }, 8),
    cyl(0.05, 0.1, 1.35, -0.3, 1.92, 0.12, BARK, { mat: 'wood', rot: [-0.15, 0, 0.74] }, 8),
    cyl(0.045, 0.09, 1.3, 0.06, 1.95, 0.3, BARK_LIGHT, { mat: 'wood', rot: [0.7, 0, -0.2] }, 8),
    cyl(0.045, 0.09, 1.25, -0.08, 1.9, -0.28, BARK_DARK, { mat: 'wood', rot: [-0.72, 0, 0.18] }, 8),
    // fine twigs poking out of the crown
    cyl(0.018, 0.04, 0.72, 0.95, 3.2, 0.3, BARK_LIGHT, { mat: 'wood', rot: [0.15, 0, -0.5] }, 6),
    cyl(0.018, 0.04, 0.68, -0.95, 3.15, -0.15, BARK, { mat: 'wood', rot: [-0.1, 0, 0.55] }, 6),
    cyl(0.018, 0.035, 0.6, 0.25, 3.5, 0.9, BARK_LIGHT, { mat: 'wood', rot: [0.55, 0, -0.1] }, 6),
    // rounded layered crown
    ...canopy.map(([x, y, z, r], i) =>
      ico(r, x, y, z, [C.leaf, C.leafDeep, C.leafLight, '#7d9a5a', '#89a760'][i % 5], { mat: 'foliage' }, 1),
    ),
    // ripe fruit tucked into the outer canopy
    ...fruits.map(([x, y, z], i) =>
      sphere(0.06, x, y, z, i % 3 === 0 ? '#c27a45' : i % 2 === 0 ? '#c0603f' : '#b5533f', { mat: 'gloss' }, 10),
    ),
    // two fallen apples in the grass
    sphere(0.055, 0.55, 0.055, 0.78, '#b5533f', { mat: 'gloss' }, 10),
    sphere(0.05, -0.42, 0.05, 0.86, '#c0603f', { mat: 'gloss' }, 10),
    // tufts of grass at the foot of the trunk
    ...grass.map(([x, z, h], i) =>
      cone(0.03, h, x, h / 2 + 0.01, z, i % 2 === 0 ? '#6f8a4f' : '#7d9a5a', {
        mat: 'foliage',
        rot: [0.2, 0, i % 2 === 0 ? 0.18 : -0.15],
      }, 6),
    ),
  ],
})
