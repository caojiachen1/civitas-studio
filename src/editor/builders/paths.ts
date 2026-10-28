import * as THREE from 'three'
import { GeometryCollector, solidRibbonGeometry, stripGeometry } from '../collector'
import { getPathBundle, type PathSample } from '../geom'
import { getPlainMaterial, getSurfaceMaterial } from '../../models/kit'
import type { PathEntity } from '../types'
import {
  addBridgeDeckDetails,
  addBridgeRailing,
  addCarriagewayMarkings,
  addFootpathDetails,
  addPondShoreDetails,
  addRiverBankDetails,
  addRoadEdgeDetails,
  addSidewalkDetails,
  bridgePierPoints,
  pondWaterGeometry,
  waterRibbonGeometry,
  type CarriagewaySpec,
  type PathDetailMaterials,
} from './roadDetails'

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function asphaltTextures(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 512
  const color = document.createElement('canvas')
  color.width = size
  color.height = size
  const ctx = color.getContext('2d')!
  const rand = seeded(9731)
  ctx.fillStyle = '#4c5052'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 16000; i++) {
    const v = Math.floor(rand() * 34) - 17
    ctx.fillStyle = `rgba(${72 + v},${77 + v},${80 + v},${0.2 + rand() * 0.3})`
    ctx.fillRect(rand() * size, rand() * size, 1 + rand() * 2.4, 1 + rand() * 2.4)
  }
  for (let i = 0; i < 70; i++) {
    ctx.strokeStyle = `rgba(36,40,42,${0.12 + rand() * 0.18})`
    ctx.lineWidth = 0.8 + rand() * 1.6
    ctx.beginPath()
    let x = rand() * size
    let y = rand() * size
    ctx.moveTo(x, y)
    for (let k = 0; k < 4; k++) {
      x += (rand() - 0.5) * 40
      y += (rand() - 0.5) * 40
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = `rgba(58,62,64,${0.1 + rand() * 0.12})`
    ctx.beginPath()
    ctx.ellipse(rand() * size, rand() * size, 18 + rand() * 46, 8 + rand() * 22, rand() * 3.14, 0, Math.PI * 2)
    ctx.fill()
  }
  const bump = document.createElement('canvas')
  bump.width = size
  bump.height = size
  const bctx = bump.getContext('2d')!
  bctx.fillStyle = '#808080'
  bctx.fillRect(0, 0, size, size)
  const brand = seeded(3117)
  for (let i = 0; i < 12000; i++) {
    const v = Math.floor(brand() * 90) + 35
    bctx.fillStyle = `rgba(${v},${v},${v},${0.25 + brand() * 0.35})`
    bctx.fillRect(brand() * size, brand() * size, 1 + brand() * 3, 1 + brand() * 3)
  }
  const colorTexture = new THREE.CanvasTexture(color)
  const bumpTexture = new THREE.CanvasTexture(bump)
  for (const texture of [colorTexture, bumpTexture]) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.25, 0.25)
    texture.anisotropy = 16
  }
  colorTexture.colorSpace = THREE.SRGBColorSpace
  return { color: colorTexture, bump: bumpTexture }
}

function sidewalkTextures(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 512
  const color = document.createElement('canvas')
  color.width = size
  color.height = size
  const ctx = color.getContext('2d')!
  const rand = seeded(4519)
  ctx.fillStyle = '#c6c0b2'
  ctx.fillRect(0, 0, size, size)
  const tile = size / 4
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const v = Math.floor(rand() * 14) - 7
      ctx.fillStyle = `rgb(${198 + v},${192 + v},${178 + v})`
      ctx.fillRect(x * tile + 3, y * tile + 3, tile - 6, tile - 6)
      for (let i = 0; i < 90; i++) {
        const s = Math.floor(rand() * 16) - 8
        ctx.fillStyle = `rgba(${190 + s},${184 + s},${170 + s},0.25)`
        ctx.fillRect(x * tile + rand() * tile, y * tile + rand() * tile, 1.5, 1.5)
      }
    }
  }
  ctx.strokeStyle = 'rgba(120,114,102,0.5)'
  ctx.lineWidth = 4
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath()
    ctx.moveTo(i * tile, 0)
    ctx.lineTo(i * tile, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * tile)
    ctx.lineTo(size, i * tile)
    ctx.stroke()
  }
  const bump = document.createElement('canvas')
  bump.width = size
  bump.height = size
  const bctx = bump.getContext('2d')!
  bctx.fillStyle = '#a0a0a0'
  bctx.fillRect(0, 0, size, size)
  bctx.strokeStyle = '#303030'
  bctx.lineWidth = 5
  for (let i = 0; i <= 4; i++) {
    bctx.beginPath()
    bctx.moveTo(i * tile, 0)
    bctx.lineTo(i * tile, size)
    bctx.stroke()
    bctx.beginPath()
    bctx.moveTo(0, i * tile)
    bctx.lineTo(size, i * tile)
    bctx.stroke()
  }
  const colorTexture = new THREE.CanvasTexture(color)
  const bumpTexture = new THREE.CanvasTexture(bump)
  for (const texture of [colorTexture, bumpTexture]) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 0.5)
    texture.anisotropy = 16
  }
  colorTexture.colorSpace = THREE.SRGBColorSpace
  return { color: colorTexture, bump: bumpTexture }
}

