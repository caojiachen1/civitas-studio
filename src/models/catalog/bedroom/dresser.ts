import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

export default defineModel({
  id: 'dresser',
  name: '斗柜',
  category: 'bedroom',
  tags: ['dresser', 'chest of drawers', '斗柜', '五斗柜', '卧室', 'walnut'],
  footprint: [1.2, 0.5],
  height: 0.85,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Tapered walnut legs
    cyl(0.026, 0.014, 0.13, -0.53, 0.065, -0.19, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.014, 0.13, 0.53, 0.065, -0.19, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.014, 0.13, -0.53, 0.065, 0.15, C.walnut, { mat: 'wood' }, 10),
    cyl(0.026, 0.014, 0.13, 0.53, 0.065, 0.15, C.walnut, { mat: 'wood' }, 10),

    // Carcass and oak top
    box(1.14, 0.63, 0.42, 0, 0.445, -0.02, C.walnut, { mat: 'wood' }),
    rbox(1.2, 0.03, 0.48, 0.008, 0, 0.775, -0.01, C.oak, { mat: 'wood' }),

    // Top row: two small drawers
    rbox(0.53, 0.16, 0.016, 0.005, -0.275, 0.635, 0.198, C.oak, { mat: 'wood' }),
    rbox(0.53, 0.16, 0.016, 0.005, 0.275, 0.635, 0.198, C.oak, { mat: 'wood' }),
    // Middle and bottom wide drawers
    rbox(1.06, 0.16, 0.016, 0.005, 0, 0.435, 0.198, C.oak, { mat: 'wood' }),
    rbox(1.06, 0.16, 0.016, 0.005, 0, 0.235, 0.198, C.oak, { mat: 'wood' }),
    box(1.08, 0.004, 0.006, 0, 0.325, 0.2, '#4f3624', { mat: 'wood' }),
    box(1.08, 0.004, 0.006, 0, 0.53, 0.2, '#4f3624', { mat: 'wood' }),

    // Brass knobs with backplates
    cyl(0.019, 0.019, 0.006, -0.275, 0.635, 0.209, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.019, 0.019, 0.006, 0.275, 0.635, 0.209, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.019, 0.019, 0.006, -0.3, 0.435, 0.209, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.019, 0.019, 0.006, 0.3, 0.435, 0.209, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.019, 0.019, 0.006, -0.3, 0.235, 0.209, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    cyl(0.019, 0.019, 0.006, 0.3, 0.235, 0.209, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 16),
    sphere(0.012, -0.275, 0.635, 0.218, C.brass, { mat: 'metal' }, 14),
    sphere(0.012, 0.275, 0.635, 0.218, C.brass, { mat: 'metal' }, 14),
    sphere(0.012, -0.3, 0.435, 0.218, C.brass, { mat: 'metal' }, 14),
    sphere(0.012, 0.3, 0.435, 0.218, C.brass, { mat: 'metal' }, 14),
    sphere(0.012, -0.3, 0.235, 0.218, C.brass, { mat: 'metal' }, 14),
    sphere(0.012, 0.3, 0.235, 0.218, C.brass, { mat: 'metal' }, 14),

    // Decorative walnut tray
    rbox(0.32, 0.012, 0.2, 0.008, 0.3, 0.796, -0.02, '#75533a', { mat: 'wood' }),
    box(0.012, 0.02, 0.2, 0.146, 0.811, -0.02, C.walnut, { mat: 'wood' }),
    box(0.012, 0.02, 0.2, 0.454, 0.811, -0.02, C.walnut, { mat: 'wood' }),
    box(0.32, 0.02, 0.012, 0.3, 0.811, -0.114, C.walnut, { mat: 'wood' }),
    box(0.32, 0.02, 0.012, 0.3, 0.811, 0.074, C.walnut, { mat: 'wood' }),

    // Perfume bottles with brass caps
    cyl(0.018, 0.022, 0.04, 0.24, 0.822, -0.06, C.glass, { mat: 'glass', opacity: 0.75 }, 16),
    cyl(0.009, 0.009, 0.005, 0.24, 0.8445, -0.06, C.brass, { mat: 'metal' }, 12),
    cyl(0.02, 0.02, 0.028, 0.36, 0.816, 0.02, '#c9a099', { mat: 'ceramic' }, 18),
    cyl(0.019, 0.019, 0.008, 0.36, 0.834, 0.02, C.brass, { mat: 'metal' }, 18),
  ],
})
