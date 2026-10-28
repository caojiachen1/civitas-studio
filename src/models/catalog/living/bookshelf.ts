import type { Part } from '../../../editor/types'
import { C, box, cyl, defineModel, ico, rbox } from '../../kit'

const BOOK_COLORS = [C.navy, C.terracotta, C.cream, C.sage, C.ink, C.blush, C.sand, C.leather, C.red]

function bookRow(startX: number, endX: number, baseY: number, seed: number, count: number): Part[] {
  const out: Part[] = []
  let x = startX
  for (let i = 0; i < count; i++) {
    const step = (i * 3 + seed) % 5
    const w = 0.034 + step * 0.009
    const h = 0.20 + ((i * 5 + seed) % 6) * 0.014
    const d = 0.19 + ((i + seed) % 3) * 0.013
    if (x + w > endX) break
    out.push(
      rbox(w, h, d, 0.004, x + w / 2, baseY + h / 2, 0.02, BOOK_COLORS[(i + seed) % BOOK_COLORS.length], {
        mat: 'matte',
      }),
    )
    x += w + 0.004
  }
  return out
}

export default defineModel({
  id: 'bookshelf',
  name: '书架',
  category: 'living',
  tags: ['bookshelf', 'shelf', '书架', 'storage', 'oak', 'books'],
  footprint: [1.0, 0.34],
  height: 2.05,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // open oak frame
    rbox(0.035, 1.85, 0.335, 0.008, -0.4825, 0.925, -0.0025, C.oak, { mat: 'wood' }),
    rbox(0.035, 1.85, 0.335, 0.008, 0.4825, 0.925, -0.0025, C.oak, { mat: 'wood' }),
    box(0.93, 1.74, 0.012, 0, 0.96, -0.164, C.birch, { mat: 'wood' }),
    rbox(0.965, 0.035, 0.335, 0.006, 0, 0.0775, -0.0025, C.oak, { mat: 'wood' }),
    rbox(0.965, 0.035, 0.335, 0.006, 0, 0.505, -0.0025, C.oak, { mat: 'wood' }),
    rbox(0.965, 0.035, 0.335, 0.006, 0, 0.945, -0.0025, C.oak, { mat: 'wood' }),
    rbox(0.965, 0.035, 0.335, 0.006, 0, 1.385, -0.0025, C.oak, { mat: 'wood' }),
    rbox(0.965, 0.035, 0.335, 0.006, 0, 1.83, -0.0025, C.oak, { mat: 'wood' }),
    rbox(0.022, 0.39, 0.30, 0.004, 0, 0.2925, 0.015, C.oak, { mat: 'wood' }),

    // bottom bay: two short rows with a bowl on the right
    ...bookRow(-0.445, -0.03, 0.095, 1, 6),
    ...bookRow(0.03, 0.30, 0.095, 3, 4),
    cyl(0.06, 0.035, 0.052, 0.37, 0.121, -0.02, C.cream, { mat: 'ceramic' }, 20),

    // second bay: upright row, flat stack, small vase
    ...bookRow(-0.445, -0.05, 0.5225, 5, 8),
    rbox(0.24, 0.03, 0.17, 0.004, 0.18, 0.5375, -0.02, C.cream, { mat: 'matte', rot: [0, 0.05, 0] }),
    rbox(0.22, 0.026, 0.16, 0.004, 0.18, 0.5655, -0.02, C.navy, { mat: 'matte', rot: [0, -0.04, 0] }),
    cyl(0.05, 0.065, 0.14, 0.37, 0.5925, -0.02, C.clay, { mat: 'ceramic' }, 18),

    // third bay: upright row, tall vase and a small potted plant
    ...bookRow(-0.445, -0.12, 0.9625, 7, 5),
    cyl(0.045, 0.058, 0.15, 0.10, 1.0375, -0.02, C.terracotta, { mat: 'ceramic' }, 18),
    cyl(0.05, 0.04, 0.08, 0.33, 1.0025, -0.02, C.clay, { mat: 'ceramic' }, 18),
    ico(0.055, 0.31, 1.075, -0.05, C.leaf, { mat: 'foliage' }, 1),
    ico(0.05, 0.36, 1.08, 0.01, C.leafDeep, { mat: 'foliage' }, 1),

    // fourth bay: books, bookend, flat stack, brass object
    ...bookRow(-0.445, -0.08, 1.4025, 9, 7),
    rbox(0.028, 0.13, 0.16, 0.006, 0.02, 1.4675, -0.035, C.brass, { mat: 'metal' }),
    rbox(0.10, 0.02, 0.16, 0.006, 0.07, 1.4125, -0.035, C.brass, { mat: 'metal' }),
    rbox(0.23, 0.028, 0.165, 0.004, 0.23, 1.4165, -0.02, C.ink, { mat: 'matte', rot: [0, -0.05, 0] }),
    ico(0.035, 0.35, 1.4375, -0.02, C.brass, { mat: 'metal' }, 1),

    // top decor: vase with dried stems and a small book stack
    cyl(0.048, 0.06, 0.11, -0.28, 1.9025, -0.01, C.clay, { mat: 'ceramic' }, 20),
    cyl(0.03, 0.04, 0.015, -0.28, 1.965, -0.01, C.clay, { mat: 'ceramic' }, 20),
    cyl(0.0025, 0.0025, 0.06, -0.29, 2.0025, -0.01, '#4c6d46', { mat: 'foliage', rot: [0.1, 0, -0.18] }, 6),
    cyl(0.0025, 0.0025, 0.06, -0.27, 2.0025, -0.005, '#4c6d46', { mat: 'foliage', rot: [-0.12, 0, 0.16] }, 6),
    ico(0.013, -0.29, 2.0345, 0.0, C.leaf, { mat: 'foliage' }, 1),
    ico(0.013, -0.27, 2.0345, 0.004, C.leafLight, { mat: 'foliage' }, 1),
    rbox(0.24, 0.024, 0.18, 0.004, 0.16, 1.8595, -0.02, C.cream, { mat: 'matte', rot: [0, 0.06, 0] }),
    rbox(0.22, 0.022, 0.17, 0.004, 0.16, 1.8825, -0.02, C.navy, { mat: 'matte', rot: [0, -0.04, 0] }),
    ico(0.028, 0.16, 1.9075, -0.02, C.brass, { mat: 'metal' }, 1),

    // front edge banding, back panel seams and brass shelf pins
    box(0.006, 1.72, 0.008, -0.498, 0.925, 0.164, '#9c7448', { mat: 'wood' }),
    box(0.006, 1.72, 0.008, 0.498, 0.925, 0.164, '#9c7448', { mat: 'wood' }),
    box(0.005, 1.70, 0.004, -0.31, 0.96, -0.157, '#cbb896', { mat: 'wood' }),
    box(0.005, 1.70, 0.004, 0.31, 0.96, -0.157, '#cbb896', { mat: 'wood' }),
    ...[0.505, 0.945, 1.385].flatMap((y) => [
      cyl(0.004, 0.004, 0.024, -0.455, y - 0.028, 0.152, C.brass, { mat: 'metal' }, 8),
      cyl(0.004, 0.004, 0.024, 0.455, y - 0.028, 0.152, C.brass, { mat: 'metal' }, 8),
    ]),
  ],
})
