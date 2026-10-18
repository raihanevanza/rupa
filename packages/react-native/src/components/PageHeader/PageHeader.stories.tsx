import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge/Badge.js'
import { Button } from '../Button/Button.js'
import { PageHeader } from './PageHeader.js'

const meta = {
  title: 'React Native/PageHeader',
  component: PageHeader,
  tags: ['beta'],
  args: {
    title: 'Refund #1042',
    description: 'Support agent asks to refund an order that arrived damaged.',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithMetaAndActions: Story = {
  args: {
    meta: (
      <Badge tone="warning" dot>
        Waiting
      </Badge>
    ),
    actions: (
      <>
        <Button size="sm">Share</Button>
        <Button size="sm" variant="primary">
          Approve
        </Button>
      </>
    ),
  },
}
