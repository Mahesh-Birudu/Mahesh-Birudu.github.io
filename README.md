# Mahesh Babu Birudu — Portfolio & M365 Profile Cards

Website: https://mahesh-birudu.github.io/

| Folder | Contents |
| --- | --- |
| [portfolio/](portfolio/) | All portfolio pages, named components, styles, scripts, photo, résumé, showcase media, downloads and website build tools. |
| [m365-profile-cards/](projects/m365-profile-cards/) | Buildable React/SPFx Heft code, PnPjs services, custom web component, Handlebars template, tests and configuration guides. |
| [m365-search-filters/](projects/m365-search-filters/) | Separate React/SPFx Heft project for soft accordion filters, selection chips, mobile drawer, Handlebars layout and tests. |
| [m365-search-brand/](projects/m365-search-brand/) | Shared colors, fonts and visual tokens for profile results, filters and future verticals. |

Expand **portfolio → src → components** for the named website sections. Expand **projects → m365-profile-cards → src → components** for ProfileCard, ProfileDetailsDialog, PresenceBadge and ProfilePhoto.

There is no public/ folder. GitHub Pages publishes only the generated portfolio/dist/ artifact; source and SPFx build files are not included in that website artifact. Both source folders intentionally remain public on GitHub.

## Website development

```sh
cd portfolio
npm run build
npm run check
npm run preview
```

For SharePoint prerequisites, building the SPPKG and PnP Search configuration, see [the M365 guide](projects/m365-profile-cards/README.md). Existing website URLs and download links remain compatible.
