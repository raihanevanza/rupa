import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { TextField } from '../TextField/TextField.js'
import { Dialog, DialogClose } from './Dialog.js'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['stable'],
  args: {
    title: 'Edit request',
    description: 'Changes are saved to the draft and can be submitted later.',
    trigger: <Button>Edit request</Button>,
    children: (
      <div style={{ display: 'grid', gap: 12 }}>
        <TextField label="Title" defaultValue="Laptop replacement" />
        <TextField label="Amount" prefix="Rp" defaultValue="12.450.000" />
      </div>
    ),
    footer: (
      <>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
        <Button variant="primary">Save draft</Button>
      </>
    ),
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Open: Story = { tags: ['visual-page', '!autodocs'], args: { defaultOpen: true } }

export const Large: Story = {
  tags: ['visual-page', '!autodocs'],
  args: { defaultOpen: true, size: 'lg' },
}

/** Focus moves in, stays in (Tab wraps), Esc closes, and focus returns to the trigger. */
export const FocusManagement: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Edit request' })
    await userEvent.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Edit request' })
    await expect(dialog).toHaveAccessibleDescription(
      'Changes are saved to the draft and can be submitted later.',
    )
    await waitFor(() => expect(screen.getByLabelText('Title')).toHaveFocus())
    // Title → Amount → Cancel → Save draft → Close (x) → wraps to Title
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await expect(screen.getByLabelText('Title')).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}

/** Opened from app state (no `trigger`): focus still returns to the button that opened it. */
export const ControlledFocusReturn: Story = {
  tags: ['!visual', '!autodocs'],
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open from state</Button>
        {open && <Dialog {...args} trigger={undefined} open onOpenChange={setOpen} />}
      </>
    )
  },
  play: async ({ canvas }) => {
    const opener = canvas.getByRole('button', { name: 'Open from state' })
    await userEvent.click(opener)
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  },
}
