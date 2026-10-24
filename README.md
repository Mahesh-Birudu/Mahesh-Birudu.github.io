# Dev Stories Intranet & Mahesh Babu Birudu Portfolio

Public portfolio: https://mahesh-birudu.github.io/

The repository contains the complete modular SharePoint intranet source plus the portfolio website. Start with the [complete intranet setup guide](docs/INTRANET-SETUP.md), including people data, delegated Graph scopes, PnP Search connections, owner permissions, company stock API and recovery.

- [Interactive intranet demo + 11-step guided tour](https://mahesh-birudu.github.io/projects/dev-stories-intranet/demo.html)
- [Project showcase and full browser-readable setup guide](https://mahesh-birudu.github.io/projects/dev-stories-intranet/)
- [Original profile-card project](projects/m365-profile-cards/)

## Source map

| Folder | Responsibility |
| --- | --- |
| portfolio/ | Portfolio pages, interactive sandbox, guided tour, public documentation and selected downloads |
| projects/m365-extensions/ | Company header, user-profile callout, stock drawer/API configuration, cascading menu and owner settings |
| webparts/carousel/ | Static configurable carousel, image frame, slide editor and quick access |
| projects/m365-profile-cards/ | Graph-backed people cards, photos, presence and right-side profile slide-out |
| projects/m365-search-filters/ | Searchable popup filters, compact Apply/Clear and immediate chip removal |
| projects/m365-search-verticals/ | Configurable PnP-compatible search categories |
| projects/m365-column-splitter/ | Configurable grouping/widths for existing page web parts |
| projects/m365-search-brand/ | Shared brand tokens, kept beside consuming projects |
| docs/INTRANET-SETUP.md | End-to-end deployment, data preparation, configuration and troubleshooting |

## Develop

SPFx projects target Node 22.23.3, SPFx 1.23.0, React 17.0.1, TypeScript 5.8.3 and Heft 1.3.3. Each project's README and committed lockfile define its build. PnP Search integration targets 4.25.0; PnPjs is 4.22.0 where used. Run npm ci, npm run typecheck, npm test, npm run build and npm run package in the selected project (column controller uses npm ci --legacy-peer-deps).

The portfolio has no install step: cd portfolio, npm run build, npm run check, npm run preview. The committed demo bundle uses the production React components with fictional providers. To regenerate it after component changes, install webparts/carousel dependencies and run node portfolio/scripts/build-intranet-demo.cjs from the repository root. Rebuild the guide with node portfolio/scripts/build-intranet-guide.cjs after editing docs/INTRANET-SETUP.md.

## Publication boundaries

GitHub Pages deploys only portfolio/dist. Source is public in this repository, not copied as loose development files into the website artifact. Selected SPPKGs and the deployment archive are intentional downloads. The public demo never authenticates to a tenant and contains no employee records or credentials. Owner preview is a UI simulation, not authorization. In SharePoint, settings writes use permissions and list ACLs; the carousel is saved through page edit/publish.

Suite-bar integration and DOM column rearrangement depend on Microsoft HTML and require regression checks. GitHub workflows validate/build; they do not deploy tenant apps, provision directory data or approve Graph scopes. Do not upload private API keys, tenant exports or generated node_modules/intermediate folders.
