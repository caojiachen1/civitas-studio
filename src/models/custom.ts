import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js'
import type { CustomAsset } from '../editor/types'

const templates = new Map<string, THREE.Group>()
const failed = new Set<string>()

function normalizeTemplate(root: THREE.Object3D): THREE.Group {
  const group = new THREE.Group()
  const cloned = cloneSkeleton(root)
  group.add(cloned)
  group.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(cloned)
  if (!box.isEmpty()) {
    const center = box.getCenter(new THREE.Vector3())
    cloned.position.x -= center.x
    cloned.position.z -= center.z
    cloned.position.y -= box.min.y
  }
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return group
}

function dataUrlToBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export async function loadCustomAsset(asset: CustomAsset): Promise<THREE.Group | null> {
  const cached = templates.get(asset.id)
  if (cached) return cached
  if (failed.has(asset.id)) return null
  try {
    const loader = new GLTFLoader()
    const buffer = dataUrlToBuffer(asset.dataUrl)
    const gltf = await loader.parseAsync(buffer, '')
    const template = normalizeTemplate(gltf.scene)
    templates.set(asset.id, template)
    return template
  } catch (error) {
    console.error('Failed to load imported model', asset.name, error)
    failed.add(asset.id)
    return null
  }
}

export function getCustomTemplate(id: string): THREE.Group | null {
  return templates.get(id) ?? null
}

export function createCustomInstance(id: string): THREE.Group | null {
  const template = templates.get(id)
  if (!template) return null
  const group = new THREE.Group()
  group.add(cloneSkeleton(template))
  return group
}

export function clearCustomTemplates() {
  templates.clear()
  failed.clear()
}

export async function hydrateCustomAssets(assets: CustomAsset[]): Promise<void> {
  await Promise.all(assets.map((asset) => loadCustomAsset(asset)))
}

export function primitiveAssetFromScene(
  scene: THREE.Object3D,
  dataUrl: string,
): { dataUrl: string; footprint: [number, number]; height: number } {
  const box = new THREE.Box3().setFromObject(scene)
  const size = box.getSize(new THREE.Vector3())
  return {
    dataUrl,
    footprint: [Math.max(0.3, size.x), Math.max(0.3, size.z)],
    height: Math.max(0.2, size.y),
  }
}
