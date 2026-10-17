import { tokens } from '@rupa-ui/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import './foundations.css'

const meta = {
  title: 'Foundations/Scales',
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Typography: Story = {
  render: () => (
    <section className="docs-section">
      <h2>Type scale · Plus Jakarta Sans</h2>
      <ul className="docs-scale">
        {Object.entries(tokens.font.size).map(([name, value]) => (
          <li key={name}>
            <code>font-size-{name}</code>
            <span>{value}</span>
            <p style={{ margin: 0, fontSize: `var(--rupa-font-size-${name})`, lineHeight: 1.3 }}>
              Pengajuan disetujui
            </p>
          </li>
        ))}
      </ul>
      <ul className="docs-scale">
        {Object.entries(tokens.font.weight).map(([name, value]) => (
          <li key={name}>
            <code>font-weight-{name}</code>
            <span>{value}</span>
            <p style={{ margin: 0, fontWeight: value }}>Approve request</p>
          </li>
        ))}
      </ul>
    </section>
  ),
}

export const Spacing: Story = {
  render: () => (
    <section className="docs-section">
      <h2>Spacing · 4 px grid</h2>
      <ul className="docs-scale">
        {Object.entries(tokens.space).map(([name, value]) => (
          <li key={name}>
            <code>space-{name}</code>
            <span>{value}</span>
            <div className="docs-bar" style={{ width: `var(--rupa-space-${name})` }} />
          </li>
        ))}
      </ul>
    </section>
  ),
}

export const RadiusAndShadow: Story = {
  name: 'Radius and shadow',
  render: () => (
    <>
      <section className="docs-section">
        <h2>Radius</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(tokens.radius).map(([name, value]) => (
            <figure key={name} style={{ margin: 0, textAlign: 'center', fontSize: 12 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: `var(--rupa-radius-${name})`,
                  border: '2px solid var(--rupa-color-accent)',
                  background: 'var(--rupa-color-accent-soft)',
                }}
              />
              <figcaption style={{ marginTop: 6, color: 'var(--rupa-color-ink-2)' }}>
                {name} · {value}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="docs-section">
        <h2>Shadow</h2>
        <p>Tinted by the brand’s shadow color, so the same token works on every theme.</p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 8 }}>
          {Object.keys(tokens.shadow).map((name) => (
            <div
              key={name}
              style={{
                width: 160,
                height: 96,
                borderRadius: 'var(--rupa-radius-xl)',
                background: 'var(--rupa-color-surface)',
                boxShadow: `var(--rupa-shadow-${name})`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
              }}
            >
              shadow-{name}
            </div>
          ))}
        </div>
      </section>
    </>
  ),
}
