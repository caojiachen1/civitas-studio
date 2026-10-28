import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const BURNERS: [number, number][] = [
  [-0.19, -0.19],
  [0.19, -0.19],
  [-0.19, 0.1],
  [0.19, 0.1],
]
const KNOBS = [-0.27, -0.135, 0, 0.135, 0.27]

export default defineModel({
  id: 'stove',
  name: '灶台烤箱',
  category: 'kitchen',
  tags: ['kitchen', 'stove', 'range', 'oven', '灶台', '烤箱', '燃气灶'],
  footprint: [0.8, 0.65],
  height: 0.92,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // plinth and levelling feet
    box(0.76, 0.06, 0.48, 0, 0.03, -0.055, C.blackMetal, { mat: 'matte' }),
    cyl(0.022, 0.026, 0.05, -0.33, 0.025, 0.19, C.graphite, { mat: 'metal' }, 12),
    cyl(0.022, 0.026, 0.05, 0.33, 0.025, 0.19, C.graphite, { mat: 'metal' }, 12),

    // stainless body
    box(0.8, 0.82, 0.58, 0, 0.47, -0.035, C.steel, { mat: 'metal' }),
    box(0.78, 0.05, 0.03, 0, 0.086, 0.258, C.steel, { mat: 'metal' }),
    box(0.8, 0.012, 0.02, 0, 0.878, -0.31, C.graphite, { mat: 'metal' }),

    // black glass cooktop
    box(0.8, 0.022, 0.58, 0, 0.891, -0.035, C.ink, { mat: 'gloss' }),
    box(0.8, 0.014, 0.58, 0, 0.877, -0.035, C.steel, { mat: 'metal' }),

    // four burners with cast iron grates
    ...BURNERS.flatMap(([x, z]) => [
      torus(0.078, 0.008, x, 0.904, z, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
      cyl(0.058, 0.062, 0.012, x, 0.906, z, C.ink, { mat: 'metal' }, 20),
      cyl(0.026, 0.03, 0.01, x, 0.915, z, C.blackMetal, { mat: 'metal' }, 16),
      box(0.19, 0.009, 0.014, x, 0.916, z, C.blackMetal, { mat: 'metal' }),
      box(0.014, 0.009, 0.19, x, 0.916, z, C.blackMetal, { mat: 'metal' }),
    ]),

    // control panel with knobs
    box(0.78, 0.15, 0.026, 0, 0.795, 0.258, C.steel, { mat: 'metal' }),
    box(0.72, 0.1, 0.012, 0, 0.795, 0.274, C.ink, { mat: 'gloss' }),
    ...KNOBS.flatMap((x) => [
      cyl(0.028, 0.03, 0.024, x, 0.795, 0.29, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
      box(0.006, 0.02, 0.006, x, 0.805, 0.303, C.brass, { mat: 'metal' }),
    ]),

    // oven door with glass window
    rbox(0.76, 0.54, 0.032, 0.012, 0, 0.405, 0.27, C.concrete, { mat: 'metal' }),
    box(0.6, 0.32, 0.006, 0, 0.44, 0.288, C.glass, { mat: 'glass', opacity: 0.7 }),
    box(0.62, 0.02, 0.014, 0, 0.59, 0.287, C.blackMetal, { mat: 'metal' }),
    box(0.62, 0.02, 0.014, 0, 0.29, 0.287, C.blackMetal, { mat: 'metal' }),
    box(0.02, 0.32, 0.014, -0.3, 0.44, 0.287, C.blackMetal, { mat: 'metal' }),
    box(0.02, 0.32, 0.014, 0.3, 0.44, 0.287, C.blackMetal, { mat: 'metal' }),
    box(0.5, 0.014, 0.006, 0, 0.365, 0.29, C.steel, { mat: 'metal' }),

    // handle bar
    cyl(0.016, 0.016, 0.62, 0, 0.65, 0.303, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    box(0.028, 0.028, 0.04, -0.28, 0.65, 0.286, C.steel, { mat: 'metal' }),
    box(0.028, 0.028, 0.04, 0.28, 0.65, 0.286, C.steel, { mat: 'metal' }),

    // seams
    box(0.78, 0.008, 0.012, 0, 0.112, 0.26, C.ink),
    box(0.008, 0.54, 0.008, -0.386, 0.405, 0.272, C.ink),
    box(0.008, 0.54, 0.008, 0.386, 0.405, 0.272, C.ink),

    // low rear splashboard with a rolled top edge
    box(0.8, 0.016, 0.024, 0, 0.91, -0.313, C.steel, { mat: 'metal' }),
    cyl(0.004, 0.004, 0.78, 0, 0.916, -0.313, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    // cooling vents between the control panel and the oven door
    ...[-0.018, -0.006, 0.006, 0.018].map((dy) =>
      box(0.5, 0.006, 0.004, 0, 0.6975 + dy, 0.256, C.ink, { mat: 'matte' }),
    ),
    // panel screws and oven hinge pins
    ...[
      [-0.36, 0.85],
      [0.36, 0.85],
      [-0.36, 0.74],
      [0.36, 0.74],
    ].map(([x, y]) =>
      cyl(0.006, 0.006, 0.005, x, y, 0.2725, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    ),
    cyl(0.009, 0.009, 0.008, -0.3, 0.155, 0.2895, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.009, 0.009, 0.008, 0.3, 0.155, 0.2895, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
  ],
})
