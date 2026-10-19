# Mahesh Babu Birudu — Portfolio and Microsoft 365 projects

[Live portfolio](https://mahesh-birudu.github.io/) · [Profile Cards demo](https://mahesh-birudu.github.io/profile-cards-demo.html)

## Browse the code

| Folder | Contents |
| --- | --- |
| [portfolio](portfolio/) | Named portfolio pages, styles, project carousel and video UI source |
| [projects/m365-profile-cards](projects/m365-profile-cards/) | SPFx 1.2.0 source, React components/hooks, PnPjs service, Handlebars template, tests and setup |

Expand `projects → m365-profile-cards → src → components` in GitHub's file tree to inspect `ProfileCard.tsx`, `ProfileDetailsDialog.tsx`, `PresenceBadge.tsx` and `ProfilePhoto.tsx`. The implementation is available as individual files, not only inside a ZIP.

The public root HTML/JS/CSS files are the GitHub Pages deployment copy, retained to preserve published URLs. `portfolio/` contains the organized review copy and references shared public assets at the root. See [portfolio README](portfolio/README.md).

## Profile Cards

[Project guide](M365-PROFILE-CARDS.md) · [Architecture](projects/m365-profile-cards/docs/ARCHITECTURE.md) · [Setup](projects/m365-profile-cards/docs/SETUP.md)

`Handlebars → m365-profile-details → BaseWebComponent → React → PnPjs → Microsoft Graph`

GitHub publication does not deploy the SPPKG to SharePoint or upload the external template into Site Assets. Upgrade package and template together for production.

The interactive demo uses current React components and fictional directory fixtures. The captioned video shows the earlier visual implementation. Never add tenant credentials or client data to this public repository.
