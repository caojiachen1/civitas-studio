import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const TEAK = '#a37c50'
const TEAK_WARM = '#b08957'
const TEAK_DARK = '#86633f'
const IRON = '#3b403d'
const IRON_LIGHT = '#4a504b'

// Cast-iron side frame: front leg, reclined back post, seat rail and armrest.
// Bolts are turned to lie along x so their heads read on the outer face.
const sides = [-1, 1].flatMap((s) => [
  rbox(0.055, 0.44, 0.062, 0.016, s * 0.7, 0.22, 0.2, IRON, { mat: 'metal' }),
  rbox(0.06, 0.88, 0.07, 0.018, s * 0.7, 0.44, -0.2, IRON, { mat: 'metal', rot: [-0.07, 0, 0] }),
  rbox(0.05, 0.055, 0.46, 0.016, s * 0.7, 0.42, 0, IRON_LIGHT, { mat: 'metal' }),
  rbox(0.062, 0.045, 0.5, 0.018, s * 0.7, 0.665, 0.0, IRON, { mat: 'metal', rot: [-0.02, 0, 0] }),
  box(0.046, 0.12, 0.046, s * 0.7, 0.495, 0.2, IRON_LIGHT, { mat: 'metal' }),
  torus(0.05, 0.016, s * 0.7, 0.6, 0.2, IRON, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 14),
  rbox(0.085, 0.03, 0.11, 0.012, s * 0.7, 0.015, 0.2, IRON, { mat: 'metal' }),
  rbox(0.085, 0.03, 0.11, 0.012, s * 0.7, 0.015, -0.2, IRON, { mat: 'metal' }),
  // finial over the back post
  sphere(0.036, s * 0.7, 0.885, -0.235, IRON_LIGHT, { mat: 'metal' }, 10),
])

const bolts = [-1, 1].flatMap((s) => [
  cyl(0.014, 0.014, 0.018, s * 0.718, 0.44, 0.17, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
  cyl(0.014, 0.014, 0.018, s * 0.718, 0.44, -0.17, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
  cyl(0.014, 0.014, 0.018, s * 0.732, 0.66, 0.17, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
  cyl(0.012, 0.012, 0.018, s * 0.734, 0.8, -0.243, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
])

// Seat slats run the full width; z spacing leaves a shadow gap between boards.
const seatSlats = [0.18, 0.11, 0.04, -0.03, -0.1, -0.17].map((z, i) =>
  rbox(1.46, 0.034, 0.066, 0.012, 0, 0.468, z, i % 2 === 0 ? TEAK : TEAK_WARM, { mat: 'wood' }),
)

// Back slats step backwards with the recline of the iron posts.
const backSlats = [0.58, 0.665, 0.75, 0.835].map((y, i) =>
  rbox(1.46, 0.07, 0.026, 0.008, 0, y, -0.225 - (y - 0.58) * 0.09, i % 2 === 0 ? TEAK_WARM : TEAK, {
    mat: 'wood',
    rot: [-0.09, 0, 0],
  }),
)

export default defineModel({
  id: 'garden-bench',
  name: '花园长椅',
  category: 'outdoor',
  tags: ['bench', 'garden bench', 'park bench', '花园长椅', '长椅', '铸铁', '户外家具'],
  footprint: [1.65, 0.6],
  height: 0.92,
  placement: 'outdoor',
  parts: [
    ...sides,
    // timber sub-frame carrying the seat boards
    box(1.46, 0.055, 0.045, 0, 0.425, 0.205, TEAK_DARK, { mat: 'wood' }),
    box(1.46, 0.055, 0.045, 0, 0.425, -0.185, TEAK_DARK, { mat: 'wood' }),
    ...seatSlats,
    ...backSlats,
    // curved top rail ties the back slats together
    rbox(1.5, 0.068, 0.045, 0.018, 0, 0.885, -0.2525, TEAK_WARM, { mat: 'wood', rot: [-0.09, 0, 0] }),
    ...bolts,
  ],
})
