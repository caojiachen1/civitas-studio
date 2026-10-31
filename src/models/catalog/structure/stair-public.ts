import { C, box, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 广场大台阶：总宽 12m，6 级，踢面 0.15 / 踏面 0.35，两侧各 0.45m 厚矮墙。
 * 每级为整块长石台阶，另加 4cm 厚踏板、独立踢面板、通长黄铜包边和中间两道铜防滑条。
 * 矮墙高 0.98 + 7cm 压顶石 = 1.05；墙体与台阶均从 y=0 起，无悬空。
 */
const RISE = 0.15
const TREAD = 0.35
const STEPS = 6
const W = 12
const WALL_T = 0.45
const STEP_W = W - WALL_T * 2
const Z0 = 1.05
const RUN = STEPS * TREAD
const WALL_X = W / 2 - WALL_T / 2
const parts: Part[] = []

for (let i = 0; i < STEPS; i++) {
  const top = RISE * (i + 1)
  const front = Z0 - TREAD * i
  const z = front - TREAD / 2
  parts.push(box(STEP_W, top, TREAD, 0, top / 2, z, C.concrete, { mat: 'stone' }))
  parts.push(box(STEP_W + 0.02, 0.04, TREAD + 0.02, 0, top - 0.02, z, C.stone, { mat: 'stone' }))
  parts.push(box(STEP_W - 0.04, RISE - 0.03, 0.03, 0, top - RISE / 2, front - 0.015, C.sand, { mat: 'stone' }))
  parts.push(box(STEP_W - 0.02, 0.008, 0.026, 0, top + 0.004, front - 0.013, C.brass, { mat: 'metal' }))
  for (const dz of [0.13, 0.25]) {
    parts.push(box(STEP_W - 0.12, 0.006, 0.018, 0, top + 0.003, front - dz, C.brass, { mat: 'metal' }))
  }
}

// 两侧矮墙、压顶石、外立面浅凹槽
for (const side of [-1, 1]) {
  const x = side * WALL_X
  parts.push(box(WALL_T, 0.98, 2.4, x, 0.49, 0, C.concrete, { mat: 'stone' }))
  parts.push(box(WALL_T + 0.04, 0.07, 2.44, x, 1.015, 0, C.stone, { mat: 'stone' }))
  for (const z of [-0.65, 0, 0.65]) {
    parts.push(box(0.008, 0.54, 0.5, side * 5.996, 0.55, z, C.graphite, { mat: 'stone' }))
  }
  parts.push(box(WALL_T + 0.02, 0.02, 0.03, x, 0.995, -1.19, C.stone, { mat: 'stone' }))
  parts.push(box(WALL_T + 0.02, 0.02, 0.03, x, 0.995, 1.19, C.stone, { mat: 'stone' }))
}

// 前沿基座与台阶端部的收边石
parts.push(box(W, 0.05, 0.12, 0, 0.025, Z0 + 0.06, C.concrete, { mat: 'stone' }))
parts.push(box(W, 0.05, 0.12, 0, 0.025, Z0 - RUN - 0.06, C.concrete, { mat: 'stone' }))

export default defineModel({
  id: 'stair-public',
  name: '广场大台阶',
  category: 'structure',
  tags: ['stairs', 'public steps', 'plaza', '台阶', '广场', '大台阶'],
  footprint: [12, 2.4],
  height: 1.05,
  placement: 'outdoor',
  parts,
})
