import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge/Badge.js'
import { Button } from '../Button/Button.js'
import { PageHeader } from './PageHeader.js'

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['stable'],
  args: {
    title: 'Purchase requests',
    description: 'Requests from every branch that are waiting for review or have been decided.',
  },
  argTypes: { actions: { control: false }, meta: { control: false } },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Full: Story = {
  args: {
    title: 'PR-2026-0142',
    description: 'Laptop replacement for the Bogor branch office.',
    breadcrumb: [
      { label: 'Home', href: '#' },
      { label: 'Purchase requests', href: '#' },
      { label: 'PR-2026-0142' },
    ],
    meta: (
      <Badge tone="info" dot>
        Submitted
      </Badge>
    ),
    actions: (
      <>
        <Button variant="danger">Reject</Button>
        <Button variant="primary">Approve</Button>
      </>
    ),
  },
}

/** An icon or emoji in a tile before the title. */
export const WithIcon: Story = {
  args: {
    icon: '📅',
    title: 'Schedule',
    description: 'Every match this week, by competition.',
    actions: <Button>Today</Button>,
  },
}
