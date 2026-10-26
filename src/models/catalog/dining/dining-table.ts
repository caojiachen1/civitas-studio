import { C, box, cyl, defineModel, ico, prism, rbox, torus } from '../../kit'

const LEG_X = [-0.62, 0.62]
const GRAIN_Z = [-0.33, -0.19, 0.12, 0.26, 0.36]
const APRON_CORNERS: [number, number][] = [
  [-0.75, 0.418],
  [0.75, 0.418],
  [-0.75, -0.418],
  [0.75, -0.418],
]
const SIDE_PLATES: [number, number][] = [
  [-0.826, -0.28],
  [-0.826, 0.28],
  [0.826, -0.28],
  [0.826, 0.28],
]

export default defineModel({
  id: 'dining-table',
  name: '六人餐桌',
  category: 'dining',
  tags: ['dining', 'table', 'six seat', '餐桌', '长桌', '橡木'],
  footprint: [1.8, 0.95],
  height: 1.24,
  placement: 'indoor',
  parts: [
    // thick rounded oak top
    rbox(1.8, 0.075, 0.95, 0.024, 0, 0.7225, 0, C.birch, { mat: 'wood' }),
    ...GRAIN_Z.map((z) => box(1.74, 0.0015, 0.006, 0, 0.7602, z, C.walnut, { mat: 'wood' })),
    // walnut edge banding under the top and a fine brass inlay on the rim
    rbox(1.74, 0.016, 0.014, 0.005, 0, 0.68, 0.468, C.walnut, { mat: 'wood' }),
    rbox(1.74, 0.016, 0.014, 0.005, 0, 0.68, -0.468, C.walnut, { mat: 'wood' }),
    rbox(0.014, 0.016, 0.86, 0.005, -0.468, 0.68, 0, C.walnut, { mat: 'wood' }),
    rbox(0.014, 0.016, 0.86, 0.005, 0.468, 0.68, 0, C.walnut, { mat: 'wood' }),
    box(1.73, 0.002, 0.004, 0, 0.7605, 0.4715, C.brass, { mat: 'metal' }),
    box(1.73, 0.002, 0.004, 0, 0.7605, -0.4715, C.brass, { mat: 'metal' }),

    // aprons with beading and brass corner bolts
    box(1.62, 0.07, 0.03, 0, 0.645, 0.4, C.walnut, { mat: 'wood' }),
    box(1.62, 0.07, 0.03, 0, 0.645, -0.4, C.walnut, { mat: 'wood' }),
    box(0.03, 0.07, 0.76, -0.81, 0.645, 0, C.walnut, { mat: 'wood' }),
    box(0.03, 0.07, 0.76, 0.81, 0.645, 0, C.walnut, { mat: 'wood' }),
    box(1.62, 0.006, 0.004, 0, 0.613, 0.416, C.brass, { mat: 'metal' }),
    box(1.62, 0.006, 0.004, 0, 0.613, -0.416, C.brass, { mat: 'metal' }),
    ...APRON_CORNERS.map(([x, z]) =>
      cyl(0.011, 0.011, 0.008, x, 0.648, z, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    ),

    // sculptural tapered trestle legs
    ...LEG_X.flatMap((x) => [
      prism(
        [
          [-0.16, 0],
          [0.16, 0],
          [0.1, 0.62],
          [-0.1, 0.62],
        ],
        0.72,
        x,
        0,
        0,
        C.oak,
        { mat: 'wood' },
      ),
      box(0.34, 0.028, 0.74, x, 0.014, 0, C.walnut, { mat: 'wood' }),
      box(0.24, 0.032, 0.74, x, 0.638, 0, C.walnut, { mat: 'wood' }),
      box(0.036, 0.15, 0.05, x - 0.13, 0.56, 0.36, C.walnut, { mat: 'wood', rot: [0.32, 0, 0] }),
      box(0.036, 0.15, 0.05, x + 0.13, 0.56, -0.36, C.walnut, { mat: 'wood', rot: [-0.32, 0, 0] }),
      // brass glide caps on the foot plate
      cyl(0.022, 0.022, 0.01, x - 0.13, 0.033, 0.34, C.brass, { mat: 'metal' }, 14),
      cyl(0.022, 0.022, 0.01, x + 0.13, 0.033, -0.34, C.brass, { mat: 'metal' }, 14),
    ]),
    // brass joint plates on the outer apron faces
    ...SIDE_PLATES.map(([x, z]) => rbox(0.008, 0.05, 0.05, 0.003, x, 0.645, z, C.brass, { mat: 'metal' })),

    // stretcher with brass inlay
    box(1.02, 0.075, 0.11, 0, 0.26, 0, C.walnut, { mat: 'wood' }),
    box(0.98, 0.005, 0.004, 0, 0.3, 0.057, C.brass, { mat: 'metal' }),
    box(0.14, 0.03, 0.13, -0.62, 0.26, 0, C.walnut, { mat: 'wood' }),
    box(0.14, 0.03, 0.13, 0.62, 0.26, 0, C.walnut, { mat: 'wood' }),

    // linen runner with woven stripes
    rbox(0.44, 0.004, 0.9, 0.01, 0, 0.7625, 0, C.linen, { mat: 'fabric' }),
    box(0.44, 0.002, 0.012, 0, 0.765, 0.22, C.sand),
    box(0.44, 0.002, 0.012, 0, 0.765, -0.22, C.sand),

    // centerpiece: ceramic vase with branches and a stone bowl
    cyl(0.055, 0.085, 0.19, -0.02, 0.855, -0.06, C.white, { mat: 'ceramic' }, 24),
    cyl(0.045, 0.055, 0.03, -0.02, 0.965, -0.06, C.cream, { mat: 'ceramic' }, 20),
    cyl(0.006, 0.006, 0.22, -0.05, 1.06, -0.07, C.leafDeep, { mat: 'matte', rot: [0.12, 0, 0.18] }, 6),
    ico(0.075, -0.08, 1.15, -0.08, C.leaf, { mat: 'foliage' }, 1),
    ico(0.06, 0.01, 1.12, -0.05, C.leafLight, { mat: 'foliage' }, 1),
    ico(0.05, -0.03, 1.18, -0.09, C.leafDeep, { mat: 'foliage' }, 0),
    cyl(0.16, 0.1, 0.06, 0.34, 0.79, 0.04, C.stone, { mat: 'stone' }, 24),
    torus(0.155, 0.008, 0.34, 0.818, 0.04, C.concrete, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),

    // two low stone bowls at the ends
    cyl(0.09, 0.06, 0.05, -0.68, 0.785, -0.02, C.stone, { mat: 'stone' }, 24),
    torus(0.088, 0.005, -0.68, 0.81, -0.02, C.concrete, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.09, 0.06, 0.05, 0.68, 0.785, -0.02, C.stone, { mat: 'stone' }, 24),
    torus(0.088, 0.005, 0.68, 0.81, -0.02, C.concrete, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
  ],
})
