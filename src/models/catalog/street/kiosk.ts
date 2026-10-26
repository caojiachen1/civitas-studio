import { C, box, cone, cyl, defineModel, rbox, sphere } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bodyPaint = C.sage
const trim = C.ink

export default defineModel({
  id: 'kiosk',
  name: '街角售货亭',
  category: 'street',
  tags: ['kiosk', 'booth', 'vendor', '售货亭', '报刊亭'],
  footprint: [2.4, 2.0],
  height: 2.8,
  placement: 'outdoor',
  parts: [
    // concrete pad
    rounded(2.36, 0.06, 1.96, 0.02, 0, 0.03, 0, C.concrete, { mat: 'stone' }),

    // painted enclosure
    rounded(2.0, 2.28, 0.08, 0.02, 0, 1.2, -0.62, bodyPaint, { mat: 'matte' }),
    rounded(0.08, 2.28, 1.14, 0.02, 0.96, 1.2, -0.05, bodyPaint, { mat: 'matte' }),
    rounded(0.08, 2.28, 1.14, 0.02, -0.96, 1.2, -0.05, bodyPaint, { mat: 'matte' }),
    rounded(2.0, 0.92, 0.08, 0.02, 0, 0.52, 0.52, bodyPaint, { mat: 'matte' }),
    rounded(0.1, 2.3, 0.1, 0.015, 0.96, 1.21, -0.6, trim, { mat: 'metal' }),
    rounded(0.1, 2.3, 0.1, 0.015, -0.96, 1.21, -0.6, trim, { mat: 'metal' }),
    rounded(0.1, 2.3, 0.1, 0.015, 0.96, 1.21, 0.5, trim, { mat: 'metal' }),
    rounded(0.1, 2.3, 0.1, 0.015, -0.96, 1.21, 0.5, trim, { mat: 'metal' }),

    // serving counter and kick plate
    rounded(2.1, 0.08, 0.4, 0.02, 0, 1.02, 0.66, C.oak, { mat: 'wood' }),
    rounded(2.02, 0.1, 0.04, 0.012, 0, 0.12, 0.565, trim, { mat: 'metal' }),

    // display glazing and frames
    box(1.84, 1.12, 0.02, 0, 1.69, 0.535, C.glass, { mat: 'glass', opacity: 0.85 }),
    rounded(1.84, 0.06, 0.06, 0.012, 0, 1.1, 0.535, trim, { mat: 'metal' }),
    rounded(1.84, 0.06, 0.06, 0.012, 0, 2.28, 0.535, trim, { mat: 'metal' }),
    rounded(0.04, 1.12, 0.05, 0.008, 0, 1.69, 0.535, trim, { mat: 'metal' }),

    // interior shelves and goods
    rounded(1.7, 0.04, 0.3, 0.008, 0, 1.32, -0.4, C.birch, { mat: 'wood' }),
    rounded(1.7, 0.04, 0.3, 0.008, 0, 1.68, -0.4, C.birch, { mat: 'wood' }),
    cyl(0.04, 0.035, 0.09, -0.45, 1.745, -0.4, C.red, { mat: 'gloss' }, 12),
    cyl(0.04, 0.035, 0.09, 0, 1.745, -0.4, C.cream, { mat: 'gloss' }, 12),
    cyl(0.04, 0.035, 0.09, 0.45, 1.745, -0.4, C.navy, { mat: 'gloss' }, 12),
    rounded(0.16, 0.12, 0.12, 0.01, 0.3, 1.4, -0.4, C.brass, { mat: 'metal' }),

    // flat roof, fascia and sign
    rounded(2.2, 0.1, 1.4, 0.03, 0, 2.39, -0.05, trim, { mat: 'metal' }),
    rounded(2.2, 0.12, 0.06, 0.015, 0, 2.5, 0.63, C.cream, { mat: 'matte' }),
    rounded(0.06, 0.12, 1.4, 0.015, 1.07, 2.5, -0.05, C.cream, { mat: 'matte' }),
    rounded(0.06, 0.12, 1.4, 0.015, -1.07, 2.5, -0.05, C.cream, { mat: 'matte' }),
    rounded(2.0, 0.28, 0.06, 0.02, 0, 2.66, 0.62, C.cream, { mat: 'matte' }),
    box(1.7, 0.035, 0.012, 0, 2.6, 0.654, C.navy),
    box(1.7, 0.035, 0.012, 0, 2.66, 0.654, C.red),
    box(1.7, 0.035, 0.012, 0, 2.72, 0.654, C.brass),

    // sloped fabric awning
    rounded(2.2, 0.05, 0.48, 0.02, 0, 2.2, 0.76, C.linen, { mat: 'fabric', rot: [0.42, 0, 0] }),
    rounded(0.34, 0.056, 0.44, 0.015, 0.55, 2.235, 0.76, C.red, { mat: 'fabric', rot: [0.42, 0, 0] }),
    rounded(0.34, 0.056, 0.44, 0.015, -0.55, 2.235, 0.76, C.red, { mat: 'fabric', rot: [0.42, 0, 0] }),
    rounded(2.2, 0.1, 0.03, 0.01, 0, 2.035, 0.985, C.linen, { mat: 'fabric' }),
    cyl(0.018, 0.018, 0.5, 0.9, 1.96, 0.76, trim, { mat: 'metal', rot: [1.2, 0, 0] }, 10),
    cyl(0.018, 0.018, 0.5, -0.9, 1.96, 0.76, trim, { mat: 'metal', rot: [1.2, 0, 0] }, 10),

    // side menu board
    rounded(0.05, 0.62, 0.44, 0.012, 1.0, 1.55, -0.05, trim, { mat: 'metal' }),
    rounded(0.012, 0.54, 0.36, 0.004, 1.03, 1.55, -0.05, C.cream, { mat: 'matte' }),
    box(0.01, 0.03, 0.26, 1.038, 1.66, -0.05, C.navy),
    box(0.01, 0.03, 0.26, 1.038, 1.58, -0.05, C.red),

    // warm pendants under the roof
    cyl(0.008, 0.008, 0.18, 0.6, 2.39, 0.35, C.steel, { mat: 'metal' }, 8),
    cyl(0.008, 0.008, 0.18, -0.6, 2.39, 0.35, C.steel, { mat: 'metal' }, 8),
    cone(0.09, 0.12, 0.6, 2.24, 0.35, C.blackMetal, { mat: 'metal' }, 16),
    cone(0.09, 0.12, -0.6, 2.24, 0.35, C.blackMetal, { mat: 'metal' }, 16),
    sphere(0.04, 0.6, 2.19, 0.35, '#f4d3a0', { mat: 'emissive' }, 12),
    sphere(0.04, -0.6, 2.19, 0.35, '#f4d3a0', { mat: 'emissive' }, 12),

    // side service door with frame, hinges and lever
    rounded(0.05, 1.9, 0.68, 0.012, -1.005, 1.02, 0.1, trim, { mat: 'metal' }),
    rounded(0.035, 1.78, 0.58, 0.01, -1.035, 1.02, 0.1, bodyPaint, { mat: 'matte' }),
    rounded(0.02, 0.34, 0.34, 0.006, -1.056, 1.06, 0.1, C.glass, { mat: 'glass', opacity: 0.8 }),
    ...[0.62, 1.42].map((y) =>
      rounded(0.02, 0.09, 0.05, 0.006, -1.06, y, 0.36, C.steel, { mat: 'metal' }),
    ),
    rounded(0.04, 0.04, 0.14, 0.012, -1.065, 1.0, 0.27, C.brass, { mat: 'metal' }),
    box(0.02, 0.05, 0.03, -1.062, 1.0, 0.34, C.brass),

    // window mullions and sill
    box(0.035, 1.12, 0.05, 0.45, 1.69, 0.545, trim, { mat: 'metal' }),
    box(0.035, 1.12, 0.05, -0.45, 1.69, 0.545, trim, { mat: 'metal' }),
    box(1.84, 0.035, 0.05, 0, 1.66, 0.545, trim, { mat: 'metal' }),
    box(1.9, 0.05, 0.16, 0, 1.12, 0.63, C.oak, { mat: 'wood' }),

    // price tags, stacked goods and sign lettering
    ...[-0.45, 0, 0.45].flatMap((x) => [
      box(0.1, 0.045, 0.008, x, 1.36, -0.242, C.cream, { mat: 'matte' }),
      box(0.07, 0.01, 0.006, x, 1.36, -0.236, C.red, { mat: 'matte' }),
      box(0.1, 0.045, 0.008, x, 1.72, -0.242, C.cream, { mat: 'matte' }),
    ]),
    ...[-0.6, -0.2, 0.2, 0.6].map((x) =>
      box(0.26, 0.055, 0.012, x, 2.68, 0.654, C.navy, { mat: 'matte' }),
    ),
    // back-corner downspout and entrance step
    cyl(0.024, 0.024, 2.28, -1.05, 1.17, -0.72, trim, { mat: 'metal' }, 10),
    cyl(0.026, 0.026, 0.3, -1.05, 0.1, -0.62, trim, { mat: 'metal', rot: [0.9, 0, 0] }, 10),
    rounded(0.26, 0.08, 0.7, 0.02, -0.88, 0.04, 0.1, C.concrete, { mat: 'stone' }),
  ],
})
