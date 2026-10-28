import { C, box, cone, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'whiteboard',
  name: '移动白板',
  category: 'office',
  tags: ['whiteboard', 'board', '白板', '移动白板', '会议'],
  footprint: [1.7, 0.4],
  height: 1.85,
  placement: 'indoor',
  parts: [
    // base legs
    rbox(0.08, 0.05, 0.4, 0.015, -0.73, 0.09, 0, C.steel, { mat: 'metal' }),
    rbox(0.08, 0.05, 0.4, 0.015, 0.73, 0.09, 0, C.steel, { mat: 'metal' }),
    // caster plates and wheels
    rbox(0.075, 0.02, 0.075, 0.01, -0.73, 0.055, 0.145, C.graphite, { mat: 'metal' }),
    rbox(0.075, 0.02, 0.075, 0.01, -0.73, 0.055, -0.145, C.graphite, { mat: 'metal' }),
    rbox(0.075, 0.02, 0.075, 0.01, 0.73, 0.055, 0.145, C.graphite, { mat: 'metal' }),
    rbox(0.075, 0.02, 0.075, 0.01, 0.73, 0.055, -0.145, C.graphite, { mat: 'metal' }),
    cyl(0.036, 0.036, 0.028, -0.73, 0.036, 0.145, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.036, 0.036, 0.028, -0.73, 0.036, -0.145, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.036, 0.036, 0.028, 0.73, 0.036, 0.145, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.036, 0.036, 0.028, 0.73, 0.036, -0.145, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 20),
    // uprights
    rbox(0.055, 1.72, 0.055, 0.014, -0.73, 0.955, -0.03, C.steel, { mat: 'metal' }),
    rbox(0.055, 1.72, 0.055, 0.014, 0.73, 0.955, -0.03, C.steel, { mat: 'metal' }),
    cyl(0.018, 0.018, 1.46, 0, 1.832, -0.03, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 20),
    // board frame and surfaces
    rbox(1.5, 1.02, 0.045, 0.012, 0, 1.28, 0, C.steel, { mat: 'metal' }),
    box(1.42, 0.94, 0.006, 0, 1.28, 0.024, C.white, { mat: 'gloss' }),
    box(1.42, 0.94, 0.006, 0, 1.28, -0.024, C.white, { mat: 'gloss' }),
    rbox(0.055, 0.055, 0.055, 0.008, -0.72, 0.795, 0, C.graphite, { mat: 'metal' }),
    rbox(0.055, 0.055, 0.055, 0.008, 0.72, 0.795, 0, C.graphite, { mat: 'metal' }),
    rbox(0.055, 0.055, 0.055, 0.008, -0.72, 1.765, 0, C.graphite, { mat: 'metal' }),
    rbox(0.055, 0.055, 0.055, 0.008, 0.72, 1.765, 0, C.graphite, { mat: 'metal' }),
    // front diagram: circles and connector
    torus(0.055, 0.0045, -0.45, 1.48, 0.03, C.navy, { mat: 'matte' }, 28),
    torus(0.045, 0.004, -0.45, 1.3, 0.03, C.sage, { mat: 'matte' }, 24),
    rbox(0.006, 0.09, 0.003, 0.001, -0.45, 1.39, 0.03, C.graphite, { mat: 'matte' }),
    rbox(0.4, 0.005, 0.003, 0.001, -0.17, 1.48, 0.03, C.graphite, { mat: 'matte' }),
    cone(0.018, 0.04, 0.045, 1.48, 0.03, C.graphite, { mat: 'matte', rot: [0, 0, -Math.PI / 2] }, 12),
    // front diagram: outlined process box
    rbox(0.34, 0.006, 0.003, 0.001, 0.28, 1.56, 0.03, C.graphite, { mat: 'matte' }),
    rbox(0.34, 0.006, 0.003, 0.001, 0.28, 1.4, 0.03, C.graphite, { mat: 'matte' }),
    rbox(0.006, 0.166, 0.003, 0.001, 0.11, 1.48, 0.03, C.graphite, { mat: 'matte' }),
    rbox(0.006, 0.166, 0.003, 0.001, 0.45, 1.48, 0.03, C.graphite, { mat: 'matte' }),
    cyl(0.014, 0.014, 0.003, 0.28, 1.48, 0.03, C.sage, { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 14),
    // front diagram: bar chart
    rbox(0.34, 0.006, 0.003, 0.001, 0.34, 1.07, 0.03, C.graphite, { mat: 'matte' }),
    rbox(0.035, 0.08, 0.003, 0.001, 0.23, 1.11, 0.03, C.navy, { mat: 'matte' }),
    rbox(0.035, 0.14, 0.003, 0.001, 0.31, 1.14, 0.03, C.sage, { mat: 'matte' }),
    rbox(0.035, 0.1, 0.003, 0.001, 0.39, 1.12, 0.03, C.blush, { mat: 'matte' }),
    rbox(0.035, 0.2, 0.003, 0.001, 0.47, 1.17, 0.03, C.brass, { mat: 'matte' }),
    // front diagram: note lines
    rbox(0.4, 0.005, 0.003, 0.001, -0.42, 1.05, 0.03, C.graphite, { mat: 'matte' }),
    // back diagram: simple mind map
    torus(0.05, 0.004, 0, 1.5, -0.03, C.graphite, { mat: 'matte' }, 24),
    torus(0.035, 0.0035, -0.24, 1.3, -0.03, C.navy, { mat: 'matte' }, 20),
    torus(0.035, 0.0035, 0.24, 1.3, -0.03, C.sage, { mat: 'matte' }, 20),
    rbox(0.02, 0.14, 0.003, 0.001, -0.11, 1.38, -0.03, C.graphite, { mat: 'matte', rot: [0, 0, -0.9] }),
    rbox(0.02, 0.14, 0.003, 0.001, 0.11, 1.38, -0.03, C.graphite, { mat: 'matte', rot: [0, 0, 0.9] }),
    // marker tray and brackets
    rbox(0.04, 0.05, 0.07, 0.008, -0.45, 0.75, 0.06, C.graphite, { mat: 'metal' }),
    rbox(0.04, 0.05, 0.07, 0.008, 0.45, 0.75, 0.06, C.graphite, { mat: 'metal' }),
    rbox(1.24, 0.018, 0.09, 0.006, 0, 0.741, 0.075, C.steel, { mat: 'metal' }),
    rbox(1.24, 0.025, 0.012, 0.004, 0, 0.758, 0.118, C.steel, { mat: 'metal' }),
    // markers and eraser
    cyl(0.011, 0.011, 0.12, -0.35, 0.762, 0.09, C.navy, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.011, 0.011, 0.12, -0.2, 0.762, 0.09, C.red, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.011, 0.011, 0.12, -0.05, 0.762, 0.09, C.sage, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 12),
    rbox(0.13, 0.035, 0.055, 0.008, 0.25, 0.77, 0.09, C.ink, { mat: 'matte' }),
    rbox(0.11, 0.012, 0.045, 0.005, 0.25, 0.75, 0.09, C.cream, { mat: 'matte' }),

    // marker caps at the ends of the pens
    cyl(0.012, 0.012, 0.024, -0.29, 0.762, 0.09, C.navy, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.012, 0.012, 0.024, -0.14, 0.762, 0.09, C.red, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.012, 0.012, 0.024, 0.01, 0.762, 0.09, C.sage, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 12),
    // printed sheet held by two magnets
    rbox(0.2, 0.28, 0.002, 0.002, 0.58, 1.38, 0.0285, C.white, { mat: 'matte' }),
    ...[0.06, 0.02, -0.02].map((dy) =>
      box(0.14, 0.004, 0.001, 0.58, 1.38 + dy, 0.0305, '#b7b0a2', { mat: 'matte' }),
    ),
    cyl(0.014, 0.014, 0.006, 0.52, 1.5, 0.0315, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.014, 0.014, 0.006, 0.64, 1.5, 0.0315, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    // brass end caps on the marker tray
    rbox(0.012, 0.028, 0.092, 0.004, -0.624, 0.746, 0.075, C.brass, { mat: 'metal' }),
    rbox(0.012, 0.028, 0.092, 0.004, 0.624, 0.746, 0.075, C.brass, { mat: 'metal' }),
  ],
})
