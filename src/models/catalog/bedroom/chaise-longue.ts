import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const CLAY = '#b98f7d'
const CLAY_LIGHT = '#c69d8b'
const CLAY_DARK = '#a67c6b'
const SEAM = '#8f6a5b'
const LINEN = '#e2d8c8'
const THROW = '#8fa087'

export default defineModel({
  id: 'chaise-longue',
  name: '贵妃榻',
  category: 'bedroom',
  tags: ['chaise', 'chaise longue', '贵妃榻', '躺椅', '卧室', '拉扣', 'tufted'],
  footprint: [0.8, 1.75],
  height: 0.82,
  placement: 'indoor',
  parts: [
    // turned walnut legs with brass ferrules
    cyl(0.03, 0.018, 0.22, -0.28, 0.11, -0.68, C.walnut, { mat: 'wood' }, 10),
    cyl(0.03, 0.018, 0.22, 0.28, 0.11, -0.68, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.22, -0.28, 0.11, 0.72, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.22, 0.28, 0.11, 0.72, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.02, 0.014, -0.28, 0.007, -0.68, C.brass, { mat: 'metal' }, 12),
    cyl(0.02, 0.02, 0.014, 0.28, 0.007, -0.68, C.brass, { mat: 'metal' }, 12),
    cyl(0.019, 0.019, 0.014, -0.28, 0.007, 0.72, C.brass, { mat: 'metal' }, 12),
    cyl(0.019, 0.019, 0.014, 0.28, 0.007, 0.72, C.brass, { mat: 'metal' }, 12),

    // upholstered base with a slim brass kick rail and a dark underframe
    rbox(0.74, 0.16, 1.66, 0.04, -0.01, 0.3, 0.03, CLAY, { mat: 'fabric' }),
    box(0.7, 0.012, 0.014, -0.01, 0.232, 0.866, C.brass, { mat: 'metal' }),
    box(0.7, 0.012, 0.014, -0.01, 0.232, -0.806, C.brass, { mat: 'metal' }),
    rbox(0.7, 0.035, 1.5, 0.015, -0.01, 0.2, 0.03, CLAY_DARK, { mat: 'fabric' }),

    // long tufted seat cushion with piped edges
    rbox(0.6, 0.14, 1.18, 0.055, -0.06, 0.45, 0.12, CLAY_LIGHT, { mat: 'fabric' }),
    box(0.6, 0.012, 0.012, -0.06, 0.455, 0.712, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 1.18, -0.362, 0.455, 0.12, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 1.18, 0.242, 0.455, 0.12, SEAM, { mat: 'fabric' }),
    box(0.004, 0.006, 1.14, -0.21, 0.521, 0.12, SEAM, { mat: 'fabric' }),
    box(0.004, 0.006, 1.14, 0.09, 0.521, 0.12, SEAM, { mat: 'fabric' }),
    sphere(0.009, -0.21, 0.524, 0.02, SEAM, { mat: 'fabric' }, 8),
    sphere(0.009, -0.21, 0.524, 0.42, SEAM, { mat: 'fabric' }, 8),
    sphere(0.009, 0.09, 0.524, 0.02, SEAM, { mat: 'fabric' }, 8),
    sphere(0.009, 0.09, 0.524, 0.42, SEAM, { mat: 'fabric' }, 8),
    box(0.58, 0.03, 0.012, -0.06, 0.415, 0.716, CLAY_DARK, { mat: 'fabric' }),

    // raked button-tufted backrest with a padded top roll
    rbox(0.7, 0.42, 0.15, 0.05, -0.02, 0.54, -0.66, CLAY, { mat: 'fabric', rot: [-0.2, 0, 0] }),
    cyl(0.055, 0.055, 0.7, -0.02, 0.765, -0.735, CLAY, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 20),
    sphere(0.009, -0.22, 0.638, -0.607, SEAM, { mat: 'fabric' }, 8),
    sphere(0.009, -0.02, 0.638, -0.607, SEAM, { mat: 'fabric' }, 8),
    sphere(0.009, 0.18, 0.638, -0.607, SEAM, { mat: 'fabric' }, 8),
    box(0.62, 0.006, 0.006, -0.02, 0.555, -0.587, SEAM, { mat: 'fabric', rot: [-0.2, 0, 0] }),
    box(0.62, 0.006, 0.006, -0.02, 0.653, -0.607, SEAM, { mat: 'fabric', rot: [-0.2, 0, 0] }),

    // single right arm with a rolled top and nailhead trim
    rbox(0.12, 0.24, 0.66, 0.05, 0.3, 0.47, -0.28, CLAY, { mat: 'fabric' }),
    cyl(0.055, 0.055, 0.66, 0.3, 0.6, -0.28, CLAY_LIGHT, { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.008, 0.008, 0.62, 0.362, 0.372, -0.28, C.brass, { mat: 'metal' }),
    sphere(0.008, 0.363, 0.35, -0.54, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 0.363, 0.35, -0.40, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 0.363, 0.35, -0.26, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 0.363, 0.35, -0.12, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 0.363, 0.35, 0.02, C.brass, { mat: 'metal' }, 8),

    // cylindrical bolster with a sage band
    cyl(0.085, 0.085, 0.48, -0.05, 0.615, -0.42, LINEN, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 24),
    cyl(0.087, 0.087, 0.05, -0.05, 0.615, -0.42, THROW, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 24),
    cyl(0.03, 0.03, 0.016, -0.295, 0.615, -0.42, LINEN, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.03, 0.03, 0.016, 0.195, 0.615, -0.42, LINEN, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.012, 0.012, 0.02, -0.305, 0.615, -0.42, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.012, 0.012, 0.02, 0.205, 0.615, -0.42, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),

    // folded sage throw draped over the foot
    rbox(0.56, 0.05, 0.3, 0.018, -0.1, 0.545, 0.56, THROW, { mat: 'fabric' }),
    rbox(0.56, 0.025, 0.09, 0.01, -0.1, 0.573, 0.45, '#9dac93', { mat: 'fabric' }),
    rbox(0.56, 0.22, 0.03, 0.013, -0.1, 0.44, 0.72, THROW, { mat: 'fabric' }),
    box(0.5, 0.006, 0.008, -0.1, 0.53, 0.735, '#7f8f78', { mat: 'fabric' }),
    // small brass maker's plate on the side rail
    box(0.006, 0.028, 0.09, -0.383, 0.3, 0.5, C.brass, { mat: 'metal' }),
  ],
})
