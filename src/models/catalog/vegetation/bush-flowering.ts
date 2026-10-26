import { C, cone, cyl, defineModel, ico, sphere } from '../../kit'

const PINK = '#dfa7b8'
const ROSE = '#c9879c'
const WHITE = '#f3ece3'
const PALE = '#f0c8d2'
const CENTER = '#e8c766'

const BLOOMS: [number, number, number, string][] = [
  [0.06, 0.55, 0.3, PINK],
  [0.3, 0.46, 0.12, WHITE],
  [-0.26, 0.5, 0.16, ROSE],
  [0.16, 0.52, -0.24, PALE],
  [-0.14, 0.46, -0.27, PINK],
  [0.02, 0.66, 0.04, WHITE],
  [0.33, 0.38, -0.06, ROSE],
  [-0.32, 0.4, -0.06, WHITE],
  [0.12, 0.42, 0.38, ROSE],
  [-0.2, 0.36, 0.36, PINK],
  [0.04, 0.68, 0.22, WHITE],
  [-0.06, 0.6, -0.34, PALE],
]

const blooms = BLOOMS.map(([x, y, z, color], i) => {
  const r = 0.055 + (i % 3) * 0.008
  return sphere(r, x, y, z, color, {}, 8)
})

const centers = BLOOMS.filter((_, i) => i % 2 === 0).map(([x, y, z]) =>
  sphere(0.022, x, y + 0.012, z + 0.052, CENTER, {}, 6),
)

export default defineModel({
  id: 'bush-flowering',
  name: '开花灌木',
  category: 'vegetation',
  tags: ['bush', 'flower', '灌木', '开花', '花园'],
  footprint: [1.0, 1.0],
  height: 0.75,
  placement: 'outdoor',
  parts: [
    cyl(0.36, 0.42, 0.14, 0, 0.07, 0, '#35502f', { mat: 'foliage' }, 12),
    ico(0.3, 0, 0.32, 0, C.leaf, { mat: 'foliage' }, 1),
    ico(0.24, 0.22, 0.28, 0.08, C.leafLight, { mat: 'foliage' }, 1),
    ico(0.24, -0.22, 0.29, -0.06, C.leafDeep, { mat: 'foliage' }, 1),
    ico(0.22, 0.04, 0.31, 0.24, C.leaf, { mat: 'foliage' }, 1),
    ico(0.2, -0.04, 0.3, -0.24, C.leafLight, { mat: 'foliage' }, 0),
    ico(0.18, 0.16, 0.46, -0.14, '#93b073', { mat: 'foliage' }, 0),
    ico(0.17, -0.16, 0.45, 0.15, C.leaf, { mat: 'foliage' }, 0),
    ico(0.16, 0.02, 0.5, 0.02, C.leafLight, { mat: 'foliage' }, 0),
    // stems for the highest blooms
    cyl(0.009, 0.012, 0.2, 0.02, 0.56, 0.04, '#4c6a3d', { mat: 'foliage' }, 6),
    cyl(0.008, 0.011, 0.16, 0.05, 0.6, 0.2, '#4c6a3d', { mat: 'foliage' }, 6),
    ...blooms,
    ...centers,
    // soft grassy tips around the skirt
    cone(0.035, 0.16, 0.36, 0.1, 0.24, '#7d9a5e', { mat: 'foliage', rot: [0.3, 0, -0.55] }, 6),
    cone(0.03, 0.14, -0.34, 0.09, 0.26, '#8aa96b', { mat: 'foliage', rot: [-0.35, 0, 0.5] }, 6),
    cone(0.03, 0.13, 0.28, 0.09, -0.32, '#7d9a5e', { mat: 'foliage', rot: [0.5, 0, 0.3] }, 6),
  ],
})
