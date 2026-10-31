import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const parts: Part[] = []

// 9 m concrete mast (Ø0.30 -> Ø0.15), two 2.4 m crossarms, 9.6 m with air terminal
parts.push(box(0.8, 0.3, 0.8, 0, 0.15, 0, '#a5a39b', { mat: 'stone' }))
parts.push(box(0.86, 0.04, 0.86, 0, 0.32, 0, C.concrete, { mat: 'stone' }))
parts.push(cyl(0.19, 0.21, 0.05, 0, 0.345, 0, C.stone, { mat: 'stone' }, 20))

// tapered concrete pole from 0.37 to 9.2
parts.push(cyl(0.075, 0.15, 8.83, 0, 4.785, 0, '#b0ada4', { mat: 'stone' }, 20))
for (let i = 0; i < 3; i++) {
  parts.push(torus(0.148 - i * 0.024, 0.012, 0, 0.5 + i * 0.06, 0, C.concrete, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 20))
}
parts.push(cyl(0.055, 0.085, 0.12, 0, 9.26, 0, C.concrete, { mat: 'stone' }, 16))

// air terminal rod and earth strap
parts.push(cyl(0.011, 0.017, 0.38, 0, 9.4, 0, C.graphite, { mat: 'metal' }, 10))
parts.push(sphere(0.018, 0, 9.6, 0, C.steel, { mat: 'metal' }, 10))
parts.push(cyl(0.016, 0.016, 0.5, 0.085, 9.05, 0, C.steel, { mat: 'metal' }, 8))
parts.push(box(0.03, 0.04, 0.012, 0.078, 8.95, 0.01, C.steel, { mat: 'metal' }))

// lower crossarm on X with three pin insulators
parts.push(box(2.4, 0.11, 0.13, 0, 8.55, 0, C.graphite, { mat: 'metal' }))
for (const x of [-0.95, 0, 0.95]) {
  parts.push(cyl(0.024, 0.024, 0.1, x, 8.655, 0, C.graphite, { mat: 'metal' }, 10))
  parts.push(cyl(0.048, 0.056, 0.13, x, 8.77, 0, C.white, { mat: 'ceramic' }, 14))
  parts.push(cyl(0.058, 0.058, 0.02, x, 8.845, 0, C.white, { mat: 'ceramic' }, 14))
  parts.push(cyl(0.016, 0.016, 0.04, x, 8.865, 0, C.brass, { mat: 'metal' }, 10))
}
// diagonal braces from mast to the lower arm
for (const side of [-1, 1]) {
  parts.push(cyl(0.015, 0.015, 1.22, side * 0.57, 8.3, 0, C.graphite, { mat: 'metal', rot: [0, 0, -side * 1.24] }, 8))
  parts.push(box(0.08, 0.16, 0.08, side * 0.12, 8.44, 0, C.steel, { mat: 'metal' }))
}

// upper crossarm on Z with three insulators
parts.push(box(0.13, 0.1, 2.4, 0, 8.92, 0, C.graphite, { mat: 'metal' }))
for (const z of [-0.95, 0, 0.95]) {
  parts.push(cyl(0.024, 0.024, 0.1, 0, 9.02, z, C.graphite, { mat: 'metal' }, 10))
  parts.push(cyl(0.048, 0.056, 0.13, 0, 9.13, z, C.white, { mat: 'ceramic' }, 14))
  parts.push(cyl(0.058, 0.058, 0.02, 0, 9.205, z, C.white, { mat: 'ceramic' }, 14))
  parts.push(cyl(0.016, 0.016, 0.04, 0, 9.225, z, C.brass, { mat: 'metal' }, 10))
}
for (const side of [-1, 1]) {
  parts.push(cyl(0.013, 0.013, 1.33, 0, 8.54, side * 0.575, C.graphite, { mat: 'metal', rot: [side * 1.042, 0, 0] }, 8))
}