function cobbleTextures(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 512
  const color = document.createElement('canvas')
  color.width = size
  color.height = size
  const ctx = color.getContext('2d')!
  const bump = document.createElement('canvas')
  bump.width = size
  bump.height = size
  const bctx = bump.getContext('2d')!
  const rand = seeded(6301)
  ctx.fillStyle = '#6b665c'
  ctx.fillRect(0, 0, size, size)
  bctx.fillStyle = '#3c3c3c'
  bctx.fillRect(0, 0, size, size)
  const rows = 7
  const cell = size / rows
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : cell / 2
    for (let col = -1; col <= rows; col++) {
      const cx = col * cell + cell / 2 + offset + (rand() - 0.5) * 5
      const cy = row * cell + cell / 2 + (rand() - 0.5) * 5
      const rx = cell * (0.36 + rand() * 0.08)
      const ry = cell * (0.31 + rand() * 0.07)
      const tone = 126 + Math.floor(rand() * 30)
      ctx.fillStyle = `rgb(${tone},${tone - 4},${tone - 10})`
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(58,54,48,0.45)'
      ctx.lineWidth = 2
      ctx.stroke()
      const bumpTone = 168 + Math.floor(rand() * 58)
      bctx.fillStyle = `rgb(${bumpTone},${bumpTone},${bumpTone})`
      bctx.beginPath()
      bctx.ellipse(cx, cy, rx * 0.9, ry * 0.9, 0, 0, Math.PI * 2)
      bctx.fill()
    }
  }
  for (let i = 0; i < 2600; i++) {
    const v = Math.floor(rand() * 26) - 13
    ctx.fillStyle = `rgba(${122 + v},${116 + v},${104 + v},0.24)`
    ctx.fillRect(rand() * size, rand() * size, 1.5, 1.5)
  }
  const colorTexture = new THREE.CanvasTexture(color)
  const bumpTexture = new THREE.CanvasTexture(bump)
  for (const texture of [colorTexture, bumpTexture]) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.34, 0.34)
    texture.anisotropy = 16
  }
  colorTexture.colorSpace = THREE.SRGBColorSpace
  return { color: colorTexture, bump: bumpTexture }
}

function curbTextures(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 128
  const color = document.createElement('canvas')
  color.width = size
  color.height = size
  const ctx = color.getContext('2d')!
  const rand = seeded(2207)
  ctx.fillStyle = '#a8a193'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 1200; i++) {
    const v = Math.floor(rand() * 22) - 11
    ctx.fillStyle = `rgba(${168 + v},${161 + v},${147 + v},${0.2 + rand() * 0.3})`
    ctx.fillRect(rand() * size, rand() * size, 1 + rand() * 2.4, 1 + rand() * 2.4)
  }
  ctx.fillStyle = 'rgba(76,72,64,0.7)'
  ctx.fillRect(0, 0, size, 3)
  ctx.fillStyle = 'rgba(216,210,196,0.45)'
  ctx.fillRect(0, 3, size, 2)
  const bump = document.createElement('canvas')
  bump.width = size
  bump.height = size
  const bctx = bump.getContext('2d')!
  bctx.fillStyle = '#9a9a9a'
  bctx.fillRect(0, 0, size, size)
  const brand = seeded(8821)
  for (let i = 0; i < 900; i++) {
    const v = Math.floor(brand() * 60) + 110
    bctx.fillStyle = `rgba(${v},${v},${v},0.4)`
    bctx.fillRect(brand() * size, brand() * size, 1.5, 1.5)
  }
  bctx.fillStyle = '#3a3a3a'
  bctx.fillRect(0, 0, size, 3)
  const colorTexture = new THREE.CanvasTexture(color)
  const bumpTexture = new THREE.CanvasTexture(bump)
  for (const texture of [colorTexture, bumpTexture]) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // One paving joint every 2 m along the path (strip UV v is metric).
    texture.repeat.set(2, 0.5)
    texture.anisotropy = 16
  }
  colorTexture.colorSpace = THREE.SRGBColorSpace
  return { color: colorTexture, bump: bumpTexture }
}

