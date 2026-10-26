import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const housing = C.blackMetal
const polePaint = C.graphite

export default defineModel({
  id: 'traffic-light',
  name: '交通信号灯',
  category: 'street',
  tags: ['traffic', 'signal', 'traffic-light', '交通灯', '信号灯'],
  footprint: [0.4, 0.4],
  height: 3.6,
  placement: 'outdoor',
  parts: [
    // footing
    rounded(0.36, 0.05, 0.36, 0.015, 0, 0.025, 0, C.graphite, { mat: 'metal' }),
    cyl(0.085, 0.11, 0.11, 0, 0.105, 0, C.steel, { mat: 'metal' }, 20),
    cyl(0.014, 0.014, 0.02, 0.13, 0.058, 0.13, C.steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.02, -0.13, 0.058, 0.13, C.steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.02, 0.13, 0.058, -0.13, C.steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.02, -0.13, 0.058, -0.13, C.steel, { mat: 'metal' }, 8),

    // mast
    cyl(0.048, 0.058, 3.42, 0, 1.78, -0.03, polePaint, { mat: 'metal' }, 24),
    torus(0.06, 0.009, 0, 1.32, -0.03, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.056, 0.009, 0, 3.22, -0.03, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.016, 0.016, 1.88, 0.055, 1.35, -0.015, C.steel, { mat: 'metal' }, 10),
    cyl(0.046, 0.066, 0.06, 0, 3.51, -0.03, C.steel, { mat: 'metal' }, 20),
    sphere(0.03, 0, 3.57, -0.03, C.graphite, { mat: 'metal' }, 16),

    // signal housing
    rounded(0.06, 0.07, 0.1, 0.012, 0, 3.02, 0.0, C.graphite, { mat: 'metal' }),
    rounded(0.06, 0.07, 0.1, 0.012, 0, 2.42, 0.0, C.graphite, { mat: 'metal' }),
    rounded(0.26, 0.84, 0.16, 0.03, 0, 2.72, 0.06, housing, { mat: 'metal' }),
    rounded(0.28, 0.03, 0.18, 0.012, 0, 3.155, 0.06, C.graphite, { mat: 'metal' }),
    rounded(0.28, 0.03, 0.18, 0.012, 0, 2.285, 0.06, C.graphite, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.02, 0.11, 2.16, 0.06, C.steel, { mat: 'metal' }, 8),
    cyl(0.012, 0.012, 0.02, -0.11, 2.16, 0.06, C.steel, { mat: 'metal' }, 8),

    // lenses: only the red one is lit
    cyl(0.072, 0.072, 0.018, 0, 3.0, 0.148, C.red, { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.072, 0.072, 0.018, 0, 2.72, 0.148, C.brass, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.072, 0.072, 0.018, 0, 2.44, 0.148, C.leaf, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.08, 0.011, 0, 3.0, 0.156, C.graphite, { mat: 'metal' }, 24),
    torus(0.08, 0.011, 0, 2.72, 0.156, C.graphite, { mat: 'metal' }, 24),
    torus(0.08, 0.011, 0, 2.44, 0.156, C.graphite, { mat: 'metal' }, 24),
    rounded(0.19, 0.024, 0.07, 0.008, 0, 3.085, 0.165, housing, { mat: 'metal', rot: [-0.16, 0, 0] }),
    rounded(0.19, 0.024, 0.07, 0.008, 0, 2.805, 0.165, housing, { mat: 'metal', rot: [-0.16, 0, 0] }),
    rounded(0.19, 0.024, 0.07, 0.008, 0, 2.525, 0.165, housing, { mat: 'metal', rot: [-0.16, 0, 0] }),

    // controller box
    rounded(0.2, 0.3, 0.12, 0.015, 0, 1.02, 0.03, C.steel, { mat: 'metal' }),
    rounded(0.17, 0.26, 0.014, 0.006, 0, 1.02, 0.093, C.graphite, { mat: 'metal' }),
    cyl(0.01, 0.01, 0.03, 0.075, 0.97, 0.1, C.steel, { mat: 'metal' }, 8),
    cyl(0.01, 0.01, 0.03, 0.075, 1.09, 0.1, C.steel, { mat: 'metal' }, 8),
    box(0.07, 0.012, 0.004, -0.03, 1.09, 0.103, C.ink),
    box(0.045, 0.012, 0.004, -0.03, 1.06, 0.103, C.leaf),
    box(0.035, 0.012, 0.004, -0.03, 1.03, 0.103, C.brass),
  ],
})
