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

// Old woody stems show through the skirt of the shrub.
const woodyStems = [0.45, 1.6, 2.75, 3.9, 5.1].map((a, i) =>
  cyl(0.011, 0.019, 0.32, Math.cos(a) * 0.16, 0.27, Math.sin(a) * 0.16, i % 2 === 0 ? '#5b4630' : '#4f3d2a', {
    mat: 'wood',
    rot: [0.26 * Math.cos(a), -a, 0.26 * Math.sin(a)],
  }, 5),
)

// Tight buds wait at the edge of the flowering mass.
const BUDS: [number, number, number, string][] = [
  [0.42, 0.48, 0.12, ROSE],
  [-0.36, 0.53, -0.18, PINK],
  [0.12, 0.58, -0.36, PALE],
  [-0.14, 0.46, 0.38, ROSE],
]
const buds = BUDS.flatMap(([x, y, z, color], i) => [
  cyl(0.012, 0.014, 0.02, x, y - 0.02, z, '#4f6b40', { mat: 'foliage' }, 6),
  sphere(0.024 + (i % 2) * 0.004, x, y, z, color, {}, 8),
])

// Wind-blown petals dot the ground around the shrub.
const FALLEN_PETALS: [number, number, string, number][] = [
  [0.45, 0.1, PINK, 0.4],
  [-0.44, 0.13, PALE, 1.2],
  [0.22, -0.46, WHITE, 2.4],
  [-0.22, -0.45, ROSE, 0.8],
  [0.44, -0.22, PINK, 1.9],
  [-0.4, -0.28, WHITE, 2.9],
]
const fallenPetals = FALLEN_PETALS.map(([x, z, color, a], i) =>
  cyl(0.032, 0.022, 0.005, x, 0.004 + i * 0.0005, z, color, { mat: 'matte', rot: [0, a, 0] }, 7),
)

// Two dry grass panicles hang over the skirt.
const dryGrass = [
  [-0.3, 0.22, 0.42],
  [0.34, 0.28, 0.38],
].flatMap(([x, z, h], i) => [
  cyl(0.005, 0.008, h, x, h / 2 + 0.02, z, '#8b8a5c', { mat: 'foliage', rot: [0.1, 0, i === 0 ? 0.3 : -0.28] }, 5),
  cone(0.022, 0.07, x + (i === 0 ? 0.04 : -0.03), h + 0.05, z + 0.02, '#a9a375', {
    mat: 'foliage',
    rot: [0.15, 0, i === 0 ? 0.4 : -0.35],
  }, 6),
])

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
    ...woodyStems,
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
    ...buds,
    // soft grassy tips around the skirt
    cone(0.035, 0.16, 0.36, 0.1, 0.24, '#7d9a5e', { mat: 'foliage', rot: [0.3, 0, -0.55] }, 6),
    cone(0.03, 0.14, -0.34, 0.09, 0.26, '#8aa96b', { mat: 'foliage', rot: [-0.35, 0, 0.5] }, 6),
    cone(0.03, 0.13, 0.28, 0.09, -0.32, '#7d9a5e', { mat: 'foliage', rot: [0.5, 0, 0.3] }, 6),
    ...dryGrass,
    ...fallenPetals,
  ],
})
