# Supported toolchain — 1.3.1

| Tool | Pinned version |
| --- | --- |
| Node | 22.23.3 |
| npm | 10.9.9 (bundled with Node) |
| SPFx runtime / Heft rig | 1.23.0 |
| PnP Modern Search target | 4.25.0 |
| Extensibility | 2.2.0 |
| Heft | 1.3.3 |
| TypeScript | 5.8.3 |
| React / ReactDOM | 17.0.1 |
| PnPjs Graph | 4.22.0 |
| tsx | 4.23.15 |
| esbuild | 0.28.2 |
| Handlebars | 4.7.10 |
| jsdom | 30.1.3 |

Exact direct versions plus package-lock.json make installations repeatable. The Node and TypeScript versions are the latest within the supported release lines checked on 19 October 2026. SPFx stays at the PnP Search runtime target. Do not apply a blanket npm update or audit fix --force; dependency upgrades must preserve SPFx/PnP compatibility.
