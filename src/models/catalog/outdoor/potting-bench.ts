import { C, box, cyl, defineModel, ico, rbox, torus } from '../../kit'

const WOOD = '#a97a4d'
const WOOD_DARK = '#8a6139'
const BOARD = '#c9bb9c'
const METAL = '#7d8588'

const legs: [number, number][] = [
  [-0.64, -0.24],
  [0.64, -0.24],
  [-0.64, 0.24],
  [0.64, 0.24],
]

const pegs: [number, number][] = [
  [-0.5, 0.94],
  [-0.38, 0.94],
  [-0.12, 0.94],
  [0.04, 0.94],
  [0.33, 0.94],
  [0.52, 0.94],
]

export default defineModel({
  id: 'potting-bench',
  name: '园艺工作台',
  category: 'outdoor',
  tags: ['potting bench', 'workbench', 'garden', '园艺工作台', '工作台', '花架'],
  footprint: [1.4, 0.6],
  height: 1.0,
  placement: 'outdoor',
  wallAlign: true,
  parts: [
    // slatted worktop
    box(1.38, 0.05, 0.17, 0, 0.76, -0.19, WOOD, { mat: 'wood' }),
    box(1.38, 0.05, 0.17, 0, 0.76, 0, WOOD, { mat: 'wood' }),
    box(1.38, 0.05, 0.17, 0, 0.76, 0.19, WOOD, { mat: 'wood' }),
    box(1.3, 0.06, 0.04, 0, 0.7, -0.26, WOOD_DARK, { mat: 'wood' }),
    box(1.3, 0.06, 0.04, 0, 0.7, 0.26, WOOD_DARK, { mat: 'wood' }),
    // legs and stretchers
    ...legs.map(([x, z]) => box(0.06, 0.75, 0.06, x, 0.375, z, WOOD_DARK, { mat: 'wood' })),
    box(1.26, 0.05, 0.04, 0, 0.2, -0.24, WOOD_DARK, { mat: 'wood' }),
    box(1.26, 0.05, 0.04, 0, 0.2, 0.24, WOOD_DARK, { mat: 'wood' }),
    // lower shelf for pots and soil
    box(1.24, 0.035, 0.2, 0, 0.3, -0.1, WOOD, { mat: 'wood' }),
    box(1.24, 0.035, 0.2, 0, 0.3, 0.12, WOOD, { mat: 'wood' }),
    // back pegboard in its frame
    box(1.3, 0.5, 0.03, 0, 0.75, -0.28, BOARD, { mat: 'matte' }),
    box(0.05, 1.0, 0.05, -0.66, 0.5, -0.275, WOOD_DARK, { mat: 'wood' }),
    box(0.05, 1.0, 0.05, 0.66, 0.5, -0.275, WOOD_DARK, { mat: 'wood' }),
    box(1.38, 0.04, 0.05, 0, 0.98, -0.275, WOOD, { mat: 'wood' }),
    ...pegs.map(([x, y]) =>
      cyl(0.008, 0.008, 0.06, x, y, -0.255, METAL, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6),
    ),
    // hanging tools: trowel, pruners, gloves, twine, fork, seed packets
    box(0.07, 0.13, 0.008, -0.44, 0.87, -0.245, METAL, { mat: 'metal', rot: [0, 0, 0.12] }),
    cyl(0.012, 0.012, 0.09, -0.44, 0.95, -0.245, C.walnut, { mat: 'wood' }, 8),
    box(0.05, 0.12, 0.02, 0.04, 0.86, -0.245, C.blackMetal, { mat: 'metal' }),
    box(0.02, 0.1, 0.012, 0.0, 0.9, -0.245, C.steel, { mat: 'metal', rot: [0, 0, 0.24] }),
    box(0.02, 0.1, 0.012, 0.08, 0.9, -0.245, C.steel, { mat: 'metal', rot: [0, 0, -0.24] }),
    rbox(0.055, 0.1, 0.018, 0.02, 0.35, 0.87, -0.245, C.cream, { mat: 'fabric', rot: [0, 0, 0.15] }),
    rbox(0.055, 0.1, 0.018, 0.02, 0.42, 0.87, -0.245, C.cream, { mat: 'fabric', rot: [0, 0, -0.1] }),
    torus(0.04, 0.018, -0.16, 0.9, -0.245, C.sand, { mat: 'matte' }, 12),
    cyl(0.004, 0.004, 0.09, -0.16, 0.83, -0.245, C.sand, { mat: 'matte' }, 6),
    cyl(0.01, 0.01, 0.12, 0.56, 0.9, -0.245, C.walnut, { mat: 'wood' }, 8),
    box(0.05, 0.055, 0.012, 0.56, 0.82, -0.245, METAL, { mat: 'metal' }),
    box(0.08, 0.11, 0.006, 0.2, 0.9, -0.26, C.cream, { mat: 'matte' }),
    box(0.08, 0.11, 0.006, 0.28, 0.86, -0.26, '#c9a099', { mat: 'matte' }),
    // pots of herbs on the shelf
    cyl(0.075, 0.06, 0.13, -0.45, 0.3825, -0.05, C.terracotta, { mat: 'ceramic' }, 12),
    cyl(0.082, 0.082, 0.02, -0.45, 0.44, -0.05, C.clay, { mat: 'ceramic' }, 12),
    ico(0.09, -0.45, 0.5, -0.05, C.leaf, { mat: 'foliage' }, 1),
    cyl(0.065, 0.052, 0.12, -0.2, 0.3775, 0.06, C.cream, { mat: 'ceramic' }, 12),
    cyl(0.072, 0.072, 0.018, -0.2, 0.43, 0.06, C.linen, { mat: 'ceramic' }, 12),
    ico(0.075, -0.2, 0.49, 0.06, C.leafLight, { mat: 'foliage' }, 1),
    // soil bag with a folded top and label
    box(0.32, 0.18, 0.2, 0.36, 0.41, 0.08, C.sand, { mat: 'matte' }),
    box(0.3, 0.035, 0.18, 0.36, 0.5175, 0.08, '#a99878', { mat: 'matte' }),
    box(0.16, 0.09, 0.006, 0.36, 0.4, 0.182, '#7f8a6a', { mat: 'matte' }),
    // small stack of spare pots
    cyl(0.055, 0.045, 0.08, 0.56, 0.3525, -0.12, C.terracotta, { mat: 'ceramic' }, 12),
    // folding ruler resting on the worktop
    box(0.2, 0.012, 0.03, 0.3, 0.791, 0.06, C.cream, { mat: 'wood', rot: [0, 0.2, 0] }),
    // drawer tucked under the worktop with a brass pull
    box(0.46, 0.12, 0.02, 0.2, 0.61, 0.265, WOOD, { mat: 'wood' }),
    box(0.42, 0.1, 0.36, 0.2, 0.61, 0.08, WOOD_DARK, { mat: 'wood' }),
    cyl(0.016, 0.016, 0.12, 0.2, 0.61, 0.28, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // galvanised watering can on the lower shelf
    cyl(0.07, 0.062, 0.14, 0.02, 0.39, -0.06, METAL, { mat: 'metal' }, 14),
    cyl(0.01, 0.014, 0.17, 0.095, 0.425, -0.06, METAL, { mat: 'metal', rot: [0, 0, -0.8] }, 8),
    torus(0.045, 0.008, -0.055, 0.455, -0.06, METAL, { mat: 'metal', rot: [0, 0, 0] }, 12),
    // seed tray with young seedlings on the worktop
    box(0.26, 0.035, 0.16, -0.1, 0.803, 0.18, WOOD_DARK, { mat: 'wood' }),
    box(0.23, 0.012, 0.13, -0.1, 0.825, 0.18, C.soil, { mat: 'matte' }),
    cyl(0.004, 0.005, 0.06, -0.18, 0.85, 0.18, C.leafDeep, { mat: 'foliage' }, 5),
    ico(0.02, -0.18, 0.885, 0.18, C.leaf, { mat: 'foliage' }, 0),
    cyl(0.004, 0.005, 0.07, -0.1, 0.855, 0.18, C.leafDeep, { mat: 'foliage' }, 5),
    ico(0.021, -0.1, 0.895, 0.18, C.leafLight, { mat: 'foliage' }, 0),
    cyl(0.004, 0.005, 0.055, -0.02, 0.845, 0.18, C.leafDeep, { mat: 'foliage' }, 5),
    ico(0.019, -0.02, 0.878, 0.18, C.leaf, { mat: 'foliage' }, 0),
  ],
})
