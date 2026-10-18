import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Segmented } from './Segmented.js'

const meta = {
  title: 'React Native/Segmented',
  component: Segmented,
  tags: ['beta'],
  args: {
    label: 'Status filter',
    defaultValue: 'all',
    onChange: fn(),
    options: [
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending' },
      { value: 'done', label: 'Done' },
    ],
  },
} satisfies Meta<typeof Segmented>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Pending' }))
    await expect(args.onChange).toHaveBeenCalledWith('pending')
    await expect(canvas.getByRole('radio', { name: 'Pending' })).toBeChecked()
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const Block: Story = {
  args: { block: true },
  decorators: [(Story) => <div style={{ maxWidth: 390 }}>{Story()}</div>],
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending' },
      { value: 'done', label: 'Done', disabled: true },
    ],
  },
}
