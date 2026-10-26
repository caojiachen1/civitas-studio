import { C, cyl, defineModel, ico } from '../../kit'

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
  ],
})
