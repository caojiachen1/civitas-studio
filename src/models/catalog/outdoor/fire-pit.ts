import { C, box, cone, cyl, defineModel, ico, rbox, torus } from '../../kit'

const stoneDark = '#7c7a72'
const stoneLight = '#8d8a80'
const char = '#3a2e25'

export default defineModel({
  id: 'fire-pit',
  name: '火盆',
  category: 'outdoor',
  tags: ['fire pit', 'fire bowl', 'brazier', '火盆', '篝火', '壁炉'],
  footprint: [0.95, 0.95],
  height: 0.45,
  placement: 'outdoor',
  parts: [
    // octagonal stone base
    cyl(0.44, 0.45, 0.06, 0, 0.03, 0, stoneDark, { mat: 'stone' }, 8),
    box(0.33, 0.2, 0.15, 0, 0.16, 0.37, stoneLight, { mat: 'stone' }),
    box(0.33, 0.16, 0.15, 0.262, 0.14, 0.262, stoneLight, { mat: 'stone', rot: [0, Math.PI / 4, 0] }),
    box(0.33, 0.2, 0.15, 0.37, 0.16, 0, stoneLight, { mat: 'stone', rot: [0, Math.PI / 2, 0] }),
    box(0.33, 0.16, 0.15, 0.262, 0.14, -0.262, stoneLight, { mat: 'stone', rot: [0, (3 * Math.PI) / 4, 0] }),
    box(0.33, 0.2, 0.15, 0, 0.16, -0.37, stoneLight, { mat: 'stone', rot: [0, Math.PI, 0] }),
    box(0.33, 0.16, 0.15, -0.262, 0.14, -0.262, stoneLight, { mat: 'stone', rot: [0, (5 * Math.PI) / 4, 0] }),
    box(0.33, 0.2, 0.15, -0.37, 0.16, 0, stoneLight, { mat: 'stone', rot: [0, (3 * Math.PI) / 2, 0] }),
    box(0.33, 0.16, 0.15, -0.262, 0.14, 0.262, stoneLight, { mat: 'stone', rot: [0, (7 * Math.PI) / 4, 0] }),
    // metal fire bowl
    cyl(0.26, 0.16, 0.16, 0, 0.22, 0, C.blackMetal, { mat: 'metal' }, 24),
    torus(0.26, 0.016, 0, 0.3, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.21, 0.19, 0.04, 0, 0.278, 0, '#7d3318', { mat: 'emissive' }, 20),
    cyl(0.12, 0.12, 0.012, 0, 0.305, 0, '#b04a17', { mat: 'emissive' }, 16),
    // logs
    cyl(0.038, 0.042, 0.4, 0, 0.3, 0, C.walnut, { mat: 'wood', rot: [0, 0.3, Math.PI / 2] }, 8),
    cyl(0.036, 0.04, 0.38, 0, 0.305, 0, C.walnut, { mat: 'wood', rot: [0, -0.4, Math.PI / 2] }, 8),
    cyl(0.034, 0.038, 0.36, 0, 0.31, 0, C.walnut, { mat: 'wood', rot: [0, 1.25, Math.PI / 2] }, 8),
    cyl(0.03, 0.032, 0.32, 0.02, 0.335, 0.03, char, { mat: 'wood', rot: [0, 0.9, Math.PI / 2] }, 8),
    cyl(0.028, 0.03, 0.3, -0.03, 0.34, -0.02, C.walnut, { mat: 'wood', rot: [0, 2.1, Math.PI / 2] }, 8),
    // embers
    ico(0.022, -0.08, 0.33, 0.06, '#a83c16', { mat: 'emissive' }, 0),
    ico(0.018, 0.11, 0.325, -0.07, '#a83c16', { mat: 'emissive' }, 0),
    ico(0.02, 0.03, 0.33, 0.12, '#8f3012', { mat: 'emissive' }, 0),
    ico(0.016, -0.14, 0.322, -0.09, '#a83c16', { mat: 'emissive' }, 0),
    // flames
    cone(0.052, 0.15, 0, 0.37, 0, '#c9611f', { mat: 'emissive', rot: [0.1, 0, 0.05] }, 6),
    cone(0.045, 0.14, -0.1, 0.375, 0.03, '#d06a22', { mat: 'emissive', rot: [-0.16, 0, 0.12] }, 6),
    cone(0.045, 0.13, 0.1, 0.38, -0.06, '#c9611f', { mat: 'emissive', rot: [0.14, 0, -0.13] }, 6),
    cone(0.04, 0.12, 0.02, 0.39, 0.11, '#d06a22', { mat: 'emissive', rot: [-0.12, 0, 0.1] }, 6),
    cone(0.032, 0.1, 0.13, 0.39, 0.04, '#e8a63c', { mat: 'emissive', rot: [-0.1, 0, -0.12] }, 6),
    cone(0.03, 0.11, -0.05, 0.395, 0.02, '#e8a63c', { mat: 'emissive', rot: [0.08, 0, 0.1] }, 6),
    cone(0.028, 0.1, 0.05, 0.4, -0.04, '#f0bc58', { mat: 'emissive', rot: [0.07, 0, -0.09] }, 6),
    ico(0.055, -0.09, 0.33, 0.04, '#b04a17', { mat: 'emissive' }, 0),
    ico(0.05, 0.08, 0.335, -0.05, '#b04a17', { mat: 'emissive' }, 0),
    ico(0.04, 0.03, 0.34, 0.09, '#c9611f', { mat: 'emissive' }, 0),
    // chrome cooking grate resting on the bowl lip
    torus(0.225, 0.008, 0, 0.32, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    box(0.52, 0.008, 0.01, 0, 0.32, 0, C.steel, { mat: 'metal' }),
    box(0.5, 0.008, 0.01, 0, 0.32, -0.12, C.steel, { mat: 'metal' }),
    box(0.5, 0.008, 0.01, 0, 0.32, 0.12, C.steel, { mat: 'metal' }),
    // brass maker's plaque on the front stone, leather gloves resting on the kerb
    box(0.12, 0.055, 0.008, 0, 0.16, 0.451, C.brass, { mat: 'metal' }),
    rbox(0.075, 0.03, 0.16, 0.012, -0.07, 0.278, 0.37, C.leather, { mat: 'leather', rot: [0, 0.14, 0] }),
    rbox(0.075, 0.03, 0.16, 0.012, 0.06, 0.278, 0.375, C.leather, { mat: 'leather', rot: [0, -0.1, 0] }),
  ],
})