// pole-mounted transformer: brackets, tank, cooling fins, bushings
parts.push(box(0.12, 0.07, 0.3, 0, 7.02, 0.2, C.graphite, { mat: 'metal' }))
parts.push(box(0.12, 0.07, 0.3, 0, 6.18, 0.2, C.graphite, { mat: 'metal' }))
parts.push(rounded(0.46, 0.72, 0.4, 0.04, 0, 6.6, 0.42, C.steel, { mat: 'metal' }))
parts.push(rounded(0.48, 0.06, 0.44, 0.02, 0, 6.98, 0.42, C.graphite, { mat: 'metal' }))
parts.push(rounded(0.48, 0.05, 0.44, 0.02, 0, 6.22, 0.42, C.graphite, { mat: 'metal' }))
for (let i = 0; i < 4; i++) {
  parts.push(box(0.02, 0.55, 0.05, 0.24, 6.6, 0.28 + i * 0.09, C.steel, { mat: 'metal' }))
  parts.push(box(0.02, 0.55, 0.05, -0.24, 6.6, 0.28 + i * 0.09, C.steel, { mat: 'metal' }))
}
for (let i = 0; i < 3; i++) {
  parts.push(cyl(0.03, 0.045, 0.1, -0.13 + i * 0.13, 7.06, 0.42, C.cream, { mat: 'ceramic' }, 12))
  parts.push(cyl(0.014, 0.014, 0.04, -0.13 + i * 0.13, 7.13, 0.42, C.brass, { mat: 'metal' }, 8))
}
parts.push(box(0.14, 0.1, 0.004, 0, 6.5, 0.623, '#d9b25f', { mat: 'matte' }))
parts.push(cyl(0.012, 0.012, 0.5, 0.19, 6.6, 0.63, C.graphite, { mat: 'metal' }, 8))

// two drooping service conductors, eight straight segments each
for (const side of [-1, 1]) {
  const pts: [number, number][] = []
  for (let i = 0; i <= 8; i++) {
    const t = i / 8
    const x = (1 - t) ** 2 * side * 0.95 + 2 * (1 - t) * t * side * 1.14 + t * t * side * 1.18
    const y = (1 - t) ** 2 * 8.86 + 2 * (1 - t) * t * 8.3 + t * t * 7.4
    pts.push([x, y])
  }
  for (let i = 0; i < 8; i++) {
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    const dx = bx - ax
    const dy = by - ay
    parts.push(cyl(0.015, 0.015, Math.hypot(dx, dy) + 0.012, (ax + bx) / 2, (ay + by) / 2, 0.04, '#2b2e31', { mat: 'matte', rot: [0, 0, Math.atan2(-dx, dy)] }, 8))
  }
  parts.push(cyl(0.03, 0.03, 0.03, side * 1.18, 7.38, 0.04, C.brass, { mat: 'metal' }, 8))
}

// climbing steps and cable guards
for (let i = 0; i < 6; i++) {
  const side = i % 2 === 0 ? 1 : -1
  const r = 0.14 - i * 0.006
  parts.push(box(0.28, 0.024, 0.024, side * (r + 0.1), 1.5 + i * 1.0, 0, C.steel, { mat: 'metal' }))
}
parts.push(cyl(0.02, 0.02, 1.2, 0.13, 1.1, 0.02, C.graphite, { mat: 'metal' }, 8))
parts.push(cyl(0.024, 0.024, 0.3, 0.15, 0.55, 0.02, C.graphite, { mat: 'metal', rot: [0, 0, 0.7] }, 8))

// pole number plate and danger sign
parts.push(rounded(0.18, 0.11, 0.012, 0.005, 0, 2.55, 0.125, C.cream, { mat: 'matte' }))
parts.push(box(0.11, 0.012, 0.004, 0, 2.57, 0.133, C.ink))
parts.push(rounded(0.16, 0.2, 0.012, 0.004, 0, 4.6, 0.115, '#e0b23a', { mat: 'matte' }))
parts.push(box(0.1, 0.02, 0.004, 0, 4.63, 0.123, C.ink))
parts.push(box(0.02, 0.1, 0.004, 0, 4.63, 0.123, C.ink))

export default defineModel({
  id: 'utility-pole',
  name: '电线杆',
  category: 'street',
  tags: ['utility', 'power', 'pole', '电线杆', '电力', '变压器'],
  footprint: [2.4, 2.4],
  height: 9.6,
  placement: 'outdoor',
  parts,
})
