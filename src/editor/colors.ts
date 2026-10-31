import { WALL_COLORS } from './types'

export function resolveColor(value: string | undefined): string | null {
  if (!value) return null
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase()
  const normalized = value.replace(/\s+/g, '')
  const alias: Record<string, string> = {
    白色: '#f1efea',
    暖白: '#e8e0d2',
    灰绿: '#a8b5a1',
    沙岩: '#d6c3a3',
    陶土: '#bd8a73',
    深蓝: '#55606e',
    石墨: '#565b5d',
    灰粉: '#c7a9a3',
    white: '#f1efea',
    ivory: '#e8e0d2',
    sage: '#a8b5a1',
    sand: '#d6c3a3',
    clay: '#bd8a73',
    navy: '#55606e',
    graphite: '#565b5d',
    rose: '#c7a9a3',
  }
  if (alias[normalized]) return alias[normalized]
  const fuzzyAlias = Object.entries(alias).find(
    ([name]) => normalized.includes(name) || name.includes(normalized),
  )
  if (fuzzyAlias) return fuzzyAlias[1]
  const match = WALL_COLORS.find(
    (color) => color.name.replace(/\s+/g, '').includes(normalized) || color.id === normalized,
  )
  return match?.color ?? null
}
