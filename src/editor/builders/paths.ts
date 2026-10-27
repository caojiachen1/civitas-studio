import * as THREE from 'three'
import { GeometryCollector, solidRibbonGeometry, stripGeometry } from '../collector'
import { getPathBundle, type PathSample } from '../geom'
import { getPlainMaterial, getSurfaceMaterial } from '../../models/kit'
import type { PathEntity, Vec2 } from '../types'

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
const sidewalkMat = texturedGroundMaterial(sidewalkTextures, 0.92, 0.02, '#c6c0b2')
const curbMat = getPlainMaterial('#a6a094', { roughness: 0.88 })
const lineWhite = getPlainMaterial('#e7e0d0', { roughness: 0.72 })
const lineYellow = getPlainMaterial('#cdb87c', { roughness: 0.72 })
const riverbed = getPlainMaterial('#716553', { roughness: 0.98 })
const bankEarth = getPlainMaterial('#97866b', { roughness: 0.95 })
const bankGrass = getPlainMaterial('#8f9d75', { roughness: 0.96 })
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
      void main() {
        vec3 p = position;
        float wave = sin(p.x * 0.55 + uTime * 0.9) * 0.025 + sin(p.z * 0.82 - uTime * 1.2) * 0.018;
        p.y += wave * uWave;
        vec4 world = modelMatrix * vec4(p, 1.0);
        vWorld = world.xyz;
        vNormalW = normalize(vec3(sin(p.x * 0.9 + uTime * 0.6) * 0.1, 1.0, cos(p.z * 0.8 - uTime * 0.8) * 0.1));
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
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormalW), 0.0), 2.2);
        float ripple = sin(vWorld.x * 1.4 + vWorld.z * 0.6 + uTime * 1.4) * 0.5 + 0.5;
        float ripple2 = sin(vWorld.z * 2.1 - vWorld.x * 0.45 - uTime * 1.05) * 0.5 + 0.5;
        vec3 color = mix(uDeep, uShallow, 0.42 + ripple * 0.22 + ripple2 * 0.16);
        float band = smoothstep(0.82, 1.0, sin(vWorld.z * 1.05 + sin(vWorld.x * 0.32 + uTime * 0.35) * 1.4 + uTime * 0.75) * 0.5 + 0.5);
        color += vec3(band * 0.035);
        color = mix(color, uSky, fresnel * 0.55);
        float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
        color = mix(color, uFogColor, fogFactor);
        gl_FragColor = vec4(color, 0.9);
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

function addDashes(
  col: GeometryCollector,
  samples: PathSample[],
  offset: number,
  material: THREE.Material,
  dash = 2.8,
  gap = 4.2,
  width = 0.12,
  y = 0.012,
) {
  if (samples.length < 2) return
  const total = samples[samples.length - 1].distance
  for (let start = 0.8; start < total - 0.5; start += dash + gap) {
    const end = Math.min(total, start + dash)
    for (let i = 0; i < samples.length - 1; i++) {
      const a = samples[i]
      const b = samples[i + 1]
      const segStart = Math.max(start, a.distance)
      const segEnd = Math.min(end, b.distance)
      if (segEnd <= segStart) continue
      const t1 = (segStart - a.distance) / Math.max(0.0001, b.distance - a.distance)
      const t2 = (segEnd - a.distance) / Math.max(0.0001, b.distance - a.distance)
      const p1 = a.pos.clone().lerp(b.pos, t1)
      const p2 = a.pos.clone().lerp(b.pos, t2)
      const s1 = a.side.clone().lerp(b.side, t1).normalize()
      const s2 = a.side.clone().lerp(b.side, t2).normalize()
      const pts = [
        { pos: p1, side: s1 },
        { pos: p2, side: s2 },
      ]
      col.add(stripGeometry(pts, offset - width / 2, offset + width / 2, y), material)
    }
  }
}

function addContinuousLine(col: GeometryCollector, samples: PathSample[], offset: number, width: number, y: number, material: THREE.Material) {
  col.add(stripGeometry(samples, offset - width / 2, offset + width / 2, y), material)
}

