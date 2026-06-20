---
sidebar_position: 6
---
# Creating a .package File

## Manual

For distribution, compress the script files into a `.zip` archive with the files at the archive root, then rename it to `my-script.package`.

## Unix / macOS / Linux

```bash
cd MyScriptFolder
zip -r ../my-script.package . -x ".*"
# Verify:
unzip -l ../my-script.package
```

## Windows (PowerShell)

```powershell
$src = "C:\path\to\MyScriptFolder"
$out = "C:\path\to\my-script.package"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($src, $out)
```

## Python (cross-platform)

```python
import zipfile, os

def create_package(source_dir, output_file):
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zf.write(file_path, arcname)

create_package('MyScriptFolder', 'my-script.package')
```