function tactileTextures(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 128
  const color = document.createElement('canvas')
  color.width = size
  color.height = size
  const ctx = color.getContext('2d')!
  const bump = document.createElement('canvas')
  bump.width = size
  bump.height = size
  const bctx = bump.getContext('2d')!
  ctx.fillStyle = '#c49a45'
  ctx.fillRect(0, 0, size, size)
  bctx.fillStyle = '#585858'
  bctx.fillRect(0, 0, size, size)
  const cells = 4
  const step = size / cells
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const cx = x * step + step / 2
      const cy = y * step + step / 2
      ctx.fillStyle = 'rgba(146,106,40,0.5)'
      ctx.beginPath()
      ctx.ellipse(cx, cy + 2, step * 0.25, step * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#d6b061'
      ctx.beginPath()
      ctx.ellipse(cx, cy, step * 0.26, step * 0.21, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(240,212,146,0.5)'
      ctx.beginPath()
      ctx.ellipse(cx - 1, cy - 1, step * 0.2, step * 0.14, 0, 0, Math.PI * 2)
      ctx.fill()
      bctx.fillStyle = '#e4e4e4'
      bctx.beginPath()
      bctx.ellipse(cx, cy, step * 0.26, step * 0.21, 0, 0, Math.PI * 2)
      bctx.fill()
    }
  }
  const colorTexture = new THREE.CanvasTexture(color)
  const bumpTexture = new THREE.CanvasTexture(bump)
  for (const texture of [colorTexture, bumpTexture]) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // 0.3 m tactile tiles from the metric strip UVs.
    texture.repeat.set(3.3, 3.3)
    texture.anisotropy = 16
  }
  colorTexture.colorSpace = THREE.SRGBColorSpace
  return { color: colorTexture, bump: bumpTexture }
}

function texturedGroundMaterial(
  maker: () => { color: THREE.CanvasTexture; bump: THREE.CanvasTexture },
  roughness: number,
  bumpScale: number,
  fallback: string,
): THREE.Material {
  if (typeof document === 'undefined') return getPlainMaterial(fallback, { roughness })
  const { color, bump } = maker()
  return new THREE.MeshStandardMaterial({
    map: color,
    bumpMap: bump,
    bumpScale,
    roughness,
    metalness: 0,
  })
}

