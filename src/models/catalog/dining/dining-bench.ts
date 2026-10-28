import { C, box, cyl, defineModel, rbox } from '../../kit'

const LEGS: [number, number][] = [
  [-0.62, -0.14],
  [-0.62, 0.14],
  [0.62, -0.14],
  [0.62, 0.14],
]
const CUSHION_X = [-0.35, 0.35]

export default defineModel({
  id: 'dining-bench',
  name: '餐桌长凳',
  category: 'dining',
  tags: ['dining bench', 'long bench', 'seat', '餐桌长凳', '长凳', '餐椅', '橡木'],
  footprint: [1.5, 0.42],
  height: 0.47,
  placement: 'indoor',
  parts: [
    // oak seat with walnut edge banding
    rbox(1.44, 0.05, 0.4, 0.014, 0, 0.385, 0, C.oak, { mat: 'wood' }),
    rbox(1.44, 0.014, 0.02, 0.005, 0, 0.377, 0.195, C.walnut, { mat: 'wood' }),
    rbox(1.44, 0.014, 0.02, 0.005, 0, 0.377, -0.195, C.walnut, { mat: 'wood' }),
    rbox(0.016, 0.014, 0.4, 0.005, -0.722, 0.377, 0, C.walnut, { mat: 'wood' }),
    rbox(0.016, 0.014, 0.4, 0.005, 0.722, 0.377, 0, C.walnut, { mat: 'wood' }),
    box(1.4, 0.002, 0.004, 0, 0.411, 0.12, C.walnut),
    box(1.4, 0.002, 0.004, 0, 0.411, -0.12, C.walnut),

    // aprons and corner blocks
    box(1.3, 0.06, 0.026, 0, 0.325, 0.175, C.walnut, { mat: 'wood' }),
    box(1.3, 0.06, 0.026, 0, 0.325, -0.175, C.walnut, { mat: 'wood' }),
    box(0.026, 0.06, 0.34, -0.65, 0.325, 0, C.walnut, { mat: 'wood' }),
    box(0.026, 0.06, 0.34, 0.65, 0.325, 0, C.walnut, { mat: 'wood' }),
    box(0.08, 0.05, 0.08, -0.62, 0.33, 0.15, C.walnut, { mat: 'wood' }),
    box(0.08, 0.05, 0.08, -0.62, 0.33, -0.15, C.walnut, { mat: 'wood' }),
    box(0.08, 0.05, 0.08, 0.62, 0.33, 0.15, C.walnut, { mat: 'wood' }),
    box(0.08, 0.05, 0.08, 0.62, 0.33, -0.15, C.walnut, { mat: 'wood' }),

    // four tapered legs with brass ferrules
    ...LEGS.flatMap(([x, z]) => [
      cyl(0.02, 0.032, 0.33, x, 0.185, z, C.oak, { mat: 'wood' }, 14),
      cyl(0.033, 0.034, 0.026, x, 0.013, z, C.brass, { mat: 'metal' }, 14),
    ]),

    // stretcher with brass inlay and cross bars
    box(1.16, 0.035, 0.05, 0, 0.14, 0, C.walnut, { mat: 'wood' }),
    box(0.05, 0.03, 0.26, -0.62, 0.14, 0, C.walnut, { mat: 'wood' }),
    box(0.05, 0.03, 0.26, 0.62, 0.14, 0, C.walnut, { mat: 'wood' }),
    box(1.12, 0.004, 0.004, 0, 0.143, 0.027, C.brass, { mat: 'metal' }),
    box(1.12, 0.004, 0.004, 0, 0.143, -0.027, C.brass, { mat: 'metal' }),

    // two thin linen cushions with piping and back ties
    ...CUSHION_X.flatMap((x) => [
      rbox(0.62, 0.06, 0.33, 0.02, x, 0.44, 0, C.linen, { mat: 'fabric' }),
      box(0.6, 0.004, 0.004, x, 0.444, 0.167, C.sand),
      box(0.6, 0.004, 0.004, x, 0.444, -0.167, C.sand),
      rbox(0.014, 0.06, 0.008, 0.004, x - 0.29, 0.412, -0.18, C.linen, { mat: 'fabric' }),
      rbox(0.014, 0.06, 0.008, 0.004, x + 0.29, 0.412, -0.18, C.linen, { mat: 'fabric' }),
    ]),

    // brass apron bolt heads, a maker's plate and floor glides under each ferrule
    ...[-0.58, 0.58].flatMap((x) => [
      cyl(0.009, 0.009, 0.006, x, 0.325, 0.189, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
      cyl(0.009, 0.009, 0.006, x, 0.325, -0.189, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    ]),
    box(0.1, 0.018, 0.004, 0, 0.325, 0.1895, C.brass, { mat: 'metal' }),
    ...LEGS.map(([x, z]) => cyl(0.036, 0.036, 0.004, x, 0.002, z, C.graphite, { mat: 'matte' }, 14)),
  ],
})
