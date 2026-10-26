import { C, box, cyl, defineModel, ico, rbox } from '../../kit'

const CORE = '#3a5634'
const DEEP = '#3f5c38'
const MID = '#4a6b41'
const LIGHT = '#557849'
const PALE = '#628657'
const TWIG = '#6b5138'

// 20 rounded clumps skin the clipped core: two staggered rows on the long
// faces, four on the crown and one at each end.
const sideClumps = Array.from({ length: 14 }, (_, i) => {
  const side = i < 7 ? 1 : -1
  const j = i % 7
  const ys = [0.26, 0.5, 0.74, 0.36, 0.62, 0.88, 0.44]
  return ico(
    0.158 + (j % 3) * 0.008,
    -0.63 + j * 0.21,
    ys[j],
    side * 0.23,
    [DEEP, MID, LIGHT][(i + j) % 3],
    { mat: 'foliage', rot: [j * 0.2, i * 0.6, side * 0.15] },
    1,
  )
})

const topClumps: [number, number, number][] = [
  [-0.5, 0.9, 0.08],
  [-0.17, 0.92, -0.1],
  [0.17, 0.91, 0.09],
  [0.5, 0.9, -0.06],
]

const crown = topClumps.map(([x, y, z], i) =>
  ico(0.16, x, y, z, i % 2 === 0 ? LIGHT : PALE, { mat: 'foliage', rot: [0.2, i * 0.8, 0.15] }, 1),
)

const ends = [-1, 1].map((s, i) =>
  ico(0.14, s * 0.65, 0.5 + i * 0.12, 0.02, i === 0 ? MID : LIGHT, { mat: 'foliage', rot: [0, s * 0.4, 0] }, 1),
)

// Loose leaf plates sit proud of the core for a hand-clipped texture.
const plates = [-1, 1].flatMap((side) =>
  [0, 1, 2].map((k) =>
    box(0.1, 0.12, 0.032, -0.44 + k * 0.44, 0.8 - k * 0.1, side * 0.352, k % 2 === 0 ? PALE : LIGHT, {
      mat: 'foliage',
      rot: [0.1 * side, k * 0.5, 0.12 * side],
    }),
  ),
)

// Bare stems show where the foliage has thinned at the base.
const twigs = [
  [0.62, 0.2, 0.9],
  [-0.62, 0.2, -0.9],
  [0.6, -0.2, 0.85],
  [-0.6, -0.2, -0.85],
].map(([x, z, tilt], i) =>
  cyl(0.012, 0.026, 0.38, x, 0.21, z, i % 2 === 0 ? TWIG : '#5f4833', {
    mat: 'wood',
    rot: [z > 0 ? 0.35 : -0.35, 0, tilt],
  }, 6),
)

export default defineModel({
  id: 'hedge-block',
  name: '修剪绿篱',
  category: 'vegetation',
  tags: ['hedge', '绿篱', '灌木', '围挡', '花园'],
  footprint: [1.6, 0.8],
  height: 1.1,
  placement: 'outdoor',
  parts: [
    box(1.46, 0.08, 0.66, 0, 0.04, 0, C.soil, { mat: 'matte' }),
    rbox(1.5, 0.96, 0.7, 0.08, 0, 0.56, 0, CORE, { mat: 'foliage' }),
    ...sideClumps,
    ...crown,
    ...ends,
    ...plates,
    // flat clipped crown with a few loose shoots
    rbox(1.44, 0.045, 0.6, 0.03, 0, 1.045, 0, DEEP, { mat: 'foliage' }),
    ...[0, 1, 2, 3, 4, 5].map((i) =>
      box(0.2, 0.035, 0.15, -0.55 + (i % 3) * 0.55, 1.08, (i < 3 ? 1 : -1) * 0.14, i % 2 === 0 ? LIGHT : PALE, {
        mat: 'foliage',
        rot: [0.05, i * 0.7, 0.04],
      }),
    ),
    ...twigs,
  ],
})
