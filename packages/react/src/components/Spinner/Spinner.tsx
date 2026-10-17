import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Announced to screen readers. Pass `null` when the spinner is decorative (e.g. inside a busy button). */
  label?: string | null
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { label = 'Loading', size = 'md', className, ...props },
  ref,
) {
  const decorative = label === null
  return (
    <span
      ref={ref}
      className={cx('rupa-spinner', className)}
      data-size={size}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      {...props}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle className="rupa-spinner__track" cx="12" cy="12" r="9" />
        <circle className="rupa-spinner__arc" cx="12" cy="12" r="9" />
      </svg>
      {!decorative && <span className="rupa-visually-hidden">{label}</span>}
    </span>
  )
})
