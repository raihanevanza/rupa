import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import { Chip, ChipGroup } from './Chip.js'

const Dot = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    style={{ display: 'block', width: 8, height: 8, borderRadius: 999, background: color }}
  />
)

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending', icon: <Dot color="var(--rupa-color-warning)" /> },
  { value: 'approved', label: 'Approved', icon: <Dot color="var(--rupa-color-success)" /> },
  { value: 'rejected', label: 'Rejected', icon: <Dot color="var(--rupa-color-danger)" /> },
  { value: 'expired', label: 'Expired', disabled: true },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'draft', label: 'Draft' },
]

const meta = {
  title: 'Components/Chip',
  component: ChipGroup,
  tags: ['stable'],
  args: { label: 'Status filter', defaultValue: 'all', onChange: fn(), options: statuses },
} satisfies Meta<typeof ChipGroup>

export default meta
type Story = StoryObj<typeof meta>

/** One row that scrolls sideways on narrow screens. */
export const Group: Story = {}
export const Wrap: Story = { args: { wrap: true } }
export const Small: Story = { args: { wrap: true, size: 'sm' } }

/** A single `Chip` is a toggle button (`aria-pressed`). */
export const Toggle: Story = {
  render: function Render() {
    const [on, setOn] = useState(false)
    return (
      <Chip selected={on} onClick={() => setOn(!on)} icon={<span aria-hidden="true">★</span>}>
        Favorites only
      </Chip>
    )
  },
  play: async ({ canvas }) => {
    const chip = canvas.getByRole('button', { name: 'Favorites only' })
    await expect(chip).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip)
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
  },
}

/** With `asChild`, chips are links: filters that live in the URL. The current one gets `aria-current`. */
export const Links: Story = {
  render: () => (
    <nav aria-label="League" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Chip asChild selected>
        <a href="#all">All leagues</a>
      </Chip>
      <Chip asChild icon={<Dot color="var(--rupa-color-series-1)" />}>
        <a href="#premier">Premier League</a>
      </Chip>
      <Chip asChild icon={<Dot color="var(--rupa-color-series-2)" />}>
        <a href="#laliga">La Liga</a>
      </Chip>
    </nav>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'All leagues' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}

/** One Tab stop; arrows move and select, skipping disabled chips. */
export const Keyboard: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ args, canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    const pending = canvas.getByRole('radio', { name: 'Pending' })
    await expect(pending).toHaveFocus()
    await expect(pending).toHaveAttribute('aria-checked', 'true')
    await expect(args.onChange).toHaveBeenLastCalledWith('pending')
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'Cancelled' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveFocus()
    await userEvent.tab()
    await expect(document.body).toHaveFocus()
  },
}
