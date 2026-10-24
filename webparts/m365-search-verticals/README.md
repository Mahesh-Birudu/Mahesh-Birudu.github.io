# M365 Search Verticals

A separate React/SPFx project for the branded search center. It implements the PnP Modern Search **4.25.0** vertical dynamic-data contract, so the existing Search Results web part can discover and connect to it. This is a custom implementation, not a fork of the full PnP search-parts solution.

## Matched toolchain

| Dependency | Version |
| --- | --- |
| Node | 22.23.3 (supported range >=22.22.2 <23) |
| SPFx | 1.23.0 |
| React / ReactDOM | 17.0.1 |
| TypeScript | 5.8.3 |
| Heft | 1.3.3 |
| Fluent UI React | 8.125.8 |
| PnP Modern Search host | 4.25.0 |

PnPjs is not a search-vertical UI framework. This component does not execute SharePoint/Graph queries: it publishes the selected category to PnP Search Results, which retains query execution, security trimming, paging and refiners. There is no unnecessary data-fetching dependency.

## Configuration

- Title, description, visibility toggles and optional background-image URL; a bundled vector banner is the default.
- Configure verticals: add/remove/reorder rows; tab name, value, Fluent UI icon, description, link URL and opening behavior.
- Stable immutable row keys preserve connections when names or order change. Publish the page after saving configuration.
- Default tab; selected-tab query parameter (default `v`); search parameter (default `k`, fallback `q`). URL selection accepts a key or tab name. A tab click updates only the selected-tab parameter, preserving query/filter parameters and fragments. Browser back/forward restores selection.
- Optional wildcard (`*` or no query) hide/fallback tabs. These are author-configured; no special tab names are hardcoded.
- Clear connected filters on vertical change uses PnP's existing contract flag.
- Tabs support keyboard navigation with Left/Right/Home/End; Enter/Space selects. Narrow screens scroll tabs horizontally.
- Links accept HTTP/HTTPS and relative URLs only. New-tab links include `noopener noreferrer`.

Production starts with **no configured tabs**. Names in the preview are examples only.

## Connect to existing Search Results

1. Add **M365 Search Verticals** to the search page and configure your tabs.
2. In PnP **Search Results**, enable the connection to a Search Verticals web part.
3. Select this web part as the source. It exposes property `pnpSearchVerticalsWebPart` with `selectedVertical`, `clearFiltersOnVerticalChange` and `verticalsConfiguration`.
4. Assign the appropriate tab(s) to each results instance, or use the existing `{verticals.value}` token in the query template.
5. Keep the existing Search Filters connected to the matching results instance.

All results instances on a page must be configured deliberately; merely adding a visual tab does not invent a data source or query. UI visibility is not an authorization boundary.

## Branding and boundaries

Uses `../../libraries/m365-search-brand`: red #cb202d, charcoal #2d2d2d, off-white #f4f4f2, Segoe UI and Fluent UI icons. Styles are scoped to this component. It does not override SharePoint's search-box DOM, inject arbitrary global CSS, or modify PnP internal markup. Native SharePoint search continues through the already configured query-string integration.

This initial version does not claim complete PnP feature parity: arbitrary PnP URL/value tokens and audience targeting are not implemented. Literal tab values/URLs are supported. Group-based security remains in the results data source.

## Build and review

```powershell
npm ci
npm test
npm run build
npm run package
npm run preview:build
npm run preview
```

Package: `sharepoint/solution/m365-search-verticals.sppkg`. Local preview: http://127.0.0.1:4186.

No GitHub upload or SharePoint deployment is part of this source-development step.

## Reference contract

- [PnP verticals documentation](https://microsoft-search.github.io/pnp-modern-search/usage/search-verticals/)
- [Pinned 4.25.0 vertical web part](https://github.com/microsoft-search/pnp-modern-search/blob/4.25.0/search-parts/src/webparts/searchVerticals/SearchVerticalsWebPart.ts)
- [Pinned 4.25.0 results consumer](https://github.com/microsoft-search/pnp-modern-search/blob/4.25.0/search-parts/src/webparts/searchResults/SearchResultsWebPart.ts)

### Live Metrics validation
The web part was deployed and connected on ModernPnp on 2026-10-21. Search Results uses `{searchTerms} {verticals.value}` and reads query parameter `k`. The live page retains filters across verticals: PnP 4.25.0's clear-on-change flag cleared the query but left stale filter UI, so this optional setting is OFF on Metrics. Switching tabs, applying/clearing filters, combined keyword queries and profile details were verified. See `outputs/search-verticals-live-validation.md` in the workspace for the saved keys and evidence.
