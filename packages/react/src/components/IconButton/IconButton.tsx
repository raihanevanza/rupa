import { forwardRef, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { Button, type ButtonProps } from '../Button/Button.js'
import { Tooltip } from '../Tooltip/Tooltip.js'

export interface IconButtonProps extends Omit<
  ButtonProps,
  'children' | 'iconStart' | 'iconEnd' | 'block'
> {
  icon: ReactNode
  /** Required: the accessible name, also shown as a tooltip. */
  label: string
  /** Show the label as a tooltip on hover and focus. */
  tooltip?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, tooltip = true, variant = 'ghost', className, ...props },
  ref,
) {
  const button = (
    <Button
      ref={ref}
      variant={variant}
      aria-label={label}
      className={cx('rupa-icon-button', className)}
      iconStart={icon}
      {...props}
    />
  )
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button
})
