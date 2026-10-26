import { polygonArea, pointInPolygon, minAreaRect, clamp } from '../geom'
import type { Entity, Vec2, WallEntity } from '../types'

interface Edge {
  from: number
  to: number
  wall: WallEntity
}

interface Node {
  id: number
  point: Vec2
  outgoing: number[]
}

export interface DetectedRoom {
  polygon: Vec2[]
  wallIds: string[]
  maxWallHeight: number
  area: number
  rect: { center: Vec2; width: number; depth: number; rot: number }
}

export function detectRooms(walls: WallEntity[], tolerance = 0.2): DetectedRoom[] {
  if (walls.length < 3) return []
  const nodes: Node[] = []
  const edges: Edge[] = []

  const findNode = (p: Vec2): number => {
    for (const n of nodes) {
      if (Math.hypot(n.point[0] - p[0], n.point[1] - p[1]) <= tolerance) return n.id
    }
    const node: Node = { id: nodes.length, point: p, outgoing: [] }
    nodes.push(node)
    return node.id
  }

  for (const wall of walls) {
    if (Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1]) < 0.08) continue
    const from = findNode(wall.a)
    const to = findNode(wall.b)
    if (from === to) continue
    const e1 = edges.length
    edges.push({ from, to, wall })
    const e2 = edges.length
    edges.push({ from: to, to: from, wall })
    nodes[from].outgoing.push(e1)
    nodes[to].outgoing.push(e2)
  }

  for (const node of nodes) {
    node.outgoing.sort((a, b) => {
      const ea = edges[a]
      const eb = edges[b]
      const pa = nodes[ea.to].point
      const pb = nodes[eb.to].point
      return Math.atan2(pa[1] - node.point[1], pa[0] - node.point[0]) - Math.atan2(pb[1] - node.point[1], pb[0] - node.point[0])
    })
  }

  const visited = new Set<number>()
  const rooms: DetectedRoom[] = []

  for (let startEdge = 0; startEdge < edges.length; startEdge++) {
    if (visited.has(startEdge)) continue
    const cycEdges: number[] = []
    let current = startEdge
    let guard = 0
    while (!visited.has(current) && guard++ < edges.length + 4) {
      visited.add(current)
      cycEdges.push(current)
      const edge = edges[current]
      const node = nodes[edge.to]
      const reverseIndex = node.outgoing.indexOf(current ^ 1)
      if (reverseIndex < 0) break
      const nextIndex = (reverseIndex - 1 + node.outgoing.length) % node.outgoing.length
      current = node.outgoing[nextIndex]
      if (current === startEdge) break
    }
    if (current !== startEdge || cycEdges.length < 3) continue
    const polygon: Vec2[] = cycEdges.map((id) => nodes[edges[id].from].point)
    const area = polygonArea(polygon)
    if (area < 0.6) continue
    const wallIds = [...new Set(cycEdges.map((id) => edges[id].wall.id))]
    const maxWallHeight = Math.max(...cycEdges.map((id) => edges[id].wall.height))
    const rect = minAreaRect(polygon)
    rooms.push({ polygon, wallIds, maxWallHeight, area, rect })
  }

  return rooms
}

export function roomAtPoint(entities: Entity[], levelId: string, point: Vec2): DetectedRoom | null {
  const walls = entities.filter((e): e is WallEntity => e.kind === 'wall' && e.levelId === levelId)
  const rooms = detectRooms(walls)
  const containing = rooms.filter((room) => pointInPolygon(point[0], point[1], room.polygon))
  if (containing.length === 0) return null
  containing.sort((a, b) => a.area - b.area)
  return containing[0]
}

export function clampOpeningToWall(offset: number, width: number, wallLength: number) {
  const half = width / 2
  return clamp(offset, half + 0.08, wallLength - half - 0.08)
}
