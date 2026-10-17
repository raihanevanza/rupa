import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Button } from './Button.js'

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
)

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['stable'],
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    iconStart: { control: false },
    iconEnd: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { variant: 'primary' } }

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">
        Approve
      </Button>
      <Button {...args} variant="secondary">
        Cancel
      </Button>
      <Button {...args} variant="success">
        Mark as paid
      </Button>
      <Button {...args} variant="danger">
        Reject
      </Button>
      <Button {...args} variant="ghost">
        Skip
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="primary" size="sm">
        Small
      </Button>
      <Button {...args} variant="primary" size="md">
        Medium
      </Button>
      <Button {...args} variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { variant: 'primary', iconStart: <PlusIcon />, children: 'New request' },
}

export const Disabled: Story = { args: { variant: 'primary', disabled: true } }

/** While an action runs, the button stays focusable but ignores clicks: no double submit. */
export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving…' },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Saving…' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Block: Story = { args: { variant: 'primary', block: true } }

export const KeyboardActivation: Story = {
  tags: ['!visual', '!autodocs'],
  args: { variant: 'primary' },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button')
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}
