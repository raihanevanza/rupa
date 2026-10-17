import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent } from 'storybook/test'
import { Checkbox } from './Checkbox.js'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['stable'],
  args: { label: 'Email me when a request needs my approval' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const WithDescription: Story = {
  args: {
    label: 'Require a second approver',
    description: 'Applies to requests above Rp 50.000.000.',
    defaultChecked: true,
  },
}
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } }

const items = ['Bogor', 'Jakarta', 'Bandung']

/** A select-all box shows "some selected" with the indeterminate state. */
export const SelectAll: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>(['Bogor'])
    const all = checked.length === items.length
    return (
      <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        <legend style={{ fontWeight: 600, marginBottom: 8 }}>Branches</legend>
        <Checkbox
          label="All branches"
          checked={all}
          indeterminate={checked.length > 0 && !all}
          onChange={() => setChecked(all ? [] : items)}
        />
        <div style={{ display: 'grid', gap: 10, paddingLeft: 30 }}>
          {items.map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={checked.includes(item)}
              onChange={(e) =>
                setChecked(
                  e.target.checked ? [...checked, item] : checked.filter((c) => c !== item),
                )
              }
            />
          ))}
        </div>
      </fieldset>
    )
  },
  play: async ({ canvas }) => {
    const all = canvas.getByLabelText<HTMLInputElement>('All branches')
    await expect(all.indeterminate).toBe(true)
    await userEvent.click(all)
    await expect(canvas.getByLabelText('Jakarta')).toBeChecked()
    // Space toggles a focused checkbox, like any native checkbox.
    await userEvent.keyboard(' ')
    await expect(canvas.getByLabelText('Jakarta')).not.toBeChecked()
    await userEvent.click(canvas.getByLabelText('Bogor'))
  },
}
