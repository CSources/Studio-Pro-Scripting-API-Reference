---
sidebar_position: 3
---
# Engine

Track format, color, speaker, and formatter helpers for engine-level UI and track metadata.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `CrossFadeFinder` | `object` | No | `Host.Engine.CrossFadeFinder.findLeftPartner(event)` | Crossfade partner detection utility |
| `MediaClips` | `object` | No | `Host.Engine.MediaClips.collectFileTypes()` | Media clip file-type definitions |
| `Speakers` | `object` | No | `Host.Engine.Speakers.countEqualSpeakers(a, b)` | Speaker type comparison |
| `TrackColorPalette` | `object` | No | `Host.Engine.TrackColorPalette.getAt(i)` | Color palette accessed via `getAt(index)` returning ARGB integer |
| `TrackFormats` | `object` | No | `Host.Engine.TrackFormats.findEqual("Instrument")` | Track format types |


### CrossFadeFinder

`Host.Engine.CrossFadeFinder` detects crossfade partners between adjacent audio events.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `findLeftPartner(event)` | `object` — [Audio Event](../objects/event_object.md#audio-events) | `event` — audio event | Find the event to the left (overlapping predecessor) |
| `findRightPartner(event)` | `object` — [Audio Event](../objects/event_object.md#audio-events) | `event` — audio event | Find the event to the right (overlapping successor) |

### MediaClips

`Host.Engine.MediaClips.collectFileTypes()` returns a collection of supported media file type definitions.

**Collection methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `at(index)` | `object` | `index` — 0-based integer | Get file type definition by index |
| `findEqual(name)` | `object` | `name` — type identifier | Find file type by name |
| `newIterator()` | `object` | none | Create iterator over all file types |

**Item surface (from `.at(index)`, or `.current`/`next()` from iterator):**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `extension` | `string` | No | `"wav"`, `"aif"`, `"sdir"` | File extension without dot |
| `description` | `string` | No | `"Wave File"`, `"AIFF File"` | Readable description |

### Speakers

`Host.Engine.Speakers` compares speaker format identifiers for audio channel compatibility. Speaker format identifiers are integer constants (0–19+). The identifier-to-format mapping is not yet documented.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `countEqualSpeakers(a, b)` | `number` | `a`, `b` — speaker format identifiers (integer) | Number of matching channels between two speaker configurations |

### TrackColorPalette

`Host.Engine.TrackColorPalette` provides the DAW's predefined track color palette (256 colors, indexed 0–255).

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `count` | `number` | No | `256` | Number of colors in palette |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getAt(index)` | `number` | `index` — 0-based integer | Get color as ARGB integer |

### TrackFormats

`Host.Engine.TrackFormats` provides track format definitions used when creating new tracks with `addMediaTrack()`.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `count` | `number` | No | `17` | Number of track format types |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `at(index)` | `object` | `index` — 0-based integer | Get track format by index |
| `findEqual(name)` | `object` | `name` — format name string (e.g. `"Instrument"`) | Find track format by name |
| `newIterator()` | `object` | none | Create iterator over all track formats |

Format objects expose a `.mediaType` property (`"Music"` for Instrument, `"Audio"` for others). Known format names for `findEqual()`: `"Instrument"`, `"Mono"`, `"Stereo"`.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Engine.createFormatter(name)` | `object` | `name` — formatter name string (e.g. `"Media.MusicNote"`) | Create a display formatter for parameter display |
| `Host.Engine.createTrackFormatWithPort(type, port)` | `object` | `type` — track type, `port` — port | Create a track format with port assignment |

### Formatters

`Host.Engine.createFormatter(name)` creates a display formatter for parameter-backed controls. Apply the formatter to a [param](../context/parameters.md#param-object) via `setFormatter(formatter)`; the backing `.value` remains numeric while the UI displays a host-formatted string.

```javascript
// param — from context.parameters.addInteger(...), CCL:ParamList.addInteger(...), etc.
var pitchFormatter    = Host.Engine.createFormatter("Media.MusicNote");
var velocityFormatter = Host.Engine.createFormatter("Media.MusicVelocity");
param.setFormatter(pitchFormatter);  // Displays "C3" instead of "60"
```

| Formatter | Display behavior |
|---|---|
| `"Media.MusicNote"` | Displays MIDI pitch integer values as note names such as `D#2` or `C3` |
| `"Media.MusicVelocity"` | Displays velocity values using the host velocity presentation mode, including percent-style display when enabled |