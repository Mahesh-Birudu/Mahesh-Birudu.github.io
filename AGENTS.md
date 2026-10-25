# Repository organization

Classify every new SharePoint project by its actual SPFx component type before creating it.

- Put standalone SPFx web parts in webparts/<project-name>/.
- Put Application Customizers, Field Customizers and other SPFx extensions in extensions/<project-name>/.
- Put PnP Search extensibility projects and registered custom web components in libraries/<project-name>/. Shared code packages also belong in libraries/, clearly identified as shared packages.
- Do not create a generic projects/ source directory. 00-portfolio/projects/ contains public website artifacts and keeps its existing routes.
- Header profile, stock and menu modules stay inside their extension project unless they become separately deployable projects. A React component is not automatically a web part or an extension.
- Preserve deployed component GUIDs, solution IDs and package identities during folder-only changes.
- Update relative file dependencies and lockfiles, preview imports, build scripts, CI project paths, setup documentation and downloadable source bundles when moving or adding projects.
- Keep secrets, node_modules, local tools and generated build intermediates out of Git.
- Validate affected projects with their existing typecheck, test and build/package scripts. Validate portfolio build/check when its imports or documentation change.

See docs/PROJECT-STRUCTURE.md for the current classification and migration map.
