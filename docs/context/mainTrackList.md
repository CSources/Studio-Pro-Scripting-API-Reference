---
sidebar_position: 5
---
# MainTrackList

`context.mainTrackList` is the track-list surface used for selection and track creation workflows. Also accessible as `context.trackList` (same object reference).

Available in `performEdit` (TrackEdit context) only.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `numSelectedTracks` | `number` | No | `1` | Number of currently selected tracks. |
| `numTracks` | `number` | No | `3` | Total number of tracks in the project. |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `expandAll(expand, recursive)` | — | `expand` (`boolean`, req): `true` = expand, `false` = collapse. `recursive` (`boolean`, req): `true` = apply to nested folders. | Expands or collapses all folder tracks. |
| `getInsertPosition()` | `number` | (none) | Returns the track insert position. Returns a valid index when a track is selected, `-1` when no track is selected. |
| `getTrack(index)` | `object` | `index` (`number`, req): Track index. | Returns the track at the given index. See [Track Object](../objects/track_object.md). |
| `getSelectedTrack(index)` | `object` | `index` (`number`, req): Selected-track index. | Returns the selected track at the given index. See [Track Object](../objects/track_object.md). Same object as `getTrack(index)` for the same track. |
| `selectTrack(track, addToSelection, exclusive)` | — | `track` (`object`, req): A track object. `addToSelection` (`boolean`, opt): `true` = add to selection, `false` = deselect. `exclusive` (`boolean`, opt): `true` = unselect others first. | Selects or deselects a track. Accepts 1 arg (`track` only) to select exclusively, or 2-3 args for fine control. |
| `unselectAll()` | — | (none) | Clears the track selection. |

## Track Creation Pattern

`context.mainTrackList` provides the insertion index. `musicPartFunctions` (see [functions](functions.md)) creates the folder and child tracks, then `moveToFolder(parentFolder, track, childIndex)` moves the child track into the folder.

```javascript
include_file("resource://{main}/sdk/engine.js");

var root = context.functions.root;
var musicPartFunctions = root.createFunctions("MusicPartFunctions");

var trackFormat = Host.Engine.TrackFormats.findEqual("Instrument");
var insertIndex = context.mainTrackList.getInsertPosition();

musicPartFunctions.executeImmediately = true;

var folderTrack = musicPartFunctions.addTrack(
  Engine.JS.kClassFolderTrack,
  insertIndex,
  "Folder"
);

var childTrack = musicPartFunctions.addMediaTrack(
  insertIndex + 1,
  "Child",
  trackFormat
);

musicPartFunctions.moveToFolder(folderTrack, childTrack, 0);
```