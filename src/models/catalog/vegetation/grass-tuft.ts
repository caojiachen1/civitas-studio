import { cone, cyl, defineModel, prism } from '../../kit'

const TONES = ['#52713f', '#5f7e4a', '#6c8b55', '#7b9a5f', '#8aa66c']
const PALE = '#a8bd80'
const DRY = '#94835b'
const DRY_DARK = '#7d6c49'

// Fifteen tapered blades fan out from the crown. Blade length, lean and radius
// are derived from the index so the tuft is irregular but fully deterministic.
const blades = Array.from({ length: 15 }, (_, i) => {
  const a = i * 2.39996 + 0.4
  const lean = 0.12 + (i % 4) * 0.1
  const h = 0.19 + ((i * 5) % 7) * 0.023
  const rad = 0.018 + (i % 5) * 0.035
  const w = 0.021 + ((i * 3) % 4) * 0.006
  const points: [number, number][] = [
    [-w, 0],
    [w, 0],
    [w * 0.66, h * 0.8],
    [0, h],
    [-w * 0.66, h * 0.8],
  ]
  const rot: [number, number, number] = [lean * Math.sin(a), -(a + Math.PI / 2), -lean * Math.cos(a)]
  return prism(points, 0.012, Math.cos(a) * rad, 0.004, Math.sin(a) * rad, TONES[i % TONES.length], {
    mat: 'foliage',
    rot,
  })
})

// Pale, sun-bleached blade tips catch the light above the main mass.
const tips = [
  [0.13, 0.16, 0.3],
  [-0.14, 0.09, 0.27],
  [0.04, -0.15, 0.315],
].map(([x, z, y], i) =>
  cone(0.021, 0.07, x, y, z, i % 2 === 0 ? PALE : '#9db678', { mat: 'foliage', rot: [0.22, i * 2, -0.18] }, 6),
)

// Dried outer leaves stay low and splay out over the soil.
const dried = [
  [0.21, 0.1, 0.13, 0.9],
  [-0.2, -0.12, 0.11, 1.4],
  [-0.05, 0.23, 0.15, 2.1],
  [0.12, -0.22, 0.12, 2.7],
].map(([x, z, h, a], i) =>
  cone(0.028, h, x, h / 2, z, i % 2 === 0 ? DRY : DRY_DARK, { mat: 'foliage', rot: [0, a, 0.7] }, 5),
)

// A few seed heads rise above the blades on wiry stems.
const stalks = [
  [0.05, 0.04, 0.26],
  [-0.08, -0.06, 0.23],
  [0.02, 0.1, 0.21],
].flatMap(([x, z, h], i) => [
  cyl(0.006, 0.009, h, x, h / 2 + 0.004, z, i % 2 === 0 ? '#7f8f5e' : '#8f9d68', { mat: 'foliage', rot: [0.04, 0, i % 2 === 0 ? 0.05 : -0.06] }, 5),
  cone(0.026, 0.08, x + 0.03, h + 0.01, z + 0.02, i % 2 === 0 ? '#b5b184' : '#a7a477', { mat: 'foliage', rot: [0.1, i, 0.1] }, 6),
])

export default defineModel({
  id: 'grass-tuft',
  name: '草丛',
  category: 'vegetation',
  tags: ['grass', '草丛', '地被', '野草', '花园'],
  footprint: [0.6, 0.6],
  height: 0.35,
  placement: 'outdoor',
  noCollide: true,
  shadow: false,
  parts: [...blades, ...tips, ...dried, ...stalks],
})
