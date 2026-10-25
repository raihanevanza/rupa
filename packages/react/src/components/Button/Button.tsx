import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { Slot } from '../../lib/slot.js'
import { Spinner } from '../Spinner/Spinner.js'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner, sets `aria-busy`, and blocks clicks so the action cannot run twice. */
  loading?: boolean
  iconStart?: ReactNode
  iconEnd?: ReactNode
  /** Stretch to the container width. */
  block?: boolean
  /**
   * Give the look to the one child element instead of rendering a <button>, e.g. a router
   * link: `<Button asChild><Link href="/new">New</Link></Button>`. `loading` does not apply.
   */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    iconStart,
    iconEnd,
    block,
    asChild,
    type = 'button',
    disabled,
    className,
    children,
    onClick,
    ...props
  },
  ref,
) {
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={cx('rupa-button', 'rupa-focusable', className)}
        data-variant={variant}
        data-size={size}
        data-block={block || undefined}
        onClick={onClick}
        render={(content) => (
          <>
            {iconStart}
            {content != null && <span className="rupa-button__label">{content}</span>}
            {iconEnd}
          </>
        )}
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
      className={cx('rupa-button', 'rupa-focusable', className)}
      data-variant={variant}
      data-size={size}
      data-block={block || undefined}
      data-loading={loading || undefined}
      disabled={disabled}
      aria-busy={loading || undefined}
      // aria-disabled keeps the button focusable while loading, so focus is not lost mid-action.
      aria-disabled={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...props}
    >
      {loading ? <Spinner label={null} size="sm" /> : iconStart}
      {children != null && <span className="rupa-button__label">{children}</span>}
      {!loading && iconEnd}
    </button>
  )
})
