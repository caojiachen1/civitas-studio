export interface UiControlInfo {
  id: string
  automationId: string
  name: string
  role: string
  tag: string
  disabled: boolean
  hidden: boolean
  scope: string
  group: string
  rect: { x: number; y: number; width: number; height: number }
}

export interface UiControlAudit {
  controls: UiControlInfo[]
  total: number
  missing: number
  duplicates: number
  interactive: number
}

const INTERACTIVE_SELECTOR = [
  'button',
  'input',
  'select',
  'textarea',
  'a[href]',
  '[role="button"]',
  '[role="switch"]',
  '[role="slider"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="application"]',
  '[contenteditable="true"]',
].join(',')

const AUTO_ATTR = 'data-automation-auto'
const ID_ATTR = 'data-automation-id'
const LABEL_ATTR = 'data-automation-label'

function normalize(value: string | null | undefined, max = 32): string {
  if (!value) return ''
  return value
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
}

function elementLabel(el: HTMLElement): string {
  const explicit = el.getAttribute(LABEL_ATTR) || el.getAttribute('aria-label') || el.getAttribute('title')
  if (explicit?.trim()) return explicit.trim()
  if (el instanceof HTMLInputElement) {
    if (el.type === 'range') {
      const field = el.closest('.slider-field')
      const label = field?.querySelector('.field-label')?.textContent?.trim()
      if (label) return label
    }
    if (el.type === 'text' || el.type === 'search' || el.type === 'number') {
      const field = el.closest('label, .field-grid, .select-field')
      const label = field?.querySelector('span')?.textContent?.trim()
      if (label) return label
    }
    if (el.placeholder) return el.placeholder
  }
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (text) return text
  if (el instanceof HTMLInputElement) return el.type || 'input'
  return el.tagName.toLowerCase()
}

function elementGroup(el: HTMLElement): string {
  const section = el.closest('.section')
  const sectionTitle = section?.querySelector('.section-head h3')?.textContent?.trim()
  if (sectionTitle) return sectionTitle
  const panelTitle = el.closest('.panel-scroll')?.querySelector('.panel-heading h2')?.textContent?.trim()
  if (panelTitle) return panelTitle
  const inspectorTitle = el.closest('.inspector')?.querySelector('.inspector-head h2, .inspector-head strong')?.textContent?.trim()
  if (inspectorTitle) return inspectorTitle
  const modalTitle = el.closest('.help-modal, .ai-drawer, .mcp-panel')?.querySelector('h2, h3')?.textContent?.trim()
  if (modalTitle) return modalTitle
  return ''
}

function elementRole(el: HTMLElement): string {
  const explicit = el.getAttribute('role')
  if (explicit) return explicit
  if (el instanceof HTMLInputElement) return `input-${el.type || 'text'}`
  return el.tagName.toLowerCase()
}

function elementScope(el: HTMLElement): string {
  return el.closest('[data-ui-scope]')?.getAttribute('data-ui-scope') || 'app'
}

function computeBaseId(el: HTMLElement): string {
  const scope = normalize(elementScope(el), 20) || 'app'
  const group = normalize(elementGroup(el), 24)
  const label = normalize(elementLabel(el), 36) || 'control'
  const role = normalize(elementRole(el), 16)
  const parts = ['civitas', scope, group, label, role].filter(Boolean)
  return parts.join('-').slice(0, 96)
}

function isVisible(el: HTMLElement): boolean {
  if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return false
  if (!el.getClientRects().length) return false
  const style = window.getComputedStyle(el)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

export function assignAutomationIds(root: ParentNode = document): { interactive: number; missing: number } {
  const elements = [...root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)].filter(
    (el) => el.getAttribute('data-automation-skip') !== 'true',
  )
  const counts = new Map<string, number>()
  let missing = 0
  for (const el of elements) {
    const explicitId = el.getAttribute(ID_ATTR)
    const auto = el.getAttribute(AUTO_ATTR) === 'true'
    const developerId = !explicitId && el.id && !el.id.startsWith('civitas-') ? el.id : ''
    const base = explicitId && !auto ? explicitId : developerId || computeBaseId(el)
    const seen = (counts.get(base) ?? 0) + 1
    counts.set(base, seen)
    const finalId = seen === 1 ? base : `${base}-${seen}`
    if (explicitId && !auto) {
      if (!el.id) el.id = explicitId
    } else if (developerId) {
      el.setAttribute(ID_ATTR, el.id)
    } else {
      if (el.id !== finalId) el.id = finalId
      el.setAttribute(ID_ATTR, finalId)
      el.setAttribute(AUTO_ATTR, 'true')
    }
    if (!el.id) missing++
    if (!el.getAttribute('aria-label') && !(el.textContent ?? '').trim()) {
      const label = elementLabel(el)
      if (label) el.setAttribute('aria-label', label)
    }
  }
  return { interactive: elements.length, missing }
}

function toControl(el: HTMLElement): UiControlInfo {
  const rect = el.getBoundingClientRect()
  const id = el.id || el.getAttribute(ID_ATTR) || ''
  return {
    id,
    automationId: el.getAttribute(ID_ATTR) || id,
    name: (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    role: elementRole(el),
    tag: el.tagName.toLowerCase(),
    disabled: el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement
      ? el.disabled
      : el.getAttribute('aria-disabled') === 'true',
    hidden: !isVisible(el),
    scope: elementScope(el),
    group: elementGroup(el),
    rect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
  }
}

export function auditAutomationIds(options?: {
  includeHidden?: boolean
  query?: string
  limit?: number
}): UiControlAudit {
  const result = assignAutomationIds()
  const query = options?.query?.trim().toLowerCase() ?? ''
  const includeHidden = options?.includeHidden ?? false
  const limit = Math.max(1, Math.min(1000, options?.limit ?? 500))
  const all = [...document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)].map(toControl)
  const filtered = all.filter((control) => {
    if (!includeHidden && control.hidden) return false
    if (!query) return true
    return `${control.automationId} ${control.name} ${control.role} ${control.group}`.toLowerCase().includes(query)
  })
  const ids = all.map((control) => control.automationId).filter(Boolean)
  return {
    controls: filtered.slice(0, limit),
    total: all.length,
    missing: all.filter((control) => !control.automationId).length,
    duplicates: ids.length - new Set(ids).size,
    interactive: result.interactive,
  }
}

export function installAutomationIds(): () => void {
  let frame = 0
  const scan = () => {
    frame = 0
    assignAutomationIds()
  }
  const schedule = () => {
    if (frame) return
    frame = window.requestAnimationFrame(scan)
  }
  schedule()
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  const timers = [450, 1500].map((delay) => window.setTimeout(scan, delay))
  return () => {
    observer.disconnect()
    if (frame) window.cancelAnimationFrame(frame)
    timers.forEach((timer) => window.clearTimeout(timer))
  }
}
