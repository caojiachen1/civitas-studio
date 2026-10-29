import { useEffect, useRef, useState } from 'react'
import {
  Building2,
  ChevronDown,
  CircleHelp,
  Download,
  Eye,
  FolderOpen,
  Grid3X3,
  Home,
  Layers,
  Magnet,
  Plus,
  Redo2,
  Ruler,
  Save,
  Sparkles,
  Sun,
  Undo2,
  Upload,
} from 'lucide-react'
import { useEditor } from '../editor/store'
import { useRuntime } from '../editor/runtime'
import { getEditorScene } from '../editor/engineRef'
import { exportSceneToFile, importModelFromFile, openProjectFromFile, saveProjectToFile, type ExportFormat } from '../editor/fileIO'
import { IconButton } from './common'
import { useAi } from '../ai/store'

const EXPORT_OPTIONS: { format: ExportFormat; label: string; hint: string }[] = [
  { format: 'glb', label: 'GLB', hint: '推荐 · 单文件、包含材质' },
  { format: 'gltf', label: 'glTF', hint: 'JSON + 内嵌资源' },
  { format: 'obj', label: 'OBJ', hint: '通用网格格式' },
  { format: 'stl', label: 'STL', hint: '仅几何、用于 3D 打印' },
]

export function Topbar() {
  const projectName = useEditor((state) => state.doc.projectName)
  const dirty = useEditor((state) => state.dirty)
  const levels = useEditor((state) => state.doc.levels)
  const activeLevelId = useEditor((state) => state.doc.activeLevelId)
  const settings = useEditor((state) => state.settings)
  const canUndo = useEditor((state) => state.past.length > 0)
  const canRedo = useEditor((state) => state.future.length > 0)
  const setProjectName = useEditor((state) => state.setProjectName)
  const setActiveLevel = useEditor((state) => state.setActiveLevel)
  const addLevel = useEditor((state) => state.addLevel)
  const patchSettings = useEditor((state) => state.patchSettings)
  const undo = useEditor((state) => state.undo)
  const redo = useEditor((state) => state.redo)
  const setHelpOpen = useRuntime((state) => state.setHelpOpen)
  const toast = useRuntime((state) => state.toast)
  const [nameDraft, setNameDraft] = useState(projectName)
  const [exportOpen, setExportOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const aiOpen = useAi((state) => state.open)
  const toggleAi = useAi((state) => state.toggleOpen)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setNameDraft(projectName), [projectName])

  useEffect(() => {
    if (!exportOpen) return
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setExportOpen(false)
    }
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [exportOpen])

  const commitName = () => {
    const trimmed = nameDraft.trim()
    if (trimmed && trimmed !== projectName) setProjectName(trimmed)
    else setNameDraft(projectName)
  }

  const handleSave = async () => {
    if (busy) return
    setBusy(true)
    await saveProjectToFile(getEditorScene())
    setBusy(false)
  }

  const handleOpen = async () => {
    if (busy) return
    setBusy(true)
    await openProjectFromFile(getEditorScene())
    setBusy(false)
  }

  const handleImport = async () => {
    if (busy) return
    setBusy(true)
    await importModelFromFile()
    setBusy(false)
  }

  const handleExport = async (format: ExportFormat) => {
    setExportOpen(false)
    if (busy) return
    setBusy(true)
    toast(`正在导出 ${format.toUpperCase()}…`, 'info')
    await exportSceneToFile(format, getEditorScene())
    setBusy(false)
  }

  return (
    <header className="topbar" data-ui-scope="topbar">
      <div className="brand">
        <span className="brand-mark">
          <Building2 size={19} strokeWidth={1.7} />
        </span>
        <span className="brand-text">
          <span className="brand-name">
            CIVITAS <em>STUDIO</em>
          </span>
          <span className="brand-sub">城市建造工坊</span>
        </span>
      </div>

      <div className="project-identity">
        <span className={`dirty-indicator ${dirty ? 'is-dirty' : ''}`} title={dirty ? '有尚未导出为项目文件的更改（已自动备份）' : '已保存'} />
        <span className="eyebrow">项目</span>
        <input
          value={nameDraft}
          onChange={(event) => setNameDraft(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
            if (event.key === 'Escape') {
              setNameDraft(projectName)
              event.currentTarget.blur()
            }
          }}
          aria-label="项目名称"
        />
      </div>

      <div className="topbar-spacer" />

      <div className="level-switch" title="当前楼层">
        <Layers size={15} />
        <select
          value={activeLevelId}
          aria-label="当前楼层"
          data-automation-id="topbar-level-select"
          onChange={(event) => setActiveLevel(event.target.value)}
        >
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name} · {level.elevation.toFixed(2)} m
            </option>
          ))}
        </select>
        <button
          type="button"
          className="mini-level-add"
          title="新增楼层（+3.2 m）"
          data-automation-id="topbar-add-level"
          onClick={() => addLevel()}
        >
          <Plus size={13} />
        </button>
      </div>

      <div className="topbar-group">
        <IconButton
          icon={Undo2}
          label="撤销 (Ctrl+Z)"
          data-automation-id="topbar-undo"
          disabled={!canUndo}
          onClick={() => undo()}
        />
        <IconButton
          icon={Redo2}
          label="重做 (Ctrl+Shift+Z)"
          data-automation-id="topbar-redo"
          disabled={!canRedo}
          onClick={() => redo()}
        />
      </div>

      <div className="topbar-group topbar-settings">
        <IconButton
          icon={Grid3X3}
          label={`网格显示：${settings.showGrid ? '开' : '关'}`}
          data-automation-id="topbar-grid"
          active={settings.showGrid}
          onClick={() => patchSettings({ showGrid: !settings.showGrid })}
        />
        <IconButton
          icon={Magnet}
          label={`网格吸附：${settings.gridSnap ? '开' : '关'}`}
          data-automation-id="topbar-snap"
          active={settings.gridSnap}
          onClick={() => patchSettings({ gridSnap: !settings.gridSnap })}
        />
        <IconButton
          icon={Ruler}
          label={`角度吸附：${settings.angleSnap ? '开' : '关'}`}
          data-automation-id="topbar-angle-snap"
          active={settings.angleSnap}
          onClick={() => patchSettings({ angleSnap: !settings.angleSnap })}
        />
        <IconButton
          icon={Sun}
          label={`实时阴影：${settings.shadows ? '开' : '关'}`}
          data-automation-id="topbar-shadows"
          active={settings.shadows}
          onClick={() => patchSettings({ shadows: !settings.shadows })}
        />
        <IconButton
          icon={Eye}
          label={`仅显示当前楼层：${settings.isolateLevel ? '开' : '关'}`}
          data-automation-id="topbar-isolate-level"
          active={settings.isolateLevel}
          onClick={() => patchSettings({ isolateLevel: !settings.isolateLevel })}
        />
        <IconButton
          icon={Home}
          label={`显示屋顶：${settings.showRoofs ? '开' : '关'}`}
          data-automation-id="topbar-show-roofs"
          active={settings.showRoofs}
          onClick={() => patchSettings({ showRoofs: !settings.showRoofs })}
        />
      </div>

      <div className="topbar-group topbar-files">
        <IconButton icon={Save} label="保存项目 (Ctrl+S)" data-automation-id="topbar-save" disabled={busy} onClick={handleSave} />
        <IconButton icon={FolderOpen} label="打开项目 (Ctrl+O)" data-automation-id="topbar-open" disabled={busy} onClick={handleOpen} />
        <IconButton icon={Upload} label="导入 3D 模型（GLB / glTF / OBJ / STL）" data-automation-id="topbar-import" disabled={busy} onClick={handleImport} />
        <div className="menu-wrap" ref={menuRef}>
          <button
            type="button"
            className={`export-button ${exportOpen ? 'is-open' : ''}`}
            disabled={busy}
            onClick={() => setExportOpen((open) => !open)}
            title="导出场景"
            data-automation-id="topbar-export"
          >
            <Download size={15} />
            <span>导出</span>
            <ChevronDown size={13} />
          </button>
          {exportOpen && (
            <div className="dropdown-menu export-menu">
              <div className="dropdown-label">导出整个场景</div>
              {EXPORT_OPTIONS.map((option) => (
                <button key={option.format} type="button" data-automation-id={`topbar-export-${option.format}`} onClick={() => handleExport(option.format)}>
                  <span className="export-format">{option.label}</span>
                  <span className="export-hint">{option.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className={`ai-launch ${aiOpen ? 'is-active' : ''}`}
          title="AI 场景操作员 (Ctrl+K)"
          data-automation-id="topbar-ai"
          onClick={toggleAi}
        >
          <Sparkles size={15} />
          <span>AI</span>
        </button>
        <IconButton icon={CircleHelp} label="帮助与快捷键 (?)" data-automation-id="topbar-help" onClick={() => setHelpOpen(true)} />
      </div>
    </header>
  )
}
