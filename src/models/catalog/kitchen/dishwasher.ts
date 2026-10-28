import { C, box, cyl, defineModel, rbox } from '../../kit'

const BUTTONS = [-0.16, -0.115, -0.07]

export default defineModel({
  id: 'dishwasher',
  name: '洗碗机',
  category: 'kitchen',
  tags: ['kitchen', 'dishwasher', 'appliance', '洗碗机', '嵌入式'],
  footprint: [0.6, 0.65],
  height: 0.87,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // plinth and body
    box(0.54, 0.06, 0.5, 0, 0.03, -0.035, C.blackMetal, { mat: 'matte' }),
    box(0.58, 0.79, 0.6, 0, 0.455, -0.02, C.steel, { mat: 'metal' }),
    box(0.01, 0.8, 0.03, -0.292, 0.42, 0.272, C.ink),
    box(0.01, 0.8, 0.03, 0.292, 0.42, 0.272, C.ink),

    // steel front panel
    rbox(0.572, 0.68, 0.03, 0.01, 0, 0.445, 0.283, C.concrete, { mat: 'metal' }),
    box(0.5, 0.34, 0.004, 0, 0.42, 0.299, C.steel, { mat: 'metal' }),
    box(0.54, 0.006, 0.012, 0, 0.112, 0.298, C.ink),

    // control strip
    box(0.572, 0.065, 0.026, 0, 0.8175, 0.289, C.graphite, { mat: 'gloss' }),
    box(0.09, 0.022, 0.006, 0.13, 0.8175, 0.303, C.ink, { mat: 'gloss' }),
    box(0.05, 0.012, 0.003, 0.115, 0.82, 0.307, C.water, { mat: 'emissive' }),
    box(0.016, 0.012, 0.003, 0.163, 0.82, 0.307, C.brass, { mat: 'emissive' }),
    ...BUTTONS.map((x) =>
      cyl(0.011, 0.011, 0.008, x, 0.8175, 0.303, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    ),
    // status light
    cyl(0.006, 0.006, 0.006, 0.245, 0.8175, 0.303, C.leafLight, { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 10),
    // badge
    box(0.056, 0.008, 0.004, -0.19, 0.798, 0.303, C.brass, { mat: 'metal' }),

    // handle bar
    cyl(0.014, 0.014, 0.46, 0, 0.762, 0.308, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    box(0.026, 0.026, 0.04, -0.2, 0.762, 0.292, C.steel, { mat: 'metal' }),
    box(0.026, 0.026, 0.04, 0.2, 0.762, 0.292, C.steel, { mat: 'metal' }),

    // top plate at worktop height
    box(0.6, 0.02, 0.62, 0, 0.86, -0.01, C.concrete, { mat: 'stone' }),
    box(0.6, 0.006, 0.02, 0, 0.857, 0.29, C.steel, { mat: 'metal' }),

    // hinge covers
    box(0.05, 0.028, 0.014, -0.25, 0.77, 0.3, C.graphite, { mat: 'metal' }),
    box(0.05, 0.028, 0.014, 0.25, 0.77, 0.3, C.graphite, { mat: 'metal' }),

    // levelling feet in the toe recess, plinth vent slots and hinge screws
    cyl(0.017, 0.019, 0.042, -0.24, 0.021, 0.226, C.graphite, { mat: 'metal' }, 12),
    cyl(0.017, 0.019, 0.042, 0.24, 0.021, 0.226, C.graphite, { mat: 'metal' }, 12),
    ...[-0.015, -0.005, 0.005, 0.015].map((y) =>
      box(0.42, 0.005, 0.004, 0, 0.032 + y, 0.2165, C.ink, { mat: 'matte' }),
    ),
    cyl(0.006, 0.006, 0.005, -0.25, 0.77, 0.3075, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.006, 0.006, 0.005, 0.25, 0.77, 0.3075, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // gasket shadow line under the control strip
    box(0.55, 0.005, 0.004, 0, 0.788, 0.301, C.ink, { mat: 'matte' }),
  ],
})
