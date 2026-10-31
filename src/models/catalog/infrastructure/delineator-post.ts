import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 0.9m delineator post on a small concrete pad. The white body tapers from
 * 0.10m at the base to 0.084m at the top, with red / white reflective plates
 * and screw fixings on all four faces, a through bolt and a pressed cap.
 */
const H = 0.9
const REF_WHITE = '#f2f2ee'
const REF_RED = '#c4453c'
const parts: Part[] = []

// concrete pad, post and socket collar
parts.push(box(0.14, 0.04, 0.14, 0, 0.02, 0, C.concrete, { mat: 'stone' }))
for (const dx of [-0.055, 0.055]) {
  for (const dz of [-0.055, 0.055]) {
    parts.push(cyl(0.009, 0.009, 0.02, dx, 0.05, dz, C.steel, { mat: 'metal' }, 8))
    parts.push(cyl(0.014, 0.014, 0.004, dx, 0.042, dz, C.graphite, { mat: 'metal' }, 10))
  }
}
parts.push(
  prism(
    [
      [-0.05, 0.04],
      [0.05, 0.04],
      [0.042, H],
      [-0.042, H],
    ],
    0.1,
    0,
    0,
    0,
    C.white,
    { mat: 'matte' },
  ),
)
parts.push(box(0.12, 0.05, 0.12, 0, 0.055, 0, C.graphite, { mat: 'metal' }))
for (const x of [-0.055, 0.055]) {
  parts.push(box(0.02, 0.05, 0.04, x, 0.065, 0, C.graphite, { mat: 'metal' }))
}
for (const z of [-0.055, 0.055]) {
  parts.push(box(0.04, 0.05, 0.02, 0, 0.065, z, C.graphite, { mat: 'metal' }))
}
parts.push(box(0.095, 0.01, 0.095, 0, H - 0.005, 0, C.graphite, { mat: 'metal' }))

// reflective plates on the four faces: white above, red below
for (const s of [-1, 1]) {
  parts.push(box(0.085, 0.12, 0.006, 0, 0.78, s * 0.052, REF_WHITE, { mat: 'gloss' }))
  parts.push(box(0.085, 0.1, 0.006, 0, 0.64, s * 0.052, REF_RED, { mat: 'gloss' }))
  parts.push(box(0.006, 0.12, 0.08, s * 0.045, 0.78, 0, REF_WHITE, { mat: 'gloss' }))
  parts.push(box(0.006, 0.1, 0.08, s * 0.045, 0.64, 0, REF_RED, { mat: 'gloss' }))
}

// two screw heads per plate
for (const s of [-1, 1]) {
  for (const y of [0.81, 0.75, 0.665, 0.615]) {
    for (const o of [-0.024, 0.024]) {
      parts.push(cyl(0.004, 0.004, 0.004, o, y, s * 0.056, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6))
      parts.push(cyl(0.004, 0.004, 0.004, s * 0.049, y, o, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 6))
    }
  }
}

// through bolt with two nuts
parts.push(cyl(0.006, 0.006, 0.11, 0, 0.15, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8))
for (const s of [-1, 1]) {
  parts.push(cyl(0.009, 0.009, 0.008, 0, 0.15, s * 0.057, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 6))
}

export default defineModel({
  id: 'delineator-post',
  name: '轮廓标',
  category: 'infrastructure',
  tags: ['delineator', 'reflector', 'road edge', '轮廓标', '反光', '公路'],
  footprint: [0.14, 0.14],
  height: 0.9,
  placement: 'outdoor',
  parts,
})
