import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  /** A leading dot. The text still carries the meaning; the dot only reinforces it. */
  dot?: boolean
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', dot, size = 'md', className, children, ...props },
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
      {dot && <span className="rupa-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
})
