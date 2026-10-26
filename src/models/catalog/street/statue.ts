import { C, cyl, defineModel, ico, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bronze = C.brass
const patina = C.walnut

export default defineModel({
  id: 'statue',
  name: '纪念雕塑',
  category: 'street',
  tags: ['statue', 'monument', 'memorial', '雕塑', '纪念'],
  footprint: [1.2, 1.2],
  height: 3.2,
  placement: 'outdoor',
  parts: [
    // stepped stone plinth
    rounded(1.18, 0.12, 1.18, 0.02, 0, 0.06, 0, C.stone, { mat: 'stone' }),
    rounded(1.0, 0.16, 1.0, 0.015, 0, 0.2, 0, C.concrete, { mat: 'stone' }),
    rounded(0.78, 0.86, 0.78, 0.02, 0, 0.71, 0, C.stone, { mat: 'stone' }),
    rounded(0.82, 0.03, 0.82, 0.008, 0, 0.36, 0, C.concrete, { mat: 'stone' }),
    rounded(0.82, 0.03, 0.82, 0.008, 0, 1.06, 0, C.concrete, { mat: 'stone' }),
    rounded(0.92, 0.1, 0.92, 0.02, 0, 1.19, 0, C.cream, { mat: 'stone' }),

    // blank dedication plaque
    rounded(0.38, 0.24, 0.02, 0.006, 0, 0.8, 0.398, bronze, { mat: 'metal' }),
    rounded(0.32, 0.18, 0.014, 0.004, 0, 0.8, 0.407, C.cream, { mat: 'matte' }),
    sphere(0.009, 0.155, 0.885, 0.416, bronze, { mat: 'metal' }, 8),
    sphere(0.009, -0.155, 0.885, 0.416, bronze, { mat: 'metal' }, 8),
    sphere(0.009, 0.155, 0.715, 0.416, bronze, { mat: 'metal' }, 8),
    sphere(0.009, -0.155, 0.715, 0.416, bronze, { mat: 'metal' }, 8),

    // figure: feet, robe and sash
    rounded(0.16, 0.06, 0.28, 0.02, 0.13, 1.27, 0.04, bronze, { mat: 'metal' }),
    rounded(0.16, 0.06, 0.28, 0.02, -0.13, 1.27, 0.04, bronze, { mat: 'metal' }),
    cyl(0.18, 0.38, 1.02, 0, 1.8, 0, bronze, { mat: 'metal' }, 20),
    torus(0.375, 0.02, 0, 1.31, 0, patina, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.185, 0.014, 0, 2.02, 0, patina, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.17, 0.22, 0.46, 0, 2.5, 0, bronze, { mat: 'metal' }, 20),
    rounded(0.34, 0.5, 0.03, 0.01, 0.02, 2.45, 0.19, patina, { mat: 'metal', rot: [0, 0, 0.22] }),

    // shoulders, neck and abstract head
    cyl(0.085, 0.1, 0.44, 0, 2.68, 0, bronze, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.06, 0.07, 0.08, 0, 2.77, 0, bronze, { mat: 'metal' }, 16),
    ico(0.115, 0, 2.9, 0, bronze, { mat: 'metal', side: 'double' }, 1),
    torus(0.108, 0.01, 0, 2.95, 0, patina, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),

    // raised arm
    cyl(0.055, 0.06, 0.32, 0.285, 2.805, 0, bronze, { mat: 'metal', rot: [0, 0, -0.54] }, 12),
    cyl(0.045, 0.052, 0.22, 0.345, 3.02, 0, bronze, { mat: 'metal', rot: [0, 0, 0.165] }, 12),
    sphere(0.05, 0.33, 3.15, 0, bronze, { mat: 'metal' }, 12),

    // lowered arm with a small tablet
    cyl(0.055, 0.06, 0.3, -0.245, 2.54, 0, bronze, { mat: 'metal', rot: [0, 0, -0.245] }, 12),
    cyl(0.045, 0.052, 0.27, -0.27, 2.275, 0, bronze, { mat: 'metal', rot: [0, 0, -0.08] }, 12),
    sphere(0.05, -0.26, 2.13, 0, bronze, { mat: 'metal' }, 12),
    rounded(0.12, 0.16, 0.03, 0.008, -0.27, 2.15, 0.08, patina, { mat: 'metal', rot: [0, 0, 0.12] }),
  ],
})
