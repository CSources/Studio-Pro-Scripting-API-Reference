---
sidebar_position: 5
---
# Installation

Install script packages into Studio Pro's `Scripts` folder:

| Platform | Scripts folder |
|---|---|
| **Windows** | `C:\Program Files\Fender\Studio Pro 8\Scripts\` |
| **macOS** | `/Applications/Studio Pro 8.app/Contents/Scripts/` |

## Initial recognition

Studio Pro scans scripts on startup. If Studio Pro is already open when you install a new package, restart the application so it picks up the new script(s).

## Hot-reloading behavior

For script dialogs, replacing the contents of an installed package can hot-swap script source files, `skin.xml`, and `metainfo.xml` changes when the script is reopened. `classfactory.xml` registration changes still require a restart. For AddIn scripts, a restart is always required to reflect changes as these are scanned at runtime.