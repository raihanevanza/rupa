import { forwardRef, useId, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { nextIndex } from '../../lib/roving.js'
import { useControllable } from '../../lib/useControllable.js'

export interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
  /** e.g. a count Badge next to the label. */
  badge?: ReactNode
}

export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Accessible name of the tab list. */
  label: string
  /**
   * `automatic`: arrow keys select the tab they move to (fast panels).
   * `manual`: arrow keys only move focus; Enter/Space selects (slow panels).
   */
  activation?: 'automatic' | 'manual'
}

/** WAI-ARIA tabs: one Tab stop for the list, arrows/Home/End inside it, panel follows. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value: valueProp,
    defaultValue,
    onChange,
    label,
    activation = 'automatic',
    className,
    ...props
  },
  ref,
) {
  const base = useId()
  const firstEnabled = items.find((t) => !t.disabled)?.value
  const [value, setValue] = useControllable(valueProp, defaultValue ?? firstEnabled ?? '', onChange)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const selected = Math.max(
    0,
    items.findIndex((t) => t.value === value),
  )

  return (
    <div ref={ref} className={cx('rupa-tabs', className)} {...props}>
      <div role="tablist" aria-label={label} className="rupa-tabs__list">
        {items.map((tab, i) => (
          <button
            key={tab.value}
            ref={(el) => {
              tabs.current[i] = el
            }}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === selected ? 0 : -1}
            disabled={tab.disabled}
            className="rupa-tabs__tab rupa-focusable"
            onClick={() => setValue(tab.value)}
            onKeyDown={(e) => {
              const to = nextIndex(
                e,
                i,
                items.map((t) => !!t.disabled),
              )
              if (to === null) return
              e.preventDefault()
              tabs.current[to]?.focus()
              if (activation === 'automatic') setValue(items[to]!.value)
            }}
          >
            {tab.label}
            {tab.badge}
          </button>
        ))}
      </div>
      {items.map((tab, i) => (
        <div
          key={tab.value}
          id={`${base}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${i}`}
          // Focusable so keyboard users can reach panels without focusable content (APG tabs pattern).
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          hidden={i !== selected}
          className="rupa-tabs__panel rupa-focusable"
        >
          {i === selected && tab.content}
        </div>
      ))}
    </div>
  )
})
