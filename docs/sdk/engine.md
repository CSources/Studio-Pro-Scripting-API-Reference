---
sidebar_position: 3
---
# Engine

After including `resource://{main}/sdk/engine.js`, the `Engine.JS` namespace provides track class IDs and edit function flags.

```javascript
include_file("resource://{main}/sdk/engine.js");
```

## Class ID Constants

String identifiers for track types. Use them with functions like `MusicPartFunctions.addTrack()`:

| Constant | Value |
|---|---|
| `Engine.JS.kClassAudioTrack` | `"AudioTrack"` |
| `Engine.JS.kClassAutomationTrack` | `"AutomationTrack"` |
| `Engine.JS.kClassFolderTrack` | `"FolderTrack"` |
| `Engine.JS.kClassMediaTrack` | `"MediaTrack"` |
| `Engine.JS.kClassMusicTrack` | `"MusicTrack"` |
| `Engine.JS.kClassVideoTrack` | `"VideoTrack"` |

## Other String Constants

| Constant | Value |
|---|---|
| `Engine.JS.kMediaPool` | `"Engine.MediaPool"` |
| `Engine.JS.kPrepareLocateMissingFiles` | `"PrepareLocateMissingFiles"` |

## Edit Function Flags

`Engine.JS.EditFunctions` provides edit operation flags:

| Constant | Value | Description |
|---|---|---|
| `Engine.JS.EditFunctions.kMarkRecorded` | `1` | Mark as recorded |
| `Engine.JS.EditFunctions.kRemoveExisting` | `2` | Remove existing content |
| `Engine.JS.EditFunctions.kAppendMode` | `4` | Append mode |
| `Engine.JS.EditFunctions.kReportError` | `8` | Report errors |

## Locate Files Mode

`Engine.JS.LocateFilesMode` provides mode constants for file location operations:

| Constant | Value |
|---|---|
| `Engine.JS.LocateFilesMode.kDialog` | `0` |
| `Engine.JS.LocateFilesMode.kInstallPackages` | `1` |
