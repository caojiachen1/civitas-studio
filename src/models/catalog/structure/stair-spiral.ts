import { C, box, cyl, defineModel, sphere, torus } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 螺旋楼梯：18 级，中柱半径 0.12。
 * 踏板 0.9（径向）× 0.3（切向），中心半径 0.38 → 内缘 -0.07、外缘 0.83。
 * 每级栏杆立柱放在 r = 0.80（踏面外缘以内 3cm），柱底在踏面顶，柱高 0.90；
 * 扶手由 17 段短线逐段连接相邻柱顶（r = 0.80，y = 踏面顶 + 0.9），线段按三维方向旋转，
 * 首尾相接无断头；顶部平台外缘再做水平扶手。
 */
const STEPS = 18
const RISE = 0.18
const DA = Math.PI / 10 // 每级 18°
const START = -17 * DA // 最后一级落在 0°，出口朝 +x
const CENTER_R = 0.38
const TREAD_RADIAL = 0.9
const TREAD_WIDTH = 0.3
const OUTER_R = CENTER_R + TREAD_RADIAL / 2 // 0.83
const POST_RADIUS = OUTER_R - 0.03 // 0.80
const POST_H = 0.9
const POST_R = 0.018
const COLUMN_R = 0.12
const TOP_Y = STEPS * RISE // 3.24，最后一级踏面
const LAND_TOP = TOP_Y

const angle = (i: number) => START + i * DA
const treadTop = (i: number) => RISE * (i + 1)

// 顶部平台（最后一级外侧的出口平台）
const LAND_X0 = OUTER_R // 0.83，与最后一级踏板外缘相接
const LAND_X1 = 1.18
const LAND_HALF_Z = 0.36
const LAND_T = 0.14
const LAND_POST_X = LAND_X0 + 0.03 // 0.86
const LAND_RAIL_X = LAND_X1 - 0.03 // 1.15
const LAND_RAIL_Z = LAND_HALF_Z - 0.03 // 0.33
const LAND_RAIL_Y = LAND_TOP + 0.9 // 4.14

// 按三维方向摆放的栏杆线段（长边沿局部 X）
const railSegment = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const len = Math.hypot(dx, dy, dz)
  const yaw = Math.atan2(-dz, dx)
  const pitch = Math.asin(dy / len)
  return box(len, 0.05, 0.05, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, C.walnut, {
    mat: 'wood',
    rot: [0, yaw, pitch],
  })
}

const parts: Part[] = []

// 踏板（第 18 级 = 顶部平台前的最后一级）
for (let i = 0; i < STEPS; i++) {
  const a = angle(i)
  const cx = Math.cos(a) * CENTER_R
  const cz = Math.sin(a) * CENTER_R
  const top = treadTop(i)
  parts.push(box(TREAD_RADIAL, 0.07, TREAD_WIDTH, cx, top - 0.035, cz, C.oak, { mat: 'wood', rot: [0, -a, 0] }))
  // 前缘黄铜防滑条（沿 -切向一侧的踏面边缘）
  parts.push(
    box(0.8, 0.006, 0.03, cx + Math.sin(a) * 0.12, top + 0.003, cz - Math.cos(a) * 0.12, C.brass, {
      mat: 'metal',
      rot: [0, -a, 0],
    }),
  )
  // 踏板底部支撑筋
  parts.push(
    box(0.55, 0.03, 0.05, Math.cos(a) * 0.42, top - 0.085, Math.sin(a) * 0.42, C.graphite, {
      mat: 'metal',
      rot: [0, -a, 0],
    }),
  )
}

// 中柱 / 底座 / 柱帽 / 地脚螺栓
parts.push(cyl(COLUMN_R, COLUMN_R + 0.015, 3.45, 0, 1.725, 0, C.graphite, { mat: 'metal' }, 20))
parts.push(cyl(0.46, 0.48, 0.1, 0, 0.05, 0, C.stone, { mat: 'stone' }, 24))
parts.push(cyl(0.14, 0.12, 0.06, 0, 3.48, 0, C.brass, { mat: 'metal' }, 16))
parts.push(torus(0.135, 0.012, 0, 3.3, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 18))
parts.push(torus(0.135, 0.012, 0, 3.39, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 18))
for (let i = 0; i < 6; i++) {
  const a = (i * Math.PI) / 3
  parts.push(sphere(0.015, Math.cos(a) * 0.36, 0.107, Math.sin(a) * 0.36, C.steel, { mat: 'metal' }, 8))
}

