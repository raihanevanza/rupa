import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export type StatTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger'

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** What the number counts, e.g. "Points". */
  label: ReactNode
  value: ReactNode
  /** Leading icon or emoji. Decorative. */
  icon?: ReactNode
  tone?: StatTone
  size?: 'sm' | 'md'
}

/**
 * One number with its label: a total, a count, a score. Put several in a list for a
 * summary row. The value comes first, so it is read as "12 Points".
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, icon, tone = 'neutral', size = 'md', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('rupa-stat', className)}
      data-tone={tone}
      data-size={size}
      data-icon={icon != null || undefined}
      {...props}
    >
      {icon != null && (
        <span className="rupa-stat__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="rupa-stat__value">{value}</span>
      <span className="rupa-stat__label">{label}</span>
    </div>
  )
})
