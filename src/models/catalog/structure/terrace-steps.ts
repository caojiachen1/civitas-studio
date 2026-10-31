import { C, box, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 景观台阶：3 级宽台阶，踢面 0.15 / 踏面 0.35，台阶净宽 5.8，
 * 两侧各 0.4m 种植池（石池 + 土 + 3 个灌木球），总宽 6.6m。
 * 每级有整块石踏板、独立踢面板和深色石防滑条；两端设 6 个嵌入式暖光地灯。
 * 前后基座条石把深度补到 1.5m，所有构件落地。
 */
const RISE = 0.15
const TREAD = 0.35
const STEPS = 3
const STEP_W = 6.0
const Z0 = 0.525
const PLANTER_X = 3.15
const parts: Part[] = []

const STONE_DARK = '#8f8d85'
const STONE_A = '#b8b4a9'
const STONE_B = '#a6a297'

for (let i = 0; i < STEPS; i++) {
  const top = RISE * (i + 1)
  const front = Z0 - TREAD * i
  const z = front - TREAD / 2
  parts.push(box(STEP_W, top, TREAD, 0, top / 2, z, STONE_DARK, { mat: 'stone' }))
  parts.push(box(STEP_W + 0.02, 0.04, TREAD + 0.02, 0, top - 0.02, z, i % 2 ? STONE_B : STONE_A, { mat: 'stone' }))
  parts.push(box(STEP_W - 0.04, RISE - 0.03, 0.03, 0, top - RISE / 2, front - 0.015, C.stone, { mat: 'stone' }))
  parts.push(box(STEP_W - 0.12, 0.008, 0.032, 0, top + 0.004, front - 0.016, '#6e6c65', { mat: 'stone' }))
  for (const x of [-1.9, 1.9]) {
    parts.push(box(0.012, 0.004, TREAD - 0.04, x, top + 0.002, z, '#706e67', { mat: 'stone' }))
  }
  for (const x of [-2.72, 2.72]) {
    parts.push(box(0.09, 0.012, 0.09, x, top + 0.006, front - 0.16, C.cream, { mat: 'emissive' }))
  }
}

// 两侧种植池：石池 + 土 + 池沿 + 3 个灌木球
for (const side of [-1, 1]) {
  const x = side * PLANTER_X
  parts.push(box(0.3, 0.72, 1.1, x, 0.36, 0, STONE_DARK, { mat: 'stone' }))
  parts.push(box(0.18, 0.05, 1.0, x, 0.735, 0, C.soil, { mat: 'matte' }))
  parts.push(box(0.3, 0.04, 0.06, x, 0.74, 0.52, STONE_A, { mat: 'stone' }))
  parts.push(box(0.3, 0.04, 0.06, x, 0.74, -0.52, STONE_A, { mat: 'stone' }))
  parts.push(box(0.04, 0.04, 1.0, x - side * 0.12, 0.74, 0, STONE_A, { mat: 'stone' }))
  parts.push(box(0.04, 0.04, 1.0, x + side * 0.12, 0.74, 0, STONE_A, { mat: 'stone' }))
  for (const [z, r, color] of [[-0.35, 0.19, C.leafDeep], [0, 0.21, C.leaf], [0.35, 0.18, C.leafLight]] as [number, number, string][]) {
    parts.push(sphere(r, x, 0.89, z, color, { mat: 'foliage' }, 12))
  }
}

// 前后基座条石
for (const z of [-0.7, 0.7]) {
  parts.push(box(6.6, 0.04, 0.1, 0, 0.02, z, STONE_DARK, { mat: 'stone' }))
}

export default defineModel({
  id: 'terrace-steps',
  name: '景观台阶',
  category: 'structure',
  tags: ['terrace steps', 'landscape', 'planters', '景观台阶', '台阶', '种植池'],
  footprint: [6.6, 1.5],
  height: 1.1,
  placement: 'outdoor',
  parts,
})
