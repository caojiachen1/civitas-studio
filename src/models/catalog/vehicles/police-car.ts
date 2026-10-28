import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#ecebe5'
const navy = C.navy
const tire = '#24272b'
const dark = '#2c3033'
const bumper = '#4b5054'
const chrome = C.steel
const blue = '#5f7fa6'

// axle along X, tread touches y = 0
const wheel = (x: number, z: number) => [
  cyl(0.35, 0.35, 0.26, x, 0.35, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.21, 0.21, 0.268, x, 0.35, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
  cyl(0.07, 0.07, 0.274, x, 0.35, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'police-car',
  name: '警车',
  category: 'vehicles',
  tags: ['police', 'patrol', 'emergency', '警车', '警务', '巡逻', '执法'],
  footprint: [1.9, 4.5],
  height: 1.6,
  placement: 'on-road',
  parts: [
    // wheels
    ...wheel(-0.8, 1.45),
    ...wheel(0.8, 1.45),
    ...wheel(-0.8, -1.45),
    ...wheel(0.8, -1.45),

    // white body, shoulder line, bonnet and side skirts
    rbox(1.84, 0.6, 4.35, 0.12, 0, 0.7, 0, paint, { mat: 'gloss' }),
    rbox(1.8, 0.3, 4.1, 0.08, 0, 1.02, -0.05, paint, { mat: 'gloss' }),
    rbox(1.76, 0.2, 1.1, 0.06, 0, 1.02, 1.55, paint, { mat: 'gloss' }),
    box(0.06, 0.12, 2.6, -0.9, 0.38, 0, dark, { mat: 'gloss' }),
    box(0.06, 0.12, 2.6, 0.9, 0.38, 0, dark, { mat: 'gloss' }),

    // glasshouse, roof panel, screens and pillars
    rbox(1.6, 0.36, 2.35, 0.12, 0, 1.17, -0.15, '#333c42', { mat: 'glass' }),
    rbox(1.66, 0.1, 2.2, 0.05, 0, 1.4, -0.2, paint, { mat: 'gloss' }),
    box(1.5, 0.5, 0.04, 0, 1.22, 0.98, '#333c42', { mat: 'glass', rot: [-0.5, 0, 0] }),
    box(1.46, 0.46, 0.04, 0, 1.2, -1.32, '#333c42', { mat: 'glass', rot: [0.48, 0, 0] }),
    rbox(0.07, 0.5, 0.1, 0.02, -0.73, 1.22, 0.95, paint, { mat: 'gloss', rot: [-0.5, 0, 0] }),
    rbox(0.07, 0.5, 0.1, 0.02, 0.73, 1.22, 0.95, paint, { mat: 'gloss', rot: [-0.5, 0, 0] }),
    rbox(0.08, 0.46, 0.14, 0.02, -0.74, 1.2, -1.28, paint, { mat: 'gloss', rot: [0.48, 0, 0] }),
    rbox(0.08, 0.46, 0.14, 0.02, 0.74, 1.2, -1.28, paint, { mat: 'gloss', rot: [0.48, 0, 0] }),
    box(0.05, 0.44, 0.08, -0.79, 1.18, -0.15, dark),
    box(0.05, 0.44, 0.08, 0.79, 1.18, -0.15, dark),

    // door seams, handles and mirror arms / heads
    box(0.02, 0.5, 0.03, -0.923, 0.75, 0.35, dark),
    box(0.02, 0.5, 0.03, 0.923, 0.75, 0.35, dark),
    box(0.025, 0.05, 0.16, -0.93, 0.88, 0.55, chrome, { mat: 'metal' }),
    box(0.025, 0.05, 0.16, 0.93, 0.88, 0.55, chrome, { mat: 'metal' }),
    box(0.08, 0.04, 0.04, -0.9, 1.05, 0.78, dark, { mat: 'metal' }),
    box(0.08, 0.04, 0.04, 0.9, 1.05, 0.78, dark, { mat: 'metal' }),
    rbox(0.03, 0.14, 0.2, 0.02, -0.935, 1.0, 0.81, navy),
    rbox(0.03, 0.14, 0.2, 0.02, 0.935, 1.0, 0.81, navy),

    // blue-white livery panels, white lettering bars and door badges
    box(0.02, 0.42, 1.0, -0.925, 0.68, 0.45, navy, { mat: 'gloss' }),
    box(0.02, 0.42, 1.0, 0.925, 0.68, 0.45, navy, { mat: 'gloss' }),
    box(0.02, 0.42, 1.0, -0.925, 0.68, -0.75, navy, { mat: 'gloss' }),
    box(0.02, 0.42, 1.0, 0.925, 0.68, -0.75, navy, { mat: 'gloss' }),
    box(0.02, 0.1, 0.6, -0.937, 0.76, 0.45, C.white, { mat: 'gloss' }),
    box(0.02, 0.1, 0.6, 0.937, 0.76, 0.45, C.white, { mat: 'gloss' }),
    cyl(0.06, 0.06, 0.012, -0.94, 0.87, 0.0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.06, 0.06, 0.012, 0.94, 0.87, 0.0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),

    // nose: grille, lamps, bumper, push bar and plate
    rbox(1.2, 0.26, 0.06, 0.03, 0, 0.86, 2.16, dark, { mat: 'metal' }),
    rbox(0.34, 0.14, 0.05, 0.02, -0.66, 0.92, 2.17, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.34, 0.14, 0.05, 0.02, 0.66, 0.92, 2.17, '#ffe9c2', { mat: 'emissive' }),
    rbox(1.88, 0.36, 0.22, 0.08, 0, 0.55, 2.13, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.6, 2.245, C.white),
    box(0.05, 0.5, 0.05, -0.35, 0.72, 2.22, dark, { mat: 'metal' }),
    box(0.05, 0.5, 0.05, 0.35, 0.72, 2.22, dark, { mat: 'metal' }),
    box(0.7, 0.04, 0.04, 0, 0.6, 2.235, dark, { mat: 'metal' }),
    box(0.7, 0.04, 0.04, 0, 0.88, 2.235, dark, { mat: 'metal' }),

    // roof light bar
    box(1.25, 0.06, 0.32, 0, 1.48, 0.1, dark),
    box(0.44, 0.09, 0.24, -0.31, 1.555, 0.1, C.red, { mat: 'emissive' }),
    box(0.44, 0.09, 0.24, 0.31, 1.555, 0.1, blue, { mat: 'emissive' }),
    box(0.12, 0.08, 0.22, 0, 1.55, 0.1, dark),
    cyl(0.012, 0.012, 0.14, 0, 1.52, -0.8, dark, { mat: 'metal' }, 8),

    // rear: boot, tail lamps, bumper and plate
    rbox(1.8, 0.2, 0.6, 0.06, 0, 1.02, -1.85, paint, { mat: 'gloss' }),
    rbox(0.36, 0.1, 0.05, 0.02, -0.62, 0.92, -2.185, C.red, { mat: 'emissive' }),
    rbox(0.36, 0.1, 0.05, 0.02, 0.62, 0.92, -2.185, C.red, { mat: 'emissive' }),
    rbox(1.88, 0.34, 0.2, 0.07, 0, 0.55, -2.13, bumper, { mat: 'metal' }),
    box(0.46, 0.13, 0.02, 0, 0.62, -2.245, C.white),
    cyl(0.045, 0.045, 0.12, -0.45, 0.38, -2.18, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.045, 0.045, 0.12, 0.45, 0.38, -2.18, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // driver's spotlight on the A-pillar base
    box(0.08, 0.06, 0.08, -0.91, 1.05, 1.0, dark, { mat: 'metal' }),
    cyl(0.045, 0.045, 0.07, -0.94, 1.06, 1.0, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.036, 0.036, 0.008, -0.94, 1.06, 1.038, '#e8e1c8', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 14),
    // wiper arms
    box(0.48, 0.012, 0.014, -0.34, 1.05, 1.09, dark, { mat: 'matte', rot: [-0.5, 0, 0.2] }),
    box(0.48, 0.012, 0.014, 0.34, 1.05, 1.09, dark, { mat: 'matte', rot: [-0.5, 0, -0.2] }),
    // mirror glass faces
    box(0.004, 0.1, 0.15, -0.952, 1.0, 0.82, C.glass, { mat: 'glass', opacity: 0.55 }),
    box(0.004, 0.1, 0.15, 0.952, 1.0, 0.82, C.glass, { mat: 'glass', opacity: 0.55 }),
    // boot-lid shut line
    box(1.5, 0.006, 0.01, 0, 1.122, -2.14, dark),
  ],
})
