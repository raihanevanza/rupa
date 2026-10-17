import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { Badge } from '../Badge/Badge.js'
import { Tabs } from './Tabs.js'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['stable'],
  args: {
    label: 'Request details',
    items: [
      {
        value: 'summary',
        label: 'Summary',
        content: <p style={{ margin: 0 }}>Two laptops for the Bogor branch.</p>,
      },
      {
        value: 'items',
        label: 'Items',
        badge: <Badge size="sm">2</Badge>,
        content: <p style={{ margin: 0 }}>ThinkPad T14 × 2</p>,
      },
      {
        value: 'history',
        label: 'History',
        content: <p style={{ margin: 0 }}>Submitted by Dina on 14 Oct.</p>,
      },
      { value: 'files', label: 'Files', disabled: true, content: null },
    ],
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AutomaticActivation: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: 'Summary' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: /Items/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('ThinkPad T14 × 2')
    // Disabled tabs are skipped; the list wraps around.
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Summary' })).toHaveFocus()
    // Tab moves into the panel, not to the next tab.
    await userEvent.tab()
    await expect(canvas.getByRole('tabpanel')).toHaveFocus()
  },
}

export const ManualActivation: Story = {
  tags: ['!visual', '!autodocs'],
  args: { activation: 'manual' },
  play: async ({ canvas }) => {
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    const items = canvas.getByRole('tab', { name: /Items/ })
    await expect(items).toHaveFocus()
    await expect(items).toHaveAttribute('aria-selected', 'false')
    await userEvent.keyboard('{Enter}')
    await expect(items).toHaveAttribute('aria-selected', 'true')
  },
}
