import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = C.sage
const clad = '#3d423d'
const tire = '#22262a'
const trim = '#6b736e'
const dark = '#2a2e2b'
const tint = '#46545a'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.37, 0.37, 0.25, x, 0.37, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.225, 0.225, 0.258, x, 0.37, z, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
]

export default defineModel({
  id: 'car-suv',
  name: '城市SUV',
  category: 'vehicles',
  tags: ['car', 'suv', '越野车', '车辆', '家庭'],
  footprint: [1.95, 4.7],
  height: 1.78,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.84, 1.48),
    ...wheel(0.84, 1.48),
    ...wheel(-0.84, -1.48),
    ...wheel(0.84, -1.48),

    // tall body, dark lower cladding and hood
    rbox(1.84, 0.72, 4.5, 0.16, 0, 0.73, 0, paint, { mat: 'gloss' }),
    rbox(1.86, 0.22, 4.46, 0.05, 0, 0.36, 0, clad),
    rbox(1.74, 0.15, 1.12, 0.07, 0, 1.1, 1.6, paint, { mat: 'gloss' }),
    box(1.54, 0.36, 3.0, 0, 1.08, -0.45, '#2c2f2d'),

    // glasshouse, roof and raked glazing
    rbox(1.66, 0.52, 3.15, 0.1, 0, 1.37, -0.45, tint, { mat: 'glass' }),
    rbox(1.74, 0.09, 3.06, 0.045, 0, 1.665, -0.5, paint, { mat: 'gloss' }),
    rbox(1.58, 0.54, 0.05, 0.02, 0, 1.38, 1.15, tint, { mat: 'glass', rot: [-0.42, 0, 0] }),
    rbox(1.56, 0.6, 0.05, 0.02, 0, 1.36, -2.05, tint, { mat: 'glass', rot: [0.14, 0, 0] }),

    // A / B / C / D pillars
    rbox(0.08, 0.52, 0.16, 0.03, -0.835, 1.37, 1.06, paint, { mat: 'gloss' }),
    rbox(0.08, 0.52, 0.16, 0.03, 0.835, 1.37, 1.06, paint, { mat: 'gloss' }),
    rbox(0.075, 0.5, 0.1, 0.02, -0.835, 1.36, 0.1, dark),
    rbox(0.075, 0.5, 0.1, 0.02, 0.835, 1.36, 0.1, dark),
    rbox(0.08, 0.5, 0.12, 0.03, -0.835, 1.36, -0.95, paint, { mat: 'gloss' }),
    rbox(0.08, 0.5, 0.12, 0.03, 0.835, 1.36, -0.95, paint, { mat: 'gloss' }),
    rbox(0.1, 0.5, 0.3, 0.04, -0.82, 1.36, -1.95, paint, { mat: 'gloss' }),
    rbox(0.1, 0.5, 0.3, 0.04, 0.82, 1.36, -1.95, paint, { mat: 'gloss' }),

    // roof rails, mirrors, handles
    box(0.06, 0.07, 3.0, -0.76, 1.745, -0.48, trim, { mat: 'metal' }),
    box(0.06, 0.07, 3.0, 0.76, 1.745, -0.48, trim, { mat: 'metal' }),
    rbox(0.13, 0.1, 0.12, 0.03, -0.9, 1.18, 0.8, clad),
    rbox(0.13, 0.1, 0.12, 0.03, 0.9, 1.18, 0.8, clad),
    box(0.03, 0.05, 0.17, -0.925, 1.0, 0.45, trim, { mat: 'metal' }),
    box(0.03, 0.05, 0.17, 0.925, 1.0, 0.45, trim, { mat: 'metal' }),
    box(0.03, 0.05, 0.17, -0.925, 1.0, -0.45, trim, { mat: 'metal' }),
    box(0.03, 0.05, 0.17, 0.925, 1.0, -0.45, trim, { mat: 'metal' }),

    // wheel arch flares
    rbox(0.07, 0.34, 0.92, 0.04, -0.925, 0.66, 1.48, clad),
    rbox(0.07, 0.34, 0.92, 0.04, 0.925, 0.66, 1.48, clad),
    rbox(0.07, 0.34, 0.92, 0.04, -0.925, 0.66, -1.48, clad),
    rbox(0.07, 0.34, 0.92, 0.04, 0.925, 0.66, -1.48, clad),

    // front: bumper, skid plate, grille, lamps, plate
    rbox(1.86, 0.34, 0.22, 0.1, 0, 0.5, 2.2, clad),
    box(1.0, 0.1, 0.12, 0, 0.36, 2.27, C.steel, { mat: 'metal' }),
    rbox(1.3, 0.28, 0.06, 0.04, 0, 0.88, 2.245, '#2a2d2c', { mat: 'metal' }),
    box(1.24, 0.03, 0.03, 0, 0.88, 2.27, trim, { mat: 'metal' }),
    rbox(0.44, 0.12, 0.06, 0.02, -0.64, 1.01, 2.245, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.44, 0.12, 0.06, 0.02, 0.64, 1.01, 2.245, '#ffe9c2', { mat: 'emissive' }),
    box(0.44, 0.13, 0.02, 0, 0.55, 2.315, C.white),

    // rear: bumper, lamps, plate, spoiler
    rbox(1.86, 0.32, 0.2, 0.09, 0, 0.5, -2.2, clad),
    rbox(0.18, 0.32, 0.06, 0.03, -0.8, 0.93, -2.24, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.32, 0.06, 0.03, 0.8, 0.93, -2.24, C.red, { mat: 'emissive' }),
    box(0.44, 0.13, 0.02, 0, 0.56, -2.31, C.white),
    box(1.66, 0.06, 0.22, 0, 1.72, -1.95, paint, { mat: 'gloss' }),
    // shark fin antenna
    rbox(0.06, 0.1, 0.18, 0.02, 0, 1.73, -1.7, dark),
  ],
})
