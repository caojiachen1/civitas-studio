import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#eae6dc'
const dark = '#3c4145'
const bumper = '#4b5054'
const tire = '#22262a'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.52, 0.52, 0.3, x, 0.52, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 22),
  cyl(0.3, 0.3, 0.31, x, 0.52, z, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
]

export default defineModel({
  id: 'city-bus',
  name: '城市公交',
  category: 'vehicles',
  tags: ['bus', 'transit', '公交', '巴士', '公共交通', '城市'],
  footprint: [2.5, 10.0],
  height: 3.2,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-1.02, 2.6),
    ...wheel(1.02, 2.6),
    ...wheel(-1.02, -3.1),
    ...wheel(1.02, -3.1),

    // long body, skirt, roof cap
    rbox(2.44, 2.3, 9.7, 0.18, 0, 1.7, 0, paint, { mat: 'gloss' }),
    rbox(2.34, 0.26, 9.3, 0.05, 0, 0.44, 0, bumper),
    rbox(2.36, 0.1, 9.56, 0.05, 0, 2.885, 0, '#d8d4c9'),

    // continuous dark interior so the glazing reads as tinted
    box(2.1, 1.75, 8.6, 0, 1.575, -0.15, '#2a2d2f'),

    // side window band with pillars
    box(2.46, 0.9, 8.8, 0, 2.17, -0.15, C.glass, { mat: 'glass' }),
    box(0.04, 0.9, 0.1, -1.225, 2.17, 2.0, paint, { mat: 'gloss' }),
    box(0.04, 0.9, 0.1, 1.225, 2.17, 2.0, paint, { mat: 'gloss' }),
    box(0.04, 0.9, 0.1, -1.225, 2.17, -0.2, paint, { mat: 'gloss' }),
    box(0.04, 0.9, 0.1, 1.225, 2.17, -0.2, paint, { mat: 'gloss' }),
    box(0.04, 0.9, 0.1, -1.225, 2.17, -2.4, paint, { mat: 'gloss' }),
    box(0.04, 0.9, 0.1, 1.225, 2.17, -2.4, paint, { mat: 'gloss' }),

    // livery stripes
    box(2.47, 0.2, 9.46, 0, 1.35, 0, C.water, { mat: 'gloss' }),
    box(2.465, 0.05, 9.46, 0, 1.16, 0, C.red),

    // two glass doors on the kerb side
    rbox(0.03, 1.7, 1.26, 0.02, 1.225, 1.5, 3.85, dark),
    box(0.02, 1.58, 1.16, 1.238, 1.5, 3.85, C.glass, { mat: 'glass' }),
    rbox(0.03, 1.7, 1.26, 0.02, 1.225, 1.5, -1.35, dark),
    box(0.02, 1.58, 1.16, 1.238, 1.5, -1.35, C.glass, { mat: 'glass' }),

    // front: windscreen, surround, route display, lamps, bumper, plate
    box(2.24, 1.22, 0.03, 0, 2.0, 4.855, dark),
    box(2.18, 1.1, 0.06, 0, 2.0, 4.845, C.glass, { mat: 'glass' }),
    box(1.5, 0.32, 0.06, 0, 2.7, 4.85, '#23272c'),
    box(1.36, 0.18, 0.02, 0, 2.7, 4.885, '#101318'),
    rbox(0.42, 0.18, 0.05, 0.02, -0.82, 1.0, 4.86, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.42, 0.18, 0.05, 0.02, 0.82, 1.0, 4.86, '#ffe9c2', { mat: 'emissive' }),
    rbox(2.48, 0.34, 0.2, 0.08, 0, 0.55, 4.86, bumper),
    box(0.5, 0.13, 0.02, 0, 0.62, 4.97, C.white),

    // roof air-conditioning pod and vent
    rbox(1.5, 0.28, 2.3, 0.06, 0, 3.045, -1.3, '#e4e0d5'),
    rbox(0.86, 0.1, 0.86, 0.03, 0, 2.985, 1.6, '#d3cfc4'),

    // rear window, engine grille, lamps, bumper, plate
    box(2.0, 0.8, 0.05, 0, 2.2, -4.845, C.glass, { mat: 'glass' }),
    box(1.2, 0.55, 0.04, 0, 1.0, -4.865, dark, { mat: 'metal' }),
    rbox(0.16, 0.44, 0.05, 0.03, -0.88, 1.05, -4.86, C.red, { mat: 'emissive' }),
    rbox(0.16, 0.44, 0.05, 0.03, 0.88, 1.05, -4.86, C.red, { mat: 'emissive' }),
    rbox(2.48, 0.3, 0.18, 0.07, 0, 0.55, -4.85, bumper),
    box(0.5, 0.13, 0.02, 0, 1.5, -4.865, C.white),

    // mirrors on short arms
    box(0.06, 0.05, 0.05, -1.215, 2.1, 4.45, dark),
    rbox(0.04, 0.5, 0.16, 0.02, -1.23, 1.95, 4.5, dark),
    box(0.06, 0.05, 0.05, 1.215, 2.1, 4.45, dark),
    rbox(0.04, 0.5, 0.16, 0.02, 1.23, 1.95, 4.5, dark),

    // wheel arch panels
    box(0.02, 0.6, 1.2, -1.221, 0.75, 2.6, '#2f3437'),
    box(0.02, 0.6, 1.2, 1.221, 0.75, 2.6, '#2f3437'),
    box(0.02, 0.6, 1.2, -1.221, 0.75, -3.1, '#2f3437'),
    box(0.02, 0.6, 1.2, 1.221, 0.75, -3.1, '#2f3437'),
  ],
})
