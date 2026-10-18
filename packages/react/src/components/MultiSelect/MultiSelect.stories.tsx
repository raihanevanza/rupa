import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Badge, type BadgeTone } from '../Badge/Badge.js'
import { Table } from '../Table/Table.js'
import { MultiSelect } from './MultiSelect.js'

const branches = [
  { value: 'bogor', label: 'Bogor' },
  { value: 'jakarta-pusat', label: 'Jakarta Pusat' },
  { value: 'jakarta-selatan', label: 'Jakarta Selatan' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'bekasi', label: 'Bekasi' },
  { value: 'depok', label: 'Depok' },
  { value: 'tangerang', label: 'Tangerang' },
  { value: 'surabaya', label: 'Surabaya (closed)', disabled: true },
]

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['beta'],
  args: {
    label: 'Branches',
    placeholder: 'All branches',
    options: branches,
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.maxWidth ?? 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithSelection: Story = { args: { defaultValue: ['bogor', 'bandung', 'depok'] } }
export const WithHint: Story = { args: { hint: 'Leave empty to include every branch.' } }
export const WithError: Story = { args: { required: true, error: 'Choose at least one branch.' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: ['bogor'] } }

/** Open with a search typed in: the list keeps only the matches. */
export const Searching: Story = {
  args: { defaultValue: ['jakarta-pusat'] },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 340 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Branches/ }))
    await userEvent.keyboard('jak')
    const list = canvas.getByRole('listbox')
    await expect(within(list).getAllByRole('option')).toHaveLength(2)
  },
}

/** Short lists can drop the search box; the listbox takes focus instead. */
export const WithoutSearch: Story = {
  args: {
    label: 'Notify',
    placeholder: 'Nobody',
    searchable: false,
    defaultValue: ['approver'],
    options: [
      { value: 'requester', label: 'Requester', description: 'The person who filed it' },
      { value: 'approver', label: 'Approver', description: 'Whoever approves next' },
      { value: 'finance', label: 'Finance', description: 'Once the amount is final' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Notify/ }))
    await expect(canvas.getByRole('listbox')).toHaveFocus()
  },
}

export const Keyboard: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Branches/ })
    trigger.focus()
    // Arrow keys open it; focus goes to the search box.
    await userEvent.keyboard('{ArrowDown}')
    const search = canvas.getByRole('combobox', { name: 'Search' })
    await expect(search).toHaveFocus()

    // Enter toggles the active option; arrows move it.
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}')
    await expect(canvas.getByRole('option', { name: 'Bogor' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('option', { name: 'Jakarta Pusat' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // Typing filters, and the first match becomes active.
    await userEvent.keyboard('band{Enter}')
    await expect(canvas.getByRole('option', { name: 'Bandung' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // Select all and Clear act on the matches and on everything.
    await userEvent.clear(search)
    await userEvent.click(canvas.getByRole('button', { name: 'Select all' }))
    await expect(canvas.getAllByRole('option', { selected: true })).toHaveLength(7)
    await expect(search).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }))
    await expect(canvas.queryAllByRole('option', { selected: true })).toHaveLength(0)

    // Esc closes and returns focus to the trigger.
    await userEvent.keyboard('{Enter}{Escape}')
    await expect(canvas.queryByRole('listbox')).toBeNull()
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAccessibleName('Branches Bogor')
  },
}

export const ClickOutsideCloses: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Branches/ }))
    await userEvent.click(canvas.getByRole('option', { name: 'Depok' }))
    // Clicking an option keeps the popup open and focus in the search box.
    await expect(canvas.getByRole('combobox')).toHaveFocus()
    await userEvent.click(canvasElement.ownerDocument.body)
    await expect(canvas.queryByRole('listbox')).toBeNull()
    await expect(canvas.getByRole('button', { name: /Branches/ })).toHaveTextContent('Depok')
  },
}

export const SubmitsWithForm: Story = {
  tags: ['!visual', '!autodocs'],
  args: { name: 'branch', defaultValue: ['bogor', 'depok'] },
  decorators: [
    (Story) => (
      <form>
        <Story />
      </form>
    ),
  ],
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')!
    await expect(new FormData(form).getAll('branch')).toEqual(['bogor', 'depok'])
  },
}

const statuses: { value: string; label: string; tone: BadgeTone }[] = [
  { value: 'draft', label: 'Draft', tone: 'neutral' },
  { value: 'review', label: 'In review', tone: 'info' },
  { value: 'approved', label: 'Approved', tone: 'success' },
  { value: 'rejected', label: 'Rejected', tone: 'danger' },
]
const requests = [
  { id: 'PR-1042', title: 'Laptop for new analyst', status: 'review' },
  { id: 'PR-1041', title: 'Printer toner, Bogor', status: 'approved' },
  { id: 'PR-1039', title: 'Office chairs (12)', status: 'rejected' },
  { id: 'PR-1038', title: 'Team offsite catering', status: 'draft' },
  { id: 'PR-1035', title: 'Cloud backup renewal', status: 'review' },
]

/** As a filter: nothing chosen means no filter. */
export const FilterATable: Story = {
  parameters: { maxWidth: 640 },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
  render: () => {
    const [status, setStatus] = useState<string[]>(['review'])
    const rows = status.length ? requests.filter((r) => status.includes(r.status)) : requests
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ maxWidth: 240 }}>
          <MultiSelect
            label="Status"
            hideLabel
            placeholder="All statuses"
            searchable={false}
            options={statuses}
            value={status}
            onChange={setStatus}
          />
        </div>
        <Table
          caption="Purchase requests"
          hideCaption
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: 'id', header: 'Request', width: '7rem' },
            { key: 'title', header: 'Title' },
            {
              key: 'status',
              header: 'Status',
              render: (r) => {
                const s = statuses.find((x) => x.value === r.status)!
                return <Badge tone={s.tone}>{s.label}</Badge>
              },
            },
          ]}
        />
      </div>
    )
  },
}
