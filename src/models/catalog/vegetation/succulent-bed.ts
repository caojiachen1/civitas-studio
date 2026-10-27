import { C, box, cone, defineModel, ico } from '../../kit'

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
    // layered rosette succulents
    ...petalParts,
    ...centers,
  ],
})
