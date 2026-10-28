import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

export default defineModel({
  id: 'pedestal-sink',
  name: '立柱盆',
  category: 'bathroom',
  tags: ['sink', 'basin', 'pedestal', '立柱盆', '洗手盆', '卫浴'],
  footprint: [0.53, 0.56],
  height: 0.9,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // pedestal foot
    cyl(0.198, 0.205, 0.028, 0, 0.014, 0, C.white, { mat: 'ceramic' }, 32),
    torus(0.188, 0.012, 0, 0.03, 0, C.white, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),
    // tapered column
    cyl(0.112, 0.158, 0.6, 0, 0.33, 0, C.white, { mat: 'ceramic' }, 32),
    torus(0.113, 0.009, 0, 0.6, 0, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 28),
    // collar under basin
    cyl(0.168, 0.122, 0.055, 0, 0.657, 0, C.white, { mat: 'ceramic' }, 32),
    // sculpted basin
    cyl(0.2, 0.158, 0.045, 0, 0.7075, 0, C.white, { mat: 'ceramic' }, 32),
    cyl(0.252, 0.198, 0.09, 0, 0.765, 0, C.white, { mat: 'ceramic' }, 32),
    torus(0.249, 0.014, 0, 0.82, 0, C.white, { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 32),
    // recessed bowl interior
    cyl(0.229, 0.229, 0.008, 0, 0.814, 0, '#d8d2c6', { mat: 'ceramic' }, 32),
    // drain
    torus(0.033, 0.0045, 0, 0.821, 0.02, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.027, 0.027, 0.005, 0, 0.819, 0.02, C.steel, { mat: 'metal' }, 20),
    cyl(0.011, 0.011, 0.003, 0, 0.823, 0.02, C.blackMetal, { mat: 'metal' }, 12),
    // slim ceramic backsplash
    rbox(0.4, 0.05, 0.018, 0.008, 0, 0.847, -0.268, C.white, { mat: 'gloss' }),
    // faucet
    cyl(0.034, 0.037, 0.012, 0, 0.84, -0.215, C.brass, { mat: 'metal' }, 20),
    cyl(0.016, 0.021, 0.036, 0, 0.864, -0.215, C.brass, { mat: 'metal' }, 20),
    sphere(0.017, 0, 0.883, -0.215, C.brass, { mat: 'metal' }, 16),
    cyl(0.013, 0.013, 0.115, 0, 0.879, -0.157, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.012, 0.012, 0.024, 0, 0.867, -0.105, C.brass, { mat: 'metal' }, 14),
    torus(0.016, 0.004, 0, 0.865, -0.105, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 14),
    // single lever handle
    rbox(0.046, 0.012, 0.014, 0.005, 0.046, 0.879, -0.215, C.brass, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.014, 0.028, 0.879, -0.215, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // supply lines and stops behind pedestal
    cyl(0.01, 0.01, 0.185, 0.14, 0.0975, -0.255, C.steel, { mat: 'metal' }, 10),
    cyl(0.01, 0.01, 0.185, -0.14, 0.0975, -0.255, C.steel, { mat: 'metal' }, 10),
    cyl(0.019, 0.019, 0.01, 0.14, 0.005, -0.255, C.steel, { mat: 'metal' }, 14),
    cyl(0.019, 0.019, 0.01, -0.14, 0.005, -0.255, C.steel, { mat: 'metal' }, 14),
    cyl(0.005, 0.005, 0.06, 0.14, 0.16, -0.255, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    cyl(0.005, 0.005, 0.06, -0.14, 0.16, -0.255, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 8),
    // chrome overflow cover recessed into the basin front
    cyl(0.024, 0.024, 0.006, 0, 0.782, 0.2345, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.026, 0.004, 0.003, 0, 0.782, 0.2385, C.blackMetal, { mat: 'metal' }),
    // aerator screen inside the spout tip
    cyl(0.0105, 0.0105, 0.003, 0, 0.8615, -0.105, '#6f7678', { mat: 'metal' }, 14),
    // pop-up drain rod behind the mixer
    cyl(0.0045, 0.0045, 0.03, -0.02, 0.888, -0.233, C.brass, { mat: 'metal' }, 8),
    sphere(0.008, -0.02, 0.907, -0.233, C.brass, { mat: 'metal' }, 10),
    // caulk bead around the pedestal foot and the backsplash top edge
    torus(0.204, 0.0045, 0, 0.004, 0, '#d3cdc1', { mat: 'matte', rot: [Math.PI / 2, 0, 0] }, 32),
    box(0.404, 0.005, 0.014, 0, 0.8745, -0.269, '#d3cdc1', { mat: 'matte' }),
  ],
})
