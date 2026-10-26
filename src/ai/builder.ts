import {
  DOOR_STYLES,
  LEVEL_HEIGHT,
  WINDOW_STYLES,
  type EditorDocument,
  type Entity,
  type ObjectEntity,
  type OpeningEntity,
  type PathEntity,
  type RoofEntity,
  type SlabEntity,
  type Vec2,
  type WallEntity,
} from '../editor/types'
import { useEditor, uid } from '../editor/store'
import { getModel, getModelFootprints } from '../models/registry'
import {
  checkObjectPlacement,
  checkOpeningPlacement,
  checkPathPlacement,
  objectOBB,
  wallOBB,
} from '../editor/validation'
import { distanceToPathCenter, getPathBundle, isPointOnWater, obbOverlap } from '../editor/geom'

export class SceneBuilder {
  doc: EditorDocument
  levelId: string
  elevation: number
  entities: Entity[]
  newEntities: Entity[] = []
  footprints: Map<string, [number, number]>
  warnings: string[] = []

  constructor(doc: EditorDocument, levelId: string) {
    this.doc = doc
    this.levelId = levelId
    this.elevation = doc.levels.find((level) => level.id === levelId)?.elevation ?? 0
    this.entities = Object.values(doc.entities).filter(
      (entity) => entity.kind === 'opening' || entity.levelId === levelId,
    )
    this.footprints = getModelFootprints()
    for (const asset of doc.customAssets) this.footprints.set(asset.id, asset.footprint)
  }

  private addRaw<T extends Entity>(entity: T): T {
    this.entities.push(entity)
    this.newEntities.push(entity)
    return entity
  }

  addWall(a: Vec2, b: Vec2, color = '#e8e0d2', height = LEVEL_HEIGHT, thickness = 0.16): WallEntity {
    return this.addRaw<WallEntity>({
      id: uid('ai-wall'),
      kind: 'wall',
      levelId: this.levelId,
      a,
      b,
      height,
      thickness,
      color,
    })
  }

  addOpening(
    type: 'door' | 'window',
    wall: WallEntity,
    styleId: string,
    offset: number,
  ): OpeningEntity | null {
    const styles = type === 'door' ? DOOR_STYLES : WINDOW_STYLES
    const style = styles.find((item) => item.id === styleId) ?? styles[0]
    const length = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
    const width = style.width
    const height = style.height
    const sill = type === 'window' ? (style as { sill: number }).sill : 0
    const clamped = Math.min(length - width / 2 - 0.1, Math.max(width / 2 + 0.1, offset))
    const openings = this.entities.filter(
      (entity): entity is OpeningEntity => entity.kind === 'opening' && entity.wallId === wall.id,
    )
    const check = checkOpeningPlacement(wall, clamped, width, height, sill, openings)
    if (!check.valid) {
      this.warnings.push(`${style.name}未放置：${check.reason}`)
      return null
    }
    return this.addRaw<OpeningEntity>({
      id: uid('ai-opening'),
      kind: 'opening',
      type,
      wallId: wall.id,
      offset: clamped,
      width,
      height,
      sill,
      style: style.id,
    })
  }

  addSlab(
    center: Vec2,
    width: number,
    depth: number,
    style: SlabEntity['style'],
    thickness = 0.2,
  ): SlabEntity {
    return this.addRaw<SlabEntity>({
      id: uid('ai-slab'),
      kind: 'slab',
      levelId: this.levelId,
      x: center[0],
      z: center[1],
      w: width,
      d: depth,
      rot: 0,
      thickness,
      style,
    })
  }

  addRoof(
    center: Vec2,
    width: number,
    depth: number,
    eaveY: number,
    style: RoofEntity['style'] = 'gable',
    finish: RoofEntity['finish'] = 'terracotta',
    pitch = 28,
    rot = 0,
  ): RoofEntity {
    return this.addRaw<RoofEntity>({
      id: uid('ai-roof'),
      kind: 'roof',
      levelId: this.levelId,
      x: center[0],
      z: center[1],
      w: width,
      d: depth,
      rot,
      style,
      finish,
      pitch,
      eaveY,
      overhang: 0.45,
    })
  }

  addObject(modelId: string, x: number, z: number, rot = 0, scale = 1): ObjectEntity | null {
    const model = getModel(modelId)
    if (!model) {
      this.warnings.push(`找不到模型 ${modelId}`)
      return null
    }
    const check = checkObjectPlacement(
      model,
      x,
      z,
      rot,
      scale,
      this.levelId,
      this.entities,
      this.footprints,
    )
    if (!check.valid) return null
    return this.addRaw<ObjectEntity>({
      id: uid('ai-obj'),
      kind: 'object',
      levelId: this.levelId,
      modelId,
      x,
      z,
      rot,
      scale,
    })
  }

