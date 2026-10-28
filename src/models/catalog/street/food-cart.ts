import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const bodyPaint = C.cream
const accent = C.red
const trim = C.ink
const tire = C.blackMetal
const GLOW = '#f4d3a0'
const BULBS = [-0.8, -0.4, 0, 0.4, 0.8]

export default defineModel({
  id: 'food-cart',
  name: '街头餐车',
  category: 'street',
  tags: ['food-cart', 'cart', 'street-food', '街头餐车', '餐车', '小吃'],
  footprint: [2.4, 1.2],
  height: 2.2,
  placement: 'outdoor',
  parts: [
    // chassis, axle, tow bar and hitch ring
    rounded(1.9, 0.1, 0.9, 0.02, 0, 0.53, 0, trim, { mat: 'metal' }),
    cyl(0.018, 0.018, 0.84, -0.58, 0.26, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.025, 0.025, 0.28, -1.04, 0.4, 0, C.graphite, { mat: 'metal', rot: [0, 0, 2.4] }, 10),
    torus(0.035, 0.012, -1.14, 0.275, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),

    // two braked wheels and one swivelling castor
    torus(0.2, 0.06, -0.58, 0.26, 0.36, tire, { mat: 'matte' }, 24),
    torus(0.2, 0.06, -0.58, 0.26, -0.36, tire, { mat: 'matte' }, 24),
    cyl(0.1, 0.1, 0.13, -0.58, 0.26, 0.36, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.1, 0.1, 0.13, -0.58, 0.26, -0.36, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    torus(0.105, 0.035, 0.82, 0.14, 0, tire, { mat: 'matte' }, 20),
    cyl(0.055, 0.055, 0.08, 0.82, 0.14, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    rounded(0.05, 0.2, 0.12, 0.012, 0.82, 0.27, 0, C.graphite, { mat: 'metal' }),
    cyl(0.02, 0.02, 0.1, 0.82, 0.44, 0, C.graphite, { mat: 'metal' }, 10),

    // painted body with a red skirt, timber counter and low back splash
    rounded(1.9, 0.72, 0.92, 0.03, 0, 0.94, -0.02, bodyPaint, { mat: 'matte' }),
    rounded(1.92, 0.16, 0.94, 0.02, 0, 0.66, -0.02, accent, { mat: 'matte' }),
    rounded(2.0, 0.06, 1.0, 0.015, 0, 1.33, -0.02, C.oak, { mat: 'wood' }),
    rounded(2.0, 0.12, 0.04, 0.012, 0, 1.42, -0.5, C.oak, { mat: 'wood' }),

    // serving posts, roof and fascia
    rounded(0.05, 0.55, 0.05, 0.01, 0.9, 1.635, 0.44, trim, { mat: 'metal' }),
    rounded(0.05, 0.55, 0.05, 0.01, -0.9, 1.635, 0.44, trim, { mat: 'metal' }),
    rounded(2.0, 0.07, 1.02, 0.02, 0, 1.925, -0.02, bodyPaint, { mat: 'matte' }),
    rounded(2.02, 0.08, 0.04, 0.012, 0, 1.93, 0.48, accent, { mat: 'matte' }),
    box(1.7, 0.48, 0.01, 0, 1.65, -0.44, C.glass, { mat: 'glass', opacity: 0.7 }),

    // chalk menu standing on the back counter
    rounded(0.4, 0.5, 0.03, 0.012, 0.5, 1.62, -0.2, trim, { mat: 'matte' }),
    box(0.32, 0.035, 0.008, 0.5, 1.82, -0.18, C.cream),
    box(0.26, 0.016, 0.006, 0.5, 1.74, -0.18, '#c4bfb1'),
    box(0.22, 0.016, 0.006, 0.5, 1.7, -0.18, '#c4bfb1'),
    box(0.28, 0.016, 0.006, 0.5, 1.66, -0.18, '#c4bfb1'),

    // glass display case on the counter
    rounded(0.62, 0.04, 0.42, 0.01, -0.38, 1.38, 0.04, C.oak, { mat: 'wood' }),
    box(0.58, 0.34, 0.01, -0.38, 1.57, 0.25, C.glass, { mat: 'glass', opacity: 0.6 }),
    box(0.62, 0.01, 0.42, -0.38, 1.75, 0.04, C.glass, { mat: 'glass', opacity: 0.6 }),

    // bottles and a brass jar beside the case
    cyl(0.03, 0.03, 0.14, 0.45, 1.43, 0.12, C.navy, { mat: 'gloss' }, 12),
    cyl(0.028, 0.028, 0.12, 0.55, 1.42, 0.06, C.red, { mat: 'gloss' }, 12),
    cyl(0.045, 0.045, 0.1, 0.64, 1.41, 0.0, C.brass, { mat: 'metal' }, 14),

    // striped fabric awning and its two poles
    rounded(2.0, 0.03, 0.58, 0.012, 0, 2.02, 0.3, C.linen, { mat: 'fabric', rot: [0.22, 0, 0] }),
    rounded(0.34, 0.032, 0.58, 0.012, 0.62, 2.022, 0.3, accent, { mat: 'fabric', rot: [0.22, 0, 0] }),
    rounded(0.34, 0.032, 0.58, 0.012, -0.62, 2.022, 0.3, accent, { mat: 'fabric', rot: [0.22, 0, 0] }),
    rounded(2.0, 0.08, 0.02, 0.008, 0, 1.95, 0.585, C.linen, { mat: 'fabric' }),
    cyl(0.012, 0.012, 0.6, 0.9, 1.66, 0.55, trim, { mat: 'metal' }, 10),
    cyl(0.012, 0.012, 0.6, -0.9, 1.66, 0.55, trim, { mat: 'metal' }, 10),

    // sagging string lights with warm bulbs
    ...BULBS.map((x, i) =>
      sphere(0.02, x, i === 2 ? 1.87 : 1.89, 0.5, GLOW, { mat: 'emissive' }, 10),
    ),
    cyl(0.003, 0.003, 0.8, -0.4, 1.885, 0.5, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 6),
    cyl(0.003, 0.003, 0.8, 0.4, 1.885, 0.5, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 6),

    // roof-mounted name board
    cyl(0.008, 0.008, 0.1, 0.3, 1.99, -0.4, C.steel, { mat: 'metal' }, 8),
    cyl(0.008, 0.008, 0.1, -0.3, 1.99, -0.4, C.steel, { mat: 'metal' }, 8),
    rounded(0.8, 0.16, 0.03, 0.01, 0, 2.12, -0.4, accent, { mat: 'matte' }),
    box(0.5, 0.02, 0.008, 0, 2.14, -0.383, C.cream),
    box(0.36, 0.014, 0.008, 0, 2.11, -0.383, C.cream),

    // side service door and its fittings
    rounded(0.02, 0.56, 0.48, 0.008, 0.955, 0.94, 0.1, bodyPaint, { mat: 'matte' }),
    rounded(0.025, 0.08, 0.03, 0.006, 0.965, 1.15, -0.1, C.steel, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.14, 0.97, 0.95, 0.18, C.steel, { mat: 'metal' }, 10),

    // licence plate on the skirt
    rounded(0.2, 0.1, 0.01, 0.005, 0.5, 0.66, 0.455, C.cream, { mat: 'matte' }),
    box(0.14, 0.02, 0.006, 0.5, 0.66, 0.462, C.navy),

    // low roof vent
    rounded(0.3, 0.08, 0.3, 0.015, -0.55, 1.99, -0.2, C.graphite, { mat: 'metal' }),

    // propane cylinder slung under the chassis
    cyl(0.09, 0.09, 0.24, 0.45, 0.36, 0, C.cream, { mat: 'metal' }, 20),
    torus(0.09, 0.008, 0.45, 0.255, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.014, 0.014, 0.04, 0.45, 0.46, 0.09, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.022, 0.022, 0.014, 0.45, 0.46, 0.108, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),

    // wheel hub lug nuts on both wheels
    ...[0.428, -0.428].flatMap((z) =>
      [0, 1, 2, 3].map((i) =>
        sphere(0.009, -0.58 + 0.062 * Math.sin((i * Math.PI) / 2), 0.26 + 0.062 * Math.cos((i * Math.PI) / 2), z, C.steel, {
          mat: 'metal',
        }, 8),
      ),
    ),
  ],
})
