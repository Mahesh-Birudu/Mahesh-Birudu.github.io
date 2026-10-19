# Shared Microsoft 365 search branding

One versioned, dependency-free visual contract for profile results, filters and future search verticals. `brandStyle(theme)` produces CSS custom properties on each component root. PnP provides the site theme, while deterministic fallback values keep the synthetic preview consistent.

The package is used through a local `file:../m365-search-brand` dependency. Update this folder once, rebuild both SPFx projects and redeploy their packages. The package does not inject global styles or modify Microsoft/PnP DOM. Presence colors remain semantic (green/busy red/away amber/offline) rather than being recolored by branding.

| Token | Default |
| --- | --- |
| Primary | `#0078d4` |
| Surface | `#ffffff` |
| Soft surface | `#eef6fc` |
| Text | `#172a3a` |
| Muted text | `#536a7c` |
| Border | `#dce5ec` |
| Typeface | Segoe UI, Arial, sans-serif |
| Panel radius | 14px |
| Focus ring | `#a95200` |
