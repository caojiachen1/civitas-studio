import { C, cone, cyl, defineModel, ico } from '../../kit'

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
