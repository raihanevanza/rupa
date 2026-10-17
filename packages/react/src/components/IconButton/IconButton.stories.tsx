import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { IconButton } from './IconButton.js'

const Pencil = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
  </svg>
)
const Trash = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['stable'],
  args: { icon: <Pencil />, label: 'Edit request' },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/** `label` is required by the types and becomes the accessible name and the tooltip. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Edit request' })).toBeInTheDocument()
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton {...args} />
      <IconButton {...args} variant="secondary" />
      <IconButton {...args} variant="primary" />
      <IconButton {...args} variant="danger" icon={<Trash />} label="Delete request" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <IconButton {...args} variant="secondary" size="sm" />
      <IconButton {...args} variant="secondary" size="md" />
      <IconButton {...args} variant="secondary" size="lg" />
    </div>
  ),
}
