import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const BASIN_X = -0.02
const BASIN_Z = -0.035

export default defineModel({
  id: 'sink-unit',
  name: '水槽柜',
  category: 'kitchen',
  tags: ['kitchen', 'sink', 'faucet', '水槽', '洗菜盆', '水龙头'],
  footprint: [1.2, 0.65],
  height: 1.2,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed plinth + carcass
    box(1.04, 0.09, 0.44, 0, 0.045, -0.06, C.blackMetal, { mat: 'matte' }),
    box(1.16, 0.75, 0.58, 0, 0.465, -0.025, C.cream, { mat: 'matte' }),
    box(0.028, 0.78, 0.6, -0.586, 0.465, -0.02, C.walnut, { mat: 'wood' }),
    box(0.028, 0.78, 0.6, 0.586, 0.465, -0.02, C.walnut, { mat: 'wood' }),

    // stone worktop built around the sink cut-out
    box(1.2, 0.04, 0.225, 0, 0.86, 0.2125, C.stone, { mat: 'stone' }),
    box(1.2, 0.04, 0.155, 0, 0.86, -0.2475, C.stone, { mat: 'stone' }),
    box(0.3, 0.04, 0.27, -0.45, 0.86, -0.035, C.stone, { mat: 'stone' }),
    box(0.34, 0.04, 0.27, 0.43, 0.86, -0.035, C.stone, { mat: 'stone' }),
    box(1.2, 0.046, 0.016, 0, 0.857, 0.315, C.concrete, { mat: 'stone' }),
    // upstand
    box(1.2, 0.04, 0.022, 0, 0.9, -0.314, C.stone, { mat: 'stone' }),

    // inset stainless basin
    box(0.54, 0.012, 0.25, BASIN_X, 0.662, BASIN_Z, C.steel, { mat: 'metal' }),
    box(0.552, 0.21, 0.014, BASIN_X, 0.767, 0.098, C.steel, { mat: 'metal' }),
    box(0.552, 0.21, 0.014, BASIN_X, 0.767, -0.168, C.steel, { mat: 'metal' }),
    box(0.014, 0.21, 0.252, -0.298, 0.767, BASIN_Z, C.steel, { mat: 'metal' }),
    box(0.014, 0.21, 0.252, 0.258, 0.767, BASIN_Z, C.steel, { mat: 'metal' }),
    // rim
    box(0.58, 0.008, 0.02, BASIN_X, 0.878, 0.104, C.steel, { mat: 'metal' }),
    box(0.58, 0.008, 0.02, BASIN_X, 0.878, -0.174, C.steel, { mat: 'metal' }),
    box(0.02, 0.008, 0.29, -0.302, 0.878, BASIN_Z, C.steel, { mat: 'metal' }),
    box(0.02, 0.008, 0.29, 0.262, 0.878, BASIN_Z, C.steel, { mat: 'metal' }),
    // drain
    cyl(0.036, 0.036, 0.008, BASIN_X, 0.671, BASIN_Z, C.graphite, { mat: 'metal' }, 16),
    cyl(0.012, 0.012, 0.006, BASIN_X, 0.676, BASIN_Z, C.ink, { mat: 'metal' }, 12),

    // curved brass faucet
    cyl(0.036, 0.044, 0.05, 0.02, 0.905, -0.21, C.brass, { mat: 'metal' }, 20),
    cyl(0.018, 0.018, 0.16, 0.02, 1.01, -0.21, C.brass, { mat: 'metal' }, 20),
    torus(0.085, 0.016, 0.02, 1.09, -0.21, C.brass, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 24),
    cyl(0.015, 0.015, 0.1, 0.02, 1.03, -0.125, C.brass, { mat: 'metal' }, 16),
    cyl(0.021, 0.018, 0.018, 0.02, 0.973, -0.125, C.brass, { mat: 'metal' }, 16),
    // lever handle
    box(0.014, 0.014, 0.05, 0.06, 0.945, -0.21, C.brass, { mat: 'metal' }),
    box(0.045, 0.012, 0.012, 0.095, 0.955, -0.238, C.brass, { mat: 'metal' }),

    // soap dispenser
    cyl(0.03, 0.032, 0.1, 0.31, 0.93, -0.25, C.steel, { mat: 'metal' }, 16),
    cyl(0.009, 0.009, 0.055, 0.31, 1.005, -0.25, C.steel, { mat: 'metal' }, 10),
    box(0.055, 0.012, 0.014, 0.338, 1.028, -0.25, C.steel, { mat: 'metal' }),

    // two doors with brass pulls
    rbox(0.55, 0.66, 0.022, 0.007, -0.29, 0.46, 0.276, C.oak, { mat: 'wood' }),
    rbox(0.55, 0.66, 0.022, 0.007, 0.29, 0.46, 0.276, C.oak, { mat: 'wood' }),
    box(0.012, 0.72, 0.008, 0, 0.47, 0.271, C.ink),
    box(0.26, 0.018, 0.02, -0.29, 0.74, 0.292, C.brass, { mat: 'metal' }),
    box(0.26, 0.018, 0.02, 0.29, 0.74, 0.292, C.brass, { mat: 'metal' }),
    box(0.022, 0.022, 0.016, -0.39, 0.74, 0.284, C.brass, { mat: 'metal' }),
    box(0.022, 0.022, 0.016, -0.19, 0.74, 0.284, C.brass, { mat: 'metal' }),
    box(0.022, 0.022, 0.016, 0.19, 0.74, 0.284, C.brass, { mat: 'metal' }),
    box(0.022, 0.022, 0.016, 0.39, 0.74, 0.284, C.brass, { mat: 'metal' }),
    box(1.16, 0.022, 0.02, 0, 0.812, 0.272, C.cream, { mat: 'matte' }),

    // concealed door hinges
    ...[-0.572, 0.572].flatMap((x) => [
      rbox(0.014, 0.05, 0.028, 0.005, x, 0.26, 0.278, C.graphite, { mat: 'metal' }),
      rbox(0.014, 0.05, 0.028, 0.005, x, 0.68, 0.278, C.graphite, { mat: 'metal' }),
    ]),
    // hot / cold index dots on the faucet base and a basin overflow cover
    sphere(0.006, 0.007, 0.915, -0.173, C.red, { mat: 'gloss' }, 8),
    sphere(0.006, 0.033, 0.915, -0.173, C.water, { mat: 'gloss' }, 8),
    cyl(0.016, 0.016, 0.004, -0.02, 0.8, -0.1605, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    box(0.014, 0.003, 0.003, -0.02, 0.8, -0.158, C.ink, { mat: 'metal' }),
  ],
})
