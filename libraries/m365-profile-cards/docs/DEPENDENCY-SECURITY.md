# Dependency audit — 19 October 2026

The 1.3.1 lockfile pins all nested Handlebars installations to the direct dependency version **4.7.10** using npm's `$handlebars` override. This compatible patch removes the critical alerts affecting nested 4.7.9 installations.

The full lockfile audit after this patch reports **0 critical, 21 high and 33 moderate** alerts. These counts include propagation through parent build packages and do not represent 54 independent vulnerabilities. A successful build does not mean the dependency tree is vulnerability-free.

Remaining alerts include upstream build/development dependency chains involving braces, node-forge, webpack-dev-server and their consumers. The registry currently reports no compatible patched release for some of these chains. Suggested forced changes include downgrading SPFx tooling to older incompatible versions, so `npm audit fix --force` is not applied.

Use the documented Node version, run builds on trusted source, keep development servers local, and review future Microsoft/PnP toolchain patches. Re-run `npm audit --package-lock-only` and `npm audit --omit=dev --package-lock-only` when updating the lockfile. SharePoint runtime permissions and tenant deployment require separate validation.
