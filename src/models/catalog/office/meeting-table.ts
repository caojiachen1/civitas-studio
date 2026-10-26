import { C, box, cyl, defineModel, prism, rbox, torus } from '../../kit'

const OAK = '#b48a5a'
const OAK_DARK = '#8f6a43'
const METAL = '#33383b'
const METAL_LIGHT = '#4b5256'

const cardPoints: [number, number][] = [
  [-0.075, 0],
  [0.075, 0],
  [0, 0.043],
]

export default defineModel({
  id: 'meeting-table',
  name: '会议桌',
  category: 'office',
  tags: ['meeting table', 'conference table', '会议桌', '长桌', '办公', 'boardroom', 'cable box'],
  footprint: [2.5, 1.15],
  height: 0.77,
  placement: 'indoor',
  parts: [
    // four square steel legs with adjustable glides
    box(0.05, 0.662, 0.05, -1.06, 0.343, -0.42, METAL, { mat: 'metal' }),
    box(0.05, 0.662, 0.05, 1.06, 0.343, -0.42, METAL, { mat: 'metal' }),
    box(0.05, 0.662, 0.05, -1.06, 0.343, 0.42, METAL, { mat: 'metal' }),
    box(0.05, 0.662, 0.05, 1.06, 0.343, 0.42, METAL, { mat: 'metal' }),
    cyl(0.024, 0.026, 0.012, -1.06, 0.006, -0.42, METAL_LIGHT, { mat: 'metal' }, 12),
    cyl(0.024, 0.026, 0.012, 1.06, 0.006, -0.42, METAL_LIGHT, { mat: 'metal' }, 12),
    cyl(0.024, 0.026, 0.012, -1.06, 0.006, 0.42, METAL_LIGHT, { mat: 'metal' }, 12),
    cyl(0.024, 0.026, 0.012, 1.06, 0.006, 0.42, METAL_LIGHT, { mat: 'metal' }, 12),
    box(0.1, 0.018, 0.1, -1.06, 0.665, -0.42, METAL_LIGHT, { mat: 'metal' }),
    box(0.1, 0.018, 0.1, 1.06, 0.665, -0.42, METAL_LIGHT, { mat: 'metal' }),
    box(0.1, 0.018, 0.1, -1.06, 0.665, 0.42, METAL_LIGHT, { mat: 'metal' }),
    box(0.1, 0.018, 0.1, 1.06, 0.665, 0.42, METAL_LIGHT, { mat: 'metal' }),

    // double side stretchers and end cross rails
    box(2.06, 0.05, 0.04, 0, 0.18, -0.42, METAL, { mat: 'metal' }),
    box(2.06, 0.05, 0.04, 0, 0.18, 0.42, METAL, { mat: 'metal' }),
    box(0.04, 0.04, 0.84, -1.06, 0.18, 0, METAL, { mat: 'metal' }),
    box(0.04, 0.04, 0.84, 1.06, 0.18, 0, METAL, { mat: 'metal' }),
    box(0.06, 0.006, 0.006, -0.4, 0.181, 0.443, C.brass, { mat: 'metal' }),
    box(0.06, 0.006, 0.006, 0.4, 0.181, 0.443, C.brass, { mat: 'metal' }),

    // oak top with a shadow edge band
    rbox(2.5, 0.046, 1.15, 0.018, 0, 0.697, 0, OAK, { mat: 'wood' }),
    rbox(2.46, 0.01, 1.11, 0.004, 0, 0.669, 0, OAK_DARK, { mat: 'wood' }),
    box(2.3, 0.002, 0.005, 0, 0.721, -0.3, '#a9814f', { mat: 'wood' }),
    box(2.3, 0.002, 0.005, 0, 0.721, 0.3, '#a9814f', { mat: 'wood' }),

    // central cable box with lid, slots and grommets
    rbox(1.24, 0.012, 0.22, 0.004, 0, 0.7175, 0, METAL_LIGHT, { mat: 'metal' }),
    rbox(1.18, 0.006, 0.16, 0.002, 0, 0.7225, 0, METAL, { mat: 'metal' }),
    box(0.26, 0.003, 0.018, -0.3, 0.726, 0, '#1f2326', { mat: 'matte' }),
    box(0.26, 0.003, 0.018, 0, 0.726, 0, '#1f2326', { mat: 'matte' }),
    box(0.26, 0.003, 0.018, 0.3, 0.726, 0, '#1f2326', { mat: 'matte' }),
    cyl(0.03, 0.03, 0.006, -0.5, 0.726, 0, METAL, { mat: 'metal' }, 16),
    cyl(0.03, 0.03, 0.006, 0.5, 0.726, 0, METAL, { mat: 'metal' }, 16),
    box(0.1, 0.012, 0.05, 0.12, 0.729, 0.055, '#d9d2c4', { mat: 'matte' }),
    box(0.018, 0.008, 0.026, 0.1, 0.735, 0.055, METAL, { mat: 'metal' }),
    box(0.018, 0.008, 0.026, 0.14, 0.735, 0.055, METAL, { mat: 'metal' }),

    // under-top cable tray and power strip
    rbox(1.2, 0.05, 0.18, 0.01, 0, 0.645, 0, '#5b6165', { mat: 'metal' }),
    rbox(0.03, 0.04, 0.14, 0.006, -0.58, 0.668, 0, METAL_LIGHT, { mat: 'metal' }),
    rbox(0.03, 0.04, 0.14, 0.006, 0.58, 0.668, 0, METAL_LIGHT, { mat: 'metal' }),
    box(0.5, 0.04, 0.06, 0.2, 0.63, 0.12, C.cream, { mat: 'matte' }),
    box(0.03, 0.02, 0.012, 0.06, 0.63, 0.152, '#2b2f31', { mat: 'matte' }),
    box(0.03, 0.02, 0.012, 0.13, 0.63, 0.152, '#2b2f31', { mat: 'matte' }),
    box(0.03, 0.02, 0.012, 0.2, 0.63, 0.152, '#2b2f31', { mat: 'matte' }),

    // two tent name cards
    box(0.17, 0.006, 0.17, -0.35, 0.723, 0.45, C.brass, { mat: 'metal' }),
    prism(cardPoints, 0.16, -0.35, 0.726, 0.45, C.cream, { mat: 'matte' }),
    box(0.17, 0.006, 0.17, 0.35, 0.723, -0.45, C.brass, { mat: 'metal' }),
    prism(cardPoints, 0.16, 0.35, 0.726, -0.45, C.cream, { mat: 'matte' }),

    // four water cups with saucers and crema
    cyl(0.05, 0.043, 0.007, -0.85, 0.7235, -0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.032, 0.027, 0.04, -0.85, 0.747, -0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.028, 0.028, 0.002, -0.85, 0.766, -0.35, C.water, { mat: 'gloss' }, 20),
    torus(0.016, 0.004, -0.82, 0.748, -0.35, C.white, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),
    cyl(0.05, 0.043, 0.007, -0.6, 0.7235, 0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.032, 0.027, 0.04, -0.6, 0.747, 0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.028, 0.028, 0.002, -0.6, 0.766, 0.35, C.water, { mat: 'gloss' }, 20),
    torus(0.016, 0.004, -0.57, 0.748, 0.35, C.white, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),
    cyl(0.05, 0.043, 0.007, 0.6, 0.7235, -0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.032, 0.027, 0.04, 0.6, 0.747, -0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.028, 0.028, 0.002, 0.6, 0.766, -0.35, C.water, { mat: 'gloss' }, 20),
    torus(0.016, 0.004, 0.63, 0.748, -0.35, C.white, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),
    cyl(0.05, 0.043, 0.007, 0.85, 0.7235, 0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.032, 0.027, 0.04, 0.85, 0.747, 0.35, C.white, { mat: 'ceramic' }, 20),
    cyl(0.028, 0.028, 0.002, 0.85, 0.766, 0.35, C.water, { mat: 'gloss' }, 20),
    torus(0.016, 0.004, 0.88, 0.748, 0.35, C.white, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),

    // notepad and pens
    rbox(0.24, 0.006, 0.3, 0.005, 0.15, 0.722, 0.4, C.cream, { mat: 'matte' }),
    box(0.005, 0.002, 0.26, 0.07, 0.726, 0.4, '#b7b0a2', { mat: 'matte' }),
    cyl(0.004, 0.004, 0.15, 0.1, 0.727, 0.47, C.ink, { mat: 'gloss', rot: [Math.PI / 2, 0, 0.06] }, 8),
    cyl(0.004, 0.004, 0.15, 0.19, 0.727, 0.46, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, -0.06] }, 8),
  ],
})
