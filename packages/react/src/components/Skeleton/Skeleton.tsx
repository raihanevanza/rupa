import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  /** Render several text lines; the last one is shorter. */
  lines?: number
  shape?: 'text' | 'rect' | 'circle'
}

/** Decorative placeholder. Pair it with a Spinner or StateView that announces loading. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { width, height, lines, shape = 'text', className, style, ...props },
  ref,
) {
  if (lines && lines > 1) {
    return (
      <span
        ref={ref}
        className={cx('rupa-skeleton-lines', className)}
        aria-hidden="true"
        style={style}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className="rupa-skeleton"
            data-shape="text"
            style={{ width: i === lines - 1 ? '60%' : width }}
          />
        ))}
      </span>
    )
  }
  return (
    <span
      ref={ref}
      className={cx('rupa-skeleton', className)}
      data-shape={shape}
      aria-hidden="true"
      style={{ width, height, ...style }}
      {...props}
    />
  )
})
