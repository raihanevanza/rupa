import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cx } from '../../lib/cx.js'

/**
 * Bare form controls: the TextField / Select look without a built-in label. Use them when
 * the app provides its own label and layout (e.g. `<label>Name <Input /></label>`), or with
 * `Field`. Set `aria-invalid` to show the error state.
 */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = 'text', ...props }, ref) {
    return <input ref={ref} type={type} className={cx('rupa-input', className)} {...props} />
  },
)

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 3, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={cx('rupa-input', className)} {...props} />
})

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Class for the wrapper that draws the chevron; `className` goes on the <select>. */
  wrapperClassName?: string
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { className, wrapperClassName, children, ...props },
  ref,
) {
  return (
    <span className={cx('rupa-native-select', wrapperClassName)}>
      <select ref={ref} className={cx('rupa-input', className)} {...props}>
        {children}
      </select>
    </span>
  )
})
