import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bodyPaint = C.navy
const metal = C.steel
const plate = C.cream
const screenTint = '#c3d6c4'
const solarCell = '#3c4a54'

export default defineModel({
  id: 'parking-meter',
  name: '停车计时器',
  category: 'street',
  tags: ['parking', 'meter', 'pay-station', '停车', '计时器', '收费', '路边'],
  footprint: [0.3, 0.3],
  height: 1.45,
  placement: 'outdoor',
  parts: [
    // cast base plate with four anchor bolts
    rounded(0.24, 0.035, 0.24, 0.008, 0, 0.0175, 0, C.graphite, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.018, 0.086, 0.043, 0.086, metal, { mat: 'metal' }, 8),
    cyl(0.012, 0.012, 0.018, -0.086, 0.043, 0.086, metal, { mat: 'metal' }, 8),
    cyl(0.012, 0.012, 0.018, 0.086, 0.043, -0.086, metal, { mat: 'metal' }, 8),
    cyl(0.012, 0.012, 0.018, -0.086, 0.043, -0.086, metal, { mat: 'metal' }, 8),

    // steel pedestal with a turned collar top and bottom
    cyl(0.027, 0.033, 1.02, 0, 0.545, 0, metal, { mat: 'metal' }, 20),
    torus(0.031, 0.007, 0, 0.18, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.045, 0.035, 0.03, 0, 1.06, 0, C.graphite, { mat: 'metal' }, 20),

    // meter head shell and front faceplate
    rounded(0.24, 0.32, 0.16, 0.028, 0, 1.245, 0, bodyPaint, { mat: 'metal' }),
    rounded(0.205, 0.265, 0.018, 0.01, 0, 1.245, 0.084, plate, { mat: 'matte' }),

    // backlit display recess, screen and three placeholder digits
    rounded(0.16, 0.1, 0.014, 0.006, 0, 1.33, 0.096, C.ink, { mat: 'metal' }),
    box(0.138, 0.078, 0.008, 0, 1.33, 0.104, screenTint, { mat: 'matte' }),
    box(0.012, 0.034, 0.004, -0.03, 1.33, 0.109, C.ink),
    box(0.012, 0.034, 0.004, 0, 1.33, 0.109, C.ink),
    box(0.012, 0.034, 0.004, 0.03, 1.33, 0.109, C.ink),

    // coin bezel and slot on the left, card reader on the right
    rounded(0.055, 0.088, 0.018, 0.006, -0.055, 1.21, 0.094, metal, { mat: 'metal' }),
    box(0.012, 0.052, 0.008, -0.055, 1.212, 0.105, C.ink),
    rounded(0.075, 0.088, 0.02, 0.007, 0.055, 1.21, 0.095, C.graphite, { mat: 'metal' }),
    box(0.05, 0.007, 0.006, 0.055, 1.232, 0.108, C.ink),
    box(0.008, 0.008, 0.004, 0.082, 1.188, 0.108, '#8fbf8a', { mat: 'emissive' }),

    // permit number sticker low on the faceplate
    rounded(0.07, 0.034, 0.006, 0.002, 0.02, 1.14, 0.096, plate, { mat: 'matte' }),
    box(0.05, 0.007, 0.003, 0.02, 1.144, 0.1, bodyPaint),
    box(0.036, 0.005, 0.003, 0.02, 1.133, 0.1, C.red),

    // pressed top cap and underside cover
    rounded(0.25, 0.026, 0.17, 0.01, 0, 1.418, 0, C.graphite, { mat: 'metal' }),
    rounded(0.18, 0.024, 0.12, 0.008, 0, 1.084, 0, C.graphite, { mat: 'metal' }),

    // small solar panel with cell grid and two mounting brackets
    rounded(0.235, 0.018, 0.19, 0.006, 0, 1.432, 0.01, C.graphite, { mat: 'metal' }),
    box(0.212, 0.008, 0.168, 0, 1.444, 0.01, solarCell, { mat: 'gloss' }),
    box(0.004, 0.002, 0.164, -0.036, 1.449, 0.01, C.steel, { mat: 'metal' }),
    box(0.004, 0.002, 0.164, 0.036, 1.449, 0.01, C.steel, { mat: 'metal' }),
    box(0.208, 0.002, 0.004, 0, 1.449, 0.01, C.steel, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.03, -0.08, 1.42, 0.07, metal, { mat: 'metal' }, 8),
    cyl(0.008, 0.008, 0.03, 0.08, 1.42, 0.07, metal, { mat: 'metal' }, 8),

    // circular P badge on the left cheek
    cyl(0.048, 0.048, 0.01, -0.122, 1.32, 0, bodyPaint, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 24),
    box(0.006, 0.05, 0.012, -0.13, 1.32, -0.012, plate),
    box(0.006, 0.012, 0.028, -0.13, 1.339, 0.002, plate),
    box(0.006, 0.012, 0.028, -0.13, 1.301, 0.002, plate),
    box(0.006, 0.028, 0.012, -0.13, 1.32, 0.014, plate),

    // service door hinge and lock barrel
    cyl(0.009, 0.009, 0.05, 0.122, 1.34, 0.03, metal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.017, 0.017, 0.02, -0.124, 1.12, 0.03, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),

    // coin return cup with its dark opening
    rounded(0.05, 0.036, 0.016, 0.004, -0.055, 1.14, 0.094, C.graphite, { mat: 'metal' }),
    box(0.034, 0.014, 0.008, -0.055, 1.14, 0.105, C.ink, { mat: 'matte' }),

    // collar clamping the head onto the pedestal, with set screws
    torus(0.034, 0.008, 0, 1.075, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.004, 0.004, 0.01, 0.045, 1.075, 0, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 6),
    cyl(0.004, 0.004, 0.01, -0.045, 1.075, 0, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 6),
  ],
})
