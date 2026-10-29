import { useMemo } from 'react'
import {
  Armchair,
  Box,
  BrickWall,
  Building2,
  Copy,
  DoorOpen,
  Focus,
  Gauge,
  Home,
  Layers,
  MousePointer2,
  Route,
  Trash2,
  Trees,
  Waves,
  X,
} from 'lucide-react'
import { useEditor } from '../editor/store'
import { useRuntime } from '../editor/runtime'
import { getEditorScene } from '../editor/engineRef'
import { BUILDING_TEMPLATES } from '../editor/buildings'
import { getModel } from '../models/registry'
import {
  DOOR_STYLES,
  SLAB_STYLES,
  WALL_COLORS,
  WINDOW_STYLES,
  type BuildingEntity,
  type Entity,
  type OpeningEntity,
  type PathEntity,
  type RoofEntity,
  type RoofFinish,
  type SlabEntity,
  type SlabStyle,
  type WallEntity,
} from '../editor/types'
import { NumberField, Section, Segmented, Slider, Swatch, Toggle } from './common'
import {
  ROOF_FINISH_LABELS,
  ROOF_STYLE_LABELS,
  entityDisplayName,
  pathTypeLabel,
  slabStyleLabel,
} from './labels'

type Update = (patch: Record<string, unknown>, history?: boolean) => void

const FINISHES: { id: RoofFinish; color: string }[] = [
  { id: 'terracotta', color: '#a75f46' },
  { id: 'slate', color: '#5f686b' },
  { id: 'charcoal', color: '#41474a' },
  { id: 'copper', color: '#6d8b7b' },
  { id: 'shingle', color: '#6c5b48' },
]

function entityIcon(entity: Entity) {
  if (entity.kind === 'wall') return BrickWall
  if (entity.kind === 'opening') return DoorOpen
  if (entity.kind === 'path') return entity.pathType === 'river' ? Waves : Route
  if (entity.kind === 'slab') return Layers
  if (entity.kind === 'roof') return Home
  if (entity.kind === 'building') return Building2
  return Armchair
}

function kindEyebrow(entity: Entity): string {
  if (entity.kind === 'wall') return 'WALL'
  if (entity.kind === 'opening') return entity.type === 'door' ? 'DOOR' : 'WINDOW'
  if (entity.kind === 'path') return 'PATH'
  if (entity.kind === 'slab') return 'FLOOR'
  if (entity.kind === 'roof') return 'ROOF'
  if (entity.kind === 'building') return 'BUILDING'
  return 'OBJECT'
}

function LevelSelect({
  entity,
  update,
  disabled = false,
}: {
  entity: Entity
  update: Update
  disabled?: boolean
}) {
  const levels = useEditor((state) => state.doc.levels)
  const wall = useEditor((state) =>
    entity.kind === 'opening' ? state.doc.entities[entity.wallId] : null,
  )
  const levelId = entity.kind === 'opening' && wall?.kind === 'wall' ? wall.levelId : entity.kind === 'opening' ? '' : entity.levelId

  return (
    <Section title="所属楼层">
      <label className="select-field">
        <span>楼层</span>
        <select
          value={levelId}
          disabled={disabled || entity.kind === 'opening'}
          onChange={(event) => update({ levelId: event.target.value }, true)}
        >
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name} · {level.elevation.toFixed(2)} m
            </option>
          ))}
        </select>
      </label>
      {entity.kind === 'opening' && <p className="micro-hint">门窗的楼层由所属墙体决定。</p>}
    </Section>
  )
}

