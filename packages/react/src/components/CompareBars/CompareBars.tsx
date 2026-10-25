import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export interface CompareRow {
  label: ReactNode
  values: [number, number]
  /** Text for each value, e.g. "0.84" or "47%". Defaults to the numbers. */
  display?: [ReactNode, ReactNode]
}

export interface CompareBarsProps extends HTMLAttributes<HTMLUListElement> {
  rows: CompareRow[]
  /** Who the two sides are. Read by screen readers next to each value. */
  names: [string, string]
}

/**
 * Two things side by side, one row per measure: the first grows to the left, the second to
 * the right, from a shared center line. Each row has its own scale (the larger value fills
 * its half), so every measure reads on its own. Colors are chart series 1 and 2; show which
 * is which next to it (a legend, or colored names).
 */
export const CompareBars = forwardRef<HTMLUListElement, CompareBarsProps>(function CompareBars(
  { rows, names, className, ...props },
  ref,
) {
  return (
    <ul ref={ref} className={cx('rupa-compare-bars', className)} {...props}>
      {rows.map((row, r) => {
        const [a, b] = row.values
        const max = Math.max(a, b)
        const lead = a === b ? -1 : a > b ? 0 : 1
        return (
          <li key={r} className="rupa-compare-bars__row">
            <div className="rupa-compare-bars__text">
              <span className="rupa-compare-bars__label">{row.label}</span>
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="rupa-compare-bars__value"
                  data-side={i}
                  data-lead={lead === i || undefined}
                >
                  <span className="rupa-visually-hidden">{names[i]}: </span>
                  {row.display?.[i] ?? row.values[i]}
                </span>
              ))}
            </div>
            <div className="rupa-compare-bars__bars" aria-hidden="true">
              {row.values.map((v, i) => (
                <span key={i} className="rupa-compare-bars__track" data-side={i}>
                  <span
                    className="rupa-compare-bars__fill"
                    data-dim={(lead !== -1 && lead !== i) || undefined}
                    style={{ width: `${max ? (v / max) * 100 : 0}%` }}
                  />
                </span>
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
})
