import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'dryer',
  name: '烘干机',
  category: 'laundry',
  tags: ['dryer', 'tumble dryer', '烘干机', '洗衣房', 'appliance', 'vent'],
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
    rbox(0.54, 0.55, 0.04, 0.008, 0, 0.375, -0.32, C.white, { mat: 'gloss' }),

    // Control panel: knob left, display and programme buttons
    rbox(0.56, 0.14, 0.02, 0.006, 0, 0.785, 0.306, '#33383e', { mat: 'matte' }),
    cyl(0.028, 0.028, 0.022, -0.17, 0.785, 0.325, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.031, 0.003, -0.17, 0.785, 0.334, C.brass, { mat: 'metal' }, 24),
    box(0.004, 0.014, 0.004, -0.17, 0.798, 0.337, C.brass, { mat: 'metal' }),
    rbox(0.1, 0.04, 0.006, 0.003, 0.1, 0.8, 0.319, '#3c4247', { mat: 'matte' }),
    rbox(0.08, 0.026, 0.004, 0.002, 0.1, 0.8, 0.324, '#e8b87a', { mat: 'emissive' }),
    rbox(0.03, 0.012, 0.006, 0.002, -0.04, 0.752, 0.318, '#7c8489', { mat: 'matte' }),
    rbox(0.03, 0.012, 0.006, 0.002, 0.0, 0.752, 0.318, '#7c8489', { mat: 'matte' }),
    rbox(0.03, 0.012, 0.006, 0.002, 0.04, 0.752, 0.318, '#7c8489', { mat: 'matte' }),
    rbox(0.03, 0.012, 0.006, 0.002, 0.08, 0.752, 0.318, '#7c8489', { mat: 'matte' }),

    // Lint filter hatch
    rbox(0.16, 0.045, 0.012, 0.005, -0.19, 0.685, 0.309, C.cream, { mat: 'gloss' }),
    box(0.13, 0.008, 0.004, -0.19, 0.685, 0.317, '#6f777c', { mat: 'matte' }),
    box(0.006, 0.018, 0.004, -0.25, 0.685, 0.317, C.brass, { mat: 'metal' }),

    // Porthole door with dark rims and drum behind the glass
    cyl(0.17, 0.17, 0.02, 0, 0.445, 0.305, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.2, 0.011, 0, 0.445, 0.304, C.graphite, { mat: 'metal' }, 32),
    torus(0.178, 0.022, 0, 0.445, 0.315, C.ink, { mat: 'metal' }, 32),
    cyl(0.162, 0.162, 0.012, 0, 0.445, 0.319, C.glass, { mat: 'glass', opacity: 0.8, rot: [Math.PI / 2, 0, 0] }, 32),
    rbox(0.02, 0.055, 0.018, 0.006, 0.245, 0.49, 0.31, '#4b5155', { mat: 'metal' }),
    rbox(0.02, 0.055, 0.018, 0.006, 0.245, 0.4, 0.31, '#4b5155', { mat: 'metal' }),
    rbox(0.028, 0.06, 0.012, 0.006, -0.245, 0.53, 0.305, '#4b5155', { mat: 'metal' }),

    // Lower vent grille
    rbox(0.13, 0.085, 0.008, 0.004, 0.2, 0.11, 0.307, '#3c4247', { mat: 'matte' }),
    box(0.1, 0.006, 0.006, 0.2, 0.082, 0.312, C.steel, { mat: 'metal' }),
    box(0.1, 0.006, 0.006, 0.2, 0.102, 0.312, C.steel, { mat: 'metal' }),
    box(0.1, 0.006, 0.006, 0.2, 0.122, 0.312, C.steel, { mat: 'metal' }),
    box(0.1, 0.006, 0.006, 0.2, 0.142, 0.312, C.steel, { mat: 'metal' }),

    // Rear vent stub
    rbox(0.22, 0.12, 0.03, 0.01, 0, 0.78, -0.325, '#8f989d', { mat: 'metal' }),

    // Small brass badge
    box(0.055, 0.012, 0.003, -0.2, 0.13, 0.307, C.brass, { mat: 'metal' }),
  ],
})
