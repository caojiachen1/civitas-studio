import { C, box, cyl, defineModel, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

const paint = '#e7e3d6'
const paintDeep = '#cfcabb'
const teal = '#5f8b8e'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const brushDark = '#3c3d36'

// axle along X: tyre tread touches y = 0
const wheel = (x: number, z: number): Part[] => {
  const out = Math.sign(x) * 0.148
  const out2: Part[] = [
    cyl(0.45, 0.45, 0.3, x, 0.45, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.245, 0.245, 0.312, x, 0.45, z, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.065, 0.065, 0.326, x, 0.45, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
  ]
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    out2.push(
      box(0.022, 0.18, 0.04, x + out, 0.45 + Math.cos(a) * 0.115, z + Math.sin(a) * 0.115, dark, {
        mat: 'metal',
        rot: [a, 0, 0],
      }),
    )
  }
  return out2
}

const bristle = (i: number): Part => {
  const a = (i / 12) * Math.PI * 2
  return cyl(
    0.009,
    0.009,
    0.28,
    0.35 + Math.cos(a) * 0.31,
    0.14,
    -0.1 + Math.sin(a) * 0.31,
    brushDark,
    { mat: 'matte', rot: [0.42 * Math.sin(a), 0, -0.42 * Math.cos(a)] },
    6,
  )
}

export default defineModel({
  id: 'street-sweeper',
  name: '道路清扫车',
  category: 'vehicles',
  tags: ['sweeper', 'street', 'municipal', '清扫车', '市政', '环卫', '扫刷'],
  footprint: [2.1, 5.8],
  height: 2.6,
  placement: 'on-road',
  parts: [
    // two axles
    ...wheel(-0.87, 1.9),
    ...wheel(0.87, 1.9),
    ...wheel(-0.87, -1.55),
    ...wheel(0.87, -1.55),

    // chassis rails, rear step and side bins
    box(1.5, 0.22, 5.1, 0, 0.6, -0.05, dark, { mat: 'metal' }),
    box(0.6, 0.5, 0.6, -0.7, 0.5, -2.15, dark, { mat: 'metal' }),
    box(0.6, 0.5, 0.6, 0.7, 0.5, -2.15, dark, { mat: 'metal' }),
    cyl(0.17, 0.17, 0.7, -0.85, 0.52, 0.4, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),

    // cab shell, lower band, roof cap
    rbox(1.98, 1.45, 1.6, 0.14, 0, 1.5, 2.0, paint, { mat: 'gloss' }),
    rbox(1.99, 0.42, 1.5, 0.05, 0, 0.9, 2.02, paintDeep, { mat: 'gloss' }),
    rbox(1.94, 0.1, 1.5, 0.05, 0, 2.27, 1.98, paint, { mat: 'gloss' }),

    // windscreen, reveal and A-pillars
    box(1.86, 0.84, 0.05, 0, 1.87, 2.787, dark),
    box(1.78, 0.74, 0.05, 0, 1.88, 2.8, C.glass, { mat: 'glass', rot: [-0.14, 0, 0] }),
    rbox(0.07, 0.78, 0.1, 0.02, -0.93, 1.87, 2.76, paint, { mat: 'gloss', rot: [-0.14, 0, 0] }),
    rbox(0.07, 0.78, 0.1, 0.02, 0.93, 1.87, 2.76, paint, { mat: 'gloss', rot: [-0.14, 0, 0] }),

    // side glass, door seams, handles, steps and mirrors
    box(0.03, 0.58, 0.82, -0.995, 1.85, 2.06, dark),
    box(0.03, 0.58, 0.82, 0.995, 1.85, 2.06, dark),
    box(0.02, 0.5, 0.72, -1.006, 1.85, 2.06, C.glass, { mat: 'glass' }),
    box(0.02, 0.5, 0.72, 1.006, 1.85, 2.06, C.glass, { mat: 'glass' }),
    box(0.02, 0.95, 0.025, -0.996, 1.24, 1.28, dark),
    box(0.02, 0.95, 0.025, 0.996, 1.24, 1.28, dark),
    box(0.03, 0.045, 0.16, -1.0, 1.52, 1.72, C.steel, { mat: 'metal' }),
    box(0.03, 0.045, 0.16, 1.0, 1.52, 1.72, C.steel, { mat: 'metal' }),
    box(0.26, 0.06, 0.5, -0.88, 0.5, 1.9, dark, { mat: 'metal' }),
    box(0.26, 0.06, 0.5, 0.88, 0.5, 1.9, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, -0.99, 1.95, 2.55, dark, { mat: 'metal' }),
    box(0.1, 0.04, 0.04, 0.99, 1.95, 2.55, dark, { mat: 'metal' }),
    rbox(0.04, 0.28, 0.17, 0.02, -1.03, 1.82, 2.58, dark),
    rbox(0.04, 0.28, 0.17, 0.02, 1.03, 1.82, 2.58, dark),

    // nose: bumper, grille, lamps, indicators, plate and wipers
    rbox(2.06, 0.26, 0.18, 0.06, 0, 0.58, 2.80, bumper, { mat: 'metal' }),
    rbox(0.9, 0.24, 0.05, 0.03, 0, 1.18, 2.785, dark, { mat: 'metal' }),
    rbox(0.34, 0.14, 0.05, 0.02, -0.68, 1.0, 2.79, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.34, 0.14, 0.05, 0.02, 0.68, 1.0, 2.79, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, -0.94, 0.74, 2.8, '#d0672f', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, 0.94, 0.74, 2.8, '#d0672f', { mat: 'emissive' }),
    box(0.4, 0.12, 0.02, 0, 0.66, 2.888, C.white),
    box(0.56, 0.014, 0.018, -0.36, 1.7, 2.84, dark, { mat: 'matte', rot: [-0.14, 0, 0.16] }),
    box(0.56, 0.014, 0.018, 0.36, 1.7, 2.84, dark, { mat: 'matte', rot: [-0.14, 0, -0.16] }),

    // roof beacon
    box(0.36, 0.06, 0.22, 0, 2.35, 2.08, dark),
    box(0.32, 0.1, 0.18, 0, 2.43, 2.08, '#e8a72c', { mat: 'emissive' }),

    // water / refuse tank: rounded shell, roof cap, side stripes and panels
    rbox(2.0, 1.5, 3.8, 0.28, 0, 1.42, -0.75, paint, { mat: 'gloss' }),
    rbox(1.9, 0.12, 3.6, 0.06, 0, 2.2, -0.75, paintDeep, { mat: 'gloss' }),
    box(0.02, 0.2, 3.6, -1.006, 1.18, -0.75, teal, { mat: 'gloss' }),
    box(0.02, 0.2, 3.6, 1.006, 1.18, -0.75, teal, { mat: 'gloss' }),
    box(0.02, 0.05, 3.7, -1.007, 1.72, -0.75, paintDeep, { mat: 'gloss' }),
    box(0.02, 0.05, 3.7, 1.007, 1.72, -0.75, paintDeep, { mat: 'gloss' }),
    box(0.02, 0.7, 1.1, -1.008, 1.5, 0.0, paintDeep, { mat: 'gloss' }),
    box(0.02, 0.7, 1.1, 1.008, 1.5, 0.0, paintDeep, { mat: 'gloss' }),
    box(0.03, 0.05, 0.18, -1.015, 1.63, 0.35, C.steel, { mat: 'metal' }),
    box(0.03, 0.05, 0.18, 1.015, 1.63, 0.35, C.steel, { mat: 'metal' }),

    // rear door, hinges, latches and tail lamps
    rbox(1.7, 1.28, 0.06, 0.03, 0, 1.4, -2.68, paintDeep, { mat: 'gloss' }),
    box(0.03, 1.34, 0.02, 0, 1.4, -2.72, dark),
    box(0.06, 0.14, 0.04, -0.72, 2.0, -2.72, dark, { mat: 'metal' }),
    box(0.06, 0.14, 0.04, 0.72, 2.0, -2.72, dark, { mat: 'metal' }),
    box(0.05, 0.18, 0.04, -0.12, 1.35, -2.72, C.steel, { mat: 'metal' }),
    box(0.05, 0.18, 0.04, 0.12, 1.35, -2.72, C.steel, { mat: 'metal' }),
    rbox(0.16, 0.42, 0.05, 0.02, -0.9, 0.95, -2.71, C.red, { mat: 'emissive' }),
    rbox(0.16, 0.42, 0.05, 0.02, 0.9, 0.95, -2.71, C.red, { mat: 'emissive' }),

    // rear arrow board, amber modules, bumper, step and plate
    box(1.12, 0.38, 0.06, 0, 2.4, -2.71, dark),
    box(0.18, 0.13, 0.02, -0.3, 2.31, -2.75, '#e8a72c', { mat: 'emissive' }),
    box(0.18, 0.13, 0.02, -0.02, 2.31, -2.75, '#e8a72c', { mat: 'emissive' }),
    box(0.18, 0.13, 0.02, 0.26, 2.31, -2.75, '#e8a72c', { mat: 'emissive' }),
    box(0.18, 0.13, 0.02, -0.16, 2.5, -2.75, '#e8a72c', { mat: 'emissive' }),
    box(0.18, 0.13, 0.02, 0.12, 2.5, -2.75, '#e8a72c', { mat: 'emissive' }),
    rbox(2.06, 0.24, 0.16, 0.06, 0, 0.52, -2.79, bumper, { mat: 'metal' }),
    box(1.3, 0.1, 0.28, 0, 0.44, -2.73, dark, { mat: 'metal' }),
    box(0.4, 0.12, 0.02, 0, 0.54, -2.882, C.white),

    // rotating brush: disc, shaft, bracket and 12 bristle tufts
    cyl(0.35, 0.35, 0.06, 0.35, 0.26, -0.1, dark, { mat: 'metal' }, 24),
    cyl(0.06, 0.06, 0.38, 0.35, 0.48, -0.1, C.steel, { mat: 'metal' }, 10),
    box(0.22, 0.12, 0.22, 0.35, 0.66, -0.1, dark, { mat: 'metal' }),
    ...Array.from({ length: 12 }, (_, i) => bristle(i)),

    // right side suction mouth, hose and flap
    rbox(0.12, 0.34, 0.7, 0.04, 0.97, 0.55, -0.35, dark, { mat: 'metal' }),
    box(0.02, 0.26, 0.56, 1.031, 0.55, -0.35, '#1e2224'),
    cyl(0.07, 0.07, 0.4, 0.98, 0.9, -0.3, dark, { mat: 'matte', rot: [0.3, 0, 0] }, 12),
    cyl(0.07, 0.07, 0.3, 0.98, 1.07, -0.14, dark, { mat: 'matte', rot: [0.9, 0, 0] }, 12),
    box(0.08, 0.34, 0.45, 0.98, 0.34, -0.35, dark, { mat: 'matte' }),
  ],
})
