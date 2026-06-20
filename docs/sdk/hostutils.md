---
sidebar_position: 5
---
# HostUtils

After including `resource://{main}/sdk/hostutils.js`, the `HostUtils` global provides accessor methods for host-managed service surfaces.

```javascript
include_file("resource://{main}/sdk/hostutils.js");
```

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `HostUtils.getPackageManager()` | `object` | none | Get the package manager surface |
| `HostUtils.getPresetManager()` | `object` | none | Get the preset manager surface |
| `HostUtils.getDemosFileHandler()` | `object` | none | Get the demos file handler surface |
| `HostUtils.getDocumentManager()` | `object` | none | Get the document manager surface |
| `HostUtils.getMixerConsole()` | `object` | none | Get the mixer console surface |
| `HostUtils.getAudioDeviceName()` | `string` | none | Get the current audio device name |
| `HostUtils.showPatternAutomationLane(show)` | — | `show` — `1` to show, `0` to hide | Show or hide the pattern automation lane |
| `HostUtils.showSpatialAudioRenderer(show)` | — | `show` — `1` to show, `0` to hide | Show or hide the spatial audio renderer |
| `HostUtils.showPluginDetails(show)` | — | `show` — `1` to show, `0` to hide | Show or hide plugin details |

## Return Object Surfaces

The following objects are returned by `HostUtils` accessor methods.

### PackageManager

Returned by `HostUtils.getPackageManager()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `finishStartup()` | — | none | Finish package startup |
| `findPackage(id)` | `object` | `id` — package identifier | Find a package by ID |
| `canInstall(id)` | `number` | `id` — package identifier | Check whether a package can be installed |
| `isInstalled(id)` | `number` | `id` — package identifier | Check whether a package is installed |

### PresetManager

Returned by `HostUtils.getPresetManager()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `presetExists(name)` | `number` | `name` — preset name | Check whether a preset exists |
| `find(name)` | `object` | `name` — preset name | Find a preset by name |

### DemosFileHandler

Returned by `HostUtils.getDemosFileHandler()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `extractSong()` | — | none | Extract a demo song |

### DocumentManager

Returned by `HostUtils.getDocumentManager()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `newDocumentClassIterator()` | `object` | none | Create a document-class iterator |
| `find(name)` | `object` | `name` — document name | Find a document object by name |

### DocumentClassIterator

Returned by `DocumentManager.newDocumentClassIterator()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `done()` | `number` | none | Check whether iteration is complete |
| `first()` | — | none | Move to the first item |
| `last()` | — | none | Move to the last item |
| `next()` | `object` | none | Move to the next item |
| `previous()` | `object` | none | Move to the previous item |

### MixerConsole

Returned by `HostUtils.getMixerConsole()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|---|
| `audioMixer.getMasterSpeakerType()` | `number` | none | Master speaker format identifier. |
