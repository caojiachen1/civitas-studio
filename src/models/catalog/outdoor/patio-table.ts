import { C, box, cyl, defineModel, ico, rbox } from '../../kit'

const teak = '#a87c50'
const teakDark = '#8b6139'

export default defineModel({
  id: 'patio-table',
  name: '户外餐桌',
  category: 'outdoor',
  tags: ['table', 'dining', 'patio', 'teak', '餐桌', '户外桌', '柚木'],
  footprint: [1.4, 0.8],
  height: 0.74,
  placement: 'outdoor',
  parts: [
    // slatted top, split around the central herb trough
    box(0.455, 0.045, 0.105, -0.4725, 0.6975, -0.32, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, 0.4725, 0.6975, -0.32, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, -0.4725, 0.6975, -0.195, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, 0.4725, 0.6975, -0.195, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, -0.4725, 0.6975, -0.07, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, 0.4725, 0.6975, -0.07, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, -0.4725, 0.6975, 0.07, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, 0.4725, 0.6975, 0.07, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, -0.4725, 0.6975, 0.195, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, 0.4725, 0.6975, 0.195, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, -0.4725, 0.6975, 0.32, teak, { mat: 'wood' }),
    box(0.455, 0.045, 0.105, 0.4725, 0.6975, 0.32, teak, { mat: 'wood' }),
    // terracotta trough set into the top
    box(0.46, 0.03, 0.64, 0, 0.61, 0, C.terracotta, { mat: 'ceramic' }),
    box(0.025, 0.12, 0.68, -0.2375, 0.66, 0, C.terracotta, { mat: 'ceramic' }),
    box(0.025, 0.12, 0.68, 0.2375, 0.66, 0, C.terracotta, { mat: 'ceramic' }),
    box(0.45, 0.12, 0.025, 0, 0.66, -0.3275, C.terracotta, { mat: 'ceramic' }),
    box(0.45, 0.12, 0.025, 0, 0.66, 0.3275, C.terracotta, { mat: 'ceramic' }),
    // teak rim boards
    box(0.035, 0.036, 0.72, -0.2625, 0.708, 0, teakDark, { mat: 'wood' }),
    box(0.035, 0.036, 0.72, 0.2625, 0.708, 0, teakDark, { mat: 'wood' }),
    // soil and herbs
    box(0.43, 0.035, 0.62, 0, 0.6825, 0, C.soil, { mat: 'matte' }),
    ico(0.045, -0.16, 0.695, -0.24, C.leaf, { mat: 'foliage' }),
    ico(0.04, 0.14, 0.7, -0.24, C.leafLight, { mat: 'foliage' }),
    ico(0.043, -0.12, 0.697, -0.02, C.leaf, { mat: 'foliage' }),
    ico(0.038, 0.16, 0.702, 0.03, C.leafDeep, { mat: 'foliage' }),
    ico(0.042, -0.14, 0.698, 0.24, C.leafLight, { mat: 'foliage' }),
    ico(0.038, 0.13, 0.702, 0.25, C.leaf, { mat: 'foliage' }),
    ico(0.04, 0.02, 0.696, -0.12, C.leafDeep, { mat: 'foliage' }),
    ico(0.034, -0.02, 0.704, 0.12, C.leafLight, { mat: 'foliage' }),
    ico(0.03, 0.1, 0.71, 0.14, '#c9a05a', { mat: 'foliage' }),
    // legs
    rbox(0.085, 0.66, 0.085, 0.016, -0.6, 0.33, 0.3, teak, { mat: 'wood' }),
    rbox(0.085, 0.66, 0.085, 0.016, 0.6, 0.33, 0.3, teak, { mat: 'wood' }),
    rbox(0.085, 0.66, 0.085, 0.016, -0.6, 0.33, -0.3, teak, { mat: 'wood' }),
    rbox(0.085, 0.66, 0.085, 0.016, 0.6, 0.33, -0.3, teak, { mat: 'wood' }),
    // aprons
    box(1.19, 0.1, 0.055, 0, 0.625, 0.3, teakDark, { mat: 'wood' }),
    box(1.19, 0.1, 0.055, 0, 0.625, -0.3, teakDark, { mat: 'wood' }),
    box(0.055, 0.1, 0.52, -0.6, 0.625, 0, teakDark, { mat: 'wood' }),
    box(0.055, 0.1, 0.52, 0.6, 0.625, 0, teakDark, { mat: 'wood' }),
    // stretchers and cross braces
    box(1.02, 0.055, 0.055, 0, 0.19, 0, teakDark, { mat: 'wood' }),
    box(0.055, 0.055, 0.5, -0.52, 0.19, 0, teakDark, { mat: 'wood' }),
    box(0.055, 0.055, 0.5, 0.52, 0.19, 0, teakDark, { mat: 'wood' }),
    box(0.05, 0.38, 0.05, 0, 0.4, 0, teakDark, { mat: 'wood' }),
    // corner hardware
    cyl(0.014, 0.014, 0.02, -0.62, 0.625, 0.3, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.02, 0.62, 0.625, 0.3, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.02, -0.62, 0.625, -0.3, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    cyl(0.014, 0.014, 0.02, 0.62, 0.625, -0.3, C.brass, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
  ],
})
