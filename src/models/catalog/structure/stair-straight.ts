import { C, box, cyl, defineModel, sphere } from '../../kit'

const parts = [] as ReturnType<typeof box>[]
const steps = 16
const totalRise = 3.2
const run = 3.0
const width = 1.22
const rise = totalRise / steps
const tread = run / steps
for (let i = 0; i < steps; i++) {
  const z = -run / 2 + tread * (i + 0.5)
  const y = rise * (i + 1)
  parts.push(box(width, 0.065, tread + 0.02, 0, y - 0.032, z, C.oak, { mat: 'wood' }))
  parts.push(box(width - 0.06, rise - 0.02, 0.035, 0, y - rise / 2, z - tread / 2, C.cream))
  if (i % 3 === 0) parts.push(box(width - 0.26, 0.012, tread * 0.5, 0, y + 0.005, z - tread * 0.1, C.walnut, { mat: 'wood' }))
}
for (const side of [-1, 1]) {
  const x = side * (width / 2 - 0.05)
  parts.push(box(0.07, 0.24, run + 0.08, x, 1.52, 0, C.walnut, { mat: 'wood' }))
  for (let i = 0; i <= 8; i++) {
    const z = -run / 2 + (run * i) / 8
    const y = 0.9 + rise * steps * ((z + run / 2) / run)
    parts.push(cyl(0.018, 0.018, 0.92, x, Math.min(y, 2.9) - 0.46, z, C.blackMetal, { mat: 'metal' }, 8))
  }
  parts.push(box(0.05, 0.06, run + 0.04, x, 1.72, 0, C.oak, { mat: 'wood' }))
  parts.push(cyl(0.035, 0.035, 0.95, x, 1.42, -run / 2 + 0.02, C.blackMetal, { mat: 'metal' }, 10))
  parts.push(cyl(0.035, 0.035, 0.95, x, 2.42, run / 2 - 0.02, C.blackMetal, { mat: 'metal' }, 10))
}
parts.push(box(1.32, 0.14, 0.7, 0, 3.11, run / 2 + 0.28, C.concrete, { mat: 'stone' }))
parts.push(box(0.06, 2.95, 0.06, -width / 2 - 0.14, 1.45, run / 2 + 0.55, C.white))
parts.push(box(0.06, 2.95, 0.06, width / 2 + 0.14, 1.45, run / 2 + 0.55, C.white))
parts.push(box(width + 0.4, 0.08, 0.06, 0, 2.92, run / 2 + 0.55, C.white))

// brass nosing strips, anti-slip inserts and handrail brackets
for (let i = 0; i < steps; i++) {
  const z = -run / 2 + tread * (i + 0.5)
  const y = rise * (i + 1)
  parts.push(box(width - 0.02, 0.008, 0.022, 0, y + 0.004, z + tread / 2 - 0.014, C.brass, { mat: 'metal' }))
  parts.push(box(width - 0.3, 0.004, 0.012, 0, y + 0.009, z + tread / 2 - 0.06, '#6d665b', { mat: 'stone' }))
}
for (const side of [-1, 1]) {
  const x = side * (width / 2 - 0.05)
  for (let i = 0; i <= 4; i++) {
    const z = -run / 2 + (run * i) / 4
    parts.push(box(0.08, 0.035, 0.12, x + side * 0.02, 1.69, z, C.blackMetal, { mat: 'metal' }))
    parts.push(sphere(0.012, x + side * 0.06, 1.69, z, C.steel, { mat: 'metal' }, 8))
  }
  parts.push(cyl(0.045, 0.055, 0.04, x, 1.77, -run / 2, C.brass, { mat: 'metal' }, 14))
  parts.push(cyl(0.045, 0.055, 0.04, x, 1.77, run / 2, C.brass, { mat: 'metal' }, 14))
  for (let i = 0; i < 5; i++) {
    const z = -run / 2 + (run * i) / 4
    const y = 0.9 + rise * steps * ((z + run / 2) / run)
    parts.push(sphere(0.01, x, Math.min(y, 2.9) - 0.9, z, C.steel, { mat: 'metal' }, 6))
  }
}
parts.push(box(1.36, 0.02, 0.72, 0, 3.19, run / 2 + 0.28, C.concrete, { mat: 'stone' }))

export default defineModel({
  id: 'stair-straight',
  name: '直跑楼梯',
  category: 'structure',
  tags: ['stairs', 'steps', '楼梯', '台阶'],
  footprint: [1.7, 3.9],
  height: 3.25,
  placement: 'indoor',
  parts,
})
