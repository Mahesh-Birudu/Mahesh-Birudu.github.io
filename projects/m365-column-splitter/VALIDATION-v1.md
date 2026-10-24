# Validation — 20 October 2026

## Build

- PASS: four layout tests with Node 22.23.3, including percentage validation, adjacent resizing and minimum-width limits across 401 divider positions.
- PASS: TypeScript 5.8.3 typecheck, Heft production build and SPPKG package validation (SPFx 1.23.0).
- PASS: local preview bundle and keyboard interaction.
- Windows npm sparse-folder creation failed with EPERM. Dependencies were recovered from exact integrity-checked package-lock archives using npm's pacote; the interrupted webpack archive was restored before the successful full build.

## Live SharePoint

URL: https://devstories.sharepoint.com/sites/metrics/SitePages/Column-Splitter-Test.aspx

- Package `m365-column-splitter.sppkg`, solution version 1.0.0.0, enabled for individual site installation and added to Metrics only.
- PASS: default three-column layout 20 / 50 / 30 renders.
- PASS: ArrowRight on the first divider changes 20 / 50 / 30 to 21 / 49 / 30.
- PASS: dragging the second divider changes the adjacent pair while retaining the first column and total.
- PASS: resized layout 21 / 45.5636 / 33.4364 persisted after publish and browser reload.
- PASS: published mode removes interactive separator controls.
- PASS: invalid 20 / 50 / 20 shows a validation message and retains the last valid rendered layout.
- PASS: switching to two columns renders 30 / 70; switching back restores 20 / 50 / 30.
- PASS: SharePoint's built-in Mobile preview produces one 296px column; all three children have equal widths and increasing vertical positions. Grid scrollWidth equals its width, with no horizontal overflow.
- Final review page restored to 20 / 50 / 30 with explanatory sample content. Content is local to this web part; PnP Filters/Results are not embedded or connected.

## ModernPnp coexistence test

At the user's later request, added a separate splitter instance below the existing PnP Filters and Results on https://devstories.sharepoint.com/sites/metrics/SitePages/ModernPnp.aspx and published the page. The existing PnP web part instances and settings were retained.

- PASS: keyboard resizing changes 20 / 50 / 30 to 21 / 49 / 30; Reset restores the requested default.
- PASS: Department = CDBX ModernWorkPlace still filters the existing results to Krishna with the splitter present.
- PASS: Clear all restores the directory. Final page is unfiltered.
- This is a separate sample layout demonstration; the PnP web parts are not inside the splitter and their native section widths remain unchanged.

No GitHub uploads, commits or pushes. No new Graph permissions or search-schema changes were requested.
