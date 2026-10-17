import { palettes } from '@rupa-ui/tokens/react-native'
import { screen, userEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { renderWithTheme } from '../../test-utils.js'
import { Button } from './Button.js'

const p = palettes.violet.light

test('is a button named by its label', async () => {
  const onPress = jest.fn()
  await renderWithTheme(<Button onPress={onPress}>Save</Button>)
  await userEvent.press(screen.getByRole('button', { name: 'Save' }))
  expect(onPress).toHaveBeenCalledTimes(1)
})

test('variants use the semantic colors', async () => {
  await renderWithTheme(
    <>
      <Button variant="primary">Approve</Button>
      <Button variant="danger">Delete</Button>
    </>,
  )
  expect(screen.getByRole('button', { name: 'Approve' })).toHaveStyle({
    backgroundColor: p.primary,
  })
  expect(screen.getByText('Approve')).toHaveStyle({ color: p.onPrimary })
  expect(screen.getByRole('button', { name: 'Delete' })).toHaveStyle({ backgroundColor: p.danger })
})

test('loading reports busy and ignores presses', async () => {
  const onPress = jest.fn()
  await renderWithTheme(
    <Button loading onPress={onPress}>
      Save
    </Button>,
  )
  const button = screen.getByRole('button', { name: 'Save' })
  expect(button).toBeBusy()
  await userEvent.press(button)
  expect(onPress).not.toHaveBeenCalled()
})

test('disabled cannot be pressed', async () => {
  const onPress = jest.fn()
  await renderWithTheme(
    <Button disabled onPress={onPress}>
      Save
    </Button>,
  )
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  await userEvent.press(screen.getByRole('button', { name: 'Save' }))
  expect(onPress).not.toHaveBeenCalled()
})

test('md and lg meet the 44 pt touch target; sm reaches it with hitSlop', async () => {
  await renderWithTheme(
    <>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
    </>,
  )
  const small = screen.getByRole('button', { name: 'Small' })
  expect(small).toHaveStyle({ minHeight: 32 })
  expect(small.props.hitSlop).toBe(6)
  expect(screen.getByRole('button', { name: 'Medium' })).toHaveStyle({ minHeight: 44 })
})

test('icon render props receive the label color', async () => {
  const icon = jest.fn((color: string) => <Text>{`icon:${color}`}</Text>)
  await renderWithTheme(
    <Button variant="primary" iconStart={icon}>
      Add
    </Button>,
  )
  expect(icon).toHaveBeenCalledWith(p.onPrimary)
  expect(screen.getByText(`icon:${p.onPrimary}`)).toBeOnTheScreen()
})
