import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from '../../lib/cx.js'
import { nextIndex } from '../../lib/roving.js'
import { Slot } from '../../lib/slot.js'
import { useControllable } from '../../lib/useControllable.js'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Selected look. On a button it sets `aria-pressed` (a toggle); with `asChild` on a link it
   * sets `aria-current="page"` (a filter that is a URL). Pass `aria-current` to override.
   */
  selected?: boolean
  /** Leading icon, logo, or color dot. */
  icon?: ReactNode
  size?: 'sm' | 'md'
  /** Put the chip look on the one child element, e.g. a router link. */
  asChild?: boolean
}

/** One pill: a toggle filter, or with `asChild` a link in a row of URL filters. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected, icon, size = 'md', asChild, type = 'button', className, children, ...props },
  ref,
) {
  const classes = cx('rupa-chip', 'rupa-focusable', className)
  const content = (label: ReactNode) => (
    <>
      {icon != null && <span className="rupa-chip__icon">{icon}</span>}
      <span className="rupa-chip__label">{label}</span>
    </>
  )
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={classes}
        data-size={size}
        data-selected={selected || undefined}
        aria-current={selected ? 'page' : undefined}
        render={content}
        {...props}
      >
        {children}
      </Slot>
    )
  }
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      data-size={size}
      data-selected={selected || undefined}
      aria-pressed={selected ?? undefined}
      {...props}
    >
      {content(children)}
    </button>
  )
})

export interface ChipOption<T extends string = string> {
  value: T
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface ChipGroupProps<T extends string = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  options: ChipOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** Accessible name of the group (e.g. "Position filter"). */
  label: string
  /** Wrap onto several rows instead of scrolling sideways in one. */
  wrap?: boolean
  size?: 'sm' | 'md'
}

/**
 * A single choice from many options as pills, e.g. a filter above a list. One row that
 * scrolls sideways (the chosen chip scrolls into view), or `wrap` for several rows. A radio
 * group for assistive tech: Tab enters, arrow keys move and select. For 2–5 short options
 * use Segmented.
 */
function ChipGroupInner<T extends string>(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    label,
    wrap,
    size = 'md',
    className,
    ...props
  }: ChipGroupProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [value, setValue] = useControllable<T | undefined>(
    valueProp,
    defaultValue,
    onChange as (v: T | undefined) => void,
  )
  const row = useRef<HTMLDivElement | null>(null)
  const chips = useRef<(HTMLButtonElement | null)[]>([])
  const selected = options.findIndex((o) => o.value === value)
  const focusable = selected >= 0 ? selected : options.findIndex((o) => !o.disabled)

  useEffect(() => {
    // Scroll only the row, never the page (scrollIntoView would also scroll the page).
    const chip = chips.current[selected]
    if (wrap || !chip || !row.current) return
    const box = row.current.getBoundingClientRect()
    const at = chip.getBoundingClientRect()
    if (at.left < box.left) row.current.scrollLeft -= box.left - at.left
    else if (at.right > box.right) row.current.scrollLeft += at.right - box.right
  }, [selected, wrap])

  return (
    <div
      ref={(el) => {
        row.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      role="radiogroup"
      aria-label={label}
      className={cx('rupa-chip-group', className)}
      data-wrap={wrap || undefined}
      {...props}
    >
      {options.map((option, i) => (
        <button
          key={option.value}
          ref={(el) => {
            chips.current[i] = el
          }}
          type="button"
          role="radio"
          aria-checked={i === selected}
          tabIndex={i === focusable ? 0 : -1}
          disabled={option.disabled}
          className="rupa-chip rupa-focusable"
          data-size={size}
          data-selected={i === selected || undefined}
          onClick={() => setValue(option.value)}
          onKeyDown={(e) => {
            const to = nextIndex(
              e,
              i,
              options.map((o) => !!o.disabled),
            )
            if (to === null) return
            e.preventDefault()
            chips.current[to]?.focus()
            setValue(options[to]!.value)
          }}
        >
          {option.icon != null && <span className="rupa-chip__icon">{option.icon}</span>}
          <span className="rupa-chip__label">{option.label}</span>
        </button>
      ))}
    </div>
  )
}

export const ChipGroup = forwardRef(ChipGroupInner) as <T extends string = string>(
  props: ChipGroupProps<T> & { ref?: Ref<HTMLDivElement> },
) => JSX.Element
