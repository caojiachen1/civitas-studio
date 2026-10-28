import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

export default defineModel({
  id: 'vanity-mirror',
  name: '浴室柜镜',
  category: 'bathroom',
  tags: ['vanity', 'mirror', 'bathroom cabinet', '浴室柜', '镜柜', '洗手台'],
  footprint: [1.2, 0.55],
  height: 1.9,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // recessed plinth
    rbox(1.08, 0.09, 0.42, 0.01, 0, 0.045, -0.05, C.ink, { mat: 'matte' }),
    // oak carcass
    rbox(1.14, 0.7, 0.48, 0.012, 0, 0.44, -0.03, C.oak, { mat: 'wood' }),
    rbox(1.16, 0.02, 0.49, 0.008, 0, 0.8, -0.03, C.walnut, { mat: 'wood' }),
    // white drawer fronts
    rbox(1.08, 0.29, 0.024, 0.008, 0, 0.625, 0.218, C.white, { mat: 'gloss' }),
    rbox(1.08, 0.33, 0.024, 0.008, 0, 0.285, 0.218, C.white, { mat: 'gloss' }),
    box(1.04, 0.008, 0.006, 0, 0.455, 0.23, C.cream),
    // brass pulls
    rbox(0.36, 0.014, 0.014, 0.006, 0, 0.665, 0.248, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.02, -0.13, 0.665, 0.238, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.02, 0.13, 0.665, 0.238, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    rbox(0.3, 0.014, 0.014, 0.006, 0, 0.33, 0.248, C.brass, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.02, -0.11, 0.33, 0.238, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.02, 0.11, 0.33, 0.238, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    // stone counter and upstand
    rbox(1.2, 0.045, 0.55, 0.012, 0, 0.8125, 0, C.stone, { mat: 'stone' }),
    rbox(1.2, 0.09, 0.022, 0.008, 0, 0.875, -0.263, C.stone, { mat: 'stone' }),
    // inset basin
    rbox(0.54, 0.022, 0.04, 0.012, 0, 0.842, 0.2, C.white, { mat: 'gloss' }),
    rbox(0.54, 0.022, 0.04, 0.012, 0, 0.842, -0.12, C.white, { mat: 'gloss' }),
    rbox(0.04, 0.022, 0.28, 0.012, -0.25, 0.842, 0.04, C.white, { mat: 'gloss' }),
    rbox(0.04, 0.022, 0.28, 0.012, 0.25, 0.842, 0.04, C.white, { mat: 'gloss' }),
    rbox(0.46, 0.012, 0.28, 0.1, 0, 0.838, 0.04, '#d7d1c5', { mat: 'ceramic' }),
    cyl(0.028, 0.028, 0.008, 0, 0.844, 0.07, C.steel, { mat: 'metal' }, 20),
    cyl(0.01, 0.01, 0.004, 0, 0.848, 0.07, C.blackMetal, { mat: 'metal' }, 10),
    // brass faucet
    cyl(0.036, 0.039, 0.012, 0, 0.84, -0.19, C.brass, { mat: 'metal' }, 20),
    cyl(0.017, 0.022, 0.16, 0, 0.925, -0.19, C.brass, { mat: 'metal' }, 20),
    sphere(0.018, 0, 1.005, -0.19, C.brass, { mat: 'metal' }, 16),
    cyl(0.014, 0.014, 0.13, 0, 1.002, -0.135, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.013, 0.013, 0.026, 0, 0.99, -0.073, C.brass, { mat: 'metal' }, 14),
    torus(0.017, 0.004, 0, 0.988, -0.073, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    // side levers
    cyl(0.013, 0.015, 0.03, -0.075, 0.85, -0.19, C.brass, { mat: 'metal' }, 12),
    rbox(0.05, 0.011, 0.014, 0.005, -0.098, 0.872, -0.19, C.brass, { mat: 'metal' }),
    cyl(0.013, 0.015, 0.03, 0.075, 0.85, -0.19, C.brass, { mat: 'metal' }, 12),
    rbox(0.05, 0.011, 0.014, 0.005, 0.098, 0.872, -0.19, C.brass, { mat: 'metal' }),
    // framed mirror
    rbox(0.82, 0.94, 0.035, 0.014, 0, 1.43, -0.257, C.oak, { mat: 'wood' }),
    box(0.76, 0.88, 0.008, 0, 1.43, -0.237, C.glass, { mat: 'glass', opacity: 0.55 }),
    rbox(0.78, 0.012, 0.006, 0.004, 0, 1.868, -0.2345, C.brass, { mat: 'metal' }),
    rbox(0.78, 0.012, 0.006, 0.004, 0, 0.992, -0.2345, C.brass, { mat: 'metal' }),
    rbox(0.012, 0.88, 0.006, 0.004, -0.384, 1.43, -0.2345, C.brass, { mat: 'metal' }),
    rbox(0.012, 0.88, 0.006, 0.004, 0.384, 1.43, -0.2345, C.brass, { mat: 'metal' }),
    // wall sconces
    cyl(0.038, 0.038, 0.014, -0.5, 1.78, -0.264, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.008, 0.008, 0.05, -0.5, 1.78, -0.24, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    sphere(0.052, -0.5, 1.78, -0.208, C.cream, { mat: 'emissive' }, 20),
    cyl(0.038, 0.038, 0.014, 0.5, 1.78, -0.264, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.008, 0.008, 0.05, 0.5, 1.78, -0.24, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    sphere(0.052, 0.5, 1.78, -0.208, C.cream, { mat: 'emissive' }, 20),
    // folded towels on counter
    rbox(0.22, 0.034, 0.3, 0.012, -0.38, 0.852, 0.04, C.linen, { mat: 'fabric' }),
    rbox(0.21, 0.032, 0.29, 0.012, -0.385, 0.885, 0.04, C.cream, { mat: 'fabric' }),
    rbox(0.2, 0.03, 0.28, 0.012, -0.39, 0.916, 0.04, C.sand, { mat: 'fabric' }),
    // towel ring and hand towel on right side
    cyl(0.03, 0.03, 0.012, 0.578, 0.72, 0.06, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    torus(0.058, 0.008, 0.578, 0.715, 0.06, C.brass, { mat: 'metal', rot: [0, Math.PI / 2, 0] }, 24),
    rbox(0.018, 0.3, 0.19, 0.006, 0.582, 0.56, 0.06, C.linen, { mat: 'fabric' }),
    rbox(0.024, 0.032, 0.19, 0.008, 0.582, 0.715, 0.06, C.linen, { mat: 'fabric' }),

    // silicone bead sealing the upstand to the wall
    cyl(0.005, 0.005, 1.18, 0, 0.922, -0.272, '#d8d2c4', { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 8),
    // chrome overflow slot on the basin back wall
    box(0.06, 0.007, 0.003, 0, 0.848, -0.0985, C.steel, { mat: 'metal' }),
    // aerator screen inside the spout tip
    cyl(0.0115, 0.0115, 0.004, 0, 0.9755, -0.073, '#6f7678', { mat: 'metal' }, 14),
    // wall switch plate beside the mirror
    rbox(0.09, 0.12, 0.012, 0.004, 0.52, 1.12, -0.268, C.white, { mat: 'gloss' }),
    rbox(0.016, 0.032, 0.01, 0.004, 0.52, 1.12, -0.2585, C.brass, { mat: 'gloss' }),
  ],
})
