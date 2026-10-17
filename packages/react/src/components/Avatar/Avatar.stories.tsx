import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar.js'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['stable'],
  args: { name: 'Dina Pratama' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Initials: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar name="Budi" size="lg" />
    </div>
  ),
}

/** A broken image falls back to initials instead of a broken icon. */
export const BrokenImage: Story = { args: { src: '/does-not-exist.png' } }
