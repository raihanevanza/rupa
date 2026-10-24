import * as React from 'react'
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from './cx.js'

type SlotChild = { className?: string; children?: ReactNode }

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  /** Wraps the child's own children, so icons and labels keep their place. */
  render: (content: ReactNode) => ReactNode
}

interface LazyNode {
  $$typeof: symbol
  _payload: PromiseLike<ReactNode>
}

// A child sent from a Server Component can arrive as a lazy node until it resolves.
const isLazy = (node: unknown): node is LazyNode =>
  typeof node === 'object' &&
  node !== null &&
  (node as LazyNode).$$typeof === Symbol.for('react.lazy') &&
  typeof (node as LazyNode)._payload?.then === 'function'

// `use` exists from React 19, the first version with Server Components; React 18 never
// sends lazy children.
const use = (React as { use?: <T>(value: PromiseLike<T>) => T }).use

/**
 * For `asChild`: renders the one child element (e.g. a router link) with the component's
 * props and ref merged in. No Radix needed, so components that use it stay small.
 */
export const Slot = forwardRef<unknown, SlotProps>(function Slot(
  { children, className, render, ...props },
  ref,
) {
  const child = isLazy(children) && use ? use(children._payload) : children
  if (!isValidElement<SlotChild>(child)) {
    throw new Error('Rupa: asChild expects exactly one element as its child')
  }
  return cloneElement(
    child,
    { ...props, ref, className: cx(className, child.props.className) } as SlotChild,
    render(child.props.children),
  )
})
