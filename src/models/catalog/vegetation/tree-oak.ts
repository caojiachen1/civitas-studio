import { C, box, cyl, defineModel, ico, torus } from '../../kit'

const BARK = '#6b4b33'
const BARK_DARK = '#5c402c'
const BARK_LIGHT = '#7d5a3e'
const DEEP = C.leafDeep
const MID = C.leaf
const LEAF = '#658549'
const LIGHT = '#86a45d'

// Five buttress roots fanning out from the base, all deterministic.
const roots = Array.from({ length: 5 }, (_, i) => {
  const a = (i * Math.PI * 2) / 5 + 0.32
  return cyl(
    0.06,
    0.19,
    0.74,
    Math.cos(a) * 0.27,
    0.26,
    Math.sin(a) * 0.27,
    i % 2 === 0 ? BARK : BARK_DARK,
    { mat: 'wood', rot: [0, -a, 0.85] },
    8,
  )
})

// Deep vertical bark furrows wrapped around the lower trunk.
const FURROW_R = 0.373
const furrows = Array.from({ length: 9 }, (_, i) => {
  const a = i * 0.698 + 0.18
  return box(
    0.028 + (i % 3) * 0.006,
    1.22 + (i % 2) * 0.26,
    0.022,
    Math.cos(a) * (FURROW_R - 0.005),
    1.18 + (i % 2) * 0.08,
    Math.sin(a) * (FURROW_R - 0.005),
    i % 2 === 0 ? BARK_DARK : '#5a3f2b',
    { mat: 'wood', rot: [0, -(a + Math.PI / 2), 0] },
  )
})

// A swollen knot faces out across the path, ringed by a raised bark collar.
const KNOT_A = 2.35
const knot = [
  torus(0.115, 0.022, Math.cos(KNOT_A) * 0.372, 1.72, Math.sin(KNOT_A) * 0.372, BARK_LIGHT, {
    mat: 'wood',
    rot: [0, Math.PI / 2 - KNOT_A, 0],
  }, 14),
  ico(0.075, Math.cos(KNOT_A) * 0.392, 1.72, Math.sin(KNOT_A) * 0.392, '#5d402b', { mat: 'wood' }, 0),
]

// Acorns hanging at the shaded underside of the crown, each in a rough cap.
const ACORNS: [number, number, number][] = [
  [0.86, 2.86, 0.78],
  [-0.88, 2.81, -0.62],
  [-0.56, 2.83, 0.48],
  [0.48, 2.72, -0.58],
]
const acorns = ACORNS.flatMap(([x, y, z], i) => [
  cyl(0.052, 0.046, 0.016, x, y + 0.038, z, '#9a8148', { mat: 'wood' }, 8),
  ico(0.036, x, y, z, i % 2 === 0 ? '#b3985e' : '#a68b52', { mat: 'wood' }, 1),
])

// Fallen leaves gather on the soil between the buttress roots.
const FALLEN: [number, number, number, string][] = [
  [0.58, 0.62, 0.014, '#9b6a3f'],
  [-0.52, 0.48, 0.012, '#8c5b34'],
  [0.22, -0.66, 0.012, '#a7783f'],
  [-0.72, -0.34, 0.012, '#7d5233'],
  [0.86, -0.18, 0.012, '#93663a'],
]
const fallen = FALLEN.map(([x, z, y, color], i) =>
  cyl(0.075, 0.055, 0.008, x, y - 0.006, z, color, { mat: 'foliage', rot: [0, i * 1.1, 0] }, 7),
)

export default defineModel({
  id: 'tree-oak',
  name: '橡树',
  category: 'vegetation',
  tags: ['tree', 'oak', '橡树', '乔木', '落叶树'],
  footprint: [4.2, 4.2],
  height: 6.2,
  placement: 'outdoor',
  parts: [
    ...roots,
    // trunk and upper leader
    cyl(0.32, 0.42, 2.9, 0, 1.45, 0, BARK, { mat: 'wood' }, 12),
    ...furrows,
    ...knot,
    cyl(0.17, 0.3, 0.95, -0.03, 3.3, 0, BARK_LIGHT, { mat: 'wood', rot: [0.04, 0, 0.07] }, 10),
    // main boughs
    cyl(0.07, 0.16, 1.7, -0.36, 2.8, 0.18, BARK_LIGHT, { mat: 'wood', rot: [0.1, 0, 0.4] }, 8),
    cyl(0.06, 0.15, 1.62, 0.4, 2.85, -0.12, BARK, { mat: 'wood', rot: [-0.28, 0, -0.42] }, 8),
    cyl(0.06, 0.14, 1.35, 0.24, 3.0, 0.34, BARK_LIGHT, { mat: 'wood', rot: [0.55, 0, -0.25] }, 8),
    cyl(0.05, 0.12, 1.18, -0.16, 3.1, -0.28, BARK_DARK, { mat: 'wood', rot: [-0.5, 0, 0.22] }, 8),
    // fine twigs poking through the canopy
    cyl(0.02, 0.05, 0.62, -0.7, 3.62, 0.3, BARK_LIGHT, { mat: 'wood', rot: [0.12, 0, 0.55] }, 6),
    cyl(0.02, 0.045, 0.55, 0.7, 3.6, -0.35, BARK_LIGHT, { mat: 'wood', rot: [-0.4, 0, -0.5] }, 6),
    // broad clustered crown: deep understory lobes first
    ico(1.3, 0, 4.55, 0, MID, { mat: 'foliage' }, 1),
    ico(0.92, -1.0, 4.05, 0.2, DEEP, { mat: 'foliage' }, 1),
    ico(0.9, 1.02, 4.12, -0.12, DEEP, { mat: 'foliage' }, 1),
    ico(0.86, 0.2, 4.0, 1.0, MID, { mat: 'foliage' }, 1),
    ico(0.88, -0.34, 3.98, -0.98, MID, { mat: 'foliage' }, 1),
    ico(0.7, -0.82, 3.55, -0.56, DEEP, { mat: 'foliage' }, 1),
    ico(0.72, 0.8, 3.62, 0.7, LEAF, { mat: 'foliage' }, 1),
    ico(0.58, 0.42, 3.34, -0.52, DEEP, { mat: 'foliage' }, 1),
    ico(0.56, -0.5, 3.42, 0.42, LEAF, { mat: 'foliage' }, 0),
    // upper clusters
    ico(0.74, -0.82, 4.72, 0.7, LEAF, { mat: 'foliage' }, 1),
    ico(0.72, 0.35, 5.35, 0.18, LEAF, { mat: 'foliage' }, 1),
    ico(0.6, -0.44, 5.02, -0.3, MID, { mat: 'foliage' }, 1),
    ico(0.58, 0.92, 4.68, 0.36, LIGHT, { mat: 'foliage' }, 0),
    ico(0.62, 0.1, 4.88, -0.8, LIGHT, { mat: 'foliage' }, 1),
    ico(0.5, -0.18, 5.62, 0.35, LIGHT, { mat: 'foliage' }, 0),
    // sun-struck leaf sprays breaking the canopy edge
    ico(0.3, 1.72, 4.4, 0.02, LIGHT, { mat: 'foliage' }, 0),
    ico(0.28, -1.61, 4.25, 0.4, '#7d9c55', { mat: 'foliage' }, 0),
    ico(0.26, 0.66, 5.72, -0.19, '#93ad68', { mat: 'foliage' }, 0),
    ...acorns,
    ...fallen,
  ],
})
