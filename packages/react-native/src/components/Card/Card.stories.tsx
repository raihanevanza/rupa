import type { Meta, StoryObj } from '@storybook/react-vite'
import { Body, Stack } from '../../stories/Frame.js'
import { Badge } from '../Badge/Badge.js'
import { Button } from '../Button/Button.js'
import { InfoList } from '../InfoList/InfoList.js'
import { Card } from './Card.js'

const meta = {
  title: 'React Native/Card',
  component: Card,
  tags: ['beta'],
  args: { title: 'Refund #1042', description: 'payments.refund' },
  decorators: [(Story) => <Stack>{Story()}</Stack>],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    actions: <Badge tone="warning">High risk</Badge>,
    children: (
      <InfoList
        columns={2}
        items={[
          { label: 'Amount', value: 'Rp 1.250.000' },
          { label: 'Agent', value: 'support-bot' },
        ]}
      />
    ),
  },
}

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm" variant="ghost">
        Edit
      </Button>
    ),
    children: <Body>Content goes here.</Body>,
  },
}

export const Paddings: Story = {
  render: () => (
    <Stack>
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} title={`padding="${padding}"`} padding={padding} />
      ))}
    </Stack>
  ),
}
