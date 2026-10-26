import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'washer',
  name: '滚筒洗衣机',
  category: 'laundry',
  tags: ['washer', 'washing machine', '洗衣机', '洗衣房', 'appliance'],
  footprint: [0.62, 0.68],
  height: 0.88,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Levelling feet and white cabinet
    cyl(0.018, 0.018, 0.03, -0.24, 0.015, -0.24, C.graphite, { mat: 'metal' }, 12),
    cyl(0.018, 0.018, 0.03, 0.24, 0.015, -0.24, C.graphite, { mat: 'metal' }, 12),
    cyl(0.018, 0.018, 0.03, -0.24, 0.015, 0.22, C.graphite, { mat: 'metal' }, 12),
    cyl(0.018, 0.018, 0.03, 0.24, 0.015, 0.22, C.graphite, { mat: 'metal' }, 12),
    rbox(0.58, 0.82, 0.6, 0.012, 0, 0.44, -0.01, C.white, { mat: 'gloss' }),
    rbox(0.6, 0.03, 0.62, 0.01, 0, 0.865, -0.01, C.white, { mat: 'gloss' }),
    rbox(0.56, 0.8, 0.02, 0.01, 0, 0.44, 0.295, C.white, { mat: 'gloss' }),
    rbox(0.54, 0.78, 0.04, 0.008, 0, 0.44, -0.32, C.white, { mat: 'gloss' }),

    // Control panel with detergent drawer, display, knob and buttons
    rbox(0.56, 0.14, 0.02, 0.006, 0, 0.785, 0.306, '#33383e', { mat: 'matte' }),
    rbox(0.16, 0.058, 0.018, 0.004, -0.16, 0.785, 0.32, C.white, { mat: 'gloss' }),
    box(0.09, 0.006, 0.006, -0.16, 0.802, 0.331, '#6f777c', { mat: 'matte' }),
    rbox(0.09, 0.04, 0.006, 0.003, 0.0, 0.8, 0.319, '#3c4247', { mat: 'matte' }),
    rbox(0.07, 0.026, 0.004, 0.002, 0.0, 0.8, 0.324, '#8fc7b4', { mat: 'emissive' }),
    cyl(0.028, 0.028, 0.022, 0.17, 0.785, 0.325, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.031, 0.003, 0.17, 0.785, 0.334, C.brass, { mat: 'metal' }, 24),
    box(0.004, 0.014, 0.004, 0.17, 0.798, 0.337, C.brass, { mat: 'metal' }),
    rbox(0.032, 0.012, 0.006, 0.002, -0.09, 0.752, 0.318, '#7c8489', { mat: 'matte' }),
    rbox(0.032, 0.012, 0.006, 0.002, -0.045, 0.752, 0.318, '#7c8489', { mat: 'matte' }),
    rbox(0.032, 0.012, 0.006, 0.002, 0.0, 0.752, 0.318, '#7c8489', { mat: 'matte' }),

    // Porthole door with dark rims and drum behind the glass
    cyl(0.17, 0.17, 0.02, 0, 0.445, 0.305, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.2, 0.011, 0, 0.445, 0.304, C.graphite, { mat: 'metal' }, 32),
    torus(0.178, 0.022, 0, 0.445, 0.315, C.ink, { mat: 'metal' }, 32),
    cyl(0.162, 0.162, 0.012, 0, 0.445, 0.319, C.glass, { mat: 'glass', opacity: 0.8, rot: [Math.PI / 2, 0, 0] }, 32),
    rbox(0.02, 0.055, 0.018, 0.006, 0.245, 0.49, 0.31, '#4b5155', { mat: 'metal' }),
    rbox(0.02, 0.055, 0.018, 0.006, 0.245, 0.4, 0.31, '#4b5155', { mat: 'metal' }),
    rbox(0.028, 0.06, 0.012, 0.006, -0.245, 0.53, 0.305, '#4b5155', { mat: 'metal' }),

    // Small brass badge
    box(0.055, 0.012, 0.003, 0.2, 0.13, 0.307, C.brass, { mat: 'metal' }),
  ],
})
