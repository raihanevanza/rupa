import type { Meta, StoryObj } from '@storybook/react-vite'
import { SwatchGrid } from './Swatch'
import './foundations.css'

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Semantic colors. Every value is a `light-dark()` pair per brand, so one variable
 * (`var(--rupa-color-ink)`) is right in every brand and mode. Values below: light · dark.
 */
export const Semantic: Story = {
  render: (_, { globals }) => (
    <>
      <section className="docs-section">
        <h2>Surfaces and lines</h2>
        <SwatchGrid
          brand={globals.brand}
          names={[
            'canvas',
            'surface',
            'surface-2',
            'surface-3',
            'line',
            'line-strong',
            'control-border',
          ]}
        />
      </section>
      <section className="docs-section">
        <h2>Text</h2>
        <p>
          All three text colors reach 4.5:1 on canvas and surfaces, so muted labels stay readable.
        </p>
        <SwatchGrid brand={globals.brand} names={['ink', 'ink-2', 'ink-3']} />
      </section>
      <section className="docs-section">
        <h2>Brand</h2>
        <SwatchGrid
          brand={globals.brand}
          names={[
            'primary',
            'primary-hover',
            'on-primary',
            'accent',
            'accent-soft',
            'accent-line',
            'focus',
          ]}
        />
      </section>
    </>
  ),
}

/** Each status has a solid fill, a soft background, and an ink for text on either. */
export const Status: Story = {
  render: (_, { globals }) => (
    <>
      {(['success', 'warning', 'danger', 'info'] as const).map((tone) => (
        <section key={tone} className="docs-section">
          <h2 style={{ textTransform: 'capitalize' }}>{tone}</h2>
          <SwatchGrid
            brand={globals.brand}
            names={[tone, `on-${tone}`, `${tone}-soft`, `${tone}-ink`]}
          />
        </section>
      ))}
    </>
  ),
}

/**
 * Categorical series in a fixed order, validated in CI for every brand and mode:
 * lightness band, chroma floor, protan/deutan separation, and 3:1 against the surface.
 */
export const Chart: Story = {
  render: (_, { globals }) => (
    <section className="docs-section">
      <h2>Chart series</h2>
      <p>Assign in this order and never cycle. A sixth category and beyond folds into “Other”.</p>
      <SwatchGrid
        brand={globals.brand}
        names={[
          'series-1',
          'series-2',
          'series-3',
          'series-4',
          'series-5',
          'series-other',
          'chart-grid',
          'chart-axis',
        ]}
      />
    </section>
  ),
}
