import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 24m 高架标准段：桥面宽 9m，桥面顶 7.2m，箱梁底 5.66m（净空 5.66）。
 * 箱梁由两道腹板 + 底板组成；2 排双柱桥墩，柱距 8m，柱径 1.4m，
 * 盖梁顶 5.66 与梁底齐平，柱顶扩大头顶住盖梁。护栏 1.1m 混凝土 + 顶部钢扶手，
 * 护栏立柱每 3m 一道，桥面设排水口与两端伸缩缝。
 */
const LEN = 24
const DECK_TOP = 7.2
const DECK_T = 0.3
const ASPHALT_T = 0.08
const GIRDER_TOP = DECK_TOP - ASPHALT_T - DECK_T // 6.82
const WEB_H = 0.84
const BOT_TOP = GIRDER_TOP - WEB_H // 5.98
const BOT_T = 0.32
const SOFFIT = BOT_TOP - BOT_T // 5.66
const PAR_H = 1.1
const PAR_BASE = 0.08 // 护栏埋入桥面板的基座，可见高度仍 1.1
const PAR_X = 4.32
const PIER_Z = 7
const ASPHALT = '#3a3d40'
const LINE = '#e8e6df'

const parts: Part[] = []

// 箱梁底板 / 腹板 / 桥面板 / 沥青铺装
parts.push(box(8.4, BOT_T, LEN, 0, 5.82, 0, C.concrete, { mat: 'stone' }))
for (const x of [-4.05, 4.05]) {
  parts.push(box(0.4, WEB_H, LEN, x, 6.4, 0, C.concrete, { mat: 'stone' }))
}
parts.push(box(9, DECK_T, LEN, 0, 6.97, 0, C.concrete, { mat: 'stone' }))
parts.push(box(8.3, ASPHALT_T, LEN, 0, DECK_TOP - ASPHALT_T / 2, 0, ASPHALT))

// 外挑檐口与滴水线
for (const x of [-4.36, 4.36]) {
  parts.push(box(0.28, 0.55, LEN, x, 6.845, 0, C.concrete, { mat: 'stone' }))
  parts.push(box(0.28, 0.06, LEN, x, 6.54, 0, C.graphite))
}

// 混凝土护栏、压顶、踢脚与顶部钢扶手
for (const side of [-1, 1]) {
  const x = side * PAR_X
  parts.push(box(0.32, PAR_H + PAR_BASE, LEN, x, DECK_TOP - PAR_BASE + (PAR_H + PAR_BASE) / 2, 0, C.concrete, { mat: 'stone' }))
  parts.push(box(0.36, 0.06, LEN, x, DECK_TOP + PAR_H + 0.03, 0, C.cream, { mat: 'stone' }))
  parts.push(box(0.1, 0.18, LEN, side * 4.12, DECK_TOP + 0.09, 0, C.stone, { mat: 'stone' }))
  parts.push(box(0.05, 0.04, LEN, x, DECK_TOP + PAR_H + 0.08, 0, C.steel, { mat: 'metal' }))
}

// 护栏立柱（外侧面每 3m 一道，与压顶同高）
for (let i = 0; i < 8; i++) {
  const z = -10.5 + i * 3
  for (const side of [-1, 1]) {
    parts.push(box(0.04, PAR_H, 0.32, side * 4.48, DECK_TOP + PAR_H / 2, z, C.stone, { mat: 'stone' }))
  }
}

// 桥面排水口与外侧落水管
for (const z of [-8, 0, 8]) {
  for (const side of [-1, 1]) {
    parts.push(box(0.3, 0.014, 0.5, side * 3.95, DECK_TOP + 0.007, z, C.graphite, { mat: 'metal' }))
    parts.push(box(0.26, 0.006, 0.06, side * 3.95, DECK_TOP + 0.016, z, C.ink, { mat: 'metal' }))
  }
}
for (const z of [-10.6, 10.6]) {
  for (const side of [-1, 1]) {
    parts.push(cyl(0.06, 0.06, 0.5, side * 4.43, 6.6, z, C.graphite, { mat: 'metal' }, 10))
  }
}

// 车道虚线（4 段 3m）与两侧连续边线
for (const z of [-9, -3, 3, 9]) {
  parts.push(box(0.15, 0.012, 3, 0, DECK_TOP + 0.006, z, LINE))
}
for (const side of [-1, 1]) {
  parts.push(box(0.12, 0.012, LEN - 0.6, side * 3.86, DECK_TOP + 0.006, 0, LINE))
}

// 两端伸缩缝：暗缝 + 不锈钢盖板
for (const z of [-11.9, 11.9]) {
  parts.push(box(8.3, 0.02, 0.14, 0, DECK_TOP + 0.01, z, ASPHALT))
  parts.push(box(8.3, 0.016, 0.2, 0, DECK_TOP + 0.008, z - Math.sign(z) * 0.17, C.steel, { mat: 'metal' }))
}

// 2 排双柱桥墩：承台、圆柱、柱头、盖梁、系梁
for (const z of [-PIER_Z, PIER_Z]) {
  parts.push(box(7.0, 0.9, 2.4, 0, 0.45, z, C.concrete, { mat: 'stone' }))
  parts.push(box(8.6, 0.8, 1.5, 0, SOFFIT - 0.4, z, C.concrete, { mat: 'stone' }))
  parts.push(box(3.9, 0.55, 0.65, 0, 2.5, z, C.concrete, { mat: 'stone' }))
  for (const x of [-2.6, 2.6]) {
    parts.push(cyl(1.4, 1.4, 3.66, x, 2.73, z, C.concrete, { mat: 'stone' }, 20))
    parts.push(cyl(0.86, 0.74, 0.3, x, 4.71, z, C.concrete, { mat: 'stone' }, 20))
    parts.push(cyl(0.82, 0.88, 0.18, x, 1.0, z, C.concrete, { mat: 'stone' }, 20))
  }
}

export default defineModel({
  id: 'highway-deck',
  name: '高架桥面段',
  category: 'infrastructure',
  tags: ['highway', 'viaduct', '高架', '立交', '桥', '桥面'],
  footprint: [9, 24],
  height: 8.4,
  placement: 'outdoor',
  parts,
})
