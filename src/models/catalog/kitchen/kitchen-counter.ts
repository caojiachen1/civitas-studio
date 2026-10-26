import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const COLUMNS = [-0.585, 0, 0.585]

export default defineModel({
  id: 'kitchen-counter',
  name: '厨房地柜',
  category: 'kitchen',
  tags: ['kitchen', 'counter', 'base cabinet', '橱柜', '地柜', '台面'],
  footprint: [1.8, 0.65],
  height: 0.92,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed toe kick
    box(1.64, 0.09, 0.46, 0, 0.045, -0.045, C.blackMetal, { mat: 'matte' }),
    box(1.7, 0.014, 0.5, 0, 0.094, -0.04, C.ink),

    // carcass
    box(1.76, 0.75, 0.58, 0, 0.465, -0.025, C.cream, { mat: 'matte' }),
    box(0.028, 0.78, 0.6, -0.874, 0.465, -0.02, C.walnut, { mat: 'wood' }),
    box(0.028, 0.78, 0.6, 0.874, 0.465, -0.02, C.walnut, { mat: 'wood' }),
    box(1.76, 0.028, 0.02, 0, 0.826, 0.272, C.cream, { mat: 'matte' }),

    // stone worktop + short upstand
    box(1.8, 0.04, 0.65, 0, 0.86, 0, C.stone, { mat: 'stone' }),
    box(1.8, 0.046, 0.016, 0, 0.857, 0.316, C.concrete, { mat: 'stone' }),
    box(1.8, 0.04, 0.022, 0, 0.9, -0.314, C.stone, { mat: 'stone' }),
    box(1.8, 0.008, 0.022, 0, 0.916, -0.314, C.concrete, { mat: 'stone' }),

    // doors and drawers
    ...COLUMNS.flatMap((x) => [
      rbox(0.548, 0.48, 0.022, 0.007, x, 0.36, 0.276, C.oak, { mat: 'wood' }),
      rbox(0.548, 0.155, 0.022, 0.007, x, 0.71, 0.276, C.oak, { mat: 'wood' }),
      // recessed handle rail on door
      box(0.44, 0.03, 0.014, x, 0.566, 0.27, C.ink),
      box(0.28, 0.016, 0.016, x, 0.566, 0.282, C.brass, { mat: 'metal' }),
      // drawer pull
      box(0.3, 0.016, 0.018, x, 0.71, 0.292, C.brass, { mat: 'metal' }),
      // thin grain strips
      box(0.004, 0.46, 0.003, x - 0.17, 0.36, 0.2875, C.walnut, { mat: 'wood' }),
      box(0.004, 0.46, 0.003, x + 0.09, 0.36, 0.2875, C.walnut, { mat: 'wood' }),
      box(0.004, 0.14, 0.003, x - 0.06, 0.71, 0.2875, C.walnut, { mat: 'wood' }),
      // crisp vertical seam between columns
      box(0.012, 0.7, 0.008, x + 0.29, 0.47, 0.267, C.ink),
    ]),

    // decorative bowl on the worktop
    cyl(0.152, 0.1, 0.038, 0.44, 0.899, 0.06, C.white, { mat: 'ceramic' }, 24),
    torus(0.15, 0.006, 0.44, 0.917, 0.06, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.128, 0.128, 0.004, 0.44, 0.901, 0.06, C.sand, { mat: 'ceramic' }, 24),
  ],
})
