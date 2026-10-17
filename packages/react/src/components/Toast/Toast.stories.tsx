import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { ToastProvider, useToast } from './Toast.js'

function Demo() {
  const toast = useToast()
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          toast.show({
            tone: 'success',
            title: 'Request approved',
            description: 'PR-2026-0142 moved to Paid.',
          })
        }
      >
        Success
      </Button>
      <Button onClick={() => toast.show({ tone: 'info', title: 'Draft saved' })}>Info</Button>
      <Button
        onClick={() =>
          toast.show({
            tone: 'danger',
            title: 'Could not submit',
            description: 'The server did not respond.',
            duration: Infinity,
          })
        }
      >
        Error
      </Button>
    </div>
  )
}

function Stack() {
  const toast = useToast()
  useEffect(() => {
    toast.show({
      tone: 'success',
      title: 'Request approved',
      description: 'PR-2026-0142 moved to Paid.',
      duration: Infinity,
    })
    toast.show({
      tone: 'warning',
      title: 'Budget almost used',
      duration: Infinity,
      action: <Button size="sm">View budget</Button>,
    })
    toast.show({
      tone: 'danger',
      title: 'Could not submit',
      description: 'The server did not respond.',
      duration: Infinity,
    })
  }, [toast])
  return null
}

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['stable'],
  args: { children: <Demo /> },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tones: Story = { tags: ['visual-page', '!autodocs'], args: { children: <Stack /> } }

/** Announced via live regions without taking focus; the dismiss button is reachable. */
export const Announce: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Error' }))
    const region = screen.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(region).toHaveTextContent('Could not submit'))
    await expect(region.querySelector('[aria-live="assertive"]')).toHaveTextContent(
      'Could not submit',
    )
    await expect(canvas.getByRole('button', { name: 'Error' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    await waitFor(() => expect(region).not.toHaveTextContent('Could not submit'))
  },
}
