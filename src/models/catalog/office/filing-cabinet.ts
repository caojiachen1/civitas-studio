import { C, box, cyl, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'filing-cabinet',
  name: '文件柜',
  category: 'office',
  tags: ['filing cabinet', 'drawers', '文件柜', '档案柜', '收纳'],
  footprint: [0.45, 0.6],
  height: 1.35,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed plinth
    rbox(0.4, 0.05, 0.52, 0.01, 0, 0.025, -0.01, C.ink, { mat: 'matte' }),
    // steel body
    rbox(0.44, 1.05, 0.54, 0.015, 0, 0.575, -0.01, C.cream, { mat: 'gloss' }),
    // oak top
    rbox(0.45, 0.025, 0.56, 0.01, 0, 1.1125, -0.005, C.oak, { mat: 'wood' }),
    // three drawer fronts
    rbox(0.38, 0.31, 0.022, 0.006, 0, 0.905, 0.267, C.white, { mat: 'gloss' }),
    rbox(0.38, 0.31, 0.022, 0.006, 0, 0.57, 0.267, C.white, { mat: 'gloss' }),
    rbox(0.38, 0.31, 0.022, 0.006, 0, 0.235, 0.267, C.white, { mat: 'gloss' }),
    // label holders and cards
    rbox(0.13, 0.055, 0.01, 0.003, 0, 1.01, 0.282, C.brass, { mat: 'metal' }),
    rbox(0.105, 0.035, 0.004, 0.002, 0, 1.01, 0.289, C.linen, { mat: 'matte' }),
    box(0.06, 0.003, 0.002, 0, 1.013, 0.292, C.graphite),
    rbox(0.13, 0.055, 0.01, 0.003, 0, 0.675, 0.282, C.brass, { mat: 'metal' }),
    rbox(0.105, 0.035, 0.004, 0.002, 0, 0.675, 0.289, C.linen, { mat: 'matte' }),
    box(0.06, 0.003, 0.002, 0, 0.678, 0.292, C.graphite),
    rbox(0.13, 0.055, 0.01, 0.003, 0, 0.34, 0.282, C.brass, { mat: 'metal' }),
    rbox(0.105, 0.035, 0.004, 0.002, 0, 0.34, 0.289, C.linen, { mat: 'matte' }),
    box(0.06, 0.003, 0.002, 0, 0.343, 0.292, C.graphite),
    // brass pulls
    rbox(0.26, 0.016, 0.016, 0.006, 0, 0.925, 0.291, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.018, -0.1, 0.925, 0.281, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.018, 0.1, 0.925, 0.281, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rbox(0.26, 0.016, 0.016, 0.006, 0, 0.59, 0.291, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.018, -0.1, 0.59, 0.281, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.018, 0.1, 0.59, 0.281, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rbox(0.26, 0.016, 0.016, 0.006, 0, 0.255, 0.291, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.018, -0.1, 0.255, 0.281, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.018, 0.1, 0.255, 0.281, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    // cam lock on top drawer
    cyl(0.013, 0.013, 0.012, 0.15, 0.96, 0.278, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    box(0.006, 0.014, 0.003, 0.15, 0.958, 0.287, C.ink),
    // archive box with lid
    rbox(0.2, 0.19, 0.3, 0.006, -0.11, 1.22, -0.03, C.sand, { mat: 'matte' }),
    rbox(0.21, 0.035, 0.31, 0.005, -0.11, 1.3325, -0.03, C.cream, { mat: 'matte' }),
    rbox(0.08, 0.035, 0.004, 0.002, -0.11, 1.24, 0.121, C.linen, { mat: 'matte' }),
    rbox(0.06, 0.016, 0.006, 0.003, -0.11, 1.19, 0.122, C.ink, { mat: 'matte' }),
    // second storage box
    rbox(0.19, 0.17, 0.28, 0.006, 0.11, 1.21, -0.02, C.cream, { mat: 'matte' }),
    rbox(0.2, 0.022, 0.29, 0.005, 0.11, 1.306, -0.02, C.sand, { mat: 'matte' }),
    rbox(0.075, 0.032, 0.004, 0.002, 0.11, 1.23, 0.121, C.white, { mat: 'matte' }),
    rbox(0.055, 0.014, 0.006, 0.003, 0.11, 1.18, 0.122, C.graphite, { mat: 'matte' }),
  ],
})
