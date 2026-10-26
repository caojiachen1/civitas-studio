import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { ModelDef, Part, PartOptions, SurfaceKind, Vec2 } from '../editor/types'

export const C = {
  oak: '#b48a5a',
  walnut: '#6f4e36',
  birch: '#d9c4a5',
  white: '#eeeae2',
  cream: '#e3d8c4',
  ink: '#30343a',
  graphite: '#555b60',
  stone: '#9d9c94',
  concrete: '#b5b3ac',
  brass: '#b78b4c',
  steel: '#9aa3a8',
  blackMetal: '#2c3033',
  glass: '#a8c5cb',
  water: '#4f93a4',
  leaf: '#6f8e5e',
  leafDeep: '#4c6d45',
  leafLight: '#91a86e',
  soil: '#7b654c',
  clay: '#b97b60',
  terracotta: '#b86e4f',
  linen: '#ded4c5',
  sand: '#cbbb9d',
  blush: '#c9a099',
  sage: '#8fa087',
  navy: '#465160',
  leather: '#7f5b43',
  red: '#a64f42',
} as const

export const box = (
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
): Part => ({ shape: 'box', size: [w, h, d], pos: [x, y, z], color, opts })

export const rbox = (
  w: number,
  h: number,
  d: number,
  radius: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
): Part => ({ shape: 'rbox', size: [w, h, d], radius, pos: [x, y, z], color, opts })

export const cyl = (
  rTop: number,
  rBottom: number,
  h: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
  seg = 16,
): Part => ({ shape: 'cyl', rTop, rBottom, h, seg, pos: [x, y, z], color, opts })

export const sphere = (
  r: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
  seg = 16,
): Part => ({ shape: 'sphere', r, seg, pos: [x, y, z], color, opts })

export const ico = (
  r: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
  detail = 1,
): Part => ({ shape: 'ico', r, detail, pos: [x, y, z], color, opts })

export const cone = (
  r: number,
  h: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
  seg = 12,
): Part => ({ shape: 'cone', r1: r, r2: 0, h, seg, pos: [x, y, z], color, opts })

export const torus = (
  r: number,
  tube: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
  seg = 20,
): Part => ({ shape: 'torus', r, tube, seg, pos: [x, y, z], color, opts })

export const prism = (
  points: Vec2[],
  depth: number,
  x: number,
  y: number,
  z: number,
  color: string,
  opts?: PartOptions,
): Part => ({ shape: 'prism', points, depth, pos: [x, y, z], color, opts })

export function defineModel(def: ModelDef): ModelDef {
  return def
}

const MATERIAL_CACHE = new Map<string, THREE.Material>()

function surfaceParams(surface: SurfaceKind) {
  switch (surface) {
    case 'fabric':
      return { roughness: 0.96, metalness: 0 }
    case 'leather':
      return { roughness: 0.62, metalness: 0 }
    case 'wood':
      return { roughness: 0.58, metalness: 0 }
    case 'metal':
      return { roughness: 0.3, metalness: 0.82 }
    case 'glass':
      return { roughness: 0.08, metalness: 0.05 }
    case 'ceramic':
      return { roughness: 0.16, metalness: 0.02 }
    case 'stone':
      return { roughness: 0.84, metalness: 0 }
    case 'foliage':
      return { roughness: 0.88, metalness: 0 }
    case 'gloss':
      return { roughness: 0.22, metalness: 0.08 }
    default:
      return { roughness: 0.82, metalness: 0 }
  }
}

export function getSurfaceMaterial(
  surface: SurfaceKind,
  color: string,
  opacity = 1,
  side: 'front' | 'back' | 'double' = 'front',
): THREE.Material {
  const key = `${surface}|${color}|${opacity}|${side}`
  const cached = MATERIAL_CACHE.get(key)
  if (cached) return cached
  const params = surfaceParams(surface)
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: params.roughness,
    metalness: params.metalness,
    transparent: opacity < 1 || surface === 'glass',
    opacity: surface === 'glass' ? Math.min(opacity, 0.34) : opacity,
    side:
      side === 'double' ? THREE.DoubleSide : side === 'back' ? THREE.BackSide : THREE.FrontSide,
    depthWrite: surface !== 'glass' && opacity >= 1,
  })
  if (surface === 'emissive') {
    material.emissive = new THREE.Color(color)
    material.emissiveIntensity = 1.15
    material.roughness = 0.35
  }
  material.name = key
  MATERIAL_CACHE.set(key, material)
  return material
}

