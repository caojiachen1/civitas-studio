import { C, cone, cyl, defineModel, ico } from '../../kit'

const CULM = '#a8b06a'
const CULM_DARK = '#8f9d63'
const NODE = '#6f7a45'
const LEAF_COLORS = [C.leaf, C.leafDeep, C.leafLight, '#7d9a5a']

const culms: [number, number, number][] = [
  [-0.66, -0.18, 4.1],
  [-0.42, 0.34, 4.45],
  [-0.2, -0.48, 3.75],
  [0.02, 0.08, 4.5],
  [0.24, -0.3, 4.3],
  [0.3, 0.5, 3.95],
  [0.55, 0.12, 4.5],
  [0.62, -0.42, 4.15],
  [-0.05, 0.62, 3.9],
  [-0.5, -0.5, 4.25],
]

const grass: [number, number, number][] = [
  [-0.38, 0.32, 0.42],
  [0.42, 0.38, 0.36],
  [0.5, -0.3, 0.4],
  [-0.55, -0.26, 0.34],
]

export default defineModel({
  id: 'bamboo-cluster',
  name: '竹丛',
  category: 'vegetation',
  tags: ['bamboo', 'bamboo cluster', '竹丛', '竹子', '常绿'],
  footprint: [2.2, 2.2],
  height: 5.0,
  placement: 'outdoor',
  parts: [
    // low soil mound
    cyl(0.52, 0.6, 0.06, 0, 0.03, 0, C.soil, { mat: 'matte' }, 16),
    // culms, each with a pair of raised node rings
    ...culms.flatMap(([x, z, h], i) => [
      cyl(0.03, 0.04, h, x, h / 2 + 0.05, z, i % 3 === 0 ? CULM_DARK : CULM, { mat: 'wood' }, 8),
      cyl(0.047, 0.047, 0.022, x, h * 0.42, z, NODE, { mat: 'wood' }, 8),
      cyl(0.045, 0.045, 0.022, x, h * 0.7, z, NODE, { mat: 'wood' }, 8),
    ]),
    // side branches hanging out of the upper canopy
    cyl(0.012, 0.018, 0.52, -0.4, 3.4, 0.22, CULM_DARK, { mat: 'wood', rot: [0.4, 0, 0.7] }, 6),
    cyl(0.012, 0.018, 0.46, 0.38, 3.6, 0.3, CULM_DARK, { mat: 'wood', rot: [0.5, 0, -0.6] }, 6),
    cyl(0.012, 0.018, 0.44, 0.12, 3.2, -0.42, CULM_DARK, { mat: 'wood', rot: [-0.55, 0, 0.3] }, 6),
    // layered leaf clusters at the tops
    ...culms.map(([x, z, h], i) =>
      ico(
        0.37 - (i % 3) * 0.025,
        x + Math.cos(i * 2.1) * 0.06,
        h + 0.12,
        z + Math.sin(i * 2.1) * 0.06,
        LEAF_COLORS[i % 4],
        { mat: 'foliage', rot: [0.2, i * 1.3, 0.15] },
        1,
      ),
    ),
    // taller crown tuft reaching the stated height
    ico(0.32, 0.02, 4.68, 0.08, C.leafLight, { mat: 'foliage' }, 1),
    // basal grasses
    ...grass.map(([x, z, h], i) =>
      cone(0.035, h, x, h / 2 + 0.04, z, i % 2 === 0 ? '#6f8a4f' : '#7d9a5a', {
        mat: 'foliage',
        rot: [0.18, 0, i % 2 === 0 ? 0.16 : -0.14],
      }, 6),
    ),
  ],
})
