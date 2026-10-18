import type { Meta, StoryObj } from '@storybook/react-vite'
import { Row } from '../../stories/Frame.js'
import { Spinner } from './Spinner.js'

const meta = {
  title: 'React Native/Spinner',
  component: Spinner,
  tags: ['beta', '!visual'], // a spinning indicator never matches its screenshot
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <Row>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Row>
  ),
}
