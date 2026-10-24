import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Countdown } from './Countdown.js'

// A fixed "now" keeps the screenshots stable; the live clock is in the Live story.
const NOW = Date.UTC(2026, 9, 25, 12, 0, 0)
const IN = (ms: number) => NOW + ms

const meta = {
  title: 'Components/Countdown',
  component: Countdown,
  tags: ['stable'],
  args: {
    label: 'Time until kick-off',
    to: IN(2 * 86_400_000 + 3 * 3_600_000 + 15 * 60_000 + 9_000),
    now: NOW,
  },
} satisfies Meta<typeof Countdown>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
/** Days are left out when there are none. */
export const UnderADay: Story = { args: { to: IN(3 * 3_600_000 + 5 * 60_000) } }
export const Small: Story = { args: { size: 'sm' } }
export const Done: Story = { args: { to: IN(-1000), done: 'Kick-off!' } }
export const Translated: Story = {
  args: {
    label: 'Waktu menuju kick-off',
    labels: { days: 'hari', hours: 'jam', minutes: 'mnt', seconds: 'dtk' },
  },
}

/** Without `now`, it ticks every second. */
export const Live: Story = {
  tags: ['!visual'],
  args: { now: undefined, to: Date.now() + 90 * 60_000 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('timer', { name: 'Time until kick-off' })).toBeVisible()
  },
}
