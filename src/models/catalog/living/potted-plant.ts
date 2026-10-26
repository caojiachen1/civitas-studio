import type { Part } from '../../../editor/types'
import { C, cyl, defineModel, ico, prism, torus } from '../../kit'

const leafPoints = (len: number, wid: number): [number, number][] => {
  const pts: [number, number][] = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const half = (wid / 2) * Math.sin(Math.PI * Math.pow(t, 0.82)) * (1 - 0.12 * t)
    pts.push([half, t * len])
  }
  for (let i = 9; i >= 1; i--) {
    const t = i / 10
    const half = (wid / 2) * Math.sin(Math.PI * Math.pow(t, 0.82)) * (1 - 0.12 * t)
    pts.push([-half, t * len])
  }
  return pts
}

const leaf = (
  len: number,
  wid: number,
  x: number,
  y: number,
  z: number,
  rot: [number, number, number],
  color: string,
): Part => prism(leafPoints(len, wid), 0.008, x, y, z, color, { mat: 'foliage', side: 'double', rot })

const stems = [
  { a: 0.35, r: 0.10, tip: 1.18 },
  { a: 1.45, r: 0.09, tip: 1.12 },
  { a: 2.55, r: 0.11, tip: 1.02 },
  { a: 3.65, r: 0.10, tip: 1.10 },
  { a: 4.80, r: 0.12, tip: 0.96 },
  { a: 5.70, r: 0.08, tip: 0.90 },
  { a: 0.0, r: 0.015, tip: 1.12 },
].flatMap(({ a, r, tip }) => {
  const dx = r * Math.cos(a)
  const dz = r * Math.sin(a)
  const dy = tip - 0.375
  const len = Math.sqrt(r * r + dy * dy)
  const t = Math.atan2(r, dy)
  return [
    cyl(0.008, 0.011, len, dx / 2, 0.375 + dy / 2, dz / 2, C.leafDeep, {
      mat: 'foliage',
      rot: [0, -a, -t],
    }, 8),
    leaf(0.23, 0.15, dx, tip, dz, [0.12, -a, -0.7], C.leaf),
    leaf(0.18, 0.12, dx * 0.65, 0.375 + dy * 0.65, dz * 0.65, [0.2, -(a + 0.5), -1.0], C.leafLight),
  ]
})

export default defineModel({
  id: 'potted-plant',
  name: '室内盆栽',
  category: 'living',
  tags: ['plant', 'potted', '盆栽', '绿植', 'foliage', 'indoor'],
  footprint: [0.55, 0.55],
  height: 1.35,
  placement: 'indoor',
  parts: [
    // saucer and ceramic planter with a rolled rim
    cyl(0.25, 0.25, 0.014, 0, 0.007, 0, C.terracotta, { mat: 'ceramic' }, 32),
    cyl(0.215, 0.175, 0.34, 0, 0.185, 0, C.clay, { mat: 'ceramic' }, 32),
    torus(0.222, 0.014, 0, 0.358, 0, C.clay, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),

    // soil and moss mounds
    cyl(0.205, 0.205, 0.018, 0, 0.364, 0, C.soil, { mat: 'matte' }, 24),
    ico(0.05, -0.09, 0.38, 0.06, '#4C6D45', { mat: 'foliage' }, 1),
    ico(0.045, 0.10, 0.38, 0.05, C.leaf, { mat: 'foliage' }, 1),
    ico(0.04, 0.02, 0.38, -0.11, C.leafLight, { mat: 'foliage' }, 1),

    // stems and leaves
    ...stems,
    leaf(0.16, 0.11, 0.05, 0.44, 0.04, [0.2, -2.0, -1.2], C.leafDeep),
    leaf(0.14, 0.10, -0.04, 0.45, -0.055, [0.15, -5.0, -1.25], C.leaf),
    leaf(0.2, 0.13, 0.02, 0.72, -0.02, [0.35, -1.1, -0.9], C.leafLight),
    leaf(0.17, 0.115, -0.05, 0.62, 0.05, [0.28, -3.4, -1.05], C.leaf),

    // pebbles, moss and a drainage saucer lip
    ...[
      [0.12, 0.375, 0.08, 0.022],
      [-0.13, 0.375, 0.09, 0.018],
      [0.08, 0.375, -0.12, 0.016],
      [-0.06, 0.375, -0.15, 0.02],
      [0.16, 0.375, -0.03, 0.014],
    ].map(([x, y, z, r], i) =>
      ico(r, x, y, z, i % 2 === 0 ? '#9b978c' : '#87837a', { mat: 'stone' }, 1),
    ),
    torus(0.238, 0.008, 0, 0.018, 0, '#b98d71', { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 30),
  ],
})
