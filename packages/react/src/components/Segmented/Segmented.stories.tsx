import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Segmented } from './Segmented.js'

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  tags: ['stable'],
  args: {
    label: 'Status filter',
    defaultValue: 'all',
    onChange: fn(),
    options: [
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
} satisfies Meta<typeof Segmented>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Block: Story = { args: { block: true } }
export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending', disabled: true },
      { value: 'approved', label: 'Approved' },
    ],
  },
}

/** One Tab stop for the group; arrows move and select, skipping disabled options. */
export const Keyboard: Story = {
  tags: ['!visual', '!autodocs'],
  args: WithDisabledOption.args,
  play: async ({ args, canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    const approved = canvas.getByRole('radio', { name: 'Approved' })
    await expect(approved).toHaveFocus()
    await expect(approved).toHaveAttribute('aria-checked', 'true')
    await expect(args.onChange).toHaveBeenLastCalledWith('approved')
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(approved).toHaveFocus()
    await userEvent.tab()
    await expect(document.body).toHaveFocus()
  },
}
