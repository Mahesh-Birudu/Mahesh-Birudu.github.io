# Shared Microsoft 365 search branding

One versioned, dependency-free visual contract for profile results, filters and search verticals. `brandStyle(theme)` produces CSS custom properties on each component root. The explicit product palette stays consistent across site themes. The optional theme argument remains accepted for API compatibility.

The package is used through a local file dependency: `file:../m365-search-brand` from sibling libraries or `file:../../libraries/m365-search-brand` from extensions/web parts. Update this folder once, rebuild the SPFx projects and redeploy their packages. The package does not inject global styles or modify Microsoft/PnP DOM. Presence colors remain semantic (green/busy red/away amber/offline) rather than being recolored by branding.

| Token | Default |
| --- | --- |
| Primary | `#cb202d` |
| Surface | `#ffffff` |
| Soft surface | `#f4f4f2` |
| Text | `#2d2d2d` |
| Muted text | `#656560` |
| Border | `#e3e3df` |
| Typeface | Segoe UI, Arial, sans-serif |
| Panel radius | 14px |
| Focus ring | `#cb202d` |
