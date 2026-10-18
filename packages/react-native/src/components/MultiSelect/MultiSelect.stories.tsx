import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
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
  title: 'React Native/MultiSelect',
  component: MultiSelect,
  tags: ['beta'],
  args: {
    label: 'Branches',
    placeholder: 'All branches',
    options: branches,
    onChange: fn(),
  },
  decorators: [(Story) => <div style={{ maxWidth: 390 }}>{Story()}</div>],
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithSelection: Story = { args: { defaultValue: ['bogor', 'bandung', 'depok'] } }
export const WithHint: Story = { args: { hint: 'Leave empty to include every branch.' } }
export const WithError: Story = { args: { error: 'Choose at least one branch.' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: ['bogor'] } }

/** The sheet, open with a search typed in. */
export const Searching: Story = {
  tags: ['visual-page', '!autodocs'],
  args: { defaultValue: ['jakarta-pusat'] },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Branches/ }))
    // The sheet renders in a portal outside the story root, so query the whole page.
    await userEvent.type(await screen.findByRole('textbox', { name: 'Search' }), 'jak')
    await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(2))
  },
}

/** Short lists can drop the search box. */
export const WithoutSearch: Story = {
  tags: ['visual-page', '!autodocs'],
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
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Notify/ }))
    await expect(await screen.findByRole('checkbox', { name: /Approver/ })).toBeChecked()
  },
}

export const Choosing: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Branches, All branches' })
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Bogor' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Depok' }))
    await expect(args.onChange).toHaveBeenLastCalledWith(['bogor', 'depok'])

    // Select all picks every enabled match; Clear empties the list again.
    await userEvent.click(screen.getByRole('button', { name: 'Select all' }))
    await expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(7)
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
    await expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Bandung' }))
    await userEvent.click(screen.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(canvas.getByRole('button', { name: 'Branches, Bandung' })).toBeVisible()
  },
}
