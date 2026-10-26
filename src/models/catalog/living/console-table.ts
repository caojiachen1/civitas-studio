import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const OAK = '#b48a5a'
const OAK_LIGHT = '#c09a6c'
const OAK_DARK = '#96703f'
const WALNUT = '#6f4e36'
const BRASS = '#b78b4c'

export default defineModel({
  id: 'console-table',
  name: '玄关条案',
  category: 'living',
  tags: ['console table', 'entry table', '玄关条案', '条案', '边桌', 'entryway', 'hallway'],
  footprint: [1.45, 0.4],
  height: 0.82,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // four slim tapered legs with brass ferrules
    cyl(0.021, 0.012, 0.585, -0.66, 0.2925, -0.14, WALNUT, { mat: 'wood' }, 10),
    cyl(0.021, 0.012, 0.585, 0.66, 0.2925, -0.14, WALNUT, { mat: 'wood' }, 10),
    cyl(0.021, 0.012, 0.585, -0.66, 0.2925, 0.14, WALNUT, { mat: 'wood' }, 10),
    cyl(0.021, 0.012, 0.585, 0.66, 0.2925, 0.14, WALNUT, { mat: 'wood' }, 10),
    cyl(0.014, 0.014, 0.02, -0.66, 0.01, -0.14, BRASS, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.02, 0.66, 0.01, -0.14, BRASS, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.02, -0.66, 0.01, 0.14, BRASS, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.02, 0.66, 0.01, 0.14, BRASS, { mat: 'metal' }, 10),

    // shallow case with two drawers
    box(1.34, 0.15, 0.33, 0, 0.66, -0.01, OAK_DARK, { mat: 'wood' }),
    box(1.32, 0.018, 0.31, 0, 0.588, -0.01, OAK_DARK, { mat: 'wood' }),
    rbox(0.6, 0.12, 0.018, 0.006, -0.34, 0.66, 0.161, OAK_LIGHT, { mat: 'wood' }),
    rbox(0.6, 0.12, 0.018, 0.006, 0.34, 0.66, 0.161, OAK_LIGHT, { mat: 'wood' }),
    box(0.06, 0.15, 0.02, 0, 0.66, 0.163, OAK_DARK, { mat: 'wood' }),
    box(0.6, 0.004, 0.004, -0.34, 0.604, 0.171, '#84603c', { mat: 'wood' }),
    box(0.6, 0.004, 0.004, -0.34, 0.716, 0.171, '#84603c', { mat: 'wood' }),
    box(0.6, 0.004, 0.004, 0.34, 0.604, 0.171, '#84603c', { mat: 'wood' }),
    box(0.6, 0.004, 0.004, 0.34, 0.716, 0.171, '#84603c', { mat: 'wood' }),
    box(0.004, 0.12, 0.004, -0.64, 0.66, 0.171, '#84603c', { mat: 'wood' }),
    box(0.004, 0.12, 0.004, 0.64, 0.66, 0.171, '#84603c', { mat: 'wood' }),

    // brass bar pulls with standoffs and drawer locks
    rbox(0.22, 0.012, 0.012, 0.005, -0.34, 0.66, 0.19, BRASS, { mat: 'metal' }),
    cyl(0.007, 0.007, 0.022, -0.43, 0.66, 0.179, BRASS, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.007, 0.007, 0.022, -0.25, 0.66, 0.179, BRASS, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    rbox(0.22, 0.012, 0.012, 0.005, 0.34, 0.66, 0.19, BRASS, { mat: 'metal' }),
    cyl(0.007, 0.007, 0.022, 0.25, 0.66, 0.179, BRASS, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.007, 0.007, 0.022, 0.43, 0.66, 0.179, BRASS, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.009, 0.009, 0.006, -0.6, 0.66, 0.171, BRASS, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.009, 0.009, 0.006, 0.6, 0.66, 0.171, BRASS, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),

    // oak top with edge band
    rbox(1.45, 0.038, 0.4, 0.012, 0, 0.761, 0, OAK, { mat: 'wood' }),
    rbox(1.4, 0.012, 0.35, 0.005, 0, 0.736, 0, OAK_DARK, { mat: 'wood' }),
    box(1.34, 0.002, 0.005, 0, 0.7805, -0.1, '#a9814f', { mat: 'wood' }),
    box(1.34, 0.002, 0.005, 0, 0.7805, 0.06, '#a9814f', { mat: 'wood' }),

    // lower shelf with cleats and a back stretcher
    rbox(1.3, 0.022, 0.32, 0.008, 0, 0.2, 0, OAK_LIGHT, { mat: 'wood' }),
    box(0.05, 0.045, 0.05, -0.6, 0.166, -0.13, OAK_DARK, { mat: 'wood' }),
    box(0.05, 0.045, 0.05, 0.6, 0.166, -0.13, OAK_DARK, { mat: 'wood' }),
    box(0.05, 0.045, 0.05, -0.6, 0.166, 0.13, OAK_DARK, { mat: 'wood' }),
    box(0.05, 0.045, 0.05, 0.6, 0.166, 0.13, OAK_DARK, { mat: 'wood' }),
    box(1.28, 0.03, 0.022, 0, 0.13, -0.155, WALNUT, { mat: 'wood' }),
    box(0.022, 0.025, 0.26, -0.655, 0.12, 0, WALNUT, { mat: 'wood' }),
    box(0.022, 0.025, 0.26, 0.655, 0.12, 0, WALNUT, { mat: 'wood' }),
    box(1.3, 0.14, 0.014, 0, 0.66, -0.181, OAK_DARK, { mat: 'wood' }),

    // shelf styling: stacked books, a small vase and a woven basket
    rbox(0.28, 0.02, 0.2, 0.005, -0.38, 0.221, 0.0, C.navy, { mat: 'matte', rot: [0, 0.06, 0] }),
    rbox(0.27, 0.018, 0.19, 0.005, -0.38, 0.24, 0.0, C.terracotta, { mat: 'matte', rot: [0, -0.04, 0] }),
    rbox(0.26, 0.016, 0.18, 0.005, -0.38, 0.257, 0.0, C.cream, { mat: 'matte', rot: [0, 0.02, 0] }),
    cyl(0.05, 0.062, 0.15, 0.06, 0.286, -0.02, '#a99b88', { mat: 'ceramic' }, 20),
    cyl(0.038, 0.048, 0.02, 0.06, 0.371, -0.02, '#a99b88', { mat: 'ceramic' }, 20),
    cyl(0.13, 0.11, 0.11, 0.44, 0.266, 0.0, '#b39b76', { mat: 'matte' }, 24),
    torus(0.128, 0.007, 0.44, 0.32, 0.0, '#9c8562', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 24),

    // shallow ceramic bowl with stone spheres on the top
    cyl(0.13, 0.085, 0.04, -0.34, 0.8, 0.02, C.cream, { mat: 'ceramic' }, 28),
    torus(0.128, 0.005, -0.34, 0.814, 0.02, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 28),
    sphere(0.017, -0.38, 0.8, 0.02, C.stone, { mat: 'stone' }, 12),
    sphere(0.015, -0.33, 0.802, 0.05, '#8c8a80', { mat: 'stone' }, 12),
    sphere(0.014, -0.31, 0.801, -0.02, C.concrete, { mat: 'stone' }, 12),
  ],
})
