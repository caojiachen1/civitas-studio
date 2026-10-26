import { C, cyl, defineModel, ico, prism, sphere, torus } from '../../kit'

const CERAMIC = '#b7a795'
const CERAMIC_DARK = '#9e8d7a'
const PAMPAS = '#d7c5a7'
const PAMPAS_LIGHT = '#e5d8c2'
const TWIG = '#9c876b'
const DRY_LEAF = '#b09a76'

const LEAF_POINTS: [number, number][] = [
  [0, 0],
  [0.011, 0.022],
  [0.006, 0.05],
  [0, 0.066],
  [-0.006, 0.05],
  [-0.011, 0.022],
]

const leaf = (x: number, y: number, z: number, rot: [number, number, number], color: string) =>
  prism(LEAF_POINTS, 0.003, x, y, z, color, { mat: 'foliage', side: 'double', rot })

const plumeData = [
  { a: 0.35, lean: 0.11, top: 1.15 },
  { a: 1.55, lean: 0.14, top: 1.09 },
  { a: 2.6, lean: 0.1, top: 1.12 },
  { a: 3.9, lean: 0.13, top: 1.06 },
  { a: 5.1, lean: 0.12, top: 1.11 },
]

const plumes = plumeData.flatMap(({ a, lean, top }) => {
  const dx = lean * Math.cos(a)
  const dz = lean * Math.sin(a)
  const baseY = 0.74
  const plumeH = 0.2
  const dy = top - plumeH - baseY
  const len = Math.sqrt(lean * lean + dy * dy)
  const t = Math.atan2(lean, dy)
  return [
    cyl(0.0032, 0.0046, len, dx / 2, baseY + dy / 2, dz / 2, TWIG, { mat: 'wood', rot: [0, -a, -t] }, 8),
    cyl(0.005, 0.034, plumeH, dx, top - 0.1, dz, PAMPAS, { mat: 'matte', rot: [0, -a, -t] }, 14),
    cyl(0.003, 0.018, 0.1, dx, top - 0.06, dz, PAMPAS_LIGHT, { mat: 'matte', rot: [0, -a, -t] }, 14),
  ]
})

const twigData = [
  { a: 0.9, lean: 0.17, top: 1.03 },
  { a: 2.1, lean: 0.16, top: 0.99 },
  { a: 4.4, lean: 0.18, top: 1.05 },
]

const twigs = twigData.flatMap(({ a, lean, top }) => {
  const dx = lean * Math.cos(a)
  const dz = lean * Math.sin(a)
  const baseY = 0.74
  const dy = top - baseY
  const len = Math.sqrt(lean * lean + dy * dy)
  const t = Math.atan2(lean, dy)
  return [
    cyl(0.0022, 0.0036, len, dx / 2, baseY + dy / 2, dz / 2, TWIG, { mat: 'wood', rot: [0, -a, -t] }, 8),
    leaf(dx, top - 0.04, dz, [0.45, -a, 0.85], DRY_LEAF),
    leaf(dx * 0.94, top - 0.1, dz * 0.94, [0.55, -a + 0.7, 1.35], '#a08a68'),
  ]
})

const pebbles = [
  { r: 0.026, x: 0.195, z: 0.03, c: C.stone },
  { r: 0.022, x: -0.19, z: 0.09, c: '#8c8a80' },
  { r: 0.024, x: 0.12, z: -0.185, c: C.concrete },
  { r: 0.02, x: -0.14, z: -0.185, c: '#7d7c74' },
  { r: 0.019, x: 0.205, z: -0.09, c: '#9d9c94' },
  { r: 0.021, x: -0.06, z: 0.2, c: C.stone },
  { r: 0.018, x: 0.02, z: -0.2, c: C.concrete },
].map(({ r, x, z, c }) => ico(r, x, r * 0.92, z, c, { mat: 'stone' }, 0))

export default defineModel({
  id: 'floor-vase',
  name: '落地花瓶',
  category: 'living',
  tags: ['floor vase', 'vase', '落地花瓶', '花瓶', 'pampas', '蒲苇', 'dried flowers', 'decor'],
  footprint: [0.45, 0.45],
  height: 1.15,
  placement: 'indoor',
  parts: [
    // ceramic body: foot, belly, shoulder, neck and rolled lip
    cyl(0.145, 0.155, 0.04, 0, 0.02, 0, CERAMIC, { mat: 'ceramic' }, 32),
    cyl(0.2, 0.14, 0.34, 0, 0.21, 0, CERAMIC, { mat: 'ceramic' }, 32),
    cyl(0.14, 0.2, 0.22, 0, 0.49, 0, CERAMIC, { mat: 'ceramic' }, 32),
    cyl(0.095, 0.14, 0.14, 0, 0.67, 0, CERAMIC, { mat: 'ceramic' }, 32),
    cyl(0.105, 0.098, 0.035, 0, 0.7575, 0, CERAMIC, { mat: 'ceramic' }, 32),
    torus(0.101, 0.008, 0, 0.772, 0, CERAMIC_DARK, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),
    cyl(0.094, 0.094, 0.018, 0, 0.763, 0, '#6d6154', { mat: 'matte' }, 24),

    // incised bands and a rope collar around the neck
    torus(0.193, 0.005, 0, 0.33, 0, CERAMIC_DARK, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.183, 0.005, 0, 0.45, 0, CERAMIC_DARK, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.104, 0.009, 0, 0.718, 0, '#c4b394', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.108, 0.108, 0.028, 0, 0.718, 0, '#c4b394', { mat: 'matte' }, 24),

    // dried pampas plumes and bare twigs
    ...plumes,
    ...twigs,

    // pebble fill at the mouth and a scattered pebble ring on the floor
    sphere(0.016, -0.03, 0.766, 0.03, C.stone, { mat: 'stone' }, 12),
    sphere(0.015, 0.035, 0.764, 0.02, '#8c8a80', { mat: 'stone' }, 12),
    sphere(0.014, 0.01, 0.766, -0.045, C.concrete, { mat: 'stone' }, 12),
    sphere(0.013, -0.05, 0.765, -0.02, '#7d7c74', { mat: 'stone' }, 12),
    ...pebbles,
  ],
})
