import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const panel = C.navy
const paper = C.cream
const ROUTES = [
  { y: 2.22, color: C.red },
  { y: 2.06, color: C.navy },
  { y: 1.9, color: C.sage },
  { y: 1.74, color: C.brass },
]

export default defineModel({
  id: 'bus-stop-sign',
  name: '公交站牌',
  category: 'street',
  tags: ['bus-stop-sign', 'bus', 'timetable', '公交站牌', '站牌', '线路'],
  footprint: [0.5, 0.2],
  height: 2.9,
  placement: 'outdoor',
  parts: [
    // base plate with anchor bolts and a pole collar
    rounded(0.4, 0.04, 0.18, 0.012, 0, 0.02, 0, C.graphite, { mat: 'metal' }),
    ...[0.15, -0.15].flatMap((x) =>
      [0.06, -0.06].map((z) => cyl(0.01, 0.01, 0.014, x, 0.045, z, C.steel, { mat: 'metal' }, 8)),
    ),
    cyl(0.032, 0.04, 2.6, 0, 1.34, -0.01, C.steel, { mat: 'metal' }, 24),
    cyl(0.05, 0.056, 0.05, 0, 0.065, -0.01, C.graphite, { mat: 'metal' }, 20),
    torus(0.033, 0.005, 0, 1.32, -0.01, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),

    // route panel: navy carcass and cream face
    rounded(0.4, 1.1, 0.03, 0.012, 0, 1.95, 0.04, panel, { mat: 'matte' }),
    rounded(0.36, 1.04, 0.01, 0.006, 0, 1.95, 0.062, paper, { mat: 'matte' }),

    // route header with two number blocks and a destination bar
    rounded(0.34, 0.17, 0.006, 0.003, 0, 2.39, 0.069, panel, { mat: 'matte' }),
    box(0.05, 0.035, 0.004, -0.06, 2.39, 0.073, paper, { mat: 'matte' }),
    box(0.04, 0.035, 0.004, -0.005, 2.39, 0.073, paper, { mat: 'matte' }),
    box(0.12, 0.018, 0.004, 0.09, 2.39, 0.073, paper, { mat: 'matte' }),

    // four route rows: coloured number tag plus destination line
    ...ROUTES.flatMap(({ y, color }) => [
      rounded(0.07, 0.06, 0.006, 0.004, -0.135, y, 0.071, color, { mat: 'matte' }),
      box(0.16, 0.018, 0.006, 0.03, y, 0.071, C.ink),
    ]),
    box(0.3, 0.014, 0.006, 0, 1.56, 0.072, C.ink),

    // timetable card below the route panel
    rounded(0.36, 0.72, 0.02, 0.01, 0, 1.02, 0.06, paper, { mat: 'matte' }),
    rounded(0.32, 0.08, 0.006, 0.003, 0, 1.3, 0.073, panel, { mat: 'matte' }),
    ...[1.19, 1.11, 1.03, 0.95].map((y) => box(0.3, 0.006, 0.004, 0, y, 0.074, '#b9b3a4')),
    box(0.006, 0.66, 0.004, -0.08, 1.0, 0.074, '#b9b3a4'),
    box(0.006, 0.66, 0.004, 0.08, 1.0, 0.074, '#b9b3a4'),
    box(0.2, 0.015, 0.004, -0.05, 1.24, 0.075, C.ink),
    box(0.16, 0.012, 0.004, -0.06, 0.87, 0.075, C.ink),

    // clamps and face rivets
    rounded(0.06, 0.04, 0.06, 0.01, 0, 2.4, 0.015, C.graphite, { mat: 'metal' }),
    rounded(0.06, 0.04, 0.06, 0.01, 0, 1.05, 0.015, C.graphite, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.004, 0, 2.46, 0.074, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.008, 0.008, 0.004, 0, 1.45, 0.069, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),

    // circular bus stop roundel on top
    cyl(0.17, 0.17, 0.05, 0, 2.71, 0, panel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),
    cyl(0.155, 0.155, 0.012, 0, 2.71, 0.031, paper, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 28),
    cyl(0.155, 0.155, 0.012, 0, 2.71, -0.031, paper, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.155, 0.008, 0, 2.71, 0.031, C.steel, { mat: 'metal' }, 28),
    torus(0.155, 0.008, 0, 2.71, -0.031, C.steel, { mat: 'metal' }, 28),

    // bus pictogram on the front face
    rounded(0.1, 0.065, 0.006, 0.012, 0, 2.715, 0.039, panel, { mat: 'matte' }),
    box(0.032, 0.025, 0.004, -0.028, 2.733, 0.043, paper, { mat: 'matte' }),
    box(0.032, 0.025, 0.004, 0.028, 2.733, 0.043, paper, { mat: 'matte' }),
    cyl(0.012, 0.012, 0.006, -0.03, 2.676, 0.043, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.012, 0.012, 0.006, 0.03, 2.676, 0.043, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 10),

    // roundel bracket and finial
    rounded(0.05, 0.14, 0.04, 0.01, 0, 2.55, 0, C.graphite, { mat: 'metal' }),
    sphere(0.012, 0, 2.888, 0, C.brass, { mat: 'metal' }, 10),

    // clear acrylic cover protecting the timetable card
    box(0.36, 0.72, 0.006, 0, 1.02, 0.0745, C.glass, { mat: 'glass', opacity: 0.5 }),
    box(0.03, 0.018, 0.012, -0.15, 0.686, 0.08, C.steel, { mat: 'metal' }),
    box(0.03, 0.018, 0.012, 0.15, 0.686, 0.08, C.steel, { mat: 'metal' }),

    // condensate drain hole low on the pole
    cyl(0.01, 0.01, 0.006, 0, 0.11, 0.031, C.ink, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
  ],
})
