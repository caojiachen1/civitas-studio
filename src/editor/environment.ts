import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { VisualStyle } from './types'

interface StylePreset {
  sky: string[]
  fog: string
  fogNear: number
  fogFar: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  sun: string
  sunIntensity: number
  fill: string
  fillIntensity: number
  groundTint: string
  exposure: number
}

const STYLE_PRESETS: Record<VisualStyle, StylePreset> = {
  mono: {
    sky: ['#2c2c2c', '#262626', '#222222', '#1d1d1d', '#191919'],
    fog: '#202020',
    fogNear: 70,
    fogFar: 280,
    hemiSky: '#b8b8b8',
    hemiGround: '#262626',
    hemiIntensity: 1.2,
    sun: '#ffffff',
    sunIntensity: 2.35,
    fill: '#b0b0b0',
    fillIntensity: 0.6,
    groundTint: '#ffffff',
    exposure: 1,
  },
  daylight: {
    sky: ['#eef5f8', '#d8e5ec', '#c1d2dc', '#a6bac7', '#8d9faa'],
    fog: '#c6d1d8',
    fogNear: 95,
    fogFar: 380,
    hemiSky: '#f1f7f8',
    hemiGround: '#5f6a63',
    hemiIntensity: 1.5,
    sun: '#fff2d8',
    sunIntensity: 2.8,
    fill: '#cfe0ea',
    fillIntensity: 0.75,
    groundTint: '#ddd9cd',
    exposure: 1.05,
  },
  sunset: {
    sky: ['#6d5f72', '#a86f68', '#d4946b', '#8c5f58', '#3d3947'],
    fog: '#8a6a5e',
    fogNear: 65,
    fogFar: 310,
    hemiSky: '#d9b79e',
    hemiGround: '#3a3130',
    hemiIntensity: 1.15,
    sun: '#ffb877',
    sunIntensity: 2.7,
    fill: '#6f7f96',
    fillIntensity: 0.5,
    groundTint: '#c8ad93',
    exposure: 1.1,
  },
  blueprint: {
    sky: ['#102532', '#0c1d28', '#091721', '#061019', '#040b10'],
    fog: '#0a1a24',
    fogNear: 60,
    fogFar: 260,
    hemiSky: '#a8cee4',
    hemiGround: '#0a1820',
    hemiIntensity: 1.15,
    sun: '#d6ecff',
    sunIntensity: 2.0,
    fill: '#4c7d9c',
    fillIntensity: 0.65,
    groundTint: '#66808f',
    exposure: 1,
  },
}

function makeSkyTexture(style: VisualStyle): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 1024)
  const stops = STYLE_PRESETS[style].sky
  stops.forEach((color, index) => gradient.addColorStop(index / (stops.length - 1), color))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 1024)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const GROUND_SIZE = 1024
const GROUND_REPEAT = 110

function makeGroundTexture(): THREE.CanvasTexture {
  const size = GROUND_SIZE
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#2b2b2b'
  ctx.fillRect(0, 0, size, size)
  let seed = 1234567
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  // broad soil mottling
  for (let i = 0; i < 900; i++) {
    const x = rand() * size
    const y = rand() * size
    const v = Math.floor(rand() * 20) - 10
    ctx.fillStyle = `rgba(${46 + v},${46 + v},${46 + v},${0.1 + rand() * 0.12})`
    ctx.beginPath()
    ctx.ellipse(x, y, 18 + rand() * 48, 12 + rand() * 30, rand() * 3.14, 0, Math.PI * 2)
    ctx.fill()
  }
  // fine pebbles and grit
  for (let i = 0; i < 11000; i++) {
    const x = rand() * size
    const y = rand() * size
    const v = Math.floor(rand() * 30) - 15
    ctx.fillStyle = `rgba(${54 + v},${54 + v},${54 + v},${0.2 + rand() * 0.26})`
    ctx.beginPath()
    ctx.ellipse(x, y, 1.5 + rand() * 7, 1 + rand() * 3.6, rand() * 3.14, 0, Math.PI * 2)
    ctx.fill()
  }
  // dry grass fibres
  for (let i = 0; i < 4800; i++) {
    const x = rand() * size
    const y = rand() * size
    ctx.strokeStyle = `rgba(${62 + rand() * 28},${62 + rand() * 28},${62 + rand() * 24},${0.1 + rand() * 0.14})`
    ctx.lineWidth = 0.7 + rand() * 0.8
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + (rand() - 0.5) * 4, y - 2 - rand() * 6)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(GROUND_REPEAT, GROUND_REPEAT)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  return texture
}

function makeGroundBumpTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)
  let seed = 7654321
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  for (let i = 0; i < 6200; i++) {
    const x = rand() * size
    const y = rand() * size
    const bright = rand() > 0.45
    const v = bright ? 130 + rand() * 50 : 70 + rand() * 40
    ctx.fillStyle = `rgba(${v},${v},${v},${0.18 + rand() * 0.3})`
    ctx.beginPath()
    ctx.ellipse(x, y, 1 + rand() * 5, 0.8 + rand() * 3, rand() * 3.14, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(GROUND_REPEAT, GROUND_REPEAT)
  texture.anisotropy = 8
  return texture
}

function makeGrid(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(700, 700)
  geometry.rotateX(-Math.PI / 2)
  const uniforms = {
    uCenter: { value: new THREE.Vector2(0, 0) },
  }
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec2 uCenter;
      varying vec3 vWorld;
      float gridLine(vec2 coord, float cell) {
        vec2 c = coord / cell;
        vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
        return 1.0 - min(min(g.x, g.y), 1.0);
      }
      void main() {
        vec2 c = vWorld.xz;
        float minor = gridLine(c, 1.0) * 0.11;
        float major = gridLine(c, 5.0) * 0.24;
        float dTarget = distance(c, uCenter);
        float fade = 1.0 - smoothstep(24.0, 95.0, dTarget);
        float camFade = 1.0 - smoothstep(100.0, 260.0, distance(c, cameraPosition.xz));
        float alpha = (minor + major) * fade * camFade;
        if (alpha < 0.004) discard;
        vec3 color = mix(vec3(0.62), vec3(0.86), step(0.2, major));
        gl_FragColor = vec4(color, alpha);
      }
    `,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 0.006
  mesh.renderOrder = 1
  mesh.frustumCulled = false
  mesh.userData.gridUniforms = uniforms
  return mesh
}

export interface EnvironmentRig {
  grid: THREE.Mesh
  sun: THREE.DirectionalLight
  sunTarget: THREE.Object3D
  hemi: THREE.HemisphereLight
  fill: THREE.DirectionalLight
  groundMaterial: THREE.MeshStandardMaterial
  applyStyle(style: VisualStyle): void
  update(target: THREE.Vector3): void
}

export function setupEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer): EnvironmentRig {
  scene.background = makeSkyTexture('mono')
  scene.fog = new THREE.Fog('#202020', 70, 280)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04).texture
  scene.environment = env
  scene.environmentIntensity = 0.5
  room.dispose?.()
  pmrem.dispose()

  const hemi = new THREE.HemisphereLight('#b8b8b8', '#262626', 1.2)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight('#ffffff', 2.35)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -42
  sun.shadow.camera.right = 42
  sun.shadow.camera.top = 42
  sun.shadow.camera.bottom = -42
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 190
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.045
  const sunTarget = new THREE.Object3D()
  sun.target = sunTarget
  scene.add(sun)
  scene.add(sunTarget)

  const fill = new THREE.DirectionalLight('#b0b0b0', 0.6)
  fill.position.set(-30, 24, -20)
  scene.add(fill)

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: makeGroundTexture(),
    bumpMap: makeGroundBumpTexture(),
    bumpScale: 0.055,
    color: '#ffffff',
    roughness: 0.98,
    metalness: 0,
  })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.015
  ground.receiveShadow = true
  ground.name = 'ground'
  scene.add(ground)

  const grid = makeGrid()
  scene.add(grid)

  const update = (target: THREE.Vector3) => {
    const uniforms = grid.userData.gridUniforms as { uCenter: { value: THREE.Vector2 } }
    uniforms.uCenter.value.set(target.x, target.z)
    sun.position.set(target.x + 46, target.y + 58, target.z + 28)
    sunTarget.position.set(target.x, target.y, target.z)
    sunTarget.updateMatrixWorld()
    fill.position.set(target.x - 35, target.y + 30, target.z - 24)
  }
  update(new THREE.Vector3(0, 0, 0))

  const applyStyle = (style: VisualStyle) => {
    const preset = STYLE_PRESETS[style]
    const previous = scene.background
    scene.background = makeSkyTexture(style)
    if (previous instanceof THREE.Texture) previous.dispose()
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.set(preset.fog)
      scene.fog.near = preset.fogNear
      scene.fog.far = preset.fogFar
    }
    hemi.color.set(preset.hemiSky)
    hemi.groundColor.set(preset.hemiGround)
    hemi.intensity = preset.hemiIntensity
    sun.color.set(preset.sun)
    sun.intensity = preset.sunIntensity
    fill.color.set(preset.fill)
    fill.intensity = preset.fillIntensity
    groundMaterial.color.set(preset.groundTint)
    renderer.toneMappingExposure = preset.exposure
  }
  applyStyle('mono')

  return { grid, sun, sunTarget, hemi, fill, groundMaterial, applyStyle, update }
}
