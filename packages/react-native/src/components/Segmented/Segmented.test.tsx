import { screen, userEvent } from '@testing-library/react-native'
import { useState } from 'react'
import { renderWithTheme } from '../../test-utils.js'
import { Segmented } from './Segmented.js'

const options = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed', disabled: true },
]

test('is a named radio group; pressing selects', async () => {
  const onChange = jest.fn()
  await renderWithTheme(
    <Segmented
      testID="group"
      label="Status filter"
      options={options}
      defaultValue="all"
      onChange={onChange}
    />,
  )
  // The group itself is not focusable (its radios must stay reachable), so check its props.
  expect(screen.getByTestId('group').props).toMatchObject({
    accessibilityRole: 'radiogroup',
    accessibilityLabel: 'Status filter',
  })
  expect(screen.getByRole('radio', { name: 'All' })).toBeChecked()

  await userEvent.press(screen.getByRole('radio', { name: 'Pending' }))
  expect(onChange).toHaveBeenCalledWith('pending')
  expect(screen.getByRole('radio', { name: 'Pending' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'All' })).not.toBeChecked()
})

test('disabled options cannot be chosen', async () => {
  const onChange = jest.fn()
  await renderWithTheme(<Segmented label="Status" options={options} onChange={onChange} />)
  const closed = screen.getByRole('radio', { name: 'Closed' })
  expect(closed).toBeDisabled()
  await userEvent.press(closed)
  expect(onChange).not.toHaveBeenCalled()
})

test('controlled value follows the parent', async () => {
  function Controlled() {
    const [value, setValue] = useState('all')
    return <Segmented label="Status" options={options} value={value} onChange={setValue} />
  }
  await renderWithTheme(<Controlled />)
  await userEvent.press(screen.getByRole('radio', { name: 'Pending' }))
  expect(screen.getByRole('radio', { name: 'Pending' })).toBeChecked()
})
