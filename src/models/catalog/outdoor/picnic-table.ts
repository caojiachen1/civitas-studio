import { C, box, cyl, defineModel } from '../../kit'

const topWood = '#b08356'
const frameWood = '#8a6039'

export default defineModel({
  id: 'picnic-table',
  name: '野餐桌',
  category: 'outdoor',
  tags: ['picnic table', 'bench', 'camping', '野餐桌', '户外长桌', '长凳'],
  footprint: [1.8, 1.4],
  height: 0.8,
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
  ],
})
