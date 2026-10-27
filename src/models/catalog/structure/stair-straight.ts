import { C, box, cyl, defineModel, sphere } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 直跑楼梯：16 级，总升高 3.2，水平投影 3.0，梯宽 1.22。
 * 扶手的做法：立柱底部落在每级踏面中心，柱高 0.80；扶手中心线严格穿过所有柱顶，
 * 即 y(z) = 0.9 + (z + 1.5) * (3.2 / 3.0)。在 z = -1.5 处扶手高 0.9（首层地面），
 * 在 z = +1.5 处高 4.1（顶层平台上方 0.9）。因此柱顶与扶手中心线误差为 0。
 */
const STEPS = 16
const RISE = 0.2
const TREAD = 0.1875
const RUN = STEPS * TREAD // 3.0
const HALF_RUN = RUN / 2 // 1.5
const WIDTH = 1.22
const TOTAL_RISE = STEPS * RISE // 3.2
const RAIL_START_Y = 0.9
const POST_H = 0.8
const POST_R = 0.018
const POST_X = WIDTH / 2 - 0.03 // 0.58，距踏步边缘 3cm
const RAIL_ANGLE = Math.atan2(TOTAL_RISE, RUN) // 0.8176 rad
const RAIL_LEN = Math.hypot(RUN, TOTAL_RISE) // 4.3856

const stepTop = (i: number) => RISE * (i + 1)
const stepZ = (i: number) => -HALF_RUN + TREAD * (i + 0.5)
const stepFront = (i: number) => -HALF_RUN + TREAD * i
// 结构前缘线（通过各级踏步前缘），用于梯梁定位
const noseY = (z: number) => RISE + ((z + HALF_RUN) * RISE) / TREAD
// 扶手中心线：穿过全部柱顶
const railY = (z: number) => RAIL_START_Y + ((z + HALF_RUN) * TOTAL_RISE) / RUN

const PLAT_TOP = TOTAL_RISE // 3.2，与最后一级踏面同高
const PLAT_D = 0.6
const PLAT_Z0 = HALF_RUN
const PLAT_Z1 = PLAT_Z0 + PLAT_D // 2.1
const PLAT_W = 1.32

const parts: Part[] = []

// 踏板 + 踢面 + 黄铜防滑条
for (let i = 0; i < STEPS; i++) {
  const top = stepTop(i)
  const z = stepZ(i)
  const front = stepFront(i)
  parts.push(box(WIDTH, 0.06, TREAD, 0, top - 0.03, z, C.oak, { mat: 'wood' }))
  parts.push(box(WIDTH - 0.06, RISE - 0.02, 0.035, 0, top - RISE / 2, front + 0.0175, C.cream))
  parts.push(box(WIDTH - 0.1, 0.008, 0.022, 0, top + 0.004, front + 0.016, C.brass, { mat: 'metal' }))
}

// 顶部平台
parts.push(box(PLAT_W, 0.16, PLAT_D, 0, PLAT_TOP - 0.08, (PLAT_Z0 + PLAT_Z1) / 2, C.concrete, { mat: 'stone' }))
parts.push(box(PLAT_W + 0.04, 0.012, 0.05, 0, PLAT_TOP + 0.006, PLAT_Z0 + 0.025, C.brass, { mat: 'metal' }))
for (const side of [-1, 1]) {
  parts.push(box(0.08, PLAT_TOP - 0.16, 0.08, side * (PLAT_W / 2 - 0.1), (PLAT_TOP - 0.16) / 2, PLAT_Z1 - 0.1, C.walnut, { mat: 'wood' }))
  parts.push(box(0.18, 0.03, 0.18, side * (PLAT_W / 2 - 0.1), 0.015, PLAT_Z1 - 0.1, C.graphite, { mat: 'metal' }))
}

