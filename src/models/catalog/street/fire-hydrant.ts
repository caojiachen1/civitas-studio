import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const paint = C.red
const brass = C.brass

export default defineModel({
  id: 'fire-hydrant',
  name: '消防栓',
  category: 'street',
  tags: ['hydrant', 'fire', '消防', '消防栓', 'street-furniture'],
  footprint: [0.35, 0.35],
  height: 0.9,
  placement: 'outdoor',
  parts: [
    // bolted base flange
    cyl(0.155, 0.175, 0.055, 0, 0.0275, 0, C.blackMetal, { mat: 'metal' }, 24),
    cyl(0.014, 0.014, 0.022, 0.12, 0.066, 0.12, brass, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.022, -0.12, 0.066, 0.12, brass, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.022, 0.12, 0.066, -0.12, brass, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.022, -0.12, 0.066, -0.12, brass, { mat: 'metal' }, 8),

    // cast body
    cyl(0.1, 0.118, 0.3, 0, 0.21, 0, paint, { mat: 'gloss' }, 24),
    torus(0.106, 0.014, 0, 0.362, 0, brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.135, 0.135, 0.045, 0, 0.4025, 0, paint, { mat: 'gloss' }, 24),
    sphere(0.012, 0.12, 0.428, 0, brass, { mat: 'metal' }, 8),
    sphere(0.012, -0.12, 0.428, 0, brass, { mat: 'metal' }, 8),
    sphere(0.012, 0, 0.428, 0.12, brass, { mat: 'metal' }, 8),
    sphere(0.012, 0, 0.428, -0.12, brass, { mat: 'metal' }, 8),
    cyl(0.09, 0.1, 0.27, 0, 0.56, 0, paint, { mat: 'gloss' }, 24),
    torus(0.094, 0.01, 0, 0.62, 0, brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),

    // bonnet and operating nut
    cyl(0.055, 0.1, 0.095, 0, 0.7425, 0, paint, { mat: 'gloss' }, 24),
    sphere(0.085, 0, 0.8, 0, paint, { mat: 'gloss' }, 20),
    cyl(0.022, 0.028, 0.035, 0, 0.8825, 0, brass, { mat: 'metal' }, 6),

    // side outlets with brass caps
    cyl(0.052, 0.058, 0.08, 0.115, 0.56, 0, paint, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.052, 0.058, 0.08, -0.115, 0.56, 0, paint, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.048, 0.048, 0.02, 0.165, 0.56, 0, brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.048, 0.048, 0.02, -0.165, 0.56, 0, brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),

    // front pumper outlet
    cyl(0.062, 0.068, 0.08, 0, 0.56, 0.1, paint, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.05, 0.05, 0.018, 0, 0.56, 0.149, brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    sphere(0.011, 0, 0.56, 0.162, brass, { mat: 'metal' }, 8),

    // hanging cap chains
    torus(0.017, 0.005, 0.152, 0.526, 0.018, brass, { mat: 'metal' }, 10),
    torus(0.017, 0.005, 0.146, 0.497, 0.033, brass, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 10),
    torus(0.017, 0.005, 0.137, 0.468, 0.048, brass, { mat: 'metal' }, 10),
    torus(0.017, 0.005, -0.152, 0.526, 0.018, brass, { mat: 'metal' }, 10),
    torus(0.017, 0.005, -0.146, 0.497, 0.033, brass, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 10),
    torus(0.017, 0.005, -0.137, 0.468, 0.048, brass, { mat: 'metal' }, 10),

    // maker plate
    rounded(0.09, 0.06, 0.008, 0.003, 0, 0.3, 0.108, brass, { mat: 'metal' }),
    box(0.06, 0.008, 0.004, 0, 0.317, 0.114, C.walnut),
    box(0.045, 0.008, 0.004, 0, 0.3, 0.114, C.walnut),

    // remaining bonnet flange bolts at the diagonals
    sphere(0.01, 0.085, 0.428, 0.085, brass, { mat: 'metal' }, 8),
    sphere(0.01, -0.085, 0.428, 0.085, brass, { mat: 'metal' }, 8),
    sphere(0.01, 0.085, 0.428, -0.085, brass, { mat: 'metal' }, 8),
    sphere(0.01, -0.085, 0.428, -0.085, brass, { mat: 'metal' }, 8),

    // pale identification band on the upper barrel
    cyl(0.0985, 0.0985, 0.04, 0, 0.5, 0, '#efe9dc', { mat: 'gloss' }, 24),

    // automatic drain hole low on the body
    cyl(0.012, 0.012, 0.006, 0, 0.085, 0.112, C.ink, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // caulk bed under the base flange
    torus(0.176, 0.005, 0, 0.004, 0, '#a9a69c', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 28),
  ],
})
