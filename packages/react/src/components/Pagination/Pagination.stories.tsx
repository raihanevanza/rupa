import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import { Pagination } from './Pagination.js'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['stable'],
  args: { page: 5, pageCount: 12, onPageChange: fn() },
  render: function Render(args) {
    const [page, setPage] = useState(args.page)
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(p) => {
          setPage(p)
          args.onPageChange(p)
        }}
      />
    )
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Middle: Story = {}
export const FirstPage: Story = { args: { page: 1 } }
export const FewPages: Story = { args: { page: 2, pageCount: 4 } }
export const Indonesian: Story = {
  args: {
    labels: {
      nav: 'Navigasi halaman',
      previous: 'Halaman sebelumnya',
      next: 'Halaman berikutnya',
      page: (p) => `Halaman ${p}`,
      status: (p, n) => `Halaman ${p} dari ${n}`,
    },
  },
}

export const Navigate: Story = {
  tags: ['!visual', '!autodocs'],
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Page 5' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await expect(args.onPageChange).toHaveBeenLastCalledWith(6)
    await expect(canvas.getByRole('button', { name: 'Page 6' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Page 12' }))
    await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled()
  },
}
