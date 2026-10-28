import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const LEATHER = '#8a6449'
const LEATHER_LIGHT = '#94704f'
const LEATHER_DARK = '#6b4b36'

export default defineModel({
  id: 'ottoman',
  name: '脚凳',
  category: 'living',
  tags: ['ottoman', 'pouf', '脚凳', 'leather', 'tufted'],
  footprint: [0.72, 0.62],
  height: 0.42,
  placement: 'indoor',
  parts: [
    // tapered oak legs with brass ferrules
    cyl(0.026, 0.016, 0.13, -0.28, 0.065, -0.22, C.oak, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.13, 0.28, 0.065, -0.22, C.oak, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.13, -0.28, 0.065, 0.22, C.oak, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.13, 0.28, 0.065, 0.22, C.oak, { mat: 'wood' }, 10),
    cyl(0.017, 0.017, 0.012, -0.28, 0.006, -0.22, C.brass, { mat: 'metal' }, 10),
    cyl(0.017, 0.017, 0.012, 0.28, 0.006, -0.22, C.brass, { mat: 'metal' }, 10),
    cyl(0.017, 0.017, 0.012, -0.28, 0.006, 0.22, C.brass, { mat: 'metal' }, 10),
    cyl(0.017, 0.017, 0.012, 0.28, 0.006, 0.22, C.brass, { mat: 'metal' }, 10),

    // upholstered body and tufted top
    rbox(0.68, 0.06, 0.58, 0.02, 0, 0.16, 0, '#6B4B36', { mat: 'leather' }),
    rbox(0.72, 0.17, 0.62, 0.035, 0, 0.265, 0, LEATHER, { mat: 'leather' }),
    rbox(0.72, 0.055, 0.62, 0.028, 0, 0.3775, 0, LEATHER_LIGHT, { mat: 'leather' }),
    rbox(0.706, 0.012, 0.606, 0.006, 0, 0.348, 0, '#6B4B36', { mat: 'leather' }),

    // tufting seams
    box(0.68, 0.004, 0.006, 0, 0.4045, -0.15, LEATHER_DARK, { mat: 'leather' }),
    box(0.68, 0.004, 0.006, 0, 0.4045, 0.15, LEATHER_DARK, { mat: 'leather' }),
    box(0.006, 0.004, 0.58, -0.18, 0.4045, 0, LEATHER_DARK, { mat: 'leather' }),
    box(0.006, 0.004, 0.58, 0.18, 0.4045, 0, LEATHER_DARK, { mat: 'leather' }),

    // buttons
    sphere(0.01, -0.18, 0.41, -0.15, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.01, 0.18, 0.41, -0.15, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.01, -0.18, 0.41, 0.15, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.01, 0.18, 0.41, 0.15, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.01, 0, 0.41, 0, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.01, 0, 0.41, -0.15, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.01, 0, 0.41, 0.15, LEATHER_DARK, { mat: 'leather' }, 10),

    // brass corner studs
    sphere(0.008, -0.33, 0.30, 0.302, C.brass, { mat: 'metal' }, 10),
    sphere(0.008, 0.33, 0.30, 0.302, C.brass, { mat: 'metal' }, 10),

    // nailhead trim along both long sides and a leather pull tab
    ...[-0.27, -0.09, 0.09, 0.27].flatMap((x) => [
      sphere(0.008, x, 0.30, -0.312, C.brass, { mat: 'metal' }, 8),
      sphere(0.008, x, 0.30, 0.312, C.brass, { mat: 'metal' }, 8),
    ]),
    rbox(0.012, 0.14, 0.09, 0.005, -0.365, 0.27, 0, LEATHER_DARK, { mat: 'leather' }),
    sphere(0.007, -0.372, 0.33, 0, C.brass, { mat: 'metal' }, 8),
    sphere(0.007, -0.372, 0.21, 0, C.brass, { mat: 'metal' }, 8),
  ],
})
