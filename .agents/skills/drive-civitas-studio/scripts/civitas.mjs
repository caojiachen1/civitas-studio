#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const EXPLICIT_BASE = (process.env.CIVITAS_URL || '').replace(/\/+$/, '')
const TOKEN = (process.env.CIVITAS_TOKEN || '').trim()
const DEFAULT_BASE = EXPLICIT_BASE || 'http://127.0.0.1:8971'
const PORT_SCAN = 24

const rawArgs = process.argv.slice(2)
const command = rawArgs[0]

function usage() {
  console.log(`Civitas Studio operator CLI

Usage:
  node civitas.mjs status
  node civitas.mjs scene [--entities] [--limit 200] [--brief]
  node civitas.mjs find [--kind building|wall|opening|object|path|slab|roof] [--model ID] [--query TEXT]
  node civitas.mjs tools
  node civitas.mjs call <tool> [json|@file] [--brief]
  node civitas.mjs batch <file.json>
  node civitas.mjs views [--id ID] [--x 0 --z 0] [--ring 8] [--views overview,top,north]
                         [--elevation 30] [--distance 30] [--max 900] [--current]
                         [--out shots]
  node civitas.mjs shot [json|@file] [--out shots]
  node civitas.mjs undo | redo | focus-all

Environment:
  CIVITAS_URL     default http://127.0.0.1:8971 (auto-scans 8971-8994 when unset)
  CIVITAS_TOKEN   optional bearer token configured in the app MCP panel

Notes:
  - REST only; no MCP client required. Desktop app must be running.
  - Image base64 is never printed: use "views"/"shot" to save JPEGs.
`)
}

function parseFlags(argv) {
  const flags = {}
  const positional = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(arg)
    }
  }
  return { flags, positional }
}

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`
  return headers
}

let cachedBase = null

async function apiBase() {
  if (cachedBase) return cachedBase
  const candidates = EXPLICIT_BASE
    ? [EXPLICIT_BASE]
    : Array.from({ length: PORT_SCAN }, (_, index) => `http://127.0.0.1:${8971 + index}`)
  for (const base of candidates) {
    try {
      const response = await fetch(`${base}/api`, {
        headers: authHeaders(),
        signal: AbortSignal.timeout(900),
      })
      if (response.ok || response.status === 401) {
        cachedBase = base
        return base
      }
    } catch {
      // try the next port
    }
  }
  throw new Error(
    `Cannot reach the Civitas Studio MCP server on 127.0.0.1:8971-${8970 + PORT_SCAN}. ` +
      'Start the desktop app (npm run tauri:dev or Civitas Studio.exe) and enable the MCP service, then retry.',
  )
}

