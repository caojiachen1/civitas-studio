import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part, Vec2 } from '../../../editor/types'

// Warm limestone archway. All colours stay low-saturation and stone-like.
const STONE = '#a7a49a'
const STONE_DARK = '#8b8980'
const STONE_LIGHT = '#c1bdb0'
const VOUSSOIR_ALT = '#b5b2a5'
const MORTAR = '#7a7971'

const PIER_X = 1.07
const SPRING_Y = 1.79
const ARCH_R = 0.81
const RING_T = 0.2
const RING_MID = ARCH_R + RING_T / 2
const NOTCH_R = 0.99
const PANEL_TOP = 2.92
const HALF_W = 1.35

const parts: Part[] = []

// Tympanum / spandrel wall: a single C-shaped extrusion whose notch is the
// arch extrados, so the opening reads as real masonry instead of stacked boxes.
const spandrel: Vec2[] = [[-HALF_W, SPRING_Y]]
const SEGMENTS = 24
for (let i = 0; i <= SEGMENTS; i++) {
  const a = Math.PI - (Math.PI * i) / SEGMENTS
  spandrel.push([Math.cos(a) * NOTCH_R, SPRING_Y + Math.sin(a) * NOTCH_R])
}
spandrel.push([HALF_W, SPRING_Y], [HALF_W, PANEL_TOP], [-HALF_W, PANEL_TOP])
parts.push(prism(spandrel, 0.44, 0, 0, 0, STONE, { mat: 'stone' }))

// Piers: footing, plinth, chamfer, shaft, ashlar joints, inlaid panels, impost.
for (const side of [-1, 1]) {
  const x = side * PIER_X
  parts.push(box(0.62, 0.1, 0.55, side * 1.04, 0.05, 0, STONE_DARK, { mat: 'stone' }))
  parts.push(box(0.56, 0.13, 0.51, x, 0.165, 0, STONE, { mat: 'stone' }))
  parts.push(box(0.52, 0.04, 0.47, x, 0.25, 0, STONE_LIGHT, { mat: 'stone' }))
  parts.push(box(0.48, 1.45, 0.43, x, 0.985, 0, STONE, { mat: 'stone' }))
  for (const y of [0.63, 1.27]) {
    parts.push(box(0.485, 0.012, 0.435, x, y, 0, MORTAR, { mat: 'stone' }))
  }
  for (const z of [-0.218, 0.218]) {
    parts.push(box(0.3, 0.95, 0.012, x, 0.95, z, STONE_DARK, { mat: 'stone' }))
  }
  // impost neck and projecting impost slab
  parts.push(box(0.5, 0.035, 0.45, x, 1.7175, 0, STONE_DARK, { mat: 'stone' }))
  parts.push(box(0.58, 0.055, 0.51, x, 1.7625, 0, STONE_LIGHT, { mat: 'stone' }))
  // small corbel blocks under the impost, front and back
  for (const z of [-0.19, 0.19]) {
    parts.push(box(0.16, 0.08, 0.1, x, 1.665, z, STONE_LIGHT, { mat: 'stone' }))
  }
}

// Semicircular arch ring built from rotated voussoirs.
const VOUSSOIRS = 13
for (let i = 0; i < VOUSSOIRS; i++) {
  const a = (Math.PI * (i + 0.5)) / VOUSSOIRS
  parts.push(
    box(
      RING_T,
      0.235,
      0.54,
      Math.cos(a) * RING_MID,
      SPRING_Y + Math.sin(a) * RING_MID,
      0,
      i % 2 === 0 ? STONE_LIGHT : VOUSSOIR_ALT,
      { mat: 'stone', rot: [0, 0, a] },
    ),
  )
}

// Keystone with a slightly wider head, dropping into the frieze.
parts.push(box(0.17, 0.36, 0.54, 0, 2.74, 0, STONE_LIGHT, { mat: 'stone' }))
parts.push(box(0.21, 0.07, 0.56, 0, 2.895, 0, STONE_LIGHT, { mat: 'stone' }))
// Mortar shadows either side of the keystone.
for (const z of [-0.271, 0.271]) {
  for (const x of [-0.1, 0.1]) {
    parts.push(box(0.008, 0.28, 0.004, x, 2.75, z, MORTAR, { mat: 'stone' }))
  }
}

// Ashlar joints in the spandrel wings, front and back.
for (const z of [-0.221, 0.221]) {
  for (const x of [-1.17, 1.17]) {
    parts.push(box(0.008, 0.88, 0.006, x, 2.38, z, MORTAR, { mat: 'stone' }))
    parts.push(box(0.3, 0.008, 0.006, x, 2.55, z, MORTAR, { mat: 'stone' }))
  }
}

// Frieze, recessed panels, medallion, dentils.
parts.push(box(2.6, 0.13, 0.46, 0, 2.985, 0, STONE, { mat: 'stone' }))
for (const z of [-0.234, 0.234]) {
  parts.push(box(1.5, 0.075, 0.012, 0, 2.985, z, STONE_DARK, { mat: 'stone' }))
}
parts.push(cyl(0.07, 0.07, 0.016, 0, 2.985, 0.242, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 16))
for (const x of [-1.25, -0.62, 0.62, 1.25]) {
  parts.push(box(0.055, 0.05, 0.045, x, 3.025, 0.252, STONE_LIGHT, { mat: 'stone' }))
}

// Cornice stack and coping: the widest course sits exactly on the footprint.
parts.push(box(2.7, 0.1, 0.55, 0, 3.1, 0, STONE_LIGHT, { mat: 'stone' }))
parts.push(box(2.62, 0.06, 0.52, 0, 3.18, 0, STONE, { mat: 'stone' }))
parts.push(box(2.54, 0.09, 0.48, 0, 3.255, 0, STONE_LIGHT, { mat: 'stone' }))

// Threshold slab between the piers, worn into shallow cart grooves.
parts.push(box(1.66, 0.05, 0.47, 0, 0.025, 0, STONE_DARK, { mat: 'stone' }))
for (const x of [-0.52, 0, 0.52]) {
  parts.push(box(0.3, 0.004, 0.05, x, 0.052, 0.1, MORTAR, { mat: 'stone' }))
}
for (const z of [-0.2, 0.2]) {
  parts.push(box(1.62, 0.006, 0.008, 0, 0.052, z, '#6c6a62', { mat: 'stone' }))
}

export default defineModel({
  id: 'archway',
  name: '拱门',
  category: 'structure',
  tags: ['archway', 'arch', 'gate', '拱门', '门洞', '石拱'],
  footprint: [2.7, 0.55],
  height: 3.3,
  placement: 'any',
  parts,
})
