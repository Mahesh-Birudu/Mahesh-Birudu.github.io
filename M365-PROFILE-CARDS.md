# Microsoft 365 Profile Cards + Teams Presence

An SPFx extensibility library for PnP Modern Search. Handlebars supplies the card markup; a registered web component loads directory profiles, photos and Teams presence with PnPjs and Microsoft Graph.

**[Project showcase](https://mahesh-birudu.github.io/m365-profile-cards.html) · [Interactive demo](https://mahesh-birudu.github.io/profile-cards-demo.html) · [Demo video](https://mahesh-birudu.github.io/profile-cards-demo.mp4) · [Complete buildable source ZIP](https://mahesh-birudu.github.io/m365-profile-cards-source.zip)**

The public demo and video use fictional people and simulated presence. The production package runs inside authenticated SharePoint; GitHub Pages cannot supply tenant authentication or live directory data.

## Features

- Compact profile cards and accessible detail dialog, photo/initials fallback and missing-field handling.
- Teams Available, Busy, Away, Do not disturb, Offline/appear offline and unknown states; activity labels for meetings and calls.
- Presence refresh every 60 seconds while visible; errors do not incorrectly report a user as offline.
- Tenant-independent identity and authentication through the SPFx service scope; no secrets or tenant URLs in the runtime.

## Dependencies and prerequisites

| Component | Tested version |
| --- | --- |
| Node.js | 18.20.8 (supported project range >=18.17.1 <19) |
| SPFx runtime packages | 1.20.0 |
| SPFx build web / module interfaces | 1.20.2 |
| PnP Modern Search web parts | 4.16.0 |
| @pnp/modern-search-extensibility | 1.20.1 |
| @pnp/graph | 3.25.0 |
| React / React DOM | 17.0.1 |
| TypeScript | 4.7.4 |
| Gulp | 4.0.2 |
| Rush stack compiler 4.7 | 0.1.0 |

All direct and development dependencies are pinned in package.json; package-lock.json records the resolved tree. Use npm ci, not a fresh dependency upgrade. Node 18 is a legacy compatibility target and is end of life; use an isolated build environment. Upgrading the runtime requires a coordinated SPFx/PnP compatibility migration.

You need SharePoint Online in Microsoft public cloud, a site you can edit, an app catalog (site collection or tenant), the matching PnP Search package, and an authorized administrator to review Graph API access. Each viewer needs access to the page and Site Assets template. Teams presence depends on a supported Teams user and tenant policy. Modern browsers must support HTML dialog.

## Build from source

Extract the source archive and open its project folder. Then run:

```powershell
npm ci
npm run typecheck
npx tsx --test tests/profile.test.ts
npm run build
node scripts/check-compatibility.cjs
npm run package
```

Output: sharepoint/solution/m365-profile-cards.sppkg (solution version 1.1.0.0).

For the fictional standalone preview: npm run preview:build, then npm run preview and open http://127.0.0.1:4180. The preview uses the production template/controller with a mock provider.

## Install and configure PnP Search Results

1. **Deploy the package.** Upload the built sppkg to your chosen app catalog. Replace the previous version and click Deploy. Preserve the intended site scope. Add the app to the destination site. For an existing installation, open Site contents, the app's About page, and use Get It when a newer version is offered. A catalog upload alone can leave the site running the old installed version.
2. **Review Graph access.** In SharePoint Admin Center > Advanced > API access, an authorized administrator reviews Microsoft Graph User.Read.All (profiles), ProfilePhoto.Read.All (photos), and Presence.Read.All (other users' Teams status). This uses delegated SPFx authentication; do not add application secrets. Permissions are not granted automatically. No write permission is required.
3. **Upload the template.** Upload templates/profile-cards.html to your destination site's Site Assets library. Keep that filename and copy its direct file URL. For example: https://YOUR-TENANT.sharepoint.com/sites/YOUR-SITE/SiteAssets/profile-cards.html. Replace the existing file for upgrades. Visitors need read access.
4. **Add PnP Search Results.** Edit a modern SharePoint page and add the PnP Search Results web part from the installed 4.16.0 package. Choose SharePoint Search as the data source.
5. **Choose people search.** Use Local People Results, result source ID b09a7990-05ea-4af9-81ef-edfab16c4e31. Use query template {searchTerms}. Connect your PnP Search Box, or supply a static/default query of * for an initial people directory. Enable paging, starting with 5 or 10 results per page.
6. **Select managed properties.** Add AccountName, PreferredName, WorkEmail, JobTitle, WorkPhone, Company, UserName and Path. Verify the list persists as individual properties. Use the Debug layout to confirm AccountName contains a UPN, Entra GUID or membership claim. A display name or SharePoint numeric user ID is not sufficient. Search schemas can vary; adapt template expressions to the actual selected properties.
7. **Register the library.** In the web part's Extensibility settings, add and enable library component ID e425e0ca-e11c-45c6-80b2-94c5e6b035ae. Keep the built-in default library enabled for pagination. This is the component manifest ID, not solution ID a1fca27b-298d-40e5-b15d-a86d6a3944db.
8. **Choose the custom layout.** Set the layout to Custom and External template URL to the direct Site Assets file URL. The template renders the registered tag <m365-profile-card data-user-id="{{item.AccountName}}">. Field classes such as js-profile-name and js-profile-presence-label are controller hooks, not registration names.
9. **Save, test, then publish.** Verify profile text, photo fallback, presence, popup open/close, keyboard focus, paging and mobile layout as both an administrator and a regular viewer. After upgrades, confirm the installed app is 1.1.0.0 and refresh the page.

## Handlebars presence hooks

```html
<span class="m365-presence js-profile-presence" data-presence="unknown" role="status">
  <span class="js-profile-presence-label">Loading Teams status…</span>
</span>
```

These hooks appear on the card and in the popup. Graph presence is fetched after the profile resolves its Entra object ID. Handlebars/SharePoint Search alone cannot supply live Teams status. Keep the supplied CSS, class hooks, data-content and placeholder-content sections.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Teams status row is absent | Replace the Site Assets template with this release. |
| Status stays Loading | Confirm catalog Deploy completed, installed app updated, new library bundle loaded, and page visible. |
| Presence unavailable | Check Presence.Read.All approval, tenant policy, user support, Graph throttling or network access. |
| Offline / appear offline | Graph explicitly returned Offline; this may also mean the user selected Appear offline. |
| Library require/destructuring error | Match SPFx, React and PnP extensibility versions. This package targets PnP Search 4.16.0. |
| Missing properties | Confirm search managed properties and data-user-id mapping. Empty directory fields show Not provided. |
| Popup fails after paging | Use the current library with delayed initialization after child markup is inserted. |

## Source map and validation

src/libraries/profileCards registers the custom element. src/webComponents supplies SPFx context/lifecycle. src/services/ProfileService.ts calls PnPjs Graph. src/ui/ProfileCardController.ts handles safe rendering, dialogs, photos and presence. templates/profile-cards.html is the upload-ready Handlebars file. preview uses synthetic fixtures only. tests/profile.test.ts contains the automated checks.

Production bundle, packaging, compatibility check and 10 automated tests passed for version 1.1.0. Live SharePoint validation covered profile/photo, paging, popup and explicit offline presence. Public demo presence is simulated, not a live tenant integration. Additional PnP releases, sovereign clouds and every possible tenant policy are not covered by this validation.

References: [PnP extensibility](https://microsoft-search.github.io/pnp-modern-search/extensibility/) · [SPFx compatibility](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility) · [Graph presence](https://learn.microsoft.com/en-us/graph/api/presence-get?view=graph-rest-1.0) · [PnPjs](https://pnp.github.io/pnpjs/)
