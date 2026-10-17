import { colorDescriptions, colors, type Brand, type SemanticColor } from '@rupa-ui/tokens'

/** Swatches render with the live CSS variable, so they follow the toolbar brand and mode. */
export function SwatchGrid({ names, brand }: { names: SemanticColor[]; brand: Brand }) {
  return (
    <ul className="docs-swatches">
      {names.map((name) => (
        <li key={name} className="docs-swatch">
          <span className="docs-swatch__chip" style={{ background: `var(--rupa-color-${name})` }} />
          <span className="docs-swatch__meta">
            <code>{name}</code>
            <span className="docs-swatch__values">
              {colors[brand].light[name]} · {colors[brand].dark[name]}
            </span>
            {colorDescriptions[name] && (
              <span className="docs-swatch__desc">{colorDescriptions[name]}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
