import { box, cone, cyl, defineModel, ico } from '../../kit'

const BARK = '#6d5539'
const BARK_DARK = '#5a4530'
const BARK_LIGHT = '#81674a'
const VEIL_DEEP = '#5d7845'
const VEIL = '#748e58'
const VEIL_LIGHT = '#8ea66c'

// Wooden limb between two points, tapered from a to b.
const branch = (
  a: [number, number, number],
  b: [number, number, number],
  rBase: number,
  rTip: number,
  color: string,
) => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const dz = b[2] - a[2]
  const h = Math.hypot(dx, dz)
  const len = Math.hypot(h, dy)
  return cyl(
    rTip,
    rBase,
    len,
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2,
    color,
    { mat: 'wood', rot: [0, Math.atan2(dz, -dx), Math.atan2(h, dy)] },
    7,
  )
}

// Buttress roots fan out from the base.
const roots = [0.6, 2.7, 4.5].map((a, i) =>
  cyl(0.06, 0.2, 0.85, Math.cos(a) * 0.3, 0.3, Math.sin(a) * 0.3, i % 2 === 0 ? BARK : BARK_DARK, {
    mat: 'wood',
    rot: [0, -a, 0.9],
  }, 8),
)

// Shaggy bark ridges on the old trunk.
const barkRidges = Array.from({ length: 8 }, (_, i) => {
  const a = i * 0.785 + 0.25
  return box(0.034, 0.5 + (i % 3) * 0.08, 0.024, Math.cos(a) * 0.378, 1.05 + (i % 2) * 0.05, Math.sin(a) * 0.378, i % 2 === 0 ? '#5f4933' : '#786044', {
    mat: 'wood',
    rot: [0, -(a + Math.PI / 2), 0],
  })
})

// Extra fine curtains fill the gaps in the weeping veil.
const FINE: [number, number, number, number][] = [
  [0.65, 2.05, 5.28, 2.15],
  [1.4, 1.6, 5.2, 1.85],
  [2.15, 2.1, 5.3, 2.2],
  [2.9, 1.65, 5.15, 1.9],
  [3.75, 2.05, 5.35, 2.25],
  [4.55, 1.7, 5.18, 1.95],
  [5.35, 2.1, 5.3, 2.1],
  [6.1, 1.65, 5.2, 1.85],
]
const fineCurtains = FINE.flatMap(([a, r, top, len], i) => {
  const x = Math.cos(a) * r
  const z = Math.sin(a) * r
  return [
    cyl(0.014, 0.02, 0.5, x, top - 0.2, z, BARK_LIGHT, { mat: 'wood', rot: [0.05, 0, 0.04] }, 5),
    cyl(0.16, 0.035, len, x, top - 0.45 - len / 2, z, i % 2 === 0 ? VEIL : VEIL_LIGHT, {
      mat: 'foliage',
      rot: [0.04 * Math.sin(a), 0, 0.04 * Math.cos(a)],
    }, 7),
    ico(0.14, x, top - 0.45 - len, z, VEIL_DEEP, { mat: 'foliage' }, 0),
  ]
})

const limbs = [
  branch([0.02, 3.9, 0], [-1.55, 5.3, 0.55], 0.16, 0.06, BARK_LIGHT),
  branch([0.02, 4.0, 0], [1.6, 5.25, -0.4], 0.15, 0.055, BARK),
  branch([0.04, 3.8, 0], [0.5, 5.35, 1.6], 0.14, 0.05, BARK_LIGHT),
  branch([0.02, 3.85, 0], [-0.45, 5.3, -1.6], 0.13, 0.05, BARK_DARK),
  branch([0.02, 4.0, 0], [-0.25, 5.95, 0.15], 0.1, 0.03, BARK_LIGHT),
  branch([0.05, 3.95, 0], [0.4, 5.9, -0.2], 0.09, 0.03, BARK),
]

// A few fine twigs stay visible between the hanging curtains.
const twigs = [0.2, 1.7, 3.2, 4.8].map((a, i) =>
  branch(
    [Math.cos(a) * 0.85, 4.0, Math.sin(a) * 0.85],
    [Math.cos(a) * 1.15, 5.95 - i * 0.1, Math.sin(a) * 1.15],
    0.025,
    0.012,
    i % 2 === 0 ? BARK_LIGHT : BARK_DARK,
  ),
)

