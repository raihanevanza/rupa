import {
  forwardRef,
  useRef,
  type ForwardedRef,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from '../../lib/cx.js'
import { nextIndex } from '../../lib/roving.js'
import { useControllable } from '../../lib/useControllable.js'

export interface SegmentedOption<T extends string = string> {
  value: T
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface SegmentedProps<T extends string = string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  options: SegmentedOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** Accessible name of the group (e.g. "Status filter"). */
  label: string
  size?: 'sm' | 'md'
  block?: boolean
}

/**
 * A single choice from 2–5 options, shown inline. Keyboard: Tab enters the group,
 * arrow keys move and select, Home/End jump to the ends (WAI-ARIA radio group).
 */
function SegmentedInner<T extends string>(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    label,
    size = 'md',
    block,
    className,
    ...props
  }: SegmentedProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [value, setValue] = useControllable<T | undefined>(
    valueProp,
    defaultValue,
    onChange as (v: T | undefined) => void,
  )
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const selected = options.findIndex((o) => o.value === value)
  const focusable = selected >= 0 ? selected : options.findIndex((o) => !o.disabled)

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={cx('rupa-segmented', className)}
      data-size={size}
      data-block={block || undefined}
      {...props}
    >
      {options.map((option, i) => (
        <button
          key={option.value}
          ref={(el) => {
            buttons.current[i] = el
          }}
          type="button"
          role="radio"
          aria-checked={i === selected}
          tabIndex={i === focusable ? 0 : -1}
          disabled={option.disabled}
          className="rupa-segmented__option rupa-focusable"
          onClick={() => setValue(option.value)}
          onKeyDown={(e) => {
            const to = nextIndex(
              e,
              i,
              options.map((o) => !!o.disabled),
            )
            if (to === null) return
            e.preventDefault()
            buttons.current[to]?.focus()
            setValue(options[to]!.value)
          }}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

export const Segmented = forwardRef(SegmentedInner) as <T extends string = string>(
  props: SegmentedProps<T> & { ref?: Ref<HTMLDivElement> },
) => JSX.Element
