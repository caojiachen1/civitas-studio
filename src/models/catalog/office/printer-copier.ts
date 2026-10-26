import { C, box, cyl, defineModel, rbox, sphere } from '../../kit'

const SHELL = '#d9d7d0'
const SHELL_DARK = '#b9b7b0'
const INK = '#2c3135'
const GLASS = '#7d8f96'

const buttonRows = [0.16, 0.205, 0.25]

export default defineModel({
  id: 'printer-copier',
  name: '打印机',
  category: 'office',
  tags: ['printer', 'copier', 'scanner', '打印机', '复印机', '办公设备'],
  footprint: [0.68, 0.6],
  height: 0.82,
  placement: 'indoor',
  parts: [
    // main body and plinth
    rbox(0.62, 0.5, 0.5, 0.02, 0, 0.32, 0, SHELL, { mat: 'matte' }),
    rbox(0.64, 0.06, 0.52, 0.012, 0, 0.04, 0, INK, { mat: 'matte' }),
    box(0.6, 0.012, 0.48, 0, 0.575, 0, SHELL_DARK, { mat: 'matte' }),

    // lower paper cassette with pull handle and label
    rbox(0.56, 0.16, 0.04, 0.006, 0, 0.14, 0.258, SHELL_DARK, { mat: 'matte' }),
    rbox(0.2, 0.018, 0.016, 0.004, 0, 0.14, 0.283, INK, { mat: 'matte' }),
    rbox(0.14, 0.05, 0.002, 0.002, 0.16, 0.14, 0.279, C.white, { mat: 'matte' }),
    // paper stack peeking out
    box(0.5, 0.012, 0.1, 0, 0.226, 0.24, C.white, { mat: 'matte' }),
    box(0.49, 0.003, 0.095, 0, 0.233, 0.24, '#f4f2ec', { mat: 'matte' }),

    // output tray with side fences
    rbox(0.46, 0.03, 0.14, 0.008, 0, 0.38, 0.23, SHELL_DARK, { mat: 'matte' }),
    rbox(0.4, 0.006, 0.12, 0.003, 0, 0.398, 0.23, '#c9c7c0', { mat: 'matte' }),
    box(0.02, 0.06, 0.13, -0.22, 0.42, 0.228, SHELL, { mat: 'matte' }),
    box(0.02, 0.06, 0.13, 0.22, 0.42, 0.228, SHELL, { mat: 'matte' }),
    // printed sheets in the tray
    box(0.34, 0.008, 0.11, 0.01, 0.405, 0.23, C.white, { mat: 'matte', rot: [0, 0.03, 0] }),
    box(0.33, 0.006, 0.1, -0.01, 0.412, 0.22, '#f5f3ed', { mat: 'matte', rot: [0, -0.02, 0] }),

    // scanner lid on top with hinge and dark glass strip
    rbox(0.6, 0.045, 0.46, 0.012, 0, 0.685, -0.02, SHELL, { mat: 'matte' }),
    rbox(0.54, 0.012, 0.4, 0.006, 0, 0.713, -0.02, SHELL_DARK, { mat: 'matte' }),
    box(0.5, 0.002, 0.05, 0, 0.721, 0.13, GLASS, { mat: 'glass' }),
    cyl(0.012, 0.012, 0.5, 0, 0.72, -0.26, INK, { mat: 'metal', rot: [0, 0, Math.PI / 2] }, 10),
    // automatic document feeder hump
    rbox(0.34, 0.07, 0.2, 0.02, 0, 0.755, -0.1, SHELL, { mat: 'matte' }),
    box(0.3, 0.012, 0.13, 0, 0.79, -0.09, INK, { mat: 'matte' }),
    box(0.27, 0.004, 0.11, 0, 0.797, -0.09, C.white, { mat: 'matte' }),

    // angled control panel with touch screen and buttons
    rbox(0.22, 0.055, 0.12, 0.015, 0.19, 0.745, 0.19, INK, { mat: 'matte', rot: [-0.45, 0, 0] }),
    rbox(0.12, 0.004, 0.075, 0.004, 0.19, 0.766, 0.203, '#5d7682', { mat: 'gloss', rot: [-0.45, 0, 0] }),
    ...buttonRows.flatMap((x, i) => [
      cyl(0.009, 0.009, 0.006, x - 0.08, 0.765, 0.245, i === 0 ? C.red : SHELL_DARK, { mat: 'matte' }, 10),
      cyl(0.009, 0.009, 0.006, x - 0.05, 0.765, 0.245, i === 1 ? '#7f9a68' : SHELL_DARK, { mat: 'matte' }, 10),
    ]),

    // side vents and power socket
    ...[0, 1, 2, 3].map((i) => box(0.002, 0.014, 0.16, -0.311, 0.45 - i * 0.035, -0.05, INK, { mat: 'matte' })),
    rbox(0.02, 0.09, 0.11, 0.006, 0.31, 0.16, -0.12, INK, { mat: 'matte' }),
    cyl(0.006, 0.006, 0.03, 0.34, 0.16, -0.1, INK, { mat: 'gloss', rot: [0, 0, Math.PI / 2] }, 8),

    // small status LEDs and a brand badge
    sphere(0.008, -0.2, 0.6, 0.24, '#7fa06f', { mat: 'emissive' }, 10),
    sphere(0.008, -0.17, 0.6, 0.24, '#c9b46e', { mat: 'emissive' }, 10),
    rbox(0.11, 0.022, 0.003, 0.003, -0.16, 0.5, 0.253, C.steel, { mat: 'metal' }),
  ],
})
