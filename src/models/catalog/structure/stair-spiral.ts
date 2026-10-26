import { C, box, cyl, defineModel, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
const steps = 18
for (let i = 0; i < steps; i++) {
  const angle = (i / steps) * Math.PI * 1.9 - Math.PI * 0.35
  const y = 0.16 + (i / steps) * 3.0
  parts.push(
    box(0.9, 0.07, 0.3, Math.cos(angle) * 0.38, y, Math.sin(angle) * 0.38, C.oak, {
      mat: 'wood',
      rot: [0, -angle, 0],
    }),
  )
  parts.push(
    box(0.06, 0.82, 0.06, Math.cos(angle) * 0.97, y + 0.44, Math.sin(angle) * 0.97, C.blackMetal, {
      mat: 'metal',
    }),
  )
  if (i % 2 === 0) {
    const next = angle + 0.33
    parts.push(
      box(0.72, 0.04, 0.04, Math.cos(angle + 0.16) * 0.92, y + 0.9, Math.sin(angle + 0.16) * 0.92, C.walnut, {
        mat: 'wood',
        rot: [0, -angle - 0.16, 0],
      }),
    )
    parts.push(
      cyl(0.02, 0.02, 0.7, Math.cos(next) * 0.92, y + 0.55, Math.sin(next) * 0.92, C.walnut, { mat: 'wood' }, 8),
    )
  }
}
parts.push(cyl(0.11, 0.13, 3.35, 0, 1.68, 0, C.graphite, { mat: 'metal' }, 20))
parts.push(cyl(0.42, 0.46, 0.1, 0, 0.05, 0, C.stone, {}, 24))
parts.push(cyl(0.08, 0.08, 0.08, 0, 3.36, 0, C.brass, { mat: 'metal' }, 16))
parts.push(box(2.0, 0.05, 0.55, 0.6, 3.3, 0, C.concrete, { mat: 'stone' }))
parts.push(box(0.06, 0.9, 0.06, 1.52, 2.85, 0, C.blackMetal, { mat: 'metal' }))
parts.push(box(1.5, 0.05, 0.05, 0.83, 3.3, 0, C.walnut, { mat: 'wood' }))
parts.push(cyl(0.018, 0.018, 0.9, 1.4, 2.85, 0.22, C.blackMetal, { mat: 'metal' }, 8))
parts.push(cyl(0.018, 0.018, 0.9, 0.65, 3.3, 0.22, C.blackMetal, { mat: 'metal' }, 8))

// tread brackets, anti-slip inserts and centre-post collars
for (let i = 0; i < steps; i++) {
  const angle = (i / steps) * Math.PI * 1.9 - Math.PI * 0.35
  const y = 0.16 + (i / steps) * 3.0
  parts.push(
    box(0.16, 0.06, 0.08, Math.cos(angle) * 0.64, y - 0.065, Math.sin(angle) * 0.64, C.blackMetal, {
      mat: 'metal',
      rot: [0, -angle, 0],
    }),
  )
  parts.push(
    box(0.18, 0.008, 0.024, Math.cos(angle) * 0.7, y + 0.042, Math.sin(angle) * 0.7, C.brass, {
      mat: 'metal',
      rot: [0, -angle, 0],
    }),
  )
  if (i % 3 === 0) {
    parts.push(
      torus(0.128, 0.012, 0, y + 0.12, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    )
  }
}
for (let i = 0; i < 6; i++) {
  const a = (i * Math.PI * 2) / 6
  parts.push(sphere(0.012, Math.cos(a) * 0.36, 0.12, Math.sin(a) * 0.36, C.steel, { mat: 'metal' }, 8))
}
parts.push(box(2.02, 0.012, 0.06, 0.6, 3.335, 0.285, C.graphite, { mat: 'metal' }))
parts.push(box(0.06, 0.012, 0.57, 1.61, 3.335, 0, C.graphite, { mat: 'metal' }))
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 1.9 - Math.PI * 0.35
  parts.push(
    sphere(0.01, Math.cos(a + 0.1) * 0.97, 0.3 + (i / 8) * 2.7, Math.sin(a + 0.1) * 0.97, C.steel, {
      mat: 'metal',
    }, 6),
  )
}

export default defineModel({
  id: 'stair-spiral',
  name: '螺旋楼梯',
  category: 'structure',
  tags: ['spiral stair', 'stairs', '螺旋楼梯', '旋转楼梯'],
  footprint: [3.3, 2.6],
  height: 3.85,
  placement: 'indoor',
  parts,
})
