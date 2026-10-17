import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { Field, type FieldProps } from '../Field/Field.js'

export interface TextFieldProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    Pick<FieldProps, 'label' | 'hint' | 'error' | 'requiredLabel' | 'hideLabel'> {
  /** Text or icon inside the input, before the value (e.g. "Rp"). */
  prefix?: ReactNode
  suffix?: ReactNode
  /** Class for the outer field wrapper; `className` goes on the input. */
  fieldClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hint,
    error,
    requiredLabel,
    hideLabel,
    prefix,
    suffix,
    id,
    required,
    disabled,
    className,
    fieldClassName,
    type = 'text',
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
        <div className="rupa-control" data-disabled={disabled || undefined}>
          {prefix != null && <span className="rupa-control__adornment">{prefix}</span>}
          <input
            ref={ref}
            id={id}
            type={type}
            className={cx('rupa-text-field__input', className)}
            required={required}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...props}
          />
          {suffix != null && <span className="rupa-control__adornment">{suffix}</span>}
        </div>
      )}
    </Field>
  )
})
