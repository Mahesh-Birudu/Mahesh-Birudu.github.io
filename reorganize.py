"""Move the reviewed portfolio into a named folder; import pinned SPFx source."""
import pathlib
import shutil
import sys

root = pathlib.Path.cwd().resolve()
source = pathlib.Path(sys.argv[1]).resolve()
portfolio = root / 'portfolio'
if portfolio.exists() or not (root / 'public/assets').is_dir() or not (source / 'src/components/ProfileCard.tsx').is_file():
    raise SystemExit('Unexpected layout; refusing partial or repeated migration')
portfolio.mkdir()
for name in ['src', 'scripts', 'package.json', 'SECURITY.md']:
    shutil.move(str(root / name), portfolio / name)
for name in ['assets', 'projects']:
    shutil.move(str(root / 'public' / name), portfolio / name)
(root / 'public').rmdir()
builder = portfolio / 'scripts/build.mjs'
text = builder.read_text(encoding='utf-8')
text = text.replace("fs.cpSync(path.join(root,'public'),dist,{recursive:true});", "for(const name of ['assets','projects'])fs.cpSync(path.join(root,name),path.join(dist,name),{recursive:true});")
text = text.replace("'public/projects/m365-profile-cards/demo.html'", "'projects/m365-profile-cards/demo.html'")
builder.write_text(text, encoding='utf-8')
readme = (root / 'README.md').read_text(encoding='utf-8')
readme = readme.replace('public/assets/', 'assets/').replace('public/projects/', 'projects/').replace('at [m365-profile-cards](https://github.com/Mahesh-Birudu/m365-profile-cards)', 'in [../m365-profile-cards](../m365-profile-cards/)')
readme = readme.replace('Commit source changes to main.', 'Run these commands from the portfolio/ folder. Commit source changes to main.')
readme = readme.replace('deploys only dist/', 'deploys only portfolio/dist/')
(portfolio / 'README.md').write_text(readme, encoding='utf-8')
target = root / 'm365-profile-cards'
target.mkdir()
for item in source.iterdir():
    if item.name in {'.git', 'demo', 'downloads', '.gitattributes'}:
        continue
    dest = target / item.name
    if item.is_dir():
        shutil.copytree(item, dest)
    else:
        shutil.copy2(item, dest)
project_readme = target / 'README.md'
text = project_readme.read_text(encoding='utf-8').replace('(downloads/m365-profile-cards.sppkg)', '(../portfolio/projects/m365-profile-cards/downloads/m365-profile-cards.sppkg)').replace('(downloads/m365-profile-cards-source.zip)', '(../portfolio/projects/m365-profile-cards/downloads/source.zip)').replace('(demo/profile-cards-demo.mp4)', '(../portfolio/projects/m365-profile-cards/media/demo.mp4)').replace('Current React demo source is in [demo](demo/);', 'Compiled demo is in [the portfolio showcase](../portfolio/projects/m365-profile-cards/); editable React preview source is in [preview](preview/);').replace('This repository contains only the M365 project. Portfolio development is kept separately.', 'This folder contains the SPFx project. Website pages, demo media and downloadable artifacts are under ../portfolio/.')
project_readme.write_text(text, encoding='utf-8')
(root / 'README.md').write_text('''# Mahesh Babu Birudu — Portfolio & M365 Profile Cards

Website: https://mahesh-birudu.github.io/

| Folder | Contents |
| --- | --- |
| [portfolio/](portfolio/) | All portfolio pages, named components, styles, scripts, photo, résumé, showcase media, downloads and website build tools. |
| [m365-profile-cards/](m365-profile-cards/) | Buildable React/SPFx code, PnPjs services, custom web component, Handlebars template, tests and configuration guides. |

Expand **portfolio → src → components** for the named website sections. Expand **m365-profile-cards → src → components** for ProfileCard, ProfileDetailsDialog, PresenceBadge and ProfilePhoto.

There is no public/ folder. GitHub Pages publishes only the generated portfolio/dist/ artifact; source and SPFx build files are not included in that website artifact. Both source folders intentionally remain public on GitHub.

## Website development

```sh
cd portfolio
npm run build
npm run check
npm run preview
```

For SharePoint prerequisites, building the SPPKG and PnP Search configuration, see [the M365 guide](m365-profile-cards/README.md). Existing website URLs and download links remain compatible.
''', encoding='utf-8')
attrs = root / '.gitattributes'
attrs.write_text(attrs.read_text(encoding='utf-8').replace('public/projects/', 'portfolio/projects/'), encoding='utf-8')
print('Organized portfolio/ and m365-profile-cards/; public/ removed.')
