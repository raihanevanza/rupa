import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx.js'
import { CheckIcon, MinusIcon } from '../../lib/icons.js'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  description?: ReactNode
  /** "Some selected" state, e.g. a select-all checkbox. */
  indeterminate?: boolean
}

/** A native checkbox (Space toggles, form-ready) with a custom look. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, id: idProp, className, disabled, ...props },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  const descId = description != null ? `${id}-desc` : undefined
  const inner = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inner.current!)
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <div className={cx('rupa-checkbox', className)} data-disabled={disabled || undefined}>
      <span className="rupa-checkbox__box">
        <input
          ref={inner}
          id={id}
          type="checkbox"
          className="rupa-checkbox__input"
          disabled={disabled}
          aria-describedby={descId}
          {...props}
        />
        <span className="rupa-checkbox__control" aria-hidden="true">
          <CheckIcon className="rupa-checkbox__check" />
          <MinusIcon className="rupa-checkbox__dash" />
        </span>
      </span>
      <span className="rupa-checkbox__text">
        <label htmlFor={id} className="rupa-checkbox__label">
          {label}
        </label>
        {descId && (
          <span id={descId} className="rupa-checkbox__description">
            {description}
          </span>
        )}
      </span>
    </div>
  )
})
