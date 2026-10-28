import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bodyPaint = C.navy
const metal = C.steel

export default defineModel({
  id: 'trash-bin',
  name: '垃圾桶',
  category: 'street',
  tags: ['trash', 'bin', 'litter', '垃圾桶', '环卫'],
  footprint: [0.45, 0.45],
  height: 1.0,
  placement: 'outdoor',
  parts: [
    // base foot and body
    cyl(0.2, 0.215, 0.05, 0, 0.025, 0, C.graphite, { mat: 'metal' }, 24),
    cyl(0.2, 0.182, 0.74, 0, 0.42, 0, bodyPaint, { mat: 'metal' }, 24),
    torus(0.203, 0.011, 0, 0.22, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.201, 0.011, 0, 0.64, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),

    // staved ribs
    rounded(0.018, 0.66, 0.014, 0.005, 0.134, 0.42, 0.134, metal, { mat: 'metal', rot: [0, Math.PI / 4, 0] }),
    rounded(0.018, 0.66, 0.014, 0.005, -0.134, 0.42, 0.134, metal, { mat: 'metal', rot: [0, -Math.PI / 4, 0] }),
    rounded(0.018, 0.66, 0.014, 0.005, 0.134, 0.42, -0.134, metal, { mat: 'metal', rot: [0, -Math.PI / 4, 0] }),
    rounded(0.018, 0.66, 0.014, 0.005, -0.134, 0.42, -0.134, metal, { mat: 'metal', rot: [0, Math.PI / 4, 0] }),

    // disposal mouth with pressed steel surround
    box(0.24, 0.09, 0.018, 0, 0.705, 0.196, C.ink),
    rounded(0.28, 0.026, 0.05, 0.008, 0, 0.757, 0.181, metal, { mat: 'metal' }),
    rounded(0.26, 0.02, 0.04, 0.006, 0, 0.652, 0.184, metal, { mat: 'metal' }),
    rounded(0.025, 0.1, 0.04, 0.006, 0.145, 0.705, 0.181, metal, { mat: 'metal' }),
    rounded(0.025, 0.1, 0.04, 0.006, -0.145, 0.705, 0.181, metal, { mat: 'metal' }),

    // lid assembly
    cyl(0.225, 0.222, 0.05, 0, 0.815, 0, C.graphite, { mat: 'metal' }, 24),
    torus(0.213, 0.012, 0, 0.792, 0, metal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.12, 0.225, 0.09, 0, 0.885, 0, C.graphite, { mat: 'metal' }, 24),
    cyl(0.135, 0.135, 0.03, 0, 0.945, 0, metal, { mat: 'metal' }, 24),
    cyl(0.045, 0.055, 0.04, 0, 0.98, 0, C.brass, { mat: 'metal' }, 16),
    sphere(0.012, 0.12, 0.84, 0.16, C.steel, { mat: 'metal' }, 10),

    // small collection plaque
    rounded(0.1, 0.07, 0.01, 0.004, 0, 0.5, 0.198, C.cream, { mat: 'matte' }),
    box(0.062, 0.012, 0.004, 0, 0.517, 0.205, C.navy),
    box(0.045, 0.012, 0.004, 0, 0.497, 0.205, C.navy),

    // base bolts
    sphere(0.01, 0.17, 0.05, 0.06, metal, { mat: 'metal' }, 8),
    sphere(0.01, -0.17, 0.05, 0.06, metal, { mat: 'metal' }, 8),
    sphere(0.01, 0.17, 0.05, -0.06, metal, { mat: 'metal' }, 8),

    // foot pedal with linkage, lid hinge and front lock tab
    rounded(0.16, 0.03, 0.09, 0.012, 0, 0.03, 0.21, metal, { mat: 'metal' }),
    box(0.025, 0.03, 0.14, 0.05, 0.045, 0.15, C.steel, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.76, 0.05, 0.42, -0.17, C.steel, { mat: 'metal' }, 8),
    ...[0.08, -0.08].map((x) =>
      rounded(0.06, 0.035, 0.04, 0.008, x, 0.842, -0.2, C.steel, { mat: 'metal' }),
    ),
    rounded(0.07, 0.05, 0.025, 0.008, 0, 0.78, 0.215, C.brass, { mat: 'metal' }),
    box(0.022, 0.028, 0.012, 0, 0.775, 0.23, C.ink),

    // liner rim peeking under the lid
    torus(0.198, 0.014, 0, 0.755, 0, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 24),

    // two-stream recycling label and vent slits
    rounded(0.14, 0.1, 0.006, 0.004, -0.09, 0.44, 0.2, '#7fa06f', { mat: 'matte' }),
    rounded(0.14, 0.1, 0.006, 0.004, 0.07, 0.44, 0.2, '#6c8fa0', { mat: 'matte' }),
    box(0.06, 0.012, 0.004, -0.09, 0.45, 0.205, C.cream),
    box(0.06, 0.012, 0.004, 0.07, 0.45, 0.205, C.cream),
    ...Array.from({ length: 5 }, (_, i) =>
      box(0.005, 0.075, 0.002, -0.13 + i * 0.065, 0.6, -0.198, C.ink, { mat: 'matte' }),
    ),

    // rubber tread on the foot pedal
    box(0.13, 0.008, 0.07, 0, 0.049, 0.21, '#2c3033', { mat: 'matte' }),

    // caulk bead bedding the base on the paving
    torus(0.213, 0.005, 0, 0.004, 0, '#a9a69c', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 28),

    // hinge barrels through the lid hinge blocks
    cyl(0.007, 0.007, 0.07, 0.08, 0.842, -0.222, metal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.007, 0.007, 0.07, -0.08, 0.842, -0.222, metal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
  ],
})
