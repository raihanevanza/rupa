import '@fontsource-variable/plus-jakarta-sans'
import '../../../packages/react/src/styles.css'
import '../../../packages/react/src/styles/document.css'
import './preview.css'
import type { Decorator, Preview } from '@storybook/react-vite'

/** Applies the toolbar brand and mode to <html>, exactly as an app would. */
const withTheme: Decorator = (Story, context) => {
  const { brand, theme } = context.globals as { brand: string; theme: string }
  const html = document.documentElement
  html.dataset.brand = brand
  html.dataset.theme = theme
  return <Story />
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'violet', title: 'Violet (Mini ERP)' },
          { value: 'signal', title: 'Signal (AgentGate)' },
          { value: 'latte', title: 'Latte (Dompet Rumah)' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  // RUPA_BRAND / RUPA_THEME let `npm run test:themes` run every story (and axe) in each theme.
  initialGlobals: {
    brand: import.meta.env.VITE_RUPA_BRAND ?? 'violet',
    theme: import.meta.env.VITE_RUPA_THEME ?? 'light',
  },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    backgrounds: { disable: true },
    // Every story is an accessibility test: axe violations fail `npm test` and CI.
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting started',
          'Foundations',
          'Guides',
          'Components',
          'Patterns',
        ],
      },
    },
  },
  // `visual`: every story gets a screenshot test unless it opts out with `tags: ['!visual']`.
  tags: ['autodocs', 'visual'],
}

export default preview
