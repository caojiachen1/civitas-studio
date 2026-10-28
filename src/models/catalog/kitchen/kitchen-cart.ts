import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const OAK = '#b48a5a'
const OAK_LIGHT = '#bd9464'
const OAK_DARK = '#96703f'
const METAL = '#3c4144'
const METAL_LIGHT = '#5a6165'
const TOWEL = '#cfc3ae'

export default defineModel({
  id: 'kitchen-cart',
  name: '厨房推车',
  category: 'kitchen',
  tags: ['kitchen cart', 'trolley', '厨房推车', '餐车', 'island cart', 'storage'],
  footprint: [0.9, 0.55],
  height: 0.95,
  placement: 'indoor',
  parts: [
    // four swivel casters with fenders and two brake tabs
    cyl(0.045, 0.045, 0.03, -0.35, 0.045, -0.18, '#33383b', { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.045, 0.045, 0.03, 0.35, 0.045, -0.18, '#33383b', { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.045, 0.045, 0.03, -0.35, 0.045, 0.18, '#33383b', { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.045, 0.045, 0.03, 0.35, 0.045, 0.18, '#33383b', { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 18),
    rbox(0.052, 0.04, 0.05, 0.008, -0.35, 0.098, -0.18, C.steel, { mat: 'metal' }),
    rbox(0.052, 0.04, 0.05, 0.008, 0.35, 0.098, -0.18, C.steel, { mat: 'metal' }),
    rbox(0.052, 0.04, 0.05, 0.008, -0.35, 0.098, 0.18, C.steel, { mat: 'metal' }),
    rbox(0.052, 0.04, 0.05, 0.008, 0.35, 0.098, 0.18, C.steel, { mat: 'metal' }),
    box(0.018, 0.024, 0.052, -0.35, 0.055, -0.235, METAL, { mat: 'metal' }),
    box(0.018, 0.024, 0.052, 0.35, 0.055, 0.235, METAL, { mat: 'metal' }),

    // slim steel frame
    box(0.028, 0.69, 0.028, -0.4, 0.455, -0.23, METAL, { mat: 'metal' }),
    box(0.028, 0.69, 0.028, 0.4, 0.455, -0.23, METAL, { mat: 'metal' }),
    box(0.028, 0.69, 0.028, -0.4, 0.455, 0.23, METAL, { mat: 'metal' }),
    box(0.028, 0.69, 0.028, 0.4, 0.455, 0.23, METAL, { mat: 'metal' }),
    // cross braces on both sides
    cyl(0.008, 0.008, 0.71, -0.4, 0.44, 0, METAL_LIGHT, { mat: 'metal', rot: [0.635, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.71, -0.4, 0.44, 0, METAL_LIGHT, { mat: 'metal', rot: [-0.635, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.71, 0.4, 0.44, 0, METAL_LIGHT, { mat: 'metal', rot: [0.635, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.71, 0.4, 0.44, 0, METAL_LIGHT, { mat: 'metal', rot: [-0.635, 0, 0] }, 10),

    // aprons and oak worktop
    box(0.84, 0.045, 0.03, 0, 0.7775, -0.215, METAL, { mat: 'metal' }),
    box(0.84, 0.045, 0.03, 0, 0.7775, 0.215, METAL, { mat: 'metal' }),
    box(0.03, 0.045, 0.46, -0.385, 0.7775, 0, METAL, { mat: 'metal' }),
    box(0.03, 0.045, 0.46, 0.385, 0.7775, 0, METAL, { mat: 'metal' }),
    rbox(0.89, 0.045, 0.54, 0.012, 0, 0.8225, 0, OAK, { mat: 'wood' }),
    box(0.8, 0.002, 0.004, 0, 0.846, -0.12, OAK_DARK, { mat: 'wood' }),
    box(0.8, 0.002, 0.004, 0, 0.846, 0.12, OAK_DARK, { mat: 'wood' }),
    box(0.06, 0.015, 0.003, 0.28, 0.7775, 0.2315, C.brass, { mat: 'metal' }),

    // lower oak shelf with steel rails
    rbox(0.76, 0.025, 0.44, 0.01, 0, 0.26, 0, OAK_LIGHT, { mat: 'wood' }),
    box(0.76, 0.02, 0.022, 0, 0.2375, -0.21, METAL, { mat: 'metal' }),
    box(0.76, 0.02, 0.022, 0, 0.2375, 0.21, METAL, { mat: 'metal' }),
    box(0.022, 0.02, 0.44, -0.37, 0.2375, 0, METAL, { mat: 'metal' }),
    box(0.022, 0.02, 0.44, 0.37, 0.2375, 0, METAL, { mat: 'metal' }),

    // push handle at one end
    box(0.022, 0.095, 0.022, -0.4, 0.8925, -0.17, METAL_LIGHT, { mat: 'metal' }),
    box(0.022, 0.095, 0.022, -0.4, 0.8925, 0.17, METAL_LIGHT, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.36, -0.4, 0.938, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),

    // front rail, towel bar and hanging towel
    box(0.8, 0.022, 0.022, 0, 0.6, 0.23, METAL, { mat: 'metal' }),
    cyl(0.011, 0.011, 0.52, 0, 0.62, 0.262, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.01, 0.01, 0.045, -0.26, 0.62, 0.24, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.01, 0.01, 0.045, 0.26, 0.62, 0.24, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rbox(0.24, 0.24, 0.016, 0.008, -0.1, 0.5, 0.262, TOWEL, { mat: 'fabric' }),
    box(0.22, 0.012, 0.003, -0.1, 0.565, 0.2715, '#b8ab94', { mat: 'fabric' }),
    box(0.22, 0.006, 0.003, -0.1, 0.44, 0.2715, '#b8ab94', { mat: 'fabric' }),

    // spice jars on the lower shelf
    cyl(0.032, 0.03, 0.075, -0.22, 0.31, 0.05, '#e0d6c6', { mat: 'glass' }, 16),
    cyl(0.034, 0.034, 0.012, -0.22, 0.3535, 0.05, C.brass, { mat: 'metal' }, 16),
    cyl(0.032, 0.03, 0.075, -0.1, 0.31, 0.05, C.sage, { mat: 'ceramic' }, 16),
    cyl(0.034, 0.034, 0.012, -0.1, 0.3535, 0.05, C.brass, { mat: 'metal' }, 16),
    cyl(0.032, 0.03, 0.075, 0.02, 0.31, 0.05, C.terracotta, { mat: 'ceramic' }, 16),
    cyl(0.034, 0.034, 0.012, 0.02, 0.3535, 0.05, C.brass, { mat: 'metal' }, 16),
    cyl(0.075, 0.05, 0.05, 0.24, 0.2975, 0.03, C.cream, { mat: 'ceramic' }, 24),
    torus(0.073, 0.005, 0.24, 0.323, 0.03, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),

    // maple cutting board and folded tea towel on the worktop
    rbox(0.3, 0.022, 0.2, 0.006, 0.14, 0.856, -0.03, C.birch, { mat: 'wood' }),
    box(0.02, 0.026, 0.16, 0.285, 0.858, -0.03, OAK_DARK, { mat: 'wood' }),
    rbox(0.22, 0.022, 0.15, 0.008, -0.16, 0.856, 0.09, TOWEL, { mat: 'fabric' }),
    box(0.2, 0.004, 0.018, -0.16, 0.868, 0.09, '#b8ab94', { mat: 'fabric' }),

    // ladle and spatula hanging from brass hooks on the front rail
    torus(0.017, 0.004, 0.3, 0.6, 0.246, C.brass, { mat: 'metal' }, 16),
    torus(0.017, 0.004, 0.2, 0.6, 0.246, C.brass, { mat: 'metal' }, 16),
    cyl(0.007, 0.007, 0.13, 0.3, 0.529, 0.246, C.steel, { mat: 'metal' }, 10),
    cyl(0.031, 0.022, 0.032, 0.3, 0.448, 0.246, C.steel, { mat: 'metal' }, 20),
    cyl(0.007, 0.006, 0.1, 0.2, 0.542, 0.246, C.birch, { mat: 'wood' }, 10),
    rbox(0.05, 0.055, 0.007, 0.005, 0.2, 0.465, 0.246, C.birch, { mat: 'wood' }),
    // brass end caps on the towel bar and caster plate screws
    cyl(0.013, 0.009, 0.008, -0.266, 0.62, 0.262, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.013, 0.009, 0.008, 0.266, 0.62, 0.262, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    ...[-0.35, 0.35].map((x) =>
      cyl(0.005, 0.005, 0.005, x, 0.098, 0.2065, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    ),
  ],
})
