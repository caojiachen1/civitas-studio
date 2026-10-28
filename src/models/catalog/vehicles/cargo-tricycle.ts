import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#7a8b76'
const paintDeep = '#68765f'
const wood = '#8a6f4f'
const canvas = '#b9b09a'
const tire = '#24272b'
const dark = '#2f3438'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (x: number, z: number, width: number) => [
  cyl(0.27, 0.27, width, x, 0.27, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.16, 0.16, width + 0.01, x, 0.27, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
  cyl(0.055, 0.055, width + 0.016, x, 0.27, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
]

export default defineModel({
  id: 'cargo-tricycle',
  name: '货运三轮车',
  category: 'vehicles',
  tags: ['tricycle', 'cargo', 'three-wheeler', '三轮车', '货运', '载货', '摆摊'],
  footprint: [1.1, 2.4],
  height: 1.5,
  placement: 'any',
  parts: [
    // single front wheel, two rear wheels
    ...wheel(0, 0.82, 0.09),
    ...wheel(-0.4, -0.62, 0.12),
    ...wheel(0.4, -0.62, 0.12),

    // spine frame, rear axle and cross member
    box(0.08, 0.08, 1.5, 0, 0.45, 0.05, dark, { mat: 'metal' }),
    cyl(0.025, 0.025, 0.9, 0, 0.27, -0.62, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    box(0.8, 0.16, 0.06, 0, 0.36, -0.62, dark, { mat: 'metal' }),

    // timber cargo bed: floor, side boards, headboard, tailgate and steel corner posts
    box(0.96, 0.05, 1.05, 0, 0.66, -0.62, wood, { mat: 'wood' }),
    box(0.04, 0.32, 1.05, -0.48, 0.82, -0.62, wood, { mat: 'wood' }),
    box(0.04, 0.32, 1.05, 0.48, 0.82, -0.62, wood, { mat: 'wood' }),
    box(0.96, 0.36, 0.04, 0, 0.84, -0.1, wood, { mat: 'wood' }),
    box(0.96, 0.3, 0.04, 0, 0.82, -1.14, wood, { mat: 'wood' }),
    box(0.04, 0.42, 0.04, -0.46, 0.87, -0.12, dark, { mat: 'metal' }),
    box(0.04, 0.42, 0.04, 0.46, 0.87, -0.12, dark, { mat: 'metal' }),
    box(0.04, 0.42, 0.04, -0.46, 0.87, -1.12, dark, { mat: 'metal' }),
    box(0.04, 0.42, 0.04, 0.46, 0.87, -1.12, dark, { mat: 'metal' }),
    box(0.04, 0.05, 0.9, -0.49, 0.7, -0.62, chrome, { mat: 'metal' }),
    box(0.04, 0.05, 0.9, 0.49, 0.7, -0.62, chrome, { mat: 'metal' }),

    // saddle: post, base, cushion and backrest
    box(0.1, 0.2, 0.1, 0, 0.52, 0.2, dark, { mat: 'metal' }),
    box(0.4, 0.06, 0.32, 0, 0.6, 0.2, dark, { mat: 'metal' }),
    rbox(0.4, 0.1, 0.36, 0.04, 0, 0.68, 0.18, C.leather, { mat: 'leather' }),
    rbox(0.4, 0.32, 0.08, 0.03, 0, 0.84, 0.0, C.leather, { mat: 'leather' }),

    // steering column, handlebar, grips and brake levers
    cyl(0.025, 0.025, 0.55, 0, 0.75, 0.68, paint, { mat: 'metal', rot: [-0.15, 0, 0] }, 12),
    cyl(0.015, 0.015, 0.62, 0, 1.02, 0.63, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.02, 0.02, 0.11, -0.28, 1.02, 0.63, dark, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.02, 0.02, 0.11, 0.28, 1.02, 0.63, dark, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.09, 0.012, 0.016, -0.2, 1.035, 0.67, chrome, { mat: 'metal', rot: [0, 0.15, 0] }),
    box(0.09, 0.012, 0.016, 0.2, 1.035, 0.67, chrome, { mat: 'metal', rot: [0, -0.15, 0] }),
    box(0.1, 0.035, 0.08, 0.13, 1.03, 0.6, dark, { mat: 'metal' }),
    cyl(0.01, 0.01, 0.15, -0.22, 1.09, 0.62, dark, { mat: 'metal', rot: [0, 0, 0.3] }, 8),
    cyl(0.01, 0.01, 0.15, 0.22, 1.09, 0.62, dark, { mat: 'metal', rot: [0, 0, -0.3] }, 8),
    rbox(0.12, 0.07, 0.03, 0.02, -0.26, 1.18, 0.62, dark),
    rbox(0.12, 0.07, 0.03, 0.02, 0.26, 1.18, 0.62, dark),

    // front fork, crown, mudguard and head lamp
    cyl(0.012, 0.012, 0.5, -0.05, 0.3, 0.8, paint, { mat: 'metal', rot: [-0.12, 0, 0] }, 8),
    cyl(0.012, 0.012, 0.5, 0.05, 0.3, 0.8, paint, { mat: 'metal', rot: [-0.12, 0, 0] }, 8),
    box(0.14, 0.045, 0.08, 0, 0.53, 0.78, dark, { mat: 'metal' }),
    rbox(0.12, 0.02, 0.4, 0.03, 0, 0.56, 0.82, paintDeep, { mat: 'gloss' }),
    rbox(0.055, 0.055, 0.05, 0.015, 0, 0.95, 0.7, dark),
    rbox(0.045, 0.045, 0.012, 0.01, 0, 0.95, 0.728, '#ffe9c2', { mat: 'emissive' }),

    // canopy frame and fabric roof
    box(0.03, 0.58, 0.03, -0.44, 1.15, -0.16, dark, { mat: 'metal' }),
    box(0.03, 0.58, 0.03, 0.44, 1.15, -0.16, dark, { mat: 'metal' }),
    box(0.03, 0.58, 0.03, -0.44, 1.15, -1.06, dark, { mat: 'metal' }),
    box(0.03, 0.58, 0.03, 0.44, 1.15, -1.06, dark, { mat: 'metal' }),
    rbox(1.0, 0.05, 1.15, 0.04, 0, 1.455, -0.6, canvas, { mat: 'fabric' }),

    // tail lamps, plate, battery box, motor and side stand
    rbox(0.14, 0.1, 0.04, 0.02, -0.34, 0.72, -1.17, C.red, { mat: 'emissive' }),
    rbox(0.14, 0.1, 0.04, 0.02, 0.34, 0.72, -1.17, C.red, { mat: 'emissive' }),
    box(0.3, 0.1, 0.02, 0, 0.68, -1.18, C.white),
    box(0.4, 0.3, 0.32, 0, 0.49, -0.3, dark, { mat: 'metal' }),
    cyl(0.09, 0.09, 0.16, 0, 0.27, -0.62, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    cyl(0.011, 0.011, 0.45, -0.12, 0.21, 0.28, dark, { mat: 'metal', rot: [0, 0, -0.4] }, 8),
    // canvas load straps with steel buckles
    box(0.98, 0.018, 0.04, 0, 0.99, -0.35, '#8a7a5c', { mat: 'fabric' }),
    box(0.06, 0.03, 0.055, 0.3, 0.995, -0.35, C.steel, { mat: 'metal' }),
    box(0.98, 0.018, 0.04, 0, 0.99, -0.9, '#8a7a5c', { mat: 'fabric' }),
    box(0.06, 0.03, 0.055, 0.3, 0.995, -0.9, C.steel, { mat: 'metal' }),
    // tailgate hinges
    box(0.07, 0.04, 0.022, -0.35, 0.68, -1.168, chrome, { mat: 'metal' }),
    box(0.07, 0.04, 0.022, 0.35, 0.68, -1.168, chrome, { mat: 'metal' }),
    // rear-view mirrors on both bar ends
    cyl(0.008, 0.008, 0.16, -0.33, 1.09, 0.63, chrome, { mat: 'metal', rot: [0, 0, 0.4] }, 8),
    rbox(0.1, 0.07, 0.02, 0.02, -0.37, 1.16, 0.63, dark),
    cyl(0.008, 0.008, 0.16, 0.33, 1.09, 0.63, chrome, { mat: 'metal', rot: [0, 0, -0.4] }, 8),
    rbox(0.1, 0.07, 0.02, 0.02, 0.37, 1.16, 0.63, dark),
  ],
})
