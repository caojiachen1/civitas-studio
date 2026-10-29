import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { buildWall } from './builders/walls'
import { buildSlab } from './builders/slabs'
import { buildRoof } from './builders/roofs'
import {
  DOOR_STYLES,
  type BuildingEntity,
  type BuildingInterior,
  type BuildingSession,
  type BuildingStyleOverrides,
  type BuildingTemplateId,
  type CustomAsset,
  type EditorDocument,
  type Entity,
  type Level,
  type ObjectEntity,
  type OpeningEntity,
  type RoofEntity,
  type RoofFinish,
  type RoofStyle,
  type SlabEntity,
  type SlabStyle,
  type Vec2,
  type WallEntity,
} from './types'

export interface BuildingTemplate {
  id: BuildingTemplateId
  name: string
  subtitle: string
  width: number
  depth: number
  floors: number
  floorHeight: number
  wallColor: string
  trimColor: string
  slabStyle: SlabStyle
  roofStyle: RoofStyle
  roofFinish: RoofFinish
  windowStyle: string
  doorStyle: string
  stairModel: string
  stairScale: number
  glassy: boolean
}

export const BUILDING_TEMPLATES: BuildingTemplate[] = [
  {
    id: 'villa',
    name: '湖畔别墅',
    subtitle: '两层住宅 · 坡屋顶 · 双开入户门',
    width: 14,
    depth: 10,
    floors: 2,
    floorHeight: 3.2,
    wallColor: '#e8e0d2',
    trimColor: '#d2c8b6',
    slabStyle: 'wood',
    roofStyle: 'gable',
    roofFinish: 'terracotta',
    windowStyle: 'wide',
    doorStyle: 'double',
    stairModel: 'stair-straight',
    stairScale: 0.7,
    glassy: false,
  },
  {
    id: 'townhouse',
    name: '联排住宅',
    subtitle: '三层窄面宽 · 四坡屋顶 · 紧凑楼梯',
    width: 9,
    depth: 11,
    floors: 3,
    floorHeight: 3.2,
    wallColor: '#d6c3a3',
    trimColor: '#b8a78d',
    slabStyle: 'oak',
    roofStyle: 'hip',
    roofFinish: 'slate',
    windowStyle: 'standard',
    doorStyle: 'single',
    stairModel: 'stair-straight',
    stairScale: 0.7,
    glassy: false,
  },
  {
    id: 'office',
    name: '街角办公楼',
    subtitle: '六层办公 · 大玻璃窗 · 中央核心筒',
    width: 18,
    depth: 14,
    floors: 6,
    floorHeight: 3.2,
    wallColor: '#b9b7b0',
    trimColor: '#8f989d',
    slabStyle: 'concrete',
    roofStyle: 'flat',
    roofFinish: 'slate',
    windowStyle: 'picture',
    doorStyle: 'double',
    stairModel: 'stair-l',
    stairScale: 0.7,
    glassy: true,
  },
  {
    id: 'tower',
    name: '城市摩天楼',
    subtitle: '十二层塔楼 · 玻璃幕墙 · 中央楼梯',
    width: 16,
    depth: 16,
    floors: 12,
    floorHeight: 3.2,
    wallColor: '#aab2b6',
    trimColor: '#8f989d',
    slabStyle: 'tile',
    roofStyle: 'flat',
    roofFinish: 'charcoal',
    windowStyle: 'picture',
    doorStyle: 'glass',
    stairModel: 'stair-spiral',
    stairScale: 0.6,
    glassy: true,
  },
]

const buildingIdCounter = { value: 0 }

