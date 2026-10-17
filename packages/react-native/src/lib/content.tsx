import {
  Children,
  isValidElement,
  type ComponentRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from 'react'
import { Text, View, type StyleProp, type TextStyle } from 'react-native'

/** An icon slot: a node, or a function that receives the text color so the icon can match it. */
export type IconSlot = ReactNode | ((color: string) => ReactNode)

export const renderIcon = (icon: IconSlot, color: string) =>
  typeof icon === 'function' ? icon(color) : icon

const isText = (node: ReactNode): node is string | number =>
  typeof node === 'string' || typeof node === 'number'

/** Wraps strings in a styled <Text>; anything else (an element, a custom <Text>) renders as is. */
export function TextOrNode({
  children,
  style,
  numberOfLines,
}: {
  children: ReactNode
  style: StyleProp<TextStyle>
  numberOfLines?: number
}) {
  if (children == null || children === false) return null
  const parts = Children.toArray(children)
  if (parts.every(isText)) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {children}
      </Text>
    )
  }
  return <>{children}</>
}

/** The readable text inside a node, for accessibility labels built from rich content. */
export function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (isText(node)) return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/** `#rrggbb` + alpha (0–1) → `#rrggbbaa`, the React Native form of color-mix(… transparent). */
export const withAlpha = (hex: string, alpha: number) =>
  `${hex.slice(0, 7)}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`

/** What a ref on a Rupa component points to: the underlying native view. */
export type ViewRef = ComponentRef<typeof View>

/** The declared type of a Rupa component, spelled out so .d.ts files stay portable. */
export type RupaComponent<P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<ViewRef>
>
