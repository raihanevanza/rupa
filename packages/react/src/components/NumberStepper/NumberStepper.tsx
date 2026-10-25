import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'
import { MinusIcon, PlusIcon } from '../../lib/icons.js'
import { useControllable } from '../../lib/useControllable.js'

export interface NumberStepperProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Accessible name, e.g. "Goals for Arsenal". */
  label: string
  decrementLabel?: string
  incrementLabel?: string
  disabled?: boolean
  size?: 'md' | 'lg'
}

/**
 * A small whole number picked with − and + (a score, a quantity). The number is a WAI-ARIA
 * spin button: one Tab stop, Up/Down to change it, Home/End for the limits. The buttons are
 * for pointers, so they are left out of the Tab order.
 */
export const NumberStepper = forwardRef<HTMLDivElement, NumberStepperProps>(function NumberStepper(
  {
    value: valueProp,
    defaultValue = 0,
    onChange,
    min = 0,
    max = 99,
    step = 1,
    label,
    decrementLabel = 'Decrease',
    incrementLabel = 'Increase',
    disabled,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const [value, setValue] = useControllable(valueProp, defaultValue, onChange)
  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))
    if (clamped !== value) setValue(clamped)
  }

  return (
    <div
      ref={ref}
      className={cx('rupa-number-stepper', className)}
      data-size={size}
      data-disabled={disabled || undefined}
      {...props}
    >
      <button
        type="button"
        tabIndex={-1}
        className="rupa-number-stepper__button"
        aria-label={decrementLabel}
        disabled={disabled || value <= min}
        onClick={() => set(value - step)}
      >
        <MinusIcon />
      </button>
      <span
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={disabled || undefined}
        className="rupa-number-stepper__value rupa-focusable"
        onKeyDown={(e) => {
          if (disabled) return
          const keys: Record<string, number> = {
            ArrowUp: value + step,
            ArrowRight: value + step,
            ArrowDown: value - step,
            ArrowLeft: value - step,
            PageUp: value + step * 5,
            PageDown: value - step * 5,
            Home: min,
            End: max,
          }
          if (!(e.key in keys)) return
          e.preventDefault()
          set(keys[e.key]!)
        }}
      >
        {value}
      </span>
      <button
        type="button"
        tabIndex={-1}
        className="rupa-number-stepper__button"
        aria-label={incrementLabel}
        disabled={disabled || value >= max}
        onClick={() => set(value + step)}
      >
        <PlusIcon />
      </button>
    </div>
  )
})
