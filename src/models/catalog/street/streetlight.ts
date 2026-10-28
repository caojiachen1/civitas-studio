import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const GLOW = '#f4d3a0'
const polePaint = C.navy

export default defineModel({
  id: 'streetlight',
  name: '路灯',
  category: 'street',
  tags: ['streetlight', 'lamp', '路灯', '照明', 'lamp-post'],
  footprint: [0.35, 0.35],
  height: 6.0,
  placement: 'outdoor',
  parts: [
    // base plate and anchorage
    rounded(0.34, 0.05, 0.34, 0.02, 0, 0.025, 0, C.graphite, { mat: 'metal' }),
    cyl(0.115, 0.14, 0.13, 0, 0.105, 0, C.steel, { mat: 'metal' }, 20),
    torus(0.112, 0.014, 0, 0.172, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.014, 0.014, 0.02, 0.12, 0.058, 0.12, C.steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.02, -0.12, 0.058, 0.12, C.steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.02, 0.12, 0.058, -0.12, C.steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.02, -0.12, 0.058, -0.12, C.steel, { mat: 'metal' }, 8),

    // tapered painted pole
    cyl(0.042, 0.078, 5.46, 0, 2.9, 0, polePaint, { mat: 'metal' }, 24),
    torus(0.081, 0.011, 0, 0.24, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.05, 0.009, 0, 3.2, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),

    // access hatch and its fixings
    rounded(0.078, 0.24, 0.018, 0.007, 0, 0.94, 0.073, C.steel, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.01, 0, 1.03, 0.083, C.graphite, { mat: 'metal' }, 8),
    cyl(0.009, 0.009, 0.01, 0, 0.85, 0.083, C.graphite, { mat: 'metal' }, 8),

    // curved arm: four tangent segments of a quarter arc
    cyl(0.035, 0.035, 0.14, 0, 5.6674, 0.0114, polePaint, { mat: 'metal', rot: [Math.PI * 0.0625, 0, 0] }, 16),
    cyl(0.035, 0.035, 0.14, 0, 5.7735, 0.0554, polePaint, { mat: 'metal', rot: [Math.PI * 0.1875, 0, 0] }, 16),
    cyl(0.035, 0.035, 0.14, 0, 5.8546, 0.1365, polePaint, { mat: 'metal', rot: [Math.PI * 0.3125, 0, 0] }, 16),
    cyl(0.035, 0.035, 0.14, 0, 5.8986, 0.2426, polePaint, { mat: 'metal', rot: [Math.PI * 0.4375, 0, 0] }, 16),
    sphere(0.044, 0, 5.91, 0.3, C.graphite, { mat: 'metal' }, 16),
    cyl(0.032, 0.032, 0.24, 0, 5.91, 0.4, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),

    // luminaire
    rounded(0.1, 0.07, 0.14, 0.014, 0, 5.9, 0.54, C.blackMetal, { mat: 'metal' }),
    rounded(0.17, 0.1, 0.46, 0.03, 0, 5.9, 0.7, C.blackMetal, { mat: 'metal' }),
    rounded(0.12, 0.05, 0.34, 0.02, 0, 5.975, 0.69, C.steel, { mat: 'metal' }),
    box(0.115, 0.014, 0.32, 0, 5.842, 0.69, GLOW, { mat: 'emissive' }),
    cyl(0.012, 0.012, 0.02, 0.086, 5.9, 0.7, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.012, 0.012, 0.02, -0.086, 5.9, 0.7, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    rounded(0.05, 0.035, 0.06, 0.01, 0, 5.955, 0.4, C.graphite, { mat: 'metal' }),

    // photovoltaic photocell on the luminaire canopy
    cyl(0.026, 0.026, 0.02, 0, 6.008, 0.64, C.graphite, { mat: 'metal' }, 14),
    sphere(0.019, 0, 6.02, 0.64, '#c9d7d0', { mat: 'gloss' }, 14),

    // washers bedding the four anchor bolts
    ...[0.12, -0.12].flatMap((x) =>
      [0.12, -0.12].map((z) => cyl(0.019, 0.019, 0.004, x, 0.052, z, C.graphite, { mat: 'metal' }, 8)),
    ),

    // hatch hinges and a warning label
    box(0.012, 0.018, 0.006, -0.028, 1.05, 0.081, C.graphite, { mat: 'metal' }),
    box(0.012, 0.018, 0.006, 0.028, 1.05, 0.081, C.graphite, { mat: 'metal' }),
    box(0.03, 0.04, 0.003, 0.02, 0.9, 0.0835, '#d9b25f', { mat: 'matte' }),
  ],
})
