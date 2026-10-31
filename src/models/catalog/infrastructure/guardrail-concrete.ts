import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 4m New Jersey concrete barrier, long axis on Z.
 * Profile: 0.60m base, 0.20m top, 0.81m high, sloped shoulders and a 15mm top chamfer.
 * Two transverse dummy joints, formwork seams, recessed reflectors and lifting sockets.
 */
const MODULE_LEN = 4
const H = 0.81
const JOINT = '#8f8d86'
const REF_WHITE = '#f2f2ee'
const REF_RED = '#c4453c'

const NJ_PROFILE: [number, number][] = [
  [-0.3, 0],
  [0.3, 0],
  [0.3, 0.08],
  [0.115, 0.33],
  [0.1, 0.36],
  [0.1, 0.77],
  [0.085, 0.81],
  [-0.085, 0.81],
  [-0.1, 0.77],
  [-0.1, 0.36],
  [-0.115, 0.33],
  [-0.3, 0.08],
]

const parts: Part[] = []
parts.push(prism(NJ_PROFILE, MODULE_LEN, 0, 0, 0, C.concrete, { mat: 'stone' }))

// two transverse dummy joints at the third points
for (const z of [-MODULE_LEN / 3, MODULE_LEN / 3]) {
  parts.push(box(0.17, 0.006, 0.014, 0, H - 0.003, z, JOINT, { mat: 'stone' }))
  for (const x of [-0.1005, 0.1005]) {
    parts.push(box(0.006, 0.36, 0.014, x, 0.56, z, JOINT, { mat: 'stone' }))
  }
}

// reflectors embedded flush in the top surface near each end
for (const z of [-1.6, 1.6]) {
  parts.push(box(0.07, 0.01, 0.1, 0.035, H - 0.005, z, REF_WHITE, { mat: 'gloss' }))
  parts.push(box(0.07, 0.01, 0.1, -0.035, H - 0.005, z, REF_RED, { mat: 'gloss' }))
}

// recessed lifting sockets, three pairs along the top
for (const z of [-0.9, 0, 0.9]) {
  for (const x of [-0.045, 0.045]) {
    parts.push(cyl(0.034, 0.034, 0.008, x, H - 0.004, z, '#87857e', { mat: 'stone' }, 14))
  }
}

// chamfer highlights along the top edges
for (const x of [-0.079, 0.079]) {
  parts.push(box(0.012, 0.004, 3.9, x, H - 0.002, 0, '#c6c4bd', { mat: 'stone' }))
}

// continuous construction joint and base formwork seams on both faces
for (const x of [-0.101, 0.101]) {
  parts.push(box(0.003, 0.008, 3.96, x, 0.56, 0, JOINT, { mat: 'stone' }))
}
for (const x of [-0.301, 0.301]) {
  parts.push(box(0.003, 0.008, 3.96, x, 0.04, 0, JOINT, { mat: 'stone' }))
}

// weep holes in the base
for (const x of [-0.301, 0.301]) {
  for (const z of [-1.15, 1.15]) {
    parts.push(box(0.006, 0.03, 0.06, x, 0.13, z, '#5f5e58', { mat: 'stone' }))
  }
}

// end-face form lines
for (const s of [-1, 1]) {
  parts.push(box(0.22, 0.006, 0.004, 0, 0.33, s * 2.001, JOINT, { mat: 'stone' }))
  parts.push(box(0.006, 0.34, 0.004, 0, 0.57, s * 2.001, JOINT, { mat: 'stone' }))
}

export default defineModel({
  id: 'guardrail-concrete',
  name: '新泽西混凝土护栏',
  category: 'infrastructure',
  tags: ['guardrail', 'concrete', 'jersey barrier', '护栏', '混凝土', '新泽西'],
  footprint: [0.6, 4],
  height: 0.81,
  placement: 'outdoor',
  parts,
})
