import { C, cyl, defineModel, prism, rbox, sphere } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const iron = C.blackMetal
const wood = C.oak

// cast-iron end frame silhouette in the ZY plane: front leg, seat rail, rear leg
const sideFrame: [number, number][] = [
  [0.24, 0],
  [0.3, 0],
  [0.3, 0.37],
  [0.28, 0.41],
  [-0.24, 0.41],
  [-0.26, 0.37],
  [-0.26, 0],
  [-0.2, 0],
  [-0.2, 0.34],
  [0.24, 0.34],
]

const seatZ = [0.225, 0.115, 0.005, -0.105, -0.215]
const backZ = [-0.275, -0.288, -0.302, -0.312]

export default defineModel({
  id: 'bench-park',
  name: '公园长椅',
  category: 'street',
  tags: ['bench', 'park', 'seat', '长椅', '公园'],
  footprint: [1.8, 0.65],
  height: 0.85,
  placement: 'outdoor',
  parts: [
    // cast-iron side frames, one per end
    prism(sideFrame, 0.055, 0.765, 0, 0, iron, { mat: 'metal', rot: [0, -Math.PI / 2, 0] }),
    prism(sideFrame, 0.055, -0.765, 0, 0, iron, { mat: 'metal', rot: [0, -Math.PI / 2, 0] }),

    // raked cast-iron back uprights sitting on the seat rails
    rounded(0.05, 0.44, 0.05, 0.01, 0.755, 0.63, -0.29, iron, { mat: 'metal', rot: [-0.14, 0, 0] }),
    rounded(0.05, 0.44, 0.05, 0.01, -0.755, 0.63, -0.29, iron, { mat: 'metal', rot: [-0.14, 0, 0] }),

    // five independent seat slats with shadow gaps
    ...seatZ.map((z) => rounded(1.62, 0.04, 0.095, 0.008, 0, 0.43, z, wood, { mat: 'wood' })),

    // four separate back slats, raked with the uprights
    ...backZ.map((z, i) =>
      rounded(1.62, 0.075, 0.035, 0.006, 0, 0.535 + i * 0.095, z, wood, {
        mat: 'wood',
        rot: [-0.14, 0, 0],
      }),
    ),

    // armrests with front posts and rear brackets
    rounded(0.06, 0.035, 0.42, 0.012, 0.84, 0.665, 0.0, iron, { mat: 'metal' }),
    rounded(0.06, 0.035, 0.42, 0.012, -0.84, 0.665, 0.0, iron, { mat: 'metal' }),
    cyl(0.02, 0.024, 0.22, 0.84, 0.55, 0.2, iron, { mat: 'metal' }, 12),
    cyl(0.02, 0.024, 0.22, -0.84, 0.55, 0.2, iron, { mat: 'metal' }, 12),
    rounded(0.04, 0.04, 0.16, 0.008, 0.84, 0.645, -0.17, iron, { mat: 'metal' }),
    rounded(0.04, 0.04, 0.16, 0.008, -0.84, 0.645, -0.17, iron, { mat: 'metal' }),

    // centre stretcher tying both frames together
    rounded(1.5, 0.05, 0.04, 0.01, 0, 0.33, -0.05, iron, { mat: 'metal' }),

    // slat bolt heads, two per seat slat
    ...seatZ.flatMap((z) => [
      sphere(0.01, 0.74, 0.452, z, C.brass, { mat: 'metal' }, 8),
      sphere(0.01, -0.74, 0.452, z, C.brass, { mat: 'metal' }, 8),
    ]),

    // slat bolt heads, two per back slat
    ...backZ.flatMap((z, i) => [
      sphere(0.009, 0.74, 0.535 + i * 0.095, z + 0.02, C.brass, { mat: 'metal' }, 8),
      sphere(0.009, -0.74, 0.535 + i * 0.095, z + 0.02, C.brass, { mat: 'metal' }, 8),
    ]),

    // cast foot shoes
    rounded(0.11, 0.03, 0.14, 0.006, 0.765, 0.015, 0.27, C.graphite, { mat: 'metal' }),
    rounded(0.11, 0.03, 0.14, 0.006, -0.765, 0.015, 0.27, C.graphite, { mat: 'metal' }),
    rounded(0.11, 0.03, 0.14, 0.006, 0.765, 0.015, -0.23, C.graphite, { mat: 'metal' }),
    rounded(0.11, 0.03, 0.14, 0.006, -0.765, 0.015, -0.23, C.graphite, { mat: 'metal' }),
  ],
})
