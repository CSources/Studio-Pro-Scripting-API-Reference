---
sidebar_position: 3
---
# Track Object

The track object exposes the core track surface and basic selection / folder state. Accessed through `context.mainTrackList.getTrack(index)` or `context.mainTrackList.getSelectedTrack(index)`.

```javascript
var tl = context.mainTrackList;
var track = tl.getTrack(0);           // First track by index
var selected = tl.getSelectedTrack(0); // First selected track
```

Same object reference is returned by both `getTrack()` and `getSelectedTrack()` for the same track. See [mainTrackList](../context/mainTrackList.md) for full track-list surface.

Only available in `performEdit` — `prepareEdit` has no track access path.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Track 1"` | Track display name. |
| `color` | `number` | No | `2434491` | Track color as RGB integer. |
| `mediaType` | `string` | No | `"Music"` / `"Audio"` | Track media type. `"Music"` for instrument tracks, `"Audio"` for audio tracks. |
| `iconID` | `string` | No | `"drums/drumpad"` | Track icon identifier. Read-only. |
| `channel` | `object` - [Channel object](channel_object.md)| No | — | Channel strip object. |
| `parent` | `object` | No | — | Parent container object. |
| `isFolder` | `number` | No | `1` | `1` if track is a folder track. |
| `hidden` | `number` | No | `1` | `1` if track is hidden. |
| `delay` | `number` | No | `480` | Track delay in samples. |
| `start` | `number` | No | `0` | Track start position in beats. |
| `length` | `number` | No | `600` | Track length in beats. |
| `offset` | `number` | No | `48` | Track time offset in beats. |
| `isMuted` | `number` | No | `0` | `1` if track is muted, `0` otherwise. |
| `trackIndex` | `number` | No | `5` | Track position index. |
| `layers` | `object` | No | — | Track layers surface. |

### Layers

The `.layers` property on a track. Present on all track types.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `count` | `number` | No | `1` (Music) / `3` (Audio) | Number of layers |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getTrack()` | `object` | none | Returns the track object itself (identity reference). |
| `isEmpty()` | `number` | none | Returns `0` if the track has content, `1` if empty. |