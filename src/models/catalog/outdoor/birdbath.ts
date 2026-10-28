import { C, cyl, defineModel, ico, torus } from '../../kit'

const STONE = '#a9a69b'
const STONE_LIGHT = '#b6b2a5'
const STONE_DARK = '#8d8a7f'
const MOSS = '#6c7d51'
const MOSS_LIGHT = '#7f8f5e'
const PEBBLE = '#8f8c81'

// [x, z, lift, radius] patches hugging the bowl lip.
const rimMoss: [number, number, number, number][] = [
  [0, 0.24, 0.02, 0.032],
  [0.14, 0.2, 0.026, 0.028],
  [-0.16, -0.19, 0.022, 0.026],
  [0.06, -0.235, 0.014, 0.03],
]

const pebbles: [number, number, number, number][] = [
  [-0.1, 0.12, 0.032, 0.028],
  [0.08, -0.11, 0.028, 0.024],
  [-0.03, -0.06, 0.026, 0.022],
  [0.13, 0.05, 0.024, 0.022],
  [-0.13, -0.03, 0.022, 0.02],
]

export default defineModel({
  id: 'birdbath',
  name: '鸟浴盆',
  category: 'outdoor',
  tags: ['birdbath', 'bird bath', '鸟浴盆', '水盆', '石雕', '景观'],
  footprint: [0.55, 0.55],
  height: 1.05,
  placement: 'outdoor',
  parts: [
    // weathered stone plinth with a moulded foot
    cyl(0.235, 0.26, 0.05, 0, 0.025, 0, STONE_DARK, { mat: 'stone' }, 20),
    cyl(0.19, 0.225, 0.07, 0, 0.085, 0, STONE, { mat: 'stone' }, 18),
    torus(0.175, 0.022, 0, 0.128, 0, STONE_LIGHT, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 20),
    // turned pedestal
    cyl(0.075, 0.115, 0.52, 0, 0.4, 0, STONE, { mat: 'stone' }, 16),
    torus(0.102, 0.02, 0, 0.36, 0, STONE_DARK, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 18),
    cyl(0.117, 0.117, 0.014, 0, 0.52, 0, STONE_DARK, { mat: 'stone' }, 16),
    cyl(0.1, 0.072, 0.06, 0, 0.69, 0, STONE_LIGHT, { mat: 'stone' }, 16),
    // bowl: underside cone, flared shell, rolled lip
    cyl(0.062, 0.16, 0.09, 0, 0.755, 0, STONE_DARK, { mat: 'stone' }, 18),
    cyl(0.19, 0.064, 0.1, 0, 0.85, 0, STONE, { mat: 'stone' }, 20),
    cyl(0.25, 0.19, 0.09, 0, 0.945, 0, STONE_LIGHT, { mat: 'stone' }, 22),
    torus(0.245, 0.024, 0, 0.99, 0, STONE, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    // shallow water, slightly recessed below the lip
    cyl(0.222, 0.222, 0.012, 0, 0.972, 0, C.water, { mat: 'glass', opacity: 0.42 }, 22),
    cyl(0.16, 0.16, 0.008, 0, 0.981, 0, '#8fb6bd', { mat: 'gloss', opacity: 0.3 }, 18),
    // moss creeping over the rim and base
    ...rimMoss.map(([x, z, y, r], i) =>
      ico(r, x, 0.995 + y, z, i % 2 === 0 ? MOSS : MOSS_LIGHT, { mat: 'foliage' }, 0),
    ),
    ico(0.035, 0.16, 0.15, 0.17, MOSS, { mat: 'foliage' }, 0),
    ico(0.028, -0.17, 0.14, -0.12, MOSS_LIGHT, { mat: 'foliage' }, 0),
    // pebbles resting in the basin
    ...pebbles.map(([x, z, y, r], i) =>
      ico(r, x, 0.976 + y * 0.25, z, i % 2 === 0 ? PEBBLE : STONE_LIGHT, { mat: 'stone', rot: [0.4, i, 0.2] }, 0),
    ),
    // concentric ripples spreading across the water
    torus(0.155, 0.0025, 0, 0.986, 0, '#a6c6cb', { mat: 'glass', opacity: 0.5, rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.09, 0.0022, 0, 0.987, 0, '#a6c6cb', { mat: 'glass', opacity: 0.5, rot: [Math.PI / 2, 0, 0] }, 24),
    // carved astragal band turning around the pedestal
    torus(0.084, 0.006, 0, 0.62, 0, STONE_LIGHT, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 20),
    // sedum rosettes tucked onto the weathered bottom tier
    ico(0.032, 0.19, 0.068, 0.12, MOSS, { mat: 'foliage' }, 0),
    ico(0.027, -0.18, 0.063, -0.14, MOSS_LIGHT, { mat: 'foliage' }, 0),
    ico(0.024, 0.05, 0.062, 0.215, MOSS, { mat: 'foliage' }, 0),
  ],
})
