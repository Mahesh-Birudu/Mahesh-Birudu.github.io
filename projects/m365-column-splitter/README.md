# M365 Page Column Controller — version 2

SPFx 1.23, React 17, TypeScript 5.8, Heft. Current package **2.0.1.0**, validated on the development intranet and published with the complete source suite. Earlier SharePoint screenshots and `VALIDATION-v1.md` concern the retired internal-component demo, not this controller.

## Configuration

Add the controller to a full-width or one-column content area. In page edit mode, open **Manage columns** from the web part or its property pane. The editor discovers existing page web parts by instance ID and title. It excludes the controller itself and targets already owned by another controller. Refresh the list if the page has changed.

Each row defines a selected web part, a user-entered container name, percentage width, column order and stack order. There are **no preset container names, widths or assignments**.

- Names are case-sensitive, with surrounding whitespace removed.
- Rows with the same name stack together. They must agree on width and column order.
- Each unique container width is counted once; the total must be 100%.
- A web part may appear only once. Column order is unique across containers; stack order is unique within each container.
- Widths accept numbers or a trailing percent sign, including decimals.

Choose any configured container as the optional visibility target. Both button labels and initial visibility are configurable. Hiding it removes its column from layout and redistributes available space across remaining columns, preserving their relative proportions. Showing it restores the configured proportions. These reader actions affect only the current rendered page, not saved SharePoint configuration.

The gap and mobile breakpoint are configurable. At narrow viewport widths, visible containers stack in column order. Percentages divide content space after gaps. Save the dialog, then save/publish the page to persist the configuration.

## Runtime and compatibility

This version rearranges **existing web-part DOM nodes**, not sample React cards or iframes. It retains their handlers and restores original positions in edit mode, on disposal, on pagehide, or through **Restore original layout**. It pauses and restores where possible if the native page structure changes. Missing targets fail before any nodes move. Fully selected origin columns are collapsed; columns with unselected content are retained.

The DOM adapter is intentionally isolated in `PageAdapter.ts`. It discovers SharePoint controls by data attributes, with configurable `CanvasSection` and `ControlZone` class fallbacks. Native Flexible control positioning is temporarily normalized and restored. Own styles use the `m365-` prefix; the controller does not overwrite global Microsoft styles.

**This is not a supported Microsoft layout extensibility API.** Custom classes cannot eliminate the dependency on SharePoint's markup. Microsoft updates, page rerenders, focus behavior and web parts that depend on original ancestors can affect it. Third-party web parts may need their own resize support. Saved SPFx connections are not edited, but their behavior after relocation still requires live validation. Do not claim compatibility with every web part or guaranteed immunity to Microsoft updates.

Use one controller per selected set of web parts. Do not select nested parts together. No Graph permissions, tenant credentials, PnPjs calls, HTML injection or external data requests are needed by the controller.

## Develop and review

Use Node 22.22.2 or newer in the 22.x line. Keep the sibling `m365-search-brand` folder for the shared design tokens.

```sh
npm ci --legacy-peer-deps
npm test
npm run typecheck
npm run build
npm run package
npm run preview:build
```

Serve `preview/` using a local HTTP server. The preview starts with no assignments and uses independent mock page web parts; configure it through the same editor. It is not a SharePoint integration test. Package output: `sharepoint/solution/m365-column-splitter.sppkg` (version 2.0.1.0). The component/solution IDs are retained for an eventual reviewed upgrade; legacy version-1 internal-card settings are not migrated into assignments.

Before deployment, review source and test on a separate SharePoint page: existing PnP dynamic connections, partial loading, photos/presence updates, toggling the target, desktop/mobile widths, edit/read transitions, refresh/navigation and exact restoration. The live native Flexible-section migration and its filter-binding repair are separate work; this local development step does not modify that page.
