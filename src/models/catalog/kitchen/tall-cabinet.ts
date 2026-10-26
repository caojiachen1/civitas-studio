import { C, box, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'tall-cabinet',
  name: '高柜食橱',
  category: 'kitchen',
  tags: ['kitchen', 'pantry', 'tall cabinet', '高柜', '食橱', '储物柜'],
  footprint: [0.7, 0.65],
  height: 2.2,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // plinth
    box(0.64, 0.09, 0.5, 0, 0.045, -0.04, C.blackMetal, { mat: 'matte' }),
    box(0.68, 0.014, 0.54, 0, 0.094, -0.035, C.ink),

    // carcass
    box(0.68, 2.06, 0.62, 0, 1.12, -0.015, C.cream, { mat: 'matte' }),
    box(0.02, 2.06, 0.62, -0.34, 1.12, -0.015, C.walnut, { mat: 'wood' }),
    box(0.02, 2.06, 0.62, 0.34, 1.12, -0.015, C.walnut, { mat: 'wood' }),

    // bottom trim and crown
    box(0.7, 0.03, 0.64, 0, 0.105, -0.005, C.walnut, { mat: 'wood' }),
    box(0.7, 0.04, 0.64, 0, 2.17, -0.005, C.walnut, { mat: 'wood' }),
    box(0.7, 0.02, 0.65, 0, 2.19, 0, C.walnut, { mat: 'wood' }),

    // two tall doors with vertical grain
    rbox(0.322, 2.0, 0.026, 0.008, -0.166, 1.125, 0.308, C.oak, { mat: 'wood' }),
    rbox(0.322, 2.0, 0.026, 0.008, 0.166, 1.125, 0.308, C.oak, { mat: 'wood' }),
    box(0.012, 2.0, 0.01, 0, 1.125, 0.298, C.ink),
    box(0.322, 0.008, 0.01, -0.166, 2.118, 0.298, C.ink),
    box(0.322, 0.008, 0.01, 0.166, 2.118, 0.298, C.ink),
    box(0.322, 0.008, 0.01, -0.166, 0.132, 0.298, C.ink),
    box(0.322, 0.008, 0.01, 0.166, 0.132, 0.298, C.ink),

    // integrated handle grooves
    box(0.016, 0.86, 0.012, -0.021, 1.42, 0.316, C.ink),
    box(0.016, 0.86, 0.012, 0.021, 1.42, 0.316, C.ink),
    box(0.008, 0.8, 0.004, -0.03, 1.42, 0.3225, C.brass, { mat: 'metal' }),
    box(0.008, 0.8, 0.004, 0.03, 1.42, 0.3225, C.brass, { mat: 'metal' }),

    // grain strips
    box(0.004, 1.96, 0.003, -0.26, 1.125, 0.322, C.walnut, { mat: 'wood' }),
    box(0.004, 1.96, 0.003, -0.09, 1.125, 0.322, C.walnut, { mat: 'wood' }),
    box(0.004, 1.96, 0.003, -0.2, 1.125, 0.322, C.walnut, { mat: 'wood' }),
    box(0.004, 1.96, 0.003, 0.09, 1.125, 0.322, C.walnut, { mat: 'wood' }),
    box(0.004, 1.96, 0.003, 0.2, 1.125, 0.322, C.walnut, { mat: 'wood' }),
    box(0.004, 1.96, 0.003, 0.27, 1.125, 0.322, C.walnut, { mat: 'wood' }),

    // shadow gaps at the wall side
    box(0.008, 2.04, 0.012, -0.331, 1.12, 0.3, C.ink),
    box(0.008, 2.04, 0.012, 0.331, 1.12, 0.3, C.ink),

    // small brass toe vent
    box(0.4, 0.012, 0.012, 0, 0.06, 0.216, C.brass, { mat: 'metal' }),
  ],
})