  addPath(entity: Omit<PathEntity, 'id' | 'levelId'>): PathEntity | null {
    const path: PathEntity = {
      ...entity,
      id: uid('ai-path'),
      kind: 'path',
      levelId: this.levelId,
    }
    const check = checkPathPlacement(path, this.entities)
    if (!check.valid) {
      this.warnings.push(
        `${path.pathType === 'river' ? '河流' : path.pathType === 'bridge' ? '桥梁' : '路径'}未创建：${check.reason}`,
      )
      return null
    }
    return this.addRaw(path)
  }

  commit(): number {
    if (this.newEntities.length === 0) return 0
    useEditor.getState().addEntities(this.newEntities, false)
    const count = this.newEntities.length
    this.newEntities = []
    return count
  }

  createdIds(): string[] {
    return this.newEntities.map((entity) => entity.id)
  }

  sameLevelEntities(): Entity[] {
    return this.entities.filter((entity) => entity.kind === 'opening' || entity.levelId === this.levelId)
  }

  isAreaFree(cx: number, cz: number, width: number, depth: number, clearance = 0.5): boolean {
    if (Math.abs(cx) + width / 2 > 270 || Math.abs(cz) + depth / 2 > 270) return false
    const area = { x: cx, z: cz, hw: width / 2, hd: depth / 2, rot: 0 }
    const halfW = width / 2
    const halfD = depth / 2
    const points: Vec2[] = [
      [cx - halfW, cz - halfD],
      [cx + halfW, cz - halfD],
      [cx + halfW, cz + halfD],
      [cx - halfW, cz + halfD],
      [cx, cz],
    ]
    const levelEntities = this.sameLevelEntities()
    for (const point of points) {
      if (isPointOnWater(point[0], point[1], levelEntities, clearance)) return false
    }
    for (const entity of levelEntities) {
      if (entity.kind === 'wall') {
        if (obbOverlap(area, wallOBB(entity), clearance)) return false
      } else if (entity.kind === 'object') {
        const model = getModel(entity.modelId)
        if (model?.noCollide) continue
        const fp = this.footprints.get(entity.modelId)
        if (!fp) continue
        if (
          obbOverlap(
            area,
            objectOBB(entity.x, entity.z, entity.rot, fp[0], fp[1], entity.scale),
            clearance,
          )
        ) {
          return false
        }
      } else if (entity.kind === 'slab' || entity.kind === 'roof') {
        const other = { x: entity.x, z: entity.z, hw: entity.w / 2, hd: entity.d / 2, rot: entity.rot }
        if (obbOverlap(area, other, clearance)) return false
      }
    }
    for (const entity of levelEntities) {
      if (entity.kind !== 'path') continue
      const bundle = getPathBundle(entity)
      const extra = entity.width / 2 + clearance
      for (const sample of bundle.samples) {
        if (
          Math.abs(sample.pos.x - cx) <= halfW + extra &&
          Math.abs(sample.pos.z - cz) <= halfD + extra
        ) {
          return false
        }
      }
    }
    return true
  }

  findFreeArea(anchor: Vec2, width: number, depth: number, clearance = 0.8): Vec2 | null {
    if (this.isAreaFree(anchor[0], anchor[1], width, depth, clearance)) return [anchor[0], anchor[1]]
    const step = 6
    const angles = 12
    for (let radius = step; radius <= 120; radius += step) {
      for (let i = 0; i < angles; i++) {
        const angle = (i / angles) * Math.PI * 2 + radius * 0.17
        const x = anchor[0] + Math.cos(angle) * radius
        const z = anchor[1] + Math.sin(angle) * radius
        if (this.isAreaFree(x, z, width, depth, clearance)) return [x, z]
      }
    }
    return null
  }

  nearestRiver(anchor: Vec2, maxDistance = 100): PathEntity | null {
    let best: { entity: PathEntity; distance: number } | null = null
    for (const entity of this.sameLevelEntities()) {
      if (entity.kind !== 'path' || entity.pathType !== 'river') continue
      const distance = distanceToPathCenter(anchor[0], anchor[1], entity)
      if (distance < maxDistance && (!best || distance < best.distance)) {
        best = { entity, distance }
      }
    }
    return best?.entity ?? null
  }
}
