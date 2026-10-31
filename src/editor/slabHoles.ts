import { useEditor, uid } from './store'
import type { Level, SlabEntity, SlabHole } from './types'
import { slabHoleFits } from './builders/slabs'

export interface CutFloorOpeningInput {
  x: number
  z: number
  width: number
  depth: number
  rot?: number
  levelId?: string
  fromLevelId?: string
  allAbove?: boolean
}

export interface CutFloorOpeningSuccess {
  slabs: string[]
  levels: string[]
  holes: number
}

export interface CutFloorOpeningFailure {
  error: string
}

function normalize(value: number, fallback: number, min: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback
}

function holeContains(outer: SlabHole, inner: SlabHole): boolean {
  return (
    outer.x - outer.w / 2 <= inner.x - inner.w / 2 + 0.001 &&
    outer.x + outer.w / 2 >= inner.x + inner.w / 2 - 0.001 &&
    outer.z - outer.d / 2 <= inner.z - inner.d / 2 + 0.001 &&
    outer.z + outer.d / 2 >= inner.z + inner.d / 2 - 0.001
  )
}

function holesOverlap(a: SlabHole, b: SlabHole): boolean {
  return (
    Math.abs(a.x - b.x) < (a.w + b.w) / 2 - 0.001 &&
    Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 0.001
  )
}

export function cutFloorOpening(
  input: CutFloorOpeningInput,
): CutFloorOpeningSuccess | CutFloorOpeningFailure {
  const state = useEditor.getState()
  const doc = state.doc
  const source =
    doc.levels.find((level) => level.id === (input.fromLevelId ?? doc.activeLevelId)) ??
    doc.levels.find((level) => level.id === doc.activeLevelId) ??
    doc.levels[0]
  if (!source) return { error: '当前项目没有楼层。' }

  const sorted = [...doc.levels].sort((a, b) => a.elevation - b.elevation)
  let targets: Level[]
  if (input.levelId) {
    const target = doc.levels.find((level) => level.id === input.levelId)
    if (!target) return { error: '未找到目标楼层。' }
    targets = [target]
  } else {
    const above = sorted.filter((level) => level.elevation > source.elevation + 0.01)
    if (above.length === 0) return { error: '当前楼层上方没有楼板。' }
    targets = input.allAbove ? above : [above[0]]
  }

  const width = normalize(input.width, 3, 0.4, 40)
  const depth = normalize(input.depth, 3, 0.4, 40)
  const hole: SlabHole = {
    id: uid('hole'),
    x: normalize(input.x, 0, -400, 400),
    z: normalize(input.z, 0, -400, 400),
    w: width,
    d: depth,
    rot: normalize(input.rot ?? 0, 0, -Math.PI * 2, Math.PI * 2),
  }

  const affected: SlabEntity[] = []
  for (const level of targets) {
    const slabs = Object.values(doc.entities).filter(
      (entity): entity is SlabEntity => entity.kind === 'slab' && entity.levelId === level.id,
    )
    for (const slab of slabs) {
      const existing = slab.holes ?? []
      if (existing.some((other) => holeContains(other, hole))) continue
      if (!slabHoleFits(slab, hole)) continue
      const kept = existing.filter((other) => !holesOverlap(other, hole))
      affected.push({ ...slab, holes: [...kept, { ...hole, id: uid('hole') }] })
    }
  }

  if (affected.length === 0) {
    return { error: '该位置没有完全覆盖这个洞口的楼板；请缩小洞口或移动到楼板中部。' }
  }

  state.beginHistory('楼板开洞')
  for (const slab of affected) {
    state.updateEntity(slab.id, { holes: slab.holes }, false)
  }

  return {
    slabs: affected.map((slab) => slab.id),
    levels: targets.map((level) => level.id),
    holes: affected.length,
  }
}

export function addSlabHole(
  slab: SlabEntity,
  hole: Omit<SlabHole, 'id'> & { id?: string },
): SlabHole[] | null {
  const next: SlabHole = {
    id: hole.id ?? uid('hole'),
    x: hole.x,
    z: hole.z,
    w: hole.w,
    d: hole.d,
    rot: hole.rot,
  }
  if (!slabHoleFits(slab, next)) return null
  return [...(slab.holes ?? []), next]
}
