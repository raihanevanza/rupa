import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  InfoList,
  PageHeader,
  StatusFlow,
  Table,
  Tabs,
  ToastProvider,
  useToast,
  type TableColumn,
} from '@rupa-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'

interface Item {
  name: string
  qty: number
  price: number
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const items: Item[] = [
  { name: 'ThinkPad T14 Gen 5', qty: 2, price: 5_850_000 },
  { name: 'USB-C dock', qty: 2, price: 375_000 },
]

const columns: TableColumn<Item>[] = [
  { key: 'name', header: 'Item' },
  { key: 'qty', header: 'Qty', align: 'end', width: '5rem' },
  { key: 'price', header: 'Unit price', align: 'end', render: (r) => rupiah.format(r.price) },
  { key: 'total', header: 'Total', align: 'end', render: (r) => rupiah.format(r.qty * r.price) },
]

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function RequestPage() {
  const toast = useToast()
  return (
    <main
      style={{ display: 'grid', gap: 24, maxWidth: 1080, margin: '0 auto', padding: '32px 24px' }}
    >
      <PageHeader
        breadcrumb={[{ label: 'Purchase requests', href: '#' }, { label: 'PR-2026-0142' }]}
        title="Laptop replacement"
        meta={
          <Badge tone="info" dot>
            Submitted
          </Badge>
        }
        description="Two laptops for the Bogor branch office; current units no longer hold a charge."
        actions={
          <>
            <ConfirmDialog
              trigger={<Button variant="danger">Reject</Button>}
              tone="danger"
              title="Reject this request?"
              description="Dina will be notified. A rejected request cannot be reopened."
              confirmLabel="Reject"
              onConfirm={async () => {
                await wait(600)
                toast.show({ tone: 'danger', title: 'Request rejected' })
              }}
            />
            <ConfirmDialog
              trigger={<Button variant="primary">Approve</Button>}
              title="Approve PR-2026-0142?"
              description="Rp 12.450.000 will be sent to finance for payment."
              confirmLabel="Approve"
              onConfirm={async () => {
                await wait(600)
                toast.show({
                  tone: 'success',
                  title: 'Request approved',
                  description: 'Moved to finance for payment.',
                })
              }}
            />
          </>
        }
      />
      <Card padding="lg">
        <StatusFlow
          aria-label="Request progress"
          steps={[
            { key: 'draft', label: 'Draft', description: 'Dina · 14 Oct' },
            { key: 'submitted', label: 'Submitted', description: 'Dina · 14 Oct' },
            { key: 'approved', label: 'Approved' },
            { key: 'paid', label: 'Paid' },
          ]}
          current="submitted"
        />
      </Card>
      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          alignItems: 'start',
        }}
      >
        <Card title="Details" headingLevel={2}>
          <InfoList
            items={[
              {
                label: 'Requester',
                value: (
                  <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <Avatar name="Dina Pratama" size="sm" />
                    Dina Pratama
                  </span>
                ),
              },
              { label: 'Branch', value: 'Bogor' },
              { label: 'Amount', value: rupiah.format(12_450_000) },
              { label: 'Needed by', value: '21 Oct 2026' },
            ]}
          />
        </Card>
        <Card title="Activity" headingLevel={2}>
          <Tabs
            label="Activity"
            items={[
              {
                value: 'comments',
                label: 'Comments',
                content: (
                  <p style={{ margin: 0, fontSize: 14 }}>“Batteries last under an hour.” — Dina</p>
                ),
              },
              {
                value: 'audit',
                label: 'Audit log',
                content: (
                  <p style={{ margin: 0, fontSize: 14 }}>
                    14 Oct 09:12 · Dina submitted the request
                  </p>
                ),
              },
            ]}
          />
        </Card>
      </div>
      <Table caption="Items" columns={columns} rows={items} rowKey={(r) => r.name} />
    </main>
  )
}

const meta = {
  title: 'Patterns/Request detail',
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** A full page built only from Rupa components: the approval flow every portfolio app shares. */
export const Page: Story = {
  tags: ['visual-page'],
  render: () => (
    <ToastProvider>
      <RequestPage />
    </ToastProvider>
  ),
}
