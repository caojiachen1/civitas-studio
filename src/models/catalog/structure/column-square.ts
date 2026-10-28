import { C, box, cyl, defineModel, sphere } from '../../kit'

export default defineModel({
  id: 'column-square',
  name: '方柱',
  category: 'structure',
  tags: ['column', 'pillar', '方柱', '结构柱'],
  footprint: [0.46, 0.46],
  height: 3.19,
  placement: 'indoor',
  parts: [
    box(0.42, 0.09, 0.42, 0, 0.045, 0, C.stone),
    box(0.36, 0.08, 0.36, 0, 0.13, 0, C.cream),
    box(0.3, 2.86, 0.3, 0, 1.6, 0, C.white),
    box(0.02, 0.03, 0.3, 0.151, 1.6, 0, C.sand),
    box(0.02, 0.03, 0.3, -0.151, 1.6, 0, C.sand),
    box(0.3, 0.03, 0.02, 0, 1.6, 0.151, C.sand),
    box(0.3, 0.03, 0.02, 0, 1.6, -0.151, C.sand),
    box(0.36, 0.09, 0.36, 0, 3.075, 0, C.cream),
    box(0.44, 0.06, 0.44, 0, 3.14, 0, C.stone),
    cyl(0.11, 0.13, 0.05, 0, 3.045, 0, C.cream, {}, 4),

    // plinth corner chamfers, shaft flutes and anchor bolts
    ...[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) =>
        box(0.045, 0.09, 0.045, sx * 0.185, 0.045, sz * 0.185, C.stone, { mat: 'stone' }),
      ),
    ),
    ...[-1, 1].flatMap((side) =>
      [-0.09, 0, 0.09].flatMap((offset) => [
        box(0.01, 2.62, 0.014, side * 0.151, 1.48, offset, '#dad6cb', { mat: 'stone' }),
        box(0.014, 2.62, 0.01, offset, 1.48, side * 0.151, '#dad6cb', { mat: 'stone' }),
      ]),
    ),
    ...[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => sphere(0.026, sx * 0.135, 3.065, sz * 0.135, C.sand, { mat: 'stone' }, 10)),
    ),
    ...[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => sphere(0.011, sx * 0.16, 0.095, sz * 0.16, C.brass, { mat: 'metal' }, 8)),
    ),
    box(0.32, 0.012, 0.32, 0, 3.175, 0, C.cream, { mat: 'stone' }),
    // rounded corner beads and two crisp capital bands
    ...[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => box(0.016, 2.78, 0.016, sx * 0.145, 1.6, sz * 0.145, '#e6e2d7', { mat: 'stone' })),
    ),
    box(0.38, 0.022, 0.38, 0, 3.045, 0, C.cream, { mat: 'stone' }),
    box(0.4, 0.018, 0.4, 0, 3.128, 0, C.cream, { mat: 'stone' }),
    box(0.32, 0.028, 0.32, 0, 0.186, 0, C.cream, { mat: 'stone' }),
  ],
})
