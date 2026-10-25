# @rupa-ui/react

## 0.10.0

### Minor Changes

- [#21](https://github.com/raihanevanza/rupa/pull/21) [`e280ad2`](https://github.com/raihanevanza/rupa/commit/e280ad21802845802130a4219c8e777bd43bef6a) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `iris` (electric violet on lavender) for Patungan, in light and dark: `data-brand="iris"` on the web, `palettes.iris` and `<ThemeProvider brand="iris">` in React Native. The dark primary is `#7759f4` instead of Patungan's `#7c60f5`, which was 4.33:1 under white text.

### Patch Changes

- Updated dependencies [[`e280ad2`](https://github.com/raihanevanza/rupa/commit/e280ad21802845802130a4219c8e777bd43bef6a)]:
  - @rupa-ui/tokens@0.5.0

## 0.9.0

### Minor Changes

- [#20](https://github.com/raihanevanza/rupa/pull/20) [`06bdeba`](https://github.com/raihanevanza/rupa/commit/06bdeba395ff14aa83710c0e6ba1aa18a89ac0c1) Thanks [@raihanevanza](https://github.com/raihanevanza)! - Components from the Bola Live migration:
  
  - `Button asChild`, `Chip asChild`, and `Card asChild` put the look on a router link instead of a `<button>` or `<section>`.
  - `Chip` (a toggle pill, or a link filter) and `ChipGroup` (a single choice from many pills, like the React Native one).
  - `NumberStepper`: a whole number picked with − and +, a WAI-ARIA spin button.
  - `Countdown`: time left until a moment, on one shared clock; `now` freezes it for screenshots.
  - `CompareBars`: two things side by side per measure, growing from a center line.
  - `Stat`: one number with its label, in the status tones.
  - `SectionHeading`: a section title with an icon tile and a "See all" slot. `PageHeader` gets an `icon`, and `StateView` an `illustration` for a larger picture than the icon circle.
  - `ChartFrame`, `ChartPlot`, `ChartTooltip`, and `useElementWidth`: the frame, legend, tooltip, and data table around your own SVG charts.
  
  `Table` is no longer a client module, so a Next.js Server Component can pass its columns `render` functions (it has no hooks or handlers). The package entry is not a client module either; each component keeps its own `'use client'`.
  
  The full-bundle size budgets grow by 2 kB for these; importing one component costs the same as before.

- [#20](https://github.com/raihanevanza/rupa/pull/20) [`06bdeba`](https://github.com/raihanevanza/rupa/commit/06bdeba395ff14aa83710c0e6ba1aa18a89ac0c1) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `candy` (candy pink on warm cream, deep plum ink) for Bola Live, in light and dark: `data-brand="candy"` on the web, `palettes.candy` and `<ThemeProvider brand="candy">` in React Native. Passes the contrast and chart palette checks like the other brands. The pink is one step deeper than Bola Live's `#ff3d8b` so white text on primary buttons passes 4.5:1.

### Patch Changes

- Updated dependencies [[`06bdeba`](https://github.com/raihanevanza/rupa/commit/06bdeba395ff14aa83710c0e6ba1aa18a89ac0c1)]:
  - @rupa-ui/tokens@0.4.0

## 0.8.0

### Minor Changes

- [#18](https://github.com/raihanevanza/rupa/pull/18) [`0efffca`](https://github.com/raihanevanza/rupa/commit/0efffcacc123a57cd2bb19445cc7e442a32476a7) Thanks [@raihanevanza](https://github.com/raihanevanza)! - React Native: new `TextField` and `ChipGroup`, and a ConfirmDialog that works with a field inside.
  
  - `TextField` has the web props: `label`, `hint`, `error`, `required`, `hideLabel`, `prefix`, and `suffix`, plus `multiline` for a text area. The input speaks the label, the required state, and the error or hint; its `ref` and `testID` point to the TextInput. With `hideLabel`, an icon `prefix`, and a clear button as `suffix`, it is also the search box.
  - `ChipGroup` is a single choice from many options as pills, e.g. a status filter above a list: one row that scrolls sideways (the chosen chip scrolls into view, without animation under Reduce Motion; `inset` lines it up with the screen padding) or `wrap` for several rows. It is a radio group for screen readers. Use Segmented for 2–5 short options.
  - `ConfirmDialog` moves above the keyboard, so a note field and the buttons stay visible, and Confirm works on the first tap while the keyboard is up.
  
  Both: `ConfirmDialog` takes `confirmDisabled`, e.g. to hold Reject until a required note is long enough.

## 0.7.0

### Minor Changes

- [#15](https://github.com/raihanevanza/rupa/pull/15) [`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `ledger` (ledger green on pale sage) for BukuBesar, in light and dark: `data-brand="ledger"` on the web, `palettes.ledger` and `<ThemeProvider brand="ledger">` in React Native. Passes the contrast and chart palette checks like the other brands.

- [#15](https://github.com/raihanevanza/rupa/pull/15) [`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New brand `mono` (near-black on white, no tint) for the portfolio site, in light and dark: `data-brand="mono"` on the web, `palettes.mono` and `<ThemeProvider brand="mono">` in React Native. Passes the contrast and chart palette checks like the other brands.

### Patch Changes

- Updated dependencies [[`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442), [`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442)]:
  - @rupa-ui/tokens@0.3.0

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
