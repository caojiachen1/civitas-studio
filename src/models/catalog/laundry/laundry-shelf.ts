import { C, box, cyl, defineModel, rbox } from '../../kit'

const SHELF_Y = [0.32, 0.75, 1.18, 1.61]
const POST_X = [-0.44, 0.44]
const POST_Z = [-0.17, 0.17]

export default defineModel({
  id: 'laundry-shelf',
  name: '洗衣房置物架',
  category: 'laundry',
  tags: ['laundry shelf', 'storage rack', 'utility shelving', '置物架', '洗衣房', '收纳架', '金属架'],
  footprint: [0.95, 0.4],
  height: 1.95,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // black steel frame
    ...POST_X.flatMap((x) => POST_Z.map((z) => box(0.025, 1.95, 0.025, x, 0.975, z, C.blackMetal, { mat: 'metal' }))),
    box(0.9, 0.022, 0.022, 0, 1.93, 0.17, C.blackMetal, { mat: 'metal' }),
    box(0.9, 0.022, 0.022, 0, 1.93, -0.17, C.blackMetal, { mat: 'metal' }),
    box(0.022, 0.022, 0.36, -0.44, 1.93, 0, C.blackMetal, { mat: 'metal' }),
    box(0.022, 0.022, 0.36, 0.44, 1.93, 0, C.blackMetal, { mat: 'metal' }),
    cyl(0.022, 0.022, 0.015, -0.44, 0.05, 0.17, C.graphite, { mat: 'metal' }, 14),
    cyl(0.022, 0.022, 0.015, 0.44, 0.05, 0.17, C.graphite, { mat: 'metal' }, 14),

    // four oak shelves with walnut front lips and steel angle brackets
    ...SHELF_Y.flatMap((y) => [
      rbox(0.86, 0.024, 0.34, 0.006, 0, y, 0, C.oak, { mat: 'wood' }),
      box(0.86, 0.008, 0.008, 0, y + 0.008, 0.171, C.walnut, { mat: 'wood' }),
      box(0.03, 0.055, 0.03, -0.43, y - 0.04, 0.14, C.blackMetal, { mat: 'metal' }),
      box(0.03, 0.055, 0.03, 0.43, y - 0.04, 0.14, C.blackMetal, { mat: 'metal' }),
    ]),

    // two wicker baskets on the lowest shelf
    ...[0, 1].flatMap((i) => {
      const x = i === 0 ? -0.2 : 0.2
      return [
        rbox(0.3, 0.16, 0.28, 0.03, x, 0.412, 0, C.sand, { mat: 'matte' }),
        rbox(0.32, 0.03, 0.3, 0.015, x, 0.5, 0, C.sand, { mat: 'matte' }),
        box(0.3, 0.004, 0.004, x, 0.39, 0.141, C.cream),
      ]
    }),

    // detergent bottles
    cyl(0.045, 0.05, 0.2, -0.28, 0.862, 0, C.cream, { mat: 'gloss' }, 20),
    cyl(0.02, 0.045, 0.025, -0.28, 0.9745, 0, C.cream, { mat: 'gloss' }, 16),
    cyl(0.022, 0.022, 0.02, -0.28, 0.997, 0, C.sage, { mat: 'gloss' }, 16),
    box(0.06, 0.06, 0.002, -0.28, 0.85, 0.049, C.sage),
    rbox(0.11, 0.18, 0.07, 0.015, -0.06, 0.852, 0.01, C.clay, { mat: 'gloss' }),
    cyl(0.028, 0.028, 0.025, -0.06, 0.9545, 0.01, C.ink, { mat: 'matte' }, 16),
    cyl(0.032, 0.034, 0.16, 0.16, 0.842, 0, C.white, { mat: 'gloss' }, 20),
    cyl(0.007, 0.007, 0.03, 0.16, 0.937, 0, C.steel, { mat: 'metal' }, 10),
    rbox(0.045, 0.008, 0.012, 0.004, 0.18, 0.948, 0, C.steel, { mat: 'metal' }),
    cyl(0.026, 0.03, 0.15, 0.34, 0.837, 0, C.sage, { mat: 'gloss' }, 16),
    rbox(0.04, 0.03, 0.05, 0.008, 0.34, 0.925, 0.01, C.graphite, { mat: 'matte' }),
    cyl(0.009, 0.009, 0.03, 0.34, 0.927, 0.045, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // folded towel stack on the third shelf
    rbox(0.24, 0.035, 0.2, 0.008, -0.2, 1.2095, 0, C.linen, { mat: 'fabric' }),
    rbox(0.24, 0.035, 0.2, 0.008, -0.2, 1.245, 0, C.cream, { mat: 'fabric' }),
    rbox(0.24, 0.035, 0.2, 0.008, -0.2, 1.2805, 0, C.sand, { mat: 'fabric' }),
    box(0.242, 0.002, 0.202, -0.2, 1.228, 0, C.linen),
    box(0.242, 0.002, 0.202, -0.2, 1.2635, 0, C.linen),

    // top shelf: one more basket and a folded throw
    rbox(0.3, 0.16, 0.28, 0.03, -0.2, 1.702, 0, C.sand, { mat: 'matte' }),
    rbox(0.32, 0.03, 0.3, 0.015, -0.2, 1.79, 0, C.sand, { mat: 'matte' }),
    rbox(0.26, 0.06, 0.22, 0.012, 0.2, 1.652, 0, C.blush, { mat: 'fabric' }),

    // anti-tip wall straps
    box(0.03, 0.08, 0.03, -0.44, 1.86, -0.185, C.blackMetal, { mat: 'metal' }),
    box(0.03, 0.08, 0.03, 0.44, 1.86, -0.185, C.blackMetal, { mat: 'metal' }),
  ],
})
