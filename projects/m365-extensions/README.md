# Dev Stories extensions

One SPFx Application Customizer package, with separate feature subprojects under src/modules:

- suiteNavigation: isolated Microsoft suite-bar integration and lifecycle recovery.
- userProfileCallout: list-driven direct links and grouped dropdowns.
- stock: configurable company feed, validation, compact ticker, configuration form, and reusable right-side chart drawer.

src/extensions/companyHeader contains the SPFx registration and feature orchestration. The existing package identity is retained to upgrade the installed app instead of creating a duplicate.

## Compatibility and rollback
The suite-bar integration is unsupported by Microsoft and depends on documented-in-code DOM IDs, not generated CSS classes. Microsoft can change those IDs or the layout. The adapter observes navigation rebuilds, removes its own styles and controls on disposal, and leaves the native bar alone when the required anchors are absent. This reduces risk; it is not a guarantee against Microsoft changes. Extension property disableSuiteIntegration=true disables it. The native account button and SharePoint product label are hidden only while the custom controls are mounted; disposing restores them. No second Top-placeholder header is rendered.

## Toolchain
SPFx 1.23.0, PnPjs 4.22.0, React 17.0.1, Fluent UI 8.125.8, TypeScript 5.8.3, Heft 1.3.3, Node 22.23.3. Direct versions match the recent search projects.

## Profile callout
Current-site UserProfileLinks needs Title, Url (hyperlink), and GroupByText columns. Blank groups render direct links; matching group labels form dropdowns. Rows retain ID order, unsafe URLs are rejected, and list permissions apply. listTitle is configurable in extension properties.

## Company stock configuration
Click the stock ticker, then Configure stock API. Both configuration buttons are shown only to users with owner-level Manage Web and Manage Permissions rights. The server rechecks these rights before saving. Enter company name, symbol, ISO currency, public HTTPS API or server-side proxy URL, and source/frequency label. Test & save verifies the returned symbol, quote values, and dated history before saving. A failed test leaves current settings in place. Returning to Reference demo (IBM) restores the public daily demonstration feed.

Settings are stored as a StockConfig row in the current site's DevStoriesExtensionSettings list, Configuration multiline column. The list uses unique permissions. Existing owner-level assignments retain control; non-owner write assignments are downgraded to Read. Readers can load settings, but SharePoint blocks direct list/API writes by members. The owner migration runs when the updated extension initializes for an owner. No private keys belong in this list. Provider-specific response mapping, authentication, and private keys must remain in a server-side proxy. The browser requests omit cookies and authorization headers; the endpoint must permit CORS and return JSON.

Expected response (illustration only):

```json
{"quote":{"symbol":"COMPANY","price":123.45,"change":1.23,"percent":1.01,"date":"2026-10-20"},"history":[{"date":"2026-10-19","close":122.22},{"date":"2026-10-20","close":123.45}]}
```

All company labels, prices, currency formatting, and chart values use the configured feed. IBM is reference demo data, not the customer's company stock. Data is loaded on page initialization or saving settings; it is not streamed. The IBM demo requests use a fifteen-minute in-memory cache.

## Build and deploy
npm ci; npm run build; npm run package. Deploy sharepoint/solution/m365-company-header.sppkg to the catalog and upgrade the app on Metrics. Version 1.4.2.0 retains the existing solution/component IDs. It is not tenant-wide activation. npm test runs validation and adapter lifecycle tests. Preview: npm run preview:build; npm run preview (port 4187).


## Owner navigation settings
Open the custom profile menu and select the gear button, Configure navigation. The form configures nine Microsoft IDs or classes without changing code. Use one simple #id or .class selector per target, then Test targets. All targets must match exactly one element and the expected container structure before Save is allowed. Restore defaults resets only the form until saved.

The Note in the form explains F12, Ctrl+Shift+C, selecting the element in browser Developer Tools, and preferring stable IDs over hashed classes. Navigation settings are stored as NavigationConfig in DevStoriesExtensionSettings. If Microsoft changes the host IDs so the menu cannot mount, owners can edit that list's Configuration JSON directly to repair the selectors. A developer may still be needed if Microsoft changes the navigation structure rather than just selectors.

## Intranet menu and hidden site header — version 1.3.0.0
The menu bar uses the supported SPFx Top placeholder and appears immediately below the Microsoft bar. A fresh site starts with no links; only owners see Edit on the right. Owners can add main/child items, select a parent, choose a Fluent icon, enter URLs, reorder siblings, and remove branches. Up to four levels and 150 items are supported. Load sample links prepares four sample dropdowns in the editor; Save menu publishes them. Sample links are examples and should be replaced for production.

MenuConfig is stored in the same owner-protected settings list. Non-owners can use published links but cannot edit them. Parent items open a dropdown; leaf items navigate to their URL. On narrower screens nested menus expand within the dropdown to avoid horizontal overflow.

Owner profile settings now group selectors into Microsoft top navigation, Branding — INTRANET label, and Hidden SharePoint site section. Company logo container controls where INTRANET is appended. Native site header and navigation defaults to #spSiteHeader, which hides the site title/navigation/logo/group-membership strip without hiding page editing commands. The selector remains owner-configurable. Suite-bar/site-header DOM integration remains unsupported by Microsoft; own controls are removed and native visibility restored on disposal.


## Additional hidden sections — version 1.4.0.0
Owner navigation configuration now includes separate headings for Hidden app rail — Discover / Publish / Build / OneDrive (#sp-appBar), and Hidden hub navigation — Metrics / Add link (.ms-HubNav). Both accept replacement simple IDs or classes without code changes. Existing saved configurations automatically receive these defaults while preserving previous settings.

The hub row is only rendered at wider breakpoints. Test targets reports when it is absent at the current screen size; check its selector on a desktop-width page. The adapter watches for responsive navigation rebuilds and hides the row when it appears. The app rail is removed from the layout rather than leaving its sidebar/bottom-bar space. Hiding is scoped to these targets and reversed on disposal. Page authoring commands remain available.

## Startup visibility — version 1.4.1.0
The adapter starts synchronously when the Application Customizer initializes, before settings-list requests and owner permission migration. Public navigation selectors are cached per web in localStorage so an owner's replacement selectors can be applied immediately on later refreshes. SharePoint settings refresh the cache on load/save; storage failures fall back to defaults. No user records or stock credentials are cached here. Owner migration continues in the background. This removes the settings-network delay, but SPFx cannot control frames rendered before its extension bundle executes; a completely flash-free first browser frame is not guaranteed.

## Flush page frame — version 1.4.2.0
The Microsoft .sp-pageLayout-horizontalNav frame inside #spPageChromeAppDiv has zero outer margin, border and corner radius, and no shadow. This removes the top/right gutter below the suite bar while retaining the intranet menu's internal padding and authoring commands. The rule lives in the adapter's disposable style and is removed when the extension is disabled/disposed.
