# @rupa-ui/react

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
