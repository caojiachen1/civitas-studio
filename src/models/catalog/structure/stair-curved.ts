import { C, box, cyl, defineModel, prism, sphere } from '../../kit'
import type { Part, Vec2 } from '../../../editor/types'

/*
 * 90° 弧形楼梯。内半径 1.2 / 外半径 2.4，18 级，踢面 0.16。
 * 踏板用 4 点扇形 prism（内侧窄、外侧宽），踢面为径向立板，防滑条沿前缘径向布置。
 * 外侧扶手 18 段：起步柱 → 18 根踏面柱，逐段用三维弦长连接，Y 轴偏航取切线角，
 * 相邻段长度按两柱顶距离反算并留 1cm 搭接，首尾严格相接。内外各一道螺旋梯梁。
 */
const RISE = 0.16
const STEPS = 18
const DA = Math.PI / 2 / STEPS
const RIN = 1.2
const ROUT = 2.4
const CX = -1.2
const CZ = -1.2 // 四分之一圆弧的圆心，使包围盒居中
const TOP = RISE * STEPS
const RP = ROUT - 0.06
const PH = 0.9 - RISE / 2
const parts: Part[] = []

const railSeg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const len = Math.hypot(dx, dy, dz) + 0.01
  const yaw = Math.atan2(-dz, dx)
  const pitch = Math.asin(dy / Math.hypot(dx, dy, dz))
  return box(len, 0.05, 0.05, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, C.walnut, {
    mat: 'wood',
    rot: [0, yaw, pitch],
  })
}

// 扇形踏板 / 径向踢面 / 径向黄铜防滑条
for (let i = 0; i < STEPS; i++) {
  const a0 = i * DA
  const a1 = (i + 1) * DA
  const top = RISE * (i + 1)
  const pts: Vec2[] = [
    [RIN * Math.cos(a0), RIN * Math.sin(a0)],
    [ROUT * Math.cos(a0), ROUT * Math.sin(a0)],
    [ROUT * Math.cos(a1), ROUT * Math.sin(a1)],
    [RIN * Math.cos(a1), RIN * Math.sin(a1)],
  ]
  parts.push(prism(pts, RISE - 0.01, CX, top - (RISE - 0.01) / 2, CZ, C.walnut, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }))
  parts.push(prism(pts, 0.03, CX, top - 0.015, CZ, C.oak, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }))
  const rm = (RIN + ROUT) / 2
  parts.push(
    box(1.18, RISE - 0.02, 0.028, CX + rm * Math.cos(a0), top - RISE / 2, CZ + rm * Math.sin(a0), C.cream, {
      rot: [0, -a0, 0],
    }),
  )
  parts.push(
    box(1.16, 0.008, 0.022, CX + rm * Math.cos(a0), top + 0.004, CZ + rm * Math.sin(a0), C.brass, {
      mat: 'metal',
      rot: [0, -a0, 0],
    }),
  )
}

// 内外螺旋梯梁：每两段踏步一根弦杆，9 x 2 段
for (let s = 0; s < 9; s++) {
  const j0 = s * 2
  const j1 = Math.min(j0 + 2, STEPS)
  const a0 = j0 * DA
  const a1 = j1 * DA
  const y0 = RISE * (j0 + 1)
  const y1 = RISE * Math.min(j1 + 1, STEPS)
  for (const r of [RIN - 0.03, ROUT + 0.02]) {
    const ax = CX + r * Math.cos(a0)
    const az = CZ + r * Math.sin(a0)
    const bx = CX + r * Math.cos(a1)
    const bz = CZ + r * Math.sin(a1)
    const horiz = Math.hypot(bx - ax, bz - az)
    const dy = y1 - y0
    const len = Math.hypot(horiz, dy) + 0.01
    const yaw = Math.atan2(-(bz - az), bx - ax)
    const pitch = Math.asin(dy / Math.hypot(horiz, dy))
    const h = r < RIN ? 0.08 : 0.14
    const drop = 0.01 + h / 2 / Math.cos(pitch)
    parts.push(box(len, h, 0.06, (ax + bx) / 2, (y0 + y1) / 2 - drop, (az + bz) / 2, C.walnut, {
      mat: 'wood',
      rot: [0, yaw, pitch],
    }))
  }
}

// 三道钢支柱，把上段梯梁落到地面
for (const a of [0.55, 1.0, 1.35]) {
  const i = Math.min(STEPS - 1, Math.floor(a / DA))
  const h = RISE * (i + 1) - 0.05
  const x = CX + 1.8 * Math.cos(a)
  const z = CZ + 1.8 * Math.sin(a)
  parts.push(cyl(0.058, 0.064, h, x, h / 2, z, C.graphite, { mat: 'metal' }, 12))
  parts.push(box(0.22, 0.03, 0.22, x, 0.015, z, C.blackMetal, { mat: 'metal' }))
}

// 起步柱（柱脚在地面）+ 每级外侧立柱（柱脚在踏面中心）
const aNewel = -DA * 0.4
parts.push(cyl(0.025, 0.028, 0.9, CX + RP * Math.cos(aNewel), 0.45, CZ + RP * Math.sin(aNewel), C.blackMetal, { mat: 'metal' }, 12))
parts.push(cyl(0.055, 0.06, 0.025, CX + RP * Math.cos(aNewel), 0.0125, CZ + RP * Math.sin(aNewel), C.graphite, { mat: 'metal' }, 14))
parts.push(sphere(0.032, CX + RP * Math.cos(aNewel), 0.93, CZ + RP * Math.sin(aNewel), C.brass, { mat: 'metal' }, 12))
for (let i = 0; i < STEPS; i++) {
  const a = (i + 0.5) * DA
  const x = CX + RP * Math.cos(a)
  const z = CZ + RP * Math.sin(a)
  const bottom = RISE * (i + 1)
  parts.push(cyl(0.018, 0.018, PH, x, bottom + PH / 2, z, C.blackMetal, { mat: 'metal' }, 8))
  parts.push(cyl(0.03, 0.033, 0.02, x, bottom + 0.01, z, C.brass, { mat: 'metal' }, 10))
}

// 18 段外扶手：起步柱柱顶 -> 第一根立柱，然后逐级相连
parts.push(railSeg(CX + RP * Math.cos(aNewel), 0.9, CZ + RP * Math.sin(aNewel), CX + RP * Math.cos(DA / 2), RISE + PH, CZ + RP * Math.sin(DA / 2)))
for (let i = 0; i < STEPS - 1; i++) {
  const a0 = (i + 0.5) * DA
  const a1 = (i + 1.5) * DA
  parts.push(railSeg(
    CX + RP * Math.cos(a0), RISE * (i + 1) + PH, CZ + RP * Math.sin(a0),
    CX + RP * Math.cos(a1), RISE * (i + 2) + PH, CZ + RP * Math.sin(a1),
  ))
}
parts.push(sphere(0.026, CX + RP * Math.cos((STEPS - 0.5) * DA), TOP + PH + 0.02, CZ + RP * Math.sin((STEPS - 0.5) * DA), C.brass, { mat: 'metal' }, 10))

export default defineModel({
  id: 'stair-curved',
  name: '弧形楼梯',
  category: 'structure',
  tags: ['stairs', 'curved stair', 'quarter turn', '弧形楼梯', '旋转楼梯'],
  footprint: [2.6, 2.6],
  height: 3.77,
  placement: 'indoor',
  parts,
})
