import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const steel = C.steel
const hoopCenters = [-0.52, 0, 0.52]

export default defineModel({
  id: 'bicycle-rack',
  name: '自行车架',
  category: 'street',
  tags: ['bicycle', 'bike', 'rack', '自行车', '停车架'],
  footprint: [1.6, 0.5],
  height: 0.85,
  placement: 'outdoor',
  parts: [
    // concrete pad with expansion joints
    rounded(1.6, 0.05, 0.5, 0.02, 0, 0.025, 0, C.concrete, { mat: 'stone' }),
    box(0.006, 0.002, 0.48, 0.34, 0.051, 0, C.stone),
    box(0.006, 0.002, 0.48, -0.34, 0.051, 0, C.stone),

    // longitudinal base rails
    rounded(1.44, 0.04, 0.06, 0.012, 0, 0.07, 0.17, steel, { mat: 'metal' }),
    rounded(1.44, 0.04, 0.06, 0.012, 0, 0.07, -0.17, steel, { mat: 'metal' }),
    cyl(0.026, 0.026, 0.04, -0.72, 0.07, 0.17, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.026, 0.026, 0.04, 0.72, 0.07, 0.17, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),

    // three tubular hoops
    ...hoopCenters.flatMap((x) => [
      rounded(0.1, 0.018, 0.46, 0.008, x, 0.059, 0, C.graphite, { mat: 'metal' }),
      cyl(0.026, 0.026, 0.55, x, 0.335, 0.2, steel, { mat: 'metal' }, 14),
      cyl(0.026, 0.026, 0.55, x, 0.335, -0.2, steel, { mat: 'metal' }, 14),
      torus(0.22, 0.026, x, 0.604, 0, steel, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 28),
      cyl(0.014, 0.014, 0.4, x, 0.4, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    ]),

    // anchor bolts
    sphere(0.012, 0.68, 0.095, 0.17, C.brass, { mat: 'metal' }, 8),
    sphere(0.012, -0.68, 0.095, 0.17, C.brass, { mat: 'metal' }, 8),
    sphere(0.012, 0.68, 0.095, -0.17, C.brass, { mat: 'metal' }, 8),
    sphere(0.012, -0.68, 0.095, -0.17, C.brass, { mat: 'metal' }, 8),

    // small abstract bicycle sign at the end of the rack
    cyl(0.012, 0.014, 0.13, 0.66, 0.115, 0.21, C.graphite, { mat: 'metal' }, 8),
    rounded(0.2, 0.17, 0.025, 0.008, 0.66, 0.19, 0.21, C.cream, { mat: 'matte' }),
    torus(0.035, 0.007, 0.615, 0.155, 0.226, C.navy, { mat: 'metal' }, 12),
    torus(0.035, 0.007, 0.705, 0.155, 0.226, C.navy, { mat: 'metal' }, 12),
    box(0.07, 0.008, 0.006, 0.66, 0.185, 0.226, C.navy),
    box(0.006, 0.05, 0.006, 0.66, 0.155, 0.226, C.navy),

    // black rubber bumpers on the hoop crowns
    ...hoopCenters.flatMap((x) => [
      rounded(0.09, 0.04, 0.07, 0.014, x, 0.826, 0, C.ink, { mat: 'matte' }),
      rounded(0.04, 0.18, 0.05, 0.012, x, 0.72, 0.205, C.ink, { mat: 'matte' }),
      rounded(0.04, 0.18, 0.05, 0.012, x, 0.72, -0.205, C.ink, { mat: 'matte' }),
    ]),

    // reflective plates and wheel guide strips
    ...hoopCenters.map((x) => box(0.1, 0.05, 0.008, x, 0.62, 0.246, C.cream, { mat: 'gloss' })),
    ...hoopCenters.map((x) => box(0.09, 0.014, 0.42, x, 0.064, 0, C.graphite, { mat: 'metal' })),

    // extra anchor bolts and sign fixings
    ...[
      [0.3, 0.17],
      [-0.3, 0.17],
      [0.3, -0.17],
      [-0.3, -0.17],
    ].map(([x, z]) => sphere(0.011, x, 0.094, z, C.brass, { mat: 'metal' }, 8)),
    ...[-0.07, 0.07].flatMap((dx) => [
      sphere(0.007, 0.66 + dx, 0.245, 0.224, C.steel, { mat: 'metal' }, 6),
      sphere(0.007, 0.66 + dx, 0.13, 0.224, C.steel, { mat: 'metal' }, 6),
    ]),
    // concrete saw-cut seam across the pad
    box(1.56, 0.002, 0.006, 0, 0.051, -0.02, C.stone),

    // galvanised collars where the hoop legs land on the base rails
    ...hoopCenters.flatMap((x) => [
      cyl(0.032, 0.032, 0.02, x, 0.1, 0.2, C.graphite, { mat: 'metal' }, 12),
      cyl(0.032, 0.032, 0.02, x, 0.1, -0.2, C.graphite, { mat: 'metal' }, 12),
    ]),

    // pressed end caps closing the base rails
    ...[
      [0.725, 0.17],
      [-0.725, 0.17],
      [0.725, -0.17],
      [-0.725, -0.17],
    ].map(([x, z]) =>
      cyl(0.022, 0.022, 0.02, x, 0.07, z, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    ),
  ],
})
