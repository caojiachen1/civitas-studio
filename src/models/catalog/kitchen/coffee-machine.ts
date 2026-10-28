import { C, box, cyl, defineModel, rbox, sphere, torus } from '../../kit'

const STEEL = '#aab1b4'
const STEEL_DARK = '#787f83'
const BODY = '#c9c6bf'
const GLOSS = '#2f3336'
const CREAM = '#efe9de'

export default defineModel({
  id: 'coffee-machine',
  name: '咖啡机',
  category: 'kitchen',
  tags: ['coffee machine', 'espresso', '咖啡机', '意式咖啡', '厨房', 'appliance', 'barista'],
  footprint: [0.42, 0.45],
  height: 0.55,
  placement: 'indoor',
  parts: [
    // rubber feet and stainless base plate
    cyl(0.017, 0.019, 0.014, -0.15, 0.007, -0.14, '#2a2c2d', { mat: 'matte' }, 12),
    cyl(0.017, 0.019, 0.014, 0.15, 0.007, -0.14, '#2a2c2d', { mat: 'matte' }, 12),
    cyl(0.017, 0.019, 0.014, -0.15, 0.007, 0.07, '#2a2c2d', { mat: 'matte' }, 12),
    cyl(0.017, 0.019, 0.014, 0.15, 0.007, 0.07, '#2a2c2d', { mat: 'matte' }, 12),
    rbox(0.4, 0.02, 0.32, 0.008, 0, 0.024, -0.055, STEEL, { mat: 'metal' }),

    // main housing, front gloss panel and side trims
    rbox(0.4, 0.38, 0.24, 0.03, 0, 0.224, -0.04, BODY, { mat: 'gloss' }),
    rbox(0.36, 0.3, 0.014, 0.008, 0, 0.24, 0.086, GLOSS, { mat: 'gloss' }),
    box(0.006, 0.32, 0.2, -0.202, 0.23, -0.04, STEEL, { mat: 'metal' }),
    box(0.006, 0.32, 0.2, 0.202, 0.23, -0.04, STEEL, { mat: 'metal' }),

    // rear water tank with lid, water level and fill marks
    rbox(0.32, 0.34, 0.07, 0.014, 0, 0.21, -0.185, '#b9cdd1', { mat: 'glass', opacity: 0.32 }),
    rbox(0.3, 0.16, 0.042, 0.01, 0, 0.13, -0.185, C.water, { mat: 'glass', opacity: 0.3 }),
    rbox(0.34, 0.022, 0.08, 0.008, 0, 0.391, -0.185, STEEL_DARK, { mat: 'metal' }),
    box(0.22, 0.004, 0.003, 0, 0.24, -0.2225, '#6f7d80', { mat: 'matte' }),
    box(0.22, 0.004, 0.003, 0, 0.14, -0.2225, '#6f7d80', { mat: 'matte' }),

    // upper brew housing, warming plate and rear cup rail
    rbox(0.3, 0.09, 0.22, 0.025, 0, 0.459, -0.02, BODY, { mat: 'gloss' }),
    rbox(0.3, 0.012, 0.23, 0.006, 0, 0.51, -0.02, STEEL_DARK, { mat: 'metal' }),
    cyl(0.008, 0.008, 0.026, -0.11, 0.529, -0.1, STEEL, { mat: 'metal' }, 10),
    cyl(0.008, 0.008, 0.026, 0.11, 0.529, -0.1, STEEL, { mat: 'metal' }, 10),
    cyl(0.008, 0.008, 0.23, 0, 0.542, -0.1, STEEL, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 12),

    // brew column, group head and shower screen
    rbox(0.15, 0.13, 0.07, 0.02, 0, 0.35, 0.105, BODY, { mat: 'gloss' }),
    cyl(0.055, 0.06, 0.085, 0, 0.245, 0.12, STEEL, { mat: 'metal' }, 24),
    cyl(0.068, 0.068, 0.016, 0, 0.292, 0.12, STEEL_DARK, { mat: 'metal' }, 24),
    cyl(0.05, 0.05, 0.005, 0, 0.201, 0.12, '#3d4245', { mat: 'metal' }, 20),

    // portafilter with twin spouts and a black handle
    cyl(0.057, 0.05, 0.026, 0, 0.186, 0.12, STEEL, { mat: 'metal' }, 24),
    cyl(0.008, 0.006, 0.016, -0.018, 0.166, 0.12, STEEL, { mat: 'metal' }, 10),
    cyl(0.008, 0.006, 0.016, 0.018, 0.166, 0.12, STEEL, { mat: 'metal' }, 10),
    cyl(0.011, 0.013, 0.08, 0, 0.168, 0.18, '#23262a', { mat: 'gloss', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.015, 0.015, 0.014, 0, 0.168, 0.142, STEEL_DARK, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),

    // drip tray with rim and grate slats
    rbox(0.34, 0.022, 0.15, 0.008, 0, 0.045, 0.13, STEEL, { mat: 'metal' }),
    box(0.34, 0.014, 0.012, 0, 0.061, 0.2, STEEL_DARK, { mat: 'metal' }),
    box(0.012, 0.014, 0.14, -0.164, 0.061, 0.13, STEEL_DARK, { mat: 'metal' }),
    box(0.012, 0.014, 0.14, 0.164, 0.061, 0.13, STEEL_DARK, { mat: 'metal' }),
    box(0.3, 0.004, 0.018, 0, 0.06, 0.08, '#5e6366', { mat: 'metal' }),
    box(0.3, 0.004, 0.018, 0, 0.06, 0.115, '#5e6366', { mat: 'metal' }),
    box(0.3, 0.004, 0.018, 0, 0.06, 0.15, '#5e6366', { mat: 'metal' }),
    box(0.3, 0.004, 0.018, 0, 0.06, 0.185, '#5e6366', { mat: 'metal' }),

    // two espresso cups with saucers and dark crema
    cyl(0.045, 0.04, 0.008, -0.07, 0.066, 0.13, CREAM, { mat: 'ceramic' }, 20),
    cyl(0.03, 0.025, 0.05, -0.07, 0.095, 0.13, CREAM, { mat: 'ceramic' }, 20),
    cyl(0.026, 0.026, 0.003, -0.07, 0.119, 0.13, '#4a3426', { mat: 'gloss' }, 20),
    torus(0.017, 0.005, -0.1, 0.1, 0.13, CREAM, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),
    cyl(0.045, 0.04, 0.008, 0.07, 0.066, 0.13, CREAM, { mat: 'ceramic' }, 20),
    cyl(0.03, 0.025, 0.05, 0.07, 0.095, 0.13, CREAM, { mat: 'ceramic' }, 20),
    cyl(0.026, 0.026, 0.003, 0.07, 0.119, 0.13, '#4a3426', { mat: 'gloss' }, 20),
    torus(0.017, 0.005, 0.1, 0.1, 0.13, CREAM, { mat: 'ceramic', rot: [0, Math.PI / 2, 0] }, 16),

    // articulated steam wand on the right
    box(0.09, 0.035, 0.035, 0.11, 0.305, 0.13, STEEL_DARK, { mat: 'metal' }),
    cyl(0.009, 0.009, 0.13, 0.15, 0.24, 0.15, STEEL, { mat: 'metal' }, 12),
    cyl(0.013, 0.013, 0.05, 0.15, 0.27, 0.15, '#2f3336', { mat: 'matte' }, 12),
    cyl(0.006, 0.008, 0.025, 0.15, 0.17, 0.15, STEEL_DARK, { mat: 'metal' }, 10),

    // control panel, display, buttons and pressure gauge
    rbox(0.16, 0.05, 0.012, 0.006, -0.06, 0.458, 0.096, GLOSS, { mat: 'gloss' }),
    box(0.06, 0.018, 0.003, -0.1, 0.462, 0.104, '#5f8f92', { mat: 'emissive' }),
    cyl(0.006, 0.006, 0.004, -0.05, 0.458, 0.104, STEEL, { mat: 'metal' }, 10),
    cyl(0.006, 0.006, 0.004, -0.032, 0.458, 0.104, STEEL, { mat: 'metal' }, 10),
    cyl(0.006, 0.006, 0.004, -0.014, 0.458, 0.104, '#c9a05e', { mat: 'emissive' }, 10),
    torus(0.023, 0.005, 0.13, 0.32, 0.098, STEEL_DARK, { mat: 'metal' }, 20),
    cyl(0.021, 0.021, 0.004, 0.13, 0.32, 0.096, CREAM, { mat: 'ceramic', rot: [Math.PI / 2, 0, 0] }, 20),
    box(0.002, 0.016, 0.002, 0.13, 0.325, 0.1, '#a64f42', { mat: 'matte', rot: [0, 0, 0.5] }),

    // brand badge and a steam knob
    box(0.07, 0.013, 0.003, 0, 0.105, 0.095, C.brass, { mat: 'metal' }),
    sphere(0.012, 0.197, 0.26, -0.02, STEEL_DARK, { mat: 'metal' }, 12),

    // drip tray float, tank lid clips and a hot water spout beside the group head
    cyl(0.011, 0.011, 0.012, 0.14, 0.064, 0.194, '#a64f42', { mat: 'gloss' }, 12),
    box(0.02, 0.016, 0.014, -0.13, 0.379, -0.152, STEEL_DARK, { mat: 'metal' }),
    box(0.02, 0.016, 0.014, 0.13, 0.379, -0.152, STEEL_DARK, { mat: 'metal' }),
    cyl(0.009, 0.011, 0.11, -0.068, 0.245, 0.118, STEEL, { mat: 'metal' }, 12),
    cyl(0.013, 0.01, 0.014, -0.068, 0.185, 0.118, STEEL_DARK, { mat: 'metal' }, 12),
    // group head retaining screws
    cyl(0.005, 0.005, 0.006, -0.042, 0.35, 0.1415, STEEL_DARK, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
    cyl(0.005, 0.005, 0.006, 0.042, 0.35, 0.1415, STEEL_DARK, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 8),
  ],
})
