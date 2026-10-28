import { C, box, cone, cyl, defineModel, ico, sphere } from '../../kit'

const WOOD = '#8d6b49'
const STEM = '#5f7a45'

const FLOWERS: [number, number, number, string, number][] = [
  [-0.5, 0.12, 0.16, '#c45a5a', 0.05],
  [-0.3, -0.1, 0.2, '#e8b95e', 0.045],
  [-0.12, 0.15, 0.14, '#f0ece2', 0.055],
  [0.05, -0.08, 0.21, '#8f7fb8', 0.045],
  [0.24, 0.12, 0.16, '#d98fa6', 0.05],
  [0.42, -0.06, 0.18, '#c45a5a', 0.045],
  [0.55, 0.13, 0.13, '#f0ece2', 0.045],
  [0.34, 0.2, 0.15, '#e8b95e', 0.04],
  [-0.42, -0.16, 0.17, '#8f7fb8', 0.04],
  [0.15, 0.05, 0.2, '#d98fa6', 0.05],
  [-0.18, 0.21, 0.15, '#e8b95e', 0.04],
  [0.48, 0.21, 0.16, '#c45a5a', 0.045],
]

const stems = FLOWERS.map(([x, z, h]) =>
  cyl(0.008, 0.012, h, x, 0.13 + h / 2, z, STEM, { mat: 'foliage' }, 6),
)

const heads = FLOWERS.map(([x, z, h, color, r]) =>
  sphere(r, x, 0.13 + h, z, color, {}, 8),
)

const centers = FLOWERS.filter((_, i) => i % 2 === 0).map(([x, z, h]) =>
  sphere(0.017, x, 0.13 + h + 0.02, z + 0.04, '#e9d27a', {}, 6),
)

const grasses: [number, number, number, string][] = [
  [-0.55, -0.22, 0.26, '#6f8e5e'],
  [-0.2, -0.24, 0.22, '#7fa05a'],
  [0.16, -0.22, 0.24, '#5c7a4d'],
  [0.5, -0.24, 0.2, '#8fae6a'],
  [-0.58, 0.22, 0.18, '#8fae6a'],
  [0.58, -0.2, 0.22, '#6f8e5e'],
  [0.2, 0.24, 0.16, '#7fa05a'],
]

const blades = grasses.map(([x, z, h, color], i) => {
  const lean = i % 2 === 0 ? 0.14 : -0.12
  return cone(0.03, h, x, 0.13 + h / 2, z, color, { mat: 'foliage', rot: [lean, 0, lean * 0.6] }, 6)
})

// Pointed leaves fan out from the base of each flower stem.
const leaves = FLOWERS.flatMap(([x, z], i) => {
  const a = i * 0.9 + 0.3
  return [0, 1].map((k) => {
    const aa = a + k * 1.5
    return cone(
      0.026,
      0.1 + (i % 3) * 0.022,
      x + Math.cos(aa) * 0.05,
      0.21 + (i % 3) * 0.03,
      z + Math.sin(aa) * 0.05,
      i % 2 === 0 ? '#5f7e4a' : '#6f8e5e',
      { mat: 'foliage', rot: [0.68, aa, 0.18] },
      5,
    )
  })
})

// Pebbles, mulch and a few closed buds.
const pebbles = Array.from({ length: 12 }, (_, i) => {
  const a = i * 0.524
  const r = 0.18 + (i % 5) * 0.09
  return ico(0.016 + (i % 3) * 0.006, Math.cos(a) * r, 0.175, Math.sin(a) * r * 0.4, i % 2 === 0 ? '#9b978c' : '#87837a', { mat: 'stone' }, 0)
})

const mulch = Array.from({ length: 9 }, (_, i) => {
  const a = i * 0.7 + 0.2
  return box(0.11, 0.008, 0.022, Math.cos(a) * (0.2 + (i % 4) * 0.1), 0.168, Math.sin(a) * (0.08 + (i % 3) * 0.05), i % 2 === 0 ? '#6b543a' : '#7d6547', { mat: 'wood', rot: [0, a, 0.04] })
})

const buds = [
  [-0.35, 0.18, 0.24],
  [0.3, -0.2, 0.26],
  [0.58, 0.05, 0.22],
].map(([x, z, y], i) =>
  sphere(0.018, x, y, z, i % 3 === 0 ? '#c45a5a' : '#e8b95e', { mat: 'gloss' }, 8),
)

