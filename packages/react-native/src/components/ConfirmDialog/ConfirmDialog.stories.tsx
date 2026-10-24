import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { TextField } from '../TextField/TextField.js'
import { ConfirmDialog } from './ConfirmDialog.js'

const meta = {
  title: 'React Native/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['beta'],
  args: {
    title: 'Approve this refund?',
    description: 'Rp 1.250.000 goes back to Dewi Lestari. This cannot be undone.',
    tone: 'success',
    confirmLabel: 'Approve',
    onConfirm: fn(),
  },
  parameters: { layout: 'fullscreen' },
  render: function Render(args) {
    const [open, setOpen] = useState(args.defaultOpen ?? false)
    return (
      <div style={{ padding: 24, minHeight: 420 }}>
        <Button variant="primary" onPress={() => setOpen(true)}>
          Open dialog
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </div>
    )
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = { args: { defaultOpen: true } }

export const Danger: Story = {
  args: {
    defaultOpen: true,
    tone: 'danger',
    title: 'Reject this refund?',
    description: 'The agent is told the request was refused.',
    confirmLabel: 'Reject',
  },
}

/** A double click runs the action once; the buttons lock until the promise settles. */
export const DoubleTapLock: Story = {
  args: {
    onConfirm: fn(() => new Promise<void>((resolve) => setTimeout(resolve, 300))),
  },
  tags: ['!visual'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))
    // The dialog renders in a portal outside the story root, so query the whole page.
    const dialog = screen
    const approve = await dialog.findByRole('button', { name: 'Approve' })
    await userEvent.click(approve)
    await userEvent.click(approve)
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(dialog.queryByRole('button', { name: 'Approve' })).toBeNull())
  },
}

/**
 * A required note: `confirmDisabled` holds Reject until it is long enough. On a phone the
 * dialog moves above the keyboard, and Reject works on the first tap while it is up.
 */
export const RequiredNote: Story = {
  args: { tone: 'danger', title: 'Reject this refund?', confirmLabel: 'Reject' },
  tags: ['!visual'],
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState('')
    return (
      <div style={{ padding: 24, minHeight: 420 }}>
        <Button variant="primary" onPress={() => setOpen(true)}>
          Open dialog
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          confirmDisabled={note.trim().length < 3}
        >
          <TextField
            label="Note"
            required
            hint="At least 3 characters."
            multiline
            value={note}
            onChangeText={setNote}
          />
        </ConfirmDialog>
      </div>
    )
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))
    const reject = await screen.findByRole('button', { name: 'Reject' })
    await expect(reject).toHaveAttribute('aria-disabled', 'true')
    await userEvent.type(screen.getByLabelText('Note, required'), 'Duplicate')
    await expect(reject).not.toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(reject)
    await waitFor(() => expect(args.onConfirm).toHaveBeenCalledTimes(1))
  },
}
