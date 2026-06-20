---
sidebar_position: 1
---
# Package Overview

A Studio Pro script package bundles JavaScript source files, XML configuration, and optional assets.

## Package Format

A `.package` is the script bundle format used by Studio Pro. It is typically distributed as a ZIP archive renamed with the `.package` extension, with files at the archive root. For development, Studio Pro can also load an unpacked directory with the same structure.

**Required files:**

```
your-script.package (ZIP)
├── metainfo.xml          ← Package metadata
├── classfactory.xml      ← Script registration & entry points
└── scriptname.js             ← Script source (filename can be anything; classfactory.xml points to it)
```

**Optional files:**

```
├── helper.js             ← Loaded via include_file('helper.js')
├── skin/
│   ├── skin.xml          ← Dialog skin definitions (required for custom dialogs)
│   └── images/
│       ├── icon.png      ← Optional image assets
│       └── icon.svg
└── resources/
    └── *.xml             ← CommandBar menu/toolbar XML layouts (loaded via `Host.Url("package://...")`)
```

## Multi-script packages

For multi-script packages, the package root uses the same structure. Each `<ScriptClass>` needs a unique `classID`, and `functionName` only needs to name the factory function inside that entry's `sourceFile`. Multiple entries may point at the same `sourceFile` when one JavaScript file exports several factory functions. Shared dialog definitions live in one `skin.xml`, with one `<Form>` per script when dialogs are used.

See [Examples - Multi-Script Demo](../scripts/multi-script-demo.md) for a working example.