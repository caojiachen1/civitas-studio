import { C, box, cyl, defineModel, ico } from '../../kit'

const BARK_WHITE = '#e8e3d5'
const BARK_SHADE = '#d5cfbf'
const MARK = '#413e35'
const AIRY_A = '#9cb877'
const AIRY_B = '#aac385'
const AIRY_C = '#8da96b'
const AIRY_D = '#b4c98f'

// Dark lenticel marks wrapped deterministically around the white trunk.
const marks = Array.from({ length: 9 }, (_, i) => {
  const a = i * 2.39996 + 0.4
  const y = 0.45 + i * 0.27
  const r = y < 2.0 ? 0.152 : 0.114
  return box(
    0.13,
    0.04,
    0.06,
    Math.cos(a) * r,
    y,
    Math.sin(a) * r,
    MARK,
    { rot: [0, -(a + Math.PI / 2), 0] },
  )
})

// Shallow white roots flare over the grass.
const roots = [0.4, 2.4, 4.6].map((a, i) =>
  cyl(0.035, 0.09, 0.4, Math.cos(a) * 0.14, 0.12, Math.sin(a) * 0.14, i % 2 === 0 ? BARK_WHITE : BARK_SHADE, {
    mat: 'wood',
    rot: [0, -a, 1.05],
  }, 7),
)

// Green catkins dangle below the light crown.
const CATKINS: [number, number, number, number][] = [
  [0.62, 3.82, 0.3, 0.5],
  [-0.56, 3.9, 0.38, 1.3],
  [0.28, 3.96, -0.6, 2.2],
  [-0.42, 3.78, -0.5, 0.9],
  [0.72, 4.06, -0.12, 1.8],
]
const catkins = CATKINS.flatMap(([x, y, z, tilt], i) => [
  cyl(0.005, 0.006, 0.06, x, y + 0.09, z, '#7f8b5a', { mat: 'wood' }, 5),
  cyl(0.013, 0.007, 0.17, x, y, z, i % 2 === 0 ? '#a5b174' : '#98a566', {
    mat: 'foliage',
    rot: [0.18 * Math.sin(tilt), 0, 0.18 * Math.cos(tilt)],
  }, 6),
])

// Fine twigs break the crown silhouette and carry the catkins outward.
const twigs = [
  cyl(0.01, 0.022, 0.7, 1.02, 4.45, 0.42, BARK_WHITE, { mat: 'wood', rot: [0.2, 0, -0.55] }, 6),
  cyl(0.009, 0.02, 0.64, -0.98, 4.52, -0.3, BARK_SHADE, { mat: 'wood', rot: [-0.15, 0, 0.58] }, 6),
  cyl(0.008, 0.018, 0.55, 0.34, 5.42, -0.5, BARK_WHITE, { mat: 'wood', rot: [-0.45, 0, -0.1] }, 6),
]

// Fallen birch leaves collect in a pale ring at the foot.
const FALLEN: [number, number, string, number][] = [
  [0.46, 0.62, '#c9b874', 0.4],
  [-0.58, 0.4, '#bfae6c', 1.4],
  [0.12, -0.68, '#d2c184', 2.3],
  [-0.3, -0.5, '#b5a564', 0.9],
  [0.76, 0.06, '#c9b874', 1.9],
]
const fallenLeaves = FALLEN.map(([x, z, color, a], i) =>
  cyl(0.06, 0.042, 0.007, x, 0.008, z, color, { mat: 'foliage', rot: [0, a + i * 0.4, 0] }, 5),
)

export default defineModel({
  id: 'tree-birch',
  name: '白桦',
  category: 'vegetation',
  tags: ['tree', 'birch', '白桦', '乔木', '浅色树干'],
  footprint: [2.6, 2.6],
  height: 5.8,
  placement: 'outdoor',
  parts: [
    ...roots,
    cyl(0.14, 0.19, 2.0, 0, 1.0, 0, BARK_WHITE, { mat: 'wood' }, 10),
    cyl(0.09, 0.13, 1.75, 0.03, 2.78, 0.01, BARK_SHADE, { mat: 'wood', rot: [0, 0, -0.05] }, 10),
    ...marks,
    // one broad scar and a low dark band
    box(0.09, 0.1, 0.035, 0.12, 1.42, 0.06, '#34322c', { rot: [0, -0.9, 0.1] }),
    box(0.03, 0.1, 0.09, -0.16, 0.82, 0, '#34322c', { rot: [0.2, 0, 0] }),
    // slender, upswept limbs rooted inside the trunk and reaching the crown
    cyl(0.045, 0.085, 1.02, -0.31, 3.475, 0.12, BARK_SHADE, { mat: 'wood', rot: [0.2, 0, 0.58] }, 8),
    cyl(0.04, 0.08, 1.0, 0.3, 3.45, -0.09, BARK_WHITE, { mat: 'wood', rot: [-0.18, 0, -0.55] }, 8),
    cyl(0.03, 0.06, 0.88, 0.075, 3.575, 0.28, BARK_SHADE, { mat: 'wood', rot: [0.5, 0, -0.17] }, 8),
    cyl(0.02, 0.04, 0.85, 0.03, 3.925, 0.02, BARK_WHITE, { mat: 'wood', rot: [0.06, 0, 0.07] }, 6),
    // airy, broken light-green crown
    ico(0.5, 0, 4.68, 0.02, AIRY_A, { mat: 'foliage' }, 1),
    ico(0.44, 0.55, 4.3, 0.2, AIRY_B, { mat: 'foliage' }, 1),
    ico(0.43, -0.52, 4.32, -0.18, AIRY_C, { mat: 'foliage' }, 1),
    ico(0.38, 0.12, 4.22, 0.62, AIRY_A, { mat: 'foliage' }, 0),
    ico(0.36, -0.18, 4.18, -0.6, AIRY_B, { mat: 'foliage' }, 0),
    ico(0.3, 0.7, 3.98, 0.1, C.leafLight, { mat: 'foliage' }, 0),
    ico(0.28, -0.68, 4.02, 0.05, AIRY_D, { mat: 'foliage' }, 0),
    ico(0.34, 0.72, 4.72, -0.25, AIRY_D, { mat: 'foliage' }, 0),
    ico(0.33, -0.68, 4.7, 0.32, AIRY_C, { mat: 'foliage' }, 0),
    ico(0.42, 0, 5.3, 0, AIRY_D, { mat: 'foliage' }, 1),
    ico(0.3, 0.38, 5.02, 0.42, AIRY_A, { mat: 'foliage' }, 0),
    ico(0.29, -0.4, 5.1, -0.3, AIRY_C, { mat: 'foliage' }, 0),
    ico(0.28, 0.45, 4.4, -0.55, AIRY_D, { mat: 'foliage' }, 0),
    ico(0.3, -0.45, 4.3, 0.58, AIRY_C, { mat: 'foliage' }, 0),
    ico(0.26, 0.16, 3.95, 0.5, AIRY_A, { mat: 'foliage' }, 0),
    ico(0.28, 0.25, 5.5, 0.08, AIRY_D, { mat: 'foliage' }, 0),
    ...twigs,
    ...catkins,
    ...fallenLeaves,
  ],
})
