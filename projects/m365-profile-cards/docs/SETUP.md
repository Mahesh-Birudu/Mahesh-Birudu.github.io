# Setup — React profile cards 1.5.1

1. Install or upgrade to PnP Modern Search 4.25.0 (SPFx 1.23.0). This project uses the Heft toolchain, extensibility 2.2.0, Node 22.23.3 and TypeScript 5.8.3. Do not deploy this package alongside the old PnP Search 4.16.0 target.
2. Build and package using the README commands. Deploy the version 1.5.1.0 SPPKG to your tenant or site app catalog. Install or update the site app if needed.
3. Review and approve Microsoft Graph `User.Read.All`, `ProfilePhoto.Read.All`, and `Presence.Read.All` in SharePoint Admin Center → Advanced → API access. Organizational admin approval is environment-specific.
4. Upload `templates/profile-cards.html` into the target site's Site Assets library.
5. Add PnP Search Results with SharePoint Search and Local People Results. Use `{searchTerms}` with a connected search box, or `*` for a default directory query. Select `AccountName` at minimum. Use a UPN, Entra object ID, or membership claim, never a display name.
6. Enable custom extensibility library `e425e0ca-e11c-45c6-80b2-94c5e6b035ae`; keep the built-in library enabled.
7. Choose Custom layout and set External template URL to the Site Assets file. The library registers `m365-profile-details`; do not paste a script into the template.
8. Verify several profiles, missing photos, denied permissions, presence, slide-out keyboard navigation and paging. Save and publish the page.

## Template responsibilities

The external Handlebars file owns the result loop, grid, empty state, pagination and attributes. React owns all internal card and dialog UI. Customize React components for additional fields or popup layout; rebuild and redeploy after code changes. CSS/theme overrides can adjust appearance.

## Upgrade from 1.1.0 or 1.2.0

Update both the package and template together. The old tag is a compatibility alias and still mounts the React card, but class-based HTML hydration is removed. Existing old template child markup is replaced when React mounts. GUIDs and Graph permission scopes are unchanged.

## Troubleshooting

- Unknown element / blank UI: check package deployment, library GUID and component registration. Confirm the new package is actually loaded.
- Profile access error: confirm Graph approvals and identity values. Retry after resolving access.
- Presence unavailable: permission denial, unsupported accounts or throttling do not mean offline. Check the signed-in user's Graph access.
- No photo: initials are expected when a photo is missing or unavailable.
- Public GitHub Pages demo: synthetic provider only; production authentication requires SharePoint.
