import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const LEGS: [number, number, number][] = [
  [-0.185, 0.185, -0.035],
  [0.185, 0.185, 0.035],
  [-0.185, -0.19, -0.045],
  [0.185, -0.19, 0.045],
]

export default defineModel({
  id: 'dining-chair',
  name: '餐椅',
  category: 'dining',
  tags: ['dining', 'chair', 'upholstered', '餐椅', '椅子', '软包'],
  footprint: [0.5, 0.54],
  height: 0.86,
  placement: 'indoor',
  parts: [
    // upholstered seat with welt
    rbox(0.48, 0.09, 0.49, 0.032, 0, 0.435, 0.005, C.sand, { mat: 'fabric' }),
    rbox(0.47, 0.014, 0.48, 0.02, 0, 0.481, 0.005, C.linen, { mat: 'fabric' }),
    box(0.45, 0.036, 0.46, 0, 0.383, 0.005, C.oak, { mat: 'wood' }),

    // tapered legs with brass ferrules
    ...LEGS.flatMap(([x, z, tilt]) => [
      cyl(0.017, 0.025, 0.39, x, 0.195, z, C.oak, { mat: 'wood', rot: [tilt * 0.35, 0, -tilt] }, 12),
      cyl(0.019, 0.017, 0.022, x + tilt * 0.042, 0.011, z + tilt * 0.014, C.brass, { mat: 'metal' }, 12),
    ]),

    // side rails / footrests
    box(0.024, 0.024, 0.39, -0.19, 0.15, 0, C.oak, { mat: 'wood' }),
    box(0.024, 0.024, 0.39, 0.19, 0.15, 0, C.oak, { mat: 'wood' }),
    box(0.03, 0.03, 0.028, -0.19, 0.15, 0.16, C.brass, { mat: 'metal' }),
    box(0.03, 0.03, 0.028, 0.19, 0.15, 0.16, C.brass, { mat: 'metal' }),
    box(0.03, 0.03, 0.028, -0.19, 0.15, -0.16, C.brass, { mat: 'metal' }),
    box(0.03, 0.03, 0.028, 0.19, 0.15, -0.16, C.brass, { mat: 'metal' }),

    // curved back: upholstered panel with wings
    rbox(0.3, 0.27, 0.062, 0.026, 0, 0.685, -0.226, C.sand, { mat: 'fabric', rot: [-0.09, 0, 0] }),
    rbox(0.15, 0.265, 0.056, 0.024, -0.168, 0.68, -0.2, C.sand, {
      mat: 'fabric',
      rot: [-0.085, 0.5, 0],
    }),
    rbox(0.15, 0.265, 0.056, 0.024, 0.168, 0.68, -0.2, C.sand, {
      mat: 'fabric',
      rot: [-0.085, -0.5, 0],
    }),
    // oak top rail follows the curve
    rbox(0.34, 0.04, 0.07, 0.014, 0, 0.84, -0.226, C.walnut, { mat: 'wood', rot: [-0.09, 0, 0] }),
    rbox(0.1, 0.04, 0.072, 0.014, -0.185, 0.815, -0.208, C.walnut, { mat: 'wood', rot: [-0.09, 0.5, 0] }),
    rbox(0.1, 0.04, 0.072, 0.014, 0.185, 0.815, -0.208, C.walnut, { mat: 'wood', rot: [-0.09, -0.5, 0] }),

    // tufting seams and buttons
    box(0.006, 0.2, 0.006, -0.075, 0.68, -0.192, C.blush, { mat: 'fabric' }),
    box(0.006, 0.2, 0.006, 0.075, 0.68, -0.192, C.blush, { mat: 'fabric' }),
    sphere(0.01, -0.075, 0.76, -0.19, C.cream, { mat: 'fabric' }, 8),
    sphere(0.01, 0.075, 0.76, -0.19, C.cream, { mat: 'fabric' }, 8),

    // rear stiles tying the back to the seat
    cyl(0.019, 0.023, 0.48, -0.198, 0.61, -0.22, C.oak, { mat: 'wood', rot: [-0.1, 0, 0] }, 12),
    cyl(0.019, 0.023, 0.48, 0.198, 0.61, -0.22, C.oak, { mat: 'wood', rot: [-0.1, 0, 0] }, 12),
    box(0.4, 0.03, 0.03, 0, 0.39, -0.232, C.oak, { mat: 'wood' }),

    // lower tuft row, seat edge welt, rear maker's plate and floor glides
    sphere(0.01, -0.075, 0.6, -0.18, C.cream, { mat: 'fabric' }, 8),
    sphere(0.01, 0.075, 0.6, -0.18, C.cream, { mat: 'fabric' }, 8),
    box(0.44, 0.006, 0.006, 0, 0.42, 0.2505, C.linen, { mat: 'fabric' }),
    box(0.006, 0.006, 0.42, -0.2405, 0.42, 0.005, C.linen, { mat: 'fabric' }),
    box(0.006, 0.006, 0.42, 0.2405, 0.42, 0.005, C.linen, { mat: 'fabric' }),
    rbox(0.1, 0.016, 0.004, 0.002, 0, 0.39, -0.2475, C.brass, { mat: 'metal' }),
    ...LEGS.map(([x, z, tilt]) =>
      cyl(0.021, 0.021, 0.005, x + tilt * 0.042, 0.0025, z + tilt * 0.014, C.graphite, { mat: 'matte' }, 12),
    ),
  ],
})
