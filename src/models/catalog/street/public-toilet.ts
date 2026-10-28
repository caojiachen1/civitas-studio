import { C, box, cyl, defineModel, prism, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const wallPaint = C.sage
const trim = C.ink
const doorPaint = C.navy
const ROOF_Z = -0.19

export default defineModel({
  id: 'public-toilet',
  name: '公共卫生间',
  category: 'street',
  tags: ['public-toilet', 'toilet', 'wc', '公共卫生间', '公厕', '无障碍'],
  footprint: [2.2, 2.0],
  height: 2.7,
  placement: 'outdoor',
  parts: [
    // concrete pad under the cubicle
    rounded(2.18, 0.06, 1.56, 0.02, 0, 0.03, -0.22, C.concrete, { mat: 'stone' }),

    // wall panels with a dark base trim
    rounded(1.92, 2.34, 0.08, 0.015, 0, 1.23, -0.91, wallPaint, { mat: 'matte' }),
    rounded(0.08, 2.34, 1.42, 0.015, -0.96, 1.23, -0.19, wallPaint, { mat: 'matte' }),
    rounded(0.08, 2.34, 1.42, 0.015, 0.96, 1.23, -0.19, wallPaint, { mat: 'matte' }),
    rounded(0.5, 2.34, 0.08, 0.015, -0.71, 1.23, 0.5, wallPaint, { mat: 'matte' }),
    rounded(0.5, 2.34, 0.08, 0.015, 0.71, 1.23, 0.5, wallPaint, { mat: 'matte' }),
    rounded(0.92, 0.3, 0.08, 0.015, 0, 2.25, 0.5, wallPaint, { mat: 'matte' }),
    rounded(0.09, 2.34, 0.09, 0.012, 0.96, 1.23, 0.5, trim, { mat: 'metal' }),
    rounded(0.09, 2.34, 0.09, 0.012, -0.96, 1.23, 0.5, trim, { mat: 'metal' }),

    // flat roof with fascia and a stepped cap
    rounded(2.08, 0.09, 1.62, 0.02, 0, 2.445, ROOF_Z, trim, { mat: 'metal' }),
    rounded(2.12, 0.1, 0.04, 0.012, 0, 2.46, 0.63, C.cream, { mat: 'matte' }),
    rounded(1.94, 0.04, 1.46, 0.02, 0, 2.51, ROOF_Z, C.graphite, { mat: 'metal' }),
    rounded(0.05, 0.08, 1.62, 0.012, -1.04, 2.45, ROOF_Z, C.cream, { mat: 'matte' }),
    rounded(0.05, 0.08, 1.62, 0.012, 1.04, 2.45, ROOF_Z, C.cream, { mat: 'matte' }),

    // low roof vent
    rounded(0.3, 0.06, 0.3, 0.015, -0.55, 2.53, -0.35, C.graphite, { mat: 'metal' }),
    rounded(0.34, 0.015, 0.34, 0.008, -0.55, 2.5675, -0.35, C.steel, { mat: 'metal' }),

    // illuminated WC sign board over the door
    rounded(0.9, 0.26, 0.03, 0.015, 0, 2.57, 0.655, C.graphite, { mat: 'metal' }),
    rounded(0.84, 0.2, 0.008, 0.006, 0, 2.57, 0.675, '#47657f', { mat: 'matte' }),
    cyl(0.022, 0.022, 0.004, -0.06, 2.61, 0.683, C.white, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 12),
    box(0.035, 0.08, 0.004, -0.06, 2.545, 0.683, C.white, { mat: 'matte' }),
    cyl(0.022, 0.022, 0.004, 0.06, 2.61, 0.683, C.white, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 12),
    prism(
      [
        [0.03, 0.04],
        [0.09, 0.04],
        [0.08, -0.04],
        [0.04, -0.04],
      ],
      0.004,
      0,
      2.545,
      0.683,
      C.white,
      { mat: 'matte' },
    ),

    // door frame and metal door
    rounded(1.02, 0.08, 0.12, 0.015, 0, 2.12, 0.52, trim, { mat: 'metal' }),
    rounded(0.06, 2.06, 0.1, 0.012, -0.49, 1.06, 0.52, trim, { mat: 'metal' }),
    rounded(0.06, 2.06, 0.1, 0.012, 0.49, 1.06, 0.52, trim, { mat: 'metal' }),
    rounded(0.86, 2.0, 0.05, 0.02, 0, 1.07, 0.54, doorPaint, { mat: 'matte' }),
    box(0.5, 0.28, 0.012, 0, 1.86, 0.568, C.glass, { mat: 'glass', opacity: 0.8 }),
    rounded(0.54, 0.03, 0.02, 0.008, 0, 2.01, 0.57, trim, { mat: 'metal' }),
    rounded(0.54, 0.03, 0.02, 0.008, 0, 1.71, 0.57, trim, { mat: 'metal' }),
    rounded(0.82, 0.18, 0.015, 0.006, 0, 0.21, 0.568, C.steel, { mat: 'metal' }),

    // lever handle, lock and hinges
    rounded(0.04, 0.22, 0.02, 0.008, -0.33, 1.06, 0.568, C.brass, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.14, -0.27, 1.08, 0.59, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.02, 0.02, 0.014, -0.33, 0.96, 0.57, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    rounded(0.03, 0.1, 0.03, 0.006, 0.44, 1.62, 0.567, C.steel, { mat: 'metal' }),
    rounded(0.03, 0.1, 0.03, 0.006, 0.44, 0.5, 0.567, C.steel, { mat: 'metal' }),
    rounded(0.1, 0.2, 0.008, 0.004, 0.3, 1.06, 0.566, C.steel, { mat: 'metal' }),

    // occupancy indicator over the door
    rounded(0.12, 0.05, 0.02, 0.008, 0, 2.24, 0.551, trim, { mat: 'metal' }),
    sphere(0.009, 0.03, 2.24, 0.563, '#8fbf8a', { mat: 'emissive' }, 8),

    // louvered vent on the right wall
    rounded(0.03, 0.36, 0.5, 0.012, 0.985, 2.05, -0.1, trim, { mat: 'metal' }),
    ...[1.92, 1.98, 2.04, 2.1].map((y) =>
      box(0.02, 0.02, 0.42, 1.0, y, -0.1, C.steel, { mat: 'metal', rot: [0.5, 0, 0] }),
    ),

    // accessible ramp and its kerbs
    prism(
      [
        [0, 0],
        [0.45, 0],
        [0.45, 0.062],
      ],
      1.4,
      0,
      0,
      1.0,
      C.concrete,
      { mat: 'stone', rot: [0, Math.PI / 2, 0] },
    ),
    box(0.05, 0.06, 0.44, -0.665, 0.09, 0.78, C.graphite, { mat: 'stone', rot: [0.137, 0, 0] }),
    box(0.05, 0.06, 0.44, 0.665, 0.09, 0.78, C.graphite, { mat: 'stone', rot: [0.137, 0, 0] }),

    // ramp handrails: two rails and four posts
    cyl(0.016, 0.016, 0.4, -0.665, 0.885, 0.775, C.steel, { mat: 'metal', rot: [-Math.PI / 2 + 0.137, 0, 0] }, 12),
    cyl(0.016, 0.016, 0.4, 0.665, 0.885, 0.775, C.steel, { mat: 'metal', rot: [-Math.PI / 2 + 0.137, 0, 0] }, 12),
    cyl(0.014, 0.014, 0.85, -0.665, 0.48, 0.6, C.steel, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.85, 0.665, 0.48, 0.6, C.steel, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.85, -0.665, 0.432, 0.95, C.steel, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.85, 0.665, 0.432, 0.95, C.steel, { mat: 'metal' }, 10),
    box(1.3, 0.01, 0.16, 0, 0.018, 0.92, '#9a988f', { mat: 'stone', rot: [0.137, 0, 0] }),

    // wall lamp over the door
    rounded(0.14, 0.06, 0.09, 0.015, 0, 2.28, 0.585, trim, { mat: 'metal' }),
    box(0.1, 0.008, 0.06, 0, 2.246, 0.59, '#f4d3a0', { mat: 'emissive' }),

    // back downspout
    cyl(0.028, 0.028, 2.2, 0.9, 1.16, -0.95, C.graphite, { mat: 'metal' }, 12),
    cyl(0.03, 0.03, 0.24, 0.9, 0.1, -0.86, C.graphite, { mat: 'metal', rot: [0.9, 0, 0] }, 12),

    // WC plate on the door
    rounded(0.16, 0.12, 0.01, 0.005, 0, 1.56, 0.568, C.cream, { mat: 'matte' }),
    box(0.1, 0.02, 0.004, 0, 1.57, 0.575, C.navy),

    // wheelchair pictogram on the door leaf
    rounded(0.18, 0.18, 0.008, 0.004, 0.28, 0.78, 0.567, '#47657f', { mat: 'matte' }),
    cyl(0.014, 0.014, 0.003, 0.28, 0.826, 0.5715, C.white, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 12),
    box(0.016, 0.05, 0.003, 0.276, 0.8, 0.5715, C.white, { mat: 'matte' }),
    torus(0.032, 0.005, 0.288, 0.785, 0.5715, C.white, { mat: 'matte' }, 16),
    box(0.042, 0.008, 0.003, 0.291, 0.79, 0.5715, C.white, { mat: 'matte' }),
    box(0.008, 0.03, 0.003, 0.301, 0.766, 0.5715, C.white, { mat: 'matte', rot: [0, 0, 0.4] }),

    // hydraulic door closer under the head frame
    rounded(0.24, 0.06, 0.05, 0.01, 0.16, 2.05, 0.585, C.steel, { mat: 'metal' }),
    box(0.26, 0.018, 0.03, 0.3, 2.07, 0.59, C.steel, { mat: 'metal' }),

    // roof scupper outlet at the rear edge
    box(0.18, 0.05, 0.04, 0.55, 2.44, -1.005, C.graphite, { mat: 'metal' }),
    box(0.12, 0.026, 0.01, 0.55, 2.44, -1.028, C.ink, { mat: 'metal' }),
  ],
})
