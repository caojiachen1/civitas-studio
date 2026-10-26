import { C, box, cyl, defineModel, rbox } from '../../kit'

const teak = '#a97a4d'
const teakDark = '#8c6039'

export default defineModel({
  id: 'garden-chair',
  name: '花园扶手椅',
  category: 'outdoor',
  tags: ['chair', 'garden', 'teak', 'armchair', '扶手椅', '花园椅', '柚木'],
  footprint: [0.62, 0.62],
  height: 0.9,
  placement: 'outdoor',
  parts: [
    // legs
    rbox(0.05, 0.42, 0.05, 0.012, -0.26, 0.21, 0.245, teak, { mat: 'wood' }),
    rbox(0.05, 0.42, 0.05, 0.012, 0.26, 0.21, 0.245, teak, { mat: 'wood' }),
    rbox(0.055, 0.9, 0.052, 0.014, -0.26, 0.45, -0.235, teak, { mat: 'wood', rot: [-0.05, 0, 0] }),
    rbox(0.055, 0.9, 0.052, 0.014, 0.26, 0.45, -0.235, teak, { mat: 'wood', rot: [-0.05, 0, 0] }),
    // seat frame
    box(0.045, 0.07, 0.47, -0.26, 0.37, 0, teakDark, { mat: 'wood' }),
    box(0.045, 0.07, 0.47, 0.26, 0.37, 0, teakDark, { mat: 'wood' }),
    box(0.47, 0.06, 0.03, 0, 0.36, 0.235, teak, { mat: 'wood' }),
    box(0.47, 0.06, 0.03, 0, 0.36, -0.235, teak, { mat: 'wood' }),
    // seat slats
    box(0.5, 0.025, 0.075, 0, 0.415, 0.16, teak, { mat: 'wood' }),
    box(0.5, 0.025, 0.075, 0, 0.415, 0.075, teak, { mat: 'wood' }),
    box(0.5, 0.025, 0.075, 0, 0.415, -0.01, teak, { mat: 'wood' }),
    box(0.5, 0.025, 0.075, 0, 0.415, -0.095, teak, { mat: 'wood' }),
    box(0.5, 0.025, 0.075, 0, 0.415, -0.18, teak, { mat: 'wood' }),
    // seat cushion and buttons
    rbox(0.5, 0.075, 0.44, 0.03, 0, 0.465, 0.005, C.sage, { mat: 'fabric' }),
    cyl(0.012, 0.012, 0.01, -0.14, 0.505, 0.09, C.cream, { mat: 'fabric' }, 10),
    cyl(0.012, 0.012, 0.01, 0, 0.505, 0.09, C.cream, { mat: 'fabric' }, 10),
    cyl(0.012, 0.012, 0.01, 0.14, 0.505, 0.09, C.cream, { mat: 'fabric' }, 10),
    // lower stretchers
    box(0.035, 0.035, 0.42, -0.26, 0.15, 0.0, teakDark, { mat: 'wood' }),
    box(0.035, 0.035, 0.42, 0.26, 0.15, 0.0, teakDark, { mat: 'wood' }),
    box(0.46, 0.03, 0.03, 0, 0.15, 0.0, teakDark, { mat: 'wood' }),
    // armrests and supports
    rbox(0.058, 0.035, 0.52, 0.014, -0.28, 0.635, 0.0, teak, { mat: 'wood' }),
    rbox(0.058, 0.035, 0.52, 0.014, 0.28, 0.635, 0.0, teak, { mat: 'wood' }),
    box(0.035, 0.245, 0.035, -0.28, 0.515, 0.235, teak, { mat: 'wood' }),
    box(0.035, 0.245, 0.035, 0.28, 0.515, 0.235, teak, { mat: 'wood' }),
    box(0.035, 0.17, 0.04, -0.28, 0.555, -0.238, teak, { mat: 'wood', rot: [-0.05, 0, 0] }),
    box(0.035, 0.17, 0.04, 0.28, 0.555, -0.238, teak, { mat: 'wood', rot: [-0.05, 0, 0] }),
    // metal hardware
    cyl(0.013, 0.013, 0.012, -0.303, 0.555, 0.235, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.013, 0.013, 0.012, 0.303, 0.555, 0.235, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.013, 0.013, 0.012, -0.293, 0.2, -0.235, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.013, 0.013, 0.012, 0.293, 0.2, -0.235, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // back slats
    box(0.44, 0.06, 0.022, 0, 0.58, -0.217, teak, { mat: 'wood' }),
    box(0.44, 0.06, 0.022, 0, 0.66, -0.221, teak, { mat: 'wood' }),
    box(0.44, 0.06, 0.022, 0, 0.74, -0.225, teak, { mat: 'wood' }),
    box(0.44, 0.06, 0.022, 0, 0.82, -0.229, teak, { mat: 'wood' }),
    // top back rail
    rbox(0.55, 0.06, 0.055, 0.02, 0, 0.862, -0.262, teak, { mat: 'wood', rot: [-0.05, 0, 0] }),
    // back cushion
    rbox(0.38, 0.2, 0.06, 0.025, 0, 0.69, -0.198, C.linen, { mat: 'fabric', rot: [-0.05, 0, 0] }),
  ],
})
