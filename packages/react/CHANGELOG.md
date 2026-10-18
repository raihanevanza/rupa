# @rupa-ui/react

## 0.6.0

### Minor Changes

- [#13](https://github.com/raihanevanza/rupa/pull/13) [`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New `MultiSelect`: choose several options from a list you can search, e.g. to filter a table or a list screen. It has Select all and Clear, a `searchable={false}` mode for short lists, and replaceable text through `labels`.
  
  React: the search box is a combobox over a multi-select listbox (arrows move, Enter toggles, Esc closes and returns focus), and `name` submits the choices with a form. `Field` passes `labelId` to its render function, so custom controls can name themselves with `aria-labelledby`.
  
  React Native: the trigger opens a bottom sheet with a search box and a checkbox per option. Choices apply as they are tapped; Done, the backdrop, or Android back close it. Screen readers hear the label, the choice, and the count, and the number of matches after a search.

### Patch Changes

- [#13](https://github.com/raihanevanza/rupa/pull/13) [`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993) Thanks [@raihanevanza](https://github.com/raihanevanza)! - npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.
  
  React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.
- Updated dependencies [[`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993)]:
  - @rupa-ui/tokens@0.2.2

## 0.5.0

### Minor Changes

- [#12](https://github.com/raihanevanza/rupa/pull/12) [`bed7322`](https://github.com/raihanevanza/rupa/commit/bed73221bbeed1ba2a424d795cf09b92b4106b37) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New `Meter` for how much of a known total is used (a budget, a goal), which grows from empty when it appears, and motion helpers for app code on the motion tokens: `rupa-enter` for a new row or card, `rupa-pop` for a status that just changed, `rupa-grow-x` for a bar that fills. All of them finish at once when the user prefers reduced motion.

### Patch Changes

- [#10](https://github.com/raihanevanza/rupa/pull/10) [`87700e6`](https://github.com/raihanevanza/rupa/commit/87700e60f80a8ea8e6fb9355110db942014fcbad) Thanks [@raihanevanza](https://github.com/raihanevanza)! - npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.
  
  React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.
- Updated dependencies [[`87700e6`](https://github.com/raihanevanza/rupa/commit/87700e60f80a8ea8e6fb9355110db942014fcbad)]:
  - @rupa-ui/tokens@0.2.1

## 0.4.0

### Minor Changes

- [#8](https://github.com/raihanevanza/rupa/pull/8) [`154e46c`](https://github.com/raihanevanza/rupa/commit/154e46cb9e8dca7194adf9f25c981e36727ab912) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `latte` (cream, apricot, caramel, espresso) for Dompet Rumah, in light and dark: `data-brand="latte"` on the web, `palettes.latte` and `<ThemeProvider brand="latte">` in React Native. Passes the contrast and chart palette checks like the other brands.

### Patch Changes

- Updated dependencies [[`154e46c`](https://github.com/raihanevanza/rupa/commit/154e46cb9e8dca7194adf9f25c981e36727ab912)]:
  - @rupa-ui/tokens@0.2.0

## 0.3.1

### Patch Changes

- [#4](https://github.com/raihanevanza/rupa/pull/4) [`eca595d`](https://github.com/raihanevanza/rupa/commit/eca595d540baec771f6d3124da11c7e230d240f3) Thanks [@raihanevanza](https://github.com/raihanevanza)! - `Dialog` and `ConfirmDialog` opened without a `trigger` now return focus to the element that opened them. Icons passed inside `Button` children stay on the text line under CSS resets that make `svg` a block (Tailwind preflight). Both found in AgentGate.

## 0.3.0

### Minor Changes

- [#2](https://github.com/raihanevanza/rupa/pull/2) [`f2fe969`](https://github.com/raihanevanza/rupa/commit/f2fe969a084fb7a337fb7d04da01927be7b00e52) Thanks [@raihanevanza](https://github.com/raihanevanza)! - Add `Input`, `Textarea`, and `NativeSelect`: bare form controls with the TextField look for apps that supply their own label and layout. Add `pulse` to `Badge` for live states. Both found while migrating AgentGate to Rupa.
  
  Fix `StateView` showing its default English description when `description={null}` is passed.

## 0.2.0

0.1.0 and 0.1.1 were taken by an unpublished 2022 package with the same name, so the first release is 0.2.0.

### Minor Changes

- [`ec8d12f`](https://github.com/raihanevanza/rupa/commit/ec8d12f868bd28893bf0226aacec7379caeca168) Thanks [@raihanevanza](https://github.com/raihanevanza)! - First release: multi-brand tokens (violet, signal) with light and dark modes for CSS, Tailwind v3/v4, JS, and React Native; 24 accessible React components and ThemeProvider.

### Patch Changes

- Updated dependencies [[`ec8d12f`](https://github.com/raihanevanza/rupa/commit/ec8d12f868bd28893bf0226aacec7379caeca168)]:
  - @rupa-ui/tokens@0.1.0
