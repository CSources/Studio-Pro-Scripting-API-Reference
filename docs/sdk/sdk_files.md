---
sidebar_position: 1
---

# SDK Overview

Studio Pro ships several SDK JavaScript files that can be included via `include_file()` to access additional constants, helpers, and class IDs. Include them at the module level of your script:

```javascript
include_file("resource://{main}/sdk/cclapp.js");
include_file("resource://{main}/sdk/engine.js");
```

These files are bundled with the application and are not part of your script package.

## Available SDK Files

| File | Namespace | Description |
|---|---|---|
| [`cclapp.js`](cclapp.md) | `CCL.JS` | UI components, constants, and runtime helpers |
| [`engine.js`](engine.md) | `Engine.JS` | Track class IDs and edit function flags |
| [`devices.js`](devices.md) | `Devices.JS` | Device and port type constants |
| [`hostutils.js`](hostutils.md) | `HostUtils` | Host service surface accessors |
| [`helpids.js`](helpids.md) | `HelpID` | Help ID constants for `Host.GUI.Help.highlightControl()` |
| [`media.js`](media.md) | `Media.JS` | Media type and speaker format enumerations |