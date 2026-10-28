import { C, cone, cyl, defineModel, ico, sphere } from '../../kit'

const SOIL = C.soil
const FOLIAGE = ['#8b9a83', '#7d8f77', '#98a68d', '#83947c']
const SPIKES = ['#8c7fb0', '#9a8dc0', '#7e71a3']

const stems: [number, number, number][] = [
  [0.2, 0.12, 0.32],
  [0.72, 0.22, 0.4],
  [1.25, 0.14, 0.36],
  [1.78, 0.26, 0.46],
  [2.3, 0.11, 0.3],
  [2.85, 0.24, 0.42],
  [3.4, 0.13, 0.475],
  [3.95, 0.27, 0.38],
  [4.5, 0.12, 0.34],
  [5.05, 0.21, 0.44],
  [5.55, 0.16, 0.37],
  [6.0, 0.25, 0.41],
]

const grass: [number, number][] = [
  [-0.36, 0.18],
  [0.37, -0.1],
  [-0.2, -0.34],
  [0.16, 0.36],
]

// A second flush of flower stems fills the middle of the clump.
const EXTRA: [number, number, number, string][] = [
  [0.68, 0.2, 0.4, '#8c7fb0'],
  [1.75, 0.3, 0.46, '#9a8dc0'],
  [2.6, 0.18, 0.36, '#7e71a3'],
  [3.75, 0.29, 0.44, '#9a8dc0'],
  [4.9, 0.2, 0.39, '#8c7fb0'],
  [5.6, 0.26, 0.43, '#8376ab'],
]
const extraSpikes = EXTRA.flatMap(([a, r, h, color], i) => {
  const x = Math.cos(a) * r
  const z = Math.sin(a) * r
  return [
    cyl(0.0045, 0.0065, h, x, 0.115 + h / 2, z, '#78866a', { mat: 'foliage' }, 5),
    cyl(0.014, 0.005, 0.105, x, 0.115 + h + 0.052, z, color, {
      mat: 'foliage',
      rot: [0.03 * Math.cos(a), i * 0.4, 0.03 * Math.sin(a)],
    }, 7),
  ]
})

// Silver-grey leaf sprays soften the edge of the mound.
const SPRAYS: [number, number, number, string][] = [
  [0.31, 0.21, 0.14, '#93a089'],
  [-0.35, 0.19, 0.1, '#87957f'],
  [0.05, 0.2, -0.37, '#9caa92'],
]
const sprays = SPRAYS.map(([x, y, z, color], i) =>
  ico(0.075, x, y, z, color, { mat: 'foliage', rot: [0.25, i * 1.2, 0.15] }, 0),
)

// Old woody stems show at the base of the mound.
const oldStems = [0.35, 1.9, 3.4, 4.9].map((a, i) =>
  cyl(0.006, 0.013, 0.17, Math.cos(a) * 0.26, 0.1, Math.sin(a) * 0.26, i % 2 === 0 ? '#6a563e' : '#765f45', {
    mat: 'wood',
    rot: [0.3 * Math.cos(a), -a, 0.3 * Math.sin(a)],
  }, 5),
)

// Fallen purple florets dot the soil.
const FLORETS: [number, number, string][] = [
  [0.24, 0.19, '#8c7fb0'],
  [-0.2, 0.23, '#9a8dc0'],
  [0.29, -0.1, '#7e71a3'],
  [-0.27, -0.08, '#8c7fb0'],
  [0.04, 0.27, '#9a8dc0'],
]
const florets = FLORETS.map(([x, z, color], i) =>
  sphere(0.009, x, 0.078 + (i % 2) * 0.002, z, color, { mat: 'matte' }, 6),
)

export default defineModel({
  id: 'lavender-bush',
  name: '薰衣草丛',
  category: 'vegetation',
  tags: ['lavender', 'herb', 'flower', '薰衣草丛', '薰衣草', '香草'],
  footprint: [1.0, 1.0],
  height: 0.7,
  placement: 'outdoor',
  parts: [
    // soil bed and mounded mulch
    cyl(0.4, 0.44, 0.04, 0, 0.02, 0, SOIL, { mat: 'matte' }, 16),
    cyl(0.3, 0.36, 0.05, 0, 0.055, 0, '#6d5a43', { mat: 'matte' }, 14),
    // grey-green foliage mound
    ico(0.15, 0.16, 0.16, 0.12, FOLIAGE[0], { mat: 'foliage' }, 1),
    ico(0.14, -0.18, 0.17, 0.08, FOLIAGE[1], { mat: 'foliage' }, 1),
    ico(0.16, 0.05, 0.15, -0.2, FOLIAGE[2], { mat: 'foliage' }, 1),
    ico(0.13, -0.05, 0.16, 0.22, FOLIAGE[1], { mat: 'foliage' }, 1),
    ico(0.12, 0.25, 0.15, -0.1, FOLIAGE[3], { mat: 'foliage' }, 1),
    ico(0.12, -0.26, 0.14, -0.14, FOLIAGE[0], { mat: 'foliage' }, 1),
    ico(0.14, 0, 0.22, 0, FOLIAGE[2], { mat: 'foliage' }, 1),
    ...sprays,
    ...oldStems,
    ...extraSpikes,
    ...florets,
    // slender flower stems with tapered purple spikes
    ...stems.flatMap(([a, r, h], i) => {
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      return [
        cyl(0.0045, 0.0065, h, x, 0.115 + h / 2, z, '#7d8b6e', { mat: 'foliage' }, 5),
        cyl(0.014, 0.005, 0.11, x, 0.115 + h + 0.055, z, SPIKES[i % 3], { mat: 'foliage' }, 7),
      ]
    }),
    // tufts of grass at the edge of the bed
    ...grass.map(([x, z], i) =>
      cone(0.025, 0.16, x, 0.12, z, i % 2 === 0 ? '#7c8f74' : '#8b9a83', {
        mat: 'foliage',
        rot: [0.25, 0, i % 2 === 0 ? 0.2 : -0.18],
      }, 6),
    ),
  ],
})
