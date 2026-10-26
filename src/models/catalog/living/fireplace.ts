import { C, box, cone, cyl, defineModel, ico, rbox } from '../../kit'

const STONE_JOINT = '#8d8c84'
const CANDLE = '#e6d9c4'

export default defineModel({
  id: 'fireplace',
  name: '壁炉',
  category: 'living',
  tags: ['fireplace', 'hearth', '壁炉', 'stone', 'mantel'],
  footprint: [1.45, 0.42],
  height: 1.2,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // stone hearth, pillars, lintel and mantel
    rbox(1.45, 0.06, 0.42, 0.014, 0, 0.03, 0, C.stone, { mat: 'stone' }),
    rbox(0.29, 0.84, 0.40, 0.015, -0.58, 0.48, 0, C.stone, { mat: 'stone' }),
    rbox(0.29, 0.84, 0.40, 0.015, 0.58, 0.48, 0, C.stone, { mat: 'stone' }),
    box(0.288, 0.008, 0.402, -0.58, 0.28, 0, STONE_JOINT, { mat: 'stone' }),
    box(0.288, 0.008, 0.402, -0.58, 0.50, 0, STONE_JOINT, { mat: 'stone' }),
    box(0.288, 0.008, 0.402, -0.58, 0.72, 0, STONE_JOINT, { mat: 'stone' }),
    box(0.288, 0.008, 0.402, 0.58, 0.28, 0, STONE_JOINT, { mat: 'stone' }),
    box(0.288, 0.008, 0.402, 0.58, 0.50, 0, STONE_JOINT, { mat: 'stone' }),
    box(0.288, 0.008, 0.402, 0.58, 0.72, 0, STONE_JOINT, { mat: 'stone' }),
    rbox(1.45, 0.08, 0.40, 0.01, 0, 0.94, 0, C.concrete, { mat: 'stone' }),
    rbox(1.45, 0.05, 0.42, 0.014, 0, 1.005, 0, C.stone, { mat: 'stone' }),

    // dark firebox liner
    box(0.86, 0.78, 0.03, 0, 0.47, -0.155, '#1d1b19', { mat: 'matte' }),
    box(0.03, 0.78, 0.27, -0.415, 0.47, -0.03, '#26231f', { mat: 'matte' }),
    box(0.03, 0.78, 0.27, 0.415, 0.47, -0.03, '#26231f', { mat: 'matte' }),
    box(0.86, 0.07, 0.27, 0, 0.865, -0.03, '#26231f', { mat: 'matte' }),
    box(0.86, 0.025, 0.27, 0, 0.0725, -0.03, '#2a2723', { mat: 'matte' }),

    // ember bed
    rbox(0.66, 0.03, 0.20, 0.02, 0, 0.10, 0, '#8f3d1f', { mat: 'emissive' }),
    ico(0.032, -0.26, 0.112, 0.02, '#d9762f', { mat: 'emissive' }, 0),
    ico(0.03, -0.09, 0.112, 0.02, '#e08336', { mat: 'emissive' }, 0),
    ico(0.033, 0.10, 0.112, 0.02, '#d9762f', { mat: 'emissive' }, 0),
    ico(0.028, 0.27, 0.112, 0.02, '#e08336', { mat: 'emissive' }, 0),

    // stacked logs
    cyl(0.042, 0.042, 0.54, 0, 0.145, 0.01, '#5b4230', { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.038, 0.038, 0.50, 0.02, 0.14, 0.07, '#6b4c36', { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.036, 0.036, 0.46, -0.01, 0.205, 0.04, '#4f3a2a', { mat: 'wood', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.013, 0.013, 0.28, 0.12, 0.105, -0.03, '#7a5a40', { mat: 'wood', rot: [0, 0.5, Math.PI / 2] }, 6),
    cyl(0.013, 0.013, 0.26, -0.14, 0.105, -0.02, '#7a5a40', { mat: 'wood', rot: [0, -0.6, Math.PI / 2] }, 6),

    // flames
    cone(0.055, 0.20, -0.12, 0.27, 0.02, '#f2a65a', { mat: 'emissive', opacity: 0.85 }, 10),
    cone(0.07, 0.24, 0.02, 0.29, 0.0, '#f6b96b', { mat: 'emissive', opacity: 0.8 }, 10),
    cone(0.05, 0.18, 0.14, 0.26, 0.03, '#f2a65a', { mat: 'emissive', opacity: 0.85 }, 10),

    // brass candlesticks
    cyl(0.045, 0.05, 0.015, -0.50, 1.0375, 0.03, C.brass, { mat: 'metal' }, 16),
    cyl(0.013, 0.016, 0.06, -0.50, 1.075, 0.03, C.brass, { mat: 'metal' }, 12),
    cyl(0.015, 0.015, 0.06, -0.50, 1.147, 0.03, CANDLE, { mat: 'matte' }, 12),
    cone(0.011, 0.022, -0.50, 1.188, 0.03, '#f6c37a', { mat: 'emissive' }, 8),
    cyl(0.045, 0.05, 0.015, 0.50, 1.0375, 0.03, C.brass, { mat: 'metal' }, 16),
    cyl(0.013, 0.016, 0.06, 0.50, 1.075, 0.03, C.brass, { mat: 'metal' }, 12),
    cyl(0.015, 0.015, 0.06, 0.50, 1.147, 0.03, CANDLE, { mat: 'matte' }, 12),
    cone(0.011, 0.022, 0.50, 1.188, 0.03, '#f6c37a', { mat: 'emissive' }, 8),

    // centre vase with dried stems and a low bowl
    cyl(0.05, 0.065, 0.11, 0, 1.085, 0.02, C.clay, { mat: 'ceramic' }, 20),
    cyl(0.032, 0.042, 0.015, 0, 1.1475, 0.02, C.clay, { mat: 'ceramic' }, 20),
    cyl(0.003, 0.003, 0.03, -0.015, 1.17, 0.015, C.leafDeep, { mat: 'foliage', rot: [0.1, 0, -0.2] }, 6),
    cyl(0.003, 0.003, 0.03, 0.005, 1.17, 0.025, C.leafDeep, { mat: 'foliage', rot: [-0.15, 0, 0.1] }, 6),
    cyl(0.003, 0.003, 0.03, 0.02, 1.17, 0.015, C.leaf, { mat: 'foliage', rot: [0.12, 0, 0.22] }, 6),
    ico(0.007, -0.019, 1.188, 0.009, '#6F8E5E', { mat: 'foliage' }, 1),
    ico(0.007, 0.004, 1.188, 0.028, C.leafLight, { mat: 'foliage' }, 1),
    ico(0.007, 0.026, 1.188, 0.011, '#4C6D45', { mat: 'foliage' }, 1),
    cyl(0.055, 0.038, 0.035, 0.27, 1.0475, 0.03, C.ink, { mat: 'ceramic' }, 20),
  ],
})
