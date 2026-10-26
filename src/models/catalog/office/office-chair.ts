import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const baseAngles = [0, 1, 2, 3, 4].map((k) => -Math.PI / 2 + (k * Math.PI * 2) / 5)

const baseParts = baseAngles.flatMap((a) => {
  const dx = Math.cos(a)
  const dz = -Math.sin(a)
  const tx = Math.sin(a)
  const tz = Math.cos(a)
  const x = dx * 0.29
  const z = dz * 0.29
  return [
    rbox(0.3, 0.035, 0.055, 0.012, dx * 0.15, 0.12, dz * 0.15, C.blackMetal, { mat: 'metal', rot: [0, a, 0] }),
    rbox(0.055, 0.06, 0.06, 0.014, x, 0.08, z, C.blackMetal, { mat: 'metal', rot: [0, a, 0] }),
    cyl(0.034, 0.034, 0.022, x + tx * 0.018, 0.034, z + tz * 0.018, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, -a] }, 16),
    cyl(0.034, 0.034, 0.022, x - tx * 0.018, 0.034, z - tz * 0.018, C.ink, { mat: 'matte', rot: [Math.PI / 2, 0, -a] }, 16),
  ]
})

export default defineModel({
  id: 'office-chair',
  name: '人体工学办公椅',
  category: 'office',
  tags: ['chair', 'office chair', 'ergonomic', '办公椅', '人体工学椅', '转椅'],
  footprint: [0.68, 0.7],
  height: 1.2,
  placement: 'indoor',
  parts: [
    // five-star base
    cyl(0.06, 0.07, 0.06, 0, 0.115, 0, C.blackMetal, { mat: 'metal' }, 24),
    cyl(0.045, 0.05, 0.02, 0, 0.155, 0, C.graphite, { mat: 'metal' }, 20),
    ...baseParts,
    // gas lift
    cyl(0.046, 0.053, 0.13, 0, 0.2, 0, C.blackMetal, { mat: 'metal' }, 24),
    cyl(0.03, 0.03, 0.13, 0, 0.325, 0, C.steel, { mat: 'metal' }, 20),
    // seat mechanism and tension lever
    rbox(0.26, 0.045, 0.22, 0.012, 0, 0.395, -0.02, C.ink, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.14, 0.18, 0.39, 0.06, C.blackMetal, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    sphere(0.018, 0.262, 0.39, 0.06, C.brass, { mat: 'metal' }, 12),
    // upholstered seat
    rbox(0.5, 0.09, 0.48, 0.09, 0, 0.455, 0.02, C.navy, { mat: 'fabric' }),
    rbox(0.48, 0.05, 0.1, 0.035, 0, 0.43, 0.255, C.navy, { mat: 'fabric' }),
    box(0.46, 0.004, 0.008, 0, 0.501, 0.2, '#3a4450'),
    // back spine
    rbox(0.09, 0.2, 0.025, 0.008, 0, 0.56, -0.235, C.blackMetal, { mat: 'metal' }),
    rbox(0.05, 0.06, 0.03, 0.006, 0, 0.49, -0.22, C.blackMetal, { mat: 'metal' }),
    // backrest frame and cushion
    rbox(0.46, 0.54, 0.055, 0.03, 0, 0.86, -0.255, C.ink, { mat: 'matte', rot: [-0.1, 0, 0] }),
    rbox(0.42, 0.48, 0.06, 0.025, 0, 0.86, -0.226, C.navy, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.34, 0.022, 0.012, 0.006, 0, 0.77, -0.183, '#3a4450', { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.34, 0.022, 0.012, 0.006, 0, 0.87, -0.193, '#3a4450', { mat: 'fabric', rot: [-0.1, 0, 0] }),
    rbox(0.34, 0.022, 0.012, 0.006, 0, 0.97, -0.203, '#3a4450', { mat: 'fabric', rot: [-0.1, 0, 0] }),
    // lumbar support
    rbox(0.36, 0.12, 0.04, 0.02, 0, 0.7, -0.185, C.navy, { mat: 'fabric', rot: [-0.1, 0, 0] }),
    // headrest
    rbox(0.06, 0.1, 0.03, 0.01, 0, 1.01, -0.285, C.blackMetal, { mat: 'metal', rot: [-0.12, 0, 0] }),
    rbox(0.3, 0.16, 0.04, 0.03, 0, 1.121, -0.297, C.ink, { mat: 'matte', rot: [-0.15, 0, 0] }),
    rbox(0.26, 0.13, 0.05, 0.02, 0, 1.121, -0.273, C.navy, { mat: 'fabric', rot: [-0.15, 0, 0] }),
    // armrests
    cyl(0.018, 0.022, 0.22, -0.27, 0.53, -0.03, C.blackMetal, { mat: 'metal' }, 16),
    rbox(0.05, 0.026, 0.18, 0.008, -0.27, 0.645, -0.02, C.blackMetal, { mat: 'metal' }),
    rbox(0.08, 0.03, 0.3, 0.012, -0.27, 0.672, 0.01, C.ink, { mat: 'leather' }),
    cyl(0.012, 0.012, 0.012, -0.27, 0.652, 0.13, C.brass, { mat: 'metal' }, 10),
    cyl(0.018, 0.022, 0.22, 0.27, 0.53, -0.03, C.blackMetal, { mat: 'metal' }, 16),
    rbox(0.05, 0.026, 0.18, 0.008, 0.27, 0.645, -0.02, C.blackMetal, { mat: 'metal' }),
    rbox(0.08, 0.03, 0.3, 0.012, 0.27, 0.672, 0.01, C.ink, { mat: 'leather' }),
    cyl(0.012, 0.012, 0.012, 0.27, 0.652, 0.13, C.brass, { mat: 'metal' }, 10),
  ],
})
