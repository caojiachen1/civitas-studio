import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Box,
  BrickWall,
  Check,
  CircleDot,
  Construction,
  Copy,
  Eraser,
  Fence,
  Grid2X2,
  FilePlus2,
  Focus,
  Footprints,
  Home,
  Layers,
  Maximize2,
  Move3d,
  Paintbrush,
  Plus,
  Rotate3d,
  Route,
  Sparkles,
  Trash2,
  Waves,
} from 'lucide-react'
import {
  DOOR_STYLES,
  PATH_PRESETS,
  ROOF_STYLES,
  SLAB_STYLES,
  WALL_COLORS,
  WINDOW_STYLES,
  type ModelCategory,
  type PathType,
  type RoofFinish,
  type RoofStyle,
} from '../editor/types'
import { useEditor } from '../editor/store'
import { useRuntime } from '../editor/runtime'
import { getEditorScene } from '../editor/engineRef'
import { createBlankDocument } from '../editor/store'
import { createSampleDocument, SAMPLE_VIEW } from '../editor/sample'
import { completeLevelRooms, detectedRoomCount, roomCompletionSummary } from '../editor/plan'
import { CatalogPanel } from './CatalogPanel'
import { NumberField, Section, Segmented, Slider, Swatch, Toggle } from './common'
import type { PanelId } from './panels'
import { ROOF_FINISH_LABELS } from './labels'

const FINISHES: { id: RoofFinish; color: string }[] = [
  { id: 'terracotta', color: '#a75f46' },
  { id: 'slate', color: '#5f686b' },
  { id: 'charcoal', color: '#41474a' },
  { id: 'copper', color: '#6d8b7b' },
  { id: 'shingle', color: '#6c5b48' },
]

const PATH_TYPES: { id: PathType; label: string; hint: string; icon: typeof Route }[] = [
  { id: 'road', label: '城市道路', hint: '带路缘和人行道', icon: Route },
  { id: 'footpath', label: '人行步道', hint: '庭院与公园小径', icon: Footprints },
  { id: 'bridge', label: '桥梁', hint: '跨越河流与谷地', icon: Construction },
  { id: 'fence', label: '围栏 / 绿篱', hint: '木、金属、绿篱、石墙', icon: Fence },
]

const CATALOG_CONFIG: Record<
  string,
  { title: string; subtitle: string; categories: ModelCategory[] }
> = {
  furniture: {
    title: '室内陈设',
    subtitle: '从软装到整装厨卫，点击组件后直接放置。',
    categories: ['living', 'bedroom', 'dining', 'kitchen', 'bathroom', 'office', 'laundry'],
  },
  outdoor: {
    title: '户外生活',
    subtitle: '庭院家具、遮阳伞与花园构筑物。',
    categories: ['outdoor'],
  },
  city: {
    title: '城市设施',
    subtitle: '街道家具、公共艺术与城市照明。',
    categories: ['street'],
  },
  vegetation: {
    title: '植被园艺',
    subtitle: '乔木、灌木、花坛与地被植物。',
    categories: ['vegetation'],
  },
  vehicles: {
    title: '交通工具',
    subtitle: '道路车辆需要放置在道路面上。',
    categories: ['vehicles'],
  },
  structure: {
    title: '结构构件',
    subtitle: '楼梯、立柱、栏杆等建筑部件。',
    categories: ['structure'],
  },
}

