import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoList } from './InfoList.js'

const items = [
  { label: 'Amount', value: 'Rp 1.250.000' },
  { label: 'Agent', value: 'support-bot' },
  { label: 'Customer', value: 'Dewi Lestari' },
  { label: 'Policy', value: '' },
  { label: 'Reason', value: 'Package arrived crushed; photos attached.', wide: true },
]

const meta = {
  title: 'React Native/InfoList',
  component: InfoList,
  tags: ['beta'],
  args: { items },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof InfoList>

export default meta
type Story = StoryObj<typeof meta>

/** One column suits phones. Empty values show a dash. */
export const OneColumn: Story = {}

/** Two columns for short values; `wide` items take a row. */
export const TwoColumns: Story = { args: { columns: 2 } }
