import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { STLExporter } from 'three/addons/exporters/STLExporter.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import type { EditorScene } from './engine'
import { useEditor } from './store'
import { useRuntime } from './runtime'
import {
  buildWall,
} from './builders/walls'
import { buildPath } from './builders/paths'
import { buildSlab } from './builders/slabs'
import { buildRoof } from './builders/roofs'
import { buildBuildingShell, cityDocWithInterior } from './buildings'
import { createModelObject } from '../models/kit'
import { getModel } from '../models/registry'
import { createCustomInstance, hydrateCustomAssets, loadCustomAsset } from '../models/custom'
import {
  bytesToDataUrl,
  openFileWithDialog,
  sanitizeFileName,
  saveFileWithDialog,
  type FileFilter,
} from './platform'
import type { CustomAsset, EditorDocument, Entity, OpeningEntity, ProjectFile, ViewState, WallEntity } from './types'

const PROJECT_FILTERS: FileFilter[] = [
  { name: 'Civitas 项目', extensions: ['civitas'] },
  { name: 'JSON', extensions: ['json'] },
]
const MODEL_FILTERS: FileFilter[] = [
  { name: '3D 模型', extensions: ['glb', 'gltf', 'obj', 'stl'] },
]
const AUTOSAVE_KEY = 'civitas-studio:autosave:v1'

export interface ProjectPayload {
  app: 'civitas-studio'
  version: 1
  doc: EditorDocument
  view?: ViewState
  savedAt: number
}

export function isValidDocument(value: unknown): value is EditorDocument {
  if (!value || typeof value !== 'object') return false
  const doc = value as Partial<EditorDocument>
  return (
    doc.schemaVersion === 1 &&
    typeof doc.projectName === 'string' &&
    Array.isArray(doc.levels) &&
    doc.levels.length > 0 &&
    typeof doc.entities === 'object' &&
    doc.entities !== null &&
    Array.isArray(doc.entityOrder) &&
    Array.isArray(doc.customAssets)
  )
}

export function getProjectPayload(engine: EditorScene | null): ProjectPayload {
  const state = useEditor.getState()
  const session = state.buildingSession
  return {
    app: 'civitas-studio',
    version: 1,
    doc: session ? cityDocWithInterior(session, state.doc) : structuredClone(state.doc),
    view: session ? undefined : engine?.getView(),
    savedAt: Date.now(),
  }
}

export async function saveProjectToFile(engine: EditorScene | null): Promise<boolean> {
  try {
    const payload = getProjectPayload(engine)
    const name = `${sanitizeFileName(payload.doc.projectName)}.civitas`
    const path = await saveFileWithDialog(name, JSON.stringify(payload, null, 2), PROJECT_FILTERS, 'application/json')
    if (!path) return false
    useEditor.getState().markClean()
    useRuntime.getState().toast(`项目已保存${path ? `：${path.split(/[\\/]/).pop()}` : ''}`, 'success')
    return true
  } catch (error) {
    console.error(error)
    useRuntime.getState().toast(`保存失败：${error instanceof Error ? error.message : String(error)}`, 'error')
    return false
  }
}

export function parseProjectText(text: string): { doc: EditorDocument; view?: ViewState } {
  const parsed = JSON.parse(text) as Partial<ProjectPayload> | EditorDocument
  let doc: EditorDocument | null = null
  let view: ViewState | undefined
  if ('doc' in parsed && parsed.doc) {
    if (!isValidDocument(parsed.doc)) throw new Error('项目文件结构无效')
    doc = parsed.doc
    view = (parsed as ProjectPayload).view
  } else if (isValidDocument(parsed)) {
    doc = parsed
  }
  if (!doc) throw new Error('无法识别的 Civitas 项目文件')
  return { doc, view }
}

export async function openProjectFromFile(engine: EditorScene | null): Promise<boolean> {
  try {
    if (useEditor.getState().buildingSession) {
      useRuntime.getState().toast('请先退出当前建筑，再打开其他项目', 'warn')
      return false
    }
    const file = await openFileWithDialog(PROJECT_FILTERS, '.civitas,.json')
    if (!file) return false
    const text = new TextDecoder().decode(file.bytes)
    const { doc, view } = parseProjectText(text)
    useEditor.getState().loadDocument(doc)
    if (engine) {
      if (view) engine.setView(view)
      else window.setTimeout(() => engine.focusAll(), 120)
    }
    useRuntime.getState().toast(`已打开「${doc.projectName}」`, 'success')
    return true
  } catch (error) {
    console.error(error)
    useRuntime.getState().toast(`打开失败：${error instanceof Error ? error.message : String(error)}`, 'error')
    return false
  }
}

export function writeAutosave(engine: EditorScene | null): boolean {
  try {
    const payload = getProjectPayload(engine)
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload))
    return true
  } catch (error) {
    console.warn('Autosave failed', error)
    return false
  }
}

