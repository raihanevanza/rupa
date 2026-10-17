import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { Alert } from './Alert.js'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['stable'],
  args: {
    tone: 'info',
    title: 'Approval rules changed',
    children: 'Requests above Rp 50.000.000 now need a second approver.',
  },
  argTypes: { action: { control: false } },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Each tone has its own icon shape, so status is not conveyed by color alone. */
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert tone="info" title="Heads up">
        Payroll closes on the 25th.
      </Alert>
      <Alert tone="success" title="Request approved">
        PR-2026-0142 moved to Paid.
      </Alert>
      <Alert tone="warning" title="Budget almost used">
        Operations has 8% of its Q4 budget left.
      </Alert>
      <Alert tone="danger" title="Could not submit">
        The server did not respond. Your draft is saved.
      </Alert>
    </div>
  ),
}

export const WithActionAndDismiss: Story = {
  args: {
    tone: 'danger',
    title: 'Could not load requests',
    children: 'Check your connection and try again.',
    action: <Button size="sm">Retry</Button>,
    onDismiss: fn(),
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }))
    await expect(args.onDismiss).toHaveBeenCalledOnce()
  },
}
