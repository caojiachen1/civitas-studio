import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const paint = '#63745f'
const chrome = C.steel
const dark = '#2f3437'
const wicker = '#b08a5c'

// wheel with tyre, rim, hub and three crossed spoke rods
const wheel = (z: number) => [
  torus(0.3, 0.02, 0, 0.32, z, dark, { mat: 'matte', rot: [0, Math.PI / 2, 0] }, 28),
  torus(0.26, 0.012, 0, 0.32, z, chrome, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 28),
  cyl(0.028, 0.028, 0.08, 0, 0.32, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
  cyl(0.004, 0.004, 0.5, 0, 0.32, z, chrome, { mat: 'metal' }, 6),
  cyl(0.004, 0.004, 0.5, 0, 0.32, z, chrome, { mat: 'metal', rot: [Math.PI / 3, 0, 0] }, 6),
  cyl(0.004, 0.004, 0.5, 0, 0.32, z, chrome, { mat: 'metal', rot: [-Math.PI / 3, 0, 0] }, 6),
]

export default defineModel({
  id: 'bicycle',
  name: '自行车',
  category: 'vehicles',
  tags: ['bicycle', 'bike', 'cycle', '自行车', '单车', '骑行', '非机动车'],
  footprint: [0.6, 1.8],
  height: 1.1,
  placement: 'any',
  parts: [
    // two 700c-style wheels with spokes
    ...wheel(0.57),
    ...wheel(-0.57),

    // fork blades, crown, head tube and stem
    cyl(0.012, 0.012, 0.49, -0.045, 0.555, 0.495, paint, { mat: 'metal', rot: [-0.309, 0, 0] }, 8),
    cyl(0.012, 0.012, 0.49, 0.045, 0.555, 0.495, paint, { mat: 'metal', rot: [-0.309, 0, 0] }, 8),
    box(0.12, 0.035, 0.06, 0, 0.79, 0.42, paint, { mat: 'metal' }),
    cyl(0.022, 0.022, 0.17, 0, 0.875, 0.405, paint, { mat: 'metal', rot: [-0.309, 0, 0] }, 12),
    cyl(0.014, 0.014, 0.11, 0, 1.0, 0.385, chrome, { mat: 'metal', rot: [-0.309, 0, 0] }, 10),

    // swept handlebar, grips, brake levers
    cyl(0.013, 0.013, 0.5, 0, 1.055, 0.38, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.018, 0.018, 0.1, -0.225, 1.055, 0.38, C.leather, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.018, 0.018, 0.1, 0.225, 1.055, 0.38, C.leather, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.1, 0.012, 0.016, -0.15, 1.045, 0.43, chrome, { mat: 'metal', rot: [0, 0.15, 0] }),
    box(0.1, 0.012, 0.016, 0.15, 1.045, 0.43, chrome, { mat: 'metal', rot: [0, -0.15, 0] }),

    // frame: top tube, down tube and seat tube
    cyl(0.018, 0.018, 0.52, 0, 0.935, 0.135, paint, { mat: 'metal', rot: [1.63, 0, 0] }, 10),
    cyl(0.019, 0.019, 0.644, 0, 0.605, 0.21, paint, { mat: 'metal', rot: [0.796, 0, 0] }, 10),
    cyl(0.019, 0.019, 0.56, 0, 0.655, -0.075, paint, { mat: 'metal', rot: [-0.197, 0, 0] }, 10),

    // paired chain stays and seat stays with rear dropouts
    cyl(0.011, 0.011, 0.553, -0.035, 0.35, -0.295, paint, { mat: 'metal', rot: [1.679, 0, 0] }, 8),
    cyl(0.011, 0.011, 0.553, 0.035, 0.35, -0.295, paint, { mat: 'metal', rot: [1.679, 0, 0] }, 8),
    cyl(0.01, 0.01, 0.728, -0.03, 0.61, -0.35, paint, { mat: 'metal', rot: [0.649, 0, 0] }, 8),
    cyl(0.01, 0.01, 0.728, 0.03, 0.61, -0.35, paint, { mat: 'metal', rot: [0.649, 0, 0] }, 8),
    box(0.022, 0.06, 0.05, -0.035, 0.32, -0.57, paint, { mat: 'metal' }),
    box(0.022, 0.06, 0.05, 0.035, 0.32, -0.57, paint, { mat: 'metal' }),

    // seat post and leather saddle with a narrower nose
    cyl(0.012, 0.012, 0.12, 0, 0.97, -0.14, chrome, { mat: 'metal' }, 10),
    rbox(0.16, 0.04, 0.27, 0.035, 0, 1.02, -0.17, C.leather, { mat: 'leather' }),
    rbox(0.09, 0.035, 0.14, 0.03, 0, 1.015, -0.33, C.leather, { mat: 'leather' }),

    // bottom bracket, chainring, cranks and pedals
    cyl(0.032, 0.032, 0.1, 0, 0.38, -0.02, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    cyl(0.09, 0.09, 0.01, 0.055, 0.38, -0.02, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 24),
    cyl(0.01, 0.01, 0.11, 0.075, 0.345, 0.02, dark, { mat: 'metal', rot: [2.29, 0, 0] }, 8),
    cyl(0.01, 0.01, 0.11, -0.075, 0.415, -0.06, dark, { mat: 'metal', rot: [2.29, 0, 0] }, 8),
    box(0.08, 0.018, 0.05, 0.075, 0.3, 0.06, dark, { mat: 'metal' }),
    box(0.08, 0.018, 0.05, -0.075, 0.46, -0.1, dark, { mat: 'metal' }),

    // chain runs and rear sprocket
    cyl(0.006, 0.006, 0.557, 0.06, 0.42, -0.295, dark, { mat: 'metal', rot: [1.409, 0, 0] }, 6),
    cyl(0.006, 0.006, 0.56, 0.06, 0.28, -0.295, dark, { mat: 'metal', rot: [1.625, 0, 0] }, 6),
    cyl(0.055, 0.055, 0.008, 0.06, 0.32, -0.57, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),

    // side stand
    cyl(0.011, 0.011, 0.38, -0.1, 0.16, -0.475, dark, { mat: 'metal', rot: [0.15, 0, 0.33] }, 8),

    // front wicker basket: base, four panels, chrome rim and two stays
    box(0.32, 0.015, 0.24, 0, 0.81, 0.72, wicker, { mat: 'wood' }),
    box(0.32, 0.2, 0.015, 0, 0.915, 0.839, wicker, { mat: 'wood' }),
    box(0.32, 0.2, 0.015, 0, 0.915, 0.601, wicker, { mat: 'wood' }),
    box(0.015, 0.2, 0.24, -0.159, 0.915, 0.72, wicker, { mat: 'wood' }),
    box(0.015, 0.2, 0.24, 0.159, 0.915, 0.72, wicker, { mat: 'wood' }),
    box(0.34, 0.012, 0.018, 0, 1.02, 0.839, chrome, { mat: 'metal' }),
    box(0.34, 0.012, 0.018, 0, 1.02, 0.601, chrome, { mat: 'metal' }),
    box(0.018, 0.012, 0.25, -0.17, 1.02, 0.72, chrome, { mat: 'metal' }),
    box(0.018, 0.012, 0.25, 0.17, 1.02, 0.72, chrome, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.312, -0.065, 0.805, 0.595, chrome, { mat: 'metal', rot: [1.474, 0, 0] }, 8),
    cyl(0.008, 0.008, 0.312, 0.065, 0.805, 0.595, chrome, { mat: 'metal', rot: [1.474, 0, 0] }, 8),

    // bell, front lamp and rear reflector
    sphere(0.022, 0.15, 1.078, 0.38, C.brass, { mat: 'metal' }, 12),
    cyl(0.035, 0.035, 0.05, 0, 0.79, 0.5, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.028, 0.028, 0.01, 0, 0.79, 0.53, '#ffe9c2', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 14),
    box(0.04, 0.045, 0.01, 0, 1.02, -0.4, C.red, { mat: 'gloss' }),
    // amber pedal reflectors clipped to the outer pedal edges
    box(0.012, 0.022, 0.05, 0.118, 0.3, 0.06, '#d99a52', { mat: 'gloss' }),
    box(0.012, 0.022, 0.05, -0.118, 0.46, -0.1, '#d99a52', { mat: 'gloss' }),
    // tyre valve stems at the rims
    cyl(0.004, 0.004, 0.032, 0, 0.602, 0.57, C.steel, { mat: 'metal' }, 6),
    cyl(0.004, 0.004, 0.032, 0, 0.602, -0.57, C.steel, { mat: 'metal' }, 6),
    // quick-release seat clamp around the seat post
    torus(0.017, 0.006, 0, 0.98, -0.14, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    box(0.03, 0.014, 0.02, 0.028, 0.98, -0.14, C.steel, { mat: 'metal' }),
  ],
})
