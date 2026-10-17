import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { toneIcon, XIcon, type Tone } from '../../lib/icons.js'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: Tone
  title?: ReactNode
  /** A Button or link, e.g. "Retry". */
  action?: ReactNode
  /** Shows a close button. */
  onDismiss?: () => void
  dismissLabel?: string
  /**
   * Announce the alert when it appears. Use for messages that show up after an action;
   * leave off for alerts that are part of the page from the start.
   */
  live?: boolean
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = 'info',
    title,
    action,
    onDismiss,
    dismissLabel = 'Dismiss',
    live,
    className,
    children,
    ...props
  },
  ref,
) {
  const Icon = toneIcon[tone]
  const role = live ? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status') : undefined
  return (
    <div ref={ref} className={cx('rupa-alert', className)} data-tone={tone} role={role} {...props}>
      <Icon className="rupa-alert__icon" />
      <div className="rupa-alert__body">
        {title != null && <p className="rupa-alert__title">{title}</p>}
        {children != null && <div className="rupa-alert__text">{children}</div>}
        {action != null && <div className="rupa-alert__action">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="rupa-alert__dismiss rupa-focusable"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <XIcon />
        </button>
      )}
    </div>
  )
})
