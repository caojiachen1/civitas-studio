import type { SlabEntity, Vec2 } from '../editor/types'
import { getModel } from '../models/registry'
import type { SceneBuilder } from './builder'
import type { AiRoomType } from './types'

export interface RoomFrame {
  cx: number
  cz: number
  width: number
  depth: number
  rot: number
}

export interface LayoutItem {
  modelId: string
  lx: number
  lz: number
  rot: number
  scale?: number
}

function localToWorld(room: RoomFrame, lx: number, lz: number): Vec2 {
  const c = Math.cos(room.rot)
  const s = Math.sin(room.rot)
  return [room.cx + lx * c + lz * s, room.cz - lx * s + lz * c]
}

export function placeLayout(builder: SceneBuilder, room: RoomFrame, items: LayoutItem[]): number {
  let count = 0
  for (const item of items) {
    const [x, z] = localToWorld(room, item.lx, item.lz)
    const placed = builder.addObject(item.modelId, x, z, item.rot + room.rot, item.scale ?? 1)
    if (placed) count++
  }
  return count
}

function footprint(modelId: string): [number, number] {
  return getModel(modelId)?.footprint ?? [1, 1]
}

const T = 0.16
const GAP = 0.035

function northZ(depth: number, modelDepth: number) {
  return -depth / 2 + T + GAP + modelDepth / 2
}

function southZ(depth: number, modelDepth: number) {
  return depth / 2 - T - GAP - modelDepth / 2
}

function westX(width: number, modelDepth: number) {
  return -width / 2 + T + GAP + modelDepth / 2
}

function eastX(width: number, modelDepth: number) {
  return width / 2 - T - GAP - modelDepth / 2
}

function livingItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  if (width >= 3.5 && depth >= 3.2) items.push({ modelId: 'rug-rect', lx: 0, lz: 0.1, rot: 0 })
  const sofaD = footprint('sofa-3')[1]
  if (width >= 2.8) items.push({ modelId: 'sofa-3', lx: 0, lz: northZ(depth, sofaD), rot: 0 })
  const coffeeD = footprint('coffee-table')[1]
  items.push({
    modelId: 'coffee-table',
    lx: 0,
    lz: northZ(depth, sofaD) + sofaD / 2 + coffeeD / 2 + 0.55,
    rot: 0,
  })
  const armD = footprint('armchair')[1]
  if (width >= 5.8) items.push({ modelId: 'armchair', lx: westX(width, armD), lz: 0.4, rot: Math.PI / 2 })
  const tvD = footprint('tv-console')[1]
  if (width >= 5.2) {
    const offset = Math.min(width * 0.27, width / 2 - footprint('tv-console')[0] / 2 - 0.4)
    items.push({ modelId: 'tv-console', lx: offset, lz: southZ(depth, tvD), rot: Math.PI })
  }
  items.push({ modelId: 'floor-lamp', lx: -width * 0.36, lz: -depth * 0.22, rot: 0 })
  items.push({ modelId: 'potted-plant', lx: width * 0.38, lz: -depth * 0.35, rot: 0 })
  return items
}

function bedroomItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  const bed = footprint('bed-double')
  if (width >= 2.4 && depth >= 2.8) {
    items.push({ modelId: 'bed-double', lx: 0, lz: northZ(depth, bed[1]), rot: 0 })
  }
  const night = footprint('nightstand')
  if (width >= 3.3) {
    const offset = Math.min(width / 2 - 0.45, bed[0] / 2 + night[0] / 2 + 0.25)
    items.push({ modelId: 'nightstand', lx: -offset, lz: northZ(depth, night[1]), rot: 0 })
    items.push({ modelId: 'nightstand', lx: offset, lz: northZ(depth, night[1]), rot: 0 })
  }
  const wardrobe = footprint('wardrobe')
  if (depth >= 3.4 && width >= 3.0) {
    items.push({ modelId: 'wardrobe', lx: eastX(width, wardrobe[1]), lz: 0.6, rot: -Math.PI / 2 })
  }
  const dresser = footprint('dresser')
  if (width >= 3.6) {
    items.push({ modelId: 'dresser', lx: westX(width, dresser[1]), lz: 0.25, rot: Math.PI / 2 })
  }
  items.push({ modelId: 'potted-plant', lx: width * 0.36, lz: depth * 0.36, rot: 0 })
  return items
}

function kitchenItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  const sequence = [
    { id: 'kitchen-counter', w: footprint('kitchen-counter')[0] },
    { id: 'sink-unit', w: footprint('sink-unit')[0] },
    { id: 'stove', w: footprint('stove')[0] },
    { id: 'fridge', w: footprint('fridge')[0] },
  ]
  const usable = width - T * 2 - 0.4
  const chosen: { id: string; w: number }[] = []
  let used = 0
  for (const entry of sequence) {
    if (used + entry.w <= usable) {
      chosen.push(entry)
      used += entry.w + 0.04
    }
  }
  let x = -used / 2 + 0.02
  for (const entry of chosen) {
    const d = footprint(entry.id)[1]
    items.push({ modelId: entry.id, lx: x + entry.w / 2, lz: northZ(depth, d), rot: 0 })
    x += entry.w + 0.05
  }
  const island = footprint('kitchen-island')
  if (width >= 4.8 && depth >= 4.1) {
    items.push({ modelId: 'kitchen-island', lx: 0, lz: 0.2, rot: 0 })
    const stoolD = footprint('bar-stool')[1]
    items.push({
      modelId: 'bar-stool',
      lx: -0.55,
      lz: 0.2 + island[1] / 2 + stoolD / 2 + 0.4,
      rot: Math.PI,
    })
    items.push({
      modelId: 'bar-stool',
      lx: 0.55,
      lz: 0.2 + island[1] / 2 + stoolD / 2 + 0.4,
      rot: Math.PI,
    })
  }
  return items
}

function diningItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  const table = footprint('dining-table')
  if (width >= 3.2 && depth >= 3.0) items.push({ modelId: 'dining-table', lx: 0, lz: 0.1, rot: 0 })
  const chair = footprint('dining-chair')
  if (width >= 4.2) {
    items.push({
      modelId: 'dining-chair',
      lx: -table[0] / 2 - chair[0] / 2 - 0.25,
      lz: 0.1,
      rot: Math.PI / 2,
    })
    items.push({
      modelId: 'dining-chair',
      lx: table[0] / 2 + chair[0] / 2 + 0.25,
      lz: 0.1,
      rot: -Math.PI / 2,
    })
  }
  if (depth >= 3.8) {
    items.push({ modelId: 'dining-chair', lx: 0, lz: 0.1 - table[1] / 2 - chair[1] / 2 - 0.25, rot: 0 })
    items.push({ modelId: 'dining-chair', lx: 0, lz: 0.1 + table[1] / 2 + chair[1] / 2 + 0.25, rot: Math.PI })
  }
  const sideboard = footprint('sideboard')
  if (width >= 4.6) items.push({ modelId: 'sideboard', lx: eastX(width, sideboard[1]), lz: 0.2, rot: -Math.PI / 2 })
  items.push({ modelId: 'potted-plant', lx: -width * 0.36, lz: depth * 0.36, rot: 0 })
  return items
}

function bathroomItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  const toilet = footprint('toilet')
  if (width >= 2.4) items.push({ modelId: 'toilet', lx: westX(width, toilet[1]), lz: -0.4, rot: Math.PI / 2 })
  const vanity = footprint('vanity-mirror')
  if (width >= 2.8) items.push({ modelId: 'vanity-mirror', lx: 0, lz: northZ(depth, vanity[1]), rot: 0 })
  const tub = footprint('bathtub')
  if (width >= 3.8 && depth >= 2.6) {
    items.push({ modelId: 'bathtub', lx: eastX(width, tub[1]), lz: 0.5, rot: -Math.PI / 2 })
  } else if (width >= 2.6 && depth >= 3.0) {
    items.push({ modelId: 'shower', lx: width * 0.22, lz: depth * 0.2, rot: 0 })
  }
  if (width >= 3.0) items.push({ modelId: 'towel-rack', lx: -width * 0.32, lz: depth * 0.3, rot: 0 })
  return items
}

function officeItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  const desk = footprint('desk')
  if (width >= 2.8) items.push({ modelId: 'desk', lx: 0, lz: northZ(depth, desk[1]), rot: 0 })
  const chair = footprint('office-chair')
  items.push({
    modelId: 'office-chair',
    lx: 0,
    lz: northZ(depth, desk[1]) + desk[1] / 2 + chair[1] / 2 + 0.35,
    rot: Math.PI,
  })
  const shelf = footprint('bookshelf')
  if (depth >= 3.2) items.push({ modelId: 'bookshelf', lx: eastX(width, shelf[1]), lz: 0.2, rot: -Math.PI / 2 })
  const filing = footprint('filing-cabinet')
  if (width >= 3.4) items.push({ modelId: 'filing-cabinet', lx: westX(width, filing[1]), lz: 0.2, rot: Math.PI / 2 })
  items.push({ modelId: 'potted-plant', lx: width * 0.35, lz: depth * 0.35, rot: 0 })
  return items
}

function genericItems(width: number, depth: number): LayoutItem[] {
  const items: LayoutItem[] = []
  if (width >= 2.6) items.push({ modelId: 'sofa-2', lx: 0, lz: northZ(depth, footprint('sofa-2')[1]), rot: 0 })
  items.push({ modelId: 'coffee-table', lx: 0, lz: 0.2, rot: 0 })
  if (depth >= 3.0) {
    items.push({ modelId: 'bookshelf', lx: eastX(width, footprint('bookshelf')[1]), lz: 0.2, rot: -Math.PI / 2 })
  }
  items.push({ modelId: 'potted-plant', lx: width * 0.35, lz: depth * 0.35, rot: 0 })
  return items
}

export function layoutForRoom(roomType: AiRoomType, width: number, depth: number): LayoutItem[] {
  if (roomType === 'living') return livingItems(width, depth)
  if (roomType === 'bedroom') return bedroomItems(width, depth)
  if (roomType === 'kitchen') return kitchenItems(width, depth)
  if (roomType === 'dining') return diningItems(width, depth)
  if (roomType === 'bathroom') return bathroomItems(width, depth)
  if (roomType === 'office') return officeItems(width, depth)
  return genericItems(width, depth)
}

export function roomFloorStyle(roomType: AiRoomType): SlabEntity['style'] {
  if (roomType === 'bathroom' || roomType === 'kitchen') return 'tile'
  if (roomType === 'office') return 'oak'
  return 'wood'
}

export function defaultRoomSize(roomType: AiRoomType): [number, number] {
  if (roomType === 'living') return [7, 6]
  if (roomType === 'bedroom') return [4.5, 4.5]
  if (roomType === 'kitchen') return [5, 4]
  if (roomType === 'dining') return [5, 4.5]
  if (roomType === 'bathroom') return [3, 3]
  if (roomType === 'office') return [4, 3.5]
  return [5, 4]
}
