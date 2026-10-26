import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

export default defineModel({
  id: 'towel-rack',
  name: '毛巾架',
  category: 'bathroom',
  tags: ['towel rack', 'towel rail', '毛巾架', '毛巾杆', '卫浴'],
  footprint: [0.6, 0.4],
  height: 1.55,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // feet and rubber glides
    rbox(0.05, 0.03, 0.4, 0.012, -0.27, 0.027, 0, C.blackMetal, { mat: 'metal' }),
    rbox(0.05, 0.03, 0.4, 0.012, 0.27, 0.027, 0, C.blackMetal, { mat: 'metal' }),
    rbox(0.056, 0.012, 0.06, 0.006, -0.27, 0.006, 0.165, C.ink, { mat: 'matte' }),
    rbox(0.056, 0.012, 0.06, 0.006, -0.27, 0.006, -0.165, C.ink, { mat: 'matte' }),
    rbox(0.056, 0.012, 0.06, 0.006, 0.27, 0.006, 0.165, C.ink, { mat: 'matte' }),
    rbox(0.056, 0.012, 0.06, 0.006, 0.27, 0.006, -0.165, C.ink, { mat: 'matte' }),
    // uprights
    cyl(0.019, 0.024, 1.48, -0.27, 0.78, 0, C.blackMetal, { mat: 'metal' }, 20),
    cyl(0.019, 0.024, 1.48, 0.27, 0.78, 0, C.blackMetal, { mat: 'metal' }, 20),
    cyl(0.03, 0.03, 0.02, -0.27, 0.05, 0, C.brass, { mat: 'metal' }, 20),
    cyl(0.03, 0.03, 0.02, 0.27, 0.05, 0, C.brass, { mat: 'metal' }, 20),
    // finials
    sphere(0.028, -0.27, 1.522, 0, C.brass, { mat: 'metal' }, 18),
    sphere(0.028, 0.27, 1.522, 0, C.brass, { mat: 'metal' }, 18),
    // brass rails
    cyl(0.012, 0.012, 0.54, 0, 0.85, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.012, 0.012, 0.54, 0, 1.15, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.012, 0.012, 0.54, 0, 1.42, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.012, 0.012, 0.54, 0, 0.55, 0, C.blackMetal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    cyl(0.017, 0.017, 0.022, -0.255, 1.15, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    cyl(0.017, 0.017, 0.022, -0.255, 0.85, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    cyl(0.017, 0.017, 0.022, -0.255, 1.42, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    // folded linen towel on top rail
    rbox(0.38, 0.03, 0.104, 0.012, 0, 1.436, 0, C.linen, { mat: 'fabric' }),
    rbox(0.38, 0.24, 0.022, 0.008, 0, 1.3, 0.052, C.linen, { mat: 'fabric' }),
    rbox(0.38, 0.24, 0.022, 0.008, 0, 1.3, -0.052, C.linen, { mat: 'fabric' }),
    box(0.38, 0.018, 0.006, 0, 1.2, 0.065, '#c3b8a6'),
    box(0.006, 0.24, 0.004, 0.12, 1.3, 0.064, '#c9bfae'),
    // sage towel on middle rail
    rbox(0.34, 0.03, 0.1, 0.012, -0.02, 1.166, 0, C.sage, { mat: 'fabric' }),
    rbox(0.34, 0.24, 0.022, 0.008, -0.02, 1.03, 0.05, C.sage, { mat: 'fabric' }),
    rbox(0.34, 0.24, 0.022, 0.008, -0.02, 1.03, -0.05, C.sage, { mat: 'fabric' }),
    box(0.34, 0.016, 0.006, -0.02, 0.93, 0.062, '#7d8d76'),
    // blush hand towel on lower rail
    rbox(0.26, 0.026, 0.096, 0.012, 0.06, 0.866, 0, C.blush, { mat: 'fabric' }),
    rbox(0.26, 0.22, 0.02, 0.008, 0.06, 0.742, 0.048, C.blush, { mat: 'fabric' }),
    rbox(0.26, 0.22, 0.02, 0.008, 0.06, 0.742, -0.048, C.blush, { mat: 'fabric' }),
    box(0.26, 0.014, 0.006, 0.06, 0.642, 0.059, '#b08c85'),
  ],
})
