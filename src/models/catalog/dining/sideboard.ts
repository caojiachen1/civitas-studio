import { C, box, cyl, defineModel, ico, torus } from '../../kit'

const DOORS = [-0.51, 0, 0.51]
const FLUTES = [-0.15, -0.09, -0.03, 0.03, 0.09, 0.15]
const LEG_X = [-0.68, 0.68]
const LEG_Z = [-0.145, 0.135]

export default defineModel({
  id: 'sideboard',
  name: '餐边柜',
  category: 'dining',
  tags: ['dining', 'sideboard', 'buffet', '餐边柜', '边柜', 'fluted'],
  footprint: [1.6, 0.45],
  height: 1.39,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // carcass
    box(1.54, 0.56, 0.4, 0, 0.48, -0.01, C.walnut, { mat: 'wood' }),
    box(1.54, 0.56, 0.02, 0, 0.48, -0.2, C.oak, { mat: 'wood' }),
    box(1.5, 0.02, 0.38, 0, 0.205, -0.01, C.ink),

    // stone top
    box(1.6, 0.04, 0.45, 0, 0.78, 0, C.stone, { mat: 'stone' }),
    box(1.6, 0.006, 0.45, 0, 0.802, 0, C.concrete, { mat: 'stone' }),
    box(1.6, 0.014, 0.012, 0, 0.773, 0.219, C.concrete, { mat: 'stone' }),

    // raised legs with brass ferrules
    ...LEG_X.flatMap((x) =>
      LEG_Z.flatMap((z) => [
        cyl(0.019, 0.032, 0.2, x, 0.1, z, C.walnut, { mat: 'wood' }, 12),
        cyl(0.02, 0.024, 0.022, x, 0.011, z, C.brass, { mat: 'metal' }, 12),
      ]),
    ),

    // three fluted doors
    ...DOORS.flatMap((x) => [
      box(0.48, 0.5, 0.022, x, 0.48, 0.195, C.oak, { mat: 'wood' }),
      ...FLUTES.map((dx) => cyl(0.026, 0.026, 0.5, x + dx, 0.48, 0.193, C.oak, { mat: 'wood' }, 12)),
      // crisp shadow seam between doors
      box(0.012, 0.53, 0.01, x + 0.255, 0.48, 0.198, C.ink),
      // slim brass pull
      box(0.014, 0.16, 0.012, x + 0.225, 0.51, 0.216, C.brass, { mat: 'metal' }),
      box(0.026, 0.012, 0.014, x + 0.225, 0.585, 0.212, C.brass, { mat: 'metal' }),
    ]),
    // top rail shadow line
    box(1.5, 0.01, 0.012, 0, 0.722, 0.197, C.ink),

    // vase with branches
    cyl(0.072, 0.1, 0.26, -0.46, 0.932, -0.03, C.cream, { mat: 'ceramic' }, 24),
    cyl(0.052, 0.062, 0.05, -0.46, 1.087, -0.03, C.white, { mat: 'ceramic' }, 20),
    cyl(0.007, 0.007, 0.2, -0.5, 1.2, -0.03, C.leafDeep, { mat: 'matte', rot: [0.1, 0, 0.2] }, 6),
    ico(0.085, -0.53, 1.29, -0.04, C.leaf, { mat: 'foliage' }, 1),
    ico(0.065, -0.42, 1.26, -0.02, C.leafLight, { mat: 'foliage' }, 1),
    ico(0.05, -0.47, 1.33, -0.06, C.leafDeep, { mat: 'foliage' }, 0),

    // stacked stoneware bowls
    cyl(0.135, 0.085, 0.06, 0.1, 0.832, 0.02, C.white, { mat: 'ceramic' }, 24),
    torus(0.132, 0.006, 0.1, 0.859, 0.02, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.115, 0.07, 0.05, 0.1, 0.892, 0.02, C.sage, { mat: 'ceramic' }, 24),

    // wine glasses
    ...[-0.1, 0.02].flatMap((dx) => [
      cyl(0.036, 0.036, 0.006, 0.44 + dx, 0.803, 0.06, C.glass, { mat: 'glass', opacity: 0.8 }, 16),
      cyl(0.006, 0.006, 0.075, 0.44 + dx, 0.843, 0.06, C.glass, { mat: 'glass', opacity: 0.8 }, 8),
      cyl(0.042, 0.028, 0.085, 0.44 + dx, 0.923, 0.06, C.glass, { mat: 'glass', opacity: 0.8 }, 20),
    ]),
  ],
})
