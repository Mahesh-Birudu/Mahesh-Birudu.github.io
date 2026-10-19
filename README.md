# Mahesh Babu Birudu — Portfolio

Public portfolio: https://mahesh-birudu.github.io/

## Source structure

- **src/components/** — Header, Hero, Expertise, Experience, Projects, Contact, Footer and DemoDialog. Expand each named HTML file to edit its section.
- **src/pages/** — main page shell and Microsoft 365 project detail page.
- **src/styles/** and **src/scripts/** — portfolio styles, carousel behavior and project metadata.
- **public/assets/** — portrait, public résumé and icon licenses.
- **public/projects/m365-profile-cards/** — synthetic demo, recorded walkthrough and public downloads.
- **scripts/** — dependency-free build, link checks and local preview.
- **.github/workflows/pages.yml** — builds, validates and deploys only dist/ to GitHub Pages.

The production React/SPFx source is maintained separately at [m365-profile-cards](https://github.com/Mahesh-Birudu/m365-profile-cards). Its components, services, hooks, tests and configuration belong in that repository.

## Local development

Use Node.js 22 or newer. No npm dependency installation is required.

```sh
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4184. Edit the source files and rebuild before refreshing. Add future carousel projects in src/scripts/projects.js.

## Publication

Commit source changes to main. The Pages workflow builds a clean dist/ artifact, validates links and CSP, and publishes to the existing GitHub Pages address. dist/ is ignored by Git so generated deployment copies do not clutter the repository. Historical public URLs remain usable through generated compatibility files. The repository and website intentionally remain public.

The demo uses synthetic data. The recorded walkthrough shows version 1.1.0; the interactive React demo and source downloads are version 1.2.0. SharePoint deployment and Graph permissions are described in the M365 repository.
