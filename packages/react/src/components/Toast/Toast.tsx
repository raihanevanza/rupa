import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { toneIcon, XIcon, type Tone } from '../../lib/icons.js'

export interface ToastOptions {
  tone?: Tone
  title: ReactNode
  description?: ReactNode
  /** e.g. an "Undo" Button. */
  action?: ReactNode
  /** Milliseconds before it hides; `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
}

interface ToastApi {
  show: (toast: ToastOptions) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)
const noopSubscribe = () => () => {}

export interface ToastProviderProps {
  children: ReactNode
  /** Accessible name of the notification region. */
  label?: string
  dismissLabel?: string
  /** Most toasts shown at once; older ones are removed first. */
  limit?: number
}

/**
 * Wrap the app once, then call `useToast().show(...)`. Toasts are announced through live
 * regions (errors assertively), pause while hovered or focused, and never take focus.
 */
export function ToastProvider({
  children,
  label = 'Notifications',
  dismissLabel = 'Dismiss',
  limit = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)
  // false during server rendering and hydration, true on the client: the portal needs document.body.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  const dismiss = useCallback(
    (id: number) => setToasts((all) => all.filter((t) => t.id !== id)),
    [],
  )
  const show = useCallback(
    (toast: ToastOptions) => {
      const id = nextId.current++
      setToasts((all) => [...all, { ...toast, id }].slice(-limit))
      return id
    },
    [limit],
  )
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss])

  const polite = toasts.filter((t) => t.tone !== 'danger')
  const assertive = toasts.filter((t) => t.tone === 'danger')

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <section className="rupa-toaster" aria-label={label}>
            {/* Live regions exist before any toast, so the first one is announced too. */}
            <ol className="rupa-toaster__list" aria-live="polite" aria-relevant="additions">
              {polite.map((t) => (
                <Toast key={t.id} toast={t} onDismiss={dismiss} dismissLabel={dismissLabel} />
              ))}
            </ol>
            <ol className="rupa-toaster__list" aria-live="assertive" aria-relevant="additions">
              {assertive.map((t) => (
                <Toast key={t.id} toast={t} onDismiss={dismiss} dismissLabel={dismissLabel} />
              ))}
            </ol>
          </section>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

function Toast({
  toast,
  onDismiss,
  dismissLabel,
}: {
  toast: ToastItem
  onDismiss: (id: number) => void
  dismissLabel: string
}) {
  const { id, tone = 'info', title, description, action, duration = 5000 } = toast
  const [paused, setPaused] = useState(false)
  const Icon = toneIcon[tone]

  useEffect(() => {
    if (paused || !Number.isFinite(duration)) return
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [paused, duration, id, onDismiss])

  return (
    // Pausing on hover/focus is a timing accommodation (WCAG 2.2.1), not an interaction.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className="rupa-toast"
      data-tone={tone}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon className="rupa-toast__icon" />
      <div className="rupa-toast__body">
        <p className="rupa-toast__title">{title}</p>
        {description != null && <p className="rupa-toast__description">{description}</p>}
        {action != null && <div className="rupa-toast__action">{action}</div>}
      </div>
      <button
        type="button"
        className="rupa-toast__dismiss rupa-focusable"
        aria-label={dismissLabel}
        onClick={() => onDismiss(id)}
      >
        <XIcon />
      </button>
    </li>
  )
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used inside <ToastProvider>')
  return api
}
