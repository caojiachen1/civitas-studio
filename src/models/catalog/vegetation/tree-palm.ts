import { C, box, cone, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

const TRUNK_H = 5.27
const BEND = 0.32
const SEGMENTS = 7
const CROWN_X = BEND
const CROWN_Y = TRUNK_H - 0.02

const TONES = ['#4c7a44', '#5b8a4c', '#426f40']
const LEAFLET = '#6f9a54'

// Curved trunk assembled from tapered, connected segments.
const trunk = Array.from({ length: SEGMENTS }, (_, i) => {
  const t0 = i / SEGMENTS
  const t1 = (i + 1) / SEGMENTS
  const x0 = BEND * t0 * t0
  const x1 = BEND * t1 * t1
  const y0 = TRUNK_H * t0
  const y1 = TRUNK_H * t1
  const dx = x1 - x0
  const dy = y1 - y0
  return cyl(
    0.2 - 0.08 * t1,
    0.2 - 0.08 * t0,
    Math.hypot(dx, dy) + 0.05,
    (x0 + x1) / 2,
    (y0 + y1) / 2,
    0,
    i % 2 === 0 ? '#8d6c4a' : '#97754f',
    { mat: 'wood', rot: [0, 0, -Math.atan2(dx, dy)] },
    10,
  )
})

// Darker scar rings mark the segment joints.
const rings = [0.2, 0.46, 0.72, 0.93].map((t) =>
  cyl(
    0.213 - 0.08 * t,
    0.218 - 0.08 * t,
    0.05,
    BEND * t * t,
    TRUNK_H * t,
    0,
    '#6f5335',
    { mat: 'wood', rot: [0, 0, -Math.atan2(0.64 * t, TRUNK_H)] },
    10,
  ),
)

// Fronds follow a connected arc: a thin rachis with angled leaflets either side.
const ARC: [number, number][] = [
  [0, 0],
  [0.3, 0.34],
  [0.62, 0.58],
  [0.95, 0.58],
  [1.18, 0.2],
]
const RACHIS = [0.05, 0.05, 0.045, 0.035]
const LEAF_LEN = [0, 0.42, 0.38, 0.3]
const LEAF_FRACS = [0.25, 0.55, 0.85]
const LIFT = [0.05, 0, -0.07]
const PITCH_BIAS = [0.06, 0, -0.12]

const frond = (angle: number, tone: string, layer: number) => {
  const dirX = Math.cos(angle)
  const dirZ = Math.sin(angle)
  const lift = LIFT[layer]
  const bias = PITCH_BIAS[layer]
  const parts = ARC.slice(1).flatMap(([d1, y1], k) => {
    const [d0, y0] = ARC[k]
    const pitch = Math.atan2(y1 - y0, d1 - d0) + bias
    const d = (d0 + d1) / 2
    const dy = (y0 + y1) / 2
    const rib = box(
      Math.hypot(d1 - d0, y1 - y0) + 0.05,
      0.035,
      RACHIS[k],
      CROWN_X + dirX * d,
      CROWN_Y + dy + lift,
      dirZ * d,
      tone,
      { mat: 'foliage', rot: [0, -angle, pitch] },
    )
    if (k === 0) return [rib]

    const len = LEAF_LEN[k]
    const leaves = LEAF_FRACS.flatMap((f) => {
      const ld = d0 + (d1 - d0) * f
      const ly = y0 + (y1 - y0) * f
      return [1, -1].map((sign) => {
        const la = angle + sign * 0.62
        return box(
          len,
          0.02,
          0.16,
          CROWN_X + dirX * ld + Math.cos(la) * len * 0.34,
          CROWN_Y + ly + lift + 0.005,
          dirZ * ld + Math.sin(la) * len * 0.34,
          LEAFLET,
          { mat: 'foliage', rot: [0, -la, pitch] },
        )
      })
    })
    return [rib, ...leaves]
  })
  parts.push(
    box(0.18, 0.025, 0.04, CROWN_X + dirX * 1.18, CROWN_Y + 0.2 + lift, 1.18 * dirZ, LEAFLET, {
      mat: 'foliage',
      rot: [0, -angle, -1.1 + bias],
    }),
  )
  return parts
}

const fronds = Array.from({ length: 11 }, (_, i) =>
  frond((i * Math.PI * 2) / 11 + 0.2, TONES[i % TONES.length], i % 3),
).flat()

// Dry fibres cling to the curved trunk between the scar rings.
const fibers = Array.from({ length: 18 }, (_, i) => {
  const t = (i + 0.5) / 18
  const a = i * 2.39996
  const r = 0.205 - 0.08 * t
  return box(
    0.016,
    0.2,
    0.012,
    BEND * t * t + Math.cos(a) * r,
    TRUNK_H * t,
    Math.sin(a) * r,
    i % 3 === 0 ? '#7a5a3c' : '#87653f',
    { mat: 'wood', rot: [0.04 * Math.sin(a), a, 0.03] },
  )
})

// Stalks tie the coconut cluster back to the crown.
const stalk = (tx: number, ty: number, tz: number) => {
  const dx = tx - CROWN_X
  const dy = ty - 5.12
  const dz = tz
  const h = Math.hypot(dx, dz)
  const len = Math.hypot(h, dy)
  return cyl(
    0.022,
    0.032,
    len,
    CROWN_X + dx / 2,
    5.12 + dy / 2,
    dz / 2,
    '#8a6a43',
    { mat: 'wood', rot: [0, Math.atan2(dz, -dx), Math.atan2(h, dy)] },
    6,
  )
}
const coconutStalks = [
  stalk(CROWN_X + 0.14, 4.82, 0.1),
  stalk(CROWN_X - 0.02, 4.76, 0.16),
  stalk(CROWN_X + 0.18, 4.8, -0.08),
  stalk(CROWN_X + 0.02, 4.72, -0.16),
  stalk(CROWN_X + 0.24, 4.9, 0.02),
]

// Two spent fronds droop down the trunk, leaflets folded along the rachis.
const deadFronds: Part[] = []
const DEAD_FROND_ANGLES = [0.72, 3.82]
DEAD_FROND_ANGLES.forEach((a, fi) => {
  for (let k = 0; k < 4; k++) {
    const t = k / 3
    const r = 0.24 + t * 0.82
    const y = CROWN_Y - 0.06 - t * 0.78
    deadFronds.push(
      box(
        0.34,
        0.026,
        0.05,
        CROWN_X + Math.cos(a) * r,
        y,
        Math.sin(a) * r,
        k % 2 === 0 ? '#8a6a43' : '#775a39',
        { mat: 'wood', rot: [0, -a, -0.9 + k * 0.1] },
      ),
    )
    if (k < 3) {
      deadFronds.push(
        box(
          0.24,
          0.012,
          0.11,
          CROWN_X + Math.cos(a + fi * 0.3) * (r + 0.1),
          y - 0.05,
          Math.sin(a + fi * 0.3) * (r + 0.1),
          '#94714a',
          { mat: 'wood', rot: [0, -a - 0.3, -0.7] },
        ),
      )
    }
  }
})

// Buttress roots grip the ground at the foot of the trunk.
const palmRoots = [0.5, 2.1, 3.7, 5.2].map((a, i) =>
  cyl(0.05, 0.12, 0.4, Math.cos(a) * 0.15, 0.12, Math.sin(a) * 0.15, i % 2 === 0 ? '#8d6c4a' : '#775a3c', {
    mat: 'wood',
    rot: [0, -a, 1.05],
  }, 7),
)

// Old fronds hang below the crown as a ragged skirt.
const skirt = Array.from({ length: 6 }, (_, i) => {
  const a = i * 1.047 + 0.3
  return box(
    0.13,
    0.46 + (i % 2) * 0.12,
    0.03,
    CROWN_X + Math.cos(a) * 0.24,
    CROWN_Y - 0.38,
    Math.sin(a) * 0.24,
    i % 2 === 0 ? '#8a6a43' : '#775a39',
    { mat: 'wood', rot: [0.18 * Math.cos(a), -a, 0.2] },
  )
})

const groundTufts = Array.from({ length: 8 }, (_, i) => {
  const a = i * 0.785 + 0.2
  const r = 0.3 + (i % 3) * 0.1
  return cone(0.035, 0.18 + (i % 3) * 0.05, Math.cos(a) * r, 0.11, Math.sin(a) * r, i % 2 === 0 ? '#6f8a52' : '#7f9a5e', {
    mat: 'foliage',
    rot: [0.18 * Math.cos(a), a, 0.14 * Math.sin(a)],
  }, 5)
})

// Cut frond bases ringing the crown.
const boots = Array.from({ length: 5 }, (_, i) => {
  const a = (i * Math.PI * 2) / 5 + 0.5
  return box(0.28, 0.07, 0.13, CROWN_X + Math.cos(a) * 0.17, CROWN_Y - 0.14, Math.sin(a) * 0.17, '#7b5f3e', {
    mat: 'wood',
    rot: [0, -a, -0.55],
  })
})

export default defineModel({
  id: 'tree-palm',
  name: '棕榈树',
  category: 'vegetation',
  tags: ['tree', 'palm', '棕榈', '热带', '常绿'],
  footprint: [3.4, 3.4],
  height: 6.0,
  placement: 'outdoor',
  parts: [
    ...palmRoots,
    ...trunk,
    ...rings,
    ...fibers,
    // old frond boots and coconut cluster under the crown
    cyl(0.13, 0.22, 0.34, CROWN_X, CROWN_Y - 0.13, 0, '#87663f', { mat: 'wood' }, 10),
    ...boots,
    ...skirt,
    sphere(0.14, CROWN_X + 0.14, 4.78, 0.1, C.walnut, {}, 10),
    sphere(0.13, CROWN_X - 0.02, 4.72, 0.16, '#7c5a38', {}, 10),
    sphere(0.14, CROWN_X + 0.18, 4.76, -0.08, '#7c5a38', {}, 10),
    sphere(0.12, CROWN_X + 0.02, 4.68, -0.16, C.walnut, {}, 10),
    sphere(0.13, CROWN_X + 0.24, 4.86, 0.02, C.walnut, {}, 10),
    ...coconutStalks,
    ...deadFronds,
    ...fronds,
    // young upright spear leaves reaching the full height
    cone(0.06, 0.6, CROWN_X + 0.02, 5.7, 0.04, '#7fa95c', { mat: 'foliage', rot: [0.12, 0, -0.08] }, 6),
    cone(0.05, 0.48, CROWN_X - 0.07, 5.66, -0.05, '#6f9a54', { mat: 'foliage', rot: [-0.1, 0, 0.12] }, 6),
    cone(0.04, 0.36, CROWN_X + 0.11, 5.6, -0.03, '#8bb267', { mat: 'foliage', rot: [0.05, 0, -0.16] }, 6),
    ...groundTufts,
  ],
})
