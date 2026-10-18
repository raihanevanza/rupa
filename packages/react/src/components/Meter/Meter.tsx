import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'

export type MeterTone = 'primary' | 'success' | 'warning' | 'danger'

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'children'> {
  /** Current amount, from 0 to `max`. Values outside the range are clamped. */
  value: number
  max?: number
  /** Accessible name, e.g. "Budget used". */
  label: string
  /** Read instead of the percentage, e.g. "Rp200.000 of Rp1.000.000". */
  valueText?: string
  tone?: MeterTone
  size?: 'sm' | 'md'
  /** Grow from empty when it first appears. Skipped when the user prefers reduced motion. */
  animated?: boolean
}

/**
 * How much of a known total is used: a budget, a goal, an upload. Show the amount as text
 * next to it too; the bar only reinforces it.
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  {
    value,
    max = 100,
    label,
    valueText,
    tone = 'primary',
    size = 'sm',
    animated = true,
    className,
    ...props
  },
  ref,
) {
  const clamped = Math.min(Math.max(value, 0), max)
  const share = max > 0 ? clamped / max : 0
  return (
    <div
      ref={ref}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      className={cx('rupa-meter', className)}
      data-tone={tone}
      data-size={size}
      data-animated={animated || undefined}
      {...props}
    >
      <span className="rupa-meter__fill" style={{ width: `${share * 100}%` }} />
    </div>
  )
})
