import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const PORCELAIN = '#f2efe7'
const BASIN = '#deddd4'
const INK_SEAM = '#3a3a39'

export default defineModel({
  id: 'freestanding-bathtub',
  name: '椭圆落地浴缸',
  category: 'bathroom',
  tags: ['freestanding bathtub', 'oval tub', 'soaking tub', '独立浴缸', '椭圆浴缸', '泡澡', '卫浴'],
  footprint: [1.8, 0.9],
  height: 0.65,
  placement: 'indoor',
  parts: [
    // recessed shadow plinth and levelling feet
    rbox(1.12, 0.05, 0.5, 0.2, 0, 0.025, -0.01, C.ink, { mat: 'matte' }),
    cyl(0.026, 0.032, 0.05, -0.55, 0.025, 0.18, C.blackMetal, { mat: 'metal' }, 14),
    cyl(0.026, 0.032, 0.05, 0.55, 0.025, 0.18, C.blackMetal, { mat: 'metal' }, 14),
    cyl(0.026, 0.032, 0.05, -0.55, 0.025, -0.2, C.blackMetal, { mat: 'metal' }, 14),
    cyl(0.026, 0.032, 0.05, 0.55, 0.025, -0.2, C.blackMetal, { mat: 'metal' }, 14),

    // stacked oval shell: wide base tapering to a slender rim
    rbox(1.46, 0.24, 0.66, 0.3, 0, 0.17, -0.01, PORCELAIN, { mat: 'gloss' }),
    rbox(1.58, 0.14, 0.74, 0.34, 0, 0.34, -0.01, PORCELAIN, { mat: 'gloss' }),
    rbox(1.64, 0.13, 0.8, 0.37, 0, 0.475, -0.01, PORCELAIN, { mat: 'gloss' }),

    // rim ring leaves the centre open so the water reads as recessed
    rbox(1.64, 0.028, 0.09, 0.03, 0, 0.554, 0.345, PORCELAIN, { mat: 'gloss' }),
    rbox(1.64, 0.028, 0.09, 0.03, 0, 0.554, -0.365, PORCELAIN, { mat: 'gloss' }),
    rbox(0.09, 0.028, 0.62, 0.03, -0.775, 0.554, -0.01, PORCELAIN, { mat: 'gloss' }),
    rbox(0.09, 0.028, 0.62, 0.03, 0.775, 0.554, -0.01, PORCELAIN, { mat: 'gloss' }),
    rbox(1.46, 0.008, 0.62, 0.26, 0, 0.544, -0.01, BASIN, { mat: 'ceramic' }),
    rbox(1.4, 0.006, 0.56, 0.22, 0, 0.5495, -0.01, C.water, { mat: 'gloss', opacity: 0.9 }),
    torus(0.22, 0.003, -0.28, 0.553, -0.02, C.glass, { mat: 'gloss', opacity: 0.65, rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.12, 0.0025, 0.3, 0.553, 0.03, C.glass, { mat: 'gloss', opacity: 0.55, rot: [Math.PI / 2, 0, 0] }, 24),

    // chrome waste and overflow
    cyl(0.04, 0.04, 0.005, -0.5, 0.555, -0.01, C.steel, { mat: 'metal' }, 24),
    torus(0.04, 0.0045, -0.5, 0.556, -0.01, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    box(0.032, 0.002, 0.005, -0.5, 0.5575, -0.01, C.blackMetal, { mat: 'metal' }),
    cyl(0.03, 0.03, 0.008, 0.5, 0.555, -0.316, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    box(0.04, 0.003, 0.004, 0.5, 0.555, -0.311, C.blackMetal, { mat: 'metal' }),

    // floor-standing brass filler
    cyl(0.05, 0.055, 0.014, 0.845, 0.007, 0.28, C.brass, { mat: 'metal' }, 24),
    cyl(0.019, 0.022, 0.588, 0.845, 0.308, 0.28, C.brass, { mat: 'metal' }, 20),
    cyl(0.025, 0.025, 0.022, 0.845, 0.12, 0.28, C.brass, { mat: 'metal' }, 16),
    sphere(0.024, 0.845, 0.626, 0.28, C.brass, { mat: 'metal' }, 20),
    cyl(0.015, 0.015, 0.2, 0.745, 0.626, 0.28, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.016, 0.014, 0.073, 0.645, 0.5895, 0.28, C.brass, { mat: 'metal' }, 16),
    torus(0.017, 0.0035, 0.645, 0.552, 0.28, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.011, 0.011, 0.05, 0.845, 0.48, 0.305, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rbox(0.055, 0.012, 0.012, 0.005, 0.845, 0.48, 0.345, C.brass, { mat: 'metal' }),

    // oak bath tray spanning the rim
    rbox(0.26, 0.014, 0.03, 0.005, -0.34, 0.575, 0.345, C.birch, { mat: 'wood' }),
    rbox(0.26, 0.014, 0.03, 0.005, -0.34, 0.575, -0.365, C.birch, { mat: 'wood' }),
    rbox(0.24, 0.016, 0.72, 0.006, -0.34, 0.588, -0.01, C.oak, { mat: 'wood' }),
    box(0.004, 0.002, 0.7, -0.42, 0.5965, -0.01, C.walnut, { mat: 'wood' }),
    box(0.004, 0.002, 0.7, -0.26, 0.5965, -0.01, C.walnut, { mat: 'wood' }),

    // stone soap dish, soap bar and folded washcloth
    rbox(0.1, 0.008, 0.08, 0.02, -0.38, 0.6, 0.11, C.stone, { mat: 'stone' }),
    rbox(0.072, 0.013, 0.05, 0.012, -0.38, 0.61, 0.11, C.cream, { mat: 'matte' }),
    box(0.068, 0.002, 0.005, -0.38, 0.6175, 0.11, INK_SEAM),
    rbox(0.1, 0.012, 0.13, 0.008, -0.28, 0.602, -0.12, C.sage, { mat: 'fabric' }),
    rbox(0.088, 0.006, 0.115, 0.008, -0.28, 0.611, -0.12, C.cream, { mat: 'fabric' }),
  ],
})