function WallFields({ wall, update }: { wall: WallEntity; update: Update }) {
  const entities = useEditor((state) => state.doc.entities)
  const openings = useMemo(
    () => Object.values(entities).filter((entity) => entity.kind === 'opening' && entity.wallId === wall.id),
    [entities, wall.id],
  )
  const length = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1])
  const setEndpoint = (which: 'a' | 'b', axis: 0 | 1, value: number) => {
    const next: [number, number] = [...(which === 'a' ? wall.a : wall.b)] as [number, number]
    next[axis] = value
    update({ [which]: next })
  }

  return (
    <>
      <Section title="墙体几何">
        <div className="field-grid two">
          <NumberField label="A · X" value={wall.a[0]} step={0.1} suffix="m" onChange={(value) => setEndpoint('a', 0, value)} />
          <NumberField label="A · Z" value={wall.a[1]} step={0.1} suffix="m" onChange={(value) => setEndpoint('a', 1, value)} />
          <NumberField label="B · X" value={wall.b[0]} step={0.1} suffix="m" onChange={(value) => setEndpoint('b', 0, value)} />
          <NumberField label="B · Z" value={wall.b[1]} step={0.1} suffix="m" onChange={(value) => setEndpoint('b', 1, value)} />
        </div>
        <div className="readout-row">
          <span>长度</span>
          <strong>{length.toFixed(2)} m</strong>
        </div>
        <div className="field-grid two">
          <NumberField label="墙高" value={wall.height} min={0.6} max={8} step={0.1} suffix="m" onChange={(height) => update({ height })} />
          <NumberField
            label="墙厚"
            value={wall.thickness}
            min={0.06}
            max={0.6}
            step={0.01}
            suffix="m"
            onChange={(thickness) => update({ thickness })}
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
              selected={wall.color === color.color}
              onClick={() => update({ color: color.color })}
            />
          ))}
        </div>
      </Section>
      <Section title="墙体信息">
        <div className="readout-row">
          <span>门窗洞口</span>
          <strong>{openings.length}</strong>
        </div>
        <p className="micro-hint">拖动场景中的金色端点可直接调整墙体；端点会自动吸附至邻近墙。</p>
      </Section>
    </>
  )
}

function OpeningFields({
  opening,
  update,
  begin,
}: {
  opening: OpeningEntity
  update: Update
  begin: () => void
}) {
  const wall = useEditor((state) => state.doc.entities[opening.wallId])
  const select = useEditor((state) => state.select)
  const wallLength = wall && wall.kind === 'wall' ? Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1]) : 0
  const styles = opening.type === 'door' ? DOOR_STYLES : WINDOW_STYLES
  const current = styles.find((style) => style.id === opening.style) ?? styles[0]
  const maxOffset = Math.max(opening.width / 2 + 0.1, wallLength - opening.width / 2 - 0.1)

  return (
    <>
      <Section title="门窗样式">
        <div className="style-choice-list compact">
          {styles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`style-choice ${opening.style === style.id ? 'is-active' : ''}`}
              onClick={() =>
                update({
                  style: style.id,
                  width: style.width,
                  height: style.height,
                  sill: opening.type === 'window' ? (style as { sill: number }).sill : 0,
                })
              }
            >
              <span className={`choice-swatch ${opening.type === 'door' && (style as { glass?: boolean }).glass ? 'is-glass' : ''} ${opening.type === 'window' ? 'window' : 'door'}`} />
              <span className="choice-copy">
                <strong>{style.name}</strong>
                <small>
                  {style.width.toFixed(2)} × {style.height.toFixed(2)} m
                </small>
              </span>
            </button>
          ))}
        </div>
        <p className="micro-hint">
          当前样式：{current.name} · 墙体长度 {wallLength.toFixed(2)} m
        </p>
      </Section>
      {opening.type === 'door' && (
        <Section title="开启状态">
          {opening.style === 'garage' ? (
            <p className="micro-hint">车库门为卷帘样式，暂不支持开启角度。</p>
          ) : (
            <>
              {!['double', 'sliding'].includes(opening.style) && (
                <Segmented
                  value={opening.hinge ?? 'left'}
                  onChange={(hinge) => update({ hinge })}
                  options={[
                    { value: 'left', label: '左开' },
                    { value: 'right', label: '右开' },
                  ]}
                />
              )}
              <Slider
                label={opening.style === 'sliding' ? '开启程度' : '开启角度'}
                value={opening.openAngle ?? 0}
                min={-135}
                max={135}
                step={1}
                onBegin={begin}
                onChange={(openAngle) => update({ openAngle }, false)}
                display={
                  opening.style === 'sliding'
                    ? `${Math.round((Math.abs(opening.openAngle ?? 0) / 135) * 100)}%${(opening.openAngle ?? 0) < 0 ? ' · 左滑' : ''}`
                    : `${Math.round(opening.openAngle ?? 0)}°`
                }
              />
              <p className="micro-hint">0° 为关闭；负值向墙体另一侧开启。</p>
            </>
          )}
        </Section>
      )}
      <Section title="洞口位置">
        <Slider
          label="距墙体起点"
          value={Math.min(opening.offset, maxOffset)}
          min={opening.width / 2 + 0.1}
          max={maxOffset}
          step={0.02}
          onBegin={begin}
          onChange={(offset) => update({ offset }, false)}
          display={`${opening.offset.toFixed(2)} m`}
        />
        <div className="field-grid two">
          <NumberField label="洞口宽" value={opening.width} min={0.3} max={Math.max(0.4, wallLength - 0.2)} step={0.05} suffix="m" onChange={(width) => update({ width })} />
          <NumberField label="洞口高" value={opening.height} min={0.3} max={4} step={0.05} suffix="m" onChange={(height) => update({ height })} />
        </div>
        {opening.type === 'window' && (
          <NumberField label="窗台高" value={opening.sill} min={0} max={3} step={0.05} suffix="m" onChange={(sill) => update({ sill })} />
        )}
      </Section>
      <Section title="关联墙体">
        <div className="readout-row">
          <span>墙体编号</span>
          <strong className="mono">{opening.wallId}</strong>
        </div>
        <button
          type="button"
          className="soft-button wide"
          onClick={() => select(opening.wallId)}
        >
          <BrickWall size={14} /> 选中所属墙体
        </button>
      </Section>
    </>
  )
}

