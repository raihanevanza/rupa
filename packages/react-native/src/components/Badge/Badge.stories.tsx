import type { Meta, StoryObj } from '@storybook/react-vite'
import { Row } from '../../stories/Frame.js'
import { Badge } from './Badge.js'

const meta = {
  title: 'React Native/Badge',
  component: Badge,
  tags: ['beta'],
  args: { children: 'Approved', tone: 'success' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tones: Story = {
  render: () => (
    <Row>
      <Badge>Draft</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="info" dot>
        Submitted
      </Badge>
      <Badge tone="success" dot>
        Approved
      </Badge>
      <Badge tone="warning" dot>
        Needs review
      </Badge>
      <Badge tone="danger" dot>
        Rejected
      </Badge>
    </Row>
  ),
}

/** The dot pulses for live states; it stops under Reduce Motion. */
export const Pulse: Story = {
  args: { tone: 'info', pulse: true, children: 'Executing' },
  // The animation would make every screenshot different.
  tags: ['!visual'],
}

export const Small: Story = { args: { size: 'sm' } }
