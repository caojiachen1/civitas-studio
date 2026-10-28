import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#dcd8cc'
const paintDeep = '#cfcbbf'
const livery = '#8a9a92'
const tire = '#24272b'
const dark = '#3a4046'
const chrome = C.steel

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.32, 0.32, 0.22, x, 0.32, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.19, 0.19, 0.228, x, 0.32, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
]

export default defineModel({
  id: 'city-tram',
  name: '有轨电车',
  category: 'vehicles',
  tags: ['tram', 'streetcar', 'rail', 'transit', '有轨电车', '电车', '轨道', '公共交通'],
  footprint: [2.74, 9.16],
  height: 3.4,
  placement: 'on-road',
  parts: [
    // two bogies, two axles each
    ...wheel(-0.95, 3.2),
    ...wheel(0.95, 3.2),
    ...wheel(-0.95, 2.2),
    ...wheel(0.95, 2.2),
    ...wheel(-0.95, -3.2),
    ...wheel(0.95, -3.2),
    ...wheel(-0.95, -2.2),
    ...wheel(0.95, -2.2),
    box(1.9, 0.26, 1.6, 0, 0.4, 2.7, dark, { mat: 'metal' }),
    box(1.9, 0.26, 1.6, 0, 0.4, -2.7, dark, { mat: 'metal' }),

    // body shell, skirt, roof cap, dark saloon interior and livery band
    rbox(2.5, 2.37, 8.7, 0.25, 0, 1.735, 0, paint, { mat: 'gloss' }),
    rbox(2.44, 0.26, 8.3, 0.05, 0, 0.46, 0, '#4a5054', { mat: 'metal' }),
    rbox(2.34, 0.06, 8.5, 0.03, 0, 2.95, 0, paintDeep, { mat: 'gloss' }),
    box(2.2, 1.9, 8.3, 0, 1.4, -0.1, '#2a2d2f'),
    box(2.52, 0.18, 8.6, 0, 1.13, 0, livery, { mat: 'gloss' }),

    // continuous side glazing bands and body pillars
    box(2.52, 0.8, 7.6, 0, 2.28, -0.1, C.glass, { mat: 'glass' }),
    box(0.05, 0.86, 0.12, -1.255, 2.28, 3.7, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, 1.255, 2.28, 3.7, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, -1.255, 2.28, 1.95, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, 1.255, 2.28, 1.95, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, -1.255, 2.28, 0.3, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, 1.255, 2.28, 0.3, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, -1.255, 2.28, -3.7, paint, { mat: 'gloss' }),
    box(0.05, 0.86, 0.12, 1.255, 2.28, -3.7, paint, { mat: 'gloss' }),

    // double sliding doors on both sides
    box(0.04, 1.95, 1.2, -1.255, 1.5, 2.75, dark),
    box(0.02, 1.8, 1.1, -1.278, 1.55, 2.75, C.glass, { mat: 'glass' }),
    box(0.04, 1.95, 1.2, 1.255, 1.5, 2.75, dark),
    box(0.02, 1.8, 1.1, 1.278, 1.55, 2.75, C.glass, { mat: 'glass' }),
    box(0.04, 1.95, 1.2, -1.255, 1.5, -1.5, dark),
    box(0.02, 1.8, 1.1, -1.278, 1.55, -1.5, C.glass, { mat: 'glass' }),
    box(0.04, 1.95, 1.2, 1.255, 1.5, -1.5, dark),
    box(0.02, 1.8, 1.1, 1.278, 1.55, -1.5, C.glass, { mat: 'glass' }),

    // front cab: windscreen, route board, lamps and bumper
    box(2.32, 0.9, 0.04, 0, 2.42, 4.36, dark),
    box(2.24, 0.82, 0.05, 0, 2.42, 4.375, C.glass, { mat: 'glass', rot: [-0.05, 0, 0] }),
    box(1.7, 0.22, 0.06, 0, 2.84, 4.36, '#23272c'),
    box(1.54, 0.13, 0.02, 0, 2.84, 4.392, '#e0b46b', { mat: 'emissive' }),
    rbox(0.4, 0.16, 0.05, 0.02, -0.85, 1.05, 4.37, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.4, 0.16, 0.05, 0.02, 0.85, 1.05, 4.37, '#ffe9c2', { mat: 'emissive' }),
    rbox(2.52, 0.3, 0.2, 0.07, 0, 0.55, 4.4, '#4a5054', { mat: 'metal' }),

    // rear cab: window, lamps and bumper
    box(2.2, 0.74, 0.05, 0, 2.45, -4.36, C.glass, { mat: 'glass' }),
    rbox(0.34, 0.16, 0.05, 0.02, -0.86, 1.05, -4.37, C.red, { mat: 'emissive' }),
    rbox(0.34, 0.16, 0.05, 0.02, 0.86, 1.05, -4.37, C.red, { mat: 'emissive' }),
    rbox(2.52, 0.3, 0.2, 0.07, 0, 0.55, -4.4, '#4a5054', { mat: 'metal' }),

    // pantograph: base, insulators, folding arms and contact bar
    box(0.62, 0.08, 1.0, 0, 3.02, -1.8, dark, { mat: 'metal' }),
    cyl(0.055, 0.055, 0.12, -0.24, 3.12, -1.8, '#d8d4c9', { mat: 'ceramic' }, 10),
    cyl(0.055, 0.055, 0.12, 0.24, 3.12, -1.8, '#d8d4c9', { mat: 'ceramic' }, 10),
    cyl(0.022, 0.022, 0.22, -0.22, 3.245, -1.86, chrome, { mat: 'metal', rot: [0.9, 0, 0] }, 8),
    cyl(0.022, 0.022, 0.22, 0.22, 3.245, -1.86, chrome, { mat: 'metal', rot: [0.9, 0, 0] }, 8),
    cyl(0.018, 0.018, 0.17, -0.22, 3.33, -1.69, chrome, { mat: 'metal', rot: [-0.9, 0, 0] }, 8),
    cyl(0.018, 0.018, 0.17, 0.22, 3.33, -1.69, chrome, { mat: 'metal', rot: [-0.9, 0, 0] }, 8),
    box(0.7, 0.03, 0.08, 0, 3.375, -1.76, chrome, { mat: 'metal' }),

    // mirror arms and heads
    box(0.07, 0.04, 0.04, -1.265, 2.2, 4.08, dark, { mat: 'metal' }),
    box(0.07, 0.04, 0.04, 1.265, 2.2, 4.08, dark, { mat: 'metal' }),
    rbox(0.05, 0.3, 0.16, 0.02, -1.275, 2.1, 4.11, dark),
    rbox(0.05, 0.3, 0.16, 0.02, 1.275, 2.1, 4.11, dark),

    // wiper arms at the base of the cab screen
    box(0.6, 0.014, 0.016, -0.44, 2.05, 4.405, dark, { mat: 'matte', rot: [0, 0, 0.15] }),
    box(0.6, 0.014, 0.016, 0.44, 2.05, 4.405, dark, { mat: 'matte', rot: [0, 0, -0.15] }),
    // fold-out door steps on both sides
    box(0.18, 0.03, 1.08, -1.28, 0.33, 2.75, '#4a5054', { mat: 'metal' }),
    box(0.18, 0.03, 1.08, 1.28, 0.33, 2.75, '#4a5054', { mat: 'metal' }),
    box(0.18, 0.03, 1.08, -1.28, 0.33, -1.5, '#4a5054', { mat: 'metal' }),
    box(0.18, 0.03, 1.08, 1.28, 0.33, -1.5, '#4a5054', { mat: 'metal' }),
    // front coupler with its draw bar
    box(0.28, 0.16, 0.2, 0, 0.5, 4.47, C.graphite, { mat: 'metal' }),
    cyl(0.05, 0.05, 0.12, 0, 0.5, 4.6, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // roof-mounted equipment boxes
    box(0.7, 0.08, 0.6, 0, 3.0, 2.6, paintDeep, { mat: 'gloss' }),
    box(0.7, 0.08, 0.5, 0, 3.0, -3.0, paintDeep, { mat: 'gloss' }),
  ],
})
