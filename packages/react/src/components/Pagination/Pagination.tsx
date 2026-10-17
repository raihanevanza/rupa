import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'
import { ChevronLeftIcon, ChevronRightIcon } from '../../lib/icons.js'

export interface PaginationLabels {
  nav: string
  previous: string
  next: string
  page: (page: number) => string
  /** e.g. "Page 3 of 12", shown on small screens and read by screen readers. */
  status: (page: number, pageCount: number) => string
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 1-based. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** Page buttons on each side of the current one. */
  siblings?: number
  labels?: Partial<PaginationLabels>
}

const defaultLabels: PaginationLabels = {
  nav: 'Pagination',
  previous: 'Previous page',
  next: 'Next page',
  page: (p) => `Page ${p}`,
  status: (p, n) => `Page ${p} of ${n}`,
}

/** Page numbers to show, with 'gap' for the ellipses: 1 … 4 5 6 … 12 */
export function pageRange(page: number, pageCount: number, siblings = 1): (number | 'gap')[] {
  const total = siblings * 2 + 5
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const start = Math.max(2, Math.min(page - siblings, pageCount - siblings * 2 - 2))
  const end = Math.min(pageCount - 1, Math.max(page + siblings, siblings * 2 + 3))
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  return [
    1,
    ...(start > 2 ? ['gap' as const] : []),
    ...middle,
    ...(end < pageCount - 1 ? ['gap' as const] : []),
    pageCount,
  ]
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onPageChange, siblings = 1, labels: labelsProp, className, ...props },
  ref,
) {
  const labels = { ...defaultLabels, ...labelsProp }
  if (pageCount < 1) return null
  const go = (p: number) => {
    if (p >= 1 && p <= pageCount && p !== page) onPageChange(p)
  }
  return (
    <nav ref={ref} aria-label={labels.nav} className={cx('rupa-pagination', className)} {...props}>
      <button
        type="button"
        className="rupa-pagination__button rupa-focusable"
        aria-label={labels.previous}
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        <ChevronLeftIcon />
      </button>
      <ol className="rupa-pagination__pages">
        {pageRange(page, pageCount, siblings).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} className="rupa-pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className="rupa-pagination__button rupa-focusable"
                aria-label={labels.page(p)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => go(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ol>
      <span className="rupa-pagination__status" aria-live="polite">
        {labels.status(page, pageCount)}
      </span>
      <button
        type="button"
        className="rupa-pagination__button rupa-focusable"
        aria-label={labels.next}
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  )
})
