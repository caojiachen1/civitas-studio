import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const GROOVE = '#d8d3c7'

export default defineModel({
  id: 'bathroom-cabinet',
  name: '卫浴收纳柜',
  category: 'bathroom',
  tags: ['cabinet', 'storage', 'drawers', '收纳柜', '浴室柜', '卫浴'],
  footprint: [0.8, 0.45],
  height: 1.25,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed plinth with shadow reveal and kick chamfer
    rbox(0.72, 0.08, 0.36, 0.012, 0, 0.04, -0.025, C.ink, { mat: 'matte' }),
    box(0.7, 0.012, 0.008, 0, 0.083, 0.158, '#2e3031'),
    box(0.68, 0.01, 0.012, 0, 0.03, 0.153, '#3a3c3d'),
    // oak carcass
    rbox(0.78, 0.82, 0.41, 0.012, 0, 0.49, -0.02, C.oak, { mat: 'wood' }),
    rbox(0.8, 0.02, 0.415, 0.008, 0, 0.89, -0.0175, C.walnut, { mat: 'wood' }),
    // walnut back panel and side reveals
    rbox(0.76, 0.8, 0.01, 0.004, 0, 0.49, -0.219, C.walnut, { mat: 'wood' }),
    box(0.006, 0.74, 0.004, -0.375, 0.49, 0.188, C.ink),
    box(0.006, 0.74, 0.004, 0.375, 0.49, 0.188, C.ink),
    // two white drawer fronts
    rbox(0.72, 0.37, 0.022, 0.008, 0, 0.7, 0.192, C.white, { mat: 'gloss' }),
    rbox(0.72, 0.37, 0.022, 0.008, 0, 0.295, 0.192, C.white, { mat: 'gloss' }),
    box(0.72, 0.04, 0.006, 0, 0.4975, 0.198, C.cream),
    // recessed shaker frames splitting each drawer front
    box(0.004, 0.31, 0.004, -0.33, 0.7, 0.2035, GROOVE),
    box(0.004, 0.31, 0.004, 0.33, 0.7, 0.2035, GROOVE),
    box(0.664, 0.004, 0.004, 0, 0.545, 0.2035, GROOVE),
    box(0.664, 0.004, 0.004, 0, 0.855, 0.2035, GROOVE),
    box(0.004, 0.31, 0.004, -0.33, 0.295, 0.2035, GROOVE),
    box(0.004, 0.31, 0.004, 0.33, 0.295, 0.2035, GROOVE),
    box(0.664, 0.004, 0.004, 0, 0.14, 0.2035, GROOVE),
    box(0.664, 0.004, 0.004, 0, 0.45, 0.2035, GROOVE),
    // brass pull bars
    rbox(0.3, 0.014, 0.014, 0.006, 0, 0.79, 0.212, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.02, -0.11, 0.79, 0.201, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.02, 0.11, 0.79, 0.201, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rbox(0.3, 0.014, 0.014, 0.006, 0, 0.375, 0.212, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.02, -0.11, 0.375, 0.201, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.02, 0.11, 0.375, 0.201, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    // brass end collars on the pull bars
    cyl(0.011, 0.011, 0.006, -0.155, 0.79, 0.212, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.011, 0.011, 0.006, 0.155, 0.79, 0.212, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.011, 0.011, 0.006, -0.155, 0.375, 0.212, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.011, 0.011, 0.006, 0.155, 0.375, 0.212, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    // stone top
    rbox(0.8, 0.035, 0.44, 0.01, 0, 0.9175, -0.005, C.stone, { mat: 'stone' }),
    // stone soap dish with soap bar
    rbox(0.12, 0.008, 0.08, 0.02, 0.18, 0.939, 0.14, C.stone, { mat: 'stone' }),
    rbox(0.08, 0.012, 0.05, 0.012, 0.18, 0.95, 0.14, C.cream, { mat: 'matte' }),
    // oak tray
    rbox(0.34, 0.012, 0.22, 0.01, -0.17, 0.941, 0, C.walnut, { mat: 'wood' }),
    rbox(0.34, 0.012, 0.008, 0.003, -0.17, 0.95, 0.11, C.walnut, { mat: 'wood' }),
    rbox(0.34, 0.012, 0.008, 0.003, -0.17, 0.95, -0.11, C.walnut, { mat: 'wood' }),
    // apothecary bottle with stopper
    cyl(0.042, 0.047, 0.16, -0.29, 1.027, 0.02, C.clay, { mat: 'gloss' }, 20),
    cyl(0.02, 0.042, 0.05, -0.29, 1.132, 0.02, C.clay, { mat: 'gloss' }, 20),
    cyl(0.016, 0.018, 0.03, -0.29, 1.172, 0.02, C.clay, { mat: 'gloss' }, 16),
    cyl(0.023, 0.023, 0.026, -0.29, 1.2, 0.02, C.ink, { mat: 'matte' }, 16),
    sphere(0.018, -0.29, 1.232, 0.02, C.brass, { mat: 'metal' }, 14),
    // pump bottle
    cyl(0.035, 0.038, 0.11, -0.17, 1.002, -0.02, C.cream, { mat: 'gloss' }, 18),
    cyl(0.015, 0.017, 0.02, -0.17, 1.067, -0.02, C.cream, { mat: 'gloss' }, 12),
    cyl(0.007, 0.007, 0.03, -0.17, 1.082, -0.02, C.steel, { mat: 'metal' }, 10),
    rbox(0.05, 0.014, 0.02, 0.005, -0.17, 1.09, -0.02, C.steel, { mat: 'metal' }),
    // small corked bottle
    cyl(0.028, 0.033, 0.15, -0.055, 1.022, 0.04, '#8fa087', { mat: 'gloss' }, 18),
    cyl(0.016, 0.028, 0.02, -0.055, 1.107, 0.04, '#8fa087', { mat: 'gloss' }, 16),
    cyl(0.018, 0.02, 0.02, -0.055, 1.127, 0.04, C.brass, { mat: 'metal' }, 14),
    // rolled towel, lower
    cyl(0.055, 0.055, 0.2, 0.2, 0.99, 0, C.linen, { mat: 'fabric' }, 24),
    cyl(0.048, 0.048, 0.005, 0.3025, 0.99, 0, C.cream, { mat: 'fabric' }, 24),
    torus(0.028, 0.0045, 0.306, 0.99, 0, C.cream, { mat: 'fabric', rot: [0, Math.PI / 2, 0] }, 20),
    torus(0.056, 0.004, 0.2, 0.99, 0, C.cream, { mat: 'fabric', rot: [0, Math.PI / 2, 0] }, 24),
    // rolled towel, upper
    cyl(0.055, 0.055, 0.2, 0.18, 1.1, 0.02, C.blush, { mat: 'fabric' }, 24),
    cyl(0.048, 0.048, 0.005, 0.2825, 1.1, 0.02, C.linen, { mat: 'fabric' }, 24),
    torus(0.028, 0.0045, 0.286, 1.1, 0.02, C.linen, { mat: 'fabric', rot: [0, Math.PI / 2, 0] }, 20),
    torus(0.056, 0.004, 0.18, 1.1, 0.02, C.linen, { mat: 'fabric', rot: [0, Math.PI / 2, 0] }, 24),
    // hand towel draped over the lower pull bar
    rbox(0.22, 0.22, 0.012, 0.006, 0.06, 0.27, 0.213, C.linen, { mat: 'fabric' }),
    rbox(0.22, 0.018, 0.03, 0.006, 0.06, 0.383, 0.208, C.linen, { mat: 'fabric' }),
    box(0.2, 0.02, 0.002, 0.06, 0.2, 0.2195, C.sage),
  ],
})
