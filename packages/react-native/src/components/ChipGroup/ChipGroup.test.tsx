import { screen, userEvent } from '@testing-library/react-native'
import { useState } from 'react'
import { renderWithTheme } from '../../test-utils.js'
import { ChipGroup } from './ChipGroup.js'

const options = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending', accessibilityLabel: 'Pending, 12 calls' },
  { value: 'failed', label: 'Failed' },
  { value: 'archived', label: 'Archived', disabled: true },
]

test('is a named radio group in one sideways row; pressing selects', async () => {
  const onChange = jest.fn()
  await renderWithTheme(
    <ChipGroup
      testID="group"
      label="Status filter"
      options={options}
      defaultValue="all"
      onChange={onChange}
    />,
  )
  // The group itself is not focusable (its radios must stay reachable), so check its props.
  expect(screen.getByTestId('group').props).toMatchObject({
    role: 'radiogroup',
    'aria-label': 'Status filter',
  })
  expect(screen.getByTestId('group')).not.toHaveStyle({ flexWrap: 'wrap' })
  expect(screen.getByRole('radio', { name: 'All' })).toBeChecked()

  await userEvent.press(screen.getByRole('radio', { name: 'Failed' }))
  expect(onChange).toHaveBeenCalledWith('failed')
  expect(screen.getByRole('radio', { name: 'Failed' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'All' })).not.toBeChecked()
})

test('accessibilityLabel replaces the spoken label', async () => {
  await renderWithTheme(<ChipGroup label="Status" options={options} />)
  expect(screen.getByRole('radio', { name: 'Pending, 12 calls' })).toBeOnTheScreen()
})

test('disabled options cannot be chosen', async () => {
  const onChange = jest.fn()
  await renderWithTheme(<ChipGroup label="Status" options={options} onChange={onChange} />)
  const archived = screen.getByRole('radio', { name: 'Archived' })
  expect(archived).toBeDisabled()
  await userEvent.press(archived)
  expect(onChange).not.toHaveBeenCalled()
})

test('controlled value follows the parent; wrap lays the chips out in rows', async () => {
  function Controlled() {
    const [value, setValue] = useState('all')
    return (
      <ChipGroup
        testID="group"
        label="Status"
        options={options}
        value={value}
        onChange={setValue}
        wrap
      />
    )
  }
  await renderWithTheme(<Controlled />)
  expect(screen.getByTestId('group')).toHaveStyle({ flexWrap: 'wrap' })
  await userEvent.press(screen.getByRole('radio', { name: 'Pending, 12 calls' }))
  expect(screen.getByRole('radio', { name: 'Pending, 12 calls' })).toBeChecked()
})
