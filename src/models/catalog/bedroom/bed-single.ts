import { C, box, cyl, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'bed-single',
  name: '单人床',
  category: 'bedroom',
  tags: ['bed', 'single bed', '单人床', '卧室', 'guest'],
  footprint: [1.05, 2.1],
  height: 1.05,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Upholstered headboard
    rbox(1.0, 0.66, 0.12, 0.028, 0, 0.7, -0.99, C.sage, { mat: 'fabric' }),
    cyl(0.038, 0.038, 0.96, 0, 1.012, -0.985, '#98a990', { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 20),
    rbox(0.88, 0.54, 0.04, 0.02, 0, 0.69, -0.918, '#9cab92', { mat: 'fabric' }),
    box(0.007, 0.44, 0.01, -0.22, 0.69, -0.896, '#7d8f76', { mat: 'fabric' }),
    box(0.007, 0.44, 0.01, 0.22, 0.69, -0.896, '#7d8f76', { mat: 'fabric' }),

    // Oak frame with low foot rail
    box(0.065, 0.19, 1.9, -0.47, 0.415, 0.04, C.oak, { mat: 'wood' }),
    box(0.065, 0.19, 1.9, 0.47, 0.415, 0.04, C.oak, { mat: 'wood' }),
    box(0.95, 0.17, 0.055, 0, 0.425, 1.0, C.oak, { mat: 'wood' }),
    rbox(1.0, 0.12, 0.045, 0.013, 0, 0.54, 1.0, '#b78d5c', { mat: 'wood' }),
    cyl(0.032, 0.02, 0.32, -0.44, 0.16, -0.88, C.walnut, { mat: 'wood' }, 10),
    cyl(0.032, 0.02, 0.32, 0.44, 0.16, -0.88, C.walnut, { mat: 'wood' }, 10),
    cyl(0.032, 0.02, 0.32, -0.44, 0.16, 0.94, C.walnut, { mat: 'wood' }, 10),
    cyl(0.032, 0.02, 0.32, 0.44, 0.16, 0.94, C.walnut, { mat: 'wood' }, 10),

    // Mattress
    rbox(0.9, 0.22, 1.84, 0.05, 0, 0.625, 0.04, C.white, { mat: 'fabric' }),
    box(0.007, 0.011, 1.78, -0.451, 0.64, 0.04, '#d8d0c4', { mat: 'fabric' }),
    box(0.007, 0.011, 1.78, 0.451, 0.64, 0.04, '#d8d0c4', { mat: 'fabric' }),

    // Duvet and drapes
    rbox(0.94, 0.11, 1.32, 0.038, 0, 0.77, 0.38, C.linen, { mat: 'fabric' }),
    rbox(0.032, 0.26, 1.3, 0.011, -0.47, 0.68, 0.38, C.linen, { mat: 'fabric' }),
    rbox(0.032, 0.26, 1.3, 0.011, 0.47, 0.68, 0.38, C.linen, { mat: 'fabric' }),
    rbox(0.94, 0.26, 0.032, 0.011, 0, 0.68, 1.032, C.linen, { mat: 'fabric' }),
    box(0.86, 0.006, 0.01, 0, 0.828, 0.2, '#c7bcaa', { mat: 'fabric' }),
    box(0.86, 0.006, 0.01, 0, 0.828, 0.7, '#c7bcaa', { mat: 'fabric' }),

    // Folded sheet
    rbox(0.92, 0.045, 0.32, 0.018, 0, 0.85, -0.12, C.white, { mat: 'fabric' }),
    rbox(0.94, 0.045, 0.08, 0.018, 0, 0.86, 0.03, C.cream, { mat: 'fabric' }),

    // One pillow plus accent cushion
    rbox(0.66, 0.3, 0.15, 0.05, 0, 0.885, -0.845, C.cream, { mat: 'fabric' }),
    rbox(0.56, 0.2, 0.012, 0.026, 0, 0.885, -0.7645, '#e9e0d2', { mat: 'fabric' }),
    rbox(0.3, 0.28, 0.09, 0.03, 0.24, 0.875, -0.55, C.clay, { mat: 'fabric', rot: [-0.22, -0.12, 0] }),

    // Throw folded across the foot
    rbox(0.98, 0.05, 0.36, 0.018, 0, 0.855, 0.76, C.sage, { mat: 'fabric' }),
    rbox(0.98, 0.028, 0.09, 0.011, 0, 0.878, 0.6, '#9cab92', { mat: 'fabric' }),
  ],
})