function ToolLaunch({
  active,
  label,
  hint,
  icon: Icon,
  onClick,
}: {
  active: boolean
  label: string
  hint: string
  icon: typeof BrickWall
  onClick: () => void
}) {
  return (
    <button type="button" className={`tool-launch ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span className="launch-icon">
        <Icon size={18} />
      </span>
      <span className="launch-copy">
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <ArrowRight size={16} className="launch-arrow" />
    </button>
  )
}

function TipList({ items }: { items: string[] }) {
  return (
    <ul className="tip-list">
      {items.map((item) => (
        <li key={item}>
          <span className="tip-dot" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function PanelHeading({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow: string
  title: string
  subtitle: string
  icon?: typeof BrickWall
}) {
  return (
    <div className="panel-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>
          {Icon && (
            <span className="heading-icon">
              <Icon size={17} />
            </span>
          )}
          {title}
        </h2>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function RoofGlyph({ style }: { style: RoofStyle }) {
  const stroke = 'currentColor'
  return (
    <svg viewBox="0 0 64 36" className="roof-glyph" aria-hidden="true">
      {style === 'gable' && (
        <>
          <path d="M4 28 L22 8 L42 8 L60 28" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M22 8 L22 28 M42 8 L42 28" stroke={stroke} strokeWidth="1" opacity="0.35" />
          <path d="M22 8 L42 8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
      {style === 'hip' && (
        <>
          <path d="M4 28 L20 8 L44 8 L60 28 Z" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M20 8 L32 28 L44 8" fill="none" stroke={stroke} strokeWidth="1" opacity="0.35" />
        </>
      )}
      {style === 'flat' && (
        <>
          <rect x="8" y="16" width="48" height="12" fill="none" stroke={stroke} strokeWidth="2.2" rx="1" />
          <path d="M8 16 H56" stroke={stroke} strokeWidth="3" />
          <path d="M12 28 V20 M52 28 V20" stroke={stroke} strokeWidth="1" opacity="0.4" />
        </>
      )}
      {style === 'shed' && (
        <>
          <path d="M6 26 L52 8 L58 18 L12 32 Z" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M52 8 V18 M12 32 V22" stroke={stroke} strokeWidth="1" opacity="0.35" />
        </>
      )}
    </svg>
  )
}

function LevelRow({ levelId }: { levelId: string }) {
  const level = useEditor((state) => state.doc.levels.find((item) => item.id === levelId))
  const activeLevelId = useEditor((state) => state.doc.activeLevelId)
  const entities = useEditor((state) => state.doc.entities)
  const levels = useEditor((state) => state.doc.levels)
  const setActiveLevel = useEditor((state) => state.setActiveLevel)
  const updateLevel = useEditor((state) => state.updateLevel)
  const deleteLevel = useEditor((state) => state.deleteLevel)
  const duplicateLevel = useEditor((state) => state.duplicateLevel)
  const toast = useRuntime((state) => state.toast)
  const [name, setName] = useState(level?.name ?? '')
  const active = level?.id === activeLevelId

  useEffect(() => setName(level?.name ?? ''), [level?.name])

  if (!level) return null
  const count = Object.values(entities).filter((entity) => entity.kind !== 'opening' && entity.levelId === levelId).length

  return (
    <div className={`level-row ${active ? 'is-active' : ''}`} onClick={() => setActiveLevel(levelId)}>
      <span className="level-radio">{active ? <CircleDot size={15} /> : <span />}</span>
      <span className="level-content">
        <input
          value={name}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => {
            const trimmed = name.trim()
            if (trimmed && trimmed !== level.name) updateLevel(levelId, { name: trimmed })
            else setName(level.name)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
          }}
          aria-label="楼层名称"
        />
        <span className="level-meta">
          标高 {level.elevation.toFixed(2)} m · {count} 个构件
        </span>
      </span>
      <button
        type="button"
        className="level-copy"
        title="复制本层平面到新楼层"
        onClick={(event) => {
          event.stopPropagation()
          const ok = duplicateLevel(levelId)
          toast(
            ok ? '已复制本层平面到新楼层' : '该层没有可复制的墙体、门窗或楼板',
            ok ? 'success' : 'warn',
          )
        }}
      >
        <Copy size={13} />
      </button>
      <button
        type="button"
        className="level-delete"
        title={count > 0 ? '请先删除该楼层的构件' : levels.length <= 1 ? '至少保留一个楼层' : '删除楼层'}
        disabled={count > 0 || levels.length <= 1}
        onClick={(event) => {
          event.stopPropagation()
          if (count > 0 || levels.length <= 1) {
            toast('该楼层仍有构件，无法删除', 'warn')
            return
          }
          deleteLevel(levelId)
        }}
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function SelectPanel() {
  const settings = useEditor((state) => state.settings)
  const patchSettings = useEditor((state) => state.patchSettings)
  const addLevel = useEditor((state) => state.addLevel)
  const levels = useEditor((state) => state.doc.levels)
  const selectedId = useEditor((state) => state.selectedId)
  const entities = useEditor((state) => state.doc.entities)
  const newProject = useEditor((state) => state.newProject)
  const setTool = useEditor((state) => state.setTool)
  const toast = useRuntime((state) => state.toast)
  const perfQuality = useRuntime((state) => state.perf.quality)
  const [mode, setMode] = useState<'translate' | 'rotate'>('translate')

  const counts = useMemo(() => {
    const result = { objects: 0, walls: 0, openings: 0, paths: 0, surfaces: 0 }
    for (const entity of Object.values(entities)) {
      if (entity.kind === 'object') result.objects++
      else if (entity.kind === 'wall') result.walls++
      else if (entity.kind === 'opening') result.openings++
      else if (entity.kind === 'path') result.paths++
      else if (entity.kind === 'slab' || entity.kind === 'roof') result.surfaces++
    }
    return result
  }, [entities])

  const confirmReset = (message: string) => {
    if (Object.keys(entities).length === 0) return true
    return window.confirm(message)
  }

  const loadBlank = () => {
    if (!confirmReset('当前场景中的内容将被清空，继续新建空白项目吗？\n（自动备份会随新项目更新）')) return
    newProject(createBlankDocument())
    setTool('select')
    getEditorScene()?.setView({ target: [0, 0.5, 0], distance: 32, azimuth: 0.4, polar: 1.0 })
    toast('已新建空白项目', 'success')
  }

  const loadSample = () => {
    if (!confirmReset('当前场景中的内容将被替换为示例场景，继续吗？')) return
    newProject(createSampleDocument())
    setTool('select')
    getEditorScene()?.setView(SAMPLE_VIEW)
    toast('示例项目已载入', 'success')
  }

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="WORKSPACE"
        title="选择与场景"
        subtitle="管理楼层、吸附、相机与项目；点击构件查看属性。"
        icon={Focus}
      />

      <div className="project-actions">
        <button type="button" className="project-action" onClick={loadBlank}>
          <FilePlus2 size={16} />
          <span>
            <strong>新建空白</strong>
            <small>从一块空地开始</small>
          </span>
        </button>
        <button type="button" className="project-action" onClick={loadSample}>
          <Sparkles size={16} />
          <span>
            <strong>示例场景</strong>
            <small>湖畔住宅 · 完整家具</small>
          </span>
        </button>
      </div>

      <Section
        title="楼层"
        aside={
          <button type="button" className="text-button" onClick={() => addLevel()}>
            <Plus size={13} /> 新增楼层
          </button>
        }
      >
        <div className="level-list">
          {levels.map((level) => (
            <LevelRow key={level.id} levelId={level.id} />
          ))}
        </div>
        <Toggle
          checked={settings.isolateLevel}
          onChange={(value) => patchSettings({ isolateLevel: value })}
          label="仅显示当前楼层"
          hint="隐藏其他楼层，便于室内编辑"
        />
      </Section>

      <Section title="相机与变换">
        <div className="button-row">
          <button type="button" className="soft-button" disabled={!selectedId} onClick={() => getEditorScene()?.focusSelection()}>
            <Focus size={14} /> 聚焦选中
          </button>
          <button type="button" className="soft-button" onClick={() => getEditorScene()?.focusAll()}>
            <Maximize2 size={14} /> 全览场景
          </button>
        </div>
        <Segmented
          value={mode}
          onChange={(value) => {
            setMode(value)
            getEditorScene()?.setTransformMode(value)
          }}
          options={[
            { value: 'translate', label: '移动', icon: Move3d },
            { value: 'rotate', label: '旋转', icon: Rotate3d },
          ]}
        />
        <p className="micro-hint">选中家具、楼板或屋顶后，可用场景中的三轴控制柄调整。</p>
      </Section>

      <Section title="吸附与辅助">
        <Toggle checked={settings.gridSnap} onChange={(value) => patchSettings({ gridSnap: value })} label="网格吸附" hint="家具 0.25 m / 墙体 0.1 m" />
        <Toggle checked={settings.angleSnap} onChange={(value) => patchSettings({ angleSnap: value })} label="角度吸附" hint="墙体以 15° 为步进吸附" />
        <Toggle checked={settings.showGrid} onChange={(value) => patchSettings({ showGrid: value })} label="显示网格" />
        <Toggle checked={settings.shadows} onChange={(value) => patchSettings({ shadows: value })} label="实时阴影" hint="关闭可提升大场景帧率" />
        <Toggle checked={settings.showRoofs} onChange={(value) => patchSettings({ showRoofs: value })} label="显示屋顶" hint="隐藏屋顶后可查看并布置室内" />
      </Section>

      <Section title="性能">
        <div className="quality-block">
          <div className="quality-head">
            <span>渲染画质</span>
            <strong>
              {settings.quality === 'auto'
                ? `自动 · ${perfQuality === 'high' ? '高' : perfQuality === 'low' ? '低' : '平衡'}`
                : settings.quality === 'high'
                  ? '高'
                  : settings.quality === 'low'
                    ? '低'
                    : '平衡'}
            </strong>
          </div>
          <Segmented
            compact
            value={settings.quality}
            onChange={(value) => patchSettings({ quality: value })}
            options={[
              { value: 'auto', label: '自动' },
              { value: 'high', label: '高' },
              { value: 'balanced', label: '平衡' },
              { value: 'low', label: '低' },
            ]}
          />
          <p className="micro-hint">自动模式会根据帧率调整渲染分辨率与阴影贴图尺寸；低画质优先保证交互流畅。</p>
        </div>
      </Section>

      <Section title="场景概览">
        <div className="metric-grid">
          <div className="metric-cell">
            <span>构件</span>
            <strong>{counts.objects}</strong>
          </div>
          <div className="metric-cell">
            <span>墙体</span>
            <strong>{counts.walls}</strong>
          </div>
          <div className="metric-cell">
            <span>门窗</span>
            <strong>{counts.openings}</strong>
          </div>
          <div className="metric-cell">
            <span>路径</span>
            <strong>{counts.paths}</strong>
          </div>
          <div className="metric-cell">
            <span>屋顶 / 楼板</span>
            <strong>{counts.surfaces}</strong>
          </div>
          <div className="metric-cell">
            <span>楼层</span>
            <strong>{levels.length}</strong>
          </div>
        </div>
      </Section>

      <div className="shortcut-card">
        <div>
          <strong>快捷键</strong>
          <span>R 旋转 · Delete 删除 · F 聚焦 · Ctrl+D 复制</span>
        </div>
        <kbd>?</kbd>
      </div>
    </div>
  )
}

function PlanPanel() {
  const tool = useEditor((state) => state.tool)
  const setTool = useEditor((state) => state.setTool)
  const settings = useEditor((state) => state.settings)
  const patchSettings = useEditor((state) => state.patchSettings)
  const defaults = useEditor((state) => state.toolOptions)
  const setPlanOptions = useEditor((state) => state.setPlanOptions)
  const doc = useEditor((state) => state.doc)
  const activeLevelId = useEditor((state) => state.doc.activeLevelId)
  const duplicateLevel = useEditor((state) => state.duplicateLevel)
  const toast = useRuntime((state) => state.toast)
  const [withFurniture, setWithFurniture] = useState(false)

  const activeLevel = doc.levels.find((level) => level.id === activeLevelId)
  const walls = useMemo(
    () =>
      Object.values(doc.entities).filter(
        (entity) => entity.kind === 'wall' && entity.levelId === activeLevelId,
      ).length,
    [doc, activeLevelId],
  )
  const surfaces = useMemo(
    () =>
      Object.values(doc.entities).filter(
        (entity) =>
          (entity.kind === 'slab' || entity.kind === 'roof') && entity.levelId === activeLevelId,
      ).length,
    [doc, activeLevelId],
  )
  const rooms = useMemo(() => detectedRoomCount(doc, activeLevelId), [doc, activeLevelId])

  const complete = () => {
    const result = completeLevelRooms(doc, activeLevelId, defaults, defaults.plan)
    if (result.entities.length === 0) {
      toast(rooms > 0 ? '这些房间已经完整，没有需要补全的构件' : '没有检测到闭合房间', 'info')
      return
    }
    const store = useEditor.getState()
    store.beginHistory('补全房间')
    store.addEntities(result.entities, false)
    toast(`补全 ${result.rooms} 个房间：${roomCompletionSummary(result)}`, 'success')
  }

  const copyUp = () => {
    const ok = duplicateLevel(activeLevelId, { withFurniture })
    toast(
      ok ? '已复制本层平面到新楼层' : '当前层没有可复制的墙体、门窗或楼板',
      ok ? 'success' : 'warn',
    )
  }

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="PLAN MODE"
        title="平面建造"
        subtitle="俯视拖拽房间，自动生成三维墙体、楼板与门窗；按层复制即可快速叠出整栋建筑。"
        icon={Grid2X2}
      />
      <ToolLaunch
        active={tool === 'plan'}
        label="拖拽房间"
        hint="在平面视图拖出矩形，松开自动成房"
        icon={Grid2X2}
        onClick={() => {
          setTool('plan')
          if (!settings.planMode) patchSettings({ planMode: true })
        }}
      />
      <Section title="平面视图">
        <Toggle
          checked={settings.planMode}
          onChange={(value) => patchSettings({ planMode: value })}
          label="锁定俯视视角"
          hint="隐藏屋顶与其他楼层，只允许平移/缩放，便于二维绘制"
        />
        <button
          type="button"
          className="soft-button wide"
          disabled={!settings.planMode}
          onClick={() => patchSettings({ planMode: false })}
        >
          <Rotate3d size={14} /> 返回 3D 视角
        </button>
        <p className="micro-hint">
          当前层：{activeLevel?.name ?? '—'} · 闭合房间 {rooms} 个 · 墙体 {walls} 段 · 楼板/屋顶 {surfaces} 块
        </p>
      </Section>
      <Section title="自动生成">
        <Toggle
          checked={defaults.plan.autoSlab}
          onChange={(autoSlab) => setPlanOptions({ autoSlab })}
          label="自动楼板"
          hint="房间内生成一块与墙体同尺寸的地板"
        />
        <Toggle
          checked={defaults.plan.autoDoor}
          onChange={(autoDoor) => setPlanOptions({ autoDoor })}
          label="自动门"
          hint="在第一条能容纳门的墙居中开一扇门"
        />
        <Toggle
          checked={defaults.plan.autoWindow}
          onChange={(autoWindow) => setPlanOptions({ autoWindow })}
          label="自动窗"
          hint="其余墙面各开一扇窗（放不下会自动跳过）"
        />
        <Toggle
          checked={defaults.plan.autoRoof}
          onChange={(autoRoof) => setPlanOptions({ autoRoof })}
          label="自动屋顶（仅顶层）"
          hint="多层建筑请先关闭，封顶时再打开"
        />
      </Section>
      <Section title="快速操作">
        <div className="button-row">
          <button type="button" className="soft-button" onClick={complete}>
            <Sparkles size={14} /> 补全闭合房间
          </button>
          <button type="button" className="soft-button" onClick={copyUp}>
            <Copy size={14} /> 复制到新楼层
          </button>
        </div>
        <Toggle
          checked={withFurniture}
          onChange={setWithFurniture}
          label="复制时包含家具"
          hint="墙体、门窗、楼板始终复制；家具按此开关决定"
        />
        <p className="micro-hint">
          「补全闭合房间」会把手工画的闭合墙环补上楼板，并可自动加门/窗/屋顶；「复制到新楼层」会把本层平面抬到新的标高，自动组成多层建筑。
        </p>
      </Section>
      <Section title="使用顺序">
        <TipList
          items={[
            '进入平面视图，拖出第一个房间；可继续拖出相邻房间。',
            '用墙体工具补画异形轮廓，再点「补全闭合房间」。',
            '需要多层时点「复制到新楼层」，在上层继续改墙与门窗。',
            '最后在顶层打开「自动屋顶」并补全，或手动加屋顶。',
          ]}
        />
      </Section>
      <div className="panel-footnote">
        <span className="legend-dot valid" /> 拖拽生成
        <span className="footnote-sep">·</span> Esc 退出平面模式
      </div>
    </div>
  )
}

function WallPanel() {
  const wallOptions = useEditor((state) => state.toolOptions.wall)
  const setWallDefaults = useEditor((state) => state.setWallDefaults)
  const setTool = useEditor((state) => state.setTool)
  const tool = useEditor((state) => state.tool)

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="BUILD TOOL"
        title="墙体"
        subtitle="按控制点绘制连续墙体，终点靠近已有端点时自动接合。"
        icon={BrickWall}
      />
      <ToolLaunch
        active={tool === 'wall'}
        label="墙体绘制"
        hint="点击地面确定起点，连续点击绘制"
        icon={BrickWall}
        onClick={() => setTool('wall')}
      />
      <Section title="默认参数">
        <div className="field-grid two">
          <NumberField label="墙高" value={wallOptions.height} min={0.6} max={8} step={0.1} suffix="m" onChange={(height) => setWallDefaults({ height })} />
          <NumberField
            label="墙厚"
            value={wallOptions.thickness}
            min={0.06}
            max={0.6}
            step={0.01}
            suffix="m"
            onChange={(thickness) => setWallDefaults({ thickness })}
          />
        </div>
      </Section>
      <Section title="墙面颜色">
        <div className="swatch-grid">
          {WALL_COLORS.map((color) => (
            <Swatch
              key={color.id}
              color={color.color}
              name={color.name}
              selected={wallOptions.color === color.color}
              onClick={() => setWallDefaults({ color: color.color })}
            />
          ))}
        </div>
      </Section>
      <Section title="绘制提示">
        <TipList
          items={[
            '端点吸附半径 0.8 m，靠近已绘制墙体端点会自动接合。',
            '靠近起点再次点击即可闭合墙体，生成可识别的房间。',
            '墙体会自动补角、添加踢脚线与顶部压线。',
            '在「门窗」工具中点击墙面即可开洞。',
          ]}
        />
      </Section>
      <div className="panel-footnote">
        <span className="legend-dot valid" /> 右键 / Enter 完成
        <span className="footnote-sep">·</span> Esc 取消
      </div>
    </div>
  )
}

function OpeningsPanel() {
  const tool = useEditor((state) => state.tool)
  const defaults = useEditor((state) => state.toolOptions.openings)
  const setTool = useEditor((state) => state.setTool)
  const setDoorStyle = useEditor((state) => state.setDoorStyle)
  const setWindowStyle = useEditor((state) => state.setWindowStyle)
  const setOpeningDefaults = useEditor((state) => state.setOpeningDefaults)
  const hingeAvailable = !['double', 'sliding', 'garage'].includes(defaults.doorStyle)

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="OPENINGS"
        title="门窗"
        subtitle="门窗只能开在墙体上，会自动吸附墙面并避让已有洞口。"
        icon={Box}
      />
      <Segmented
        value={tool === 'window' ? 'window' : 'door'}
        onChange={(value) => setTool(value)}
        options={[
          { value: 'door', label: '门' },
          { value: 'window', label: '窗' },
        ]}
      />
      <Section title="门样式">
        <div className="style-choice-list">
          {DOOR_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`style-choice ${defaults.doorStyle === style.id ? 'is-active' : ''}`}
              onClick={() => {
                setDoorStyle(style.id)
                setTool('door')
              }}
            >
              <span className={`choice-swatch door ${style.glass ? 'is-glass' : ''}`} />
              <span className="choice-copy">
                <strong>{style.name}</strong>
                <small>
                  {style.width.toFixed(2)} × {style.height.toFixed(2)} m
                </small>
              </span>
              {defaults.doorStyle === style.id && <Check size={14} />}
            </button>
          ))}
        </div>
      </Section>
      <Section title="门开启默认值">
        {defaults.doorStyle === 'garage' ? (
          <p className="micro-hint">车库门为卷帘样式，暂不支持开启角度。</p>
        ) : (
          <>
            {hingeAvailable && (
              <Segmented
                value={defaults.doorHinge}
                onChange={(doorHinge) => setOpeningDefaults({ doorHinge })}
                options={[
                  { value: 'left', label: '左开' },
                  { value: 'right', label: '右开' },
                ]}
              />
            )}
            <Slider
              label={defaults.doorStyle === 'sliding' ? '默认开启程度' : '默认开启角度'}
              value={defaults.doorOpenAngle}
              min={-135}
              max={135}
              step={1}
              onChange={(doorOpenAngle) => setOpeningDefaults({ doorOpenAngle })}
              display={
                defaults.doorStyle === 'sliding'
                  ? `${Math.round((Math.abs(defaults.doorOpenAngle) / 135) * 100)}%`
                  : `${Math.round(defaults.doorOpenAngle)}°`
              }
            />
            <p className="micro-hint">只影响新放置的门；已放置的门请在右侧属性面板调整。</p>
          </>
        )}
      </Section>
      <Section title="窗样式">
        <div className="style-choice-list">
          {WINDOW_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`style-choice ${defaults.windowStyle === style.id ? 'is-active' : ''}`}
              onClick={() => {
                setWindowStyle(style.id)
                setTool('window')
              }}
            >
              <span className="choice-swatch window" />
              <span className="choice-copy">
                <strong>{style.name}</strong>
                <small>
                  {style.width.toFixed(2)} × {style.height.toFixed(2)} m · 窗台 {style.sill.toFixed(2)} m
                </small>
              </span>
              {defaults.windowStyle === style.id && <Check size={14} />}
            </button>
          ))}
        </div>
      </Section>
      <Section title="放置规则">
        <TipList
          items={[
            '红色预览表示洞口与已有门窗重叠、超出墙长或超出墙高。',
            '门窗的尺寸可在右侧属性面板中继续微调。',
            '删除墙体时，墙体上的门窗会自动一起删除。',
          ]}
        />
      </Section>
    </div>
  )
}

function SlabPanel() {
  const options = useEditor((state) => state.toolOptions.slab)
  const setSlabDefaults = useEditor((state) => state.setSlabDefaults)
  const setSlabStyle = useEditor((state) => state.setSlabStyle)
  const setTool = useEditor((state) => state.setTool)
  const tool = useEditor((state) => state.tool)

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="SURFACE"
        title="楼板与平台"
        subtitle="拖拽绘制矩形楼板、室内地面或户外木平台。"
        icon={Layers}
      />
      <ToolLaunch
        active={tool === 'slab'}
        label="拖拽绘制楼板"
        hint="按住左键拖出矩形范围"
        icon={Layers}
        onClick={() => setTool('slab')}
      />
      <Section title="面层材质">
        <div className="slab-style-grid">
          {SLAB_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`slab-style ${options.style === style.id ? 'is-active' : ''}`}
              onClick={() => {
                setSlabStyle(style.id)
                setTool('slab')
              }}
            >
              <span className="slab-preview" style={{ background: `linear-gradient(135deg, ${style.top}, ${style.color})` }} />
              <span>{style.name}</span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="参数">
        <NumberField
          label="板厚"
          value={options.thickness}
          min={0.05}
          max={1}
          step={0.02}
          suffix="m"
          onChange={(thickness) => setSlabDefaults({ thickness })}
        />
      </Section>
      <Section title="提示">
        <TipList
          items={[
            '楼板位于当前楼层的标高，切换楼层后可叠加上层楼板。',
            '选中楼板后可在属性面板调整长宽、角度与材质。',
            '户外木平台使用「户外木平台」面层即可。',
          ]}
        />
      </Section>
    </div>
  )
}

function ShowRoofsToggle() {
  const showRoofs = useEditor((state) => state.settings.showRoofs)
  const patchSettings = useEditor((state) => state.patchSettings)
  return (
    <Toggle
      checked={showRoofs}
      onChange={(value) => patchSettings({ showRoofs: value })}
      label="显示屋顶"
      hint="关闭后可进入室内查看家具布局"
    />
  )
}

function RoofPanel() {
  const options = useEditor((state) => state.toolOptions.roof)
  const setRoofDefaults = useEditor((state) => state.setRoofDefaults)
  const setRoofStyle = useEditor((state) => state.setRoofStyle)
  const setTool = useEditor((state) => state.setTool)
  const tool = useEditor((state) => state.tool)

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="ROOF"
        title="屋顶"
        subtitle="点击被墙体围合的房间，自动按外接矩形生成完整屋顶。"
        icon={Home}
      />
      <ToolLaunch
        active={tool === 'roof'}
        label="自动识别房间"
        hint="点击封闭房间生成屋顶"
        icon={Home}
        onClick={() => setTool('roof')}
      />
      <ShowRoofsToggle />
      <Section title="屋顶形式">
        <div className="roof-style-grid">
          {ROOF_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`roof-style ${options.style === style.id ? 'is-active' : ''}`}
              onClick={() => {
                setRoofStyle(style.id)
                setTool('roof')
              }}
            >
              <RoofGlyph style={style.id} />
              <strong>{style.name}</strong>
              <small>{style.hint}</small>
            </button>
          ))}
        </div>
      </Section>
      <Section title="屋面材质">
        <div className="finish-grid">
          {FINISHES.map((finish) => (
            <button
              key={finish.id}
              type="button"
              className={`finish-chip ${options.finish === finish.id ? 'is-active' : ''}`}
              onClick={() => setRoofDefaults({ finish: finish.id })}
            >
              <span style={{ background: finish.color }} />
              {ROOF_FINISH_LABELS[finish.id]}
            </button>
          ))}
        </div>
      </Section>
      <Section title="坡度与挑檐">
        <div className="field-grid two">
          <NumberField
            label="坡度"
            value={options.pitch}
            min={0}
            max={70}
            step={1}
            suffix="°"
            precision={0}
            onChange={(pitch) => setRoofDefaults({ pitch })}
          />
          <NumberField
            label="挑檐"
            value={options.overhang}
            min={0}
            max={2}
            step={0.05}
            suffix="m"
            onChange={(overhang) => setRoofDefaults({ overhang })}
          />
        </div>
      </Section>
      <Section title="识别条件">
        <TipList
          items={[
            '房间必须由墙体围合，墙端点会自动吸附形成闭合回路。',
            '屋顶会覆盖房间的最小外接矩形，并可继续在属性面板中调整。',
            'L 形或不规则房间可以先用屋顶工具生成，再由属性面板修正尺寸。',
          ]}
        />
      </Section>
    </div>
  )
}

function RoadsPanel() {
  const options = useEditor((state) => state.toolOptions.path)
  const setPathOptions = useEditor((state) => state.setPathOptions)
  const setPathType = useEditor((state) => state.setPathType)
  const tool = useEditor((state) => state.tool)
  const active = tool === 'path'

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="PATHS & NETWORKS"
        title="曲线路径"
        subtitle="道路、步道、桥梁与围栏都沿自由曲线生成，可任意弯曲与闭合。"
        icon={Route}
      />
      <div className="path-type-grid">
        {PATH_TYPES.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              type="button"
              className={`path-type ${options.type === type.id && active ? 'is-active' : ''}`}
              onClick={() => setPathType(type.id)}
            >
              <Icon size={19} />
              <strong>{type.label}</strong>
              <small>{type.hint}</small>
            </button>
          )
        })}
      </div>
      <ToolLaunch
        active={active}
        label={`绘制${PATH_PRESETS[options.type].name}`}
        hint="连续点击添加控制点，平滑成曲线"
        icon={Route}
        onClick={() => setPathType(options.type)}
      />
      <Section title="路径参数">
        {options.type !== 'fence' && (
          <NumberField
            label="宽度"
            value={options.width}
            min={options.type === 'footpath' ? 0.8 : 2}
            max={30}
            step={0.1}
            suffix="m"
            onChange={(width) => setPathOptions({ width })}
          />
        )}
        {(options.type === 'road' || options.type === 'bridge') && (
          <>
            <Segmented
              compact
              value={String(options.lanes) === '4' ? '4' : '2'}
              onChange={(value) => setPathOptions({ lanes: Number(value) })}
              options={[
                { value: '2', label: '双向 2 车道' },
                { value: '4', label: '双向 4 车道' },
              ]}
            />
            <Toggle
              checked={options.sidewalk}
              onChange={(sidewalk) => setPathOptions({ sidewalk })}
              label="设置人行道与路缘"
              hint={options.type === 'bridge' ? '桥面两侧步道' : '道路两侧 1.4 m 人行道'}
            />
          </>
        )}
        {options.type === 'bridge' && (
          <>
            <NumberField
              label="桥面高度"
              value={options.bridgeHeight}
              min={0.8}
              max={20}
              step={0.2}
              suffix="m"
              onChange={(bridgeHeight) => setPathOptions({ bridgeHeight })}
            />
            <Toggle
              checked={options.railings}
              onChange={(railings) => setPathOptions({ railings })}
              label="桥梁护栏"
              hint="自动生成护栏与桥墩"
            />
          </>
        )}
        {options.type === 'footpath' && (
          <Segmented
            compact
            value={options.style}
            onChange={(style) => setPathOptions({ style })}
            options={[
              { value: 'stone', label: '石材铺装' },
              { value: 'gravel', label: '碎石小径' },
            ]}
          />
        )}
        {options.type === 'fence' && (
          <div className="fence-style-grid">
            {[
              { id: 'wood', label: '木栅栏' },
              { id: 'metal', label: '金属栏杆' },
              { id: 'hedge', label: '修剪绿篱' },
              { id: 'stone', label: '矮石墙' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                className={`fence-chip ${options.style === style.id ? 'is-active' : ''}`}
                onClick={() => setPathOptions({ style: style.id })}
              >
                <Fence size={14} />
                {style.label}
              </button>
            ))}
          </div>
        )}
      </Section>
      <Section title="曲线编辑">
        <TipList
          items={[
            '点击添加控制点，曲线使用 Catmull-Rom 算法平滑连接。',
            '回到起点自动吸附并闭合，可绘制环形道路或池塘。',
            '选中路径后拖动金色控制点即可重塑曲线；宽度可在属性面板调整。',
            '普通道路不能直接跨越河流，请改用桥梁工具。',
          ]}
        />
      </Section>
    </div>
  )
}

function WaterPanel() {
  const options = useEditor((state) => state.toolOptions.path)
  const setPathOptions = useEditor((state) => state.setPathOptions)
  const setPathType = useEditor((state) => state.setPathType)
  const tool = useEditor((state) => state.tool)

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="WATER"
        title="河流与水体"
        subtitle="绘制自然弯曲的河流；闭合路径可形成池塘，并用桥梁跨越。"
        icon={Waves}
      />
      <ToolLaunch
        active={tool === 'path' && options.type === 'river'}
        label="绘制河流"
        hint="连续点击添加河道控制点"
        icon={Waves}
        onClick={() => setPathType('river')}
      />
      <Section title="河道参数">
        <NumberField
          label="水面宽度"
          value={options.type === 'river' ? options.width : 9}
          min={1.5}
          max={45}
          step={0.5}
          suffix="m"
          onChange={(width) => setPathOptions({ width })}
          disabled={options.type !== 'river'}
        />
        <p className="micro-hint">
          水面带有流动波纹与反光，岸边会自动生成泥土与草带。
        </p>
      </Section>
      <Section title="水体操作">
        <TipList
          items={[
            '绘制时回到起点会自动闭合，闭合回路内会填充为池塘水面。',
            '河流不能被普通道路直接穿越；使用「桥梁」工具跨越。',
            '桥梁会自动生成桥墩、护栏和端部坡道。',
            '游艇等水上组件只能放置在水面上。',
          ]}
        />
      </Section>
      <div className="info-card">
        <Waves size={18} />
        <div>
          <strong>曲线水系</strong>
          <p>选中河流后拖动控制点可调整每个弯道；增减控制点可改变河岸轮廓。</p>
        </div>
      </div>
    </div>
  )
}

function ErasePanel() {
  const setTool = useEditor((state) => state.setTool)
  const removeEntity = useEditor((state) => state.removeEntity)
  const selectedId = useEditor((state) => state.selectedId)

  return (
    <div className="panel-scroll">
      <PanelHeading
        eyebrow="ERASE"
        title="擦除"
        subtitle="点击场景中的构件将其删除；删除墙体时门窗一并移除。"
        icon={Eraser}
      />
      <ToolLaunch active label="擦除工具" hint="点击任意构件删除" icon={Eraser} onClick={() => setTool('erase')} />
      <button
        type="button"
        className="soft-button wide danger"
        disabled={!selectedId}
        onClick={() => selectedId && removeEntity(selectedId, true)}
      >
        <Trash2 size={14} /> 删除当前选中构件
      </button>
      <div className="info-card">
        <Paintbrush size={18} />
        <div>
          <strong>不可逆操作</strong>
          <p>每次删除都可以用 Ctrl+Z 撤销。门窗作为墙体的一部分，会随墙体一起删除。</p>
        </div>
      </div>
    </div>
  )
}

export function LeftPanel({ activePanel }: { activePanel: PanelId }) {
  const catalog = CATALOG_CONFIG[activePanel]
  if (catalog) {
    return (
      <aside className="side-panel">
        <CatalogPanel
          key={activePanel}
          title={catalog.title}
          subtitle={catalog.subtitle}
          categories={catalog.categories}
        />
      </aside>
    )
  }
  return (
    <aside className="side-panel">
      {activePanel === 'select' && <SelectPanel />}
      {activePanel === 'plan' && <PlanPanel />}
      {activePanel === 'wall' && <WallPanel />}
      {activePanel === 'openings' && <OpeningsPanel />}
      {activePanel === 'slab' && <SlabPanel />}
      {activePanel === 'roof' && <RoofPanel />}
      {activePanel === 'roads' && <RoadsPanel />}
      {activePanel === 'water' && <WaterPanel />}
      {activePanel === 'erase' && <ErasePanel />}
    </aside>
  )
}
