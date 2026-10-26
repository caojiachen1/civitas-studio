import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'coffee-table',
  name: '茶几',
  category: 'living',
  tags: ['coffee table', 'table', '茶几', 'oak', 'living room'],
  footprint: [1.2, 0.65],
  height: 0.42,
  placement: 'indoor',
  parts: [
    // tapered oak legs with brass ferrules
    cyl(0.024, 0.016, 0.33, -0.50, 0.165, -0.24, C.oak, { mat: 'wood' }, 12),
    cyl(0.024, 0.016, 0.33, 0.50, 0.165, -0.24, C.oak, { mat: 'wood' }, 12),
    cyl(0.024, 0.016, 0.33, -0.50, 0.165, 0.24, C.oak, { mat: 'wood' }, 12),
    cyl(0.024, 0.016, 0.33, 0.50, 0.165, 0.24, C.oak, { mat: 'wood' }, 12),
    cyl(0.017, 0.017, 0.016, -0.50, 0.008, -0.24, C.brass, { mat: 'metal' }, 12),
    cyl(0.017, 0.017, 0.016, 0.50, 0.008, -0.24, C.brass, { mat: 'metal' }, 12),
    cyl(0.017, 0.017, 0.016, -0.50, 0.008, 0.24, C.brass, { mat: 'metal' }, 12),
    cyl(0.017, 0.017, 0.016, 0.50, 0.008, 0.24, C.brass, { mat: 'metal' }, 12),

    // apron frame and rounded oak slab top
    rbox(1.02, 0.05, 0.035, 0.012, 0, 0.305, -0.225, C.walnut, { mat: 'wood' }),
    rbox(1.02, 0.05, 0.035, 0.012, 0, 0.305, 0.225, C.walnut, { mat: 'wood' }),
    rbox(0.035, 0.05, 0.46, 0.012, -0.50, 0.305, 0, C.walnut, { mat: 'wood' }),
    rbox(0.035, 0.05, 0.46, 0.012, 0.50, 0.305, 0, C.walnut, { mat: 'wood' }),
    rbox(1.20, 0.055, 0.65, 0.024, 0, 0.3575, 0, '#B48A5A', { mat: 'wood' }),
    box(1.14, 0.002, 0.005, 0, 0.3855, -0.13, C.birch, { mat: 'wood' }),
    box(1.14, 0.002, 0.005, 0, 0.3855, 0, C.birch, { mat: 'wood' }),
    box(1.14, 0.002, 0.005, 0, 0.3855, 0.13, C.birch, { mat: 'wood' }),

    // lower shelf with cleats
    rbox(1.04, 0.03, 0.48, 0.012, 0, 0.135, 0, '#B48A5A', { mat: 'wood' }),
    rbox(0.05, 0.03, 0.05, 0.008, -0.47, 0.105, -0.21, C.walnut, { mat: 'wood' }),
    rbox(0.05, 0.03, 0.05, 0.008, 0.47, 0.105, -0.21, C.walnut, { mat: 'wood' }),
    rbox(0.05, 0.03, 0.05, 0.008, -0.47, 0.105, 0.21, C.walnut, { mat: 'wood' }),
    rbox(0.05, 0.03, 0.05, 0.008, 0.47, 0.105, 0.21, C.walnut, { mat: 'wood' }),

    // styled top: book stack and shallow ceramic bowl
    rbox(0.26, 0.018, 0.19, 0.006, -0.33, 0.394, 0.02, C.navy, { mat: 'matte' }),
    rbox(0.24, 0.016, 0.18, 0.006, -0.33, 0.411, 0.015, C.terracotta, { mat: 'matte', rot: [0, 0.12, 0] }),
    cyl(0.085, 0.05, 0.03, 0.33, 0.40, -0.06, C.cream, { mat: 'ceramic' }, 24),
    torus(0.082, 0.006, 0.33, 0.413, -0.06, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),

    // shelf contents: magazines, vase, small brass candle
    rbox(0.24, 0.01, 0.17, 0.003, -0.30, 0.156, -0.02, C.blush, { mat: 'matte', rot: [0, 0.06, 0] }),
    rbox(0.23, 0.01, 0.17, 0.003, -0.30, 0.166, -0.02, C.sand, { mat: 'matte', rot: [0, -0.04, 0] }),
    rbox(0.22, 0.01, 0.16, 0.003, -0.30, 0.176, -0.02, C.ink, { mat: 'matte', rot: [0, 0.02, 0] }),
    cyl(0.045, 0.058, 0.15, 0.30, 0.225, 0.02, C.clay, { mat: 'ceramic' }, 18),
    cyl(0.03, 0.042, 0.022, 0.30, 0.311, 0.02, C.clay, { mat: 'ceramic' }, 18),
    cyl(0.035, 0.035, 0.012, 0.02, 0.156, 0.0, C.brass, { mat: 'metal' }, 16),
    cyl(0.026, 0.026, 0.075, 0.02, 0.20, 0.0, C.cream, { mat: 'matte' }, 16),
  ],
})
