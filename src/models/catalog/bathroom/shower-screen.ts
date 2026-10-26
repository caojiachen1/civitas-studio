import { C, box, cyl, defineModel, rbox } from '../../kit'

const FRAME = '#23262a'
const GLASS_TINT = '#b6cfd3'

export default defineModel({
  id: 'shower-screen',
  name: '淋浴隔断',
  category: 'bathroom',
  tags: ['shower screen', 'glass partition', 'walk-in shower', '淋浴隔断', '玻璃隔断', '淋浴屏', '卫浴'],
  footprint: [1.25, 0.95],
  height: 2.15,
  placement: 'indoor',
  parts: [
    // low stone threshold with chamfered top
    rbox(1.2, 0.055, 0.075, 0.012, 0, 0.0275, 0.38, C.stone, { mat: 'stone' }),
    box(1.2, 0.006, 0.075, 0, 0.058, 0.38, C.concrete, { mat: 'stone' }),
    rbox(0.022, 0.05, 0.08, 0.005, -0.596, 0.027, 0.38, C.concrete, { mat: 'stone' }),
    rbox(0.022, 0.05, 0.08, 0.005, 0.596, 0.027, 0.38, C.concrete, { mat: 'stone' }),

    // linear floor drain inside the shower zone
    rbox(0.56, 0.006, 0.07, 0.004, 0.26, 0.003, -0.08, C.graphite, { mat: 'metal' }),
    box(0.5, 0.002, 0.004, 0.26, 0.007, -0.1, C.ink),
    box(0.5, 0.002, 0.004, 0.26, 0.007, -0.08, C.ink),
    box(0.5, 0.002, 0.004, 0.26, 0.007, -0.06, C.ink),

    // fixed glass panel (left) and swinging door (right)
    box(0.55, 2.02, 0.012, -0.31, 1.1, 0.38, GLASS_TINT, { mat: 'glass', opacity: 0.4 }),
    box(0.54, 2.02, 0.012, 0.31, 1.1, 0.38, GLASS_TINT, { mat: 'glass', opacity: 0.4 }),

    // slim black frame: verticals
    rbox(0.026, 2.095, 0.028, 0.006, -0.6, 1.1025, 0.38, FRAME, { mat: 'metal' }),
    rbox(0.026, 2.095, 0.028, 0.006, -0.02, 1.1025, 0.38, FRAME, { mat: 'metal' }),
    rbox(0.026, 2.095, 0.028, 0.006, 0.02, 1.1025, 0.38, FRAME, { mat: 'metal' }),
    rbox(0.026, 2.095, 0.028, 0.006, 0.6, 1.1025, 0.38, FRAME, { mat: 'metal' }),

    // slim black frame: top and bottom rails
    rbox(0.58, 0.026, 0.03, 0.006, -0.31, 2.123, 0.38, FRAME, { mat: 'metal' }),
    rbox(0.58, 0.026, 0.03, 0.006, -0.31, 0.074, 0.38, FRAME, { mat: 'metal' }),
    rbox(0.57, 0.026, 0.03, 0.006, 0.31, 2.123, 0.38, FRAME, { mat: 'metal' }),
    rbox(0.57, 0.026, 0.03, 0.006, 0.31, 0.074, 0.38, FRAME, { mat: 'metal' }),
    // shared header cap tying both panels together
    rbox(1.24, 0.02, 0.038, 0.006, 0, 2.14, 0.38, FRAME, { mat: 'metal' }),

    // hinges at the meeting stiles
    rbox(0.048, 0.09, 0.05, 0.008, 0, 0.8, 0.395, C.graphite, { mat: 'metal' }),
    cyl(0.011, 0.011, 0.12, 0, 0.8, 0.412, C.graphite, { mat: 'metal' }, 14),
    rbox(0.048, 0.09, 0.05, 0.008, 0, 1.72, 0.395, C.graphite, { mat: 'metal' }),
    cyl(0.011, 0.011, 0.12, 0, 1.72, 0.412, C.graphite, { mat: 'metal' }, 14),

    // vertical pull handle on the door edge
    cyl(0.011, 0.011, 0.36, 0.52, 1.15, 0.408, C.blackMetal, { mat: 'metal' }, 16),
    cyl(0.008, 0.008, 0.03, 0.52, 1.31, 0.393, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.008, 0.008, 0.03, 0.52, 0.99, 0.393, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.014, 0.014, 0.016, 0.52, 1.336, 0.408, C.blackMetal, { mat: 'metal' }, 12),
    cyl(0.014, 0.014, 0.016, 0.52, 0.964, 0.408, C.blackMetal, { mat: 'metal' }, 12),

    // seals and floor brackets
    box(0.56, 0.018, 0.006, -0.31, 0.102, 0.388, C.graphite, { mat: 'matte' }),
    box(0.54, 0.018, 0.006, 0.31, 0.102, 0.388, C.graphite, { mat: 'matte' }),
    rbox(0.06, 0.012, 0.09, 0.004, -0.59, 0.006, 0.38, C.blackMetal, { mat: 'metal' }),
    rbox(0.06, 0.012, 0.09, 0.004, 0.59, 0.006, 0.38, C.blackMetal, { mat: 'metal' }),
  ],
})
