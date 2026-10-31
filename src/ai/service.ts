import { useEditor } from '../editor/store'
import { useRuntime } from '../editor/runtime'
import { getEditorScene } from '../editor/engineRef'
import { captureVisionImages } from '../editor/capture'
import { buildSceneContext } from './context'
import { planLocal } from './localPlanner'
import { requestAiPlan } from './llm'
import {
  executePlan,
  planHasDestructive,
  planShouldFocus,
} from './executor'
import { useAi } from './store'
import type { AiActionPlan, AiChatMessage, AiVisionShot } from './types'

function newId() {
  return `ai_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

function currentContext() {
  const state = useEditor.getState()
  const target = getEditorScene()?.getView().target ?? [0, 0, 0]
  return buildSceneContext(state.doc, state.doc.activeLevelId, [target[0], target[2]], state.selectedId)
}

function planName(plan: AiActionPlan) {
  return plan.reply.slice(0, 60)
}

export async function sendAiMessage(text: string): Promise<void> {
  const trimmed = text.trim()
  if (!trimmed) return
  const store = useAi.getState()
  if (store.busy) return
  const settings = store.settings
  const priorMessages = store.messages
  const userMessage: AiChatMessage = {
    id: newId(),
    role: 'user',
    content: trimmed,
    createdAt: Date.now(),
  }
  const assistantId = newId()
  const assistantMessage: AiChatMessage = {
    id: assistantId,
    role: 'assistant',
    content: '正在理解你的指令…',
    createdAt: Date.now(),
    status: 'thinking',
  }
  const ai = useAi.getState()
  ai.addMessage(userMessage)
  ai.addMessage(assistantMessage)
  ai.setBusy(true)

  try {
    const context = currentContext()
    let plan: AiActionPlan
    if (settings.mode === 'llm') {
      let vision: AiVisionShot[] = []
      if (settings.vision !== 'off') {
        try {
          vision = await captureVisionImages(settings.vision)
          if (vision.length > 0) useAi.getState().patchMessage(assistantId, { images: vision })
        } catch (error) {
          useRuntime
            .getState()
            .toast(
              `场景截图失败，本次仅发送文字上下文：${error instanceof Error ? error.message : String(error)}`,
              'warn',
            )
        }
      }
      const fallbackToLocal = (error: unknown) => {
        const fallback = planLocal(trimmed, context)
        if (fallback.actions.length === 0) throw error
        fallback.warnings = [
          ...(fallback.warnings ?? []),
          `云端模型不可用，已使用内置规划器：${error instanceof Error ? error.message.slice(0, 300) : String(error)}`,
        ]
        useRuntime
          .getState()
          .toast('云端模型调用失败，已使用内置规划器生成动作', 'warn')
        return fallback
      }
      try {
        plan = await requestAiPlan(
          settings,
          trimmed,
          context,
          priorMessages,
          vision.map((shot) => ({ dataUrl: shot.dataUrl, label: shot.label })),
        )
        if (plan.actions.length === 0 && !plan.reply.trim()) {
          plan.reply = '模型没有生成可执行动作。'
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const transportFailure = /超时|无法连接|network|fetch|CORS/i.test(message)
        if (vision.length > 0 && !transportFailure) {
          try {
            plan = await requestAiPlan(settings, trimmed, context, priorMessages)
            plan.warnings = [
              ...(plan.warnings ?? []),
              '模型未接受图像输入，已自动改用文字上下文。',
            ]
          } catch (retryError) {
            plan = fallbackToLocal(retryError)
          }
        } else {
          plan = fallbackToLocal(error)
        }
      }
    } else {
      plan = planLocal(trimmed, context)
    }

    useAi.getState().patchMessage(assistantId, {
      content: plan.reply,
      plan,
      status: plan.actions.length === 0 ? 'info' : 'ready',
    })

    if (plan.actions.length === 0) {
      useAi.getState().setBusy(false)
      return
    }
    if (!useAi.getState().settings.autoExecute) {
      useAi.getState().setBusy(false)
      return
    }
    await executeAiPlan(assistantId, plan)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    useAi.getState().patchMessage(assistantId, {
      status: 'failed',
      content: `执行失败：${message}`,
    })
    useRuntime.getState().toast(`AI 操作失败：${message}`, 'error')
    useAi.getState().setBusy(false)
  }
}

export function executeAiMessage(messageId: string): Promise<void> {
  const message = useAi.getState().messages.find((item) => item.id === messageId)
  if (!message?.plan || useAi.getState().busy) return Promise.resolve()
  if (message.status === 'executed') return Promise.resolve()
  return executeAiPlan(messageId, message.plan)
}

async function executeAiPlan(messageId: string, plan: AiActionPlan): Promise<void> {
  if (plan.actions.length === 0) return
  if (planHasDestructive(plan)) {
    const confirmed = window.confirm(
      '这个 AI 计划包含清空当前楼层的操作，执行后将删除该楼层全部构件。\n\n确定继续吗？',
    )
    if (!confirmed) {
      useAi.getState().patchMessage(messageId, {
        status: 'cancelled',
        content: `${plan.reply}\n\n已取消执行。`,
      })
      useAi.getState().setBusy(false)
      return
    }
  }
  useAi.getState().setBusy(true)
  useAi.getState().patchMessage(messageId, { status: 'executing' })
  try {
    const result = executePlan(plan, { allowDestructive: true })
    let snapshot: AiVisionShot | undefined
    if (result.ok) {
      const selectBuild = plan.actions.some(
        (action) => action.type === 'build_room' || action.type === 'build_villa',
      )
      if (selectBuild) {
        const state = useEditor.getState()
        const wallId = result.focusIds.find((id) => state.doc.entities[id]?.kind === 'wall')
        if (wallId) state.select(wallId)
      }
      useRuntime
        .getState()
        .toast(
          result.created > 0 ? `AI 完成：新增 ${result.created} 个构件` : planName(plan),
          'success',
        )
      if (planShouldFocus(plan) && result.focusIds.length > 0) {
        window.requestAnimationFrame(() => getEditorScene()?.focusEntityIds(result.focusIds))
      }
      try {
        const shots = await captureVisionImages('current', 960)
        if (shots[0]) snapshot = { dataUrl: shots[0].dataUrl, label: 'result' }
      } catch {
        // A snapshot is optional; the plan itself already succeeded.
      }
    } else {
      useRuntime.getState().toast(`AI 操作失败：${result.error ?? result.summary}`, 'error')
    }
    useAi.getState().patchMessage(messageId, {
      result,
      status: result.ok ? 'executed' : 'failed',
      ...(snapshot ? { snapshot } : {}),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    useAi.getState().patchMessage(messageId, {
      status: 'failed',
      result: {
        ok: false,
        summary: 'AI 操作失败',
        warnings: [],
        created: 0,
        focusIds: [],
        error: message,
      },
    })
    useRuntime.getState().toast(`AI 操作失败：${message}`, 'error')
  } finally {
    useAi.getState().setBusy(false)
  }
}