export function readAutosave(): { doc: EditorDocument; view?: ViewState } | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ProjectPayload>
    if (!isValidDocument(parsed.doc)) return null
    return { doc: parsed.doc, view: parsed.view }
  } catch {
    return null
  }
}

export function clearAutosave() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY)
  } catch {
    // ignore
  }
}

export function downloadProjectFallback() {
  const payload = getProjectPayload(null)
  const doc = payload.doc
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${sanitizeFileName(doc.projectName)}.civitas`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

function defaultMaterialForImported() {
  return new THREE.MeshStandardMaterial({ color: '#b9b3a8', roughness: 0.82, metalness: 0.02 })
}

function prepareImportedObject(object: THREE.Object3D): THREE.Object3D {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (!child.material || (Array.isArray(child.material) && child.material.length === 0)) {
        child.material = defaultMaterialForImported()
      }
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return object
}

async function objectToGlb(object: THREE.Object3D): Promise<ArrayBuffer> {
  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(object, { binary: true, onlyVisible: true, maxTextureSize: 2048 })
  if (!(result instanceof ArrayBuffer)) throw new Error('模型转换 GLB 失败')
  return result
}

export async function importModelFromBytes(fileName: string, bytes: ArrayBuffer): Promise<CustomAsset> {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const baseName = fileName.replace(/\.[^.]+$/, '')
  let object: THREE.Object3D
  let dataUrl: string
  if (ext === 'glb' || ext === 'gltf') {
    const loader = new GLTFLoader()
    const input = ext === 'gltf' ? new TextDecoder().decode(bytes) : bytes
    const gltf = await loader.parseAsync(input, '')
    object = prepareImportedObject(gltf.scene)
    dataUrl =
      ext === 'glb'
        ? bytesToDataUrl(new Uint8Array(bytes), 'model/gltf-binary')
        : bytesToDataUrl(new Uint8Array(await objectToGlb(object)), 'model/gltf-binary')
  } else if (ext === 'obj') {
    const loader = new OBJLoader()
    object = prepareImportedObject(loader.parse(new TextDecoder().decode(bytes)))
    dataUrl = bytesToDataUrl(new Uint8Array(await objectToGlb(object)), 'model/gltf-binary')
  } else if (ext === 'stl') {
    const loader = new STLLoader()
    const geometry = loader.parse(bytes)
    geometry.computeVertexNormals()
    object = prepareImportedObject(new THREE.Mesh(geometry, defaultMaterialForImported()))
    dataUrl = bytesToDataUrl(new Uint8Array(await objectToGlb(object)), 'model/gltf-binary')
  } else {
    throw new Error('不支持的文件格式，请选择 GLB、glTF、OBJ 或 STL')
  }
  const box = new THREE.Box3().setFromObject(object)
  if (box.isEmpty()) throw new Error('模型中没有可用的几何体')
  const size = box.getSize(new THREE.Vector3())
  return {
    id: `custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: baseName || '导入模型',
    dataUrl,
    footprint: [Math.max(0.2, size.x), Math.max(0.2, size.z)],
    height: Math.max(0.2, size.y),
  }
}

export async function importModelFromFile(): Promise<boolean> {
  try {
    const file = await openFileWithDialog(MODEL_FILTERS, '.glb,.gltf,.obj,.stl')
    if (!file) return false
    const asset = await importModelFromBytes(file.name, file.bytes)
    const loaded = await loadCustomAsset(asset)
    if (!loaded) throw new Error('模型解析成功，但加载到场景失败')
    useEditor.getState().registerCustomAsset(asset)
    useEditor.getState().setActiveModel(asset.id)
    useRuntime
      .getState()
      .toast(
        `已导入「${asset.name}」（${asset.footprint[0].toFixed(1)} × ${asset.footprint[1].toFixed(1)} m），点击场景放置`,
        'success',
      )
    return true
  } catch (error) {
    console.error(error)
    useRuntime.getState().toast(`导入失败：${error instanceof Error ? error.message : String(error)}`, 'error')
    return false
  }
}

export type ExportFormat = 'glb' | 'gltf' | 'obj' | 'stl'

const exportKitMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.72,
  metalness: 0.04,
})
const exportGlassMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.38,
  roughness: 0.12,
  metalness: 0.04,
  depthWrite: false,
})
const exportWaterMaterial = new THREE.MeshStandardMaterial({
  color: '#4f93a4',
  roughness: 0.18,
  metalness: 0.08,
  transparent: true,
  opacity: 0.88,
})

function stripVertexPbrAttributes(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  if (!geometry.getAttribute('aRoughness') && !geometry.getAttribute('aMetalness')) return geometry
  const stripped = geometry.clone()
  stripped.deleteAttribute('aRoughness')
  stripped.deleteAttribute('aMetalness')
  return stripped
}

