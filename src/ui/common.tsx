import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function IconButton({
  icon: Icon,
  label,
  active,
  tone = 'default',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon
  label: string
  active?: boolean
  tone?: 'default' | 'accent' | 'danger'
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`icon-button ${active ? 'is-active' : ''} tone-${tone} ${className}`}
      data-automation-label={label}
      {...rest}
    >
      <Icon size={16} strokeWidth={1.8} />
    </button>
  )
}

export function Section({
  title,
  aside,
  children,
  className = '',
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`section ${className}`}>
      <div className="section-head">
        <h3>{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <button
      type="button"
      className={`toggle-row ${checked ? 'is-on' : ''}`}
      data-automation-label={label}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-copy">
        <span className="toggle-label">{label}</span>
        {hint && <span className="toggle-hint">{hint}</span>}
      </span>
      <span className="switch" aria-hidden="true">
        <span className="switch-knob" />
      </span>
    </button>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  compact = false,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[]
  value: T
  onChange: (value: T) => void
  compact?: boolean
}) {
  return (
    <div className={`segmented ${compact ? 'is-compact' : ''}`}>
      {options.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            className={option.value === value ? 'is-active' : ''}
            data-automation-label={option.label}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={13} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function formatNumber(value: number, precision = 2): string {
  if (!Number.isFinite(value)) return '0'
  const fixed = Number(value.toFixed(precision))
  return String(fixed)
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  suffix,
  precision = 2,
  disabled = false,
  compact = false,
}: {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  precision?: number
  disabled?: boolean
  compact?: boolean
}) {
  const [text, setText] = useState(formatNumber(value, precision))
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focused) setText(formatNumber(value, precision))
  }, [value, precision, focused])

  const clampValue = (input: number) => {
    let next = input
    if (typeof min === 'number') next = Math.max(min, next)
    if (typeof max === 'number') next = Math.min(max, next)
    return next
  }

  const commit = () => {
    const parsed = Number(text.replace(',', '.'))
    if (!Number.isFinite(parsed)) {
      setText(formatNumber(value, precision))
      return
    }
    const next = clampValue(parsed)
    setText(formatNumber(next, precision))
    if (next !== value) onChange(next)
  }

  return (
    <label className={`number-field ${compact ? 'is-compact' : ''} ${disabled ? 'is-disabled' : ''}`}>
      {label && <span className="field-label">{label}</span>}
      <span className="field-input-wrap">
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          aria-label={label}
          data-automation-label={label}
          value={text}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => {
            setFocused(false)
            commit()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              ref.current?.blur()
            } else if (event.key === 'Escape') {
              setText(formatNumber(value, precision))
              ref.current?.blur()
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault()
              const delta = event.key === 'ArrowUp' ? step : -step
              const base = Number.isFinite(Number(text)) ? Number(text) : value
              const next = clampValue(Number((base + delta).toFixed(4)))
              setText(formatNumber(next, precision))
              onChange(next)
            }
          }}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
    </label>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  onBegin,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  onBegin?: () => void
  display: string
}) {
  return (
    <div className="slider-field">
      <div className="slider-head">
        <span className="field-label">{label}</span>
        <span className="slider-value">{display}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        data-automation-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={onBegin}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

export function Swatch({
  color,
  name,
  selected,
  onClick,
}: {
  color: string
  name: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`swatch ${selected ? 'is-active' : ''}`}
      data-automation-label={name}
      title={name}
      aria-label={name}
      onClick={onClick}
      style={{ '--swatch': color } as React.CSSProperties}
    >
      <span />
    </button>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon
  title: string
  hint: string
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={20} />
      </span>
      <strong>{title}</strong>
      <p>{hint}</p>
    </div>
  )
}
