import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx.js'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Used for the alt text and the initials fallback. */
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters =
    words.length > 1 ? [words[0]![0], words.at(-1)![0]] : [words[0]?.[0], words[0]?.[1]]
  return letters.filter(Boolean).join('').toUpperCase()
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', className, ...props },
  ref,
) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed
  return (
    <span
      ref={ref}
      className={cx('rupa-avatar', className)}
      data-size={size}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : name}
      {...props}
    >
      {showImage ? (
        <img src={src} alt={name} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
})
