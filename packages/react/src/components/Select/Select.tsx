import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'
import { Field, type FieldProps } from '../Field/Field.js'

export interface SelectOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface SelectProps
  extends
    SelectHTMLAttributes<HTMLSelectElement>,
    Pick<FieldProps, 'label' | 'hint' | 'error' | 'requiredLabel' | 'hideLabel'> {
  options: SelectOption[]
  /** Adds a first empty option, e.g. "Choose a branch". */
  placeholder?: string
  fieldClassName?: string
}

/** A styled native <select>: full keyboard, screen reader, and mobile picker support for free. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    requiredLabel,
    hideLabel,
    options,
    placeholder,
    id,
    required,
    disabled,
    className,
    fieldClassName,
    ...props
  },
  ref,
) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredLabel={requiredLabel}
      hideLabel={hideLabel}
      id={id}
      className={fieldClassName}
    >
      {({ id, describedBy, invalid }) => (
        <div className="rupa-control rupa-select" data-disabled={disabled || undefined}>
          <select
            ref={ref}
            id={id}
            className={cx('rupa-select__input', className)}
            required={required}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...props}
          >
            {placeholder != null && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </Field>
  )
})
