import { screen, userEvent } from '@testing-library/react-native'
import { createRef } from 'react'
import { Pressable, Text } from 'react-native'
import { palettes } from '@rupa-ui/tokens/react-native'
import { renderWithTheme } from '../../test-utils.js'
import { TextField, type TextFieldRef } from './TextField.js'

test('the input speaks the label, required state, and hint; typing reports the text', async () => {
  const onChangeText = jest.fn()
  await renderWithTheme(
    <TextField label="Email" required hint="We never share it" onChangeText={onChangeText} />,
  )
  const input = screen.getByLabelText('Email, required')
  expect(input.props.accessibilityHint).toBe('We never share it')
  // The visible label is hidden from screen readers so the name is not read twice.
  expect(screen.queryByText('Email', { exact: false })).toBeNull()
  expect(screen.getByText('Email', { exact: false, includeHiddenElements: true })).toBeTruthy()

  await userEvent.type(input, 'ayu@example.com')
  expect(onChangeText).toHaveBeenLastCalledWith('ayu@example.com')
})

test('an error replaces the hint for screen readers and is shown under the input', async () => {
  await renderWithTheme(
    <TextField label="Note" hint="3-500 characters" error="A note is required" multiline />,
  )
  expect(screen.getByLabelText('Note').props.accessibilityHint).toBe('A note is required')
  expect(screen.getByText('A note is required')).toBeOnTheScreen()
  expect(screen.getByText('3-500 characters')).toBeOnTheScreen()
})

test('hideLabel keeps the name, and prefix/suffix render inside the field', async () => {
  const onClear = jest.fn()
  await renderWithTheme(
    <TextField
      label="Search"
      hideLabel
      prefix={(color) => <Text testID="icon">{color}</Text>}
      suffix={
        <Pressable role="button" aria-label="Clear" onPress={onClear}>
          <Text>×</Text>
        </Pressable>
      }
    />,
  )
  expect(screen.getByLabelText('Search')).toBeOnTheScreen()
  expect(screen.queryByText('Search', { includeHiddenElements: true })).toBeNull()
  // A function prefix gets the muted ink color, like the web adornment.
  expect(screen.getByTestId('icon')).toHaveTextContent(palettes.violet.light.ink3)

  await userEvent.press(screen.getByRole('button', { name: 'Clear' }))
  expect(onClear).toHaveBeenCalled()
})

test('disabled is not editable, and the ref points to the TextInput', async () => {
  const ref = createRef<TextFieldRef>()
  await renderWithTheme(<TextField ref={ref} label="Code" disabled testID="code" />)
  expect(screen.getByTestId('code')).toHaveProp('editable', false)
  expect(screen.getByTestId('code')).toHaveProp('aria-disabled', true)
  expect(typeof ref.current?.focus).toBe('function')
})
