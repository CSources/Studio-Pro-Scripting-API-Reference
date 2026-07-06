---
sidebar_position: 3
---
# Functions

`context.functions` exposes the edit-function surface for the current script context. The available methods vary by [`subCategory`](../package_structure/classfactory.md#subcategory-values). Available in `performEdit` only.

## Properties

The following native accessor properties are available directly on `context.functions` in all edit contexts.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `root` | `object` | No | `fn.root` | Returns the root document object. Use `fn.root.createFunctions("FamilyName")` to create specialized function families. |
| `executeImmediately` | `number` | Yes | `fn.executeImmediately = 1` | When set to `1`, edit operations execute immediately for real-time dialog preview. Reset to `0` after use. |

## Methods

Available methods vary by edit context. The sections below list methods per [`subCategory`](../package_structure/classfactory.md#subcategory-values) context.

### Base Methods

The following methods are inherited from a shared base prototype and appear in every context.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `beginMultiple(name)` | — | `name` (`string`, req): Undo label. | Begins a grouped transaction. |
| `endMultiple(cancel)` | — | `cancel` (`boolean`, req): `true` = roll back, `false` = commit. | Ends a grouped transaction. |
| `isJournalEnabled()` | `number` | (none) | Returns `1` if enabled, `0` if disabled. |
| `setJournalEnabled(enable)` | — | `enable` (`boolean`, req): `true` / `false`. | Enables or disables journal. |


### TrackEdit / EventEdit Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addEvent(event)` | — | `event` (`object`, req) | Adds an event. |
| `addEventOnParent(event)` | — | `event` (`object`, req) | Adds an event on the parent. |
| `addEventOnTrack(event)` | — | `event` (`object`, req) | Adds an event on a track. |
| `addMediaTrack(index, name, trackFormat)` | — | `index` (`number`, req), `name` (`string`, req), `trackFormat` (`object`, req) | Adds a new media track. |
| `addTrack(classID, index, name)` | — | `classID`, `index` (`number`, req), `name` (`string`, req) | Adds a new track by class ID. |
| `colorizeEvent(event, color)` | — | `event` (`object`, req), `color` (`number`, req) | Sets the color of an event or track. |
| `duplicateTrack(track)` | — | `track` (`object`, req) | Duplicates a track. |
| `enableLoop(enable)` | — | `enable` (`boolean`, req) | Enables or disables loop. |
| `enableSyncPoint(enable)` | — | `enable` (`boolean`, req) | Enables or disables sync point on an event. |
| `importFile(path)` | — | `path` (`string`, req) | Imports a file. |
| `importFiles(paths)` | — | `paths` (`array`, req) | Imports multiple files. |
| `insertNewClip(type, start, end, track)` | — | `type` (`string`, req), `start` ([Time Object](../objects/time_object.md), req), `end` ([Time Object](../objects/time_object.md), req), `track` (`object`, req) | Inserts a new audio or instrument part |
| `makeIndependent(event)` | — | `event` (`object`, req) | Makes an event independent of shared copies. |
| `moveEvent(event, time)` | — | `event` (`note event`, req), `time` ([Time Object](../objects/time_object.md) or `number`, req): New time. | Moves an event to a new time position. |
| `moveToFolder(parentFolder, track, childIndex)` | — | `parentFolder` (`object`, req), `track` (`object`, req), `childIndex` (`number`, opt) | Moves a track into a folder. |
| `muteEvent(event, mute)` | — | `event` (`note event`, req), `mute` (`boolean`, req): `true` = mute, `false` = unmute. | Mutes or unmutes an event. |
| `newMediaTime()` | `object` — [Time Object](../objects/time_object.md) | (none) | Creates new time object initialized at '0'. |
| `removeEvent(event)` | — | `event` (`object`, req) | Removes an event. |
| `removeRange(start, end)` | — | `start` ([Time Object](../objects/time_object.md), req), `end` ([Time Object](../objects/time_object.md), req) | Removes a time range. |
| `removeTrack(track)` | — | `track` (`object`, req) | Removes a track. |
| `renameEvent(event, name)` | — | `event` (`object`, req), `name` (`string`, req) | Renames an event. |
| `resizeEvent(event, length)` | — | `event` (`note event`, req), `length` (`number`, req): New length in beats. | Resizes an event. |
| `setEventAttribute(event, name, value)` | — | `event` (`object`, req), `name` (`string`, req), `value` (req) | - |
| `setEventIndex(event, index)` | — | `event` (`object`, req), `index` (`number`, req) | - |
| `setIconID(id)` | — | `id` (`number`/`string`, req) | - |
| `setLoopRange(start, end)` | — | `start` ([Time Object](../objects/time_object.md), req), `end` ([Time Object](../objects/time_object.md), req) | Sets the loop range. |
| `setSyncPoint(time)` | — | `time` ([Time Object](../objects/time_object.md), req) | Sets the sync point position on event. |
| `setTrackDelay(track, delay)` | — | `track` (`object`, req), `delay` (`number`, req) | Sets track delay in samples. |
| `splitEvent(event, time)` | — | `event` (`object`, req), `time` ([Time Object](../objects/time_object.md), req) | Splits an event at the given time. |
| `toBack(event)` | — | `event` (`object`, req) | Sends an event to the back. |
| `toFront(event)` | — | `event` (`object`, req) | Brings an event to the front. |
| `transferEvent(source, destination)` | — | `source` (`object`, req), `destination` (`object`, req) | Transfers an event to another track. |
| `transposeEvent(event, semitones)` | — | `event` (`object`, req), `semitones` (`number`, req) | Transposes an event by semitones. |

### AudioEdit Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `createAutoFades()` | — | (none) | Creates auto-fades on audio events. |
| `createCrossFade(leftEvent, rightEvent)` | — | `leftEvent` (`object`, req), `rightEvent` (`object`, req) | Creates a crossfade between two audio events. |
| `createCrossFades(events, fadeLengthSeconds)` | — | `events` (`array`, req), `fadeLengthSeconds` (`number`, req) | Creates crossfades on multiple audio events. |
| `createFadeIn(event, fadeType, fadeLength, fadeBend)` | — | `event` (`object`, req), `fadeType` (`number`, req), `fadeLength` (`number`, req), `fadeBend` (`number`, req) | Creates a fade-in on an audio event. |
| `createFadeOut(event, fadeType, fadeLength, fadeBend)` | — | `event` (`object`, req), `fadeType` (`number`, req), `fadeLength` (`number`, req), `fadeBend` (`number`, req) | Creates a fade-out on an audio event. |
| `modifyVolume(event, volume)` | — | `event` (`object`, req), `volume` (`number`, req) | Modifies the gain of an audio event. |
| `removeCrossFade(event)` | — | `event` (`object`, req) | Removes a crossfade from an audio event. |

Fade types:

| Value | Type |
|---|---|
| `0` | Linear |
| `1` | Logarithmic |
| `2` | Exponential |

### MusicEdit Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `deleteEvent(event)` | — | `event` (`note event`, req): Event to delete. | Deletes an event. |
| `freezePitch(event)` | — | `event` (`note event`, req): Event to freeze. | - |
| `freezeQuantize(event)` | — | `event` (`note event`, req): Event to freeze. | - |
| `freezeVelocity(event)` | — | `event` (`note event`, req): Event to freeze. | - |
| `insertEvent(region, event)` | — | `region` (`object`, req), `event` (`note event`, req). | Inserts a cloned event into a region. Use with `clone()` — insert first, then modify. |
| `modifyPitch(event, pitch)` | — | `event` (`note event`, req), `pitch` (`number`, req): MIDI pitch 0–127. | Changes pitch. |
| `modifyVelocity(event, velocity)` | — | `event` (`note event`, req), `velocity` (`number`, req): 0–127 or 0.0–1.0. | Changes velocity. |
| `moveEvent(event, time)` | — | `event` (`object`, req), `time` ([Time Object](../objects/time_object.md), req) | Moves an event to a new time position. |
| `muteEvent(event, mute)` | — | `event` (`object`, req), `mute` (`boolean`, req) | Mutes or unmutes an event. |
| `quantize(event)` | — | `event` (`object`, req) | Quantizes an event to the grid. |
| `quantizeEvent(event)` | — | `event` (`object`, req) | - |
| `resizeEvent(event, length)` | — | `event` (`object`, req), `length` (`number`, req) | Resizes an event. |
| `setLyrics(event, text)` | — | `event` (`object`, req), `text` (`string`, req) | Sets lyrics on an event. |

### MusicPartEdit Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addInstrument()` | — | (none) | Adds an instrument. |
| `addInstrumentTrack()` | `object` — `Track` | (none) | Adds an instrument track. |
| `addMusicPart()` | — | (none) | Adds a music part. |
| `addNoteFX()` | — | (none) | Adds a note FX plugin. |
| `connectTrackWithInstrument(track, instrument)` | — | `track` (`object`, req), `instrument` (`object`, req) | Connects a track with an instrument. |
| `createPitchNameList(track)` | `object` — `PitchNameList` | `track` (`object`, req) | Creates a pitch name list. |
| `removeAllNoteControllerEnvelopes()` | — | (none) | Removes all note controller envelopes. |
| `removeInstrument(track)` | — | `track` (`object`, req) | Removes an instrument from a track. |
| `replaceInstrument()` | — | (none) | Replaces an instrument. |

### PitchNameList Object

Returned by `createPitchNameList(track)`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getPitchName(pitch)` | `string` | `pitch` (`number`, req): 0–127. | Returns the name for a MIDI pitch. Empty string if no name assigned. |
| `loadFromFile(path)` | — | `path` (`string`, req) | Loads pitch names from a file. |
| `saveToFile(path)` | — | `path` (`string`, req) | Saves pitch names to a file. |

### ProjectEdit Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addMarker()` | — | (none) | Adds a project marker. |
| `createCrossFade(leftEvent, rightEvent)` | — | `leftEvent` (`object`, req), `rightEvent` (`object`, req) | Creates a crossfade between two events. |
| `disableTrack(track)` | — | `track` (`object`, req) | Disables a track. |
| `duplicateTrack(track)` | — | `track` (`object`, req) | Duplicates a track. |
| `moveMarker(marker, time)` | — | `marker` (`object`, req), `time` ([Time Object](../objects/time_object.md), req) | Moves a marker to a new position. |
| `removeMarker(marker)` | — | `marker` (`object`, req) | Removes a project marker. |
| `removeTrack(track)` | — | `track` (`object`, req) | Removes a track. |
| `resizeTrack(track, length)` | — | `track` (`object`, req), `length` (`number`, req) | Resizes a track's content. |
| `setTrackAttribute(track, name, value)` | — | `track` (`object`, req), `name` (`string`, req), `value` (req) | Sets a track attribute. |
| `setTrackColor(track, color)` | — | `track` (`object`, req), `color` (`number`, req) | Sets a track's color. |
| `setTrackPause(track, pause)` | — | `track` (`object`, req), `pause` (`boolean`, req) | - |

## root

The root document object accessed via `context.functions.root`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `environment` | `object` | No | `fn.root.environment.find("MixerConsole")` | The document environment (`"SongEnvironment"`). Has its own methods: `find(name)`, `findParameter(path)`, `getPortList()`, `interpretCommand(cmd)`. See below. |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `asEventList()` | `object` | (none) | Returns root as an event list. |
| `createFunctions("FamilyName")` | `object` | `familyName` (`string`, req) | Creates a specialized function family (e.g. `"AudioFunctions"`). |
| `createIterator()` | `object` | (none) | Creates an iterator over layer/region containers (not notes). |
| `findFolderTrack(trackID)` | `object` | `trackID` (`number`, req) | Finds a folder track by ID. |
| `findTrackByClass(classID)` | `object` | `classID` (req) | Finds a track by class ID. |
| `findTrackByID(trackID)` | `object` | `trackID` (`number`, req) | Finds a track by numeric ID. |
| `getEndTime()` | `object` - [Time Object](../objects/time_object.md) | (none) | Returns the end time of the document. |
| `getLayer(index)` | `object` | `index` (`number`, req) | Returns a layer object by index. |
| `getLayerIndex()` | `number` | (none) | Returns the current layer index. |
| `getRoot()` | `object` | (none) | Returns the root object (self). |
| `getStartTime()` | `object` - [Time Object](../objects/time_object.md) | (none) | Returns the start time of the document. |
| `getTrack(index)` | `object` | `index` (`number`, req) | Returns a track by index. |
| `globalToRegionData(globalTime, track)` | `object` | `globalTime` ([Time Object](../objects/time_object.md), req), `track` (`object`, req) | - |
| `isEmpty()` | `number` | (none) | Returns `1` if the document is empty. |
| `regionDataToGlobal(regionTime, track)` | `object` | `regionTime` ([Time Object](../objects/time_object.md), req), `track` (`object`, req) | - |

### environment

`context.functions.root.environment` is the document environment for the current context (`"SongEnvironment"`). Provides access to the named objects and parameters.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `env.name` → `"SongEnvironment"` | Session type indicator |
| `parent` | `object` | No | `env.parent` | Parent object (opaque to JS). |
| `title` | `string` | No | `env.title` | Title string. |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `find(name)` | `object` | `name` (`string`, req) | Finds a named document object (e.g. `"MixerConsole"`). |
| `findParameter(path)` | `object` | `path` (`string`, req) | Finds a parameter by path. |
| `getPortList()` | `array` | (none) | Returns the port list. |
| `interpretCommand(cmd)` | — | `cmd` (`string`, req) | Interprets a command string. |

Mixer Console example:

```javascript
var console = context.functions.root.environment.find("MixerConsole");
var channels = console.getChannelList(1);
```

See [Mixer Channels](../objects/mixer_channels.md) for the full mixer channel API reference.

## Function Families

Some edit operations are exposed through root-specific function families created with `context.functions.root.createFunctions("FamilyName")`.

Create the family from the root of the object you intend to edit, since the same family may not work from another context.

```javascript
var fn = context.functions;
fn.beginMultiple("Transpose");
fn.modifyPitch(event, 60);
fn.endMultiple(false);
var mf = fn.root.createFunctions("MusicFunctions");
```

### AudioEffectFunctions

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `insertEventEffect(audioEvent, presetOrClassID)` | `object` | `audioEvent` (`object`, req), `presetOrClassID` (req) | Inserts an audio effect on an audio event. |
| `setEventEffectTail(eventEffect, seconds)` | — | `eventEffect` (`object`, req), `seconds` (`number`, req) | Sets the tail duration of an event effect. |

All other AudioEffectFunctions methods match the [Base Methods](#base-methods) surface above.

### AudioFunctions

All AudioFunctions methods match the [AudioEdit](#audioedit-methods), [Base Methods](#base-methods), and [TrackEdit / EventEdit](#trackedit--eventedit-methods) surfaces above.

### AutomationFunctions

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `removeAllAutomation(trackOrEvent)` | `number` | `trackOrEvent` (`object`, req) | Removes all automation from a track or event. Returns `1` on success. |
| `setFocusRegion(region)` | `number` | `region` (`object`, req) | Sets the focus region for automation editing. Returns `1` on success. |

All other AutomationFunctions methods match the [Base Methods](#base-methods) and [TrackEdit / EventEdit](#trackedit--eventedit-methods) surfaces above.

### DeviceEditFunctions

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `colorizeChannel(channel, colorCode)` | — | `channel` (`object`, req), `colorCode` (`number`, req) | Sets the color of a channel. |
| `connectChannel(channel, destinationInput)` | — | `channel` (`object`, req), `destinationInput` (req) | Connects a channel to a destination input. |
| `insertDevice(folder, presetOrClassID)` | — | `folder` (`object`, req), `presetOrClassID` (req) | Inserts a device into a folder or channel. |

All other DeviceEditFunctions methods match the [Base Methods](#base-methods) surface above.

### MusicFunctions

All MusicFunctions methods match the [MusicEdit](#musicedit-methods) and [Base Methods](#base-methods) surfaces above.

### MusicPartFunctions

All MusicPartFunctions methods match the [MusicPartEdit](#musicpartedit-methods), [Base Methods](#base-methods), and [TrackEdit / EventEdit](#trackedit--eventedit-methods) surfaces above.

### Function Families Patterns

### Pitch Name List Pattern (MusicPartFunctions)

```javascript
var musicPartFunctions = context.editor.activeRegion.getRoot()
  .createFunctions("MusicPartFunctions");
var nameList = musicPartFunctions.createPitchNameList(track); //'track' is your instrument track
for (var i = 127; i >= 0; i--) {
  var name = nameList.getPitchName(i).trim();
  if (name.length > 0) { /* pitch i has a named keyswitch/articulation */ }
}
```

### Root-Specific Function Family Pattern

```javascript
var root = event.getRoot ? event.getRoot() : event.region.getRoot();
var audioFunctions = root.createFunctions("AudioFunctions");
audioFunctions.createCrossFades(events, fadeLengthSeconds);
```

## Usage Patterns

### Undo Grouping Pattern

Wrap modifications in an undo group so the host can commit or cancel them as a single action.

```javascript
var fn = context.functions;
fn.beginMultiple("Operation Name");
try {
  // ... perform undoable edits ...
  fn.endMultiple(false);  // false = committed
} catch(e) {
  fn.endMultiple(true);   // true = cancelled/rollback
  return Host.Results.kResultFailed;
}
return Host.Results.kResultOk;
```

### Selection Journaling Pattern

Selection operations are not undoable. Disable journaling before selecting, then restore the original state.

```javascript
var fn = context.functions;
var wasEnabled = fn.isJournalEnabled();
fn.setJournalEnabled(false);
try {
  // ... select notes/tracks ...
} finally {
  fn.setJournalEnabled(wasEnabled);
}
```