import { C, box, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 户外石阶：5 级，踢面 0.15 / 踏面 0.34，宽 2.4m。两侧 0.3m 厚矮石墙，
 * 墙顶 0.93，四角石柱顶 1.00，黄铜球头收头至 1.13。相邻踏板用两种近似石色交替，
 * 每级保留通长深色防滑条；墙脚与台阶均落地，无悬空。
 */
const RISE = 0.15
const TREAD = 0.34
const STEPS = 5
const STEP_W = 2.4
const WALL_T = 0.3
const Z0 = 0.85
const WALL_X = STEP_W / 2 + WALL_T / 2 // 1.35
const parts: Part[] = []

const STONE_DARK = '#8f8d85'
const STONE_LIGHT = '#cbc8bf'
const STONE_A = '#b8b4a9'
const STONE_B = '#a6a297'

for (let i = 0; i < STEPS; i++) {
  const top = RISE * (i + 1)
  const front = Z0 - TREAD * i
  const z = front - TREAD / 2
  parts.push(box(STEP_W, top, TREAD, 0, top / 2, z, STONE_DARK, { mat: 'stone' }))
  parts.push(box(STEP_W + 0.02, 0.045, TREAD + 0.025, 0, top - 0.0225, z, i % 2 ? STONE_B : STONE_A, { mat: 'stone' }))
  parts.push(box(STEP_W - 0.04, RISE - 0.03, 0.03, 0, top - RISE / 2, front - 0.015, STONE_LIGHT, { mat: 'stone' }))
  parts.push(box(STEP_W - 0.1, 0.008, 0.032, 0, top + 0.004, front - 0.016, '#6e6c65', { mat: 'stone' }))
}

// 两侧矮墙与压顶石
for (const side of [-1, 1]) {
  const x = side * WALL_X
  parts.push(box(WALL_T, 0.88, 1.7, x, 0.44, 0, STONE_DARK, { mat: 'stone' }))
  parts.push(box(WALL_T + 0.04, 0.05, 1.74, x, 0.905, 0, STONE_LIGHT, { mat: 'stone' }))
  for (const z of [-0.42, 0.42]) {
    parts.push(box(0.008, 0.7, 0.022, side * 1.496, 0.46, z, '#706e67', { mat: 'stone' }))
  }
}

// 四角石柱、柱帽、黄铜球头
for (const side of [-1, 1]) {
  const x = side * WALL_X
  for (const z of [-0.78, 0.78]) {
    parts.push(box(0.4, 0.08, 0.4, x, 0.04, z, STONE_DARK, { mat: 'stone' }))
    parts.push(box(0.32, 0.88, 0.32, x, 0.52, z, STONE_LIGHT, { mat: 'stone' }))
    parts.push(box(0.38, 0.04, 0.38, x, 0.98, z, STONE_A, { mat: 'stone' }))
    parts.push(sphere(0.065, x, 1.065, z, C.brass, { mat: 'metal' }, 14))
  }
}

// 前后基座条石，把包围盒补到 1.9m 深
for (const z of [-0.9, 0.9]) {
  parts.push(box(STEP_W + WALL_T * 2, 0.04, 0.1, 0, 0.02, z, STONE_DARK, { mat: 'stone' }))
}

export default defineModel({
  id: 'stair-stone',
  name: '户外石阶',
  category: 'structure',
  tags: ['stairs', 'stone steps', 'garden', '石阶', '户外', '景观台阶'],
  footprint: [3.0, 1.9],
  height: 1.13,
  placement: 'outdoor',
  parts,
})
