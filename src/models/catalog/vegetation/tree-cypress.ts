import { box, cone, cyl, defineModel, ico, sphere } from '../../kit'

const BARK = '#6b5540'
const BARK_DARK = '#574532'
const NEEDLE_DEEP = '#33472f'
const NEEDLE_MID = '#3c5233'
const NEEDLE_LIGHT = '#475d3a'

// Columnar crown: tight overlapping cones with alternating rotation so the
// silhouette stays irregular rather than lathe-turned.
const TIERS: [number, number, number][] = [
  [1.6, 0.7, 1.25],
  [2.25, 0.68, 1.2],
  [2.85, 0.64, 1.15],
  [3.42, 0.6, 1.1],
  [3.96, 0.55, 1.05],
  [4.47, 0.5, 1.0],
  [4.95, 0.45, 0.95],
  [5.4, 0.4, 0.9],
  [5.83, 0.34, 0.85],
  [6.24, 0.28, 0.8],
  [6.62, 0.21, 0.7],
  [6.98, 0.15, 0.6],
]

const tiers = TIERS.map(([y, r, h], i) =>
  cone(r, h, (i % 3 - 1) * 0.012, y, (i % 2 === 0 ? 1 : -1) * 0.01, [NEEDLE_DEEP, NEEDLE_MID, NEEDLE_LIGHT][i % 3], {
    mat: 'foliage',
    rot: [0, i * 0.62, 0],
  }, 9),
)

// Soft lobes break the cone edges and add sunlit facets.
const lobes = [
  ico(0.3, 0.34, 2.7, 0.08, NEEDLE_MID, { mat: 'foliage' }, 1),
  ico(0.28, -0.3, 3.5, -0.12, NEEDLE_LIGHT, { mat: 'foliage' }, 1),
  ico(0.24, 0.26, 4.35, 0.16, NEEDLE_MID, { mat: 'foliage' }, 1),
  ico(0.2, -0.2, 5.2, -0.14, NEEDLE_LIGHT, { mat: 'foliage' }, 0),
]

// Dry lower branches and a fluted trunk showing beneath the skirt.
const deadWood = [0.4, 1.95, 3.6, 5.2].map((a, i) =>
  cyl(0.011, 0.035, 0.9, Math.cos(a) * 0.38, 0.62 + (i % 2) * 0.08, Math.sin(a) * 0.38, i % 2 === 0 ? BARK_DARK : BARK, {
    mat: 'wood',
    rot: [0, Math.PI - a, 1.18],
  }, 6),
)

const flutes = [0.4, 2.5, 4.4].map((a) =>
  cyl(0.02, 0.028, 1.5, Math.cos(a) * 0.19, 0.78, Math.sin(a) * 0.19, BARK_DARK, { mat: 'wood' }, 6),
)

const roots = [0.9, 3.6].map((a, i) =>
  cyl(0.05, 0.11, 0.5, Math.cos(a) * 0.18, 0.18, Math.sin(a) * 0.18, i % 2 === 0 ? BARK : BARK_DARK, {
    mat: 'wood',
    rot: [0, Math.PI - a, 1.05],
  }, 7),
)

// Shredded bark strips peel away from the exposed lower trunk.
const barkStrips = Array.from({ length: 7 }, (_, i) => {
  const a = i * 0.88 + 0.3
  const y = 0.45 + (i % 3) * 0.14
  const r = 0.236 - (i % 3) * 0.006
  return box(0.032, 0.3 + (i % 2) * 0.04, 0.015, Math.cos(a) * r, y, Math.sin(a) * r, i % 2 === 0 ? '#5d4834' : '#6b5540', {
    mat: 'wood',
    rot: [0, -(a + Math.PI / 2), 0.05 * Math.sin(a)],
  })
})

// Rounded grey-green cones sit against the outer needle skirt.
const CONES: [number, number, number][] = [
  [0.54, 3.0, 0.1],
  [-0.44, 3.18, 0.04],
  [0.46, 3.62, 0.1],
  [-0.5, 3.98, 0.06],
  [0.42, 4.55, 0.14],
]
const cones = CONES.map(([x, y, z], i) =>
  sphere(0.045, x, y, z, i % 2 === 0 ? '#79825c' : '#6f7954', { mat: 'foliage' }, 8),
)

// Extra skirt lobes and two dry stubs fill the lower silhouette.
const lowerLobes = [
  ico(0.34, 0.36, 2.1, -0.18, NEEDLE_DEEP, { mat: 'foliage' }, 1),
  ico(0.3, -0.38, 2.28, 0.16, NEEDLE_MID, { mat: 'foliage' }, 0),
  ico(0.22, 0.1, 1.72, 0.32, NEEDLE_DEEP, { mat: 'foliage' }, 0),
]
const lowStubs = [0.6, 2.6].map((a, i) =>
  cyl(0.022, 0.04, 0.34, Math.cos(a) * 0.2, 0.62 + i * 0.2, Math.sin(a) * 0.2, BARK_DARK, {
    mat: 'wood',
    rot: [0, -a, 1.35],
  }, 6),
)

const grass = [
  [0.4, 0.3, 0.26],
  [-0.42, 0.1, 0.22],
  [0.05, -0.45, 0.24],
].map(([x, z, h], i) =>
  cone(0.045, h, x, h / 2, z, i % 2 === 0 ? '#6f8352' : '#7d915c', { mat: 'foliage', rot: [0.1, i * 2, 0.1] }, 6),
)

// Dry needle litter caught around the root flare.
const litter = [
  [0.3, -0.35, 0.06],
  [-0.34, -0.28, 0.045],
].map(([x, z, h], i) =>
  cone(0.09, h, x, h / 2, z, '#7a6a4a', { mat: 'foliage', rot: [0.3, i * 2.1, 0.2] }, 6),
)

export default defineModel({
  id: 'tree-cypress',
  name: '柏树',
  category: 'vegetation',
  tags: ['tree', 'cypress', 'italian cypress', '柏树', '针叶树', '常绿', '柱状'],
  footprint: [1.7, 1.7],
  height: 8.2,
  placement: 'outdoor',
  parts: [
    ...roots,
    cyl(0.16, 0.26, 1.6, 0, 0.8, 0, BARK, { mat: 'wood' }, 12),
    cyl(0.1, 0.16, 1.4, 0, 2.1, 0, BARK_DARK, { mat: 'wood' }, 10),
    ...flutes,
    ...barkStrips,
    ...lowStubs,
    ...deadWood,
    ...tiers,
    ...lobes,
    ...lowerLobes,
    ...cones,
    // two stacked tips close the crown at the stated height
    cone(0.11, 0.85, 0, 7.55, 0, NEEDLE_MID, { mat: 'foliage', rot: [0, 0.4, 0] }, 8),
    cone(0.06, 0.5, 0.01, 7.95, 0, NEEDLE_LIGHT, { mat: 'foliage', rot: [0, -0.5, 0] }, 7),
    ...grass,
    ...litter,
  ],
})
