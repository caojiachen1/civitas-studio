import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { isTauriHost } from '../editor/platform'
import { mcpToolsPayload, runMcpTool } from './tools'

interface McpBridgeRequest {
  id: string
  method: 'tools/list' | 'tools/call'
  tool?: string | null
  args?: Record<string, unknown>
}

let unlisten: (() => void) | null = null

export async function startMcpBridge(): Promise<() => void> {
  if (!isTauriHost() || unlisten) return unlisten ?? (() => {})
  unlisten = await listen<McpBridgeRequest>('mcp:request', async (event) => {
    const request = event.payload
    try {
      if (request.method === 'tools/list') {
        await invoke('mcp_respond', {
          id: request.id,
          ok: true,
          result: mcpToolsPayload(),
        })
        return
      }
      if (request.method === 'tools/call') {
        if (!request.tool) throw new Error('MCP 请求缺少工具名称。')
        const result = await runMcpTool(request.tool, request.args ?? {})
        await invoke('mcp_respond', {
          id: request.id,
          ok: true,
          result,
        })
        return
      }
      throw new Error(`不支持的 MCP 请求：${String(request.method)}`)
    } catch (error) {
      await invoke('mcp_respond', {
        id: request.id,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      }).catch(() => {})
    }
  })
  return unlisten
}
