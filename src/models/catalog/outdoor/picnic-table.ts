import { C, box, cyl, defineModel, torus } from '../../kit'

const topWood = '#b08356'
const frameWood = '#8a6039'

export default defineModel({
  id: 'picnic-table',
  name: '野餐桌',
  category: 'outdoor',
  tags: ['picnic table', 'bench', 'camping', '野餐桌', '户外长桌', '长凳'],
  footprint: [1.8, 1.4],
  height: 1.03,
  placement: 'outdoor',
  parts: [
    // table top slats
    box(1.76, 0.045, 0.13, 0, 0.7775, -0.28, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.7775, -0.14, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.7775, 0, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.7775, 0.14, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.7775, 0.28, topWood, { mat: 'wood' }),
    box(0.04, 0.05, 0.71, -0.88, 0.775, 0, frameWood, { mat: 'wood' }),
    box(0.04, 0.05, 0.71, 0.88, 0.775, 0, frameWood, { mat: 'wood' }),
    // battens
    box(0.07, 0.06, 0.66, -0.6, 0.72, 0, frameWood, { mat: 'wood' }),
    box(0.07, 0.06, 0.66, 0.6, 0.72, 0, frameWood, { mat: 'wood' }),
    // A-frame legs
    box(0.06, 0.83, 0.06, -0.62, 0.362, 0.37, frameWood, { mat: 'wood', rot: [-0.588, 0, 0] }),
    box(0.06, 0.83, 0.06, 0.62, 0.362, 0.37, frameWood, { mat: 'wood', rot: [-0.588, 0, 0] }),
    box(0.06, 0.83, 0.06, -0.62, 0.362, -0.37, frameWood, { mat: 'wood', rot: [0.588, 0, 0] }),
    box(0.06, 0.83, 0.06, 0.62, 0.362, -0.37, frameWood, { mat: 'wood', rot: [0.588, 0, 0] }),
    // low cross braces
    box(0.055, 0.06, 0.62, -0.62, 0.13, 0, frameWood, { mat: 'wood' }),
    box(0.055, 0.06, 0.62, 0.62, 0.13, 0, frameWood, { mat: 'wood' }),
    // bench supports
    box(0.07, 0.06, 1.34, -0.62, 0.412, 0, frameWood, { mat: 'wood' }),
    box(0.07, 0.06, 1.34, 0.62, 0.412, 0, frameWood, { mat: 'wood' }),
    box(1.26, 0.055, 0.055, 0, 0.6, 0.21, frameWood, { mat: 'wood' }),
    box(1.26, 0.055, 0.055, 0, 0.6, -0.21, frameWood, { mat: 'wood' }),
    // bench slats
    box(1.76, 0.045, 0.13, 0, 0.4575, 0.48, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.4575, 0.62, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.4575, -0.48, topWood, { mat: 'wood' }),
    box(1.76, 0.045, 0.13, 0, 0.4575, -0.62, topWood, { mat: 'wood' }),
    // bolts
    cyl(0.014, 0.014, 0.075, -0.65, 0.412, 0.42, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.075, 0.65, 0.412, 0.42, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.075, -0.65, 0.412, -0.42, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.075, 0.65, 0.412, -0.42, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // umbrella socket with its dark plug
    torus(0.048, 0.011, 0, 0.803, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 18),
    cyl(0.036, 0.036, 0.012, 0, 0.803, 0, C.graphite, { mat: 'matte' }, 14),
    // breadboard end caps over the slat ends
    box(0.03, 0.05, 0.72, -0.89, 0.7775, 0, frameWood, { mat: 'wood' }),
    box(0.03, 0.05, 0.72, 0.89, 0.7775, 0, frameWood, { mat: 'wood' }),
    // stoneware jug and two enamel mugs
    cyl(0.075, 0.08, 0.18, 0.45, 0.89, 0.18, C.cream, { mat: 'ceramic' }, 16),
    cyl(0.036, 0.036, 0.06, 0.45, 0.995, 0.18, C.sand, { mat: 'ceramic' }, 12),
    torus(0.055, 0.011, 0.53, 0.91, 0.18, C.cream, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 14),
    cyl(0.036, 0.032, 0.07, 0.16, 0.835, 0.2, C.white, { mat: 'ceramic' }, 14),
    cyl(0.03, 0.03, 0.006, 0.16, 0.872, 0.2, '#5b3c2a', { mat: 'matte' }, 12),
    torus(0.024, 0.007, 0.2, 0.835, 0.2, C.white, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 12),
    cyl(0.036, 0.032, 0.07, 0.28, 0.835, 0.05, '#8fa087', { mat: 'ceramic' }, 14),
    torus(0.024, 0.007, 0.32, 0.835, 0.05, '#8fa087', { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 12),
  ],
})
