import { useMemo, useState } from 'react'
import { PackageOpen, Search, Upload } from 'lucide-react'
import { CATALOG_MODELS } from '../models/registry'
import { MODEL_CATEGORY_LABELS, useEditor } from '../editor/store'
import { importModelFromFile } from '../editor/fileIO'
import type { ModelCategory } from '../editor/types'
import { ModelThumb, CustomThumb } from './ModelThumb'
import { EmptyState } from './common'

type Filter = ModelCategory | 'all' | 'custom'

export function CatalogPanel({
  title,
  subtitle,
  categories,
}: {
  title: string
  subtitle: string
  categories: ModelCategory[]
}) {
  const activeModelId = useEditor((state) => state.activeModelId)
  const setActiveModel = useEditor((state) => state.setActiveModel)
  const customAssets = useEditor((state) => state.doc.customAssets)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CATALOG_MODELS.filter((model) => {
      if (!categories.includes(model.category)) return false
      if (!q) return true
      return (
        model.name.toLowerCase().includes(q) ||
        model.id.toLowerCase().includes(q) ||
        (model.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      )
    })
  }, [categories, query])

  const groupOrder = useMemo(() => {
    const present = new Set(filtered.map((model) => model.category))
    return categories.filter((category) => present.has(category))
  }, [categories, filtered])

  const choose = (id: string) => {
    setActiveModel(id)
  }

  const handleImport = async () => {
    if (busy) return
    setBusy(true)
    await importModelFromFile()
    setBusy(false)
  }

  return (
    <div className="panel-scroll">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">COMPONENT LIBRARY</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="panel-action" disabled={busy} onClick={handleImport} title="导入 GLB / glTF / OBJ / STL">
          <Upload size={14} />
          导入
        </button>
      </div>

      <div className="search-field">
        <Search size={14} />
        <input
          placeholder="搜索名称、标签或用途…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">
            ×
          </button>
        )}
      </div>

      <div className="category-chips">
        <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>
          全部
          <span>{filtered.length}</span>
        </button>
        {categories.map((category) => {
          const count = CATALOG_MODELS.filter(
            (model) =>
              model.category === category &&
              (!query.trim() ||
                model.name.toLowerCase().includes(query.trim().toLowerCase()) ||
                (model.tags ?? []).some((tag) => tag.toLowerCase().includes(query.trim().toLowerCase()))),
          ).length
          if (count === 0 && filter !== category) return null
          return (
            <button
              key={category}
              type="button"
              className={filter === category ? 'is-active' : ''}
              onClick={() => setFilter(category)}
            >
              {MODEL_CATEGORY_LABELS[category]}
              <span>{count}</span>
            </button>
          )
        })}
        {customAssets.length > 0 && (
          <button
            type="button"
            className={filter === 'custom' ? 'is-active' : ''}
            onClick={() => setFilter('custom')}
          >
            导入模型
            <span>{customAssets.length}</span>
          </button>
        )}
      </div>

      {filter === 'custom' ? (
        customAssets.length === 0 ? (
          <EmptyState icon={PackageOpen} title="还没有导入模型" hint="点击上方「导入」选择 GLB、glTF、OBJ 或 STL 文件。" />
        ) : (
          <div className="catalog-grid">
            {customAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className={`catalog-card ${activeModelId === asset.id ? 'is-active' : ''}`}
                onClick={() => choose(asset.id)}
              >
                <CustomThumb />
                <span className="catalog-card-copy">
                  <span className="catalog-name">{asset.name}</span>
                  <span className="catalog-meta">
                    {asset.footprint[0].toFixed(2)} × {asset.footprint[1].toFixed(2)} m · h {asset.height.toFixed(2)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="没有匹配的组件" hint="尝试清空搜索条件或切换分类。" />
      ) : filter === 'all' ? (
        groupOrder.map((category) => {
          const models = filtered.filter((model) => model.category === category)
          return (
            <div className="catalog-group" key={category}>
              <div className="catalog-group-head">
                <span>{MODEL_CATEGORY_LABELS[category]}</span>
                <em>{models.length}</em>
              </div>
              <div className="catalog-grid">
                {models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={`catalog-card ${activeModelId === model.id ? 'is-active' : ''}`}
                    onClick={() => choose(model.id)}
                    title={`${model.name} · ${model.footprint[0]} × ${model.footprint[1]} m`}
                  >
                    <ModelThumb model={model} />
                    <span className="catalog-card-copy">
                      <span className="catalog-name">{model.name}</span>
                      <span className="catalog-meta">
                        {model.footprint[0].toFixed(2)} × {model.footprint[1].toFixed(2)} m
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <div className="catalog-grid">
          {filtered
            .filter((model) => model.category === filter)
            .map((model) => (
              <button
                key={model.id}
                type="button"
                className={`catalog-card ${activeModelId === model.id ? 'is-active' : ''}`}
                onClick={() => choose(model.id)}
              >
                <ModelThumb model={model} />
                <span className="catalog-card-copy">
                  <span className="catalog-name">{model.name}</span>
                  <span className="catalog-meta">
                    {model.footprint[0].toFixed(2)} × {model.footprint[1].toFixed(2)} m
                  </span>
                </span>
              </button>
            ))}
        </div>
      )}

      <div className="panel-footnote">
        <span className="legend-dot valid" />
        点击组件后在地面预览放置
        <span className="footnote-sep">·</span>
        R 旋转
        <span className="footnote-sep">·</span>
        Shift 暂停吸附
      </div>
    </div>
  )
}
