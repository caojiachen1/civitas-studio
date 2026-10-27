import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#8f5f52'
const tire = '#24272b'
const dark = '#2c3033'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.33, 0.33, 0.26, x, 0.33, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 22),
  cyl(0.215, 0.215, 0.268, x, 0.33, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.07, 0.07, 0.274, x, 0.33, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'sports-car',
  name: '跑车',
  category: 'vehicles',
  tags: ['sports', 'coupe', 'supercar', '跑车', '双门', '运动', '溜背'],
  footprint: [1.95, 4.3],
  height: 1.25,
  placement: 'on-road',
  parts: [
    // wide low wheels
    ...wheel(-0.81, 1.38),
    ...wheel(0.81, 1.38),
    ...wheel(-0.81, -1.36),
    ...wheel(0.81, -1.36),

    // low body, wedge nose, splitter and bonnet
    rbox(1.82, 0.42, 4.05, 0.14, 0, 0.56, 0, paint, { mat: 'gloss' }),
    rbox(1.8, 0.28, 0.8, 0.08, 0, 0.52, 1.65, paint, { mat: 'gloss' }),
    box(1.9, 0.05, 0.4, 0, 0.32, 1.95, dark, { mat: 'gloss' }),
    rbox(1.72, 0.16, 1.2, 0.06, 0, 0.75, 1.35, paint, { mat: 'gloss' }),
    box(0.36, 0.02, 0.24, -0.35, 0.83, 1.4, dark),
    box(0.36, 0.02, 0.24, 0.35, 0.83, 1.4, dark),

    // muscular fender blisters, side skirts and side intakes
    rbox(0.28, 0.24, 1.0, 0.08, -0.82, 0.72, 1.38, paint, { mat: 'gloss' }),
    rbox(0.28, 0.24, 1.0, 0.08, 0.82, 0.72, 1.38, paint, { mat: 'gloss' }),
    rbox(0.28, 0.24, 1.0, 0.08, -0.82, 0.72, -1.36, paint, { mat: 'gloss' }),
    rbox(0.28, 0.24, 1.0, 0.08, 0.82, 0.72, -1.36, paint, { mat: 'gloss' }),
    box(0.06, 0.14, 2.3, -0.9, 0.38, 0, dark, { mat: 'gloss' }),
    box(0.06, 0.14, 2.3, 0.9, 0.38, 0, dark, { mat: 'gloss' }),
    box(0.02, 0.16, 0.6, -0.913, 0.64, -0.35, dark),
    box(0.02, 0.16, 0.6, 0.913, 0.64, -0.35, dark),

    // rear deck
    rbox(1.7, 0.1, 0.9, 0.04, 0, 0.8, -1.5, paint, { mat: 'gloss' }),

    // low glasshouse, roof panel, raked screens and A-pillars
    rbox(1.44, 0.3, 1.9, 0.1, 0, 1.0, -0.25, '#343e43', { mat: 'glass' }),
    rbox(1.3, 0.05, 1.0, 0.03, 0, 1.17, -0.55, paint, { mat: 'gloss' }),
    box(1.38, 0.34, 0.04, 0, 1.0, 0.62, '#343e43', { mat: 'glass', rot: [-0.85, 0, 0] }),
    box(1.36, 0.36, 0.04, 0, 1.0, -1.28, '#343e43', { mat: 'glass', rot: [0.8, 0, 0] }),
    rbox(0.07, 0.36, 0.08, 0.02, -0.7, 1.0, 0.6, paint, { mat: 'gloss', rot: [-0.85, 0, 0] }),
    rbox(0.07, 0.36, 0.08, 0.02, 0.7, 1.0, 0.6, paint, { mat: 'gloss', rot: [-0.85, 0, 0] }),

    // door seams, flush handles and mirror pods
    box(0.02, 0.35, 0.03, -0.913, 0.62, 0.25, dark),
    box(0.02, 0.35, 0.03, 0.913, 0.62, 0.25, dark),
    box(0.025, 0.04, 0.14, -0.92, 0.68, 0.45, chrome, { mat: 'metal' }),
    box(0.025, 0.04, 0.14, 0.92, 0.68, 0.45, chrome, { mat: 'metal' }),
    box(0.08, 0.03, 0.03, -0.9, 0.78, 0.65, dark),
    box(0.08, 0.03, 0.03, 0.9, 0.78, 0.65, dark),
    rbox(0.04, 0.1, 0.14, 0.02, -0.95, 0.82, 0.68, paint, { mat: 'gloss' }),
    rbox(0.04, 0.1, 0.14, 0.02, 0.95, 0.82, 0.68, paint, { mat: 'gloss' }),

    // rear wing: two posts, blade and end plates
    box(0.05, 0.16, 0.06, -0.5, 0.93, -1.9, dark, { mat: 'metal' }),
    box(0.05, 0.16, 0.06, 0.5, 0.93, -1.9, dark, { mat: 'metal' }),
    rbox(1.5, 0.04, 0.34, 0.02, 0, 1.02, -1.95, paint, { mat: 'gloss' }),
    box(0.03, 0.14, 0.36, -0.74, 1.0, -1.95, dark),
    box(0.03, 0.14, 0.36, 0.74, 1.0, -1.95, dark),

    // diffuser and quad exhausts
    box(1.4, 0.16, 0.24, 0, 0.32, -2.0, dark),
    box(0.03, 0.16, 0.22, -0.4, 0.32, -2.0, dark),
    box(0.03, 0.16, 0.22, 0.4, 0.32, -2.0, dark),
    cyl(0.045, 0.045, 0.12, -0.5, 0.4, -2.06, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.045, 0.045, 0.12, -0.35, 0.4, -2.06, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.045, 0.045, 0.12, 0.35, 0.4, -2.06, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.045, 0.045, 0.12, 0.5, 0.4, -2.06, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),

    // slim head lamps, nose intakes and splitter lip
    rbox(0.34, 0.07, 0.06, 0.02, -0.62, 0.72, 2.03, '#e8e1c8', { mat: 'emissive' }),
    rbox(0.34, 0.07, 0.06, 0.02, 0.62, 0.72, 2.03, '#e8e1c8', { mat: 'emissive' }),
    box(0.3, 0.12, 0.04, -0.55, 0.45, 2.06, dark, { mat: 'metal' }),
    box(0.3, 0.12, 0.04, 0.55, 0.45, 2.06, dark, { mat: 'metal' }),
    box(0.5, 0.1, 0.04, 0, 0.45, 2.06, dark, { mat: 'metal' }),

    // tail lamps, centre bar, plates and roof fin
    rbox(0.4, 0.09, 0.05, 0.02, -0.6, 0.78, -2.03, C.red, { mat: 'emissive' }),
    rbox(0.4, 0.09, 0.05, 0.02, 0.6, 0.78, -2.03, C.red, { mat: 'emissive' }),
    box(0.5, 0.03, 0.02, 0, 0.78, -2.045, C.red, { mat: 'emissive' }),
    box(0.44, 0.11, 0.02, 0, 0.5, 2.055, C.white),
    box(0.44, 0.11, 0.02, 0, 0.55, -2.035, C.white),
    box(0.05, 0.06, 0.14, 0, 1.22, -0.95, dark),
  ],
})
