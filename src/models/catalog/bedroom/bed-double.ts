import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'bed-double',
  name: '双人床',
  category: 'bedroom',
  tags: ['bed', 'double bed', '双人床', '卧室', 'upholstered', '软包'],
  footprint: [1.75, 2.15],
  height: 1.15,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Upholstered headboard, back edge sits on z = -depth / 2
    rbox(1.7, 0.73, 0.13, 0.03, 0, 0.715, -1.005, C.linen, { mat: 'fabric' }),
    cyl(0.04, 0.04, 1.66, 0, 1.11, -1.0, '#e0d6c7', { mat: 'fabric', rot: [0, 0, Math.PI / 2] }, 20),
    rbox(1.56, 0.6, 0.045, 0.022, 0, 0.705, -0.928, '#e6ddcf', { mat: 'fabric' }),
    box(0.008, 0.5, 0.01, -0.39, 0.705, -0.902, '#c6b9a5', { mat: 'fabric' }),
    box(0.008, 0.5, 0.01, 0, 0.705, -0.902, '#c6b9a5', { mat: 'fabric' }),
    box(0.008, 0.5, 0.01, 0.39, 0.705, -0.902, '#c6b9a5', { mat: 'fabric' }),
    box(1.48, 0.008, 0.01, 0, 0.88, -0.902, '#c6b9a5', { mat: 'fabric' }),

    // Oak bed frame
    box(0.07, 0.2, 1.95, -0.82, 0.43, 0.02, C.oak, { mat: 'wood' }),
    box(0.07, 0.2, 1.95, 0.82, 0.43, 0.02, C.oak, { mat: 'wood' }),
    box(1.58, 0.18, 0.06, 0, 0.44, 1.03, C.oak, { mat: 'wood' }),
    rbox(1.68, 0.13, 0.05, 0.014, 0, 0.56, 1.03, '#b78d5c', { mat: 'wood' }),
    cyl(0.034, 0.022, 0.33, -0.78, 0.165, -0.9, C.walnut, { mat: 'wood' }, 10),
    cyl(0.034, 0.022, 0.33, 0.78, 0.165, -0.9, C.walnut, { mat: 'wood' }, 10),
    cyl(0.034, 0.022, 0.33, -0.78, 0.165, 0.97, C.walnut, { mat: 'wood' }, 10),
    cyl(0.034, 0.022, 0.33, 0.78, 0.165, 0.97, C.walnut, { mat: 'wood' }, 10),

    // Mattress with piping
    rbox(1.56, 0.23, 1.9, 0.055, 0, 0.645, 0.02, C.white, { mat: 'fabric' }),
    box(0.008, 0.012, 1.84, -0.781, 0.66, 0.02, '#d8d0c4', { mat: 'fabric' }),
    box(0.008, 0.012, 1.84, 0.781, 0.66, 0.02, '#d8d0c4', { mat: 'fabric' }),
    box(1.54, 0.012, 0.008, 0, 0.66, 0.962, '#d8d0c4', { mat: 'fabric' }),

    // Duvet with side and foot drapes
    rbox(1.6, 0.12, 1.4, 0.04, 0, 0.8, 0.36, C.sand, { mat: 'fabric' }),
    rbox(0.035, 0.3, 1.38, 0.012, -0.8, 0.7, 0.36, C.sand, { mat: 'fabric' }),
    rbox(0.035, 0.3, 1.38, 0.012, 0.8, 0.7, 0.36, C.sand, { mat: 'fabric' }),
    rbox(1.6, 0.3, 0.035, 0.012, 0, 0.7, 1.055, C.sand, { mat: 'fabric' }),
    box(1.5, 0.006, 0.01, 0, 0.862, 0.12, '#b7a78d', { mat: 'fabric' }),
    box(1.5, 0.006, 0.01, 0, 0.862, 0.48, '#b7a78d', { mat: 'fabric' }),
    box(1.5, 0.006, 0.01, 0, 0.862, 0.84, '#b7a78d', { mat: 'fabric' }),

    // Folded top sheet
    rbox(1.58, 0.05, 0.36, 0.02, 0, 0.885, -0.13, C.white, { mat: 'fabric' }),
    rbox(1.6, 0.05, 0.09, 0.02, 0, 0.895, 0.04, C.cream, { mat: 'fabric' }),

    // Two sleeping pillows with stitched borders
    rbox(0.68, 0.38, 0.15, 0.055, -0.4, 0.95, -0.84, C.cream, { mat: 'fabric' }),
    rbox(0.68, 0.38, 0.15, 0.055, 0.4, 0.95, -0.84, C.cream, { mat: 'fabric' }),
    rbox(0.58, 0.28, 0.012, 0.03, -0.4, 0.95, -0.7595, '#e9e0d2', { mat: 'fabric' }),
    rbox(0.58, 0.28, 0.012, 0.03, 0.4, 0.95, -0.7595, '#e9e0d2', { mat: 'fabric' }),

    // Accent cushions
    rbox(0.4, 0.34, 0.1, 0.035, -0.28, 0.94, -0.47, C.sage, { mat: 'fabric', rot: [-0.24, 0.1, 0] }),
    rbox(0.4, 0.34, 0.1, 0.035, 0.28, 0.94, -0.47, C.clay, { mat: 'fabric', rot: [-0.24, -0.08, 0] }),

    // Folded throw at the foot
    rbox(1.62, 0.055, 0.4, 0.02, 0, 0.883, 0.78, '#9aa88f', { mat: 'fabric' }),
    rbox(1.62, 0.03, 0.1, 0.012, 0, 0.906, 0.6, '#a7b49c', { mat: 'fabric' }),

    // extra duvet topstitch, side rail bolts and headboard roll bands
    box(1.5, 0.006, 0.01, 0, 0.862, 0.66, '#b7a78d', { mat: 'fabric' }),
    cyl(0.012, 0.012, 0.018, -0.855, 0.43, 0.6, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.012, 0.012, 0.018, 0.855, 0.43, 0.6, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.012, 0.012, 0.018, -0.855, 0.43, -0.45, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.012, 0.012, 0.018, 0.855, 0.43, -0.45, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    torus(0.04, 0.004, -0.4, 1.11, -1.0, '#d2c6b3', { mat: 'fabric', rot: [0, Math.PI / 2, 0] }, 16),
    torus(0.04, 0.004, 0.4, 1.11, -1.0, '#d2c6b3', { mat: 'fabric', rot: [0, Math.PI / 2, 0] }, 16),
  ],
})
