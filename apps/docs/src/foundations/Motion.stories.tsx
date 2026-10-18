import { Badge, Button, Card, Meter } from '@rupa-ui/react'
import { tokens } from '@rupa-ui/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import './foundations.css'

const meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tokens: Story = {
  render: () => (
    <section className="docs-section">
      <h2>Duration and easing</h2>
      <p>
        Fast for hover and press, base for things that appear, slow for bars that fill. Everything
        that moves finishes at once when the user prefers reduced motion.
      </p>
      <ul className="docs-scale">
        {Object.entries(tokens.motion.duration).map(([name, value]) => (
          <li key={name}>
            <code>motion-duration-{name}</code>
            <span>{value}</span>
          </li>
        ))}
        {Object.entries(tokens.motion.easing).map(([name, value]) => (
          <li key={name}>
            <code>motion-easing-{name}</code>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  ),
}

/**
 * Class names from `styles.css` (or `base.css`) for app code. Add them to an element when it
 * appears, not to every element on first render: a list that slides in on each visit gets
 * tiresome.
 */
export const Helpers: Story = {
  render: function Helpers() {
    // Changing the key mounts the examples again, which replays the animations
    const [run, setRun] = useState(0)
    return (
      <section className="docs-section">
        <h2>Helpers</h2>
        <p>
          <code>rupa-enter</code> for a new row or card, <code>rupa-pop</code> for a status that
          just changed, <code>rupa-grow-x</code> for a bar that fills. Meter grows by itself.
        </p>
        <div>
          <Button variant="secondary" size="sm" onClick={() => setRun((n) => n + 1)}>
            Replay
          </Button>
        </div>
        <div key={run} style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
          <Card className="rupa-enter" title="New request" description="rupa-enter" />
          <div>
            <Badge className="rupa-pop" tone="success">
              Approved
            </Badge>{' '}
            <code>rupa-pop</code>
          </div>
          <Meter value={65} label="Budget used" />
        </div>
      </section>
    )
  },
}
