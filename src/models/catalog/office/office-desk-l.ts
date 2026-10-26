import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const TOP = '#b48a5a'
const TOP_DARK = '#9a7047'
const LEG = '#2f3437'
const SCREEN = '#22282c'

const drawerFronts = [0.18, 0.4, 0.62]

export default defineModel({
  id: 'office-desk-l',
  name: 'L 型办公桌',
  category: 'office',
  tags: ['l desk', 'corner desk', 'office desk', 'L 型办公桌', '转角桌', '工作站'],
  footprint: [1.85, 1.65],
  height: 1.28,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // main top along the back wall
    rbox(1.85, 0.045, 0.7, 0.012, 0, 0.74, -0.475, TOP, { mat: 'wood' }),
    rbox(1.81, 0.012, 0.66, 0.006, 0, 0.714, -0.475, TOP_DARK, { mat: 'wood' }),
    // return top running forward on the right
    rbox(0.65, 0.045, 0.95, 0.012, 0.6, 0.74, 0.35, TOP, { mat: 'wood' }),
    rbox(0.61, 0.012, 0.91, 0.006, 0.6, 0.714, 0.35, TOP_DARK, { mat: 'wood' }),
    // joint seam where the two tops meet
    box(0.65, 0.004, 0.012, 0.6, 0.764, -0.118, '#8a623e', { mat: 'wood' }),

    // left panel leg with levelling foot
    rbox(0.05, 0.7, 0.62, 0.01, -0.885, 0.37, -0.475, TOP, { mat: 'wood' }),
    rbox(0.06, 0.022, 0.64, 0.006, -0.885, 0.011, -0.475, LEG, { mat: 'metal' }),
    // right pedestal under the return
    rbox(0.56, 0.72, 0.48, 0.012, 0.6, 0.37, 0.5, TOP, { mat: 'wood' }),
    rbox(0.6, 0.03, 0.52, 0.008, 0.6, 0.015, 0.5, LEG, { mat: 'metal' }),
    // three drawer fronts with shadow gaps and bar pulls
    ...drawerFronts.flatMap((y) => [
      rbox(0.52, 0.19, 0.022, 0.006, 0.6, y, 0.742, C.white, { mat: 'gloss' }),
      rbox(0.28, 0.012, 0.014, 0.005, 0.6, y + 0.055, 0.756, C.brass, { mat: 'metal' }),
      cyl(0.007, 0.007, 0.02, 0.47, y + 0.055, 0.747, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
      cyl(0.007, 0.007, 0.02, 0.73, y + 0.055, 0.747, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    ]),
    // steel support leg at the inside corner
    box(0.05, 0.7, 0.05, 0.3, 0.37, -0.1, LEG, { mat: 'metal' }),
    box(0.14, 0.02, 0.14, 0.3, 0.01, -0.1, LEG, { mat: 'metal' }),

    // modesty panel and cable tray along the back
    rbox(0.9, 0.24, 0.022, 0.006, -0.3, 0.55, -0.792, TOP, { mat: 'wood' }),
    rbox(1.1, 0.06, 0.13, 0.01, -0.2, 0.67, -0.68, C.graphite, { mat: 'metal' }),
    rbox(0.03, 0.05, 0.11, 0.006, -0.72, 0.705, -0.68, C.graphite, { mat: 'metal' }),
    rbox(0.03, 0.05, 0.11, 0.006, 0.32, 0.705, -0.68, C.graphite, { mat: 'metal' }),
    // vertical cable spine down to the pedestal
    cyl(0.028, 0.028, 0.62, 0.47, 0.44, -0.74, C.ink, { mat: 'gloss' }, 10),
    torus(0.06, 0.006, 0.47, 0.45, -0.72, C.ink, { mat: 'gloss', rot: [0, Math.PI / 2, 0] }, 16),

    // monitor with weighted base, arm and cable
    rbox(0.42, 0.025, 0.22, 0.02, -0.2, 0.775, -0.52, C.blackMetal, { mat: 'metal' }),
    cyl(0.022, 0.028, 0.3, -0.2, 0.935, -0.56, C.blackMetal, { mat: 'metal' }, 14),
    rbox(0.62, 0.38, 0.035, 0.012, -0.2, 1.08, -0.54, SCREEN, { mat: 'gloss' }),
    rbox(0.58, 0.34, 0.004, 0.004, -0.2, 1.08, -0.52, '#3c464c', { mat: 'gloss' }),
    box(0.34, 0.005, 0.006, -0.2, 1.02, -0.518, '#5b686f', { mat: 'gloss' }),
    box(0.22, 0.004, 0.005, -0.2, 0.97, -0.518, '#4b565c', { mat: 'gloss' }),
    cyl(0.008, 0.008, 0.32, -0.02, 0.8, -0.66, C.ink, { mat: 'gloss', rot: [0.2, 0, 0.5] }, 8),

    // keyboard, mouse pad and mouse
    rbox(0.44, 0.016, 0.14, 0.008, -0.15, 0.77, -0.27, C.ink, { mat: 'matte' }),
    rbox(0.42, 0.006, 0.12, 0.003, -0.15, 0.781, -0.27, '#3a4147', { mat: 'matte' }),
    rbox(0.24, 0.005, 0.2, 0.008, 0.28, 0.766, -0.24, C.leather, { mat: 'leather' }),
    rbox(0.06, 0.025, 0.1, 0.022, 0.28, 0.78, -0.24, C.ink, { mat: 'gloss' }),
    box(0.012, 0.004, 0.02, 0.28, 0.795, -0.27, '#4b565c'),

    // desk lamp on the left
    cyl(0.075, 0.085, 0.02, -0.72, 0.772, -0.62, C.blackMetal, { mat: 'metal' }, 22),
    cyl(0.012, 0.016, 0.28, -0.72, 0.92, -0.62, C.blackMetal, { mat: 'metal' }, 14),
    sphere(0.022, -0.72, 1.06, -0.62, C.brass, { mat: 'metal' }, 14),
    cyl(0.011, 0.011, 0.18, -0.72, 1.06, -0.53, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    sphere(0.02, -0.72, 1.06, -0.445, C.brass, { mat: 'metal' }, 14),
    cyl(0.06, 0.095, 0.12, -0.72, 1.01, -0.39, C.cream, { mat: 'matte' }, 22),
    cyl(0.092, 0.092, 0.006, -0.72, 0.947, -0.39, C.cream, { mat: 'emissive' }, 22),

    // notebook, pen cup, mug and a small plant
    rbox(0.22, 0.008, 0.3, 0.004, 0.06, 0.768, -0.43, C.navy, { mat: 'fabric', rot: [0, 0.08, 0] }),
    rbox(0.21, 0.012, 0.29, 0.003, 0.06, 0.778, -0.43, C.cream, { mat: 'matte', rot: [0, 0.08, 0] }),
    cyl(0.004, 0.004, 0.15, 0.13, 0.782, -0.3, C.ink, { mat: 'gloss', rot: [Math.PI / 2, 0, 0.2] }, 8),
    cyl(0.045, 0.042, 0.1, 0.82, 0.812, 0.2, C.cream, { mat: 'ceramic' }, 20),
    torus(0.03, 0.007, 0.862, 0.815, 0.2, C.cream, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),
    cyl(0.055, 0.045, 0.11, 0.82, 0.817, 0.72, C.clay, { mat: 'ceramic' }, 20),
    cyl(0.05, 0.05, 0.008, 0.82, 0.866, 0.72, C.soil, { mat: 'matte' }, 18),
    ...[-0.08, 0, 0.08].flatMap((a, i) => [
      cyl(0.006, 0.008, 0.18, 0.82 + Math.cos(a) * 0.02, 0.955, 0.72 + Math.sin(a) * 0.02, '#5f7e4a', { mat: 'foliage', rot: [0.18 * Math.sin(a), a, 0.14] }, 6),
      sphere(0.035, 0.82 + Math.cos(a) * 0.05, 1.045 + i * 0.012, 0.72 + Math.sin(a) * 0.05, i % 2 === 0 ? '#6f8e5e' : '#7d9a68', { mat: 'foliage' }, 10),
    ]),

    // under-desk CPU sling and waste bin
    rbox(0.24, 0.42, 0.48, 0.01, 0.6, 0.36, -0.55, C.graphite, { mat: 'metal' }),
    rbox(0.22, 0.4, 0.02, 0.006, 0.6, 0.36, -0.305, C.ink, { mat: 'matte' }),
    cyl(0.012, 0.012, 0.02, 0.56, 0.5, -0.294, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.012, 0.012, 0.02, 0.64, 0.5, -0.294, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.15, 0.13, 0.42, 0.12, 0.21, 0.68, C.graphite, { mat: 'metal' }, 20),
  ],
})
