import { useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useControllable } from '../../lib/useControllable.js'
import { Alert } from '../Alert/Alert.js'
import { Button } from '../Button/Button.js'
import { Dialog } from '../Dialog/Dialog.js'

export interface ConfirmDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactElement
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** `danger` for actions that cannot be undone. */
  tone?: 'primary' | 'danger' | 'success'
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  /**
   * Keeps the confirm button disabled, e.g. until a required note in `children` is valid.
   * Say why next to the field (hint or error), not only through the disabled button.
   */
  confirmDisabled?: boolean
  /**
   * Runs the action. While the promise is pending the buttons are locked and the dialog
   * cannot be dismissed, so a double tap cannot submit twice. Resolve to close; throw to
   * keep the dialog open and show the error.
   */
  onConfirm: () => void | Promise<void>
  /** Shown when onConfirm throws something without a message. */
  errorMessage?: ReactNode
  errorTitle?: ReactNode
}

export function ConfirmDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  tone = 'primary',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmDisabled,
  onConfirm,
  errorMessage = 'The action could not be completed. Please try again.',
  errorTitle = 'Something went wrong',
}: ConfirmDialogProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<ReactNode>(null)
  // A ref, not state: two clicks in the same frame both see the state before re-render.
  const running = useRef(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const changeOpen = (next: boolean) => {
    if (running.current) return
    if (!next) setError(null)
    setOpen(next)
  }

  const confirm = async () => {
    if (running.current) return
    running.current = true
    setPending(true)
    setError(null)
    try {
      await onConfirm()
      running.current = false
      setPending(false)
      setOpen(false)
    } catch (e) {
      running.current = false
      setPending(false)
      setError(e instanceof Error && e.message ? e.message : errorMessage)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={changeOpen}
      trigger={trigger}
      title={title}
      description={description}
      size="sm"
      role="alertdialog"
      dismissible={!pending}
      // Destructive dialogs start on Cancel, so a stray Enter does not confirm.
      onOpenAutoFocus={
        tone === 'danger'
          ? (e) => {
              e.preventDefault()
              cancelRef.current?.focus()
            }
          : undefined
      }
      footer={
        <>
          <Button ref={cancelRef} onClick={() => changeOpen(false)} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant={tone} loading={pending} disabled={confirmDisabled} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {error != null && (
        <Alert tone="danger" title={errorTitle} live className="rupa-confirm-dialog__error">
          {error}
        </Alert>
      )}
    </Dialog>
  )
}
