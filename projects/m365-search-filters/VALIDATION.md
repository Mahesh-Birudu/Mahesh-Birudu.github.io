# Validation

- React behavior tests: 11 passed locally (Node 22.23.3; React 17 / jsdom 26.1.0 test runtime).
- Production React preview: built and visually checked at desktop and 390px mobile frame widths.
- Preview scenario: Digital Workplace selection + Apply reduced 6 synthetic people to 2. Native dialog opens with focus on Close; Escape/focus restore covered by tests.
- SPFx dependency installation is blocked locally by Windows EPERM on nested package directories. Full typecheck, Heft production bundle and SPPKG packaging are delegated to the GitHub Linux validation workflow. Confirm its successful run before deploying.
- Live SharePoint deployment and tenant-specific refinable-property mappings have not been performed for this new project.

