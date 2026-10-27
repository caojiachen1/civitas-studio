import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const FRAME = '#5b7a7d'
const DECK = '#b18a5b'
const DECK_DARK = '#8d6a45'
const SLIDE = '#c69a63'
const SLIDE_RAIL = '#b2854f'
const METAL = C.steel

const postFootings: [number, number][] = [
  [-0.7, -1.0],
  [0.7, -1.0],
  [-0.7, -0.12],
  [0.7, -0.12],
]

const ladderFootings: [number, number][] = [
  [-0.38, -1.08],
  [0.38, -1.08],
]

const balusters: [number, number][] = [
  [-0.63, -0.99],
  [0.63, -0.99],
  [-0.7, -0.83],
  [-0.7, -0.55],
  [-0.7, -0.27],
  [0.7, -0.83],
  [0.7, -0.55],
  [0.7, -0.27],
]

const deckBolts: [number, number][] = [
  [-0.6, -0.9],
  [0.6, -0.9],
  [-0.6, -0.22],
  [0.6, -0.22],
]

const rungs = [0.3, 0.53, 0.76, 0.99, 1.22, 1.45]

export default defineModel({
  id: 'playground-slide',
  name: '儿童滑梯',
  category: 'outdoor',
  tags: ['playground', 'slide', 'kids', '儿童滑梯', '滑梯', '游乐设施'],
  footprint: [1.8, 2.4],
  height: 2.2,
  placement: 'outdoor',
  parts: [
    // concrete footings under the tower and the ladder
    ...postFootings.map(([x, z]) =>
      cyl(0.1, 0.12, 0.1, x, 0.05, z, C.concrete, { mat: 'stone' }, 12),
    ),
    ...ladderFootings.map(([x, z]) =>
      cyl(0.06, 0.075, 0.08, x, 0.04, z, C.concrete, { mat: 'stone' }, 12),
    ),
    // painted timber support posts
    ...postFootings.map(([x, z]) =>
      rbox(0.08, 1.95, 0.08, 0.012, x, 1.025, z, FRAME, { mat: 'wood' }),
    ),
    // rounded caps on the two tall rear posts
    sphere(0.06, -0.7, 2.14, -1.0, FRAME, { mat: 'gloss' }, 12),
    sphere(0.06, 0.7, 2.14, -1.0, FRAME, { mat: 'gloss' }, 12),
    // deck and its frame
    box(1.52, 0.08, 0.88, 0, 1.51, -0.56, DECK, { mat: 'wood' }),
    box(1.56, 0.09, 0.06, 0, 1.44, -1.0, DECK_DARK, { mat: 'wood' }),
    box(1.56, 0.09, 0.06, 0, 1.44, -0.12, DECK_DARK, { mat: 'wood' }),
    box(0.06, 0.09, 0.88, -0.73, 1.44, -0.56, DECK_DARK, { mat: 'wood' }),
    box(0.06, 0.09, 0.88, 0.73, 1.44, -0.56, DECK_DARK, { mat: 'wood' }),
    // guardrails around the sides, split at the rear to leave the ladder opening
    box(0.34, 0.07, 0.06, -0.54, 2.0, -0.99, FRAME, { mat: 'wood' }),
    box(0.34, 0.07, 0.06, 0.54, 2.0, -0.99, FRAME, { mat: 'wood' }),
    box(0.34, 0.05, 0.04, -0.54, 1.76, -0.99, FRAME, { mat: 'wood' }),
    box(0.34, 0.05, 0.04, 0.54, 1.76, -0.99, FRAME, { mat: 'wood' }),
    box(0.06, 0.07, 0.86, -0.7, 2.0, -0.56, FRAME, { mat: 'wood' }),
    box(0.06, 0.07, 0.86, 0.7, 2.0, -0.56, FRAME, { mat: 'wood' }),
    box(0.04, 0.05, 0.86, -0.7, 1.76, -0.56, FRAME, { mat: 'wood' }),
    box(0.04, 0.05, 0.86, 0.7, 1.76, -0.56, FRAME, { mat: 'wood' }),
    ...balusters.map(([x, z]) => box(0.028, 0.47, 0.028, x, 1.79, z, FRAME, { mat: 'wood' })),
    // galvanised deck bolts
    ...deckBolts.map(([x, z]) =>
      cyl(0.018, 0.018, 0.018, x, 1.559, z, METAL, { mat: 'metal' }, 8),
    ),
    // inclined slide bed with raised side cheeks
    box(0.85, 0.05, 1.72, 0, 0.875, 0.45, SLIDE, { mat: 'gloss', rot: [0.905, 0, 0] }),
    box(0.05, 0.16, 1.72, -0.445, 0.94, 0.5, SLIDE_RAIL, { mat: 'gloss', rot: [0.905, 0, 0] }),
    box(0.05, 0.16, 1.72, 0.445, 0.94, 0.5, SLIDE_RAIL, { mat: 'gloss', rot: [0.905, 0, 0] }),
    box(0.86, 0.035, 0.2, 0, 1.555, -0.08, SLIDE, { mat: 'gloss' }),
    box(0.9, 0.055, 0.22, 0, 0.155, 1.08, SLIDE, { mat: 'gloss' }),
    // slide support legs
    cyl(0.028, 0.028, 0.6, -0.35, 0.3, 0.62, METAL, { mat: 'metal' }, 8),
    cyl(0.028, 0.028, 0.6, 0.35, 0.3, 0.62, METAL, { mat: 'metal' }, 8),
    cyl(0.055, 0.065, 0.04, -0.35, 0.02, 0.62, C.concrete, { mat: 'stone' }, 12),
    cyl(0.055, 0.065, 0.04, 0.35, 0.02, 0.62, C.concrete, { mat: 'stone' }, 12),
    // rung ladder at the rear
    rbox(0.05, 1.62, 0.06, 0.01, -0.38, 0.86, -1.08, FRAME, { mat: 'wood' }),
    rbox(0.05, 1.62, 0.06, 0.01, 0.38, 0.86, -1.08, FRAME, { mat: 'wood' }),
    ...rungs.map((y) => box(0.76, 0.045, 0.07, 0, y, -1.08, DECK, { mat: 'wood' })),
  ],
})
