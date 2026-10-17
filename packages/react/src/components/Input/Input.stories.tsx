import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { Field } from '../Field/Field.js'
import { Input, NativeSelect, Textarea } from './Input.js'

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['beta'],
  args: { placeholder: 'e.g. refund-bot' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** Bare controls carry no label: the app supplies one. Here a wrapping <label> names it. */
export const WrappedInLabel: Story = {
  render: (args) => (
    <label style={{ display: 'grid', gap: 6, fontSize: 14, fontWeight: 500 }}>
      Agent name
      <Input {...args} />
    </label>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Agent name')
    await userEvent.type(input, 'refund-bot')
    await expect(input).toHaveValue('refund-bot')
  },
}

export const Invalid: Story = {
  render: (args) => (
    <label style={{ display: 'grid', gap: 6, fontSize: 14, fontWeight: 500 }}>
      Email
      <Input {...args} type="email" defaultValue="dina@" aria-invalid="true" />
    </label>
  ),
}

export const Disabled: Story = {
  render: (args) => <Input {...args} aria-label="Agent ID" disabled defaultValue="agt_7f3a9c" />,
}

export const TextareaControl: Story = {
  name: 'Textarea',
  render: () => (
    <label style={{ display: 'grid', gap: 6, fontSize: 14, fontWeight: 500 }}>
      Reason
      <Textarea placeholder="Why is this rejected?" />
    </label>
  ),
}

export const NativeSelectControl: Story = {
  name: 'NativeSelect',
  render: () => (
    <label style={{ display: 'grid', gap: 6, fontSize: 14, fontWeight: 500 }}>
      Risk
      <NativeSelect defaultValue="medium">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </NativeSelect>
    </label>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByLabelText('Risk')
    await userEvent.selectOptions(select, 'high')
    await expect(select).toHaveValue('high')
  },
}

/** With Field: label, hint, and error wired through aria-describedby. */
export const WithField: Story = {
  render: () => (
    <Field
      label="Daily limit"
      hint="Calls per day before approval is required."
      error="Must be a whole number."
    >
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          defaultValue="12.5"
          inputMode="numeric"
        />
      )}
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Daily limit')).toHaveAccessibleDescription(
      'Must be a whole number. Calls per day before approval is required.',
    )
  },
}
