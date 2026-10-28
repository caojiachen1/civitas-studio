import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const OAK = '#b48a5a'
const OAK_LIGHT = '#bd9464'
const OAK_DARK = '#8e6a43'
const CUSHION = '#e7dfd2'
const CUSHION_SEAM = '#cfc4b3'
const DUVET = '#cdbfa7'
const THROW = '#93a08a'
const THROW_LIGHT = '#a6b29b'

export default defineModel({
  id: 'bed-king',
  name: '特大床',
  category: 'bedroom',
  tags: ['king bed', 'bed', '特大床', '大床', '卧室', 'upholstered', '软包床'],
  footprint: [2.0, 2.25],
  height: 1.22,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // tapered oak legs with brass ferrules
    cyl(0.038, 0.024, 0.28, -0.9, 0.14, -0.9, C.walnut, { mat: 'wood' }, 12),
    cyl(0.038, 0.024, 0.28, 0.9, 0.14, -0.9, C.walnut, { mat: 'wood' }, 12),
    cyl(0.038, 0.024, 0.28, -0.9, 0.14, 0.99, C.walnut, { mat: 'wood' }, 12),
    cyl(0.038, 0.024, 0.28, 0.9, 0.14, 0.99, C.walnut, { mat: 'wood' }, 12),
    cyl(0.026, 0.026, 0.014, -0.9, 0.007, -0.9, C.brass, { mat: 'metal' }, 12),
    cyl(0.026, 0.026, 0.014, 0.9, 0.007, -0.9, C.brass, { mat: 'metal' }, 12),
    cyl(0.026, 0.026, 0.014, -0.9, 0.007, 0.99, C.brass, { mat: 'metal' }, 12),
    cyl(0.026, 0.026, 0.014, 0.9, 0.007, 0.99, C.brass, { mat: 'metal' }, 12),
    // sixth center support leg
    cyl(0.03, 0.022, 0.24, 0, 0.12, 0.55, C.walnut, { mat: 'wood' }, 10),

    // oak bed frame, deck and footboard cap
    box(0.075, 0.18, 2.02, -0.9, 0.37, 0.035, OAK, { mat: 'wood' }),
    box(0.075, 0.18, 2.02, 0.9, 0.37, 0.035, OAK, { mat: 'wood' }),
    box(1.73, 0.16, 0.06, 0, 0.36, -0.94, OAK_DARK, { mat: 'wood' }),
    box(1.73, 0.17, 0.07, 0, 0.365, 1.02, OAK, { mat: 'wood' }),
    rbox(1.79, 0.055, 0.09, 0.018, 0, 0.478, 1.02, OAK_LIGHT, { mat: 'wood' }),
    box(1.72, 0.02, 1.9, 0, 0.47, 0.03, C.birch, { mat: 'wood' }),
    box(1.6, 0.012, 0.02, 0, 0.462, -0.86, OAK_DARK, { mat: 'wood' }),

    // wide channel-tufted headboard with a padded roll
    rbox(1.96, 0.86, 0.14, 0.045, 0, 0.78, -1.045, CUSHION, { mat: 'fabric' }),
    rbox(1.8, 0.7, 0.05, 0.028, 0, 0.79, -0.972, '#e2d8c8', { mat: 'fabric' }),
    box(1.78, 0.008, 0.012, 0, 0.66, -0.945, CUSHION_SEAM, { mat: 'fabric' }),
    box(1.78, 0.008, 0.012, 0, 0.9, -0.945, CUSHION_SEAM, { mat: 'fabric' }),
    box(1.78, 0.008, 0.012, 0, 1.05, -0.945, CUSHION_SEAM, { mat: 'fabric' }),
    cyl(0.06, 0.06, 1.9, 0, 1.16, -1.05, CUSHION, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 24),
    cyl(0.042, 0.042, 0.02, -0.958, 1.16, -1.05, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.042, 0.042, 0.02, 0.958, 1.16, -1.05, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    box(1.74, 0.09, 0.035, 0, 0.36, -1.1, OAK_DARK, { mat: 'wood' }),
    cyl(0.012, 0.012, 0.07, -0.72, 0.43, -1.095, C.brass, { mat: 'metal' }, 10),
    cyl(0.012, 0.012, 0.07, 0.72, 0.43, -1.095, C.brass, { mat: 'metal' }, 10),

    // deep mattress with piped seams
    rbox(1.84, 0.24, 1.94, 0.07, 0, 0.63, 0.045, C.white, { mat: 'fabric' }),
    box(0.008, 0.012, 1.86, -0.923, 0.645, 0.045, '#d6cdbf', { mat: 'fabric' }),
    box(0.008, 0.012, 1.86, 0.923, 0.645, 0.045, '#d6cdbf', { mat: 'fabric' }),
    box(1.82, 0.012, 0.008, 0, 0.645, 1.012, '#d6cdbf', { mat: 'fabric' }),

    // duvet with side and foot drapes, quilted seams
    rbox(1.9, 0.14, 1.44, 0.05, 0, 0.82, 0.34, DUVET, { mat: 'fabric' }),
    rbox(0.05, 0.34, 1.42, 0.016, -0.95, 0.7, 0.34, DUVET, { mat: 'fabric' }),
    rbox(0.05, 0.34, 1.42, 0.016, 0.95, 0.7, 0.34, DUVET, { mat: 'fabric' }),
    rbox(1.9, 0.34, 0.05, 0.016, 0, 0.7, 1.085, DUVET, { mat: 'fabric' }),
    box(1.82, 0.006, 0.012, 0, 0.892, -0.16, '#b8a88e', { mat: 'fabric' }),
    box(1.82, 0.006, 0.012, 0, 0.892, 0.16, '#b8a88e', { mat: 'fabric' }),
    box(1.82, 0.006, 0.012, 0, 0.892, 0.48, '#b8a88e', { mat: 'fabric' }),
    box(1.82, 0.006, 0.012, 0, 0.892, 0.8, '#b8a88e', { mat: 'fabric' }),

    // folded top sheet
    rbox(1.88, 0.05, 0.3, 0.018, 0, 0.905, -0.24, C.white, { mat: 'fabric' }),
    rbox(1.9, 0.038, 0.1, 0.014, 0, 0.91, -0.08, C.cream, { mat: 'fabric' }),

    // four sleeping pillows, two tall at the headboard
    rbox(0.86, 0.44, 0.15, 0.07, -0.45, 0.99, -0.86, CUSHION, { mat: 'fabric', rot: [-0.14, 0, 0] }),
    rbox(0.86, 0.44, 0.15, 0.07, 0.45, 0.99, -0.86, CUSHION, { mat: 'fabric', rot: [-0.14, 0, 0] }),
    rbox(0.72, 0.32, 0.014, 0.03, -0.45, 1.0, -0.787, CUSHION_SEAM, { mat: 'fabric', rot: [-0.14, 0, 0] }),
    rbox(0.72, 0.32, 0.014, 0.03, 0.45, 1.0, -0.787, CUSHION_SEAM, { mat: 'fabric', rot: [-0.14, 0, 0] }),
    rbox(0.68, 0.36, 0.14, 0.06, -0.38, 0.9, -0.6, C.cream, { mat: 'fabric', rot: [-0.22, 0.04, 0] }),
    rbox(0.68, 0.36, 0.14, 0.06, 0.38, 0.9, -0.6, C.cream, { mat: 'fabric', rot: [-0.22, -0.04, 0] }),
    rbox(0.56, 0.26, 0.012, 0.025, -0.38, 0.912, -0.532, '#d8cdb9', { mat: 'fabric', rot: [-0.22, 0.04, 0] }),
    rbox(0.56, 0.26, 0.012, 0.025, 0.38, 0.912, -0.532, '#d8cdb9', { mat: 'fabric', rot: [-0.22, -0.04, 0] }),

    // sage lumbar cushion with a brass button
    rbox(0.52, 0.28, 0.14, 0.06, 0, 0.9, -0.45, THROW, { mat: 'fabric', rot: [-0.3, 0, 0] }),
    sphere(0.013, 0, 0.921, -0.386, C.brass, { mat: 'metal' }, 10),
    box(0.44, 0.006, 0.008, 0, 0.825, -0.3535, '#7d8b74', { mat: 'fabric', rot: [-0.3, 0, 0] }),

    // folded knit throw at the foot
    rbox(1.94, 0.055, 0.46, 0.02, 0, 0.915, 0.84, THROW, { mat: 'fabric' }),
    rbox(1.9, 0.026, 0.1, 0.01, 0, 0.952, 0.68, THROW_LIGHT, { mat: 'fabric' }),
    box(1.88, 0.012, 0.02, 0, 0.93, 0.62, '#79866f', { mat: 'fabric' }),
    cyl(0.016, 0.016, 1.86, 0, 0.94, 1.068, THROW_LIGHT, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 10),

    // side rail bolts and an extra duvet topstitch line
    cyl(0.014, 0.014, 0.02, -0.9375, 0.37, 0.6, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.02, 0.9375, 0.37, 0.6, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.02, -0.9375, 0.37, -0.4, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.02, 0.9375, 0.37, -0.4, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    box(1.82, 0.006, 0.012, 0, 0.892, 0.64, '#b8a88e', { mat: 'fabric' }),
  ],
})
