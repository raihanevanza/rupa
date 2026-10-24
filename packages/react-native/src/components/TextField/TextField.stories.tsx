import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { expect, fn, userEvent } from 'storybook/test'
import { CrossMark, SearchMark } from '../../lib/marks.js'
import { TextField } from './TextField.js'

const meta = {
  title: 'React Native/TextField',
  component: TextField,
  tags: ['beta'],
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    onChangeText: fn(),
  },
  decorators: [(Story) => <div style={{ maxWidth: 390 }}>{Story()}</div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'ayu@example.com')
    await expect(args.onChangeText).toHaveBeenLastCalledWith('ayu@example.com')
  },
}

export const Required: Story = { args: { required: true, hint: 'We send the receipt here.' } }

export const WithError: Story = {
  args: { required: true, defaultValue: 'ayu@', error: 'Enter a full email address.' },
}

export const Prefix: Story = {
  args: { label: 'Refund amount', placeholder: '0', prefix: 'Rp', keyboardType: 'numeric' },
}

export const Disabled: Story = { args: { disabled: true, defaultValue: 'ayu@example.com' } }

/** A note field, e.g. inside a ConfirmDialog. */
export const Multiline: Story = {
  args: {
    label: 'Note',
    placeholder: 'Why are you rejecting this?',
    hint: '3–500 characters.',
    multiline: true,
    maxLength: 500,
  },
}

/** A search box: hidden label, icon prefix, and a clear button as the suffix. */
export const Search: Story = {
  args: { label: 'Search', placeholder: 'Search code, agent, or tool' },
  render: function Render(args) {
    const [value, setValue] = useState('refund')
    return (
      <TextField
        {...args}
        hideLabel
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        returnKeyType="search"
        prefix={(color) => <SearchMark color={color} />}
        suffix={
          value
            ? (color) => (
                <Pressable
                  role="button"
                  aria-label="Clear"
                  hitSlop={14}
                  onPress={() => setValue('')}
                >
                  <CrossMark color={color} size={12} />
                </Pressable>
              )
            : undefined
        }
      />
    )
  },
}
