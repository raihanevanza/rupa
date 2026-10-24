import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans'
import {
  Alert,
  Badge,
  Button,
  Card,
  ChipGroup,
  ConfirmDialog,
  InfoList,
  MultiSelect,
  PageHeader,
  Segmented,
  StateView,
  StatusFlow,
  TextField,
  ThemeProvider,
  useTheme,
  type Brand,
  type ThemeMode,
  type ViewState,
} from '@rupa-ui/react-native'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useEffectEvent, useRef, useState, type ComponentRef } from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function App() {
  // Family names must match what `font(weight)` asks for.
  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  })
  if (!loaded) return null
  return (
    <SafeAreaProvider>
      <ThemeProvider defaultBrand="signal" defaultMode="system">
        <Showcase />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Section = 'buttons' | 'alerts' | 'filters' | 'states'

/**
 * Deep links for screenshots: `…/--/?section=states`, `?dialog=reject`, `?mode=dark`.
 * Open them with `xcrun simctl openurl booted <url>` or `adb shell am start -d <url>`.
 */
function useDemoLink(onLink: (params: URLSearchParams) => void) {
  const onParams = useEffectEvent(onLink)
  useEffect(() => {
    const handle = (url?: string | null) => {
      const query = url?.split('?')[1]
      if (query) onParams(new URLSearchParams(query))
    }
    Linking.getInitialURL().then(handle)
    const sub = Linking.addEventListener('url', (e) => handle(e.url))
    return () => sub.remove()
  }, [])
}

function Showcase() {
  const { brand, mode, resolvedMode, palette: p, font, setBrand, setMode } = useTheme()
  const [dialog, setDialog] = useState<'approve' | 'reject' | null>(null)
  const [status, setStatus] = useState<'review' | 'approved' | 'rejected'>('review')
  const [view, setView] = useState<ViewState>('empty')
  const [branches, setBranches] = useState(['bogor', 'depok'])
  const [search, setSearch] = useState('')
  const [requestStatus, setRequestStatus] = useState('pending')
  const [note, setNote] = useState('')
  const section = [styles.section, { color: p.ink3 }, font('semibold')]
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const [offsets, setOffsets] = useState<Partial<Record<Section, number>>>({})
  const mark = (name: Section) => ({
    onLayout: (e: { nativeEvent: { layout: { y: number } } }) => {
      const y = e.nativeEvent.layout.y
      setOffsets((o) => (o[name] === y ? o : { ...o, [name]: y }))
    },
  })

  useDemoLink((params) => {
    const mode = params.get('mode')
    if (mode === 'light' || mode === 'dark' || mode === 'system') setMode(mode)
    const brandParam = params.get('brand')
    if (brandParam === 'violet' || brandParam === 'signal') setBrand(brandParam)
    const state = params.get('state')
    if (state === 'loading' || state === 'empty' || state === 'error') setView(state)
    const dialogParam = params.get('dialog')
    setDialog(dialogParam === 'approve' || dialogParam === 'reject' ? dialogParam : null)
    const y = offsets[params.get('section') as Section] ?? 0
    setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, y - 8), animated: false }), 50)
  })

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: p.canvas }]} edges={['top']}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Segmented<Brand>
            label="Brand"
            size="sm"
            value={brand}
            onChange={setBrand}
            options={[
              { value: 'violet', label: 'Violet' },
              { value: 'signal', label: 'Signal' },
            ]}
          />
          <Segmented<ThemeMode>
            label="Mode"
            size="sm"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'Auto' },
            ]}
          />
        </View>

        <PageHeader
          title="Refund #1042"
          description="Support agent asks to refund an order that arrived damaged."
          meta={
            status === 'review' ? (
              <Badge tone="warning" pulse>
                Waiting
              </Badge>
            ) : status === 'approved' ? (
              <Badge tone="success" dot>
                Approved
              </Badge>
            ) : (
              <Badge tone="danger" dot>
                Rejected
              </Badge>
            )
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
              { label: 'Customer', value: 'Dewi Lestari' },
              { label: 'Policy', value: 'Needs approval' },
              { label: 'Reason', value: 'Package arrived crushed; photos attached.', wide: true },
            ]}
          />
          <View style={styles.row}>
            <Button
              variant="danger"
              style={styles.grow}
              disabled={status !== 'review'}
              onPress={() => setDialog('reject')}
            >
              Reject
            </Button>
            <Button
              variant="success"
              style={styles.grow}
              disabled={status !== 'review'}
              onPress={() => setDialog('approve')}
            >
              Approve
            </Button>
          </View>
        </Card>

        <Card title="Approval flow">
          <StatusFlow
            current={status === 'review' ? 'review' : 'decision'}
            outcome={status === 'rejected' ? 'rejected' : undefined}
            completed={status === 'approved'}
            steps={[
              { key: 'request', label: 'Requested', description: 'support-bot · 09:12' },
              { key: 'review', label: 'Human review', description: 'Approver on duty' },
              { key: 'decision', label: 'Executed' },
            ]}
          />
          {status !== 'review' && (
            <Button size="sm" variant="ghost" onPress={() => setStatus('review')}>
              Reset demo
            </Button>
          )}
        </Card>

        <Text style={section} {...mark('buttons')}>
          Buttons
        </Text>
        <View style={styles.wrap}>
          <Button variant="primary">Primary</Button>
          <Button>Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" loading>
            Saving
          </Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </View>

        <Text style={section}>Badges</Text>
        <View style={styles.wrap}>
          <Badge>Draft</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="info" dot>
            Info
          </Badge>
          <Badge tone="success" dot>
            Success
          </Badge>
          <Badge tone="warning" dot>
            Warning
          </Badge>
          <Badge tone="danger" dot>
            Danger
          </Badge>
        </View>

        <Text style={section} {...mark('alerts')}>
          Alerts
        </Text>
        <Alert title="Heads up">Approvals expire after 15 minutes.</Alert>
        <Alert tone="success" title="Refund sent">
          The customer gets an email.
        </Alert>
        <Alert tone="warning" title="Slow gateway">
          Payments may take longer than usual.
        </Alert>
        <Alert tone="danger" title="Policy failed to load">
          Every call now waits for approval (fail-closed).
        </Alert>

        <Text style={section} {...mark('filters')}>
          Filters
        </Text>
        <TextField
          label="Search requests"
          hideLabel
          placeholder="Search code or customer"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <ChipGroup
          label="Status filter"
          value={requestStatus}
          onChange={setRequestStatus}
          options={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'expired', label: 'Expired' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
        <MultiSelect
          label="Branches"
          placeholder="All branches"
          hint="Leave empty to include every branch."
          value={branches}
          onChange={setBranches}
          options={[
            { value: 'bogor', label: 'Bogor' },
            { value: 'jakarta-pusat', label: 'Jakarta Pusat' },
            { value: 'jakarta-selatan', label: 'Jakarta Selatan' },
            { value: 'bandung', label: 'Bandung' },
            { value: 'bekasi', label: 'Bekasi' },
            { value: 'depok', label: 'Depok' },
            { value: 'tangerang', label: 'Tangerang' },
            {
              value: 'surabaya',
              label: 'Surabaya',
              description: 'Closed for renovation',
              disabled: true,
            },
          ]}
        />

        <Text style={section} {...mark('states')}>
          States
        </Text>
        <Segmented<ViewState>
          label="State"
          block
          value={view}
          onChange={setView}
          options={[
            { value: 'loading', label: 'Loading' },
            { value: 'empty', label: 'Empty' },
            { value: 'error', label: 'Error' },
          ]}
        />
        <Card padding="none">
          <StateView state={view} compact onRetry={() => setView('loading')} />
        </Card>
      </ScrollView>

      <ConfirmDialog
        open={dialog === 'approve'}
        onOpenChange={(open) => !open && setDialog(null)}
        tone="success"
        title="Approve this refund?"
        description="Rp 1.250.000 goes back to Dewi Lestari. This cannot be undone."
        confirmLabel="Approve"
        onConfirm={async () => {
          await sleep(1200)
          setStatus('approved')
        }}
      />
      <ConfirmDialog
        open={dialog === 'reject'}
        onOpenChange={(open) => !open && setDialog(null)}
        tone="danger"
        title="Reject this refund?"
        description="The agent is told the request was refused."
        confirmLabel="Reject"
        // The note field also shows the dialog moving above the keyboard.
        confirmDisabled={note.trim().length < 3}
        onConfirm={async () => {
          await sleep(1200)
          // Fails once to show the error state; the second try goes through.
          if (!rejectedOnce) {
            rejectedOnce = true
            throw new Error('The gateway timed out. Nothing was changed.')
          }
          setStatus('rejected')
        }}
      >
        <TextField
          label="Note"
          required
          hint="At least 3 characters."
          multiline
          value={note}
          onChangeText={setNote}
        />
      </ConfirmDialog>
    </SafeAreaView>
  )
}

let rejectedOnce = false

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 16, padding: 16, paddingBottom: 48 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  grow: { flex: 1 },
  section: { marginTop: 8, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' },
})
