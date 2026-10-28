import { C, box, cyl, defineModel, rbox, torus } from '../../kit'

export default defineModel({
  id: 'shower',
  name: '淋浴房',
  category: 'bathroom',
  tags: ['shower', '淋浴房', '淋浴', 'glass', '卫浴'],
  footprint: [1.05, 1.05],
  height: 2.25,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // stone tray
    rbox(1.02, 0.06, 1.02, 0.02, 0, 0.03, 0, C.stone, { mat: 'stone' }),
    rbox(0.9, 0.01, 0.9, 0.01, 0, 0.065, 0, C.concrete, { mat: 'stone' }),
    rbox(1.02, 0.03, 0.05, 0.01, 0, 0.075, 0.485, C.stone, { mat: 'stone' }),
    rbox(0.05, 0.03, 0.92, 0.01, -0.485, 0.075, 0, C.stone, { mat: 'stone' }),
    rbox(0.05, 0.03, 0.92, 0.01, 0.485, 0.075, 0, C.stone, { mat: 'stone' }),
    // drain
    cyl(0.07, 0.07, 0.006, 0, 0.072, 0, C.steel, { mat: 'metal' }, 24),
    torus(0.068, 0.004, 0, 0.074, 0, C.graphite, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    // tiled back wall
    rbox(1.02, 2.19, 0.05, 0.008, 0, 1.155, -0.495, C.stone, { mat: 'stone' }),
    // glass panels
    box(0.012, 2.02, 0.95, -0.5, 1.105, 0.02, C.glass, { mat: 'glass', opacity: 0.45 }),
    box(0.012, 2.02, 0.95, 0.5, 1.105, 0.02, C.glass, { mat: 'glass', opacity: 0.45 }),
    box(0.26, 2.02, 0.012, -0.37, 1.105, 0.5, C.glass, { mat: 'glass', opacity: 0.45 }),
    box(0.66, 2.0, 0.012, 0.15, 1.105, 0.5, C.glass, { mat: 'glass', opacity: 0.45 }),
    // black metal frame
    rbox(1.02, 0.03, 0.03, 0.006, 0, 2.135, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.03, 0.03, 0.96, 0.006, -0.5, 2.135, 0.02, C.blackMetal, { mat: 'metal' }),
    rbox(0.03, 0.03, 0.96, 0.006, 0.5, 2.135, 0.02, C.blackMetal, { mat: 'metal' }),
    rbox(0.026, 2.03, 0.026, 0.006, -0.5, 1.105, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.026, 2.03, 0.026, 0.006, 0.5, 1.105, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.026, 2.03, 0.026, 0.006, -0.5, 1.105, -0.49, C.blackMetal, { mat: 'metal' }),
    rbox(0.026, 2.03, 0.026, 0.006, 0.5, 1.105, -0.49, C.blackMetal, { mat: 'metal' }),
    // door frame and meeting stile
    rbox(0.7, 0.026, 0.026, 0.006, 0.15, 0.105, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.7, 0.026, 0.026, 0.006, 0.15, 2.11, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.026, 2.03, 0.026, 0.006, -0.19, 1.105, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.026, 2.03, 0.026, 0.006, 0.49, 1.105, 0.5, C.blackMetal, { mat: 'metal' }),
    rbox(0.032, 2.03, 0.032, 0.006, -0.22, 1.105, 0.5, C.blackMetal, { mat: 'metal' }),
    // hinges
    rbox(0.022, 0.06, 0.028, 0.006, -0.215, 0.45, 0.502, C.brass, { mat: 'metal' }),
    rbox(0.022, 0.06, 0.028, 0.006, -0.215, 1.76, 0.502, C.brass, { mat: 'metal' }),
    // brass pull handle
    cyl(0.011, 0.011, 0.42, 0.42, 1.15, 0.512, C.brass, { mat: 'metal' }, 16),
    cyl(0.01, 0.01, 0.014, 0.42, 1.31, 0.506, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.01, 0.01, 0.014, 0.42, 0.99, 0.506, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    // rain shower arm and head
    cyl(0.045, 0.045, 0.014, 0, 2.0, -0.465, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.017, 0.017, 0.3, 0, 2.0, -0.32, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.115, 0.115, 0.018, 0, 1.985, -0.15, C.steel, { mat: 'metal' }, 32),
    cyl(0.1, 0.1, 0.006, 0, 1.976, -0.15, C.ink, { mat: 'metal' }, 32),
    // wall mixer
    cyl(0.06, 0.06, 0.014, -0.32, 1.12, -0.463, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.038, 0.038, 0.035, -0.32, 1.12, -0.453, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    rbox(0.085, 0.012, 0.014, 0.005, -0.265, 1.12, -0.438, C.brass, { mat: 'metal' }),
    // recessed niche with bottles
    rbox(0.36, 0.3, 0.006, 0.008, 0.24, 1.5, -0.466, '#5f5c54', { mat: 'stone' }),
    rbox(0.42, 0.024, 0.024, 0.006, 0.24, 1.66, -0.457, C.stone, { mat: 'stone' }),
    rbox(0.42, 0.024, 0.032, 0.006, 0.24, 1.34, -0.455, C.stone, { mat: 'stone' }),
    rbox(0.024, 0.34, 0.024, 0.006, 0.04, 1.5, -0.457, C.stone, { mat: 'stone' }),
    rbox(0.024, 0.34, 0.024, 0.006, 0.44, 1.5, -0.457, C.stone, { mat: 'stone' }),
    rbox(0.38, 0.012, 0.07, 0.006, 0.24, 1.352, -0.44, C.glass, { mat: 'glass', opacity: 0.5 }),
    cyl(0.03, 0.033, 0.15, 0.14, 1.435, -0.438, C.clay, { mat: 'gloss' }, 16),
    cyl(0.014, 0.014, 0.025, 0.14, 1.522, -0.438, C.ink, { mat: 'matte' }, 12),
    cyl(0.022, 0.024, 0.11, 0.23, 1.415, -0.438, C.cream, { mat: 'gloss' }, 16),
    cyl(0.007, 0.007, 0.05, 0.23, 1.492, -0.438, C.steel, { mat: 'metal' }, 10),
    cyl(0.02, 0.021, 0.17, 0.32, 1.445, -0.438, C.sage, { mat: 'gloss' }, 16),
    cyl(0.021, 0.021, 0.018, 0.32, 1.539, -0.438, C.brass, { mat: 'metal' }, 14),

    // grout joints picking out the large-format tiling
    ...[0.55, 1.05, 1.55, 2.05].map((y) =>
      box(1.0, 0.004, 0.003, 0, y, -0.4685, '#8b8981', { mat: 'stone' }),
    ),
    ...[-0.255, 0.255].map((x) => box(0.004, 2.08, 0.003, x, 1.15, -0.4685, '#8b8981', { mat: 'stone' })),

    // brass slide rail with a handset cradle
    cyl(0.011, 0.011, 0.95, -0.16, 1.42, -0.447, C.brass, { mat: 'metal' }, 12),
    box(0.028, 0.03, 0.03, -0.16, 1.885, -0.459, C.brass, { mat: 'metal' }),
    box(0.028, 0.03, 0.03, -0.16, 0.955, -0.459, C.brass, { mat: 'metal' }),
    rbox(0.05, 0.075, 0.05, 0.012, -0.16, 1.52, -0.424, C.brass, { mat: 'metal' }),
    cyl(0.024, 0.03, 0.11, -0.16, 1.51, -0.4, C.steel, { mat: 'metal', rot: [-0.9, 0, 0] }, 16),
    cyl(0.028, 0.028, 0.01, -0.16, 1.476, -0.357, C.graphite, { mat: 'metal', rot: [-0.9, 0, 0] }, 16),

    // silicone bead where the tray meets the tiled wall
    box(1.0, 0.006, 0.012, 0, 0.063, -0.462, '#d3cdc1', { mat: 'matte' }),
  ],
})
