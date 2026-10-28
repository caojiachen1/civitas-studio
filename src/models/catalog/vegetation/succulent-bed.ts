import { C, box, cone, cyl, defineModel, ico } from '../../kit'

const WOOD = '#8a6a4a'
const WOOD_LIGHT = '#9c7955'
const PETALS = ['#8fae9a', '#7d9c88', '#a3b8a3']

const pebbles: [number, number, number, number][] = [
  [-0.5, -0.2, 0.045, 0.165],
  [0.5, 0.18, 0.04, 0.16],
  [0.02, -0.26, 0.032, 0.16],
]

type Rosette = {
  x: number
  z: number
  y: number
  petals: number
}

const rosettes: Rosette[] = [
  { x: -0.32, z: 0.05, y: 0.21, petals: 5 },
  { x: 0.3, z: -0.08, y: 0.21, petals: 5 },
  { x: 0.02, z: 0.22, y: 0.19, petals: 3 },
]

const petalParts = rosettes.flatMap(({ x, z, y, petals }, ri) =>
  Array.from({ length: petals }, (_, i) => {
    const a = (i * Math.PI * 2) / petals + ri * 0.6
    return cone(0.055, 0.16, x - Math.cos(a) * 0.06, y, z + Math.sin(a) * 0.06, PETALS[(i + ri) % 3], {
      mat: 'foliage',
      rot: [0, a, 1.2],
    }, 6)
  }),
)

// stacked leaf cores; the tall middle rosette tops out at 0.4 m
const centers = [
  ico(0.05, -0.32, 0.2675, 0.05, '#9db39c', { mat: 'foliage' }, 1),
  ico(0.06, 0.3, 0.27, -0.08, '#9db39c', { mat: 'foliage' }, 1),
  ico(0.04, 0.3, 0.36, -0.08, '#b98f88', { mat: 'foliage' }, 1),
  ico(0.04, 0.02, 0.236, 0.22, '#9db39c', { mat: 'foliage' }, 1),
]

// Two smaller pups fill the open corners of the bed.
const EXTRA_ROSETTES: [number, number, number, number][] = [
  [-0.06, -0.16, 0.185, 4],
  [0.52, 0.21, 0.19, 3],
]
const extraPetalParts = EXTRA_ROSETTES.flatMap(([x, z, y, petals], ri) =>
  Array.from({ length: petals }, (_, i) => {
    const a = (i * Math.PI * 2) / petals + ri * 0.9
    return cone(0.038, 0.12, x - Math.cos(a) * 0.045, y, z + Math.sin(a) * 0.045, PETALS[(i + ri + 1) % 3], {
      mat: 'foliage',
      rot: [0, a, 1.2],
    }, 5)
  }),
)
const extraCenters = EXTRA_ROSETTES.map(([x, z, y], i) =>
  ico(0.04, x, y + 0.035, z, i === 0 ? '#a7bda4' : '#b98f88', { mat: 'foliage' }, 1),
)

// Three coral flower stalks rise at the back of the bed.
const BLOOM_STALKS: [number, number, string][] = [
  [0.58, -0.19, '#c9a099'],
  [0.06, 0.31, '#d9b3a8'],
  [-0.55, 0.2, '#c9a099'],
]
const bloomStalks = BLOOM_STALKS.flatMap(([x, z, color], i) => [
  cyl(0.004, 0.006, 0.13, x, 0.215, z, '#8a9a7c', { mat: 'foliage', rot: [0.04, 0, i % 2 === 0 ? 0.08 : -0.07] }, 5),
  ico(0.014, x + (i % 2 === 0 ? 0.012 : -0.01), 0.29, z, color, { mat: 'foliage' }, 0),
  ico(0.011, x - (i % 2 === 0 ? 0.008 : -0.012), 0.302, z + 0.012, '#e3c3bd', { mat: 'foliage' }, 0),
])

// Grit and moss gather between the rosettes.
const GRIT: [number, number, number, string][] = [
  [-0.48, 0.16, 0.012, '#9b978c'],
  [0.14, -0.24, 0.01, '#87837a'],
  [0.42, 0.06, 0.009, '#a6a196'],
  [-0.2, -0.07, 0.011, '#8f8b80'],
  [0.6, -0.3, 0.013, '#9b978c'],
  [-0.6, -0.27, 0.01, '#87837a'],
  [0.24, 0.26, 0.008, '#a6a196'],
  [-0.42, 0.29, 0.009, '#9b978c'],
]
const grit = GRIT.map(([x, z, r, color], i) =>
  ico(r, x, 0.156 + (i % 2) * 0.002, z, color, { mat: 'stone', rot: [0.2, i, 0.1] }, 0),
)
const mossPatches = [
  ico(0.035, -0.12, 0.157, -0.26, '#7d8c64', { mat: 'foliage' }, 0),
  ico(0.028, 0.34, 0.156, -0.13, '#8a9870', { mat: 'foliage' }, 0),
]

export default defineModel({
  id: 'succulent-bed',
  name: '多肉花境',
  category: 'vegetation',
  tags: ['succulent', 'rock garden', '多肉花境', '多肉', '花境', '旱生植物'],
  footprint: [1.4, 0.8],
  height: 0.4,
  placement: 'outdoor',
  parts: [
    // low timber border
    box(1.4, 0.16, 0.07, 0, 0.08, -0.365, WOOD, { mat: 'wood' }),
    box(1.4, 0.16, 0.07, 0, 0.08, 0.365, WOOD, { mat: 'wood' }),
    box(0.07, 0.16, 0.66, -0.665, 0.08, 0, WOOD_LIGHT, { mat: 'wood' }),
    box(0.07, 0.16, 0.66, 0.665, 0.08, 0, WOOD_LIGHT, { mat: 'wood' }),
    // stone corner caps
    box(0.08, 0.18, 0.08, -0.655, 0.09, -0.36, C.stone, { mat: 'stone' }),
    box(0.08, 0.18, 0.08, 0.655, 0.09, -0.36, C.stone, { mat: 'stone' }),
    box(0.08, 0.18, 0.08, -0.655, 0.09, 0.36, C.stone, { mat: 'stone' }),
    box(0.08, 0.18, 0.08, 0.655, 0.09, 0.36, C.stone, { mat: 'stone' }),
    // soil and grit top dressing
    box(1.26, 0.1, 0.66, 0, 0.1, 0, C.soil, { mat: 'matte' }),
    box(1.2, 0.04, 0.6, 0, 0.14, 0, C.sand, { mat: 'matte' }),
    // scattered pebbles
    ...pebbles.map(([x, z, r, y], i) =>
      ico(r, x, y, z, i % 2 === 0 ? '#9b978c' : '#87837a', { mat: 'stone' }, 0),
    ),
    ...grit,
    ...mossPatches,
    // layered rosette succulents
    ...petalParts,
    ...centers,
    ...extraPetalParts,
    ...extraCenters,
    ...bloomStalks,
  ],
})
