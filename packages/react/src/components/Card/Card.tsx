import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  /** Buttons or links shown at the top right of the header. */
  actions?: ReactNode
  /** Heading level of the title, to fit the page outline. */
  headingLevel?: 2 | 3 | 4
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { title, description, actions, headingLevel = 3, padding = 'md', className, children, ...props },
  ref,
) {
  const titleId = useId()
  const Heading = `h${headingLevel}` as const
  const hasHeader = title != null || actions != null
  return (
    <section
      ref={ref}
      className={cx('rupa-card', className)}
      data-padding={padding}
      aria-labelledby={title != null ? titleId : undefined}
      {...props}
    >
      {hasHeader && (
        <header className="rupa-card__header">
          <div className="rupa-card__heading">
            {title != null && (
              <Heading id={titleId} className="rupa-card__title">
                {title}
              </Heading>
            )}
            {description != null && <p className="rupa-card__description">{description}</p>}
          </div>
          {actions != null && <div className="rupa-card__actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
})
