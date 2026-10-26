import type { EditorScene } from './engine'

let current: EditorScene | null = null

export function setEditorScene(scene: EditorScene | null) {
  current = scene
}

export function getEditorScene(): EditorScene | null {
  return current
}
