import { CircleHelp, Grid2X2 } from 'lucide-react'
import { useEditor } from '../editor/store'
import { useRuntime } from '../editor/runtime'
import { pathTypeLabel, toolLabelForState } from './labels'

export function StatusBar() {
  const hint = useRuntime((state) => state.hint)
  const snapLabel = useRuntime((state) => state.snapLabel)
  const invalidReason = useRuntime((state) => state.invalidReason)
  const cursor = useRuntime((state) => state.cursor)
  const perf = useRuntime((state) => state.perf)
  const setHelpOpen = useRuntime((state) => state.setHelpOpen)
  const tool = useEditor((state) => state.tool)
  const planMode = useEditor((state) => state.settings.planMode)
  const patchSettings = useEditor((state) => state.patchSettings)
  const activeModelId = useEditor((state) => state.activeModelId)
  const pathType = useEditor((state) => state.toolOptions.path.type)
  const label = tool === 'path' ? pathTypeLabel(pathType) : toolLabelForState(tool, activeModelId)
  const fpsClass = perf.fps >= 50 ? 'good' : perf.fps >= 30 ? 'warn' : 'bad'

  return (
    <footer className="statusbar">
      <div className="status-left">
        <span className={`status-indicator ${invalidReason ? 'is-error' : snapLabel ? 'is-snap' : ''}`} />
        <span className="status-tool">{label}</span>
        {planMode && (
          <button type="button" className="status-chip plan-chip" onClick={() => patchSettings({ planMode: false })}>
            <Grid2X2 size={12} /> 平面模式 · 退出
          </button>
        )}
        <span className="status-hint">{hint}</span>
        {snapLabel && !invalidReason && <span className="status-chip is-snap">{snapLabel}</span>}
        {invalidReason && <span className="status-chip is-error">{invalidReason}</span>}
      </div>
      <div className="status-center">
        {cursor ? (
          <span className="mono coords">
            X {cursor[0].toFixed(2)} <em>·</em> Y {cursor[1].toFixed(2)} <em>·</em> Z {cursor[2].toFixed(2)}
          </span>
        ) : (
          <span className="coords muted">将鼠标移入场景</span>
        )}
      </div>
      <div className="status-right">
        <span className={`metric mono ${fpsClass}`}>{perf.fps} FPS</span>
        <span className="metric mono">{perf.drawCalls} calls</span>
        <span className="metric mono">{(perf.triangles / 1000).toFixed(1)}k tris</span>
        <span className="metric mono">{perf.objects} items</span>
        <button type="button" className="status-help" onClick={() => setHelpOpen(true)} title="帮助与快捷键 (?)">
          <CircleHelp size={13} />
        </button>
      </div>
    </footer>
  )
}
