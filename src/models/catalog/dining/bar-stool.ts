import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const LEGS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]
const STUDS = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2 + Math.PI / 16)

export default defineModel({
  id: 'bar-stool',
  name: '吧凳',
  category: 'dining',
  tags: ['dining', 'bar stool', 'counter stool', '吧凳', '吧椅', '高脚凳'],
  footprint: [0.45, 0.45],
  height: 1.02,
  placement: 'indoor',
  parts: [
    // upholstered round seat
    cyl(0.212, 0.216, 0.075, 0, 0.825, 0, C.sand, { mat: 'fabric' }, 28),
    torus(0.212, 0.008, 0, 0.856, 0, C.linen, { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 28),
    cyl(0.214, 0.214, 0.012, 0, 0.782, 0, C.walnut, { mat: 'wood' }, 28),

    // four splayed tapered legs with brass feet
    ...LEGS.flatMap((a) => [
      cyl(
        0.017,
        0.025,
        0.79,
        Math.cos(a) * 0.165,
        0.395,
        Math.sin(a) * 0.165,
        C.blackMetal,
        { mat: 'metal', rot: [-Math.sin(a) * 0.063, 0, Math.cos(a) * 0.063] },
        12,
      ),
      cyl(
        0.021,
        0.019,
        0.022,
        Math.cos(a) * 0.187,
        0.011,
        Math.sin(a) * 0.187,
        C.brass,
        { mat: 'metal' },
        12,
      ),
      cyl(
        0.019,
        0.019,
        0.016,
        Math.cos(a) * 0.172,
        0.283,
        Math.sin(a) * 0.172,
        C.brass,
        { mat: 'metal' },
        10,
      ),
    ]),

    // brass footrest rings
    torus(0.172, 0.009, 0, 0.29, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.176, 0.007, 0, 0.225, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.155, 0.007, 0, 0.775, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),

    // low curved backrest
    rbox(0.24, 0.16, 0.05, 0.02, 0, 0.94, -0.158, C.blush, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.1, 0.15, 0.046, 0.018, -0.145, 0.933, -0.142, C.blush, {
      mat: 'fabric',
      rot: [-0.1, 0.55, 0],
    }),
    rbox(0.1, 0.15, 0.046, 0.018, 0.145, 0.933, -0.142, C.blush, {
      mat: 'fabric',
      rot: [-0.1, -0.55, 0],
    }),
    rbox(0.25, 0.012, 0.052, 0.018, 0, 0.878, -0.152, C.blush, { mat: 'fabric', rot: [-0.1, 0, 0] }),

    // brass backrest uprights
    cyl(0.011, 0.013, 0.2, -0.12, 0.9, -0.16, C.brass, { mat: 'metal', rot: [-0.12, 0, 0] }, 12),
    cyl(0.011, 0.013, 0.2, 0.12, 0.9, -0.16, C.brass, { mat: 'metal', rot: [-0.12, 0, 0] }, 12),
    cyl(0.02, 0.02, 0.012, -0.12, 0.795, -0.157, C.brass, { mat: 'metal' }, 12),
    cyl(0.02, 0.02, 0.012, 0.12, 0.795, -0.157, C.brass, { mat: 'metal' }, 12),

    // brass nailhead row around the seat rail
    ...STUDS.map((a) =>
      sphere(0.0075, Math.cos(a) * 0.2115, 0.795, Math.sin(a) * 0.2115, C.brass, { mat: 'metal' }, 8),
    ),
    // under-seat dust cover, leg mounting plates and a maker's plate on the rail
    cyl(0.186, 0.19, 0.006, 0, 0.7745, 0, C.walnut, { mat: 'wood' }, 28),
    ...LEGS.map((a) =>
      cyl(
        0.026,
        0.026,
        0.005,
        Math.cos(a) * 0.165,
        0.7695,
        Math.sin(a) * 0.165,
        C.brass,
        { mat: 'metal' },
        12,
      ),
    ),
    box(0.08, 0.012, 0.004, 0, 0.782, 0.2165, C.brass, { mat: 'metal' }),
    // footrest wear plates at the front of both rings
    box(0.14, 0.005, 0.024, 0, 0.2995, 0.172, C.brass, { mat: 'metal' }),
    box(0.11, 0.004, 0.02, 0, 0.2345, 0.176, C.brass, { mat: 'metal' }),
  ],
})
