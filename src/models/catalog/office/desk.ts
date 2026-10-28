import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

export default defineModel({
  id: 'desk',
  name: '办公桌',
  category: 'office',
  tags: ['desk', 'workstation', '办公桌', '书桌', 'writing desk'],
  footprint: [1.4, 0.7],
  height: 1.04,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // oak desktop with shadow band
    rbox(1.4, 0.04, 0.7, 0.015, 0, 0.74, 0, C.oak, { mat: 'wood' }),
    rbox(1.36, 0.012, 0.66, 0.006, 0, 0.714, 0, C.walnut, { mat: 'wood' }),
    // left panel leg
    rbox(0.045, 0.7, 0.62, 0.01, -0.665, 0.37, -0.01, C.oak, { mat: 'wood' }),
    rbox(0.05, 0.02, 0.64, 0.006, -0.665, 0.01, -0.01, C.blackMetal, { mat: 'metal' }),
    // right drawer pedestal
    rbox(0.38, 0.04, 0.52, 0.008, 0.45, 0.02, -0.02, C.ink, { mat: 'matte' }),
    rbox(0.42, 0.7, 0.6, 0.012, 0.45, 0.37, -0.02, C.oak, { mat: 'wood' }),
    rbox(0.38, 0.2, 0.02, 0.006, 0.45, 0.61, 0.288, C.white, { mat: 'gloss' }),
    rbox(0.38, 0.2, 0.02, 0.006, 0.45, 0.39, 0.288, C.white, { mat: 'gloss' }),
    rbox(0.38, 0.2, 0.02, 0.006, 0.45, 0.17, 0.288, C.white, { mat: 'gloss' }),
    // brass drawer pulls
    rbox(0.2, 0.012, 0.012, 0.005, 0.45, 0.67, 0.307, C.brass, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.018, 0.38, 0.67, 0.298, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.018, 0.52, 0.67, 0.298, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    rbox(0.2, 0.012, 0.012, 0.005, 0.45, 0.45, 0.307, C.brass, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.018, 0.38, 0.45, 0.298, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.018, 0.52, 0.45, 0.298, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    rbox(0.2, 0.012, 0.012, 0.005, 0.45, 0.23, 0.307, C.brass, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.018, 0.38, 0.23, 0.298, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.018, 0.52, 0.23, 0.298, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // modesty panel and stretcher
    rbox(0.82, 0.22, 0.025, 0.008, -0.04, 0.55, -0.322, C.oak, { mat: 'wood' }),
    rbox(0.92, 0.03, 0.03, 0.006, -0.19, 0.12, -0.25, C.blackMetal, { mat: 'metal' }),
    // cable tray, strip and cable loop
    rbox(0.8, 0.06, 0.14, 0.01, 0.02, 0.67, -0.19, C.graphite, { mat: 'metal' }),
    rbox(0.03, 0.05, 0.12, 0.006, -0.32, 0.705, -0.19, C.graphite, { mat: 'metal' }),
    rbox(0.03, 0.05, 0.12, 0.006, 0.36, 0.705, -0.19, C.graphite, { mat: 'metal' }),
    rbox(0.3, 0.032, 0.06, 0.006, -0.12, 0.662, -0.19, C.cream, { mat: 'matte' }),
    box(0.03, 0.016, 0.008, -0.2, 0.662, -0.157, C.ink),
    box(0.03, 0.016, 0.008, -0.12, 0.662, -0.157, C.ink),
    box(0.03, 0.016, 0.008, -0.04, 0.662, -0.157, C.ink),
    cyl(0.006, 0.006, 0.16, 0.2, 0.57, -0.17, C.ink, { mat: 'gloss' }, 8),
    torus(0.06, 0.006, 0.2, 0.49, -0.17, C.ink, { mat: 'gloss', rot: [0, Math.PI / 2, 0] }, 20),
    // task lamp
    cyl(0.072, 0.082, 0.018, -0.5, 0.769, -0.18, C.blackMetal, { mat: 'metal' }, 24),
    cyl(0.012, 0.015, 0.24, -0.5, 0.898, -0.18, C.blackMetal, { mat: 'metal' }, 14),
    sphere(0.021, -0.5, 1.018, -0.18, C.brass, { mat: 'metal' }, 16),
    cyl(0.011, 0.011, 0.17, -0.5, 1.018, -0.095, C.blackMetal, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    sphere(0.019, -0.5, 1.018, -0.008, C.brass, { mat: 'metal' }, 16),
    cyl(0.055, 0.088, 0.115, -0.5, 0.972, 0.02, C.cream, { mat: 'matte' }, 24),
    cyl(0.085, 0.085, 0.006, -0.5, 0.912, 0.02, C.cream, { mat: 'emissive' }, 24),
    cyl(0.02, 0.02, 0.012, -0.5, 1.034, 0.02, C.brass, { mat: 'metal' }, 12),
    // leather desk mat
    rbox(0.6, 0.005, 0.34, 0.01, 0.02, 0.7625, 0.03, C.leather, { mat: 'leather' }),
    // notebook
    rbox(0.22, 0.006, 0.3, 0.004, 0, 0.766, 0.08, C.navy, { mat: 'fabric' }),
    rbox(0.21, 0.014, 0.29, 0.003, 0, 0.776, 0.08, C.cream, { mat: 'matte' }),
    rbox(0.22, 0.006, 0.3, 0.004, 0, 0.786, 0.08, C.navy, { mat: 'fabric' }),
    box(0.008, 0.002, 0.29, 0.07, 0.79, 0.08, C.red),
    cyl(0.004, 0.004, 0.15, 0.075, 0.789, 0.23, C.ink, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 8),
    // loose sheets
    rbox(0.21, 0.004, 0.3, 0.003, -0.4, 0.762, 0.06, C.white, { mat: 'matte' }),
    rbox(0.21, 0.004, 0.29, 0.003, -0.405, 0.7655, 0.05, C.cream, { mat: 'matte', rot: [0, 0.08, 0] }),
    // mug
    cyl(0.04, 0.038, 0.085, 0.3, 0.8025, 0.16, C.cream, { mat: 'ceramic' }, 20),
    cyl(0.034, 0.034, 0.004, 0.3, 0.84, 0.16, '#4a3426', { mat: 'gloss' }, 20),
    torus(0.027, 0.007, 0.337, 0.804, 0.16, C.cream, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 18),

    // brass keyhole lock on the top drawer and a maker's plate behind the kneehole
    cyl(0.012, 0.012, 0.005, 0.45, 0.7, 0.2995, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    box(0.004, 0.012, 0.004, 0.45, 0.696, 0.3035, C.ink),
    rbox(0.1, 0.018, 0.004, 0.002, -0.04, 0.55, -0.3075, C.brass, { mat: 'metal' }),
    // brass pen cup with pencils on the desk mat
    cyl(0.036, 0.032, 0.09, -0.24, 0.81, 0.03, C.brass, { mat: 'metal' }, 20),
    cyl(0.03, 0.03, 0.004, -0.24, 0.768, 0.03, C.ink, { mat: 'matte' }, 16),
    cyl(0.005, 0.005, 0.15, -0.25, 0.9, 0.025, C.ink, { mat: 'gloss' }, 8),
    cyl(0.005, 0.005, 0.14, -0.23, 0.895, 0.04, C.brass, { mat: 'metal' }, 8),
    cyl(0.005, 0.005, 0.145, -0.245, 0.898, 0.018, C.red, { mat: 'gloss' }, 8),
  ],
})
