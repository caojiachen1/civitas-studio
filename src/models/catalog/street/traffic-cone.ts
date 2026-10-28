import { cyl, defineModel, rbox, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const safetyOrange = '#c2673f'
const reflective = '#e8e3d7'
const tapeEdge = '#c6c8c1'
const rubber = '#2c3033'

// eight fixed ribs around the base, no runtime randomness
const RIB_ANGLES = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4, Math.PI, (Math.PI * 5) / 4, (Math.PI * 3) / 2, (Math.PI * 7) / 4]

export default defineModel({
  id: 'traffic-cone',
  name: '交通锥',
  category: 'street',
  tags: ['traffic-cone', 'cone', 'safety', 'traffic', '交通锥', '施工', '警示'],
  footprint: [0.38, 0.38],
  height: 0.7,
  placement: 'outdoor',
  parts: [
    // black rubber base: bottom pad, upper pad and four moulded corner pads
    rounded(0.37, 0.032, 0.37, 0.018, 0, 0.016, 0, rubber, { mat: 'matte' }),
    rounded(0.32, 0.03, 0.32, 0.014, 0, 0.045, 0, '#34383a', { mat: 'matte' }),
    ...[0.165, -0.165].flatMap((x) =>
      [0.165, -0.165].map((z) => rounded(0.05, 0.012, 0.05, 0.01, x, 0.038, z, rubber, { mat: 'matte' })),
    ),

    // radial grip ribs around the cone foot
    ...RIB_ANGLES.map((a) =>
      rounded(0.016, 0.012, 0.036, 0.004, 0.142 * Math.sin(a), 0.066, 0.142 * Math.cos(a), '#3a3e40', {
        mat: 'matte',
        rot: [0, a, 0],
      }),
    ),

    // moulded drain holes and weighted fill cap
    ...[0.135, -0.135].flatMap((x) =>
      [0.135, -0.135].map((z) => cyl(0.01, 0.01, 0.006, x, 0.064, z, '#1f2223', { mat: 'matte' }, 10)),
    ),
    cyl(0.018, 0.018, 0.006, 0.085, 0.063, 0.115, '#1f2223', { mat: 'matte' }, 12),

    // tapered body with two reflective sleeves and silver tape edges
    cyl(0, 0.125, 0.615, 0, 0.3625, 0, safetyOrange, { mat: 'gloss' }, 28),
    cyl(0.0685, 0.0815, 0.065, 0, 0.3025, 0, reflective, { mat: 'gloss' }, 28),
    cyl(0.0815, 0.0845, 0.015, 0, 0.2625, 0, tapeEdge, { mat: 'gloss' }, 28),
    cyl(0.039, 0.0492, 0.05, 0, 0.455, 0, reflective, { mat: 'gloss' }, 28),
    cyl(0.0492, 0.0522, 0.015, 0, 0.4225, 0, tapeEdge, { mat: 'gloss' }, 28),

    // subtle moulding rings on the plain orange sections
    torus(0.0935, 0.0025, 0, 0.21, 0, safetyOrange, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.0213, 0.002, 0, 0.565, 0, safetyOrange, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 20),

    // reinforced tip
    cyl(0.016, 0.024, 0.03, 0, 0.685, 0, safetyOrange, { mat: 'gloss' }, 16),

    // moulded hand slots in the sides of the base pad
    rounded(0.008, 0.014, 0.06, 0.003, 0.186, 0.022, 0, '#1f2223', { mat: 'matte' }),
    rounded(0.008, 0.014, 0.06, 0.003, -0.186, 0.022, 0, '#1f2223', { mat: 'matte' }),

    // pressed size marking on the base top
    rounded(0.1, 0.004, 0.03, 0.002, 0, 0.062, -0.11, '#c6c8c1', { mat: 'matte' }),
    rounded(0.05, 0.003, 0.008, 0.001, -0.016, 0.0645, -0.11, '#1f2223', { mat: 'matte' }),
    rounded(0.07, 0.003, 0.008, 0.001, 0.008, 0.0645, -0.11, '#1f2223', { mat: 'matte' }),

    // additional drain holes at the front and back edges
    cyl(0.01, 0.01, 0.006, 0, 0.063, 0.145, '#1f2223', { mat: 'matte' }, 10),
    cyl(0.01, 0.01, 0.006, 0, 0.063, -0.145, '#1f2223', { mat: 'matte' }, 10),
  ],
})
