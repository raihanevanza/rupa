import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Text } from 'react-native'
import { Row } from '../../stories/Frame.js'
import { Button } from './Button.js'

const meta = {
  title: 'React Native/Button',
  component: Button,
  tags: ['beta'],
  args: { children: 'Save changes', onPress: fn() },
  argTypes: { iconStart: { control: false }, iconEnd: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          '`@rupa-ui/react-native`, rendered here with react-native-web. Same variants as the web Button; `md` is 44 pt tall and `sm` reaches 44 pt with `hitSlop`.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { variant: 'primary' },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onPress).toHaveBeenCalledTimes(1)
  },
}

export const Variants: Story = {
  render: (args) => (
    <Row>
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
    </Row>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary" size="sm">
        Small
      </Button>
      <Button {...args} variant="primary" size="md">
        Medium
      </Button>
      <Button {...args} variant="primary" size="lg">
        Large
      </Button>
    </Row>
  ),
}

/** Busy and ignores presses, so the action cannot run twice. */
export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving' },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Saving' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    await expect(args.onPress).not.toHaveBeenCalled()
  },
}

export const Disabled: Story = { args: { disabled: true } }

/** Icons are render props, so they can match the label color (e.g. lucide-react-native). */
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Add',
    iconStart: (color: string) => <Text style={{ color, fontSize: 16, lineHeight: 16 }}>+</Text>,
  },
}
