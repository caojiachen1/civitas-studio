import {
  AlertTriangle,
  Building2,
  Eye,
  Grid3X3,
  Keyboard,
  Sparkles,
  Maximize2,
  MousePointer2,
  Move3d,
  Rotate3d,
  Route,
  X,
} from 'lucide-react'
import { useEditor } from '../editor/store'
import { useRuntime } from '../editor/runtime'
import { getEditorScene } from '../editor/engineRef'
import { pathTypeLabel, toolLabelForState } from './labels'
import { EmptyState, Segmented } from './common'

function BuildingSessionBar() {
  const session = useEditor((state) => state.buildingSession)
  const levels = useEditor((state) => state.doc.levels)
  const activeLevelId = useEditor((state) => state.doc.activeLevelId)
  const setBuildingMode = useEditor((state) => state.setBuildingMode)
  const setActiveLevel = useEditor((state) => state.setActiveLevel)
  const exitBuilding = useEditor((state) => state.exitBuilding)
  const toast = useRuntime((state) => state.toast)
  if (!session) return null
  return (
    <div className="building-session-bar">
      <div className="building-session-title">
        <Building2 size={17} />
        <span>
          <small>正在编辑建筑</small>
          <strong>{session.name}</strong>
        </span>
      </div>
      <Segmented
        compact
        value={session.mode}
        onChange={(mode) => setBuildingMode(mode)}
        options={[
          { value: 'shell', label: '外骨架' },
          { value: 'interior', label: '内饰' },
        ]}
      />
      <div className="building-floor-strip" role="tablist" aria-label="建筑楼层">
        {levels.map((level) => (
          <button
            key={level.id}
            type="button"
            role="tab"
            aria-selected={level.id === activeLevelId}
            className={level.id === activeLevelId ? 'is-active' : ''}
            onClick={() => setActiveLevel(level.id)}
          >
            {level.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="building-exit"
        onClick={() => {
          exitBuilding()
          toast('已退出建筑，回到城市场景', 'success')
        }}
      >
        <X size={14} /> 退出建筑
      </button>
    </div>
  )
}

export function SceneOverlay() {
  const tool = useEditor((state) => state.tool)
  const activeModelId = useEditor((state) => state.activeModelId)
  const entityCount = useEditor((state) => state.doc.entityOrder.length)
  const invalidReason = useRuntime((state) => state.invalidReason)
  const snapLabel = useRuntime((state) => state.snapLabel)
  const pathType = useEditor((state) => state.toolOptions.path.type)
  const planMode = useEditor((state) => state.settings.planMode)
  const patchSettings = useEditor((state) => state.patchSettings)
  const label = tool === 'path' ? pathTypeLabel(pathType) : toolLabelForState(tool, activeModelId)

  return (
    <>
      {planMode && (
        <button type="button" className="plan-exit" onClick={() => patchSettings({ planMode: false })}>
          <Rotate3d size={15} />
          退出平面模式
        </button>
      )}
      <BuildingSessionBar />
      <div className={`scene-mode-chip ${invalidReason ? 'is-invalid' : ''}`}>
        <span className="mode-dot" />
        <div>
          <span className="mode-label">当前工具</span>
          <strong>{label}</strong>
        </div>
        {snapLabel && !invalidReason && <span className="mode-snap">{snapLabel}</span>}
        {invalidReason && <span className="mode-invalid">{invalidReason}</span>}
      </div>

      {entityCount === 0 && (
        <div className="scene-empty">
          <EmptyState
            icon={Sparkles}
            title="一块等待建造的场地"
            hint="从左侧「平面」拖一个房间，或选择墙体、路径、家具开始；也可以加载示例场景查看完整作品。"
          />
        </div>
      )}

      <div className="scene-bottom-left">
        <div className="preview-legend">
          <span>
            <i className="legend-swatch is-valid" /> 可放置
          </span>
          <span>
            <i className="legend-swatch is-invalid" /> 禁止放置
          </span>
          <span>
            <i className="legend-swatch is-snap" /> 吸附点
          </span>
        </div>
      </div>

      <div className="scene-bottom-right">
        <div className="view-controls">
          <button type="button" title="俯视图" onClick={() => getEditorScene()?.topView()}>
            <Grid3X3 size={15} />
            俯视
          </button>
          <button type="button" title="全览场景" onClick={() => getEditorScene()?.focusAll()}>
            <Maximize2 size={15} />
            全览
          </button>
        </div>
        <div className="compass" title="世界坐标北向">
          <span>N</span>
          <i />
        </div>
      </div>
    </>
  )
}

export function Toasts() {
  const toasts = useRuntime((state) => state.toasts)
  const dismiss = useRuntime((state) => state.dismissToast)
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast tone-${toast.tone}`}>
          <span className="toast-icon">
            {toast.tone === 'warn' || toast.tone === 'error' ? (
              <AlertTriangle size={15} />
            ) : (
              <span className="toast-dot" />
            )}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button type="button" onClick={() => dismiss(toast.id)} aria-label="关闭提示">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}

const SHORTCUTS = [
  { icon: MousePointer2, keys: '左键', text: '选择 / 放置 / 添加控制点' },
  { icon: MousePointer2, keys: 'Alt + 左键拖动', text: '平移视图' },
  { icon: MousePointer2, keys: 'Alt + 右键拖动', text: '旋转视角' },
  { icon: Move3d, keys: 'W A S D', text: '移动相机 · 滚轮缩放' },
  { icon: Route, keys: 'R', text: '旋转放置预览 / 选中构件' },
  { icon: Grid3X3, keys: 'Shift', text: '临时关闭吸附，自由放置' },
  { icon: Keyboard, keys: 'Esc / Enter', text: '取消 / 完成当前路径或墙体' },
  { icon: Sparkles, keys: 'Ctrl + K', text: '打开 AI 场景操作员' },
]

export function HelpModal() {
  const open = useRuntime((state) => state.helpOpen)
  const setOpen = useRuntime((state) => state.setHelpOpen)
  if (!open) return null
  return (
    <div
      className="modal-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false)
      }}
    >
      <div className="help-modal">
        <div className="help-head">
          <div>
            <span className="eyebrow">CIVITAS STUDIO · GUIDE</span>
            <h2>建造、吸附与预览</h2>
          </div>
          <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="关闭帮助">
            <X size={16} />
          </button>
        </div>
        <div className="help-grid">
          <section>
            <h3>快速开始</h3>
            <ol className="help-steps">
              <li>
                <strong>选择工具</strong>
                <span>在左侧栏选择墙体、路径或组件库。</span>
              </li>
              <li>
                <strong>观察预览</strong>
                <span>浅灰色为可放置，红色为禁止放置并会说明原因。</span>
              </li>
              <li>
                <strong>点击确认</strong>
                <span>家具与道路可连续放置；墙体在右键或 Enter 时完成。</span>
              </li>
              <li>
                <strong>继续编辑</strong>
                <span>用选择工具拖动手柄，或在右侧属性面精修。</span>
              </li>
            </ol>
          </section>
          <section>
            <h3>吸附与合法性</h3>
            <ul className="help-list">
              <li>墙体端点吸附半径 0.8 m，道路与河流端点按类型使用 1.2–2.6 m 吸附半径。</li>
              <li>家具靠墙时会自动转向并贴墙 4 cm；重叠墙体或家具则显示红色禁止预览。</li>
              <li>河流与道路交叉时，需要改用桥梁；道路不能生成在水面上。</li>
              <li>屋顶工具会自动寻找墙体围成的闭合房间，并按房间外接矩形生成屋顶。</li>
            </ul>
          </section>
          <section>
            <h3>平面建造</h3>
            <p className="help-copy">
              左侧「平面」面板会进入俯视锁定视角。拖出矩形即可自动生成墙体、楼板、门窗；手工画完闭合墙环后，点「补全闭合房间」补上楼板/屋顶/门。
            </p>
            <p className="help-copy">
              「复制到新楼层」会把本层平面整体抬到新的标高，快速叠出多层建筑；最后在顶层打开自动屋顶并补全即可封顶。
            </p>
            <p className="help-copy">
              退出平面模式：点击视图右上角「退出平面模式」、状态栏的平面模式按钮、再次点击左侧「平面」栏，或按 <kbd>Esc</kbd>。
            </p>
          </section>
          <section>
            <h3>建筑内外分离</h3>
            <p className="help-copy">
              左侧「建筑」面板点击模板即可整栋放置；建筑在城市里始终是一个整体，可拖动/旋转/复制。双击建筑或点右侧「进入建筑」进入内部。
            </p>
            <p className="help-copy">
              进入后顶部栏切换「外骨架 / 内饰」：外骨架显示墙、窗、门、楼梯和屋顶；内饰会把视角放进当前楼层并剖切靠相机一侧的外墙，方便摆家具。楼层按钮可逐层切换，点「退出建筑」或空闲时按 Esc 回到城市。
            </p>
          </section>
          <section className="shortcut-section">
            <h3>操作快捷键</h3>
            <div className="shortcut-grid">
              {SHORTCUTS.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.keys}>
                    <span className="shortcut-keys">
                      <Icon size={13} />
                      {item.keys}
                    </span>
                    <span>{item.text}</span>
                  </div>
                )
              })}
            </div>
          </section>
          <section>
            <h3>AI 场景操作</h3>
            <p className="help-copy">
              按 <kbd>Ctrl</kbd> + <kbd>K</kbd> 打开 AI 面板：用中文描述目标，它会建别墅、做房间、布置家具、画道路/河流/桥梁、种树或修改选中构件。
              内置规划器离线可用；也可在 AI 设置中接入 OpenAI 兼容模型。
            </p>
            <p className="help-copy">
              AI 只会调用受控的编辑器动作，不执行任意代码。每轮计划作为一步历史执行，执行后可用 <kbd>Ctrl</kbd> + <kbd>Z</kbd> 一次撤销。
            </p>
          </section>
          <section>
            <h3>导入导出</h3>
            <p className="help-copy">
              项目保存为 <span className="mono">.civitas</span>（JSON，含自动备份）。场景可导出为 GLB / glTF / OBJ /
              STL；导入支持 GLB / glTF / OBJ / STL，导入后的模型会加入组件库并可重复使用。
            </p>
            <p className="help-copy">
              GLB 推荐用于保留材质；OBJ 仅保留几何；STL 适合 3D 打印。浏览器模式下文件会直接下载到默认下载目录。
            </p>
          </section>
        </div>
        <div className="help-foot">
          <span>
            <Eye size={13} /> 选择模式下双击任意构件可让相机聚焦
          </span>
          <span>
            按 <kbd>?</kbd> 随时打开本帮助
          </span>
        </div>
      </div>
    </div>
  )
}
