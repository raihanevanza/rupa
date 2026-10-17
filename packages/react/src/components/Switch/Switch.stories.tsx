import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Switch } from './Switch.js'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['stable'],
  args: { label: 'Dark mode', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {}
export const On: Story = { args: { defaultChecked: true } }
export const WithDescription: Story = {
  args: {
    label: 'Push notifications',
    description: 'Get a notification on your phone when a request needs you.',
    defaultChecked: true,
  },
}
export const SettingsRow: Story = {
  args: { label: 'Show demo accounts on login', labelPosition: 'start' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
}
export const Disabled: Story = { args: { disabled: true } }

export const Keyboard: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Dark mode' })
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await expect(args.onCheckedChange).toHaveBeenNthCalledWith(1, true)
    // Clicking the label toggles it too.
    await userEvent.click(canvas.getByText('Dark mode'))
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
  },
}
