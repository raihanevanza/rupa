---
'@rupa-ui/react': minor
---

Components from the Bola Live migration:

- `Button asChild`, `Chip asChild`, and `Card asChild` put the look on a router link instead of a `<button>` or `<section>`.
- `Chip` (a toggle pill, or a link filter) and `ChipGroup` (a single choice from many pills, like the React Native one).
- `NumberStepper`: a whole number picked with − and +, a WAI-ARIA spin button.
- `Countdown`: time left until a moment, on one shared clock; `now` freezes it for screenshots.
- `CompareBars`: two things side by side per measure, growing from a center line.
- `Stat`: one number with its label, in the status tones.
- `SectionHeading`: a section title with an icon tile and a "See all" slot. `PageHeader` gets an `icon`, and `StateView` an `illustration` for a larger picture than the icon circle.
- `ChartFrame`, `ChartPlot`, `ChartTooltip`, and `useElementWidth`: the frame, legend, tooltip, and data table around your own SVG charts.

`Table` is no longer a client module, so a Next.js Server Component can pass its columns `render` functions (it has no hooks or handlers). The package entry is not a client module either; each component keeps its own `'use client'`.

The full-bundle size budgets grow by 2 kB for these; importing one component costs the same as before.
