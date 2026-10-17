import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  /** A leading dot. The text still carries the meaning; the dot only reinforces it. */
  dot?: boolean
  /** Animate the dot for live states (e.g. "Executing"). Implies `dot`. Respects reduced motion. */
  pulse?: boolean
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', dot, pulse, size = 'md', className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('rupa-badge', className)}
      data-tone={tone}
      data-size={size}
      {...props}
    >
      {(dot || pulse) && (
        <span className="rupa-badge__dot" data-pulse={pulse || undefined} aria-hidden="true" />
      )}
      {children}
    </span>
  )
})
