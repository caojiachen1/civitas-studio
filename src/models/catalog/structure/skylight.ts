import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

// Hip-glazed skylight on an aluminium curb: four sloping glass panes, eave
// frames, diagonal hip bars, perimeter gutter, rubber seals and fixing bolts.
const ALU = '#8d9498'
const ALU_DARK = '#6c7377'
const CURB = '#b6b3aa'
const RUBBER = '#454a48'
const GLASS = C.glass

const APEX_RISE = 0.28
const BASE_HALF = 0.46
const SLOPE_ANGLE = Math.atan2(APEX_RISE, BASE_HALF)
const SLOPE_LEN = Math.hypot(BASE_HALF, APEX_RISE)
const HIP_TILT = Math.atan2(APEX_RISE, BASE_HALF * Math.SQRT2)

const parts: Part[] = []

// Curb frame and its projecting cap ring.
for (const sz of [-1, 1]) {
  parts.push(box(1.2, 0.1, 0.09, 0, 0.05, sz * 0.555, CURB, { mat: 'stone' }))
  parts.push(box(1.2, 0.05, 0.12, 0, 0.115, sz * 0.54, ALU, { mat: 'metal' }))
}
for (const sx of [-1, 1]) {
  parts.push(box(0.09, 0.1, 1.02, sx * 0.555, 0.05, 0, CURB, { mat: 'stone' }))
  parts.push(box(0.12, 0.05, 0.96, sx * 0.54, 0.115, 0, ALU, { mat: 'metal' }))
}

// Four glass panes meeting at the apex.
parts.push(box(1.0, 0.018, SLOPE_LEN, 0, 0.265, 0.23, GLASS, { mat: 'glass', rot: [SLOPE_ANGLE, 0, 0] }))
parts.push(box(1.0, 0.018, SLOPE_LEN, 0, 0.265, -0.23, GLASS, { mat: 'glass', rot: [-SLOPE_ANGLE, 0, 0] }))
parts.push(box(SLOPE_LEN, 0.018, 1.0, 0.23, 0.265, 0, GLASS, { mat: 'glass', rot: [0, 0, -SLOPE_ANGLE] }))
parts.push(box(SLOPE_LEN, 0.018, 1.0, -0.23, 0.265, 0, GLASS, { mat: 'glass', rot: [0, 0, SLOPE_ANGLE] }))

// Aluminium eave frames under the glass edges.
for (const sz of [-1, 1]) {
  parts.push(box(0.94, 0.045, 0.055, 0, 0.1625, sz * 0.462, ALU, { mat: 'metal' }))
}
for (const sx of [-1, 1]) {
  parts.push(box(0.055, 0.045, 0.94, sx * 0.462, 0.1625, 0, ALU, { mat: 'metal' }))
}

// Continuous rubber seal strips on the curb cap.
for (const sz of [-1, 1]) {
  parts.push(box(0.9, 0.018, 0.022, 0, 0.146, sz * 0.487, RUBBER, { mat: 'matte' }))
}
for (const sx of [-1, 1]) {
  parts.push(box(0.022, 0.018, 0.9, sx * 0.487, 0.146, 0, RUBBER, { mat: 'matte' }))
}

// Four diagonal hip bars and the apex cap.
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    const yaw = Math.atan2(sx, sz)
    parts.push(
      box(0.035, 0.035, 0.7, sx * 0.23, 0.265, sz * 0.23, ALU_DARK, {
        mat: 'metal',
        rot: [HIP_TILT, yaw, 0],
      }),
    )
  }
}
parts.push(box(0.14, 0.04, 0.14, 0, 0.4, 0, ALU_DARK, { mat: 'metal' }))

// Mid-slope glazing bars brace each pane against snow load.
parts.push(box(0.94, 0.012, 0.03, 0, 0.278, 0.23, ALU_DARK, { mat: 'metal', rot: [SLOPE_ANGLE, 0, 0] }))
parts.push(box(0.94, 0.012, 0.03, 0, 0.278, -0.23, ALU_DARK, { mat: 'metal', rot: [-SLOPE_ANGLE, 0, 0] }))
parts.push(box(0.03, 0.012, 0.94, 0.23, 0.278, 0, ALU_DARK, { mat: 'metal', rot: [0, 0, -SLOPE_ANGLE] }))
parts.push(box(0.03, 0.012, 0.94, -0.23, 0.278, 0, ALU_DARK, { mat: 'metal', rot: [0, 0, SLOPE_ANGLE] }))

// Weep slots in the gutter and colour-matched fixing caps.
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(box(0.06, 0.004, 0.02, sx * 0.35, 0.171, sz * 0.575, '#3f4446', { mat: 'matte' }))
    parts.push(cyl(0.01, 0.01, 0.006, sx * 0.38, 0.143, sz * 0.555, ALU_DARK, { mat: 'metal' }, 8))
  }
}

// Perimeter drainage gutter with two downspout stubs.
for (const sz of [-1, 1]) {
  parts.push(box(1.18, 0.03, 0.04, 0, 0.155, sz * 0.575, ALU_DARK, { mat: 'metal' }))
}
for (const sx of [-1, 1]) {
  parts.push(box(0.04, 0.03, 1.1, sx * 0.575, 0.155, 0, ALU_DARK, { mat: 'metal' }))
}
for (const sx of [-1, 1]) {
  parts.push(box(0.06, 0.04, 0.06, sx * 0.57, 0.157, 0.3, ALU, { mat: 'metal' }))
}

// Fixing bolts around the cap ring.
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(cyl(0.012, 0.012, 0.014, sx * 0.42, 0.145, sz * 0.575, ALU_DARK, { mat: 'metal' }, 8))
  }
}
for (const s of [-1, 1]) {
  parts.push(cyl(0.012, 0.012, 0.014, s * 0.575, 0.145, 0, ALU_DARK, { mat: 'metal' }, 8))
}

// Corner brackets and a small rain sensor on the gutter.
for (const sx of [-1, 1]) {
  for (const sz of [-1, 1]) {
    parts.push(box(0.06, 0.03, 0.06, sx * 0.55, 0.125, sz * 0.55, ALU_DARK, { mat: 'metal' }))
  }
}
parts.push(box(0.06, 0.025, 0.04, 0.3, 0.152, 0.575, ALU_DARK, { mat: 'metal' }))

export default defineModel({
  id: 'skylight',
  name: '天窗',
  category: 'structure',
  tags: ['skylight', 'roof window', 'glazing', '天窗', '采光', '玻璃穹顶', '铝合金'],
  footprint: [1.2, 1.2],
  height: 0.42,
  placement: 'any',
  noCollide: true,
  parts,
})
