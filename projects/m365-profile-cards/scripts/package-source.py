"""Create a source-only download without dependencies, generated files or secrets."""
import pathlib
import zipfile
project = pathlib.Path(__file__).resolve().parent.parent
destination = project.parent.parent / 'portfolio/projects/m365-profile-cards/downloads/source.zip'
allowed_dirs = {'config', 'docs', 'preview', 'scripts', 'src', 'templates', 'tests'}
excluded_dirs = {'node_modules', 'dist', '.git', '.heft', '__pycache__'}
allowed_files = {'.gitignore', '.npmrc', '.nvmrc', 'CHANGELOG.md', 'README.md', 'SECURITY.md', 'VALIDATION.md', 'package.json', 'package-lock.json', 'tsconfig.json', 'eslint.config.mjs'}
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(project.rglob('*')):
        rel = file.relative_to(project)
        if not file.is_file() or excluded_dirs.intersection(rel.parts):
            continue
        if rel.parts[0] in allowed_dirs or rel.as_posix() in allowed_files:
            archive.write(file, rel.as_posix())
print('Created source-only ZIP:', destination)
