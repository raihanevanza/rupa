---
'@rupa-ui/react-native': minor
'@rupa-ui/react': minor
---

React Native: new `TextField` and `ChipGroup`, and a ConfirmDialog that works with a field inside.

- `TextField` has the web props: `label`, `hint`, `error`, `required`, `hideLabel`, `prefix`, and `suffix`, plus `multiline` for a text area. The input speaks the label, the required state, and the error or hint; its `ref` and `testID` point to the TextInput. With `hideLabel`, an icon `prefix`, and a clear button as `suffix`, it is also the search box.
- `ChipGroup` is a single choice from many options as pills, e.g. a status filter above a list: one row that scrolls sideways (the chosen chip scrolls into view, without animation under Reduce Motion; `inset` lines it up with the screen padding) or `wrap` for several rows. It is a radio group for screen readers. Use Segmented for 2–5 short options.
- `ConfirmDialog` moves above the keyboard, so a note field and the buttons stay visible, and Confirm works on the first tap while the keyboard is up.

Both: `ConfirmDialog` takes `confirmDisabled`, e.g. to hold Reject until a required note is long enough.
