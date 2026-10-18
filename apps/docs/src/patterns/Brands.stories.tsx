import {
  Alert,
  Badge,
  Button,
  Card,
  Segmented,
  StatusFlow,
  Switch,
  TextField,
} from '@rupa-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Patterns/Brands and modes',
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Sample({ brand, mode }: { brand: string; mode: string }) {
  return (
    // Any element can start a new theme scope; everything inside follows it.
    <div
      data-brand={brand}
      data-theme={mode}
      style={{
        background: 'var(--rupa-color-canvas)',
        color: 'var(--rupa-color-ink)',
        padding: 20,
      }}
    >
      <Card
        title={`${brand} · ${mode}`}
        description="Same components, different tokens."
        headingLevel={2}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="primary">Approve</Button>
          <Button>Cancel</Button>
          <Button variant="danger">Reject</Button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
        </div>
        <StatusFlow
          aria-label={`Progress (${brand} ${mode})`}
          steps={[
            { key: 'draft', label: 'Draft' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'approved', label: 'Approved' },
          ]}
          current="submitted"
        />
        <TextField
          label="Amount"
          prefix="Rp"
          defaultValue="12.450.000"
          id={`amount-${brand}-${mode}`}
        />
        <Segmented
          label={`Filter (${brand} ${mode})`}
          defaultValue="pending"
          options={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'done', label: 'Done' },
          ]}
        />
        <Switch label="Notify me" defaultChecked id={`notify-${brand}-${mode}`} />
        <Alert tone="warning" title="Budget almost used">
          8% of the Q4 budget left.
        </Alert>
      </Card>
    </div>
  )
}

/**
 * Brand and mode are just attributes. They can be nested: each panel below sets its own
 * `data-brand` and `data-theme`, independent of the page and the toolbar.
 */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
      <Sample brand="violet" mode="light" />
      <Sample brand="violet" mode="dark" />
      <Sample brand="signal" mode="light" />
      <Sample brand="signal" mode="dark" />
      <Sample brand="latte" mode="light" />
      <Sample brand="latte" mode="dark" />
    </div>
  ),
}
