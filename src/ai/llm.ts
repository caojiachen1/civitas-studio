import { isTauriHost } from '../editor/platform'
import { catalogPromptText } from './context'
import { parsePlanContent } from './planParse'
import type { AiActionPlan, AiChatMessage, AiSceneContext, AiSettings } from './types'

export interface LlmContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | LlmContentPart[]
}

export interface LlmVisionImage {
  dataUrl: string
  label: string
}

function endpointFromBase(baseUrl: string): string {
  const url = baseUrl.trim().replace(/\/+$/, '')
  if (/\/chat\/completions$/i.test(url)) return url
  if (/\/v1$/i.test(url)) return `${url}/chat/completions`
  return `${url}/v1/chat/completions`
}

function systemPrompt(context: AiSceneContext): string {
  return `You are Civitas Copilot, a careful AI operator for a 3D city and building editor.
You do NOT write code. You return a strict JSON plan using only the actions below. The app validates and executes them.
Respond to the user in Chinese.
When screenshots of the live scene are attached, STUDY them first: they show the current build from the labelled cameras. Use what you see to judge layout, scale, style, empty space and whether the user's request already succeeded. Mention concrete visual observations in "reply" when helpful.

Return EXACTLY one JSON object with this shape:
{"reply":"short explanation in Chinese","actions":[ ... ]}

Allowed actions (all fields except type are optional unless marked):
1. {"type":"build_villa","centerX":number,"centerZ":number,"width":10..30,"depth":6..18,"withPool":boolean,"withGarden":boolean,"withCarport":boolean}
   Complete single-storey villa: walls, doors, windows, floor, roof, living/kitchen/dining/bedroom furniture, deck. Prefer this for whole houses. Omit centerX/centerZ to let the app find free land near the camera.
2. {"type":"build_room","roomType":"living|bedroom|kitchen|dining|bathroom|office|generic","width":2.4..22,"depth":2.4..22,"roof":boolean,"furnish":boolean,"centerX":number,"centerZ":number}
   Build one enclosed room with door/window/floor and matching furniture. Omit coordinates when possible.
3. {"type":"furnish_room","roomType":"living|bedroom|kitchen|dining|bathroom|office|generic","centerX":number,"centerZ":number}
   Furnish an EXISTING enclosed room. Omit coordinates to use the selected room or nearest room.
4. {"type":"place_model","modelId":"one valid catalog id","x":number,"z":number,"rot":number,"scale":number}
   Place one item. Prefer omitting x/z; the app finds a legal spot (indoor objects go inside the nearest room).
4b. {"type":"add_wall","id":"optional-stable-id","a":[x,z],"b":[x,z],"height":number,"thickness":number,"color":"#rrggbb"}
   Draw one wall segment. Use for custom layouts, extensions or partitions that the room builder cannot express. Give it an id when a later add_opening in the same plan must reference it.
4c. {"type":"add_opening","wallId":"wall id","openingType":"door|window","style":"single|double|sliding|glass|garage|standard|wide|picture|slim|small","offset":number,"width":number,"height":number,"sill":number,"openAngle":number,"hinge":"left|right"}
   Cut a door/window into an existing wall. Get wall ids from the scene context or from earlier add_wall results. Offset is metres from wall point A.
4d. {"type":"add_slab","x":number,"z":number,"width":number,"depth":number,"rot":number,"thickness":number,"style":"wood|oak|concrete|tile|stone|deck","holes":[{"x":number,"z":number,"w":number,"d":number}]}
   Add a rectangular floor slab or outdoor deck. Optional world-space holes cut real stair/atrium openings through the slab.
5. {"type":"draw_path","pathType":"road|river|bridge|footpath|fence","points":[[x,z],...],"width":number,"closed":boolean,"sidewalk":boolean,"lanes":2|4,"bridgeHeight":number,"length":number,"curve":number,"centerX":number,"centerZ":number}
   Freeform curved path. Omit points to let the app generate one; bridge automatically crosses the nearest river when points are omitted.
6. {"type":"add_pond","radius":number,"centerX":number,"centerZ":number}
7. {"type":"add_roof","style":"gable|hip|flat|shed","finish":"terracotta|slate|charcoal|copper|shingle","pitch":number}
   Only for a room that exists but has no roof.
8. {"type":"add_vegetation","count":1..20,"radius":number,"centerX":number,"centerZ":number}
9. {"type":"add_level"} or {"type":"set_active_level","index":0-based index}
10. {"type":"modify_selected","rotateByDeg":number,"color":"#rrggbb or Chinese color name","x":number,"z":number,"scale":number}
   When the selected entity is a door, also accepts {"openAngle":-135..135} (0 = closed) and {"hinge":"left"|"right"}.
11. {"type":"delete_selected"}
12. {"type":"clear_level"} only when the user explicitly asks to clear the floor.
13. {"type":"undo"}, {"type":"redo"}, {"type":"focus_all"}

Rules:
- Use only catalog IDs listed below for place_model. Never invent a model.
- Prefer high-level actions (build_villa/build_room/furnish_room/draw_path/add_pond/add_vegetation) over long lists.
- Do not combine undo/redo with other actions.
- Only use clear_level when explicitly requested; destructive changes are confirmed by the UI.
- The active floor is where new content is placed. If the user asks for an upper floor, use add_level first, then build in a later action.
- If the request is a question or unclear, return actions: [] and ask a concise clarification in Chinese.
- Keep plans to at most 12 actions.
- Coordinates are metres. Omit them unless the user explicitly named a location.
- Do not invent features outside the action list.

Scene context (JSON):
${JSON.stringify(context)}

Catalog (id=Chinese name):
${catalogPromptText()}`
}

