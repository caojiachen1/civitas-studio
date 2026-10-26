import { C, box, cyl, defineModel, ico, sphere, torus } from '../../kit'

const PADS = Array.from({ length: 4 }, (_, i) => (i / 4) * Math.PI * 2 + Math.PI / 4)

export default defineModel({
  id: 'round-dining-table',
  name: '圆餐桌',
  category: 'dining',
  tags: ['dining', 'table', 'round', '圆桌', '餐桌', '家庭餐桌'],
  footprint: [1.25, 1.25],
  height: 1.13,
  placement: 'indoor',
  parts: [
    // round top with chamfered edge
    cyl(0.625, 0.625, 0.055, 0, 0.7225, 0, C.oak, { mat: 'wood' }, 44),
    cyl(0.6, 0.625, 0.02, 0, 0.685, 0, C.oak, { mat: 'wood' }, 44),
    torus(0.6, 0.008, 0, 0.675, 0, C.walnut, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }, 44),

    // flared pedestal base
    cyl(0.44, 0.46, 0.04, 0, 0.02, 0, C.walnut, { mat: 'wood' }, 40),
    cyl(0.28, 0.42, 0.1, 0, 0.09, 0, C.walnut, { mat: 'wood' }, 36),
    torus(0.33, 0.01, 0, 0.145, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 40),
    cyl(0.11, 0.22, 0.44, 0, 0.365, 0, C.walnut, { mat: 'wood' }, 32),
    torus(0.201, 0.009, 0, 0.22, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.171, 0.009, 0, 0.34, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.141, 0.009, 0, 0.46, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.14, 0.014, 0, 0.585, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),

    // levelling pads
    ...PADS.map((a) =>
      cyl(0.05, 0.05, 0.022, Math.cos(a) * 0.36, 0.011, Math.sin(a) * 0.36, C.blackMetal, {
        mat: 'metal',
      }, 12),
    ),

    // top support
    box(0.66, 0.035, 0.08, 0, 0.625, 0, C.walnut, { mat: 'wood' }),
    box(0.08, 0.035, 0.66, 0, 0.625, 0, C.walnut, { mat: 'wood' }),
    cyl(0.29, 0.29, 0.04, 0, 0.66, 0, C.walnut, { mat: 'wood' }, 36),
    cyl(0.12, 0.12, 0.05, 0, 0.605, 0, C.brass, { mat: 'metal' }, 24),

    // centerpiece: stone bowl plus a small bud vase
    cyl(0.2, 0.13, 0.07, -0.08, 0.785, 0.02, C.stone, { mat: 'stone' }, 32),
    torus(0.196, 0.008, -0.08, 0.818, 0.02, C.concrete, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 32),
    sphere(0.045, -0.15, 0.86, 0.0, C.terracotta, { mat: 'gloss' }, 12),
    sphere(0.042, -0.04, 0.855, 0.06, C.leafLight, { mat: 'gloss' }, 12),
    cyl(0.045, 0.062, 0.14, 0.26, 0.82, -0.12, C.cream, { mat: 'ceramic' }, 24),
    cyl(0.006, 0.006, 0.16, 0.26, 0.96, -0.12, C.leafDeep, { mat: 'matte', rot: [0.1, 0, -0.14] }, 6),
    ico(0.06, 0.24, 1.06, -0.13, C.leaf, { mat: 'foliage' }, 1),
    ico(0.045, 0.3, 1.03, -0.1, C.leafLight, { mat: 'foliage' }, 1),
  ],
})
