import { C, box, cyl, defineModel, rbox, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const paint = '#d7d9d4'
const paintDeep = '#a9b0ae'
const blue = '#4a6b87'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const steel = C.steel

// tyre tread touches y = 0
const wheel = (x: number, z: number): Part[] => {
  const out = Math.sign(x) * 0.148
  const out2: Part[] = [
    cyl(0.45, 0.45, 0.3, x, 0.45, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.245, 0.245, 0.312, x, 0.45, z, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.065, 0.065, 0.326, x, 0.45, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
  ]
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    out2.push(
      box(0.022, 0.18, 0.04, x + out, 0.45 + Math.cos(a) * 0.115, z + Math.sin(a) * 0.115, dark, {
        mat: 'metal',
        rot: [a, 0, 0],
      }),
    )
  }
  return out2
}

export default defineModel({
  id: 'tow-truck',
  name: '清障车',
  category: 'vehicles',
  tags: ['truck', 'tow', 'wrecker', 'rescue', '清障车', '拖车', '救援', '市政'],
  footprint: [2.3, 7.0],
  height: 2.8,
  placement: 'on-road',
  parts: [
    // 6 wheels: front axle, tandem rear
    ...wheel(-0.97, 2.45),
    ...wheel(0.97, 2.45),
    ...wheel(-0.97, -0.95),
    ...wheel(0.97, -0.95),
    ...wheel(-0.97, -2.15),
    ...wheel(0.97, -2.15),

    // chassis, fuel tank, rear support frame
    box(1.8, 0.22, 6.2, 0, 0.62, -0.15, dark, { mat: 'metal' }),
    cyl(0.2, 0.2, 0.9, -0.95, 0.54, 0.9, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    box(1.7, 0.2, 0.6, 0, 0.6, -3.05, dark, { mat: 'metal' }),

    // cab shell, grey sill and roof
    rbox(2.2, 1.75, 1.95, 0.15, 0, 1.58, 2.45, paint, { mat: 'gloss' }),
    rbox(2.21, 0.36, 1.86, 0.05, 0, 0.9, 2.45, paintDeep, { mat: 'gloss' }),
    rbox(2.16, 0.1, 1.85, 0.05, 0, 2.5, 2.43, paint, { mat: 'gloss' }),

    // windscreen, reveal and A-pillars
    box(2.06, 0.94, 0.05, 0, 2.02, 3.41, dark),
    box(1.98, 0.84, 0.05, 0, 2.03, 3.425, C.glass, { mat: 'glass', rot: [-0.12, 0, 0] }),
    rbox(0.08, 0.88, 0.1, 0.02, -1.02, 2.02, 3.39, paint, { mat: 'gloss', rot: [-0.12, 0, 0] }),
    rbox(0.08, 0.88, 0.1, 0.02, 1.02, 2.02, 3.39, paint, { mat: 'gloss', rot: [-0.12, 0, 0] }),

    // side glass, door seams, handles, steps and mirrors
    box(0.03, 0.6, 0.92, -1.105, 2.0, 2.5, dark),
    box(0.03, 0.6, 0.92, 1.105, 2.0, 2.5, dark),
    box(0.02, 0.52, 0.82, -1.12, 2.0, 2.5, C.glass, { mat: 'glass' }),
    box(0.02, 0.52, 0.82, 1.12, 2.0, 2.5, C.glass, { mat: 'glass' }),
    box(0.02, 1.0, 0.025, -1.112, 1.25, 1.68, dark),
    box(0.02, 1.0, 0.025, 1.112, 1.25, 1.68, dark),
    box(0.03, 0.05, 0.17, -1.12, 1.5, 2.2, steel, { mat: 'metal' }),
    box(0.03, 0.05, 0.17, 1.12, 1.5, 2.2, steel, { mat: 'metal' }),
    box(0.28, 0.06, 0.5, -0.98, 0.5, 2.35, dark, { mat: 'metal' }),
    box(0.28, 0.06, 0.5, 0.98, 0.5, 2.35, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, -1.09, 2.32, 3.18, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, 1.09, 2.32, 3.18, dark, { mat: 'metal' }),
    rbox(0.04, 0.32, 0.18, 0.02, -1.1, 2.18, 3.22, dark),
    rbox(0.04, 0.32, 0.18, 0.02, 1.1, 2.18, 3.22, dark),

    // nose: grille, bumper, lamps, indicators, plate, wipers
    rbox(1.15, 0.34, 0.05, 0.03, 0, 1.32, 3.435, dark, { mat: 'metal' }),
    rbox(2.24, 0.32, 0.16, 0.06, 0, 0.6, 3.42, bumper, { mat: 'metal' }),
    rbox(0.38, 0.15, 0.05, 0.02, -0.78, 0.97, 3.435, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.38, 0.15, 0.05, 0.02, 0.78, 0.97, 3.435, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, -1.0, 0.72, 3.44, '#d0672f', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, 1.0, 0.72, 3.44, '#d0672f', { mat: 'emissive' }),
    box(0.44, 0.13, 0.02, 0, 0.65, 3.47, C.white),
    box(0.56, 0.014, 0.018, -0.36, 1.8, 3.46, dark, { mat: 'matte', rot: [-0.12, 0, 0.16] }),
    box(0.56, 0.014, 0.018, 0.36, 1.8, 3.46, dark, { mat: 'matte', rot: [-0.12, 0, -0.16] }),

    // roof warning light bar: dark base and five amber modules
    box(1.7, 0.08, 0.3, 0, 2.56, 2.43, dark),
    box(0.26, 0.1, 0.22, -0.64, 2.62, 2.43, '#e8a72c', { mat: 'emissive' }),
    box(0.26, 0.1, 0.22, -0.32, 2.62, 2.43, '#e8a72c', { mat: 'emissive' }),
    box(0.26, 0.1, 0.22, 0, 2.62, 2.43, '#e8a72c', { mat: 'emissive' }),
    box(0.26, 0.1, 0.22, 0.32, 2.62, 2.43, '#e8a72c', { mat: 'emissive' }),
    box(0.26, 0.1, 0.22, 0.64, 2.62, 2.43, '#e8a72c', { mat: 'emissive' }),

    // tilt bed deck, tilted 8 deg with the tail down
    rbox(2.1, 0.1, 4.05, 0.03, 0, 1.168, -0.725, paintDeep, { mat: 'metal', rot: [-0.14, 0, 0] }),
    rbox(0.07, 0.26, 4.0, 0.02, -1.02, 1.348, -0.725, blue, { mat: 'gloss', rot: [-0.14, 0, 0] }),
    rbox(0.07, 0.26, 4.0, 0.02, 1.02, 1.348, -0.725, blue, { mat: 'gloss', rot: [-0.14, 0, 0] }),
    ...[-2.4, -1.6, -0.8, 0.0, 0.8].map((z) =>
      box(2.02, 0.03, 0.07, 0, 1.218 - 0.1392 * (z + 0.725), z, steel, { mat: 'metal', rot: [-0.14, 0, 0] }),
    ),
    rbox(0.12, 0.06, 3.9, 0.02, -0.5, 1.25, -0.725, dark, { mat: 'metal', rot: [-0.14, 0, 0] }),
    rbox(0.12, 0.06, 3.9, 0.02, 0.5, 1.25, -0.725, dark, { mat: 'metal', rot: [-0.14, 0, 0] }),
    rbox(2.02, 0.08, 0.5, 0.02, 0, 0.89, -2.9, dark, { mat: 'metal', rot: [-0.14, 0, 0] }),
    ...[0.9, -0.4, -1.7].flatMap((z) => [
      box(0.06, 0.34, 0.06, -1.03, 1.18 - 0.1392 * (z + 0.725), z, dark, { mat: 'metal' }),
      box(0.06, 0.34, 0.06, 1.03, 1.18 - 0.1392 * (z + 0.725), z, dark, { mat: 'metal' }),
    ]),

    // front bed bulkhead bridging cab and deck
    box(2.0, 0.36, 0.12, 0, 1.55, 1.37, blue, { mat: 'gloss' }),

    // winch: frame, drum, cable and fairlead
    box(0.7, 0.24, 0.42, 0, 1.5, 0.95, dark, { mat: 'metal' }),
    cyl(0.16, 0.16, 0.5, 0, 1.66, 0.95, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.14, 0.14, 0.52, 0, 1.66, 0.95, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    box(0.5, 0.14, 0.1, 0, 1.56, 1.25, dark, { mat: 'metal' }),

    // folding rear boom: pedestal, pins, two sections and hydraulic ram
    box(0.6, 0.42, 0.55, 0, 1.05, -2.5, dark, { mat: 'metal' }),
    cyl(0.07, 0.07, 0.55, 0, 1.28, -2.55, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.26, 0.3, Math.hypot(1.4, 1.3), 0, 1.98, -1.9, blue, {
      mat: 'gloss',
      rot: [Math.atan2(-1.4, 1.3), 0, 0],
    }),
    cyl(0.08, 0.08, 0.5, 0, 2.68, -1.25, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.2, 0.22, Math.hypot(0.48, 1.25), 0, 2.44, -0.625, paint, {
      mat: 'gloss',
      rot: [Math.atan2(0.48, 1.25), 0, 0],
    }),
    box(0.24, 0.16, 0.18, 0, 2.24, 0.0, dark, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.72, 0, 1.86, 0.0, dark, { mat: 'metal' }, 8),
    torus(0.07, 0.018, 0, 1.44, 0.0, steel, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    box(0.18, 0.22, 0.3, 0, 1.12, -2.85, dark, { mat: 'metal' }),
    cyl(0.04, 0.04, 0.26, 0, 1.16, -2.85, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.06, 0.06, 0.8, 0, 1.47, -2.49, steel, {
      mat: 'metal',
      rot: [Math.atan2(-1.09, 0.95), 0, 0],
    }, 12),
    cyl(0.035, 0.035, 0.5, 0, 1.8, -2.11, dark, {
      mat: 'metal',
      rot: [Math.atan2(-1.09, 0.95), 0, 0],
    }, 10),

    // rear reflective arrow board: frame, posts and six amber blocks
    box(1.3, 0.5, 0.05, 0, 1.56, -3.3, dark),
    box(0.06, 0.9, 0.06, -0.45, 1.0, -3.28, dark, { mat: 'metal' }),
    box(0.06, 0.9, 0.06, 0.45, 1.0, -3.28, dark, { mat: 'metal' }),
    box(0.18, 0.12, 0.02, -0.3, 1.64, -3.335, '#d0672f', { mat: 'emissive' }),
    box(0.18, 0.12, 0.02, -0.02, 1.64, -3.335, '#d0672f', { mat: 'emissive' }),
    box(0.18, 0.12, 0.02, 0.26, 1.64, -3.335, '#d0672f', { mat: 'emissive' }),
    box(0.18, 0.12, 0.02, -0.16, 1.48, -3.335, '#d0672f', { mat: 'emissive' }),
    box(0.18, 0.12, 0.02, 0.12, 1.48, -3.335, '#d0672f', { mat: 'emissive' }),
    box(0.18, 0.12, 0.02, 0.4, 1.48, -3.335, '#d0672f', { mat: 'emissive' }),

    // rear bumper, lamps, plate and mud flaps
    rbox(2.1, 0.24, 0.16, 0.06, 0, 0.55, -3.42, bumper, { mat: 'metal' }),
    box(0.44, 0.13, 0.02, 0, 0.58, -3.49, C.white),
    rbox(0.18, 0.4, 0.05, 0.02, -0.94, 0.84, -3.36, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.4, 0.05, 0.02, 0.94, 0.84, -3.36, C.red, { mat: 'emissive' }),
    box(0.3, 0.4, 0.04, -1.0, 0.34, -2.9, dark),
    box(0.3, 0.4, 0.04, 1.0, 0.34, -2.9, dark),
    box(0.3, 0.4, 0.04, -1.0, 0.34, -1.7, dark),
    box(0.3, 0.4, 0.04, 1.0, 0.34, -1.7, dark),
  ],
})
