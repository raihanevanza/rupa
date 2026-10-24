import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export interface ChartLegendItem {
  label: ReactNode
  /** A chart color, e.g. `var(--rupa-color-series-1)`. */
  color: string
  /** `line` for line charts, `square` for areas and bars. */
  shape?: 'line' | 'square'
}

export interface ChartFrameProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  /** What the chart shows, in one line. */
  description?: ReactNode
  legend?: ChartLegendItem[]
  /** Controls next to the caption, e.g. a Segmented to switch the metric. */
  actions?: ReactNode
  /** How the numbers were made, below the plot. */
  note?: ReactNode
  /**
   * The same data as a <table>, behind a disclosure. Give one for every chart: it is how
   * screen reader and keyboard users read the values.
   */
  table?: ReactNode
  tableLabel?: ReactNode
}

/**
 * The frame around a chart: caption, legend, plot, note, and the data as a table. Bring your
 * own SVG; put it in a ChartPlot, sized with `useElementWidth`.
 */
export const ChartFrame = forwardRef<HTMLElement, ChartFrameProps>(function ChartFrame(
  {
    title,
    description,
    legend,
    actions,
    note,
    table,
    tableLabel = 'Show as table',
    className,
    children,
    ...props
  },
  ref,
) {
  const hasCaption = title != null || description != null || actions != null
  return (
    <figure ref={ref} className={cx('rupa-chart', className)} {...props}>
      {hasCaption && (
        <figcaption className="rupa-chart__caption">
          <span className="rupa-chart__heading">
            {title != null && <span className="rupa-chart__title">{title}</span>}
            {description != null && <span className="rupa-chart__description">{description}</span>}
          </span>
          {actions != null && <span className="rupa-chart__actions">{actions}</span>}
        </figcaption>
      )}
      {legend && legend.length > 0 && (
        <ul className="rupa-chart__legend">
          {legend.map((item, i) => (
            <li key={i}>
              <span
                className="rupa-chart__swatch"
                data-shape={item.shape ?? 'line'}
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {children}
      {note != null && <p className="rupa-chart__note">{note}</p>}
      {table != null && (
        <details className="rupa-chart__table">
          <summary className="rupa-focusable">{tableLabel}</summary>
          <div className="rupa-chart__table-scroll">{table}</div>
        </details>
      )}
    </figure>
  )
})

export type ChartPlotProps = HTMLAttributes<HTMLDivElement>

/**
 * The box the SVG and its tooltip live in: positioned, a size container (so measuring it
 * with `useElementWidth` is stable), and vertical scrolling still works on touch screens.
 */
export const ChartPlot = forwardRef<HTMLDivElement, ChartPlotProps>(function ChartPlot(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('rupa-chart__plot', className)} {...props} />
})

export interface ChartTooltipItem {
  label: ReactNode
  /** Shown first and bold, e.g. the value or a rank. */
  value?: ReactNode
  /** Shown last and muted, e.g. "12 pts". */
  meta?: ReactNode
  color?: string
}

export interface ChartTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** x of the hovered point inside the plot, in px. */
  x: number
  /** Width of the plot, in px, to keep the tooltip inside it. */
  plotWidth: number
  /** Width of the tooltip, in px. */
  width?: number
  /** Distance from the top of the plot, in px. */
  top?: number
  title?: ReactNode
  items?: ChartTooltipItem[]
}

/**
 * Values at the hovered point, next to it and kept inside the plot. Hidden from assistive
 * tech: the table in ChartFrame carries the same data.
 */
export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(function ChartTooltip(
  { x, plotWidth, width = 208, top = 0, title, items, className, style, children, ...props },
  ref,
) {
  const left = Math.min(Math.max(x + 12, 0), Math.max(plotWidth - width, 0))
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx('rupa-chart__tooltip', className)}
      style={{ left, top, width, ...style }}
      {...props}
    >
      {title != null && <p className="rupa-chart__tooltip-title">{title}</p>}
      {items?.map((item, i) => (
        <p key={i} className="rupa-chart__tooltip-row">
          {item.color && <span className="rupa-chart__swatch" style={{ background: item.color }} />}
          {item.value != null && <span className="rupa-chart__tooltip-value">{item.value}</span>}
          <span className="rupa-chart__tooltip-label">{item.label}</span>
          {item.meta != null && <span className="rupa-chart__tooltip-meta">{item.meta}</span>}
        </p>
      ))}
      {children}
    </div>
  )
})
