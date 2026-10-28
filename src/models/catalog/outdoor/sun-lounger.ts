import { C, box, cyl, defineModel, rbox } from '../../kit'

const teak = '#a97a4d'
const teakDark = '#8b6139'

export default defineModel({
  id: 'sun-lounger',
  name: '户外躺椅',
  category: 'outdoor',
  tags: ['lounger', 'sunbed', 'deck chair', '躺椅', '日光浴', '户外椅'],
  footprint: [0.72, 1.95],
  height: 0.7,
  placement: 'outdoor',
  parts: [
    // bed frame
    rbox(0.055, 0.06, 1.1, 0.012, -0.31, 0.32, 0.38, teak, { mat: 'wood' }),
    rbox(0.055, 0.06, 1.1, 0.012, 0.31, 0.32, 0.38, teak, { mat: 'wood' }),
    box(0.6, 0.05, 0.05, 0, 0.305, 0.92, teakDark, { mat: 'wood' }),
    box(0.6, 0.045, 0.045, 0, 0.305, 0.12, teakDark, { mat: 'wood' }),
    box(0.62, 0.05, 0.05, 0, 0.3, -0.16, teakDark, { mat: 'wood' }),
    // reclined backrest frame
    rbox(0.05, 0.05, 0.68, 0.012, -0.31, 0.463, -0.418, teak, { mat: 'wood', rot: [0.5, 0, 0] }),
    rbox(0.05, 0.05, 0.68, 0.012, 0.31, 0.463, -0.418, teak, { mat: 'wood', rot: [0.5, 0, 0] }),
    box(0.62, 0.05, 0.05, 0, 0.607, -0.69, teakDark, { mat: 'wood', rot: [0.5, 0, 0] }),
    box(0.045, 0.045, 0.55, 0, 0.44, -0.33, teakDark, { mat: 'wood', rot: [0.5, 0, 0] }),
    // legs
    box(0.055, 0.3, 0.055, -0.29, 0.15, 0.82, teak, { mat: 'wood' }),
    box(0.055, 0.3, 0.055, 0.29, 0.15, 0.82, teak, { mat: 'wood' }),
    box(0.055, 0.3, 0.055, -0.29, 0.15, -0.06, teak, { mat: 'wood' }),
    box(0.055, 0.3, 0.055, 0.29, 0.15, -0.06, teak, { mat: 'wood' }),
    box(0.05, 0.52, 0.05, -0.29, 0.26, -0.58, teak, { mat: 'wood' }),
    box(0.05, 0.52, 0.05, 0.29, 0.26, -0.58, teak, { mat: 'wood' }),
    box(0.025, 0.49, 0.025, -0.29, 0.24, -0.38, teakDark, { mat: 'wood', rot: [0.96, 0, 0] }),
    box(0.025, 0.49, 0.025, 0.29, 0.24, -0.38, teakDark, { mat: 'wood', rot: [0.96, 0, 0] }),
    // foot wheels
    box(0.04, 0.26, 0.04, -0.27, 0.22, 0.9, teak, { mat: 'wood' }),
    box(0.04, 0.26, 0.04, 0.27, 0.22, 0.9, teak, { mat: 'wood' }),
    box(0.5, 0.025, 0.025, 0, 0.06, 0.9, C.blackMetal, { mat: 'metal' }),
    cyl(0.06, 0.06, 0.035, -0.27, 0.06, 0.9, C.blackMetal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.06, 0.06, 0.035, 0.27, 0.06, 0.9, C.blackMetal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.02, 0.02, 0.045, -0.27, 0.06, 0.9, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.02, 0.02, 0.045, 0.27, 0.06, 0.9, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // cushions
    rbox(0.5, 0.09, 1.0, 0.035, 0, 0.39, 0.38, C.linen, { mat: 'fabric' }),
    rbox(0.5, 0.08, 0.58, 0.035, 0, 0.52, -0.382, C.linen, { mat: 'fabric', rot: [0.5, 0, 0] }),
    cyl(0.055, 0.055, 0.36, 0, 0.46, -0.03, C.sage, { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 16),
    // tufting buttons
    cyl(0.012, 0.012, 0.008, -0.14, 0.436, 0.2, C.cream, { mat: 'fabric' }, 10),
    cyl(0.012, 0.012, 0.008, 0.14, 0.436, 0.2, C.cream, { mat: 'fabric' }, 10),
    cyl(0.012, 0.012, 0.008, -0.14, 0.436, 0.62, C.cream, { mat: 'fabric' }, 10),
    cyl(0.012, 0.012, 0.008, 0.14, 0.436, 0.62, C.cream, { mat: 'fabric' }, 10),
    // side tray and cup
    box(0.105, 0.03, 0.36, 0.3075, 0.46, 0.3, teakDark, { mat: 'wood' }),
    box(0.03, 0.12, 0.03, 0.3, 0.395, 0.16, teak, { mat: 'wood' }),
    box(0.03, 0.12, 0.03, 0.3, 0.395, 0.44, teak, { mat: 'wood' }),
    cyl(0.036, 0.03, 0.075, 0.307, 0.512, 0.26, C.cream, { mat: 'ceramic' }, 16),
    cyl(0.03, 0.03, 0.006, 0.307, 0.552, 0.26, '#5b3c2a', { mat: 'matte' }, 16),
    // hardware
    cyl(0.013, 0.013, 0.014, -0.338, 0.32, 0.6, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.013, 0.013, 0.014, 0.338, 0.32, 0.6, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.013, 0.013, 0.014, -0.338, 0.32, -0.05, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.013, 0.013, 0.014, 0.338, 0.32, -0.05, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // folded bath towel laid along the mattress, with two woven stripes
    rbox(0.42, 0.022, 0.5, 0.02, 0.01, 0.446, 0.62, C.white, { mat: 'fabric' }),
    box(0.42, 0.003, 0.045, 0.01, 0.458, 0.55, C.water, { mat: 'fabric' }),
    box(0.42, 0.003, 0.045, 0.01, 0.458, 0.7, C.water, { mat: 'fabric' }),
    // paperback with its cover on the side tray
    box(0.085, 0.018, 0.12, 0.3075, 0.484, 0.4, C.cream, { mat: 'matte' }),
    box(0.088, 0.005, 0.125, 0.3075, 0.495, 0.4, C.navy, { mat: 'matte' }),
    // steel backrest hinge plates
    box(0.016, 0.12, 0.07, -0.344, 0.33, -0.19, C.steel, { mat: 'metal' }),
    box(0.016, 0.12, 0.07, 0.344, 0.33, -0.19, C.steel, { mat: 'metal' }),
  ],
})