function addRoadTop(col: GeometryCollector, entity: PathEntity, halfWidth: number, y: number) {
  const { samples } = getPathBundle(entity)
  col.add(stripGeometry(samples, -halfWidth, halfWidth, y), asphalt)
  if (entity.lanes >= 4) {
    addContinuousLine(col, samples, -0.1, 0.07, y + 0.004, lineYellow)
    addContinuousLine(col, samples, 0.1, 0.07, y + 0.004, lineYellow)
    addDashes(col, samples, -halfWidth / 2, lineWhite, 3, 4.5, 0.12, y + 0.004)
    addDashes(col, samples, halfWidth / 2, lineWhite, 3, 4.5, 0.12, y + 0.004)
  } else {
    addDashes(col, samples, 0, lineWhite, 3, 4.5, 0.12, y + 0.004)
  }
  addContinuousLine(col, samples, -halfWidth + 0.2, 0.11, y + 0.004, lineWhite)
  addContinuousLine(col, samples, halfWidth - 0.2, 0.11, y + 0.004, lineWhite)
}

function addRoadside(col: GeometryCollector, entity: PathEntity, halfWidth: number) {
  const { samples } = getPathBundle(entity)
  const sw = 1.4
  if (entity.sidewalk) {
    col.add(stripGeometry(samples, -(halfWidth + sw), halfWidth + sw, 0.012), sidewalkMat)
    col.add(stripGeometry(samples, -halfWidth, halfWidth, 0.038), asphalt)
    col.add(
      solidRibbonGeometry(samples, halfWidth, halfWidth + sw, 0.1, 0.1),
      sidewalkMat,
    )
    col.add(
      solidRibbonGeometry(samples, -halfWidth - sw, -halfWidth, 0.1, 0.1),
      sidewalkMat,
    )
    col.add(stripGeometry(samples, halfWidth + sw - 0.03, halfWidth + sw + 0.12, 0.105), curbMat)
    col.add(stripGeometry(samples, -halfWidth - sw - 0.12, -halfWidth - sw + 0.03, 0.105), curbMat)
  } else {
    col.add(stripGeometry(samples, -halfWidth - 0.45, halfWidth + 0.45, 0.028), bankEarth)
    col.add(stripGeometry(samples, -halfWidth, halfWidth, 0.038), asphalt)
  }
  addRoadTop(col, entity, halfWidth, 0.052)
}

function addFootpath(col: GeometryCollector, entity: PathEntity) {
  const { samples } = getPathBundle(entity)
  const half = entity.width / 2
  const base = entity.style === 'gravel' ? pathGravel : pathStone
  col.add(stripGeometry(samples, -half - 0.2, half + 0.2, 0.02), pathEdge)
  col.add(stripGeometry(samples, -half, half, 0.055), base)
  col.add(stripGeometry(samples, -half + 0.03, -half + 0.09, 0.06), pathEdge)
  col.add(stripGeometry(samples, half - 0.09, half - 0.03, 0.06), pathEdge)
}

function deterministic(index: number, salt = 0): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function polygonGeometry(points: Vec2[], yOffset: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  points.forEach((point, index) => {
    if (index === 0) shape.moveTo(point[0], -point[1])
    else shape.lineTo(point[0], -point[1])
  })
  shape.closePath()
  const geometry = new THREE.ShapeGeometry(shape)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, yOffset, 0)
  geometry.computeVertexNormals()
  return geometry
}

function addPond(col: GeometryCollector, samples: PathSample[]) {
  const boundary2d: Vec2[] = samples.map((sample) => [sample.pos.x, sample.pos.z])
  if (boundary2d.length < 4) return
  let cx = 0
  let cz = 0
  for (const point of boundary2d) {
    cx += point[0]
    cz += point[1]
  }
  cx /= boundary2d.length
  cz /= boundary2d.length
  const expand = (extra: number): Vec2[] =>
    boundary2d.map((point) => {
      const dx = point[0] - cx
      const dz = point[1] - cz
      const length = Math.hypot(dx, dz) || 1
      return [point[0] + (dx / length) * extra, point[1] + (dz / length) * extra]
    })

  col.add(polygonGeometry(expand(2.6), 0.012), bankEarth)
  col.add(polygonGeometry(expand(1.2), 0.028), bankGrass)
  col.add(polygonGeometry(boundary2d, 0.085), pondWaterMaterial)

  for (let i = 4; i < boundary2d.length - 2; i += 9) {
    const point = boundary2d[i]
    const dx = point[0] - cx
    const dz = point[1] - cz
    const length = Math.hypot(dx, dz) || 1
    const offset = 0.7 + deterministic(i, 1) * 0.9
    const x = point[0] + (dx / length) * offset
    const z = point[1] + (dz / length) * offset
    col.addBox(
      0.35 + deterministic(i, 2) * 0.45,
      0.14 + deterministic(i, 3) * 0.16,
      0.3 + deterministic(i, 4) * 0.35,
      x,
      0.1,
      z,
      bankEarth,
      deterministic(i, 5) * Math.PI,
    )
  }
}

