import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx.js'
import { CheckIcon, MinusIcon, XIcon } from '../../lib/icons.js'

export interface StatusStep {
  key: string
  label: ReactNode
  /** e.g. who acted and when. */
  description?: ReactNode
}

export type StepState = 'complete' | 'current' | 'upcoming' | 'rejected' | 'cancelled'

export interface StatusFlowProps extends HTMLAttributes<HTMLOListElement> {
  steps: StatusStep[]
  /** Key of the step the document is at now. */
  current: string
  /** The current step ended the flow without success. */
  outcome?: 'rejected' | 'cancelled'
  /** Every step, including the current one, is done. */
  completed?: boolean
  /** Screen reader text for each state; replace for other languages. */
  stateLabels?: Partial<Record<StepState, string>>
  orientation?: 'horizontal' | 'vertical'
}

const defaultLabels: Record<StepState, string> = {
  complete: 'Completed',
  current: 'Current step',
  upcoming: 'Not started',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

export const StatusFlow = forwardRef<HTMLOListElement, StatusFlowProps>(function StatusFlow(
  {
    steps,
    current,
    outcome,
    completed,
    stateLabels,
    orientation = 'horizontal',
    className,
    ...props
  },
  ref,
) {
  const labels = { ...defaultLabels, ...stateLabels }
  const currentIndex = steps.findIndex((s) => s.key === current)

  const stateOf = (i: number): StepState => {
    if (completed || i < currentIndex) return 'complete'
    if (i > currentIndex) return 'upcoming'
    return outcome ?? 'current'
  }

  return (
    <ol
      ref={ref}
      className={cx('rupa-status-flow', className)}
      data-orientation={orientation}
      {...props}
    >
      {steps.map((step, i) => {
        const state = stateOf(i)
        return (
          <li
            key={step.key}
            className="rupa-status-flow__step"
            data-state={state}
            aria-current={i === currentIndex && !completed ? 'step' : undefined}
          >
            <span className="rupa-status-flow__marker" aria-hidden="true">
              {state === 'complete' && <CheckIcon />}
              {state === 'rejected' && <XIcon />}
              {state === 'cancelled' && <MinusIcon />}
              {(state === 'current' || state === 'upcoming') && <span>{i + 1}</span>}
            </span>
            <span className="rupa-status-flow__text">
              <span className="rupa-status-flow__label">{step.label}</span>
              <span className="rupa-visually-hidden">, {labels[state]}</span>
              {step.description != null && (
                <span className="rupa-status-flow__description">{step.description}</span>
              )}
            </span>
          </li>
        )
      })}
    </ol>
  )
})
