import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusFlow } from './StatusFlow.js'

const steps = [
  { key: 'request', label: 'Requested', description: 'support-bot · 09:12' },
  { key: 'review', label: 'Human review', description: 'Approver on duty' },
  { key: 'done', label: 'Executed' },
]

const meta = {
  title: 'React Native/StatusFlow',
  component: StatusFlow,
  tags: ['beta'],
  args: { steps, current: 'review' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof StatusFlow>

export default meta
type Story = StoryObj<typeof meta>

/** Vertical is the default on phones. Each state has a mark, not only a color. */
export const Vertical: Story = {}

export const Horizontal: Story = { args: { orientation: 'horizontal' } }

export const Rejected: Story = { args: { outcome: 'rejected' } }

export const Completed: Story = { args: { current: 'done', completed: true } }
