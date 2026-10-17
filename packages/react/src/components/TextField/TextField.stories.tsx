import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { TextField } from './TextField.js'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['stable'],
  args: { label: 'Full name', placeholder: 'e.g. Dina Pratama' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithHint: Story = {
  args: { label: 'Email', type: 'email', hint: 'We send approval notifications here.' },
}

export const Required: Story = { args: { required: true } }

/** The error is linked with aria-describedby and the input is marked aria-invalid. */
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    defaultValue: 'dina@',
    error: 'Enter a valid email address.',
    hint: 'Work email only.',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Email')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Enter a valid email address. Work email only.')
  },
}

export const PrefixAndSuffix: Story = {
  args: { label: 'Amount', prefix: 'Rp', suffix: '.00', inputMode: 'numeric', placeholder: '0' },
}

export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read only value' } }

export const Typing: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Full name')
    await userEvent.click(input)
    await userEvent.type(input, 'Budi')
    await expect(input).toHaveValue('Budi')
  },
}
