import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bodyPaint = C.navy
const steel = C.steel
const band = '#dfb25a'
const bandEdge = '#efe6cf'

export default defineModel({
  id: 'bollard',
  name: '隔离柱',
  category: 'street',
  tags: ['bollard', 'post', 'barrier', '隔离柱', '防撞柱', '路桩', '人行道'],
  footprint: [0.28, 0.28],
  height: 0.95,
  placement: 'outdoor',
  parts: [
    // cast flange, rim and four anchor bolts
    cyl(0.125, 0.132, 0.035, 0, 0.0175, 0, C.graphite, { mat: 'metal' }, 24),
    torus(0.126, 0.008, 0, 0.035, 0, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),
    cyl(0.011, 0.011, 0.022, 0.09, 0.045, 0.09, steel, { mat: 'metal' }, 8),
    cyl(0.011, 0.011, 0.022, -0.09, 0.045, 0.09, steel, { mat: 'metal' }, 8),
    cyl(0.011, 0.011, 0.022, 0.09, 0.045, -0.09, steel, { mat: 'metal' }, 8),
    cyl(0.011, 0.011, 0.022, -0.09, 0.045, -0.09, steel, { mat: 'metal' }, 8),

    // tapered steel root and painted cast-iron shaft
    cyl(0.076, 0.09, 0.055, 0, 0.063, 0, steel, { mat: 'metal' }, 24),
    cyl(0.06, 0.075, 0.72, 0, 0.45, 0, bodyPaint, { mat: 'metal' }, 24),
    torus(0.076, 0.006, 0, 0.095, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.073, 0.007, 0, 0.24, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),

    // amber reflective band with pale edging
    cyl(0.0645, 0.0645, 0.055, 0, 0.7, 0, band, { mat: 'ceramic' }, 24),
    torus(0.0655, 0.005, 0, 0.728, 0, bandEdge, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.0655, 0.005, 0, 0.672, 0, bandEdge, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 24),

    // turned neck, cap disc and ball head
    cyl(0.064, 0.058, 0.045, 0, 0.815, 0, steel, { mat: 'metal' }, 24),
    cyl(0.062, 0.062, 0.02, 0, 0.84, 0, C.graphite, { mat: 'metal' }, 24),
    sphere(0.058, 0, 0.892, 0, C.graphite, { mat: 'metal' }, 20),

    // chain lugs on both faces with a short hanging link pair
    cyl(0.016, 0.016, 0.035, 0, 0.79, 0.078, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    torus(0.022, 0.007, 0, 0.79, 0.1, steel, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 16),
    cyl(0.016, 0.016, 0.035, 0, 0.79, -0.078, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    torus(0.022, 0.007, 0, 0.79, -0.1, steel, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 16),
    torus(0.018, 0.006, 0, 0.757, 0.1, C.graphite, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    torus(0.018, 0.006, 0, 0.723, 0.1, C.graphite, { mat: 'metal' }, 14),

    // cast seams and a small reflective permit sticker
    box(0.006, 0.36, 0.004, 0, 0.34, 0.0685, C.graphite),
    box(0.006, 0.36, 0.004, 0, 0.34, -0.0685, C.graphite),
    rounded(0.05, 0.034, 0.006, 0.002, 0.02, 0.41, 0.0705, bandEdge, { mat: 'matte' }),
    box(0.032, 0.006, 0.003, 0.02, 0.415, 0.0745, bodyPaint),

    // silicone bead bedding the flange on the paving
    torus(0.135, 0.005, 0, 0.004, 0, '#a9a69c', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 28),

    // two more flange bolts completing the six-bolt ring
    cyl(0.011, 0.011, 0.022, 0, 0.045, 0.12, steel, { mat: 'metal' }, 8),
    cyl(0.011, 0.011, 0.022, 0, 0.045, -0.12, steel, { mat: 'metal' }, 8),

    // cast maker mark low on the shaft
    rounded(0.05, 0.034, 0.004, 0.002, 0, 0.15, 0.0745, C.graphite, { mat: 'metal' }),
    box(0.032, 0.006, 0.003, 0, 0.157, 0.077, bandEdge),
    box(0.022, 0.005, 0.003, 0, 0.145, 0.077, bandEdge),

    // matching closing links on the rear chain
    torus(0.018, 0.006, 0, 0.757, -0.1, C.graphite, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    torus(0.018, 0.006, 0, 0.723, -0.1, C.graphite, { mat: 'metal' }, 14),
  ],
})
