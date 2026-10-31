import { C, box, cyl, defineModel, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

const yellow = '#d99a2b'
const yellowDeep = '#bd8122'
const white = '#e8e5d8'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'

// axle along X: tyre tread touches y = 0
const wheel = (x: number, z: number): Part[] => {
  const out = Math.sign(x) * 0.163
  const out2: Part[] = [
    cyl(0.5, 0.5, 0.3, x, 0.5, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.275, 0.275, 0.312, x, 0.5, z, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.07, 0.07, 0.326, x, 0.5, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
  ]
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    out2.push(
      box(0.022, 0.2, 0.045, x + out, 0.5 + Math.cos(a) * 0.13, z + Math.sin(a) * 0.13, dark, {
        mat: 'metal',
        rot: [a, 0, 0],
      }),
    )
  }
  return out2
}

export default defineModel({
  id: 'garbage-truck',
  name: '垃圾清运车',
  category: 'vehicles',
  tags: ['truck', 'garbage', 'refuse', '垃圾车', '市政', '清运', '压缩'],
  footprint: [2.4, 7.6],
  height: 3.4,
  placement: 'on-road',
  parts: [
    // 6 wheels: single front axle, tandem rear axles
    ...wheel(-1.02, 2.35),
    ...wheel(1.02, 2.35),
    ...wheel(-1.02, -1.55),
    ...wheel(1.02, -1.55),
    ...wheel(-1.02, -2.75),
    ...wheel(1.02, -2.75),

    // ladder chassis, rear crossmember, fuel and air tanks
    box(1.94, 0.24, 6.9, 0, 0.72, -0.1, dark, { mat: 'metal' }),
    box(1.7, 0.16, 0.3, 0, 0.64, -3.5, dark, { mat: 'metal' }),
    cyl(0.22, 0.22, 1.0, -0.98, 0.58, 0.5, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.16, 0.16, 0.7, 0.98, 0.54, 0.1, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),

    // cab shell, sill band and roof cap
    rbox(2.26, 1.9, 2.1, 0.16, 0, 1.73, 2.65, yellow, { mat: 'gloss' }),
    rbox(2.28, 0.5, 1.96, 0.06, 0, 0.99, 2.7, yellowDeep, { mat: 'gloss' }),
    rbox(2.24, 0.12, 2.0, 0.05, 0, 2.74, 2.6, yellow, { mat: 'gloss' }),

    // raked windscreen, dark reveal and A-pillars
    box(2.12, 0.96, 0.05, 0, 2.13, 3.685, dark),
    box(2.04, 0.86, 0.05, 0, 2.14, 3.7, C.glass, { mat: 'glass', rot: [-0.1, 0, 0] }),
    rbox(0.08, 0.9, 0.1, 0.02, -1.06, 2.13, 3.66, yellow, { mat: 'gloss', rot: [-0.1, 0, 0] }),
    rbox(0.08, 0.9, 0.1, 0.02, 1.06, 2.13, 3.66, yellow, { mat: 'gloss', rot: [-0.1, 0, 0] }),

    // cab side glass, door seams, handles and steps
    box(0.03, 0.66, 1.0, -1.135, 2.1, 2.72, dark),
    box(0.03, 0.66, 1.0, 1.135, 2.1, 2.72, dark),
    box(0.02, 0.58, 0.9, -1.15, 2.1, 2.72, C.glass, { mat: 'glass' }),
    box(0.02, 0.58, 0.9, 1.15, 2.1, 2.72, C.glass, { mat: 'glass' }),
    box(0.02, 1.06, 0.025, -1.142, 1.32, 1.82, dark),
    box(0.02, 1.06, 0.025, 1.142, 1.32, 1.82, dark),
    box(0.03, 0.05, 0.18, -1.15, 1.63, 2.32, C.steel, { mat: 'metal' }),
    box(0.03, 0.05, 0.18, 1.15, 1.63, 2.32, C.steel, { mat: 'metal' }),
    box(0.3, 0.06, 0.55, -0.98, 0.5, 2.55, dark, { mat: 'metal' }),
    box(0.3, 0.06, 0.55, 0.98, 0.5, 2.55, dark, { mat: 'metal' }),
    box(0.05, 0.3, 0.05, -0.99, 0.65, 2.3, dark, { mat: 'metal' }),
    box(0.05, 0.3, 0.05, 0.99, 0.65, 2.3, dark, { mat: 'metal' }),

    // mirror arms and heads
    box(0.1, 0.04, 0.04, -1.14, 2.36, 3.36, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, 1.14, 2.36, 3.36, dark, { mat: 'metal' }),
    rbox(0.05, 0.34, 0.2, 0.02, -1.175, 2.2, 3.4, dark),
    rbox(0.05, 0.34, 0.2, 0.02, 1.175, 2.2, 3.4, dark),

    // nose: grille, bumper, headlamps, indicators, plate, wipers
    rbox(1.15, 0.34, 0.05, 0.03, 0, 1.34, 3.715, dark, { mat: 'metal' }),
    rbox(2.32, 0.34, 0.18, 0.06, 0, 0.62, 3.69, bumper, { mat: 'metal' }),
    rbox(0.4, 0.16, 0.05, 0.02, -0.84, 0.98, 3.72, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.4, 0.16, 0.05, 0.02, 0.84, 0.98, 3.72, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.12, 0.1, 0.04, 0.01, -1.03, 0.72, 3.7, '#d0672f', { mat: 'emissive' }),
    rbox(0.12, 0.1, 0.04, 0.01, 1.03, 0.72, 3.7, '#d0672f', { mat: 'emissive' }),
    box(0.46, 0.13, 0.02, 0, 0.66, 3.79, C.white),
    box(0.6, 0.014, 0.018, -0.4, 1.97, 3.77, dark, { mat: 'matte', rot: [-0.1, 0, 0.16] }),
    box(0.6, 0.014, 0.018, 0.4, 1.97, 3.77, dark, { mat: 'matte', rot: [-0.1, 0, -0.16] }),

    // roof beacon: amber lens on a black base
    box(0.52, 0.06, 0.26, 0, 2.84, 2.6, dark),
    box(0.48, 0.1, 0.2, 0, 2.92, 2.6, '#e8a72c', { mat: 'emissive' }),

    // compactor body: shell, roof cap, roof ribs and side seams
    rbox(2.36, 2.08, 3.95, 0.08, 0, 2.0, -0.475, yellow, { mat: 'gloss' }),
    rbox(2.38, 0.1, 3.9, 0.04, 0, 3.09, -0.475, yellowDeep, { mat: 'gloss' }),
    box(2.3, 0.05, 0.1, 0, 3.16, 1.1, dark),
    box(2.3, 0.05, 0.1, 0, 3.16, -0.4, dark),
    box(2.3, 0.05, 0.1, 0, 3.16, -1.9, dark),
    ...[0.35, -0.85, -1.95].flatMap((z) => [
      box(0.02, 1.9, 0.025, -1.19, 2.0, z, yellowDeep, { mat: 'gloss' }),
      box(0.02, 1.9, 0.025, 1.19, 2.0, z, yellowDeep, { mat: 'gloss' }),
    ]),
    box(0.03, 0.07, 3.8, -1.185, 1.35, -0.475, yellowDeep, { mat: 'gloss' }),
    box(0.03, 0.07, 3.8, 1.185, 1.35, -0.475, yellowDeep, { mat: 'gloss' }),
    box(0.03, 0.07, 3.8, -1.185, 2.55, -0.475, yellowDeep, { mat: 'gloss' }),
    box(0.03, 0.07, 3.8, 1.185, 2.55, -0.475, yellowDeep, { mat: 'gloss' }),
    box(0.04, 0.07, 3.8, -1.18, 0.99, -0.475, dark, { mat: 'metal' }),
    box(0.04, 0.07, 3.8, 1.18, 0.99, -0.475, dark, { mat: 'metal' }),
    ...[1.1, -0.2, -1.5, -2.2].flatMap((z) => [
      box(0.02, 0.16, 0.5, -1.185, 1.12, z, white, { mat: 'gloss' }),
      box(0.02, 0.16, 0.5, 1.185, 1.12, z, white, { mat: 'gloss' }),
    ]),

    // inspection doors, handles, hinges and warning placards
    rbox(0.02, 0.72, 0.95, 0.02, -1.19, 1.82, -0.95, yellowDeep, { mat: 'gloss' }),
    rbox(0.02, 0.72, 0.95, 0.02, 1.19, 1.82, -0.95, yellowDeep, { mat: 'gloss' }),
    box(0.012, 0.05, 0.16, -1.194, 1.82, -0.55, C.steel, { mat: 'metal' }),
    box(0.012, 0.05, 0.16, 1.194, 1.82, -0.55, C.steel, { mat: 'metal' }),
    box(0.012, 0.14, 0.14, -1.194, 1.44, -1.3, dark, { mat: 'metal' }),
    box(0.012, 0.14, 0.14, 1.194, 1.44, -1.3, dark, { mat: 'metal' }),
    rbox(0.02, 0.26, 0.34, 0.02, -1.19, 2.5, 0.55, white, { mat: 'gloss' }),
    rbox(0.02, 0.26, 0.34, 0.02, 1.19, 2.5, 0.55, white, { mat: 'gloss' }),

    // rear hopper, opening and sloped lip
    rbox(2.2, 1.65, 0.95, 0.06, 0, 1.72, -2.9, yellow, { mat: 'gloss' }),
    box(2.1, 0.16, 0.5, 0, 2.62, -3.05, yellowDeep, { mat: 'gloss', rot: [0.32, 0, 0] }),
    box(1.9, 1.2, 0.05, 0, 1.65, -3.39, dark),
    box(1.98, 0.12, 0.1, 0, 2.27, -3.4, yellowDeep, { mat: 'gloss' }),
    box(0.1, 1.3, 0.1, -0.95, 1.65, -3.4, yellowDeep, { mat: 'gloss' }),
    box(0.1, 1.3, 0.1, 0.95, 1.65, -3.4, yellowDeep, { mat: 'gloss' }),
    box(1.98, 0.1, 0.1, 0, 1.02, -3.4, yellowDeep, { mat: 'gloss' }),

    // rear bin lifter: guide rails, carriage, cradle arms and rams
    box(0.09, 1.4, 0.1, -0.82, 1.75, -3.54, dark, { mat: 'metal' }),
    box(0.09, 1.4, 0.1, 0.82, 1.75, -3.54, dark, { mat: 'metal' }),
    cyl(0.06, 0.06, 0.14, -0.82, 2.45, -3.54, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.06, 0.06, 0.14, 0.82, 2.45, -3.54, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    rbox(1.6, 0.1, 0.32, 0.03, 0, 0.98, -3.56, dark, { mat: 'metal' }),
    rbox(0.1, 0.7, 0.12, 0.02, -0.7, 1.4, -3.62, yellowDeep, { mat: 'gloss', rot: [0.2, 0, 0] }),
    rbox(0.1, 0.7, 0.12, 0.02, 0.7, 1.4, -3.62, yellowDeep, { mat: 'gloss', rot: [0.2, 0, 0] }),
    cyl(0.055, 0.055, 1.0, -0.58, 1.45, -3.66, C.steel, { mat: 'metal' }, 12),
    cyl(0.055, 0.055, 1.0, 0.58, 1.45, -3.66, C.steel, { mat: 'metal' }, 12),
    cyl(0.03, 0.03, 0.5, -0.58, 2.2, -3.66, C.steel, { mat: 'metal' }, 10),
    cyl(0.03, 0.03, 0.5, 0.58, 2.2, -3.66, C.steel, { mat: 'metal' }, 10),

    // rear bumper, tail lamps, plate and mud flaps
    rbox(2.16, 0.24, 0.16, 0.06, 0, 0.52, -3.7, bumper, { mat: 'metal' }),
    box(0.44, 0.13, 0.02, 0, 0.54, -3.79, C.white),
    rbox(0.18, 0.48, 0.05, 0.02, -0.98, 1.15, -3.46, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.48, 0.05, 0.02, 0.98, 1.15, -3.46, C.red, { mat: 'emissive' }),
    box(0.32, 0.46, 0.04, -1.0, 0.39, -3.4, dark),
    box(0.32, 0.46, 0.04, 1.0, 0.39, -3.4, dark),

    // roof crane: turret, hinge pins, two boom sections and grapple
    cyl(0.26, 0.3, 0.14, 0, 3.21, -1.6, dark, { mat: 'metal' }, 14),
    cyl(0.075, 0.075, 0.66, 0, 3.28, -1.6, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.2, 0.16, 1.152, 0, 3.295, -2.175, yellow, {
      mat: 'gloss',
      rot: [Math.atan2(-0.04, -1.15), 0, 0],
    }),
    cyl(0.065, 0.065, 0.5, 0, 3.32, -2.75, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.15, 0.13, 0.728, 0, 3.22, -3.1, yellowDeep, {
      mat: 'gloss',
      rot: [Math.atan2(0.2, -0.7), 0, 0],
    }),
    box(0.36, 0.06, 0.18, 0, 3.14, -3.45, yellowDeep, { mat: 'gloss' }),
    box(0.06, 0.28, 0.06, -0.13, 3.0, -3.45, dark, { mat: 'metal' }),
    box(0.06, 0.28, 0.06, 0.13, 3.0, -3.45, dark, { mat: 'metal' }),
    box(0.24, 0.12, 0.2, 0, 3.17, -1.15, dark, { mat: 'metal' }),
    cyl(0.045, 0.045, 0.3, 0, 3.23, -1.15, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.06, 0.06, 0.62, 0, 3.258, -1.55, C.steel, {
      mat: 'metal',
      rot: [Math.atan2(-1, 0.07), 0, 0],
    }, 12),
    cyl(0.035, 0.035, 0.44, 0, 3.282, -1.95, dark, {
      mat: 'metal',
      rot: [Math.atan2(-1, 0.07), 0, 0],
    }, 10),
  ],
})
