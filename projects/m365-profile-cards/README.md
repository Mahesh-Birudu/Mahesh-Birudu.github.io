# Microsoft 365 Profile Cards — React + PnPjs

Version 1.2.0. A registered PnP Modern Search custom element mounts React components. Microsoft Graph requests use PnPjs with the signed-in SPFx service scope; no tenant URL, credentials or app secret is embedded.

```text
src/
  components/
    ProfileCard.tsx             Card composition, loading/retry and popup state
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

Compatibility target: SPFx 1.20.0 / build 1.20.2; PnP Search 4.16.0; extensibility 1.20.1; React 17.0.1; PnPjs 3.25.0; Node 18.20.8; TypeScript 4.7.4. Node 18 is an end-of-life compatibility target: use an isolated build environment and match your tenant's installed PnP release before upgrading dependencies.

```powershell
npm ci
npm run typecheck
npm test
npm run preview:build
npm run preview
npm run build
npm run package
```

Package: `sharepoint/solution/m365-profile-cards.sppkg` (solution version 1.2.0.0). See [setup](docs/SETUP.md), [presence](docs/TEAMS-PRESENCE.md), [architecture](docs/ARCHITECTURE.md) and [validation](VALIDATION.md).

The public browser demo uses these same React components with `MockProfileProvider`; it never authenticates against Microsoft 365. Its profiles and Teams states are synthetic. The video records the previous visual version; use the interactive React demo to review 1.2.0.

## Upgrade

Replace the package in the app catalog, update the installed site app if requested, keep the library GUID registered in PnP Search Results, and replace the external Handlebars template with this version. Existing Graph permission approvals must still be present. GitHub publication does not install the package or update Site Assets in a tenant.
