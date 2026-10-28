import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const frame = C.blackMetal
const glazing = C.glass
const COIN_SLOT = '#1e2224'
const KEY = '#3b4145'

export default defineModel({
  id: 'phone-booth',
  name: '电话亭',
  category: 'street',
  tags: ['phone-booth', 'telephone', 'booth', '电话亭', '公用电话', '街头'],
  footprint: [1.0, 1.0],
  height: 2.4,
  placement: 'outdoor',
  parts: [
    // cast base plate with four anchor bolts
    rounded(0.98, 0.06, 0.98, 0.03, 0, 0.03, 0, C.graphite, { mat: 'metal' }),
    ...[0.42, -0.42].flatMap((x) =>
      [0.42, -0.42].map((z) => cyl(0.014, 0.014, 0.02, x, 0.065, z, C.steel, { mat: 'metal' }, 8)),
    ),

    // corner posts
    ...[0.425, -0.425].flatMap((x) =>
      [0.425, -0.425].map((z) =>
        rounded(0.075, 2.18, 0.075, 0.012, x, 1.15, z, frame, { mat: 'metal' }),
      ),
    ),

    // head rails and sill rails
    rounded(0.86, 0.07, 0.055, 0.012, 0, 2.12, 0.425, frame, { mat: 'metal' }),
    rounded(0.86, 0.07, 0.055, 0.012, 0, 2.12, -0.425, frame, { mat: 'metal' }),
    rounded(0.055, 0.07, 0.86, 0.012, 0.425, 2.12, 0, frame, { mat: 'metal' }),
    rounded(0.055, 0.07, 0.86, 0.012, -0.425, 2.12, 0, frame, { mat: 'metal' }),
    rounded(0.86, 0.05, 0.055, 0.012, 0, 0.095, 0.425, frame, { mat: 'metal' }),
    rounded(0.86, 0.05, 0.055, 0.012, 0, 0.095, -0.425, frame, { mat: 'metal' }),
    rounded(0.055, 0.05, 0.86, 0.012, 0.425, 0.095, 0, frame, { mat: 'metal' }),
    rounded(0.055, 0.05, 0.86, 0.012, -0.425, 0.095, 0, frame, { mat: 'metal' }),

    // three fixed glazed walls and a transom rail
    box(0.78, 1.98, 0.012, 0, 1.11, -0.425, glazing, { mat: 'glass', opacity: 0.8 }),
    box(0.012, 1.98, 0.78, 0.425, 1.11, 0, glazing, { mat: 'glass', opacity: 0.8 }),
    box(0.012, 1.98, 0.78, -0.425, 1.11, 0, glazing, { mat: 'glass', opacity: 0.8 }),
    box(0.8, 0.028, 0.026, 0, 1.42, -0.425, frame, { mat: 'metal' }),

    // glazed door: stiles, glass, kick plate and top rail
    rounded(0.05, 1.94, 0.05, 0.01, -0.335, 1.09, 0.425, frame, { mat: 'metal' }),
    rounded(0.05, 1.94, 0.05, 0.01, 0.335, 1.09, 0.425, frame, { mat: 'metal' }),
    box(0.62, 1.86, 0.012, 0, 1.1, 0.425, glazing, { mat: 'glass', opacity: 0.8 }),
    rounded(0.67, 0.22, 0.055, 0.012, 0, 0.2, 0.43, C.graphite, { mat: 'metal' }),
    rounded(0.67, 0.11, 0.05, 0.01, 0, 2.06, 0.43, frame, { mat: 'metal' }),
    rounded(0.86, 0.09, 0.045, 0.01, 0, 2.195, 0.435, frame, { mat: 'metal' }),

    // brass pull handle and hinge plates
    cyl(0.016, 0.016, 0.3, 0.27, 1.1, 0.47, C.brass, { mat: 'metal' }, 12),
    cyl(0.01, 0.01, 0.04, 0.27, 1.23, 0.45, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.01, 0.01, 0.04, 0.27, 0.97, 0.45, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    rounded(0.025, 0.1, 0.03, 0.006, -0.36, 1.58, 0.445, C.steel, { mat: 'metal' }),
    rounded(0.025, 0.1, 0.03, 0.006, -0.36, 0.62, 0.445, C.steel, { mat: 'metal' }),

    // wall-mounted telephone: backboard, body, handset and cradle
    rounded(0.34, 0.52, 0.03, 0.012, 0, 1.4, -0.4, C.graphite, { mat: 'metal' }),
    rounded(0.28, 0.38, 0.1, 0.02, 0, 1.41, -0.34, C.ink, { mat: 'gloss' }),
    cyl(0.022, 0.022, 0.2, -0.105, 1.44, -0.27, C.ink, { mat: 'gloss' }, 12),
    sphere(0.036, -0.105, 1.548, -0.27, C.ink, { mat: 'gloss' }, 12),
    sphere(0.042, -0.105, 1.332, -0.27, C.ink, { mat: 'gloss' }, 12),
    rounded(0.09, 0.02, 0.04, 0.008, -0.105, 1.44, -0.297, C.steel, { mat: 'metal' }),

    // keypad with six keys, coin bezel and slot
    rounded(0.12, 0.13, 0.01, 0.004, 0.045, 1.42, -0.285, C.graphite, { mat: 'metal' }),
    ...[0.015, 0.065].flatMap((x) =>
      [1.46, 1.42, 1.38].map((y) => box(0.028, 0.022, 0.008, x, y, -0.277, KEY, { mat: 'gloss' })),
    ),
    rounded(0.07, 0.035, 0.012, 0.004, 0.045, 1.3, -0.284, C.brass, { mat: 'metal' }),
    box(0.045, 0.008, 0.006, 0.045, 1.3, -0.277, COIN_SLOT),

    // writing shelf and its bracket
    rounded(0.36, 0.028, 0.14, 0.008, 0, 1.02, -0.35, C.steel, { mat: 'metal' }),
    rounded(0.02, 0.1, 0.1, 0.006, 0, 0.965, -0.36, frame, { mat: 'metal' }),

    // illuminated number plaque over the door
    rounded(0.46, 0.065, 0.018, 0.006, 0, 2.197, 0.463, C.cream, { mat: 'matte' }),
    box(0.3, 0.016, 0.008, 0, 2.21, 0.474, C.navy),
    box(0.22, 0.012, 0.008, 0, 2.185, 0.474, C.navy),

    // stepped roof cap with a turned finial
    rounded(1.0, 0.06, 1.0, 0.03, 0, 2.27, 0, frame, { mat: 'metal' }),
    rounded(0.9, 0.06, 0.9, 0.025, 0, 2.33, 0, C.graphite, { mat: 'metal' }),
    rounded(0.5, 0.03, 0.5, 0.015, 0, 2.375, 0, C.steel, { mat: 'metal' }),
    cyl(0.055, 0.065, 0.02, 0, 2.39, 0, C.graphite, { mat: 'metal' }, 20),

    // ceiling lamp under the cap
    rounded(0.22, 0.02, 0.22, 0.008, 0, 2.21, 0, frame, { mat: 'metal' }),
    box(0.18, 0.01, 0.18, 0, 2.196, 0, '#f4d3a0', { mat: 'emissive' }),

    // ribbed rubber floor mat
    box(0.62, 0.008, 0.56, 0, 0.068, 0, '#5c5e58', { mat: 'matte' }),
    ...[-0.18, 0, 0.18].map((z) => box(0.6, 0.004, 0.02, 0, 0.073, z, '#4a4c47', { mat: 'matte' })),

    // directory card holder beside the telephone
    rounded(0.16, 0.22, 0.03, 0.006, 0.27, 1.16, -0.4, C.graphite, { mat: 'metal' }),
    box(0.13, 0.18, 0.004, 0.27, 1.16, -0.383, C.cream, { mat: 'matte' }),
    box(0.11, 0.014, 0.004, 0.27, 1.235, -0.383, C.navy),

    // lock barrel in the door stile
    cyl(0.014, 0.014, 0.012, 0.335, 1.02, 0.452, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    box(0.004, 0.014, 0.004, 0.335, 1.02, 0.4585, COIN_SLOT, { mat: 'matte' }),
  ],
})
