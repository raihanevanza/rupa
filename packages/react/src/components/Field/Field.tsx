import { useId, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { AlertCircleIcon } from '../../lib/icons.js'

export interface FieldIds {
  id: string
  /** Id of the label element, for controls that build their name with aria-labelledby. */
  labelId: string
  describedBy: string | undefined
  invalid: boolean
}

export interface FieldProps {
  label: ReactNode
  hint?: ReactNode
  /** Error message. Also marks the control `aria-invalid`. */
  error?: ReactNode
  required?: boolean
  /** Text after required labels, for screen readers and sighted users. */
  requiredLabel?: string
  /** Hide the label visually but keep it for assistive tech. */
  hideLabel?: boolean
  id?: string
  className?: string
  /** Render the control with the wiring ids. */
  children: (ids: FieldIds) => ReactNode
}

/**
 * Label + control + hint + error with the ARIA wiring done once. TextField and Select use it;
 * use it directly to wrap a custom control.
 */
export function Field({
  label,
  hint,
  error,
  required,
  requiredLabel = 'required',
  hideLabel,
  id: idProp,
  className,
  children,
}: FieldProps) {
  const auto = useId()
  const id = idProp ?? auto
  const labelId = `${id}-label`
  const hintId = hint != null ? `${id}-hint` : undefined
  const errorId = error != null && error !== false ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cx('rupa-field', className)} data-invalid={errorId ? true : undefined}>
      <label
        id={labelId}
        htmlFor={id}
        className={cx('rupa-field__label', hideLabel && 'rupa-visually-hidden')}
      >
        {label}
        {required && (
          <span className="rupa-field__required">
            <span aria-hidden="true"> *</span>
            <span className="rupa-visually-hidden"> ({requiredLabel})</span>
          </span>
        )}
      </label>
      {children({ id, labelId, describedBy, invalid: !!errorId })}
      {errorId && (
        <p id={errorId} className="rupa-field__error">
          <AlertCircleIcon />
          <span>{error}</span>
        </p>
      )}
      {hintId && (
        <p id={hintId} className="rupa-field__hint">
          {hint}
        </p>
      )}
    </div>
  )
}
