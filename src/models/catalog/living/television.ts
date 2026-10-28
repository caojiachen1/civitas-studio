import { C, box, cyl, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'television',
  name: '电视',
  category: 'living',
  tags: ['tv', 'television', '电视', 'screen', 'media', 'soundbar'],
  footprint: [1.45, 0.36],
  height: 1.35,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // weighted plinth and inlay
    rbox(1.26, 0.08, 0.34, 0.012, 0, 0.04, -0.01, C.graphite, { mat: 'metal' }),
    rbox(1.18, 0.008, 0.30, 0.006, 0, 0.084, -0.01, C.blackMetal, { mat: 'metal' }),
    rbox(0.30, 0.02, 0.14, 0.008, 0, 0.098, -0.11, C.graphite, { mat: 'metal' }),

    // spine column
    rbox(0.12, 0.44, 0.06, 0.01, 0, 0.31, -0.13, C.blackMetal, { mat: 'metal' }),

    // panel, bezel and screen
    rbox(1.42, 0.84, 0.05, 0.01, 0, 0.93, -0.12, C.ink, { mat: 'gloss' }),
    rbox(1.38, 0.80, 0.012, 0.004, 0, 0.93, -0.091, '#161a1e', { mat: 'gloss' }),
    rbox(1.36, 0.775, 0.01, 0.004, 0, 0.933, -0.079, '#0c1013', { mat: 'gloss' }),
    rbox(0.35, 0.62, 0.002, 0.04, -0.28, 0.95, -0.072, '#dceaf0', { mat: 'glass', opacity: 0.08, rot: [0, 0, 0.3] }),
    rbox(0.18, 0.5, 0.002, 0.03, 0.25, 0.9, -0.072, '#dceaf0', { mat: 'glass', opacity: 0.07, rot: [0, 0, -0.35] }),
    box(0.018, 0.007, 0.004, 0.60, 0.535, -0.083, '#e0b070', { mat: 'emissive' }),

    // soundbar
    rbox(1.06, 0.085, 0.11, 0.02, 0, 0.1325, 0.06, C.blackMetal, { mat: 'matte' }),
    rbox(1.0, 0.052, 0.004, 0.002, 0, 0.1325, 0.116, '#22262a', { mat: 'fabric' }),
    rbox(0.018, 0.068, 0.10, 0.004, -0.525, 0.1325, 0.06, C.brass, { mat: 'metal' }),
    rbox(0.018, 0.068, 0.10, 0.004, 0.525, 0.1325, 0.06, C.brass, { mat: 'metal' }),
    box(0.012, 0.006, 0.002, 0, 0.108, 0.119, '#d9a45a', { mat: 'emissive' }),

    // remote and cable drops
    rbox(0.045, 0.014, 0.15, 0.006, 0.50, 0.095, 0.03, '#30343A', { mat: 'matte' }),
    rbox(0.03, 0.004, 0.10, 0.002, 0.50, 0.104, 0.03, '#4a4f53', { mat: 'matte' }),
    cyl(0.005, 0.005, 0.44, 0.06, 0.30, -0.17, C.ink, { mat: 'matte' }, 8),
    cyl(0.005, 0.005, 0.42, 0.09, 0.29, -0.168, C.ink, { mat: 'matte' }, 8),

    // brand badge, IR receiver, bezel speaker slots and cable clips
    box(0.05, 0.008, 0.004, 0, 0.527, -0.093, '#b9bec2', { mat: 'metal' }),
    cyl(0.0045, 0.0045, 0.004, 0.07, 0.527, -0.093, '#20252a', { mat: 'gloss' }, 8),
    box(0.10, 0.004, 0.004, -0.30, 0.527, -0.093, '#2a2f34', { mat: 'matte' }),
    box(0.10, 0.004, 0.004, 0.30, 0.527, -0.093, '#2a2f34', { mat: 'matte' }),
    rbox(0.018, 0.024, 0.016, 0.004, 0.06, 0.42, -0.17, '#22262a', { mat: 'matte' }),
    rbox(0.018, 0.024, 0.016, 0.004, 0.09, 0.38, -0.168, '#22262a', { mat: 'matte' }),
  ],
})
