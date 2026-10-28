import { C, box, cyl, defineModel, ico, prism, rbox, torus } from '../../kit'

const FRAME = '#b6bdb4'
const FRAME_DARK = '#8f988f'
const WOOD = '#a97a4d'
const ROOF_PITCH = 0.5536

export default defineModel({
  id: 'greenhouse',
  name: '玻璃温室',
  category: 'outdoor',
  tags: ['greenhouse', 'glasshouse', 'garden', '玻璃温室', '温室', '花房'],
  footprint: [3.07, 2.42],
  height: 2.6,
  placement: 'outdoor',
  parts: [
    // stone plinth
    box(3.0, 0.14, 0.1, 0, 0.07, 1.15, C.concrete, { mat: 'stone' }),
    box(3.0, 0.14, 0.1, 0, 0.07, -1.15, C.concrete, { mat: 'stone' }),
    box(0.1, 0.14, 2.3, -1.45, 0.07, 0, C.concrete, { mat: 'stone' }),
    box(0.1, 0.14, 2.3, 1.45, 0.07, 0, C.concrete, { mat: 'stone' }),
    // aluminium corner posts and eave beams
    rbox(0.07, 1.68, 0.07, 0.008, -1.45, 0.98, 1.15, FRAME, { mat: 'metal' }),
    rbox(0.07, 1.68, 0.07, 0.008, 1.45, 0.98, 1.15, FRAME, { mat: 'metal' }),
    rbox(0.07, 1.68, 0.07, 0.008, -1.45, 0.98, -1.15, FRAME, { mat: 'metal' }),
    rbox(0.07, 1.68, 0.07, 0.008, 1.45, 0.98, -1.15, FRAME, { mat: 'metal' }),
    box(3.0, 0.08, 0.08, 0, 1.78, 1.15, FRAME, { mat: 'metal' }),
    box(3.0, 0.08, 0.08, 0, 1.78, -1.15, FRAME, { mat: 'metal' }),
    box(0.08, 0.08, 2.3, -1.45, 1.78, 0, FRAME, { mat: 'metal' }),
    box(0.08, 0.08, 2.3, 1.45, 1.78, 0, FRAME, { mat: 'metal' }),
    // side studs and horizontal glazing bars
    box(0.05, 1.62, 0.05, -1.45, 0.96, 0, FRAME, { mat: 'metal' }),
    box(0.05, 1.62, 0.05, 1.45, 0.96, 0, FRAME, { mat: 'metal' }),
    box(2.88, 0.05, 0.03, 0, 0.98, -1.155, FRAME, { mat: 'metal' }),
    box(0.03, 0.05, 2.24, -1.455, 0.98, 0, FRAME, { mat: 'metal' }),
    box(0.03, 0.05, 2.24, 1.455, 0.98, 0, FRAME, { mat: 'metal' }),
    // glass walls
    box(2.86, 1.64, 0.02, 0, 0.98, -1.15, C.glass, { mat: 'glass', opacity: 0.34 }),
    box(0.02, 1.64, 2.24, -1.45, 0.98, 0, C.glass, { mat: 'glass', opacity: 0.34 }),
    box(0.02, 1.64, 2.24, 1.45, 0.98, 0, C.glass, { mat: 'glass', opacity: 0.34 }),
    box(1.55, 1.64, 0.02, -0.675, 0.98, 1.15, C.glass, { mat: 'glass', opacity: 0.34 }),
    box(0.75, 1.64, 0.02, 1.075, 0.98, 1.15, C.glass, { mat: 'glass', opacity: 0.34 }),
    // glazed gable ends
    prism([[-1.42, 1.82], [1.42, 1.82], [0, 2.5]], 0.02, 0, 0, 1.14, C.glass, {
      mat: 'glass',
      opacity: 0.34,
    }),
    prism([[-1.42, 1.82], [1.42, 1.82], [0, 2.5]], 0.02, 0, 0, -1.14, C.glass, {
      mat: 'glass',
      opacity: 0.34,
    }),
    // door frame and glazed leaf
    box(0.06, 1.62, 0.06, 0.1, 0.95, 1.15, FRAME_DARK, { mat: 'metal' }),
    box(0.06, 1.62, 0.06, 0.7, 0.95, 1.15, FRAME_DARK, { mat: 'metal' }),
    box(0.66, 0.06, 0.06, 0.4, 1.74, 1.15, FRAME_DARK, { mat: 'metal' }),
    box(0.4, 1.46, 0.02, 0.4, 0.91, 1.165, C.glass, { mat: 'glass', opacity: 0.34 }),
    box(0.04, 1.54, 0.035, 0.18, 0.91, 1.17, WOOD, { mat: 'wood' }),
    box(0.04, 1.54, 0.035, 0.62, 0.91, 1.17, WOOD, { mat: 'wood' }),
    box(0.03, 0.16, 0.02, 0.615, 0.95, 1.183, C.brass, { mat: 'metal' }),
    cyl(0.014, 0.014, 0.11, 0.56, 0.95, 1.185, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // glazed pitched roof
    box(2.94, 0.022, 1.38, 0, 2.17, 0.6, C.glass, {
      mat: 'glass',
      opacity: 0.34,
      rot: [ROOF_PITCH, 0, 0],
    }),
    box(2.94, 0.022, 1.38, 0, 2.17, -0.6, C.glass, {
      mat: 'glass',
      opacity: 0.34,
      rot: [-ROOF_PITCH, 0, 0],
    }),
    ...[-1.42, 0, 1.42].flatMap((x) => [
      box(0.05, 0.06, 1.36, x, 2.14, 0.6, FRAME, { mat: 'metal', rot: [ROOF_PITCH, 0, 0] }),
      box(0.05, 0.06, 1.36, x, 2.14, -0.6, FRAME, { mat: 'metal', rot: [-ROOF_PITCH, 0, 0] }),
    ]),
    box(3.0, 0.08, 0.1, 0, 2.52, 0, FRAME, { mat: 'metal' }),
    box(3.0, 0.04, 0.2, 0, 2.58, 0, FRAME_DARK, { mat: 'metal' }),
    // gable rafters closing the roof ends
    box(0.06, 1.6, 0.06, -0.71, 2.16, 1.15, FRAME, { mat: 'metal', rot: [0, 0, -1.102] }),
    box(0.06, 1.6, 0.06, 0.71, 2.16, 1.15, FRAME, { mat: 'metal', rot: [0, 0, 1.102] }),
    box(0.06, 1.6, 0.06, -0.71, 2.16, -1.15, FRAME, { mat: 'metal', rot: [0, 0, -1.102] }),
    box(0.06, 1.6, 0.06, 0.71, 2.16, -1.15, FRAME, { mat: 'metal', rot: [0, 0, 1.102] }),
    // propped-open roof vent
    box(0.6, 0.05, 0.46, -0.55, 2.3, 0.4, FRAME, { mat: 'metal', rot: [ROOF_PITCH, 0, 0] }),
    box(0.56, 0.02, 0.42, -0.55, 2.42, 0.36, C.glass, {
      mat: 'glass',
      opacity: 0.34,
      rot: [0.2, 0, 0],
    }),
    cyl(0.01, 0.01, 0.22, -0.72, 2.3, 0.54, FRAME, { mat: 'metal', rot: [0.35, 0, 0] }, 6),
    cyl(0.01, 0.01, 0.22, -0.38, 2.3, 0.54, FRAME, { mat: 'metal', rot: [0.35, 0, 0] }, 6),
    // potting bench glimpsed through the glass
    box(1.3, 0.05, 0.45, -0.6, 0.9, -0.85, WOOD, { mat: 'wood' }),
    box(0.05, 0.85, 0.05, -1.2, 0.475, -1.0, WOOD, { mat: 'wood' }),
    box(0.05, 0.85, 0.05, 0.0, 0.475, -1.0, WOOD, { mat: 'wood' }),
    box(0.05, 0.85, 0.05, -1.2, 0.475, -0.7, WOOD, { mat: 'wood' }),
    box(0.05, 0.85, 0.05, 0.0, 0.475, -0.7, WOOD, { mat: 'wood' }),
    box(1.2, 0.03, 0.4, -0.6, 0.38, -0.85, WOOD, { mat: 'wood' }),
    cyl(0.075, 0.06, 0.14, -1.05, 0.995, -0.9, C.terracotta, { mat: 'ceramic' }, 12),
    ico(0.1, -1.05, 1.11, -0.9, C.leaf, { mat: 'foliage' }, 1),
    box(0.3, 0.2, 0.22, -0.3, 1.025, -0.8, C.sand, { mat: 'matte' }),
    // eaves gutters and a downpipe on the right corner
    box(0.09, 0.09, 2.34, -1.49, 1.7, 0, FRAME_DARK, { mat: 'metal' }),
    box(0.09, 0.09, 2.34, 1.49, 1.7, 0, FRAME_DARK, { mat: 'metal' }),
    cyl(0.032, 0.032, 1.5, 1.485, 0.92, -1.06, FRAME_DARK, { mat: 'metal' }, 10),
    cyl(0.032, 0.032, 0.16, 1.485, 0.2, -1.14, FRAME_DARK, { mat: 'metal', rot: [Math.PI / 2, 0, 0] }, 10),
    // galvanised watering can on the potting bench
    cyl(0.075, 0.068, 0.13, -0.72, 0.99, -0.95, C.steel, { mat: 'metal' }, 14),
    cyl(0.011, 0.016, 0.2, -0.63, 1.03, -0.95, C.steel, { mat: 'metal', rot: [0, 0, -1.0] }, 8),
    torus(0.055, 0.009, -0.79, 1.055, -0.95, C.steel, { mat: 'metal', rot: [0, 0, 0] }, 14),
    // wall thermometer clipped to the centre stud
    box(0.012, 0.16, 0.06, 1.478, 1.32, 0, C.cream, { mat: 'matte' }),
    box(0.005, 0.1, 0.008, 1.485, 1.31, 0, C.red, { mat: 'matte' }),
    cyl(0.018, 0.018, 0.012, 1.484, 1.4, 0, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
  ],
})
