import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

export default defineModel({
  id: 'nightstand',
  name: '床头柜',
  category: 'bedroom',
  tags: ['nightstand', 'bedside table', '床头柜', '卧室', 'oak', 'lamp'],
  footprint: [0.5, 0.45],
  height: 0.56,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Tapered legs
    cyl(0.02, 0.012, 0.1, -0.21, 0.05, -0.19, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.012, 0.1, 0.21, 0.05, -0.19, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.012, 0.1, -0.21, 0.05, 0.16, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.012, 0.1, 0.21, 0.05, 0.16, C.walnut, { mat: 'wood' }, 10),

    // Carcass with an open lower shelf
    box(0.03, 0.285, 0.4, -0.215, 0.2625, -0.02, C.oak, { mat: 'wood' }),
    box(0.03, 0.285, 0.4, 0.215, 0.2625, -0.02, C.oak, { mat: 'wood' }),
    box(0.4, 0.285, 0.018, 0, 0.2625, -0.211, C.oak, { mat: 'wood' }),
    box(0.43, 0.025, 0.4, 0, 0.1325, -0.02, C.oak, { mat: 'wood' }),
    box(0.43, 0.02, 0.4, 0, 0.245, -0.02, C.oak, { mat: 'wood' }),
    box(0.43, 0.15, 0.39, 0, 0.33, -0.02, C.oak, { mat: 'wood' }),

    // Drawer face with brass knob
    rbox(0.4, 0.115, 0.014, 0.006, 0, 0.33, 0.188, '#b9905f', { mat: 'wood' }),
    box(0.34, 0.003, 0.004, 0, 0.277, 0.196, '#8f6d44', { mat: 'wood' }),
    cyl(0.02, 0.02, 0.008, 0, 0.33, 0.199, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 18),
    sphere(0.011, 0, 0.33, 0.207, C.brass, { mat: 'metal' }, 14),

    // Top slab and objects on the open shelf
    rbox(0.5, 0.028, 0.43, 0.008, 0, 0.419, -0.005, '#b9905f', { mat: 'wood' }),
    box(0.18, 0.022, 0.13, 0.09, 0.156, 0.01, C.navy, { mat: 'matte', rot: [0, 0.08, 0] }),
    box(0.17, 0.02, 0.12, 0.09, 0.177, 0.012, C.terracotta, { mat: 'matte', rot: [0, -0.06, 0] }),
    box(0.17, 0.02, 0.12, 0.12, 0.443, 0.0, C.navy, { mat: 'matte', rot: [0, 0.06, 0] }),
    box(0.16, 0.018, 0.11, 0.12, 0.462, 0.004, C.terracotta, { mat: 'matte', rot: [0, -0.04, 0] }),

    // Table lamp, shade top sets the model height
    cyl(0.05, 0.055, 0.012, -0.13, 0.439, -0.09, C.brass, { mat: 'metal' }, 20),
    cyl(0.007, 0.007, 0.055, -0.13, 0.4725, -0.09, C.brass, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.008, -0.13, 0.499, -0.09, C.brass, { mat: 'metal' }, 16),
    cyl(0.04, 0.062, 0.06, -0.13, 0.53, -0.09, '#f2dfbe', { mat: 'emissive' }, 20),
    sphere(0.006, -0.13, 0.502, -0.056, C.brass, { mat: 'metal' }, 10),

    // drawer shadow gaps, back panel cable hole and top edge band
    box(0.004, 0.115, 0.006, -0.202, 0.33, 0.188, '#6f5236', { mat: 'wood' }),
    box(0.004, 0.115, 0.006, 0.202, 0.33, 0.188, '#6f5236', { mat: 'wood' }),
    cyl(0.028, 0.028, 0.012, -0.08, 0.32, -0.214, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 16),
    box(0.5, 0.006, 0.012, 0, 0.404, 0.205, '#8f6d44', { mat: 'wood' }),
    sphere(0.005, 0.18, 0.442, 0.06, C.brass, { mat: 'metal' }, 8),
  ],
})
