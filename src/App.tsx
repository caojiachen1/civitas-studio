import { useEffect, useRef, useState } from 'react'
import { EditorScene } from './editor/engine'
import { setEditorScene } from './editor/engineRef'
import { useEditor } from './editor/store'
import { useRuntime } from './editor/runtime'
import { createSampleDocument, SAMPLE_VIEW } from './editor/sample'
import { openProjectFromFile, readAutosave, saveProjectToFile, writeAutosave } from './editor/fileIO'
import { Topbar } from './ui/Topbar'
import { ToolRail } from './ui/ToolRail'
import { LeftPanel } from './ui/LeftPanel'
import { Inspector } from './ui/Inspector'
import { StatusBar } from './ui/StatusBar'
import { HelpModal, SceneOverlay, Toasts } from './ui/Overlays'
import { AiDrawer } from './ui/AiDrawer'
import { initMcp } from './mcp/store'
import { useMcp } from './mcp/store'
import type { PanelId } from './ui/panels'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState<PanelId>('select')
  const [ready, setReady] = useState(false)
  const [bootstrapError, setBootstrapError] = useState('')

  useEffect(() => {
    if (!ready) return
    void initMcp()
    const timer = window.setInterval(() => void useMcp.getState().refresh(), 4000)
    return () => window.clearInterval(timer)
  }, [ready])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let engine: EditorScene | null = null
    let autosaveTimer = 0
    let lastDoc = useEditor.getState().doc
    let warnedQuota = false
    try {
      const saved = readAutosave()
      useEditor.getState().newProject(saved?.doc ?? createSampleDocument())
      engine = new EditorScene(container)
      setEditorScene(engine)
      engine.setView(saved?.view ?? SAMPLE_VIEW)
      if (saved?.doc) {
        useRuntime.getState().toast('已恢复上次会话的自动备份', 'info')
      }
      lastDoc = useEditor.getState().doc
      setReady(true)
    } catch (error) {
      console.error(error)
      setBootstrapError(error instanceof Error ? error.message : String(error))
      return
    }

    const scheduleAutosave = () => {
      window.clearTimeout(autosaveTimer)
      autosaveTimer = window.setTimeout(() => {
        const ok = writeAutosave(engine)
        if (!ok && !warnedQuota) {
          warnedQuota = true
          useRuntime.getState().toast('自动备份失败（项目可能超过浏览器存储限制），请及时保存项目文件', 'warn')
        }
      }, 650)
    }

    const unsubscribe = useEditor.subscribe((state) => {
      if (state.doc !== lastDoc) {
        lastDoc = state.doc
        scheduleAutosave()
      }
    })

    const saveOnUnload = () => writeAutosave(engine)
    const handleSave = () => {
      void saveProjectToFile(engine)
    }
    const handleOpen = () => {
      void openProjectFromFile(engine)
    }
    window.addEventListener('beforeunload', saveOnUnload)
    window.addEventListener('civitas:save-project', handleSave)
    window.addEventListener('civitas:open-project', handleOpen)

    return () => {
      window.clearTimeout(autosaveTimer)
      window.removeEventListener('beforeunload', saveOnUnload)
      window.removeEventListener('civitas:save-project', handleSave)
      window.removeEventListener('civitas:open-project', handleOpen)
      unsubscribe()
      setEditorScene(null)
      engine?.dispose()
    }
  }, [])

  const activatePanel = (id: PanelId) => {
    setActivePanel(id)
    const store = useEditor.getState()
    if (id === 'select') store.setTool('select')
    else if (id === 'wall') store.setTool('wall')
    else if (id === 'openings') {
      if (store.tool !== 'door' && store.tool !== 'window') store.setTool('door')
    } else if (id === 'slab') store.setTool('slab')
    else if (id === 'roof') store.setTool('roof')
    else if (id === 'roads') store.setPathType('road')
    else if (id === 'water') store.setPathType('river')
    else if (id === 'erase') store.setTool('erase')
    else {
      store.setTool('select')
    }
  }

  return (
    <div className="app-shell">
      <Topbar />
      <ToolRail activePanel={activePanel} onActivate={activatePanel} />
      <LeftPanel activePanel={activePanel} />
      <main className="viewport" ref={containerRef}>
        {ready && <SceneOverlay />}
        {!ready && (
          <div className="boot-overlay">
            <div className="boot-mark">
              <span />
              <span />
              <span />
            </div>
            <strong>{bootstrapError ? '场景初始化失败' : '正在准备建造场地'}</strong>
            <p>{bootstrapError || '加载几何、材质与示例城市…'}</p>
          </div>
        )}
      </main>
      <Inspector />
      <StatusBar />
      <AiDrawer />
      <Toasts />
      <HelpModal />
    </div>
  )
}
