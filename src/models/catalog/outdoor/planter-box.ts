import { C, box, cone, cyl, defineModel, ico } from '../../kit'

const cedar = '#9c7248'
const cedarDark = '#7d5937'

export default defineModel({
  id: 'planter-box',
  name: '花箱',
  category: 'outdoor',
  tags: ['planter', 'flower box', 'herbs', '花箱', '种植箱', '花槽'],
  footprint: [1.2, 0.5],
  height: 0.55,
  placement: 'outdoor',
  parts: [
    // corner posts
    box(0.05, 0.36, 0.05, -0.575, 0.22, -0.225, cedarDark, { mat: 'wood' }),
    box(0.05, 0.36, 0.05, 0.575, 0.22, -0.225, cedarDark, { mat: 'wood' }),
    box(0.05, 0.36, 0.05, -0.575, 0.22, 0.225, cedarDark, { mat: 'wood' }),
    box(0.05, 0.36, 0.05, 0.575, 0.22, 0.225, cedarDark, { mat: 'wood' }),
    // front and back slats
    box(1.1, 0.105, 0.03, 0, 0.09, 0.235, cedar, { mat: 'wood' }),
    box(1.1, 0.105, 0.03, 0, 0.2, 0.235, cedar, { mat: 'wood' }),
    box(1.1, 0.105, 0.03, 0, 0.31, 0.235, cedar, { mat: 'wood' }),
    box(1.1, 0.105, 0.03, 0, 0.09, -0.235, cedar, { mat: 'wood' }),
    box(1.1, 0.105, 0.03, 0, 0.2, -0.235, cedar, { mat: 'wood' }),
    box(1.1, 0.105, 0.03, 0, 0.31, -0.235, cedar, { mat: 'wood' }),
    // side slats
    box(0.03, 0.105, 0.4, -0.585, 0.09, 0, cedar, { mat: 'wood' }),
    box(0.03, 0.105, 0.4, -0.585, 0.2, 0, cedar, { mat: 'wood' }),
    box(0.03, 0.105, 0.4, -0.585, 0.31, 0, cedar, { mat: 'wood' }),
    box(0.03, 0.105, 0.4, 0.585, 0.09, 0, cedar, { mat: 'wood' }),
    box(0.03, 0.105, 0.4, 0.585, 0.2, 0, cedar, { mat: 'wood' }),
    box(0.03, 0.105, 0.4, 0.585, 0.31, 0, cedar, { mat: 'wood' }),
    // feet
    box(1.08, 0.04, 0.06, 0, 0.02, -0.15, cedarDark, { mat: 'wood' }),
    box(1.08, 0.04, 0.06, 0, 0.02, 0.15, cedarDark, { mat: 'wood' }),
    // top rim
    box(1.2, 0.03, 0.045, 0, 0.385, -0.2275, cedarDark, { mat: 'wood' }),
    box(1.2, 0.03, 0.045, 0, 0.385, 0.2275, cedarDark, { mat: 'wood' }),
    box(0.045, 0.03, 0.405, -0.5775, 0.385, 0, cedarDark, { mat: 'wood' }),
    box(0.045, 0.03, 0.405, 0.5775, 0.385, 0, cedarDark, { mat: 'wood' }),
    // soil
    box(1.1, 0.04, 0.4, 0, 0.34, 0, C.soil, { mat: 'matte' }),
    // flowers
    cyl(0.006, 0.007, 0.12, -0.42, 0.4, 0.08, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.033, -0.42, 0.475, 0.08, '#d98f5a', { mat: 'foliage' }, 0),
    cyl(0.006, 0.007, 0.14, -0.2, 0.41, -0.1, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.035, -0.2, 0.49, -0.1, C.blush, { mat: 'foliage' }, 0),
    cyl(0.006, 0.007, 0.16, 0.02, 0.42, 0.05, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.038, 0.02, 0.51, 0.05, C.cream, { mat: 'foliage' }, 0),
    cyl(0.006, 0.007, 0.13, 0.24, 0.405, -0.06, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.034, 0.24, 0.48, -0.06, '#b58fb0', { mat: 'foliage' }, 0),
    cyl(0.006, 0.007, 0.11, 0.42, 0.395, 0.1, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.03, 0.42, 0.465, 0.1, '#c9a05a', { mat: 'foliage' }, 0),
    ico(0.026, -0.3, 0.44, -0.09, '#b58fb0', { mat: 'foliage' }, 0),
    cyl(0.005, 0.006, 0.1, -0.55, 0.39, -0.12, C.leafDeep, { mat: 'foliage' }, 6),
    ico(0.024, -0.55, 0.455, -0.12, '#d98f5a', { mat: 'foliage' }, 0),
    cone(0.016, 0.15, 0.02, 0.465, -0.15, C.leafLight, { mat: 'foliage', rot: [-0.12, 0, 0.1] }, 6),
    // grasses
    cone(0.02, 0.16, -0.52, 0.46, 0.02, C.leafLight, { mat: 'foliage', rot: [0.12, 0, 0.1] }, 6),
    cone(0.018, 0.15, -0.1, 0.455, 0.12, C.leaf, { mat: 'foliage', rot: [-0.1, 0, -0.08] }, 6),
    cone(0.018, 0.16, 0.12, 0.46, -0.13, C.leafLight, { mat: 'foliage', rot: [0.14, 0, 0.06] }, 6),
    cone(0.02, 0.15, 0.5, 0.455, -0.02, C.leaf, { mat: 'foliage', rot: [-0.1, 0, -0.12] }, 6),
    // foliage mounds
    ico(0.05, -0.3, 0.37, 0.12, C.leafDeep, { mat: 'foliage' }, 0),
    ico(0.055, 0.16, 0.365, 0.1, C.leaf, { mat: 'foliage' }, 0),
    ico(0.045, 0.36, 0.36, -0.12, C.leafDeep, { mat: 'foliage' }, 0),
    ico(0.04, -0.05, 0.355, -0.14, C.leafLight, { mat: 'foliage' }, 0),
  ],
})
