import * as RadixDialog from '@radix-ui/react-dialog'
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { XIcon } from '../../lib/icons.js'

type ContentProps = ComponentPropsWithoutRef<typeof RadixDialog.Content>

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Element that opens the dialog (usually a Button). Focus returns to it on close. */
  trigger?: ReactElement
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Action buttons, right-aligned. */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeLabel?: string
  /** When false, Esc, outside clicks, and the close button are disabled (e.g. while saving). */
  dismissible?: boolean
  className?: string
  /** `alertdialog` for confirmations that interrupt the user. */
  role?: 'dialog' | 'alertdialog'
  /** Where focus goes when the dialog opens. Defaults to the first focusable element. */
  onOpenAutoFocus?: ContentProps['onOpenAutoFocus']
}

/**
 * Modal dialog: focus is trapped inside, the page behind is inert, Esc closes, and focus
 * returns to the trigger. Built on Radix Dialog.
 */
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close',
  dismissible = true,
  className,
  role = 'dialog',
  onOpenAutoFocus,
}: DialogProps) {
  const block = (e: Event) => {
    if (!dismissible) e.preventDefault()
  }
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="rupa-dialog__overlay" />
        <RadixDialog.Content
          className={cx('rupa-dialog', className)}
          data-size={size}
          role={role}
          onEscapeKeyDown={block}
          onPointerDownOutside={block}
          onInteractOutside={block}
          onOpenAutoFocus={onOpenAutoFocus}
          {...(description == null && { 'aria-describedby': undefined })}
        >
          <RadixDialog.Title className="rupa-dialog__title">{title}</RadixDialog.Title>
          {description != null && (
            <RadixDialog.Description className="rupa-dialog__description">
              {description}
            </RadixDialog.Description>
          )}
          {children != null && <div className="rupa-dialog__body">{children}</div>}
          {footer != null && <div className="rupa-dialog__footer">{footer}</div>}
          {/* Last in the DOM (drawn top-right) so focus starts on the content, not on Close. */}
          {dismissible && (
            <RadixDialog.Close
              className="rupa-dialog__close rupa-focusable"
              aria-label={closeLabel}
            >
              <XIcon />
            </RadixDialog.Close>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

/** Wrap a footer button so it closes the dialog. */
export const DialogClose = RadixDialog.Close
