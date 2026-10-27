import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#eeebe3'
const paintDeep = '#e2ded3'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const chrome = C.steel
const blue = '#6f93b8'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.36, 0.36, 0.26, x, 0.36, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.21, 0.21, 0.27, x, 0.36, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.075, 0.075, 0.276, x, 0.36, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'ambulance',
  name: '救护车',
  category: 'vehicles',
  tags: ['ambulance', 'emergency', 'medical', '救护车', '急救', '医疗', '救援'],
  footprint: [2.0, 5.2],
  height: 2.6,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.82, 1.6),
    ...wheel(0.82, 1.6),
    ...wheel(-0.82, -1.55),
    ...wheel(0.82, -1.55),

    // low body, high rear treatment box and cab shell
    rbox(1.96, 0.62, 4.95, 0.1, 0, 0.9, 0, paint, { mat: 'gloss' }),
    rbox(1.96, 1.55, 3.5, 0.12, 0, 1.55, -0.7, paint, { mat: 'gloss' }),
    rbox(1.94, 1.15, 1.55, 0.14, 0, 1.35, 1.75, paint, { mat: 'gloss' }),
    rbox(1.88, 0.42, 0.72, 0.08, 0, 0.99, 2.15, paintDeep, { mat: 'gloss' }),
    rbox(1.98, 0.08, 3.5, 0.03, 0, 2.365, -0.7, paintDeep, { mat: 'gloss' }),
    rbox(1.94, 0.07, 1.55, 0.03, 0, 1.96, 1.73, paintDeep, { mat: 'gloss' }),

    // windscreen, A-pillars and cab side glazing
    box(1.78, 0.68, 0.04, 0, 1.68, 2.52, dark),
    box(1.72, 0.6, 0.05, 0, 1.68, 2.535, C.glass, { mat: 'glass', rot: [-0.08, 0, 0] }),
    rbox(0.07, 0.62, 0.1, 0.02, -0.86, 1.68, 2.53, paint, { mat: 'gloss', rot: [-0.08, 0, 0] }),
    rbox(0.07, 0.62, 0.1, 0.02, 0.86, 1.68, 2.53, paint, { mat: 'gloss', rot: [-0.08, 0, 0] }),
    box(0.02, 0.48, 0.8, -0.976, 1.68, 1.72, C.glass, { mat: 'glass' }),
    box(0.02, 0.48, 0.8, 0.976, 1.68, 1.72, C.glass, { mat: 'glass' }),

    // cab door seams, handles and boarding steps
    box(0.02, 0.9, 0.025, -0.978, 1.15, 1.05, dark),
    box(0.02, 0.9, 0.025, 0.978, 1.15, 1.05, dark),
    box(0.03, 0.05, 0.15, -0.99, 1.28, 1.35, chrome, { mat: 'metal' }),
    box(0.03, 0.05, 0.15, 0.99, 1.28, 1.35, chrome, { mat: 'metal' }),
    box(0.22, 0.06, 0.5, -0.9, 0.5, 1.7, dark, { mat: 'metal' }),
    box(0.22, 0.06, 0.5, 0.9, 0.5, 1.7, dark, { mat: 'metal' }),

    // red livery stripes along the flanks and rockers
    box(0.02, 0.22, 4.55, -0.985, 1.32, -0.1, C.red, { mat: 'gloss' }),
    box(0.02, 0.22, 4.55, 0.985, 1.32, -0.1, C.red, { mat: 'gloss' }),
    box(0.02, 0.12, 4.62, -0.985, 0.68, -0.05, C.red, { mat: 'gloss' }),
    box(0.02, 0.12, 4.62, 0.985, 0.68, -0.05, C.red, { mat: 'gloss' }),

    // medical crosses on both rear flanks
    box(0.02, 0.36, 0.12, -0.992, 1.85, -1.45, C.red, { mat: 'gloss' }),
    box(0.02, 0.12, 0.36, -0.992, 1.85, -1.45, C.red, { mat: 'gloss' }),
    box(0.02, 0.36, 0.12, 0.992, 1.85, -1.45, C.red, { mat: 'gloss' }),
    box(0.02, 0.12, 0.36, 0.992, 1.85, -1.45, C.red, { mat: 'gloss' }),

    // nose: grille, lamps, bumper, hood stripe and plate
    rbox(1.2, 0.27, 0.06, 0.03, 0, 1.01, 2.535, dark, { mat: 'metal' }),
    rbox(0.34, 0.16, 0.05, 0.02, -0.7, 1.0, 2.545, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.34, 0.16, 0.05, 0.02, 0.7, 1.0, 2.545, '#ffe9c2', { mat: 'emissive' }),
    rbox(2.0, 0.34, 0.2, 0.07, 0, 0.62, 2.49, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.65, 2.59, C.white),
    box(0.9, 0.14, 0.02, 0, 1.21, 2.45, C.red, { mat: 'gloss' }),

    // rear treatment compartment: two doors with windows, handles, bumper and lamps
    rbox(0.86, 1.5, 0.05, 0.03, -0.43, 1.62, -2.46, paint, { mat: 'gloss' }),
    rbox(0.86, 1.5, 0.05, 0.03, 0.43, 1.62, -2.46, paintDeep, { mat: 'gloss' }),
    box(0.58, 0.44, 0.02, -0.43, 1.9, -2.495, C.glass, { mat: 'glass' }),
    box(0.58, 0.44, 0.02, 0.43, 1.9, -2.495, C.glass, { mat: 'glass' }),
    box(0.03, 0.32, 0.03, -0.08, 1.5, -2.505, chrome, { mat: 'metal' }),
    box(0.03, 0.32, 0.03, 0.08, 1.5, -2.505, chrome, { mat: 'metal' }),
    rbox(1.98, 0.24, 0.2, 0.06, 0, 0.55, -2.48, bumper, { mat: 'metal' }),
    box(1.2, 0.1, 0.2, 0, 0.39, -2.42, dark, { mat: 'metal' }),
    rbox(0.18, 0.4, 0.05, 0.02, -0.82, 1.0, -2.49, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.4, 0.05, 0.02, 0.82, 1.0, -2.49, C.red, { mat: 'emissive' }),
    box(0.46, 0.13, 0.02, 0, 0.64, -2.585, C.white),

    // roof beacon bar with blue flashers
    box(1.2, 0.1, 0.32, 0, 2.45, 0.85, dark),
    box(1.06, 0.1, 0.26, 0, 2.55, 0.85, blue, { mat: 'emissive' }),
    rbox(0.09, 0.1, 0.3, 0.02, -0.56, 2.55, 0.85, dark),
    rbox(0.09, 0.1, 0.3, 0.02, 0.56, 2.55, 0.85, dark),

    // mirror arms and heads
    box(0.06, 0.04, 0.04, -0.955, 1.82, 2.0, dark, { mat: 'metal' }),
    box(0.06, 0.04, 0.04, 0.955, 1.82, 2.0, dark, { mat: 'metal' }),
    rbox(0.03, 0.26, 0.16, 0.02, -0.985, 1.76, 2.03, dark),
    rbox(0.03, 0.26, 0.16, 0.02, 0.985, 1.76, 2.03, dark),
  ],
})
