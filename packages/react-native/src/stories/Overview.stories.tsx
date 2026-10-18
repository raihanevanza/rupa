import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Alert } from '../components/Alert/Alert.js'
import { Badge } from '../components/Badge/Badge.js'
import { Button } from '../components/Button/Button.js'
import { Card } from '../components/Card/Card.js'
import { InfoList } from '../components/InfoList/InfoList.js'
import { PageHeader } from '../components/PageHeader/PageHeader.js'
import { Segmented } from '../components/Segmented/Segmented.js'
import { StatusFlow } from '../components/StatusFlow/StatusFlow.js'
import { useTheme } from '../theme/ThemeProvider.js'
import { Phone } from './Frame.js'

/**
 * A screen of an approver app built only from `@rupa-ui/react-native`, rendered with
 * react-native-web. Switch brand and mode in the toolbar.
 */
const meta = {
  title: 'React Native/Overview',
  tags: ['beta', '!autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Screen() {
  const { palette, font } = useTheme()
  const [filter, setFilter] = useState('pending')
  return (
    <Phone>
      <Segmented
        label="Filter"
        size="sm"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'all', label: 'All' },
        ]}
      />
      <PageHeader
        title="Refund #1042"
        description="Support agent asks to refund an order that arrived damaged."
        meta={
          <Badge tone="warning" dot>
            Waiting
          </Badge>
        }
      />
      <Card
        title="Tool call"
        description="payments.refund"
        actions={<Badge tone="accent">High risk</Badge>}
      >
        <InfoList
          columns={2}
          items={[
            { label: 'Amount', value: 'Rp 1.250.000' },
            { label: 'Agent', value: 'support-bot' },
            { label: 'Reason', value: 'Package arrived crushed; photos attached.', wide: true },
          ]}
        />
        <View style={styles.row}>
          <Button variant="danger" style={styles.grow}>
            Reject
          </Button>
          <Button variant="success" style={styles.grow}>
            Approve
          </Button>
        </View>
      </Card>
      <Card title="Approval flow">
        <StatusFlow
          current="review"
          steps={[
            { key: 'request', label: 'Requested', description: 'support-bot · 09:12' },
            { key: 'review', label: 'Human review', description: 'Approver on duty' },
            { key: 'done', label: 'Executed' },
          ]}
        />
      </Card>
      <Alert tone="warning" title="Slow gateway">
        Payments may take longer than usual.
      </Alert>
      <Text style={[styles.note, { color: palette.ink3 }, font()]}>
        Rendered with react-native-web; on a phone the same code runs natively.
      </Text>
    </Phone>
  )
}

export const Screen_: Story = { name: 'Approver screen', render: () => <Screen /> }

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  grow: { flex: 1 },
  note: { fontSize: 12, textAlign: 'center' },
})
