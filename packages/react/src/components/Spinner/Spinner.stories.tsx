import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner.js'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['stable'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--rupa-color-accent)' }}
    >
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
}
