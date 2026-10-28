import { C, box, cyl, defineModel, ico, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const iron = '#3f4744'
const ironLight = '#4b5450'
const CLOCK_Y = 3.08
const CLOCK_R = 0.175
const TICK_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

export default defineModel({
  id: 'street-clock',
  name: '街头时钟',
  category: 'street',
  tags: ['street-clock', 'clock', 'time', '街头时钟', '时钟', '广场'],
  footprint: [0.5, 0.5],
  height: 3.6,
  placement: 'outdoor',
  parts: [
    // stone base slab with four anchor bolts
    rounded(0.44, 0.06, 0.44, 0.02, 0, 0.03, 0, C.stone, { mat: 'stone' }),
    ...[0.17, -0.17].flatMap((x) =>
      [0.17, -0.17].map((z) => cyl(0.012, 0.012, 0.016, x, 0.066, z, C.steel, { mat: 'metal' }, 8)),
    ),

    // cast plinth with a moulded cap
    rounded(0.3, 0.16, 0.3, 0.03, 0, 0.14, 0, iron, { mat: 'metal' }),
    rounded(0.34, 0.04, 0.34, 0.015, 0, 0.24, 0, ironLight, { mat: 'metal' }),

    // tapered cast-iron column with fluting and two collars
    cyl(0.045, 0.062, 2.56, 0, 1.54, 0, iron, { mat: 'metal' }, 24),
    torus(0.065, 0.009, 0, 0.32, 0, ironLight, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    torus(0.047, 0.008, 0, 2.7, 0, ironLight, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.012, 2.0, 0.012, 0, 1.5, 0.053, ironLight, { mat: 'metal' }),
    box(0.012, 2.0, 0.012, 0, 1.5, -0.053, ironLight, { mat: 'metal' }),
    box(0.012, 2.0, 0.012, 0.053, 1.5, 0, ironLight, { mat: 'metal' }),
    box(0.012, 2.0, 0.012, -0.053, 1.5, 0, ironLight, { mat: 'metal' }),

    // two-sided clock drum with brass rims
    cyl(0.23, 0.23, 0.16, 0, CLOCK_Y, 0, iron, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 32),
    torus(0.228, 0.012, 0, CLOCK_Y, 0, C.brass, { mat: 'metal' }, 32),
    torus(0.212, 0.011, 0, CLOCK_Y, 0.085, C.brass, { mat: 'metal' }, 32),
    torus(0.212, 0.011, 0, CLOCK_Y, -0.085, C.brass, { mat: 'metal' }, 32),
    cyl(0.205, 0.205, 0.018, 0, CLOCK_Y, 0.088, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),
    cyl(0.205, 0.205, 0.018, 0, CLOCK_Y, -0.088, C.cream, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 32),

    // twelve hour markers on each face
    ...[-1, 1].flatMap((face) =>
      TICK_ANGLES.map((deg, i) => {
        const a = (deg * Math.PI) / 180
        const len = i % 3 === 0 ? 0.036 : 0.024
        return box(
          0.014,
          len,
          0.004,
          CLOCK_R * Math.sin(a),
          CLOCK_Y + CLOCK_R * Math.cos(a),
          face * 0.099,
          C.ink,
          { mat: 'matte', rot: [0, 0, -a] },
        )
      }),
    ),

    // hour and minute hands on both faces, fixed at ten past two
    rounded(0.012, 0.15, 0.004, 0.004, 0.0606, CLOCK_Y + 0.035, 0.107, C.ink, { mat: 'matte', rot: [0, 0, -Math.PI / 3] }),
    rounded(0.012, 0.15, 0.004, 0.004, 0.0606, CLOCK_Y + 0.035, -0.107, C.ink, { mat: 'matte', rot: [0, 0, -Math.PI / 3] }),
    rounded(0.014, 0.09, 0.004, 0.004, -0.0346, CLOCK_Y + 0.02, 0.103, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 3] }),
    rounded(0.014, 0.09, 0.004, 0.004, -0.0346, CLOCK_Y + 0.02, -0.103, C.ink, { mat: 'matte', rot: [0, 0, Math.PI / 3] }),
    cyl(0.014, 0.014, 0.012, 0, CLOCK_Y, 0.108, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),
    cyl(0.014, 0.014, 0.012, 0, CLOCK_Y, -0.108, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 12),

    // side bosses at the drum pivots
    cyl(0.045, 0.05, 0.012, 0.236, CLOCK_Y, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 20),
    cyl(0.045, 0.05, 0.012, -0.236, CLOCK_Y, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 20),

    // cast collar under the drum
    cyl(0.06, 0.085, 0.09, 0, 2.81, 0, iron, { mat: 'metal' }, 20),

    // decorative urn and finial
    rounded(0.11, 0.035, 0.11, 0.012, 0, 3.3275, 0, iron, { mat: 'metal' }),
    ico(0.06, 0, 3.4, 0, C.brass, { mat: 'metal' }, 1),
    cyl(0.016, 0.022, 0.06, 0, 3.49, 0, C.brass, { mat: 'metal' }, 12),
    cyl(0, 0.032, 0.07, 0, 3.555, 0, C.brass, { mat: 'metal' }, 16),
    sphere(0.012, 0, 3.588, 0, C.brass, { mat: 'metal' }, 12),

    // printed minute track just inside the hour markers
    torus(0.191, 0.0025, 0, CLOCK_Y, 0.0995, C.ink, { mat: 'matte' }, 40),
    torus(0.191, 0.0025, 0, CLOCK_Y, -0.0995, C.ink, { mat: 'matte' }, 40),

    // plinth access door with hinges and keyhole
    rounded(0.14, 0.1, 0.008, 0.004, 0, 0.15, 0.152, ironLight, { mat: 'metal' }),
    box(0.012, 0.02, 0.006, -0.06, 0.17, 0.156, iron, { mat: 'metal' }),
    box(0.012, 0.02, 0.006, -0.06, 0.13, 0.156, iron, { mat: 'metal' }),
    box(0.008, 0.016, 0.004, 0.055, 0.15, 0.1565, C.ink),

    // gilt band on the collar under the drum
    torus(0.062, 0.005, 0, 2.85, 0, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 24),
  ],
})
