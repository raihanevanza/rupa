import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button/Button.js'
import { Card } from '../Card/Card.js'
import { StateView } from './StateView.js'

const meta = {
  title: 'React Native/StateView',
  component: StateView,
  tags: ['beta'],
  args: { state: 'empty' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Card padding="none">{Story()}</Card>
      </div>
    ),
  ],
} satisfies Meta<typeof StateView>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { action: <Button variant="primary">Create request</Button> },
}

export const Error: Story = { args: { state: 'error', onRetry: fn() } }

/** Labels are replaceable for other languages. */
export const Translated: Story = {
  args: {
    state: 'error',
    title: 'Terjadi kesalahan',
    description: 'Periksa koneksi lalu coba lagi.',
    retryLabel: 'Coba lagi',
    onRetry: fn(),
  },
}

export const Loading: Story = { args: { state: 'loading' }, tags: ['!visual'] }
