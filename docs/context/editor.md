---
sidebar_position: 2
---
# Editor

`context.editor` exposes the active editor surface, model, cursor state, quantize helper, and selection object.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `activeRegion` | `object` | no | — | Active region surface. Only available when editing a region/part. |
| `cursorInfo` | `object` | no | — | Cursor position data. |
| `environment` | `object` | no | — | Editor environment surface. |
| `model` | `object` | no | — | Editor model surface. |
| `selection` | `object` | no | — | Selection control surface. |
| `quantize` | `object` | no | — | Quantize grid helper. |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `canSelect(note)` | `number` | `note` (`object`, req) | Checks if a note can be selected. Returns `1` if selectable. |
| `createSelectFunctions(functions)` | `object` | `functions` (`object`, req): `context.functions`. | Builds a selection helper surface. |
| `deleteItem(note)` | — | `note` (`object`, req) | Deletes a note from the editor. |
| `editItem(note)` | `number` | `note` (`object`, req) | Starts editing a note in place. Returns `1` on success. |
| `isSameItem(n1, n2)` | `number` | `n1, n2` (`object`, req) | Checks if two references point to the same item. Returns `1` if same, `0` if different. |
| `showSelection(show)` | — | `show` (`boolean`, req): Show or hide. | Shows or hides the current selection. |
| `sizeAdjacent()` | — | (none) | Resizes adjacent items to fill gaps. |
| `sizeLeft(event, size)` | `object` | `event` (`object`, req), `size` (`number`, req) | Resize left edge of an event by the given amount. |
| `sizeRight(event, size)` | `object` | `event` (`object`, req), `size` (`number`, req) | Resize right edge of an event by the given amount. |
| `suspendFollowEvents()` | — | (none) | Suspends follow-event mode. |

### SelectFunctions

Returned by `context.editor.createSelectFunctions(functions)`. The journal methods (`beginMultiple`, `endMultiple`, `setJournalEnabled`, `isJournalEnabled`) are the same as `context.functions` — see [functions.md](functions.md).

#### Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `executeImmediately` | `number` | yes | `1` | `0` = defer operations, `1` = execute immediately. |

#### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `selectMultiple(events)` | — | `events` (`array`, req): Array of event objects. | Selects multiple events. |

## Active Region

`context.editor.activeRegion` exposes the active region surface.

### Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `soundVariationMap` | `object` | No | — | Per-region map of sound variation definitions. |

### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `createSequenceIterator()` | `object` | (none) | Creates an iterator over the sequence's note events. |
| `getSoundVariationForNote(note)` | `number` | `note` (`note event`, req): A note event from the iterator. | Returns the 0-based sound variation index for the note (`-1` if no variation is active at the note's position). |
| `getLyricsForNote(note)` | `object` | `note` (`note event`, req): A note event from the iterator. | Returns a lyrics object for events with lyrics. |

The [Event Object — Lyrics Events](../objects/event_object.md#lyrics-events) for the full lyrics object surface.

### Sound Variation Map

`context.editor.activeRegion.soundVariationMap` exposes the active region's sound variation definitions. The map is read-only.

#### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `lookupVariationByID(id)` | `object` [Variation Object](#variation-object) | `id` (`number` or `string`, req): variation id to look up. | Returns the variation object for the given id (provided by `getSoundVariationForNote(note)`). |

#### Variation Object

Returned by `lookupVariationByID`.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Vibrato"` | Display name of the variation. |
| `id` | `number` | No | `0` | - |

**Example:**

See the [Select by Sound Variation Script](/docs/scripts/select-sound-variation.md#sound-variation-map-access) for a finished script example showing its usage.

## Cursor Info

`context.editor.cursorInfo` exposes cursor position data. The `cursorTime`, `loopStart`, and `loopEnd` properties return time objects — see [Time Object](../objects/time_object.md) for their full surface.

### Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `cursorTime` | `object` - [Time Object](../objects/time_object.md) | No | — | Current cursor position. |
| `loopEnd` | `object` - [Time Object](../objects/time_object.md) | No | — | Loop region end position. |
| `loopStart` | `object` - [Time Object](../objects/time_object.md) | No | — | Loop region start position. |

### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `beginEdit(editFollow)` | — | `editFollow` (`boolean`, opt): Edit-follow mode control. | Begins a cursor transaction. Use with `endEdit()` to group cursor changes under edit-follow. |
| `endEdit()` | — | (none) | Ends a cursor editing transaction. |
| `toggleLoop()` | — | (none) | Toggles loop mode on/off. |
| `toggleStart()` | — | (none) | Toggles the start marker at the current cursor position. |
| `setCursorTime(time)` | — | `time` ([Time Object](../objects/time_object.md), req): A time position. | Moves the cursor to the given time. |
| `setEditCursorTime(time)` | — | `time` ([Time Object](../objects/time_object.md), req): A time position. | Sets the edit cursor position during playback. |
| `setLoopRange(start, end)` | — | `start, end` ([Time Object](../objects/time_object.md), req): Loop boundaries. | Sets the loop region. |

## Model

`context.editor.model` exposes the editor model surface.

### Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `arranger` | `object` | No | — | Arranger track surface. |

### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setDocumentDirty()` | — | (none) | Marks document as modified. |
| `selectAllOnTrack(editor)` | — | `editor` (`object`, req): `context.editor`. | Selects all events on track. |

## Arranger

`context.editor.model.arranger` is the control surface for the Arranger Track.

### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getArrangerTrack()` | `object` | (none) | Returns the ArrangerTrack object handle. |
| `showArrangerTrack()` | — | (none) | Shows the Arranger Track in the editor. |
| `addArrangerEvent(track, start, end)` | `object` | `track` (`object`, req): from `getArrangerTrack()`, `start` ([Time Object](../objects/time_object.md), req), `end` ([Time Object](../objects/time_object.md), req) | Creates an arranger section and returns the event object. |

### ArrangerTrack Object

Returned by `getArrangerTrack()`.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Arranger Track"` | Track name. |
| `color` | `number` | No | `13333248` | Track color as integer. |
| `length` | `number` | No | `600` | Track length. |
| `startTime` | `object` - [Time Object](../objects/time_object.md) | No | — | Track start time boundary. |
| `endTime` | `object` - [Time Object](../objects/time_object.md) | No | — | Track end time boundary. |
| `parent` | `object` | No | — | Parent object. |

**Arranger event object:**

The arranger event object shares the same properties as other event types — see [Event Object — Arranger Events](../objects/event_object.md#arranger-events) for the full surface (`name`, `startTime`, `endTime`, `length`, `lengthTime`, `color`).

**Working Pattern:**

```javascript
var arranger = context.editor.model.arranger;
var track    = arranger.getArrangerTrack();

var start = fn.newMediaTime();
var end   = fn.newMediaTime();
start.musical = 1;   // Start at beat 1
end.musical   = 9;   // End at beat 9 (8 beats long)

var event = arranger.addArrangerEvent(track, start, end);
fn.renameEvent(event, "Section Name");
fn.colorizeEvent(event, colorIntValue);
arranger.showArrangerTrack();
```

## Quantize

`context.editor.quantize` provides a quantize grid helper. Time objects passed to these methods are **modified in-place**.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `clone()` | `object` | (none) | Returns a new independent quantize surface. |
| `getPeriod()` | `number` | (none) | Returns the current grid period in musical beats. |
| `nextTime(time)` | — | `time` ([Time Object](../objects/time_object.md), req): Time to advance. | Advances to the **next** grid position in-place. |
| `quantizeTime(time)` | — | `time` ([Time Object](../objects/time_object.md), req): Time to quantize. | Identical to `snapTime`. |
| `snapTime(time)` | — | `time` ([Time Object](../objects/time_object.md), req): Time to snap. | Rounds to the **nearest** grid position in-place. |

## Selection

`context.editor.selection` exposes the selection control surface.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `showHideSuspended` | `number` | yes | `0` | Suspends selection visibility updates. `0` = visible, `1` = suspended. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `isSelected(event)` | `number` | `event` (`note event`, req): A note event from the iterator. | Checks selection state. `1` = selected, `0` = not selected. |
| `isEmpty()` | `number` | (none) | Returns `1` if empty, `0` if items are selected. |
| `isMultiple()` | `number` | (none) | Returns `1` if 2+ items selected, `0` otherwise. |
| `newIterator()` | `object` | (none) | Creates an iterator over selected events. |
| `unselectAll()` | — | (none) | Clears the current selection. |

## Setup Example

```javascript
var editor = context.editor;
var selection = editor.selection;
var functions = context.functions;
var select = editor.createSelectFunctions(functions);

if (!editor.activeRegion) return;

var cursor = editor.cursorInfo.cursorTime.musical;

editor.showSelection(false);
selection.showHideSuspended = true;
selection.unselectAll();
select.selectMultiple([]);
```

## Selection Control Pattern

```javascript
// Deselect all:
context.editor.selection.unselectAll()

// Suppress visual updates during batch selection:
context.editor.showSelection(false);
context.editor.selection.showHideSuspended = true;
// ... perform selections ...
context.editor.selection.showHideSuspended = false;
context.editor.showSelection(true);

// Reliable multi-select:
var selector = context.editor.createSelectFunctions(context.functions);
selector.executeImmediately = true;
selector.selectMultiple(arrayOfNotes);
selector.select(singleNote);
```