function addRiver(col: GeometryCollector, entity: PathEntity) {
  const { samples } = getPathBundle(entity)
  if (entity.closed) {
    addPond(col, samples)
    return
  }
  const half = entity.width / 2
  col.add(stripGeometry(samples, -half - 3.2, half + 3.2, 0.012), bankEarth)
  col.add(stripGeometry(samples, -half - 2.4, -half - 0.3, 0.028), bankGrass)
  col.add(stripGeometry(samples, half + 0.3, half + 2.4, 0.028), bankGrass)
  col.add(stripGeometry(samples, -half - 0.5, half + 0.5, 0.006), riverbed)
  col.add(stripGeometry(samples, -half, half, 0.085), waterMaterial)
  for (let i = 3; i < samples.length - 3; i += 7) {
    const s = samples[i]
    const scatter = i % 2 === 0 ? 1 : -1
    const x = s.pos.x + s.side.x * (half + 0.55 + deterministic(i, 2) * 0.35) * scatter
    const z = s.pos.z + s.side.z * (half + 0.55 + deterministic(i, 2) * 0.35) * scatter
    col.addBox(
      0.4 + deterministic(i, 3) * 0.45,
      0.18 + deterministic(i, 4) * 0.2,
      0.35 + deterministic(i, 5) * 0.4,
      x,
      0.12,
      z,
      bankEarth,
      deterministic(i, 6) * Math.PI,
    )
  }
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
    col.add(stripGeometry(samples, half + 0.15, deckHalf - 0.1, 0.045), sidewalkMat)
    col.add(stripGeometry(samples, -deckHalf + 0.1, -half - 0.15, 0.045), sidewalkMat)
  }
  addDashes(col, samples, 0, lineWhite, 3, 4.5, 0.12, 0.043)
  addContinuousLine(col, samples, -half + 0.2, 0.11, 0.043, lineWhite)
  addContinuousLine(col, samples, half - 0.2, 0.11, 0.043, lineWhite)

  if (entity.railings) {
    for (const sideSign of [-1, 1]) {
      const offset = sideSign * (deckHalf - 0.12)
      for (let i = 0; i < samples.length; i += 5) {
        const s = samples[i]
        const x = s.pos.x + s.side.x * offset
        const z = s.pos.z + s.side.z * offset
        col.addBox(0.09, 1.08, 0.09, x, s.pos.y + 0.54, z, bridgeMetal, Math.atan2(-s.flatTangent.z, s.flatTangent.x))
        col.addBox(0.11, 0.05, 0.11, x, s.pos.y + 1.09, z, bridgeMetal)
      }
      for (const railY of [0.55, 1.02]) {
        for (let i = 0; i < samples.length - 1; i += 2) {
          const a = samples[i]
          const b = samples[Math.min(samples.length - 1, i + 2)]
          const ax = a.pos.x + a.side.x * offset
          const az = a.pos.z + a.side.z * offset
          const bx = b.pos.x + b.side.x * offset
          const bz = b.pos.z + b.side.z * offset
          col.addBeam(
            new THREE.Vector3(ax, a.pos.y + railY, az),
            new THREE.Vector3(bx, b.pos.y + railY, bz),
            0.06,
            0.075,
            bridgeMetal,
          )
        }
      }
    }
  }

  for (let i = 8; i < samples.length - 8; i += 16) {
    const s = samples[i]
    const height = s.pos.y + elevation
    if (height < 0.9) continue
    col.addBox(0.65, height, 0.65, s.pos.x, height / 2, s.pos.z, bridgeConcrete, Math.atan2(-s.flatTangent.z, s.flatTangent.x))
    col.addBox(1.0, 0.16, 1.0, s.pos.x, height - 0.1, s.pos.z, bridgeConcrete)
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
  const { samples } = getPathBundle(entity)
  let count = 0
  for (let i = 8; i < samples.length - 8; i += 16) {
    if (samples[i].pos.y > 0.9) count++
  }
  return count
}
