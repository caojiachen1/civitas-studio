import * as THREE from 'three'

export const GHOST_VALID_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#e8e8e8',
  emissive: '#4a4a4a',
  emissiveIntensity: 0.32,
  transparent: true,
  opacity: 0.52,
  roughness: 0.45,
  metalness: 0,
  depthWrite: false,
  side: THREE.DoubleSide,
})

export const GHOST_INVALID_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#ff5a56',
  emissive: '#8c1e1c',
  emissiveIntensity: 0.45,
  transparent: true,
  opacity: 0.52,
  roughness: 0.5,
  metalness: 0,
  depthWrite: false,
  side: THREE.DoubleSide,
})

export const SELECTION_MATERIAL = new THREE.LineBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.95,
  depthTest: false,
})

export const HOVER_MATERIAL = new THREE.LineBasicMaterial({
  color: '#bdbdbd',
  transparent: true,
  opacity: 0.85,
  depthTest: false,
})

export function applyGhost(root: THREE.Object3D, valid: boolean) {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = valid ? GHOST_VALID_MATERIAL : GHOST_INVALID_MATERIAL
      child.castShadow = false
      child.receiveShadow = false
      child.renderOrder = 5
    }
  })
  return root
}

export function setRenderLayer(root: THREE.Object3D, layer: number) {
  root.traverse((child) => {
    child.layers.set(layer)
  })
}

export function disposeObject(root: THREE.Object3D) {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
    }
  })
  root.removeFromParent()
}
