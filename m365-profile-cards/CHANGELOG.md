# Changelog

## 1.2.0 — 19 October 2026

- Registered `m365-profile-details`, retaining `m365-profile-card` as a compatibility alias.
- Replaced DOM hydration with React ProfileCard, ProfileDetailsDialog, ProfilePhoto and PresenceBadge.
- Added useProfile/usePresence hooks with stale-response protection and lifecycle cleanup.
- Simplified external Handlebars template to custom elements, grid and paging.
- Kept PnPjs Graph integration, identities, solution GUID and permission scopes.
- Updated mock demo, tests, build package and documentation.
