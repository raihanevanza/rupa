import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { NumberStepper } from './NumberStepper.js'

const meta = {
  title: 'Components/NumberStepper',
  component: NumberStepper,
  tags: ['stable'],
  args: { label: 'Guests', defaultValue: 2, min: 0, max: 10, onChange: fn() },
} satisfies Meta<typeof NumberStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Large: Story = { args: { size: 'lg' } }
export const AtMinimum: Story = { args: { defaultValue: 0 } }
export const Disabled: Story = { args: { disabled: true } }

/** A score prediction: two steppers side by side. */
export const Score: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <NumberStepper {...args} label="Goals for Home" defaultValue={1} max={20} size="lg" />
      <span aria-hidden="true" style={{ fontSize: 28, fontWeight: 700 }}>
        :
      </span>
      <NumberStepper {...args} label="Goals for Away" defaultValue={1} max={20} size="lg" />
    </div>
  ),
}

/** One Tab stop; Up/Down change the value, Home/End jump to the limits. */
export const Keyboard: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ args, canvas }) => {
    const spin = canvas.getByRole('spinbutton', { name: 'Guests' })
    await userEvent.tab()
    await expect(spin).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(spin).toHaveAttribute('aria-valuenow', '3')
    await expect(args.onChange).toHaveBeenLastCalledWith(3)
    await userEvent.keyboard('{End}')
    await expect(spin).toHaveAttribute('aria-valuenow', '10')
    await expect(canvas.getByRole('button', { name: 'Increase' })).toBeDisabled()
    await userEvent.keyboard('{Home}')
    await expect(spin).toHaveAttribute('aria-valuenow', '0')
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await expect(spin).toHaveAttribute('aria-valuenow', '1')
  },
}
