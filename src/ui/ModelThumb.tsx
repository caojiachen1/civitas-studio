import { useEffect, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import type { ModelDef } from '../editor/types'
import { peekModelThumbnail, requestModelThumbnail } from './thumbnails'

export function ModelThumb({ model }: { model: ModelDef }) {
  const [url, setUrl] = useState<string | null>(() => peekModelThumbnail(model.id))

  useEffect(() => {
    if (url) return
    requestModelThumbnail(model, (value) => setUrl(value))
  }, [model, url])

  return (
    <div className="model-thumb">
      {url ? <img src={url} alt="" draggable={false} /> : <span className="thumb-skeleton" />}
    </div>
  )
}

export function CustomThumb() {
  return (
    <div className="model-thumb is-custom">
      <PackageOpen size={28} strokeWidth={1.2} />
      <span className="custom-badge">IMPORTED</span>
    </div>
  )
}
