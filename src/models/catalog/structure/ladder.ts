import { C, box, cyl, defineModel } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 贴墙检修爬梯（带护笼）：梯高 3.2m，出口扶手到 3.4m。
 * 两根 50mm 梯梁、10 根 Ø22 踏棍（间距 0.3m）。2.1m 起设护笼：
 * 2.1 / 2.9 / 3.4m 三道 U 形箍，3 根 Ø24 竖向笼条。墙板与支架把梯梁固定到墙面。
 * 模型中心在原点；护笼向墙外挑出 0.55m，因此 Z 向包围盒为 0.61m。
 */
const TOP = 3.2
const HIGH = 3.4
const SW = 0.52
const SX = SW / 2
const Z_STR = -0.24
const Z_WALL = -0.3
const Z_BACK = 0.28
const CAGE_X = 0.33
const parts: Part[] = []

// 梯梁、踏棍
for (const x of [-SX, SX]) {
  parts.push(box(0.05, TOP, 0.05, x, TOP / 2, Z_STR, C.steel, { mat: 'metal' }))
  parts.push(box(0.12, 0.04, 0.12, x, 0.02, Z_STR, C.graphite, { mat: 'metal' }))
}
for (let i = 1; i <= 10; i++) {
  const y = i * 0.3
  parts.push(cyl(0.011, 0.011, SW + 0.02, 0, y, Z_STR, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8))
}

// 墙面固定板与支架
for (const y of [0.5, 1.7, 2.9]) {
  parts.push(box(0.5, 0.12, 0.02, 0, y, Z_WALL, C.graphite, { mat: 'metal' }))
  for (const x of [-SX, SX]) {
    parts.push(box(0.04, 0.04, 0.07, x, y, Z_WALL + 0.045, C.steel, { mat: 'metal' }))
  }
}

// 顶部出口扶手
for (const x of [-SX, SX]) {
  parts.push(box(0.045, 0.2, 0.045, x, TOP + 0.1, Z_STR, C.blackMetal, { mat: 'metal' }))
}
parts.push(box(SW + 0.04, 0.045, 0.045, 0, HIGH - 0.02, Z_STR, C.blackMetal, { mat: 'metal' }))

// 护笼：三道 U 形箍（两侧沿 Z，背面横杆），3 根竖向笼条
for (const y of [2.1, 2.9, HIGH]) {
  for (const x of [-CAGE_X, CAGE_X]) {
    parts.push(box(0.04, 0.04, Z_BACK - Z_STR + 0.04, x, y, (Z_BACK + Z_STR) / 2, C.steel, { mat: 'metal' }))
    parts.push(box(0.1, 0.04, 0.04, x * 0.9, y, Z_STR, C.steel, { mat: 'metal' }))
  }
  parts.push(box(CAGE_X * 2 + 0.04, 0.04, 0.04, 0, y, Z_BACK, C.steel, { mat: 'metal' }))
}
for (const x of [-0.3, 0, 0.3]) {
  parts.push(cyl(0.012, 0.012, HIGH - 2.1, x, (HIGH + 2.1) / 2, Z_BACK - 0.02, C.steel, { mat: 'metal' }, 8))
}

// 护笼与梯梁之间的连接短杆
for (const y of [2.1, 2.9, HIGH]) {
  for (const x of [-SX, SX]) {
    parts.push(box(0.1, 0.035, 0.035, x * 1.12, y, Z_STR, C.steel, { mat: 'metal' }))
  }
}

export default defineModel({
  id: 'ladder',
  name: '检修爬梯',
  category: 'structure',
  tags: ['ladder', 'service ladder', 'caged ladder', '爬梯', '检修梯', '护笼'],
  footprint: [0.7, 0.62],
  height: 3.42,
  placement: 'outdoor',
  parts,
})
