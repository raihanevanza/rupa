import { act, fireEvent, screen, userEvent } from '@testing-library/react-native'
import { AccessibilityInfo } from 'react-native'
import { renderWithTheme } from '../../test-utils.js'
import { MultiSelect } from './MultiSelect.js'

const announce = jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(() => {})

const options = [
  { value: 'bogor', label: 'Bogor' },
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'medan', label: 'Médan' },
  { value: 'surabaya', label: 'Surabaya', disabled: true },
]

test('the trigger speaks the label and the choice, and opens a sheet of checkboxes', async () => {
  const onChange = jest.fn()
  await renderWithTheme(
    <MultiSelect
      label="Branches"
      placeholder="All branches"
      options={options}
      onChange={onChange}
    />,
  )
  const trigger = screen.getByRole('button', { name: 'Branches, All branches' })
  expect(trigger).toBeCollapsed()

  await userEvent.press(trigger)
  expect(screen.getByRole('heading', { name: 'Branches' })).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Branches, All branches' })).toBeExpanded()
  await userEvent.press(screen.getByRole('checkbox', { name: 'Bogor' }))
  await userEvent.press(screen.getByRole('checkbox', { name: 'Jakarta' }))
  expect(onChange).toHaveBeenLastCalledWith(['bogor', 'jakarta'])
  expect(screen.getByRole('checkbox', { name: 'Bogor' })).toBeChecked()

  // Pressing a chosen option again removes it.
  await userEvent.press(screen.getByRole('checkbox', { name: 'Bogor' }))
  expect(onChange).toHaveBeenLastCalledWith(['jakarta'])

  await userEvent.press(screen.getByRole('button', { name: 'Done' }))
  expect(screen.queryByRole('heading', { name: 'Branches' })).toBeNull()
  expect(screen.getByRole('button', { name: 'Branches, Jakarta' })).toBeOnTheScreen()
})

test('with several chosen, the trigger says how many', async () => {
  await renderWithTheme(
    <MultiSelect label="Branches" options={options} defaultValue={['bogor', 'medan']} />,
  )
  expect(
    screen.getByRole('button', { name: 'Branches, Bogor, Médan, 2 selected' }),
  ).toBeOnTheScreen()
})

test('search ignores case and accents, and announces the number of matches', async () => {
  jest.useFakeTimers()
  try {
    await renderWithTheme(<MultiSelect label="Branches" options={options} />)
    await userEvent.press(screen.getByRole('button', { name: 'Branches' }))
    const search = screen.getByLabelText('Search')

    await fireEvent.changeText(search, 'MED')
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByRole('checkbox', { name: 'Médan' })).toBeOnTheScreen()
    await act(async () => jest.advanceTimersByTime(600))
    expect(announce).toHaveBeenLastCalledWith('1 result')

    await fireEvent.changeText(search, 'xyz')
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(screen.getByText('No matches')).toBeOnTheScreen()
  } finally {
    jest.useRealTimers()
  }
})

test('Select all takes the enabled matches; Clear keeps chosen disabled options', async () => {
  const onChange = jest.fn()
  await renderWithTheme(
    <MultiSelect
      label="Branches"
      options={options}
      defaultValue={['surabaya']}
      onChange={onChange}
    />,
  )
  await userEvent.press(screen.getByRole('button', { name: /Branches/ }))
  await fireEvent.changeText(screen.getByLabelText('Search'), 'a')
  await userEvent.press(screen.getByRole('button', { name: 'Select all' }))
  // "a" matches Jakarta, Médan, and Surabaya; Surabaya is disabled and already chosen.
  expect(onChange).toHaveBeenLastCalledWith(['surabaya', 'jakarta', 'medan'])
  expect(screen.getByRole('button', { name: 'Select all' })).toBeDisabled()

  await userEvent.press(screen.getByRole('button', { name: 'Clear' }))
  expect(onChange).toHaveBeenLastCalledWith(['surabaya'])
  expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled()
  expect(screen.getByRole('checkbox', { name: 'Surabaya' })).toBeDisabled()
})

test('Android back closes the sheet; a disabled trigger does not open', async () => {
  await renderWithTheme(
    <>
      <MultiSelect testID="branches" label="Branches" options={options} />
      <MultiSelect label="Region" options={options} disabled />
    </>,
  )
  await userEvent.press(screen.getByRole('button', { name: 'Region' }))
  expect(screen.queryByRole('heading', { name: 'Region' })).toBeNull()

  await userEvent.press(screen.getByRole('button', { name: 'Branches' }))
  expect(screen.getByRole('heading', { name: 'Branches' })).toBeOnTheScreen()
  await fireEvent(screen.getByTestId('branches-sheet'), 'requestClose')
  expect(screen.queryByRole('heading', { name: 'Branches' })).toBeNull()
})

test('the error is spoken as the hint; labels can be replaced for other languages', async () => {
  await renderWithTheme(
    <MultiSelect
      label="Cabang"
      placeholder="Semua cabang"
      error="Pilih minimal satu cabang."
      options={options}
      defaultValue={['bogor', 'jakarta']}
      labels={{
        search: 'Cari',
        done: 'Selesai',
        selectAll: 'Pilih semua',
        clear: 'Hapus',
        count: (n) => `${n} dipilih`,
      }}
    />,
  )
  const trigger = screen.getByRole('button', { name: 'Cabang, Bogor, Jakarta, 2 dipilih' })
  expect(trigger).toHaveProp('accessibilityHint', 'Pilih minimal satu cabang.')
  await userEvent.press(trigger)
  expect(screen.getByLabelText('Cari')).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Pilih semua' })).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Hapus' })).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Selesai' })).toBeOnTheScreen()
})
