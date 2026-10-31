import { C, box, cyl, defineModel, prism, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 收费站：场地 13.5×14，3 条 3.3m 车道 + 3 条 1.2m 收费岛。
 * 雨棚 13.2×5.2，顶 5.5，6 根钢柱落在岛上（避开收费亭）；
 * 3 个尖顶收费亭（玻璃窗、窗台、外挑收费台、后门）、岛头防撞桶、
 * 3 条减速带，进口限高门架净高 5.3、总高 6.5。
 */
const PAD_W = 13.5
const PAD_D = 14
const ASPHALT = '#3a3d40'
const LINE = '#e8e6df'
const YELLOW = '#e0b23a'
const BOOTH_X = [-6.0, -1.5, 3.0]
const LANE_X = [-3.9, 0.6, 5.1]

const parts: Part[] = []

// 场地、边线、停止线
parts.push(box(PAD_W, 0.04, PAD_D, 0, 0.02, 0, ASPHALT))
for (const s of [-1, 1]) {
  parts.push(box(0.1, 0.006, 13.6, s * 6.6, 0.043, 0, LINE))
}
for (const x of LANE_X) {
  parts.push(box(3.0, 0.006, 0.25, x, 0.043, -2.9, LINE))
}

// 3 条收费岛：主体 + 半圆岛头 + 红白警示带
for (const x of BOOTH_X) {
  parts.push(box(1.2, 0.18, 5.4, x, 0.13, -0.3, C.concrete, { mat: 'stone' }))
  parts.push(cyl(0.6, 0.6, 0.18, x, 0.13, -3.0, C.concrete, { mat: 'stone' }, 20))
  parts.push(box(1.2, 0.02, 0.55, x, 0.23, -2.72, C.red))
}

// 岛头防撞桶（外侧两条岛）
for (const x of [-6.0, 3.0]) {
  parts.push(cyl(0.26, 0.28, 0.75, x, 0.595, -3.25, YELLOW, { mat: 'matte' }, 16))
  for (const y of [0.42, 0.72]) {
    parts.push(cyl(0.285, 0.285, 0.08, x, y, -3.25, C.blackMetal, { mat: 'matte' }, 16))
  }
  parts.push(cyl(0.27, 0.27, 0.03, x, 0.985, -3.25, C.graphite, { mat: 'metal' }, 16))
}

// 3 个收费亭：底座、亭身、双侧玻璃、收费台、门、尖顶
for (const x of BOOTH_X) {
  parts.push(box(1.4, 0.08, 2.7, x, 0.26, 0, C.concrete, { mat: 'stone' }))
  parts.push(box(1.3, 2.6, 2.6, x, 1.6, 0, C.cream))
  for (const s of [-1, 1]) {
    parts.push(box(0.04, 1.5, 2.2, x + s * 0.66, 1.9, 0, C.blackMetal))
    parts.push(box(0.02, 1.35, 2.05, x + s * 0.685, 1.9, 0, C.glass, { mat: 'glass' }))
    parts.push(box(0.12, 0.08, 2.25, x + s * 0.70, 1.19, 0, C.steel, { mat: 'metal' }))
    parts.push(box(0.05, 0.06, 2.2, x + s * 0.67, 2.62, 0, C.steel, { mat: 'metal' }))
    parts.push(box(0.04, 1.35, 0.05, x + s * 0.70, 1.9, 0, C.blackMetal))
  }
  parts.push(box(0.22, 0.05, 0.95, x + 0.78, 1.03, 0.35, C.steel, { mat: 'metal' }))
  parts.push(box(0.04, 0.32, 0.04, x + 0.70, 0.87, 0.35, C.steel, { mat: 'metal' }))
  parts.push(box(0.7, 2.05, 0.05, x, 1.375, -1.325, C.cream))
  parts.push(box(0.03, 0.12, 0.03, x + 0.25, 1.2, -1.36, C.brass, { mat: 'metal' }))
  parts.push(box(1.5, 0.08, 2.9, x, 2.94, 0, C.cream, { mat: 'stone' }))
  parts.push(prism([[-0.75, 0], [0.75, 0], [0, 0.5]], 2.9, x, 2.98, 0, C.red, { mat: 'gloss' }))
  parts.push(box(0.14, 0.06, 3.0, x, 3.5, 0, C.cream))
  parts.push(box(0.03, 0.24, 0.9, x + 0.665, 2.77, 0, C.navy))
  parts.push(box(0.01, 0.08, 0.7, x + 0.681, 2.77, 0, C.white))
}

// 雨棚：顶板、浅色底面、四周封檐、6 根柱（落在三条岛上，避开亭子）
parts.push(box(13.2, 0.3, 5.2, 0, 5.35, 0, C.steel, { mat: 'metal' }))
parts.push(box(12.9, 0.03, 4.9, 0, 5.185, 0, C.cream))
for (const z of [-2.66, 2.66]) {
  parts.push(box(13.44, 0.45, 0.12, 0, 5.32, z, C.cream, { mat: 'metal' }))
}
for (const x of [-6.66, 6.66]) {
  parts.push(box(0.12, 0.45, 5.2, x, 5.32, 0, C.cream, { mat: 'metal' }))
}
for (const x of [-6.4, -1.75, 3.3]) {
  for (const z of [-2.2, 2.2]) {
    parts.push(box(0.6, 0.2, 0.6, x, 0.14, z, C.concrete, { mat: 'stone' }))
    parts.push(box(0.44, 0.04, 0.44, x, 0.26, z, C.graphite, { mat: 'metal' }))
    parts.push(cyl(0.175, 0.175, 4.92, x, 2.74, z, C.graphite, { mat: 'metal' }, 16))
  }
}
for (const x of LANE_X) {
  parts.push(box(0.18, 0.03, 4.2, x, 5.17, 0, C.cream, { mat: 'emissive' }))
}
parts.push(box(3.4, 0.6, 0.06, 0, 5.25, 2.74, C.leafDeep, { mat: 'gloss' }))
parts.push(box(2.9, 0.1, 0.02, 0, 5.12, 2.775, C.white, { mat: 'gloss' }))

// 限高门架：双柱、横梁、黄黑警示条、限高牌、红色警示灯
for (const s of [-1, 1]) {
  parts.push(box(0.44, 0.2, 0.44, s * 6.5, 0.14, -5.2, C.concrete, { mat: 'stone' }))
  parts.push(box(0.34, 0.04, 0.34, s * 6.5, 0.26, -5.2, C.graphite, { mat: 'metal' }))
  parts.push(cyl(0.1, 0.1, 5.22, s * 6.5, 2.89, -5.2, C.graphite, { mat: 'metal' }, 14))
  parts.push(box(0.08, 1.63, 0.08, s * 5.9, 4.95, -5.2, C.graphite, {
    mat: 'metal',
    rot: [0, 0, s * 0.742],
  }))
}
parts.push(box(13.0, 0.35, 0.4, 0, 5.5, -5.2, C.steel, { mat: 'metal' }))
for (const x of [-4.8, -1.6, 1.6, 4.8]) {
  parts.push(box(0.4, 0.35, 0.02, x, 5.5, -5.41, YELLOW))
}
parts.push(box(3.2, 0.85, 0.08, 0, 5.975, -5.2, C.cream))
parts.push(box(2.9, 0.65, 0.01, 0, 5.975, -5.245, C.white))
parts.push(box(0.5, 0.1, 0.01, 0, 5.975, -5.251, C.red))
parts.push(sphere(0.06, 0, 6.44, -5.2, C.red, { mat: 'emissive' }, 12))

// 3 条减速带
for (const x of LANE_X) {
  parts.push(box(3.0, 0.07, 0.45, x, 0.075, 4.8, C.blackMetal, { mat: 'matte' }))
  parts.push(box(3.0, 0.01, 0.12, x, 0.115, 4.8, YELLOW))
}

export default defineModel({
  id: 'toll-booth',
  name: '收费站',
  category: 'infrastructure',
  tags: ['toll', 'booth', 'plaza', '收费站', '收费亭', '雨棚'],
  footprint: [13.5, 14],
  height: 6.5,
  placement: 'outdoor',
  parts,
})
