# @rupa-ui/tokens

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
