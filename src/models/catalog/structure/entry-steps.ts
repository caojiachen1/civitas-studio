import { box, cyl, defineModel, rbox } from '../../kit'

const STONE = '#b3b0a7'
const STONE_LIGHT = '#cbc8bf'
const STONE_DARK = '#8f8d85'
const MORTAR = '#77756e'
const METAL = '#3a4145'
const BRASS = '#b78b4c'

const width = 2.5
const depth = 1.3
const riser = 0.215
const count = 3
const treadDepth = depth / count
const stepZ = (i: number) => depth / 2 - treadDepth * (i + 0.5)

const steps = Array.from({ length: count }, (_, i) => {
  const top = riser * (i + 1)
  const z = stepZ(i)
  return [
    box(width, top, treadDepth, 0, top / 2, z, STONE, { mat: 'stone' }),
    rbox(width + 0.02, 0.035, treadDepth + 0.03, 0.01, 0, top - 0.0175, z + 0.005, STONE_LIGHT, { mat: 'stone' }),
    box(width - 0.2, 0.012, 0.028, 0, top + 0.006, z + treadDepth / 2 - 0.014, METAL, { mat: 'metal' }),
    box(width - 0.34, 0.003, 0.018, 0, top + 0.013, z + treadDepth / 2 - 0.05, '#6d6b64', { mat: 'stone' }),
    box(width - 0.34, 0.003, 0.018, 0, top + 0.013, z + treadDepth / 2 - 0.1, '#6d6b64', { mat: 'stone' }),
  ]
}).flat()

const cheeks = [-1, 1].flatMap((side) => {
  const x = side * (width / 2 - 0.1)
  return [
    box(0.18, 0.66, depth, x, 0.33, 0, STONE_DARK, { mat: 'stone' }),
    rbox(0.2, 0.04, depth + 0.04, 0.01, x, 0.68, 0, STONE_LIGHT, { mat: 'stone' }),
    ...[0, 1, 2].map((i) =>
      box(0.012, 0.52, 0.012, x + side * 0.092, 0.28, -depth / 2 + 0.12 + i * 0.5, MORTAR, { mat: 'stone' }),
    ),
    ...[0, 1].map((i) =>
      cyl(0.035, 0.035, 0.02, x, 0.704, -0.25 + i * 0.5, BRASS, { mat: 'metal' }, 12),
    ),
  ]
})

export default defineModel({
  id: 'entry-steps',
  name: '入户台阶',
  category: 'structure',
  tags: ['steps', 'entry steps', 'porch', '台阶', '入户', '石阶', 'stoop'],
  footprint: [width, depth],
  height: 0.7,
  placement: 'any',
  parts: [
    ...steps,
    ...cheeks,
    // foundation slab and gravel strip
    box(width - 0.02, 0.08, depth - 0.02, 0, 0.04, 0, STONE_DARK, { mat: 'stone' }),
    box(width + 0.06, 0.03, 0.12, 0, 0.015, depth / 2 - 0.02, '#6f6d66', { mat: 'stone' }),
    ...Array.from({ length: 9 }, (_, i) =>
      cyl(0.018 + (i % 3) * 0.006, 0.018 + (i % 3) * 0.006, 0.02, -1.05 + i * 0.26, 0.012, depth / 2 - 0.04, '#7f7d75', { mat: 'stone' }, 8),
    ),
    // under-step shadow joints
    ...Array.from({ length: count - 1 }, (_, i) =>
      box(width - 0.04, 0.008, 0.012, 0, riser * (i + 1), stepZ(i) + treadDepth / 2 - 0.006, MORTAR, { mat: 'stone' }),
    ),
    // sawn tread joints
    ...Array.from({ length: count }, (_, i) => {
      const top = riser * (i + 1)
      const z = stepZ(i)
      return [-0.58, 0.58].map((x) =>
        box(0.006, 0.004, treadDepth * 0.64, x, top + 0.002, z, MORTAR, { mat: 'stone' }),
      )
    }).flat(),
    // weep holes in the lowest riser
    ...[-0.8, 0, 0.8].map((x) =>
      cyl(0.017, 0.017, 0.02, x, 0.085, depth / 2 - 0.01, '#5c5a54', { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 8),
    ),
    // dressed end caps to the cheek walls
    ...[-1, 1].flatMap((side) =>
      [-1, 1].map((end) =>
        box(0.2, 0.05, 0.06, side * (width / 2 - 0.1), 0.68, end * (depth / 2 - 0.01), STONE_LIGHT, { mat: 'stone' }),
      ),
    ),
  ],
})
