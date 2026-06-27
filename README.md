# Studio Pro Scripting API Reference

**Platform:** Fender Studio Pro / PreSonus Studio One

> ⚠️ **Disclaimer:** Fender/PreSonus does not provide official public documentation for this API. This reference is entirely community-derived and incomplete. The API is internal and undocumented.

[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://CSources.github.io/Studio-Pro-Scripting-API-Reference/)

---

## Table of Contents

| Section | Description |
|---|---|
| [Package Structure](docs/package_structure/package_structure.md) | Required files, metainfo.xml, classfactory.xml |
| [Script Types](docs/script_types/script_interfaces.md) | Category reference and registration patterns |
| [Host API](docs/host/host_overview.md) | Host namespace — Classes, Engine, GUI, IO, Signals, etc. |
| [SDK Files](docs/sdk/sdk_files.md) | CCL.JS, Engine.JS, Devices.JS, HostUtils, etc. |
| [Context Object](docs/context/context_object.md) | editor, functions, iterator, parameters, track list |
| [Objects](docs/objects/event_object.md) | Event, Region, Track, Channel, Mixer, Time objects |
| [Skin XML Reference](docs/skin/skin_overview.md) | Known skin.xml element and attribute reference |
| [Utilities](docs/utilities/utilities.md) | Color, tempo, level conversions; debugging tools |
| [Scripts](docs/scripts/index.md) | Real-world script implementation examples |
| [API Index](docs/api_index.md) | Map of all documentation pages |

---

## Known Limitations & Open Items

### Potential Limitations / Observational Quirks

| Limitation | Detail |
|---|---|
| **No MIDI CC iteration** | `context.iterator`, `editor.selection.newIterator()`, and `activeRegion.createSequenceIterator()` exposed only note events; CC/controller fields stayed undefined |
| **mainTrackList availability** | `context.mainTrackList` is undefined in `MusicEdit` |
| **Selection is not undoable** | Disable journaling before any selection operations |
| **Piano editor quantize UI** | Read-only via `context.editor.quantize` |
| **context.iterator availability** | May be sparse or unavailable depending on the active editor surface and selection state |
| **Event time object mutability** | `event.startTime`, `endTime`, `lengthTime` return snapshots — writing to `.seconds` or `.musical` has no effect. Use `newMediaTime()` + edit functions. |
| **Bar Offset is visual only** | `editor.activeRegion.start` and `event.region.start` return the absolute beat position and do not consider Bar Offset |

### Open Items

- Complete `skin.xml` element and attribute reference. Still missing documentation.

---

## Community Resources & Sources

| Resource | URL |
|---|---|
| Studio One Toolbox | https://s1toolbox.com/navigationessentials |
| GitHub — DjFix functions helper | https://github.com/DjFix/studioone_functions |
| KVR Audio Forum | https://www.kvraudio.com/forum/viewtopic.php?t=506195 |
| audiosex.pro Forum | https://audiosex.pro/threads/how-do-you-install-studio-one-x.30244/ |
| GitHub — Track-Actions | https://github.com/jamesg545454/Track-Actions |

### References Used
- **Navigation Essentials 2.0.1** (Lukas Ruschitzka) — reference track selection, colorize, piano editor tasks
- **Studio One X v2.6.1** (Narech Kontcell) (`studioonex.package`) — extensive source reference
- **Studio One Scripts.exe** (LawrenceF:**KVR**) - referenced source files
- **ChordstoBiabTextFile** (crossovercable:**KVR**, tonedef71:**KVR**) - reference source files for chord events
- **Track-Actions** (Jamesg545454) - reference multi-command .JS files
- **Logical Editor** (Jamesg545454) - reference display formatter for parameter-backed controls, form background, view layout wrapper

*Community-compiled, not affiliated with Fender or PreSonus*

## Running Locally

**Prerequisites:** Node.js >= 20

```bash
npm install
npm run start      # Dev server with hot reload at localhost:3000
npm run build      # Static production build
npm run serve      # Preview the build locally
```

---