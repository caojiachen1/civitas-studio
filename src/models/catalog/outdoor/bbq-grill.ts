import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

const teak = '#a97a4d'
const metal = '#33383c'

export default defineModel({
  id: 'bbq-grill',
  name: '烧烤炉',
  category: 'outdoor',
  tags: ['bbq', 'grill', 'barbecue', 'kettle', '烧烤', '烤炉', 'BBQ'],
  footprint: [0.7, 0.6],
  height: 1.15,
  placement: 'outdoor',
  parts: [
    // cart frame
    rbox(0.042, 0.62, 0.042, 0.01, -0.3, 0.31, 0.2, metal, { mat: 'metal' }),
    rbox(0.042, 0.62, 0.042, 0.01, 0.2, 0.31, 0.2, metal, { mat: 'metal' }),
    rbox(0.042, 0.62, 0.042, 0.01, -0.3, 0.31, -0.2, metal, { mat: 'metal' }),
    rbox(0.042, 0.62, 0.042, 0.01, 0.2, 0.31, -0.2, metal, { mat: 'metal' }),
    box(0.5, 0.045, 0.04, -0.05, 0.64, -0.2, metal, { mat: 'metal' }),
    box(0.5, 0.045, 0.04, -0.05, 0.64, 0.2, metal, { mat: 'metal' }),
    box(0.04, 0.045, 0.42, -0.3, 0.64, 0, metal, { mat: 'metal' }),
    box(0.04, 0.045, 0.42, 0.2, 0.64, 0, metal, { mat: 'metal' }),
    // lower storage shelf
    box(0.5, 0.028, 0.11, -0.05, 0.19, -0.13, teak, { mat: 'wood' }),
    box(0.5, 0.028, 0.11, -0.05, 0.19, 0, teak, { mat: 'wood' }),
    box(0.5, 0.028, 0.11, -0.05, 0.19, 0.13, teak, { mat: 'wood' }),
    // casters
    cyl(0.06, 0.06, 0.035, -0.3, 0.06, -0.23, C.blackMetal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.06, 0.06, 0.035, 0.2, 0.06, -0.23, C.blackMetal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    // ash catcher
    cyl(0.15, 0.11, 0.06, -0.05, 0.6, 0, C.graphite, { mat: 'metal' }, 24),
    box(0.12, 0.025, 0.025, -0.05, 0.62, 0.15, C.steel, { mat: 'metal' }),
    // bowl and rim
    cyl(0.17, 0.19, 0.07, -0.05, 0.67, 0, C.graphite, { mat: 'metal' }, 24),
    cyl(0.25, 0.18, 0.14, -0.05, 0.77, 0, C.blackMetal, { mat: 'metal' }, 24),
    torus(0.25, 0.014, -0.05, 0.84, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.05, 0.012, -0.05, 0.785, 0.245, C.steel, { mat: 'metal' }, 16),
    box(0.02, 0.02, 0.03, -0.09, 0.785, 0.235, C.steel, { mat: 'metal' }),
    box(0.02, 0.02, 0.03, -0.01, 0.785, 0.235, C.steel, { mat: 'metal' }),
    // lid
    cyl(0.19, 0.25, 0.06, -0.05, 0.87, 0, C.blackMetal, { mat: 'metal' }, 24),
    cyl(0.11, 0.19, 0.06, -0.05, 0.93, 0, C.blackMetal, { mat: 'metal' }, 24),
    cyl(0.045, 0.11, 0.055, -0.05, 0.9875, 0, C.blackMetal, { mat: 'metal' }, 16),
    cyl(0.06, 0.06, 0.02, -0.05, 1.02, 0, C.steel, { mat: 'metal' }, 16),
    box(0.022, 0.09, 0.022, -0.11, 1.065, 0, C.steel, { mat: 'metal' }),
    box(0.022, 0.09, 0.022, 0.01, 1.065, 0, C.steel, { mat: 'metal' }),
    box(0.19, 0.04, 0.035, -0.05, 1.13, 0, C.walnut, { mat: 'wood' }),
    // temperature gauge
    cyl(0.045, 0.045, 0.03, -0.05, 0.93, 0.155, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.036, 0.036, 0.032, -0.05, 0.93, 0.157, C.cream, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.005, 0.028, 0.006, -0.05, 0.936, 0.174, C.red, { mat: 'matte' }),
    // side shelf
    box(0.15, 0.032, 0.36, 0.2725, 0.654, 0, teak, { mat: 'wood' }),
    box(0.12, 0.03, 0.03, 0.26, 0.62, -0.14, metal, { mat: 'metal' }),
    box(0.12, 0.03, 0.03, 0.26, 0.62, 0.14, metal, { mat: 'metal' }),
    box(0.14, 0.02, 0.22, 0.2725, 0.68, -0.02, C.oak, { mat: 'wood' }),
    box(0.03, 0.012, 0.16, 0.2725, 0.682, 0.13, C.steel, { mat: 'metal', rot: [0, 0.3, 0] }),
    box(0.09, 0.01, 0.05, 0.2725, 0.685, 0.13, C.walnut, { mat: 'wood', rot: [0, 0.3, 0] }),
    // front bolts
    cyl(0.011, 0.011, 0.012, -0.2, 0.64, 0.222, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.011, 0.011, 0.012, 0.1, 0.64, 0.222, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // lid hinge barrels along the rear rim
    cyl(0.016, 0.016, 0.055, -0.16, 0.878, -0.245, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.016, 0.016, 0.055, 0.06, 0.878, -0.245, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // chimney vent with damper disc and tab
    cyl(0.016, 0.02, 0.04, -0.05, 1.045, -0.035, C.blackMetal, { mat: 'metal' }, 12),
    cyl(0.028, 0.028, 0.008, -0.05, 1.068, -0.035, C.steel, { mat: 'metal' }, 12),
    box(0.026, 0.008, 0.012, -0.05, 1.068, -0.008, C.steel, { mat: 'metal' }),
    // spatula resting on the side shelf
    box(0.075, 0.008, 0.12, 0.2725, 0.683, -0.13, C.steel, { mat: 'metal', rot: [0, 0.12, 0] }),
    box(0.022, 0.014, 0.11, 0.2725, 0.686, -0.005, C.walnut, { mat: 'wood', rot: [0, 0.12, 0] }),
  ],
})
