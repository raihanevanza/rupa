import { act, fireEvent, screen, userEvent } from '@testing-library/react-native'
import { AccessibilityInfo } from 'react-native'
import { renderWithTheme } from '../../test-utils.js'
import { ConfirmDialog } from './ConfirmDialog.js'

jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {})

function deferred() {
  let resolve!: () => void
  let reject!: (e: unknown) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

test('a double tap runs the action once and closes when it resolves', async () => {
  const action = deferred()
  const onConfirm = jest.fn(() => action.promise)
  const onOpenChange = jest.fn()
  await renderWithTheme(
    <ConfirmDialog
      defaultOpen
      onOpenChange={onOpenChange}
      title="Approve refund?"
      tone="success"
      confirmLabel="Approve"
      onConfirm={onConfirm}
    />,
  )
  expect(screen.getByRole('header', { name: 'Approve refund?' })).toBeOnTheScreen()
  const approve = screen.getByRole('button', { name: 'Approve' })
  await userEvent.press(approve)
  await userEvent.press(approve)
  expect(onConfirm).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('button', { name: 'Approve' })).toBeBusy()
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()

  await act(async () => action.resolve())
  expect(onOpenChange).toHaveBeenLastCalledWith(false)
  expect(screen.queryByRole('header', { name: 'Approve refund?' })).toBeNull()
})

test('Android back and the backdrop cannot close it while the action runs', async () => {
  const action = deferred()
  const onOpenChange = jest.fn()
  await renderWithTheme(
    <ConfirmDialog
      testID="dialog"
      open
      onOpenChange={onOpenChange}
      title="Delete?"
      tone="danger"
      onConfirm={() => action.promise}
    />,
  )
  await userEvent.press(screen.getByRole('button', { name: 'Confirm' }))
  await fireEvent(screen.getByTestId('dialog'), 'requestClose')
  expect(onOpenChange).not.toHaveBeenCalled()

  await act(async () => action.resolve())
  expect(onOpenChange).toHaveBeenCalledWith(false)
})

test('a failure keeps the dialog open and shows the error', async () => {
  const onOpenChange = jest.fn()
  await renderWithTheme(
    <ConfirmDialog
      defaultOpen
      onOpenChange={onOpenChange}
      title="Send email?"
      onConfirm={() => Promise.reject(new Error('Mail server is down'))}
    />,
  )
  await userEvent.press(screen.getByRole('button', { name: 'Confirm' }))
  expect(screen.getByText('Mail server is down')).toBeOnTheScreen()
  expect(screen.getByRole('alert')).toBeOnTheScreen()
  expect(onOpenChange).not.toHaveBeenCalled()

  // Cancel works again after the failure, and clears the error.
  await userEvent.press(screen.getByRole('button', { name: 'Cancel' }))
  expect(onOpenChange).toHaveBeenCalledWith(false)
})

test('labels can be replaced for other languages', async () => {
  await renderWithTheme(
    <ConfirmDialog
      defaultOpen
      title="Hapus?"
      cancelLabel="Batal"
      confirmLabel="Hapus"
      errorMessage="Gagal"
      onConfirm={() => Promise.reject({})}
    />,
  )
  await userEvent.press(screen.getByRole('button', { name: 'Hapus' }))
  expect(screen.getByText('Gagal')).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Batal' })).toBeOnTheScreen()
})
