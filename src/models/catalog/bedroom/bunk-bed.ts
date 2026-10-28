import { C, box, cyl, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'bunk-bed',
  name: '双层床',
  category: 'bedroom',
  tags: ['bunk bed', '双层床', '儿童床', '卧室', '木质', 'ladder'],
  footprint: [1.1, 2.15],
  height: 1.85,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Sturdy corner posts
    box(0.08, 1.85, 0.08, -0.51, 0.925, -1.02, C.oak, { mat: 'wood' }),
    box(0.08, 1.85, 0.08, 0.51, 0.925, -1.02, C.oak, { mat: 'wood' }),
    box(0.08, 1.85, 0.08, -0.51, 0.925, 1.0, C.oak, { mat: 'wood' }),
    box(0.08, 1.85, 0.08, 0.51, 0.925, 1.0, C.oak, { mat: 'wood' }),

    // Lower bed platform
    box(0.05, 0.14, 1.95, -0.49, 0.41, -0.01, C.oak, { mat: 'wood' }),
    box(0.05, 0.14, 1.95, 0.49, 0.41, -0.01, C.oak, { mat: 'wood' }),
    box(0.96, 0.12, 0.05, 0, 0.42, -0.97, C.oak, { mat: 'wood' }),
    box(0.96, 0.12, 0.05, 0, 0.42, 0.95, C.oak, { mat: 'wood' }),
    rbox(0.92, 0.2, 1.88, 0.05, 0, 0.58, -0.02, C.white, { mat: 'fabric' }),
    rbox(0.92, 0.32, 0.03, 0.012, 0, 0.82, -1.0, '#75533a', { mat: 'wood' }),
    rbox(0.5, 0.14, 0.32, 0.04, 0, 0.75, -0.82, C.linen, { mat: 'fabric', rot: [-0.2, 0, 0] }),

    // Upper platform with visible slats
    box(0.05, 0.14, 1.95, -0.49, 1.35, -0.01, C.oak, { mat: 'wood' }),
    box(0.05, 0.14, 1.95, 0.49, 1.35, -0.01, C.oak, { mat: 'wood' }),
    box(0.96, 0.12, 0.05, 0, 1.36, -0.97, C.oak, { mat: 'wood' }),
    box(0.96, 0.12, 0.05, 0, 1.36, 0.95, C.oak, { mat: 'wood' }),
    box(0.92, 0.03, 0.07, 0, 1.4, -0.6, C.walnut, { mat: 'wood' }),
    box(0.92, 0.03, 0.07, 0, 1.4, -0.2, C.walnut, { mat: 'wood' }),
    box(0.92, 0.03, 0.07, 0, 1.4, 0.2, C.walnut, { mat: 'wood' }),
    box(0.92, 0.03, 0.07, 0, 1.4, 0.6, C.walnut, { mat: 'wood' }),
    rbox(0.92, 0.2, 1.88, 0.05, 0, 1.52, -0.02, C.white, { mat: 'fabric' }),
    rbox(0.92, 0.22, 0.03, 0.012, 0, 1.72, -1.0, '#75533a', { mat: 'wood' }),
    rbox(0.5, 0.14, 0.32, 0.04, 0, 1.69, -0.82, C.sage, { mat: 'fabric', rot: [-0.2, 0, 0] }),

    // Slatted guard rails around the upper bunk
    box(0.99, 0.05, 0.04, 0, 1.8, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.36, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.24, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.12, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.12, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.24, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.36, 1.71, 0.6, C.oak, { mat: 'wood' }),
    box(0.04, 0.05, 0.9, -0.49, 1.8, 0.15, C.oak, { mat: 'wood' }),
    box(0.04, 0.05, 0.9, 0.49, 1.8, 0.15, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.49, 1.71, -0.24, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.49, 1.71, -0.06, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.49, 1.71, 0.12, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.49, 1.71, 0.3, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, -0.49, 1.71, 0.48, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.49, 1.71, -0.24, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.49, 1.71, -0.06, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.49, 1.71, 0.12, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.49, 1.71, 0.3, C.oak, { mat: 'wood' }),
    box(0.022, 0.16, 0.022, 0.49, 1.71, 0.48, C.oak, { mat: 'wood' }),

    // Ladder at the open foot end
    box(0.045, 1.7, 0.045, -0.27, 0.87, 1.0, C.walnut, { mat: 'wood' }),
    box(0.045, 1.7, 0.045, 0.03, 0.87, 1.0, C.walnut, { mat: 'wood' }),
    cyl(0.018, 0.018, 0.3, -0.12, 0.25, 1.0, C.oak, { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.018, 0.018, 0.3, -0.12, 0.5, 1.0, C.oak, { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.018, 0.018, 0.3, -0.12, 0.75, 1.0, C.oak, { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.018, 0.018, 0.3, -0.12, 1.0, 1.0, C.oak, { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.018, 0.018, 0.3, -0.12, 1.25, 1.0, C.oak, { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.018, 0.018, 0.3, -0.12, 1.5, 1.0, C.oak, { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 10),

    // brass post bolts, mattress foot piping and ladder rail caps
    cyl(0.009, 0.009, 0.018, -0.552, 0.41, -1.0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.009, 0.009, 0.018, 0.552, 0.41, -1.0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.009, 0.009, 0.018, -0.552, 1.35, -1.0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.009, 0.009, 0.018, 0.552, 1.35, -1.0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    box(0.9, 0.008, 0.012, 0, 0.683, 0.924, '#ded4c5', { mat: 'fabric' }),
    box(0.9, 0.008, 0.012, 0, 1.623, 0.924, '#ded4c5', { mat: 'fabric' }),
    cyl(0.023, 0.023, 0.01, -0.27, 1.7225, 1.0, C.brass, { mat: 'metal' }, 10),
    cyl(0.023, 0.023, 0.01, 0.03, 1.7225, 1.0, C.brass, { mat: 'metal' }, 10),
  ],
})
