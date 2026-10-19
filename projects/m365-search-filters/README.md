# Microsoft 365 Search Filters

A separate SPFx **library component** for PnP Modern Search 4.25.0, built with Heft, TypeScript and React. A soft accordion panel follows the supplied visual reference; selected chips, option search, counts and an accessible mobile drawer are owned by React. PnP owns the query, refiners and submitted selections.

## Folder guide

| Path | Responsibility |
| --- | --- |
| `src/components/FilterPanel.tsx` | Desktop panel, mobile dialog, Apply and Clear all |
| `src/components/FilterSection.tsx` | Collapsible options and option search |
| `src/components/SelectedFilters.tsx` | Removable selection chips |
| `src/webComponents/SearchFiltersWebComponent.tsx` | PnP attributes, filter events and React lifecycle |
| `src/libraries/searchFilters/` | Registered filter layout and reusable filter control |
| `templates/soft-filters.html` | External Handlebars option for Site Assets |
| `../m365-search-brand/` | Shared visual tokens for filters, profile results and future verticals |
| `preview/` | Interactive synthetic directory using production React components |
| `tests/` | Selection, Apply/Clear, disabled values, escaping, accordion and mobile focus tests |

## Prerequisites and build

- Node **22.23.3**, npm **10.9.9**, SPFx **1.23.0**, TypeScript **5.8.3**, React **17.0.1**.
- PnP Modern Search **4.25.0**, `@pnp/modern-search-extensibility` **2.2.0**.
- Clone the repository with sibling `m365-search-brand` and `m365-profile-cards` folders; local package dependencies rely on that structure.

```sh
cd projects/m365-search-filters
npm ci
npm run typecheck
npm test
npm run build
npm run package
npm run preview:build
npm run preview
```

Preview: `http://127.0.0.1:4185`. Mobile review frame: `/mobile.html`. The demo search is a simulation; the live native SharePoint header remains separate. The SPPKG is emitted under `sharepoint/solution/`.

## Connect to PnP Search

1. Upload and deploy `m365-search-filters.sppkg` to the site app catalog. This library requests **no additional Microsoft Graph permissions**.
2. Add **PnP – Search Filters** beside the existing Search Results. Use a narrow left column for filters and a wider results column.
3. In Search Filters' extensibility configuration, register library GUID **`9547b485-2a8a-43e9-88a4-9aa8e121d1d2`** and enable it.
4. Choose **M365 • Soft filter panel** from the available filter layouts. Alternatively select Custom and point its external template URL to the uploaded `templates/soft-filters.html` in Site Assets.
5. Configure each filter with its actual **refinable managed property**, display label and **M365 • Soft checkbox options** template. Enable multi-select and counts. Set OR within a field and AND between fields for the normal directory experience.
6. Connect Search Filters to the profile Search Results to obtain refiner values. In Search Results enable **Connect to a filters Web Part** and select this Search Filters instance. Keep its native header query connection (`Page environment → Query string → Query parameters → k`, default `*`).
7. Publish and validate a selection, Apply, Clear all, a native-header search, pagination after filtering and a mobile drawer.

The custom panel also accepts standard checkbox refiner configurations. Date, taxonomy and hierarchical controls are outside v1; do not select this panel for those controls yet. The reusable `m365-filter-options` control can be used independently in PnP's builtin layouts.

## People data requirements

Suggested labels: **Department, Job title, Company, Office**. These are labels, not guaranteed managed-property names. Inspect the tenant search schema and actual refiner response before mapping them. A property being retrievable or visible in a Graph profile does not make it refinable. Configure appropriate crawled-property mappings/reindexing with an administrator when necessary. No tenant GUIDs, credentials or fake refiner values are built into this package.

Teams presence is fetched separately by the profile project and is **not a searchable refiner** in this project. It must not be offered as an indexed Online/Offline filter.

## Branding and upgrade boundary

The shared `@mahesh/m365-search-brand` package defines the font, primary color, surfaces, borders, radius and focus color. Both production projects consume it. Site theme colors take precedence, with blue/pale-blue fallbacks. Only `m365-*` classes are styled. No SharePoint header selectors, PnP internal CSS selectors, MutationObserver patches or modifications to the PnP package are used.

The full panel emits the documented `EVENT_FILTER_UPDATED`, `EVENT_FILTER_APPLY_ALL` and `EVENT_FILTER_CLEAR_ALL` events with the originating Web Part instance ID. Multi-select changes remain pending until Apply. Clear all clears both pending and submitted filters. Native SharePoint query terms remain untouched. Future verticals should consume the same brand package; verticals are not implemented in v1.

Supported extension APIs reduce upgrade coupling but still require compatibility checks and regression tests when PnP/SPFx change. Documentation: [custom filter controls](https://microsoft-search.github.io/pnp-modern-search/extensibility/custom_filter_control/), [custom layouts](https://microsoft-search.github.io/pnp-modern-search/extensibility/custom_layout/).

## Validation boundaries

The local preview uses synthetic data and real React components. Tenant refiner mappings, live PnP event integration and deployment must be verified separately. See `VALIDATION.md` for the current build result. No existing SharePoint page is changed by building this project.

The filter UI retains drawer, accordion, option-search and checkbox-focus state across PnP template replacements. This state is transient, scoped to the Web Part instance, and bounded in memory. Automated filter tests pin jsdom 26.1.0, matching the locally validated React 17 DOM runtime.
