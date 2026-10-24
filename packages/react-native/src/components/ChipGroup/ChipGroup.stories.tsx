import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { ChipGroup } from './ChipGroup.js'

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending approval' },
  { value: 'executing', label: 'Executing' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
  { value: 'denied', label: 'Denied' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
]

const meta = {
  title: 'React Native/ChipGroup',
  component: ChipGroup,
  tags: ['beta'],
  args: {
    label: 'Status filter',
    options: statuses,
    defaultValue: 'all',
    onChange: fn(),
  },
  // A phone-wide frame, so the row scrolls sideways.
  decorators: [(Story) => <div style={{ maxWidth: 390 }}>{Story()}</div>],
} satisfies Meta<typeof ChipGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Executing' }))
    await expect(args.onChange).toHaveBeenCalledWith('executing')
    await expect(canvas.getByRole('radio', { name: 'Executing' })).toBeChecked()
  },
}

/** `inset` lines the first chip up with the screen padding while chips scroll to the edge. */
export const WithInset: Story = { args: { inset: 16, defaultValue: 'pending' } }

export const Wrap: Story = { args: { wrap: true, defaultValue: 'failed' } }

export const WithDisabledOption: Story = {
  args: {
    wrap: true,
    options: [
      { value: 'all', label: 'All' },
      { value: 'open', label: 'Open' },
      { value: 'archived', label: 'Archived', disabled: true },
    ],
  },
}
