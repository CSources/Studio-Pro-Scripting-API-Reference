---
sidebar_position: 5
---
# Installation

Install script packages into Studio Pro's `Scripts` folder:

| Platform | Scripts folder |
|---|---|
| **Windows** | `C:\Program Files\Fender\Studio Pro 8\Scripts\` |
| **macOS** | `/Applications/Studio Pro 8.app/Contents/Scripts/` |

**Note:** Scripts aren't retained when updating Studio Pro. Backup your scripts before updating.

<details>

<summary>Accessing macOS scripts folder</summary>

- Open Finder.
- Select the **Applications** folder.
- Right-click the **Studio Pro 8** application.
- Select **'Show Package Contents'**.

</details>

## Initial recognition

Studio Pro scans scripts on startup. If Studio Pro is already open when you install a new package, restart the application so it picks up the new script(s).

## Hot-reloading behavior

For script dialogs, replacing the contents of an installed package can hot-swap script source files, `skin.xml`, and `metainfo.xml` changes when the script is reopened. `classfactory.xml` registration changes still require a restart. For AddIn scripts, a restart is always required to reflect changes as these are scanned at runtime.

## Development Tip (symlink)

For faster iteration, symlink a script folder from your project directory into the `Scripts` folder instead of constantly copying files over:

### macOS

Open **Terminal**, then use:

```bash
ln -s "/path/to/my-script" \
  "/Applications/Studio Pro 8.app/Contents/Scripts/my-script"
```

### Windows

Open **Command Prompt** as Administrator, then use:

```cmd
mklink /D "C:\Program Files\Fender\Studio Pro 8\Scripts\my-script" "C:\path\to\my-script"
```