const asphalt = texturedGroundMaterial(asphaltTextures, 0.95, 0.035, '#4c5052')
const cobble = texturedGroundMaterial(cobbleTextures, 0.94, 0.055, '#8a8376')
const sidewalkMat = texturedGroundMaterial(sidewalkTextures, 0.92, 0.02, '#c6c0b2')
const curbMat = texturedGroundMaterial(curbTextures, 0.9, 0.025, '#a6a094')
const tactileMat = texturedGroundMaterial(tactileTextures, 0.84, 0.02, '#c49a45')
const lineWhite = getPlainMaterial('#e7e0d0', { roughness: 0.72 })
const lineYellow = getPlainMaterial('#cdb87c', { roughness: 0.72 })
const gutterMat = getPlainMaterial('#7c7870', { roughness: 0.94 })
const drainMat = getPlainMaterial('#3b3f3e', { roughness: 0.66, metalness: 0.25 })
const studMat = getSurfaceMaterial('emissive', '#e8dcb4')
const markerMat = getSurfaceMaterial('emissive', '#e0a848')
const soilMat = getPlainMaterial('#5c4e3c', { roughness: 1 })
const riverbed = getPlainMaterial('#716553', { roughness: 0.98 })
const bankEarth = getPlainMaterial('#97866b', { roughness: 0.95 })
const bankGrass = getPlainMaterial('#8f9d75', { roughness: 0.96 })
const bankMud = getPlainMaterial('#6b5d48', { roughness: 0.98 })
const bankSand = getPlainMaterial('#b3a486', { roughness: 0.97 })
const rockMat = getPlainMaterial('#8a867b', { roughness: 0.92 })
const pathStone = getPlainMaterial('#c5b9a5', { roughness: 0.9 })
const pathGravel = getPlainMaterial('#b7a78d', { roughness: 0.98 })
const pathEdge = getPlainMaterial('#9b8e79', { roughness: 0.9 })
const bridgeConcrete = getPlainMaterial('#b4b0a5', { roughness: 0.84 })
const bridgeMetal = getSurfaceMaterial('metal', '#4e5559')
const woodFence = getSurfaceMaterial('wood', '#8c6b4f')
const metalFence = getSurfaceMaterial('metal', '#3b4144')
const hedgeMat = getSurfaceMaterial('foliage', '#658052')
const hedgeTop = getSurfaceMaterial('foliage', '#789263')
const stoneFence = getPlainMaterial('#a29b8c', { roughness: 0.9 })
const stoneCap = getPlainMaterial('#beb6a5', { roughness: 0.82 })

const detailMaterials: PathDetailMaterials = {
  curb: curbMat,
  lineWhite,
  lineYellow,
  gutter: gutterMat,
  tactile: tactileMat,
  soil: soilMat,
  drain: drainMat,
  metal: bridgeMetal,
  stud: studMat,
  riverbed,
  bankEarth,
  bankGrass,
  bankMud,
  bankSand,
  reed: hedgeMat,
  reedTop: hedgeTop,
  rock: rockMat,
  joint: drainMat,
  marker: markerMat,
  foliage: hedgeMat,
  trunk: woodFence,
}

export const waterMaterials: THREE.ShaderMaterial[] = []

