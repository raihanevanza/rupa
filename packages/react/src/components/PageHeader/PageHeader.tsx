import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { ChevronRightIcon } from '../../lib/icons.js'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  /** The last item is the current page. */
  breadcrumb?: BreadcrumbItem[]
  /** Accessible name of the breadcrumb landmark. */
  breadcrumbLabel?: string
  actions?: ReactNode
  /** Rendered next to the title, e.g. a status Badge. */
  meta?: ReactNode
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  {
    title,
    description,
    breadcrumb,
    breadcrumbLabel = 'Breadcrumb',
    actions,
    meta,
    className,
    ...props
  },
  ref,
) {
  return (
    <header ref={ref} className={cx('rupa-page-header', className)} {...props}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label={breadcrumbLabel} className="rupa-page-header__breadcrumb">
          <ol>
            {breadcrumb.map((item, i) => {
              const current = i === breadcrumb.length - 1
              return (
                <li key={i}>
                  {item.href && !current ? (
                    <a className="rupa-focusable" href={item.href}>
                      {item.label}
                    </a>
                  ) : (
                    <span aria-current={current ? 'page' : undefined}>{item.label}</span>
                  )}
                  {!current && <ChevronRightIcon className="rupa-page-header__separator" />}
                </li>
              )
            })}
          </ol>
        </nav>
      )}
      <div className="rupa-page-header__row">
        <div className="rupa-page-header__heading">
          <div className="rupa-page-header__title-row">
            <h1 className="rupa-page-header__title">{title}</h1>
            {meta}
          </div>
          {description != null && <p className="rupa-page-header__description">{description}</p>}
        </div>
        {actions != null && <div className="rupa-page-header__actions">{actions}</div>}
      </div>
    </header>
  )
})
