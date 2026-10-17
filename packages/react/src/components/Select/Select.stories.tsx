import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { Select } from './Select.js'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['stable'],
  args: {
    label: 'Branch',
    placeholder: 'Choose a branch',
    options: [
      { value: 'bogor', label: 'Bogor' },
      { value: 'jakarta', label: 'Jakarta' },
      { value: 'bandung', label: 'Bandung' },
      { value: 'surabaya', label: 'Surabaya (closed)', disabled: true },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithHint: Story = { args: { hint: 'Requests are routed to the branch manager.' } }
export const WithError: Story = { args: { required: true, error: 'Choose a branch.' } }
export const Disabled: Story = { args: { disabled: true } }

export const Choosing: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    const select = canvas.getByLabelText('Branch')
    await userEvent.selectOptions(select, 'jakarta')
    await expect(select).toHaveValue('jakarta')
  },
}