function prepareMaterialsForExport(root: THREE.Group) {
  const stripped = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>()
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const material = child.material
    if (material instanceof THREE.ShaderMaterial) {
      child.material = exportWaterMaterial
      return
    }
    if (material instanceof THREE.MeshStandardMaterial && child.geometry.getAttribute('aRoughness')) {
      const cached = stripped.get(child.geometry)
      const geometry = cached ?? stripVertexPbrAttributes(child.geometry)
      if (!cached) stripped.set(child.geometry, geometry)
      child.geometry = geometry
      child.material = material.transparent ? exportGlassMaterial : exportKitMaterial
    }
  })
}

export async function buildExportScene(doc: EditorDocument): Promise<THREE.Group> {
  await hydrateCustomAssets(doc.customAssets)
  const root = new THREE.Group()
  root.name = doc.projectName || 'Civitas Scene'
  const levels = new Map(doc.levels.map((level) => [level.id, level.elevation]))
  const entities = Object.values(doc.entities)
  const openings = entities.filter((entity): entity is OpeningEntity => entity.kind === 'opening')
  for (const entity of entities) {
    let object: THREE.Object3D | null = null
    if (entity.kind === 'wall') {
      const wallOpenings = openings.filter((item) => item.wallId === entity.id)
      object = buildWall(entity, wallOpenings, levels.get(entity.levelId) ?? 0)
    } else if (entity.kind === 'path') {
      object = buildPath(entity, levels.get(entity.levelId) ?? 0)
    } else if (entity.kind === 'slab') {
      object = buildSlab(entity, levels.get(entity.levelId) ?? 0)
    } else if (entity.kind === 'roof') {
      object = buildRoof(entity)
    } else if (entity.kind === 'building') {
      object = buildBuildingShell(entity)
      object.position.set(entity.x, levels.get(entity.levelId) ?? 0, entity.z)
      object.rotation.y = entity.rot
    } else if (entity.kind === 'object') {
      const builtin = getModel(entity.modelId)
      if (builtin) {
        object = createModelObject(builtin)
      } else {
        object = createCustomInstance(entity.modelId)
      }
      if (object) {
        object.position.set(entity.x, levels.get(entity.levelId) ?? 0, entity.z)
        object.rotation.y = entity.rot
        object.scale.set(entity.scale, entity.scale * (entity.scaleY ?? 1), entity.scale)
      }
    }
    if (object) {
      object.name = `${entity.kind}-${entity.id}`
      root.add(object)
    }
  }
  prepareMaterialsForExport(root)
  return root
}

export async function exportSceneToFile(format: ExportFormat, engine: EditorScene | null): Promise<boolean> {
  const namespace = useRuntime.getState()
  const doc = useEditor.getState().doc
  try {
    const root = await buildExportScene(doc)
    if (root.children.length === 0) {
      namespace.toast('场景为空，无法导出', 'warn')
      return false
    }
    const safe = sanitizeFileName(doc.projectName)
    if (format === 'glb') {
      const exporter = new GLTFExporter()
      const result = await exporter.parseAsync(root, { binary: true, onlyVisible: true, maxTextureSize: 2048 })
      if (!(result instanceof ArrayBuffer)) throw new Error('GLB 生成失败')
      const path = await saveFileWithDialog(`${safe}.glb`, new Uint8Array(result), [{ name: 'GLB', extensions: ['glb'] }], 'model/gltf-binary')
      if (!path) return false
    } else if (format === 'gltf') {
      const exporter = new GLTFExporter()
      const result = await exporter.parseAsync(root, { binary: false, onlyVisible: true, maxTextureSize: 2048 })
      const path = await saveFileWithDialog(
        `${safe}.gltf`,
        JSON.stringify(result, null, 2),
        [{ name: 'glTF', extensions: ['gltf'] }],
        'model/gltf+json',
      )
      if (!path) return false
    } else if (format === 'obj') {
      const exporter = new OBJExporter()
      const path = await saveFileWithDialog(
        `${safe}.obj`,
        exporter.parse(root),
        [{ name: 'Wavefront OBJ', extensions: ['obj'] }],
        'text/plain',
      )
      if (!path) return false
    } else {
      const exporter = new STLExporter()
      const text = exporter.parse(root, { binary: false }) as string
      const path = await saveFileWithDialog(`${safe}.stl`, text, [{ name: 'STL', extensions: ['stl'] }], 'model/stl')
      if (!path) return false
    }
    useRuntime.getState().toast(`已导出 ${format.toUpperCase()} 文件`, 'success')
    if (engine) engine.getView()
    return true
  } catch (error) {
    console.error(error)
    useRuntime.getState().toast(`导出失败：${error instanceof Error ? error.message : String(error)}`, 'error')
    return false
  }
}

export function makeSampleProjectFile(): ProjectFile {
  const doc = useEditor.getState().doc
  return { app: 'civitas-studio', version: 1, doc, savedAt: Date.now() }
}

export function getWallEntity(id: string): WallEntity | null {
  const entity = useEditor.getState().doc.entities[id]
  return entity?.kind === 'wall' ? entity : null
}

export function getEntityList(): Entity[] {
  return useEditor.getState().doc.entityOrder
    .map((id) => useEditor.getState().doc.entities[id])
    .filter((entity): entity is Entity => Boolean(entity))
}
