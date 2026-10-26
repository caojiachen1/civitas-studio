import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#7c8871'
const paintDeep = '#6b7564'
const tire = '#24272b'
const dark = '#2f3538'
const trim = C.graphite
const chrome = C.steel
const tint = '#343e43'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.38, 0.38, 0.27, x, 0.38, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.225, 0.225, 0.278, x, 0.38, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
]

export default defineModel({
  id: 'pickup-truck',
  name: '皮卡',
  category: 'vehicles',
  tags: ['pickup', 'truck', 'utility', '皮卡', '货车', '工具车', '载货'],
  footprint: [1.95, 5.3],
  height: 1.9,
  placement: 'on-road',
  parts: [
    // four wheels: front axle +Z
    ...wheel(-0.82, 1.62),
    ...wheel(0.82, 1.62),
    ...wheel(-0.82, -1.62),
    ...wheel(0.82, -1.62),

    // ladder chassis, painted lower body and sill
    rbox(1.8, 0.3, 4.9, 0.05, 0, 0.55, 0, trim, { mat: 'metal' }),
    rbox(1.88, 0.3, 4.8, 0.08, 0, 0.73, -0.05, paint, { mat: 'gloss' }),

    // bonnet with a raised centre crease
    rbox(1.86, 0.3, 1.15, 0.1, 0, 1.09, 1.9, paint, { mat: 'gloss' }),
    rbox(1.5, 0.035, 0.95, 0.015, 0, 1.25, 1.9, paintDeep, { mat: 'gloss' }),

    // dark grille with two chrome bars
    rbox(1.26, 0.36, 0.06, 0.03, 0, 0.92, 2.49, dark, { mat: 'metal' }),
    box(1.2, 0.025, 0.02, 0, 0.98, 2.525, chrome, { mat: 'metal' }),
    box(1.2, 0.025, 0.02, 0, 0.86, 2.525, chrome, { mat: 'metal' }),

    // front bumper, skid plate, headlamps and plate
    rbox(1.94, 0.28, 0.24, 0.08, 0, 0.62, 2.53, trim, { mat: 'metal' }),
    box(0.78, 0.1, 0.05, 0, 0.48, 2.62, chrome, { mat: 'metal' }),
    rbox(0.4, 0.15, 0.06, 0.03, -0.62, 1.14, 2.48, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.4, 0.15, 0.06, 0.03, 0.62, 1.14, 2.48, '#ffe9c2', { mat: 'emissive' }),
    box(0.44, 0.12, 0.02, 0, 0.6, 2.64, C.white),

    // double-cab lower body and tinted glasshouse
    rbox(1.88, 0.72, 2.35, 0.1, 0, 1.22, 0.45, paint, { mat: 'gloss' }),
    rbox(1.7, 0.5, 1.95, 0.08, 0, 1.6, 0.42, tint, { mat: 'glass' }),
    rbox(1.74, 0.1, 1.9, 0.05, 0, 1.85, 0.42, paint, { mat: 'gloss' }),

    // raked windscreen and pillars
    rbox(1.58, 0.54, 0.05, 0.02, 0, 1.59, 1.46, tint, { mat: 'glass', rot: [-0.42, 0, 0] }),
    rbox(0.08, 0.56, 0.1, 0.02, -0.79, 1.58, 1.45, paint, { mat: 'gloss', rot: [-0.42, 0, 0] }),
    rbox(0.08, 0.56, 0.1, 0.02, 0.79, 1.58, 1.45, paint, { mat: 'gloss', rot: [-0.42, 0, 0] }),
    rbox(0.06, 0.52, 0.08, 0.02, -0.845, 1.6, 0.55, dark),
    rbox(0.06, 0.52, 0.08, 0.02, 0.845, 1.6, 0.55, dark),
    rbox(0.1, 0.56, 0.3, 0.03, -0.8, 1.58, -0.47, paint, { mat: 'gloss' }),
    rbox(0.1, 0.56, 0.3, 0.03, 0.8, 1.58, -0.47, paint, { mat: 'gloss' }),

    // door handles, mirror arms and mirror heads
    box(0.03, 0.045, 0.16, -0.945, 1.46, 1.0, trim, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 0.945, 1.46, 1.0, trim, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, -0.945, 1.46, 0.05, trim, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 0.945, 1.46, 0.05, trim, { mat: 'metal' }),
    box(0.12, 0.035, 0.05, -0.98, 1.56, 1.34, trim, { mat: 'metal' }),
    box(0.12, 0.035, 0.05, 0.98, 1.56, 1.34, trim, { mat: 'metal' }),
    rbox(0.06, 0.2, 0.14, 0.02, -1.02, 1.52, 1.33, paint, { mat: 'gloss' }),
    rbox(0.06, 0.2, 0.14, 0.02, 1.02, 1.52, 1.33, paint, { mat: 'gloss' }),

    // running boards
    box(0.1, 0.06, 1.55, -0.96, 0.62, 0.55, trim, { mat: 'metal' }),
    box(0.1, 0.06, 1.55, 0.96, 0.62, 0.55, trim, { mat: 'metal' }),

    // open cargo bed: floor, sides, headboard and tailgate
    box(1.72, 0.06, 2.02, 0, 0.86, -1.61, trim, { mat: 'metal' }),
    rbox(0.1, 0.5, 2.02, 0.025, -0.89, 0.9, -1.63, paint, { mat: 'gloss' }),
    rbox(0.1, 0.5, 2.02, 0.025, 0.89, 0.9, -1.63, paint, { mat: 'gloss' }),
    rbox(1.72, 0.5, 0.1, 0.02, 0, 0.9, -0.67, paint, { mat: 'gloss' }),
    rbox(1.72, 0.5, 0.09, 0.025, 0, 0.9, -2.605, paint, { mat: 'gloss' }),
    box(1.74, 0.025, 0.12, 0, 1.16, -2.605, chrome, { mat: 'metal' }),

    // bed rail caps and tubular bed guard
    rbox(0.13, 0.035, 2.05, 0.012, -0.89, 1.1675, -1.62, trim, { mat: 'metal' }),
    rbox(0.13, 0.035, 2.05, 0.012, 0.89, 1.1675, -1.62, trim, { mat: 'metal' }),
    cyl(0.02, 0.02, 1.9, -0.8, 1.36, -1.63, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.02, 0.02, 1.9, 0.8, 1.36, -1.63, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.018, 0.018, 0.2, -0.8, 1.27, -0.75, chrome, { mat: 'metal' }, 10),
    cyl(0.018, 0.018, 0.2, 0.8, 1.27, -0.75, chrome, { mat: 'metal' }, 10),
    cyl(0.018, 0.018, 0.2, -0.8, 1.27, -2.5, chrome, { mat: 'metal' }, 10),
    cyl(0.018, 0.018, 0.2, 0.8, 1.27, -2.5, chrome, { mat: 'metal' }, 10),

    // rear bumper, tail lamps, plate and exhaust
    rbox(1.94, 0.26, 0.2, 0.07, 0, 0.58, -2.53, trim, { mat: 'metal' }),
    rbox(0.16, 0.34, 0.06, 0.02, -0.82, 0.98, -2.62, C.red, { mat: 'emissive' }),
    rbox(0.16, 0.34, 0.06, 0.02, 0.82, 0.98, -2.62, C.red, { mat: 'emissive' }),
    box(0.44, 0.12, 0.02, 0, 0.7, -2.64, C.white),
    cyl(0.045, 0.045, 0.12, -0.55, 0.32, -2.56, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
  ],
})
