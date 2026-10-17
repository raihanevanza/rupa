import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { useControllable } from '../../lib/useControllable.js'

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'value' | 'defaultValue'
> {
  label: ReactNode
  description?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Put the switch after the label (settings lists). */
  labelPosition?: 'start' | 'end'
}

/** An on/off setting that applies immediately. For form submissions, prefer Checkbox. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    description,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    labelPosition = 'end',
    id: idProp,
    className,
    disabled,
    onClick,
    ...props
  },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  const descId = description != null ? `${id}-desc` : undefined
  const [checked, setChecked] = useControllable(checkedProp, defaultChecked, onCheckedChange)

  return (
    <div
      className={cx('rupa-switch', className)}
      data-label-position={labelPosition}
      data-disabled={disabled || undefined}
    >
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descId}
        className="rupa-switch__track rupa-focusable"
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) setChecked(!checked)
        }}
        {...props}
      >
        <span className="rupa-switch__thumb" />
      </button>
      <span className="rupa-switch__text">
        <label htmlFor={id} className="rupa-switch__label">
          {label}
        </label>
        {descId && (
          <span id={descId} className="rupa-switch__description">
            {description}
          </span>
        )}
      </span>
    </div>
  )
})
