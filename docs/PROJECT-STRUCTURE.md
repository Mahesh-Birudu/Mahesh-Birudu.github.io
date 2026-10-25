# Project folders and future placement

## What belongs where

| Category | Meaning | Current projects |
| --- | --- | --- |
| webparts/ | A separately deployable SPFx WebPart component that page authors add to a page | carousel, m365-search-verticals, m365-column-splitter |
| extensions/ | An SPFx extension that customizes the host experience, rather than a page web part | m365-extensions: company-header Application Customizer, profile callout, stock and cascading-menu modules |
| libraries/ | PnP Search extensibility or registered custom web components consumed by other parts; also shared utility packages | m365-profile-cards, m365-search-filters, m365-search-brand |

Profile cards and search filters are libraries even though they display UI. Search verticals and the column controller are web parts because their SPFx manifests declare WebPart components. Shared brand is an ordinary local package; it registers no custom element and produces no SPPKG. The stock panel and profile callout are modules of the Application Customizer, not independent SPFx extensions.

## Source migration

| Previous source folder | Current source folder |
| --- | --- |
| projects/m365-extensions | extensions/m365-extensions |
| projects/m365-profile-cards | libraries/m365-profile-cards |
| projects/m365-search-filters | libraries/m365-search-filters |
| projects/m365-search-brand | libraries/m365-search-brand |
| projects/m365-search-verticals | webparts/m365-search-verticals |
| projects/m365-column-splitter | webparts/m365-column-splitter |
| webparts/carousel | webparts/carousel (unchanged) |

The public portfolio routes under /projects/ are intentionally unchanged. Package versions, solution IDs and component GUIDs are unchanged by this source-only reorganization. This does not require reinstalling existing SharePoint apps.

## Adding another project

Choose the category above, create one project folder under it, and follow the root AGENTS.md rules. Keep libraries/, extensions/ and webparts/ at the repository root. Consumers in another category reference shared brand with file:../../libraries/m365-search-brand; sibling libraries use file:../m365-search-brand. Update package-lock.json as well as package.json.

Add each deployable project to .github/workflows/spfx.yml, update the root source map and setup guide, and validate its scripts. New public demos belong under 00-portfolio/projects/ and must use fictional data.
