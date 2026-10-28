import { C, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const POST = '#9a7850'
const POST_DARK = '#82623f'
const IRON = '#3f4442'
const ROPE = '#cdbfa6'
const CANVAS = '#d9cdb8'
const CANVAS_SHADE = '#c9bba4'

// Straight cylinder between two points: yaw about Y then tilt about Z, which
// matches the XYZ euler order used by the kit.
const strut = (a: [number, number, number], b: [number, number, number], r: number, color: string, mat: 'metal' | 'fabric') => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const dz = b[2] - a[2]
  const h = Math.hypot(dx, dz)
  const len = Math.hypot(h, dy)
  return cyl(
    r,
    r,
    len,
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2,
    color,
    { mat, rot: [0, Math.atan2(dz, -dx), Math.atan2(h, dy)] },
    6,
  )
}

const posts = [-1, 1].flatMap((s) => {
  const x = s * 1.5
  return [
    cyl(0.05, 0.07, 1.36, x, 0.68, 0, POST, { mat: 'wood' }, 10),
    sphere(0.062, x, 1.385, 0, POST_DARK, { mat: 'wood' }, 10),
    cyl(0.15, 0.17, 0.03, x, 0.015, 0, IRON, { mat: 'metal' }, 12),
    cyl(0.012, 0.012, 0.035, x - 0.07, 0.038, 0.06, C.steel, { mat: 'metal' }, 6),
    cyl(0.012, 0.012, 0.035, x + 0.07, 0.038, -0.06, C.steel, { mat: 'metal' }, 6),
    torus(0.062, 0.011, x, 0.22, 0, IRON, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    torus(0.058, 0.011, x, 1.18, 0, IRON, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    torus(0.042, 0.011, x, 1.32, 0, IRON, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 12),
    strut([x, 0.31, 0], [x, 0.02, 0.34], 0.018, IRON, 'metal'),
    strut([x, 0.31, 0], [x, 0.02, -0.34], 0.018, IRON, 'metal'),
  ]
})

// Sagging canvas: nine narrow boards following a parabola, each pitched to the
// local slope so the seams stay closed.
const fabric = Array.from({ length: 9 }, (_, i) => {
  const x = -0.96 + i * 0.24
  const y = 0.5 + 0.26 * Math.pow(x / 1.1, 2)
  return rbox(0.27, 0.03, 0.88, 0.012, x, y, 0, i % 2 === 0 ? CANVAS : CANVAS_SHADE, {
    mat: 'fabric',
    rot: [0, 0, Math.atan((0.52 * x) / 1.21)],
  })
})

const ropeEnds: [number, number][] = [
  [0.4, 0.79],
  [-0.4, 0.79],
  [0, 0.8],
]
const ropes = [-1, 1].flatMap((s) =>
  ropeEnds.map(([z, y]) => strut([s * 1.5, 1.32, 0], [s * 1.06, y, z], 0.011, ROPE, 'fabric')),
)

const bars = [-1, 1].map((s) =>
  cyl(0.022, 0.022, 0.94, s * 1.06, 0.79, 0, POST_DARK, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }, 8),
)

const gathers = [-1, 1].map((s) =>
  rbox(0.1, 0.1, 0.58, 0.035, s * 1.02, 0.745, 0, CANVAS, { mat: 'fabric', rot: [0, 0, s * 0.3] }),
)

export default defineModel({
  id: 'hammock',
  name: '吊床',
  category: 'outdoor',
  tags: ['hammock', '吊床', '摇床', '庭院', '休闲', '户外家具'],
  footprint: [3.4, 1.3],
  height: 1.45,
  placement: 'outdoor',
  parts: [
    ...posts,
    ...bars,
    ...ropes,
    ...fabric,
    ...gathers,
    // throw pillow with two stitched buttons
    rbox(0.42, 0.12, 0.3, 0.05, 0, 0.575, 0, C.linen, { mat: 'fabric', rot: [0, 0.18, 0] }),
    cyl(0.012, 0.012, 0.012, -0.09, 0.638, 0.02, C.cream, { mat: 'fabric' }, 8),
    cyl(0.012, 0.012, 0.012, 0.09, 0.638, -0.02, C.cream, { mat: 'fabric' }, 8),
    // whipped cord bindings at each end of the spreader bars
    torus(0.026, 0.007, -1.06, 0.79, -0.44, ROPE, { mat: 'fabric' }, 12),
    torus(0.026, 0.007, -1.06, 0.79, 0.44, ROPE, { mat: 'fabric' }, 12),
    torus(0.026, 0.007, 1.06, 0.79, -0.44, ROPE, { mat: 'fabric' }, 12),
    torus(0.026, 0.007, 1.06, 0.79, 0.44, ROPE, { mat: 'fabric' }, 12),
    // spare cord tails hanging from the post lashings
    strut([-1.53, 1.26, 0.02], [-1.57, 1.1, 0.06], 0.008, ROPE, 'fabric'),
    strut([1.53, 1.26, -0.02], [1.57, 1.09, -0.07], 0.008, ROPE, 'fabric'),
    // forged rings where the centre rope meets the spreader bar
    torus(0.024, 0.006, -1.06, 0.79, 0, C.steel, { mat: 'metal' }, 12),
    torus(0.024, 0.006, 1.06, 0.79, 0, C.steel, { mat: 'metal' }, 12),
  ],
})
