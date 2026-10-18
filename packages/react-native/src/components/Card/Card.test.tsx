import { screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { renderWithTheme } from '../../test-utils.js'
import { Button } from '../Button/Button.js'
import { Card } from './Card.js'
import { PageHeader } from '../PageHeader/PageHeader.js'

test('Card title is a heading, with description, actions, and content', async () => {
  await renderWithTheme(
    <Card title="Refund" description="Order #1042" actions={<Button size="sm">Edit</Button>}>
      <Text>Body</Text>
    </Card>,
  )
  expect(screen.getByRole('heading', { name: 'Refund' })).toBeOnTheScreen()
  expect(screen.getByText('Order #1042')).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Edit' })).toBeOnTheScreen()
  expect(screen.getByText('Body')).toBeOnTheScreen()
})

test('PageHeader title is a heading with meta and actions', async () => {
  await renderWithTheme(
    <PageHeader
      title="Approvals"
      description="Tool calls waiting for you"
      meta={<Text>3 pending</Text>}
      actions={<Button>Refresh</Button>}
    />,
  )
  expect(screen.getByRole('heading', { name: 'Approvals' })).toBeOnTheScreen()
  expect(screen.getByText('3 pending')).toBeOnTheScreen()
  expect(screen.getByRole('button', { name: 'Refresh' })).toBeOnTheScreen()
})
