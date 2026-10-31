import { box, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
const WHITE = '#e8e5da'
const BLACK = '#2f3235'
const YELLOW = '#e0b23a'

// arc profile spans 0.35 m; five 0.07 m bands step up to 0.058 m at the crown
const BANDS: [number, number][] = [
  [-0.14, 0.018],
  [-0.07, 0.048],
  [0, 0.058],
  [0.07, 0.048],
  [0.14, 0.018],
]

// ten 0.4 m slices alternate black / white paint over the full 4 m length
for (let i = 0; i < 10; i++) {
  const x = -1.8 + i * 0.4
  const paint = i % 2 === 0 ? WHITE : BLACK
  for (const [z, h] of BANDS) {
    parts.push(box(0.4, h, 0.072, x, h / 2, z, paint, { mat: 'gloss' }))
  }
}

// yellow reflective end heads with inset reflectors
for (const side of [-1, 1]) {
  parts.push(box(0.05, 0.052, 0.34, side * 1.975, 0.026, 0, YELLOW, { mat: 'gloss' }))
  for (const z of [-0.09, 0.09]) {
    parts.push(box(0.006, 0.03, 0.055, side * 2.003, 0.028, z, '#f1efe6', { mat: 'emissive' }))
    parts.push(box(0.006, 0.008, 0.055, side * 2.003, 0.052, z, '#c9483a', { mat: 'gloss' }))
  }
  parts.push(box(0.012, 0.014, 0.3, side * 1.94, 0.008, 0, '#1f2123', { mat: 'matte' }))
}

export default defineModel({
  id: 'speed-bump',
  name: '减速带',
  category: 'street',
  tags: ['speed', 'bump', 'hump', '减速带', '道路', '交通'],
  footprint: [4, 0.35],
  height: 0.06,
  placement: 'outdoor',
  parts,
})
