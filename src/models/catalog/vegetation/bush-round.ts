import { C, cyl, defineModel, ico, sphere } from '../../kit'

const DEEP = C.leafDeep
const MID = C.leaf
const LIGHT = C.leafLight
const PALE = '#a3b97f'

export default defineModel({
  id: 'bush-round',
  name: '圆形灌木',
  category: 'vegetation',
  tags: ['bush', 'shrub', '灌木', '圆形', '绿篱'],
  footprint: [1.2, 1.2],
  height: 0.8,
  placement: 'outdoor',
  parts: [
    // clipped base keeps the bush sitting flat on the ground
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
  ],
})
