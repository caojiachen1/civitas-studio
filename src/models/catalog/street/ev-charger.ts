import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bodyPaint = C.cream
const facePaint = C.navy
const cable = '#26292b'
const screenTint = '#c9d7d0'
const STATUS = '#8fbf8a'

export default defineModel({
  id: 'ev-charger',
  name: '充电桩',
  category: 'street',
  tags: ['ev-charger', 'charging', 'electric', '充电桩', '电动车', '新能源'],
  footprint: [0.45, 0.35],
  height: 1.5,
  placement: 'outdoor',
  parts: [
    // concrete footing and anchor bolts
    rounded(0.32, 0.05, 0.26, 0.02, 0, 0.025, 0, C.stone, { mat: 'stone' }),
    rounded(0.28, 0.02, 0.22, 0.012, 0, 0.06, 0, C.graphite, { mat: 'metal' }),
    ...[0.1, -0.1].flatMap((x) =>
      [0.08, -0.08].map((z) => cyl(0.01, 0.01, 0.014, x, 0.072, z, C.steel, { mat: 'metal' }, 8)),
    ),

    // pedestal shell with a painted base band and front faceplate
    rounded(0.24, 1.36, 0.18, 0.035, 0, 0.75, 0, bodyPaint, { mat: 'matte' }),
    rounded(0.245, 0.24, 0.185, 0.03, 0, 0.19, 0, facePaint, { mat: 'matte' }),
    rounded(0.2, 0.76, 0.014, 0.015, 0, 0.99, 0.092, facePaint, { mat: 'matte' }),

    // display recess, screen and UI bars
    rounded(0.17, 0.2, 0.012, 0.008, 0, 1.17, 0.101, C.graphite, { mat: 'metal' }),
    box(0.15, 0.17, 0.006, 0, 1.17, 0.109, screenTint, { mat: 'matte' }),
    box(0.1, 0.014, 0.002, 0, 1.21, 0.113, C.ink),
    box(0.08, 0.012, 0.002, 0, 1.17, 0.113, C.ink),
    box(0.06, 0.01, 0.002, 0, 1.13, 0.113, C.ink),
    sphere(0.006, 0.06, 1.245, 0.113, STATUS, { mat: 'emissive' }, 8),

    // brand plate above the screen
    rounded(0.14, 0.045, 0.008, 0.004, 0, 1.33, 0.102, C.cream, { mat: 'matte' }),
    box(0.1, 0.012, 0.004, 0, 1.33, 0.107, facePaint),

    // card reader with slot and status LED
    rounded(0.08, 0.12, 0.012, 0.006, 0, 0.94, 0.101, C.graphite, { mat: 'metal' }),
    box(0.05, 0.008, 0.006, 0, 0.97, 0.109, C.ink),
    sphere(0.006, 0.026, 0.9, 0.109, STATUS, { mat: 'emissive' }, 8),
    box(0.018, 0.012, 0.003, 0.0, 0.9, 0.109, C.steel, { mat: 'metal', rot: [0, 0, 0.6] }),
    box(0.018, 0.012, 0.003, 0.0, 0.9, 0.109, C.steel, { mat: 'metal', rot: [0, 0, -0.6] }),

    // pressed top cap and amber status beacon
    rounded(0.27, 0.05, 0.21, 0.02, 0, 1.455, 0, C.graphite, { mat: 'metal' }),
    cyl(0.018, 0.022, 0.02, 0, 1.49, 0, '#d69a4a', { mat: 'emissive' }, 12),

    // side holster and charging gun
    rounded(0.04, 0.12, 0.09, 0.012, 0.13, 0.92, 0, C.graphite, { mat: 'metal' }),
    rounded(0.085, 0.14, 0.11, 0.02, 0.165, 0.82, 0.02, C.blackMetal, { mat: 'metal' }),
    rounded(0.055, 0.16, 0.075, 0.018, 0.185, 0.97, 0.02, C.ink, { mat: 'gloss' }),
    rounded(0.04, 0.05, 0.1, 0.012, 0.185, 0.93, 0.075, C.ink, { mat: 'gloss', rot: [-0.35, 0, 0] }),
    cyl(0.022, 0.022, 0.05, 0.185, 0.865, 0.02, C.steel, { mat: 'metal' }, 12),

    // hanging charging cable
    cyl(0.011, 0.011, 0.14, 0.185, 0.77, 0.025, cable, { mat: 'matte' }, 8),
    cyl(0.011, 0.011, 0.128, 0.1825, 0.64, 0.0525, cable, { mat: 'matte', rot: [0.359, 0, 0] }, 8),
    cyl(0.011, 0.011, 0.124, 0.17, 0.52, 0.0875, cable, { mat: 'matte', rot: [0.206, 0, 0] }, 8),
    cyl(0.011, 0.011, 0.123, 0.1475, 0.4, 0.095, cable, { mat: 'matte', rot: [-0.083, 0, 0] }, 8),
    cyl(0.015, 0.018, 0.03, 0.128, 0.31, 0.088, C.graphite, { mat: 'metal', rot: [0, 0, -0.7] }, 12),
    torus(0.035, 0.006, 0.12, 1.15, 0.04, C.graphite, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),

    // ventilation slots in the painted base band
    box(0.1, 0.01, 0.004, 0, 0.13, 0.095, C.ink),
    box(0.1, 0.01, 0.004, 0, 0.16, 0.095, C.ink),
    box(0.1, 0.01, 0.004, 0, 0.19, 0.095, C.ink),

    // service lock, side handle and rating label
    cyl(0.012, 0.012, 0.01, -0.08, 0.4, 0.1, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rounded(0.015, 0.08, 0.02, 0.005, -0.121, 1.0, 0.02, C.graphite, { mat: 'metal' }),
    rounded(0.1, 0.045, 0.004, 0.003, 0, 0.42, 0.099, C.cream, { mat: 'matte' }),
    box(0.08, 0.008, 0.002, 0, 0.43, 0.102, C.ink),
    box(0.06, 0.006, 0.002, 0, 0.412, 0.102, C.ink),

    // rear cable conduit
    rounded(0.12, 0.3, 0.03, 0.012, 0, 0.25, -0.1, C.graphite, { mat: 'metal' }),
  ],
})
