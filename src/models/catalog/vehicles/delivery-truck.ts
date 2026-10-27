import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#e6e3d9'
const cargo = '#eae7dd'
const cargoDeep = '#d8d5c9'
const livery = '#7d8b8d'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.43, 0.43, 0.3, x, 0.43, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.26, 0.26, 0.31, x, 0.43, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.09, 0.09, 0.316, x, 0.43, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'delivery-truck',
  name: '大型厢式货车',
  category: 'vehicles',
  tags: ['truck', 'delivery', 'van', 'cargo', '货车', '物流', '厢式货车', '配送'],
  footprint: [2.2, 6.2],
  height: 2.9,
  placement: 'on-road',
  parts: [
    // wheels: single front axle, single rear axle
    ...wheel(-0.86, 1.95),
    ...wheel(0.86, 1.95),
    ...wheel(-0.86, -1.85),
    ...wheel(0.86, -1.85),

    // ladder chassis and rear mud flaps
    box(1.94, 0.2, 5.6, 0, 0.63, 0.1, dark, { mat: 'metal' }),
    box(0.3, 0.4, 0.04, -0.86, 0.58, -2.52, dark, { mat: 'matte' }),
    box(0.3, 0.4, 0.04, 0.86, 0.58, -2.52, dark, { mat: 'matte' }),

    // cab shell, roof cap and raked windscreen
    rbox(2.06, 1.65, 2.4, 0.14, 0, 1.56, 1.72, paint, { mat: 'gloss' }),
    rbox(2.04, 0.1, 2.28, 0.05, 0, 2.43, 1.72, paint, { mat: 'gloss' }),
    box(1.94, 0.86, 0.04, 0, 1.96, 2.905, dark),
    box(1.88, 0.8, 0.05, 0, 1.96, 2.915, C.glass, { mat: 'glass', rot: [-0.06, 0, 0] }),
    rbox(0.07, 0.82, 0.1, 0.02, -0.95, 1.96, 2.91, paint, { mat: 'gloss', rot: [-0.06, 0, 0] }),
    rbox(0.07, 0.82, 0.1, 0.02, 0.95, 1.96, 2.91, paint, { mat: 'gloss', rot: [-0.06, 0, 0] }),

    // cab side glazing, door seams, handles and steps
    box(0.02, 0.56, 0.94, -1.036, 1.95, 2.15, C.glass, { mat: 'glass' }),
    box(0.02, 0.56, 0.94, 1.036, 1.95, 2.15, C.glass, { mat: 'glass' }),
    box(0.02, 1.15, 0.025, -1.038, 1.35, 1.2, dark),
    box(0.02, 1.15, 0.025, 1.038, 1.35, 1.2, dark),
    box(0.03, 0.05, 0.16, -1.05, 1.52, 1.55, chrome, { mat: 'metal' }),
    box(0.03, 0.05, 0.16, 1.05, 1.52, 1.55, chrome, { mat: 'metal' }),
    box(0.26, 0.06, 0.5, -0.97, 0.52, 1.7, dark, { mat: 'metal' }),
    box(0.26, 0.06, 0.5, 0.97, 0.52, 1.7, dark, { mat: 'metal' }),

    // nose: grille, chrome bar, bumper, lamps, plate and turn signals
    rbox(1.2, 0.3, 0.06, 0.03, 0, 1.15, 2.93, dark, { mat: 'metal' }),
    box(1.16, 0.035, 0.02, 0, 1.2, 2.965, chrome, { mat: 'metal' }),
    rbox(2.12, 0.36, 0.22, 0.08, 0, 0.62, 2.97, bumper, { mat: 'metal' }),
    rbox(0.36, 0.16, 0.05, 0.02, -0.8, 1.12, 2.95, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.36, 0.16, 0.05, 0.02, 0.8, 1.12, 2.95, '#ffe9c2', { mat: 'emissive' }),
    box(0.46, 0.13, 0.02, 0, 0.7, 3.085, C.white),
    rbox(0.14, 0.1, 0.04, 0.02, -0.94, 0.72, 3.075, '#c99a5e', { mat: 'gloss' }),
    rbox(0.14, 0.1, 0.04, 0.02, 0.94, 0.72, 3.075, '#c99a5e', { mat: 'gloss' }),

    // mirror arms and heads
    box(0.08, 0.04, 0.04, -1.06, 2.05, 2.62, dark, { mat: 'metal' }),
    box(0.08, 0.04, 0.04, 1.06, 2.05, 2.62, dark, { mat: 'metal' }),
    rbox(0.05, 0.3, 0.18, 0.02, -1.075, 1.92, 2.65, dark),
    rbox(0.05, 0.3, 0.18, 0.02, 1.075, 1.92, 2.65, dark),

    // cargo box, roof cap and side rub strips
    rbox(2.12, 2.0, 3.75, 0.06, 0, 1.78, -1.15, cargo, { mat: 'gloss' }),
    rbox(2.14, 0.12, 3.7, 0.03, 0, 2.84, -1.15, cargoDeep, { mat: 'gloss' }),
    box(0.03, 0.1, 3.6, -1.066, 0.98, -1.15, livery, { mat: 'gloss' }),
    box(0.03, 0.1, 3.6, 1.066, 0.98, -1.15, livery, { mat: 'gloss' }),
    box(0.02, 0.2, 3.65, -1.061, 1.24, -1.15, livery, { mat: 'gloss' }),
    box(0.02, 0.2, 3.65, 1.061, 1.24, -1.15, livery, { mat: 'gloss' }),
    rbox(0.03, 0.07, 0.14, 0.01, -1.072, 1.7, -2.55, '#c99a5e', { mat: 'gloss' }),
    rbox(0.03, 0.07, 0.14, 0.01, 1.072, 1.7, -2.55, '#c99a5e', { mat: 'gloss' }),

    // rear doors: recessed frame, two leaves, centre gap, handles and hinges
    box(2.0, 1.9, 0.04, 0, 1.72, -3.035, dark),
    rbox(0.94, 1.82, 0.06, 0.02, -0.5, 1.72, -3.06, cargo, { mat: 'gloss' }),
    rbox(0.94, 1.82, 0.06, 0.02, 0.5, 1.72, -3.06, cargoDeep, { mat: 'gloss' }),
    box(0.035, 1.86, 0.02, 0, 1.72, -3.085, dark),
    box(0.035, 0.46, 0.035, -0.09, 1.5, -3.08, chrome, { mat: 'metal' }),
    box(0.035, 0.46, 0.035, 0.09, 1.5, -3.08, chrome, { mat: 'metal' }),
    box(0.06, 0.12, 0.02, -0.88, 2.32, -3.08, dark),
    box(0.06, 0.12, 0.02, 0.88, 2.32, -3.08, dark),

    // rear bumper, tail lamps and plate
    rbox(2.12, 0.26, 0.18, 0.06, 0, 0.68, -3.01, bumper, { mat: 'metal' }),
    rbox(0.18, 0.42, 0.05, 0.02, -0.84, 1.0, -3.09, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.42, 0.05, 0.02, 0.84, 1.0, -3.09, C.red, { mat: 'emissive' }),
    box(0.46, 0.13, 0.02, 0, 0.7, -3.1, C.white),

    // front roof marker lamps above the cab
    box(0.16, 0.06, 0.04, -0.6, 2.76, 0.73, '#c99a5e', { mat: 'gloss' }),
    box(0.16, 0.06, 0.04, 0, 2.76, 0.73, '#c99a5e', { mat: 'gloss' }),
    box(0.16, 0.06, 0.04, 0.6, 2.76, 0.73, '#c99a5e', { mat: 'gloss' }),
  ],
})