// Weeping curtains: a tapering leaf sleeve with clumps at the crown and tip.
const STRANDS: [number, number, number, number][] = [
  [0.25, 2.15, 5.35, 2.3],
  [1.05, 1.55, 5.15, 1.9],
  [1.8, 2.25, 5.3, 2.4],
  [2.55, 1.75, 5.25, 2.0],
  [3.35, 2.1, 5.4, 2.25],
  [4.15, 1.6, 5.1, 1.8],
  [4.95, 2.2, 5.2, 2.35],
  [5.75, 1.8, 5.35, 2.05],
]

const strands = STRANDS.flatMap(([a, r, top, len], i) => {
  const x = Math.cos(a) * r
  const z = Math.sin(a) * r
  const tone = [VEIL, VEIL_DEEP, VEIL_LIGHT][i % 3]
  return [
    cyl(0.23, 0.05, len, x, top - len / 2, z, tone, { mat: 'foliage', rot: [0.03 * Math.sin(a), 0, 0.03 * Math.cos(a)] }, 8),
    ico(0.3, x * 0.98, top - 0.22, z * 0.98, i % 2 === 0 ? VEIL : VEIL_LIGHT, { mat: 'foliage' }, 1),
    ico(0.17, x * 1.04, top - len + 0.16, z * 1.04, VEIL_DEEP, { mat: 'foliage' }, 0),
  ]
})

const grass = [
  [0.35, 0.5, 0.32],
  [-0.5, 0.15, 0.27],
  [0.05, -0.55, 0.3],
].map(([x, z, h], i) =>
  cone(0.05, h, x, h / 2, z, i % 2 === 0 ? '#6f8a52' : '#7f9a5e', { mat: 'foliage', rot: [0.12, i, 0.08] }, 6),
)

// Low root spurs and fallen willow leaves around the trunk.
const rootSpurs = [1.2, 3.3, 5.0].map((a, i) =>
  cyl(0.04, 0.1, 0.4, Math.cos(a) * 0.28, 0.14, Math.sin(a) * 0.28, i % 2 === 0 ? BARK : BARK_DARK, {
    mat: 'wood',
    rot: [0, -a, 1.02],
  }, 7),
)
const LITTER: [number, number, string, number][] = [
  [0.62, 0.42, '#8f8150', 0.4],
  [-0.56, 0.5, '#7d7046', 1.2],
  [0.36, -0.66, '#9a8a56', 2.1],
  [-0.72, -0.3, '#877a4b', 0.9],
  [0.9, 0.05, '#a08f58', 1.7],
  [-0.18, 0.82, '#8a7c4d', 2.6],
]
const litter = LITTER.map(([x, z, color, a], i) =>
  cyl(0.07, 0.05, 0.006, x, 0.003 + i * 0.0004, z, color, { mat: 'foliage', rot: [0, a, 0] }, 5),
)

export default defineModel({
  id: 'tree-willow',
  name: '垂柳',
  category: 'vegetation',
  tags: ['tree', 'willow', 'weeping willow', '垂柳', '柳树', '乔木', '落叶树'],
  footprint: [5.6, 5.6],
  height: 7.2,
  placement: 'outdoor',
  parts: [
    ...roots,
    ...rootSpurs,
    cyl(0.3, 0.44, 2.6, 0, 1.3, 0, BARK, { mat: 'wood' }, 12),
    ...barkRidges,
    cyl(0.22, 0.3, 1.6, 0.05, 3.3, 0, BARK_LIGHT, { mat: 'wood', rot: [0.02, 0, 0.06] }, 10),
    ...limbs,
    ...twigs,
    ...fineCurtains,
    // crown mass bridging the curtain tops
    ico(0.5, 0.1, 6.7, 0, VEIL, { mat: 'foliage' }, 1),
    ico(0.45, -0.55, 6.15, 0.3, VEIL_LIGHT, { mat: 'foliage' }, 1),
    ico(0.44, 0.6, 6.1, -0.35, VEIL_DEEP, { mat: 'foliage' }, 1),
    ...strands,
    ...grass,
    ...litter,
  ],
})
