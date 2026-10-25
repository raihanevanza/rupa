import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Badge, type BadgeTone } from '../Badge/Badge.js'
import { StateView } from '../StateView/StateView.js'
import { Table, type TableColumn } from './Table.js'

interface Request {
  code: string
  title: string
  requester: string
  amount: number
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Draft'
}

const tone: Record<Request['status'], BadgeTone> = {
  Draft: 'neutral',
  Submitted: 'info',
  Approved: 'success',
  Rejected: 'danger',
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const rows: Request[] = [
  {
    code: 'PR-0142',
    title: 'Laptop replacement',
    requester: 'Dina Pratama',
    amount: 12450000,
    status: 'Submitted',
  },
  {
    code: 'PR-0141',
    title: 'Office chairs',
    requester: 'Budi Santoso',
    amount: 4800000,
    status: 'Approved',
  },
  {
    code: 'PR-0139',
    title: 'Printer toner',
    requester: 'Sari Wulandari',
    amount: 950000,
    status: 'Rejected',
  },
  {
    code: 'PR-0137',
    title: 'Team offsite venue',
    requester: 'Andi Wijaya',
    amount: 18000000,
    status: 'Draft',
  },
]

const columns: TableColumn<Request>[] = [
  { key: 'code', header: 'Code', width: '7rem' },
  { key: 'title', header: 'Title' },
  { key: 'requester', header: 'Requester', hideOnMobile: true },
  { key: 'amount', header: 'Amount', align: 'end', render: (r) => rupiah.format(r.amount) },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <Badge tone={tone[r.status]} dot>
        {r.status}
      </Badge>
    ),
  },
]

const meta = {
  title: 'Components/Table',
  component: Table<Request>,
  tags: ['stable'],
  args: { columns, rows, rowKey: (r: Request) => r.code, caption: 'Purchase requests' },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    empty: { control: false },
    error: { control: false },
  },
} satisfies Meta<typeof Table<Request>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const HiddenCaption: Story = { args: { hideCaption: true } }
export const Loading: Story = { args: { loading: true } }
export const Empty: Story = { args: { rows: [] } }
export const Error: Story = {
  args: {
    error: <StateView state="error" compact title="Could not load requests" onRetry={fn()} />,
  },
}

/**
 * `onRowClick` opens the row from anywhere in it. The code links stay for keyboard and screen
 * reader users, and clicking them does not fire `onRowClick` twice.
 */
export const RowClick: Story = {
  args: {
    onRowClick: fn(),
    columns: [
      {
        ...columns[0]!,
        render: (r) => (
          // preventDefault keeps the story on the page; an app would route here
          <a href={`#${r.code}`} onClick={(e) => e.preventDefault()}>
            {r.code}
          </a>
        ),
      },
      ...columns.slice(1),
    ],
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByText('Office chairs'))
    await expect(args.onRowClick).toHaveBeenCalledTimes(1)
    await expect(args.onRowClick).toHaveBeenLastCalledWith(rows[1], expect.anything())
    await userEvent.click(canvas.getByRole('link', { name: 'PR-0142' }))
    await expect(args.onRowClick).toHaveBeenCalledTimes(1)
  },
}

/** `rowHighlight` marks a row (here the signed-in requester) with a bar and `aria-current`. */
export const HighlightedRow: Story = {
  args: { rowHighlight: (r: Request) => r.requester === 'Budi Santoso' },
  play: async ({ canvas }) => {
    const row = canvas.getByText('Office chairs').closest('tr')
    await expect(row).toHaveAttribute('aria-current', 'true')
    await expect(canvas.getByText('Laptop replacement').closest('tr')).not.toHaveAttribute(
      'aria-current',
    )
  },
}
