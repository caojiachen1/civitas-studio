import { cone, defineModel, ico, rbox } from '../../kit'

const ROCK_MID = '#918d82'
const ROCK_LIGHT = '#a29e92'
const ROCK_DARK = '#79766c'
const GRAVEL = '#8a857a'
const GRAVEL_LIGHT = '#9b968a'
const MOSS = '#6d7c52'
const MOSS_LIGHT = '#7f8d5f'

// A seated main boulder with a smaller capstone, then satellite stones that
// step down in size. Rotations are fixed so every facet catches light differently.
const mainRocks = [
  ico(0.6, -0.28, 0.34, 0, ROCK_MID, { mat: 'stone', rot: [0.15, 0.4, 0.1] }, 1),
  ico(0.38, 0.16, 0.3, 0.14, ROCK_LIGHT, { mat: 'stone', rot: [-0.2, 0.9, 0.15] }, 1),
  ico(0.26, -0.2, 0.67, 0.12, ROCK_MID, { mat: 'stone', rot: [0.3, 1.5, -0.2] }, 1),
]

const satellites = [
  ico(0.34, 0.8, 0.2, 0.3, ROCK_DARK, { mat: 'stone', rot: [0.2, 0.4, 0.05] }, 1),
  ico(0.28, -0.9, 0.19, -0.22, ROCK_LIGHT, { mat: 'stone', rot: [-0.15, 1.1, 0.2] }, 1),
  ico(0.24, 0.55, 0.14, -0.52, ROCK_MID, { mat: 'stone', rot: [0.1, 2.0, -0.1] }, 1),
  ico(0.2, 0.96, 0.13, 0.02, ROCK_DARK, { mat: 'stone', rot: [0.3, 0.7, 0.1] }, 0),
  ico(0.18, -0.5, 0.12, 0.62, ROCK_MID, { mat: 'stone', rot: [-0.2, 1.4, 0.15] }, 0),
]

// Moss gathers on the shaded crown and in the seams between rocks.
const moss = [
  ico(0.1, -0.34, 0.85, 0.06, MOSS, { mat: 'foliage' }, 0),
  ico(0.085, -0.04, 0.79, 0.18, MOSS_LIGHT, { mat: 'foliage' }, 0),
  ico(0.07, 0.12, 0.55, 0.28, MOSS, { mat: 'foliage' }, 0),
  ico(0.08, -0.66, 0.42, -0.16, MOSS_LIGHT, { mat: 'foliage' }, 0),
  ico(0.065, 0.74, 0.36, 0.34, MOSS, { mat: 'foliage' }, 0),
]

const lichen = [
  ico(0.07, 0.05, 0.42, -0.38, '#8d9076', { mat: 'stone' }, 0),
  ico(0.055, -0.48, 0.24, 0.32, '#a3a184', { mat: 'stone' }, 0),
]

const pebbles = [
  [0.62, 0.06, 0.62, 0.075],
  [0.2, 0.05, 0.7, 0.06],
  [-0.62, 0.06, 0.55, 0.07],
  [-0.2, 0.05, -0.66, 0.055],
  [0.35, 0.05, -0.72, 0.05],
  [-0.95, 0.05, 0.12, 0.065],
  [0.88, 0.05, -0.42, 0.05],
].map(([x, y, z, r], i) =>
  ico(r, x, y + r * 0.55, z, i % 2 === 0 ? GRAVEL : GRAVEL_LIGHT, { mat: 'stone', rot: [0.3, i, 0.2] }, 0),
)

const grass = [
  cone(0.06, 0.3, -0.72, 0.15, -0.48, '#6f8352', { mat: 'foliage', rot: [0.12, 0, 0.1] }, 6),
  cone(0.05, 0.24, 0.5, 0.12, -0.7, '#7d915c', { mat: 'foliage', rot: [-0.1, 1.2, 0.05] }, 6),
]

export default defineModel({
  id: 'rock-cluster',
  name: '景观石组',
  category: 'vegetation',
  tags: ['rock', 'stone', 'boulder', '景观石组', '景石', '置石', '庭院'],
  footprint: [2.4, 1.8],
  height: 0.95,
  placement: 'outdoor',
  parts: [
    // compacted gravel bed
    rbox(2.2, 0.06, 1.5, 0.08, 0, 0.03, 0, GRAVEL, { mat: 'stone' }),
    rbox(1.7, 0.045, 1.1, 0.06, 0.05, 0.065, -0.03, GRAVEL_LIGHT, { mat: 'stone' }),
    ...mainRocks,
    ...satellites,
    ...moss,
    ...lichen,
    ...pebbles,
    ...grass,
  ],
})