function createWaterMaterial(waveScale = 1): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uShallow: { value: new THREE.Color('#6eaab2') },
      uDeep: { value: new THREE.Color('#3f7b8a') },
      uSky: { value: new THREE.Color('#777777') },
      uFogColor: { value: new THREE.Color('#202020') },
      uFogNear: { value: 65 },
      uFogFar: { value: 280 },
      uWave: { value: waveScale },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uWave;
      varying vec3 vWorld;
      varying vec3 vNormalW;
      varying float vFogDepth;
      varying vec2 vUv;
      void main() {
        vec3 p = position;
        float t = uTime;
        float w1 = sin(p.x * 0.55 + t * 0.9);
        float w2 = sin(p.z * 0.82 - t * 1.2);
        float w3 = sin((p.x + p.z) * 1.45 + t * 2.1);
        p.y += (w1 * 0.024 + w2 * 0.017 + w3 * 0.008) * uWave;
        vec3 n = normalize(vec3(
          (cos(p.x * 0.55 + t * 0.9) * 0.024 * 0.55 + cos((p.x + p.z) * 1.45 + t * 2.1) * 0.008 * 1.45) * uWave,
          1.0,
          (cos(p.z * 0.82 - t * 1.2) * 0.017 * 0.82 + cos((p.x + p.z) * 1.45 + t * 2.1) * 0.008 * 1.45) * uWave
        ));
        vec4 world = modelMatrix * vec4(p, 1.0);
        vWorld = world.xyz;
        vNormalW = normalize(mat3(modelMatrix) * n);
        vUv = uv;
        vec4 mv = viewMatrix * world;
        vFogDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uShallow;
      uniform vec3 uDeep;
      uniform vec3 uSky;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      varying vec3 vWorld;
      varying vec3 vNormalW;
      varying float vFogDepth;
      varying vec2 vUv;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float t = uTime;
        float shore = smoothstep(0.64, 0.99, abs(vUv.x));
        float flow = vUv.y;
        float r1 = sin(vWorld.x * 1.35 + vWorld.z * 0.55 + t * 1.35) * 0.5 + 0.5;
        float r2 = sin(vWorld.z * 2.05 - vWorld.x * 0.42 - t * 1.0) * 0.5 + 0.5;
        float r3 = sin((vWorld.x + vWorld.z) * 3.25 + flow * 0.75 - t * 2.15) * 0.5 + 0.5;
        float grain = sin(vWorld.x * 0.19 + 1.7) * sin(vWorld.z * 0.16 - 0.6);
        float depthMix = clamp(0.34 + grain * 0.16 + pow(shore, 1.6) * 0.46 + r3 * 0.05, 0.0, 1.0);
        vec3 color = mix(uDeep, uShallow, depthMix);
        color += vec3(0.010, 0.018, 0.016) * (r1 + r2);
        float band = smoothstep(0.84, 1.0, sin(vWorld.z * 1.05 + sin(vWorld.x * 0.32 + t * 0.35) * 1.4 + t * 0.7) * 0.5 + 0.5);
        color += vec3(band * 0.028);
        vec3 n = normalize(vNormalW);
        float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 2.4);
        color = mix(color, uSky, fresnel * 0.5);
        vec3 sunDir = normalize(vec3(-0.42, 0.7, 0.36));
        float spec = pow(max(dot(reflect(-sunDir, n), viewDir), 0.0), 56.0);
        color += vec3(0.68, 0.72, 0.66) * spec * (0.3 + 0.3 * r2);
        float foamWave = sin(flow * 2.7 - t * 1.45 + vWorld.x * 0.85) * 0.5 + 0.5;
        float foamNoise = sin(flow * 7.1 - t * 2.25 + vWorld.z * 1.25) * 0.5 + 0.5;
        float foam = smoothstep(0.52, 0.9, foamWave * 0.62 + foamNoise * 0.38 + shore * 0.3) * smoothstep(0.7, 0.98, abs(vUv.x));
        color = mix(color, vec3(0.82, 0.86, 0.84), foam * 0.7);
        float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
        color = mix(color, uFogColor, fogFactor);
        gl_FragColor = vec4(color, mix(0.9, 0.94, foam));
      }
    `,
  })
  waterMaterials.push(material)
  return material
}

const waterMaterial = createWaterMaterial(1)
const pondWaterMaterial = createWaterMaterial(0)

export function tickWater(time: number) {
  for (const material of waterMaterials) material.uniforms.uTime.value = time
}

function carriagewaySpec(entity: PathEntity): CarriagewaySpec {
  return {
    width: entity.width,
    lanes: entity.lanes,
    style: entity.style,
    closed: entity.closed,
    seed:
      (entity.points[0]?.[0] ?? 0) * 1.37 +
      (entity.points[0]?.[1] ?? 0) * 0.73 +
      entity.width * 0.41 +
      entity.points.length,
  }
}

/** Coarser sampling for plain vertical faces where sub-decimetre steps are wasted. */
function decimateSamples(samples: PathSample[], step: number): PathSample[] {
  if (samples.length < 3) return samples
  const result: PathSample[] = [samples[0]]
  let last = samples[0].distance
  for (const sample of samples) {
    if (sample.distance - last >= step) {
      result.push(sample)
      last = sample.distance
    }
  }
  const tail = samples[samples.length - 1]
  if (result[result.length - 1] !== tail) result.push(tail)
  return result
}

function addRoadside(col: GeometryCollector, entity: PathEntity, halfWidth: number) {
  const { samples } = getPathBundle(entity)
  const sw = 1.4
  const sidewalkTop = 0.14
  const surface = entity.style === 'stone' ? cobble : asphalt

  if (entity.sidewalk) {
    // Raised sidewalk slabs: sides use the jointed curb texture, the walking surface
    // keeps the metric strip UVs so the paving texture stays square.
    const slabSamples = decimateSamples(samples, 0.5)
    const capSamples = decimateSamples(samples, 0.9)
    col.add(solidRibbonGeometry(slabSamples, halfWidth, halfWidth + sw, sidewalkTop, sidewalkTop), curbMat)
    col.add(solidRibbonGeometry(slabSamples, -halfWidth - sw, -halfWidth, sidewalkTop, sidewalkTop), curbMat)
    col.add(stripGeometry(samples, halfWidth + 0.002, halfWidth + sw, sidewalkTop + 0.004), sidewalkMat)
    col.add(stripGeometry(samples, -halfWidth - sw, -halfWidth - 0.002, sidewalkTop + 0.004), sidewalkMat)
    // Inner curb stone band along the carriageway and outer curb lip.
    col.add(stripGeometry(capSamples, halfWidth - 0.02, halfWidth + 0.16, sidewalkTop + 0.008), curbMat)
    col.add(stripGeometry(capSamples, -halfWidth - 0.16, -halfWidth + 0.02, sidewalkTop + 0.008), curbMat)
    col.add(stripGeometry(capSamples, halfWidth + sw - 0.16, halfWidth + sw + 0.1, sidewalkTop + 0.0075), curbMat)
    col.add(stripGeometry(capSamples, -halfWidth - sw - 0.1, -halfWidth - sw + 0.16, sidewalkTop + 0.0075), curbMat)
  } else {
    // Gravel shoulder instead of a kerb, with a low stone edge along the asphalt.
    col.add(stripGeometry(samples, -halfWidth - 0.55, halfWidth + 0.55, 0.028), bankEarth)
    col.add(stripGeometry(samples, -halfWidth - 0.45, -halfWidth - 0.02, 0.034), bankSand)
    col.add(stripGeometry(samples, halfWidth + 0.02, halfWidth + 0.45, 0.034), bankSand)
    col.add(stripGeometry(samples, halfWidth, halfWidth + 0.14, 0.058), curbMat)
    col.add(stripGeometry(samples, -halfWidth - 0.14, -halfWidth, 0.058), curbMat)
  }

  col.add(stripGeometry(samples, -halfWidth, halfWidth, 0.052), surface)

  const spec = carriagewaySpec(entity)
  addCarriagewayMarkings(col, samples, spec, 0.052, detailMaterials)
  addRoadEdgeDetails(col, samples, spec, 0.052, detailMaterials)
  if (entity.sidewalk) addSidewalkDetails(col, samples, spec, halfWidth, sidewalkTop, detailMaterials)
}

function addFootpath(col: GeometryCollector, entity: PathEntity) {
  const { samples } = getPathBundle(entity)
  const half = entity.width / 2
  const base = entity.style === 'gravel' ? pathGravel : pathStone
  col.add(stripGeometry(samples, -half - 0.2, half + 0.2, 0.02), pathEdge)
  col.add(stripGeometry(samples, -half, half, 0.055), base)
  col.add(stripGeometry(samples, -half + 0.03, -half + 0.09, 0.06), pathEdge)
  col.add(stripGeometry(samples, half - 0.09, half - 0.03, 0.06), pathEdge)
  addFootpathDetails(col, samples, entity.width, entity.style, detailMaterials)
}

function addPond(col: GeometryCollector, samples: PathSample[]) {
  if (samples.length < 4) return
  addPondShoreDetails(col, samples, detailMaterials)
  col.add(pondWaterGeometry(samples, 0.085), pondWaterMaterial)
}

function addRiver(col: GeometryCollector, entity: PathEntity) {
  const { samples } = getPathBundle(entity)
  if (entity.closed) {
    addPond(col, samples)
    return
  }
  const half = entity.width / 2
  addRiverBankDetails(col, samples, entity.width, detailMaterials)
  col.add(stripGeometry(samples, -half - 0.4, half + 0.4, 0.006), riverbed)
  col.add(waterRibbonGeometry(samples, half, 0.085), waterMaterial)
}

function addBridge(col: GeometryCollector, entity: PathEntity, elevation: number) {
  const { samples } = getPathBundle(entity)
  const half = entity.width / 2
  const sw = entity.sidewalk ? 1.35 : 0.25
  const deckHalf = half + sw
  const deckThickness = 0.55
  col.add(solidRibbonGeometry(samples, -deckHalf, deckHalf, 0.02, deckThickness), bridgeConcrete)
  col.add(stripGeometry(samples, -half, half, 0.035), asphalt)
  if (entity.sidewalk) {
    col.add(stripGeometry(samples, half + 0.02, deckHalf - 0.02, 0.045), sidewalkMat)
    col.add(stripGeometry(samples, -deckHalf + 0.02, -half - 0.02, 0.045), sidewalkMat)
    col.add(stripGeometry(samples, half - 0.02, half + 0.12, 0.048), curbMat)
    col.add(stripGeometry(samples, -half - 0.12, -half + 0.02, 0.048), curbMat)
  }
  addCarriagewayMarkings(
    col,
    samples,
    { ...carriagewaySpec(entity), style: 'urban', crossings: false },
    0.035,
    detailMaterials,
  )
  if (entity.railings) addBridgeRailing(col, samples, deckHalf, detailMaterials)
  addBridgeDeckDetails(col, samples, { width: entity.width, sidewalk: entity.sidewalk }, detailMaterials)

  for (const point of bridgePierPoints(samples, elevation)) {
    const height = point.y + elevation
    col.addBox(0.6, height, 0.6, point.x, height / 2, point.z, bridgeConcrete)
    col.addBox(1.0, 0.16, 1.0, point.x, height - 0.1, point.z, bridgeConcrete)
  }
}

function addFence(col: GeometryCollector, entity: PathEntity) {
  const { samples } = getPathBundle(entity)
  const style = entity.style
  if (style === 'hedge') {
    col.add(solidRibbonGeometry(samples, -0.46, 0.46, 1.0, 1.0), hedgeMat)
    col.add(solidRibbonGeometry(samples, -0.38, 0.38, 1.14, 0.18), hedgeTop)
    return
  }
  if (style === 'stone') {
    col.add(solidRibbonGeometry(samples, -0.26, 0.26, 0.68, 0.68), stoneFence)
    col.add(stripGeometry(samples, -0.32, 0.32, 0.7), stoneCap)
    return
  }
  const isMetal = style === 'metal'
  const postMat = isMetal ? metalFence : woodFence
  const spacing = isMetal ? 2.6 : 2.3
  let nextPost = 0
  const postPoints: { pos: THREE.Vector3; tangent: THREE.Vector3 }[] = []
  for (const s of samples) {
    if (s.distance >= nextPost) {
      postPoints.push({ pos: s.pos.clone(), tangent: s.flatTangent.clone() })
      nextPost += spacing
    }
  }
  for (const p of postPoints) {
    const angle = Math.atan2(-p.tangent.z, p.tangent.x)
    if (isMetal) {
      col.addBox(0.07, 1.28, 0.07, p.pos.x, 0.64, p.pos.z, postMat, angle)
      col.addBox(0.1, 0.06, 0.1, p.pos.x, 1.3, p.pos.z, metalFence, angle)
    } else {
      col.addBox(0.12, 1.22, 0.12, p.pos.x, 0.61, p.pos.z, postMat, angle)
      col.addBox(0.15, 0.05, 0.15, p.pos.x, 1.24, p.pos.z, postMat, angle)
    }
  }
  for (let i = 0; i < postPoints.length - 1; i++) {
    const a = postPoints[i]
    const b = postPoints[i + 1]
    const heights = isMetal ? [0.35, 1.08] : [0.45, 0.98]
    for (const h of heights) {
      col.addBeam(
        new THREE.Vector3(a.pos.x, h, a.pos.z),
        new THREE.Vector3(b.pos.x, h, b.pos.z),
        isMetal ? 0.035 : 0.07,
        isMetal ? 0.05 : 0.1,
        postMat,
      )
    }
    if (isMetal) {
      const len = a.pos.distanceTo(b.pos)
      const count = Math.floor(len / 0.16)
      for (let k = 1; k < count; k++) {
        const t = k / count
        const x = a.pos.x + (b.pos.x - a.pos.x) * t
        const z = a.pos.z + (b.pos.z - a.pos.z) * t
        col.addBox(0.025, 0.92, 0.025, x, 0.58, z, postMat, Math.atan2(-(b.pos.z - a.pos.z), b.pos.x - a.pos.x))
      }
    }
  }
}

export function buildPath(entity: PathEntity, elevation: number): THREE.Group {
  const col = new GeometryCollector()
  const { samples } = getPathBundle(entity)
  if (entity.pathType === 'road') {
    addRoadside(col, entity, entity.width / 2)
  } else if (entity.pathType === 'footpath') {
    addFootpath(col, entity)
  } else if (entity.pathType === 'river') {
    addRiver(col, entity)
  } else if (entity.pathType === 'bridge') {
    addBridge(col, entity, elevation)
  } else if (entity.pathType === 'fence') {
    addFence(col, entity)
  }
  const group = col.build({ name: entity.pathType })
  group.position.y = elevation
  group.userData.entityId = entity.id
  group.userData.isPath = true
  group.userData.pathType = entity.pathType
  group.userData.samples = samples.length
  return group
}

export function countBridgePiers(entity: PathEntity): number {
  return bridgePierPoints(getPathBundle(entity).samples, 0).length
}
