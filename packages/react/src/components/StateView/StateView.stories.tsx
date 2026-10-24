import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { StateView } from './StateView.js'

const meta = {
  title: 'Components/StateView',
  component: StateView,
  tags: ['stable'],
  args: { state: 'empty' },
  argTypes: { action: { control: false }, icon: { control: false } },
} satisfies Meta<typeof StateView>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { state: 'loading', title: 'Loading requests…' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading requests…')
  },
}

export const Empty: Story = {
  args: {
    title: 'No requests yet',
    description: 'Requests you create or need to review will show up here.',
    action: <Button variant="primary">New request</Button>,
  },
}

export const ErrorWithRetry: Story = {
  name: 'Error with retry',
  args: { state: 'error', onRetry: fn() },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

/** `description={null}` removes the default English sentence (for translated apps). */
export const TitleOnly: Story = {
  args: { title: 'Belum ada data', description: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Belum ada data')).toBeInTheDocument()
    await expect(canvas.queryByText('Items you add will show up here.')).not.toBeInTheDocument()
  },
}

export const Indonesian: Story = {
  args: {
    state: 'error',
    title: 'Terjadi kesalahan',
    description: 'Periksa koneksi Anda lalu coba lagi.',
    retryLabel: 'Coba lagi',
    onRetry: fn(),
  },
}

/** A larger picture instead of the icon circle, e.g. an app's mascot or an animation. */
export const WithIllustration: Story = {
  args: {
    state: 'empty',
    illustration: <span style={{ fontSize: 56, lineHeight: 1 }}>🏟️</span>,
    title: 'No matches today',
    description: 'Check the schedule for the next match day.',
  },
}
