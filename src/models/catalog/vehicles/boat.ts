import { C, box, cyl, defineModel, prism, rbox, torus } from '../../kit'

const hull = '#eae6dc'
const deckWood = '#c19a6b'
const dark = '#3a3e42'
const steel = C.steel

// plan outline, bow toward +Z
const hullOutline: [number, number][] = [
  [0, 2.08],
  [0.42, 1.6],
  [0.7, 0.72],
  [0.8, -0.35],
  [0.76, -1.45],
  [0.63, -2.04],
  [-0.63, -2.04],
  [-0.76, -1.45],
  [-0.8, -0.35],
  [-0.7, 0.72],
  [-0.42, 1.6],
]

const inset = (sx: number, sz: number): [number, number][] =>
  hullOutline.map(([x, z]) => [x * sx, z * sz])

export default defineModel({
  id: 'boat',
  name: '休闲小艇',
  category: 'vehicles',
  tags: ['boat', 'motorboat', '小艇', '游艇', '水上', '休闲'],
  footprint: [1.7, 4.2],
  height: 1.3,
  placement: 'on-water',
  parts: [
    // hull with pointed bow, laid flat by rotating the extrusion onto the XZ plane
    prism(hullOutline, 0.68, 0, 0.34, 0, hull, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }),
    prism(inset(1.012, 1.004), 0.1, 0, 0.36, 0, C.navy, {
      mat: 'gloss',
      rot: [Math.PI / 2, 0, 0],
    }),
    prism(inset(0.93, 0.985), 0.06, 0, 0.71, 0, deckWood, {
      mat: 'wood',
      rot: [Math.PI / 2, 0, 0],
    }),
    prism(inset(1.006, 1.003), 0.05, 0, 0.665, 0, steel, {
      mat: 'metal',
      rot: [Math.PI / 2, 0, 0],
    }),

    // raised bow deck with a wood plank and a bow cleat
    prism(
      [
        [0, 2.06],
        [0.4, 1.58],
        [0.63, 0.98],
        [0.68, 0.8],
        [-0.68, 0.8],
        [-0.63, 0.98],
        [-0.4, 1.58],
      ],
      0.1,
      0,
      0.79,
      0,
      hull,
      { mat: 'gloss', rot: [Math.PI / 2, 0, 0] },
    ),
    prism(
      [
        [0, 1.98],
        [0.36, 1.55],
        [0.56, 1.0],
        [0.6, 0.86],
        [-0.6, 0.86],
        [-0.56, 1.0],
        [-0.36, 1.55],
      ],
      0.025,
      0,
      0.8525,
      0,
      deckWood,
      { mat: 'wood', rot: [Math.PI / 2, 0, 0] },
    ),
    rbox(0.14, 0.04, 0.05, 0.02, 0, 0.865, 1.75, steel, { mat: 'metal' }),

    // transom cap and swim platform
    box(1.24, 0.05, 0.06, 0, 0.715, -2.0, hull, { mat: 'gloss' }),
    box(1.16, 0.05, 0.18, 0, 0.7, -2.01, deckWood, { mat: 'wood' }),

    // windscreen with base and chrome capping rail
    box(1.26, 0.08, 0.12, 0, 0.77, 0.56, hull, { mat: 'gloss' }),
    rbox(1.24, 0.38, 0.05, 0.02, 0, 1.0, 0.54, C.glass, { mat: 'glass', rot: [-0.26, 0, 0] }),
    box(1.28, 0.035, 0.05, 0, 1.175, 0.505, steel, { mat: 'metal' }),

    // helm console, dash top, wheel, grab rail
    rbox(0.92, 0.42, 0.62, 0.06, 0, 0.94, 0.15, hull, { mat: 'gloss' }),
    box(0.86, 0.05, 0.52, 0, 1.125, 0.14, dark),
    torus(0.115, 0.017, 0.24, 1.02, -0.17, dark, { mat: 'leather', rot: [-0.55, 0, 0] }, 18),
    box(0.05, 0.05, 0.46, -0.47, 1.02, 0.15, steel, { mat: 'metal' }),

    // two bucket seats
    rbox(0.44, 0.16, 0.44, 0.05, -0.32, 0.82, -0.55, C.linen, { mat: 'leather' }),
    rbox(0.44, 0.16, 0.44, 0.05, 0.32, 0.82, -0.55, C.linen, { mat: 'leather' }),
    rbox(0.44, 0.44, 0.14, 0.05, -0.32, 1.0, -0.77, C.linen, { mat: 'leather', rot: [0.12, 0, 0] }),
    rbox(0.44, 0.44, 0.14, 0.05, 0.32, 1.0, -0.77, C.linen, { mat: 'leather', rot: [0.12, 0, 0] }),

    // aft bench
    rbox(1.16, 0.14, 0.42, 0.05, 0, 0.82, -1.5, C.linen, { mat: 'leather' }),
    rbox(1.16, 0.38, 0.12, 0.05, 0, 0.98, -1.7, C.linen, { mat: 'leather', rot: [0.1, 0, 0] }),

    // outboard motor: cowl, shaft, propeller
    rbox(0.34, 0.36, 0.3, 0.06, 0, 1.1, -1.95, '#e6e2d8', { mat: 'gloss' }),
    box(0.1, 0.78, 0.12, 0, 0.55, -1.99, dark),
    box(0.3, 0.035, 0.035, 0, 0.24, -2.06, steel, { mat: 'metal' }),
    box(0.035, 0.22, 0.035, 0, 0.24, -2.06, steel, { mat: 'metal' }),

    // cockpit railing: four stanchions and two rails
    cyl(0.014, 0.014, 0.42, -0.74, 0.95, -1.35, steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.42, 0.74, 0.95, -1.35, steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.42, -0.74, 0.95, 0.05, steel, { mat: 'metal' }, 8),
    cyl(0.014, 0.014, 0.42, 0.74, 0.95, 0.05, steel, { mat: 'metal' }, 8),
    cyl(0.016, 0.016, 1.42, -0.74, 1.155, -0.65, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.016, 0.016, 1.42, 0.74, 1.155, -0.65, steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // stern cleats
    rbox(0.16, 0.05, 0.06, 0.02, -0.58, 0.77, -1.85, steel, { mat: 'metal' }),
    rbox(0.16, 0.05, 0.06, 0.02, 0.58, 0.77, -1.85, steel, { mat: 'metal' }),
  ],
})
