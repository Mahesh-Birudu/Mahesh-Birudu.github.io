# Validation — 1.3.1 Heft migration

The publication workflow requires all of these checks before committing the upgrade:

- npm ci on Node 22.23.3 / npm 10.9.9
- npm run typecheck (TypeScript 5.8.3)
- npm test (React profile, presence, retry and lifecycle behavior)
- npm run build (Heft production bundle and lint)
- npm run package (SPPKG 1.3.1.0)
- npm run preview:build (production React components with a synthetic provider)
- portfolio build, CSP and local-link validation

SPFx runtime 1.23.0 matches PnP Modern Search 4.25.0. No SharePoint tenant deployment is performed by this GitHub publication. The recorded video remains version 1.1.0; the live interactive demo and source/package downloads are 1.3.1.