// 两侧梯梁（斜向 box，贴着踏步外缘，顶边压在前缘线上；下端切至地面）
const STR_Z0 = -1.3766 // 梁底刚好落到 y = 0
const STR_Z1 = 1.32 // 梁顶与最末一级踏面齐平
const STR_MID = (STR_Z0 + STR_Z1) / 2
const STR_LEN = (STR_Z1 - STR_Z0) * Math.hypot(1, RISE / TREAD)
const STR_DROP = 0.01 + 0.11 / Math.cos(RAIL_ANGLE) // 中心线相对前缘线的下沉量
for (const side of [-1, 1]) {
  parts.push(
    box(0.07, 0.22, STR_LEN, side * 0.645, noseY(STR_MID) - STR_DROP, STR_MID, C.walnut, {
      mat: 'wood',
      rot: [-RAIL_ANGLE, 0, 0],
    }),
  )
}

// 栏杆立柱：每级一根，柱底落在踏面中心，柱高 0.80
for (const side of [-1, 1]) {
  const x = side * POST_X
  for (let i = 0; i < STEPS; i++) {
    const bottom = stepTop(i)
    parts.push(cyl(POST_R, POST_R, POST_H, x, bottom + POST_H / 2, stepZ(i), C.blackMetal, { mat: 'metal' }, 8))
    parts.push(cyl(0.03, 0.033, 0.02, x, bottom + 0.01, stepZ(i), C.brass, { mat: 'metal' }, 10))
  }
}

// 倾斜扶手：中心线穿过所有柱顶，端点在 (±0.58, 0.9, -1.5) → (±0.58, 4.1, +1.5)
for (const side of [-1, 1]) {
  parts.push(box(0.07, 0.06, RAIL_LEN, side * POST_X, railY(0), 0, C.walnut, { mat: 'wood', rot: [-RAIL_ANGLE, 0, 0] }))
}

// 起步/顶端大立柱：Ø0.05，顶端黄铜球
for (const side of [-1, 1]) {
  const x = side * POST_X
  parts.push(cyl(0.025, 0.028, 0.9, x, 0.45, -HALF_RUN, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(cyl(0.055, 0.06, 0.025, x, 0.0125, -HALF_RUN, C.graphite, { mat: 'metal' }, 14))
  parts.push(sphere(0.032, x, 0.93, -HALF_RUN, C.brass, { mat: 'metal' }, 12))
  parts.push(cyl(0.025, 0.028, 0.9, x, PLAT_TOP + 0.45, HALF_RUN, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(sphere(0.032, x, PLAT_TOP + 0.93, HALF_RUN, C.brass, { mat: 'metal' }, 12))
}

// 平台栏杆：两侧水平扶手 + 端部横向扶手，全部落在 y = 4.1，与斜扶手同高相接
for (const side of [-1, 1]) {
  const x = side * POST_X
  parts.push(box(0.07, 0.06, PLAT_D, x, PLAT_TOP + 0.9, (PLAT_Z0 + PLAT_Z1) / 2, C.walnut, { mat: 'wood' }))
  for (const z of [PLAT_Z0 + 0.23, PLAT_Z0 + 0.47]) {
    parts.push(cyl(POST_R, POST_R, 0.9, x, PLAT_TOP + 0.45, z, C.blackMetal, { mat: 'metal' }, 8))
  }
  parts.push(cyl(0.025, 0.028, 0.9, x, PLAT_TOP + 0.45, PLAT_Z1, C.blackMetal, { mat: 'metal' }, 12))
  parts.push(sphere(0.032, x, PLAT_TOP + 0.93, PLAT_Z1, C.brass, { mat: 'metal' }, 12))
}
parts.push(box(POST_X * 2 + 0.07, 0.06, 0.07, 0, PLAT_TOP + 0.9, PLAT_Z1, C.walnut, { mat: 'wood' }))
parts.push(cyl(POST_R, POST_R, 0.9, 0, PLAT_TOP + 0.45, PLAT_Z1, C.blackMetal, { mat: 'metal' }, 8))

export default defineModel({
  id: 'stair-straight',
  name: '直跑楼梯',
  category: 'structure',
  tags: ['stairs', 'steps', 'handrail', '楼梯', '台阶', '直跑'],
  footprint: [1.8, 4.3],
  height: 4.2,
  placement: 'indoor',
  parts,
})
