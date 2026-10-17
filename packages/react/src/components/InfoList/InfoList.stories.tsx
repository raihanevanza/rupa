import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoList } from './InfoList.js'

const meta = {
  title: 'Components/InfoList',
  component: InfoList,
  tags: ['stable'],
  args: {
    items: [
      { label: 'Requester', value: 'Dina Pratama' },
      { label: 'Department', value: 'Operations' },
      { label: 'Amount', value: 'Rp 12.450.000' },
      { label: 'Due date', value: '21 Oct 2026' },
      { label: 'Approver', value: null },
      {
        label: 'Notes',
        value: 'Replace two laptops whose batteries no longer hold a charge.',
        wide: true,
      },
    ],
  },
} satisfies Meta<typeof InfoList>

export default meta
type Story = StoryObj<typeof meta>

export const TwoColumns: Story = {}
export const ThreeColumns: Story = { args: { columns: 3 } }
export const OneColumn: Story = { args: { columns: 1 } }
