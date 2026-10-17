import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'

export interface TooltipProps {
  content: ReactNode
  /** One focusable element (a button or link). It keeps its own accessible name. */
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Supplementary text on hover and keyboard focus; Esc closes it. Never put essential
 * information only in a tooltip: touch users cannot hover.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 300,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="rupa-tooltip"
            side={side}
            sideOffset={6}
            collisionPadding={8}
          >
            {content}
            <RadixTooltip.Arrow className="rupa-tooltip__arrow" width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
