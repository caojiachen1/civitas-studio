import { C, box, cyl, defineModel, prism, rbox } from '../../kit'
import type { Part } from '../../../editor/types'

const yellow = '#d99a2b'
const yellowDeep = '#b9781f'
const dark = '#2f3438'
const steel = C.steel

// track shoe block: bottom face sits on y = 0
const shoe = (x: number, z: number): Part =>
  box(0.6, 0.06, 0.36, x, 0.03, z, dark, { mat: 'metal' })

// cylinder between two points in a YZ plane, axis along Y before rotation
const ram = (x: number, y1: number, z1: number, y2: number, z2: number, r: number, len: number, at = 0.45): Part => {
  const dy = y2 - y1
  const dz = z2 - z1
  return cyl(r, r, len, x, y1 + dy * at, z1 + dz * at, steel, {
    mat: 'metal',
    rot: [Math.atan2(dz, dy), 0, 0],
  }, 12)
}

const bucketProfile: [number, number][] = [
  [-0.42, 0.38],
  [0.3, 0.38],
  [0.38, -0.28],
  [-0.32, -0.32],
]

// whole machine, including the arm, is centred on the origin
const DZ = -0.686

const layout: Part[] = [
    // left and right track assemblies: body, rounded ends, shoes
    rbox(0.6, 0.58, 4.2, 0.2, -1.0, 0.35, 0.1, dark, { mat: 'metal' }),
    rbox(0.6, 0.58, 4.2, 0.2, 1.0, 0.35, 0.1, dark, { mat: 'metal' }),
    cyl(0.34, 0.34, 0.6, -1.0, 0.34, 2.08, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.34, 0.34, 0.6, 1.0, 0.34, 2.08, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.34, 0.34, 0.6, -1.0, 0.34, -1.88, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),
    cyl(0.34, 0.34, 0.6, 1.0, 0.34, -1.88, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 18),

    // track shoes, eight per side
    ...Array.from({ length: 8 }, (_, i) => shoe(-1.0, -1.75 + i * 0.5)),
    ...Array.from({ length: 8 }, (_, i) => shoe(1.0, -1.75 + i * 0.5)),

    // road wheels, four per side
    ...[-1.2, -0.4, 0.4, 1.2].flatMap((z) => [
      cyl(0.14, 0.14, 0.6, -1.0, 0.18, z, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
      cyl(0.14, 0.14, 0.6, 1.0, 0.18, z, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    ]),

    // undercarriage frame and slew ring
    box(1.5, 0.48, 2.6, 0, 0.7, 0.1, dark, { mat: 'metal' }),
    box(1.9, 0.2, 0.7, 0, 0.8, 1.45, dark, { mat: 'metal' }),
    cyl(0.88, 0.92, 0.22, 0, 1.0, 0.1, C.graphite, { mat: 'metal' }, 24),

    // rotating house, engine hood, exhaust, hydraulic tank
    rbox(2.1, 0.92, 3.0, 0.08, 0, 1.56, -0.4, yellow, { mat: 'gloss' }),
    rbox(2.0, 0.95, 0.95, 0.1, 0, 1.62, -2.42, yellowDeep, { mat: 'gloss' }),
    box(1.94, 0.1, 0.06, 0, 2.02, -2.885, yellowDeep, { mat: 'gloss' }),
    rbox(1.3, 0.26, 1.2, 0.05, 0.15, 2.12, -1.0, yellowDeep, { mat: 'gloss' }),
    cyl(0.07, 0.07, 0.5, 0.7, 2.3, -1.35, dark, { mat: 'metal' }, 10),
    rbox(0.45, 0.45, 0.9, 0.04, 0.78, 1.85, 0.35, yellowDeep, { mat: 'gloss' }),
    box(0.9, 0.05, 0.9, -0.3, 2.05, -2.4, dark, { mat: 'metal' }),

    // cab: base, glazed volume, roof, pillars, door and beacon
    rbox(0.98, 0.12, 1.18, 0.03, -0.55, 1.99, 0.4, yellow, { mat: 'gloss' }),
    rbox(0.94, 0.84, 1.14, 0.05, -0.55, 2.47, 0.4, C.glass, { mat: 'glass' }),
    rbox(1.0, 0.09, 1.2, 0.04, -0.55, 2.92, 0.4, yellow, { mat: 'gloss' }),
    box(0.82, 0.64, 0.03, -0.55, 2.47, 0.98, C.glass, { mat: 'glass' }),
    box(0.03, 0.6, 0.88, -1.03, 2.47, 0.4, C.glass, { mat: 'glass' }),
    box(0.06, 0.84, 0.06, -1.0, 2.47, 0.96, dark),
    box(0.06, 0.84, 0.06, -0.1, 2.47, 0.96, dark),
    box(0.06, 0.84, 0.06, -1.0, 2.47, -0.16, dark),
    box(0.06, 0.84, 0.06, -0.1, 2.47, -0.16, dark),
    box(0.02, 0.82, 0.025, -1.04, 2.45, 0.05, dark),
    box(0.03, 0.05, 0.15, -1.04, 2.32, 0.62, steel, { mat: 'metal' }),
    box(0.2, 0.03, 0.18, -0.55, 2.965, 0.3, dark),
    box(0.16, 0.04, 0.14, -0.55, 2.995, 0.3, '#d0672f', { mat: 'emissive' }),

    // boom pedestal, side plates and pivot pin
    box(0.66, 0.42, 0.55, 0.5, 1.9, 1.17, dark, { mat: 'metal' }),
    rbox(0.07, 0.5, 0.62, 0.02, 0.26, 1.98, 1.2, yellow, { mat: 'gloss' }),
    rbox(0.07, 0.5, 0.62, 0.02, 0.74, 1.98, 1.2, yellow, { mat: 'gloss' }),
    cyl(0.09, 0.09, 0.7, 0.5, 2.05, 1.25, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),

    // boom from A(0.5,2.05,1.25) to B(0.5,2.72,2.95)
    box(0.36, 0.42, Math.hypot(0.67, 1.7), 0.5, 2.385, 2.1, yellow, {
      mat: 'gloss',
      rot: [Math.atan2(-0.67, 1.7), 0, 0],
    }),
    rbox(0.3, 0.1, 1.5, 0.03, 0.5, 2.6, 2.2, yellowDeep, {
      mat: 'gloss',
      rot: [Math.atan2(-0.67, 1.7), 0, 0],
    }),
    cyl(0.09, 0.09, 0.62, 0.5, 2.72, 2.95, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),

    // stick from B to the bucket hinge C(0.5,0.95,3.95)
    box(0.28, 0.32, Math.hypot(1.77, 1.0), 0.5, 1.835, 3.45, yellowDeep, {
      mat: 'gloss',
      rot: [Math.atan2(1.77, 1.0), 0, 0],
    }),
    cyl(0.08, 0.08, 0.55, 0.5, 0.95, 3.95, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),

    // boom lift rams: brackets, pins, barrels and rods
    ...[-0.28, 0.28].flatMap((dx) => [
      box(0.16, 0.3, 0.18, 0.5 + dx, 1.5, 1.08, dark, { mat: 'metal' }),
      cyl(0.045, 0.045, 0.2, 0.5 + dx, 1.55, 1.15, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
      ram(0.5 + dx, 1.55, 1.15, 2.3, 2.3, 0.065, 1.0, 0.42),
      ram(0.5 + dx, 1.55, 1.15, 2.3, 2.3, 0.038, 0.65, 0.72),
      cyl(0.045, 0.045, 0.2, 0.5 + dx, 2.3, 2.3, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    ]),

    // stick ram along the top of the boom
    box(0.22, 0.12, 0.18, 0.5, 2.66, 1.95, dark, { mat: 'metal' }),
    cyl(0.045, 0.045, 0.22, 0.5, 2.66, 1.95, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    ram(0.5, 2.66, 1.95, 2.45, 3.2, 0.06, 0.85, 0.4),
    ram(0.5, 2.66, 1.95, 2.45, 3.2, 0.036, 0.55, 0.74),
    cyl(0.045, 0.045, 0.22, 0.5, 2.45, 3.2, steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),

    // bucket: trapezoid profile, hinge bracket, teeth and wear strips
    prism(bucketProfile, 0.95, 0.5, 0.6, 3.8, yellowDeep, { mat: 'gloss', rot: [0, -Math.PI / 2, 0] }),
    box(0.3, 0.22, 0.24, 0.5, 0.92, 3.92, dark, { mat: 'metal' }),
    box(0.06, 0.05, 0.9, 0.5, 0.3, 3.8, dark, { mat: 'metal' }),
    ...[0, 1, 2, 3, 4].map((i) =>
      box(0.06, 0.08, 0.16, 0.14 + i * 0.18, 0.85, 4.2, steel, {
        mat: 'metal',
        rot: [0.28, 0, 0],
      }),
    ),

    // handrail on the house roof and two work lamps
    cyl(0.02, 0.02, 0.5, -0.9, 2.27, -1.9, steel, { mat: 'metal' }, 8),
    cyl(0.02, 0.02, 0.5, -0.9, 2.27, -1.3, steel, { mat: 'metal' }, 8),
    box(0.04, 0.04, 0.64, -0.9, 2.51, -1.6, steel, { mat: 'metal' }),
    box(0.16, 0.12, 0.12, -0.15, 2.26, 1.0, '#ffe9c2', { mat: 'emissive' }),
    box(0.16, 0.12, 0.12, 0.2, 2.26, 1.0, '#ffe9c2', { mat: 'emissive' }),
    box(0.2, 0.1, 0.2, -0.15, 2.17, 0.98, dark, { mat: 'metal' }),
    box(0.2, 0.1, 0.2, 0.2, 2.17, 0.98, dark, { mat: 'metal' }),
]

const parts: Part[] = layout.map(
  (p) => ({ ...p, pos: [p.pos[0], p.pos[1], p.pos[2] + DZ] as [number, number, number] }) as Part,
)

export default defineModel({
  id: 'excavator',
  name: '履带挖掘机',
  category: 'vehicles',
  tags: ['excavator', 'digger', 'construction', '挖掘机', '履带', '工程', '土方'],
  footprint: [2.6, 7.2],
  height: 3.0,
  placement: 'outdoor',
  parts,
})
