import * as THREE from 'three'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { CameraRig } from './cameraRig'
import { setupEnvironment, type EnvironmentRig } from './environment'
import { useEditor, uid, type EditorState } from './store'
import { useRuntime } from './runtime'
import {
  DOOR_STYLES,
  WINDOW_STYLES,
  type EditorDocument,
  type Entity,
  type ModelDef,
  type ObjectEntity,
  type OpeningEntity,
  type PathEntity,
  type RoofEntity,
  type SlabEntity,
  type Vec2,
  type ViewState,
  type WallEntity,
  type RenderQuality,
} from './types'
import { buildWall } from './builders/walls'
import { buildPath, tickWater } from './builders/paths'
import { buildSlab } from './builders/slabs'
import { buildRoof } from './builders/roofs'
import { roomAtPoint } from './builders/rooms'
import { createModelObject } from '../models/kit'
import { getModel, getModelFootprints } from '../models/registry'
import { createCustomInstance, hydrateCustomAssets } from '../models/custom'
import {
  clamp,
  dist2,
  nearestPointOnWalls,
  snapAngle,
  snapValue,
} from './geom'
import {
  checkObjectPlacement,
  checkOpeningPlacement,
  checkPathPlacement,
  checkWallPlacement,
} from './validation'
import { applyGhost, GHOST_INVALID_MATERIAL, GHOST_VALID_MATERIAL } from './visuals'

interface EntityView {
  entity: Entity
  group: THREE.Group
  ownGeometry: boolean
}

interface HandleRef {
  handle: 'path-point' | 'wall-endpoint'
  entityId: string
  index?: number
  end?: 'a' | 'b'
}

interface WallDraft {
  points: Vec2[]
  createdIds: Set<string>
  historyStarted: boolean
}

interface SlabDrag {
  start: Vec2
  current: Vec2
}

interface WallRayHit {
  wall: WallEntity
  group: THREE.Group
  offset: number
  localY: number
  point: THREE.Vector3
}

interface ObjectPreview {
  modelId: string
  x: number
  z: number
  rot: number
  valid: boolean
  reason: string
}

interface OpeningPreview {
  wallId: string
  offset: number
  width: number
  height: number
  sill: number
  valid: boolean
  reason: string
}

type InteractionEvent = PointerEvent | MouseEvent

const SHARED_HANDLE_GEOMETRY = new THREE.IcosahedronGeometry(1, 1)
const HANDLE_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.98,
  depthTest: false,
})
const HANDLE_LINE_MATERIAL = new THREE.LineDashedMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.75,
  dashSize: 0.22,
  gapSize: 0.16,
  depthTest: false,
})
const SNAP_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.92,
  depthTest: false,
  side: THREE.DoubleSide,
})
const DRAFT_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#e8e8e8',
  transparent: true,
  opacity: 0.95,
  depthTest: false,
})
const PLACEHOLDER_GEOMETRY = new THREE.BoxGeometry(0.8, 0.8, 0.8)
const PLACEHOLDER_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#8d9697',
  transparent: true,
  opacity: 0.5,
  wireframe: true,
})

export class EditorScene {
  private container: HTMLElement
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private rig: CameraRig
  private env: EnvironmentRig
  private canvas: HTMLCanvasElement
  private state: EditorState
  private lastDoc: EditorDocument
  private viewMap = new Map<string, EntityView>()
  private world = new THREE.Group()
  private ghostGroup = new THREE.Group()
  private ghostKey = ''
  private ghostOwnGeometry = false
  private handleGroup = new THREE.Group()
  private draftGroup = new THREE.Group()
  private selectionBox = new THREE.Box3Helper(new THREE.Box3(), '#ffffff')
  private hoverBox = new THREE.Box3Helper(new THREE.Box3(), '#bdbdbd')
  private snapMarker = new THREE.Group()
  private transformControls: TransformControls
  private transformMode: 'translate' | 'rotate' = 'translate'
  private footprints = new Map<string, [number, number]>()
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private hasPointer = false
  private shiftDown = false
  private baseHint = ''
  private snapLabel = ''
  private invalidReason = ''
  private placementRotation = 0
  private wallDraft: WallDraft | null = null
  private pathDraft: Vec2[] | null = null
  private pathClosed = false
  private slabDrag: SlabDrag | null = null
  private handleDrag: { ref: HandleRef; original: Entity } | null = null
  private handleDragHistory = false
  private resizeObserver: ResizeObserver
  private lastFrameTime = performance.now()
  private animationFrame = 0
  private destroyed = false
  private unsubscribe: () => void
  private fpsFrames = 0
  private fpsElapsed = 0
  private lastCursorUpdate = 0
  private shadowTarget = new THREE.Vector3(999, 0, 999)
  private shadowDirty = true
  private tcHistoryPushed = false
  private tcMoved = false
  private tcEventsBound = false
  private tcCommitFrame = 0
  private tcPendingEntityId: string | null = null
  private customLoading = false
  private lastClient = { x: 0, y: 0 }
  private objectPreview: ObjectPreview | null = null
  private openingPreview: OpeningPreview | null = null
  private roofPreview: RoofEntity | null = null
  private activePointerId: number | null = null
  private effectiveQuality: Exclude<RenderQuality, 'auto'> = 'balanced'
  private appliedQuality: Exclude<RenderQuality, 'auto'> | null = null
  private qualityCooldownUntil = performance.now() + 2500
  private highFpsWindows = 0
  private pointerMoveFrame = 0
  private pendingPointerEvent: PointerEvent | null = null