export function getPlainMaterial(color: string, opts?: { roughness?: number; metalness?: number; opacity?: number }) {
  const key = `plain|${color}|${opts?.roughness ?? 0.8}|${opts?.metalness ?? 0}|${opts?.opacity ?? 1}`
  const cached = MATERIAL_CACHE.get(key)
  if (cached) return cached as THREE.MeshStandardMaterial
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: opts?.roughness ?? 0.8,
    metalness: opts?.metalness ?? 0,
    transparent: (opts?.opacity ?? 1) < 1,
    opacity: opts?.opacity ?? 1,
  })
  MATERIAL_CACHE.set(key, mat)
  return mat
}

function partGeometry(part: Part): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry
  switch (part.shape) {
    case 'box':
      geo = new THREE.BoxGeometry(part.size[0], part.size[1], part.size[2])
      break
    case 'rbox': {
      const r = Math.min(part.radius, part.size[0] / 2.01, part.size[1] / 2.01, part.size[2] / 2.01)
      geo = new RoundedBoxGeometry(part.size[0], part.size[1], part.size[2], 2, Math.max(0.004, r))
      break
    }
    case 'cyl':
      geo = new THREE.CylinderGeometry(part.rTop, part.rBottom, part.h, part.seg, 1)
      break
    case 'sphere':
      geo = new THREE.SphereGeometry(part.r, part.seg, Math.max(6, Math.floor(part.seg * 0.65)))
      break
    case 'ico':
      geo = new THREE.IcosahedronGeometry(part.r, part.detail)
      break
    case 'cone':
      geo = new THREE.CylinderGeometry(part.r2, part.r1, part.h, part.seg, 1)
      break
    case 'torus':
      geo = new THREE.TorusGeometry(part.r, part.tube, 8, part.seg)
      break
    case 'prism': {
      const shape = new THREE.Shape()
      part.points.forEach((p, i) => (i === 0 ? shape.moveTo(p[0], p[1]) : shape.lineTo(p[0], p[1])))
      shape.closePath()
      const ext = new THREE.ExtrudeGeometry(shape, {
        depth: part.depth,
        bevelEnabled: false,
        curveSegments: 6,
      })
      ext.translate(0, 0, -part.depth / 2)
      geo = ext
      break
    }
  }
  const opts = part.opts
  if (opts?.rot) {
    const e = new THREE.Euler(opts.rot[0], opts.rot[1], opts.rot[2], 'XYZ')
    geo.applyQuaternion(new THREE.Quaternion().setFromEuler(e))
  }
  geo.translate(part.pos[0], part.pos[1], part.pos[2])
  geo.deleteAttribute('uv')
  geo.computeVertexNormals()
  return geo
}

function normalizeForMerge(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  let result = geo
  if (result.index) {
    result = result.toNonIndexed()
    geo.dispose()
  }
  if (!result.getAttribute('normal')) result.computeVertexNormals()
  for (const name of Object.keys(result.attributes)) {
    if (!['position', 'normal'].includes(name)) result.deleteAttribute(name)
  }
  result.morphAttributes = {}
  return result
}

interface TemplatePart {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  castsShadow: boolean
}

interface MergeBucket {
  category: 'opaque' | 'translucent' | 'emissive'
  side: 'front' | 'back' | 'double'
  opacity: number
  color: string
  geos: THREE.BufferGeometry[]
}

function pbrValues(surface: SurfaceKind): { roughness: number; metalness: number } {
  return surfaceParams(surface)
}

const PBR_VERTEX_CACHE_KEY = 'civitas-pbr-vertex-v1'

function patchVertexPbr(material: THREE.MeshStandardMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `attribute float aRoughness;
attribute float aMetalness;
varying float vRoughness;
varying float vMetalness;
${shader.vertexShader.replace(
  '#include <begin_vertex>',
  `#include <begin_vertex>
  vRoughness = aRoughness;
  vMetalness = aMetalness;`,
)}`
    shader.fragmentShader = `varying float vRoughness;
varying float vMetalness;
${shader.fragmentShader
  .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vRoughness;')
  .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vMetalness;')}`
  }
  material.customProgramCacheKey = () => PBR_VERTEX_CACHE_KEY
  return material
}

const OPAQUE_FRONT = patchVertexPbr(
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 1, envMapIntensity: 0.75 }),
)
const OPAQUE_DOUBLE = patchVertexPbr(
  new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 1,
    side: THREE.DoubleSide,
    envMapIntensity: 0.75,
  }),
)
const translucentMaterials = new Map<number, THREE.MeshStandardMaterial>()
const emissiveMaterials = new Map<string, THREE.MeshStandardMaterial>()

function translucentMaterial(opacity: number): THREE.MeshStandardMaterial {
  const key = Math.round(opacity * 100) / 100
  const cached = translucentMaterials.get(key)
  if (cached) return cached
  const material = patchVertexPbr(
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 1,
      transparent: true,
      opacity: key,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 0.9,
    }),
  )
  translucentMaterials.set(key, material)
  return material
}

