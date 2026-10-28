import { C, box, cyl, defineModel, ico } from '../../kit'

const BARK = '#7a5a42'
const BARK_LIGHT = '#8c6a4d'
const AMBER = '#c98b3e'
const RUST = '#b25f32'
const GOLD = C.brass
const CRIMSON = '#a8452f'
const RED = '#943b2c'
const ORANGE = '#c4713a'

// Surface roots lift the trunk out of the lawn.
const roots = [0.35, 1.95, 3.5, 5.1].map((a, i) =>
  cyl(0.05, 0.15, 0.62, Math.cos(a) * 0.24, 0.19, Math.sin(a) * 0.24, i % 2 === 0 ? BARK : BARK_LIGHT, {
    mat: 'wood',
    rot: [0, -a, 0.98],
  }, 8),
)

// Rough bark strips spiral up the clear lower trunk.
const barkPlates = Array.from({ length: 7 }, (_, i) => {
  const a = i * 0.85 + 0.2
  const r = 0.208 - (i % 2) * 0.006
  return box(0.028, 0.5 + (i % 2) * 0.12, 0.016, Math.cos(a) * r, 0.86 + (i % 3) * 0.14, Math.sin(a) * r, i % 2 === 0 ? '#694b34' : '#5f432e', {
    mat: 'wood',
    rot: [0, -(a + Math.PI / 2), 0.02],
  })
})

// Slender twigs reach past the crown edge, holding next year's buds.
const twigs = [
  cyl(0.012, 0.026, 0.92, 1.28, 5.05, 0.42, BARK, { mat: 'wood', rot: [0.25, 0, -0.48] }, 6),
  cyl(0.011, 0.024, 0.86, -1.24, 4.98, -0.32, BARK_LIGHT, { mat: 'wood', rot: [-0.18, 0, 0.52] }, 6),
  cyl(0.01, 0.022, 0.74, 0.42, 5.72, -0.86, BARK, { mat: 'wood', rot: [-0.4, 0, -0.12] }, 6),
  cyl(0.009, 0.02, 0.68, -0.58, 5.62, 0.72, BARK_LIGHT, { mat: 'wood', rot: [0.42, 0, 0.1] }, 6),
]

// Fallen autumn leaves drift onto the grass around the root collar.
const LEAF_FALL: [number, number, string, number][] = [
  [0.85, 0.42, RED, 0.4],
  [-0.74, 0.58, AMBER, 1.2],
  [0.34, -0.9, CRIMSON, 2.1],
  [-0.95, -0.42, ORANGE, 0.8],
  [1.18, -0.28, AMBER, 2.7],
  [-0.2, 1.02, GOLD, 1.7],
  [0.62, 1.18, RED, 0.2],
]
const fallenLeaves = LEAF_FALL.map(([x, z, color, a], i) =>
  cyl(0.085, 0.06, 0.008, x, 0.008, z, color, { mat: 'foliage', rot: [0, a + i * 0.3, 0] }, 5),
)

export default defineModel({
  id: 'tree-maple',
  name: '枫树',
  category: 'vegetation',
  tags: ['tree', 'maple', '枫树', '秋色', '乔木'],
  footprint: [4.0, 4.0],
  height: 6.5,
  placement: 'outdoor',
  parts: [
    ...roots,
    // low root collar and slender, slightly leaning trunk
    cyl(0.22, 0.38, 0.34, 0, 0.17, 0, BARK, { mat: 'wood' }, 12),
    ...barkPlates,
    cyl(0.17, 0.24, 1.75, 0, 1.15, 0, BARK, { mat: 'wood' }, 12),
    cyl(0.12, 0.18, 1.6, -0.05, 2.78, 0.02, BARK_LIGHT, { mat: 'wood', rot: [0.02, 0, 0.12] }, 10),
    // upright, elegant branching
    cyl(0.05, 0.11, 1.4, -0.35, 3.1, 0.16, BARK, { mat: 'wood', rot: [0.15, 0, 0.42] }, 8),
    cyl(0.05, 0.11, 1.35, 0.28, 3.15, -0.1, BARK_LIGHT, { mat: 'wood', rot: [-0.2, 0, -0.38] }, 8),
    cyl(0.04, 0.09, 1.1, 0.1, 3.4, 0.3, BARK, { mat: 'wood', rot: [0.5, 0, -0.15] }, 8),
    cyl(0.03, 0.07, 0.95, -0.16, 3.45, -0.26, BARK_LIGHT, { mat: 'wood', rot: [-0.5, 0, 0.2] }, 8),
    cyl(0.02, 0.05, 0.6, -0.68, 3.7, 0.28, BARK, { mat: 'wood', rot: [0.15, 0, 0.5] }, 6),
    // layered autumn crown, darker lobes low, amber lobes high
    ico(1.02, 0.05, 4.7, 0.05, AMBER, { mat: 'foliage' }, 1),
    ico(0.8, -0.95, 4.3, 0.25, CRIMSON, { mat: 'foliage' }, 1),
    ico(0.82, 0.95, 4.35, -0.12, RUST, { mat: 'foliage' }, 1),
    ico(0.7, 0.3, 4.3, 0.92, GOLD, { mat: 'foliage' }, 1),
    ico(0.75, -0.32, 4.28, -0.95, RED, { mat: 'foliage' }, 1),
    ico(0.65, 1.1, 3.95, 0.35, CRIMSON, { mat: 'foliage' }, 0),
    ico(0.62, -1.12, 3.92, -0.2, RED, { mat: 'foliage' }, 0),
    ico(0.58, 0.85, 4.78, 0.55, ORANGE, { mat: 'foliage' }, 1),
    ico(0.6, -0.75, 4.8, -0.6, RUST, { mat: 'foliage' }, 1),
    ico(0.5, 0.05, 4.0, -0.9, CRIMSON, { mat: 'foliage' }, 0),
    ico(0.9, 0.08, 5.55, 0.0, AMBER, { mat: 'foliage' }, 1),
    ico(0.54, -0.52, 5.22, 0.55, GOLD, { mat: 'foliage' }, 1),
    ico(0.5, 0.6, 5.2, 0.3, ORANGE, { mat: 'foliage' }, 0),
    ico(0.55, -0.15, 5.3, -0.55, CRIMSON, { mat: 'foliage' }, 1),
    ico(0.46, 0.42, 5.62, -0.28, RUST, { mat: 'foliage' }, 0),
    ico(0.36, -0.02, 5.86, 0.14, GOLD, { mat: 'foliage' }, 0),
    ...twigs,
    ...fallenLeaves,
  ],
})
