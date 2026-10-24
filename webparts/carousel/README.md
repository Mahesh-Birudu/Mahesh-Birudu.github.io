# Dev Stories Carousel

Source lives in `webparts/carousel`, separate from the extension and search projects. Toolchain: SPFx 1.23.0, React 17.0.1, Fluent UI 8.125.8, TypeScript 5.8.3, Heft 1.3.3, Node 22.23.3.

## Layout and content
Left: category, heading, description and CTA. Centre: large image, slide dots and brand corner accent. Right: up to twelve Fluent-icon quick-access tiles (nine sample links). Dev Stories red #cb202d, charcoal #2d2d2d, offwhite #f4f4f2. The bundled code-native glass-panel illustration needs no external image service. Supply an image URL and alt description for photography. Sample anchors are placeholders to replace before publishing.

## Configure
1. Add **Dev Stories Carousel** to a SharePoint page, preferably a full-width or one-column section.
2. While editing the page, site owners see **Edit** at the top right (Manage Web and Manage Permissions).
3. **Slides**: add, remove or reorder up to twelve slides; set label, title, description, image URL/description, button text and destination.
4. **Quick access**: add, reorder or remove up to twelve tiles; set title, URL and Fluent icon name.
5. **Playback**: rename Quick access; optionally enable rotation at 5–30 seconds. Rotation defaults off, pauses on hover/focus and respects reduced-motion preferences. Previous/next, slide dots and pause remain keyboard accessible.
6. Save changes in the editor, then save/publish the SharePoint page. Cancel discards the editor draft. Load sample content only changes the draft until saved.

Configuration is static web-part properties, not a SharePoint list. Published visitors cannot edit. SharePoint page edit permissions enforce page persistence. Page version history provides recovery. Preview changes are memory-only.

## Build
`npm ci`, `npm test`, `npm run build`, `npm run package` using Node 22.22.2–22.x. Upload `sharepoint/solution/dev-stories-carousel.sppkg` to the app catalog, deploy, then add the web part to a page. No tenant extension registration is required.

`npm run preview:build` then `npm run preview` serves http://127.0.0.1:4190. Responsive breakpoints reorganize the quick links below the feature at tablet widths and stack the slide on mobile. Native SharePoint data and other projects are unaffected.

## Background image frame (1.0.1.0)
The carousel is framed by a bundled SVG background image across the top and both sides, matching the reference composition. The previous thin border is removed. Under Playback, Background image URL accepts a replacement image; leave blank for the packaged Dev Stories artwork. Saved slide/quick-link content remains compatible.
