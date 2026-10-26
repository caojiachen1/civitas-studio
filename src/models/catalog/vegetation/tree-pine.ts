import { C, box, cone, cyl, defineModel } from '../../kit'

const NEEDLE_DARK = '#2f4a34'
const NEEDLE_MID = '#37553b'
const NEEDLE_LIGHT = '#41633f'

export default defineModel({
  id: 'tree-pine',
  name: '松树',
  category: 'vegetation',
  tags: ['tree', 'pine', '松树', '针叶树', '常绿'],
  footprint: [2.8, 2.8],
  height: 7.2,
  placement: 'outdoor',
  parts: [
    cyl(0.16, 0.26, 2.9, 0, 1.45, 0, C.walnut, { mat: 'wood' }, 10),
    cyl(0.07, 0.14, 1.2, 0, 3.2, 0, '#5f4530', { mat: 'wood' }, 8),
    // staggered needle tiers, each cone slightly rotated for a hand-cut silhouette
    cone(1.35, 1.55, 0, 2.25, 0, NEEDLE_DARK, { mat: 'foliage', rot: [0, 0.35, 0] }, 10),
    cone(1.2, 1.45, 0.02, 3.05, 0.01, NEEDLE_MID, { mat: 'foliage', rot: [0, -0.2, 0] }, 10),
    cone(1.03, 1.35, -0.02, 3.85, -0.01, NEEDLE_LIGHT, { mat: 'foliage', rot: [0, 0.5, 0] }, 10),
    cone(0.85, 1.25, 0.02, 4.6, 0.02, NEEDLE_DARK, { mat: 'foliage', rot: [0, -0.3, 0] }, 10),
    cone(0.67, 1.15, 0, 5.32, 0, NEEDLE_MID, { mat: 'foliage', rot: [0, 0.25, 0] }, 10),
    cone(0.49, 1.0, -0.01, 5.95, 0, NEEDLE_LIGHT, { mat: 'foliage', rot: [0, 0.5, 0] }, 10),
    cone(0.31, 0.85, 0.01, 6.5, 0.01, NEEDLE_DARK, { mat: 'foliage', rot: [0, -0.4, 0] }, 10),
    cone(0.14, 0.6, 0, 6.9, 0, NEEDLE_MID, { mat: 'foliage', rot: [0, 0.3, 0] }, 8),

    // rough bark plates and sappy scars
    ...Array.from({ length: 7 }, (_, i) => {
      const a = i * 0.897 + 0.2
      return box(0.06, 0.42 + (i % 3) * 0.12, 0.018, Math.cos(a) * 0.215, 0.7 + i * 0.3, Math.sin(a) * 0.215, i % 2 === 0 ? '#6b4d34' : '#78583b', {
        mat: 'wood',
        rot: [0.04 * Math.sin(a), a, 0.05],
      })
    }),
    cyl(0.055, 0.075, 0.12, 0.16, 1.4, 0.12, '#8a6a46', { mat: 'wood', rot: [0, 0.4, 0.8] }, 8),

    // visible branch arms supporting the tiers
    ...Array.from({ length: 7 }, (_, i) => {
      const a = i * 0.9 + 0.35
      const len = 0.72 - i * 0.045
      const y = 2.05 + i * 0.42
      return cyl(0.022, 0.045, len, Math.cos(a) * len * 0.3, y, Math.sin(a) * len * 0.3, '#5a402c', {
        mat: 'wood',
        rot: [0, -a, 1.18],
      }, 6)
    }),

    // hanging pine cones
    ...Array.from({ length: 7 }, (_, i) => {
      const a = i * 1.13 + 0.7
      const r = 0.42 + (i % 3) * 0.17
      return cone(0.055, 0.14, Math.cos(a) * r, 2.55 + (i % 4) * 0.62, Math.sin(a) * r, '#5f4530', {
        mat: 'wood',
        rot: [Math.PI, 0, 0.2 * Math.sin(a)],
      }, 7)
    }),

    // needle litter and low grass at the base
    ...Array.from({ length: 11 }, (_, i) => {
      const a = i * 0.571
      const r = 0.28 + (i % 4) * 0.1
      return cone(0.035, 0.16 + (i % 3) * 0.05, Math.cos(a) * r, 0.1, Math.sin(a) * r, i % 2 === 0 ? '#4c6b42' : '#5c7a4c', {
        mat: 'foliage',
        rot: [0.2 * Math.cos(a), a, 0.18 * Math.sin(a)],
      }, 5)
    }),
    ...Array.from({ length: 8 }, (_, i) => {
      const a = i * 0.785 + 0.4
      return box(0.14, 0.01, 0.025, Math.cos(a) * 0.38, 0.015, Math.sin(a) * 0.38, '#7a6248', {
        mat: 'wood',
        rot: [0, a, 0.05],
      })
    }),
  ],
})
