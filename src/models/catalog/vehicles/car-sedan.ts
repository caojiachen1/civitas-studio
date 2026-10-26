import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#e9e4d8'
const paintDeep = '#d7d1c2'
const tire = '#24272b'
const dark = '#2c3035'
const tint = '#333c42'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.33, 0.33, 0.22, x, 0.33, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.205, 0.205, 0.228, x, 0.33, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
]

export default defineModel({
  id: 'car-sedan',
  name: '城市轿车',
  category: 'vehicles',
  tags: ['car', 'sedan', '轿车', '小汽车', '城市', '通勤'],
  footprint: [1.85, 4.4],
  height: 1.45,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.78, 1.42),
    ...wheel(0.78, 1.42),
    ...wheel(-0.78, -1.44),
    ...wheel(0.78, -1.44),

    // lower body and hood / boot
    rbox(1.76, 0.6, 4.2, 0.15, 0, 0.61, 0, paint, { mat: 'gloss' }),
    rbox(1.7, 0.18, 3.86, 0.05, 0, 0.29, 0, dark),
    rbox(1.7, 0.13, 1.15, 0.06, 0, 0.925, 1.44, paint, { mat: 'gloss' }),
    rbox(1.68, 0.11, 0.9, 0.05, 0, 0.925, -1.55, paint, { mat: 'gloss' }),

    // cabin: dark interior tub, two seats, tinted glasshouse, roof
    rbox(1.56, 0.42, 1.98, 0.1, 0, 1.12, -0.14, tint, { mat: 'glass' }),
    box(1.42, 0.24, 1.86, 0, 0.95, -0.16, dark),
    rbox(0.42, 0.4, 0.14, 0.05, -0.33, 1.02, 0.1, C.leather, { mat: 'leather' }),
    rbox(0.42, 0.4, 0.14, 0.05, 0.33, 1.02, 0.1, C.leather, { mat: 'leather' }),
    rbox(1.62, 0.09, 1.84, 0.045, 0, 1.345, -0.2, paint, { mat: 'gloss' }),
    rbox(1.5, 0.46, 0.05, 0.02, 0, 1.13, 0.94, tint, { mat: 'glass', rot: [-0.45, 0, 0] }),
    rbox(1.48, 0.4, 0.05, 0.02, 0, 1.14, -1.1, tint, { mat: 'glass', rot: [0.52, 0, 0] }),

    // A / B / C pillars
    rbox(0.07, 0.42, 0.14, 0.03, -0.775, 1.12, 0.84, paint, { mat: 'gloss' }),
    rbox(0.07, 0.42, 0.14, 0.03, 0.775, 1.12, 0.84, paint, { mat: 'gloss' }),
    rbox(0.07, 0.4, 0.09, 0.02, -0.775, 1.11, -0.12, dark),
    rbox(0.07, 0.4, 0.09, 0.02, 0.775, 1.11, -0.12, dark),
    rbox(0.1, 0.4, 0.36, 0.04, -0.75, 1.11, -1.04, paint, { mat: 'gloss' }),
    rbox(0.1, 0.4, 0.36, 0.04, 0.75, 1.11, -1.04, paint, { mat: 'gloss' }),

    // chrome beltline and door furniture
    box(0.025, 0.035, 1.92, -0.785, 0.915, -0.14, chrome, { mat: 'metal' }),
    box(0.025, 0.035, 1.92, 0.785, 0.915, -0.14, chrome, { mat: 'metal' }),
    rbox(0.1, 0.08, 0.11, 0.02, -0.875, 1.0, 0.66, paint, { mat: 'gloss' }),
    rbox(0.1, 0.08, 0.11, 0.02, 0.875, 1.0, 0.66, paint, { mat: 'gloss' }),
    box(0.07, 0.025, 0.03, -0.83, 1.0, 0.68, dark),
    box(0.07, 0.025, 0.03, 0.83, 1.0, 0.68, dark),
    box(0.03, 0.045, 0.16, -0.89, 0.84, 0.3, chrome, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 0.89, 0.84, 0.3, chrome, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, -0.89, 0.84, -0.55, chrome, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 0.89, 0.84, -0.55, chrome, { mat: 'metal' }),

    // nose: bumper, grille, headlights, intake, plate
    rbox(1.78, 0.24, 0.24, 0.09, 0, 0.45, 2.04, paintDeep, { mat: 'gloss' }),
    rbox(0.95, 0.17, 0.05, 0.03, 0, 0.66, 2.11, dark, { mat: 'metal' }),
    box(0.98, 0.025, 0.03, 0, 0.735, 2.125, chrome, { mat: 'metal' }),
    rbox(0.42, 0.1, 0.05, 0.02, -0.63, 0.84, 2.09, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.42, 0.1, 0.05, 0.02, 0.63, 0.84, 2.09, '#ffe9c2', { mat: 'emissive' }),
    rbox(1.12, 0.09, 0.05, 0.03, 0, 0.37, 2.15, dark),
    box(0.44, 0.12, 0.02, 0, 0.56, 2.17, C.white),

    // tail: bumper, lamps, plate, exhausts
    rbox(1.78, 0.24, 0.24, 0.09, 0, 0.45, -2.04, paintDeep, { mat: 'gloss' }),
    rbox(0.42, 0.1, 0.05, 0.02, -0.63, 0.84, -2.09, C.red, { mat: 'emissive' }),
    rbox(0.42, 0.1, 0.05, 0.02, 0.63, 0.84, -2.09, C.red, { mat: 'emissive' }),
    box(0.44, 0.12, 0.02, 0, 0.56, -2.17, C.white),
    cyl(0.045, 0.045, 0.12, -0.48, 0.34, -2.14, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.045, 0.045, 0.12, 0.48, 0.34, -2.14, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // roof antenna fin
    rbox(0.06, 0.08, 0.18, 0.02, 0, 1.405, -0.95, dark),
  ],
})
