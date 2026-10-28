import { box, defineModel, rbox } from '../../kit'

const CREAM = '#ddd2bf'
const EDGE = '#c9b9a1'
const SAGE = '#9aa894'
const CLAY = '#b07a5c'

const fringe = Array.from({ length: 10 }, (_, i) => -0.99 + i * 0.22).flatMap((x) => [
  box(0.03, 0.004, 0.05, x, 0.004, -0.915, EDGE),
  box(0.03, 0.004, 0.05, x, 0.004, 0.915, EDGE),
])

const longDiamonds = [-0.98, -0.70, -0.42, -0.14, 0.14, 0.42, 0.70, 0.98].flatMap((x) => [
  rbox(0.06, 0.004, 0.06, 0.004, x, 0.015, -0.695, CREAM, { rot: [0, Math.PI / 4, 0] }),
  rbox(0.06, 0.004, 0.06, 0.004, x, 0.015, 0.695, CREAM, { rot: [0, Math.PI / 4, 0] }),
])

const shortDiamonds = [-0.45, -0.15, 0.15, 0.45].flatMap((z) => [
  rbox(0.06, 0.004, 0.06, 0.004, -1.095, 0.015, z, CREAM, { rot: [0, Math.PI / 4, 0] }),
  rbox(0.06, 0.004, 0.06, 0.004, 1.095, 0.015, z, CREAM, { rot: [0, Math.PI / 4, 0] }),
])

export default defineModel({
  id: 'rug-rect',
  name: '客厅地毯',
  category: 'living',
  tags: ['rug', 'carpet', '地毯', 'living room', 'sage', 'textile'],
  footprint: [2.6, 1.88],
  height: 0.025,
  placement: 'indoor',
  noCollide: true,
  shadow: false,
  parts: [
    // layered pile: cream selvedge, clay border, sage field
    rbox(2.58, 0.007, 1.78, 0.003, 0, 0.0035, 0, EDGE),
    rbox(2.32, 0.006, 1.52, 0.004, 0, 0.010, 0, CLAY),
    rbox(2.06, 0.007, 1.26, 0.004, 0, 0.0165, 0, SAGE),

    // thin cream inner border
    rbox(1.94, 0.005, 0.025, 0.002, 0, 0.0225, -0.60, CREAM),
    rbox(1.94, 0.005, 0.025, 0.002, 0, 0.0225, 0.60, CREAM),
    rbox(0.025, 0.005, 1.14, 0.002, -0.97, 0.0225, 0, CREAM),
    rbox(0.025, 0.005, 1.14, 0.002, 0.97, 0.0225, 0, CREAM),

    // border motif
    ...longDiamonds,
    ...shortDiamonds,

    // hand-knotted fringe on both short ends
    ...fringe,

    // central medallion and four corner motifs
    rbox(0.58, 0.003, 0.58, 0.006, 0, 0.0205, 0, CLAY, { rot: [0, Math.PI / 4, 0] }),
    rbox(0.42, 0.003, 0.42, 0.006, 0, 0.0215, 0, CREAM, { rot: [0, Math.PI / 4, 0] }),
    rbox(0.2, 0.003, 0.2, 0.006, 0, 0.0225, 0, SAGE, { rot: [0, Math.PI / 4, 0] }),
    ...[
      [-0.8, -0.44],
      [-0.8, 0.44],
      [0.8, -0.44],
      [0.8, 0.44],
    ].map(([x, z]) => rbox(0.12, 0.003, 0.12, 0.004, x, 0.0205, z, CLAY, { rot: [0, Math.PI / 4, 0] })),
  ],
})
