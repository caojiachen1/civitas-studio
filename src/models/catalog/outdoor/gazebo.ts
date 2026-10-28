import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const teak = '#a97a4d'
const teakDark = '#82603c'
const paint = '#e3dcc9'

export default defineModel({
  id: 'gazebo',
  name: '凉亭',
  category: 'outdoor',
  tags: ['gazebo', 'pavilion', 'pergola', '凉亭', '亭子', '庭院'],
  footprint: [3.2, 3.2],
  height: 3.0,
  placement: 'outdoor',
  parts: [
    // deck
    box(3.2, 0.1, 3.2, 0, 0.05, 0, teakDark, { mat: 'wood' }),
    box(3.18, 0.025, 0.4, 0, 0.1125, -1.3, teak, { mat: 'wood' }),
    box(3.18, 0.025, 0.4, 0, 0.1125, -0.78, teak, { mat: 'wood' }),
    box(3.18, 0.025, 0.4, 0, 0.1125, -0.26, teak, { mat: 'wood' }),
    box(3.18, 0.025, 0.4, 0, 0.1125, 0.26, teak, { mat: 'wood' }),
    box(3.18, 0.025, 0.4, 0, 0.1125, 0.78, teak, { mat: 'wood' }),
    box(3.18, 0.025, 0.4, 0, 0.1125, 1.3, teak, { mat: 'wood' }),
    // posts
    rbox(0.14, 2.06, 0.14, 0.015, -1.5, 1.155, -1.5, paint, { mat: 'matte' }),
    rbox(0.14, 2.06, 0.14, 0.015, 1.5, 1.155, -1.5, paint, { mat: 'matte' }),
    rbox(0.14, 2.06, 0.14, 0.015, -1.5, 1.155, 1.5, paint, { mat: 'matte' }),
    rbox(0.14, 2.06, 0.14, 0.015, 1.5, 1.155, 1.5, paint, { mat: 'matte' }),
    // beam frame
    box(3.0, 0.13, 0.12, 0, 2.25, -1.455, paint, { mat: 'matte' }),
    box(3.0, 0.13, 0.12, 0, 2.25, 1.455, paint, { mat: 'matte' }),
    box(0.12, 0.13, 3.0, -1.455, 2.25, 0, paint, { mat: 'matte' }),
    box(0.12, 0.13, 3.0, 1.455, 2.25, 0, paint, { mat: 'matte' }),
    // corner braces
    box(0.07, 0.45, 0.07, -1.295, 2.08, -1.44, paint, { mat: 'matte', rot: [0, 0, -Math.PI / 4] }),
    box(0.07, 0.45, 0.07, 1.295, 2.08, -1.44, paint, { mat: 'matte', rot: [0, 0, Math.PI / 4] }),
    box(0.07, 0.45, 0.07, -1.295, 2.08, 1.44, paint, { mat: 'matte', rot: [0, 0, -Math.PI / 4] }),
    box(0.07, 0.45, 0.07, 1.295, 2.08, 1.44, paint, { mat: 'matte', rot: [0, 0, Math.PI / 4] }),
    // hipped pavilion roof
    cyl(0, 2.263, 0.58, 0, 2.61, 0, C.terracotta, { mat: 'matte', side: 'double', rot: [0, Math.PI / 4, 0] }, 4),
    box(3.2, 0.06, 0.05, 0, 2.29, 1.575, paint, { mat: 'matte' }),
    box(3.2, 0.06, 0.05, 0, 2.29, -1.575, paint, { mat: 'matte' }),
    box(0.05, 0.06, 3.1, 1.575, 2.29, 0, paint, { mat: 'matte' }),
    box(0.05, 0.06, 3.1, -1.575, 2.29, 0, paint, { mat: 'matte' }),
    // side railings
    box(0.09, 0.075, 2.86, -1.455, 1.0, 0, paint, { mat: 'matte' }),
    box(0.09, 0.075, 2.86, 1.455, 1.0, 0, paint, { mat: 'matte' }),
    box(0.07, 0.07, 2.86, -1.455, 0.35, 0, paint, { mat: 'matte' }),
    box(0.07, 0.07, 2.86, 1.455, 0.35, 0, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, -1.455, 0.669, -1.0, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, -1.455, 0.669, -0.34, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, -1.455, 0.669, 0.34, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, -1.455, 0.669, 1.0, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, 1.455, 0.669, -1.0, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, 1.455, 0.669, -0.34, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, 1.455, 0.669, 0.34, paint, { mat: 'matte' }),
    box(0.04, 0.585, 0.04, 1.455, 0.669, 1.0, paint, { mat: 'matte' }),
    // bench inside
    box(1.3, 0.045, 0.13, 0, 0.52, -1.2, teak, { mat: 'wood' }),
    box(1.3, 0.045, 0.13, 0, 0.52, -1.05, teak, { mat: 'wood' }),
    box(1.3, 0.045, 0.13, 0, 0.52, -0.9, teak, { mat: 'wood' }),
    box(0.06, 0.3725, 0.32, -0.55, 0.31125, -1.05, teakDark, { mat: 'wood' }),
    box(0.06, 0.3725, 0.32, 0.55, 0.31125, -1.05, teakDark, { mat: 'wood' }),
    box(1.3, 0.1, 0.035, 0, 0.72, -1.325, teak, { mat: 'wood' }),
    box(1.3, 0.1, 0.035, 0, 0.85, -1.325, teak, { mat: 'wood' }),
    box(0.05, 0.45, 0.05, -0.55, 0.73, -1.29, teakDark, { mat: 'wood', rot: [-0.15, 0, 0] }),
    box(0.05, 0.45, 0.05, 0.55, 0.73, -1.29, teakDark, { mat: 'wood', rot: [-0.15, 0, 0] }),
    // stone-ish plinths and chamfered collars at the foot of each post
    rbox(0.2, 0.05, 0.2, 0.012, -1.5, 0.15, -1.5, paint, { mat: 'matte' }),
    rbox(0.2, 0.05, 0.2, 0.012, 1.5, 0.15, -1.5, paint, { mat: 'matte' }),
    rbox(0.2, 0.05, 0.2, 0.012, -1.5, 0.15, 1.5, paint, { mat: 'matte' }),
    rbox(0.2, 0.05, 0.2, 0.012, 1.5, 0.15, 1.5, paint, { mat: 'matte' }),
    box(0.17, 0.03, 0.17, -1.5, 0.19, -1.5, paint, { mat: 'matte' }),
    box(0.17, 0.03, 0.17, 1.5, 0.19, -1.5, paint, { mat: 'matte' }),
    box(0.17, 0.03, 0.17, -1.5, 0.19, 1.5, paint, { mat: 'matte' }),
    box(0.17, 0.03, 0.17, 1.5, 0.19, 1.5, paint, { mat: 'matte' }),
    // turned finial capping the pavilion roof
    cyl(0.028, 0.04, 0.06, 0, 2.885, 0, paint, { mat: 'matte' }, 12),
    sphere(0.042, 0, 2.92, 0, C.brass, { mat: 'metal' }, 14),
    cyl(0.008, 0.008, 0.03, 0, 2.972, 0, C.brass, { mat: 'metal' }, 8),
    // seat cushion and two throw pillows on the built-in bench
    rbox(1.2, 0.055, 0.32, 0.02, 0, 0.5725, -1.05, C.sage, { mat: 'fabric' }),
    rbox(0.3, 0.26, 0.09, 0.04, -0.32, 0.66, -1.24, C.linen, { mat: 'fabric', rot: [-0.12, 0.1, 0] }),
    rbox(0.3, 0.26, 0.09, 0.04, 0.32, 0.66, -1.24, C.cream, { mat: 'fabric', rot: [-0.12, -0.1, 0] }),
    // lantern hanging from the apex on a short chain
    cyl(0.006, 0.006, 0.7, 0, 2.53, 0, C.blackMetal, { mat: 'metal' }, 6),
    box(0.11, 0.02, 0.11, 0, 2.21, 0, C.blackMetal, { mat: 'metal' }),
    box(0.1, 0.17, 0.1, 0, 2.115, 0, C.glass, { mat: 'glass', opacity: 0.4 }),
    box(0.055, 0.12, 0.055, 0, 2.115, 0, '#ffe9c2', { mat: 'emissive' }),
    box(0.12, 0.02, 0.12, 0, 2.02, 0, C.blackMetal, { mat: 'metal' }),
  ],
})