function contentFromResponse(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const choices = (value as { choices?: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) return ''
  const first = choices[0] as { message?: { content?: unknown }; text?: unknown }
  const content = first.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        part && typeof part === 'object' && typeof (part as { text?: unknown }).text === 'string'
          ? (part as { text: string }).text
          : '',
      )
      .join('')
  }
  if (typeof first.text === 'string') return first.text
  return ''
}

async function requestCompletion(settings: AiSettings, messages: LlmMessage[]): Promise<string> {
  const endpoint = endpointFromBase(settings.baseUrl)
  if (!endpoint || !settings.model.trim()) throw new Error('请先在 AI 设置中填写接口地址和模型名称。')
  if (isTauriHost()) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<string>('ai_chat', {
      baseUrl: endpoint,
      apiKey: settings.apiKey,
      model: settings.model,
      messages,
      temperature: settings.temperature,
    })
  }
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 120000)
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (settings.apiKey.trim()) headers.Authorization = `Bearer ${settings.apiKey.trim()}`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: settings.model,
        messages,
        temperature: settings.temperature,
        max_tokens: 1800,
      }),
    })
    const text = await response.text()
    if (!response.ok) {
      const snippet = text.replace(/\s+/g, ' ').slice(0, 420)
      throw new Error(`接口返回 ${response.status}${snippet ? `：${snippet}` : ''}`)
    }
    let json: unknown
    try {
      json = JSON.parse(text)
    } catch {
      throw new Error('接口返回的不是有效 JSON。')
    }
    const content = contentFromResponse(json)
    if (!content) throw new Error('模型没有返回可读取的文本内容。')
    return content
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('模型请求超时（120 秒）。')
    }
    if (error instanceof TypeError) {
      throw new Error('无法连接模型接口。请检查地址、网络或 CORS 设置。')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function requestAiPlan(
  settings: AiSettings,
  userText: string,
  context: AiSceneContext,
  history: AiChatMessage[],
  images: LlmVisionImage[] = [],
): Promise<AiActionPlan> {
  const labels = images.map((image) => image.label).join(', ')
  const userContent: string | LlmContentPart[] =
    images.length > 0
      ? [
          {
            type: 'text',
            text: `${userText}\n\n（附现场截图，视角：${labels}。请先观察画面，再给出动作计划。）`,
          },
          ...images.map((image) => ({
            type: 'image_url' as const,
            image_url: { url: image.dataUrl },
          })),
        ]
      : userText
  const messages: LlmMessage[] = [
    { role: 'system', content: systemPrompt(context) },
    ...history
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 2000),
      })),
    { role: 'user', content: userContent },
  ]
  const content = await requestCompletion(settings, messages)
  return parsePlanContent(content, 'llm')
}

export async function testLlmConnection(settings: AiSettings): Promise<string> {
  const content = await requestCompletion(settings, [
    { role: 'system', content: 'Return only the JSON object {"ok":true}.' },
    { role: 'user', content: 'ping' },
  ])
  if (!content.trim()) throw new Error('连接成功但模型没有返回内容。')
  return content.slice(0, 120)
}
