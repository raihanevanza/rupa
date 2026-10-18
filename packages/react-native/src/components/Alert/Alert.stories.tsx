import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../../stories/Frame.js'
import { Button } from '../Button/Button.js'
import { Alert } from './Alert.js'

const meta = {
  title: 'React Native/Alert',
  component: Alert,
  tags: ['beta'],
  args: { title: 'Heads up', children: 'Approvals expire after 15 minutes.' },
  decorators: [(Story) => <Stack>{Story()}</Stack>],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Each tone has its own icon, so color is not the only cue. */
export const Tones: Story = {
  render: () => (
    <Stack>
      <Alert title="Heads up">Approvals expire after 15 minutes.</Alert>
      <Alert tone="success" title="Refund sent">
        The customer gets an email.
      </Alert>
      <Alert tone="warning" title="Slow gateway">
        Payments may take longer than usual.
      </Alert>
      <Alert tone="danger" title="Policy failed to load">
        Every call now waits for approval (fail-closed).
      </Alert>
    </Stack>
  ),
}

export const WithAction: Story = {
  args: {
    tone: 'danger',
    title: 'Sync failed',
    children: 'The last change was not saved.',
    action: <Button size="sm">Retry</Button>,
  },
}
