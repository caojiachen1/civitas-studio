import { box, cyl, defineModel, rbox, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const castIron = '#4a4d4c'
const castIronLight = '#545755'
const recess = '#2b2e2e'
const slot = '#232626'

export default defineModel({
  id: 'manhole-cover',
  name: '井盖',
  category: 'street',
  tags: ['manhole', 'cover', 'drain', '井盖', '市政', '排水'],
  footprint: [0.7, 0.7],
  height: 0.04,
  placement: 'outdoor',
  noCollide: true,
  shadow: false,
  parts: [
    // recessed seat ring and heavy cast-iron rim
    cyl(0.318, 0.318, 0.012, 0, 0.006, 0, recess, { mat: 'stone' }, 32),
    torus(0.318, 0.02, 0, 0.02, 0, castIron, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 36),

    // central cover plate
    cyl(0.3, 0.3, 0.03, 0, 0.019, 0, castIronLight, { mat: 'metal' }, 36),
    torus(0.26, 0.003, 0, 0.035, 0, castIron, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),

    // anti-slip grid: five bars each way
    ...[-0.16, -0.08, 0, 0.08, 0.16].map((z) =>
      box(0.44, 0.006, 0.018, 0, 0.037, z, castIron, { mat: 'metal' }),
    ),
    ...[-0.16, -0.08, 0, 0.08, 0.16].map((x) =>
      box(0.018, 0.006, 0.44, x, 0.037, 0, castIron, { mat: 'metal' }),
    ),

    // cast maker's medallion at the centre
    torus(0.075, 0.003, 0, 0.036, 0, castIron, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.05, 0.05, 0.005, 0, 0.036, 0, castIron, { mat: 'metal' }, 20),

    // hinge lugs and pins on the rear edge
    rounded(0.06, 0.02, 0.04, 0.006, 0.08, 0.022, -0.32, castIron, { mat: 'metal' }),
    rounded(0.06, 0.02, 0.04, 0.006, -0.08, 0.022, -0.32, castIron, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.07, 0.08, 0.032, -0.32, castIron, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.008, 0.008, 0.07, -0.08, 0.032, -0.32, castIron, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),

    // lifting keyholes near the front edge
    box(0.03, 0.004, 0.012, 0.1, 0.038, 0.27, slot),
    box(0.03, 0.004, 0.012, -0.1, 0.038, 0.27, slot),

    // four pry slots around the rim
    box(0.036, 0.004, 0.02, 0, 0.038, 0.31, slot),
    box(0.036, 0.004, 0.02, 0, 0.038, -0.31, slot),
    box(0.02, 0.004, 0.036, 0.31, 0.038, 0, slot),
    box(0.02, 0.004, 0.036, -0.31, 0.038, 0, slot),

    // four raised tread studs
    ...[0.19, -0.19].flatMap((x) =>
      [0.19, -0.19].map((z) => cyl(0.012, 0.012, 0.004, x, 0.038, z, castIron, { mat: 'metal' }, 12)),
    ),

    // tar joint sealing the frame into the asphalt
    torus(0.345, 0.012, 0, 0.006, 0, '#4b4c47', { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 40),

    // machined seating chamfer on the cover face
    torus(0.29, 0.004, 0, 0.036, 0, castIronLight, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),

    // hinge pin caps flush with the rim
    cyl(0.011, 0.011, 0.006, 0.08, 0.038, -0.315, castIronLight, { mat: 'metal' }, 10),
    cyl(0.011, 0.011, 0.006, -0.08, 0.038, -0.315, castIronLight, { mat: 'metal' }, 10),
  ],
})
