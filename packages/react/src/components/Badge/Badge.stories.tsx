import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, type BadgeTone } from './Badge.js'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['stable'],
  args: { children: 'Approved', tone: 'success' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const tones: [BadgeTone, string][] = [
  ['neutral', 'Draft'],
  ['accent', 'New'],
  ['info', 'Submitted'],
  ['success', 'Approved'],
  ['warning', 'Needs review'],
  ['danger', 'Rejected'],
]

/** The label carries the meaning; tone and dot only reinforce it. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tones.map(([tone, label]) => (
        <Badge key={tone} {...args} tone={tone}>
          {label}
        </Badge>
      ))}
    </div>
  ),
}

export const WithDot: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tones.map(([tone, label]) => (
        <Badge key={tone} {...args} tone={tone} dot>
          {label}
        </Badge>
      ))}
    </div>
  ),
}

export const Small: Story = { args: { size: 'sm', dot: true } }

/** A live state; the animation stops with prefers-reduced-motion. */
export const Pulse: Story = { args: { tone: 'info', pulse: true, children: 'Executing' } }
