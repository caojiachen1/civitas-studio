import { C, cyl, defineModel, rbox, sphere, torus } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

const glassWater = { mat: 'glass' as const, opacity: 0.9 }

const rimAngles = [0, 45, 90, 135, 180, 225, 270, 315]
const wetAngles = [0, 90, 180, 270]

export default defineModel({
  id: 'fountain',
  name: '城市喷泉',
  category: 'street',
  tags: ['fountain', 'water', 'plaza', '喷泉', '广场'],
  footprint: [3.2, 3.2],
  height: 1.6,
  placement: 'outdoor',
  parts: [
    // octagonal stone basin
    cyl(1.58, 1.6, 0.14, 0, 0.07, 0, C.concrete, { mat: 'stone', rot: [0, Math.PI / 8, 0] }, 8),
    cyl(1.48, 1.54, 0.36, 0, 0.32, 0, C.stone, { mat: 'stone', rot: [0, Math.PI / 8, 0] }, 8),
    cyl(1.33, 1.33, 0.03, 0, 0.515, 0, C.water, { ...glassWater, rot: [0, Math.PI / 8, 0] }, 8),

    // raised coping segments and wet rim
    ...rimAngles.map((deg) => {
      const a = (deg * Math.PI) / 180
      return rounded(
        1.14,
        0.09,
        0.16,
        0.012,
        Math.sin(a) * 1.4,
        0.545,
        Math.cos(a) * 1.4,
        C.cream,
        { mat: 'stone', rot: [0, a, 0] },
      )
    }),
    ...wetAngles.map((deg) => {
      const a = (deg * Math.PI) / 180
      return rounded(
        1.05,
        0.008,
        0.11,
        0.004,
        Math.sin(a) * 1.4,
        0.594,
        Math.cos(a) * 1.4,
        C.water,
        { mat: 'glass', opacity: 0.55, rot: [0, a, 0] },
      )
    }),

    // inner tier
    cyl(0.62, 0.7, 0.12, 0, 0.56, 0, C.stone, { mat: 'stone' }, 24),
    cyl(0.74, 0.6, 0.18, 0, 0.71, 0, C.cream, { mat: 'stone' }, 24),
    cyl(0.7, 0.7, 0.02, 0, 0.805, 0, C.water, glassWater, 24),
    torus(0.735, 0.035, 0, 0.81, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 32),

    // central pedestal and upper bowl
    cyl(0.23, 0.3, 0.42, 0, 1.01, 0, C.stone, { mat: 'stone' }, 20),
    torus(0.25, 0.03, 0, 1.21, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.42, 0.26, 0.14, 0, 1.29, 0, C.cream, { mat: 'stone' }, 24),
    torus(0.425, 0.025, 0, 1.36, 0, C.cream, { mat: 'stone', rot: [Math.PI / 2, 0, 0] }, 24),
    cyl(0.39, 0.39, 0.02, 0, 1.348, 0, C.water, glassWater, 24),

    // central jet
    cyl(0.014, 0.02, 0.24, 0, 1.46, 0, C.water, { mat: 'glass', opacity: 0.8 }, 10),
    sphere(0.02, 0, 1.58, 0, C.water, { mat: 'glass', opacity: 0.8 }, 12),

    // four thin jets rising from the lower tier
    cyl(0.009, 0.014, 0.32, 0.297, 0.96, 0.297, C.water, { mat: 'glass', opacity: 0.8 }, 8),
    cyl(0.009, 0.014, 0.32, -0.297, 0.96, 0.297, C.water, { mat: 'glass', opacity: 0.8 }, 8),
    cyl(0.009, 0.014, 0.32, 0.297, 0.96, -0.297, C.water, { mat: 'glass', opacity: 0.8 }, 8),
    cyl(0.009, 0.014, 0.32, -0.297, 0.96, -0.297, C.water, { mat: 'glass', opacity: 0.8 }, 8),

    // water cascading from the upper bowl
    cyl(0.011, 0.014, 0.55, 0, 1.09, 0.525, C.water, { mat: 'glass', opacity: 0.75, rot: [-0.48, 0, 0] }, 8),
    cyl(0.011, 0.014, 0.55, 0, 1.09, -0.525, C.water, { mat: 'glass', opacity: 0.75, rot: [0.48, 0, 0] }, 8),
    cyl(0.011, 0.014, 0.55, 0.525, 1.09, 0, C.water, { mat: 'glass', opacity: 0.75, rot: [0, 0, 0.48] }, 8),
    cyl(0.011, 0.014, 0.55, -0.525, 1.09, 0, C.water, { mat: 'glass', opacity: 0.75, rot: [0, 0, -0.48] }, 8),
  ],
})
