import {
  Armchair,
  BrickWall,
  Building2,
  Car,
  Columns3,
  DoorOpen,
  Eraser,
  Home,
  Layers,
  MousePointer2,
  Route,
  Trees,
  Umbrella,
  Waves,
} from 'lucide-react'
import type { PanelId } from './panels'

const ITEMS: {
  id: PanelId
  label: string
  icon: typeof MousePointer2
  group?: number
}[] = [
  { id: 'select', label: '选择', icon: MousePointer2 },
  { id: 'wall', label: '墙体', icon: BrickWall, group: 1 },
  { id: 'openings', label: '门窗', icon: DoorOpen },
  { id: 'slab', label: '楼板', icon: Layers },
  { id: 'roof', label: '屋顶', icon: Home },
  { id: 'roads', label: '道路', icon: Route, group: 2 },
  { id: 'water', label: '水系', icon: Waves },
  { id: 'furniture', label: '家具', icon: Armchair, group: 3 },
  { id: 'outdoor', label: '户外', icon: Umbrella },
  { id: 'city', label: '城市', icon: Building2 },
  { id: 'vegetation', label: '植被', icon: Trees },
  { id: 'vehicles', label: '车辆', icon: Car },
  { id: 'structure', label: '构件', icon: Columns3 },
  { id: 'erase', label: '擦除', icon: Eraser, group: 4 },
]

export function ToolRail({
  activePanel,
  onActivate,
}: {
  activePanel: PanelId
  onActivate: (id: PanelId) => void
}) {
  return (
    <aside className="tool-rail">
      <div className="rail-scroll">
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id}>
              {item.group && <div className="rail-separator" />}
              <button
                type="button"
                className={`rail-item ${activePanel === item.id ? 'is-active' : ''}`}
                title={item.label}
                onClick={() => onActivate(item.id)}
              >
                <span className="rail-icon">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="rail-label">{item.label}</span>
              </button>
            </div>
          )
        })}
      </div>
      <div className="rail-footer">v0.3</div>
    </aside>
  )
}
