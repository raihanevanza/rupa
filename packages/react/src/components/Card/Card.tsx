import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { Slot } from '../../lib/slot.js'

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
  /** Buttons or links shown at the top right of the header. */
  actions?: ReactNode
  /** Heading level of the title, to fit the page outline. */
  headingLevel?: 2 | 3 | 4
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Give the card look to the one child element instead of a <section>: a link that opens
   * the item (`<Card asChild><a href="/news/1">…</a></Card>`, which lifts on hover) or a
   * list (`<Card asChild><ul>…</ul></Card>`).
   */
  asChild?: boolean
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    title,
    description,
    actions,
    headingLevel = 3,
    padding = 'md',
    asChild,
    className,
    children,
    ...props
  },
  ref,
) {
  const titleId = useId()
  const Heading = `h${headingLevel}` as const
  const hasHeader = title != null || actions != null
  const content = (body: ReactNode) => (
    <>
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
      {body}
    </>
  )
  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={cx('rupa-card', className)}
        data-padding={padding}
        render={content}
        {...props}
      >
        {children}
      </Slot>
    )
  }
  return (
    <section
      ref={ref}
      className={cx('rupa-card', className)}
      data-padding={padding}
      aria-labelledby={title != null ? titleId : undefined}
      {...props}
    >
      {content(children)}
    </section>
  )
})
