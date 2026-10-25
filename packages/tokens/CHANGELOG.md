# @rupa-ui/tokens

## 0.5.0

### Minor Changes

- [#21](https://github.com/raihanevanza/rupa/pull/21) [`e280ad2`](https://github.com/raihanevanza/rupa/commit/e280ad21802845802130a4219c8e777bd43bef6a) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `iris` (electric violet on lavender) for Patungan, in light and dark: `data-brand="iris"` on the web, `palettes.iris` and `<ThemeProvider brand="iris">` in React Native. The dark primary is `#7759f4` instead of Patungan's `#7c60f5`, which was 4.33:1 under white text.

## 0.4.0

### Minor Changes

- [#20](https://github.com/raihanevanza/rupa/pull/20) [`06bdeba`](https://github.com/raihanevanza/rupa/commit/06bdeba395ff14aa83710c0e6ba1aa18a89ac0c1) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `candy` (candy pink on warm cream, deep plum ink) for Bola Live, in light and dark: `data-brand="candy"` on the web, `palettes.candy` and `<ThemeProvider brand="candy">` in React Native. Passes the contrast and chart palette checks like the other brands. The pink is one step deeper than Bola Live's `#ff3d8b` so white text on primary buttons passes 4.5:1.

## 0.3.0

### Minor Changes

- [#15](https://github.com/raihanevanza/rupa/pull/15) [`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `ledger` (ledger green on pale sage) for BukuBesar, in light and dark: `data-brand="ledger"` on the web, `palettes.ledger` and `<ThemeProvider brand="ledger">` in React Native. Passes the contrast and chart palette checks like the other brands.

- [#15](https://github.com/raihanevanza/rupa/pull/15) [`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `mono` (near-black on white, no tint) for the portfolio site, in light and dark: `data-brand="mono"` on the web, `palettes.mono` and `<ThemeProvider brand="mono">` in React Native. Passes the contrast and chart palette checks like the other brands.

## 0.2.2

### Patch Changes

- [#13](https://github.com/raihanevanza/rupa/pull/13) [`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993) Thanks [@raihanevanza](https://github.com/raihanevanza)! - npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.
  
  React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.

## 0.2.1

### Patch Changes

- [#10](https://github.com/raihanevanza/rupa/pull/10) [`87700e6`](https://github.com/raihanevanza/rupa/commit/87700e60f80a8ea8e6fb9355110db942014fcbad) Thanks [@raihanevanza](https://github.com/raihanevanza)! - npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.
  
  React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.

## 0.2.0

### Minor Changes

- [#8](https://github.com/raihanevanza/rupa/pull/8) [`154e46c`](https://github.com/raihanevanza/rupa/commit/154e46cb9e8dca7194adf9f25c981e36727ab912) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `latte` (cream, apricot, caramel, espresso) for Dompet Rumah, in light and dark: `data-brand="latte"` on the web, `palettes.latte` and `<ThemeProvider brand="latte">` in React Native. Passes the contrast and chart palette checks like the other brands.

## 0.1.0

### Minor Changes

- [`ec8d12f`](https://github.com/raihanevanza/rupa/commit/ec8d12f868bd28893bf0226aacec7379caeca168) Thanks [@raihanevanza](https://github.com/raihanevanza)! - First release: multi-brand tokens (violet, signal) with light and dark modes for CSS, Tailwind v3/v4, JS, and React Native; 24 accessible React components and ThemeProvider.
