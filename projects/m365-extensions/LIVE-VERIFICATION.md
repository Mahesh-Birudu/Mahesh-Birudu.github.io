# Live verification — 2026-10-21

Version 1.1.1.0 retains the installed solution ID and reorganizes the source as m365-extensions.

- Production TypeScript, lint, webpack and package validation passed.
- Seven automated tests passed: profile ordering/grouping; URL safety; quote validation; history edge cases; company API configuration; generic response validation; navigation adapter remount and disposal.
- Metrics live page: stock and profile controls mounted inside Microsoft suite navigation; lower duplicate header removed; native product label/account control hidden only while adapter is active.
- Live list menu: two direct links and Get help with Tutorial1, Tutorial2 and Tutorial3.
- Stock reference feed: IBM daily demo; reusable graph retained.
- Configure stock API opens inside the stock drawer. Saving reference configuration succeeded to DevStoriesExtensionSettings. Insecure test URL was rejected before saving; active feed preserved.
- Drawer rendered through a body portal to avoid Microsoft navigation inheritance and clipping.
- Company API needs the documented JSON response and CORS, or a server-side provider adapter/proxy. No customer API was supplied, so a customer feed has not been live-tested.
- No GitHub upload.

Suite navigation replacement is an unsupported Microsoft DOM integration; future compatibility cannot be guaranteed. Required DOM anchors and recovery are isolated in src/modules/suiteNavigation. disableSuiteIntegration=true is the rollback switch.

## Owner configuration update — version 1.2.0.0
- Production build and package validation passed; 10 automated tests passed.
- Live profile gear opens Navigation configuration with five editable simple ID/class selectors, Test targets, Restore defaults, and F12/Inspect guidance.
- Live Test targets succeeded for all five existing anchors. Saving NavigationConfig succeeded and remounted the header.
- Both navigation and stock configuration callbacks require Manage Web plus Manage Permissions. Server checks repeat the same owner-level requirement before all settings writes.
- SharePoint list permission page verified unique permissions: metrics Owners Full Control; metrics Members Read; metrics Visitors Read; Excel Services Viewers View Only.
- Non-owner rejection was tested automatically; no separate member account was used for interactive sign-in testing.
- Proof: outputs/dev-stories-owner-menu.png, outputs/dev-stories-navigation-settings.png, outputs/dev-stories-settings-permissions.png.

## Intranet navigation update — version 1.3.1.0
- Production build/package passed; 13 automated tests passed.
- Added INTRANET beside the organization logo.
- Native #spSiteHeader (site title/navigation/logo/group strip) is hidden; page commands remain available.
- Owner selector settings now include Branding and Hidden SharePoint site section headings and editable selectors. Live Test targets passed for all seven targets.
- Fresh menu state showed only owner Edit on the right. Used Edit > Load sample links > Save menu to publish four main dropdowns: Who we are, What's happening, Find it, Resources.
- Live four-level path verified: Who we are > Teams > Technology > Developer community. Learning link points to https://learn.microsoft.com. Menu items persisted after app upgrade/reload.
- Compact menu layering and header spacing visually checked at 665px viewport; nested options stay within their panel. On larger screens nested menus use flyouts.
- Search regression: SharePoint developers returned Krishna / SharePoint Developer; restored All people afterward.
- MenuConfig uses the existing owner-only settings store and SharePoint permissions. No GitHub upload.
- Proof: outputs/dev-stories-cascading-navigation.png and outputs/dev-stories-empty-menu.png.

## Additional section hiding — live verification 2026-10-24
Version 1.4.0.0 was installed before interruption and verified on resumption. At the live desktop viewport both #sp-appBar and .ms-HubNav compute to display:none. The page content starts at x=0, recovering the former app-rail width. Existing cascading navigation, suite header, stock quote and people results remain visible. Owner configuration shows the two named section headings and their saved selectors; Test targets reports all navigation targets match. Saved proof: outputs/dev-stories-hidden-sections-live.png and outputs/dev-stories-hidden-section-settings.png. No further source changes or GitHub upload were needed during resumption.

## Earlier visibility — version 1.4.1.0, 2026-10-24
14 tests passed; production build and package validation passed. Uploaded/deployed the existing catalog app and upgraded Metrics; installed app reports 1.4.1.0. Home(1).aspx loads bundle afeda9aa1e4503434c04. Two live refreshes showed custom suite controls before stock/menu data finished loading, with app rail and hub row hidden (computed display:none). Named owner selector fields remain populated; Test targets reports all targets match. Proof: outputs/navigation-refresh-settings.png. This verifies the earlier extension initialization and final visibility, not every browser paint before SPFx loads; a zero-flash first frame cannot be guaranteed by the Application Customizer. No GitHub upload.

## Flush frame — version 1.4.2.0, 2026-10-24
Production build (TypeScript/lint/webpack) and package validation passed. Deployed catalog update and requested Metrics app upgrade. Live Home(1).aspx loads bundle bc03ac9af99dc07ab255. Computed page frame margin/radius/border are 0px and shadow is none; bounds x=0, width=1280 at viewport 1280. Frame y=48 matches suite bar bottom=48, eliminating the top gap. Header, intranet menu, ticker/profile and authoring commands remain visible. Proof: outputs/navigation-flush-frame.png. No GitHub upload.