function BuildingFields({ building }: { building: BuildingEntity }) {
  const enterBuilding = useEditor((state) => state.enterBuilding)
  const furnishBuilding = useEditor((state) => state.furnishBuilding)
  const landscapeSelectedBuilding = useEditor((state) => state.landscapeSelectedBuilding)
  const toast = useRuntime((state) => state.toast)
  const template = BUILDING_TEMPLATES.find((item) => item.id === building.templateId) ?? BUILDING_TEMPLATES[0]
  const interiorCount = Object.keys(building.interior.entities).length
  return (
    <>
      <Section title="建筑信息">
        <div className="readout-row">
          <span>模板</span>
          <strong>{template.name}</strong>
        </div>
        <div className="readout-row">
          <span>尺寸</span>
          <strong className="mono">
            {building.width} × {building.depth} m
          </strong>
        </div>
        <div className="readout-row">
          <span>层数 / 层高</span>
          <strong className="mono">
            {building.floors} 层 · {building.floorHeight.toFixed(1)} m
          </strong>
        </div>
        <div className="readout-row">
          <span>内部构件</span>
          <strong className="mono">{interiorCount}</strong>
        </div>
        <button type="button" className="soft-button wide" onClick={() => enterBuilding(building.id)}>
          <Building2 size={14} /> 进入建筑（外骨架 / 内饰）
        </button>
        <div className="button-row">
          <button
            type="button"
            className="soft-button"
            onClick={() => {
              const result = furnishBuilding(building.id)
              toast(
                result.items > 0
                  ? `已为 ${result.rooms} 个房间摆放 ${result.items} 件家具`
                  : '没有可精装的闭合房间',
                result.items > 0 ? 'success' : 'info',
              )
            }}
          >
            <Armchair size={14} /> 精装整栋
          </button>
          <button
            type="button"
            className="soft-button"
            onClick={() => {
              const result = landscapeSelectedBuilding(building.id)
              toast(
                result && result.entities.length > 0
                  ? `已布置 ${result.props} 个庭院构件${result.path ? '和门前步道' : ''}`
                  : '周边已有庭院或空间不足，未新增构件',
                result && result.entities.length > 0 ? 'success' : 'info',
              )
            }}
          >
            <Trees size={14} /> 布置庭院
          </button>
        </div>
        <p className="micro-hint">也可以直接双击城市中的建筑进入；进入后顶部栏切换骨架/内饰与楼层。「精装整栋」按房间识别类型并自动摆家具。</p>
      </Section>
    </>
  )
}

