import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const FRAME = '#516b70'
const SEAT = '#b18a5b'
const SEAT_DARK = '#96724a'
const CHAIN = '#b3babb'

const legs: [number, number][] = [
  [-1.12, 0.6],
  [1.12, 0.6],
  [-1.12, -0.6],
  [1.12, -0.6],
]

const swings = [-0.5, 0.5]

export default defineModel({
  id: 'swing-set',
  name: '秋千架',
  category: 'outdoor',
  tags: ['swing', 'swing set', 'playground', '秋千架', '秋千', '游乐设施'],
  footprint: [2.6, 1.4],
  height: 2.3,
  placement: 'outdoor',
  parts: [
    // concrete pads and galvanised ground sleeves
    ...legs.map(([x, z]) => cyl(0.1, 0.1, 0.06, x, 0.03, z, C.concrete, { mat: 'stone' }, 12)),
    ...legs.map(([x, z]) => cyl(0.062, 0.062, 0.16, x, 0.14, z * 0.97, C.steel, { mat: 'metal' }, 12)),
    // four A-frame legs leaning towards the ridge line
    ...legs.map(([x, z]) =>
      cyl(0.04, 0.048, 2.261, x, 1.15, z / 2, FRAME, {
        mat: 'metal',
        rot: [z > 0 ? -0.2685 : 0.2685, 0, 0],
      }, 10),
    ),
    // mid-height braces tying each pair of legs together
    box(0.05, 0.055, 0.86, -1.12, 0.75, 0, FRAME, { mat: 'metal' }),
    box(0.05, 0.055, 0.86, 1.12, 0.75, 0, FRAME, { mat: 'metal' }),
    // top beam and its cast caps
    cyl(0.055, 0.055, 2.46, 0, 2.19, 0, FRAME, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    sphere(0.06, -1.23, 2.24, 0, FRAME, { mat: 'metal' }, 12),
    sphere(0.06, 1.23, 2.24, 0, FRAME, { mat: 'metal' }, 12),
    // saddle brackets where the A-frames meet the beam
    rbox(0.15, 0.14, 0.14, 0.02, -1.12, 2.1, 0, FRAME, { mat: 'metal' }),
    rbox(0.15, 0.14, 0.14, 0.02, 1.12, 2.1, 0, FRAME, { mat: 'metal' }),
    sphere(0.022, -1.12, 2.06, 0.08, C.steel, { mat: 'metal' }, 8),
    sphere(0.022, 1.12, 2.06, 0.08, C.steel, { mat: 'metal' }, 8),
    // forged rings girdling the beam above each swing
    ...swings.map((x) =>
      torus(0.07, 0.012, x, 2.19, 0, CHAIN, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    ),
    // two swings: four chains each, seats and steel hanger plates
    ...swings.flatMap((x) => [
      cyl(0.009, 0.009, 1.499, x - 0.08, 1.375, 0, CHAIN, { mat: 'metal', rot: [0, 0, -0.107] }, 6),
      cyl(0.009, 0.009, 1.499, x + 0.08, 1.375, 0, CHAIN, { mat: 'metal', rot: [0, 0, 0.107] }, 6),
    ]),
    ...swings.map((x) => rbox(0.46, 0.05, 0.2, 0.02, x, 0.6, 0, SEAT, { mat: 'wood' })),
    ...swings.flatMap((x) => [
      box(0.03, 0.035, 0.17, x - 0.16, 0.6, 0, FRAME, { mat: 'metal' }),
      box(0.03, 0.035, 0.17, x + 0.16, 0.6, 0, FRAME, { mat: 'metal' }),
    ]),
    ...swings.flatMap((x) => [
      box(0.46, 0.012, 0.022, x, 0.628, -0.07, SEAT_DARK, { mat: 'wood' }),
      box(0.46, 0.012, 0.022, x, 0.628, 0.07, SEAT_DARK, { mat: 'wood' }),
    ]),
  ],
})
