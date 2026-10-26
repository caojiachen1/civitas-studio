import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const PORCELAIN = '#f1eee6'
const BASIN = '#d8d7ce'

export default defineModel({
  id: 'laundry-sink',
  name: '洗衣池',
  category: 'laundry',
  tags: ['laundry sink', 'utility sink', 'deep basin', '洗衣池', '洗衣房', '水槽', '家务'],
  footprint: [0.75, 0.6],
  height: 1.0,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // brass levelling feet and lower shelf
    cyl(0.018, 0.022, 0.115, -0.32, 0.0575, 0.19, C.brass, { mat: 'metal' }, 14),
    cyl(0.018, 0.022, 0.115, 0.32, 0.0575, 0.19, C.brass, { mat: 'metal' }, 14),
    cyl(0.018, 0.022, 0.115, -0.32, 0.0575, -0.22, C.brass, { mat: 'metal' }, 14),
    cyl(0.018, 0.022, 0.115, 0.32, 0.0575, -0.22, C.brass, { mat: 'metal' }, 14),
    rbox(0.68, 0.03, 0.5, 0.006, 0, 0.13, -0.03, C.oak, { mat: 'wood' }),

    // open carcass: sides, back, top and a centre divider
    rbox(0.03, 0.56, 0.52, 0.006, -0.345, 0.42, -0.03, C.cream, { mat: 'matte' }),
    rbox(0.03, 0.56, 0.52, 0.006, 0.345, 0.42, -0.03, C.cream, { mat: 'matte' }),
    rbox(0.69, 0.56, 0.012, 0.004, 0, 0.42, -0.283, C.cream, { mat: 'matte' }),
    rbox(0.72, 0.03, 0.54, 0.006, 0, 0.715, -0.03, C.cream, { mat: 'matte' }),
    rbox(0.02, 0.53, 0.5, 0.004, 0.015, 0.425, -0.03, C.cream, { mat: 'matte' }),
    rbox(0.3, 0.02, 0.48, 0.004, 0.195, 0.35, -0.03, C.oak, { mat: 'wood' }),

    // left cabinet door with shaker frame and brass knob
    rbox(0.33, 0.5, 0.022, 0.006, -0.155, 0.42, 0.238, C.oak, { mat: 'wood' }),
    box(0.29, 0.008, 0.004, -0.155, 0.652, 0.251, C.walnut),
    box(0.29, 0.008, 0.004, -0.155, 0.188, 0.251, C.walnut),
    box(0.008, 0.45, 0.004, -0.292, 0.42, 0.251, C.walnut),
    box(0.008, 0.45, 0.004, -0.018, 0.42, 0.251, C.walnut),
    cyl(0.011, 0.011, 0.024, -0.05, 0.52, 0.261, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.017, 0.017, 0.006, -0.05, 0.52, 0.252, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    rbox(0.7, 0.03, 0.02, 0.004, -0.02, 0.685, 0.235, C.oak, { mat: 'wood' }),

    // stone top and upstand
    rbox(0.75, 0.04, 0.6, 0.012, 0, 0.75, 0, C.stone, { mat: 'stone' }),
    rbox(0.75, 0.07, 0.018, 0.005, 0, 0.805, -0.291, C.stone, { mat: 'stone' }),

    // deep farmhouse ceramic basin
    rbox(0.58, 0.2, 0.44, 0.05, 0, 0.86, 0.02, PORCELAIN, { mat: 'gloss' }),
    rbox(0.56, 0.19, 0.03, 0.02, 0, 0.855, 0.247, PORCELAIN, { mat: 'gloss' }),
    box(0.004, 0.17, 0.004, -0.16, 0.85, 0.264, C.cream),
    box(0.004, 0.17, 0.004, 0, 0.85, 0.264, C.cream),
    box(0.004, 0.17, 0.004, 0.16, 0.85, 0.264, C.cream),
    rbox(0.6, 0.02, 0.06, 0.01, 0, 0.972, 0.21, PORCELAIN, { mat: 'gloss' }),
    rbox(0.6, 0.02, 0.06, 0.01, 0, 0.972, -0.16, PORCELAIN, { mat: 'gloss' }),
    rbox(0.06, 0.02, 0.26, 0.01, -0.27, 0.972, 0.02, PORCELAIN, { mat: 'gloss' }),
    rbox(0.06, 0.02, 0.26, 0.01, 0.27, 0.972, 0.02, PORCELAIN, { mat: 'gloss' }),
    rbox(0.5, 0.005, 0.28, 0.03, 0, 0.9625, 0.02, BASIN, { mat: 'ceramic' }),
    cyl(0.03, 0.03, 0.005, 0, 0.9655, 0.03, C.steel, { mat: 'metal' }, 20),
    box(0.04, 0.002, 0.005, 0, 0.9685, 0.03, C.blackMetal, { mat: 'metal' }),

    // tall black mixer
    cyl(0.014, 0.028, 0.16, -0.24, 0.85, -0.22, C.blackMetal, { mat: 'metal' }, 20),
    cyl(0.019, 0.019, 0.018, -0.24, 0.884, -0.22, C.brass, { mat: 'metal' }, 16),
    sphere(0.018, -0.24, 0.935, -0.22, C.blackMetal, { mat: 'metal' }, 16),
    cyl(0.012, 0.012, 0.12, -0.24, 0.938, -0.16, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.014, 0.011, 0.05, -0.24, 0.915, -0.1, C.blackMetal, { mat: 'metal' }, 16),
    torus(0.014, 0.003, -0.24, 0.89, -0.1, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.009, 0.009, 0.05, -0.24, 0.965, -0.22, C.blackMetal, { mat: 'metal' }, 12),
    rbox(0.07, 0.01, 0.014, 0.005, -0.21, 0.995, -0.22, C.brass, { mat: 'metal' }),

    // soap dish and bar on the narrow counter return
    rbox(0.065, 0.008, 0.09, 0.015, -0.335, 0.774, 0.04, C.stone, { mat: 'stone' }),
    rbox(0.045, 0.012, 0.065, 0.01, -0.335, 0.784, 0.04, C.cream, { mat: 'matte' }),

    // exposed chrome P-trap in the open bay
    cyl(0.016, 0.016, 0.16, 0.19, 0.63, -0.06, C.steel, { mat: 'metal' }, 16),
    cyl(0.032, 0.032, 0.1, 0.19, 0.5, -0.06, C.steel, { mat: 'metal' }, 16),
    torus(0.045, 0.014, 0.19, 0.445, -0.085, C.steel, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 20),
    cyl(0.014, 0.014, 0.19, 0.19, 0.445, -0.175, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.021, 0.021, 0.022, 0.19, 0.445, -0.245, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.028, 0.028, 0.008, 0.19, 0.445, -0.276, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
  ],
})
