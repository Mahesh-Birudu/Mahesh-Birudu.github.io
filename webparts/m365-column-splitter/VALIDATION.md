# Version 2 validation — 20 October 2026

## Verified locally

- TypeScript typecheck, Heft production build and SPPKG package validation pass.
- All 20 model/DOM tests pass. Model tests cover arbitrary names and fractional widths, repeated-container accounting, unique targets, width totals, consistent shared group settings, ordering, labels, availability and safe class identifiers.
- DOM tests cover node/handler preservation, grouping/stacking, hidden-target expansion, restoring placement/styles, retained unselected content, exclusive ownership, native Flexible positioning, edit transitions, nested-target rejection, removed-node recovery and media-change cleanup.
- Browser preview configured through the UI: Navigation and Refinement options grouped into user-entered `Navigation tools` at 27.5%; Results in `People workspace` at 72.5%. These are review examples, not defaults.
- Browser hide/show used custom `Hide tools` / `Show tools` labels. Hidden nodes remain connected; the remaining column expands. Existing click counter retained its state and handler. Restore returned all three original nodes to their original page sections; no browser console errors in that check.

## Not yet verified

Version 2 has not been uploaded or deployed. Live SharePoint discovery, native editor modal placement, PnP dynamic connections after reparenting, third-party resize behavior and repeated native rerenders require a separate integration test after source review. Existing version-1 or native Flexible-section test results must not be treated as validation of version 2.

No SharePoint mutations, GitHub uploads, commits or pushes during this version-2 development step.
