import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'printer-stand',
  name: '打印机台',
  category: 'office',
  tags: ['printer stand', 'printer', '打印机', '打印机台', '收纳柜'],
  footprint: [0.8, 0.5],
  height: 0.75,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // plinth
    rbox(0.68, 0.05, 0.36, 0.01, 0, 0.025, -0.03, C.ink, { mat: 'matte' }),
    // oak cabinet
    rbox(0.76, 0.47, 0.44, 0.012, 0, 0.285, -0.02, C.oak, { mat: 'wood' }),
    rbox(0.8, 0.03, 0.5, 0.01, 0, 0.535, 0, C.oak, { mat: 'wood' }),
    rbox(0.7, 0.02, 0.02, 0.006, 0, 0.56, -0.235, C.walnut, { mat: 'wood' }),
    // white drawer fronts
    rbox(0.68, 0.19, 0.02, 0.008, 0, 0.4, 0.212, C.white, { mat: 'gloss' }),
    rbox(0.68, 0.19, 0.02, 0.008, 0, 0.18, 0.212, C.white, { mat: 'gloss' }),
    box(0.68, 0.04, 0.006, 0, 0.29, 0.218, C.cream),
    // brass pulls
    rbox(0.3, 0.013, 0.013, 0.005, 0, 0.465, 0.233, C.brass, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.018, -0.12, 0.465, 0.222, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.018, 0.12, 0.465, 0.222, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    rbox(0.3, 0.013, 0.013, 0.005, 0, 0.245, 0.233, C.brass, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.018, -0.12, 0.245, 0.222, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.018, 0.12, 0.245, 0.222, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // compact printer: lower chassis
    rbox(0.48, 0.12, 0.34, 0.018, 0, 0.61, -0.02, C.graphite, { mat: 'matte' }),
    rbox(0.3, 0.035, 0.055, 0.008, 0, 0.585, 0.16, C.ink, { mat: 'matte' }),
    rbox(0.27, 0.018, 0.04, 0.004, 0, 0.603, 0.16, C.white, { mat: 'matte' }),
    rbox(0.24, 0.026, 0.008, 0.003, 0, 0.566, 0.19, C.ink, { mat: 'matte' }),
    // printer body and lid
    rbox(0.47, 0.07, 0.33, 0.02, 0, 0.705, -0.02, C.white, { mat: 'gloss' }),
    rbox(0.45, 0.012, 0.31, 0.012, 0, 0.744, -0.02, C.cream, { mat: 'matte' }),
    box(0.44, 0.004, 0.004, 0, 0.74, 0.145, C.graphite),
    rbox(0.32, 0.014, 0.02, 0.004, 0, 0.7, 0.145, C.ink, { mat: 'matte' }),
    // control strip and buttons
    rbox(0.13, 0.042, 0.008, 0.004, 0.14, 0.712, 0.147, C.graphite, { mat: 'matte' }),
    cyl(0.006, 0.006, 0.006, 0.1, 0.712, 0.153, C.sage, { mat: 'emissive' }, 12),
    cyl(0.006, 0.006, 0.006, 0.13, 0.712, 0.153, C.cream, { mat: 'matte' }, 12),
    box(0.05, 0.006, 0.003, 0.175, 0.712, 0.152, C.steel),
    // rear paper feed
    rbox(0.3, 0.05, 0.03, 0.008, 0, 0.725, -0.195, C.graphite, { mat: 'matte' }),
    // output sheet
    rbox(0.22, 0.003, 0.2, 0.002, 0.02, 0.705, 0.14, C.white, { mat: 'matte', rot: [-0.1, 0, 0] }),
    box(0.16, 0.002, 0.002, 0.02, 0.712, 0.17, '#d8d4ca'),
    // power cable
    cyl(0.005, 0.005, 0.5, 0.18, 0.3, -0.24, C.ink, { mat: 'gloss' }, 8),
    torus(0.05, 0.005, 0.18, 0.075, -0.24, C.ink, { mat: 'gloss' }, 16),

    // wrapped paper ream on the open end of the top
    rbox(0.12, 0.05, 0.28, 0.004, -0.33, 0.575, -0.02, C.white, { mat: 'matte' }),
    box(0.122, 0.012, 0.282, -0.33, 0.575, -0.02, C.cream, { mat: 'matte' }),
    box(0.1, 0.002, 0.004, -0.33, 0.601, -0.02, '#d8d4ca', { mat: 'matte' }),
    // drawer label holders
    ...[0.4, 0.18].flatMap((y) => [
      rbox(0.07, 0.03, 0.004, 0.003, 0.24, y, 0.2245, C.brass, { mat: 'metal' }),
      rbox(0.05, 0.016, 0.002, 0.001, 0.24, y, 0.227, C.white, { mat: 'matte' }),
    ]),
    // cable retaining clips on the back panel
    box(0.024, 0.014, 0.02, 0.18, 0.4, -0.2455, C.graphite, { mat: 'metal' }),
    box(0.024, 0.014, 0.02, 0.18, 0.24, -0.2455, C.graphite, { mat: 'metal' }),
  ],
})
