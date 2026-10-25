import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button.js'
import { SectionHeading } from './SectionHeading.js'

const meta = {
  title: 'Components/SectionHeading',
  component: SectionHeading,
  tags: ['stable'],
  args: { title: 'Recent requests' },
} satisfies Meta<typeof SectionHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithIcon: Story = { args: { icon: '📋' } }
export const WithMeta: Story = { args: { icon: '⏭️', meta: '· Saturday, 25 October' } }

/** A "See all" link at the end of the row. */
export const WithActions: Story = {
  args: {
    icon: '📰',
    title: 'Latest news',
    actions: (
      <Button asChild variant="ghost" size="sm">
        <a href="#news">All news</a>
      </Button>
    ),
  },
}

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <SectionHeading level={2} icon="🏆" title="Level 2" />
      <SectionHeading level={3} icon="🏆" title="Level 3" />
      <SectionHeading level={4} icon="🏆" title="Level 4" />
    </div>
  ),
}
