import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { Field } from '../Field/Field.js'
import { Textarea } from '../Input/Input.js'
import { ConfirmDialog } from './ConfirmDialog.js'

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['stable'],
  args: {
    title: 'Reject this request?',
    description: 'Dina will be notified. A rejected request cannot be reopened.',
    tone: 'danger',
    confirmLabel: 'Reject',
    trigger: <Button variant="danger">Reject</Button>,
    onConfirm: fn(() => wait(400)),
  },
  argTypes: { trigger: { control: false } },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Open: Story = { tags: ['visual-page', '!autodocs'], args: { defaultOpen: true } }

export const Approve: Story = {
  tags: ['visual-page', '!autodocs'],
  args: {
    defaultOpen: true,
    tone: 'primary',
    title: 'Approve PR-2026-0142?',
    description: 'Rp 12.450.000 will be sent to finance for payment.',
    confirmLabel: 'Approve',
  },
}

/** Double clicking Confirm runs the action once; the dialog cannot close while it runs. */
export const NoDoubleSubmit: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reject' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Reject this request?' })
    // Destructive: focus starts on Cancel.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus())
    const confirm = screen.getAllByRole('button', { name: 'Reject' }).at(-1)!
    await userEvent.dblClick(confirm)
    await expect(confirm).toHaveAttribute('aria-busy', 'true')
    await userEvent.keyboard('{Escape}')
    await expect(dialog).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
  },
}

/** A failed action keeps the dialog open and shows why. */
export const Failure: Story = {
  tags: ['!visual', '!autodocs'],
  args: {
    defaultOpen: true,
    onConfirm: fn(async () => {
      throw new Error('This request was already approved by someone else (409).')
    }),
  },
  play: async () => {
    const confirm = screen.getAllByRole('button', { name: 'Reject' }).at(-1)!
    await userEvent.click(confirm)
    await expect(await screen.findByRole('alert')).toHaveTextContent('already approved')
    await expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  },
}

/** `confirmDisabled` holds Reject until the required note is long enough. */
export const RequiredNote: Story = {
  tags: ['!visual', '!autodocs'],
  render: function Render(args) {
    const [note, setNote] = useState('')
    return (
      <ConfirmDialog {...args} confirmDisabled={note.trim().length < 3}>
        <Field label="Note" required hint="At least 3 characters.">
          {({ id, describedBy }) => (
            <Textarea
              id={id}
              aria-describedby={describedBy}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
        </Field>
      </ConfirmDialog>
    )
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reject' }))
    const confirm = (await screen.findAllByRole('button', { name: 'Reject' })).at(-1)!
    await expect(confirm).toBeDisabled()
    await userEvent.type(screen.getByRole('textbox', { name: /Note/ }), 'Duplicate')
    await expect(confirm).toBeEnabled()
    await userEvent.click(confirm)
    await waitFor(() => expect(args.onConfirm).toHaveBeenCalledTimes(1))
  },
}
