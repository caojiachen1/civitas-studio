import { polygonArea, pointInPolygon, minAreaRect, clamp, projectPointOnSegment } from '../geom'
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

  const endpoints = walls.flatMap((wall) => [wall.a, wall.b])
  for (const wall of walls) {
    const length = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
    if (length < 0.08) continue
    const splits: { point: Vec2; t: number }[] = [
      { point: wall.a, t: 0 },
      { point: wall.b, t: 1 },
    ]
    for (const endpoint of endpoints) {
      const projected = projectPointOnSegment(endpoint, wall.a, wall.b)
      if (projected.distance <= tolerance && projected.t > 0.02 && projected.t < 0.98) {
        splits.push({ point: projected.point, t: projected.t })
      }
    }
    splits.sort((a, b) => a.t - b.t)
    const chain: number[] = []
    for (const split of splits) {
      const node = findNode(split.point)
      if (chain[chain.length - 1] !== node) chain.push(node)
    }
    for (let index = 0; index < chain.length - 1; index++) {
      const from = chain[index]
      const to = chain[index + 1]
      if (from === to) continue
      const e1 = edges.length
      edges.push({ from, to, wall })
      const e2 = edges.length
      edges.push({ from: to, to: from, wall })
      nodes[from].outgoing.push(e1)
      nodes[to].outgoing.push(e2)
    }
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
  interface Face {
    polygon: Vec2[]
    wallIds: string[]
    nodeIds: number[]
    area: number
  }
  const faces: Face[] = []

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
    const area = Math.abs(polygonArea(polygon))
    if (area < 0.6) continue
    faces.push({
      polygon,
      wallIds: [...new Set(cycEdges.map((id) => edges[id].wall.id))],
      nodeIds: [...new Set(cycEdges.map((id) => edges[id].from))],
      area,
    })
  }

  const parent = nodes.map((_, index) => index)
  const find = (index: number): number => {
    let root = index
    while (parent[root] !== root) root = parent[root]
    while (parent[index] !== root) {
      const next = parent[index]
      parent[index] = root
      index = next
    }
    return root
  }
  for (const edge of edges) {
    const a = find(edge.from)
    const b = find(edge.to)
    if (a !== b) parent[a] = b
  }

  const groups = new Map<number, Face[]>()
  for (const face of faces) {
    const key = find(face.nodeIds[0])
    const list = groups.get(key)
    if (list) list.push(face)
    else groups.set(key, [face])
  }

  const rooms: DetectedRoom[] = []
  for (const group of groups.values()) {
    // The unbounded face is the outer perimeter; interior rooms are the rest.
    const unique = new Map<string, Face>()
    for (const face of group) {
      const signature = [...face.wallIds].sort().join('|')
      const existing = unique.get(signature)
      if (!existing || face.area > existing.area) unique.set(signature, face)
    }
    let candidates = [...unique.values()]
    if (candidates.length > 1) {
      let largest = candidates[0]
      for (const face of candidates) if (face.area > largest.area) largest = face
      const others = candidates.filter((face) => face !== largest)
      const otherArea = others.reduce((sum, face) => sum + face.area, 0)
      if (largest.area >= otherArea * 0.98) {
        candidates = others
      }
    }
    for (const face of candidates) {
      if (face.area < 0.6) continue
      const wallSet = new Set(face.wallIds)
      const maxWallHeight = Math.max(
        0,
        ...walls.filter((wall) => wallSet.has(wall.id)).map((wall) => wall.height),
      )
      const rect = minAreaRect(face.polygon)
      rooms.push({
        polygon: face.polygon,
        wallIds: face.wallIds,
        maxWallHeight,
        area: face.area,
        rect,
      })
    }
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
