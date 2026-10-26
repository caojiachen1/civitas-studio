import { C, box, cone, cyl, defineModel, ico, rbox } from '../../kit'

const cedar = '#9a6f47'
const cedarDark = '#7a5535'
const mailMetal = '#4a565c'

export default defineModel({
  id: 'mailbox',
  name: '信箱',
  category: 'outdoor',
  tags: ['mailbox', 'letter box', 'post', '信箱', '邮筒', '花园'],
  footprint: [0.3, 0.55],
  height: 1.2,
  placement: 'outdoor',
  parts: [
    // planter base
    rbox(0.29, 0.2, 0.29, 0.03, 0, 0.1, -0.04, C.terracotta, { mat: 'ceramic' }),
    box(0.24, 0.03, 0.24, 0, 0.185, -0.04, C.soil, { mat: 'matte' }),
    // post
    box(0.09, 0.92, 0.09, 0, 0.46, -0.12, cedar, { mat: 'wood' }),
    box(0.12, 0.04, 0.12, 0, 0.03, -0.12, cedarDark, { mat: 'wood' }),
    box(0.11, 0.025, 0.11, 0, 0.925, -0.12, cedarDark, { mat: 'wood' }),
    // platform and arm
    box(0.24, 0.04, 0.4, 0, 0.94, 0.06, cedarDark, { mat: 'wood' }),
    box(0.05, 0.05, 0.18, 0, 0.9, -0.13, cedarDark, { mat: 'wood', rot: [0.6, 0, 0] }),
    // mailbox body
    rbox(0.22, 0.22, 0.38, 0.085, 0, 1.07, 0.07, mailMetal, { mat: 'metal' }),
    box(0.19, 0.17, 0.02, 0, 1.06, 0.265, mailMetal, { mat: 'metal' }),
    box(0.02, 0.05, 0.012, 0, 1.03, 0.268, C.steel, { mat: 'metal' }),
    cyl(0.014, 0.014, 0.02, 0, 1.0, 0.265, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // number plate on the post
    box(0.1, 0.06, 0.012, 0, 0.78, -0.068, C.brass, { mat: 'metal' }),
    // flag
    box(0.014, 0.18, 0.014, 0.122, 1.11, 0.02, C.steel, { mat: 'metal' }),
    cyl(0.018, 0.018, 0.02, 0.122, 1.04, 0.02, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    box(0.012, 0.06, 0.09, 0.128, 1.17, 0.06, C.red, { mat: 'matte' }),
    // flowers in the planter
    cone(0.02, 0.13, -0.09, 0.28, -0.06, C.leafDeep, { mat: 'foliage', rot: [0.1, 0, 0.08] }, 6),
    ico(0.028, -0.09, 0.355, -0.06, '#d98f5a', { mat: 'foliage' }, 0),
    cone(0.018, 0.12, 0.06, 0.275, 0.02, C.leaf, { mat: 'foliage', rot: [-0.12, 0, -0.05] }, 6),
    ico(0.026, 0.06, 0.345, 0.02, C.cream, { mat: 'foliage' }, 0),
    ico(0.045, -0.02, 0.225, 0.03, C.leafDeep, { mat: 'foliage' }, 0),
    ico(0.038, 0.09, 0.22, -0.09, C.leafLight, { mat: 'foliage' }, 0),
    ico(0.03, -0.1, 0.215, 0.03, C.leaf, { mat: 'foliage' }, 0),
    cone(0.016, 0.11, 0.1, 0.27, 0.05, C.leafLight, { mat: 'foliage', rot: [0.08, 0, 0.12] }, 6),
  ],
})
