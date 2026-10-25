# Cascading menu subproject
CascadingMenu renders the published structure and owner Edit button. MenuEditor configures every item, URL, icon, parent and order inside the component. model validates max four levels, safe web URLs and tree integrity. No sample links are published automatically: fresh installs show only Edit to owners. MenuConfig is persisted by the SPFx orchestrator through the owner-protected settings store.

Version 1.5.0 renders a wide mega menu. Top-level items support imageUrl, imageAlt and description. Immediate children become column headings; their children are links or expandable groups. The editor preserves four-level parent validation and owner-only saves.
