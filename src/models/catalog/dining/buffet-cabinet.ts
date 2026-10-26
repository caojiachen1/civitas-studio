import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const SEAM = '#3a3936'
const DOOR_X = [-0.5, 0.5]
const FLUTES = [-0.18, -0.09, 0, 0.09, 0.18]
const DRAWER_Y = [0.258, 0.475, 0.692]
const TRAY_X = [0.42, 0.5, 0.58]

export default defineModel({
  id: 'buffet-cabinet',
  name: '餐边酒柜',
  category: 'dining',
  tags: ['buffet cabinet', 'wine sideboard', 'bar cabinet', '餐边酒柜', '餐边柜', '酒柜', '餐厅'],
  footprint: [1.7, 0.48],
  height: 1.25,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed toe kick
    box(1.56, 0.07, 0.4, 0, 0.035, -0.03, C.ink, { mat: 'matte' }),
    box(1.58, 0.012, 0.02, 0, 0.075, 0.172, SEAM),

    // oak carcass with walnut sides and back
    rbox(1.66, 0.8, 0.44, 0.01, 0, 0.5, -0.01, C.oak, { mat: 'wood' }),
    rbox(0.03, 0.78, 0.46, 0.006, -0.815, 0.5, -0.01, C.walnut, { mat: 'wood' }),
    rbox(0.03, 0.78, 0.46, 0.006, 0.815, 0.5, -0.01, C.walnut, { mat: 'wood' }),
    rbox(1.64, 0.78, 0.012, 0.004, 0, 0.5, -0.225, C.walnut, { mat: 'wood' }),

    // stone worktop, drip edge and upstand
    rbox(1.7, 0.04, 0.48, 0.012, 0, 0.92, 0, C.stone, { mat: 'stone' }),
    box(1.66, 0.005, 0.005, 0, 0.897, 0.237, C.graphite),
    rbox(1.7, 0.06, 0.018, 0.005, 0, 0.97, -0.231, C.stone, { mat: 'stone' }),

    // two fluted doors
    ...DOOR_X.flatMap((x) => [
      rbox(0.56, 0.65, 0.022, 0.008, x, 0.475, 0.221, C.cream, { mat: 'gloss' }),
      ...FLUTES.map((dx) => cyl(0.02, 0.02, 0.6, x + dx, 0.475, 0.219, C.cream, { mat: 'gloss' }, 14)),
    ]),
    // door-to-bank shadow seams
    box(0.01, 0.65, 0.006, -0.22, 0.475, 0.228, SEAM),
    box(0.01, 0.65, 0.006, 0.22, 0.475, 0.228, SEAM),

    // central drawer bank
    ...DRAWER_Y.map((y) => rbox(0.42, 0.206, 0.022, 0.006, 0, y, 0.221, C.cream, { mat: 'gloss' })),
    box(0.42, 0.008, 0.005, 0, 0.3665, 0.228, SEAM),
    box(0.42, 0.008, 0.005, 0, 0.5835, 0.228, SEAM),

    // brass pulls
    ...[-0.255, 0.255].map((x) => rbox(0.012, 0.16, 0.012, 0.005, x, 0.55, 0.235, C.brass, { mat: 'metal' })),
    ...DRAWER_Y.map((y) => rbox(0.2, 0.012, 0.012, 0.005, 0, y, 0.235, C.brass, { mat: 'metal' })),

    // top rail with brass inlay
    rbox(1.62, 0.09, 0.02, 0.004, 0, 0.845, 0.222, C.oak, { mat: 'wood' }),
    box(1.58, 0.004, 0.004, 0, 0.81, 0.233, C.brass, { mat: 'metal' }),

    // stone tray with three wine glasses
    rbox(0.34, 0.012, 0.2, 0.01, 0.5, 0.946, 0, C.stone, { mat: 'stone' }),
    ...TRAY_X.flatMap((x) => [
      cyl(0.03, 0.03, 0.006, x, 0.955, 0, C.glass, { mat: 'glass', opacity: 0.75 }, 20),
      cyl(0.005, 0.005, 0.07, x, 0.993, 0, C.glass, { mat: 'glass', opacity: 0.75 }, 10),
      cyl(0.038, 0.026, 0.075, x, 1.058, 0, C.glass, { mat: 'glass', opacity: 0.75 }, 20),
      torus(0.038, 0.0025, x, 1.0955, 0, C.glass, { mat: 'glass', opacity: 0.75, rot: [Math.PI / 2, 0, 0] }, 20),
    ]),

    // decanter
    cyl(0.06, 0.075, 0.16, -0.5, 1.02, -0.02, C.glass, { mat: 'glass', opacity: 0.8 }, 24),
    cyl(0.026, 0.06, 0.05, -0.5, 1.125, -0.02, C.glass, { mat: 'glass', opacity: 0.8 }, 20),
    cyl(0.02, 0.022, 0.05, -0.5, 1.175, -0.02, C.glass, { mat: 'glass', opacity: 0.8 }, 16),
    sphere(0.024, -0.5, 1.218, -0.02, C.glass, { mat: 'glass', opacity: 0.8 }, 16),

    // low ceramic bowl with a stone rim
    cyl(0.09, 0.06, 0.05, -0.15, 0.965, 0.09, C.white, { mat: 'ceramic' }, 24),
    torus(0.088, 0.005, -0.15, 0.99, 0.09, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 24),
  ],
})
