import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton.js'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['stable'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = { args: { lines: 3 } }

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 360 }}>
      <Skeleton shape="circle" />
      <div style={{ flex: 1 }}>
        <Skeleton lines={2} />
      </div>
    </div>
  ),
}

export const Block: Story = { args: { shape: 'rect' } }
