import { C, box, cyl, defineModel, rbox } from '../../kit'

const DOOR = '#5f4331'
const FLUTE = '#7d5a3f'

const doors = [-0.4375, 0.4375]
const slats = doors.flatMap((dx) =>
  Array.from({ length: 15 }, (_, i) =>
    rbox(0.03, 0.26, 0.012, 0.005, dx - 0.385 + i * 0.055, 0.285, 0.192, FLUTE, { mat: 'wood' }),
  ),
)

export default defineModel({
  id: 'tv-console',
  name: '电视柜',
  category: 'living',
  tags: ['tv console', 'sideboard', '电视柜', 'fluted', 'walnut', 'storage'],
  footprint: [1.8, 0.42],
  height: 0.52,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // tapered legs with brass ferrules
    cyl(0.026, 0.016, 0.11, -0.78, 0.055, -0.12, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.11, 0.78, 0.055, -0.12, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.11, -0.78, 0.055, 0.12, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.016, 0.11, 0.78, 0.055, 0.12, C.walnut, { mat: 'wood' }, 10),
    cyl(0.018, 0.018, 0.012, -0.78, 0.006, -0.12, '#b78b4d', { mat: 'metal' }, 10),
    cyl(0.018, 0.018, 0.012, 0.78, 0.006, -0.12, '#b78b4d', { mat: 'metal' }, 10),
    cyl(0.018, 0.018, 0.012, -0.78, 0.006, 0.12, '#b78b4d', { mat: 'metal' }, 10),
    cyl(0.018, 0.018, 0.012, 0.78, 0.006, 0.12, '#b78b4d', { mat: 'metal' }, 10),

    // carcass, top slab, back panel and face frame
    rbox(1.80, 0.33, 0.34, 0.008, 0, 0.275, 0, '#6F4E36', { mat: 'wood' }),
    rbox(1.80, 0.03, 0.42, 0.012, 0, 0.455, 0, '#6F4E36', { mat: 'wood' }),
    box(1.76, 0.31, 0.012, 0, 0.275, -0.168, '#3f2d20', { mat: 'matte' }),
    rbox(0.035, 0.33, 0.02, 0.004, -0.8825, 0.275, 0.181, DOOR, { mat: 'wood' }),
    rbox(0.035, 0.33, 0.02, 0.004, 0.8825, 0.275, 0.181, DOOR, { mat: 'wood' }),
    box(0.012, 0.32, 0.02, 0, 0.275, 0.172, '#3f2d20', { mat: 'matte' }),

    // two fluted doors
    rbox(0.855, 0.29, 0.022, 0.004, -0.4375, 0.285, 0.176, DOOR, { mat: 'wood' }),
    rbox(0.855, 0.29, 0.022, 0.004, 0.4375, 0.285, 0.176, DOOR, { mat: 'wood' }),
    ...slats,

    // slim brass pulls
    rbox(0.012, 0.11, 0.008, 0.004, -0.085, 0.29, 0.203, C.brass, { mat: 'metal' }),
    rbox(0.012, 0.11, 0.008, 0.004, 0.085, 0.29, 0.203, C.brass, { mat: 'metal' }),
    rbox(0.006, 0.012, 0.01, 0.003, -0.085, 0.25, 0.194, C.brass, { mat: 'metal' }),
    rbox(0.006, 0.012, 0.01, 0.003, -0.085, 0.33, 0.194, C.brass, { mat: 'metal' }),
    rbox(0.006, 0.012, 0.01, 0.003, 0.085, 0.25, 0.194, C.brass, { mat: 'metal' }),
    rbox(0.006, 0.012, 0.01, 0.003, 0.085, 0.33, 0.194, C.brass, { mat: 'metal' }),

    // cable box and remote on top
    rbox(0.34, 0.05, 0.17, 0.008, -0.42, 0.495, 0.03, C.ink, { mat: 'gloss' }),
    box(0.022, 0.007, 0.004, -0.29, 0.487, 0.116, '#d9a45a', { mat: 'emissive' }),
    rbox(0.05, 0.014, 0.15, 0.006, 0.36, 0.477, 0.02, C.ink, { mat: 'matte' }),
    rbox(0.03, 0.004, 0.09, 0.002, 0.36, 0.485, 0.02, '#4a4f53', { mat: 'matte' }),

    // door top reveals, hinge knuckles and a top edge chamfer line
    box(0.855, 0.004, 0.006, -0.4375, 0.432, 0.1905, '#3f2d20', { mat: 'matte' }),
    box(0.855, 0.004, 0.006, 0.4375, 0.432, 0.1905, '#3f2d20', { mat: 'matte' }),
    ...[0.17, 0.285, 0.40].flatMap((y) => [
      cyl(0.008, 0.008, 0.05, -0.868, y, 0.189, C.brass, { mat: 'metal' }, 10),
      cyl(0.008, 0.008, 0.05, 0.868, y, 0.189, C.brass, { mat: 'metal' }, 10),
    ]),
    box(1.72, 0.003, 0.006, 0, 0.4705, 0.19, '#8a623f', { mat: 'wood' }),
  ],
})
