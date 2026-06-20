---
sidebar_position: 6
---
# Time Object

Time objects represent positions in musical time. They appear throughout the API for event timing, cursor positions, and time-based operations.

Time objects created by `context.functions.newMediaTime()` / `context.functions.root.createFunctions().newMediaTime()` or `clone()` are fully mutable — `.seconds`, `.musical`, etc. can be written freely. Property accessors on events (`.startTime`, `context.editor.cursorInfo.cursorTime`) are read-only.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `musical` | `number` | Yes | `12.25` | Total beats from project start |
| `seconds` | `number` | Yes | `6.125` | Time in seconds |
| `samples` | `number` | Yes | `270112.5` | Sample position at session sample rate |
| `time` | `number` | Yes | `6.125` | Internal time units (same as `.seconds`) |
| `string` | `string` | Yes | `"00:00:06.125"` | Formatted time string |

Changing any numeric property recalculates the others.

## Methods

| Method | Returns | Description |
|---|---|---|
| `as()` | `number` | Returns `.seconds` as a plain number |
| `clone()` | `object` | Returns a new independent copy |
| `valueOf()` | `object` | Returns the time object itself |

## Creating Time Objects

```javascript
var fn = context.functions;
// TrackEdit, AudioEdit, EventEdit — via context.functions
var t1 = fn.newMediaTime();
t1.seconds = 5.0;

// Any context — via root
var t2 = fn.root.createFunctions().newMediaTime();
t2.seconds = 5.0;

// Any context — via root with a specific family
var t3 = fn.root.createFunctions("AudioFunctions").newMediaTime();
t3.seconds = 5.0;
```

## Usage Patterns

### Reading event timing:

```javascript
// event — selected event from context.iterator
var startBeat = event.startTime.musical;
var endBeat   = event.endTime.musical;
var duration  = event.endTime.time - event.startTime.time;

var startSec  = event.startTime.seconds;
var endSec    = event.endTime.seconds;
```

### Writing to note timing:

Create a new time object via `fn.root.createFunctions().newMediaTime()`, set its value, then pass to `fn.moveEvent()`.

```javascript
var fn = context.functions;
// note — selected MIDI note from context.iterator
var newTime = fn.root.createFunctions().newMediaTime();
newTime.seconds = 30.0;
fn.moveEvent(note, newTime);
```

### Creating arranger section from chord position:

```javascript
var fn = context.functions;
var arranger = context.editor.model.arranger;
var track = arranger.getArrangerTrack();

// chord — selected chord event from context.iterator on the Chord Track
var start = fn.root.createFunctions().newMediaTime();
var end = fn.root.createFunctions().newMediaTime();
start.seconds = chord.startTime.seconds;
end.seconds = chord.endTime.seconds;
arranger.addArrangerEvent(track, start, end);
```

### Time arithmetic (using `.time`):

```javascript
// event — selected event from context.iterator
var duration = event.endTime.time - event.startTime.time;
```

### Cursor position:

```javascript
var editor = context.editor;
var cursorBeat = editor.cursorInfo.cursorTime.musical;
var cursorSec  = editor.cursorInfo.cursorTime.seconds;
```

### Formatting for display:

```javascript
// time — any time object from event.startTime, fn.newMediaTime(), etc.
var display = time.string;  // "00:00:05.000"
```

### Transport / Cursor Time Access:

```javascript
var fn = context.functions;
var tp = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
);

var bpm     = tp.findParameter("tempo").string;      // e.g., "120.0"
var cursor  = tp.findParameter("primaryTime");       // cursor position
var isPlay  = tp.findParameter("start").value;       // playback state

var cursorSeconds = cursor.value.seconds;

var newTime = fn.root.createFunctions().newMediaTime();
newTime.seconds = 30.5;
```