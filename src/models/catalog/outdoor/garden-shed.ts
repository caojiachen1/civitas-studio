import { C, box, cone, cyl, defineModel, ico, prism } from '../../kit'

const trim = '#e8dfcb'
const roof = '#9a7053'
const floorWood = '#8a6847'

export default defineModel({
  id: 'garden-shed',
  name: '花园工具房',
  category: 'outdoor',
  tags: ['shed', 'tool shed', 'garden storage', '工具房', '花园小屋', '木屋'],
  footprint: [2.44, 2.12],
  height: 2.35,
  placement: 'outdoor',
  parts: [
    // base
    box(2.3, 0.08, 0.1, 0, 0.04, 0.55, C.walnut, { mat: 'wood' }),
    box(2.3, 0.08, 0.1, 0, 0.04, -0.55, C.walnut, { mat: 'wood' }),
    box(2.3, 0.05, 1.86, 0, 0.105, 0, floorWood, { mat: 'wood' }),
    // walls
    box(2.4, 1.72, 0.08, 0, 0.99, -0.95, C.sage, { mat: 'matte' }),
    box(0.08, 1.72, 1.86, -1.16, 0.99, -0.01, C.sage, { mat: 'matte' }),
    box(0.08, 1.72, 1.86, 1.16, 0.99, -0.01, C.sage, { mat: 'matte' }),
    box(0.3, 1.72, 0.08, -1.05, 0.99, 0.93, C.sage, { mat: 'matte' }),
    box(0.25, 1.72, 0.08, 0.025, 0.99, 0.93, C.sage, { mat: 'matte' }),
    box(0.33, 1.72, 0.08, 1.035, 0.99, 0.93, C.sage, { mat: 'matte' }),
    box(0.72, 0.87, 0.08, 0.51, 0.565, 0.93, C.sage, { mat: 'matte' }),
    box(0.72, 0.23, 0.08, 0.51, 1.735, 0.93, C.sage, { mat: 'matte' }),
    box(0.8, 0.1, 0.08, -0.5, 1.8, 0.93, C.sage, { mat: 'matte' }),
    // gable ends
    prism([[-0.93, 1.85], [0.93, 1.85], [0, 2.35]], 0.08, -1.16, 0, 0, C.sage, {
      mat: 'matte',
      rot: [0, Math.PI / 2, 0],
    }),
    prism([[-0.93, 1.85], [0.93, 1.85], [0, 2.35]], 0.08, 1.16, 0, 0, C.sage, {
      mat: 'matte',
      rot: [0, Math.PI / 2, 0],
    }),
    // door
    box(0.79, 1.6, 0.03, -0.5, 0.95, 0.975, '#a97a4d', { mat: 'wood' }),
    box(0.06, 1.66, 0.03, -0.93, 0.96, 0.985, trim, { mat: 'matte' }),
    box(0.06, 1.66, 0.03, -0.07, 0.96, 0.985, trim, { mat: 'matte' }),
    box(0.92, 0.06, 0.03, -0.5, 1.77, 0.985, trim, { mat: 'matte' }),
    box(0.75, 0.08, 0.02, -0.5, 0.55, 0.99, '#8b6139', { mat: 'wood' }),
    box(0.75, 0.08, 0.02, -0.5, 1.35, 0.99, '#8b6139', { mat: 'wood' }),
    box(0.035, 0.1, 0.02, -0.9, 0.45, 0.99, C.blackMetal, { mat: 'metal' }),
    box(0.035, 0.1, 0.02, -0.9, 1.55, 0.99, C.blackMetal, { mat: 'metal' }),
    cyl(0.022, 0.022, 0.03, -0.17, 1.0, 0.986, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    box(0.035, 0.1, 0.012, -0.17, 1.0, 0.992, C.brass, { mat: 'metal' }),
    // window
    box(0.05, 0.72, 0.03, 0.175, 1.31, 0.985, trim, { mat: 'matte' }),
    box(0.05, 0.72, 0.03, 0.845, 1.31, 0.985, trim, { mat: 'matte' }),
    box(0.82, 0.05, 0.03, 0.51, 1.025, 0.985, trim, { mat: 'matte' }),
    box(0.82, 0.05, 0.03, 0.51, 1.595, 0.985, trim, { mat: 'matte' }),
    box(0.7, 0.6, 0.02, 0.51, 1.31, 0.965, C.glass, { mat: 'glass', opacity: 0.4 }),
    box(0.03, 0.6, 0.025, 0.51, 1.31, 0.968, trim, { mat: 'matte' }),
    box(0.9, 0.04, 0.06, 0.51, 0.99, 0.965, trim, { mat: 'matte' }),
    // shelf seen through the window
    box(0.9, 0.035, 0.3, 0.45, 1.12, 0.72, '#8b6139', { mat: 'wood' }),
    box(0.03, 0.12, 0.22, 0.1, 1.055, 0.8, '#8b6139', { mat: 'wood' }),
    box(0.03, 0.12, 0.22, 0.8, 1.055, 0.8, '#8b6139', { mat: 'wood' }),
    cyl(0.045, 0.045, 0.12, 0.3, 1.2, 0.72, C.terracotta, { mat: 'ceramic' }, 12),
    cyl(0.042, 0.042, 0.02, 0.3, 1.27, 0.72, C.walnut, { mat: 'wood' }, 12),
    cyl(0.038, 0.038, 0.11, 0.5, 1.19, 0.72, C.cream, { mat: 'ceramic' }, 12),
    ico(0.05, 0.65, 1.18, 0.72, C.leaf, { mat: 'foliage' }, 0),
    cone(0.045, 0.06, 0.65, 1.13, 0.72, C.terracotta, { mat: 'ceramic' }, 10),
    // roof
    box(2.4, 0.045, 1.1, 0, 2.0789, 0.495, roof, { mat: 'matte', rot: [0.4636, 0, 0] }),
    box(2.4, 0.045, 1.1, 0, 2.0789, -0.495, roof, { mat: 'matte', rot: [-0.4636, 0, 0] }),
    box(2.4, 0.045, 0.14, 0, 2.3275, 0, C.graphite, { mat: 'metal' }),
    // house number beside the door
    box(0.12, 0.07, 0.012, -1.07, 1.45, 0.975, C.brass, { mat: 'metal' }),
    // eaves gutter, downpipe and its wall brackets
    box(2.44, 0.075, 0.1, 0, 1.8, 1.05, C.graphite, { mat: 'metal' }),
    cyl(0.033, 0.033, 1.56, 1.14, 1.0, 1.05, C.graphite, { mat: 'metal' }, 10),
    cyl(0.033, 0.033, 0.18, 1.14, 0.24, 0.97, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    box(0.1, 0.03, 0.1, 1.14, 0.85, 1.0, C.blackMetal, { mat: 'metal' }),
    box(0.1, 0.03, 0.1, 1.14, 1.45, 1.0, C.blackMetal, { mat: 'metal' }),
    // window box planted with geraniums
    box(0.8, 0.15, 0.16, 0.51, 0.915, 1.02, '#8b6139', { mat: 'wood' }),
    box(0.76, 0.03, 0.13, 0.51, 0.975, 1.02, C.soil, { mat: 'matte' }),
    box(0.09, 0.04, 0.1, 0.2, 0.82, 1.0, C.blackMetal, { mat: 'metal' }),
    box(0.09, 0.04, 0.1, 0.82, 0.82, 1.0, C.blackMetal, { mat: 'metal' }),
    cyl(0.006, 0.007, 0.1, 0.32, 1.03, 1.03, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.032, 0.32, 1.09, 1.03, '#c26a5a', { mat: 'foliage' }, 0),
    cyl(0.006, 0.007, 0.12, 0.53, 1.04, 1.0, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.034, 0.53, 1.11, 1.0, C.blush, { mat: 'foliage' }, 0),
    cyl(0.006, 0.007, 0.09, 0.71, 1.025, 1.04, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.03, 0.71, 1.08, 1.04, '#d98f5a', { mat: 'foliage' }, 0),
    ico(0.04, 0.43, 1.0, 1.03, C.leaf, { mat: 'foliage' }, 0),
    ico(0.036, 0.62, 0.995, 1.01, C.leafLight, { mat: 'foliage' }, 0),
    // diagonal door brace, kick plate and a lantern beside the door
    box(0.94, 0.055, 0.018, -0.5, 0.95, 0.996, '#8b6139', { mat: 'wood', rot: [0, 0, 1.02] }),
    box(0.78, 0.1, 0.018, -0.5, 0.2, 0.996, C.blackMetal, { mat: 'metal' }),
    box(0.05, 0.04, 0.12, -1.02, 1.62, 1.01, C.blackMetal, { mat: 'metal' }),
    box(0.1, 0.16, 0.1, -1.02, 1.52, 1.06, C.glass, { mat: 'glass', opacity: 0.35 }),
    box(0.07, 0.1, 0.07, -1.02, 1.52, 1.06, '#ffe9c2', { mat: 'emissive' }),
    box(0.12, 0.018, 0.12, -1.02, 1.6, 1.06, C.blackMetal, { mat: 'metal' }),
    box(0.12, 0.018, 0.12, -1.02, 1.44, 1.06, C.blackMetal, { mat: 'metal' }),
  ],
})
