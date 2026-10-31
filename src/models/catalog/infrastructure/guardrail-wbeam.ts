import { C, box, cyl, defineModel, prism } from '../../kit'
import type { Part } from '../../../editor/types'

/*
 * 4m W-beam guardrail module, long axis on Z.
 *  - beam: 25mm plate folded into a W, crest 55mm / valley 12mm, 0.44–0.76m high;
 *  - posts: 0.12 square tube 0.75m, 0.02 flange plate and four anchor bolts;
 *  - blockout: 0.11 x 0.26 x 0.09 spacer ties post to the beam back;
 *  - post-top delineator: white + red reflective bands above the beam (0.85m);
 *  - two end terminals cap the beam ends.
 */
const MODULE_LEN = 4
const POST = 0.12
const POST_H = 0.75
const POST_X = -0.04
const GALV = '#b9bec1'
const REFLECT_WHITE = '#f2f2ee'
const REFLECT_RED = '#c4453c'

const WAVE_Y = [0.44, 0.4933, 0.5467, 0.6, 0.6533, 0.7067, 0.76]
const WAVE_X = [0.012, 0.055, 0.055, 0.012, 0.055, 0.055, 0.012]
const PLATE_T = 0.025
const W_PROFILE: [number, number][] = [
  ...WAVE_Y.map((y, i): [number, number] => [WAVE_X[i], y]),
  ...WAVE_Y.map((y, i): [number, number] => [WAVE_X[i] - PLATE_T, y]).reverse(),
]

// end posts inset by half a post so the 4m module stays inside its footprint
const POST_Z = [-MODULE_LEN / 2 + POST / 2, 0, MODULE_LEN / 2 - POST / 2]
const parts: Part[] = []

// beam, extruded along Z with the profile in XY
parts.push(prism(W_PROFILE, MODULE_LEN, 0.14, 0, 0, GALV, { mat: 'metal' }))

POST_Z.forEach((z) => {
  parts.push(box(POST, POST_H, POST, POST_X, POST_H / 2, z, GALV, { mat: 'metal' }))
  parts.push(box(0.34, 0.02, 0.26, POST_X, 0.01, z, C.graphite, { mat: 'metal' }))
  // blockout spacer overlaps both the post face and the corrugated beam back
  parts.push(box(0.11, 0.26, 0.09, 0.075, 0.6, z, C.graphite, { mat: 'metal' }))

  for (const dx of [-0.12, 0.12]) {
    for (const dz of [-0.075, 0.075]) {
      parts.push(cyl(0.012, 0.012, 0.03, POST_X + dx, 0.035, z + dz, C.steel, { mat: 'metal' }, 8))
    }
  }

  // post-top delineator backing bracket, then white / red bands
  parts.push(box(0.03, 0.12, 0.06, 0.012, 0.78, z, C.graphite, { mat: 'metal' }))
  parts.push(box(0.01, 0.06, 0.09, 0.024, 0.78, z, REFLECT_WHITE, { mat: 'gloss' }))
  parts.push(box(0.01, 0.04, 0.09, 0.024, 0.83, z, REFLECT_RED, { mat: 'gloss' }))
  for (const dy of [-0.018, 0.018]) {
    parts.push(cyl(0.006, 0.006, 0.008, 0.031, 0.78 + dy, z, C.steel, { mat: 'metal' }, 6))
  }
})

// terminal end plates with two fixings each
for (const s of [-1, 1]) {
  const endZ = (s * MODULE_LEN) / 2
  parts.push(box(0.11, 0.34, 0.03, 0.02, 0.6, endZ - s * 0.015, GALV, { mat: 'metal' }))
  for (const dy of [-0.11, 0.11]) {
    parts.push(
      cyl(0.008, 0.008, 0.012, 0.02, 0.6 + dy, endZ - s * 0.002, C.steel, {
        mat: 'metal',
        rot: [Math.PI / 2, 0, 0],
      }, 6),
    )
  }
}

export default defineModel({
  id: 'guardrail-wbeam',
  name: '波形梁护栏',
  category: 'infrastructure',
  tags: ['guardrail', 'highway', '护栏', '波形梁', '高速公路'],
  footprint: [0.4, 4],
  height: 0.85,
  placement: 'outdoor',
  parts,
})
