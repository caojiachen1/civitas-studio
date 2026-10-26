import * as THREE from 'three'
import { clamp } from './geom'
import type { ViewState } from './types'

export class CameraRig {
  camera: THREE.PerspectiveCamera
  dom: HTMLCanvasElement
  enabled = true
  onRightClick: (() => void) | null = null
  target = new THREE.Vector3(0, 0.5, 0)
  distance = 30
  azimuth = Math.PI * 0.24
  polar = 1.02

  private pointerId: number | null = null
  private mode: 'orbit' | 'pan' | null = null
  private lastX = 0
  private lastY = 0
  private moved = 0
  private keys = new Set<string>()
  private rightTap: { pointerId: number; lastX: number; lastY: number; moved: number } | null = null

  constructor(camera: THREE.PerspectiveCamera, dom: HTMLCanvasElement) {
    this.camera = camera
    this.dom = dom
    dom.addEventListener('pointerdown', this.onPointerDown)
    dom.addEventListener('wheel', this.onWheel, { passive: false })
    dom.addEventListener('contextmenu', this.onContextMenu)
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    this.apply()
  }

  private isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName.toLowerCase()
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable
  }

  private onContextMenu = (event: MouseEvent) => event.preventDefault()

  private onPointerDown = (event: PointerEvent) => {
    if (!this.enabled) return
    if (event.button === 2 && !event.altKey) {
      event.preventDefault()
      this.rightTap = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY, moved: 0 }
      return
    }
    const isOrbit = event.button === 2 && event.altKey
    const isPan = event.button === 1 || (event.button === 0 && event.altKey)
    if (!isOrbit && !isPan) return
    event.preventDefault()
    this.pointerId = event.pointerId
    this.mode = isOrbit ? 'orbit' : 'pan'
    this.lastX = event.clientX
    this.lastY = event.clientY
    this.moved = 0
  }

  private onPointerMove = (event: PointerEvent) => {
    if (!this.enabled) return
    if (this.rightTap && this.rightTap.pointerId === event.pointerId) {
      this.rightTap.moved += Math.abs(event.clientX - this.rightTap.lastX) + Math.abs(event.clientY - this.rightTap.lastY)
      this.rightTap.lastX = event.clientX
      this.rightTap.lastY = event.clientY
      return
    }
    if (this.pointerId !== event.pointerId || !this.mode) return
    const dx = event.clientX - this.lastX
    const dy = event.clientY - this.lastY
    this.lastX = event.clientX
    this.lastY = event.clientY
    this.moved += Math.abs(dx) + Math.abs(dy)
    if (this.mode === 'orbit') {
      this.azimuth -= dx * 0.0062
      this.polar = clamp(this.polar - dy * 0.0052, 0.16, 1.47)
    } else {
      const scale = this.distance * 0.0017
      const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0)
      right.y = 0
      right.normalize()
      const forward = new THREE.Vector3()
      this.camera.getWorldDirection(forward)
      forward.y = 0
      if (forward.lengthSq() < 1e-5) forward.set(0, 0, -1)
      forward.normalize()
      this.target.addScaledVector(right, -dx * scale)
      this.target.addScaledVector(forward, dy * scale)
      this.clampTarget()
    }
    this.apply()
  }

  private onPointerUp = (event: PointerEvent) => {
    if (this.rightTap && this.rightTap.pointerId === event.pointerId) {
      if (this.rightTap.moved < 5) this.onRightClick?.()
      this.rightTap = null
      return
    }
    if (this.pointerId !== event.pointerId) return
    this.pointerId = null
    this.mode = null
  }

  private onWheel = (event: WheelEvent) => {
    if (!this.enabled) return
    event.preventDefault()
    const delta = Math.sign(event.deltaY) * Math.min(120, Math.abs(event.deltaY))
    this.distance = clamp(this.distance * (1 + delta * 0.0012), 1.6, 220)
    this.apply()
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.isTypingTarget(event.target)) return
    const key = event.key.toLowerCase()
    if (key === 'shift') this.keys.add('shift')
    if (['w', 'a', 's', 'd'].includes(key)) {
      this.keys.add(key)
      event.preventDefault()
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    if (key === 'shift') this.keys.delete('shift')
    else this.keys.delete(key)
  }

  private clampTarget() {
    const r = Math.hypot(this.target.x, this.target.z)
    if (r > 300) {
      this.target.x = (this.target.x / r) * 300
      this.target.z = (this.target.z / r) * 300
    }
  }

  update(dt: number) {
    if (this.keys.size > 0) {
      const speed = this.distance * 0.8 * dt * (this.keys.has('shift') ? 2.2 : 1)
      const forward = new THREE.Vector3()
      this.camera.getWorldDirection(forward)
      forward.y = 0
      if (forward.lengthSq() < 1e-5) forward.set(0, 0, -1)
      forward.normalize()
      const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0)
      right.y = 0
      right.normalize()
      if (this.keys.has('w')) this.target.addScaledVector(forward, speed)
      if (this.keys.has('s')) this.target.addScaledVector(forward, -speed)
      if (this.keys.has('a')) this.target.addScaledVector(right, -speed)
      if (this.keys.has('d')) this.target.addScaledVector(right, speed)
      this.clampTarget()
      this.apply()
    }
  }

  apply() {
    const sinP = Math.sin(this.polar)
    this.camera.position.set(
      this.target.x + this.distance * sinP * Math.sin(this.azimuth),
      this.target.y + this.distance * Math.cos(this.polar),
      this.target.z + this.distance * sinP * Math.cos(this.azimuth),
    )
    this.camera.lookAt(this.target)
    this.camera.updateMatrixWorld()
  }

  getView(): ViewState {
    return {
      target: [this.target.x, this.target.y, this.target.z],
      distance: this.distance,
      azimuth: this.azimuth,
      polar: this.polar,
    }
  }

  setView(view: ViewState) {
    this.target.set(view.target[0], view.target[1], view.target[2])
    this.distance = clamp(view.distance, 1.6, 220)
    this.azimuth = view.azimuth
    this.polar = clamp(view.polar, 0.16, 1.47)
    this.apply()
  }

  focusBox(box: THREE.Box3) {
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    this.target.copy(center)
    this.distance = clamp(Math.max(3.2, size.length() * 1.25) / Math.tan((this.camera.fov * Math.PI) / 360), 2.4, 90)
    this.apply()
  }

  dispose() {
    this.dom.removeEventListener('pointerdown', this.onPointerDown)
    this.dom.removeEventListener('wheel', this.onWheel)
    this.dom.removeEventListener('contextmenu', this.onContextMenu)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