function PathFields({ path, update }: { path: PathEntity; update: Update }) {
  const length = path.points.reduce((sum, point, index) => {
    if (index === 0) return sum
    const prev = path.points[index - 1]
    return sum + Math.hypot(point[0] - prev[0], point[1] - prev[1])
  }, 0)

  const updatePoint = (index: number, axis: 0 | 1, value: number) => {
    const points = path.points.map((point) => [...point] as [number, number])
    points[index][axis] = value
    update({ points })
  }

  const addPoint = () => {
    if (path.points.length < 2) return
    const last = path.points[path.points.length - 1]
    const prev = path.points[path.points.length - 2]
    const dx = last[0] - prev[0]
    const dz = last[1] - prev[1]
    const len = Math.hypot(dx, dz) || 1
    const next: [number, number] = [last[0] + (dx / len) * 3, last[1] + (dz / len) * 3]
    update({ points: [...path.points, next] })
  }

  const removePoint = (index: number) => {
    if (path.points.length <= (path.closed ? 3 : 2)) return
    update({ points: path.points.filter((_, pointIndex) => pointIndex !== index) })
  }

  return (
    <>
      <Section title="路径参数">
        <div className="readout-row">
          <span>类型</span>
          <strong>{pathTypeLabel(path.pathType)}</strong>
        </div>
        {path.pathType !== 'fence' && !(path.pathType === 'river' && path.closed) && (
          <NumberField label="宽度" value={path.width} min={0.5} max={40} step={0.1} suffix="m" onChange={(width) => update({ width })} />
        )}
        {path.pathType === 'river' && path.closed && (
          <p className="micro-hint">闭合河流已生成池塘，水面由闭合曲线围合，岸带自动生成。</p>
        )}
        {(path.pathType === 'road' || path.pathType === 'bridge') && (
          <Segmented
            compact
            value={String(path.lanes) === '4' ? '4' : '2'}
            onChange={(value) => update({ lanes: Number(value) })}
            options={[
              { value: '2', label: '2 车道' },
              { value: '4', label: '4 车道' },
            ]}
          />
        )}
        {(path.pathType === 'road' || path.pathType === 'bridge') && (
          <Toggle checked={path.sidewalk} onChange={(sidewalk) => update({ sidewalk })} label="人行道" />
        )}
        {path.pathType === 'bridge' && (
          <>
            <NumberField label="桥面高度" value={path.bridgeHeight} min={0.8} max={20} step={0.2} suffix="m" onChange={(bridgeHeight) => update({ bridgeHeight })} />
            <Toggle checked={path.railings} onChange={(railings) => update({ railings })} label="桥梁护栏" />
          </>
        )}
        {path.pathType === 'fence' && (
          <Segmented
            value={path.style}
            onChange={(style) => update({ style })}
            options={[
              { value: 'wood', label: '木' },
              { value: 'metal', label: '金属' },
              { value: 'hedge', label: '绿篱' },
              { value: 'stone', label: '石墙' },
            ]}
          />
        )}
        {path.pathType === 'footpath' && (
          <Segmented
            value={path.style}
            onChange={(style) => update({ style })}
            options={[
              { value: 'stone', label: '石材' },
              { value: 'gravel', label: '碎石' },
            ]}
          />
        )}
        <div className="readout-row">
          <span>控制点总长</span>
          <strong>{length.toFixed(2)} m</strong>
        </div>
        {path.points.length >= 3 && (
          <Toggle
            checked={Boolean(path.closed)}
            onChange={(closed) => update({ closed })}
            label="闭合路径"
            hint="形成环路 / 池塘"
          />
        )}
      </Section>
      <Section
        title="曲线控制点"
        aside={
          <button type="button" className="text-button" onClick={addPoint}>
            追加点
          </button>
        }
      >
        <div className="point-list">
          {path.points.map((point, index) => (
            <div className="point-row" key={index}>
              <span className="point-index">{index + 1}</span>
              <NumberField
                value={point[0]}
                step={0.25}
                compact
                onChange={(value) => updatePoint(index, 0, value)}
              />
              <NumberField
                value={point[1]}
                step={0.25}
                compact
                onChange={(value) => updatePoint(index, 1, value)}
              />
              <button
                type="button"
                className="point-delete"
                disabled={path.points.length <= (path.closed ? 3 : 2)}
                onClick={() => removePoint(index)}
                title="删除控制点"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <p className="micro-hint">
          选中路径后可直接拖动场景中的控制点；{path.closed ? '闭合' : '开放'}曲线共 {path.points.length} 个点。
        </p>
      </Section>
    </>
  )
}

function SlabFields({ slab, update }: { slab: SlabEntity; update: Update }) {
  return (
    <>
      <Section title="楼板尺寸">
        <div className="field-grid two">
          <NumberField label="宽度 X" value={slab.w} min={0.3} max={200} step={0.1} suffix="m" onChange={(w) => update({ w })} />
          <NumberField label="进深 Z" value={slab.d} min={0.3} max={200} step={0.1} suffix="m" onChange={(d) => update({ d })} />
          <NumberField label="板厚" value={slab.thickness} min={0.04} max={1} step={0.02} suffix="m" onChange={(thickness) => update({ thickness })} />
          <NumberField
            label="旋转"
            value={(slab.rot * 180) / Math.PI}
            step={5}
            suffix="°"
            precision={1}
            onChange={(degrees) => update({ rot: (degrees * Math.PI) / 180 })}
          />
        </div>
      </Section>
      <Section title="面层材质">
        <div className="slab-style-grid compact">
          {SLAB_STYLES.map((style: { id: SlabStyle; name: string; top: string; color: string }) => (
            <button
              key={style.id}
              type="button"
              className={`slab-style ${slab.style === style.id ? 'is-active' : ''}`}
              onClick={() => update({ style: style.id })}
            >
              <span className="slab-preview" style={{ background: `linear-gradient(135deg, ${style.top}, ${style.color})` }} />
              <span>{style.name}</span>
            </button>
          ))}
        </div>
        <p className="micro-hint">当前：{slabStyleLabel(slab.style)}</p>
      </Section>
    </>
  )
}

function RoofFields({ roof, update }: { roof: RoofEntity; update: Update }) {
  return (
    <>
      <Section title="屋顶形式">
        <Segmented
          value={roof.style}
          onChange={(style) => update({ style })}
          options={[
            { value: 'gable', label: '双坡' },
            { value: 'hip', label: '四坡' },
            { value: 'flat', label: '平顶' },
            { value: 'shed', label: '单坡' },
          ]}
        />
        <p className="micro-hint">当前：{ROOF_STYLE_LABELS[roof.style]}</p>
      </Section>
      <Section title="尺寸与坡度">
        <div className="field-grid two">
          <NumberField label="宽度 X" value={roof.w} min={1} max={120} step={0.2} suffix="m" onChange={(w) => update({ w })} />
          <NumberField label="进深 Z" value={roof.d} min={1} max={120} step={0.2} suffix="m" onChange={(d) => update({ d })} />
          <NumberField
            label="旋转"
            value={(roof.rot * 180) / Math.PI}
            step={5}
            suffix="°"
            precision={1}
            onChange={(degrees) => update({ rot: (degrees * Math.PI) / 180 })}
          />
          <NumberField label="檐口标高" value={roof.eaveY} step={0.1} suffix="m" onChange={(eaveY) => update({ eaveY })} />
          <NumberField label="坡度" value={roof.pitch} min={0} max={70} step={1} suffix="°" precision={0} onChange={(pitch) => update({ pitch })} />
          <NumberField label="挑檐" value={roof.overhang} min={0} max={2} step={0.05} suffix="m" onChange={(overhang) => update({ overhang })} />
        </div>
        <p className="micro-hint">调整坡度时，屋脊高度会实时变化。</p>
      </Section>
      <Section title="屋面材质">
        <div className="finish-grid">
          {FINISHES.map((finish) => (
            <button
              key={finish.id}
              type="button"
              className={`finish-chip ${roof.finish === finish.id ? 'is-active' : ''}`}
              onClick={() => update({ finish: finish.id })}
            >
              <span style={{ background: finish.color }} />
              {ROOF_FINISH_LABELS[finish.id]}
            </button>
          ))}
        </div>
      </Section>
    </>
  )
}

function ObjectFields({ entity, update }: { entity: Extract<Entity, { kind: 'object' }>; update: Update }) {
  const model = getModel(entity.modelId)
  const asset = useEditor((state) => state.doc.customAssets.find((item) => item.id === entity.modelId))
  const rule = model?.placement ?? 'any'
  const ruleLabel =
    rule === 'indoor'
      ? '室内构件'
      : rule === 'outdoor'
        ? '户外构件'
        : rule === 'on-road'
          ? '需放置在道路上'
          : rule === 'on-water'
            ? '需放置在水面上'
            : '任意位置'
  return (
    <>
      <Section title="变换">
        <div className="field-grid two">
          <NumberField label="位置 X" value={entity.x} step={0.1} suffix="m" onChange={(x) => update({ x })} />
          <NumberField label="位置 Z" value={entity.z} step={0.1} suffix="m" onChange={(z) => update({ z })} />
          <NumberField
            label="旋转"
            value={(entity.rot * 180) / Math.PI}
            step={5}
            suffix="°"
            precision={1}
            onChange={(degrees) => update({ rot: (degrees * Math.PI) / 180 })}
          />
          <NumberField label="缩放" value={entity.scale} min={0.1} max={10} step={0.05} precision={2} onChange={(scale) => update({ scale })} />
        </div>
      </Section>
      <Section title="组件信息">
        <div className="readout-row">
          <span>模型</span>
          <strong>{model?.name ?? asset?.name ?? entity.modelId}</strong>
        </div>
        <div className="readout-row">
          <span>占地尺寸</span>
          <strong>
            {model ? `${model.footprint[0].toFixed(2)} × ${model.footprint[1].toFixed(2)} m` : asset ? `${asset.footprint[0].toFixed(2)} × ${asset.footprint[1].toFixed(2)} m` : '—'}
          </strong>
        </div>
        <div className="readout-row">
          <span>高度</span>
          <strong>{model ? `${model.height.toFixed(2)} m` : asset ? `${asset.height.toFixed(2)} m` : '—'}</strong>
        </div>
        <div className="readout-row">
          <span>放置约束</span>
          <strong>{ruleLabel}</strong>
        </div>
        <p className="micro-hint">
          使用红/青色半透明预览确认是否可放置；实体与墙体、家具发生重叠时会显示红色禁止预览。
        </p>
      </Section>
    </>
  )
}

function InspectorEmpty() {
  const perf = useRuntime((state) => state.perf)
  const doc = useEditor((state) => state.doc)
  const counts = Object.values(doc.entities).reduce(
    (result, entity) => {
      if (entity.kind === 'wall') result.walls++
      else if (entity.kind === 'opening') result.openings++
      else if (entity.kind === 'path') result.paths++
      else if (entity.kind === 'slab' || entity.kind === 'roof') result.surfaces++
      else if (entity.kind === 'building') result.buildings++
      else result.objects++
      return result
    },
    { walls: 0, openings: 0, paths: 0, surfaces: 0, objects: 0, buildings: 0 },
  )

  return (
    <aside className="inspector" data-ui-scope="inspector">
      <div className="inspector-empty">
        <span className="empty-illustration">
          <MousePointer2 size={22} />
        </span>
        <span className="eyebrow">INSPECTOR</span>
        <h2>未选择构件</h2>
        <p>在场景中点击任意墙体、门窗、家具或路径，即可在此编辑尺寸、材质与位置。</p>
        <div className="insight-list">
          <div>
            <span>双击构件</span>
            <strong>相机聚焦</strong>
          </div>
          <div>
            <span>R / 1 / 2</span>
            <strong>旋转 · 切换变换模式</strong>
          </div>
          <div>
            <span>红色预览</span>
            <strong>不可放置</strong>
          </div>
        </div>
        <div className="empty-stat">
          <Gauge size={16} />
          <span>
            {perf.fps} FPS · {perf.drawCalls} draw calls · {(perf.triangles / 1000).toFixed(0)}k tris
          </span>
        </div>
      </div>
      <div className="inspector-scroll">
        <Section title="场景构成">
          <div className="metric-grid">
            <div className="metric-cell"><span>家具物件</span><strong>{counts.objects}</strong></div>
            <div className="metric-cell"><span>墙体</span><strong>{counts.walls}</strong></div>
            <div className="metric-cell"><span>门窗</span><strong>{counts.openings}</strong></div>
            <div className="metric-cell"><span>路径</span><strong>{counts.paths}</strong></div>
            <div className="metric-cell"><span>屋顶 / 楼板</span><strong>{counts.surfaces}</strong></div>
            <div className="metric-cell"><span>整栋建筑</span><strong>{counts.buildings}</strong></div>
            <div className="metric-cell"><span>楼层</span><strong>{doc.levels.length}</strong></div>
          </div>
        </Section>
        <Section title="实时渲染">
          <div className="perf-bars">
            <div>
              <span>帧率</span>
              <strong className={perf.fps >= 50 ? 'good' : perf.fps >= 30 ? 'warn' : 'bad'}>{perf.fps} FPS</strong>
            </div>
            <div>
              <span>Draw calls</span>
              <strong>{perf.drawCalls}</strong>
            </div>
            <div>
              <span>三角面</span>
              <strong>{perf.triangles.toLocaleString()}</strong>
            </div>
          </div>
        </Section>
        <div className="info-card">
          <Box size={18} />
          <div>
            <strong>性能建议</strong>
            <p>大型城市可关闭实时阴影，或使用楼层隔离来减少可见物体。重复家具共享几何体与材质。</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function Inspector() {
  const selectedId = useEditor((state) => state.selectedId)
  const entity = useEditor((state) => (state.selectedId ? state.doc.entities[state.selectedId] ?? null : null))
  const entityLevelName = useEditor((state) => {
    if (!state.selectedId) return '—'
    const selected = state.doc.entities[state.selectedId]
    if (!selected) return '—'
    let levelId: string | undefined
    if (selected.kind === 'opening') {
      const wall = state.doc.entities[selected.wallId]
      levelId = wall?.kind === 'wall' ? wall.levelId : undefined
    } else {
      levelId = selected.levelId
    }
    return state.doc.levels.find((level) => level.id === levelId)?.name ?? '—'
  })
  const updateEntity = useEditor((state) => state.updateEntity)
  const removeEntity = useEditor((state) => state.removeEntity)
  const duplicateSelected = useEditor((state) => state.duplicateSelected)
  const select = useEditor((state) => state.select)
  const beginHistory = useEditor((state) => state.beginHistory)

  if (!entity || !selectedId) return <InspectorEmpty />

  const update: Update = (patch, history = true) => updateEntity(entity.id, patch, history)
  const begin = () => beginHistory(`${entityDisplayName(entity)}属性`)
  const Icon = entityIcon(entity)
  const typeLine =
    entity.kind === 'path'
      ? pathTypeLabel(entity.pathType)
      : entity.kind === 'slab'
        ? slabStyleLabel(entity.style)
        : entity.kind === 'object'
          ? '场景物件'
          : entity.kind === 'building'
            ? '整栋建筑'
            : entityDisplayName(entity)

  return (
    <aside className="inspector" data-ui-scope="inspector">
      <div className="inspector-head">
        <span className="inspector-icon">
          <Icon size={18} />
        </span>
        <div className="inspector-title">
          <span className="eyebrow">{kindEyebrow(entity)}</span>
          <h2>{entityDisplayName(entity)}</h2>
          <span className="entity-id mono">{entity.id}</span>
        </div>
        <div className="inspector-head-actions">
          <button type="button" title="聚焦" onClick={() => getEditorScene()?.focusSelection()}>
            <Focus size={15} />
          </button>
          <button type="button" title="取消选择" onClick={() => select(null)}>
            <X size={15} />
          </button>
        </div>
      </div>
      <div className="inspector-scroll">
        <div className="entity-strip">
          <span>{typeLine}</span>
          <span className="entity-strip-dot" />
          <span>{entityLevelName}</span>
        </div>

        <LevelSelect entity={entity} update={update} />

        {entity.kind === 'wall' && <WallFields wall={entity} update={update} />}
        {entity.kind === 'opening' && <OpeningFields opening={entity} update={update} begin={begin} />}
        {entity.kind === 'path' && <PathFields path={entity} update={update} />}
        {entity.kind === 'slab' && <SlabFields slab={entity} update={update} />}
        {entity.kind === 'roof' && <RoofFields roof={entity} update={update} />}
        {entity.kind === 'object' && <ObjectFields entity={entity} update={update} />}
        {entity.kind === 'building' && <BuildingFields building={entity} />}

        <div className="inspector-footer">
          <button type="button" className="soft-button" onClick={() => duplicateSelected()} disabled={entity.kind === 'opening'}>
            <Copy size={14} /> 复制
          </button>
          <button type="button" className="soft-button danger" onClick={() => removeEntity(entity.id, true)}>
            <Trash2 size={14} /> 删除
          </button>
        </div>
        <p className="inspector-tip">所有属性修改都会写入撤销历史；拖动滑块会合并为一次操作。</p>
      </div>
    </aside>
  )
}
