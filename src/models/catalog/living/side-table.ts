import { C, cyl, defineModel, ico, rbox, torus } from '../../kit'

export default defineModel({
  id: 'side-table',
  name: '边几',
  category: 'living',
  tags: ['side table', 'end table', '边几', 'walnut', 'round'],
  footprint: [0.52, 0.52],
  height: 0.55,
  placement: 'indoor',
  parts: [
    // round walnut top with chamfered edge
    cyl(0.26, 0.26, 0.045, 0, 0.4875, 0, C.walnut, { mat: 'wood' }, 32),
    torus(0.248, 0.01, 0, 0.51, 0, C.walnut, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }, 32),

    // three slim tapered legs with brass ferrules
    cyl(0.018, 0.013, 0.465, 0, 0.2325, 0.185, C.walnut, { mat: 'wood' }, 12),
    cyl(0.018, 0.013, 0.465, -0.160, 0.2325, -0.0925, C.walnut, { mat: 'wood' }, 12),
    cyl(0.018, 0.013, 0.465, 0.160, 0.2325, -0.0925, C.walnut, { mat: 'wood' }, 12),
    cyl(0.014, 0.014, 0.014, 0, 0.007, 0.185, C.brass, { mat: 'metal' }, 12),
    cyl(0.014, 0.014, 0.014, -0.160, 0.007, -0.0925, C.brass, { mat: 'metal' }, 12),
    cyl(0.014, 0.014, 0.014, 0.160, 0.007, -0.0925, C.brass, { mat: 'metal' }, 12),

    // circular lower shelf and brass bracing ring
    cyl(0.20, 0.20, 0.025, 0, 0.14, 0, C.oak, { mat: 'wood' }, 28),
    torus(0.185, 0.007, 0, 0.33, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),

    // shelf contents: stacked books and a small vase with dried stems
    rbox(0.20, 0.015, 0.15, 0.004, -0.05, 0.16, 0.03, C.navy, { mat: 'matte', rot: [0, 0.08, 0] }),
    rbox(0.18, 0.014, 0.14, 0.004, -0.05, 0.1745, 0.025, C.sand, { mat: 'matte', rot: [0, -0.05, 0] }),
    cyl(0.038, 0.048, 0.10, 0.07, 0.2025, -0.05, C.clay, { mat: 'ceramic' }, 18),
    cyl(0.024, 0.032, 0.012, 0.07, 0.2585, -0.05, C.clay, { mat: 'ceramic' }, 18),
    cyl(0.0025, 0.0025, 0.17, 0.06, 0.335, -0.05, C.leafDeep, { mat: 'foliage', rot: [0.15, 0, -0.18] }, 6),
    cyl(0.0025, 0.0025, 0.17, 0.08, 0.335, -0.03, C.leafDeep, { mat: 'foliage', rot: [-0.12, 0, 0.1] }, 6),
    cyl(0.0025, 0.0025, 0.17, 0.055, 0.335, -0.06, C.leaf, { mat: 'foliage', rot: [0.05, 0, 0.22] }, 6),
    ico(0.014, 0.078, 0.423, -0.025, '#6F8E5E', { mat: 'foliage' }, 1),
    ico(0.014, 0.071, 0.423, -0.04, C.leafLight, { mat: 'foliage' }, 1),
    ico(0.014, 0.036, 0.423, -0.054, '#4C6D45', { mat: 'foliage' }, 1),

    // ceramic dish on top
    cyl(0.075, 0.055, 0.035, 0.06, 0.5275, 0.03, C.cream, { mat: 'ceramic' }, 24),
    torus(0.073, 0.005, 0.06, 0.544, 0.03, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),

    // apron ring, brass leg collars and felt glides
    torus(0.205, 0.008, 0, 0.4625, 0, C.walnut, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }, 28),
    cyl(0.019, 0.019, 0.012, 0, 0.448, 0.185, C.brass, { mat: 'metal' }, 12),
    cyl(0.019, 0.019, 0.012, -0.160, 0.448, -0.0925, C.brass, { mat: 'metal' }, 12),
    cyl(0.019, 0.019, 0.012, 0.160, 0.448, -0.0925, C.brass, { mat: 'metal' }, 12),
    cyl(0.016, 0.016, 0.003, 0, 0.0015, 0.185, '#2f2b27', { mat: 'matte' }, 12),
    cyl(0.016, 0.016, 0.003, -0.160, 0.0015, -0.0925, '#2f2b27', { mat: 'matte' }, 12),
    cyl(0.016, 0.016, 0.003, 0.160, 0.0015, -0.0925, '#2f2b27', { mat: 'matte' }, 12),
  ],
})
