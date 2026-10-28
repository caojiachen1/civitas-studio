import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#e9e5da'
const steel = '#b3b0a6'
const tire = '#232629'
const dark = '#4a4e51'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.36, 0.36, 0.26, x, 0.36, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.205, 0.205, 0.268, x, 0.36, z, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
]

export default defineModel({
  id: 'car-van',
  name: '厢式货车',
  category: 'vehicles',
  tags: ['van', 'truck', '货车', '厢式', '物流', '配送'],
  footprint: [2.0, 5.2],
  height: 2.2,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.86, 1.7),
    ...wheel(0.86, 1.7),
    ...wheel(-0.86, -1.62),
    ...wheel(0.86, -1.62),

    // chassis, cargo box, cab, short nose
    rbox(1.92, 0.45, 5.02, 0.08, 0, 0.54, -0.02, dark),
    rbox(1.96, 1.34, 3.5, 0.1, 0, 1.44, -0.78, paint, { mat: 'gloss' }),
    rbox(1.96, 1.32, 1.3, 0.12, 0, 1.44, 1.62, paint, { mat: 'gloss' }),
    rbox(1.92, 0.4, 0.34, 0.08, 0, 0.98, 2.4, paint, { mat: 'gloss' }),

    // raked windshield framed by A pillars
    rbox(1.8, 0.85, 0.05, 0.02, 0, 1.58, 2.28, C.glass, { mat: 'glass', rot: [-0.3, 0, 0] }),
    rbox(0.07, 0.88, 0.1, 0.02, -0.945, 1.575, 2.28, paint, { mat: 'gloss', rot: [-0.3, 0, 0] }),
    rbox(0.07, 0.88, 0.1, 0.02, 0.945, 1.575, 2.28, paint, { mat: 'gloss', rot: [-0.3, 0, 0] }),

    // cab side glass and tall door seams
    box(0.02, 0.55, 0.85, -0.983, 1.65, 1.62, C.glass, { mat: 'glass' }),
    box(0.02, 0.55, 0.85, 0.983, 1.65, 1.62, C.glass, { mat: 'glass' }),
    box(0.012, 1.28, 0.014, -0.983, 1.35, 1.15, '#bab5a9'),
    box(0.012, 1.28, 0.014, 0.983, 1.35, 1.15, '#bab5a9'),
    box(0.012, 1.28, 0.014, -0.983, 1.35, 0.05, '#bab5a9'),
    box(0.012, 1.28, 0.014, 0.983, 1.35, 0.05, '#bab5a9'),

    // handles, big mirrors, rub strips
    box(0.03, 0.05, 0.16, -0.985, 1.15, 1.5, C.graphite, { mat: 'metal' }),
    box(0.03, 0.05, 0.16, 0.985, 1.15, 1.5, C.graphite, { mat: 'metal' }),
    box(0.03, 0.05, 0.16, -0.985, 1.15, 0.35, C.graphite, { mat: 'metal' }),
    box(0.03, 0.05, 0.16, 0.985, 1.15, 0.35, C.graphite, { mat: 'metal' }),
    rbox(0.12, 0.26, 0.14, 0.03, -0.94, 1.82, 2.02, dark),
    rbox(0.12, 0.26, 0.14, 0.03, 0.94, 1.82, 2.02, dark),
    box(0.02, 0.14, 4.8, -0.985, 0.72, -0.05, dark),
    box(0.02, 0.14, 4.8, 0.985, 0.72, -0.05, dark),

    // roof ribs and small vent
    box(1.8, 0.025, 0.1, 0, 2.122, -2.2, '#d8d3c7'),
    box(1.8, 0.025, 0.1, 0, 2.122, -1.2, '#d8d3c7'),
    box(1.8, 0.025, 0.1, 0, 2.122, -0.2, '#d8d3c7'),
    rbox(0.62, 0.07, 0.62, 0.03, 0, 2.145, -1.0, C.white),
    box(0.46, 0.025, 0.46, 0, 2.185, -1.0, C.steel, { mat: 'metal' }),

    // front: bumper, grille, lamps, plate
    rbox(1.94, 0.32, 0.24, 0.08, 0, 0.48, 2.46, dark),
    rbox(1.02, 0.24, 0.05, 0.03, 0, 0.96, 2.555, '#2b2f32', { mat: 'metal' }),
    box(0.36, 0.16, 0.05, -0.68, 1.03, 2.555, '#ffe9c2', { mat: 'emissive' }),
    box(0.36, 0.16, 0.05, 0.68, 1.03, 2.555, '#ffe9c2', { mat: 'emissive' }),
    box(0.44, 0.12, 0.02, 0, 0.58, 2.585, C.white),

    // rear: bumper, lamps, glazed doors, plate
    rbox(1.94, 0.28, 0.18, 0.07, 0, 0.46, -2.5, dark),
    rbox(0.1, 0.48, 0.05, 0.02, -0.86, 1.15, -2.535, C.red, { mat: 'emissive' }),
    rbox(0.1, 0.48, 0.05, 0.02, 0.86, 1.15, -2.535, C.red, { mat: 'emissive' }),
    box(1.4, 0.62, 0.02, 0, 1.6, -2.54, C.glass, { mat: 'glass' }),
    box(0.44, 0.12, 0.02, 0, 0.9, -2.54, C.white),

    // cargo crate visible through the rear doors
    rbox(0.7, 0.85, 0.55, 0.02, 0.25, 0.98, -2.18, '#b08b5e'),

    // dark wheel arch panels
    rbox(0.04, 0.3, 0.92, 0.02, -0.98, 0.58, 1.7, '#35393c'),
    rbox(0.04, 0.3, 0.92, 0.02, 0.98, 0.58, 1.7, '#35393c'),
    rbox(0.04, 0.3, 0.92, 0.02, -0.98, 0.58, -1.62, '#35393c'),
    rbox(0.04, 0.3, 0.92, 0.02, 0.98, 0.58, -1.62, '#35393c'),

    // wiper arms on the raked windscreen
    box(0.5, 0.012, 0.014, -0.36, 1.22, 2.42, dark, { mat: 'matte', rot: [-0.3, 0, 0.16] }),
    box(0.5, 0.012, 0.014, 0.36, 1.22, 2.42, dark, { mat: 'matte', rot: [-0.3, 0, -0.16] }),
    // sliding-door rails along the cargo flanks
    box(0.02, 0.035, 1.6, -0.987, 1.05, -1.0, C.graphite, { mat: 'metal' }),
    box(0.02, 0.035, 1.6, 0.987, 1.05, -1.0, C.graphite, { mat: 'metal' }),
    // fuel filler flap behind the cab door
    cyl(0.06, 0.06, 0.012, -0.985, 0.9, 0.7, '#bab5a9', { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 14),
    // rear mud flaps
    box(0.3, 0.32, 0.03, -0.86, 0.4, -2.0, dark, { mat: 'matte' }),
    box(0.3, 0.32, 0.03, 0.86, 0.4, -2.0, dark, { mat: 'matte' }),
    // rear loading step under the bumper
    box(0.9, 0.06, 0.2, 0, 0.29, -2.5, dark, { mat: 'metal' }),
    box(0.05, 0.24, 0.05, -0.36, 0.44, -2.46, dark, { mat: 'metal' }),
    box(0.05, 0.24, 0.05, 0.36, 0.44, -2.46, dark, { mat: 'metal' }),
  ],
})
