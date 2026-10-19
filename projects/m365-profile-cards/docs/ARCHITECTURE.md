# Architecture

`People Search → Handlebars → m365-profile-details → BaseWebComponent → ProfileCard (React) → hooks → ProfileService (PnPjs) → Microsoft Graph`

PnP discovers the component via `getCustomWebComponents()`. The wrapper reads `data-*` attributes with `resolveAttributes()`, obtains the SPFx ServiceScope, and mounts React. Disconnect calls `ReactDOM.unmountComponentAtNode`, which runs hook cleanup. Identity changes reset the React subtree. `m365-profile-card` is a compatibility alias with a distinct constructor.

React owns field rendering and escaping, retry state, photo fallback, presence state and popup visibility. Native dialog focus/modal methods are used through a React ref; this is lifecycle integration, not query-selector hydration. There is no `ProfileCardController` and no imperative mutation of profile text nodes.

`ProfileService` uses `graphfi().using(SPFx(...))`, explicit Graph field selection, bounded 60-second in-memory profile/photo caches and no persistent directory data. Presence errors are isolated from profile rendering. PnP paging limits the rendered result set.

The Handlebars file no longer owns internal card HTML. This is a deliberate change from 1.1.0 so React can manage a single consistent UI tree. The public demo bundles the same React components against fictional fixtures; production service code is not used by the demo.

Reference: https://microsoft-search.github.io/pnp-modern-search/extensibility/custom_web_component/
