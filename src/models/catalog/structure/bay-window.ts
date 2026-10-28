import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

// Projecting bay window: angled three-sided glazing on a timber sill, solid
// side cheeks, mullioned frame, projecting head boards and a brass handle.
const FRAME = '#6e7375'
const FRAME_DARK = '#585d5f'
const PANEL = '#d5cfc1'
const HINGE = '#9aa1a4'
const GLASS = C.glass

const ANG = Math.atan2(0.42, 0.32)

const parts: Part[] = []

// Sill bands following the three-sided plan.
parts.push(box(1.3, 0.16, 0.08, 0, 0.08, 0.36, FRAME, { mat: 'stone' }))
for (const sx of [-1, 1]) {
  parts.push(box(0.56, 0.16, 0.08, sx * 0.78, 0.08, 0.15, FRAME, { mat: 'stone', rot: [0, sx * ANG, 0] }))
  parts.push(box(0.08, 0.16, 0.35, sx * 0.94, 0.08, -0.225, FRAME, { mat: 'stone' }))
}

// Interior timber sill board (窗台板) with a small nosing.
parts.push(box(1.34, 0.035, 0.2, 0, 0.1775, 0.3, C.oak, { mat: 'wood' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.58, 0.035, 0.12, sx * 0.77, 0.1775, 0.13, C.oak, { mat: 'wood', rot: [0, sx * ANG, 0] }),
  )
}

// Three glass faces: front plus two angled cheeks.
parts.push(box(1.16, 1.26, 0.02, 0, 0.825, 0.36, GLASS, { mat: 'glass' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.5, 1.26, 0.02, sx * 0.78, 0.825, 0.15, GLASS, {
      mat: 'glass',
      rot: [0, sx * ANG, 0],
    }),
  )
}

// Solid side panels closing the returns to the wall.
for (const sx of [-1, 1]) {
  parts.push(box(0.05, 1.26, 0.35, sx * 0.94, 0.825, -0.225, PANEL, { mat: 'matte' }))
}

// Corner posts, back jambs and front mullions.
for (const sx of [-1, 1]) {
  parts.push(box(0.07, 1.3, 0.07, sx * 0.62, 0.81, 0.36, FRAME, { mat: 'matte' }))
  parts.push(box(0.07, 1.3, 0.07, sx * 0.94, 0.81, -0.05, FRAME, { mat: 'matte' }))
  parts.push(box(0.06, 1.3, 0.06, sx * 0.96, 0.81, -0.37, FRAME_DARK, { mat: 'matte' }))
  parts.push(box(0.04, 1.26, 0.05, sx * 0.205, 0.825, 0.36, FRAME, { mat: 'matte' }))
}

// Transom rails at handle height.
parts.push(box(1.2, 0.04, 0.06, 0, 1.02, 0.36, FRAME, { mat: 'matte' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.5, 0.04, 0.06, sx * 0.78, 1.02, 0.15, FRAME, { mat: 'matte', rot: [0, sx * ANG, 0] }),
  )
}

// Head band and projecting top boards (顶板).
parts.push(box(1.34, 0.1, 0.1, 0, 1.51, 0.35, FRAME, { mat: 'matte' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.58, 0.1, 0.1, sx * 0.775, 1.51, 0.135, FRAME, { mat: 'matte', rot: [0, sx * ANG, 0] }),
  )
  parts.push(box(0.1, 0.1, 0.35, sx * 0.94, 1.51, -0.22, FRAME, { mat: 'matte' }))
}
parts.push(box(1.4, 0.04, 0.1, 0, 1.58, 0.34, FRAME_DARK, { mat: 'matte' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.58, 0.04, 0.12, sx * 0.77, 1.58, 0.13, FRAME_DARK, {
      mat: 'matte',
      rot: [0, sx * ANG, 0],
    }),
  )
  parts.push(box(0.12, 0.04, 0.4, sx * 0.94, 1.58, -0.2, FRAME_DARK, { mat: 'matte' }))
}

// 把手: brass backplate, lever and lock cylinder.
parts.push(box(0.04, 0.11, 0.01, 0.3, 1.0, 0.372, C.brass, { mat: 'metal' }))
parts.push(box(0.09, 0.022, 0.026, 0.3, 1.02, 0.385, C.brass, { mat: 'metal' }))
parts.push(cyl(0.014, 0.014, 0.012, 0.3, 0.975, 0.382, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10))

// Hinges on the outer casements and fixing bolts along the sill.
for (const sx of [-1, 1]) {
  for (const hy of [0.35, 1.3]) {
    parts.push(box(0.02, 0.05, 0.012, sx * 0.565, hy, 0.373, HINGE, { mat: 'metal' }))
  }
}
for (const sx of [-1, 1]) {
  parts.push(cyl(0.01, 0.01, 0.012, sx * 0.5, 0.168, 0.365, HINGE, { mat: 'metal' }, 8))
  parts.push(cyl(0.01, 0.01, 0.012, sx * 0.9, 0.168, -0.2, HINGE, { mat: 'metal' }, 8))
}

// Glazing beads pinch the panes against the frame.
parts.push(box(1.16, 0.018, 0.018, 0, 0.205, 0.372, FRAME_DARK, { mat: 'matte' }))
parts.push(box(1.16, 0.018, 0.018, 0, 1.442, 0.372, FRAME_DARK, { mat: 'matte' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.5, 0.018, 0.018, sx * 0.78, 0.205, 0.165, FRAME_DARK, {
      mat: 'matte',
      rot: [0, sx * ANG, 0],
    }),
  )
}

// Exterior silicone seal along the sill edge.
parts.push(box(1.3, 0.012, 0.01, 0, 0.163, 0.402, '#4b5050', { mat: 'matte' }))
for (const sx of [-1, 1]) {
  parts.push(
    box(0.54, 0.012, 0.01, sx * 0.79, 0.163, 0.192, '#4b5050', {
      mat: 'matte',
      rot: [0, sx * ANG, 0],
    }),
  )
}

// Colour-matched screw caps at the casement corners.
for (const sx of [-1, 1]) {
  for (const hy of [0.36, 1.28]) {
    parts.push(sphere(0.009, sx * 0.6, hy, 0.396, FRAME, { mat: 'matte' }, 8))
  }
}

export default defineModel({
  id: 'bay-window',
  name: '飘窗',
  category: 'structure',
  tags: ['bay window', 'window', 'glazing', '飘窗', '窗台', '凸窗', '窗框'],
  footprint: [2.0, 0.8],
  height: 1.6,
  placement: 'any',
  wallAlign: true,
  parts,
})
