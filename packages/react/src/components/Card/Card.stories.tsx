import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge/Badge.js'
import { Button } from '../Button/Button.js'
import { InfoList } from '../InfoList/InfoList.js'
import { Card } from './Card.js'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['stable'],
  args: {
    title: 'Purchase request',
    description: 'PR-2026-0142 · created 14 Oct 2026',
    children: (
      <InfoList
        items={[
          { label: 'Requester', value: 'Dina Pratama' },
          { label: 'Amount', value: 'Rp 12.450.000' },
          { label: 'Branch', value: 'Bogor' },
          { label: 'Status', value: <Badge tone="info">Submitted</Badge> },
        ]}
      />
    ),
  },
  argTypes: { children: { control: false }, actions: { control: false } },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button size="sm">Edit</Button>
        <Button size="sm" variant="primary">
          Submit
        </Button>
      </>
    ),
  },
}

export const ContentOnly: Story = {
  args: {
    title: undefined,
    description: undefined,
    children: <p style={{ margin: 0 }}>A plain container for any content.</p>,
  },
}

export const Paddings: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((p) => (
        <Card key={p} {...args} padding={p} title={`padding="${p}"`} description={undefined}>
          <p style={{ margin: 0 }}>Content</p>
        </Card>
      ))}
    </div>
  ),
}
