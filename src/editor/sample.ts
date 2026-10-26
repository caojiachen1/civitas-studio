import {
  DOOR_STYLES,
  WINDOW_STYLES,
  type EditorDocument,
  type Entity,
  type Level,
  type ObjectEntity,
  type OpeningEntity,
  type PathEntity,
  type RoofEntity,
  type SlabEntity,
  type Vec2,
  type ViewState,
  type WallEntity,
} from './types'

const LEVEL = 'level-0'

function wall(id: string, a: Vec2, b: Vec2, color = '#e8e0d2'): WallEntity {
  return { id, kind: 'wall', levelId: LEVEL, a, b, height: 3.2, thickness: 0.16, color }
}

function opening(
  id: string,
  type: 'door' | 'window',
  styleId: string,
  wallId: string,
  offset: number,
  extra: Partial<OpeningEntity> = {},
): OpeningEntity {
  const list = type === 'door' ? DOOR_STYLES : WINDOW_STYLES
  const style = list.find((item) => item.id === styleId) ?? list[0]
  return {
    id,
    kind: 'opening',
    type,
    wallId,
    offset,
    width: style.width,
    height: style.height,
    sill: type === 'window' ? (style as { sill: number }).sill : 0,
    style: style.id,
    ...extra,
  }
}

function object(id: string, modelId: string, x: number, z: number, rot = 0, scale = 1): ObjectEntity {
  return { id, kind: 'object', levelId: LEVEL, modelId, x, z, rot, scale }
}

function slab(id: string, x: number, z: number, w: number, d: number, style: SlabEntity['style']): SlabEntity {
  return { id, kind: 'slab', levelId: LEVEL, x, z, w, d, rot: 0, thickness: 0.2, style }
}

function roof(x: number, z: number, w: number, d: number): RoofEntity {
  return {
    id: 'sample-roof-main',
    kind: 'roof',
    levelId: LEVEL,
    x,
    z,
    w,
    d,
    rot: 0,
    style: 'gable',
    finish: 'slate',
    pitch: 27,
    eaveY: 3.22,
    overhang: 0.5,
  }
}

function path(
  id: string,
  pathType: PathEntity['pathType'],
  points: Vec2[],
  options: Partial<PathEntity> = {},
): PathEntity {
  return {
    id,
    kind: 'path',
    levelId: LEVEL,
    pathType,
    points,
    width: pathType === 'river' ? 9 : pathType === 'footpath' ? 2.1 : pathType === 'fence' ? 0.16 : 7.2,
    style: pathType === 'river' ? 'river' : pathType === 'fence' ? 'hedge' : pathType === 'footpath' ? 'stone' : 'urban',
    sidewalk: pathType === 'road',
    lanes: 2,
    bridgeHeight: 2.6,
    railings: pathType === 'bridge',
    ...options,
  }
}

