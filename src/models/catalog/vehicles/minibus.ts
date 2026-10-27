import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#e6e2d6'
const paintDeep = '#d8d4c7'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.34, 0.34, 0.24, x, 0.34, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.2, 0.2, 0.25, x, 0.34, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.07, 0.07, 0.256, x, 0.34, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'minibus',
  name: '小巴',
  category: 'vehicles',
  tags: ['minibus', 'shuttle', 'bus', 'transit', '小巴', '中巴', '接驳', '公共交通'],
  footprint: [2.0, 5.0],
  height: 2.4,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.82, 1.55),
    ...wheel(0.82, 1.55),
    ...wheel(-0.82, -1.45),
    ...wheel(0.82, -1.45),

    // body shell, skirt, roof cap, dark interior and livery band
    rbox(1.96, 1.75, 4.8, 0.2, 0, 1.37, 0, paint, { mat: 'gloss' }),
    rbox(1.9, 0.24, 4.6, 0.06, 0, 0.56, 0, bumper, { mat: 'metal' }),
    rbox(1.94, 0.08, 4.6, 0.05, 0, 2.28, 0, paintDeep, { mat: 'gloss' }),
    box(1.75, 1.5, 4.3, 0, 1.45, 0, '#2a2d2f'),
    box(1.98, 0.16, 4.6, 0, 1.06, 0, C.water, { mat: 'gloss' }),

    // wide side glazing with pillars
    box(1.98, 0.74, 4.25, 0, 1.88, -0.05, C.glass, { mat: 'glass' }),
    box(0.04, 0.8, 0.12, -0.993, 1.88, 2.15, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, 0.993, 1.88, 2.15, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, -0.993, 1.88, 0.9, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, 0.993, 1.88, 0.9, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, -0.993, 1.88, -0.85, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, 0.993, 1.88, -0.85, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, -0.993, 1.88, -2.15, paint, { mat: 'gloss' }),
    box(0.04, 0.8, 0.12, 0.993, 1.88, -2.15, paint, { mat: 'gloss' }),

    // kerb-side sliding door: frame, glazing, lower panel, handle and rail
    box(0.03, 1.68, 1.1, 0.99, 1.28, 0, dark),
    box(0.02, 0.74, 1.0, 1.003, 1.9, 0, C.glass, { mat: 'glass' }),
    box(0.02, 0.7, 1.0, 1.003, 1.02, 0, paintDeep, { mat: 'gloss' }),
    box(0.03, 0.05, 0.14, 0.99, 1.38, 0.4, chrome, { mat: 'metal' }),
    box(0.03, 0.04, 1.6, 0.995, 2.1, 0.5, dark, { mat: 'metal' }),

    // windscreen, A-pillars, route board and destination lamps
    box(1.84, 0.95, 0.04, 0, 1.82, 2.4, dark),
    box(1.78, 0.88, 0.03, 0, 1.82, 2.415, C.glass, { mat: 'glass' }),
    rbox(0.07, 0.9, 0.1, 0.02, -0.9, 1.82, 2.4, paint, { mat: 'gloss' }),
    rbox(0.07, 0.9, 0.1, 0.02, 0.9, 1.82, 2.4, paint, { mat: 'gloss' }),
    box(1.2, 0.2, 0.05, 0, 2.25, 2.41, '#23272c'),
    box(1.06, 0.12, 0.02, 0, 2.25, 2.44, '#e0b46b', { mat: 'emissive' }),

    // nose: grille, head lamps, bumper and plate
    rbox(1.0, 0.22, 0.06, 0.03, 0, 0.98, 2.41, dark, { mat: 'metal' }),
    rbox(0.34, 0.16, 0.05, 0.02, -0.72, 1.0, 2.42, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.34, 0.16, 0.05, 0.02, 0.72, 1.0, 2.42, '#ffe9c2', { mat: 'emissive' }),
    rbox(2.0, 0.34, 0.2, 0.07, 0, 0.58, 2.395, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.62, 2.495, C.white),

    // front door seams and handles
    box(0.02, 1.1, 0.025, -0.985, 1.25, 1.3, dark),
    box(0.02, 1.1, 0.025, 0.985, 1.25, 1.3, dark),
    box(0.03, 0.05, 0.15, -0.994, 1.45, 1.62, chrome, { mat: 'metal' }),
    box(0.03, 0.05, 0.15, 0.994, 1.45, 1.62, chrome, { mat: 'metal' }),

    // rear window, lamps, bumper and plate
    box(1.5, 0.6, 0.05, 0, 1.95, -2.4, C.glass, { mat: 'glass' }),
    rbox(0.16, 0.4, 0.05, 0.02, -0.82, 1.0, -2.42, C.red, { mat: 'emissive' }),
    rbox(0.16, 0.4, 0.05, 0.02, 0.82, 1.0, -2.42, C.red, { mat: 'emissive' }),
    rbox(2.0, 0.34, 0.2, 0.07, 0, 0.58, -2.395, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.62, -2.495, C.white),

    // mirror arms and heads
    box(0.06, 0.04, 0.04, -0.98, 2.05, 2.0, dark, { mat: 'metal' }),
    box(0.06, 0.04, 0.04, 0.98, 2.05, 2.0, dark, { mat: 'metal' }),
    rbox(0.04, 0.28, 0.18, 0.02, -0.985, 1.93, 2.03, dark),
    rbox(0.04, 0.28, 0.18, 0.02, 0.985, 1.93, 2.03, dark),

    // roof air-conditioning pod and vent
    rbox(1.1, 0.14, 1.4, 0.04, 0, 2.33, -0.5, paintDeep, { mat: 'gloss' }),
    rbox(0.5, 0.06, 0.5, 0.02, 0, 2.31, 1.2, '#d3cfc4', { mat: 'gloss' }),
  ],
})
