import { C, box, cyl, defineModel, rbox, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const paint = '#e6e1d3'
const paintDeep = '#c9c2b0'
const drumSkin = '#ddd7c8'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const steel = C.steel

// drum axis lies along Z and rises 12 deg toward the cab; +Y of each cylinder points forward
const TILT = 0.209
const DRUM_Y = 2.79
const DRUM_Z = 1.6

// tyre tread touches y = 0
const wheel = (x: number, z: number): Part[] => {
  const out = Math.sign(x) * 0.163
  const out2: Part[] = [
    cyl(0.5, 0.5, 0.3, x, 0.5, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.275, 0.275, 0.312, x, 0.5, z, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.07, 0.07, 0.326, x, 0.5, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
  ]
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    out2.push(
      box(0.022, 0.2, 0.045, x + out, 0.5 + Math.cos(a) * 0.13, z + Math.sin(a) * 0.13, dark, {
        mat: 'metal',
        rot: [a, 0, 0],
      }),
    )
  }
  return out2
}

// thin band around the conical drum at fraction t of its 4.05 m length
const band = (t: number, r: number): Part =>
  torus(r, 0.028, 0, DRUM_Y - Math.sin(TILT) * 4.05 * t, DRUM_Z - Math.cos(TILT) * 4.05 * t, steel, {
    mat: 'metal',
    rot: [-TILT, 0, 0],
  }, 24)

export default defineModel({
  id: 'cement-mixer',
  name: '混凝土搅拌车',
  category: 'vehicles',
  tags: ['truck', 'mixer', 'concrete', 'cement', '搅拌车', '混凝土', '工程'],
  footprint: [2.5, 8.4],
  height: 3.6,
  placement: 'on-road',
  parts: [
    // 6 wheels: front axle plus tandem rear axles
    ...wheel(-1.07, 2.75),
    ...wheel(1.07, 2.75),
    ...wheel(-1.07, -1.45),
    ...wheel(1.07, -1.45),
    ...wheel(-1.07, -2.65),
    ...wheel(1.07, -2.65),

    // chassis, fuel tank, rear frame
    box(1.94, 0.26, 7.6, 0, 0.75, -0.15, dark, { mat: 'metal' }),
    cyl(0.23, 0.23, 1.0, -0.95, 0.58, 0.5, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    box(0.34, 0.34, 0.05, -0.95, 0.58, 1.0, dark, { mat: 'metal' }),
    box(1.8, 0.2, 0.3, 0, 0.72, -3.95, dark, { mat: 'metal' }),

    // cab: shell, sill, roof, raked screen, pillars
    rbox(2.4, 1.85, 2.2, 0.16, 0, 1.72, 3.0, paint, { mat: 'gloss' }),
    rbox(2.42, 0.4, 2.1, 0.06, 0, 0.94, 3.0, paintDeep, { mat: 'gloss' }),
    rbox(2.36, 0.12, 2.1, 0.05, 0, 2.69, 2.98, paint, { mat: 'gloss' }),
    box(2.28, 1.0, 0.05, 0, 2.06, 4.085, dark),
    box(2.2, 0.9, 0.05, 0, 2.07, 4.1, C.glass, { mat: 'glass', rot: [-0.1, 0, 0] }),
    rbox(0.08, 0.94, 0.1, 0.02, -1.11, 2.06, 4.06, paint, { mat: 'gloss', rot: [-0.1, 0, 0] }),
    rbox(0.08, 0.94, 0.1, 0.02, 1.11, 2.06, 4.06, paint, { mat: 'gloss', rot: [-0.1, 0, 0] }),
    rbox(2.2, 0.08, 0.16, 0.03, 0, 2.58, 4.04, dark),

    // side glass, door seams, handles, steps and mirrors
    box(0.03, 0.64, 1.0, -1.205, 2.04, 3.05, dark),
    box(0.03, 0.64, 1.0, 1.205, 2.04, 3.05, dark),
    box(0.02, 0.56, 0.9, -1.222, 2.04, 3.05, C.glass, { mat: 'glass' }),
    box(0.02, 0.56, 0.9, 1.222, 2.04, 3.05, C.glass, { mat: 'glass' }),
    box(0.02, 1.12, 0.025, -1.215, 1.3, 2.15, dark),
    box(0.02, 1.12, 0.025, 1.215, 1.3, 2.15, dark),
    box(0.03, 0.05, 0.18, -1.222, 1.55, 2.72, steel, { mat: 'metal' }),
    box(0.03, 0.05, 0.18, 1.222, 1.55, 2.72, steel, { mat: 'metal' }),
    box(0.3, 0.06, 0.55, -1.05, 0.5, 2.9, dark, { mat: 'metal' }),
    box(0.3, 0.06, 0.55, 1.05, 0.5, 2.9, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, -1.21, 2.42, 3.72, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, 1.21, 2.42, 3.72, dark, { mat: 'metal' }),
    rbox(0.04, 0.34, 0.19, 0.02, -1.22, 2.25, 3.76, dark),
    rbox(0.04, 0.34, 0.19, 0.02, 1.22, 2.25, 3.76, dark),

    // nose: grille, bumper, lamps, indicators, plate, wipers
    rbox(1.2, 0.36, 0.05, 0.03, 0, 1.35, 4.11, dark, { mat: 'metal' }),
    rbox(2.46, 0.34, 0.18, 0.06, 0, 0.62, 4.1, bumper, { mat: 'metal' }),
    rbox(0.4, 0.16, 0.05, 0.02, -0.86, 1.0, 4.115, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.4, 0.16, 0.05, 0.02, 0.86, 1.0, 4.115, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, -1.08, 0.72, 4.12, '#d0672f', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, 1.08, 0.72, 4.12, '#d0672f', { mat: 'emissive' }),
    box(0.46, 0.13, 0.02, 0, 0.67, 4.19, C.white),
    box(0.6, 0.014, 0.018, -0.4, 1.82, 4.15, dark, { mat: 'matte', rot: [-0.1, 0, 0.16] }),
    box(0.6, 0.014, 0.018, 0.4, 1.82, 4.15, dark, { mat: 'matte', rot: [-0.1, 0, -0.16] }),

    // cab roof beacon
    box(0.5, 0.06, 0.24, 0, 2.78, 2.9, dark),
    box(0.46, 0.1, 0.2, 0, 2.86, 2.9, '#e8a72c', { mat: 'emissive' }),

    // support cradle / ring frame under the drum
    box(1.2, 0.5, 0.55, 0, 1.2, 1.2, dark, { mat: 'metal' }),
    rbox(0.16, 0.8, 0.5, 0.03, -0.52, 1.55, 1.15, C.graphite, { mat: 'metal', rot: [0, 0, -0.25] }),
    rbox(0.16, 0.8, 0.5, 0.03, 0.52, 1.55, 1.15, C.graphite, { mat: 'metal', rot: [0, 0, 0.25] }),
    box(1.7, 0.28, 2.2, 0, 0.96, -0.9, dark, { mat: 'metal' }),
    cyl(0.18, 0.18, 0.26, -0.72, 1.0, -1.5, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    cyl(0.18, 0.18, 0.26, 0.72, 1.0, -1.5, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    box(0.3, 0.4, 0.4, -0.72, 0.95, -1.5, dark, { mat: 'metal' }),
    box(0.3, 0.4, 0.4, 0.72, 0.95, -1.5, dark, { mat: 'metal' }),

    // three conical drum sections, front end 0.75 m up to 1.2 m at the middle
    cyl(0.75, 0.98, 1.2, 0, 2.595, 1.013, drumSkin, { mat: 'gloss', rot: [Math.PI / 2 - TILT, 0, 0] }, 28),
    cyl(0.98, 1.2, 1.5, 0, 2.315, -0.307, drumSkin, { mat: 'gloss', rot: [Math.PI / 2 - TILT, 0, 0] }, 28),
    cyl(1.2, 1.1, 1.35, 0, 2.018, -1.701, drumSkin, { mat: 'gloss', rot: [Math.PI / 2 - TILT, 0, 0] }, 28),

    // spiral bands / wear rings
    band(0.18, 0.91),
    band(0.36, 1.04),
    band(0.54, 1.145),
    band(0.72, 1.204),
    band(0.9, 1.15),

    // rear drum head, opening ring and dark mouth
    torus(1.02, 0.07, 0, 1.876, -2.36, C.graphite, { mat: 'metal', rot: [-TILT, 0, 0] }, 24),
    cyl(0.95, 0.95, 0.05, 0, 1.868, -2.39, dark, { mat: 'metal', rot: [Math.PI / 2 - TILT, 0, 0] }, 24),

    // loading hopper, throat and supports
    cyl(0.68, 0.4, 0.48, 0, 3.0, -2.55, steel, { mat: 'metal' }, 20),
    cyl(0.58, 0.58, 0.03, 0, 3.235, -2.55, '#26292b', { mat: 'matte' }, 20),
    box(0.5, 0.55, 0.35, -0.5, 2.65, -2.45, dark, { mat: 'metal' }),
    box(0.5, 0.55, 0.35, 0.5, 2.65, -2.45, dark, { mat: 'metal' }),
    rbox(0.5, 0.1, 1.0, 0.03, 0, 2.4, -2.5, dark, { mat: 'metal' }),

    // discharge chute: pivot, pan, kerbs, hanger
    cyl(0.08, 0.08, 0.9, 0, 1.6, -2.42, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    rbox(0.85, 0.12, 1.5, 0.04, 0, 1.18, -3.0, steel, { mat: 'metal', rot: [-0.55, 0, 0] }),
    rbox(0.06, 0.18, 1.46, 0.02, -0.4, 1.22, -3.0, C.graphite, { mat: 'metal', rot: [-0.55, 0, 0] }),
    rbox(0.06, 0.18, 1.46, 0.02, 0.4, 1.22, -3.0, C.graphite, { mat: 'metal', rot: [-0.55, 0, 0] }),
    box(0.07, 0.6, 0.07, -0.3, 1.55, -2.5, dark, { mat: 'metal' }),
    box(0.07, 0.6, 0.07, 0.3, 1.55, -2.5, dark, { mat: 'metal' }),
    box(0.1, 0.1, 0.3, 0, 1.27, -2.55, dark, { mat: 'metal' }),

    // rear access ladder on the hopper
    box(0.05, 0.85, 0.05, -0.38, 3.02, -2.98, C.steel, { mat: 'metal' }),
    box(0.05, 0.85, 0.05, 0.38, 3.02, -2.98, C.steel, { mat: 'metal' }),
    ...Array.from({ length: 6 }, (_, i) =>
      box(0.8, 0.03, 0.03, 0, 2.68 + i * 0.14, -2.98, C.steel, { mat: 'metal' }),
    ),
    box(0.05, 0.05, 0.35, -0.38, 3.44, -2.82, C.steel, { mat: 'metal' }),
    box(0.05, 0.05, 0.35, 0.38, 3.44, -2.82, C.steel, { mat: 'metal' }),
    box(0.04, 0.04, 0.4, -0.38, 2.6, -2.78, C.steel, { mat: 'metal' }),
    box(0.04, 0.04, 0.4, 0.38, 2.6, -2.78, C.steel, { mat: 'metal' }),

    // rear bumper, lamps, plate, mud flaps and reflective strips
    rbox(2.3, 0.26, 0.18, 0.06, 0, 0.6, -4.11, bumper, { mat: 'metal' }),
    box(0.44, 0.13, 0.02, 0, 0.63, -4.19, C.white),
    rbox(0.18, 0.44, 0.05, 0.02, -0.95, 0.95, -4.08, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.44, 0.05, 0.02, 0.95, 0.95, -4.08, C.red, { mat: 'emissive' }),
    box(0.32, 0.5, 0.04, -1.05, 0.42, -3.3, dark),
    box(0.32, 0.5, 0.04, 1.05, 0.42, -3.3, dark),
    box(0.02, 0.16, 0.6, -1.22, 1.15, 0.6, '#e8e5d8', { mat: 'gloss' }),
    box(0.02, 0.16, 0.6, 1.22, 1.15, 0.6, '#e8e5d8', { mat: 'gloss' }),
  ],
})
