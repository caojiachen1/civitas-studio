import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const OAT = '#c3b7a2'
const OAT_LIGHT = '#cec3ae'
const OAT_DARK = '#b0a38c'
const SEAM = '#90836f'

export default defineModel({
  id: 'sofa-sectional',
  name: 'L 型组合沙发',
  category: 'living',
  tags: ['sectional', 'l-shaped sofa', 'L型沙发', '转角沙发', '组合沙发', '客厅', 'chaise'],
  footprint: [2.9, 2.15],
  height: 0.86,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // tapered walnut legs with brass ferrules
    cyl(0.03, 0.018, 0.145, -1.3, 0.0725, -0.83, C.walnut, { mat: 'wood' }, 10),
    cyl(0.03, 0.018, 0.145, 0.55, 0.0725, -0.83, C.walnut, { mat: 'wood' }, 10),
    cyl(0.03, 0.018, 0.145, 1.3, 0.0725, -0.83, C.walnut, { mat: 'wood' }, 10),
    cyl(0.03, 0.018, 0.145, -1.3, 0.0725, 0.0, C.walnut, { mat: 'wood' }, 10),
    cyl(0.03, 0.018, 0.145, 0.55, 0.0725, 0.98, C.walnut, { mat: 'wood' }, 10),
    cyl(0.03, 0.018, 0.145, 1.3, 0.0725, 0.98, C.walnut, { mat: 'wood' }, 10),
    cyl(0.021, 0.021, 0.016, -1.3, 0.008, -0.83, C.brass, { mat: 'metal' }, 10),
    cyl(0.021, 0.021, 0.016, -1.3, 0.008, 0.0, C.brass, { mat: 'metal' }, 10),
    cyl(0.021, 0.021, 0.016, 0.55, 0.008, 0.98, C.brass, { mat: 'metal' }, 10),
    cyl(0.021, 0.021, 0.016, 1.3, 0.008, 0.98, C.brass, { mat: 'metal' }, 10),

    // main base and chaise base
    rbox(2.78, 0.18, 0.92, 0.03, 0, 0.23, -0.43, OAT_DARK, { mat: 'fabric' }),
    rbox(0.88, 0.18, 0.99, 0.03, 0.95, 0.23, 0.535, OAT_DARK, { mat: 'fabric' }),
    box(2.7, 0.01, 0.01, 0, 0.155, 0.032, C.brass, { mat: 'metal' }),
    box(0.84, 0.01, 0.01, 0.95, 0.155, 1.032, C.brass, { mat: 'metal' }),

    // tall back frame and padded roll
    rbox(2.8, 0.44, 0.16, 0.05, 0, 0.6, -0.97, OAT, { mat: 'fabric' }),
    cyl(0.045, 0.045, 2.8, 0, 0.815, -0.97, OAT, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.032, 0.032, 0.02, -1.405, 0.815, -0.97, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.032, 0.032, 0.02, 1.405, 0.815, -0.97, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(2.76, 0.008, 0.008, 0, 0.55, -0.886, SEAM, { mat: 'fabric' }),
    box(2.76, 0.008, 0.008, 0, 0.7, -0.886, SEAM, { mat: 'fabric' }),

    // two main seat cushions plus the chaise cushion
    rbox(0.86, 0.17, 0.82, 0.06, -0.83, 0.405, -0.4, OAT_LIGHT, { mat: 'fabric' }),
    rbox(0.86, 0.17, 0.82, 0.06, 0.06, 0.405, -0.4, OAT_LIGHT, { mat: 'fabric' }),
    rbox(0.76, 0.17, 1.82, 0.06, 0.9, 0.405, 0.1, OAT_LIGHT, { mat: 'fabric' }),
    // piped front and side edges
    box(0.86, 0.012, 0.012, -0.83, 0.4, 0.014, SEAM, { mat: 'fabric' }),
    box(0.86, 0.012, 0.012, 0.06, 0.4, 0.014, SEAM, { mat: 'fabric' }),
    box(0.76, 0.012, 0.012, 0.9, 0.4, 1.014, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 0.82, -1.262, 0.4, -0.4, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 1.82, 1.282, 0.4, 0.1, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 0.82, 0.502, 0.4, -0.4, SEAM, { mat: 'fabric' }),
    // top stitching lines
    box(0.84, 0.005, 0.008, -0.83, 0.492, -0.12, SEAM, { mat: 'fabric' }),
    box(0.84, 0.005, 0.008, 0.06, 0.492, -0.12, SEAM, { mat: 'fabric' }),
    box(0.74, 0.005, 0.008, 0.9, 0.492, 0.62, SEAM, { mat: 'fabric' }),

    // four loose back cushions
    rbox(0.56, 0.36, 0.16, 0.06, -1.02, 0.645, -0.8, OAT_LIGHT, { mat: 'fabric', rot: [-0.12, 0, 0] }),
    rbox(0.56, 0.36, 0.16, 0.06, -0.44, 0.645, -0.8, OAT_LIGHT, { mat: 'fabric', rot: [-0.12, 0, 0] }),
    rbox(0.56, 0.36, 0.16, 0.06, 0.14, 0.645, -0.8, OAT_LIGHT, { mat: 'fabric', rot: [-0.12, 0, 0] }),
    rbox(0.7, 0.36, 0.16, 0.06, 0.84, 0.645, -0.8, OAT_LIGHT, { mat: 'fabric', rot: [-0.12, 0, 0] }),
    sphere(0.009, -1.02, 0.66, -0.708, SEAM, { mat: 'fabric' }, 8),
    sphere(0.009, -0.44, 0.66, -0.708, SEAM, { mat: 'fabric' }, 8),

    // low left arm and full-length right arm with rolls
    rbox(0.14, 0.28, 0.86, 0.05, -1.33, 0.46, -0.44, OAT, { mat: 'fabric' }),
    cyl(0.05, 0.05, 0.86, -1.33, 0.6, -0.44, OAT, { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 20),
    rbox(0.14, 0.28, 1.88, 0.05, 1.33, 0.46, 0.1, OAT, { mat: 'fabric' }),
    cyl(0.05, 0.05, 1.88, 1.33, 0.6, 0.1, OAT, { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.008, 0.01, 0.84, -1.402, 0.48, -0.44, SEAM, { mat: 'fabric' }),
    box(0.008, 0.01, 1.86, 1.402, 0.48, 0.1, SEAM, { mat: 'fabric' }),

    // accent pillows: sage, clay, navy and a cream lumbar against the arm
    rbox(0.4, 0.34, 0.14, 0.06, -0.85, 0.62, -0.6, C.sage, { mat: 'fabric', rot: [-0.25, 0.14, 0.05] }),
    sphere(0.011, -0.85, 0.637, -0.532, C.brass, { mat: 'metal' }, 10),
    rbox(0.38, 0.32, 0.14, 0.06, -0.2, 0.61, -0.6, C.clay, { mat: 'fabric', rot: [-0.25, -0.1, -0.04] }),
    rbox(0.32, 0.38, 0.13, 0.06, 1.0, 0.63, -0.53, C.navy, { mat: 'fabric', rot: [-0.2, -0.08, 0.03] }),
    rbox(0.18, 0.34, 0.12, 0.05, 1.16, 0.63, 0.4, C.cream, { mat: 'fabric', rot: [-0.05, 0.05, 0.35] }),

    // folded throw over the chaise foot
    rbox(0.72, 0.05, 0.36, 0.018, 0.9, 0.515, 0.82, C.sand, { mat: 'fabric' }),
    rbox(0.72, 0.028, 0.1, 0.01, 0.9, 0.534, 0.72, '#d8cbb6', { mat: 'fabric' }),
    rbox(0.72, 0.2, 0.028, 0.012, 0.9, 0.42, 1.0, C.sand, { mat: 'fabric' }),
    box(0.6, 0.006, 0.008, 0.9, 0.543, 0.66, '#b5a68e', { mat: 'fabric' }),

    // missing brass ferrules on the rear legs and back cushion stitch lines
    cyl(0.021, 0.021, 0.016, 0.55, 0.008, -0.83, C.brass, { mat: 'metal' }, 10),
    cyl(0.021, 0.021, 0.016, 1.3, 0.008, -0.83, C.brass, { mat: 'metal' }, 10),
    box(0.52, 0.005, 0.008, -1.02, 0.72, -0.726, SEAM, { mat: 'fabric', rot: [-0.12, 0, 0] }),
    box(0.52, 0.005, 0.008, -0.44, 0.72, -0.726, SEAM, { mat: 'fabric', rot: [-0.12, 0, 0] }),
    box(0.52, 0.005, 0.008, 0.14, 0.72, -0.726, SEAM, { mat: 'fabric', rot: [-0.12, 0, 0] }),

    // brass nailhead trim on the outer face of the long arm
    sphere(0.008, 1.404, 0.43, -0.65, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 1.404, 0.43, -0.25, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 1.404, 0.43, 0.15, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 1.404, 0.43, 0.55, C.brass, { mat: 'metal' }, 8),
  ],
})
