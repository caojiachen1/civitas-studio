export interface FileFilter {
  name: string
  extensions: string[]
}

export function isTauriHost(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function downloadBlob(name: string, data: Uint8Array | string, mime: string) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const blob = new Blob([bytes as BlobPart], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export async function saveFileWithDialog(
  suggestedName: string,
  data: Uint8Array | string,
  filters: FileFilter[],
  mime = 'application/octet-stream',
): Promise<string | null> {
  if (!isTauriHost()) {
    downloadBlob(suggestedName, data, mime)
    return suggestedName
  }
  const { save } = await import('@tauri-apps/plugin-dialog')
  const path = await save({ defaultPath: suggestedName, filters })
  if (!path) return null
  const { invoke } = await import('@tauri-apps/api/core')
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  await invoke('save_file', { path, base64Data: bytesToBase64(bytes) })
  return path
}

function pickBrowserFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.style.display = 'none'
    document.body.appendChild(input)
    let settled = false
    input.addEventListener('change', () => {
      settled = true
      resolve(input.files?.[0] ?? null)
      input.remove()
    })
    window.addEventListener(
      'focus',
      () => {
        window.setTimeout(() => {
          if (!settled) {
            resolve(null)
            input.remove()
          }
        }, 600)
      },
      { once: true },
    )
    input.click()
  })
}

export async function openFileWithDialog(
  filters: FileFilter[],
  browserAccept: string,
): Promise<{ name: string; bytes: ArrayBuffer } | null> {
  if (!isTauriHost()) {
    const file = await pickBrowserFile(browserAccept)
    if (!file) return null
    return { name: file.name, bytes: await file.arrayBuffer() }
  }
  const { open } = await import('@tauri-apps/plugin-dialog')
  const selected = await open({ multiple: false, filters })
  if (!selected || Array.isArray(selected)) return null
  const { invoke } = await import('@tauri-apps/api/core')
  const base64Data = await invoke<string>('read_file_base64', { path: selected })
  const bytes = base64ToBytes(base64Data)
  return {
    name: selected.split(/[\\/]/).pop() ?? 'project.civitas',
    bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer,
  }
}

export function bytesToDataUrl(bytes: Uint8Array, mime: string): string {
  return `data:${mime};base64,${bytesToBase64(bytes)}`
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  return base64ToBytes(dataUrl.slice(dataUrl.indexOf(',') + 1))
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'civitas-project'
}
