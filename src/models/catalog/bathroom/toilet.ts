import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

export default defineModel({
  id: 'toilet',
  name: '马桶',
  category: 'bathroom',
  tags: ['toilet', 'wc', '马桶', '坐便器', '卫浴'],
  footprint: [0.42, 0.72],
  height: 0.78,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // floor flange and shadow gap
    rbox(0.2, 0.022, 0.26, 0.03, 0, 0.011, -0.01, C.white, { mat: 'ceramic' }),
    rbox(0.17, 0.06, 0.22, 0.04, 0, 0.05, 0, C.white, { mat: 'ceramic' }),
    // pedestal foot with front seam
    cyl(0.088, 0.11, 0.2, 0, 0.18, 0.07, C.white, { mat: 'ceramic' }, 24),
    box(0.003, 0.16, 0.003, 0, 0.17, 0.176, '#dcd8ce'),
    // bowl stack
    rbox(0.29, 0.13, 0.39, 0.09, 0, 0.315, 0.06, C.white, { mat: 'ceramic' }),
    rbox(0.365, 0.17, 0.45, 0.16, 0, 0.4, 0.055, C.white, { mat: 'ceramic' }),
    rbox(0.39, 0.03, 0.475, 0.16, 0, 0.487, 0.055, C.white, { mat: 'gloss' }),
    // seat seam shadow
    rbox(0.362, 0.014, 0.448, 0.15, 0, 0.508, 0.055, C.cream, { mat: 'matte' }),
    // seat and lid
    rbox(0.356, 0.024, 0.442, 0.15, 0, 0.525, 0.055, C.white, { mat: 'gloss' }),
    rbox(0.344, 0.034, 0.43, 0.145, 0, 0.554, 0.06, C.white, { mat: 'gloss' }),
    box(0.33, 0.004, 0.004, 0, 0.518, 0.278, C.cream),
    rbox(0.33, 0.008, 0.415, 0.13, 0, 0.576, 0.06, C.white, { mat: 'gloss' }),
    box(0.3, 0.004, 0.004, 0, 0.573, 0.277, C.cream),
    rbox(0.075, 0.012, 0.022, 0.005, 0, 0.539, 0.282, C.cream, { mat: 'ceramic' }),
    // rubber seat bumpers
    rbox(0.022, 0.012, 0.022, 0.005, -0.1, 0.507, 0.21, C.cream, { mat: 'matte' }),
    rbox(0.022, 0.012, 0.022, 0.005, 0.1, 0.507, 0.21, C.cream, { mat: 'matte' }),
    // soft-close hinges with caps
    rbox(0.032, 0.022, 0.05, 0.008, 0.085, 0.519, -0.158, C.brass, { mat: 'metal' }),
    rbox(0.032, 0.022, 0.05, 0.008, -0.085, 0.519, -0.158, C.brass, { mat: 'metal' }),
    cyl(0.007, 0.007, 0.05, 0.085, 0.515, -0.158, C.ink, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.007, 0.007, 0.05, -0.085, 0.515, -0.158, C.ink, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.012, 0.012, 0.008, 0.085, 0.527, -0.13, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.012, 0.012, 0.008, -0.085, 0.527, -0.13, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    // tank body and joint
    rbox(0.3, 0.05, 0.1, 0.02, 0, 0.365, -0.205, C.white, { mat: 'ceramic' }),
    rbox(0.37, 0.38, 0.15, 0.03, 0, 0.55, -0.27, C.white, { mat: 'ceramic' }),
    rbox(0.39, 0.028, 0.168, 0.02, 0, 0.754, -0.27, C.white, { mat: 'gloss' }),
    // tank lid seams and side bolt covers
    box(0.372, 0.006, 0.004, 0, 0.69, -0.194, C.cream),
    box(0.376, 0.004, 0.004, 0, 0.741, -0.19, '#d5d1c7'),
    cyl(0.014, 0.014, 0.004, -0.186, 0.45, -0.27, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.014, 0.014, 0.004, 0.186, 0.45, -0.27, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    // dual flush buttons
    cyl(0.043, 0.043, 0.012, -0.052, 0.774, -0.27, C.brass, { mat: 'metal' }, 24),
    cyl(0.043, 0.043, 0.012, 0.052, 0.774, -0.27, C.brass, { mat: 'metal' }, 24),
    torus(0.043, 0.0045, -0.052, 0.774, -0.27, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.043, 0.0045, 0.052, 0.774, -0.27, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    // supply valve, braided hose and stop
    cyl(0.012, 0.012, 0.19, 0.15, 0.095, -0.34, C.steel, { mat: 'metal' }, 12),
    cyl(0.019, 0.019, 0.01, 0.15, 0.005, -0.34, C.steel, { mat: 'metal' }, 16),
    cyl(0.006, 0.006, 0.07, 0.15, 0.19, -0.34, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    rbox(0.03, 0.012, 0.012, 0.006, 0.185, 0.19, -0.34, C.brass, { mat: 'metal' }),
    cyl(0.026, 0.026, 0.008, 0.15, 0.19, -0.353, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.006, 0.006, 0.17, 0.14, 0.275, -0.33, C.steel, { mat: 'metal', rot: [0.25, 0, 0.12] }, 10),
    cyl(0.012, 0.012, 0.02, 0.144, 0.362, -0.335, C.brass, { mat: 'metal' }, 12),
    // floor bolt escutcheons and hex nuts
    cyl(0.022, 0.024, 0.006, 0.075, 0.003, 0.09, C.steel, { mat: 'metal' }, 16),
    cyl(0.022, 0.024, 0.006, -0.075, 0.003, 0.09, C.steel, { mat: 'metal' }, 16),
    cyl(0.008, 0.008, 0.01, 0.075, 0.026, 0.09, C.steel, { mat: 'metal' }, 6),
    cyl(0.008, 0.008, 0.01, -0.075, 0.026, 0.09, C.steel, { mat: 'metal' }, 6),
    sphere(0.012, 0.075, 0.012, 0.09, C.steel, { mat: 'metal' }, 10),
    sphere(0.012, -0.075, 0.012, 0.09, C.steel, { mat: 'metal' }, 10),
    // silicone bead sealing the flange to the floor
    box(0.2, 0.006, 0.012, 0, 0.003, 0.118, '#d3cdc1', { mat: 'matte' }),
    box(0.01, 0.006, 0.25, 0.101, 0.003, -0.005, '#d3cdc1', { mat: 'matte' }),
    box(0.01, 0.006, 0.25, -0.101, 0.003, -0.005, '#d3cdc1', { mat: 'matte' }),
    // chrome floor escutcheon at the supply stop
    cyl(0.022, 0.024, 0.008, 0.15, 0.004, -0.34, C.steel, { mat: 'metal' }, 16),
  ],
})
