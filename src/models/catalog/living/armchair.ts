import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const LEATHER = '#8a654c'
const LEATHER_LIGHT = '#97745a'
const LEATHER_DARK = '#73523d'
const SEAM = '#5f4433'

export default defineModel({
  id: 'armchair',
  name: '单人扶手椅',
  category: 'living',
  tags: ['armchair', 'lounge', '扶手椅', '单人椅', 'leather', 'wingback'],
  footprint: [0.95, 0.92],
  height: 0.94,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // splayed oak legs with brass ferrules
    cyl(0.024, 0.015, 0.22, -0.33, 0.113, 0.35, C.oak, { mat: 'wood', rot: [-0.1, 0, -0.1] }, 10),
    cyl(0.024, 0.015, 0.22, 0.33, 0.113, 0.35, C.oak, { mat: 'wood', rot: [-0.1, 0, 0.1] }, 10),
    cyl(0.024, 0.015, 0.22, -0.33, 0.113, -0.33, C.oak, { mat: 'wood', rot: [0.1, 0, -0.1] }, 10),
    cyl(0.024, 0.015, 0.22, 0.33, 0.113, -0.33, C.oak, { mat: 'wood', rot: [0.1, 0, 0.1] }, 10),
    cyl(0.017, 0.017, 0.012, -0.341, 0.006, 0.361, C.brass, { mat: 'metal' }, 10),
    cyl(0.017, 0.017, 0.012, 0.341, 0.006, 0.361, C.brass, { mat: 'metal' }, 10),
    cyl(0.017, 0.017, 0.012, -0.341, 0.006, -0.341, C.brass, { mat: 'metal' }, 10),
    cyl(0.017, 0.017, 0.012, 0.341, 0.006, -0.341, C.brass, { mat: 'metal' }, 10),

    // upholstered shell
    rbox(0.84, 0.22, 0.84, 0.05, 0, 0.31, 0, LEATHER, { mat: 'leather' }),
    rbox(0.84, 0.52, 0.16, 0.06, 0, 0.67, -0.37, LEATHER, { mat: 'leather' }),
    box(0.84, 0.02, 0.17, 0, 0.93, -0.37, LEATHER_DARK, { mat: 'leather' }),
    rbox(0.10, 0.36, 0.26, 0.04, -0.385, 0.70, -0.21, LEATHER, { mat: 'leather', rot: [0, 0.16, 0] }),
    rbox(0.10, 0.36, 0.26, 0.04, 0.385, 0.70, -0.21, LEATHER, { mat: 'leather', rot: [0, -0.16, 0] }),

    // seat cushion with piping
    rbox(0.70, 0.16, 0.70, 0.055, 0, 0.48, 0.045, LEATHER_LIGHT, { mat: 'leather' }),
    box(0.70, 0.012, 0.012, 0, 0.545, 0.397, SEAM, { mat: 'leather' }),

    // arms with rounded tops and oak caps
    rbox(0.10, 0.20, 0.60, 0.04, -0.37, 0.50, 0, LEATHER, { mat: 'leather' }),
    rbox(0.10, 0.20, 0.60, 0.04, 0.37, 0.50, 0, LEATHER, { mat: 'leather' }),
    cyl(0.045, 0.045, 0.60, -0.37, 0.60, 0, '#8A654C', { mat: 'leather', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.045, 0.045, 0.60, 0.37, 0.60, 0, '#8A654C', { mat: 'leather', rot: [Math.PI / 2, 0, 0] }, 16),
    rbox(0.115, 0.028, 0.58, 0.014, -0.37, 0.66, 0, '#B48A5A', { mat: 'wood' }),
    rbox(0.115, 0.028, 0.58, 0.014, 0.37, 0.66, 0, '#B48A5A', { mat: 'wood' }),

    // back cushion with button tufting
    rbox(0.70, 0.40, 0.14, 0.06, 0, 0.67, -0.22, LEATHER_LIGHT, { mat: 'leather', rot: [-0.12, 0, 0] }),
    sphere(0.016, -0.18, 0.60, -0.138, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.016, 0.18, 0.60, -0.138, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.016, -0.18, 0.74, -0.150, LEATHER_DARK, { mat: 'leather' }, 10),
    sphere(0.016, 0.18, 0.74, -0.150, LEATHER_DARK, { mat: 'leather' }, 10),

    // sage accent pillow
    rbox(0.32, 0.28, 0.13, 0.06, 0.21, 0.63, -0.04, C.sage, { mat: 'fabric', rot: [-0.15, 0, 0.07] }),
    sphere(0.011, 0.21, 0.63, 0.03, C.brass, { mat: 'metal' }, 10),

    // piped cushion sides, back channel seams and arm-roll end welts
    box(0.012, 0.012, 0.70, -0.352, 0.545, 0.045, SEAM, { mat: 'leather' }),
    box(0.012, 0.012, 0.70, 0.352, 0.545, 0.045, SEAM, { mat: 'leather' }),
    box(0.006, 0.34, 0.006, -0.27, 0.67, -0.148, SEAM, { mat: 'leather', rot: [-0.12, 0, 0] }),
    box(0.006, 0.34, 0.006, 0.27, 0.67, -0.148, SEAM, { mat: 'leather', rot: [-0.12, 0, 0] }),
    torus(0.045, 0.006, -0.37, 0.60, 0.302, SEAM, { mat: 'leather' }, 16),
    torus(0.045, 0.006, 0.37, 0.60, 0.302, SEAM, { mat: 'leather' }, 16),
  ],
})
