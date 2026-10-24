# Microsoft 365 Profile Cards — React + PnPjs

Version 1.5.1. A registered PnP Modern Search custom element mounts React components. Microsoft Graph requests use PnPjs with the signed-in SPFx service scope; no tenant URL, credentials or app secret is embedded.

```text
src/
  components/
    ProfileCard.tsx             Card composition, loading/retry and slide-out state
    ProfileDetailsDialog.tsx    Accessible native dialog rendered by React
    PresenceBadge.tsx           Teams status presentation
    ProfilePhoto.tsx            Photo and initials fallback
    profileStyles.ts            Scoped component styles
  hooks/
    useProfile.ts               Profile/photo loading and object URL cleanup
    usePresence.ts              Presence refresh and timer cleanup
  services/ProfileService.ts   PnPjs Graph integration and memory cache
  models/Profile.ts            Interfaces, identity validation and presence mapping
  webComponents/
    ProfileCardWebComponent.ts  BaseWebComponent → React mount/unmount
  libraries/profileCards/
    ProfileCardsLibrary.ts     Named custom element registration
```

## Handlebars

Upload `templates/profile-cards.html` to Site Assets. Each search result uses:

```handlebars
<m365-profile-details
  data-user-id="{{item.AccountName}}"
  data-theme-variant="{{JSONstringify @root.theme}}">
</m365-profile-details>
```

React owns card, photo, presence and dialog markup. No `js-profile-*` placeholders or imperative field hydration remain. The template retains grid layout, empty state and PnP pagination. The previous `m365-profile-card` tag remains a compatibility alias, but its old child HTML is replaced by React. Do not expect arbitrary child Handlebars markup to control the React internals.

## Build and test

Compatibility target: PnP Modern Search 4.25.0, SPFx runtime/build rig 1.23.0, extensibility 2.2.0, Heft 1.3.3, PnPjs 4.22.0, Node 22.23.3, npm 10.9.9, TypeScript 5.8.3 and React 17.0.1. Use the exact React version required by SPFx. SPFx 1.23.2 is newer, but the current PnP Search release targets 1.23.0; do not silently change its runtime references. Node 24/26, TypeScript 7 and React 19 are not this SPFx target's supported stack.

```powershell
npm ci
npm run typecheck
npm test
npm run preview:build
npm run preview
npm run build
npm run package
```

Package: `sharepoint/solution/m365-profile-cards.sppkg` (solution version 1.5.1.0). See [setup](docs/SETUP.md), [presence](docs/TEAMS-PRESENCE.md), [architecture](docs/ARCHITECTURE.md) and [validation](VALIDATION.md).

The public browser demo uses these same React components with `MockProfileProvider`; it never authenticates against Microsoft 365. Its profiles and Teams states are synthetic. The video records the previous visual version; use the interactive React demo to review 1.5.1.

## Upgrade

Replace the package in the app catalog, update the installed site app if requested, keep the library GUID registered in PnP Search Results, and replace the external Handlebars template with this version. Existing Graph permission approvals must still be present. GitHub publication does not install the package or update Site Assets in a tenant.

## Downloads and demo

- [SPFx package 1.5.1.0](../../portfolio/projects/m365-profile-cards/downloads/m365-profile-cards.sppkg)
- [Buildable source snapshot](../../portfolio/projects/m365-profile-cards/downloads/source.zip)
- [Captioned visual walkthrough — 1.1.0](../../portfolio/projects/m365-profile-cards/media/demo.mp4)
- Compiled demo is in [the portfolio showcase](../../portfolio/projects/m365-profile-cards/); editable React preview source is in [preview](preview/); run the preview commands above for the interactive version.

This folder contains the SPFx project. Website pages, demo media and downloadable artifacts are under ../../portfolio/.


## Toolchain

Build and packaging use **Heft**, not Gulp. The rig is configured in `config/rig.json`; TypeScript extends the SPFx Heft rig. `npm test` runs the project’s Node-based React behavior tests through tsx. No global Gulp or Heft installation is required.

```powershell
nvm use 22.23.3
npm ci
npm run typecheck
npm test
npm run preview:build
npm run build
npm run package
```

Upgrade the installed PnP Modern Search package to 4.25.0 before deploying this 1.5.1 library into a tenant previously using 4.16.0. GUIDs and Graph scopes remain unchanged. This repository publication does not deploy into SharePoint.

Sources: [Microsoft SPFx compatibility](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility), [Heft migration](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/migrate-gulptoolchain-hefttoolchain-manual), [PnP compatibility](https://microsoft-search.github.io/pnp-modern-search/extensibility/extensibility_compatibility_matrix/).

### Directory layout (1.5.0)
The results use responsive, photo-led cards. Selecting a photo or name opens a native accessible dialog styled as a full-height right-side panel. Escape, the close button, and the backdrop dismiss it; focus returns to the originating card. Profile data, photos and Teams presence still come from the existing Graph/PnP provider. Missing photos use initials.

The decorative SVG banner is bundled locally and uses #cb202d, #2d2d2d and #f4f4f2. Detail rows use Fluent UI icons. All layout selectors belong to this component; no SharePoint canvas selectors are changed. The Handlebars template continues to render `<m365-profile-details>` directly.
