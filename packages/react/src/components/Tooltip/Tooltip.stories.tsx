import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { Tooltip } from './Tooltip.js'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['stable'],
  args: {
    content: 'Approvals are due within 2 working days',
    children: <Button>Hover or focus me</Button>,
  },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ padding: '48px 0 0 24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Open: Story = { tags: ['visual-page', '!autodocs'], args: { defaultOpen: true } }

/** Keyboard focus shows it; Esc hides it without moving focus. */
export const Keyboard: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('button')).toHaveFocus()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Approvals are due'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
    await expect(canvas.getByRole('button')).toHaveFocus()
  },
}
