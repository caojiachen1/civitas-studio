import { C, box, cyl, defineModel, prism, rbox, sphere, torus } from '../../kit'

const WALL = '#b28c60'
const TRIM = '#e3d8c4'
const ROOF = '#6b5947'
const PLATFORM = '#8d6a45'
const DARK = '#3a3129'

const pads: [number, number][] = [
  [-0.52, -0.42],
  [0.52, -0.42],
  [-0.52, 0.42],
  [0.52, 0.42],
]

const doorArch: [number, number][] = [
  [-0.5, 0.11],
  [-0.5, 0.82],
  [0, 1.06],
  [0.5, 0.82],
  [0.5, 0.11],
  [0.27, 0.11],
  [0.27, 0.44],
  [0.19, 0.6],
  [0, 0.67],
  [-0.19, 0.6],
  [-0.27, 0.44],
  [-0.27, 0.11],
]

const gableEnd: [number, number][] = [
  [-0.5, 0.11],
  [-0.5, 0.82],
  [0, 1.06],
  [0.5, 0.82],
  [0.5, 0.11],
]

const battens: [number, number][] = [
  [-0.505, 0.38],
  [-0.505, 0.62],
  [0.505, 0.38],
  [0.505, 0.62],
]

export default defineModel({
  id: 'dog-house',
  name: '狗屋',
  category: 'outdoor',
  tags: ['dog house', 'kennel', 'pet', '狗屋', '狗窝', '宠物屋'],
  footprint: [1.2, 1.0],
  height: 1.1,
  placement: 'outdoor',
  parts: [
    // timber deck on four stone pads
    ...pads.map(([x, z]) => cyl(0.07, 0.08, 0.03, x, 0.015, z, C.concrete, { mat: 'stone' }, 12)),
    box(1.2, 0.08, 1.0, 0, 0.07, 0, PLATFORM, { mat: 'wood' }),
    box(1.2, 0.04, 0.04, 0, 0.1, -0.48, PLATFORM, { mat: 'wood' }),
    box(1.2, 0.04, 0.04, 0, 0.1, 0.48, PLATFORM, { mat: 'wood' }),
    // front gable with its arched doorway, and the solid back gable
    prism(doorArch, 0.05, 0, 0, 0.33, WALL, { mat: 'wood', side: 'double' }),
    prism(gableEnd, 0.05, 0, 0, -0.33, WALL, { mat: 'wood', side: 'double' }),
    box(0.05, 0.71, 0.66, -0.475, 0.465, 0, WALL, { mat: 'wood' }),
    box(0.05, 0.71, 0.66, 0.475, 0.465, 0, WALL, { mat: 'wood' }),
    // corner trim boards and horizontal battens
    box(0.06, 0.74, 0.06, -0.48, 0.47, -0.34, TRIM, { mat: 'wood' }),
    box(0.06, 0.74, 0.06, 0.48, 0.47, -0.34, TRIM, { mat: 'wood' }),
    box(0.06, 0.74, 0.06, -0.48, 0.47, 0.34, TRIM, { mat: 'wood' }),
    box(0.06, 0.74, 0.06, 0.48, 0.47, 0.34, TRIM, { mat: 'wood' }),
    ...battens.map(([x, y]) => box(0.02, 0.035, 0.6, x, y, 0, TRIM, { mat: 'wood' })),
    // shingled gable roof with overhanging eaves
    box(1.14, 0.035, 0.58, 0, 0.944, -0.235, ROOF, { mat: 'matte', rot: [-0.5058, 0, 0] }),
    box(1.14, 0.035, 0.58, 0, 0.944, 0.235, ROOF, { mat: 'matte', rot: [0.5058, 0, 0] }),
    box(1.16, 0.045, 0.12, 0, 1.0775, 0, '#5a4a3a', { mat: 'matte' }),
    box(1.16, 0.05, 0.04, 0, 0.79, -0.48, TRIM, { mat: 'wood' }),
    box(1.16, 0.05, 0.04, 0, 0.79, 0.48, TRIM, { mat: 'wood' }),
    // arched door surround
    box(0.05, 0.34, 0.05, -0.295, 0.28, 0.36, TRIM, { mat: 'wood' }),
    box(0.05, 0.34, 0.05, 0.295, 0.28, 0.36, TRIM, { mat: 'wood' }),
    box(0.07, 0.09, 0.05, 0, 0.69, 0.355, TRIM, { mat: 'wood' }),
    // shadowed interior with a small dog bed
    box(0.8, 0.6, 0.02, 0, 0.41, -0.25, DARK, { mat: 'matte' }),
    rbox(0.5, 0.08, 0.32, 0.03, 0, 0.15, -0.05, C.blush, { mat: 'fabric' }),
    box(0.34, 0.03, 0.2, 0.06, 0.19, 0.0, C.cream, { mat: 'fabric' }),
    // food bowl with a bone on top
    cyl(0.065, 0.045, 0.055, 0.36, 0.1375, 0.42, C.steel, { mat: 'metal' }, 14),
    torus(0.062, 0.008, 0.36, 0.165, 0.42, C.steel, { mat: 'metal' }, 16),
    cyl(0.05, 0.05, 0.015, 0.36, 0.166, 0.42, '#8a6a4a', { mat: 'matte' }, 12),
    cyl(0.012, 0.012, 0.09, 0.36, 0.19, 0.42, TRIM, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 8),
    sphere(0.018, 0.315, 0.19, 0.42, TRIM, { mat: 'matte' }, 8),
    sphere(0.018, 0.405, 0.19, 0.42, TRIM, { mat: 'matte' }, 8),
    // bone-shaped name plaque above the door
    box(0.26, 0.05, 0.02, 0, 0.93, 0.36, TRIM, { mat: 'wood' }),
    sphere(0.032, -0.14, 0.95, 0.36, TRIM, { mat: 'wood' }, 10),
    sphere(0.032, -0.14, 0.91, 0.36, TRIM, { mat: 'wood' }, 10),
    sphere(0.032, 0.14, 0.95, 0.36, TRIM, { mat: 'wood' }, 10),
    sphere(0.032, 0.14, 0.91, 0.36, TRIM, { mat: 'wood' }, 10),
  ],
})