  constructor(container: HTMLElement) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'scene-canvas'
    this.canvas.tabIndex = 0
    container.appendChild(this.canvas)
    this.state = useEditor.getState()
    this.lastDoc = this.state.doc

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.04
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.shadowMap.autoUpdate = false

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.45, 700)
    this.rig = new CameraRig(this.camera, this.canvas)
    this.rig.onRightClick = () => this.finishDraftFromRightClick()
    this.env = setupEnvironment(this.scene, this.renderer)

    this.world.name = 'world'
    this.scene.add(this.world)
    this.ghostGroup.name = 'ghost-layer'
    this.scene.add(this.ghostGroup)
    this.handleGroup.name = 'handles'
    this.scene.add(this.handleGroup)
    this.draftGroup.name = 'draft'
    this.scene.add(this.draftGroup)

    this.selectionBox.visible = false
    const selectionMaterial = this.selectionBox.material as THREE.LineBasicMaterial
    selectionMaterial.depthTest = false
    selectionMaterial.transparent = true
    this.selectionBox.renderOrder = 40
    this.scene.add(this.selectionBox)
    this.hoverBox.visible = false
    const hoverMaterial = this.hoverBox.material as THREE.LineBasicMaterial
    hoverMaterial.depthTest = false
    hoverMaterial.transparent = true
    this.hoverBox.renderOrder = 39
    this.scene.add(this.hoverBox)

    const ring = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.17, 32), SNAP_MATERIAL)
    ring.rotation.x = -Math.PI / 2
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), SNAP_MATERIAL)
    dot.rotation.x = -Math.PI / 2
    dot.position.y = 0.001
    this.snapMarker.add(ring, dot)
    this.snapMarker.visible = false
    this.snapMarker.renderOrder = 45
    this.scene.add(this.snapMarker)

    this.transformControls = new TransformControls(this.camera, this.canvas)
    this.transformControls.setSize(0.78)
    this.transformControls.setMode('translate')
    this.transformControls.showY = false
    this.transformControls.getHelper().visible = false
    this.scene.add(this.transformControls.getHelper())

    this.bindDomEvents()
    this.bindTransformControls()
    this.unsubscribe = useEditor.subscribe((state) => this.onStoreChange(state))
    this.refreshFootprints()
    this.syncDocument(true)
    this.applySettings()
    this.updateBaseHint()
    this.publishHint()

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)
    this.resize()
    this.ensureCustomAssets()
    this.animate()
  }

  private bindDomEvents() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown)
    this.canvas.addEventListener('pointermove', this.onPointerMove)
    this.canvas.addEventListener('pointerup', this.onPointerUp)
    this.canvas.addEventListener('pointerleave', this.onPointerLeave)
    this.canvas.addEventListener('dblclick', this.onDoubleClick)
    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault())
    window.addEventListener('keydown', this.onKeyDown)
  }

  private bindTransformControls() {
    if (this.tcEventsBound) return
    this.tcEventsBound = true
    this.transformControls.addEventListener('dragging-changed', (event) => {
      const dragging = Boolean((event as unknown as { value: boolean }).value)
      this.rig.enabled = !dragging
      if (!dragging) {
        window.requestAnimationFrame(() => this.refreshSelection())
      }
    })
    this.transformControls.addEventListener('mouseDown', () => {
      this.tcHistoryPushed = false
      this.tcMoved = false
      this.cancelTransformCommit()
    })
    this.transformControls.addEventListener('objectChange', () => {
      const entity = this.selectedEntity()
      const object = this.transformControls.object
      if (!entity || !object) return
      if (entity.kind === 'opening') return
      if (!this.tcHistoryPushed) {
        useEditor.getState().beginHistory('变换构件')
        this.tcHistoryPushed = true
      }
      this.tcMoved = true
      if (entity.kind === 'object' || entity.kind === 'slab') {
        object.position.y = this.levelElevation(entity.levelId)
      } else if (entity.kind === 'roof') {
        object.position.y = entity.eaveY
      }
      this.scheduleTransformCommit(entity.id)
      this.updateSelectionBox()
      this.markShadowDirty()
    })
    this.transformControls.addEventListener('mouseUp', () => {
      this.flushTransformCommit()
      this.finishTransformDrag()
    })
  }

  private scheduleTransformCommit(entityId: string) {
    this.tcPendingEntityId = entityId
    if (this.tcCommitFrame) return
    this.tcCommitFrame = window.requestAnimationFrame(() => {
      this.tcCommitFrame = 0
      this.commitTransformSample()
    })
  }

  private commitTransformSample() {
    const entity = this.selectedEntity()
    const object = this.transformControls.object
    const pendingId = this.tcPendingEntityId
    this.tcPendingEntityId = null
    if (!entity || !object || !pendingId || entity.id !== pendingId) return
    if (entity.kind === 'opening') return
    if (entity.kind === 'object' || entity.kind === 'slab') {
      object.position.y = this.levelElevation(entity.levelId)
    } else if (entity.kind === 'roof') {
      object.position.y = entity.eaveY
    } else {
      return
    }
    useEditor.getState().updateEntity(
      entity.id,
      {
        x: round3(object.position.x),
        z: round3(object.position.z),
        rot: roundTo(object.rotation.y, Math.PI / 12),
      },
      false,
    )
  }

  private cancelTransformCommit() {
    if (this.tcCommitFrame) {
      window.cancelAnimationFrame(this.tcCommitFrame)
      this.tcCommitFrame = 0
    }
    this.tcPendingEntityId = null
  }

  private flushTransformCommit() {
    if (this.tcCommitFrame) {
      window.cancelAnimationFrame(this.tcCommitFrame)
      this.tcCommitFrame = 0
    }
    this.commitTransformSample()
  }

  private finishTransformDrag() {
    if (!this.tcMoved) {
      return
    }
    const entity = this.selectedEntity()
    if (!entity) return
    let valid = true
    let reason = ''
    if (entity.kind === 'object') {
      const model = this.modelForEntity(entity)
      if (model) {
        const result = checkObjectPlacement(
          model,
          entity.x,
          entity.z,
          entity.rot,
          entity.scale,
          entity.levelId,
          Object.values(this.state.doc.entities),
          this.footprints,
          entity.id,
        )
        valid = result.valid
        reason = result.reason
      }
    }
    if (!valid) {
      useEditor.getState().undo()
      useRuntime.getState().toast(reason || '位置无效，已还原', 'warn')
    }
    this.tcMoved = false
    this.markShadowDirty()
    window.requestAnimationFrame(() => this.refreshSelection())
  }

  setTransformMode(mode: 'translate' | 'rotate') {
    this.transformMode = mode
    this.transformControls.setMode(mode)
    if (mode === 'rotate') {
      this.transformControls.showX = false
      this.transformControls.showY = true
      this.transformControls.showZ = false
    } else {
      this.transformControls.showX = true
      this.transformControls.showY = false
      this.transformControls.showZ = true
    }
    this.refreshSelection()
  }

  private onStoreChange(next: EditorState) {
    const prev = this.state
    this.state = next
    if (next.doc.customAssets !== prev.doc.customAssets) this.ensureCustomAssets()
    if (prev.tool !== next.tool) {
      this.cancelDrafts()
      this.placementRotation = 0
      this.clearGhost()
      this.applyCursor()
      this.refreshSelection()
    } else if (prev.activeModelId !== next.activeModelId) {
      this.clearGhost()
      this.placementRotation = 0
    }
    if (prev.doc.activeLevelId !== next.doc.activeLevelId) {
      this.cancelDrafts()
      this.clearGhost()
      this.applyVisibility()
    }
    if (prev.doc !== next.doc) {
      this.syncDocument()
      this.applyVisibility()
    }
    if (prev.selectedId !== next.selectedId || prev.tool !== next.tool || prev.doc !== next.doc) {
      this.refreshSelection()
    }
    if (prev.settings !== next.settings) this.applySettings()
    this.updateBaseHint()
    this.publishHint()
    if (this.wallDraft || this.pathDraft) this.refreshDraftMarkers()
    if (prev.toolOptions !== next.toolOptions && this.hasPointer && !this.handleDrag) {
      this.refreshPreviewFromLastPointer()
    }
  }

  private async ensureCustomAssets() {
    if (this.customLoading) return
    const assets = this.state.doc.customAssets
    if (assets.length === 0) {
      this.syncDocument(true)
      return
    }
    this.customLoading = true
    try {
      await hydrateCustomAssets(assets)
      if (this.destroyed) return
      this.syncDocument(true)
      this.refreshSelection()
    } finally {
      this.customLoading = false
    }
  }

  private refreshFootprints() {
    this.footprints = getModelFootprints()
    for (const asset of this.state.doc.customAssets) {
      this.footprints.set(asset.id, asset.footprint)
    }
  }

  private levelElevation(levelId: string): number {
    return this.state.doc.levels.find((level) => level.id === levelId)?.elevation ?? 0
  }

  private activeElevation(): number {
    return this.levelElevation(this.state.doc.activeLevelId)
  }

  private modelForEntity(entity: ObjectEntity): ModelDef | null {
    const builtin = getModel(entity.modelId)
    if (builtin) return builtin
    const asset = this.state.doc.customAssets.find((item) => item.id === entity.modelId)
    if (!asset) return null
    return {
      id: asset.id,
      name: asset.name,
      category: 'custom',
      footprint: asset.footprint,
      height: asset.height,
      placement: 'any',
      parts: [],
    }
  }

  private makeObjectGroup(entity: ObjectEntity): { group: THREE.Group; ownGeometry: boolean } {
    const builtin = getModel(entity.modelId)
    if (builtin) return { group: createModelObject(builtin), ownGeometry: false }
    const custom = createCustomInstance(entity.modelId)
    if (custom) return { group: custom, ownGeometry: false }
    const group = new THREE.Group()
    const placeholder = new THREE.Mesh(PLACEHOLDER_GEOMETRY, PLACEHOLDER_MATERIAL)
    placeholder.position.y = 0.4
    group.add(placeholder)
    return { group, ownGeometry: false }
  }

  private createView(entity: Entity, doc: EditorDocument): EntityView | null {
    if (entity.kind === 'opening') return null
    const elevation = doc.levels.find((level) => level.id === entity.levelId)?.elevation ?? 0
    let group: THREE.Group
    let ownGeometry = true
    if (entity.kind === 'wall') {
      const openings = Object.values(doc.entities).filter(
        (item): item is OpeningEntity => item.kind === 'opening' && item.wallId === entity.id,
      )
      group = buildWall(entity, openings, elevation)
    } else if (entity.kind === 'path') {
      group = buildPath(entity, elevation)
    } else if (entity.kind === 'slab') {
      group = buildSlab(entity, elevation)
    } else if (entity.kind === 'roof') {
      group = buildRoof(entity)
    } else if (entity.kind === 'object') {
      const created = this.makeObjectGroup(entity)
      group = created.group
      ownGeometry = created.ownGeometry
      group.position.set(entity.x, elevation, entity.z)
      group.rotation.y = entity.rot
      group.scale.setScalar(entity.scale)
    } else {
      return null
    }
    group.userData.entityId = entity.id
    group.userData.levelId = entity.levelId
    group.traverse((child) => {
      if (!child.userData.entityId) child.userData.entityId = entity.id
    })
    group.updateMatrixWorld(true)
    this.world.add(group)
    return { entity, group, ownGeometry }
  }

  private removeView(id: string) {
    const view = this.viewMap.get(id)
    if (!view) return
    if (this.transformControls.object === view.group) {
      this.transformControls.detach()
      this.transformControls.getHelper().visible = false
    }
    if (view.ownGeometry) {
      view.group.traverse((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose()
      })
    }
    view.group.removeFromParent()
    this.viewMap.delete(id)
  }

  private canFastApply(prev: Entity, next: Entity): boolean {
    if (prev.kind !== next.kind) return false
    if (next.kind === 'object' && prev.kind === 'object') {
      return prev.modelId === next.modelId && prev.levelId === next.levelId
    }
    if (next.kind === 'slab' && prev.kind === 'slab') {
      return (
        prev.levelId === next.levelId &&
        prev.w === next.w &&
        prev.d === next.d &&
        prev.thickness === next.thickness &&
        prev.style === next.style
      )
    }
    if (next.kind === 'roof' && prev.kind === 'roof') {
      return (
        prev.levelId === next.levelId &&
        prev.w === next.w &&
        prev.d === next.d &&
        prev.style === next.style &&
        prev.finish === next.finish &&
        prev.pitch === next.pitch &&
        prev.overhang === next.overhang
      )
    }
    return false
  }

  private applyFastTransform(view: EntityView, entity: Entity) {
    if (entity.kind === 'opening') return
    const elevation = this.levelElevation(entity.levelId)
    if (entity.kind === 'object' && view.entity.kind === 'object') {
      view.group.position.set(entity.x, elevation, entity.z)
      view.group.rotation.y = entity.rot
      view.group.scale.setScalar(entity.scale)
    } else if (entity.kind === 'slab') {
      view.group.position.set(entity.x, elevation, entity.z)
      view.group.rotation.y = entity.rot
    } else if (entity.kind === 'roof') {
      view.group.position.set(entity.x, entity.eaveY, entity.z)
      view.group.rotation.y = entity.rot
    }
    view.entity = entity
    view.group.updateMatrixWorld(true)
  }

  private syncDocument(force = false) {
    const doc = this.state.doc
    const prevDoc = this.lastDoc
    this.refreshFootprints()
    const levelsChanged = prevDoc.levels !== doc.levels
    const changedWalls = new Set<string>()
    if (prevDoc.entities !== doc.entities) {
      for (const [id, entity] of Object.entries(doc.entities)) {
        if (entity.kind === 'opening' && prevDoc.entities[id] !== entity) changedWalls.add(entity.wallId)
      }
      for (const [id, entity] of Object.entries(prevDoc.entities)) {
        if (entity.kind === 'opening' && doc.entities[id] !== entity) changedWalls.add(entity.wallId)
      }
    }
    const currentIds = new Set<string>()
    for (const [id, entity] of Object.entries(doc.entities)) {
      if (entity.kind === 'opening') continue
      currentIds.add(id)
      const existing = this.viewMap.get(id)
      const mustRebuild =
        force ||
        levelsChanged ||
        !existing ||
        existing.entity !== entity ||
        (entity.kind === 'wall' && changedWalls.has(id))
      if (existing && !mustRebuild) {
        if (existing.entity !== entity) {
          if (this.canFastApply(existing.entity, entity)) {
            this.applyFastTransform(existing, entity)
          } else {
            existing.entity = entity
          }
        }
        continue
      }
      if (existing && !force && !levelsChanged && existing.entity !== entity) {
        if (this.canFastApply(existing.entity, entity)) {
          this.applyFastTransform(existing, entity)
          continue
        }
      }
      if (existing) this.removeView(id)
      const view = this.createView(entity, doc)
      if (view) this.viewMap.set(id, view)
    }
    for (const id of [...this.viewMap.keys()]) {
      if (!currentIds.has(id)) this.removeView(id)
    }
    this.lastDoc = doc
    this.applyVisibility()
    this.refreshSelection()
    this.markShadowDirty()
  }

  private entityLevelId(entity: Entity): string {
    if (entity.kind === 'opening') {
      const wall = this.state.doc.entities[entity.wallId]
      return wall && wall.kind === 'wall' ? wall.levelId : this.state.doc.activeLevelId
    }
    return entity.levelId
  }

  private applyVisibility() {
    const state = this.state
    const active = state.doc.activeLevelId
    for (const view of this.viewMap.values()) {
      if (view.entity.kind === 'opening') continue
      const levelVisible = !state.settings.isolateLevel || view.entity.levelId === active
      const roofHidden = view.entity.kind === 'roof' && !state.settings.showRoofs
      view.group.visible = levelVisible && !roofHidden
    }
    if (state.selectedId) {
      const entity = state.doc.entities[state.selectedId]
      const visible = Boolean(
        entity &&
          (!state.settings.isolateLevel || this.entityLevelId(entity) === active) &&
          !(entity.kind === 'roof' && !state.settings.showRoofs) &&
          entity.kind !== 'path',
      )
      this.selectionBox.visible = Boolean(visible && this.selectionBox.box && !this.selectionBox.box.isEmpty())
      this.handleGroup.visible = Boolean(visible)
      if (!visible) {
        this.transformControls.detach()
        this.transformControls.getHelper().visible = false
      }
    }
  }

  private applySettings() {
    const settings = this.state.settings
    this.env.grid.visible = settings.showGrid
    const previousShadows = this.renderer.shadowMap.enabled
    this.renderer.shadowMap.enabled = settings.shadows
    this.env.sun.castShadow = settings.shadows
    this.transformControls.setTranslationSnap(settings.gridSnap ? 0.25 : null)
    this.transformControls.setRotationSnap(settings.angleSnap ? Math.PI / 12 : null)
    if (previousShadows !== settings.shadows) {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) material.needsUpdate = true
          })
        }
      })
    }
    this.syncQuality()
    this.applyVisibility()
    this.refreshSelection()
    this.markShadowDirty()
  }

  private syncQuality() {
    const requested = this.state.settings.quality
    const effective: Exclude<RenderQuality, 'auto'> =
      requested === 'auto'
        ? this.effectiveQuality
        : requested === 'high' || requested === 'low'
          ? requested
          : 'balanced'
    this.effectiveQuality = effective
    if (this.appliedQuality === effective) return
    this.appliedQuality = effective
    const pixelCaps = { high: 1.6, balanced: 1.15, low: 0.75 }
    const shadowSizes = { high: 2048, balanced: 1024, low: 512 }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelCaps[effective]))
    const sun = this.env.sun
    const shadowSize = shadowSizes[effective]
    if (sun.shadow.mapSize.x !== shadowSize) {
      sun.shadow.mapSize.set(shadowSize, shadowSize)
      sun.shadow.map?.dispose()
      sun.shadow.map = null
    }
    this.resize()
    this.markShadowDirty()
  }

  private updateAutoQuality(fps: number, now: number) {
    if (this.state.settings.quality !== 'auto') {
      this.highFpsWindows = 0
      return
    }
    if (now < this.qualityCooldownUntil) return
    if (fps < 36 && this.effectiveQuality !== 'low') {
      this.effectiveQuality = this.effectiveQuality === 'high' ? 'balanced' : 'low'
      this.highFpsWindows = 0
      this.qualityCooldownUntil = now + 5000
      this.appliedQuality = null
      this.syncQuality()
      return
    }
    if (fps < 52 && this.effectiveQuality === 'high') {
      this.effectiveQuality = 'balanced'
      this.highFpsWindows = 0
      this.qualityCooldownUntil = now + 5000
      this.appliedQuality = null
      this.syncQuality()
      return
    }
    if (fps > 72) this.highFpsWindows++
    else this.highFpsWindows = 0
    if (this.highFpsWindows >= 3 && this.effectiveQuality !== 'high') {
      this.effectiveQuality = this.effectiveQuality === 'low' ? 'balanced' : 'high'
      this.highFpsWindows = 0
      this.qualityCooldownUntil = now + 6000
      this.appliedQuality = null
      this.syncQuality()
    }
  }

  private refreshSelection() {
    if (this.destroyed) return
    if (this.transformControls.dragging) {
      this.updateSelectionBox()
      return
    }
    const entity = this.selectedEntity()
    this.clearHandleGroup()
    if (!entity) {
      this.selectionBox.visible = false
      this.transformControls.detach()
      this.transformControls.getHelper().visible = false
      return
    }
    const view =
      entity.kind === 'opening'
        ? this.viewMap.get(entity.wallId)
        : this.viewMap.get(entity.id)
    if (!view || !view.group.visible) {
      this.selectionBox.visible = false
      this.transformControls.detach()
      this.transformControls.getHelper().visible = false
      return
    }
    const box = this.selectionBoxFor(entity, view)
    if (!box || box.isEmpty()) {
      this.selectionBox.visible = false
      return
    }
    if (entity.kind === 'path') {
      this.selectionBox.visible = false
    } else {
      this.selectionBox.box.copy(box).expandByScalar(0.025)
      this.selectionBox.updateMatrixWorld(true)
      this.selectionBox.visible = true
    }

    if (entity.kind === 'wall') {
      this.addWallHandles(entity)
    } else if (entity.kind === 'path') {
      this.addPathHandles(entity)
    }

    const transformable = entity.kind === 'object' || entity.kind === 'slab' || entity.kind === 'roof'
    if (transformable && this.state.tool === 'select') {
      if (this.transformControls.object !== view.group) this.transformControls.attach(view.group)
      this.transformControls.setMode(this.transformMode)
      this.transformControls.getHelper().visible = true
      this.transformControls.getHelper().updateMatrixWorld(true)
    } else {
      this.transformControls.detach()
      this.transformControls.getHelper().visible = false
    }
  }

  private updateSelectionBox() {
    const entity = this.selectedEntity()
    if (!entity) return
    const view = this.viewMap.get(entity.id)
    if (!view) return
    const box = this.selectionBoxFor(entity, view)
    if (!box || box.isEmpty()) {
      this.selectionBox.visible = false
      return
    }
    this.selectionBox.box.copy(box).expandByScalar(0.025)
    this.selectionBox.updateMatrixWorld(true)
    this.selectionBox.visible = true
  }

  private selectionBoxFor(entity: Entity, view: EntityView): THREE.Box3 | null {
    if (entity.kind === 'opening') {
      const wall = this.state.doc.entities[entity.wallId]
      if (!wall || wall.kind !== 'wall') return null
      const wallView = this.viewMap.get(wall.id)
      if (!wallView) return null
      const thickness = wall.thickness / 2 + 0.04
      const box = new THREE.Box3()
      const points: THREE.Vector3[] = []
      for (const x of [entity.offset - entity.width / 2, entity.offset + entity.width / 2]) {
        for (const y of [entity.sill, entity.sill + entity.height]) {
          for (const z of [-thickness, thickness]) {
            points.push(wallView.group.localToWorld(new THREE.Vector3(x, y, z)))
          }
        }
      }
      box.setFromPoints(points)
      return box
    }
    return new THREE.Box3().setFromObject(view.group)
  }

  private clearHandleGroup() {
    this.handleGroup.traverse((child) => {
      if ((child instanceof THREE.Mesh || child instanceof THREE.Line) && child.userData.ownGeometry) {
        child.geometry.dispose()
      }
    })
    this.handleGroup.clear()
  }

  private handleScale(): number {
    return clamp(this.rig.distance * 0.0085, 0.1, 0.32)
  }

  private addHandle(position: THREE.Vector3, data: Record<string, unknown>) {
    const mesh = new THREE.Mesh(SHARED_HANDLE_GEOMETRY, HANDLE_MATERIAL)
    mesh.position.copy(position)
    mesh.scale.setScalar(this.handleScale())
    mesh.renderOrder = 30
    mesh.userData = { ...data }
    this.handleGroup.add(mesh)
  }

  private addWallHandles(wall: WallEntity) {
    const elevation = this.levelElevation(wall.levelId)
    this.addHandle(new THREE.Vector3(wall.a[0], elevation + 0.16, wall.a[1]), {
      handle: 'wall-endpoint',
      entityId: wall.id,
      end: 'a',
    })
    this.addHandle(new THREE.Vector3(wall.b[0], elevation + 0.16, wall.b[1]), {
      handle: 'wall-endpoint',
      entityId: wall.id,
      end: 'b',
    })
  }

  private addPathHandles(path: PathEntity) {
    const elevation = this.levelElevation(path.levelId)
    const linePoints = path.points.map((point) => new THREE.Vector3(point[0], elevation + 0.1, point[1]))
    for (let i = 0; i < linePoints.length; i++) {
      this.addHandle(linePoints[i].clone().setY(elevation + 0.16), {
        handle: 'path-point',
        entityId: path.id,
        index: i,
      })
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints)
    const line = new THREE.Line(geometry, HANDLE_LINE_MATERIAL)
    line.computeLineDistances()
    line.userData.ownGeometry = true
    line.renderOrder = 28
    this.handleGroup.add(line)
  }

  private selectedEntity(): Entity | null {
    const id = this.state.selectedId
    if (!id) return null
    return this.state.doc.entities[id] ?? null
  }

  private refreshDraftMarkers() {
    this.clearDraftGroup()
    const elevation = this.activeElevation()
    const scale = clamp(this.rig.distance * 0.007, 0.09, 0.26)
    if (this.wallDraft) {
      for (const point of this.wallDraft.points) {
        const marker = new THREE.Mesh(SHARED_HANDLE_GEOMETRY, DRAFT_MATERIAL)
        marker.position.set(point[0], elevation + 0.14, point[1])
        marker.scale.setScalar(scale)
        marker.renderOrder = 29
        this.draftGroup.add(marker)
      }
    }
    if (this.pathDraft) {
      const points = this.pathDraft.map((point) => new THREE.Vector3(point[0], elevation + 0.12, point[1]))
      for (const point of points) {
        const marker = new THREE.Mesh(SHARED_HANDLE_GEOMETRY, DRAFT_MATERIAL)
        marker.position.copy(point)
        marker.scale.setScalar(scale)
        marker.renderOrder = 29
        this.draftGroup.add(marker)
      }
      if (points.length > 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, HANDLE_LINE_MATERIAL)
        line.userData.ownGeometry = true
        line.renderOrder = 28
        this.draftGroup.add(line)
      }
    }
  }

  private showSnapMarker(point: Vec2, valid: boolean) {
    const elevation = this.activeElevation()
    this.snapMarker.position.set(point[0], elevation + 0.02, point[1])
    this.snapMarker.scale.setScalar(clamp(this.rig.distance * 0.055, 0.7, 2.4))
    ;(SNAP_MATERIAL as THREE.MeshBasicMaterial).color.set(valid ? '#ffffff' : '#ff5a56')
    this.snapMarker.visible = true
  }

  private hideSnapMarker() {
    this.snapMarker.visible = false
  }

  private clearGhost() {
    if (this.ghostGroup.children.length > 0) {
      if (this.ghostOwnGeometry) {
        this.ghostGroup.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) child.geometry.dispose()
        })
      }
      this.ghostGroup.clear()
    }
    this.ghostKey = ''
    this.ghostOwnGeometry = false
  }

  private setGhostRaw(group: THREE.Group, key: string, ownGeometry: boolean) {
    if (this.ghostKey === key) {
      if (ownGeometry) {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments || child instanceof THREE.Line) {
            child.geometry.dispose()
          }
        })
      }
      return
    }
    this.clearGhost()
    this.ghostGroup.add(group)
    this.ghostKey = key
    this.ghostOwnGeometry = ownGeometry
  }

  private clearDraftGroup() {
    this.draftGroup.traverse((child) => {
      if ((child instanceof THREE.Mesh || child instanceof THREE.Line) && child.userData.ownGeometry) {
        child.geometry.dispose()
      }
    })
    this.draftGroup.clear()
  }

  private markShadowDirty() {
    this.shadowDirty = true
  }

  private publishHint() {
    useRuntime.getState().setHint(this.baseHint, this.snapLabel, this.invalidReason)
  }

  private setHover(nullOrBox: THREE.Box3 | null, color = '#bdbdbd') {
    if (!nullOrBox || nullOrBox.isEmpty()) {
      this.hoverBox.visible = false
      return
    }
    this.hoverBox.box.copy(nullOrBox).expandByScalar(0.025)
    ;(this.hoverBox.material as THREE.LineBasicMaterial).color.set(color)
    this.hoverBox.updateMatrixWorld(true)
    this.hoverBox.visible = true
  }

  private applyCursor() {
    const tool = this.state.tool
    this.canvas.style.cursor =
      tool === 'select' ? 'default' : tool === 'erase' ? 'pointer' : tool === 'object' ? 'copy' : 'crosshair'
  }

  private updateBaseHint() {
    const s = this.state
    const selected = this.selectedEntity()
    switch (s.tool) {
      case 'select':
        this.baseHint = !selected
          ? '左键选择构件 · Alt+左键平移 · Alt+右键旋转视角 · WASD 移动 · 滚轮缩放'
          : selected.kind === 'wall'
            ? '拖动金色端点调整墙体 · Delete 删除 · 双击聚焦'
            : selected.kind === 'path'
              ? '拖动金色控制点重塑曲线 · Delete 删除 · 双击聚焦'
              : selected.kind === 'opening'
                ? '在右侧调整洞口位置与尺寸 · Delete 删除'
                : '拖动坐标轴移动 · R 旋转 · F 聚焦 · Delete 删除'
        break
      case 'erase':
        this.baseHint = '点击构件将其删除 · 删除墙体时门窗会一并移除'
        break
      case 'wall':
        this.baseHint = this.wallDraft
          ? '点击继续绘制 · 点击起点闭合 · Backspace 撤回 · 右键 / Enter 完成'
          : '点击地面确定墙体起点 · 靠近已有墙端点会自动吸附'
        break
      case 'slab':
        this.baseHint = '按住左键拖出楼板范围 · 松开完成 · 尺寸可在属性面板调整'
        break
      case 'door':
        this.baseHint = '将鼠标移到墙体上，点击放置门 · 自动避让已有门窗'
        break
      case 'window':
        this.baseHint = '将鼠标移到墙体上，点击放置窗 · 自动避让已有门窗'
        break
      case 'roof':
        this.baseHint = '点击由墙体围合的房间自动生成屋顶 · 屋顶可按房间外接矩形自动适配'
        break
      case 'path':
        this.baseHint = this.pathDraft
          ? '点击添加曲线控制点 · 点击起点闭合 · 右键 / Enter 完成'
          : `${pathTypeName(s.toolOptions.path.type)}：点击地面开始绘制，路径会自动平滑成曲线`
        break
      case 'object': {
        const model = getModel(s.activeModelId)
        this.baseHint = model
          ? `左键放置「${model.name}」 · R 旋转 · Shift 暂时关闭吸附 · Esc 退出`
          : '从左侧组件库选择要放置的构件'
        break
      }
    }
    this.applyCursor()
  }

  private resize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (width === 0 || height === 0) return
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  private animate = () => {
    if (this.destroyed) return
    this.animationFrame = window.requestAnimationFrame(this.animate)
    const now = performance.now()
    const rawDt = (now - this.lastFrameTime) / 1000
    const dt = Math.min(rawDt, 0.1)
    this.lastFrameTime = now
    const elapsed = now / 1000
    this.rig.update(dt)
    if (this.rig.target.distanceToSquared(this.shadowTarget) > 2.25) {
      this.shadowTarget.copy(this.rig.target)
      this.env.update(this.rig.target)
      this.shadowDirty = true
    }
    tickWater(elapsed)
    if (this.shadowDirty) {
      this.renderer.shadowMap.needsUpdate = true
      this.shadowDirty = false
    }
    this.renderer.render(this.scene, this.camera)
    this.handleGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.handle) child.scale.setScalar(this.handleScale())
    })
    this.fpsFrames++
    this.fpsElapsed += rawDt
    if (this.fpsElapsed >= 0.5) {
      const info = this.renderer.info.render
      const fps = Math.round(this.fpsFrames / this.fpsElapsed)
      this.updateAutoQuality(fps, now)
      useRuntime.getState().setPerf({
        fps,
        drawCalls: info.calls,
        triangles: info.triangles,
        objects: this.state.doc.entityOrder.length,
        quality: this.effectiveQuality,
      })
      this.fpsFrames = 0
      this.fpsElapsed = 0
    }
  }

  focusEntityIds(ids: string[]) {
    const box = new THREE.Box3()
    let found = false
    for (const id of ids) {
      const view = this.viewMap.get(id)
      if (!view || !view.group.visible) continue
      view.group.updateWorldMatrix(true, true)
      box.expandByObject(view.group)
      found = true
    }
    if (found && !box.isEmpty()) this.rig.focusBox(box)
  }

  getView(): ViewState {
    return this.rig.getView()
  }

  setView(view: ViewState) {
    this.rig.setView(view)
    this.env.update(this.rig.target)
    this.shadowTarget.copy(this.rig.target)
  }

  focusSelection() {
    const entity = this.selectedEntity()
    if (!entity) return
    const view = this.viewMap.get(entity.id)
    if (!view) return
    const box = this.selectionBoxFor(entity, view)
    if (box && !box.isEmpty()) this.rig.focusBox(box)
  }

  topView() {
    this.rig.azimuth = 0
    this.rig.polar = 0.2
    this.rig.distance = clamp(this.rig.distance * 1.08, 4, 160)
    this.rig.apply()
    this.env.update(this.rig.target)
    this.shadowTarget.copy(this.rig.target)
    this.markShadowDirty()
  }

  focusAll() {
    if (this.viewMap.size === 0) {
      this.rig.target.set(0, 0.5, 0)
      this.rig.distance = 30
      this.rig.apply()
      return
    }
    const box = new THREE.Box3()
    for (const view of this.viewMap.values()) {
      if (view.group.visible) box.expandByObject(view.group)
    }
    if (!box.isEmpty()) this.rig.focusBox(box)
  }

  dispose() {
    this.destroyed = true
    window.cancelAnimationFrame(this.animationFrame)
    this.unsubscribe()
    this.resizeObserver.disconnect()
    this.rig.dispose()
    this.transformControls.dispose()
    this.clearGhost()
    for (const id of [...this.viewMap.keys()]) this.removeView(id)
    this.renderer.dispose()
    this.canvas.remove()
    window.removeEventListener('keydown', this.onKeyDown)
    this.canvas.removeEventListener('pointerdown', this.onPointerDown)
    this.canvas.removeEventListener('pointermove', this.onPointerMove)
    this.canvas.removeEventListener('pointerup', this.onPointerUp)
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave)
    this.canvas.removeEventListener('dblclick', this.onDoubleClick)
  }

  private updatePointer(event: InteractionEvent) {
    const rect = this.canvas.getBoundingClientRect()
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    this.hasPointer = true
    this.lastClient.x = event.clientX
    this.lastClient.y = event.clientY
  }

  private groundPointAt(clientX: number, clientY: number): THREE.Vector3 | null {
    this.updatePointer({ clientX, clientY } as MouseEvent)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const elevation = this.activeElevation()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -elevation)
    const out = new THREE.Vector3()
    return this.raycaster.ray.intersectPlane(plane, out)
  }

  private allEntities(): Entity[] {
    return Object.values(this.state.doc.entities)
  }

  private wallsOnActiveLevel(): WallEntity[] {
    return this.allEntities().filter(
      (entity): entity is WallEntity =>
        entity.kind === 'wall' && entity.levelId === this.state.doc.activeLevelId,
    )
  }

  private entityBox(entity: Entity): THREE.Box3 | null {
    if (entity.kind === 'opening') {
      const wall = this.state.doc.entities[entity.wallId]
      if (!wall || wall.kind !== 'wall') return null
      const wallView = this.viewMap.get(wall.id)
      if (!wallView) return null
      const thickness = wall.thickness / 2 + 0.04
      const points: THREE.Vector3[] = []
      for (const x of [entity.offset - entity.width / 2, entity.offset + entity.width / 2]) {
        for (const y of [entity.sill, entity.sill + entity.height]) {
          for (const z of [-thickness, thickness]) {
            points.push(wallView.group.localToWorld(new THREE.Vector3(x, y, z)))
          }
        }
      }
      return new THREE.Box3().setFromPoints(points)
    }
    const view = this.viewMap.get(entity.id)
    if (!view) return null
    view.group.updateWorldMatrix(true, true)
    return new THREE.Box3().setFromObject(view.group)
  }

  private climbToEntity(object: THREE.Object3D): string | null {
    let current: THREE.Object3D | null = object
    while (current) {
      if (typeof current.userData.entityId === 'string') return current.userData.entityId
      current = current.parent
    }
    return null
  }

  private openingAtLocal(wall: WallEntity, x: number, y: number): OpeningEntity | null {
    for (const entity of this.allEntities()) {
      if (entity.kind !== 'opening' || entity.wallId !== wall.id) continue
      if (x < entity.offset - entity.width / 2 - 0.02 || x > entity.offset + entity.width / 2 + 0.02) continue
      if (y < entity.sill - 0.02 || y > entity.sill + entity.height + 0.02) continue
      return entity
    }
    return null
  }

  private pickEntityAt(clientX: number, clientY: number): { entity: Entity; group: THREE.Group; point: THREE.Vector3 } | null {
    this.updatePointer({ clientX, clientY } as MouseEvent)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const roots = [...this.viewMap.values()].filter((view) => view.group.visible).map((view) => view.group)
    if (roots.length === 0) return null
    const hits = this.raycaster.intersectObjects(roots, true)
    for (const hit of hits) {
      const id = this.climbToEntity(hit.object)
      if (!id) continue
      const entity = this.state.doc.entities[id]
      if (!entity) continue
      const view = this.viewMap.get(id)
      if (!view) continue
      if (entity.kind === 'wall') {
        const local = view.group.worldToLocal(hit.point.clone())
        const opening = this.openingAtLocal(entity, local.x, local.y)
        if (opening) {
          return { entity: opening, group: view.group, point: hit.point.clone() }
        }
      }
      return { entity, group: view.group, point: hit.point.clone() }
    }
    return null
  }

  private pickWallAt(clientX: number, clientY: number): WallRayHit | null {
    this.updatePointer({ clientX, clientY } as MouseEvent)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const roots: THREE.Group[] = []
    for (const view of this.viewMap.values()) {
      if (view.entity.kind === 'wall' && view.group.visible && view.entity.levelId === this.state.doc.activeLevelId) {
        roots.push(view.group)
      }
    }
    if (roots.length === 0) return null
    const hits = this.raycaster.intersectObjects(roots, true)
    for (const hit of hits) {
      const id = this.climbToEntity(hit.object)
      if (!id) continue
      const wall = this.state.doc.entities[id]
      if (!wall || wall.kind !== 'wall') continue
      const group = this.viewMap.get(id)?.group
      if (!group) continue
      const local = group.worldToLocal(hit.point.clone())
      return { wall, group, offset: local.x, localY: local.y, point: hit.point.clone() }
    }
    return null
  }

  private pickHandle(clientX: number, clientY: number): HandleRef | null {
    this.updatePointer({ clientX, clientY } as MouseEvent)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(this.handleGroup.children, true)
    for (const hit of hits) {
      if (hit.object.userData.handle) {
        return {
          handle: hit.object.userData.handle as HandleRef['handle'],
          entityId: hit.object.userData.entityId as string,
          index: hit.object.userData.index as number | undefined,
          end: hit.object.userData.end as 'a' | 'b' | undefined,
        }
      }
    }
    return null
  }

  private updateHover(clientX: number, clientY: number, erase: boolean) {
    const picked = this.pickEntityAt(clientX, clientY)
    if (!picked || picked.entity.id === this.state.selectedId) {
      this.setHover(null)
      return
    }
    const box = this.entityBox(picked.entity)
    this.setHover(box, erase ? '#ff625d' : '#bdbdbd')
  }

  private clearHover() {
    this.hoverBox.visible = false
  }

  private snapToWallEndpoints(
    raw: Vec2,
    excludeWallIds?: Set<string>,
  ): { point: Vec2; label: string } | null {
    let best: { point: Vec2; label: string; distance: number } | null = null
    for (const wall of this.wallsOnActiveLevel()) {
      if (excludeWallIds?.has(wall.id)) continue
      for (const endpoint of [wall.a, wall.b]) {
        const d = dist2(raw, endpoint)
        if (d < 0.82 && (!best || d < best.distance)) {
          best = { point: [endpoint[0], endpoint[1]], label: '吸附到墙体端点', distance: d }
        }
      }
    }
    return best ? { point: best.point, label: best.label } : null
  }

  private computeWallPoint(raw: Vec2): { point: Vec2; label: string } {
    let point: Vec2 = [raw[0], raw[1]]
    let label = ''
    const excluded = this.wallDraft?.createdIds
    const endpointSnap = this.snapToWallEndpoints(raw, excluded)
    if (endpointSnap) {
      point = endpointSnap.point
      label = endpointSnap.label
    }
    if (this.wallDraft && this.wallDraft.points.length >= 2) {
      const first = this.wallDraft.points[0]
      const d = dist2(raw, first)
      if (d < 0.9 && (!label || d < 0.6)) {
        point = [first[0], first[1]]
        label = '闭合到起点'
      }
    }
    if (!label && this.wallDraft && this.wallDraft.points.length > 0 && this.state.settings.angleSnap && !this.shiftDown) {
      const last = this.wallDraft.points[this.wallDraft.points.length - 1]
      const candidate = snapAngle(last, raw, 15, 5.5)
      if (Math.hypot(candidate[0] - raw[0], candidate[1] - raw[1]) > 1e-4) {
        point = candidate
        label = '角度吸附 15°'
      }
    }
    if (!label && this.state.settings.gridSnap && !this.shiftDown) {
      point = [snapValue(point[0], 0.1), snapValue(point[1], 0.1)]
      label = '网格对齐'
    }
    return { point, label }
  }

  private computeWallHandlePoint(raw: Vec2, wallId: string): { point: Vec2; label: string } {
    const endpointSnap = this.snapToWallEndpoints(raw, new Set([wallId]))
    if (endpointSnap) return endpointSnap
    if (this.state.settings.gridSnap && !this.shiftDown) {
      return { point: [snapValue(raw[0], 0.1), snapValue(raw[1], 0.1)], label: '网格对齐' }
    }
    return { point: [raw[0], raw[1]], label: '' }
  }

  private pathRadius(type: string) {
    if (type === 'road') return 2.2
    if (type === 'bridge') return 2.4
    if (type === 'river') return 2.6
    if (type === 'footpath') return 1.4
    return 1.2
  }

  private compatiblePathType(a: string, b: string) {
    return a === b
  }

  private computePathPoint(
    raw: Vec2,
    type: string,
    excludeId?: string,
  ): { point: Vec2; label: string } {
    const radius = this.pathRadius(type)
    let point: Vec2 = [raw[0], raw[1]]
    let label = ''
    if (!excludeId && this.pathDraft && this.pathDraft.length >= 3) {
      const first = this.pathDraft[0]
      if (dist2(raw, first) < radius) {
        point = [first[0], first[1]]
        label = '闭合路径'
      }
    }
    if (!label) {
      let best: { point: Vec2; distance: number; label: string } | null = null
      for (const entity of this.allEntities()) {
        if (entity.kind !== 'path' || entity.id === excludeId) continue
        if (entity.levelId !== this.state.doc.activeLevelId) continue
        if (!this.compatiblePathType(entity.pathType, type)) continue
        const endpoints = [entity.points[0], entity.points[entity.points.length - 1]]
        for (const endpoint of endpoints) {
          if (!endpoint) continue
          const d = dist2(raw, endpoint)
          if (d < radius && (!best || d < best.distance)) {
            best = { point: [endpoint[0], endpoint[1]], distance: d, label: `吸附到${pathTypeName(entity.pathType)}端点` }
          }
        }
      }
      if (best) {
        point = best.point
        label = best.label
      }
    }
    if (!label && this.state.settings.gridSnap && !this.shiftDown) {
      point = [snapValue(point[0], 0.5), snapValue(point[1], 0.5)]
      label = '网格对齐'
    }
    return { point, label }
  }

  private computeObjectSnap(
    raw: Vec2,
    model: ModelDef,
  ): { x: number; z: number; rot: number; label: string } {
    let x = raw[0]
    let z = raw[1]
    let rot = this.placementRotation
    let label = ''
    if (!this.shiftDown && model.wallAlign) {
      const walls = this.wallsOnActiveLevel()
      const hit = nearestPointOnWalls(raw[0], raw[1], walls, 0.9)
      if (hit && hit.wall.kind === 'wall') {
        const wall = hit.wall
        const dx = wall.b[0] - wall.a[0]
        const dz = wall.b[1] - wall.a[1]
        const len = Math.hypot(dx, dz) || 1
        const nx = dz / len
        const nz = -dx / len
        const sideRaw = (raw[0] - hit.point[0]) * nx + (raw[1] - hit.point[1]) * nz
        const side = sideRaw >= 0 ? 1 : -1
        const gap = (model.footprint[1] / 2) * 1 + 0.035
        x = hit.point[0] + nx * side * gap
        z = hit.point[1] + nz * side * gap
        rot = Math.atan2(nx * side, nz * side)
        label = '吸附到墙面'
      }
    }
    if (!label && this.state.settings.gridSnap && !this.shiftDown) {
      x = snapValue(x, 0.25)
      z = snapValue(z, 0.25)
      label = '网格对齐'
    }
    return { x: round3(x), z: round3(z), rot: round3(rot), label }
  }

  private validateObject(model: ModelDef, x: number, z: number, rot: number, levelId: string, ignoreId?: string) {
    return checkObjectPlacement(
      model,
      x,
      z,
      rot,
      1,
      levelId,
      Object.values(this.state.doc.entities),
      this.footprints,
      ignoreId,
    )
  }

  private makeWallEntity(a: Vec2, b: Vec2): WallEntity {
    return {
      id: uid('wall'),
      kind: 'wall',
      levelId: this.state.doc.activeLevelId,
      a,
      b,
      height: this.state.toolOptions.wall.height,
      thickness: this.state.toolOptions.wall.thickness,
      color: this.state.toolOptions.wall.color,
    }
  }

  private makePathEntity(type: string, points: Vec2[], closed = false): PathEntity {
    const options = this.state.toolOptions.path
    return {
      id: uid('path'),
      kind: 'path',
      levelId: this.state.doc.activeLevelId,
      pathType: type as PathEntity['pathType'],
      points,
      width: options.width,
      style: options.style,
      sidewalk: options.sidewalk,
      lanes: options.lanes,
      bridgeHeight: options.bridgeHeight,
      railings: options.railings,
      closed,
    }
  }

  private makeSlabEntityFromRect(rect: { x: number; z: number; w: number; d: number }): SlabEntity {
    return {
      id: uid('slab'),
      kind: 'slab',
      levelId: this.state.doc.activeLevelId,
      x: rect.x,
      z: rect.z,
      w: rect.w,
      d: rect.d,
      rot: 0,
      thickness: this.state.toolOptions.slab.thickness,
      style: this.state.toolOptions.slab.style,
    }
  }

  private get activeModel(): ModelDef | null {
    const id = this.state.activeModelId
    if (!id) return null
    const builtin = getModel(id)
    if (builtin) return builtin
    const asset = this.state.doc.customAssets.find((item) => item.id === id)
    if (!asset) return null
    return {
      id: asset.id,
      name: asset.name,
      category: 'custom',
      footprint: asset.footprint,
      height: asset.height,
      placement: 'any',
      parts: [],
    }
  }

  private buildObjectGhost(model: ModelDef, x: number, z: number, rot: number, valid: boolean) {
    const temp: ObjectEntity = {
      id: 'preview-object',
      kind: 'object',
      levelId: this.state.doc.activeLevelId,
      modelId: model.id,
      x,
      z,
      rot,
      scale: 1,
    }
    const created = this.makeObjectGroup(temp)
    created.group.position.set(x, this.activeElevation(), z)
    created.group.rotation.y = rot
    applyGhost(created.group, valid)
    const key = `object|${model.id}|${x.toFixed(2)}|${z.toFixed(2)}|${rot.toFixed(3)}|${valid}`
    this.setGhostRaw(created.group, key, false)
  }

  private buildWallGhost(a: Vec2, b: Vec2, valid: boolean) {
    const wall = this.makeWallEntity(a, b)
    const group = buildWall(wall, [], this.activeElevation())
    applyGhost(group, valid)
    const key = `wall|${a[0].toFixed(2)},${a[1].toFixed(2)}|${b[0].toFixed(2)},${b[1].toFixed(2)}|${valid}`
    this.setGhostRaw(group, key, true)
  }

  private buildPathGhost(points: Vec2[], type: string, valid: boolean, closed = false) {
    const path = this.makePathEntity(type, points, closed)
    const group = buildPath(path, this.activeElevation())
    applyGhost(group, valid)
    const key = `path|${type}|${closed}|${points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(';')}|${valid}`
    this.setGhostRaw(group, key, true)
  }

  private buildSlabGhost(rect: { x: number; z: number; w: number; d: number }, valid: boolean) {
    const slab = this.makeSlabEntityFromRect(rect)
    const group = buildSlab(slab, this.activeElevation())
    applyGhost(group, valid)
    const key = `slab|${rect.x.toFixed(2)}|${rect.z.toFixed(2)}|${rect.w.toFixed(2)}|${rect.d.toFixed(2)}|${valid}`
    this.setGhostRaw(group, key, true)
  }

  private buildRoofGhost(entity: RoofEntity, valid: boolean) {
    const group = buildRoof(entity)
    applyGhost(group, valid)
    const key = `roof|${entity.x.toFixed(2)}|${entity.z.toFixed(2)}|${entity.w.toFixed(2)}|${entity.d.toFixed(2)}|${entity.rot.toFixed(3)}|${entity.style}|${entity.finish}|${valid}`
    this.setGhostRaw(group, key, true)
  }

  private buildInvalidFootprintGhost(x: number, z: number) {
    const group = new THREE.Group()
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.12, 4.5),
      new THREE.MeshBasicMaterial({ color: '#ff5a56', transparent: true, opacity: 0.22, depthWrite: false }),
    )
    mesh.position.set(x, this.activeElevation() + 0.08, z)
    group.add(mesh)
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(4.5, 0.15, 4.5)),
      new THREE.LineBasicMaterial({ color: '#ff5a56', transparent: true, opacity: 0.9, depthTest: false }),
    )
    edges.position.copy(mesh.position)
    group.add(edges)
    const key = `invalid|${x.toFixed(1)}|${z.toFixed(1)}`
    this.setGhostRaw(group, key, true)
  }

  private buildOpeningGhost(hit: WallRayHit, width: number, height: number, sill: number, offset: number, valid: boolean) {
    const group = new THREE.Group()
    group.position.set(hit.wall.a[0], this.activeElevation(), hit.wall.a[1])
    group.rotation.y = -Math.atan2(hit.wall.b[1] - hit.wall.a[1], hit.wall.b[0] - hit.wall.a[0])
    const depth = hit.wall.thickness + 0.045
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      valid ? GHOST_VALID_MATERIAL : GHOST_INVALID_MATERIAL,
    )
    mesh.position.set(offset, sill + height / 2, 0)
    group.add(mesh)
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth)),
      new THREE.LineBasicMaterial({
        color: valid ? '#ffffff' : '#ff5a56',
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      }),
    )
    edges.position.copy(mesh.position)
    group.add(edges)
    const key = `opening|${hit.wall.id}|${offset.toFixed(2)}|${width}|${height}|${sill}|${valid}`
    this.setGhostRaw(group, key, true)
  }

  private updateWallPreview(clientX: number, clientY: number) {
    const ground = this.groundPointAt(clientX, clientY)
    if (!ground) {
      this.clearGhost()
      this.hideSnapMarker()
      return
    }
    const raw: Vec2 = [ground.x, ground.z]
    const snapped = this.computeWallPoint(raw)
    this.snapLabel = snapped.label
    if (!this.wallDraft) {
      this.clearGhost()
      this.invalidReason = ''
      if (snapped.label) this.showSnapMarker(snapped.point, true)
      else this.hideSnapMarker()
      this.publishHint()
      return
    }
    const last = this.wallDraft.points[this.wallDraft.points.length - 1]
    const target = snapped.point
    if (dist2(last, target) < 0.03) {
      this.clearGhost()
      this.hideSnapMarker()
      this.invalidReason = '点击其他位置继续绘制'
      this.publishHint()
      return
    }
    const check = checkWallPlacement(
      last,
      target,
      this.state.toolOptions.wall.thickness,
      this.state.doc.activeLevelId,
      this.allEntities(),
    )
    this.invalidReason = check.valid ? '' : check.reason
    this.showSnapMarker(target, check.valid)
    this.buildWallGhost(last, target, check.valid)
    this.publishHint()
  }

  private updatePathPreview(clientX: number, clientY: number) {
    const ground = this.groundPointAt(clientX, clientY)
    if (!ground) {
      this.clearGhost()
      this.hideSnapMarker()
      return
    }
    const type = this.state.toolOptions.path.type
    const snapped = this.computePathPoint([ground.x, ground.z], type)
    this.snapLabel = snapped.label
    if (!this.pathDraft) {
      this.clearGhost()
      this.invalidReason = ''
      if (snapped.label) this.showSnapMarker(snapped.point, true)
      else this.hideSnapMarker()
      this.publishHint()
      return
    }
    const closing = snapped.label === '闭合路径'
    const last = this.pathDraft[this.pathDraft.length - 1]
    let previewPoints: Vec2[]
    if (closing) {
      previewPoints = [...this.pathDraft]
    } else {
      if (dist2(last, snapped.point) < 0.04) {
        this.clearGhost()
        this.invalidReason = '路径太短'
        this.hideSnapMarker()
        this.publishHint()
        return
      }
      previewPoints = [...this.pathDraft, snapped.point]
    }
    const path = this.makePathEntity(type, previewPoints, closing)
    const check = checkPathPlacement(path, this.allEntities())
    this.invalidReason = check.valid ? '' : check.reason
    this.showSnapMarker(snapped.point, check.valid)
    this.buildPathGhost(previewPoints, type, check.valid, closing)
    this.publishHint()
  }

  private updateObjectPreview(clientX: number, clientY: number) {
    const model = this.activeModel
    if (!model) {
      this.clearGhost()
      this.objectPreview = null
      this.invalidReason = '请先在组件库中选择一件物品'
      this.hideSnapMarker()
      this.publishHint()
      return
    }
    const ground = this.groundPointAt(clientX, clientY)
    if (!ground) {
      this.clearGhost()
      this.hideSnapMarker()
      return
    }
    const snapped = this.computeObjectSnap([ground.x, ground.z], model)
    this.snapLabel = snapped.label
    const check = this.validateObject(model, snapped.x, snapped.z, snapped.rot, this.state.doc.activeLevelId)
    this.invalidReason = check.valid ? '' : check.reason
    this.objectPreview = {
      modelId: model.id,
      x: snapped.x,
      z: snapped.z,
      rot: snapped.rot,
      valid: check.valid,
      reason: check.reason,
    }
    this.showSnapMarker([snapped.x, snapped.z], check.valid)
    this.buildObjectGhost(model, snapped.x, snapped.z, snapped.rot, check.valid)
    this.publishHint()
  }

  private updateOpeningPreview(clientX: number, clientY: number) {
    const hit = this.pickWallAt(clientX, clientY)
    if (!hit) {
      this.clearGhost()
      this.openingPreview = null
      this.snapLabel = ''
      this.invalidReason = '请将鼠标移到墙体上'
      this.hideSnapMarker()
      this.publishHint()
      return
    }
    const isWindow = this.state.tool === 'window'
    const style = isWindow
      ? WINDOW_STYLES.find((item) => item.id === this.state.toolOptions.openings.windowStyle) ?? WINDOW_STYLES[0]
      : DOOR_STYLES.find((item) => item.id === this.state.toolOptions.openings.doorStyle) ?? DOOR_STYLES[0]
    const width = style.width
    const height = style.height
    const sill = isWindow ? (style as { sill: number }).sill : 0
    const length = dist2(hit.wall.a, hit.wall.b)
    const offset = clamp(hit.offset, width / 2 + 0.1, Math.max(width / 2 + 0.1, length - width / 2 - 0.1))
    const openings = this.allEntities().filter((entity) => entity.kind === 'opening' && entity.wallId === hit.wall.id)
    const check = checkOpeningPlacement(hit.wall, offset, width, height, sill, openings)
    const reason = length < width + 0.3 ? '墙体长度不足，无法放置这个门窗' : check.reason
    const valid = check.valid && length >= width + 0.3
    this.invalidReason = valid ? '' : reason
    this.openingPreview = {
      wallId: hit.wall.id,
      offset,
      width,
      height,
      sill,
      valid,
      reason,
    }
    const dirX = (hit.wall.b[0] - hit.wall.a[0]) / (length || 1)
    const dirZ = (hit.wall.b[1] - hit.wall.a[1]) / (length || 1)
    this.showSnapMarker([hit.wall.a[0] + dirX * offset, hit.wall.a[1] + dirZ * offset], valid)
    this.buildOpeningGhost(hit, width, height, sill, offset, valid)
    this.snapLabel = '吸附到墙面'
    this.publishHint()
  }

  private updateRoofPreview(clientX: number, clientY: number) {
    const ground = this.groundPointAt(clientX, clientY)
    if (!ground) {
      this.clearGhost()
      this.hideSnapMarker()
      return
    }
    const room = roomAtPoint(this.allEntities(), this.state.doc.activeLevelId, [ground.x, ground.z])
    const options = this.state.toolOptions.roof
    if (room && room.area > 1.2) {
      const overhang = options.overhang
      const preview: RoofEntity = {
        id: 'preview-roof',
        kind: 'roof',
        levelId: this.state.doc.activeLevelId,
        x: room.rect.center[0],
        z: room.rect.center[1],
        w: Math.max(1, room.rect.width + overhang * 2),
        d: Math.max(1, room.rect.depth + overhang * 2),
        rot: room.rect.rot,
        style: options.style,
        finish: options.finish,
        pitch: options.pitch,
        eaveY: this.activeElevation() + room.maxWallHeight + 0.02,
        overhang,
      }
      this.roofPreview = preview
      this.invalidReason = ''
      this.snapLabel = '已识别闭合房间'
      this.hideSnapMarker()
      this.buildRoofGhost(preview, true)
      this.publishHint()
    } else {
      this.roofPreview = null
      this.invalidReason = '请点击由墙体完整围合的房间'
      this.snapLabel = ''
      this.hideSnapMarker()
      this.buildInvalidFootprintGhost(ground.x, ground.z)
      this.publishHint()
    }
  }

  private updateSlabDrag(_event: PointerEvent) {
    if (!this.slabDrag) return
    const ground = this.groundPointAt(_event.clientX, _event.clientY)
    if (!ground) return
    let x = ground.x
    let z = ground.z
    if (this.state.settings.gridSnap && !this.shiftDown) {
      x = snapValue(x, 0.25)
      z = snapValue(z, 0.25)
    }
    this.slabDrag.current = [x, z]
    const rect = this.rectFromDrag(this.slabDrag)
    const valid = rect.w >= 0.5 && rect.d >= 0.5
    this.invalidReason = valid ? '' : '楼板尺寸至少为 0.5 × 0.5 m'
    if (rect.w > 0.15 && rect.d > 0.15) {
      this.buildSlabGhost(rect, valid)
    } else {
      this.clearGhost()
    }
    this.snapLabel = ''
    this.hideSnapMarker()
    this.publishHint()
  }

  private rectFromDrag(drag: SlabDrag) {
    const x1 = Math.min(drag.start[0], drag.current[0])
    const x2 = Math.max(drag.start[0], drag.current[0])
    const z1 = Math.min(drag.start[1], drag.current[1])
    const z2 = Math.max(drag.start[1], drag.current[1])
    return {
      x: round3((x1 + x2) / 2),
      z: round3((z1 + z2) / 2),
      w: round3(x2 - x1),
      d: round3(z2 - z1),
    }
  }

  private finishSlabDrag() {
    if (!this.slabDrag) return
    const rect = this.rectFromDrag(this.slabDrag)
    if (rect.w >= 0.5 && rect.d >= 0.5) {
      const entity = this.makeSlabEntityFromRect(rect)
      useEditor.getState().addEntity(entity, true)
      useRuntime.getState().toast('楼板已放置', 'success')
    }
    this.slabDrag = null
    this.clearGhost()
    this.hideSnapMarker()
    this.invalidReason = ''
    this.snapLabel = ''
    this.updateBaseHint()
    this.publishHint()
  }

  private refreshPreviewFromLastPointer() {
    if (!this.hasPointer) return
    const x = this.lastClient.x
    const y = this.lastClient.y
    if (this.state.tool === 'wall') this.updateWallPreview(x, y)
    else if (this.state.tool === 'path') this.updatePathPreview(x, y)
    else if (this.state.tool === 'object') this.updateObjectPreview(x, y)
    else if (this.state.tool === 'door' || this.state.tool === 'window') this.updateOpeningPreview(x, y)
    else if (this.state.tool === 'roof') this.updateRoofPreview(x, y)
  }

  private cancelDrafts() {
    this.wallDraft = null
    this.pathDraft = null
    this.pathClosed = false
    this.slabDrag = null
    this.handleDrag = null
    this.handleDragHistory = false
    this.objectPreview = null
    this.openingPreview = null
    this.roofPreview = null
    this.invalidReason = ''
    this.snapLabel = ''
    this.clearDraftGroup()
    this.clearGhost()
    this.hideSnapMarker()
    this.updateBaseHint()
    this.publishHint()
  }

  private finishDraftFromRightClick() {
    if (this.wallDraft || this.pathDraft) this.finishDraft()
  }

  private finishDraft() {
    if (this.wallDraft) {
      this.wallDraft = null
      this.clearDraftGroup()
      this.clearGhost()
      this.hideSnapMarker()
      this.updateBaseHint()
      this.publishHint()
      return
    }
    if (!this.pathDraft) return
    const cleaned: Vec2[] = []
    for (const point of this.pathDraft) {
      const prev = cleaned[cleaned.length - 1]
      if (!prev || dist2(prev, point) > 0.04) cleaned.push([point[0], point[1]])
    }
    if (cleaned.length >= 3 && dist2(cleaned[0], cleaned[cleaned.length - 1]) < 0.06) {
      cleaned.pop()
    }
    if (cleaned.length < (this.pathClosed ? 3 : 2)) {
      useRuntime.getState().toast(this.pathClosed ? '闭合路径至少需要三个控制点' : '路径至少需要两个控制点', 'warn')
      return
    }
    const entity = this.makePathEntity(this.state.toolOptions.path.type, cleaned, this.pathClosed)
    const check = checkPathPlacement(entity, this.allEntities())
    if (!check.valid) {
      useRuntime.getState().toast(check.reason, 'warn')
      return
    }
    this.pathDraft = null
    this.pathClosed = false
    this.clearGhost()
    this.clearDraftGroup()
    this.hideSnapMarker()
    this.invalidReason = ''
    this.snapLabel = ''
    useEditor.getState().addEntity(entity, true)
    useRuntime.getState().toast(`${pathTypeName(entity.pathType)}已放置`, 'success')
    this.updateBaseHint()
    this.publishHint()
  }

  private placeObject() {
    const preview = this.objectPreview
    const model = this.activeModel
    if (!preview || !model) return
    if (!preview.valid) {
      useRuntime.getState().toast(preview.reason || '无法在此处放置', 'warn')
      return
    }
    const entity: ObjectEntity = {
      id: uid('obj'),
      kind: 'object',
      levelId: this.state.doc.activeLevelId,
      modelId: preview.modelId,
      x: preview.x,
      z: preview.z,
      rot: preview.rot,
      scale: 1,
    }
    useEditor.getState().addEntity(entity, true)
    this.objectPreview = null
    this.clearGhost()
    this.hideSnapMarker()
    this.snapLabel = ''
    this.invalidReason = ''
    this.updateBaseHint()
    this.publishHint()
  }

  private placeOpening() {
    const preview = this.openingPreview
    if (!preview) return
    if (!preview.valid) {
      useRuntime.getState().toast(preview.reason || '无法在此处放置门窗', 'warn')
      return
    }
    const isWindow = this.state.tool === 'window'
    const openings = this.state.toolOptions.openings
    const entity: OpeningEntity = {
      id: uid('opening'),
      kind: 'opening',
      type: isWindow ? 'window' : 'door',
      wallId: preview.wallId,
      offset: preview.offset,
      width: preview.width,
      height: preview.height,
      sill: preview.sill,
      style: isWindow ? openings.windowStyle : openings.doorStyle,
      ...(isWindow
        ? {}
        : {
            openAngle: clamp(openings.doorOpenAngle, -135, 135),
            hinge: openings.doorHinge,
          }),
    }
    useEditor.getState().addEntity(entity, true)
    this.openingPreview = null
    this.clearGhost()
    this.hideSnapMarker()
    this.snapLabel = ''
    this.invalidReason = ''
    this.updateBaseHint()
    this.publishHint()
  }

  private placeRoof() {
    const preview = this.roofPreview
    if (!preview) {
      useRuntime.getState().toast(this.invalidReason || '无法生成屋顶', 'warn')
      return
    }
    useEditor.getState().addEntity({ ...preview, id: uid('roof'), levelId: this.state.doc.activeLevelId }, true)
    this.roofPreview = null
    this.clearGhost()
    this.invalidReason = ''
    this.snapLabel = ''
    useRuntime.getState().toast('屋顶已生成，可在属性面板调整样式和坡度', 'success')
    this.updateBaseHint()
    this.publishHint()
  }

  private capturePointer(event: PointerEvent) {
    this.activePointerId = event.pointerId
    try {
      this.canvas.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture can fail for synthetic events; dragging still works via window-like canvas events.
    }
  }

  private releasePointer() {
    if (this.activePointerId === null) return
    try {
      this.canvas.releasePointerCapture(this.activePointerId)
    } catch {
      // ignore
    }
    this.activePointerId = null
  }

  private startHandleDrag(ref: HandleRef, event: PointerEvent) {
    const entity = this.state.doc.entities[ref.entityId]
    if (!entity) return
    this.handleDrag = { ref, original: structuredClone(entity) }
    this.handleDragHistory = false
    this.clearGhost()
    this.clearHover()
    this.capturePointer(event)
  }

  private updateHandleDrag(event: PointerEvent) {
    const drag = this.handleDrag
    if (!drag) return
    const entity = this.state.doc.entities[drag.ref.entityId]
    if (!entity) return
    const ground = this.groundPointAt(event.clientX, event.clientY)
    if (!ground) return
    this.shiftDown = event.shiftKey
    const raw: Vec2 = [ground.x, ground.z]
    if (drag.ref.handle === 'wall-endpoint' && entity.kind === 'wall' && drag.ref.end) {
      const snapped = this.computeWallHandlePoint(raw, entity.id)
      const old = entity[drag.ref.end]
      if (dist2(old, snapped.point) < 0.001) return
      if (!this.handleDragHistory) {
        useEditor.getState().beginHistory('调整墙体')
        this.handleDragHistory = true
      }
      useEditor.getState().updateEntity(entity.id, { [drag.ref.end]: snapped.point }, false)
      this.snapLabel = snapped.label
      this.invalidReason = ''
      if (snapped.label) this.showSnapMarker(snapped.point, true)
      else this.hideSnapMarker()
      this.publishHint()
    } else if (drag.ref.handle === 'path-point' && entity.kind === 'path' && typeof drag.ref.index === 'number') {
      const snapped = this.computePathPoint(raw, entity.pathType, entity.id)
      const index = drag.ref.index
      const points = entity.points.map((point) => [point[0], point[1]] as Vec2)
      if (!points[index]) return
      if (dist2(points[index], snapped.point) < 0.001) return
      points[index] = snapped.point
      if (!this.handleDragHistory) {
        useEditor.getState().beginHistory('调整路径')
        this.handleDragHistory = true
      }
      useEditor.getState().updateEntity(entity.id, { points }, false)
      this.snapLabel = snapped.label
      this.invalidReason = ''
      if (snapped.label) this.showSnapMarker(snapped.point, true)
      else this.hideSnapMarker()
      this.publishHint()
    }
  }

  private finishHandleDrag() {
    const drag = this.handleDrag
    if (!drag) return
    this.handleDrag = null
    const entity = this.state.doc.entities[drag.ref.entityId]
    if (this.handleDragHistory && entity) {
      let result = { valid: true, reason: '' }
      if (entity.kind === 'wall') {
        result = checkWallPlacement(
          entity.a,
          entity.b,
          entity.thickness,
          entity.levelId,
          this.allEntities(),
          entity.id,
        )
      } else if (entity.kind === 'path') {
        result = checkPathPlacement(entity, this.allEntities(), entity.id)
      }
      if (!result.valid) {
        useEditor.getState().undo()
        useRuntime.getState().toast(result.reason || '调整后的位置无效，已还原', 'warn')
      }
    }
    this.handleDragHistory = false
    this.hideSnapMarker()
    this.snapLabel = ''
    this.invalidReason = ''
    this.refreshSelection()
    this.updateBaseHint()
    this.publishHint()
  }

  private startSlabDrag(event: PointerEvent) {
    const ground = this.groundPointAt(event.clientX, event.clientY)
    if (!ground) return
    let x = ground.x
    let z = ground.z
    if (this.state.settings.gridSnap && !event.shiftKey) {
      x = snapValue(x, 0.25)
      z = snapValue(z, 0.25)
    }
    this.slabDrag = { start: [x, z], current: [x, z] }
    this.capturePointer(event)
    this.invalidReason = ''
    this.publishHint()
  }

  private onWallClick(event: PointerEvent) {
    const ground = this.groundPointAt(event.clientX, event.clientY)
    if (!ground) return
    const snapped = this.computeWallPoint([ground.x, ground.z])
    this.snapLabel = snapped.label
    if (!this.wallDraft) {
      this.wallDraft = { points: [snapped.point], createdIds: new Set(), historyStarted: false }
      this.refreshDraftMarkers()
      this.showSnapMarker(snapped.point, true)
      this.invalidReason = ''
      this.updateBaseHint()
      this.publishHint()
      return
    }
    const first = this.wallDraft.points[0]
    const last = this.wallDraft.points[this.wallDraft.points.length - 1]
    const closing = this.wallDraft.points.length >= 2 && dist2(snapped.point, first) < 0.05
    if (!closing && dist2(snapped.point, last) < 0.03) return
    const check = checkWallPlacement(
      last,
      snapped.point,
      this.state.toolOptions.wall.thickness,
      this.state.doc.activeLevelId,
      this.allEntities(),
    )
    if (!check.valid) {
      useRuntime.getState().toast(check.reason, 'warn')
      return
    }
    if (!this.wallDraft.historyStarted) {
      useEditor.getState().beginHistory('绘制墙体')
      this.wallDraft.historyStarted = true
    }
    const wall = this.makeWallEntity(last, snapped.point)
    this.wallDraft.createdIds.add(wall.id)
    useEditor.getState().addEntity(wall, false)
    if (closing) {
      this.finishDraft()
      useRuntime.getState().toast('墙体已闭合', 'success')
    } else {
      this.wallDraft.points.push(snapped.point)
      this.refreshDraftMarkers()
      this.updateBaseHint()
      this.publishHint()
    }
    this.showSnapMarker(snapped.point, true)
  }

  private onPathClick(event: PointerEvent) {
    const ground = this.groundPointAt(event.clientX, event.clientY)
    if (!ground) return
    const type = this.state.toolOptions.path.type
    const snapped = this.computePathPoint([ground.x, ground.z], type)
    this.snapLabel = snapped.label
    if (!this.pathDraft) {
      this.pathClosed = false
      this.pathDraft = [snapped.point]
      this.refreshDraftMarkers()
      this.showSnapMarker(snapped.point, true)
      this.invalidReason = ''
      this.updateBaseHint()
      this.publishHint()
      return
    }
    if (snapped.label === '闭合路径') {
      this.pathClosed = true
      this.showSnapMarker(snapped.point, true)
      this.finishDraft()
      return
    }
    const last = this.pathDraft[this.pathDraft.length - 1]
    if (dist2(last, snapped.point) < 0.04) return
    this.pathDraft.push(snapped.point)
    this.refreshDraftMarkers()
    this.showSnapMarker(snapped.point, true)
    this.invalidReason = ''
    this.updateBaseHint()
    this.publishHint()
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.altKey) return
    if (event.button !== 0) return
    this.canvas.focus()
    this.updatePointer(event)
    this.shiftDown = event.shiftKey
    if (this.transformControls.axis) return
    const tool = this.state.tool
    if (tool === 'select') {
      this.clearGhost()
      this.hideSnapMarker()
      this.setHover(null)
      const handle = this.pickHandle(event.clientX, event.clientY)
      if (handle) {
        this.startHandleDrag(handle, event)
        return
      }
      const picked = this.pickEntityAt(event.clientX, event.clientY)
      useEditor.getState().select(picked?.entity.id ?? null)
      return
    }
    if (tool === 'erase') {
      const picked = this.pickEntityAt(event.clientX, event.clientY)
      if (picked) {
        useEditor.getState().removeEntity(picked.entity.id, true)
        this.setHover(null)
        useRuntime.getState().toast('构件已删除', 'info')
      }
      return
    }
    if (tool === 'wall') {
      this.onWallClick(event)
      return
    }
    if (tool === 'path') {
      this.onPathClick(event)
      return
    }
    if (tool === 'slab') {
      this.startSlabDrag(event)
      return
    }
    if (tool === 'object') {
      this.updateObjectPreview(event.clientX, event.clientY)
      this.placeObject()
      return
    }
    if (tool === 'door' || tool === 'window') {
      this.updateOpeningPreview(event.clientX, event.clientY)
      this.placeOpening()
      return
    }
    if (tool === 'roof') {
      this.updateRoofPreview(event.clientX, event.clientY)
      this.placeRoof()
    }
  }

  private onPointerMove = (event: PointerEvent) => {
    if (event.altKey) {
      this.pendingPointerEvent = null
      return
    }
    this.pendingPointerEvent = event
    if (this.pointerMoveFrame) return
    this.pointerMoveFrame = window.requestAnimationFrame(() => {
      this.pointerMoveFrame = 0
      const pending = this.pendingPointerEvent
      this.pendingPointerEvent = null
      if (pending) this.processPointerMove(pending)
    })
  }

  private flushPointerMove() {
    if (this.pointerMoveFrame) {
      window.cancelAnimationFrame(this.pointerMoveFrame)
      this.pointerMoveFrame = 0
    }
    const pending = this.pendingPointerEvent
    this.pendingPointerEvent = null
    if (pending) this.processPointerMove(pending)
  }

  private processPointerMove = (event: PointerEvent) => {
    if (event.altKey) return
    this.shiftDown = event.shiftKey
    if (this.handleDrag) {
      this.updateHandleDrag(event)
      return
    }
    if (this.slabDrag) {
      this.updateSlabDrag(event)
      return
    }
    this.updatePointer(event)
    const tool = this.state.tool
    if (tool === 'select') {
      this.clearGhost()
      this.hideSnapMarker()
      this.snapLabel = ''
      this.invalidReason = ''
      this.updateHover(event.clientX, event.clientY, false)
      this.publishHint()
      return
    }
    if (tool === 'erase') {
      this.clearGhost()
      this.hideSnapMarker()
      this.snapLabel = ''
      this.invalidReason = ''
      this.updateHover(event.clientX, event.clientY, true)
      this.publishHint()
      return
    }
    this.clearHover()
    if (tool === 'door' || tool === 'window') {
      this.updateOpeningPreview(event.clientX, event.clientY)
      return
    }
    const ground = this.groundPointAt(event.clientX, event.clientY)
    if (!ground) {
      this.clearGhost()
      this.hideSnapMarker()
      this.invalidReason = ''
      useRuntime.getState().setCursor(null)
      return
    }
    const now = performance.now()
    if (now - this.lastCursorUpdate > 80) {
      this.lastCursorUpdate = now
      useRuntime.getState().setCursor([round3(ground.x), this.activeElevation(), round3(ground.z)])
    }
    if (tool === 'wall') {
      this.updateWallPreview(event.clientX, event.clientY)
    } else if (tool === 'path') {
      this.updatePathPreview(event.clientX, event.clientY)
    } else if (tool === 'object') {
      this.updateObjectPreview(event.clientX, event.clientY)
    } else if (tool === 'roof') {
      this.updateRoofPreview(event.clientX, event.clientY)
    } else if (tool === 'slab' && !this.slabDrag) {
      this.clearGhost()
      this.hideSnapMarker()
      this.invalidReason = ''
      this.snapLabel = ''
      this.publishHint()
    }
  }

  private onPointerUp = (_event: PointerEvent) => {
    this.flushPointerMove()
    if (this.slabDrag) {
      this.finishSlabDrag()
      this.releasePointer()
    }
    if (this.handleDrag) {
      this.finishHandleDrag()
      this.releasePointer()
    }
    this.activePointerId = null
  }

  private onPointerLeave = () => {
    if (this.slabDrag || this.handleDrag) return
    this.hasPointer = false
    this.clearGhost()
    this.hideSnapMarker()
    this.clearHover()
    this.snapLabel = ''
    useRuntime.getState().setCursor(null)
  }

  private onDoubleClick = (event: MouseEvent) => {
    if (this.wallDraft || this.pathDraft) {
      this.finishDraft()
      return
    }
    if (this.state.tool === 'select') {
      const picked = this.pickEntityAt(event.clientX, event.clientY)
      if (picked) {
        useEditor.getState().select(picked.entity.id)
        window.requestAnimationFrame(() => this.focusSelection())
      }
    }
  }

  private isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName.toLowerCase()
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.isTypingTarget(event.target)) return
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    if (ctrl && key === 'z') {
      event.preventDefault()
      this.cancelDrafts()
      if (event.shiftKey) useEditor.getState().redo()
      else useEditor.getState().undo()
      return
    }
    if (ctrl && key === 'y') {
      event.preventDefault()
      this.cancelDrafts()
      useEditor.getState().redo()
      return
    }
    if (ctrl && key === 'd') {
      event.preventDefault()
      useEditor.getState().duplicateSelected()
      return
    }
    if (ctrl && key === 's') {
      event.preventDefault()
      window.dispatchEvent(new CustomEvent('civitas:save-project'))
      return
    }
    if (ctrl && key === 'o') {
      event.preventDefault()
      window.dispatchEvent(new CustomEvent('civitas:open-project'))
      return
    }
    if (key === 'escape') {
      event.preventDefault()
      if (this.wallDraft || this.pathDraft || this.slabDrag) this.cancelDrafts()
      else if (this.state.tool !== 'select') useEditor.getState().setTool('select')
      else useEditor.getState().select(null)
      useRuntime.getState().setHelpOpen(false)
      return
    }
    if (key === 'enter') {
      event.preventDefault()
      this.finishDraft()
      return
    }
    if (key === 'backspace' || key === 'delete') {
      if (this.pathDraft) {
        event.preventDefault()
        this.pathDraft.pop()
        if (this.pathDraft.length === 0) {
          this.cancelDrafts()
        } else {
          this.refreshDraftMarkers()
          this.clearGhost()
          this.hideSnapMarker()
          this.updateBaseHint()
          this.publishHint()
        }
        return
      }
      if (this.wallDraft) {
        event.preventDefault()
        const created = [...this.wallDraft.createdIds]
        if (created.length > 0) {
          const lastId = created[created.length - 1]
          this.wallDraft.createdIds.delete(lastId)
          useEditor.getState().removeEntity(lastId, false)
          this.wallDraft.points.pop()
          this.refreshDraftMarkers()
          this.clearGhost()
          this.updateBaseHint()
          this.publishHint()
        } else if (this.wallDraft.points.length > 0) {
          this.wallDraft.points.pop()
          this.refreshDraftMarkers()
          if (this.wallDraft.points.length === 0) this.cancelDrafts()
        }
        return
      }
      if (this.state.selectedId) {
        event.preventDefault()
        useEditor.getState().removeEntity(this.state.selectedId, true)
      }
      return
    }
    if (key === 'r') {
      event.preventDefault()
      const selected = this.selectedEntity()
      if (selected && (selected.kind === 'object' || selected.kind === 'slab' || selected.kind === 'roof')) {
        useEditor.getState().beginHistory('旋转构件')
        useEditor
          .getState()
          .updateEntity(selected.id, { rot: selected.rot + Math.PI / 12 }, false)
      } else if (this.state.tool === 'object') {
        this.placementRotation += Math.PI / 12
        this.refreshPreviewFromLastPointer()
      }
      return
    }
    if (key === 'f') {
      event.preventDefault()
      this.focusSelection()
      return
    }
    if (key === '1') {
      this.setTransformMode('translate')
      return
    }
    if (key === '2') {
      this.setTransformMode('rotate')
      return
    }
    if (key === '?') {
      useRuntime.getState().setHelpOpen(!useRuntime.getState().helpOpen)
    }
  }

  // interaction methods appended below
}

function round3(value: number) {
  return Math.round(value * 1000) / 1000
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step
}

function pathTypeName(type: string) {
  if (type === 'road') return '城市道路'
  if (type === 'river') return '河流'
  if (type === 'bridge') return '桥梁'
  if (type === 'footpath') return '人行步道'
  return '围栏'
}
