import { C, box, cone, cyl, defineModel, rbox, sphere } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const frame = C.ink
const glass = C.glass

export default defineModel({
  id: 'bus-stop',
  name: '公交候车亭',
  category: 'street',
  tags: ['bus', 'shelter', 'stop', '公交', '候车亭'],
  footprint: [3.4, 1.3],
  height: 3.25,
  placement: 'outdoor',
  parts: [
    // paved base
    rounded(3.4, 0.06, 1.3, 0.02, 0, 0.03, 0, C.concrete, { mat: 'stone' }),

    // steel frame posts and base plates
    rounded(0.09, 2.42, 0.09, 0.015, 1.62, 1.27, 0.56, frame, { mat: 'metal' }),
    rounded(0.09, 2.42, 0.09, 0.015, -1.62, 1.27, 0.56, frame, { mat: 'metal' }),
    rounded(0.09, 2.42, 0.09, 0.015, 1.62, 1.27, -0.56, frame, { mat: 'metal' }),
    rounded(0.09, 2.42, 0.09, 0.015, -1.62, 1.27, -0.56, frame, { mat: 'metal' }),
    rounded(0.16, 0.03, 0.16, 0.008, 1.62, 0.075, 0.56, C.steel, { mat: 'metal' }),
    rounded(0.16, 0.03, 0.16, 0.008, -1.62, 0.075, 0.56, C.steel, { mat: 'metal' }),
    rounded(0.16, 0.03, 0.16, 0.008, 1.62, 0.075, -0.56, C.steel, { mat: 'metal' }),
    rounded(0.16, 0.03, 0.16, 0.008, -1.62, 0.075, -0.56, C.steel, { mat: 'metal' }),

    // flat roof with a slim pressed fascia
    rounded(3.3, 0.08, 1.24, 0.03, 0, 2.52, 0, C.graphite, { mat: 'metal' }),
    rounded(3.4, 0.09, 0.05, 0.015, 0, 2.605, 0.625, frame, { mat: 'metal' }),
    rounded(3.4, 0.09, 0.05, 0.015, 0, 2.605, -0.625, frame, { mat: 'metal' }),
    rounded(0.05, 0.09, 1.2, 0.015, 1.675, 2.605, 0, frame, { mat: 'metal' }),
    rounded(0.05, 0.09, 1.2, 0.015, -1.675, 2.605, 0, frame, { mat: 'metal' }),

    // back glazing and rails
    box(3.12, 2.0, 0.02, 0, 1.35, -0.6, glass, { mat: 'glass', opacity: 0.85 }),
    rounded(3.2, 0.06, 0.06, 0.012, 0, 0.36, -0.585, frame, { mat: 'metal' }),
    rounded(3.2, 0.06, 0.06, 0.012, 0, 2.36, -0.585, frame, { mat: 'metal' }),
    rounded(0.04, 2.0, 0.05, 0.008, 0.53, 1.35, -0.585, frame, { mat: 'metal' }),
    rounded(0.04, 2.0, 0.05, 0.008, -0.53, 1.35, -0.585, frame, { mat: 'metal' }),

    // side glazing
    box(0.02, 2.0, 1.02, 1.62, 1.35, 0, glass, { mat: 'glass', opacity: 0.85 }),
    box(0.02, 2.0, 1.02, -1.62, 1.35, 0, glass, { mat: 'glass', opacity: 0.85 }),

    // integrated timber bench
    rounded(2.6, 0.05, 0.12, 0.012, 0, 0.46, -0.14, C.oak, { mat: 'wood' }),
    rounded(2.6, 0.05, 0.12, 0.012, 0, 0.46, -0.27, C.oak, { mat: 'wood' }),
    rounded(2.6, 0.05, 0.12, 0.012, 0, 0.46, -0.4, C.oak, { mat: 'wood' }),
    rounded(2.6, 0.09, 0.035, 0.008, 0, 0.62, -0.47, C.oak, { mat: 'wood' }),
    rounded(2.6, 0.09, 0.035, 0.008, 0, 0.75, -0.47, C.oak, { mat: 'wood' }),
    rounded(0.05, 0.76, 0.36, 0.01, 1.0, 0.44, -0.3, frame, { mat: 'metal' }),
    rounded(0.05, 0.76, 0.36, 0.01, 0, 0.44, -0.3, frame, { mat: 'metal' }),
    rounded(0.05, 0.76, 0.36, 0.01, -1.0, 0.44, -0.3, frame, { mat: 'metal' }),

    // route board with abstract colour blocks
    rounded(1.7, 0.36, 0.04, 0.02, -0.65, 2.375, 0.62, C.cream, { mat: 'matte' }),
    rounded(0.16, 0.16, 0.01, 0.004, -1.32, 2.375, 0.642, C.red, { mat: 'matte' }),
    rounded(0.16, 0.16, 0.01, 0.004, -1.06, 2.375, 0.642, C.brass, { mat: 'matte' }),
    rounded(0.16, 0.16, 0.01, 0.004, -0.8, 2.375, 0.642, C.sage, { mat: 'matte' }),
    rounded(0.16, 0.16, 0.01, 0.004, -0.54, 2.375, 0.642, C.navy, { mat: 'matte' }),

    // timetable panel on the back glass
    rounded(0.55, 0.7, 0.03, 0.01, 1.05, 1.55, -0.575, C.cream, { mat: 'matte' }),
    box(0.36, 0.02, 0.008, 1.05, 1.7, -0.555, C.ink),
    box(0.26, 0.02, 0.008, 1.05, 1.6, -0.555, C.ink),

    // small litter bin
    cyl(0.12, 0.11, 0.42, 1.45, 0.3, -0.35, C.graphite, { mat: 'metal' }, 16),
    cyl(0.13, 0.13, 0.05, 1.45, 0.535, -0.35, C.steel, { mat: 'metal' }, 16),

    // warm pendants under the roof
    cyl(0.008, 0.008, 0.18, 0.75, 2.39, 0.1, C.steel, { mat: 'metal' }, 8),
    cyl(0.008, 0.008, 0.18, -0.75, 2.39, 0.1, C.steel, { mat: 'metal' }, 8),
    cone(0.09, 0.12, 0.75, 2.24, 0.1, C.blackMetal, { mat: 'metal' }, 16),
    cone(0.09, 0.12, -0.75, 2.24, 0.1, C.blackMetal, { mat: 'metal' }, 16),
    sphere(0.045, 0.75, 2.19, 0.1, '#f4d3a0', { mat: 'emissive' }, 12),
    sphere(0.045, -0.75, 2.19, 0.1, '#f4d3a0', { mat: 'emissive' }, 12),

    // tactile paving strip along the kerb
    box(3.0, 0.012, 0.24, 0, 0.066, 0.5, '#9a988f', { mat: 'stone' }),
    ...Array.from({ length: 12 }, (_, i) =>
      sphere(0.018, -1.32 + i * 0.24, 0.078, 0.5, '#b3b0a7', { mat: 'stone' }, 8),
    ),

    // route flag above the roof
    cyl(0.025, 0.03, 0.42, 1.3, 2.8, -0.45, C.steel, { mat: 'metal' }, 10),
    rounded(0.52, 0.44, 0.05, 0.02, 1.06, 3.02, -0.45, C.cream, { mat: 'matte' }),
    rounded(0.16, 0.16, 0.012, 0.004, 0.9, 3.09, -0.42, C.red, { mat: 'matte' }),
    box(0.28, 0.025, 0.012, 1.1, 2.98, -0.42, C.ink),
    box(0.2, 0.018, 0.012, 1.06, 2.92, -0.42, C.ink),

    // illuminated advert panel on the right side
    rounded(0.06, 1.32, 1.02, 0.02, 1.61, 1.45, 0, C.graphite, { mat: 'metal' }),
    rounded(0.012, 1.18, 0.86, 0.006, 1.646, 1.45, 0, '#e8dfcb', { mat: 'emissive' }),
    rounded(0.012, 0.6, 0.5, 0.006, 1.652, 1.58, 0.1, C.sage, { mat: 'matte' }),
    box(0.012, 0.05, 0.6, 1.658, 1.18, -0.04, C.navy),
    cyl(0.012, 0.012, 0.9, 1.63, 2.12, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),

    // bench bolts, name strip and downspout
    ...[-0.95, 0, 0.95].flatMap((x) => [
      sphere(0.009, x, 0.492, -0.27, C.steel, { mat: 'metal' }, 8),
      sphere(0.009, x, 0.492, -0.4, C.steel, { mat: 'metal' }, 8),
    ]),
    rounded(1.2, 0.16, 0.02, 0.01, 0, 2.45, 0.655, C.cream, { mat: 'matte' }),
    box(0.9, 0.03, 0.008, 0, 2.45, 0.668, C.navy),
    cyl(0.028, 0.028, 2.3, -1.56, 1.22, -0.62, C.graphite, { mat: 'metal' }, 10),
    cyl(0.03, 0.03, 0.24, -1.56, 0.12, -0.51, C.graphite, { mat: 'metal', rot: [0.9, 0, 0] }, 10),
    // bin lid hinge and lock tab
    rounded(0.06, 0.03, 0.03, 0.008, 1.45, 0.55, -0.24, C.steel, { mat: 'metal' }),
    box(0.03, 0.05, 0.012, 1.45, 0.5, -0.23, C.steel, { mat: 'metal' }),
  ],
})
