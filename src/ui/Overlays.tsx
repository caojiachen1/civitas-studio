import {
  AlertTriangle,
  Armchair,
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
  const furnishLevel = useEditor((state) => state.furnishLevel)
  const toast = useRuntime((state) => state.toast)
  if (!session) return null
  return (
    <div className="building-session-bar" data-ui-scope="building-session">
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
        className="building-action"
        data-automation-id="session-furnish-level"
        title="按闭合房间自动布置家具"
        onClick={() => {
          const activeLevel = levels.find((level) => level.id === activeLevelId)
          const result = furnishLevel()
          toast(
            result.items > 0
              ? `已精装「${activeLevel?.name ?? '当前层'}」：${result.items} 件家具`
              : '当前层没有可精装的闭合房间',
            result.items > 0 ? 'success' : 'info',
          )
        }}
      >
        <Armchair size={14} /> 精装本层
      </button>
      <button
        type="button"
        className="building-exit"
        data-automation-id="session-exit-building"
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
            hint="从左侧「建城」一键生成街区，或从「平面」拖一个房间、选择墙体/路径/家具开始；也可以加载示例场景查看完整作品。"
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
      data-ui-scope="help-modal"
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
                <strong>想省事就一键建城</strong>
                <span>左侧「建城」选城市气质和规模，一次铺好路网、建筑、树木与街具。</span>
              </li>
              <li>
                <strong>选工具或模板</strong>
                <span>建筑模板点一下就会跟着鼠标出现预览；墙体、路径与组件库在左侧栏。</span>
              </li>
              <li>
                <strong>观察预览</strong>
                <span>浅灰色为可放置，红色为禁止放置并会说明原因。</span>
              </li>
              <li>
                <strong>点击确认</strong>
                <span>建筑、家具与道路可连续放置；墙体在右键或 Enter 时完成。</span>
              </li>
              <li>
                <strong>继续编辑</strong>
                <span>用选择工具拖动手柄，或在右侧属性面精修；Ctrl+Z 撤销整批操作。</span>
              </li>
            </ol>
          </section>
          <section>
            <h3>吸附与合法性</h3>
            <ul className="help-list">
              <li>墙体端点吸附半径 0.8 m；墙端靠近已有墙的中段时也会吸附到墙面，隔墙接上外墙后即可被识别为独立房间。</li>
              <li>道路与河流端点按类型使用 1.2–2.6 m 吸附半径；绘制路径时默认按 15° 吸附，按住 Shift 自由绘制。</li>
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
              左侧「建筑」面板点击模板即进入放置预览：鼠标在地面上移动，白色预览可放置、红色表示冲突，<kbd>R</kbd> 旋转。放下前还能调楼层数、立面颜色、屋顶材质、窗型，并选择自动精装和附带庭院。
            </p>
            <p className="help-copy">
              建筑在城市里始终是一个整体，可拖动/旋转/复制。双击建筑或点右侧「进入建筑」进入内部；顶部栏切换「外骨架 / 内饰」，内饰会把视角放进当前楼层并剖切靠相机一侧的外墙。
            </p>
          </section>
          <section>
            <h3>一键精装与庭院</h3>
            <p className="help-copy">
              平面模式画好房间后，点「一键精装本层」会按闭合房间自动识别客厅、卧室、厨房、卫浴与书房，并摆放成套家具；门窗和楼梯周边会自动留空。
            </p>
            <p className="help-copy">
              建筑内部顶部栏的「精装本层」、右侧建筑属性里的「精装整栋」和「布置庭院」做同样的事。庭院会生成门前步道、树木、花坛、路灯和长椅，并避让道路与已有物件。
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
