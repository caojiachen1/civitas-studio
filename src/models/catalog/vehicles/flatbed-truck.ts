import { C, box, cyl, defineModel, rbox, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const blue = '#4a6b87'
const blueDeep = '#3a536b'
const grey = '#6c7a80'
const tire = '#24272b'
const dark = '#2f3438'
const bumper = '#4b5054'
const steel = C.steel

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

const plank = (x: number, color: string): Part => box(0.29, 0.025, 5.25, x, 1.265, -1.05, color, { mat: 'wood' })
const hook = (x: number, z: number): Part =>
  torus(0.038, 0.01, x, 1.2, z, steel, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 12)

export default defineModel({
  id: 'flatbed-truck',
  name: '平板货车',
  category: 'vehicles',
  tags: ['truck', 'flatbed', 'cargo', '平板车', '货运', '木箱', '钢缆'],
  footprint: [2.4, 8.0],
  height: 2.6,
  placement: 'on-road',
  parts: [
    // 6 wheels: front axle, tandem rear
    ...wheel(-1.02, 2.7),
    ...wheel(1.02, 2.7),
    ...wheel(-1.02, -1.5),
    ...wheel(1.02, -1.5),
    ...wheel(-1.02, -2.7),
    ...wheel(1.02, -2.7),

    // chassis, fuel tank, rear crossmember
    box(1.9, 0.24, 7.4, 0, 0.72, -0.05, dark, { mat: 'metal' }),
    cyl(0.22, 0.22, 1.0, -0.98, 0.58, 0.6, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    box(1.8, 0.18, 0.2, 0, 0.66, -3.82, dark, { mat: 'metal' }),

    // cab: blue shell, grey sill, roof cap
    rbox(2.3, 1.73, 1.9, 0.16, 0, 1.64, 2.9, blue, { mat: 'gloss' }),
    rbox(2.31, 0.38, 1.82, 0.05, 0, 0.94, 2.9, grey, { mat: 'gloss' }),
    rbox(2.26, 0.1, 1.8, 0.05, 0, 2.55, 2.88, blueDeep, { mat: 'gloss' }),

    // windscreen, reveal, A-pillars
    box(2.16, 0.94, 0.05, 0, 2.05, 3.835, dark),
    box(2.08, 0.84, 0.05, 0, 2.06, 3.85, C.glass, { mat: 'glass', rot: [-0.1, 0, 0] }),
    rbox(0.08, 0.88, 0.1, 0.02, -1.08, 2.05, 3.81, blue, { mat: 'gloss', rot: [-0.1, 0, 0] }),
    rbox(0.08, 0.88, 0.1, 0.02, 1.08, 2.05, 3.81, blue, { mat: 'gloss', rot: [-0.1, 0, 0] }),

    // side glass, door seams, handles, steps, mirrors
    box(0.03, 0.62, 0.95, -1.155, 2.02, 2.95, dark),
    box(0.03, 0.62, 0.95, 1.155, 2.02, 2.95, dark),
    box(0.02, 0.54, 0.85, -1.172, 2.02, 2.95, C.glass, { mat: 'glass' }),
    box(0.02, 0.54, 0.85, 1.172, 2.02, 2.95, C.glass, { mat: 'glass' }),
    box(0.02, 1.04, 0.025, -1.163, 1.28, 2.1, dark),
    box(0.02, 1.04, 0.025, 1.163, 1.28, 2.1, dark),
    box(0.03, 0.05, 0.18, -1.17, 1.52, 2.62, steel, { mat: 'metal' }),
    box(0.03, 0.05, 0.18, 1.17, 1.52, 2.62, steel, { mat: 'metal' }),
    box(0.28, 0.06, 0.52, -1.02, 0.5, 2.8, dark, { mat: 'metal' }),
    box(0.28, 0.06, 0.52, 1.02, 0.5, 2.8, dark, { mat: 'metal' }),
    box(0.08, 0.04, 0.04, -1.15, 2.38, 3.6, dark, { mat: 'metal' }),
    box(0.08, 0.04, 0.04, 1.15, 2.38, 3.6, dark, { mat: 'metal' }),
    rbox(0.04, 0.32, 0.18, 0.02, -1.17, 2.22, 3.64, dark),
    rbox(0.04, 0.32, 0.18, 0.02, 1.17, 2.22, 3.64, dark),

    // nose: grille, bumper, lamps, indicators, plate, wipers
    rbox(1.2, 0.34, 0.05, 0.03, 0, 1.35, 3.885, dark, { mat: 'metal' }),
    rbox(2.34, 0.32, 0.16, 0.06, 0, 0.62, 3.9, bumper, { mat: 'metal' }),
    rbox(0.38, 0.15, 0.05, 0.02, -0.82, 0.99, 3.885, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.38, 0.15, 0.05, 0.02, 0.82, 0.99, 3.885, '#ffe9c2', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, -1.04, 0.73, 3.89, '#d0672f', { mat: 'emissive' }),
    rbox(0.1, 0.09, 0.04, 0.01, 1.04, 0.73, 3.89, '#d0672f', { mat: 'emissive' }),
    box(0.44, 0.13, 0.02, 0, 0.67, 3.99, C.white),
    box(0.58, 0.014, 0.018, -0.38, 1.83, 3.91, dark, { mat: 'matte', rot: [-0.1, 0, 0.16] }),
    box(0.58, 0.014, 0.018, 0.38, 1.83, 3.91, dark, { mat: 'matte', rot: [-0.1, 0, -0.16] }),

    // flatbed frame and seven timber planks
    box(2.3, 0.14, 5.45, 0, 1.1, -1.05, dark, { mat: 'metal' }),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => plank(-0.9 + i * 0.3, i % 2 === 0 ? C.oak : C.birch)),
    box(0.16, 0.1, 5.45, -1.08, 1.17, -1.05, dark, { mat: 'metal' }),
    box(0.16, 0.1, 5.45, 1.08, 1.17, -1.05, dark, { mat: 'metal' }),

    // side boards and stakes
    rbox(0.07, 0.3, 5.3, 0.02, -1.12, 1.39, -1.05, grey, { mat: 'gloss' }),
    rbox(0.07, 0.3, 5.3, 0.02, 1.12, 1.39, -1.05, grey, { mat: 'gloss' }),
    ...[1.35, 0.0, -1.35, -2.7].flatMap((z) => [
      box(0.07, 0.58, 0.07, -1.14, 1.27, z, dark, { mat: 'metal' }),
      box(0.07, 0.58, 0.07, 1.14, 1.27, z, dark, { mat: 'metal' }),
    ]),
    box(0.07, 0.1, 5.3, -1.14, 1.6, -1.05, dark, { mat: 'metal' }),
    box(0.07, 0.1, 5.3, 1.14, 1.6, -1.05, dark, { mat: 'metal' }),

    // six tie-down hooks, three per side
    ...[1.0, -0.95, -2.85].flatMap((z) => [hook(-1.15, z), hook(1.15, z)]),

    // headboard behind the cab
    rbox(2.28, 0.96, 0.12, 0.03, 0, 1.73, 1.79, blue, { mat: 'gloss' }),
    box(2.1, 0.06, 0.02, 0, 2.1, 1.86, blueDeep, { mat: 'gloss' }),

    // cargo: two timber crates with rims and braces
    rbox(1.0, 0.8, 1.05, 0.03, -0.5, 1.67, 0.0, C.oak, { mat: 'wood' }),
    box(1.02, 0.06, 1.07, -0.5, 2.04, 0.0, C.walnut, { mat: 'wood' }),
    box(0.9, 0.05, 0.05, -0.5, 1.7, 0.54, C.walnut, { mat: 'wood' }),
    box(0.05, 0.74, 0.98, -1.0, 1.68, 0.0, C.walnut, { mat: 'wood' }),
    rbox(0.9, 0.72, 0.9, 0.03, 0.35, 1.63, -1.35, C.birch, { mat: 'wood' }),
    box(0.92, 0.05, 0.92, 0.35, 1.96, -1.35, C.walnut, { mat: 'wood' }),
    box(0.04, 0.66, 0.84, 0.8, 1.63, -1.35, C.walnut, { mat: 'wood' }),

    // coiled steel cable lying on its side
    cyl(0.55, 0.55, 0.6, 0.05, 1.82, -2.85, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 24),
    torus(0.56, 0.018, 0.05, 1.82, -2.85, C.graphite, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 24),
    torus(0.42, 0.016, 0.05, 1.82, -2.85, C.graphite, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 20),
    cyl(0.16, 0.16, 0.62, 0.05, 1.82, -2.85, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),

    // ratchet straps over the crates
    box(2.28, 0.02, 0.07, 0, 2.08, 0.0, dark, { mat: 'fabric' }),
    box(0.03, 0.55, 0.07, -1.14, 1.81, 0.0, dark, { mat: 'fabric' }),
    box(0.03, 0.55, 0.07, 1.14, 1.81, 0.0, dark, { mat: 'fabric' }),
    box(0.98, 0.02, 0.06, 0.35, 1.99, -1.35, dark, { mat: 'fabric' }),
    box(0.03, 0.72, 0.06, -0.08, 1.63, -1.35, dark, { mat: 'fabric' }),
    box(0.03, 0.72, 0.06, 0.78, 1.63, -1.35, dark, { mat: 'fabric' }),

    // rear: tail lamps, bumper, plate, mud flaps
    rbox(0.18, 0.36, 0.05, 0.02, -1.0, 1.02, -3.78, C.red, { mat: 'emissive' }),
    rbox(0.18, 0.36, 0.05, 0.02, 1.0, 1.02, -3.78, C.red, { mat: 'emissive' }),
    rbox(2.34, 0.26, 0.16, 0.06, 0, 0.58, -3.92, bumper, { mat: 'metal' }),
    box(0.44, 0.13, 0.02, 0, 0.62, -3.99, C.white),
    box(0.3, 0.5, 0.04, -1.04, 0.4, -3.38, dark),
    box(0.3, 0.5, 0.04, 1.04, 0.4, -3.38, dark),
  ],
})
