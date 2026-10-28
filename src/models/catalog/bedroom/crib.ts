import { C, box, cyl, defineModel, ico, rbox, sphere } from '../../kit'

export default defineModel({
  id: 'crib',
  name: '婴儿床',
  category: 'bedroom',
  tags: ['crib', 'cot', '婴儿床', '儿童房', 'slatted', 'nursery'],
  footprint: [1.35, 0.78],
  height: 1.0,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Corner posts with brass caps
    box(0.06, 0.98, 0.06, -0.645, 0.49, -0.36, C.walnut, { mat: 'wood' }),
    box(0.06, 0.98, 0.06, 0.645, 0.49, -0.36, C.walnut, { mat: 'wood' }),
    box(0.06, 0.98, 0.06, -0.645, 0.49, 0.36, C.walnut, { mat: 'wood' }),
    box(0.06, 0.98, 0.06, 0.645, 0.49, 0.36, C.walnut, { mat: 'wood' }),
    cyl(0.026, 0.026, 0.012, -0.645, 0.986, -0.36, C.brass, { mat: 'metal' }, 16),
    cyl(0.026, 0.026, 0.012, 0.645, 0.986, -0.36, C.brass, { mat: 'metal' }, 16),
    cyl(0.026, 0.026, 0.012, -0.645, 0.986, 0.36, C.brass, { mat: 'metal' }, 16),
    cyl(0.026, 0.026, 0.012, 0.645, 0.986, 0.36, C.brass, { mat: 'metal' }, 16),

    // Long rails
    box(1.29, 0.05, 0.035, 0, 0.86, -0.36, C.oak, { mat: 'wood' }),
    box(1.29, 0.05, 0.035, 0, 0.86, 0.36, C.oak, { mat: 'wood' }),
    box(1.29, 0.04, 0.03, 0, 0.33, -0.36, C.oak, { mat: 'wood' }),
    box(1.29, 0.04, 0.03, 0, 0.33, 0.36, C.oak, { mat: 'wood' }),

    // Long side slats
    box(0.022, 0.47, 0.022, -0.585, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.455, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.325, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.195, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.065, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.065, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.195, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.325, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.455, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.585, 0.6, -0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.585, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.455, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.325, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.195, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.065, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.065, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.195, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.325, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.455, 0.6, 0.36, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.585, 0.6, 0.36, C.oak, { mat: 'wood' }),

    // End rails and end slats
    box(0.035, 0.05, 0.69, -0.645, 0.86, 0, C.oak, { mat: 'wood' }),
    box(0.035, 0.05, 0.69, 0.645, 0.86, 0, C.oak, { mat: 'wood' }),
    box(0.03, 0.04, 0.69, -0.645, 0.33, 0, C.oak, { mat: 'wood' }),
    box(0.03, 0.04, 0.69, 0.645, 0.33, 0, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.645, 0.6, -0.225, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.645, 0.6, -0.075, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.645, 0.6, 0.075, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, -0.645, 0.6, 0.225, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.645, 0.6, -0.225, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.645, 0.6, -0.075, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.645, 0.6, 0.075, C.oak, { mat: 'wood' }),
    box(0.022, 0.47, 0.022, 0.645, 0.6, 0.225, C.oak, { mat: 'wood' }),

    // Mattress platform, mattress and fitted sheet
    box(1.2, 0.05, 0.62, 0, 0.43, 0, C.oak, { mat: 'wood' }),
    rbox(1.22, 0.14, 0.64, 0.035, 0, 0.525, 0, C.white, { mat: 'fabric' }),
    rbox(1.24, 0.03, 0.66, 0.012, 0, 0.605, 0, C.cream, { mat: 'fabric' }),

    // Soft sage blanket folded over the foot rail
    rbox(0.62, 0.05, 0.3, 0.02, 0, 0.625, 0.1, C.sage, { mat: 'fabric' }),
    rbox(0.62, 0.03, 0.07, 0.012, 0, 0.65, 0.22, '#9cab92', { mat: 'fabric' }),
    box(0.56, 0.03, 0.06, 0, 0.9, 0.36, '#96a78e', { mat: 'fabric' }),
    box(0.56, 0.22, 0.022, 0, 0.785, 0.379, '#96a78e', { mat: 'fabric' }),

    // Mobile arm at the back with hanging ornaments
    box(0.05, 0.03, 0.05, 0, 0.9, -0.36, C.brass, { mat: 'metal' }),
    cyl(0.012, 0.012, 0.1, 0, 0.95, -0.36, C.brass, { mat: 'metal' }, 10),
    cyl(0.01, 0.01, 0.3, 0, 0.99, -0.21, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.002, 0.002, 0.09, -0.03, 0.935, -0.28, C.linen, { mat: 'matte' }, 6),
    cyl(0.002, 0.002, 0.09, 0.03, 0.935, -0.2, C.linen, { mat: 'matte' }, 6),
    cyl(0.002, 0.002, 0.09, -0.02, 0.935, -0.12, C.linen, { mat: 'matte' }, 6),
    ico(0.024, -0.03, 0.865, -0.28, C.cream, { mat: 'fabric' }, 1),
    sphere(0.019, 0.03, 0.865, -0.2, '#7f947a', { mat: 'fabric' }, 14),
    ico(0.021, -0.02, 0.865, -0.12, C.clay, { mat: 'fabric' }, 1),

    // teething rail, post bolt caps and blanket fold seams
    rbox(1.24, 0.028, 0.06, 0.014, 0, 0.868, 0.36, '#c9a882', { mat: 'wood' }),
    sphere(0.008, -0.645, 0.9, 0.391, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 0.645, 0.9, 0.391, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, -0.645, 0.9, -0.391, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, 0.645, 0.9, -0.391, C.brass, { mat: 'metal' }, 8),
    box(0.56, 0.006, 0.012, 0, 0.653, 0.18, '#a9b8a1', { mat: 'fabric' }),
    box(0.56, 0.006, 0.012, 0, 0.653, 0.02, '#a9b8a1', { mat: 'fabric' }),
  ],
})
