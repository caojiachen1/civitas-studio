import { C, box, cyl, defineModel, prism, rbox, sphere } from '../../kit'

// Deterministic arched profile for the mirror frame and its layers.
function arch(halfWidth: number, straight: number): [number, number][] {
  const points: [number, number][] = [
    [-halfWidth, 0],
    [halfWidth, 0],
    [halfWidth, straight],
  ]
  const steps = 10
  for (let i = 1; i <= steps; i++) {
    const angle = (Math.PI * i) / steps
    points.push([Math.cos(angle) * halfWidth, straight + Math.sin(angle) * halfWidth])
  }
  return points
}

export default defineModel({
  id: 'vanity-table',
  name: '梳妆台',
  category: 'bedroom',
  tags: ['vanity', 'dressing table', '梳妆台', '卧室', 'mirror', 'stool'],
  footprint: [1.15, 0.5],
  height: 1.55,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Stone top
    rbox(1.1, 0.04, 0.46, 0.01, 0, 0.78, -0.01, '#cfc8ba', { mat: 'stone' }),

    // Drawer cabinet on the right
    box(0.37, 0.66, 0.4, 0.345, 0.43, -0.03, C.oak, { mat: 'wood' }),
    rbox(0.33, 0.27, 0.014, 0.006, 0.345, 0.6, 0.178, '#b98f5e', { mat: 'wood' }),
    rbox(0.33, 0.27, 0.014, 0.006, 0.345, 0.31, 0.178, '#b98f5e', { mat: 'wood' }),
    box(0.33, 0.004, 0.005, 0.345, 0.455, 0.187, '#8f6d44', { mat: 'wood' }),
    cyl(0.0055, 0.0055, 0.11, 0.345, 0.6, 0.193, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.0055, 0.0055, 0.11, 0.345, 0.31, 0.193, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.005, 0.005, 0.014, 0.3, 0.6, 0.186, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.005, 0.005, 0.014, 0.39, 0.6, 0.186, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.005, 0.005, 0.014, 0.3, 0.31, 0.186, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.005, 0.005, 0.014, 0.39, 0.31, 0.186, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.02, 0.014, 0.1, 0.2, 0.05, 0.12, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.014, 0.1, 0.49, 0.05, 0.12, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.014, 0.1, 0.2, 0.05, -0.18, C.walnut, { mat: 'wood' }, 10),
    cyl(0.02, 0.014, 0.1, 0.49, 0.05, -0.18, C.walnut, { mat: 'wood' }, 10),

    // Slender turned legs and aprons on the open side
    cyl(0.024, 0.015, 0.76, -0.5, 0.38, -0.16, C.walnut, { mat: 'wood' }, 12),
    cyl(0.024, 0.015, 0.76, -0.5, 0.38, 0.14, C.walnut, { mat: 'wood' }, 12),
    cyl(0.019, 0.019, 0.025, -0.5, 0.0125, -0.16, C.brass, { mat: 'metal' }, 12),
    cyl(0.019, 0.019, 0.025, -0.5, 0.0125, 0.14, C.brass, { mat: 'metal' }, 12),
    box(0.65, 0.05, 0.025, -0.175, 0.73, 0.185, C.oak, { mat: 'wood' }),
    box(0.025, 0.05, 0.3, -0.512, 0.73, -0.01, C.oak, { mat: 'wood' }),

    // Stool tucked under the open side
    rbox(0.42, 0.06, 0.32, 0.02, -0.18, 0.455, 0.01, C.sage, { mat: 'fabric' }),
    box(0.4, 0.025, 0.3, -0.18, 0.4125, 0.01, C.walnut, { mat: 'wood' }),
    cyl(0.017, 0.011, 0.4, -0.35, 0.2, -0.11, C.walnut, { mat: 'wood' }, 10),
    cyl(0.017, 0.011, 0.4, -0.01, 0.2, -0.11, C.walnut, { mat: 'wood' }, 10),
    cyl(0.017, 0.011, 0.4, -0.35, 0.2, 0.13, C.walnut, { mat: 'wood' }, 10),
    cyl(0.017, 0.011, 0.4, -0.01, 0.2, 0.13, C.walnut, { mat: 'wood' }, 10),
    cyl(0.004, 0.004, 0.34, -0.18, 0.16, -0.11, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.004, 0.004, 0.34, -0.18, 0.16, 0.13, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),

    // Arched mirror: walnut frame, brass liner, glass
    prism(arch(0.33, 0.34), 0.035, 0, 0.88, -0.225, '#6b4b34', { mat: 'wood' }),
    prism(arch(0.304, 0.33), 0.012, 0, 0.89, -0.204, '#c39a5c', { mat: 'metal' }),
    prism(arch(0.28, 0.315), 0.006, 0, 0.9, -0.196, C.glass, { mat: 'glass', opacity: 0.7 }),

    // Cosmetics: tray, perfume, cream jar and brush cup
    rbox(0.3, 0.01, 0.18, 0.006, -0.2, 0.805, 0, '#75533a', { mat: 'wood' }),
    box(0.012, 0.018, 0.18, -0.344, 0.818, 0, C.walnut, { mat: 'wood' }),
    box(0.012, 0.018, 0.18, -0.056, 0.818, 0, C.walnut, { mat: 'wood' }),
    box(0.3, 0.018, 0.012, -0.2, 0.818, -0.084, C.walnut, { mat: 'wood' }),
    box(0.3, 0.018, 0.012, -0.2, 0.818, 0.084, C.walnut, { mat: 'wood' }),
    cyl(0.018, 0.021, 0.065, -0.29, 0.8435, -0.03, C.glass, { mat: 'glass', opacity: 0.8 }, 16),
    cyl(0.009, 0.009, 0.006, -0.29, 0.879, -0.03, C.brass, { mat: 'metal' }, 12),
    cyl(0.024, 0.024, 0.028, -0.18, 0.825, 0.02, '#c9a099', { mat: 'ceramic' }, 18),
    cyl(0.025, 0.025, 0.008, -0.18, 0.843, 0.02, C.brass, { mat: 'metal' }, 18),
    cyl(0.028, 0.032, 0.07, -0.1, 0.846, -0.02, C.cream, { mat: 'ceramic' }, 18),
    cyl(0.004, 0.004, 0.1, -0.112, 0.9, -0.03, C.walnut, { mat: 'wood' }, 8),
    cyl(0.004, 0.004, 0.1, -0.1, 0.902, -0.01, C.walnut, { mat: 'wood' }, 8),
    cyl(0.004, 0.004, 0.1, -0.088, 0.9, -0.032, C.walnut, { mat: 'wood' }, 8),

    // mirror corner rosettes, glass highlight and drawer reveals
    sphere(0.018, -0.318, 1.2, -0.19, C.brass, { mat: 'metal' }, 10),
    sphere(0.018, 0.318, 1.2, -0.19, C.brass, { mat: 'metal' }, 10),
    box(0.10, 0.5, 0.002, -0.1, 1.25, -0.192, '#e3efec', { mat: 'glass', opacity: 0.16, rot: [0, 0, 0.12] }),
    box(0.33, 0.004, 0.005, 0.345, 0.738, 0.184, '#8f6d44', { mat: 'wood' }),
    box(0.33, 0.004, 0.005, 0.345, 0.448, 0.184, '#8f6d44', { mat: 'wood' }),
    box(0.006, 0.56, 0.005, 0.181, 0.455, 0.184, '#8f6d44', { mat: 'wood' }),
    box(0.006, 0.56, 0.005, 0.509, 0.455, 0.184, '#8f6d44', { mat: 'wood' }),
  ],
})
