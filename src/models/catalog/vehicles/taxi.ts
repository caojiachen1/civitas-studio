import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#c2a15d'
const tire = '#24272b'
const dark = '#2c3033'
const bumper = '#4b5054'
const chrome = C.steel
const tint = '#333c42'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.33, 0.33, 0.24, x, 0.33, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.2, 0.2, 0.248, x, 0.33, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.07, 0.07, 0.254, x, 0.33, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'taxi',
  name: '出租车',
  category: 'vehicles',
  tags: ['taxi', 'cab', 'sedan', '出租车', '的士', '计程车', '营运'],
  footprint: [1.85, 4.4],
  height: 1.5,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.78, 1.42),
    ...wheel(0.78, 1.42),
    ...wheel(-0.78, -1.44),
    ...wheel(0.78, -1.44),

    // amber body, rocker, bonnet and boot
    rbox(1.76, 0.58, 4.2, 0.14, 0, 0.62, 0, paint, { mat: 'gloss' }),
    rbox(1.7, 0.16, 3.9, 0.05, 0, 0.28, 0, dark),
    rbox(1.7, 0.14, 1.1, 0.06, 0, 0.9, 1.45, paint, { mat: 'gloss' }),
    rbox(1.68, 0.12, 0.85, 0.05, 0, 0.9, -1.55, paint, { mat: 'gloss' }),

    // glasshouse, roof, raked screens
    rbox(1.56, 0.36, 2.0, 0.1, 0, 1.08, -0.12, tint, { mat: 'glass' }),
    rbox(1.62, 0.08, 1.86, 0.04, 0, 1.3, -0.16, paint, { mat: 'gloss' }),
    box(1.46, 0.42, 0.05, 0, 1.06, 0.9, tint, { mat: 'glass', rot: [-0.48, 0, 0] }),
    box(1.44, 0.38, 0.05, 0, 1.06, -1.06, tint, { mat: 'glass', rot: [0.5, 0, 0] }),

    // A / B / C pillars
    rbox(0.07, 0.42, 0.1, 0.02, -0.75, 1.06, 0.88, paint, { mat: 'gloss', rot: [-0.48, 0, 0] }),
    rbox(0.07, 0.42, 0.1, 0.02, 0.75, 1.06, 0.88, paint, { mat: 'gloss', rot: [-0.48, 0, 0] }),
    box(0.06, 0.36, 0.08, -0.77, 1.08, -0.15, dark),
    box(0.06, 0.36, 0.08, 0.77, 1.08, -0.15, dark),
    rbox(0.09, 0.38, 0.3, 0.03, -0.77, 1.07, -1.02, paint, { mat: 'gloss' }),
    rbox(0.09, 0.38, 0.3, 0.03, 0.77, 1.07, -1.02, paint, { mat: 'gloss' }),

    // chrome beltline, door seams and handles
    box(0.02, 0.03, 1.9, -0.885, 0.91, -0.12, chrome, { mat: 'metal' }),
    box(0.02, 0.03, 1.9, 0.885, 0.91, -0.12, chrome, { mat: 'metal' }),
    box(0.02, 0.42, 0.025, -0.883, 0.65, 0.55, dark),
    box(0.02, 0.42, 0.025, 0.883, 0.65, 0.55, dark),
    box(0.03, 0.045, 0.16, -0.89, 0.8, 0.95, chrome, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 0.89, 0.8, 0.95, chrome, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, -0.89, 0.8, -0.55, chrome, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 0.89, 0.8, -0.55, chrome, { mat: 'metal' }),

    // mirrors
    box(0.06, 0.03, 0.03, -0.895, 1.02, 0.7, dark, { mat: 'metal' }),
    box(0.06, 0.03, 0.03, 0.895, 1.02, 0.7, dark, { mat: 'metal' }),
    rbox(0.05, 0.14, 0.18, 0.02, -0.9, 0.97, 0.73, paint, { mat: 'gloss' }),
    rbox(0.05, 0.14, 0.18, 0.02, 0.9, 0.97, 0.73, paint, { mat: 'gloss' }),

    // roof taxi sign: foot, illuminated box and two amber faces
    box(0.34, 0.05, 0.22, 0, 1.365, -0.1, dark),
    rbox(0.46, 0.12, 0.28, 0.03, 0, 1.44, -0.1, '#e8e2cf', { mat: 'gloss' }),
    box(0.38, 0.08, 0.01, 0, 1.44, 0.045, '#e0b46b', { mat: 'emissive' }),
    box(0.38, 0.08, 0.01, 0, 1.44, -0.245, '#e0b46b', { mat: 'emissive' }),

    // checker band and alternating squares
    box(0.02, 0.1, 3.5, -0.885, 0.69, -0.05, C.ink, { mat: 'gloss' }),
    box(0.02, 0.1, 3.5, 0.885, 0.69, -0.05, C.ink, { mat: 'gloss' }),
    box(0.025, 0.1, 0.18, -0.888, 0.69, 0.6, C.white, { mat: 'gloss' }),
    box(0.025, 0.1, 0.18, 0.888, 0.69, 0.6, C.white, { mat: 'gloss' }),
    box(0.025, 0.1, 0.18, -0.888, 0.69, 0.0, C.white, { mat: 'gloss' }),
    box(0.025, 0.1, 0.18, 0.888, 0.69, 0.0, C.white, { mat: 'gloss' }),
    box(0.025, 0.1, 0.18, -0.888, 0.69, -0.6, C.white, { mat: 'gloss' }),
    box(0.025, 0.1, 0.18, 0.888, 0.69, -0.6, C.white, { mat: 'gloss' }),

    // rear window meter stickers
    box(0.02, 0.1, 0.18, -0.784, 1.06, -0.5, C.white, { mat: 'gloss' }),
    box(0.02, 0.1, 0.18, 0.784, 1.06, -0.5, C.white, { mat: 'gloss' }),

    // nose: grille, chrome bar, lamps, bumper and plate
    rbox(0.9, 0.14, 0.05, 0.02, 0, 0.72, 2.1, dark, { mat: 'metal' }),
    box(0.94, 0.025, 0.02, 0, 0.76, 2.12, chrome, { mat: 'metal' }),
    rbox(0.38, 0.1, 0.05, 0.02, -0.62, 0.84, 2.1, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.38, 0.1, 0.05, 0.02, 0.62, 0.84, 2.1, '#ffe9c2', { mat: 'emissive' }),
    rbox(1.8, 0.24, 0.22, 0.08, 0, 0.45, 2.03, bumper, { mat: 'metal' }),
    box(0.44, 0.12, 0.02, 0, 0.52, 2.145, C.white),

    // tail: lamps, bumper, plate and exhaust
    rbox(0.4, 0.1, 0.05, 0.02, -0.62, 0.84, -2.1, C.red, { mat: 'emissive' }),
    rbox(0.4, 0.1, 0.05, 0.02, 0.62, 0.84, -2.1, C.red, { mat: 'emissive' }),
    rbox(1.8, 0.24, 0.22, 0.08, 0, 0.45, -2.03, bumper, { mat: 'metal' }),
    box(0.44, 0.12, 0.02, 0, 0.52, -2.145, C.white),
    cyl(0.04, 0.04, 0.1, -0.5, 0.34, -2.1, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
  ],
})
