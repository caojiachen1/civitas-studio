import { C, box, cyl, defineModel, rbox } from '../../kit'

const paint = '#5a6f72'
const tire = '#24272b'
const dark = '#2f3437'
const chrome = C.steel
const seatLeather = C.leather

// axle along X, tread touches y = 0
const wheel = (z: number) => [
  cyl(0.3, 0.3, 0.12, 0, 0.3, z, tire, { mat: 'matte', rot: [0, 0, Math.PI / 2] }, 24),
  cyl(0.18, 0.18, 0.128, 0, 0.3, z, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 20),
  cyl(0.05, 0.05, 0.14, 0, 0.3, z, dark, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
]

export default defineModel({
  id: 'motorcycle',
  name: '摩托车',
  category: 'vehicles',
  tags: ['motorcycle', 'motorbike', 'scooter', '摩托车', '机车', '两轮', '通勤'],
  footprint: [0.8, 2.15],
  height: 1.2,
  placement: 'on-road',
  parts: [
    // wheels, front brake disc and rear sprocket
    ...wheel(0.77),
    ...wheel(-0.77),
    cyl(0.12, 0.12, 0.008, 0.065, 0.3, 0.77, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.09, 0.09, 0.008, 0.07, 0.3, -0.77, C.graphite, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),

    // raked fork tubes and triple clamps
    cyl(0.018, 0.018, 0.69, -0.055, 0.635, 0.685, chrome, { mat: 'metal', rot: [-0.248, 0, 0] }, 12),
    cyl(0.018, 0.018, 0.69, 0.055, 0.635, 0.685, chrome, { mat: 'metal', rot: [-0.248, 0, 0] }, 12),
    rbox(0.16, 0.04, 0.1, 0.012, 0, 0.94, 0.605, dark, { mat: 'metal', rot: [-0.248, 0, 0] }),
    rbox(0.15, 0.035, 0.09, 0.012, 0, 0.99, 0.593, dark, { mat: 'metal', rot: [-0.248, 0, 0] }),

    // front mudguard and its stay
    rbox(0.1, 0.025, 0.28, 0.008, 0, 0.635, 0.79, paint, { mat: 'gloss', rot: [-0.5, 0, 0] }),
    box(0.028, 0.07, 0.028, 0.055, 0.615, 0.72, dark),

    // round headlamp with a warm lens
    cyl(0.085, 0.085, 0.07, 0, 0.93, 0.73, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    cyl(0.07, 0.07, 0.012, 0, 0.93, 0.772, '#ffe9c2', { mat: 'emissive', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.05, 0.1, 0.04, 0, 0.88, 0.66, dark),

    // handlebar, grips, levers and bar mounts
    cyl(0.014, 0.014, 0.64, 0, 1.04, 0.55, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.02, 0.02, 0.12, -0.27, 1.04, 0.55, dark, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    cyl(0.02, 0.02, 0.12, 0.27, 1.04, 0.55, dark, { mat: 'leather', rot: [0, 0, Math.PI / 2] }, 12),
    box(0.11, 0.012, 0.02, -0.17, 1.045, 0.615, chrome, { mat: 'metal', rot: [0, 0.22, 0] }),
    box(0.11, 0.012, 0.02, 0.17, 1.045, 0.615, chrome, { mat: 'metal', rot: [0, -0.22, 0] }),
    cyl(0.014, 0.014, 0.05, -0.09, 1.015, 0.56, dark, { mat: 'metal' }, 10),
    cyl(0.014, 0.014, 0.05, 0.09, 1.015, 0.56, dark, { mat: 'metal' }, 10),

    // instrument pod and mirror stalks with heads
    rbox(0.12, 0.05, 0.08, 0.015, 0, 1.055, 0.63, dark),
    cyl(0.008, 0.008, 0.13, -0.18, 1.105, 0.53, chrome, { mat: 'metal', rot: [0, 0, 0.3] }, 8),
    cyl(0.008, 0.008, 0.13, 0.18, 1.105, 0.53, chrome, { mat: 'metal', rot: [0, 0, -0.3] }, 8),
    rbox(0.11, 0.06, 0.03, 0.02, -0.2, 1.168, 0.53, dark),
    rbox(0.11, 0.06, 0.03, 0.02, 0.2, 1.168, 0.53, dark),

    // teardrop fuel tank with filler cap
    rbox(0.3, 0.22, 0.5, 0.09, 0, 0.95, -0.03, paint, { mat: 'gloss' }),
    cyl(0.04, 0.04, 0.015, 0.04, 1.066, -0.1, chrome, { mat: 'metal' }, 12),

    // stepped saddle, tail cowl and rear mudguard
    rbox(0.26, 0.09, 0.48, 0.045, 0, 0.84, -0.5, seatLeather, { mat: 'leather' }),
    rbox(0.2, 0.07, 0.2, 0.03, 0, 0.86, -0.78, paint, { mat: 'gloss' }),
    rbox(0.14, 0.03, 0.35, 0.012, 0, 0.625, -0.82, paint, { mat: 'gloss', rot: [0.15, 0, 0] }),

    // tail lamp and plate
    box(0.09, 0.05, 0.04, 0, 0.57, -0.965, C.red, { mat: 'emissive' }),
    box(0.14, 0.09, 0.012, 0, 0.43, -0.99, C.white),

    // engine block, cylinder head and cooling fins
    rbox(0.26, 0.3, 0.34, 0.05, 0, 0.55, 0, dark, { mat: 'metal' }),
    rbox(0.3, 0.14, 0.24, 0.04, 0, 0.63, 0.1, C.graphite, { mat: 'metal' }),
    box(0.32, 0.012, 0.2, 0, 0.585, 0.11, C.graphite, { mat: 'metal' }),
    box(0.32, 0.012, 0.2, 0, 0.635, 0.11, C.graphite, { mat: 'metal' }),

    // frame downtube and backbone
    cyl(0.018, 0.018, 0.59, 0, 0.69, 0.35, paint, { mat: 'metal', rot: [0.615, 0, 0] }, 10),
    cyl(0.02, 0.02, 0.9, 0, 0.885, 0.1, paint, { mat: 'metal', rot: [1.649, 0, 0] }, 10),

    // swingarm, rear shock and foot pegs
    box(0.04, 0.06, 0.58, -0.09, 0.36, -0.485, dark, { mat: 'metal', rot: [0.207, 0, 0] }),
    box(0.04, 0.06, 0.58, 0.09, 0.36, -0.485, dark, { mat: 'metal', rot: [0.207, 0, 0] }),
    cyl(0.022, 0.022, 0.33, 0.11, 0.58, -0.57, chrome, { mat: 'metal', rot: [0.1, 0, -0.05] }, 10),
    cyl(0.012, 0.012, 0.14, -0.14, 0.42, -0.08, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.012, 0.012, 0.14, 0.14, 0.42, -0.08, chrome, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),

    // exhaust header, muffler and tip
    cyl(0.03, 0.03, 0.6, 0.12, 0.44, -0.1, chrome, { mat: 'metal', rot: [1.55, 0, 0] }, 12),
    cyl(0.055, 0.06, 0.5, 0.17, 0.46, -0.58, chrome, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.045, 0.05, 0.03, 0.17, 0.46, -0.835, dark, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),

    // drive chain runs
    box(0.012, 0.018, 0.68, 0.075, 0.4, -0.4, dark, { mat: 'metal' }),
    box(0.012, 0.018, 0.68, 0.075, 0.33, -0.4, dark, { mat: 'metal' }),

    // side stand
    cyl(0.012, 0.012, 0.42, -0.18, 0.2, -0.33, dark, { mat: 'metal', rot: [0.12, 0, 0.3] }, 10),
  ],
})
