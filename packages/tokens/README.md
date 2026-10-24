# @rupa-ui/tokens

[Storybook](https://raihan-evanza-rupa.vercel.app) · [GitHub](https://github.com/raihanevanza/rupa) · [`@rupa-ui/tokens`](https://www.npmjs.com/package/@rupa-ui/tokens) · [`@rupa-ui/react`](https://www.npmjs.com/package/@rupa-ui/react) · [`@rupa-ui/react-native`](https://www.npmjs.com/package/@rupa-ui/react-native)

Design tokens for the [Rupa design system](https://github.com/raihanevanza/rupa): six brands (`violet`, `signal`, `latte`, `ledger`, `mono`, `iris`) × light and dark modes, typography, spacing, radius, shadows, motion, and validated chart palettes.

![The same components in every brand and mode: violet, signal, and latte, light and dark](https://raw.githubusercontent.com/raihanevanza/rupa/main/docs/screenshots/npm/tokens.png)

**[See every token in Storybook](https://raihan-evanza-rupa.vercel.app/?path=/story/foundations-colors--semantic)**: colors, type, spacing, radius, shadows, and chart palettes, plus [all brands and modes on one page](https://raihan-evanza-rupa.vercel.app/?path=/story/patterns-brands-and-modes--matrix).

```sh
npm install @rupa-ui/tokens
```

## CSS

```css
@import '@rupa-ui/tokens/css';

.card {
  background: var(--rupa-color-surface);
  color: var(--rupa-color-ink);
  border-radius: var(--rupa-radius-xl);
  box-shadow: var(--rupa-shadow-card);
}
```

Theme with attributes on any element (nesting works):

```html
<html data-brand="signal" data-theme="dark"></html>
```

`data-theme`: `light` | `dark` | `system`. The `.dark` class works too.

## Tailwind

```css
/* v4 */
@import 'tailwindcss';
@import '@rupa-ui/tokens/css';
@import '@rupa-ui/tokens/tailwind/v4.css';
```

```js
// v3: tailwind.config.js
import rupa from '@rupa-ui/tokens/tailwind/preset'
export default { presets: [rupa], content: ['./src/**/*.{ts,tsx}'] }
```

## JavaScript

```ts
import { colors, tokens, cssVar } from '@rupa-ui/tokens'

colors.violet.dark.primary // '#7c5ce6'
cssVar('color-ink') // 'var(--rupa-color-ink)'
```

## React Native

Ready-made components on these tokens: [`@rupa-ui/react-native`](https://github.com/raihanevanza/rupa/tree/main/packages/react-native).

```ts
import { palettes, font, space, shadows } from '@rupa-ui/tokens/react-native'

const p = palettes.signal.dark
const styles = StyleSheet.create({
  title: { color: p.ink, ...font('semibold'), padding: space['4'] },
  card: { backgroundColor: p.surface, boxShadow: shadows.signal.dark.card },
})
```

## Flutter

The same build writes the [`rupa_tokens`](https://github.com/raihanevanza/rupa/tree/main/packages/flutter) Dart package (a Git dependency, not on npm):

```dart
final c = RupaColors.of(RupaBrand.iris, RupaMode.dark);
Container(color: c.surface, padding: const EdgeInsets.all(RupaSpace.s4));
```

## Guarantees

Checked on every build: text pairs ≥ 4.5:1, UI pairs ≥ 3:1 in every brand and mode; chart series pass lightness, chroma, color-vision-deficiency separation, and 3:1 against the surface.

Requires browsers with `light-dark()` (Chrome/Edge 123+, Firefox 120+, Safari 17.5+).
