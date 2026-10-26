import { C, box, cyl, defineModel, prism, sphere } from '../../kit'

const canopy = '#d8c7a2'
const seamColor = '#c2ae86'
const seam = 8

const ribs = Array.from({ length: seam }, (_, i) => {
  const angle = (i / seam) * Math.PI * 2
  return prism(
    [
      [0, 2.478],
      [0.945, 2.064],
      [0.945, 2.044],
      [0, 2.458],
    ],
    0.016,
    0,
    0,
    0,
    C.walnut,
    { mat: 'wood', rot: [0, angle - Math.PI / 2, 0] },
  )
})

const seams = Array.from({ length: seam }, (_, i) => {
  const angle = (i / seam) * Math.PI * 2 + Math.PI / 8
  return prism(
    [
      [0, 2.489],
      [0.952, 2.074],
      [0.948, 2.06],
      [0, 2.475],
    ],
    0.008,
    0,
    0,
    0,
    seamColor,
    { mat: 'fabric', side: 'double', rot: [0, angle - Math.PI / 2, 0] },
  )
})

const hem = Array.from({ length: seam }, (_, i) => {
  const angle = (i / seam) * Math.PI * 2 + Math.PI / 8
  return box(0.727, 0.07, 0.012, 0.878 * Math.sin(angle), 2.022, 0.878 * Math.cos(angle), seamColor, {
    mat: 'fabric',
    side: 'double',
    rot: [0, angle, 0],
  })
})

export default defineModel({
  id: 'patio-umbrella',
  name: '庭院遮阳伞',
  category: 'outdoor',
  tags: ['umbrella', 'parasol', 'shade', '遮阳伞', '庭院伞', '阳伞'],
  footprint: [0.5, 0.5],
  height: 2.55,
  placement: 'outdoor',
  noCollide: true,
  parts: [
    // weighted base
    cyl(0.22, 0.24, 0.1, 0, 0.05, 0, C.stone, { mat: 'stone' }, 24),
    cyl(0.2, 0.22, 0.05, 0, 0.125, 0, C.graphite, { mat: 'stone' }, 24),
    cyl(0.095, 0.12, 0.09, 0, 0.19, 0, C.graphite, { mat: 'metal' }, 20),
    cyl(0.02, 0.02, 0.03, -0.15, 0.145, 0, C.steel, { mat: 'metal' }, 8),
    cyl(0.02, 0.02, 0.03, 0.15, 0.145, 0, C.steel, { mat: 'metal' }, 8),
    cyl(0.02, 0.02, 0.03, 0, 0.145, -0.15, C.steel, { mat: 'metal' }, 8),
    cyl(0.02, 0.02, 0.03, 0, 0.145, 0.15, C.steel, { mat: 'metal' }, 8),
    // pole and crank
    cyl(0.027, 0.032, 2.38, 0, 1.24, 0, C.brass, { mat: 'metal' }, 16),
    cyl(0.04, 0.04, 0.06, 0.055, 0.95, 0.02, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.02, 0.11, 0.02, 0.09, 0.9, 0.02, C.steel, { mat: 'metal' }),
    cyl(0.018, 0.018, 0.06, 0.09, 0.845, 0.02, C.walnut, { mat: 'wood' }, 10),
    // canvas canopy (octagonal)
    cyl(0, 0.95, 0.42, 0, 2.27, 0, canopy, { mat: 'fabric', side: 'double' }, 8),
    ...ribs,
    ...seams,
    ...hem,
    // finial
    cyl(0.026, 0.034, 0.05, 0, 2.475, 0, C.brass, { mat: 'metal' }, 12),
    sphere(0.034, 0, 2.515, 0, C.brass, { mat: 'metal' }, 12),
  ],
})
