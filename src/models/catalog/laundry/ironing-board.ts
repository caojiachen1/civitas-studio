import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const LEG_X = [-0.38, 0.38]
const LEG_TILT = 0.35
const COVER = '#e9e3d7'

export default defineModel({
  id: 'ironing-board',
  name: '熨衣板',
  category: 'laundry',
  tags: ['ironing board', 'iron', 'laundry', '熨衣板', '熨斗', '洗衣房', '折叠'],
  footprint: [1.35, 0.45],
  height: 1.0,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // birch board deck with padded linen cover
    rbox(1.26, 0.028, 0.36, 0.14, 0, 0.855, 0, C.birch, { mat: 'wood' }),
    rbox(1.24, 0.024, 0.34, 0.13, 0, 0.881, 0, C.linen, { mat: 'fabric' }),
    rbox(1.25, 0.006, 0.35, 0.13, 0, 0.896, 0, COVER, { mat: 'fabric' }),
    box(1.23, 0.002, 0.02, 0, 0.901, 0.05, C.sage),
    box(1.24, 0.002, 0.006, 0, 0.9, -0.16, C.sand),
    rbox(1.26, 0.012, 0.012, 0.004, 0, 0.855, 0.182, C.walnut, { mat: 'wood' }),
    rbox(1.26, 0.012, 0.012, 0.004, 0, 0.855, -0.182, C.walnut, { mat: 'wood' }),

    // folding X legs, two frames
    ...LEG_X.flatMap((x) => [
      box(0.035, 0.88, 0.03, x, 0.43, 0.01, C.blackMetal, { mat: 'metal', rot: [LEG_TILT, 0, 0] }),
      box(0.035, 0.88, 0.03, x, 0.43, 0.01, C.blackMetal, { mat: 'metal', rot: [-LEG_TILT, 0, 0] }),
      cyl(0.014, 0.014, 0.024, x, 0.43, 0.01, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    ]),
    // rubber floor caps
    ...LEG_X.flatMap((x) => [
      rbox(0.055, 0.028, 0.07, 0.01, x, 0.014, -0.141, C.graphite, { mat: 'matte' }),
      rbox(0.055, 0.028, 0.07, 0.01, x, 0.014, 0.161, C.graphite, { mat: 'matte' }),
    ]),
    // folding braces and mounting rails under the deck
    box(0.8, 0.026, 0.026, 0, 0.4, 0.01, C.blackMetal, { mat: 'metal' }),
    box(0.7, 0.014, 0.014, 0, 0.24, 0.01, C.graphite, { mat: 'metal' }),
    box(0.05, 0.03, 0.34, -0.38, 0.826, 0, C.graphite, { mat: 'metal' }),
    box(0.05, 0.03, 0.34, 0.38, 0.826, 0, C.graphite, { mat: 'metal' }),

    // sleeve board clipped under the left end
    rbox(0.26, 0.02, 0.15, 0.05, -0.53, 0.78, 0, C.birch, { mat: 'wood' }),
    rbox(0.24, 0.012, 0.13, 0.04, -0.53, 0.796, 0, C.linen, { mat: 'fabric' }),
    box(0.03, 0.05, 0.03, -0.41, 0.819, 0, C.graphite, { mat: 'metal' }),

    // iron resting pad and iron
    rbox(0.22, 0.012, 0.16, 0.03, 0.4, 0.905, 0.02, C.graphite, { mat: 'matte' }),
    rbox(0.18, 0.012, 0.1, 0.03, 0.4, 0.917, 0.02, C.steel, { mat: 'metal' }),
    rbox(0.17, 0.045, 0.1, 0.025, 0.4, 0.9425, 0.02, '#cfc9bd', { mat: 'gloss' }),
    rbox(0.13, 0.022, 0.07, 0.02, 0.4, 0.973, 0.02, C.glass, { mat: 'glass', opacity: 0.5 }),
    rbox(0.14, 0.016, 0.05, 0.012, 0.4, 0.992, 0.03, C.ink, { mat: 'matte' }),
    cyl(0.014, 0.014, 0.006, 0.4, 0.952, 0.071, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    rbox(0.03, 0.008, 0.02, 0.004, 0.35, 0.972, 0.045, C.sage, { mat: 'matte' }),
    rbox(0.06, 0.03, 0.09, 0.015, 0.47, 0.945, 0.02, '#b9b3a7', { mat: 'gloss' }),
    cyl(0.005, 0.005, 0.09, 0.31, 0.906, -0.07, C.ink, { mat: 'matte', rot: [1.3, 0, 0] }, 8),
    torus(0.025, 0.005, 0.3, 0.904, -0.1, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 16),

    // cover stitching lines across the padded surface
    ...[-0.12, -0.04, 0.04, 0.12].map((z) =>
      box(0.94, 0.002, 0.003, 0, 0.8995, z, C.sand, { mat: 'fabric' }),
    ),
    box(1.08, 0.002, 0.003, 0, 0.8995, 0.1, C.sand, { mat: 'fabric' }),
    // iron water-level window and steam dial
    box(0.004, 0.03, 0.022, 0.484, 0.947, 0.02, C.water, { mat: 'gloss' }),
    cyl(0.014, 0.014, 0.008, 0.4, 0.992, 0.02, C.sage, { mat: 'gloss' }, 14),
    // leg locking levers at the X pivots
    box(0.026, 0.014, 0.05, -0.38, 0.398, 0.048, C.brass, { mat: 'metal' }),
    box(0.026, 0.014, 0.05, 0.38, 0.398, 0.048, C.brass, { mat: 'metal' }),
  ],
})
