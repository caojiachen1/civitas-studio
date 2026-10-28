import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = C.terracotta
const paintDeep = '#a35f43'
const tire = '#24272b'
const dark = '#2f3337'
const tint = '#46545a'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.31, 0.31, 0.22, x, 0.31, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.19, 0.19, 0.228, x, 0.31, z, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
]

export default defineModel({
  id: 'car-hatchback',
  name: '小型掀背车',
  category: 'vehicles',
  tags: ['car', 'hatchback', '掀背车', '小型车', '两厢车'],
  footprint: [1.8, 4.0],
  height: 1.5,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.755, 1.22),
    ...wheel(0.755, 1.22),
    ...wheel(-0.755, -1.25),
    ...wheel(0.755, -1.25),

    // compact rounded body with dark rocker
    rbox(1.72, 0.6, 3.9, 0.18, 0, 0.6, 0, paint, { mat: 'gloss' }),
    rbox(1.66, 0.16, 3.6, 0.05, 0, 0.28, 0, dark),
    rbox(1.66, 0.14, 0.95, 0.06, 0, 0.91, 1.44, paint, { mat: 'gloss' }),

    // tall glasshouse, roof, raked screens
    rbox(1.54, 0.46, 2.2, 0.1, 0, 1.13, -0.5, tint, { mat: 'glass' }),
    box(1.4, 0.24, 1.9, 0, 0.93, -0.45, dark),
    rbox(0.4, 0.4, 0.14, 0.05, -0.32, 1.0, -0.1, C.leather, { mat: 'leather' }),
    rbox(0.4, 0.4, 0.14, 0.05, 0.32, 1.0, -0.1, C.leather, { mat: 'leather' }),
    rbox(1.6, 0.09, 2.0, 0.045, 0, 1.345, -0.58, paint, { mat: 'gloss' }),
    rbox(1.46, 0.44, 0.05, 0.02, 0, 1.14, 0.72, tint, { mat: 'glass', rot: [-0.5, 0, 0] }),
    rbox(1.44, 0.64, 0.05, 0.02, 0, 1.06, -1.78, tint, { mat: 'glass', rot: [0.26, 0, 0] }),

    // A / C pillars and chrome beltline
    rbox(0.075, 0.46, 0.15, 0.03, -0.775, 1.12, 0.58, paint, { mat: 'gloss' }),
    rbox(0.075, 0.46, 0.15, 0.03, 0.775, 1.12, 0.58, paint, { mat: 'gloss' }),
    rbox(0.1, 0.46, 0.3, 0.04, -0.76, 1.12, -1.45, paint, { mat: 'gloss' }),
    rbox(0.1, 0.46, 0.3, 0.04, 0.76, 1.12, -1.45, paint, { mat: 'gloss' }),
    box(0.02, 0.03, 2.1, -0.78, 0.92, -0.5, C.steel, { mat: 'metal' }),
    box(0.02, 0.03, 2.1, 0.78, 0.92, -0.5, C.steel, { mat: 'metal' }),

    // mirrors, handles
    rbox(0.08, 0.075, 0.1, 0.02, -0.86, 1.0, 0.44, paint, { mat: 'gloss' }),
    rbox(0.08, 0.075, 0.1, 0.02, 0.86, 1.0, 0.44, paint, { mat: 'gloss' }),
    box(0.06, 0.02, 0.03, -0.8, 1.0, 0.46, dark),
    box(0.06, 0.02, 0.03, 0.8, 1.0, 0.46, dark),
    box(0.03, 0.04, 0.14, -0.87, 0.82, 0.1, C.steel, { mat: 'metal' }),
    box(0.03, 0.04, 0.14, 0.87, 0.82, 0.1, C.steel, { mat: 'metal' }),

    // nose: round lamps, slim grille, bumper, intake, plate
    rbox(1.74, 0.22, 0.18, 0.07, 0, 0.42, 1.9, paintDeep, { mat: 'gloss' }),
    cyl(0.1, 0.1, 0.06, -0.55, 0.8, 1.93, '#ffe9c2', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.1, 0.1, 0.06, 0.55, 0.8, 1.93, '#ffe9c2', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 16),
    box(0.6, 0.1, 0.04, 0, 0.68, 1.945, dark),
    box(1.0, 0.08, 0.04, 0, 0.35, 1.975, dark),
    box(0.44, 0.12, 0.02, 0, 0.53, 1.99, C.white),

    // tail: lamps, bumper, plate, exhaust
    rbox(1.74, 0.22, 0.18, 0.07, 0, 0.42, -1.9, paintDeep, { mat: 'gloss' }),
    rbox(0.12, 0.28, 0.05, 0.02, -0.72, 0.76, -1.955, C.red, { mat: 'emissive' }),
    rbox(0.12, 0.28, 0.05, 0.02, 0.72, 0.76, -1.955, C.red, { mat: 'emissive' }),
    box(0.44, 0.12, 0.02, 0, 0.6, -1.955, C.white),
    cyl(0.04, 0.04, 0.1, -0.42, 0.32, -1.94, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // roof spoiler and antenna
    box(1.52, 0.07, 0.22, 0, 1.36, -1.65, paint, { mat: 'gloss' }),
    rbox(0.05, 0.09, 0.14, 0.01, 0, 1.435, -0.95, dark),
    // wiper arms on the windscreen and hatch glass
    box(0.44, 0.012, 0.014, -0.34, 0.95, 0.845, dark, { mat: 'matte', rot: [-0.5, 0, 0.22] }),
    box(0.44, 0.012, 0.014, 0.34, 0.95, 0.845, dark, { mat: 'matte', rot: [-0.5, 0, -0.22] }),
    box(0.3, 0.012, 0.014, 0.06, 1.2, -1.782, dark, { mat: 'matte', rot: [0.26, 0, -0.25] }),
    // round fog lamps set into the bumper
    cyl(0.05, 0.05, 0.04, -0.6, 0.5, 1.985, '#f3e2bb', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.05, 0.05, 0.04, 0.6, 0.5, 1.985, '#f3e2bb', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 14),
    // fuel filler flap on the rear quarter
    cyl(0.062, 0.062, 0.014, 0.858, 0.72, -1.35, paintDeep, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 14),
    // tailgate release handle above the number plate
    box(0.14, 0.035, 0.02, 0, 0.7, -1.965, dark),
  ],
})
