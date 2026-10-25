import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  /** Icon or emoji in a tile before the title. Decorative. */
  icon?: ReactNode
  /** Heading level, to fit the page outline. */
  level?: 2 | 3 | 4
  /** Small text after the title, e.g. a date or a count. */
  meta?: ReactNode
  /** Links or buttons at the end of the row, e.g. "See all". */
  actions?: ReactNode
}

/** The heading of a section on a page: title, optional icon tile, and a "See all" link. */
export const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  function SectionHeading({ title, icon, level = 2, meta, actions, className, ...props }, ref) {
    const Heading = `h${level}` as const
    return (
      <div
        ref={ref}
        className={cx('rupa-section-heading', className)}
        data-level={level}
        {...props}
      >
        <Heading className="rupa-section-heading__title">
          {icon != null && (
            <span className="rupa-section-heading__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="rupa-section-heading__text">{title}</span>
          {meta != null && <span className="rupa-section-heading__meta">{meta}</span>}
        </Heading>
        {actions != null && <div className="rupa-section-heading__actions">{actions}</div>}
      </div>
    )
  },
)
