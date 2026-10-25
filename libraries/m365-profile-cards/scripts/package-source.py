"""Create a source-only archive preserving library and shared-brand folder layout."""
import pathlib
import zipfile
project = pathlib.Path(__file__).resolve().parent.parent
root = project.parent.parent
destination = root / '00-portfolio/projects/m365-profile-cards/downloads/source.zip'
excluded_dirs = {'node_modules', 'dist', '.git', '.heft', '__pycache__', 'lib', 'lib-commonjs', 'lib-dts', 'lib-esm', 'temp'}
allowed_dirs = {'config', 'docs', 'preview', 'scripts', 'src', 'templates', 'tests'}
allowed_files = {'.gitignore', '.npmrc', '.nvmrc', 'CHANGELOG.md', 'README.md', 'SECURITY.md', 'VALIDATION.md', 'package.json', 'package-lock.json', 'tsconfig.json', 'eslint.config.mjs'}
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(project.rglob('*')):
        rel = file.relative_to(project)
        if not file.is_file() or excluded_dirs.intersection(rel.parts):
            continue
        if rel.parts[0] in allowed_dirs or rel.as_posix() in allowed_files:
            archive.write(file, file.relative_to(root).as_posix())
    brand = root / 'libraries/m365-search-brand'
    for file in sorted(brand.iterdir()):
        if file.is_file() and file.suffix in {'.js', '.ts', '.json', '.md'}:
            archive.write(file, file.relative_to(root).as_posix())
print('Created source-only ZIP:', destination)
