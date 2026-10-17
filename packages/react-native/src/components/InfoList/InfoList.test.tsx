import { screen } from '@testing-library/react-native'
import { renderWithTheme } from '../../test-utils.js'
import { InfoList } from './InfoList.js'

test('each pair is one accessible item; empty values show a dash', async () => {
  await renderWithTheme(
    <InfoList
      items={[
        { label: 'Status', value: 'Approved' },
        { label: 'Note', value: '' },
      ]}
    />,
  )
  expect(screen.getByLabelText('Status, Approved')).toBeOnTheScreen()
  expect(screen.getByLabelText('Note, —')).toBeOnTheScreen()
})

test('two columns put pairs side by side; wide items get their own row', async () => {
  await renderWithTheme(
    <InfoList
      testID="list"
      columns={2}
      items={[
        { label: 'A', value: '1' },
        { label: 'B', value: '2' },
        { label: 'Address', value: 'Jl. Sudirman 1', wide: true },
        { label: 'C', value: '3' },
      ]}
    />,
  )
  const rows = screen.getByTestId('list').children
  // [A B] [Address] [C + filler]
  expect(rows).toHaveLength(3)
})
