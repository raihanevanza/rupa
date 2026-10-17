---
'@rupa-ui/react': patch
---

`Dialog` and `ConfirmDialog` opened without a `trigger` now return focus to the element that opened them. Icons passed inside `Button` children stay on the text line under CSS resets that make `svg` a block (Tailwind preflight). Both found in AgentGate.
