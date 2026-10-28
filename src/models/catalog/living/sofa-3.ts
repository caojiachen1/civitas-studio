import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const SAGE = '#8fa087'
const SAGE_LIGHT = '#9cac93'
const SAGE_DARK = '#7d8d75'
const SEAM = '#6d7d67'

export default defineModel({
  id: 'sofa-3',
  name: '三人沙发',
  category: 'living',
  tags: ['sofa', 'couch', '沙发', '三人位', 'seating', 'sage'],
  footprint: [2.35, 0.95],
  height: 0.86,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // tapered oak legs with brass ferrules
    cyl(0.028, 0.017, 0.13, -1.03, 0.065, -0.30, C.oak, { mat: 'wood' }, 10),
    cyl(0.028, 0.017, 0.13, 1.03, 0.065, -0.30, C.oak, { mat: 'wood' }, 10),
    cyl(0.028, 0.017, 0.13, -1.03, 0.065, 0.35, C.oak, { mat: 'wood' }, 10),
    cyl(0.028, 0.017, 0.13, 1.03, 0.065, 0.35, C.oak, { mat: 'wood' }, 10),
    cyl(0.019, 0.019, 0.012, -1.03, 0.006, -0.30, C.brass, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.012, 1.03, 0.006, -0.30, C.brass, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.012, -1.03, 0.006, 0.35, C.brass, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.012, 1.03, 0.006, 0.35, C.brass, { mat: 'metal' }, 10),

    // upholstered frame and back deck
    rbox(2.20, 0.24, 0.90, 0.05, 0, 0.25, -0.02, SAGE, { mat: 'fabric' }),
    rbox(2.20, 0.46, 0.18, 0.045, 0, 0.58, -0.36, SAGE, { mat: 'fabric' }),
    rbox(2.20, 0.045, 0.19, 0.02, 0, 0.80, -0.36, SAGE_DARK, { mat: 'fabric' }),
    box(2.18, 0.012, 0.014, 0, 0.155, 0.431, '#7D8D75', { mat: 'fabric' }),

    // three seat cushions with piped front edges
    rbox(0.585, 0.16, 0.66, 0.055, -0.604, 0.45, 0.05, SAGE_LIGHT, { mat: 'fabric' }),
    rbox(0.585, 0.16, 0.66, 0.055, 0, 0.45, 0.05, SAGE_LIGHT, { mat: 'fabric' }),
    rbox(0.585, 0.16, 0.66, 0.055, 0.604, 0.45, 0.05, SAGE_LIGHT, { mat: 'fabric' }),
    box(0.585, 0.012, 0.012, -0.604, 0.505, 0.377, SEAM, { mat: 'fabric' }),
    box(0.585, 0.012, 0.012, 0, 0.505, 0.377, SEAM, { mat: 'fabric' }),
    box(0.585, 0.012, 0.012, 0.604, 0.505, 0.377, SEAM, { mat: 'fabric' }),

    // three angled back cushions
    rbox(0.585, 0.40, 0.17, 0.07, -0.604, 0.659, -0.235, SAGE_LIGHT, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.585, 0.40, 0.17, 0.07, 0, 0.659, -0.235, SAGE_LIGHT, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.585, 0.40, 0.17, 0.07, 0.604, 0.659, -0.235, SAGE_LIGHT, { mat: 'fabric', rot: [-0.1, 0, 0] }),

    // rolled arms
    rbox(0.20, 0.32, 0.82, 0.06, -1.00, 0.50, -0.06, SAGE, { mat: 'fabric' }),
    rbox(0.20, 0.32, 0.82, 0.06, 1.00, 0.50, -0.06, SAGE, { mat: 'fabric' }),
    cyl(0.085, 0.085, 0.82, -1.00, 0.655, -0.06, '#8FA087', { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 18),
    cyl(0.085, 0.085, 0.82, 1.00, 0.655, -0.06, '#8FA087', { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 18),
    sphere(0.085, -1.00, 0.655, 0.35, '#8FA087', { mat: 'fabric' }, 18),
    sphere(0.085, 1.00, 0.655, 0.35, '#8FA087', { mat: 'fabric' }, 18),
    torus(0.062, 0.008, -1.00, 0.655, 0.352, SEAM, { mat: 'fabric' }, 18),
    torus(0.062, 0.008, 1.00, 0.655, 0.352, SEAM, { mat: 'fabric' }, 18),

    // linen lumbar pillow with a brass button
    rbox(0.52, 0.30, 0.16, 0.075, 0.42, 0.60, -0.02, C.cream, { mat: 'fabric', rot: [-0.18, 0.05, 0.06] }),
    sphere(0.012, 0.42, 0.60, 0.062, C.brass, { mat: 'metal' }, 10),

    // seat cushion side piping, back channel seams and top rail welt
    box(0.012, 0.012, 0.66, -0.8965, 0.505, 0.05, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 0.66, 0.8965, 0.505, 0.05, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 0.66, -0.3115, 0.505, 0.05, SEAM, { mat: 'fabric' }),
    box(0.012, 0.012, 0.66, 0.3115, 0.505, 0.05, SEAM, { mat: 'fabric' }),
    box(0.006, 0.34, 0.006, -0.86, 0.659, -0.148, SEAM, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    box(0.006, 0.34, 0.006, 0.86, 0.659, -0.148, SEAM, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    box(2.18, 0.008, 0.008, 0, 0.803, -0.26, SEAM, { mat: 'fabric' }),
  ],
})
