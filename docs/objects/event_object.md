---
sidebar_position: 1
---
# Event Objects

Objects returned by iterators (`context.iterator`, `context.editor.activeRegion.createSequenceIterator()`, `context.editor.selection.newIterator()`) share a common base surface of timing and state properties. What additional properties they have depends on the context.

**What the event represents depends on the context:**
- **[Arranger section](#arranger-events)** — named section on the Arranger Track. Created via `context.editor.model.arranger.addArrangerEvent()`.
- **[Audio event](#audio-events)** — audio clip events with `mediaType="Audio"`.
- **[Chord event](#chord-events)** — chord track events with a `chord` sub-object.
- **[Instrument Part](#instrument-part-events)** — arrangement surface with `mediaType="Music"`. For the note-container surface, see [Region Object](region_object.md).
- **[Pattern event](#pattern-events)** — arrangement surface with `mediaType="Pattern"`.
- **[Lyrics](#lyrics-events)** — attached to MIDI notes, accessed via `getLyricsForNote(note)`.
- **[MIDI note](#midi-notes)** — has `pitch` and `velocity`, lives inside an Instrument Part (`.region`).

## Arranger Events

Accessed via `context.iterator` or `context.editor.selection.newIterator()` on the Arranger Track when selected arranger sections are available. Created via `context.editor.model.arranger.addArrangerEvent()`.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Chorus"` | Section name. |
| `color` | `number` | No | `3138760` | Section color as integer. |
| `isMuted` | `number` | No | `0` | `1` if muted. |
| `start` | `number` | No | `144` | Start position in beats. |
| `length` | `number` | No | `64` | Duration in beats. |
| `startTime` | `object` - [Time Object](time_object.md)| No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Duration time object. |
| `timeContext` | `object` - [timeContext Object](#timecontext-object)| No | — | Time context for conversions. |
| `timeFormat` | `number` | No | `2` | Time format identifier. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `globalToRegionData(pos)` | `number` | `pos` ([Time Object](time_object.md), req): Time position. | Converts global time coordinates to region-local data. |

## Audio Events

Accessed via `context.iterator` or `context.editor.selection.newIterator()` in the [TrackEdit or AudioEdit](../package_structure/classfactory.md#subcategory-values) context when selected audio events are available.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Drum Loop.wav"` | Audio clip file name. |
| `color` | `number` | No | `2434491` | Clip color as integer. |
| `mediaType` | `string` | No | `"Audio"` | Identifies this as an audio event. |
| `isMuted` | `number` | No | `0` | `1` if muted. |
| `start` | `number` | No | `0` | Start position in beats. |
| `length` | `number` | No | `186` | Duration in beats. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Duration time object. |
| `timeContext` | `object` - [timeContext Object](#timecontext-object) | No | — | Time context for conversions. |
| `timeFormat` | `number` | No | `0` | Time format identifier. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `globalToRegionData(pos)` | `number` | `pos` ([Time Object](time_object.md), req): Time position. | Converts global time coordinates to region-local data. |

## Chord Events

Accessed via `context.iterator` or `context.editor.selection.newIterator()` on the Chord Track when selected chord events are available.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `""` | Event label (empty string for chord events). |
| `color` | `number` | No | `2434491` | Event color as integer. |
| `isMuted` | `number` | No | `0` | `1` if muted. |
| `start` | `number` | No | `112` | Start position in beats. |
| `length` | `number` | No | `84` | Duration in beats. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Duration time object. |
| `chord` | `object` [Chord Data Object](#chord-data-object) | No | — | Chord data sub-object (see below). |
| `timeContext` | `object` - [timeContext Object](#timecontext-object) | No | — | Time context for conversions. |
| `timeFormat` | `number` | No | `2` | Time format identifier. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `globalToRegionData(pos)` | `number` | `pos` ([Time Object](time_object.md), req): Time position. | Converts global time coordinates to region-local data. |

### Chord Data Object

| Property | Description |
|---|---|
| `name` | Full chord name string, e.g., `"Asus4"`, `"Gm"`, `"E"`. |
| `type` | Chord type ID (`0` maj, `1` min, `2` dim, `3` aug, `4` sus2, `5` sus4, `6` power). |
| `root` | Root note offset as an absolute directional coordinate on the Circle of Fifths Spiral. |
| `bass` | Bass note offset as an absolute directional coordinate on the Circle of Fifths Spiral. |
| `rootPitch` | Root pitch as an absolute MIDI value (`0 = C`, `1 = C#`, etc.). |
| `bassPitch` | Bass pitch as an absolute MIDI value. |

| Method | Description |
|---|---|
| `hasInterval(interval)` | Boolean check for whether the chord contains a given interval. |

**`rootPitch` / `bassPitch`:** Absolute MIDI pitch values anchored to C=0, independent of key signature.

**`root` / `bass`:** Absolute directional coordinates on the Circle of Fifths Spiral, used to distinguish enharmonic spellings and chord inversion position.

| Spiral ID (`root`) | MIDI Pitch (`rootPitch`) | Note Name | Harmonic Context |
| :--- | :--- | :--- | :--- |
| **-6** | 6 | **G♭** | Max Flat Pole |
| **-5** | 1 | **D♭** | |
| **-4** | 8 | **A♭** | |
| **-3** | 3 | **E♭** | |
| **-2** | 10 | **B♭** | |
| **-1** | 5 | **F** | |
| **0** | 0 | **C** | **Center (Home)** |
| **1** | 7 | **G** | |
| **2** | 2 | **D** | |
| **3** | 9 | **A** | |
| **4** | 4 | **E** | |
| **5** | 11 | **B** | |
| **6** | 6 | **F♯** | Max Sharp Pole |
| **7** | 1 | **C♯** | |
| **8** | 8 | **G♯** | |
| **9** | 3 | **D♯** | |
| **10** | 10 | **A♯** | |
| **11** | 5 | **E♯** | Theoretical Sharp |

### Chord-Scrape Workflow

For a ready-to-use chord scraping script, see the [Chord Mapping script](../scripts/chord-mapping.md). It automates the process of exporting chord data to JSON and a results log.

## Instrument Part Events

Accessed via `context.iterator` or `context.editor.selection.newIterator()` when selected instrument part events are available. This is the track-level arrangement surface of an Instrument Part. For the note-container surface, see [Region Object](region_object.md).

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Track 1"` | Part label (matches track name). |
| `color` | `number` | No | `2434491` | Part color as integer. |
| `mediaType` | `string` | No | `"Music"` | Identifies this as a music part event. |
| `isMuted` | `number` | No | `0` | `1` if muted. |
| `velocity` | `number` | No | `100` | Default velocity. |
| `start` | `number` | No | `0` | Start position in beats. |
| `length` | `number` | No | `128` | Duration in beats. |
| `offset` | `number` | No | `48` | Offset. |
| `syncPoint` | `object` — [Time Object](time_object.md) | No | — | Sync point position. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Duration time object. |
| `timeContext` | `object` - [timeContext Object](#timecontext-object) | No | — | Time context for conversions. |
| `timeFormat` | `number` | No | `2` | Time format identifier. |
| `parent` | `object` | No | — | Parent object. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getRoot()` | `object` | none | Returns the root region. |
| `getTrack()` | `object` | none | Returns the containing track. |
| `createSequenceIterator()` | `object` | none | Creates an iterator over all notes in the region. |
| `globalToRegionData(pos)` | `number` | `pos` ([Time Object](time_object.md), req): Time position. | Converts global time coordinates to region-local data. |

## Pattern Events

Accessed via `context.iterator` or `context.editor.selection.newIterator()` when selected pattern events are available.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Track 1"` | Part label (matches track name). |
| `color` | `number` | No | `2434491` | Part color as integer. |
| `mediaType` | `string` | No | `"Pattern"` | Identifies this as a pattern part event. |
| `isMuted` | `number` | No | `0` | `1` if muted. |
| `velocity` | `number` | No | `100` | Default velocity. |
| `start` | `number` | No | `152` | Start position in beats. |
| `length` | `number` | No | `56` | Duration in beats. |
| `offset` | `number` | No | `48` | Offset. |
| `syncPoint` | `object` — [Time Object](time_object.md) | No | — | Sync point position. |
| `startTime` | `object` - [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` - [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` - [Time Object](time_object.md) | No | — | Duration time object. |
| `timeContext` | `object` - [timeContext Object](#timecontext-object) | No | — | Time context for conversions. |
| `timeFormat` | `number` | No | `2` | Time format identifier. |
| `parent` | `object` | No | — | Parent object. |

| Method | Returns | Parameters | Description |
|---|---|---|---|---|
| `getRoot()` | `object` | none | Returns the root region. |
| `getTrack()` | `object` | none | Returns the containing track. |
| `globalToRegionData(pos)` | `number` | `pos` ([Time Object](time_object.md), req): Time position. | Converts global time coordinates to region-local data. |

## Lyrics Events

Lyrics are accessed via `context.editor.activeRegion.getLyricsForNote(note)` on a selected region.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `text` | `string` | No | `"Hello world"` | The lyric text |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `toString()` | `string` | none | Returns the lyric text |
| `clone()` | `object` - [Lyrics Event](#lyrics-events) | none | Returns a new copy of the lyrics object |

```javascript
// note — selected MIDI note from context.iterator (MusicEdit context)
var lyrics = context.editor.activeRegion.getLyricsForNote(note);
if (lyrics) {
  var text = lyrics.text;
}
```

## MIDI Notes

Accessed via `context.iterator` from the Note Editor in a [MusicEdit](../package_structure/classfactory.md#subcategory-values) context when selected notes are available. `context.editor.activeRegion.createSequenceIterator()` also provides all notes in the selected region.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `pitch` | `number` | No | `48` | MIDI note number (0–127). |
| `velocity` | `number` | No | `0.8` | MIDI velocity as float (0.0–1.0). |
| `selected` | `number` | No | `1` | Selection state (`1` = selected). |
| `isMuted` | `number` | No | `0` | `1` if muted. |
| `start` | `number` | No | `6.75` | Start position in beats. |
| `end` | `number` | No | `7` | End position in beats. |
| `length` | `number` | No | `0.25` | Duration in beats. |
| `startTime` | `object` [Time Object](time_object.md) | No | — | Start time object. |
| `endTime` | `object` [Time Object](time_object.md) | No | — | End time object. |
| `lengthTime` | `object` [Time Object](time_object.md) | No | — | Duration time object. |
| `region` | `object` - [Region Object](region_object.md) | No | — | Containing Instrument Part. |
| `timeContext` | `object` - [timeContext Object](#timecontext-object) | No | — | Time context (`secondsToPpq()`, `ppqToSeconds()`, `getBarStart()`). |
| `timeFormat` | `number` | No | `2` | Time format identifier. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `clone()` | `object` - [MIDI Note](#midi-notes) | none | Clones the event. |
| `nextEvent()` | `object` - [MIDI Note](#midi-notes) | none | Next event in the region sequence. |
| `previousEvent()` | `object` - [MIDI Note](#midi-notes) | none | Previous event in the region sequence. |
| `globalToRegionData(pos)` | `number` | `pos` ([Time Object](time_object.md), req): Time position. | Converts global time coordinates to region-local data. |

## timeContext Object

Accessed via the `.timeContext` property on any event.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `secondsToPpq(seconds)` | `number` | `seconds` — time in seconds | Convert seconds to musical PPQ |
| `ppqToSeconds(beats)` | `number` | `beats` — time in beats | Convert beats to seconds |
| `getBarStart(musical)` | `number` | `musical` — musical position | Get the bar start position for a given musical position |

```javascript
// event — selected event from context.iterator
var start = event.startTime.musical;
var barStart = event.timeContext.getBarStart(start);
```