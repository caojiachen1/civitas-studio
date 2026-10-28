import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const SLATS = Array.from({ length: 12 }, (_, i) => -0.825 + i * 0.15)

export default defineModel({
  id: 'kitchen-island',
  name: '中岛台',
  category: 'kitchen',
  tags: ['kitchen', 'island', 'counter', '中岛', '岛台', '备餐台'],
  footprint: [1.8, 0.95],
  height: 1.0,
  placement: 'indoor',
  parts: [
    // stone top with waterfall ends
    box(1.8, 0.05, 0.95, 0, 0.925, 0, C.stone, { mat: 'stone' }),
    box(0.05, 0.9, 0.95, -0.875, 0.45, 0, C.stone, { mat: 'stone' }),
    box(0.05, 0.9, 0.95, 0.875, 0.45, 0, C.stone, { mat: 'stone' }),
    box(1.79, 0.012, 0.94, 0, 0.906, 0, C.concrete, { mat: 'stone' }),

    // cabinet body and recessed plinth
    box(1.7, 0.81, 0.56, 0, 0.495, -0.11, C.cream, { mat: 'matte' }),
    box(1.7, 0.81, 0.02, 0, 0.495, -0.39, C.oak, { mat: 'wood' }),
    box(1.6, 0.09, 0.44, 0, 0.045, -0.14, C.blackMetal, { mat: 'matte' }),

    // slatted oak front
    box(1.66, 0.8, 0.012, 0, 0.49, 0.166, C.ink),
    ...SLATS.map((x) => box(0.115, 0.78, 0.026, x, 0.485, 0.176, C.oak, { mat: 'wood' })),
    box(1.68, 0.026, 0.034, 0, 0.87, 0.176, C.walnut, { mat: 'wood' }),
    box(1.68, 0.026, 0.034, 0, 0.1, 0.176, C.walnut, { mat: 'wood' }),
    box(1.66, 0.006, 0.004, 0, 0.73, 0.19, C.brass, { mat: 'metal' }),

    // steel brackets supporting the seating overhang
    box(0.05, 0.05, 0.26, -0.7, 0.875, 0.3, C.blackMetal, { mat: 'metal' }),
    box(0.05, 0.05, 0.26, 0.7, 0.875, 0.3, C.blackMetal, { mat: 'metal' }),

    // cutting board and stoneware bowl
    rbox(0.36, 0.024, 0.24, 0.012, -0.52, 0.962, 0.02, C.birch, { mat: 'wood' }),
    cyl(0.155, 0.095, 0.04, 0.42, 0.97, -0.05, C.white, { mat: 'ceramic' }, 24),
    torus(0.152, 0.006, 0.42, 0.985, -0.05, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),

    // brass towel bar with a linen towel on the left waterfall end
    cyl(0.011, 0.011, 0.5, -0.912, 0.74, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.009, 0.009, 0.026, -0.9, 0.74, -0.24, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.009, 0.009, 0.026, -0.9, 0.74, 0.24, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    rbox(0.014, 0.3, 0.34, 0.005, -0.916, 0.6, 0.02, C.linen, { mat: 'fabric' }),
    box(0.002, 0.006, 0.34, -0.924, 0.53, 0.02, C.sand, { mat: 'fabric' }),
    // mitre seams on the stone waterfall ends
    box(0.004, 0.88, 0.006, -0.9005, 0.45, 0.467, C.concrete, { mat: 'stone' }),
    box(0.004, 0.88, 0.006, -0.9005, 0.45, -0.467, C.concrete, { mat: 'stone' }),
    box(0.004, 0.88, 0.006, 0.9005, 0.45, 0.467, C.concrete, { mat: 'stone' }),
    box(0.004, 0.88, 0.006, 0.9005, 0.45, -0.467, C.concrete, { mat: 'stone' }),
    // adjustable foot glides under the plinth
    ...[-0.7, 0.7].flatMap((x) => [
      cyl(0.027, 0.027, 0.004, x, 0.0, -0.3, C.graphite, { mat: 'matte' }, 12),
      cyl(0.027, 0.027, 0.004, x, 0.0, 0.02, C.graphite, { mat: 'matte' }, 12),
    ]),
  ],
})
