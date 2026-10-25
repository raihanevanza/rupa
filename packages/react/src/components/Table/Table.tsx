import {
  forwardRef,
  type ForwardedRef,
  type HTMLAttributes,
  type JSX,
  type Key,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from '../../lib/cx.js'
import { Skeleton } from '../Skeleton/Skeleton.js'
import { StateView } from '../StateView/StateView.js'

export interface TableColumn<Row> {
  key: string
  header: ReactNode
  /** Defaults to `row[key]`. */
  render?: (row: Row) => ReactNode
  align?: 'start' | 'end' | 'center'
  width?: string
  /** Hide on narrow screens. */
  hideOnMobile?: boolean
}

export interface TableProps<Row> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: TableColumn<Row>[]
  rows: Row[]
  rowKey: (row: Row) => Key
  /** Describes the table for screen readers. Required; hide it with `hideCaption`. */
  caption: ReactNode
  hideCaption?: boolean
  loading?: boolean
  /** Rows of skeletons while loading. */
  loadingRows?: number
  loadingLabel?: string
  /** Shown when there are no rows; defaults to an empty StateView. */
  empty?: ReactNode
  /** Shown instead of rows (e.g. a StateView with retry). */
  error?: ReactNode
  /**
   * A mouse shortcut: clicking anywhere in the row. Keep a link or button in a cell for
   * keyboard and screen reader users; the row itself is not focusable. Clicks on links,
   * buttons, and form controls inside the row, and clicks that end a text selection, are
   * left to them.
   */
  onRowClick?: (row: Row, event: MouseEvent<HTMLTableRowElement>) => void
  /** Marks rows to stand out, e.g. the signed-in user's. Sets `aria-current` on them. */
  rowHighlight?: (row: Row) => boolean
}

const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"]'

/**
 * A semantic data table: real <th scope>, caption, and a scroll container that keyboard
 * users can focus. Sorting, filtering, and paging stay in the app (server-side lists).
 */
function TableInner<Row>(
  {
    columns,
    rows,
    rowKey,
    caption,
    hideCaption,
    loading,
    loadingRows = 5,
    loadingLabel = 'Loading rows',
    empty,
    error,
    onRowClick,
    rowHighlight,
    className,
    ...props
  }: TableProps<Row>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const colSpan = columns.length
  const cell = (row: Row, col: TableColumn<Row>) =>
    col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as ReactNode)

  let body: ReactNode
  if (error != null) {
    body = (
      <tr>
        <td colSpan={colSpan} className="rupa-table__state">
          {error}
        </td>
      </tr>
    )
  } else if (loading) {
    body = Array.from({ length: loadingRows }, (_, i) => (
      <tr key={i} aria-hidden="true">
        {columns.map((col) => (
          <td key={col.key} data-align={col.align} data-hide-mobile={col.hideOnMobile || undefined}>
            <Skeleton width={i % 2 ? '60%' : '80%'} />
          </td>
        ))}
      </tr>
    ))
  } else if (rows.length === 0) {
    body = (
      <tr>
        <td colSpan={colSpan} className="rupa-table__state">
          {empty ?? <StateView state="empty" compact />}
        </td>
      </tr>
    )
  } else {
    body = rows.map((row) => (
      // Keyboard users reach the same action through the link or button in a cell (see onRowClick).
      <tr
        key={rowKey(row)}
        data-clickable={onRowClick ? true : undefined}
        data-highlighted={rowHighlight?.(row) || undefined}
        aria-current={rowHighlight?.(row) || undefined}
        onClick={
          onRowClick &&
          ((event) => {
            const target = event.target as Element
            if (
              target.closest(INTERACTIVE) &&
              event.currentTarget.contains(target.closest(INTERACTIVE))
            )
              return
            if (window.getSelection()?.toString()) return
            onRowClick(row, event)
          })
        }
      >
        {columns.map((col) => (
          <td key={col.key} data-align={col.align} data-hide-mobile={col.hideOnMobile || undefined}>
            {cell(row, col)}
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <div
      ref={ref}
      className={cx('rupa-table', className)}
      // Focusable so keyboard users can scroll wide tables (axe: scrollable-region-focusable).
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      role="region"
      aria-label={typeof caption === 'string' ? caption : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      <table>
        <caption className={hideCaption ? 'rupa-visually-hidden' : 'rupa-table__caption'}>
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                data-align={col.align}
                data-hide-mobile={col.hideOnMobile || undefined}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
      {loading && (
        <span className="rupa-visually-hidden" role="status">
          {loadingLabel}
        </span>
      )}
    </div>
  )
}

export const Table = forwardRef(TableInner) as <Row>(
  props: TableProps<Row> & { ref?: Ref<HTMLDivElement> },
) => JSX.Element
