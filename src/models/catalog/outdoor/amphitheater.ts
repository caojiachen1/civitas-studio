import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part } from '../../../editor/types'

const parts: Part[] = []
const SEG = 16
const STEP = Math.PI / SEG
const CZ = -3.5 // centre of the seating arc
const TONES = [C.stone, '#8f8e86', C.stone, '#8f8e86', C.concrete]

// five tiers, 0.8 m deep, rising 0.4 m; ends omitted to form two side aisles
for (let t = 0; t < 5; t++) {
  const rIn = 4 + t * 0.8
  const rOut = rIn + 0.8
  const rMid = (rIn + rOut) / 2
  const w = 2 * rOut * Math.sin(STEP / 2) * 1.04
  const h = 0.4 * (t + 1)
  for (let s = 1; s < SEG - 1; s++) {
    const a = -Math.PI / 2 + (s + 0.5) * STEP
    parts.push(box(w, h, 0.84, Math.sin(a) * rMid, h / 2, CZ + Math.cos(a) * rMid, TONES[t], { mat: 'stone', rot: [0, a, 0] }))
  }
}

// stepped side aisles inside the two openings
for (const ang of [-Math.PI / 2 + 0.098, Math.PI / 2 - 0.098]) {
  for (let t = 0; t < 5; t++) {
    const r = 4.4 + t * 0.8
    const h = 0.4 * (t + 1)
    parts.push(box(0.82, h, 0.84, Math.sin(ang) * r, h / 2, CZ + Math.cos(ang) * r, C.cream, { mat: 'stone', rot: [0, ang, 0] }))
  }
}

// outer retaining parapet on the top tier, 2.2 m overall height
for (let s = 1; s < SEG - 1; s++) {
  const a = -Math.PI / 2 + (s + 0.5) * STEP
  const r = 7.84
  parts.push(box(1.64, 0.24, 0.34, Math.sin(a) * r, 2.1, CZ + Math.cos(a) * r, '#8a8880', { mat: 'stone', rot: [0, a, 0] }))
}

// semicircular stage: 3.6 m radius, 0.4 m high, with a stone nosing band
const stagePts: [number, number][] = []
for (let i = 0; i <= 16; i++) {
  const a = Math.PI + (i / 16) * Math.PI
  stagePts.push([Math.cos(a) * 3.6, Math.sin(a) * 3.6])
}
parts.push(prism(stagePts, 0.4, 0, 0.2, CZ, C.walnut, { mat: 'wood', rot: [-Math.PI / 2, 0, 0] }))
for (let i = 0; i < 12; i++) {
  const a = -Math.PI / 2 + ((i + 0.5) / 12) * Math.PI
  parts.push(box(0.94, 0.06, 0.16, Math.sin(a) * 3.5, 0.37, CZ + Math.cos(a) * 3.5, C.oak, { mat: 'wood', rot: [0, a, 0] }))
}
parts.push(cyl(0.03, 0.03, 1.6, -2.1, 0.42, CZ + 1.9, C.ink, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 10))
parts.push(cyl(0.03, 0.03, 1.6, 2.1, 0.42, CZ + 1.9, C.ink, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 10))

// backstage apron behind the stage, closing the 9 m depth
parts.push(box(9, 0.4, 1, 0, 0.2, -4.0, C.concrete, { mat: 'stone' }))
parts.push(box(8.8, 1.0, 0.18, 0, 0.5, -4.4, '#9a988f', { mat: 'stone' }))
for (const x of [-1.6, 1.6]) {
  parts.push(box(0.9, 0.55, 0.025, x, 0.675, -4.305, C.navy, { mat: 'gloss' }))
  parts.push(box(0.04, 0.18, 0.04, x + 0.36, 0.68, -4.29, C.steel, { mat: 'metal' }))
}
for (const x of [-3.4, 3.4]) {
  parts.push(cyl(0.09, 0.09, 0.12, x, 0.82, -4.29, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12))
  parts.push(cyl(0.06, 0.06, 0.02, x, 0.82, -4.22, '#ffe9c4', { mat: 'emissive' }, 12))
}

// guide bollards at the head of both aisles
for (const ang of [Math.PI / 2 - 0.05, Math.PI / 2 - 0.146, -Math.PI / 2 + 0.05, -Math.PI / 2 + 0.146]) {
  parts.push(cyl(0.05, 0.06, 0.2, Math.sin(ang) * 7.6, 2.1, CZ + Math.cos(ang) * 7.6, C.cream, { mat: 'stone' }, 8))
}

export default defineModel({
  id: 'amphitheater',
  name: '下沉环形剧场',
  category: 'outdoor',
  tags: ['amphitheater', 'theatre', 'seating', '剧场', '看台', '环形'],
  footprint: [16, 9],
  height: 2.2,
  placement: 'outdoor',
  parts,
})
