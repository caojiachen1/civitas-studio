import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const frame = C.steel
const dark = C.graphite
const BAR_X = [-0.65, -0.39, -0.13, 0.13, 0.39, 0.65]
const REFLECTORS = [
  { x: -0.6, color: C.red },
  { x: -0.2, color: '#e3ddd0' },
  { x: 0.2, color: C.red },
  { x: 0.6, color: '#e3ddd0' },
]

export default defineModel({
  id: 'road-barrier',
  name: '施工围挡',
  category: 'street',
  tags: ['road-barrier', 'barrier', 'construction', '施工围挡', '护栏', '警示'],
  footprint: [1.8, 0.35],
  height: 1.1,
  placement: 'outdoor',
  parts: [
    // cross feet with rubber pads
    rounded(0.09, 0.05, 0.34, 0.012, 0.8, 0.055, 0, dark, { mat: 'metal' }),
    rounded(0.09, 0.05, 0.34, 0.012, -0.8, 0.055, 0, dark, { mat: 'metal' }),
    ...[0.8, -0.8].flatMap((x) =>
      [0.13, -0.13].map((z) =>
        rounded(0.08, 0.03, 0.06, 0.008, x, 0.015, z, C.blackMetal, { mat: 'matte' }),
      ),
    ),

    // uprights and horizontal rails
    rounded(0.06, 0.9, 0.06, 0.012, 0.8, 0.53, 0, frame, { mat: 'metal' }),
    rounded(0.06, 0.9, 0.06, 0.012, -0.8, 0.53, 0, frame, { mat: 'metal' }),
    rounded(1.78, 0.09, 0.06, 0.014, 0, 0.955, 0, frame, { mat: 'metal' }),
    rounded(1.78, 0.07, 0.05, 0.012, 0, 0.28, 0, frame, { mat: 'metal' }),

    // six vertical infill bars
    ...BAR_X.map((x) => rounded(0.028, 0.61, 0.025, 0.006, x, 0.6075, 0, frame, { mat: 'metal' })),

    // pressed hazard sign wired between the bars
    rounded(0.42, 0.26, 0.02, 0.008, 0, 0.6, 0.025, C.cream, { mat: 'matte' }),
    box(0.3, 0.022, 0.004, 0, 0.64, 0.037, C.navy),
    box(0.24, 0.016, 0.004, 0, 0.585, 0.037, C.red),

    // red / white reflective plates on the top rail
    ...REFLECTORS.map(({ x, color }) =>
      rounded(0.32, 0.07, 0.012, 0.004, x, 0.955, 0.036, color, { mat: 'gloss' }),
    ),

    // joint bolts
    ...[0.8, -0.8].flatMap((x) => [
      sphere(0.014, x, 0.955, 0.034, C.graphite, { mat: 'metal' }, 8),
      sphere(0.014, x, 0.28, 0.029, C.graphite, { mat: 'metal' }, 8),
    ]),

    // front and rear A-frame braces at both ends
    cyl(0.018, 0.018, 0.93, 0.8, 0.5, 0.065, frame, { mat: 'metal', rot: [-0.14, 0, 0] }, 10),
    cyl(0.018, 0.018, 0.93, 0.8, 0.5, -0.065, frame, { mat: 'metal', rot: [0.14, 0, 0] }, 10),
    cyl(0.018, 0.018, 0.93, -0.8, 0.5, 0.065, frame, { mat: 'metal', rot: [-0.14, 0, 0] }, 10),
    cyl(0.018, 0.018, 0.93, -0.8, 0.5, -0.065, frame, { mat: 'metal', rot: [0.14, 0, 0] }, 10),

    // clamp collars and lifting eyes at the ends
    torus(0.045, 0.007, 0.8, 0.16, 0, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    torus(0.045, 0.007, -0.8, 0.16, 0, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    torus(0.03, 0.007, 0.89, 0.9, 0, frame, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
    torus(0.03, 0.007, -0.89, 0.9, 0, frame, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),

    // amber warning beacon clamped to the top rail
    cyl(0.05, 0.05, 0.015, 0.52, 1.0, 0, dark, { mat: 'metal' }, 16),
    cyl(0.045, 0.052, 0.03, 0.52, 1.02, 0, dark, { mat: 'metal' }, 16),
    cyl(0.042, 0.045, 0.045, 0.52, 1.055, 0, '#d69a4a', { mat: 'emissive' }, 16),
    sphere(0.032, 0.52, 1.068, 0, '#d69a4a', { mat: 'emissive' }, 12),
    ...[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a) =>
      cyl(0.0035, 0.0035, 0.08, 0.52 + 0.045 * Math.sin(a), 1.045, 0.045 * Math.cos(a), C.steel, {
        mat: 'metal',
      }, 6),
    ),

    // ground anchor pins through the cross feet
    ...[0.8, -0.8].flatMap((x) =>
      [0.11, -0.11].map((z) => cyl(0.009, 0.009, 0.09, x, 0.035, z, C.graphite, { mat: 'metal' }, 6)),
    ),

    // pressed end caps closing both rails
    ...[
      [0.892, 0.955, 0.032],
      [-0.892, 0.955, 0.032],
      [0.892, 0.28, 0.027],
      [-0.892, 0.28, 0.027],
    ].map(([x, y, r]) => cyl(r, r, 0.012, x, y, 0, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14)),
  ],
})
