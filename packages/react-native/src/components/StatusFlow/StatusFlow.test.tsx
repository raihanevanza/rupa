import { screen } from '@testing-library/react-native'
import { renderWithTheme } from '../../test-utils.js'
import { StatusFlow } from './StatusFlow.js'

const steps = [
  { key: 'draft', label: 'Draft' },
  { key: 'review', label: 'Review', description: 'Rina, 09:12' },
  { key: 'done', label: 'Done' },
]

test('each step says its state, not only through color', async () => {
  await renderWithTheme(<StatusFlow steps={steps} current="review" />)
  expect(screen.getByLabelText('Draft, Completed')).toBeOnTheScreen()
  expect(screen.getByLabelText('Review, Current step, Rina, 09:12')).toBeOnTheScreen()
  expect(screen.getByLabelText('Done, Not started')).toBeOnTheScreen()
})

test('outcome, completed, and translated state labels', async () => {
  const { rerender } = await renderWithTheme(
    <StatusFlow steps={steps} current="review" outcome="rejected" />,
  )
  expect(screen.getByLabelText('Review, Rejected, Rina, 09:12')).toBeOnTheScreen()

  await rerender(
    <StatusFlow
      steps={steps}
      current="done"
      completed
      orientation="horizontal"
      stateLabels={{ complete: 'Selesai' }}
    />,
  )
  expect(screen.getByLabelText('Done, Selesai')).toBeOnTheScreen()
})
