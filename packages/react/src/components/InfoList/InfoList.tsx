import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export interface InfoItem {
  label: ReactNode
  value: ReactNode
  /** Span the full row (long text, addresses). */
  wide?: boolean
}

export interface InfoListProps extends HTMLAttributes<HTMLDListElement> {
  items: InfoItem[]
  /** Columns on wide screens; always one column on narrow ones. */
  columns?: 1 | 2 | 3
  /** Shown when a value is empty (null, undefined, or ''). */
  emptyValue?: ReactNode
}

export const InfoList = forwardRef<HTMLDListElement, InfoListProps>(function InfoList(
  { items, columns = 2, emptyValue = '—', className, ...props },
  ref,
) {
  return (
    <dl ref={ref} className={cx('rupa-info-list', className)} data-columns={columns} {...props}>
      {items.map((item, i) => (
        <div key={i} className="rupa-info-list__item" data-wide={item.wide || undefined}>
          <dt>{item.label}</dt>
          <dd>{item.value == null || item.value === '' ? emptyValue : item.value}</dd>
        </div>
      ))}
    </dl>
  )
})
