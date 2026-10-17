import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { StatusFlow } from './StatusFlow.js'

const steps = [
  { key: 'draft', label: 'Draft', description: 'Dina · 14 Oct' },
  { key: 'submitted', label: 'Submitted', description: 'Dina · 14 Oct' },
  { key: 'approved', label: 'Approved' },
  { key: 'paid', label: 'Paid' },
]

const meta = {
  title: 'Components/StatusFlow',
  component: StatusFlow,
  tags: ['stable'],
  args: { steps, current: 'approved', 'aria-label': 'Request progress' },
} satisfies Meta<typeof StatusFlow>

export default meta
type Story = StoryObj<typeof meta>

/** Each state has its own icon and screen reader text, not just a color. */
export const InProgress: Story = {
  play: async ({ canvas }) => {
    const current = canvas.getByRole('listitem', { current: 'step' })
    await expect(current).toHaveTextContent('Approved, Current step')
  },
}
export const Rejected: Story = { args: { outcome: 'rejected' } }
export const Cancelled: Story = { args: { current: 'submitted', outcome: 'cancelled' } }
export const Completed: Story = { args: { current: 'paid', completed: true } }
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const Indonesian: Story = {
  args: {
    steps: [
      { key: 'draft', label: 'Draf' },
      { key: 'submitted', label: 'Diajukan' },
      { key: 'approved', label: 'Disetujui' },
    ],
    current: 'submitted',
    'aria-label': 'Progres pengajuan',
    stateLabels: { complete: 'Selesai', current: 'Tahap saat ini', upcoming: 'Belum dimulai' },
  },
}