// Tall accent spikes lift the back of the border.
const SPIKES: [number, number, string, string][] = [
  [-0.58, 0.14, '#8f7fb8', '#6f6290'],
  [-0.2, -0.16, '#d98fa6', '#b47287'],
  [0.3, 0.15, '#e8b95e', '#b98f42'],
  [0.6, -0.1, '#f0ece2', '#c9c3b3'],
]
const spikes = SPIKES.flatMap(([x, z, color, stemColor], i) => {
  const h = 0.17 + (i % 2) * 0.015
  return [
    cyl(0.005, 0.008, h, x, 0.17 + h / 2, z, stemColor, { mat: 'foliage', rot: [0, 0, i % 2 === 0 ? 0.04 : -0.05] }, 5),
    cone(0.026, 0.06, x + (i % 2 === 0 ? 0.006 : -0.006), 0.355, z, color, {
      mat: 'foliage',
      rot: [0.04, i * 0.8, 0],
    }, 7),
  ]
})

// Fallen petals rest on the mounded soil.
const PETALS: [number, number, string][] = [
  [-0.42, 0.06, '#e8c0c8'],
  [-0.05, 0.2, '#f0ece2'],
  [0.22, -0.12, '#e3b1be'],
  [0.5, 0.14, '#f0ece2'],
  [-0.3, -0.18, '#d9a8b6'],
]
const fallenPetals = PETALS.map(([x, z, color], i) =>
  cyl(0.022, 0.014, 0.004, x, 0.178 + i * 0.0006, z, color, { mat: 'matte', rot: [0, i * 1.2, 0] }, 6),
)

// Low rosettes knit the planting together.
const ROSETTES: [number, number, string][] = [
  [-0.5, -0.14, '#5d7c4a'],
  [0.08, -0.02, '#68884f'],
  [0.46, 0.16, '#547243'],
]
const rosettes = ROSETTES.flatMap(([x, z, color], ri) =>
  [0, 1, 2].map((k) => {
    const a = (k * Math.PI * 2) / 3 + ri * 0.6
    return ico(0.045 + (k % 2) * 0.008, x + Math.cos(a) * 0.04, 0.195, z + Math.sin(a) * 0.03, k === 1 ? '#6f8e5e' : color, {
      mat: 'foliage',
      rot: [0.2, a, 0.1],
    }, 0)
  }),
)

export default defineModel({
  id: 'flower-bed',
  name: '花坛',
  category: 'vegetation',
  tags: ['flower bed', '花坛', '花卉', '花园', '种植池'],
  footprint: [1.5, 0.7],
  height: 0.4,
  placement: 'outdoor',
  parts: [
    // timber frame with stone corner caps
    box(1.5, 0.16, 0.08, 0, 0.08, 0.31, WOOD, { mat: 'wood' }),
    box(1.5, 0.16, 0.08, 0, 0.08, -0.31, WOOD, { mat: 'wood' }),
    box(0.08, 0.16, 0.54, 0.71, 0.08, 0, '#96744f', { mat: 'wood' }),
    box(0.08, 0.16, 0.54, -0.71, 0.08, 0, '#96744f', { mat: 'wood' }),
    box(0.09, 0.21, 0.09, 0.705, 0.105, 0.305, C.stone, { mat: 'stone' }),
    box(0.09, 0.21, 0.09, -0.705, 0.105, 0.305, C.stone, { mat: 'stone' }),
    box(0.09, 0.21, 0.09, 0.705, 0.105, -0.305, C.stone, { mat: 'stone' }),
    box(0.09, 0.21, 0.09, -0.705, 0.105, -0.305, C.stone, { mat: 'stone' }),
    // soil fill, slightly mounded
    box(1.34, 0.06, 0.54, 0, 0.11, 0, C.soil),
    box(1.22, 0.05, 0.44, 0, 0.15, 0, '#86704f'),
    // low leafy plants
    ico(0.07, -0.18, 0.2, 0.18, '#5d7c4a', { mat: 'foliage' }, 0),
    ico(0.06, 0.48, 0.19, -0.16, '#68884f', { mat: 'foliage' }, 0),
    ico(0.055, -0.02, 0.19, -0.2, '#5d7c4a', { mat: 'foliage' }, 0),
    ...stems,
    ...heads,
    ...centers,
    ...blades,
    ...leaves,
    ...pebbles,
    ...mulch,
    ...buds,
    ...spikes,
    ...fallenPetals,
    ...rosettes,
  ],
})
