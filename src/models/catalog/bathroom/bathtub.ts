import { C, cyl, defineModel, rbox, sphere, torus } from '../../kit'

export default defineModel({
  id: 'bathtub',
  name: '独立浴缸',
  category: 'bathroom',
  tags: ['bathtub', 'tub', '浴缸', '泡澡', '卫浴'],
  footprint: [1.7, 0.8],
  height: 0.6,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // shadow-gap plinth
    rbox(1.34, 0.035, 0.5, 0.16, 0, 0.0175, 0, C.ink, { mat: 'matte' }),
    // oval shell
    rbox(1.56, 0.3, 0.68, 0.3, 0, 0.18, 0, C.white, { mat: 'gloss' }),
    rbox(1.64, 0.17, 0.74, 0.32, 0, 0.415, 0, C.white, { mat: 'gloss' }),
    rbox(1.68, 0.025, 0.78, 0.3, 0, 0.5125, 0, C.white, { mat: 'gloss' }),
    // inset rim
    rbox(1.62, 0.03, 0.05, 0.012, 0, 0.54, 0.365, C.white, { mat: 'gloss' }),
    rbox(1.62, 0.03, 0.05, 0.012, 0, 0.54, -0.365, C.white, { mat: 'gloss' }),
    rbox(0.05, 0.03, 0.68, 0.012, -0.815, 0.54, 0, C.white, { mat: 'gloss' }),
    rbox(0.05, 0.03, 0.68, 0.012, 0.815, 0.54, 0, C.white, { mat: 'gloss' }),
    // water
    rbox(1.54, 0.008, 0.64, 0.26, 0, 0.535, 0, C.water, { mat: 'gloss', opacity: 0.9 }),
    rbox(1.54, 0.014, 0.018, 0.008, 0, 0.545, 0.332, C.white, { mat: 'gloss' }),
    rbox(1.54, 0.014, 0.018, 0.008, 0, 0.545, -0.332, C.white, { mat: 'gloss' }),
    rbox(0.018, 0.014, 0.63, 0.008, -0.76, 0.545, 0, C.white, { mat: 'gloss' }),
    rbox(0.018, 0.014, 0.63, 0.008, 0.76, 0.545, 0, C.white, { mat: 'gloss' }),
    // subtle ripples
    torus(0.16, 0.0035, 0.3, 0.541, 0.02, C.glass, { mat: 'gloss', opacity: 0.7, rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.26, 0.0025, -0.42, 0.541, -0.04, C.glass, { mat: 'gloss', opacity: 0.55, rot: [Math.PI / 2, 0, 0] }, 32),
    // chrome drain
    torus(0.05, 0.005, 0.54, 0.541, 0, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.045, 0.045, 0.004, 0.54, 0.541, 0, C.steel, { mat: 'metal' }, 24),
    rbox(0.03, 0.002, 0.006, 0.001, 0.525, 0.544, 0, C.blackMetal, { mat: 'metal' }),
    rbox(0.03, 0.002, 0.006, 0.001, 0.555, 0.544, 0, C.blackMetal, { mat: 'metal' }),
    // wall-mounted filler
    cyl(0.04, 0.044, 0.014, 0, 0.552, -0.393, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.016, 0.016, 0.16, 0, 0.582, -0.306, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    sphere(0.017, 0, 0.582, -0.22, C.brass, { mat: 'metal' }, 14),
    cyl(0.014, 0.014, 0.03, 0, 0.566, -0.226, C.brass, { mat: 'metal' }, 14),
    torus(0.017, 0.004, 0, 0.551, -0.226, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.006, 0.006, 0.02, 0.048, 0.584, -0.385, C.brass, { mat: 'metal' }, 10),
    rbox(0.065, 0.012, 0.018, 0.006, 0.052, 0.594, -0.383, C.brass, { mat: 'metal' }),
    // oak bath tray
    rbox(0.28, 0.012, 0.025, 0.004, -0.32, 0.561, 0.35, C.birch, { mat: 'wood' }),
    rbox(0.28, 0.012, 0.025, 0.004, -0.32, 0.561, -0.35, C.birch, { mat: 'wood' }),
    rbox(0.28, 0.018, 0.72, 0.008, -0.32, 0.576, 0, C.oak, { mat: 'wood' }),
    rbox(0.28, 0.004, 0.004, 0.001, -0.32, 0.586, 0, C.walnut, { mat: 'wood' }),
    // soap dish, soap and folded washcloth
    rbox(0.13, 0.008, 0.09, 0.03, -0.35, 0.589, 0.07, C.stone, { mat: 'stone' }),
    rbox(0.085, 0.012, 0.05, 0.012, -0.35, 0.594, 0.07, C.cream, { mat: 'matte' }),
    rbox(0.1, 0.014, 0.14, 0.01, -0.32, 0.588, -0.14, C.sage, { mat: 'fabric' }),
    rbox(0.085, 0.008, 0.12, 0.008, -0.32, 0.595, -0.14, C.sage, { mat: 'fabric' }),
  ],
})
