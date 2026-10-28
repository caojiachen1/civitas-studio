import { C, box, cone, cyl, defineModel, sphere, torus } from '../../kit'

export default defineModel({
  id: 'column-round',
  name: '古典圆柱',
  category: 'structure',
  tags: ['column', 'pillar', '圆柱', '承重柱'],
  footprint: [0.58, 0.58],
  height: 3.15,
  placement: 'indoor',
  parts: [
    box(0.54, 0.13, 0.54, 0, 0.065, 0, C.stone),
    box(0.48, 0.06, 0.48, 0, 0.155, 0, C.white),
    cyl(0.17, 0.21, 0.12, 0, 0.245, 0, C.white, {}, 24),
    torus(0.18, 0.024, 0, 0.32, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.152, 0.168, 2.42, 0, 1.55, 0, C.white, { mat: 'matte' }, 24),
    torus(0.172, 0.022, 0, 2.8, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.22, 0.18, 0.1, 0, 2.88, 0, C.white, {}, 24),
    box(0.5, 0.1, 0.5, 0, 2.97, 0, C.white),
    box(0.58, 0.08, 0.58, 0, 3.06, 0, C.stone),
    cyl(0.021, 0.021, 2.3, 0.155, 1.55, 0, C.birch, { mat: 'stone', opacity: 0.65 }, 8),
    cyl(0.021, 0.021, 2.3, -0.155, 1.55, 0, C.birch, { mat: 'stone', opacity: 0.65 }, 8),

    // shallow flutes around the shaft
    ...Array.from({ length: 20 }, (_, i) => {
      const a = (i * Math.PI * 2) / 20
      return box(0.014, 2.28, 0.01, Math.cos(a) * 0.163, 1.55, Math.sin(a) * 0.163, '#e2ded3', {
        mat: 'stone',
        rot: [0, a + Math.PI / 2, 0],
      })
    }),
    // astragal rings, capital volutes and base bolts
    torus(0.17, 0.018, 0, 0.36, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.168, 0.016, 0, 2.77, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 28),
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI * 2) / 8 + 0.2
      return sphere(0.026, Math.cos(a) * 0.19, 2.92, Math.sin(a) * 0.19, C.birch, { mat: 'stone' }, 10)
    }),
    // acanthus leaves curl around the capital neck
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI * 2) / 8 + 0.18
      return cone(
        0.045,
        0.17,
        Math.cos(a) * 0.2,
        2.865,
        Math.sin(a) * 0.2,
        i % 2 === 0 ? C.white : C.cream,
        { mat: 'stone', rot: [0.5 * Math.sin(a), 0, -0.5 * Math.cos(a)] },
        5,
      )
    }),
    // subtle drum joints on the long shaft
    torus(0.166, 0.007, 0, 1.15, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    torus(0.161, 0.006, 0, 2.02, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    box(0.5, 0.022, 0.5, 0, 0.124, 0, C.stone, { mat: 'stone' }),
    box(0.56, 0.018, 0.56, 0, 3.105, 0, C.white, { mat: 'stone' }),
    ...[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => sphere(0.012, sx * 0.2, 0.135, sz * 0.2, C.brass, { mat: 'metal' }, 8)),
    ),
  ],
})
