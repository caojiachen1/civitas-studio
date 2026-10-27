import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#57646a'
const livery = '#8f9c8a'
const tire = '#24272b'
const dark = '#2f3438'
const deck = '#3d4449'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (z: number) => [
  cyl(0.115, 0.115, 0.06, 0, 0.115, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.075, 0.075, 0.062, 0, 0.115, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
  cyl(0.025, 0.025, 0.068, 0, 0.115, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
]

export default defineModel({
  id: 'electric-scooter',
  name: '电动滑板车',
  category: 'vehicles',
  tags: ['scooter', 'e-scooter', 'electric', 'micromobility', '滑板车', '电动', '代步', '共享'],
  footprint: [0.5, 1.2],
  height: 1.15,
  placement: 'any',
  parts: [
    // front and rear wheels, front brake disc
    ...wheel(0.46),
    ...wheel(-0.45),
    cyl(0.05, 0.05, 0.008, 0.035, 0.115, 0.46, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),

    // deck, grip tape, side rails and battery tray
    rbox(0.17, 0.045, 0.58, 0.02, 0, 0.145, -0.02, deck, { mat: 'metal' }),
    box(0.15, 0.008, 0.52, 0, 0.172, -0.02, '#2c3033', { mat: 'matte' }),
    box(0.012, 0.02, 0.54, -0.086, 0.14, -0.02, livery, { mat: 'gloss' }),
    box(0.012, 0.02, 0.54, 0.086, 0.14, -0.02, livery, { mat: 'gloss' }),
    box(0.14, 0.07, 0.34, 0, 0.09, -0.03, dark, { mat: 'metal' }),

    // rear fender, support, tail lamp, swing arms and pivot
    rbox(0.15, 0.02, 0.28, 0.03, 0, 0.235, -0.45, paint, { mat: 'gloss' }),
    box(0.06, 0.1, 0.05, 0, 0.18, -0.34, dark, { mat: 'metal' }),
    box(0.08, 0.03, 0.015, 0, 0.24, -0.588, C.red, { mat: 'emissive' }),
    box(0.02, 0.05, 0.24, -0.045, 0.13, -0.39, dark, { mat: 'metal' }),
    box(0.02, 0.05, 0.24, 0.045, 0.13, -0.39, dark, { mat: 'metal' }),
    cyl(0.03, 0.03, 0.12, 0, 0.13, -0.2, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.05, 0.05, 0.008, 0.033, 0.115, -0.45, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),

    // front fork blades, crown, fender and stays
    cyl(0.012, 0.012, 0.3, -0.035, 0.24, 0.485, paint, { mat: 'metal', rot: [-0.18, 0, 0] }, 8),
    cyl(0.012, 0.012, 0.3, 0.035, 0.24, 0.485, paint, { mat: 'metal', rot: [-0.18, 0, 0] }, 8),
    box(0.09, 0.04, 0.06, 0, 0.35, 0.45, dark, { mat: 'metal' }),
    rbox(0.08, 0.02, 0.28, 0.03, 0, 0.295, 0.46, paint, { mat: 'gloss' }),
    box(0.012, 0.012, 0.24, -0.038, 0.26, 0.46, chrome, { mat: 'metal' }),
    box(0.012, 0.012, 0.24, 0.038, 0.26, 0.46, chrome, { mat: 'metal' }),

    // folding joint, neck, stem clamps and raked steering stem
    box(0.08, 0.24, 0.08, 0, 0.22, 0.33, paint, { mat: 'metal', rot: [0.35, 0, 0] }),
    rbox(0.07, 0.13, 0.1, 0.02, 0, 0.3, 0.39, dark, { mat: 'metal' }),
    cyl(0.03, 0.03, 0.026, 0, 0.37, 0.38, chrome, { mat: 'metal' }, 12),
    cyl(0.03, 0.03, 0.026, 0, 0.44, 0.37, chrome, { mat: 'metal' }, 12),
    cyl(0.022, 0.026, 0.86, 0, 0.64, 0.36, paint, { mat: 'metal', rot: [-0.12, 0, 0] }, 14),
    cyl(0.03, 0.03, 0.05, 0, 1.045, 0.31, chrome, { mat: 'metal', rot: [-0.12, 0, 0] }, 12),
    box(0.03, 0.08, 0.02, 0, 0.66, 0.365, livery, { mat: 'gloss' }),

    // handlebar, grips, caps, brake levers, bell and display
    cyl(0.014, 0.014, 0.42, 0, 1.06, 0.3, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.02, 0.02, 0.1, -0.19, 1.06, 0.3, dark, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.02, 0.02, 0.1, 0.19, 1.06, 0.3, dark, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.021, 0.021, 0.012, -0.243, 1.06, 0.3, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.021, 0.021, 0.012, 0.243, 1.06, 0.3, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.09, 0.012, 0.016, -0.13, 1.075, 0.345, chrome, { mat: 'metal', rot: [0, 0.15, 0] }),
    box(0.09, 0.012, 0.016, 0.13, 1.075, 0.345, chrome, { mat: 'metal', rot: [0, -0.15, 0] }),
    cyl(0.018, 0.018, 0.02, -0.15, 1.085, 0.3, C.brass, { mat: 'metal' }, 12),
    rbox(0.1, 0.035, 0.07, 0.015, 0, 1.1, 0.28, dark),
    box(0.08, 0.012, 0.03, 0, 1.12, 0.29, '#8fa8a0', { mat: 'gloss' }),

    // head lamp, reflector, kickstand and charge port
    rbox(0.055, 0.05, 0.04, 0.015, 0, 0.86, 0.35, dark),
    rbox(0.045, 0.04, 0.012, 0.01, 0, 0.86, 0.372, '#ffe9c2', { mat: 'emissive' }),
    box(0.02, 0.035, 0.008, 0, 0.36, 0.49, '#c99a5e', { mat: 'gloss' }),
    cyl(0.01, 0.01, 0.22, -0.09, 0.11, -0.25, dark, { mat: 'metal', rot: [0.2, 0, 0.5] }, 8),
    box(0.04, 0.01, 0.06, -0.14, 0.02, -0.22, dark, { mat: 'metal' }),
    box(0.02, 0.03, 0.05, -0.087, 0.16, -0.15, livery, { mat: 'gloss' }),
  ],
})