function emissiveMaterial(color: string): THREE.MeshStandardMaterial {
  const cached = emissiveMaterials.get(color)
  if (cached) return cached
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 1.15,
    roughness: 0.35,
    metalness: 0,
  })
  emissiveMaterials.set(color, material)
  return material
}

function materialForBucket(bucket: MergeBucket): { material: THREE.Material; castsShadow: boolean } {
  if (bucket.category === 'emissive') return { material: emissiveMaterial(bucket.color), castsShadow: false }
  if (bucket.category === 'translucent') return { material: translucentMaterial(bucket.opacity), castsShadow: false }
  return {
    material: bucket.side === 'front' ? OPAQUE_FRONT : OPAQUE_DOUBLE,
    castsShadow: true,
  }
}

function addVertexSurfaceAttributes(
  geo: THREE.BufferGeometry,
  color: string,
  roughness: number,
  metalness: number,
) {
  const count = geo.getAttribute('position').count
  const linear = new THREE.Color(color)
  const colors = new Float32Array(count * 3)
  const rough = new Float32Array(count)
  const metal = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    colors[i * 3] = linear.r
    colors[i * 3 + 1] = linear.g
    colors[i * 3 + 2] = linear.b
    rough[i] = roughness
    metal[i] = metalness
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('aRoughness', new THREE.BufferAttribute(rough, 1))
  geo.setAttribute('aMetalness', new THREE.BufferAttribute(metal, 1))
}

const templateCache = new Map<string, TemplatePart[]>()

export function buildModelTemplate(def: ModelDef): TemplatePart[] {
  const cached = templateCache.get(def.id)
  if (cached) return cached
  const buckets = new Map<string, MergeBucket>()
  for (const part of def.parts) {
    const surface: SurfaceKind = part.opts?.mat ?? 'matte'
    const explicitOpacity = part.opts?.opacity ?? (surface === 'glass' ? 0.34 : 1)
    const opacity = surface === 'glass' ? Math.min(explicitOpacity, 0.34) : explicitOpacity
    const side = part.opts?.side ?? 'front'
    const category: MergeBucket['category'] =
      surface === 'emissive' ? 'emissive' : surface === 'glass' || opacity < 0.99 ? 'translucent' : 'opaque'
    const key =
      category === 'emissive'
        ? `emissive|${part.color}`
        : category === 'translucent'
          ? `translucent|${opacity.toFixed(2)}`
          : `opaque|${side}`
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = {
        category,
        side,
        opacity,
        color: part.color,
        geos: [],
      }
      buckets.set(key, bucket)
    }
    const pbr = pbrValues(surface)
    const geo = normalizeForMerge(partGeometry(part))
    addVertexSurfaceAttributes(geo, part.color, pbr.roughness, pbr.metalness)
    bucket.geos.push(geo)
  }
  const parts: TemplatePart[] = []
  for (const bucket of buckets.values()) {
    const merged = bucket.geos.length === 1 ? bucket.geos[0] : mergeGeometries(bucket.geos, false)
    if (!merged) {
      console.warn(`[kit] Failed to merge geometry bucket for model "${def.id}"`)
      bucket.geos.forEach((g) => g.dispose())
      continue
    }
    merged.computeBoundingSphere()
    const info = materialForBucket(bucket)
    parts.push({ geometry: merged, material: info.material, castsShadow: info.castsShadow })
    if (bucket.geos.length > 1) bucket.geos.forEach((g) => g.dispose())
  }
  templateCache.set(def.id, parts)
  return parts
}

export function createModelObject(def: ModelDef): THREE.Group {
  const group = new THREE.Group()
  group.name = def.name
  const parts = buildModelTemplate(def)
  for (const part of parts) {
    const mesh = new THREE.Mesh(part.geometry, part.material)
    mesh.castShadow = def.shadow !== false && part.castsShadow
    mesh.receiveShadow = true
    group.add(mesh)
  }
  group.userData.footprint = def.footprint
  group.userData.height = def.height
  return group
}

export function disposeModelCache() {
  for (const parts of templateCache.values()) {
    for (const part of parts) part.geometry.dispose()
  }
  templateCache.clear()
  for (const material of MATERIAL_CACHE.values()) material.dispose()
  MATERIAL_CACHE.clear()
  OPAQUE_FRONT.dispose()
  OPAQUE_DOUBLE.dispose()
  for (const material of translucentMaterials.values()) material.dispose()
  translucentMaterials.clear()
  for (const material of emissiveMaterials.values()) material.dispose()
  emissiveMaterials.clear()
}
