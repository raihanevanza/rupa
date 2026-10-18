import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Meter, type MeterTone } from './Meter.js'

const meta = {
  title: 'Components/Meter',
  component: Meter,
  tags: ['beta'],
  args: { value: 40, label: 'Budget used' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const tones: [MeterTone, number][] = [
  ['primary', 40],
  ['success', 100],
  ['warning', 85],
  ['danger', 100],
]

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {tones.map(([tone, value]) => (
        <Meter key={tone} {...args} tone={tone} value={value} label={`${tone} meter`} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Meter {...args} size="sm" label="Small meter" />
      <Meter {...args} size="md" label="Medium meter" />
    </div>
  ),
}

/** Pair the bar with the amount as text, and read the amount with `valueText`. */
export const WithAmount: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, font: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span>Groceries</span>
        <span>Rp1.250.000 of Rp3.000.000</span>
      </div>
      <Meter
        value={1_250_000}
        max={3_000_000}
        label="Groceries budget used"
        valueText="Rp1.250.000 of Rp3.000.000"
      />
    </div>
  ),
}

/** Values outside 0…max are clamped, so an overspent budget shows a full bar. */
export const Clamped: Story = {
  args: { value: 140, label: 'Overspent budget', tone: 'danger' },
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('meter', { name: 'Overspent budget' })
    await expect(meter).toHaveAttribute('aria-valuenow', '100')
    await expect(meter).toHaveAttribute('aria-valuemax', '100')
  },
}

/** Without `animated` the bar shows its value right away, e.g. while typing a target. */
export const Static: Story = { args: { animated: false, value: 65 } }
