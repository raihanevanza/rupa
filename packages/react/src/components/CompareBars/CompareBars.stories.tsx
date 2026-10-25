import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Card } from '../Card/Card.js'
import { CompareBars } from './CompareBars.js'

const Swatch = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 999, background: color }}
  />
)

const meta = {
  title: 'Components/CompareBars',
  component: CompareBars,
  tags: ['stable'],
  args: {
    names: ['Mini ERP', 'AgentGate'],
    rows: [
      { label: 'Requests', values: [412, 268] },
      { label: 'Approved', values: [380, 241] },
      { label: 'Rejected', values: [12, 19] },
      { label: 'Open', values: [20, 8] },
      { label: 'Approval rate', values: [0.92, 0.9], display: ['92%', '90%'] },
      { label: 'Tied', values: [5, 5] },
    ],
  },
} satisfies Meta<typeof CompareBars>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** In a Card, with the names as a legend in the colors of the two series. */
export const InCard: Story = {
  render: (args) => (
    <Card
      title="This month"
      description={
        <>
          <Swatch color="var(--rupa-color-series-1)" /> {args.names[0]} ·{' '}
          <Swatch color="var(--rupa-color-series-2)" /> {args.names[1]}
        </>
      }
      style={{ maxWidth: 480 }}
    >
      <CompareBars {...args} />
    </Card>
  ),
  play: async ({ canvas }) => {
    // Each value is read with the name it belongs to.
    await expect(canvas.getAllByText('Mini ERP:', { exact: false })[0]).toHaveClass(
      'rupa-visually-hidden',
    )
  },
}
