import { C, box, cyl, defineModel, prism, sphere } from '../../kit'
import type { Part, Vec2 } from '../../../editor/types'

/*
 * 方形旋转楼梯：2.0m 见方梯井，中心 260mm 方柱，绕柱 360° 共 16 级，
 * 每级 22.5° / 踢面 0.20，顶层 3.20。踏板为 4 点扇形 prism（内窄外宽），
 * 外侧 16 段螺旋扶手：起步柱 + 16 根踏面柱，16 段三维扶手首尾相接。
 * 地面加 2.4m 方形梯口收边，使整体 footprint 与 2.4 对齐。
 */
const RISE = 0.2
const STEPS = 16
const DA = (Math.PI * 2) / STEPS
const RIN = 0.2
const ROUT = 1.0
const RP = 0.94
const PH = 0.9 - RISE / 2 // 0.80
const TOP = RISE * STEPS // 3.2
const parts: Part[] = []

const railSeg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const len = Math.hypot(dx, dy, dz) + 0.008
  return box(len, 0.05, 0.05, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, C.walnut, {
    mat: 'wood',
    rot: [0, Math.atan2(-dz, dx), Math.asin(dy / Math.hypot(dx, dy, dz))],
  })
}

// 扇形踏板 + 径向踢面 + 铜防滑条
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
  parts.push(prism(pts, 0.06, 0, top - 0.03, 0, C.oak, { mat: 'wood', rot: [Math.PI / 2, 0, 0] }))
  const rm = 0.6
  parts.push(box(0.78, RISE - 0.02, 0.028, rm * Math.cos(a0), top - RISE / 2, rm * Math.sin(a0), C.cream, {
    rot: [0, -a0, 0],
  }))
  parts.push(box(0.76, 0.008, 0.022, rm * Math.cos(a0), top + 0.004, rm * Math.sin(a0), C.brass, {
    mat: 'metal',
    rot: [0, -a0, 0],
  }))
}

// 外侧螺旋梯梁，16 段贴着踏步外缘
for (let i = 0; i < STEPS; i++) {
  const a0 = i * DA
  const a1 = (i + 1) * DA
  const ax = 0.97 * Math.cos(a0)
  const az = 0.97 * Math.sin(a0)
  const bx = 0.97 * Math.cos(a1)
  const bz = 0.97 * Math.sin(a1)
  const y0 = RISE * (i + 1) - 0.05
  const y1 = RISE * (i + 2) - 0.05
  const horiz = Math.hypot(bx - ax, bz - az)
  const dy = y1 - y0
  const len = Math.hypot(horiz, dy) + 0.01
  const pitch = Math.asin(dy / Math.hypot(horiz, dy))
  const drop = 0.01 + 0.06 / Math.cos(pitch)
  parts.push(box(len, 0.12, 0.05, (ax + bx) / 2, (y0 + y1) / 2 - drop, (az + bz) / 2, C.walnut, {
    mat: 'wood',
    rot: [0, Math.atan2(-(bz - az), bx - ax), pitch],
  }))
}

// 中心方柱、柱础、柱帽与铜箍
parts.push(box(0.72, 0.06, 0.72, 0, 0.03, 0, C.stone, { mat: 'stone' }))
parts.push(box(0.26, 4.16, 0.26, 0, 2.08, 0, C.graphite, { mat: 'metal' }))
parts.push(box(0.36, 0.04, 0.36, 0, 4.18, 0, C.brass, { mat: 'metal' }))
for (const y of [0.2, 3.18]) {
  parts.push(box(0.29, 0.015, 0.29, 0, y, 0, C.brass, { mat: 'metal' }))
}

// 起步柱与每级立柱（柱脚落在踏面中心）
const aNewel = -DA / 2
parts.push(cyl(0.025, 0.028, 0.9, RP * Math.cos(aNewel), 0.45, RP * Math.sin(aNewel), C.blackMetal, { mat: 'metal' }, 12))
parts.push(cyl(0.055, 0.06, 0.025, RP * Math.cos(aNewel), 0.0125, RP * Math.sin(aNewel), C.graphite, { mat: 'metal' }, 14))
parts.push(sphere(0.032, RP * Math.cos(aNewel), 0.93, RP * Math.sin(aNewel), C.brass, { mat: 'metal' }, 12))
for (let i = 0; i < STEPS; i++) {
  const a = (i + 0.5) * DA
  const x = RP * Math.cos(a)
  const z = RP * Math.sin(a)
  const bottom = RISE * (i + 1)
  parts.push(cyl(0.018, 0.018, PH, x, bottom + PH / 2, z, C.blackMetal, { mat: 'metal' }, 8))
  parts.push(cyl(0.03, 0.033, 0.02, x, bottom + 0.01, z, C.brass, { mat: 'metal' }, 10))
}

// 16 段外扶手：起步柱柱顶 -> 第一根立柱，再逐级相连
parts.push(railSeg(RP * Math.cos(aNewel), 0.9, RP * Math.sin(aNewel), RP * Math.cos(DA / 2), RISE + PH, RP * Math.sin(DA / 2)))
for (let i = 0; i < STEPS - 1; i++) {
  const a0 = (i + 0.5) * DA
  const a1 = (i + 1.5) * DA
  parts.push(railSeg(
    RP * Math.cos(a0), RISE * (i + 1) + PH, RP * Math.sin(a0),
    RP * Math.cos(a1), RISE * (i + 2) + PH, RP * Math.sin(a1),
  ))
}
parts.push(sphere(0.026, RP * Math.cos((STEPS - 0.5) * DA), TOP + PH + 0.02, RP * Math.sin((STEPS - 0.5) * DA), C.brass, { mat: 'metal' }, 10))

// 2.4m 方形梯口收边
parts.push(box(2.4, 0.03, 0.08, 0, 0.015, 1.16, C.graphite, { mat: 'metal' }))
parts.push(box(2.4, 0.03, 0.08, 0, 0.015, -1.16, C.graphite, { mat: 'metal' }))
parts.push(box(0.08, 0.03, 2.24, 1.16, 0.015, 0, C.graphite, { mat: 'metal' }))
parts.push(box(0.08, 0.03, 2.24, -1.16, 0.015, 0, C.graphite, { mat: 'metal' }))

export default defineModel({
  id: 'stair-spiral-square',
  name: '方形旋转楼梯',
  category: 'structure',
  tags: ['spiral stair', 'square stairwell', '旋转楼梯', '方形', '中柱楼梯'],
  footprint: [2.4, 2.4],
  height: 4.2,
  placement: 'indoor',
  parts,
})
