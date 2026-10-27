import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const signBlue = '#3f5d7a'
const signWhite = '#eae6dc'

export default defineModel({
  id: 'crosswalk-sign',
  name: '人行横道标志',
  category: 'street',
  tags: ['crosswalk', 'pedestrian', 'sign', '人行横道', '标志', '斑马线'],
  footprint: [0.6, 0.15],
  height: 2.6,
  placement: 'outdoor',
  parts: [
    // base plate, anchor bolts and pole collar
    rounded(0.42, 0.04, 0.14, 0.012, 0, 0.02, 0, C.graphite, { mat: 'metal' }),
    ...[0.16, -0.16].flatMap((x) =>
      [0.045, -0.045].map((z) => cyl(0.011, 0.011, 0.016, x, 0.045, z, C.steel, { mat: 'metal' }, 8)),
    ),
    cyl(0.032, 0.04, 2.52, 0, 1.3, -0.02, C.steel, { mat: 'metal' }, 24),
    cyl(0.045, 0.052, 0.06, 0, 0.07, -0.02, C.graphite, { mat: 'metal' }, 20),
    torus(0.036, 0.006, 0, 1.4, -0.02, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    torus(0.036, 0.006, 0, 2.0, -0.02, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),

    // square sign: white rim, blue face, thin white inner border
    rounded(0.56, 0.56, 0.02, 0.012, 0, 2.3, 0.03, signWhite, { mat: 'matte' }),
    rounded(0.5, 0.5, 0.018, 0.008, 0, 2.3, 0.049, signBlue, { mat: 'matte' }),
    box(0.46, 0.012, 0.003, 0, 2.544, 0.0595, signWhite, { mat: 'matte' }),
    box(0.46, 0.012, 0.003, 0, 2.056, 0.0595, signWhite, { mat: 'matte' }),
    box(0.012, 0.46, 0.003, 0.23, 2.3, 0.0595, signWhite, { mat: 'matte' }),
    box(0.012, 0.46, 0.003, -0.23, 2.3, 0.0595, signWhite, { mat: 'matte' }),

    // zebra crossing bars
    ...[2.1, 2.14, 2.18, 2.22].map((y) =>
      box(0.34, 0.026, 0.003, 0, y, 0.0625, signWhite, { mat: 'matte' }),
    ),

    // walking pedestrian pictogram
    box(0.05, 0.1, 0.003, 0, 2.37, 0.0625, signWhite, { mat: 'matte' }),
    cyl(0.024, 0.024, 0.003, 0, 2.44, 0.0635, signWhite, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 12),
    box(0.024, 0.1, 0.003, -0.022, 2.3, 0.0625, signWhite, { mat: 'matte', rot: [0, 0, 0.28] }),
    box(0.024, 0.1, 0.003, 0.022, 2.3, 0.0625, signWhite, { mat: 'matte', rot: [0, 0, -0.28] }),
    box(0.018, 0.08, 0.003, -0.036, 2.365, 0.0625, signWhite, { mat: 'matte', rot: [0, 0, 0.6] }),
    box(0.018, 0.08, 0.003, 0.036, 2.365, 0.0625, signWhite, { mat: 'matte', rot: [0, 0, -0.6] }),

    // pole clamps holding the panel
    rounded(0.06, 0.03, 0.03, 0.006, 0, 2.42, 0.005, C.graphite, { mat: 'metal' }),
    rounded(0.06, 0.03, 0.03, 0.006, 0, 2.18, 0.005, C.graphite, { mat: 'metal' }),

    // auxiliary instruction plate lower on the pole
    rounded(0.34, 0.12, 0.02, 0.008, 0, 1.9, 0.02, C.cream, { mat: 'matte' }),
    box(0.26, 0.018, 0.004, 0, 1.92, 0.0315, C.navy),
    box(0.2, 0.012, 0.004, 0, 1.875, 0.0315, C.red),

    // pressed pole cap
    cyl(0.04, 0.045, 0.04, 0, 2.58, -0.02, C.graphite, { mat: 'metal' }, 20),
  ],
})
