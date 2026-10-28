import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const LINEN = '#ded4c5'

const legs = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].flatMap((a) => [
  cyl(0.024, 0.014, 0.53, 0.0925 * Math.cos(a), 0.2525, 0.0925 * Math.sin(a), C.oak, {
    mat: 'wood',
    rot: [0, -a, 0.358],
  }, 10),
  cyl(0.02, 0.022, 0.014, 0.185 * Math.cos(a), 0.007, 0.185 * Math.sin(a), C.brass, { mat: 'metal' }, 12),
])

export default defineModel({
  id: 'floor-lamp',
  name: '落地灯',
  category: 'living',
  tags: ['floor lamp', 'lamp', '落地灯', 'lighting', 'tripod', 'fabric shade'],
  footprint: [0.45, 0.45],
  height: 1.75,
  placement: 'indoor',
  parts: [
    // tripod legs with brass feet and hub
    ...legs,
    cyl(0.038, 0.052, 0.09, 0, 0.495, 0, C.brass, { mat: 'metal' }, 18),
    cyl(0.012, 0.016, 1.0, 0, 1.03, 0, C.brass, { mat: 'metal' }, 14),
    cyl(0.024, 0.028, 0.03, 0, 0.56, 0, C.brass, { mat: 'metal' }, 16),
    rbox(0.022, 0.035, 0.018, 0.006, 0, 1.18, 0.012, '#b78b4d', { mat: 'metal' }),

    // tapered linen shade
    cyl(0.125, 0.175, 0.265, 0, 1.5925, 0, LINEN, { mat: 'fabric', side: 'double' }, 28),
    torus(0.127, 0.007, 0, 1.725, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.177, 0.006, 0, 1.46, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 28),

    // warm bulb beneath the shade
    cyl(0.022, 0.028, 0.03, 0, 1.462, 0, C.brass, { mat: 'metal' }, 14),
    sphere(0.04, 0, 1.445, 0, '#ffe7bb', { mat: 'emissive' }, 16),
    torus(0.021, 0.0025, 0, 1.445, 0.018, '#fff4d6', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 12),
    sphere(0.012, 0, 1.738, 0, C.brass, { mat: 'metal' }, 10),

    // linen diffuser, stitched seam and dimmer
    cyl(0.11, 0.155, 0.235, 0, 1.5925, 0, '#f4ecdf', { mat: 'fabric', opacity: 0.32, side: 'double' }, 24),
    box(0.004, 0.255, 0.004, 0.14, 1.5925, 0.0, '#c9bda9', { mat: 'fabric' }),
    cyl(0.016, 0.016, 0.022, 0, 1.14, 0.026, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.023, 0.026, 0.012, 0, 0.545, 0, C.ink, { mat: 'matte' }, 14),

    // weighted base plate and braided cord
    cyl(0.055, 0.062, 0.012, 0, 0.01, 0, C.brass, { mat: 'metal' }, 18),
    cyl(0.0055, 0.0055, 0.22, 0, 0.011, 0.11, '#4a4038', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 6),

    // inner shade ring, socket collar, cord clip and a felt floor pad
    torus(0.169, 0.005, 0, 1.463, 0, '#c9bda9', { mat: 'fabric', rot: [Math.PI / 2, 0, 0] }, 28),
    torus(0.03, 0.004, 0, 1.455, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    cyl(0.008, 0.008, 0.014, 0, 0.011, 0.06, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.066, 0.066, 0.005, 0, 0.0025, 0, '#2f2b27', { mat: 'matte' }, 20),
  ],
})
