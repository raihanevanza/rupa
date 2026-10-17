import { palettes } from '@rupa-ui/tokens/react-native'
import { screen } from '@testing-library/react-native'
import { renderWithTheme } from '../../test-utils.js'
import { Badge } from './Badge.js'

test('tones pair a soft background with readable ink', async () => {
  await renderWithTheme(<Badge tone="success">Approved</Badge>, { defaultMode: 'dark' })
  const p = palettes.violet.dark
  expect(screen.getByText('Approved')).toHaveStyle({ color: p.successInk })
})

test('the dot is hidden from screen readers; the text carries the meaning', async () => {
  await renderWithTheme(
    <Badge tone="info" pulse testID="badge">
      Executing
    </Badge>,
  )
  expect(screen.getByText('Executing')).toBeOnTheScreen()
  // Hidden elements are excluded from queries by default.
  expect(screen.getByTestId('badge').children).toHaveLength(2)
})
