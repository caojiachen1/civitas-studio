import { C, cyl, defineModel, ico, sphere } from '../../kit'

const DEEP = C.leafDeep
const MID = C.leaf
const LIGHT = C.leafLight
const PALE = '#a3b97f'

// Two low shoots escape the clipped ball at the base.
const shoots = [0.7, 3.9].flatMap((a, i) => {
  const x = Math.cos(a) * 0.3
  const z = Math.sin(a) * 0.3
  return [
    cyl(0.008, 0.016, 0.3, x, 0.18, z, '#5a4530', {
      mat: 'wood',
      rot: [0.3 * Math.cos(a), -a, 0.3 * Math.sin(a)],
    }, 5),
    ico(0.11, x + Math.cos(a) * 0.04, 0.36, z + Math.sin(a) * 0.04, i === 0 ? LIGHT : MID, {
      mat: 'foliage',
      rot: [0.2, -a, 0.1],
    }, 0),
    ico(0.07, x + Math.cos(a) * 0.1, 0.44, z + Math.sin(a) * 0.1, PALE, { mat: 'foliage' }, 0),
  ]
})

// Sunlit leaf sprays sit proud of the crown.
const SPRAYS: [number, number, number, string][] = [
  [0.18, 0.65, 0.18, '#a9bd85'],
  [0.48, 0.45, 0.23, LIGHT],
  [-0.39, 0.61, 0.33, PALE],
  [0.1, 0.67, -0.15, '#9db37b'],
]
const sprays = SPRAYS.map(([x, y, z, color], i) =>
  ico(0.075, x, y, z, color, { mat: 'foliage', rot: [0.3, i * 0.8, 0.2] }, 0),
)

// Clippings and fallen leaves around the base.
const FALLEN: [number, number, string, number][] = [
  [0.52, 0.16, LIGHT, 0.4],
  [-0.5, 0.18, '#93aa72', 1.3],
  [0.2, -0.54, PALE, 2.2],
  [-0.24, -0.53, LIGHT, 0.9],
]
const fallen = FALLEN.map(([x, z, color, a], i) =>
  cyl(0.038, 0.025, 0.005, x, 0.004 + i * 0.0005, z, color, { mat: 'foliage', rot: [0, a, 0] }, 6),
)

export default defineModel({
  id: 'bush-round',
  name: '圆形灌木',
  category: 'vegetation',
  tags: ['bush', 'shrub', '灌木', '圆形', '绿篱'],
  footprint: [1.2, 1.2],
  height: 0.8,
  placement: 'outdoor',
  parts: [
    // soil ring and clipped base keep the bush sitting flat on the ground
    cyl(0.47, 0.52, 0.028, 0, 0.014, 0, '#4a3f30', { mat: 'matte' }, 16),
    cyl(0.42, 0.48, 0.16, 0, 0.08, 0, '#35502f', { mat: 'foliage' }, 12),
    ico(0.4, 0, 0.4, 0, MID, { mat: 'foliage' }, 1),
    ico(0.3, 0.29, 0.32, 0.1, LIGHT, { mat: 'foliage' }, 1),
    ico(0.3, -0.29, 0.33, -0.08, DEEP, { mat: 'foliage' }, 1),
    ico(0.26, 0.06, 0.36, 0.3, MID, { mat: 'foliage' }, 1),
    ico(0.27, -0.04, 0.34, -0.3, LIGHT, { mat: 'foliage' }, 1),
    ico(0.22, 0.24, 0.52, -0.22, LIGHT, { mat: 'foliage' }, 0),
    ico(0.22, -0.25, 0.5, 0.24, MID, { mat: 'foliage' }, 0),
    ico(0.2, 0.02, 0.56, 0.02, PALE, { mat: 'foliage' }, 1),
    ico(0.18, 0.02, 0.62, -0.02, LIGHT, { mat: 'foliage' }, 0),
    // shadowed inner fill so the lobes read as one dense mass
    ico(0.24, 0.18, 0.22, 0.18, DEEP, { mat: 'foliage' }, 0),
    ico(0.24, -0.2, 0.22, -0.16, DEEP, { mat: 'foliage' }, 0),

    // compact outer leaves and sunlit crown highlights
    ...Array.from({ length: 9 }, (_, i) => {
      const a = i * 0.698 + 0.3
      const r = 0.3 + (i % 2) * 0.06
      return ico(
        0.11 + (i % 3) * 0.012,
        Math.cos(a) * r,
        0.36 + (i % 4) * 0.09,
        Math.sin(a) * r,
        [LIGHT, MID, PALE][i % 3],
        { mat: 'foliage', rot: [0.2, a, 0.15] },
        0,
      )
    }),
    ...shoots,
    ...sprays,
    // exposed twigs and a few red berries
    ...[0.4, 1.7, 2.9, 4.4, 5.6].map((a) =>
      cyl(0.008, 0.014, 0.24, Math.cos(a) * 0.27, 0.34, Math.sin(a) * 0.27, '#5a4530', {
        mat: 'wood',
        rot: [0.4 * Math.sin(a), a, -0.35],
      }, 5),
    ),
    ...[
      [0.36, 0.5, 0.2],
      [-0.34, 0.46, 0.24],
      [0.12, 0.56, -0.34],
      [-0.2, 0.62, -0.26],
      [0.28, 0.42, -0.3],
    ].map(([x, y, z], i) =>
      sphere(0.018, x, y, z, i % 2 === 0 ? '#a64f42' : '#8f3f38', { mat: 'gloss' }, 8),
    ),
    ...fallen,
  ],
})
