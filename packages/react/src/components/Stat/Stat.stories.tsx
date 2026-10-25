import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stat } from './Stat.js'

const meta = {
  title: 'Components/Stat',
  component: Stat,
  tags: ['stable'],
  args: { label: 'Open requests', value: 12 },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithIcon: Story = { args: { icon: '⚽', label: 'Goals today', value: 27 } }
export const Small: Story = { args: { size: 'sm', icon: '🏆', label: 'Competitions', value: 9 } }

/** A summary row: a list of stats, one tone each. */
export const Tones: Story = {
  render: () => (
    <ul
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      <li>
        <Stat label="Total points" value={14} tone="accent" />
      </li>
      <li>
        <Stat label="Predictions" value={9} />
      </li>
      <li>
        <Stat label="Exact scores" value={3} tone="success" />
      </li>
      <li>
        <Stat label="Pending" value={2} tone="warning" />
      </li>
      <li>
        <Stat label="Missed" value={4} tone="danger" />
      </li>
      <li>
        <Stat label="Live" value={1} tone="info" />
      </li>
    </ul>
  ),
}
