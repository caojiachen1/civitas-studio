import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const STEEL = '#9aa3a8'
const STEEL_LIGHT = '#b8bfc2'
const STEEL_DARK = '#7d868b'
const GRAPHITE = '#4d5357'
const FILTER = '#34393c'

export default defineModel({
  id: 'range-hood',
  name: '抽油烟机',
  category: 'kitchen',
  tags: ['range hood', 'extractor', '抽油烟机', '烟机', '厨房', 'wall mount', 'appliance'],
  footprint: [0.95, 0.6],
  height: 2.4,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // stainless wall canopy, stepped taper up to the chimney
    rbox(0.92, 0.055, 0.52, 0.014, 0, 1.5825, 0.01, STEEL, { mat: 'metal' }),
    rbox(0.84, 0.09, 0.46, 0.014, 0, 1.65, 0.0, STEEL, { mat: 'metal' }),
    rbox(0.7, 0.09, 0.4, 0.014, 0, 1.735, -0.01, STEEL_LIGHT, { mat: 'metal' }),
    rbox(0.54, 0.09, 0.34, 0.014, 0, 1.82, -0.02, STEEL, { mat: 'metal' }),
    rbox(0.36, 0.035, 0.3, 0.01, 0, 1.88, -0.04, STEEL_LIGHT, { mat: 'metal' }),
    // horizontal front seam bands between the tiers
    box(0.9, 0.005, 0.004, 0, 1.588, 0.271, STEEL_DARK, { mat: 'metal' }),
    box(0.82, 0.005, 0.004, 0, 1.665, 0.231, STEEL_DARK, { mat: 'metal' }),
    box(0.68, 0.005, 0.004, 0, 1.75, 0.191, STEEL_DARK, { mat: 'metal' }),
    box(0.52, 0.005, 0.004, 0, 1.835, 0.151, STEEL_DARK, { mat: 'metal' }),
    // recessed underside panel
    rbox(0.86, 0.02, 0.44, 0.008, 0, 1.552, 0.01, FILTER, { mat: 'matte' }),

    // chimney duct with a top collar and seams
    rbox(0.3, 0.48, 0.26, 0.012, 0, 2.14, -0.13, STEEL, { mat: 'metal' }),
    rbox(0.33, 0.025, 0.29, 0.008, 0, 2.3875, -0.13, STEEL_LIGHT, { mat: 'metal' }),
    box(0.003, 0.46, 0.004, -0.075, 2.14, 0.002, STEEL_DARK, { mat: 'metal' }),
    box(0.003, 0.46, 0.004, 0.075, 2.14, 0.002, STEEL_DARK, { mat: 'metal' }),
    box(0.07, 0.014, 0.004, 0, 2.02, 0.003, C.brass, { mat: 'metal' }),

    // wall mounting plate and screws
    box(0.56, 0.34, 0.018, 0, 2.12, -0.291, GRAPHITE, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.006, -0.24, 2.23, -0.279, STEEL_LIGHT, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.006, 0.24, 2.23, -0.279, STEEL_LIGHT, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.006, -0.24, 2.01, -0.279, STEEL_LIGHT, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.006, 0.24, 2.01, -0.279, STEEL_LIGHT, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // front control panel with display and touch buttons
    rbox(0.34, 0.078, 0.018, 0.006, 0, 1.592, 0.278, C.ink, { mat: 'gloss' }),
    box(0.1, 0.026, 0.004, 0.1, 1.605, 0.288, '#5f8f92', { mat: 'emissive' }),
    cyl(0.011, 0.011, 0.008, -0.12, 1.605, 0.288, STEEL_LIGHT, { mat: 'metal' }, 12),
    cyl(0.011, 0.011, 0.008, -0.08, 1.605, 0.288, STEEL_LIGHT, { mat: 'metal' }, 12),
    cyl(0.009, 0.009, 0.006, -0.12, 1.578, 0.288, '#c9a05e', { mat: 'emissive' }, 12),
    cyl(0.009, 0.009, 0.006, -0.08, 1.578, 0.288, '#c9a05e', { mat: 'emissive' }, 12),
    cyl(0.009, 0.009, 0.006, -0.04, 1.578, 0.288, STEEL_LIGHT, { mat: 'metal' }, 12),

    // grease filters with cross slats
    rbox(0.4, 0.012, 0.34, 0.006, -0.22, 1.5455, 0.03, FILTER, { mat: 'metal' }),
    rbox(0.4, 0.012, 0.34, 0.006, 0.22, 1.5455, 0.03, FILTER, { mat: 'metal' }),
    box(0.36, 0.006, 0.012, -0.22, 1.537, -0.08, STEEL_DARK, { mat: 'metal' }),
    box(0.36, 0.006, 0.012, -0.22, 1.537, 0.03, STEEL_DARK, { mat: 'metal' }),
    box(0.36, 0.006, 0.012, -0.22, 1.537, 0.14, STEEL_DARK, { mat: 'metal' }),
    box(0.36, 0.006, 0.012, 0.22, 1.537, -0.08, STEEL_DARK, { mat: 'metal' }),
    box(0.36, 0.006, 0.012, 0.22, 1.537, 0.03, STEEL_DARK, { mat: 'metal' }),
    box(0.36, 0.006, 0.012, 0.22, 1.537, 0.14, STEEL_DARK, { mat: 'metal' }),

    // warm task lights under the front edge
    cyl(0.042, 0.042, 0.008, -0.32, 1.547, 0.225, '#ffe6ba', { mat: 'emissive' }, 20),
    cyl(0.042, 0.042, 0.008, 0.32, 1.547, 0.225, '#ffe6ba', { mat: 'emissive' }, 20),
    torus(0.048, 0.005, -0.32, 1.543, 0.225, STEEL_DARK, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    torus(0.048, 0.005, 0.32, 1.543, 0.225, STEEL_DARK, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),

    // removable oil cup under the front lip
    rbox(0.3, 0.02, 0.085, 0.008, 0, 1.529, 0.195, STEEL_LIGHT, { mat: 'metal' }),
    box(0.26, 0.006, 0.065, 0, 1.522, 0.198, '#3c3630', { mat: 'gloss' }),
    box(0.09, 0.014, 0.018, 0, 1.523, 0.243, STEEL_DARK, { mat: 'metal' }),

    // rivets along the duct seams, a brass serial plate and filter release tabs
    ...[1.96, 2.3].flatMap((y) => [
      cyl(0.005, 0.005, 0.004, -0.075, y, 0.004, STEEL_LIGHT, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
      cyl(0.005, 0.005, 0.004, 0.075, y, 0.004, STEEL_LIGHT, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    ]),
    box(0.11, 0.028, 0.003, 0, 2.32, 0.0035, C.brass, { mat: 'metal' }),
    box(0.05, 0.008, 0.012, -0.22, 1.539, 0.196, STEEL_DARK, { mat: 'metal' }),
    box(0.05, 0.008, 0.012, 0.22, 1.539, 0.196, STEEL_DARK, { mat: 'metal' }),
  ],
})
