import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { AlertCircleIcon, InboxIcon, RefreshIcon } from '../../lib/icons.js'
import { Button } from '../Button/Button.js'
import { Spinner } from '../Spinner/Spinner.js'

export type ViewState = 'loading' | 'empty' | 'error'

export interface StateViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  state: ViewState
  title?: ReactNode
  /** Defaults to a generic English sentence; pass `null` for none. */
  description?: ReactNode
  /** Custom icon for the empty state. */
  icon?: ReactNode
  /** Extra action, e.g. "Create request" for an empty list. */
  action?: ReactNode
  /** Shows a retry button in the error state. */
  onRetry?: () => void
  retryLabel?: string
  /** Shrinks paddings for use inside tables and cards. */
  compact?: boolean
}

const defaults: Record<ViewState, { title: string; description?: string }> = {
  loading: { title: 'Loading…' },
  empty: { title: 'Nothing here yet', description: 'Items you add will show up here.' },
  error: { title: 'Something went wrong', description: 'Check your connection and try again.' },
}

/** One consistent look for loading, empty, and error states across every screen. */
export const StateView = forwardRef<HTMLDivElement, StateViewProps>(function StateView(
  {
    state,
    title,
    description,
    icon,
    action,
    onRetry,
    retryLabel = 'Try again',
    compact,
    className,
    ...props
  },
  ref,
) {
  const text = defaults[state]
  // `null` means "no description"; only `undefined` falls back to the default text.
  const desc = description === undefined ? text.description : description
  return (
    <div
      ref={ref}
      className={cx('rupa-state-view', className)}
      data-state={state}
      data-compact={compact || undefined}
      role={state === 'loading' ? 'status' : state === 'error' ? 'alert' : undefined}
      {...props}
    >
      <span className="rupa-state-view__icon">
        {state === 'loading' && <Spinner label={null} size="lg" />}
        {state === 'empty' && (icon ?? <InboxIcon />)}
        {state === 'error' && <AlertCircleIcon />}
      </span>
      <p className="rupa-state-view__title">{title ?? text.title}</p>
      {desc != null && <p className="rupa-state-view__description">{desc}</p>}
      {(action != null || (state === 'error' && onRetry)) && (
        <div className="rupa-state-view__actions">
          {state === 'error' && onRetry && (
            <Button iconStart={<RefreshIcon />} onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
})
