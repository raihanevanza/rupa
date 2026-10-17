import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field.js'

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['beta'],
  args: {
    label: 'Notes',
    hint: 'Visible to approvers.',
    children: ({ id, describedBy, invalid }) => (
      <textarea
        id={id}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        rows={3}
        className="rupa-control"
        style={{ padding: '0.5rem 0.75rem', font: 'inherit', resize: 'vertical' }}
      />
    ),
  },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** Wrap any custom control and get the label, hint, error, and ARIA wiring for free. */
export const CustomControl: Story = {}
export const WithError: Story = {
  args: { error: 'Notes are required for rejections.', required: true },
}
