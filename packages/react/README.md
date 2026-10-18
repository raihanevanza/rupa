# @rupa-ui/react

[Storybook](https://raihan-evanza-rupa.vercel.app) · [GitHub](https://github.com/raihanevanza/rupa) · [`@rupa-ui/tokens`](https://www.npmjs.com/package/@rupa-ui/tokens) · [`@rupa-ui/react`](https://www.npmjs.com/package/@rupa-ui/react) · [`@rupa-ui/react-native`](https://www.npmjs.com/package/@rupa-ui/react-native)

Accessible React components for the [Rupa design system](https://github.com/raihanevanza/rupa), themed by [`@rupa-ui/tokens`](https://www.npmjs.com/package/@rupa-ui/tokens).

![A request detail page built from Rupa components](https://raw.githubusercontent.com/raihanevanza/rupa/main/docs/screenshots/npm/react.png)

**[Live examples in Storybook](https://raihan-evanza-rupa.vercel.app/?path=/docs/components-button--docs)**: every component and variant, with controls, in every brand and mode (toolbar).

```sh
npm install @rupa-ui/react
```

```tsx
import '@rupa-ui/react/styles.css' // tokens + components
import '@rupa-ui/react/base.css' // optional document defaults
import { Button, ConfirmDialog, ToastProvider, useToast } from '@rupa-ui/react'
```

Set the brand and mode on `<html data-brand="violet" data-theme="dark">`, or use `ThemeProvider` / `useTheme()`.

**Components:** Alert, Avatar, Badge, Button, Card, Checkbox, ConfirmDialog, Dialog, Field, IconButton, InfoList, Input, Meter, MultiSelect, NativeSelect, PageHeader, Pagination, Segmented, Select, Skeleton, Spinner, StateView, StatusFlow, Switch, Table, Tabs, Textarea, TextField, Toast, Tooltip.

- WCAG 2.2 AA: axe-clean in every theme, keyboard-tested, visible focus, 44 px touch targets.
- Every built-in label can be replaced through props (for bilingual apps).
- ESM, tree-shakable per component (`Button` alone is under 1 kB), React 18 and 19, `'use client'` for Next.js.

Docs and live examples: [Rupa Storybook](https://raihan-evanza-rupa.vercel.app).
