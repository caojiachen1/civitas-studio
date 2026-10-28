import { C, box, cyl, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'fridge',
  name: '冰箱',
  category: 'kitchen',
  tags: ['kitchen', 'fridge', 'refrigerator', 'appliance', '冰箱', '冷藏'],
  footprint: [0.85, 0.75],
  height: 1.9,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // plinth, feet and body
    box(0.8, 0.04, 0.62, 0, 0.02, -0.04, C.blackMetal, { mat: 'matte' }),
    cyl(0.024, 0.028, 0.045, -0.34, 0.022, 0.25, C.graphite, { mat: 'metal' }, 12),
    cyl(0.024, 0.028, 0.045, 0.34, 0.022, 0.25, C.graphite, { mat: 'metal' }, 12),
    box(0.84, 1.83, 0.68, 0, 0.945, -0.03, C.steel, { mat: 'metal' }),
    box(0.85, 0.03, 0.69, 0, 1.885, -0.025, C.graphite, { mat: 'metal' }),
    box(0.02, 1.8, 0.68, -0.415, 0.945, -0.03, C.graphite, { mat: 'metal' }),
    box(0.02, 1.8, 0.68, 0.415, 0.945, -0.03, C.graphite, { mat: 'metal' }),

    // french doors
    rbox(0.412, 1.06, 0.035, 0.012, -0.209, 1.32, 0.322, C.concrete, { mat: 'metal' }),
    rbox(0.412, 1.06, 0.035, 0.012, 0.209, 1.32, 0.322, C.concrete, { mat: 'metal' }),
    box(0.012, 1.05, 0.03, 0, 1.32, 0.318, C.ink),
    box(0.008, 0.99, 0.026, -0.416, 1.32, 0.318, C.graphite, { mat: 'metal' }),
    box(0.008, 0.99, 0.026, 0.416, 1.32, 0.318, C.graphite, { mat: 'metal' }),

    // freezer drawers
    rbox(0.828, 0.3, 0.035, 0.012, 0, 0.6, 0.322, C.concrete, { mat: 'metal' }),
    rbox(0.828, 0.32, 0.035, 0.012, 0, 0.265, 0.322, C.concrete, { mat: 'metal' }),
    box(0.8, 0.01, 0.026, 0, 0.437, 0.32, C.ink),
    // vent grille
    box(0.62, 0.05, 0.02, 0, 0.075, 0.328, C.ink, { mat: 'matte' }),
    box(0.58, 0.006, 0.012, 0, 0.063, 0.334, C.graphite, { mat: 'metal' }),
    box(0.58, 0.006, 0.012, 0, 0.077, 0.334, C.graphite, { mat: 'metal' }),
    box(0.58, 0.006, 0.012, 0, 0.091, 0.334, C.graphite, { mat: 'metal' }),

    // vertical door handles
    cyl(0.014, 0.014, 0.6, -0.062, 1.4, 0.358, C.steel, { mat: 'metal' }, 14),
    cyl(0.014, 0.014, 0.6, 0.062, 1.4, 0.358, C.steel, { mat: 'metal' }, 14),
    box(0.024, 0.024, 0.05, -0.062, 1.16, 0.34, C.steel, { mat: 'metal' }),
    box(0.024, 0.024, 0.05, -0.062, 1.64, 0.34, C.steel, { mat: 'metal' }),
    box(0.024, 0.024, 0.05, 0.062, 1.16, 0.34, C.steel, { mat: 'metal' }),
    box(0.024, 0.024, 0.05, 0.062, 1.64, 0.34, C.steel, { mat: 'metal' }),

    // freezer drawer pulls
    cyl(0.013, 0.013, 0.46, 0, 0.68, 0.358, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    cyl(0.013, 0.013, 0.46, 0, 0.345, 0.358, C.steel, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 14),
    box(0.022, 0.022, 0.05, -0.2, 0.68, 0.34, C.steel, { mat: 'metal' }),
    box(0.022, 0.022, 0.05, 0.2, 0.68, 0.34, C.steel, { mat: 'metal' }),
    box(0.022, 0.022, 0.05, -0.2, 0.345, 0.34, C.steel, { mat: 'metal' }),
    box(0.022, 0.022, 0.05, 0.2, 0.345, 0.34, C.steel, { mat: 'metal' }),

    // display panel with status lights
    box(0.16, 0.085, 0.01, 0.18, 1.75, 0.345, C.ink, { mat: 'gloss' }),
    box(0.05, 0.014, 0.004, 0.155, 1.762, 0.351, C.water, { mat: 'emissive' }),
    box(0.026, 0.01, 0.004, 0.226, 1.762, 0.351, C.leafLight, { mat: 'emissive' }),
    box(0.026, 0.01, 0.004, 0.226, 1.737, 0.351, C.brass, { mat: 'emissive' }),
    // badge
    box(0.06, 0.008, 0.004, -0.24, 1.8, 0.345, C.brass, { mat: 'metal' }),
    // hinges
    box(0.02, 0.06, 0.014, -0.415, 0.86, 0.33, C.graphite, { mat: 'metal' }),
    box(0.02, 0.06, 0.014, 0.415, 0.86, 0.33, C.graphite, { mat: 'metal' }),

    // top hinge covers and a magnetic shopping note on the right side panel
    rbox(0.07, 0.032, 0.04, 0.008, -0.37, 1.862, 0.33, C.graphite, { mat: 'metal' }),
    rbox(0.07, 0.032, 0.04, 0.008, 0.37, 1.862, 0.33, C.graphite, { mat: 'metal' }),
    rbox(0.003, 0.13, 0.17, 0.002, 0.4265, 1.48, 0.05, C.white, { mat: 'matte' }),
    ...[-0.045, -0.015, 0.015, 0.045].map((dy) =>
      box(0.002, 0.004, 0.11, 0.4285, 1.48 + dy, 0.05, '#b7b0a2', { mat: 'matte' }),
    ),
    cyl(0.015, 0.015, 0.008, 0.4305, 1.55, 0.05, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 16),
    // kick grille screws
    cyl(0.006, 0.006, 0.005, -0.28, 0.075, 0.339, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.006, 0.006, 0.005, 0.28, 0.075, 0.339, C.steel, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
  ],
})