// 栏杆立柱：每级一根，柱底落在踏面外缘以内 3cm 处
for (let i = 0; i < STEPS; i++) {
  const a = angle(i)
  const x = Math.cos(a) * POST_RADIUS
  const z = Math.sin(a) * POST_RADIUS
  const bottom = treadTop(i)
  parts.push(cyl(POST_R, POST_R, POST_H, x, bottom + POST_H / 2, z, C.blackMetal, { mat: 'metal' }, 8))
  parts.push(cyl(0.03, 0.033, 0.02, x, bottom + 0.01, z, C.brass, { mat: 'metal' }, 10))
}

// 扶手：17 段连接 18 根柱顶
for (let i = 0; i < STEPS - 1; i++) {
  const a0 = angle(i)
  const a1 = angle(i + 1)
  parts.push(
    railSegment(
      Math.cos(a0) * POST_RADIUS,
      treadTop(i) + 0.9,
      Math.sin(a0) * POST_RADIUS,
      Math.cos(a1) * POST_RADIUS,
      treadTop(i + 1) + 0.9,
      Math.sin(a1) * POST_RADIUS,
    ),
  )
}

// 起步 / 收头柱头
{
  const aStart = angle(0)
  parts.push(sphere(0.03, Math.cos(aStart) * POST_RADIUS, treadTop(0) + 0.92, Math.sin(aStart) * POST_RADIUS, C.brass, { mat: 'metal' }, 12))
  const aEnd = angle(STEPS - 1)
  parts.push(sphere(0.03, Math.cos(aEnd) * POST_RADIUS, treadTop(STEPS - 1) + 0.92, Math.sin(aEnd) * POST_RADIUS, C.brass, { mat: 'metal' }, 12))
}

// 顶部平台
parts.push(box(LAND_X1 - LAND_X0, LAND_T, LAND_HALF_Z * 2, (LAND_X0 + LAND_X1) / 2, LAND_TOP - LAND_T / 2, 0, C.concrete, { mat: 'stone' }))
parts.push(box(0.04, 0.012, LAND_HALF_Z * 2 - 0.04, LAND_X0 + 0.02, LAND_TOP + 0.006, 0, C.brass, { mat: 'metal' }))
// 平台支撑柱
parts.push(box(0.07, LAND_TOP - LAND_T, 0.07, LAND_X1 - 0.08, (LAND_TOP - LAND_T) / 2, 0, C.graphite, { mat: 'metal' }))
parts.push(box(0.16, 0.03, 0.16, LAND_X1 - 0.08, 0.015, 0, C.blackMetal, { mat: 'metal' }))
// 平台水平扶手（外缘 + 两侧），与最后一级扶手柱同高
parts.push(box(0.05, 0.06, LAND_RAIL_Z * 2, LAND_RAIL_X, LAND_RAIL_Y, 0, C.walnut, { mat: 'wood' }))
for (const side of [-1, 1]) {
  parts.push(box(LAND_RAIL_X - LAND_POST_X, 0.06, 0.05, (LAND_POST_X + LAND_RAIL_X) / 2, LAND_RAIL_Y, side * LAND_RAIL_Z, C.walnut, { mat: 'wood' }))
  for (const x of [LAND_POST_X, LAND_RAIL_X]) {
    parts.push(cyl(POST_R, POST_R, 0.9, x, LAND_TOP + 0.45, side * LAND_RAIL_Z, C.blackMetal, { mat: 'metal' }, 8))
  }
  parts.push(sphere(0.028, LAND_RAIL_X, LAND_RAIL_Y + 0.03, side * LAND_RAIL_Z, C.brass, { mat: 'metal' }, 10))
}
parts.push(cyl(POST_R, POST_R, 0.9, LAND_RAIL_X, LAND_TOP + 0.45, 0, C.blackMetal, { mat: 'metal' }, 8))

export default defineModel({
  id: 'stair-spiral',
  name: '螺旋楼梯',
  category: 'structure',
  tags: ['spiral stair', 'stairs', 'handrail', '螺旋楼梯', '旋转楼梯'],
  footprint: [2.4, 1.9],
  height: 4.2,
  placement: 'indoor',
  parts,
})
