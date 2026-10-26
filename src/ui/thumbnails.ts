import * as THREE from 'three'
import { createModelObject } from '../models/kit'
import { createCustomInstance } from '../models/custom'
import type { ModelDef } from '../editor/types'

type Callback = (url: string | null) => void

const cache = new Map<string, string>()
const queue: { key: string; build: () => THREE.Group | null; callback: Callback }[] = []
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let shadowPlane: THREE.Mesh | null = null
let pumping = false
let failed = false
let idleTimer = 0

const IDLE_DISPOSE_MS = 15000

function makeShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
  gradient.addColorStop(0, 'rgba(26,32,28,0.42)')
  gradient.addColorStop(0.55, 'rgba(26,32,28,0.16)')
  gradient.addColorStop(1, 'rgba(26,32,28,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function clearIdleTimer() {
  if (!idleTimer) return
  window.clearTimeout(idleTimer)
  idleTimer = 0
}

function disposeRenderer() {
  clearIdleTimer()
  if (!renderer) return
  renderer.dispose()
  renderer.forceContextLoss()
  if (shadowPlane) {
    const material = shadowPlane.material
    if (material instanceof THREE.MeshBasicMaterial) {
      material.map?.dispose()
      material.dispose()
    }
    shadowPlane.geometry.dispose()
  }
  renderer = null
  scene = null
  camera = null
  shadowPlane = null
}

function scheduleIdleDispose() {
  clearIdleTimer()
  idleTimer = window.setTimeout(() => {
    idleTimer = 0
    if (pumping || queue.length > 0) return
    disposeRenderer()
  }, IDLE_DISPOSE_MS)
}

function ensureRenderer(): boolean {
  if (failed) return false
  clearIdleTimer()
  if (renderer) return true
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 220
    canvas.height = 220
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(220, 220, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.16
    renderer.setClearColor(0x000000, 0)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(30, 1, 0.05, 200)
    const hemi = new THREE.HemisphereLight('#f2f6f3', '#7b8677', 1.9)
    scene.add(hemi)
    const key = new THREE.DirectionalLight('#fff2dc', 2.7)
    key.position.set(4, 7, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight('#dbe8ee', 1.1)
    fill.position.set(-5, 3, -3)
    scene.add(fill)
    shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: makeShadowTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0.8,
      }),
    )
    shadowPlane.rotation.x = -Math.PI / 2
    scene.add(shadowPlane)
    return true
  } catch (error) {
    console.warn('Thumbnail renderer unavailable', error)
    failed = true
    return false
  }
}

function renderThumbnail(group: THREE.Group | null): string | null {
  if (!group || !ensureRenderer() || !renderer || !scene || !camera || !shadowPlane) return null
  scene.add(group)
  group.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(group)
  scene.remove(group)
  if (box.isEmpty()) return null
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const radius = Math.max(0.2, size.length() * 0.5)
  const fov = (camera.fov * Math.PI) / 180
  const distance = (radius / Math.sin(fov / 2)) * 1.1
  const dir = new THREE.Vector3(1, 0.72, 1.22).normalize()
  camera.position.copy(center).addScaledVector(dir, distance)
  camera.lookAt(center)
  camera.near = Math.max(0.02, distance * 0.02)
  camera.far = distance * 8
  camera.updateProjectionMatrix()
  const planeSize = Math.max(size.x, size.z) * 1.9 + 0.6
  shadowPlane.scale.set(planeSize, planeSize, 1)
  shadowPlane.position.set(center.x, box.min.y - 0.002, center.z)
  scene.add(group)
  renderer.render(scene, camera)
  const url = renderer.domElement.toDataURL('image/png')
  scene.remove(group)
  shadowPlane.position.set(0, -999, 0)
  return url
}

function pump() {
  if (pumping) return
  pumping = true
  const step = () => {
    const item = queue.shift()
    if (!item) {
      pumping = false
      scheduleIdleDispose()
      return
    }
    if (!cache.has(item.key)) {
      const url = renderThumbnail(item.build())
      if (url) cache.set(item.key, url)
      item.callback(url)
    } else {
      item.callback(cache.get(item.key)!)
    }
    window.setTimeout(step, 24)
  }
  window.setTimeout(step, 0)
}

export function peekModelThumbnail(modelId: string): string | null {
  return cache.get(`model:${modelId}`) ?? null
}

export function requestModelThumbnail(model: ModelDef, callback: Callback) {
  const key = `model:${model.id}`
  const cached = cache.get(key)
  if (cached) {
    callback(cached)
    return
  }
  if (queue.some((item) => item.key === key)) return
  queue.push({ key, build: () => createModelObject(model), callback })
  pump()
}

export function requestCustomThumbnail(assetId: string, callback: Callback) {
  const key = `custom:${assetId}`
  const cached = cache.get(key)
  if (cached) {
    callback(cached)
    return
  }
  if (queue.some((item) => item.key === key)) return
  queue.push({ key, build: () => createCustomInstance(assetId), callback })
  pump()
}

export function peekCustomThumbnail(assetId: string): string | null {
  return cache.get(`custom:${assetId}`) ?? null
}
