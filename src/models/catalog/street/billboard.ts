import { C, box, cyl, defineModel, prism, rbox, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const GLOW = '#f4d3a0'
const frame = C.ink

export default defineModel({
  id: 'billboard',
  name: '广告牌',
  category: 'street',
  tags: ['billboard', 'sign', 'advert', '广告牌', '户外广告'],
  footprint: [3.6, 0.8],
  height: 5.2,
  placement: 'outdoor',
  parts: [
    // concrete footings and anchor plates
    rounded(0.38, 0.18, 0.38, 0.02, 1.1, 0.09, -0.08, C.concrete, { mat: 'stone' }),
    rounded(0.38, 0.18, 0.38, 0.02, -1.1, 0.09, -0.08, C.concrete, { mat: 'stone' }),
    rounded(0.22, 0.03, 0.22, 0.008, 1.1, 0.195, -0.08, C.steel, { mat: 'metal' }),
    rounded(0.22, 0.03, 0.22, 0.008, -1.1, 0.195, -0.08, C.steel, { mat: 'metal' }),

    // twin steel posts
    rounded(0.16, 4.98, 0.16, 0.02, 1.1, 2.67, -0.08, frame, { mat: 'metal' }),
    rounded(0.16, 4.98, 0.16, 0.02, -1.1, 2.67, -0.08, frame, { mat: 'metal' }),
    rounded(0.19, 0.04, 0.19, 0.01, 1.1, 5.18, -0.08, C.steel, { mat: 'metal' }),
    rounded(0.19, 0.04, 0.19, 0.01, -1.1, 5.18, -0.08, C.steel, { mat: 'metal' }),
    rounded(0.19, 0.05, 0.19, 0.01, 1.1, 2.7, -0.08, C.graphite, { mat: 'metal' }),
    rounded(0.19, 0.05, 0.19, 0.01, -1.1, 2.7, -0.08, C.graphite, { mat: 'metal' }),

    // braced frame and panel
    rounded(3.52, 2.12, 0.1, 0.02, 0, 4.0, 0.02, frame, { mat: 'metal' }),
    rounded(3.36, 1.96, 0.08, 0.02, 0, 4.0, 0.08, C.cream, { mat: 'matte' }),
    rounded(0.045, 1.9, 0.045, 0.01, 0.825, 2.1, -0.04, C.graphite, { mat: 'metal', rot: [0, 0, 0.282] }),
    rounded(0.045, 1.9, 0.045, 0.01, -0.825, 2.1, -0.04, C.graphite, { mat: 'metal', rot: [0, 0, -0.282] }),
    rounded(0.05, 2.76, 0.05, 0.01, 0, 2.05, -0.12, C.graphite, { mat: 'metal', rot: [0, 0, 0.912] }),
    rounded(0.05, 2.76, 0.05, 0.01, 0, 2.05, -0.12, C.graphite, { mat: 'metal', rot: [0, 0, -0.912] }),
    rounded(2.24, 0.07, 0.07, 0.012, 0, 2.9, -0.08, frame, { mat: 'metal' }),

    // abstract poster composition
    cyl(0.52, 0.52, 0.012, -0.95, 4.15, 0.126, C.navy, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.52, 0.03, -0.95, 4.15, 0.134, C.brass, { mat: 'metal' }, 32),
    rounded(0.95, 0.95, 0.012, 0.01, 0.45, 4.2, 0.128, C.sage, { mat: 'matte', rot: [0, 0, 0.32] }),
    prism(
      [
        [-0.3, -0.32],
        [0.3, -0.32],
        [0, 0.3],
      ],
      0.012,
      1.05,
      3.55,
      0.136,
      C.red,
      { mat: 'matte', side: 'double' },
    ),
    cyl(0.1, 0.1, 0.012, 1.2, 4.55, 0.136, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    rounded(0.12, 1.7, 0.012, 0.005, -1.43, 4.0, 0.127, C.navy, { mat: 'matte' }),
    box(0.9, 0.04, 0.01, -0.95, 3.3, 0.127, C.ink),
    box(0.9, 0.04, 0.01, -0.95, 3.4, 0.127, C.ink),

    // lighting arms
    cyl(0.022, 0.022, 0.26, 0.9, 5.06, 0.13, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.022, 0.022, 0.26, -0.9, 5.06, 0.13, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rounded(0.1, 0.06, 0.18, 0.02, 0.9, 5.0, 0.31, frame, { mat: 'metal' }),
    rounded(0.1, 0.06, 0.18, 0.02, -0.9, 5.0, 0.31, frame, { mat: 'metal' }),
    box(0.07, 0.012, 0.14, 0.9, 4.962, 0.31, GLOW, { mat: 'emissive' }),
    box(0.07, 0.012, 0.14, -0.9, 4.962, 0.31, GLOW, { mat: 'emissive' }),

    // service box on the left post
    rounded(0.12, 0.2, 0.09, 0.012, -1.1, 1.3, 0.03, C.steel, { mat: 'metal' }),
    rounded(0.09, 0.16, 0.012, 0.005, -1.1, 1.3, 0.081, C.graphite, { mat: 'metal' }),

    // rear access hatch with hinges, lock and warning label
    rounded(0.92, 1.56, 0.025, 0.008, 0.35, 4.0, -0.06, C.graphite, { mat: 'metal' }),
    rounded(0.84, 1.48, 0.012, 0.004, 0.35, 4.0, -0.078, C.ink, { mat: 'metal' }),
    ...[0, 1].map((i) =>
      rounded(0.07, 0.035, 0.03, 0.008, 0.35 - 0.36 + i * 0.72, 4.6, -0.085, C.steel, { mat: 'metal' }),
    ),
    rounded(0.08, 0.12, 0.03, 0.01, 0.35, 3.6, -0.09, C.brass, { mat: 'metal' }),
    rounded(0.34, 0.18, 0.006, 0.004, 0.35, 3.32, -0.094, '#d9b25f', { mat: 'matte' }),
    box(0.24, 0.02, 0.004, 0.35, 3.34, -0.098, C.ink),

    // conduit and junction boxes feeding the lamp arms
    cyl(0.016, 0.016, 4.6, -1.24, 2.45, -0.08, C.graphite, { mat: 'metal' }, 8),
    cyl(0.016, 0.016, 0.62, -0.92, 5.02, -0.06, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    rounded(0.16, 0.16, 0.08, 0.01, -1.26, 0.42, -0.08, C.steel, { mat: 'metal' }),
    box(0.1, 0.014, 0.006, -1.26, 0.42, -0.036, C.ink),

    // poster retaining clips around the frame
    ...[
      [-1.5, 3.05],
      [1.5, 3.05],
      [1.5, 4.95],
      [-1.5, 4.95],
    ].map(([x, y]) =>
      rounded(0.08, 0.08, 0.03, 0.008, x, y, 0.12, C.steel, { mat: 'metal' }),
    ),
  ],
})
