import * as THREE from 'three'
import type { SlabEntity, SlabStyle } from '../types'
import { SLAB_STYLES } from '../types'

const topMaterials = new Map<SlabStyle, THREE.MeshStandardMaterial>()

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function makeTexture(style: SlabStyle): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = seededRandom(style === 'wood' ? 11 : style === 'oak' ? 23 : style === 'tile' ? 31 : style === 'stone' ? 47 : style === 'deck' ? 59 : 71)
  if (style === 'wood' || style === 'oak' || style === 'deck') {
    const base = style === 'wood' ? '#c3a077' : style === 'oak' ? '#a07850' : '#8f7355'
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    const plank = style === 'deck' ? 128 : 84
    for (let x = 0; x < size; x += plank) {
      const shade = (rand() - 0.5) * 22
      ctx.fillStyle = `rgba(${shade > 0 ? 255 : 40},${shade > 0 ? 240 : 30},${shade > 0 ? 220 : 20},${Math.abs(shade) / 160})`
      ctx.fillRect(x, 0, plank, size)
      ctx.fillStyle = 'rgba(52,36,24,0.28)'
      ctx.fillRect(x, 0, 4, size)
      if (style === 'deck') ctx.fillRect(x + plank - 6, 0, 6, size)
      for (let i = 0; i < 22; i++) {
        ctx.strokeStyle = `rgba(72,46,28,${0.04 + rand() * 0.07})`
        ctx.lineWidth = 0.8 + rand()
        ctx.beginPath()
        const gx = x + 4 + rand() * (plank - 8)
        ctx.moveTo(gx, 0)
        ctx.bezierCurveTo(gx + rand() * 8 - 4, size * 0.33, gx + rand() * 8 - 4, size * 0.66, gx + rand() * 4, size)
        ctx.stroke()
      }
      for (let y = 0; y < size; y += 256 + Math.floor(rand() * 180)) {
        ctx.fillStyle = 'rgba(50,34,22,0.25)'
        ctx.fillRect(x, y, plank, 4)
      }
    }
  } else if (style === 'tile') {
    ctx.fillStyle = '#d8d4ca'
    ctx.fillRect(0, 0, size, size)
    const tile = 256
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const v = Math.floor(rand() * 12)
        ctx.fillStyle = `rgb(${210 + v},${205 + v},${195 + v})`
        ctx.fillRect(x + 5, y + 5, tile - 10, tile - 10)
      }
    }
    ctx.strokeStyle = 'rgba(140,134,122,0.55)'
    ctx.lineWidth = 8
    for (let i = 0; i <= size; i += tile) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(size, i)
      ctx.stroke()
    }
  } else if (style === 'stone') {
    ctx.fillStyle = '#9f9b8e'
    ctx.fillRect(0, 0, size, size)
    const rows = 5
    for (let row = 0; row < rows; row++) {
      let x = 0
      const h = size / rows
      while (x < size) {
        const w = 160 + rand() * 200
        const v = Math.floor(rand() * 24) - 12
        ctx.fillStyle = `rgb(${160 + v},${155 + v},${145 + v})`
        ctx.fillRect(x + 5, row * h + 5, Math.min(w, size - x) - 10, h - 10)
        x += w
      }
    }
  } else {
    ctx.fillStyle = '#b8b5ac'
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 88000; i++) {
      const v = Math.floor(rand() * 40) - 20
      ctx.fillStyle = `rgba(${128 + v},${128 + v},${124 + v},0.22)`
      ctx.fillRect(rand() * size, rand() * size, 1 + rand() * 3, 1 + rand() * 3)
    }
    ctx.strokeStyle = 'rgba(105,104,98,0.3)'
    ctx.lineWidth = 2
    for (let i = 0; i < 9; i++) {
      ctx.beginPath()
      ctx.moveTo(rand() * size, rand() * size)
      ctx.lineTo(rand() * size, rand() * size)
      ctx.stroke()
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  return texture
}

function getTopMaterial(style: SlabStyle): THREE.MeshStandardMaterial {
  const existing = topMaterials.get(style)
  if (existing) return existing
  const def = SLAB_STYLES.find((s) => s.id === style) ?? SLAB_STYLES[0]
  const mat = new THREE.MeshStandardMaterial({
    map: makeTexture(style),
    color: '#ffffff',
    roughness: def.roughness,
    metalness: 0,
  })
  topMaterials.set(style, mat)
  return mat
}

function topPlane(w: number, d: number, tile: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(w, d, 1, 1)
  geo.rotateX(-Math.PI / 2)
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * d) / tile)
  }
  uv.needsUpdate = true
  return geo
}

export function buildSlab(entity: SlabEntity, elevation: number): THREE.Group {
  const def = SLAB_STYLES.find((s) => s.id === entity.style) ?? SLAB_STYLES[0]
  const group = new THREE.Group()
  group.position.set(entity.x, elevation, entity.z)
  group.rotation.y = entity.rot
  group.userData.entityId = entity.id

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(entity.w, entity.thickness, entity.d),
    new THREE.MeshStandardMaterial({ color: def.color, roughness: def.roughness + 0.05 }),
  )
  body.position.y = -entity.thickness / 2
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  const tile = entity.style === 'tile' ? 4 : entity.style === 'wood' || entity.style === 'oak' ? 2.2 : entity.style === 'deck' ? 2.4 : 3.5
  const top = new THREE.Mesh(topPlane(entity.w, entity.d, tile), getTopMaterial(entity.style))
  top.position.y = 0.002
  top.receiveShadow = true
  top.userData.surface = 'floor-top'
  group.add(top)

  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(entity.w + 0.02, 0.035, entity.d + 0.02),
    new THREE.MeshStandardMaterial({ color: def.color, roughness: def.roughness }),
  )
  edge.position.y = -0.018
  edge.receiveShadow = true
  group.add(edge)
  return group
}
