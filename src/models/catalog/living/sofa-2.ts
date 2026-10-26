import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const LINEN = '#d8ccba'
const LINEN_LIGHT = '#e3d8c7'
const LINEN_DARK = '#c5b7a2'
const SEAM = '#ad9c86'

export default defineModel({
  id: 'sofa-2',
  name: '双人沙发',
  category: 'living',
  tags: ['sofa', 'loveseat', '沙发', '双人位', 'seating', 'linen'],
  footprint: [1.75, 0.95],
  height: 0.86,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // tapered oak legs with brass ferrules
    cyl(0.028, 0.017, 0.13, -0.73, 0.065, -0.30, C.oak, { mat: 'wood' }, 10),
    cyl(0.028, 0.017, 0.13, 0.73, 0.065, -0.30, C.oak, { mat: 'wood' }, 10),
    cyl(0.028, 0.017, 0.13, -0.73, 0.065, 0.35, C.oak, { mat: 'wood' }, 10),
    cyl(0.028, 0.017, 0.13, 0.73, 0.065, 0.35, C.oak, { mat: 'wood' }, 10),
    cyl(0.019, 0.019, 0.012, -0.73, 0.006, -0.30, C.brass, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.012, 0.73, 0.006, -0.30, C.brass, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.012, -0.73, 0.006, 0.35, C.brass, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.012, 0.73, 0.006, 0.35, C.brass, { mat: 'metal' }, 10),

    // upholstered frame and back deck
    rbox(1.62, 0.24, 0.90, 0.05, 0, 0.25, -0.02, LINEN, { mat: 'fabric' }),
    rbox(1.62, 0.46, 0.18, 0.045, 0, 0.58, -0.36, LINEN, { mat: 'fabric' }),
    rbox(1.62, 0.045, 0.19, 0.02, 0, 0.80, -0.36, LINEN_DARK, { mat: 'fabric' }),
    box(1.60, 0.012, 0.014, 0, 0.155, 0.431, '#C5B7A2', { mat: 'fabric' }),

    // two seat cushions with piped front edges
    rbox(0.615, 0.16, 0.66, 0.055, -0.3125, 0.45, 0.05, LINEN_LIGHT, { mat: 'fabric' }),
    rbox(0.615, 0.16, 0.66, 0.055, 0.3125, 0.45, 0.05, LINEN_LIGHT, { mat: 'fabric' }),
    box(0.615, 0.012, 0.012, -0.3125, 0.505, 0.377, SEAM, { mat: 'fabric' }),
    box(0.615, 0.012, 0.012, 0.3125, 0.505, 0.377, SEAM, { mat: 'fabric' }),

    // two angled back cushions
    rbox(0.615, 0.40, 0.17, 0.07, -0.3125, 0.659, -0.235, LINEN_LIGHT, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.615, 0.40, 0.17, 0.07, 0.3125, 0.659, -0.235, LINEN_LIGHT, { mat: 'fabric', rot: [-0.1, 0, 0] }),

    // rolled arms
    rbox(0.19, 0.32, 0.82, 0.06, -0.72, 0.50, -0.06, LINEN, { mat: 'fabric' }),
    rbox(0.19, 0.32, 0.82, 0.06, 0.72, 0.50, -0.06, LINEN, { mat: 'fabric' }),
    cyl(0.082, 0.082, 0.82, -0.72, 0.655, -0.06, '#D8CCBA', { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 18),
    cyl(0.082, 0.082, 0.82, 0.72, 0.655, -0.06, '#D8CCBA', { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 18),
    sphere(0.082, -0.72, 0.655, 0.35, '#D8CCBA', { mat: 'fabric' }, 18),
    sphere(0.082, 0.72, 0.655, 0.35, '#D8CCBA', { mat: 'fabric' }, 18),
    torus(0.06, 0.008, -0.72, 0.655, 0.352, SEAM, { mat: 'fabric' }, 18),
    torus(0.06, 0.008, 0.72, 0.655, 0.352, SEAM, { mat: 'fabric' }, 18),

    // sage velvet cushion with a brass button
    rbox(0.46, 0.28, 0.15, 0.07, -0.34, 0.60, -0.02, C.sage, { mat: 'fabric', rot: [-0.18, -0.06, -0.06] }),
    sphere(0.011, -0.34, 0.60, 0.056, C.brass, { mat: 'metal' }, 10),
  ],
})
