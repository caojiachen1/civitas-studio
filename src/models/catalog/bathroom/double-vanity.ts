import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const PORCELAIN = '#f1eee6'
const BASIN = '#d9d8cf'
const SEAM = '#3b3a37'
const DOOR_X = [-0.7275, -0.3625, 0.3625, 0.7275]
const SEAM_X = [-0.545, -0.19, 0.19, 0.545]
const DRAWER_Y = [0.25, 0.44, 0.63]
const PULL_X = [-0.575, -0.515, 0.515, 0.575]
const BASIN_X = [-0.55, 0.55]

export default defineModel({
  id: 'double-vanity',
  name: '双台盆浴室柜',
  category: 'bathroom',
  tags: ['double vanity', 'twin basin', 'bathroom cabinet', '双台盆', '浴室柜', '洗手台', '卫浴'],
  footprint: [1.9, 0.6],
  height: 0.95,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed toe kick
    box(1.78, 0.08, 0.48, 0, 0.04, -0.05, C.ink, { mat: 'matte' }),
    // oak carcass with walnut sides and back
    rbox(1.86, 0.7, 0.56, 0.01, 0, 0.43, -0.02, C.oak, { mat: 'wood' }),
    rbox(0.03, 0.68, 0.58, 0.008, -0.925, 0.42, -0.01, C.walnut, { mat: 'wood' }),
    rbox(0.03, 0.68, 0.58, 0.008, 0.925, 0.42, -0.01, C.walnut, { mat: 'wood' }),
    rbox(1.86, 0.022, 0.56, 0.006, 0, 0.769, -0.02, C.walnut, { mat: 'wood' }),
    rbox(1.84, 0.66, 0.012, 0.004, 0, 0.43, -0.292, C.walnut, { mat: 'wood' }),

    // stone worktop, drip groove and short upstand
    rbox(1.9, 0.04, 0.6, 0.012, 0, 0.8, 0, C.stone, { mat: 'stone' }),
    box(1.84, 0.005, 0.005, 0, 0.7785, 0.297, C.graphite),
    rbox(1.9, 0.07, 0.02, 0.005, 0, 0.855, -0.29, C.stone, { mat: 'stone' }),

    // cream door fronts
    ...DOOR_X.map((x) => rbox(0.345, 0.56, 0.022, 0.006, x, 0.44, 0.271, C.cream, { mat: 'gloss' })),
    // vertical shadow seams between doors and drawer bank
    ...SEAM_X.map((x) => box(0.008, 0.56, 0.005, x, 0.44, 0.282, SEAM)),
    // face rail under the worktop
    rbox(1.82, 0.045, 0.02, 0.004, 0, 0.7425, 0.269, C.oak, { mat: 'wood' }),

    // centre drawer bank
    ...DRAWER_Y.map((y) => rbox(0.36, 0.18, 0.022, 0.006, 0, y, 0.271, C.cream, { mat: 'gloss' })),
    box(0.34, 0.006, 0.004, 0, 0.345, 0.283, SEAM),
    box(0.34, 0.006, 0.004, 0, 0.535, 0.283, SEAM),

    // slim brass pulls: one per door, one per drawer
    ...PULL_X.map((x) => rbox(0.012, 0.14, 0.012, 0.005, x, 0.56, 0.288, C.brass, { mat: 'metal' })),
    ...DRAWER_Y.map((y) => rbox(0.18, 0.012, 0.012, 0.005, 0, y, 0.288, C.brass, { mat: 'metal' })),

    // two undermount ceramic basins with stone-cut rims
    ...BASIN_X.flatMap((x) => [
      rbox(0.44, 0.06, 0.32, 0.14, x, 0.848, 0.03, PORCELAIN, { mat: 'gloss' }),
      rbox(0.48, 0.016, 0.06, 0.01, x, 0.884, 0.18, PORCELAIN, { mat: 'gloss' }),
      rbox(0.48, 0.016, 0.06, 0.01, x, 0.884, -0.12, PORCELAIN, { mat: 'gloss' }),
      rbox(0.06, 0.016, 0.24, 0.01, x - 0.21, 0.884, 0.03, PORCELAIN, { mat: 'gloss' }),
      rbox(0.06, 0.016, 0.24, 0.01, x + 0.21, 0.884, 0.03, PORCELAIN, { mat: 'gloss' }),
      rbox(0.36, 0.005, 0.24, 0.11, x, 0.8805, 0.03, BASIN, { mat: 'ceramic' }),
      cyl(0.024, 0.024, 0.004, x, 0.884, 0.03, C.steel, { mat: 'metal' }, 20),
    ]),

    // two brass mixers
    ...BASIN_X.flatMap((x) => [
      cyl(0.016, 0.03, 0.08, x, 0.86, -0.23, C.brass, { mat: 'metal' }, 20),
      sphere(0.017, x, 0.905, -0.23, C.brass, { mat: 'metal' }, 16),
      cyl(0.012, 0.012, 0.12, x, 0.91, -0.17, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
      cyl(0.014, 0.011, 0.03, x, 0.897, -0.11, C.brass, { mat: 'metal' }, 16),
      torus(0.014, 0.003, x, 0.882, -0.11, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
      rbox(0.055, 0.01, 0.014, 0.005, x + 0.04, 0.911, -0.23, C.brass, { mat: 'metal' }),
    ]),

    // soap bottle between the basins
    cyl(0.03, 0.032, 0.1, 0, 0.87, 0.1, C.clay, { mat: 'gloss' }, 20),
    cyl(0.015, 0.03, 0.016, 0, 0.928, 0.1, C.clay, { mat: 'gloss' }, 16),
    cyl(0.006, 0.006, 0.008, 0, 0.94, 0.1, C.steel, { mat: 'metal' }, 10),
    rbox(0.05, 0.008, 0.012, 0.004, 0.018, 0.944, 0.1, C.steel, { mat: 'metal' }),

    // silicone bead sealing the upstand to the wall
    cyl(0.005, 0.005, 1.88, 0, 0.893, -0.298, '#d8d2c4', { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 8),
    // hairline reveals closing the outer door edges
    ...[-0.905, 0.905].map((x) => box(0.006, 0.56, 0.004, x, 0.44, 0.282, SEAM)),
    // chrome overflow slots on the basin aprons
    ...BASIN_X.map((x) => box(0.07, 0.008, 0.003, x, 0.882, 0.2115, C.steel, { mat: 'metal' })),
  ],
})
