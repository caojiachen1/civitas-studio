import { box, cyl, defineModel, rbox } from '../../kit'

const WOOD = '#8f6845'
const WOOD_DARK = '#775537'
const WOOD_LIGHT = '#a37a52'
const PLATE = '#3a4145'
const BOLT = '#8f989d'

const span = 4.2
const half = span / 2
const bottomY = 0.28
const apexY = 1.16
const shoeH = 0.12

const bottomChord = box(span, 0.14, 0.16, 0, bottomY, 0, WOOD, { mat: 'wood' })

function strut(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  color: string,
): ReturnType<typeof box> {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy)
  return box(length, w, 0.12, (x1 + x2) / 2, (y1 + y2) / 2, 0, color, {
    mat: 'wood',
    rot: [0, 0, Math.atan2(dy, dx)],
  })
}

const topY = (x: number) => apexY - Math.abs(x) * ((apexY - bottomY - 0.04) / half)
const joints = [-1.68, -0.84, 0, 0.84, 1.68]

const topChords = [
  strut(-half, bottomY + 0.05, 0, apexY, 0.15, WOOD_LIGHT),
  strut(half, bottomY + 0.05, 0, apexY, 0.15, WOOD_LIGHT),
]

const verticals = joints.map((x) =>
  strut(x, bottomY, x, topY(x), 0.12, x === 0 ? WOOD_DARK : WOOD),
)

const diagonals = [
  strut(-half + 0.12, bottomY + 0.06, -1.68, topY(-1.68), 0.1, WOOD_DARK),
  strut(-1.68, bottomY + 0.06, -0.84, topY(-0.84), 0.1, WOOD),
  strut(-0.84, bottomY + 0.06, 0, topY(0), 0.1, WOOD_DARK),
  strut(0, bottomY + 0.06, 0.84, topY(0.84), 0.1, WOOD),
  strut(0.84, bottomY + 0.06, 1.68, topY(1.68), 0.1, WOOD_DARK),
  strut(1.68, bottomY + 0.06, half - 0.12, topY(half - 0.12), 0.1, WOOD),
]

const purlins = [0.12, 0.32, 0.52, 0.72, 0.9].flatMap((t) => {
  const result: ReturnType<typeof box>[] = []
  for (const side of [-1, 1]) {
    const x = side * half * (1 - t)
    const y = bottomY + 0.05 + (apexY - bottomY - 0.05) * t
    const angle = side * Math.atan2(apexY - bottomY - 0.05, half)
    result.push(box(0.11, 0.06, 0.26, x, y + 0.09, 0, WOOD_DARK, { mat: 'wood', rot: [0, 0, angle] }))
  }
  return result
})

const bottomPlates = joints.flatMap((x) => [
  box(0.34, 0.07, 0.19, x, bottomY, 0, PLATE, { mat: 'metal' }),
  ...[0, 1].map((i) =>
    cyl(0.012, 0.012, 0.2, x - 0.1 + i * 0.2, bottomY, 0, BOLT, {
      mat: 'metal',
      rot: [Math.PI / 2, 0, 0],
    }, 8),
  ),
])

const topPlates = joints.flatMap((x) => [
  box(0.28, 0.06, 0.15, x, topY(x) - 0.03, 0, PLATE, { mat: 'metal' }),
  ...[0, 1].map((i) =>
    cyl(0.01, 0.01, 0.16, x - 0.08 + i * 0.16, topY(x) - 0.03, 0, BOLT, {
      mat: 'metal',
      rot: [Math.PI / 2, 0, 0],
    }, 8),
  ),
])

const shoes = [-1, 1].flatMap((side) => {
  const x = side * (half - 0.18)
  return [
    rbox(0.36, shoeH, 0.26, 0.015, x, shoeH / 2, 0, WOOD_DARK, { mat: 'wood' }),
    box(0.28, 0.02, 0.2, x, shoeH + 0.01, 0, PLATE, { mat: 'metal' }),
    ...[0, 1, 2, 3].map((i) =>
      cyl(0.01, 0.01, shoeH, x - 0.12 + i * 0.08, shoeH / 2, side * 0.12, BOLT, { mat: 'metal' }, 8),
    ),
  ]
})

export default defineModel({
  id: 'beam-truss',
  name: '木桁架',
  category: 'structure',
  tags: ['truss', 'beam', 'timber truss', '桁架', '屋架', '木结构', '梁'],
  footprint: [4.2, 0.32],
  height: 1.25,
  placement: 'any',
  parts: [
    bottomChord,
    box(span - 0.3, 0.05, 0.12, 0, bottomY + 0.095, 0, WOOD_LIGHT, { mat: 'wood' }),
    ...topChords,
    ...verticals,
    ...diagonals,
    ...purlins,
    ...bottomPlates,
    ...topPlates,
    ...shoes,
    // metal hangers under the bottom chord for ceiling ties
    ...[-1.4, 0, 1.4].map((x) => box(0.08, 0.18, 0.1, x, bottomY - 0.16, 0, PLATE, { mat: 'metal' })),
  ],
})