async function callTool(name, payload = {}) {
  if (!/^[a-z][a-z0-9_]*$/.test(name)) throw new Error(`Invalid tool name: ${name}`)
  const base = await apiBase()
  const response = await fetch(`${base}/api/tools/${name}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(130000),
  })
  const text = await response.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`Non-JSON response (${response.status}): ${text.slice(0, 300)}`)
  }
  if (response.status === 401) {
    throw new Error('Unauthorized. Set CIVITAS_TOKEN to the bearer token shown in the app MCP panel.')
  }
  if (!response.ok) {
    throw new Error(json.error || `HTTP ${response.status}`)
  }
  if (json.ok === false) {
    throw new Error(json.error || json.summary || 'Tool failed')
  }
  return json
}

function stripImageData(value) {
  if (Array.isArray(value)) return value.map(stripImageData)
  if (!value || typeof value !== 'object') return value
  const result = {}
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'data' && typeof entry === 'string' && entry.length > 800) {
      result.bytes = Math.floor((entry.length * 3) / 4)
      result.omitted = 'base64'
      continue
    }
    if (key === 'dataUrl' && typeof entry === 'string' && entry.startsWith('data:')) {
      result.omitted = 'dataUrl'
      continue
    }
    result[key] = stripImageData(entry)
  }
  return result
}

function printResult(json, brief = false) {
  const base = {
    ok: json.ok,
    summary: json.summary,
    scene: json.scene,
    error: json.error,
  }
  if (brief) {
    const keys = json.data && typeof json.data === 'object' ? Object.keys(json.data) : []
    console.log(JSON.stringify({ ...base, dataKeys: keys }, null, 2))
    return
  }
  const payload = stripImageData(json)
  let text = JSON.stringify(payload, null, 2)
  if (text.length > 24000) {
    text = `${text.slice(0, 24000)}\n… output truncated (${text.length} chars). Use --brief or narrower args.`
  }
  console.log(text)
}

function parseJsonArgument(value) {
  if (!value) return {}
  if (value.startsWith('@')) {
    const path = value.slice(1)
    return JSON.parse(readFileSync(resolve(path), 'utf8'))
  }
  return JSON.parse(value)
}

function numberFlag(flags, key) {
  if (flags[key] === undefined) return undefined
  const parsed = Number(flags[key])
  if (!Number.isFinite(parsed)) throw new Error(`--${key} must be a number`)
  return parsed
}

async function saveImages(payload, outDir) {
  const images = payload?.data?.images ?? payload?.images ?? []
  const directory = resolve(outDir || 'civitas-shots')
  if (!Array.isArray(images) || images.length === 0) {
    return { directory, saved: [], count: 0 }
  }
  mkdirSync(directory, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const saved = []
  images.forEach((image, index) => {
    if (!image?.data) return
    const ext = image.mime === 'image/png' ? 'png' : 'jpg'
    const label = String(image.label || `image-${index + 1}`).replace(/[^a-z0-9_-]+/gi, '-')
    const file = join(directory, `${stamp}-${String(index + 1).padStart(2, '0')}-${label}.${ext}`)
    writeFileSync(file, Buffer.from(image.data, 'base64'))
    saved.push({
      file,
      label: image.label,
      width: image.width,
      height: image.height,
      bytes: Math.floor((image.data.length * 3) / 4),
      eye: image.eye,
      target: image.target,
    })
  })
  return { directory, saved, count: saved.length }
}

function buildViewArgs(flags) {
  const payload = {}
  if (flags.id) payload.id = String(flags.id)
  for (const key of ['x', 'y', 'z', 'distance', 'elevation', 'ring']) {
    const value = numberFlag(flags, key)
    if (value !== undefined) payload[key] = value
  }
  const maxSize = numberFlag(flags, 'max') ?? numberFlag(flags, 'maxSize')
  if (maxSize !== undefined) payload.maxSize = maxSize
  if (flags.views) payload.views = String(flags.views)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  if (flags.current) payload.includeCurrent = true
  if (flags.clean === false || flags.clean === 'false') payload.clean = false
  if (flags.noClean) payload.clean = false
  if (!payload.views && flags.ring === undefined) {
    payload.views = ['overview', 'top', 'north', 'east']
  }
  return payload
}

async function main() {
  if (!command || command === 'help' || command === '--help') {
    usage()
    return
  }
  const { flags, positional } = parseFlags(rawArgs.slice(1))

  if (command === 'status') {
    const base = await apiBase()
    const response = await fetch(`${base}/api`, { headers: authHeaders() })
    const json = await response.json()
    console.log(JSON.stringify({ base, status: response.status, ...json }, null, 2))
    return
  }

  if (command === 'tools') {
    const base = await apiBase()
    const response = await fetch(`${base}/mcp`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
    })
    const json = await response.json()
    const tools = json.result?.tools ?? []
    console.log(`${tools.length} tools`)
    console.log(tools.map((tool) => tool.name).join('\n'))
    return
  }

  if (command === 'scene') {
    const payload = {}
    if (flags.entities) payload.includeEntities = true
    const limit = numberFlag(flags, 'limit')
    if (limit !== undefined) payload.entityLimit = limit
    const json = await callTool('get_scene', payload)
    printResult(json, Boolean(flags.brief))
    return
  }

  if (command === 'find') {
    const json = await callTool('get_scene', { includeEntities: true, entityLimit: 1000 })
    const entities = json.data?.entities ?? []
    const kind = typeof flags.kind === 'string' ? flags.kind : ''
    const model = typeof flags.model === 'string' ? flags.model : ''
    const query = typeof flags.query === 'string' ? flags.query.toLowerCase() : ''
    const filtered = entities.filter((entity) => {
      if (kind && entity.kind !== kind) return false
      if (model && entity.modelId !== model) return false
      if (query && !JSON.stringify(entity).toLowerCase().includes(query)) return false
      return true
    })
    const limit = Math.max(1, Math.min(1000, numberFlag(flags, 'limit') ?? 200))
    console.log(
      JSON.stringify(
        filtered.slice(0, limit).map((entity) => ({
          id: entity.id,
          kind: entity.kind,
          name: entity.name,
          modelId: entity.modelId,
          x: entity.x,
          z: entity.z,
          floors: entity.floors,
          pathType: entity.pathType,
          type: entity.type,
        })),
        null,
        2,
      ),
    )
    if (filtered.length > limit) {
      console.error(`(${filtered.length - limit} more matches omitted; raise --limit)`)
    }
    return
  }

  if (command === 'call') {
    const tool = positional[0]
    if (!tool) throw new Error('Usage: call <tool> [json|@file] [--brief]')
    const payload = parseJsonArgument(positional[1])
    const json = await callTool(tool, payload)
    printResult(json, Boolean(flags.brief))
    return
  }

  if (command === 'batch') {
    const file = positional[0]
    if (!file) throw new Error('Usage: batch <file.json>')
    const parsed = JSON.parse(readFileSync(resolve(file), 'utf8'))
    const payload = Array.isArray(parsed) ? { actions: parsed } : parsed
    if (!Array.isArray(payload.actions)) throw new Error('Batch file must be an array or {actions:[...],allowDestructive?}')
    const json = await callTool('apply_actions', payload)
    printResult(json, false)
    return
  }

  if (command === 'views') {
    const payload = buildViewArgs(flags)
    const json = await callTool('capture_views', payload)
    const saved = await saveImages(json, flags.out)
    console.log(
      JSON.stringify(
        {
          ok: json.ok,
          summary: json.summary,
          focus: json.data?.focus,
          images: saved.saved,
          directory: saved.directory,
          scene: json.scene,
        },
        null,
        2,
      ),
    )
    return
  }

  if (command === 'shot') {
    const payload = parseJsonArgument(positional[0])
    const captureKeys = ['views', 'ring', 'id', 'includeCurrent', 'x', 'y', 'z']
    const tool =
      flags.tool ||
      (captureKeys.some((key) => payload[key] !== undefined) ? 'capture_views' : 'get_screenshot')
    const json = await callTool(tool, payload)
    const saved = await saveImages(json, flags.out)
    console.log(
      JSON.stringify(
        {
          ok: json.ok,
          summary: json.summary,
          tool,
          focus: json.data?.focus,
          images: saved.saved,
          directory: saved.directory,
          scene: json.scene,
        },
        null,
        2,
      ),
    )
    return
  }

  if (command === 'undo' || command === 'redo') {
    const json = await callTool(command, {})
    printResult(json, true)
    return
  }

  if (command === 'focus-all') {
    const json = await callTool('focus_all', {})
    printResult(json, true)
    return
  }

  throw new Error(`Unknown command: ${command}. Run "node civitas.mjs help".`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`CIVITAS ERROR: ${message}`)
  process.exitCode = message.includes('Cannot reach') ? 2 : 1
})
