import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const ROWS = [0.3, 0.58, 0.86, 1.14]
const COL_X = [-0.16, 0.16]
const BOTTLE_COLORS = ['#3d4b3c', '#553334', '#4a3a2b', '#2f3430']
const GLASS_X = [-0.12, 0.12]

export default defineModel({
  id: 'wine-rack',
  name: '酒架',
  category: 'dining',
  tags: ['wine rack', 'bottle storage', 'wall rack', '酒架', '红酒架', '餐厅', '收纳'],
  footprint: [0.7, 0.35],
  height: 1.7,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // walnut uprights with brass feet and finials
    rbox(0.04, 1.665, 0.04, 0.006, -0.325, 0.8475, 0, C.walnut, { mat: 'wood' }),
    rbox(0.04, 1.665, 0.04, 0.006, 0.325, 0.8475, 0, C.walnut, { mat: 'wood' }),
    rbox(0.06, 0.015, 0.06, 0.005, -0.325, 0.0075, 0, C.brass, { mat: 'metal' }),
    rbox(0.06, 0.015, 0.06, 0.005, 0.325, 0.0075, 0, C.brass, { mat: 'metal' }),
    cyl(0.02, 0.025, 0.02, -0.325, 1.69, 0, C.brass, { mat: 'metal' }, 14),
    cyl(0.02, 0.025, 0.02, 0.325, 1.69, 0, C.brass, { mat: 'metal' }, 14),

    // wall cleats
    box(0.62, 0.04, 0.02, 0, 1.63, -0.165, C.walnut, { mat: 'wood' }),
    box(0.62, 0.03, 0.02, 0, 0.1, -0.165, C.walnut, { mat: 'wood' }),

    // black steel support rails: two per row
    ...ROWS.flatMap((y) => [
      box(0.63, 0.022, 0.022, 0, y, -0.1, C.blackMetal, { mat: 'metal' }),
      box(0.63, 0.022, 0.022, 0, y, 0.03, C.blackMetal, { mat: 'metal' }),
    ]),

    // top oak shelf with walnut lip and steel brackets
    rbox(0.64, 0.025, 0.3, 0.006, 0, 1.46, 0, C.oak, { mat: 'wood' }),
    box(0.64, 0.008, 0.006, 0, 1.456, 0.152, C.walnut, { mat: 'wood' }),
    box(0.03, 0.05, 0.03, -0.31, 1.425, 0.12, C.blackMetal, { mat: 'metal' }),
    box(0.03, 0.05, 0.03, 0.31, 1.425, 0.12, C.blackMetal, { mat: 'metal' }),
    rbox(0.06, 0.1, 0.006, 0.003, -0.325, 1.3, 0.023, C.brass, { mat: 'metal' }),
    rbox(0.06, 0.1, 0.006, 0.003, 0.325, 1.3, 0.023, C.brass, { mat: 'metal' }),

    // eight horizontally stored bottles
    ...ROWS.flatMap((y, row) =>
      COL_X.flatMap((x, col) => {
        const color = BOTTLE_COLORS[(row * COL_X.length + col) % BOTTLE_COLORS.length]
        const axis = y + 0.047
        return [
          cyl(0.036, 0.036, 0.2, x, axis, -0.04, color, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 20),
          cyl(0.013, 0.036, 0.1, x, axis, 0.095, color, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 20),
          cyl(0.015, 0.015, 0.016, x, axis, 0.153, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
        ]
      }),
    ),

    // two wine glasses on the top shelf
    ...GLASS_X.flatMap((x) => [
      cyl(0.028, 0.028, 0.006, x, 1.4755, 0, C.glass, { mat: 'glass', opacity: 0.75 }, 20),
      cyl(0.005, 0.005, 0.055, x, 1.506, 0, C.glass, { mat: 'glass', opacity: 0.75 }, 10),
      cyl(0.036, 0.024, 0.07, x, 1.5685, 0, C.glass, { mat: 'glass', opacity: 0.75 }, 20),
      torus(0.036, 0.0025, x, 1.6035, 0, C.glass, { mat: 'glass', opacity: 0.75, rot: [Math.PI / 2, 0, 0] }, 20),
    ]),
  ],
})
