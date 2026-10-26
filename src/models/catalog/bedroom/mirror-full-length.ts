import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const TILT = -0.03
const FRAME = '#3a3f42'
const FRAME_LIGHT = '#565c5f'
const GLASS_TINT = '#c2d3d2'
const REFLECT = '#e6efec'

// z position of the reclined mirror plane at a given height
const zAt = (y: number, offset = 0) => -0.008 + (y - 0.94) * Math.tan(TILT) + offset

export default defineModel({
  id: 'mirror-full-length',
  name: '全身镜',
  category: 'bedroom',
  tags: ['mirror', 'full length mirror', '全身镜', '穿衣镜', '卧室', 'metal frame', '落地镜'],
  footprint: [0.6, 0.16],
  height: 1.85,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // slim metal backplate and mirror glass
    rbox(0.56, 1.82, 0.018, 0.006, 0, 0.94, zAt(0.94), FRAME, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.5, 1.74, 0.008, 0, 0.94, zAt(0.94, 0.004), GLASS_TINT, {
      mat: 'glass',
      opacity: 0.34,
      rot: [TILT, 0, 0],
    }),
    box(0.44, 1.62, 0.002, 0, 0.95, zAt(0.95, -0.002), '#aebfbe', {
      mat: 'glass',
      opacity: 0.2,
      rot: [TILT, 0, 0],
    }),

    // four metal frame bars
    box(0.03, 1.82, 0.03, -0.265, 0.94, zAt(0.94, 0.007), FRAME_LIGHT, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.03, 1.82, 0.03, 0.265, 0.94, zAt(0.94, 0.007), FRAME_LIGHT, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.56, 0.03, 0.03, 0, 1.835, zAt(1.835, 0.007), FRAME_LIGHT, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.56, 0.03, 0.03, 0, 0.045, zAt(0.045, 0.007), FRAME_LIGHT, { mat: 'metal', rot: [TILT, 0, 0] }),

    // inner brass bevel lines and corner screws
    box(0.008, 1.75, 0.004, -0.249, 0.94, zAt(0.94, 0.018), C.brass, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.008, 1.75, 0.004, 0.249, 0.94, zAt(0.94, 0.018), C.brass, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.5, 0.008, 0.004, 0, 1.815, zAt(1.815, 0.018), C.brass, { mat: 'metal', rot: [TILT, 0, 0] }),
    box(0.5, 0.008, 0.004, 0, 0.065, zAt(0.065, 0.018), C.brass, { mat: 'metal', rot: [TILT, 0, 0] }),
    cyl(0.008, 0.008, 0.007, -0.265, 1.79, zAt(1.79, 0.024), C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.007, 0.265, 1.79, zAt(1.79, 0.024), C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.007, -0.265, 0.09, zAt(0.09, 0.024), C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.008, 0.008, 0.007, 0.265, 0.09, zAt(0.09, 0.024), C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // glass reflection streak
    box(0.13, 1.15, 0.0015, -0.14, 0.92, zAt(0.92, 0.0125), REFLECT, {
      mat: 'glass',
      opacity: 0.22,
      rot: [TILT, 0, 0.11],
    }),

    // two flat foot bars with rubber anti-slip pads
    box(0.06, 0.025, 0.15, -0.2, 0.0125, 0, FRAME_LIGHT, { mat: 'metal' }),
    box(0.06, 0.025, 0.15, 0.2, 0.0125, 0, FRAME_LIGHT, { mat: 'metal' }),
    box(0.05, 0.008, 0.045, -0.2, 0.004, -0.048, '#24282a', { mat: 'matte' }),
    box(0.05, 0.008, 0.045, -0.2, 0.004, 0.048, '#24282a', { mat: 'matte' }),
    box(0.05, 0.008, 0.045, 0.2, 0.004, -0.048, '#24282a', { mat: 'matte' }),
    box(0.05, 0.008, 0.045, 0.2, 0.004, 0.048, '#24282a', { mat: 'matte' }),

    // reclined rear support struts with hinge plates and a cross brace
    cyl(0.011, 0.011, 1.12, -0.19, 0.57, -0.051, FRAME, { mat: 'metal', rot: [0.025, 0, 0] }, 12),
    cyl(0.011, 0.011, 1.12, 0.19, 0.57, -0.051, FRAME, { mat: 'metal', rot: [0.025, 0, 0] }, 12),
    rbox(0.03, 0.055, 0.028, 0.006, -0.19, 1.13, -0.031, FRAME_LIGHT, { mat: 'metal' }),
    rbox(0.03, 0.055, 0.028, 0.006, 0.19, 1.13, -0.031, FRAME_LIGHT, { mat: 'metal' }),
    box(0.36, 0.012, 0.012, 0, 0.55, -0.052, FRAME, { mat: 'metal' }),
    sphere(0.014, -0.19, 1.1, -0.024, C.brass, { mat: 'metal' }, 10),
    sphere(0.014, 0.19, 1.1, -0.024, C.brass, { mat: 'metal' }, 10),

    // floor glide feet under the struts
    cyl(0.016, 0.02, 0.014, -0.19, 0.007, -0.058, '#24282a', { mat: 'matte' }, 12),
    cyl(0.016, 0.02, 0.014, 0.19, 0.007, -0.058, '#24282a', { mat: 'matte' }, 12),

    // brass maker's badge on the bottom rail
    box(0.06, 0.014, 0.004, 0, 0.045, zAt(0.045, 0.024), C.brass, { mat: 'metal', rot: [TILT, 0, 0] }),
  ],
})
