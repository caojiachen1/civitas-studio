import { C, box, cone, cyl, defineModel, ico, rbox, sphere } from '../../kit'

// Rounded boxes are non-indexed; double-siding them keeps them in their own
// material bucket so the kit never merges indexed and non-indexed geometry.
const rounded: typeof rbox = (w, h, d, radius, x, y, z, color, opts) =>
  rbox(w, h, d, radius, x, y, z, color, { ...opts, side: 'double' })

// Wood/soil/foliage palette, kept desaturated for the street set.
const slatWood = C.oak
const railWood = C.walnut
const edgeMetal = C.graphite
const lining = '#3f4644'
const bloomGold = '#d9b95c'

export default defineModel({
  id: 'street-planter',
  name: '街道花箱',
  category: 'street',
  tags: ['planter', 'flower-box', 'street', '花箱', '花坛', '种植箱', '街道绿化'],
  footprint: [1.25, 0.55],
  height: 0.95,
  placement: 'outdoor',
  parts: [
    // four cast feet
    box(0.08, 0.03, 0.08, 0.53, 0.015, 0.2, C.concrete, { mat: 'stone' }),
    box(0.08, 0.03, 0.08, -0.53, 0.015, 0.2, C.concrete, { mat: 'stone' }),
    box(0.08, 0.03, 0.08, 0.53, 0.015, -0.2, C.concrete, { mat: 'stone' }),
    box(0.08, 0.03, 0.08, -0.53, 0.015, -0.2, C.concrete, { mat: 'stone' }),

    // timber base panel and dark inner liner
    box(1.16, 0.05, 0.46, 0, 0.055, 0, railWood, { mat: 'wood' }),
    box(1.1, 0.45, 0.4, 0, 0.31, 0, lining, { mat: 'matte' }),

    // three separate front slats with shadow gaps
    box(1.2, 0.135, 0.035, 0, 0.13, 0.2325, slatWood, { mat: 'wood' }),
    box(1.2, 0.135, 0.035, 0, 0.285, 0.2325, slatWood, { mat: 'wood' }),
    box(1.2, 0.135, 0.035, 0, 0.44, 0.2325, slatWood, { mat: 'wood' }),
    box(1.2, 0.135, 0.035, 0, 0.13, -0.2325, slatWood, { mat: 'wood' }),
    box(1.2, 0.135, 0.035, 0, 0.285, -0.2325, slatWood, { mat: 'wood' }),
    box(1.2, 0.135, 0.035, 0, 0.44, -0.2325, slatWood, { mat: 'wood' }),

    // short end slats
    box(0.035, 0.135, 0.43, 0.5825, 0.13, 0, slatWood, { mat: 'wood' }),
    box(0.035, 0.135, 0.43, 0.5825, 0.285, 0, slatWood, { mat: 'wood' }),
    box(0.035, 0.135, 0.43, 0.5825, 0.44, 0, slatWood, { mat: 'wood' }),
    box(0.035, 0.135, 0.43, -0.5825, 0.13, 0, slatWood, { mat: 'wood' }),
    box(0.035, 0.135, 0.43, -0.5825, 0.285, 0, slatWood, { mat: 'wood' }),
    box(0.035, 0.135, 0.43, -0.5825, 0.44, 0, slatWood, { mat: 'wood' }),

    // dark metal corner angles
    box(0.045, 0.5, 0.045, 0.585, 0.3, 0.2325, edgeMetal, { mat: 'metal' }),
    box(0.045, 0.5, 0.045, -0.585, 0.3, 0.2325, edgeMetal, { mat: 'metal' }),
    box(0.045, 0.5, 0.045, 0.585, 0.3, -0.2325, edgeMetal, { mat: 'metal' }),
    box(0.045, 0.5, 0.045, -0.585, 0.3, -0.2325, edgeMetal, { mat: 'metal' }),

    // pressed metal rim around the top
    box(1.24, 0.025, 0.035, 0, 0.5575, 0.2425, edgeMetal, { mat: 'metal' }),
    box(1.24, 0.025, 0.035, 0, 0.5575, -0.2425, edgeMetal, { mat: 'metal' }),
    box(0.04, 0.025, 0.52, 0.6, 0.5575, 0, edgeMetal, { mat: 'metal' }),
    box(0.04, 0.025, 0.52, -0.6, 0.5575, 0, edgeMetal, { mat: 'metal' }),

    // lower banding rails
    box(1.22, 0.03, 0.03, 0, 0.04, 0.235, edgeMetal, { mat: 'metal' }),
    box(1.22, 0.03, 0.03, 0, 0.04, -0.235, edgeMetal, { mat: 'metal' }),

    // soil bed and a low mound
    box(1.08, 0.03, 0.38, 0, 0.545, 0, C.soil, { mat: 'matte' }),
    ico(0.14, 0, 0.56, 0, C.soil, { mat: 'matte' }, 1),

    // shrub clusters
    ico(0.11, -0.38, 0.68, 0.02, C.leaf, { mat: 'foliage' }, 1),
    ico(0.1, -0.12, 0.66, -0.05, C.leafDeep, { mat: 'foliage' }, 1),
    ico(0.11, 0.15, 0.69, 0.05, C.leafLight, { mat: 'foliage' }, 1),
    ico(0.1, 0.4, 0.66, -0.02, C.leaf, { mat: 'foliage' }, 1),
    ico(0.09, 0, 0.7, -0.08, C.leafDeep, { mat: 'foliage' }, 1),

    // small blooms
    sphere(0.03, -0.38, 0.81, 0.02, C.blush, { mat: 'matte' }, 10),
    sphere(0.028, -0.12, 0.79, -0.05, C.cream, { mat: 'matte' }, 10),
    sphere(0.032, 0.15, 0.82, 0.05, C.red, { mat: 'matte' }, 10),
    sphere(0.027, 0.4, 0.78, -0.02, bloomGold, { mat: 'matte' }, 10),

    // tall ornamental grass blades reaching the stated height
    cone(0.012, 0.39, -0.5, 0.755, -0.14, C.leafLight, { mat: 'foliage' }, 6),
    cone(0.012, 0.39, 0.47, 0.755, 0.12, C.leafLight, { mat: 'foliage' }, 6),
    cone(0.012, 0.39, 0.25, 0.755, -0.14, C.leaf, { mat: 'foliage' }, 6),

    // drainage holes at the front skirt
    cyl(0.014, 0.014, 0.012, 0.28, 0.045, 0.249, C.ink, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.014, 0.014, 0.012, -0.28, 0.045, 0.249, C.ink, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // small brass maker plaque
    rounded(0.09, 0.04, 0.004, 0.002, 0, 0.36, 0.2515, C.brass, { mat: 'metal' }),
  ],
})
