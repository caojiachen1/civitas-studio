import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const paint = C.red
const paintDeep = '#94463c'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const chrome = C.steel
const blue = '#6f93b8'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.45, 0.45, 0.32, x, 0.45, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.27, 0.27, 0.33, x, 0.45, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
]

export default defineModel({
  id: 'fire-engine',
  name: '消防车',
  category: 'vehicles',
  tags: ['fire', 'engine', 'emergency', 'rescue', '消防车', '救火', '云梯', '救援'],
  footprint: [2.44, 7.67],
  height: 3.2,
  placement: 'on-road',
  parts: [
    // three axles: single front, tandem rear
    ...wheel(-0.9, 2.55),
    ...wheel(0.9, 2.55),
    ...wheel(-0.9, -1.75),
    ...wheel(0.9, -1.75),
    ...wheel(-0.9, -2.95),
    ...wheel(0.9, -2.95),

    // chassis rail, tall equipment body and roof cap
    box(2.1, 0.22, 7.0, 0, 0.66, 0.1, dark, { mat: 'metal' }),
    rbox(2.34, 2.0, 5.3, 0.1, 0, 1.75, -1.05, paint, { mat: 'gloss' }),
    rbox(2.36, 0.08, 5.2, 0.03, 0, 2.79, -1.05, paintDeep, { mat: 'gloss' }),

    // cab, roof cap, windscreen and A-pillars
    rbox(2.3, 1.55, 2.1, 0.16, 0, 1.68, 2.55, paint, { mat: 'gloss' }),
    rbox(2.26, 0.1, 2.0, 0.05, 0, 2.5, 2.55, paintDeep, { mat: 'gloss' }),
    box(2.1, 0.9, 0.04, 0, 2.02, 3.57, dark),
    box(2.04, 0.82, 0.05, 0, 2.02, 3.585, C.glass, { mat: 'glass', rot: [-0.18, 0, 0] }),
    rbox(0.08, 0.84, 0.1, 0.02, -1.07, 2.02, 3.58, paint, { mat: 'gloss', rot: [-0.18, 0, 0] }),
    rbox(0.08, 0.84, 0.1, 0.02, 1.07, 2.02, 3.58, paint, { mat: 'gloss', rot: [-0.18, 0, 0] }),

    // cab side glazing, door seams, handles and steps
    box(0.02, 0.58, 0.86, -1.156, 2.04, 2.55, C.glass, { mat: 'glass' }),
    box(0.02, 0.58, 0.86, 1.156, 2.04, 2.55, C.glass, { mat: 'glass' }),
    box(0.02, 1.0, 0.03, -1.158, 1.55, 1.75, dark),
    box(0.02, 1.0, 0.03, 1.158, 1.55, 1.75, dark),
    box(0.03, 0.05, 0.16, -1.17, 1.75, 2.1, chrome, { mat: 'metal' }),
    box(0.03, 0.05, 0.16, 1.17, 1.75, 2.1, chrome, { mat: 'metal' }),
    box(0.26, 0.06, 0.55, -1.05, 0.56, 2.55, dark, { mat: 'metal' }),
    box(0.26, 0.06, 0.55, 1.05, 0.56, 2.55, dark, { mat: 'metal' }),

    // mirror arms and heads
    box(0.12, 0.04, 0.04, -1.12, 2.2, 3.3, dark, { mat: 'metal' }),
    box(0.12, 0.04, 0.04, 1.12, 2.2, 3.3, dark, { mat: 'metal' }),
    rbox(0.05, 0.3, 0.18, 0.02, -1.17, 2.08, 3.33, dark),
    rbox(0.05, 0.3, 0.18, 0.02, 1.17, 2.08, 3.33, dark),

    // nose: grille, headlights, bumper and plate
    rbox(1.15, 0.34, 0.06, 0.03, 0, 1.15, 3.61, dark, { mat: 'metal' }),
    rbox(0.4, 0.16, 0.05, 0.02, -0.8, 1.15, 3.62, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.4, 0.16, 0.05, 0.02, 0.8, 1.15, 3.62, '#ffe9c2', { mat: 'emissive' }),
    rbox(2.34, 0.36, 0.22, 0.08, 0, 0.62, 3.68, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.7, 3.795, C.white),

    // white reflective flanks, equipment lockers and handles
    box(0.02, 0.16, 5.0, -1.181, 1.2, -1.05, C.white, { mat: 'gloss' }),
    box(0.02, 0.16, 5.0, 1.181, 1.2, -1.05, C.white, { mat: 'gloss' }),
    box(0.02, 0.5, 1.5, -1.181, 1.9, -1.8, paintDeep, { mat: 'gloss' }),
    box(0.02, 0.5, 1.5, 1.181, 1.9, -1.8, paintDeep, { mat: 'gloss' }),
    box(0.03, 0.03, 0.2, -1.19, 1.9, -1.4, chrome, { mat: 'metal' }),
    box(0.03, 0.03, 0.2, 1.19, 1.9, -1.4, chrome, { mat: 'metal' }),

    // roof ladder: two rails, rungs and two rack posts
    cyl(0.035, 0.035, 4.0, -0.5, 3.15, -1.1, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.035, 0.035, 4.0, 0.5, 3.15, -1.1, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    box(1.0, 0.045, 0.07, 0, 3.15, -2.7, C.graphite, { mat: 'metal' }),
    box(1.0, 0.045, 0.07, 0, 3.15, -1.9, C.graphite, { mat: 'metal' }),
    box(1.0, 0.045, 0.07, 0, 3.15, -1.1, C.graphite, { mat: 'metal' }),
    box(1.0, 0.045, 0.07, 0, 3.15, -0.3, C.graphite, { mat: 'metal' }),
    box(1.0, 0.045, 0.07, 0, 3.15, 0.5, C.graphite, { mat: 'metal' }),
    box(1.2, 0.34, 0.08, 0, 2.99, -3.0, dark, { mat: 'metal' }),
    box(1.2, 0.34, 0.08, 0, 2.99, 0.8, dark, { mat: 'metal' }),

    // roof beacon bar
    box(1.5, 0.1, 0.34, 0, 2.6, 2.45, dark),
    box(0.7, 0.12, 0.26, -0.36, 2.68, 2.45, C.red, { mat: 'emissive' }),
    box(0.7, 0.12, 0.26, 0.36, 2.68, 2.45, blue, { mat: 'emissive' }),

    // rear: roll-up door, handle, reflective bands, lamps, bumper and plate
    rbox(1.9, 1.7, 0.05, 0.02, 0, 1.55, -3.72, paintDeep, { mat: 'gloss' }),
    box(0.5, 0.05, 0.04, 0, 0.9, -3.75, chrome, { mat: 'metal' }),
    box(1.6, 0.12, 0.02, 0, 1.2, -3.75, C.white, { mat: 'gloss' }),
    box(1.6, 0.08, 0.02, 0, 1.38, -3.75, C.white, { mat: 'gloss' }),
    rbox(0.16, 0.46, 0.05, 0.02, -0.95, 0.95, -3.73, C.red, { mat: 'emissive' }),
    rbox(0.16, 0.46, 0.05, 0.02, 0.95, 0.95, -3.73, C.red, { mat: 'emissive' }),
    rbox(2.34, 0.26, 0.2, 0.06, 0, 0.58, -3.68, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.62, -3.79, C.white),

    // wiper arms at the base of the screen
    box(0.62, 0.014, 0.016, -0.42, 1.8, 3.66, dark, { mat: 'matte', rot: [-0.18, 0, 0.16] }),
    box(0.62, 0.014, 0.016, 0.42, 1.8, 3.66, dark, { mat: 'matte', rot: [-0.18, 0, -0.16] }),
    // pump panel gauges on the left flank
    cyl(0.055, 0.055, 0.03, -1.19, 1.95, -0.55, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.043, 0.043, 0.032, -1.212, 1.95, -0.55, C.cream, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 16),
    box(0.004, 0.03, 0.006, -1.231, 1.96, -0.55, C.red, { mat: 'matte' }),
    cyl(0.055, 0.055, 0.03, -1.19, 1.95, -0.78, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.043, 0.043, 0.032, -1.212, 1.95, -0.78, C.cream, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 16),
    box(0.004, 0.03, 0.006, -1.231, 1.96, -0.78, C.red, { mat: 'matte' }),
    // red pump valve handwheels
    torus(0.07, 0.012, -1.205, 1.72, -1.0, C.red, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    cyl(0.014, 0.014, 0.06, -1.195, 1.72, -1.0, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    torus(0.07, 0.012, -1.205, 1.72, -1.25, C.red, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    cyl(0.014, 0.014, 0.06, -1.195, 1.72, -1.25, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    // front suction inlet on the bumper
    cyl(0.09, 0.09, 0.12, 0.55, 0.62, 3.79, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.07, 0.07, 0.014, 0.55, 0.62, 3.855, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
  ],
})