export function createSampleDocument(): EditorDocument {
  const level: Level = { id: LEVEL, name: '一层 · 湖畔住宅', elevation: 0 }
  const entities: Entity[] = []

  const walls: WallEntity[] = [
    wall('sample-wall-north', [-9, -5], [9, -5]),
    wall('sample-wall-east', [9, -5], [9, 5]),
    wall('sample-wall-south', [-9, 5], [9, 5]),
    wall('sample-wall-west', [-9, 5], [-9, -5]),
    wall('sample-wall-living-bedroom', [-2, -5], [-2, 1], '#a8b5a1'),
    wall('sample-wall-bedroom-east', [3.5, -5], [3.5, 1], '#d6c3a3'),
  ]
  entities.push(...walls)

  const openings: OpeningEntity[] = [
    opening('sample-win-n1', 'window', 'wide', 'sample-wall-north', 3),
    opening('sample-win-n2', 'window', 'picture', 'sample-wall-north', 9),
    opening('sample-win-n3', 'window', 'wide', 'sample-wall-north', 15),
    opening('sample-win-e1', 'window', 'standard', 'sample-wall-east', 3),
    opening('sample-win-e2', 'window', 'standard', 'sample-wall-east', 7),
    opening('sample-door-south', 'door', 'sliding', 'sample-wall-south', 9, { openAngle: 100 }),
    opening('sample-win-s1', 'window', 'wide', 'sample-wall-south', 4),
    opening('sample-win-s2', 'window', 'wide', 'sample-wall-south', 15),
    opening('sample-win-w1', 'window', 'standard', 'sample-wall-west', 2.5),
    opening('sample-win-w2', 'window', 'standard', 'sample-wall-west', 7),
    opening('sample-door-living', 'door', 'single', 'sample-wall-living-bedroom', 4.4, {
      openAngle: 58,
      hinge: 'left',
    }),
    opening('sample-door-bedroom', 'door', 'single', 'sample-wall-bedroom-east', 4.4, {
      openAngle: 58,
      hinge: 'right',
    }),
  ]
  entities.push(...openings)

  entities.push(slab('sample-floor-main', 0, 0, 17.85, 9.85, 'wood'))
  entities.push(slab('sample-deck', 3, 7.2, 8.2, 4.4, 'deck'))
  entities.push(roof(0, 0, 19.25, 11.25))

  const furniture: ObjectEntity[] = [
    object('sample-sofa', 'sofa-3', -5.4, -4.32, 0),
    object('sample-rug', 'rug-rect', -5.4, -1.6, 0),
    object('sample-coffee', 'coffee-table', -5.4, -1.5, 0),
    object('sample-armchair', 'armchair', -8.25, 0.8, Math.PI / 2),
    object('sample-tv-console', 'tv-console', -5.4, 4.58, Math.PI),
    object('sample-fireplace', 'fireplace', -8.15, -4.7, 0),
    object('sample-floor-lamp', 'floor-lamp', -3.05, -3.95, 0),
    object('sample-plant-living', 'potted-plant', -2.6, 4.15, 0),
    object('sample-plant-living-2', 'potted-plant', -8.65, 3.85, 0),

    object('sample-kitchen-counter', 'kitchen-counter', -1.0, -4.58, 0),
    object('sample-kitchen-sink', 'sink-unit', 0.8, -4.58, 0),
    object('sample-kitchen-stove', 'stove', 2.0, -4.58, 0),
    object('sample-fridge', 'fridge', 2.92, -4.58, 0),
    object('sample-island', 'kitchen-island', 0.7, 0.35, 0),
    object('sample-stool-1', 'bar-stool', 0.0, 1.42, Math.PI),
    object('sample-stool-2', 'bar-stool', 1.4, 1.42, Math.PI),
    object('sample-dining', 'dining-table', 0.7, 3.2, 0),
    object('sample-chair-1', 'dining-chair', -0.55, 3.2, Math.PI / 2),
    object('sample-chair-2', 'dining-chair', 1.95, 3.2, -Math.PI / 2),
    object('sample-chair-3', 'dining-chair', 0.7, 2.2, 0),
    object('sample-chair-4', 'dining-chair', 0.7, 4.2, Math.PI),
    object('sample-plant-kitchen', 'potted-plant', 3.1, 4.35, 0),

    object('sample-bed', 'bed-double', 6.3, -3.8, 0),
    object('sample-nightstand-1', 'nightstand', 5.05, -4.6, 0),
    object('sample-nightstand-2', 'nightstand', 7.55, -4.6, 0),
    object('sample-wardrobe', 'wardrobe', 8.62, 0.2, -Math.PI / 2),
    object('sample-dresser', 'dresser', 6.3, 4.58, Math.PI),
    object('sample-plant-bedroom', 'potted-plant', 8.5, 3.75, 0),

    object('sample-patio-table', 'patio-table', 3.0, 7.2, 0),
    object('sample-garden-chair-1', 'garden-chair', 1.75, 7.2, Math.PI / 2),
    object('sample-garden-chair-2', 'garden-chair', 4.25, 7.2, -Math.PI / 2),
    object('sample-umbrella', 'patio-umbrella', 3.0, 7.2, 0),
    object('sample-planter-1', 'planter-box', -0.2, 8.7, 0),
    object('sample-planter-2', 'planter-box', 6.2, 8.7, 0),

    object('sample-oak', 'tree-oak', -13.5, -6.5, 0.4),
    object('sample-pine', 'tree-pine', -14.5, 3.5, 0),
    object('sample-maple', 'tree-maple', 13.8, -5.5, 0.7),
    object('sample-palm', 'tree-palm', 12.6, 8.0, 0.2),
    object('sample-bush-1', 'bush-round', -10.2, 6.0, 0),
    object('sample-bush-2', 'bush-round', 10.0, 5.6, 0),
    object('sample-flower-1', 'flower-bed', -1.0, 9.7, 0),
    object('sample-flower-2', 'flower-bed', 3.2, 10.2, 0),
    object('sample-grass-1', 'grass-tuft', -3.0, 11.0, 0),
    object('sample-grass-2', 'grass-tuft', -6.5, 9.6, 0),
    object('sample-grass-3', 'grass-tuft', 8.0, 10.6, 0),
    object('sample-river-tree-1', 'tree-birch', -25, 23.5, 0.3),
    object('sample-river-tree-2', 'tree-oak', 7.5, 24.0, 1.2),
    object('sample-river-bush', 'bush-round', -7.0, 23.3, 0),
    object('sample-bench-river', 'bench-park', -7.5, 23.8, 0.2),
    object('sample-trash', 'trash-bin', -4.8, 23.4, 0),
    object('sample-fountain', 'fountain', 14.0, 12.5, 0),
    object('sample-bench-park', 'bench-park', 10.9, 12.2, Math.PI / 2),
    object('sample-plant-park', 'bush-round', 16.5, 10.5, 0),
    object('sample-streetlight-1', 'streetlight', -1.5, 19.4, 0),
    object('sample-streetlight-2', 'streetlight', 17.0, 16.2, Math.PI),
    object('sample-sedan', 'car-sedan', -10.0, 15.1, -0.22),
    object('sample-suv', 'car-suv', 19.5, 13.3, -0.12),
    object('sample-boat', 'boat', 4.0, 29.0, 0.9),
  ]
  entities.push(...furniture)

  const paths: PathEntity[] = [
    path('sample-road', 'road', [
      [-44, 20],
      [-24, 14],
      [-4, 16],
      [14, 12],
      [34, 17],
      [46, 22],
    ]),
    path('sample-river', 'river', [
      [-48, 30],
      [-24, 26],
      [0, 30],
      [25, 27],
      [48, 32],
    ]),
    path('sample-bridge', 'bridge', [
      [-17, 21.5],
      [-17, 27],
      [-17, 35.5],
    ], { width: 6.4, bridgeHeight: 2.6, sidewalk: false, railings: true, lanes: 2 }),
    path('sample-footpath-house', 'footpath', [
      [1.5, 9.4],
      [1.2, 11.5],
      [-3, 12.8],
      [-9, 14.2],
    ]),
    path('sample-footpath-bridge', 'footpath', [
      [-14, 17.8],
      [-16.5, 19.5],
      [-17, 21.5],
    ], { width: 1.9 }),
    path('sample-hedge-back', 'fence', [
      [-9.6, -6.2],
      [-3, -6.4],
      [3, -6.3],
      [9.6, -6.1],
    ], { style: 'hedge', width: 0.16 }),
    path('sample-fence-east', 'fence', [
      [10.6, -8.5],
      [10.4, -2],
      [10.7, 4],
    ], { style: 'wood' }),
    path('sample-footpath-park', 'footpath', [
      [7.0, 9.6],
      [9.0, 10.7],
      [11.5, 11.0],
    ], { width: 1.6 }),
  ]
  entities.push(...paths)

  const entityMap: Record<string, Entity> = {}
  const order: string[] = []
  for (const entity of entities) {
    if (entityMap[entity.id]) continue
    entityMap[entity.id] = entity
    order.push(entity.id)
  }

  return {
    schemaVersion: 1,
    projectName: '湖畔之家 · Lakeside Residence',
    levels: [level],
    activeLevelId: LEVEL,
    entities: entityMap,
    entityOrder: order,
    customAssets: [],
  }
}

export const SAMPLE_VIEW: ViewState = {
  target: [0.5, 1.0, 10],
  distance: 44,
  azimuth: 0.34,
  polar: 1.02,
}
