import { C, box, cyl, defineModel, rbox } from '../../kit'

export default defineModel({
  id: 'wardrobe',
  name: '衣柜',
  category: 'bedroom',
  tags: ['wardrobe', 'closet', '衣柜', '卧室', 'storage', 'oak'],
  footprint: [1.8, 0.65],
  height: 2.3,
  placement: 'indoor',
  wallAlign: true,
  parts: [
    // Recessed plinth and carcass
    box(1.72, 0.08, 0.56, 0, 0.04, -0.025, C.walnut, { mat: 'wood' }),
    box(1.76, 2.1, 0.58, 0, 1.13, -0.03, C.oak, { mat: 'wood' }),

    // Three full-height panel doors
    rbox(0.576, 2.06, 0.025, 0.006, -0.582, 1.13, 0.2725, '#b98f5e', { mat: 'wood' }),
    rbox(0.576, 2.06, 0.025, 0.006, 0, 1.13, 0.2725, '#b98f5e', { mat: 'wood' }),
    rbox(0.576, 2.06, 0.025, 0.006, 0.582, 1.13, 0.2725, '#b98f5e', { mat: 'wood' }),
    box(0.006, 2.06, 0.012, -0.291, 1.13, 0.269, '#5d3f2b', { mat: 'wood' }),
    box(0.006, 2.06, 0.012, 0.291, 1.13, 0.269, '#5d3f2b', { mat: 'wood' }),

    // Raised centre panels
    rbox(0.5, 1.6, 0.008, 0.004, -0.582, 1.2, 0.2855, '#bd9463', { mat: 'wood' }),
    rbox(0.5, 1.6, 0.008, 0.004, 0, 1.2, 0.2855, '#bd9463', { mat: 'wood' }),
    rbox(0.5, 1.6, 0.008, 0.004, 0.582, 1.2, 0.2855, '#bd9463', { mat: 'wood' }),

    // Tall brass bar handles on stand-offs
    cyl(0.009, 0.009, 0.66, -0.362, 1.2, 0.297, C.brass, { mat: 'metal' }, 12),
    cyl(0.009, 0.009, 0.66, 0.22, 1.2, 0.297, C.brass, { mat: 'metal' }, 12),
    cyl(0.009, 0.009, 0.66, 0.802, 1.2, 0.297, C.brass, { mat: 'metal' }, 12),
    cyl(0.005, 0.005, 0.022, -0.362, 0.91, 0.288, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.005, 0.005, 0.022, -0.362, 1.49, 0.288, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.005, 0.005, 0.022, 0.22, 0.91, 0.288, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.005, 0.005, 0.022, 0.22, 1.49, 0.288, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.005, 0.005, 0.022, 0.802, 0.91, 0.288, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    cyl(0.005, 0.005, 0.022, 0.802, 1.49, 0.288, C.brass, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),

    // Top trim and crown
    box(1.8, 0.06, 0.65, 0, 2.21, 0, C.oak, { mat: 'wood' }),
    rbox(1.76, 0.06, 0.61, 0.01, 0, 2.27, 0, '#b78d5c', { mat: 'wood' }),
    box(1.7, 0.012, 0.012, 0, 2.174, 0.286, '#7c5a3b', { mat: 'wood' }),

    // Fine shadow line above the plinth
    box(1.74, 0.012, 0.012, 0, 0.094, 0.267, '#7c5a3b', { mat: 'wood' }),
  ],
})
