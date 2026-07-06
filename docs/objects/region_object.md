---
sidebar_position: 2
---
# Region Object

The region object is accessed via the `.region` property on a note. It provides note insertion and iteration over all notes within the part. For the track-level arrangement surface, see [Event Object — Instrument Part Events](event_object.md#instrument-part-events).

Only available on selected Instrument Part or the Note Editor from the `MusicEdit` subCategory.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Track 1"` | Track name containing this part. |
| `start` | `number` | No | `0` | Start position in beats. |
| `length` | `number` | No | `52` | Duration in beats. |
| `offset` | `number` | No | `48` | Region offset. |
| `parent` | `object` | No | — | Parent track (region-like surface). See sub-object below. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start position as time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End position as time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Length as time object. |
| `soundVariationMap` | `object` [Sound Variation Map](../context/editor.md#sound-variation-map) | No | — | Per-region map of sound variation definitions. |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getRoot()` | `object` | none | Returns the root region. See sub-object below. |
| `getTrack()` | `object` | none | Returns the containing track (region-like surface). |
| `getStartTime()` | `object` | none | Start time of the part. |
| `getEndTime()` | `object` | none | End time of the part. |
| `createSequenceIterator()` | `object` | none | Creates an iterator over all notes in the region. |
| `getSoundVariationForNote(note)` | `number` | `note` — note event | Look up sound variation for a note (`-1` if none, `0+` for assigned variation). |
| `getLyricsForNote(note)` | `object` - [Lyrics Object](event_object.md#lyrics-events) | `note` — note event | Look up lyrics for a note. |

### Root

Returned by `getRoot()`. Returns a region-like object. Not the same region as `region` itself.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `""` | Name (empty string for root). |
| `start` | `number` | No | `0` | Start position in beats. |
| `length` | `number` | No | `300` | Duration in beats. |
| `offset` | `number` | No | `48` | Offset. |
| `parent` | `object` | No | — | Parent object. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Length time object. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getRoot()` | `object` | none | Returns itself. |
| `getTrack()` | `object` | none | Returns the containing track. |
| `getStartTime()` | `object` | none | Start time. |
| `getEndTime()` | `object` | none | End time. |

### Parent Track

Returned by `getTrack()` and `parent`. Both return the same region-like object. `getTrack()` returns itself.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Track 1"` | Track name. |
| `start` | `number` | No | `0` | Start position in beats. |
| `length` | `number` | No | `600` | Track length in beats. |
| `offset` | `number` | No | `48` | Offset. |
| `parent` | `object` | No | — | Parent object. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Length time object. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getRoot()` | `object` | none | Returns the root region. |
| `getTrack()` | `object` | none | Returns itself. |
| `getStartTime()` | `object` | none | Start time. |
| `getEndTime()` | `object` | none | End time. |

## Note Creation (Workaround)

Since the API does not provide a direct note-creation function on `context.functions`, note creation is done by cloning an existing note and inserting into a region.

```javascript
var fn = context.functions;

function newNote(start, length, pitch, velocity, sourceEvent) {
  var note   = sourceEvent.clone();
  var region = sourceEvent.region;

  fn.insertEvent(region, note);
  fn.moveEvent(note, start);
  fn.resizeEvent(note, length);
  fn.modifyPitch(note, pitch);
  fn.modifyVelocity(note, velocity / 127.0);
  fn.muteEvent(note, false);
  return note;
}
```

## Iterating All Notes in a Region

This pattern works in the Note Editor in a [MusicEdit](../package_structure/classfactory.md#subcategory-values) context where `context.iterator` returns individual notes. In the arrangement view, `context.iterator` returns Instrument Part Events — this pattern does not apply there.

```javascript
// sourceNote — selected MIDI note from context.iterator
var region = sourceNote.region;

var it = region.createSequenceIterator();
while (!it.done()) {
  var note = it.next();
}
```

See [Iterator](../context/iterator.md) for the iterator interface reference.

## Sound Variation Lookup

Retrieve assigned sound variation (keyswitch/articulation) index for each note in the region:

```javascript
// region — from note.region or sourceEvent.region
var it = region.createSequenceIterator();
while (!it.done()) {
  var note = it.next();
  var variation = region.getSoundVariationForNote(note);
  // variation: -1 if none, 0+ for assigned variation
}
```