function bid(prefix: string): string {
  buildingIdCounter.value += 1
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}_${raw}${buildingIdCounter.value.toString(36)}`
}

export function getBuildingTemplate(id: string): BuildingTemplate {
  return BUILDING_TEMPLATES.find((item) => item.id === id) ?? BUILDING_TEMPLATES[0]
}

function makeWall(
  levelId: string,
  a: Vec2,
  b: Vec2,
  height: number,
  thickness: number,
  color: string,
): WallEntity {
  return { id: bid('bwall'), kind: 'wall', levelId, a, b, height, thickness, color }
}

function makeOpening(
  type: 'door' | 'window',
  wall: WallEntity,
  style: string,
  offset: number,
  width: number,
  height: number,
  sill: number,
): OpeningEntity {
  const opening: OpeningEntity = {
    id: bid('bopen'),
    kind: 'opening',
    type,
    wallId: wall.id,
    offset,
    width,
    height,
    sill,
    style,
  }
  if (type === 'door') opening.openAngle = 0
  return opening
}

function wallLength(wall: WallEntity): number {
  return Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
}

function addWindows(
  entities: Entity[],
  wall: WallEntity,
  template: BuildingTemplate,
  skipCenter: number | null,
  windowStyle: string,
): void {
  const length = wallLength(wall)
  const margin = 0.7
  const usable = length - margin * 2
  if (usable < 1.1) return
  const count = Math.max(1, Math.floor(usable / (template.glassy ? 2.7 : 2.9)))
  const spacing = usable / count
  const width = Math.max(0.55, Math.min(template.glassy ? 2.45 : 1.55, spacing - 0.5))
  const height = template.glassy
    ? Math.max(1.7, Math.min(template.floorHeight - 0.8, 2.45))
    : Math.min(1.4, template.floorHeight - 1.2)
  const sill = template.glassy ? 0.28 : 0.95
  for (let i = 0; i < count; i++) {
    const offset = margin + spacing * (i + 0.5)
    if (skipCenter !== null && Math.abs(offset - skipCenter) < width / 2 + 0.9) continue
    entities.push(makeOpening('window', wall, windowStyle, offset, width, height, sill))
  }
}

function shadeColor(hex: string, factor: number): string {
  const raw = hex.replace('#', '')
  const full = raw.length === 3 ? raw.split('').map((char) => char + char).join('') : raw
  const value = Number.parseInt(full, 16)
  if (!Number.isFinite(value)) return hex
  const r = Math.min(255, Math.round(((value >> 16) & 255) * factor))
  const g = Math.min(255, Math.round(((value >> 8) & 255) * factor))
  const b = Math.min(255, Math.round((value & 255) * factor))
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export function createTemplateInterior(
  template: BuildingTemplate,
  floorOverride?: number,
  overrides?: BuildingStyleOverrides,
): BuildingInterior {
  const floors = Math.max(1, Math.min(40, floorOverride ?? template.floors))
  const levels: Level[] = Array.from({ length: floors }, (_, index) => ({
    id: bid('blevel'),
    name: `${index + 1}F`,
    elevation: index * template.floorHeight,
  }))
  const entities: Entity[] = []
  const shellWallIds: string[] = []
  const halfW = template.width / 2
  const halfD = template.depth / 2
  const wallColor = overrides?.wallColor ?? template.wallColor
  const trimColor =
    overrides?.wallColor !== undefined && overrides.wallColor !== template.wallColor
      ? shadeColor(overrides.wallColor, 0.86)
      : template.trimColor
  const windowStyle = overrides?.windowStyle ?? template.windowStyle
  const roofFinish = overrides?.roofFinish ?? template.roofFinish

  for (let floor = 0; floor < floors; floor++) {
    const level = levels[floor]
    const elevation = level.elevation
    const x0 = -halfW
    const x1 = halfW
    const z0 = -halfD
    const z1 = halfD
    let exterior: WallEntity[]
    let entranceWall: WallEntity
    if (template.glassy) {
      const south = makeWall(level.id, [x0, z0], [x1, z0], template.floorHeight, 0.24, wallColor)
      const east = makeWall(level.id, [x1, z0], [x1, z1], template.floorHeight, 0.24, wallColor)
      const north = makeWall(level.id, [x1, z1], [x0, z1], template.floorHeight, 0.24, wallColor)
      const west = makeWall(level.id, [x0, z1], [x0, z0], template.floorHeight, 0.24, wallColor)
      exterior = [south, east, north, west]
      entranceWall = north
    } else {
      // Split the long façades at the partition so room detection sees two closed rooms.
      const southWest = makeWall(level.id, [x0, z0], [0, z0], template.floorHeight, 0.24, wallColor)
      const southEast = makeWall(level.id, [0, z0], [x1, z0], template.floorHeight, 0.24, wallColor)
      const east = makeWall(level.id, [x1, z0], [x1, z1], template.floorHeight, 0.24, wallColor)
      const northEast = makeWall(level.id, [x1, z1], [0, z1], template.floorHeight, 0.24, wallColor)
      const northWest = makeWall(level.id, [0, z1], [x0, z1], template.floorHeight, 0.24, wallColor)
      const west = makeWall(level.id, [x0, z1], [x0, z0], template.floorHeight, 0.24, wallColor)
      exterior = [southWest, southEast, east, northEast, northWest, west]
      entranceWall = northWest
    }
    entities.push(...exterior)
    shellWallIds.push(...exterior.map((wall) => wall.id))

    const slab: SlabEntity = {
      id: bid('bslab'),
      kind: 'slab',
      levelId: level.id,
      x: 0,
      z: 0,
      w: template.width,
      d: template.depth,
      rot: 0,
      thickness: 0.2,
      style: template.slabStyle,
    }
    entities.push(slab)

    const doorStyle = DOOR_STYLES.find((item) => item.id === template.doorStyle) ?? DOOR_STYLES[0]
    const entranceLength = wallLength(entranceWall)
    const doorFits = entranceLength > doorStyle.width + 0.9
    const entranceOffset = entranceLength / 2
    if (floor === 0 && doorFits) {
      entities.push(makeOpening('door', entranceWall, doorStyle.id, entranceOffset, doorStyle.width, doorStyle.height, 0))
    }
    for (const wall of exterior) {
      if (floor === 0 && wall.id === entranceWall.id) {
        addWindows(entities, wall, template, doorFits ? entranceOffset : null, windowStyle)
      } else {
        addWindows(entities, wall, template, null, windowStyle)
      }
    }

    if (template.glassy) {
      const core = 2.15 + (template.id === 'tower' ? 0.35 : 0)
      const coreWalls = [
        makeWall(level.id, [-core, -core], [core, -core], template.floorHeight, 0.18, trimColor),
        makeWall(level.id, [core, -core], [core, core], template.floorHeight, 0.18, trimColor),
        makeWall(level.id, [core, core], [-core, core], template.floorHeight, 0.18, trimColor),
        makeWall(level.id, [-core, core], [-core, -core], template.floorHeight, 0.18, trimColor),
      ]
      entities.push(...coreWalls)
      const coreDoor = DOOR_STYLES.find((item) => item.id === 'single') ?? DOOR_STYLES[0]
      entities.push(
        makeOpening('door', coreWalls[2], coreDoor.id, core, coreDoor.width, coreDoor.height, 0),
      )
    } else {
      const partition = makeWall(
        level.id,
        [0, z0],
        [0, z1],
        template.floorHeight,
        0.12,
        trimColor,
      )
      entities.push(partition)
      if (wallLength(partition) > 2.4) {
        const doorStyle = DOOR_STYLES.find((item) => item.id === 'single') ?? DOOR_STYLES[0]
        entities.push(
          makeOpening('door', partition, doorStyle.id, wallLength(partition) / 2, doorStyle.width, doorStyle.height, 0),
        )
      }
    }

    if (floor < floors - 1) {
      const stair: ObjectEntity = {
        id: bid('bstair'),
        kind: 'object',
        levelId: level.id,
        modelId: template.stairModel,
        x: template.glassy ? 0 : -halfW + 2.2,
        z: template.glassy ? 0 : -halfD + 2.8,
        rot: 0,
        scale: template.stairScale,
      }
      entities.push(stair)
    }

    if (floor === floors - 1) {
      const roof: RoofEntity = {
        id: bid('broof'),
        kind: 'roof',
        levelId: level.id,
        x: 0,
        z: 0,
        w: template.width + 1.1,
        d: template.depth + 1.1,
        rot: 0,
        style: template.roofStyle,
        finish: roofFinish,
        pitch: template.roofStyle === 'flat' ? 0 : 28,
        eaveY: elevation + template.floorHeight + 0.02,
        overhang: 0.5,
      }
      entities.push(roof)
    }
  }

  return {
    levels,
    entities: Object.fromEntries(entities.map((entity) => [entity.id, entity])),
    entityOrder: entities.map((entity) => entity.id),
    shellWallIds,
  }
}

export function createBuildingEntity(
  templateId: BuildingTemplateId,
  levelId: string,
  x: number,
  z: number,
  rot = 0,
  name?: string,
  floors?: number,
  overrides?: BuildingStyleOverrides,
): BuildingEntity {
  const template = getBuildingTemplate(templateId)
  const count = Math.max(1, Math.min(40, floors ?? template.floors))
  return {
    id: bid('building'),
    kind: 'building',
    levelId,
    x,
    z,
    rot,
    templateId: template.id,
    name: name ?? template.name,
    width: template.width,
    depth: template.depth,
    floors: count,
    floorHeight: template.floorHeight,
    interior: createTemplateInterior(template, count, overrides),
  }
}

function rotatePoint(x: number, z: number, rot: number, inverse: boolean): Vec2 {
  const angle = inverse ? -rot : rot
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  if (inverse) return [x * c - z * s, x * s + z * c]
  return [x * c + z * s, -x * s + z * c]
}

function transformEntity(
  entity: Entity,
  building: BuildingEntity,
  baseElevation: number,
  inverse: boolean,
): Entity {
  const mapPoint = (point: Vec2): Vec2 => {
    if (inverse) {
      const [x, z] = rotatePoint(point[0] - building.x, point[1] - building.z, -building.rot, true)
      return [x, z]
    }
    const [x, z] = rotatePoint(point[0], point[1], building.rot, false)
    return [x + building.x, z + building.z]
  }
  if (entity.kind === 'opening') return entity
  if (entity.kind === 'building') return entity
  if (entity.kind === 'wall') return { ...entity, a: mapPoint(entity.a), b: mapPoint(entity.b) }
  if (entity.kind === 'path') {
    return {
      ...entity,
      points: entity.points.map(mapPoint),
    }
  }
  const [x, z] = inverse
    ? rotatePoint(entity.x - building.x, entity.z - building.z, -building.rot, true)
    : (() => {
        const [rx, rz] = rotatePoint(entity.x, entity.z, building.rot, false)
        return [rx + building.x, rz + building.z]
      })()
  const rot = inverse ? entity.rot - building.rot : entity.rot + building.rot
  if (entity.kind === 'object') return { ...entity, x: x as number, z: z as number, rot }
  if (entity.kind === 'slab') return { ...entity, x, z, rot }
  if (entity.kind === 'roof') {
    return { ...entity, x, z, rot, eaveY: inverse ? entity.eaveY - baseElevation : entity.eaveY + baseElevation }
  }
  return entity
}

export function interiorToWorld(
  interior: BuildingInterior,
  building: BuildingEntity,
  baseElevation: number,
  customAssets: CustomAsset[],
): EditorDocument {
  const levels = interior.levels.map((level) => ({ ...level, elevation: level.elevation + baseElevation }))
  const entities = Object.fromEntries(
    Object.entries(interior.entities).map(([id, entity]) => [
      id,
      transformEntity(entity, building, baseElevation, false),
    ]),
  )
  return {
    schemaVersion: 1,
    projectName: building.name,
    levels,
    activeLevelId: levels[0]?.id ?? '',
    entities,
    entityOrder: [...interior.entityOrder],
    customAssets: structuredClone(customAssets),
  }
}

export function worldToInterior(
  doc: EditorDocument,
  building: BuildingEntity,
  baseElevation: number,
): BuildingInterior {
  const levels = doc.levels.map((level) => ({ ...level, elevation: level.elevation - baseElevation }))
  const entities = Object.fromEntries(
    Object.entries(doc.entities).map(([id, entity]) => [
      id,
      transformEntity(entity, building, baseElevation, true),
    ]),
  )
  const shellWallIds = new Set<string>()
  const halfW = building.width / 2
  const halfD = building.depth / 2
  for (const entity of Object.values(entities)) {
    if (entity.kind !== 'wall') continue
    const onX =
      Math.abs(Math.abs(entity.a[0]) - halfW) < 0.45 &&
      Math.abs(Math.abs(entity.b[0]) - halfW) < 0.45
    const onZ =
      Math.abs(Math.abs(entity.a[1]) - halfD) < 0.45 &&
      Math.abs(Math.abs(entity.b[1]) - halfD) < 0.45
    if (onX || onZ) shellWallIds.add(entity.id)
  }
  for (const id of building.interior.shellWallIds) {
    if (entities[id]?.kind === 'wall') shellWallIds.add(id)
  }
  return {
    levels,
    entities,
    entityOrder: [...doc.entityOrder],
    shellWallIds: [...shellWallIds],
  }
}

export function cityDocWithInterior(
  session: BuildingSession,
  worldDoc: EditorDocument,
): EditorDocument {
  const city = structuredClone(session.cityDoc)
  const building = city.entities[session.buildingId]
  if (building?.kind === 'building') {
    const interior = worldToInterior(worldDoc, building, session.baseElevation)
    city.entities[session.buildingId] = {
      ...building,
      interior,
      floors: interior.levels.length,
    }
  }
  const assets = new Map(city.customAssets.map((asset) => [asset.id, asset]))
  for (const asset of worldDoc.customAssets) assets.set(asset.id, asset)
  city.customAssets = [...assets.values()]
  return city
}

function normalizeGeometry(source: THREE.BufferGeometry): THREE.BufferGeometry | null {
  let geometry = source.index ? source.toNonIndexed() : source.clone()
  for (const name of Object.keys(geometry.attributes)) {
    if (!['position', 'normal', 'uv'].includes(name)) geometry.deleteAttribute(name)
  }
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals()
  if (!geometry.getAttribute('uv')) {
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(geometry.getAttribute('position').count * 2), 2),
    )
  }
  return geometry
}

function mergeBuildingParts(source: THREE.Group): THREE.Group {
  source.updateMatrixWorld(true)
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>()
  source.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const material = Array.isArray(child.material) ? child.material[0] : child.material
    if (!material) return
    const geometry = normalizeGeometry(child.geometry)
    if (!geometry) return
    geometry.applyMatrix4(child.matrixWorld)
    const bucket = buckets.get(material)
    if (bucket) bucket.push(geometry)
    else buckets.set(material, [geometry])
  })
  const group = new THREE.Group()
  for (const [material, geometries] of buckets) {
    const merged = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries, false)
    if (!merged) continue
    const mesh = new THREE.Mesh(merged, material)
    mesh.castShadow = !material.transparent
    mesh.receiveShadow = true
    group.add(mesh)
    if (geometries.length > 1) geometries.forEach((geometry) => geometry.dispose())
  }
  return group
}

export function buildBuildingShell(building: BuildingEntity): THREE.Group {
  const interior = building.interior
  const shellIds = new Set(interior.shellWallIds)
  const source = new THREE.Group()
  const levelById = new Map(interior.levels.map((level) => [level.id, level]))
  for (const entity of Object.values(interior.entities)) {
    if (entity.kind === 'wall' && shellIds.has(entity.id)) {
      const level = levelById.get(entity.levelId)
      const openings = Object.values(interior.entities).filter(
        (item): item is OpeningEntity => item.kind === 'opening' && item.wallId === entity.id,
      )
      source.add(buildWall(entity, openings, level?.elevation ?? 0))
    } else if (entity.kind === 'slab') {
      const level = levelById.get(entity.levelId)
      source.add(buildSlab(entity, level?.elevation ?? 0))
    } else if (entity.kind === 'roof') {
      source.add(buildRoof(entity))
    }
  }
  const merged = mergeBuildingParts(source)
  if (merged.children.length === 0) {
    const material = new THREE.MeshStandardMaterial({ color: '#c8c4ba', roughness: 0.82 })
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(building.width, building.floors * building.floorHeight, building.depth),
      material,
    )
    body.position.y = (building.floors * building.floorHeight) / 2
    body.castShadow = true
    body.receiveShadow = true
    merged.add(body)
  }
  merged.name = 'building-shell'
  return merged
}

export function buildingHeight(building: BuildingEntity): number {
  return building.floors * building.floorHeight + 0.9
}

/** Door side of every template points to +Z in local space. */
export function buildingEntrance(building: BuildingEntity): { x: number; z: number; dirX: number; dirZ: number } {
  const dirX = Math.sin(building.rot)
  const dirZ = Math.cos(building.rot)
  const levelId = building.interior.levels[0]?.id
  let localX = 0
  if (levelId) {
    const northWalls = new Set<string>()
    for (const entity of Object.values(building.interior.entities)) {
      if (
        entity.kind === 'wall' &&
        entity.levelId === levelId &&
        Math.abs(entity.a[1] - building.depth / 2) < 0.35 &&
        Math.abs(entity.b[1] - building.depth / 2) < 0.35
      ) {
        northWalls.add(entity.id)
      }
    }
    for (const entity of Object.values(building.interior.entities)) {
      if (entity.kind !== 'opening' || entity.type !== 'door' || !northWalls.has(entity.wallId)) continue
      const wall = building.interior.entities[entity.wallId]
      if (wall?.kind !== 'wall') continue
      const length = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1]) || 1
      localX = wall.a[0] + (wall.b[0] - wall.a[0]) * Math.min(1, Math.max(0, entity.offset / length))
      break
    }
  }
  const localZ = building.depth / 2
  return {
    x: building.x + localX * Math.cos(building.rot) + localZ * Math.sin(building.rot),
    z: building.z - localX * Math.sin(building.rot) + localZ * Math.cos(building.rot),
    dirX,
    dirZ,
  }
}

export function buildingFromDoc(doc: EditorDocument, id: string): BuildingEntity | null {
  const entity = doc.entities[id]
  return entity?.kind === 'building' ? entity : null
}
