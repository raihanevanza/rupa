import { forwardRef, useSyncExternalStore, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export interface CountdownLabels {
  days: string
  hours: string
  minutes: string
  seconds: string
}

export interface CountdownProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The moment to count down to (ISO string, timestamp, or Date). */
  to: string | number | Date
  /** Accessible name of the timer, e.g. "Time until kick-off". */
  label: string
  /** Unit names under the numbers. */
  labels?: Partial<CountdownLabels>
  /** Shown once the time has come. */
  done?: ReactNode
  /** Freeze the clock at this time (ms), e.g. for screenshots. */
  now?: number
  size?: 'sm' | 'md'
}

const defaultLabels: CountdownLabels = {
  days: 'days',
  hours: 'hrs',
  minutes: 'min',
  seconds: 'sec',
}

// One clock shared by every Countdown, ticking only while at least one is on screen.
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined
let current = 0

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!timer) {
    current = Date.now()
    timer = setInterval(() => {
      current = Date.now()
      listeners.forEach((l) => l())
    }, 1000)
  }
  return () => {
    listeners.delete(listener)
    if (!listeners.size) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

// The snapshot must stay the same between calls, so only the timer moves it.
const getSnapshot = () => (current ||= Date.now())
// The server does not know "now"; rendering a placeholder keeps hydration stable.
const getServerSnapshot = () => 0
// With a frozen `now` there is nothing to tick.
const noopSubscribe = () => () => {}

/**
 * Time left until a moment, in days, hours, minutes, and seconds. A `timer` for assistive
 * tech, which does not announce every tick.
 */
export const Countdown = forwardRef<HTMLSpanElement, CountdownProps>(function Countdown(
  { to, label, labels: labelsProp, done = '0', now, size = 'md', className, ...props },
  ref,
) {
  const ticking = useSyncExternalStore(
    now === undefined ? subscribe : noopSubscribe,
    getSnapshot,
    getServerSnapshot,
  )
  const clock = now ?? ticking
  const labels = { ...defaultLabels, ...labelsProp }
  const left = Math.max(0, new Date(to).getTime() - clock)

  let body: ReactNode
  if (!clock) body = <span className="rupa-countdown__done">…</span>
  else if (!left) body = <span className="rupa-countdown__done">{done}</span>
  else {
    const units = [
      { label: labels.days, value: Math.floor(left / 86_400_000) },
      { label: labels.hours, value: Math.floor(left / 3_600_000) % 24 },
      { label: labels.minutes, value: Math.floor(left / 60_000) % 60 },
      { label: labels.seconds, value: Math.floor(left / 1000) % 60 },
    ].filter((u, i) => u.value > 0 || i > 0)
    body = units.map((u) => (
      <span key={u.label} className="rupa-countdown__unit">
        <span className="rupa-countdown__value">{String(u.value).padStart(2, '0')}</span>
        <span className="rupa-countdown__label">{u.label}</span>
      </span>
    ))
  }

  return (
    <span
      ref={ref}
      role="timer"
      aria-label={label}
      className={cx('rupa-countdown', className)}
      data-size={size}
      {...props}
    >
      {body}
    </span>
  )
})
