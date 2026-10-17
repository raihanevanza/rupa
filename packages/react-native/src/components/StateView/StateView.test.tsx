import { screen, userEvent } from '@testing-library/react-native'
import { AccessibilityInfo } from 'react-native'
import { renderWithTheme } from '../../test-utils.js'
import { Alert } from '../Alert/Alert.js'
import { StateView } from './StateView.js'

const announce = jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(() => {})
afterEach(() => announce.mockClear())

test('empty state uses the default text, replaceable for other languages', async () => {
  const { rerender } = await renderWithTheme(<StateView state="empty" />)
  expect(
    screen.getByLabelText('Nothing here yet. Items you add will show up here.'),
  ).toBeOnTheScreen()

  await rerender(<StateView state="empty" title="Belum ada data" description={null} />)
  expect(screen.getByLabelText('Belum ada data')).toBeOnTheScreen()
})

test('error state is announced and offers a retry', async () => {
  const onRetry = jest.fn()
  await renderWithTheme(<StateView state="error" onRetry={onRetry} retryLabel="Coba lagi" />)
  expect(announce).toHaveBeenCalledWith(
    'Something went wrong. Check your connection and try again.',
  )
  await userEvent.press(screen.getByRole('button', { name: 'Coba lagi' }))
  expect(onRetry).toHaveBeenCalledTimes(1)
})

test('loading has no retry', async () => {
  await renderWithTheme(<StateView state="loading" onRetry={() => {}} />)
  expect(screen.getByText('Loading…')).toBeOnTheScreen()
  expect(screen.queryByRole('button')).toBeNull()
})

test('a live Alert is announced; a static one is not', async () => {
  await renderWithTheme(
    <>
      <Alert tone="warning" title="Heads up">
        Static
      </Alert>
      <Alert tone="danger" title="Failed" live>
        Card declined
      </Alert>
    </>,
  )
  expect(announce).toHaveBeenCalledTimes(1)
  expect(announce).toHaveBeenCalledWith('Failed. Card declined')
  expect(screen.getByRole('alert')).toBeOnTheScreen()
})
