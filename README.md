# Studio Pro Scripting API Reference

**Platform:** PreSonus Studio One / Fender Studio Pro

> ⚠️ **Disclaimer:** PreSonus does not provide official public documentation for this API. This reference is entirely community-derived. The API is internal and undocumented. Scripts may break between versions. Use defensive coding practices throughout.

---

## Table of Contents

1. [Package Structure & Deployment](#1-package-structure--deployment)
2. [Script Interface (JavaScript)](#2-script-interface-javascript)
3. [Context Object](#3-context-object)
4. [Track & Channel API](#4-track--channel-api)
5. [Event & Note API](#5-event--note-api)
6. [Time Objects](#6-time-objects)
7. [Edit Functions (context.functions)](#7-edit-functions-contextfunctions)
8. [Editor Object](#8-editor-object)
9. [Host API](#9-host-api)
10. [Transport API](#10-transport-api)
11. [Dialog & UI System](#11-dialog--ui-system)
12. [skin.xml Reference](#12-skinxml-reference)
13. [File I/O](#13-file-io)
14. [Cross-Script Communication](#14-cross-script-communication)
15. [Known Limitations & Dead Ends](#15-known-limitations--dead-ends)
16. [Complete API Index](#16-complete-api-index)
17. [Examples](#17-examples)
18. [Community Resources](#18-community-resources)

---

## 1. Package Structure & Deployment

### 1.1 Package Format

A `.package` file is a standard ZIP archive (deflate compression) renamed with the `.package` extension. Files must be placed at the **ZIP root** — not inside a subdirectory.

**Required files:**

```
your-script.package (ZIP)
├── metainfo.xml          ← Package metadata
├── classfactory.xml      ← Script registration & entry points
└── main.js               ← Script source (name matches classfactory.xml)
```

**Optional files:**

```
├── helper.js             ← Included via include_file('helper.js')
├── skin/
│   └── skin.xml          ← UI definitions (required for custom dialogs)
└── translations/
    └── en.xml            ← i18n strings
```

> ⚠️ **One script per package.** Studio Pro only loads the **first** `<ScriptClass>` entry in `classfactory.xml`. Additional entries are silently ignored. Each script must be its own `.package` file. See [Known Gaps](#153-known-gaps).

### 1.2 metainfo.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<MetaInformation>
  <Attribute id="Package:ID"      value="com.yourname.scriptname"/>
  <Attribute id="Package:Name"    value="Display Name"/>
  <Attribute id="Package:Version" value="1.0.0"/>
  <Attribute id="Package:Vendor"  value="Your Name"/>
  <!-- Required when script uses custom dialogs: -->
  <Attribute id="Package:SkinFile" value="skin/"/>
</MetaInformation>
```

> ⚠️ `Package:SkinFile` is **required** when using `skin.xml` dialogs. Without it, scripts with dialogs will not appear in the menu.

### 1.3 classfactory.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ClassFactory>
  <ScriptClass
    classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    metaClassID="{YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY}"
    category="EditTask"
    subCategory="TrackEdit"
    name="My Script Name"
    sourceFile="main.js"
    functionName="createInstance">
    <Attribute id="menuPriority"    value="0"/>
    <Attribute id="commandCategory" value="MyCategory"/>
  </ScriptClass>
</ClassFactory>
```

**Required attributes:**

| Attribute | Description |
|---|---|
| `classID` | Unique GUID — generate with any GUID tool |
| `category` | `"EditTask"`, `"EditAddIn"`, or `"FrameworkService"` |
| `subCategory` | See table below |
| `name` | Display name in menus |
| `sourceFile` | JS filename (relative to ZIP root) |
| `functionName` | Function exported by the JS file |

**subCategory values:**

| Value | Context |
|---|---|
| `"TrackEdit"` | Track list operations |
| `"MusicEdit"` | Piano roll / MIDI editor |
| `"AudioEdit"` | Audio editor |
| `"EventEdit"` | Arrangement editor events |
| `"ProjectEdit"` | Project-level operations |
| `"MusicPartEdit"` | Instrument Part editor |
| `"FrameworkService"` | Background service, no menu entry |

**Optional `<Attribute>` entries:**

| ID | Description |
|---|---|
| `menuPriority` | Integer sort order; `-1` hides from menu |
| `menuGroup` | Group name for menu clustering |
| `commandCategory` | Category in macro/key binding system |
| `arguments` | Comma-separated param names (e.g., `"Volume,Pan"`) |
| `alwaysEnabled` | `"1"` skips `prepareEdit()` result for enable/disable |
| `hidden` | `"1"` hides from menus; accessible via command system only |
| `supportsProject` | `"1"` for project-level operation |
| `wantAudioParts` | `"1"` to include audio clips in iteration |
| `musicEditorOnly` | `"1"` restricts to music editor context |
| `TrackContextMenu` | `"1"` adds to track right-click menu |
| `formName` | skin.xml Form name (for `EditAddIn` panels) |
| `groupName` | Panel group location (e.g., `"Song.AddInPanel"`) |

**Adding an icon (`ScriptMetaClass`):**

```xml
<ScriptMetaClass classID="{your-metaClassID}">
  <ScriptClassResource id="Class:ImageResource"
    url="theme://$package/IconName"/>
</ScriptMetaClass>
```

### 1.4 Installation

| Platform | Scripts folder |
|---|---|
| **Windows** | `C:\Program Files\Fender\Studio Pro 8\Scripts\` |
| **macOS** | `/Applications/Studio Pro 8.app/Contents/Scripts/` |

Restart Studio Pro after installing or replacing packages. Replacing a `.package` file alone is **not** always sufficient — Studio Pro aggressively caches package metadata. To force re-recognition, change the `Package:ID` in `metainfo.xml`, change the `classID` in `classfactory.xml`, or rename the `.package` file entirely.

### 1.5 Creating a .package File

**Unix / macOS / Linux:**
```bash
cd MyScriptFolder
zip -r ../my-script.package . -x ".*"
# Verify:
unzip -l ../my-script.package
```

**Windows (PowerShell):**
```powershell
$src = "C:\path\to\MyScriptFolder"
$out = "C:\path\to\my-script.package"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($src, $out)
```

**Python (cross-platform):**
```python
import zipfile, os

def create_package(source_dir, output_file):
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zf.write(file_path, arcname)

create_package('MyScriptFolder', 'my-script.package')
```

---

## 2. Script Interface (JavaScript)

### 2.1 Basic Task Structure

Every script implements a task object and exports a `createInstance()` factory function.

```javascript
function MyTask() {
  this.interfaces = [Host.Interfaces.IEditTask];
}

MyTask.prototype.prepareEdit = function(context) {
  // Validation pass — called first, always.
  // - Can READ context but NOT modify.
  // - Return kResultFailed to disable/grey-out the menu item.
  // - Define dialog parameters here (context.parameters).
  return Host.Results.kResultOk;
};

MyTask.prototype.performEdit = function(context) {
  // Execution pass — called only if prepareEdit returns kResultOk.
  // - Can READ and MODIFY context.
  // - Wrap modifications in beginMultiple/endMultiple for undo support.
  return Host.Results.kResultOk;
};

function createInstance() {
  return new MyTask();
}
```

### 2.2 Execution Phases

| Phase | When Called | Can Modify | Typical Use |
|---|---|---|---|
| `prepareEdit(context)` | Always, before `performEdit` | No | Validate state, show dialog, enable/disable menu item |
| `performEdit(context)` | Only if `prepareEdit` returns `kResultOk` | Yes | Do the actual work |

### 2.3 Undo / Redo

Wrap any modifications in an undo group:

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

### 2.4 Journaling (Selection)

Selection operations are **not undoable**. Disable journaling before selecting:

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

### 2.5 Including Other JS Files

```javascript
include_file('helper.js');
include_file('constants.js');
```

### 2.6 Return Codes

| Constant | Value | Meaning |
|---|---|---|
| `Host.Results.kResultOk` | 0 | Success |
| `Host.Results.kResultTrue` | — | True |
| `Host.Results.kResultFalse` | — | False |
| `Host.Results.kResultFailed` | 1 | Failure |
| `Host.Results.kResultNotImplemented` | — | Not implemented |
| `Host.Results.kResultNoInterface` | — | No interface |
| `Host.Results.kResultInvalidPointer` | — | Invalid pointer |
| `Host.Results.kResultUnexpected` | — | Unexpected error |
| `Host.Results.kResultClassNotFound` | — | Class not found |
| `Host.Results.kResultOutOfMemory` | — | Out of memory |
| `Host.Results.kResultInvalidArgument` | — | Invalid argument |
| `Host.Results.kResultWrongThread` | — | Wrong thread |

---

## 3. Context Object

The `context` object is passed to both `prepareEdit()` and `performEdit()`. Not all properties are available in both phases.

### 3.1 Context Availability

| Property / Method | prepareEdit | performEdit |
|---|---|---|
| `context.mainTrackList` | ✓ | ✓ |
| `context.getArguments()` | ✓ | ✓ |
| `context.parameters` | ✓ | — |
| `context.iterator` | — | ✓ |
| `context.editor` | — | ✓ |
| `context.functions` | — | ✓ |

### 3.2 context.mainTrackList

```javascript
var tl = context.mainTrackList;

tl.numTracks              // Total track count
tl.numSelectedTracks      // Selected track count
tl.getInsertPosition()    // Where new tracks would be inserted

tl.getTrack(index)        // Get track by 0-based index
tl.getSelectedTrack(i)    // Get selected track by index
tl.selectTrack(track, select, exclusive)
tl.unselectAll()
```

### 3.3 context.iterator

Available only in `performEdit()`. Iterates over **selected** events in the active editor.

```javascript
var it = context.iterator;
while (!it.done()) {
  var event = it.next();
  if (!event) continue;
  // use event
}
```

> ⚠️ Event properties (name, pitch, startTime) may return `undefined` in some editor contexts. Always null-check returned properties.

### 3.4 context.editor

Available only in `performEdit()`.

```javascript
context.editor.activeRegion       // The active Instrument Part (MIDI clip)
context.editor.cursorInfo         // Cursor position info
context.editor.model              // Editor model
context.editor.selection          // Selection control object
context.editor.quantize           // Quantize grid (read-only)
```

### 3.5 context.functions

Available only in `performEdit()`. See [Section 7](#7-edit-functions-contextfunctions).

### 3.6 context.getArguments()

Access parameters defined in `classfactory.xml`:

```xml
<Attribute id="arguments" value="Volume,Pan"/>
```

```javascript
var args = context.getArguments();
if (args) {
  var vol = Number(args.Volume.value);
  var pan = Number(args.Pan.value);
}
```

### 3.7 context — Additional Methods

```javascript
context.isSilentMode()            // Check if running silently
context.runDialog(name, pkgID)    // Show dialog (System 1 — see Section 11)
context.getAttribute(name)        // Get attribute by name
context.setAttribute(name, value) // Set attribute
context.countAttributes()         // Count attributes
context.getAttributeName(index)   // Get attribute name by index
context.getAttributeValue(index)  // Get attribute value by index
context.contains(name)            // Check attribute existence
```

---

## 4. Track & Channel API

### 4.1 Track Object Properties

```javascript
track.name              // String — track display name (read/write)
track.color             // Color integer (read/write)
track.channel           // Channel strip object
track.hidden            // Boolean — visibility state
track.parentFolder      // Parent folder track object
track.flags             // Bitfield of track properties
track.folded            // Boolean — folder track is collapsed
track.mediaType         // "Audio", "Music", etc.
track.layers.count      // Number of layers on track
```

**Track methods:**
```javascript
track.isEmpty()         // true if no media on active layer
track.getTrack()        // Returns parent track (when called on event)
```

### 4.2 Channel Object

Accessed via `track.channel` or via the Mixer Console (see Section 4.3).

**Confirmed readable/writable properties:**

```javascript
channel.name            // "Channel02" — internal channel name
channel.title           // "Impact" — display name / label
channel.label           // Same as title
channel.channelType     // "MusicTrack", "AudioTrack", etc.
channel.mediaType       // "Music", "Audio", etc.
channel.environment     // "SongEnvironment"
channel.mute            // 0 or 1 (readable and writable)
channel.solo            // 0 or 1 (readable and writable)
channel.soloSave        // Solo safe state
channel.disabled        // Track disabled state
channel.volume          // Fader level float (readable and writable)
channel.pan             // Pan position: 0.0=left, 0.5=center, 1.0=right
channel.maxVolume       // Maximum fader value
channel.canMuteSolo     // Boolean — whether mute/solo is available
channel.canDisable      // Boolean — whether track can be disabled
```

**Record unit (arm/monitor):**

```javascript
channel.recordUnit.recordArmed   // Arm state (readable and writable)
channel.recordUnit.monitorActive // Monitor state (readable and writable)
```

**Channel methods:**

```javascript
channel.findParameter(name)         // Find parameter by name
channel.connectTo(targetChannel)    // Route to another channel (bus assign)
channel.getDestinationChannel()     // Get current routing destination
channel.openEditor()                // Open channel editor window
channel.focus()                     // Focus channel in mixer
channel.interpretCommand(cat, name) // Execute command on channel
channel.find(name)                  // Find child object
```

**channel.findParameter() — confirmed responding names:**

```javascript
channel.findParameter("mute")           // value: 0/1
channel.findParameter("solo")           // value: 0/1
channel.findParameter("monitor")        // value: 0/1
channel.findParameter("color")          // value: int, string: "#RRGGBBAA"
channel.findParameter("automationMode") // value: 0, string: "Auto: Off"
channel.findParameter("velocity")       // MIDI velocity scaling
channel.findParameter("transpose")      // Transposition in semitones
```

> ⚠️ `volume` and `pan` are **not** accessible via `findParameter()`. Use direct property assignment (`channel.volume`, `channel.pan`) instead. FX chain, inserts, and plugin objects are **not accessible** via scripting.

**Save/restore channel state pattern:**

```javascript
// Save
var data = {
  mute:     channel.mute,
  solo:     channel.solo,
  disabled: channel.disabled,
  vol:      channel.volume,
  pan:      channel.pan
};
if (channel.recordUnit) {
  data.arm = channel.recordUnit.recordArmed;
  data.mon = channel.recordUnit.monitorActive;
}

// Restore
if (channel.canMuteSolo) {
  channel.mute = data.mute;
  channel.solo = data.solo;
}
if (channel.canDisable) channel.disabled = data.disabled;
if (typeof channel.volume !== "undefined") channel.volume = data.vol;
if (typeof channel.pan    !== "undefined") channel.pan    = data.pan;
```

### 4.3 Mixer Console Access

```javascript
var console = context.functions.root.environment.find("MixerConsole");
var channelList = console.getChannelList(type);
// type: 1 = Normal (tracks/instruments), 2 = Sub-outs (busses), 3 = Master bus

channelList.numChannels             // Total count
channelList.numSelectedChannels     // Selected count
channelList.getChannel(i)           // Get by 0-based index
channelList.getSelectedChannel(i)   // Get selected channel by index

// Master bus shortcut:
var masterBus = console.getChannelList(3).getChannel(0);
```

### 4.4 Track Layer Operations

```javascript
// Remove inactive layers pattern (use deferred commands):
var count = track.layers.count;
if (count > 1) {
  Host.GUI.Commands.interpretCommand("Edit", "Select All on Tracks");
  Host.GUI.Commands.interpretCommand("Edit", "Cut");
  Host.GUI.Commands.deferCommand("Track", "Remove Layer");
  Host.GUI.Commands.deferCommand("Edit", "Paste at Original Position");
}
```

---

## 5. Event & Note API

### 5.1 Event Object Properties

```javascript
event.name              // String
event.startTime         // Time object (see Section 6)
event.endTime           // Time object
event.length            // Duration (time object or plain number in beats)
event.lengthTime        // Duration as time object (alias)
event.start             // Start in beats (shorthand)
event.end               // End in beats (shorthand)
event.color             // Integer color
event.selected          // Boolean
event.velocity          // MIDI velocity (notes only, 0–127 integer)
event.pitch             // MIDI note number (notes only, 0–127)
event.isMuted           // Boolean mute state
event.region            // The Instrument Part (MIDI Clip) containing this note
event.timeContext       // Time context object (for conversions)
event.timeFormat        // Time format identifier
```

**Event length handling** — `event.length` may return a time object or a plain number:

```javascript
var noteLength = event.length;
var beats;
if (noteLength && noteLength.musical) {
  beats = noteLength.musical.beat;
} else if (typeof noteLength === 'number') {
  beats = noteLength;
}
```

**Event methods:**

```javascript
event.clone()                   // Clone note (returns new note object — all props read-only)
event.nextEvent()               // Next event in sequence (often returns undefined)
event.previousEvent()           // Previous event (often returns undefined)
event.globalToRegionData(pos)   // Convert global to region coordinates
event.regionDataToGlobal(pos)   // Convert region to global coordinates

// Selection:
event.select(addToSelection)    // addToSelection: bool
event.selectExclusive()
```

### 5.2 The Region Object (event.region)

The region is the **Instrument Part (MIDI clip)** that contains the note. This is the correct container object for note insertion.

```javascript
var region = event.region;

region.name                  // Track name containing this part
region.start                 // Beat position where part starts
region.end                   // Beat position where part ends
region.length                // Length in beats
region.offset                // Region offset
region.startTime.musical     // Start in beats
region.endTime.musical       // End in beats
region.lengthTime.musical    // Length in beats

region.getTrack()            // Returns the containing track
region.getRoot()             // Returns root object
region.getStartTime()        // Start time of the part
region.getEndTime()          // End time of the part
region.createSequenceIterator()  // Iterator over ALL notes in region ✓
region.asEventList()         // Returns as event list
```

> ⚠️ `editor.activeRegion` is the same type of container object as `event.region`. Its `.start` property does **not** respect the Bar Offset feature — it returns the absolute beat position regardless.

### 5.3 Iterating All Notes in a Region

```javascript
// Get a source note from context.iterator first
var sourceNote = /* from context.iterator */;
var region = sourceNote.region;

var it = region.createSequenceIterator();
while (!it.done()) {
  var note = it.next();
  // use note
}
// Iterator navigation:
// it.first()    — jump to first note
// it.last()     — jump to last note
// it.next()     — advance forward
// it.previous() — advance backward
```

> ⚠️ `editor.createSequenceIterator()` does **not** exist. Use `event.region.createSequenceIterator()` instead.

### 5.4 Note Creation (Confirmed Working)

Note creation requires cloning an existing note and inserting it into a region. The `region` argument is mandatory.

```javascript
function newNote(start, length, pitch, velocity, sourceEvent) {
  var note   = sourceEvent.clone();
  var region = sourceEvent.region;         // ← required first argument

  functions.insertEvent(region, note);     // region MUST be first arg
  functions.moveEvent(note, start);        // start: beat position (musical)
  functions.resizeEvent(note, length);     // length: in beats
  functions.modifyPitch(note, pitch);      // 0–127 MIDI note number
  functions.modifyVelocity(note, velocity); // 0.0–1.0 float (NOT 0–127)
  functions.muteEvent(note, false);        // REQUIRED — inserted notes are muted by default
  return note;
}
// Velocity conversion: velocity_float = midi_velocity / 127.0
```

### 5.5 Time Context (Conversions)

```javascript
note.timeContext.secondsToPpq(seconds)        // seconds → beats
note.timeContext.ppqToSeconds(beats)          // beats → seconds
note.timeContext.getBarStart(musicalBeat)     // get bar start for a beat position

// Get subposition within bar:
var barStart     = note.timeContext.getBarStart(note.startTime.musical);
var subposition  = note.startTime.musical - barStart;
```

---

## 6. Time Objects

### 6.1 Time Object Structure

```javascript
var t = event.startTime;

t.musical           // Musical time sub-object
t.musical.bar       // Bar number
t.musical.beat      // Beat position (0.0 to beat_count, fractional)

t.seconds           // Absolute seconds (writable on note.startTime)
t.samples           // Absolute samples at session sample rate
t.time              // Internal time units
t.string            // Formatted string: "00:00:00.000" or "1.1.1.000"

t.as()              // Returns seconds as plain number
t.clone()           // Returns valid time object copy
```

### 6.2 Writing to Time

`note.startTime.seconds` is the **only confirmed writable** note property:

```javascript
note.startTime.seconds = newTimeInSeconds;
fn.moveEvent(note, note.startTime);
```

### 6.3 Creating New Time Objects

```javascript
// Via context.functions:
var t = fn.newMusicalTime(beats);
var t = fn.newMusicalTime(beats, bar, beat);

// Via root.createFunctions() (for time creation only — not for edit operations):
var t = note.region.getTrack().getRoot().createFunctions().newMediaTime();
t.seconds = targetSeconds;
// or:
t.musical = targetBeatPosition;
```

### 6.4 Transport / Cursor Time Access

```javascript
var tp = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
);

var bpm     = tp.findParameter("tempo").string;      // e.g., "120.0"
var cursor  = tp.findParameter("primaryTime");       // cursor position
var isPlay  = tp.findParameter("start").value;       // playback state
```

---

## 7. Edit Functions (context.functions)

`context.functions` is the **only reliable** function object for note manipulation. Do not use `fn.root.createFunctions()` — it returns a different broken stub.

### 7.1 Undo / Journal Control

```javascript
fn.beginMultiple(name)      // Start named undo group
fn.endMultiple(cancelled)   // End undo group (true = rollback)
fn.isJournalEnabled()       // Returns boolean
fn.setJournalEnabled(bool)  // Enable/disable journaling
```

### 7.2 Note / Event Editing

```javascript
fn.insertEvent(region, event)         // Insert event into region (region MUST be first arg)
fn.deleteEvent(event)                 // Delete an event
fn.moveEvent(event, time)             // Move event to new time position
fn.resizeEvent(event, length)         // Resize event duration (length in beats)
fn.modifyPitch(event, value)          // Change MIDI pitch (0–127)
fn.modifyVelocity(event, value)       // Change MIDI velocity (0.0–1.0 float)
fn.muteEvent(event, bool)             // Mute/unmute event
fn.freezeVelocity(event)             // Freeze velocity
fn.freezePitch(event)                // Freeze pitch
fn.quantize(event)                   // Quantize event to grid
fn.quantizeEvent(event)              // Quantize event position
fn.freezeQuantize(event)             // Freeze quantize state
fn.setLyrics(event, text)            // Set lyrics on event
fn.createEvent(template, time, length, pitch, velocity)  // ⚠️ Does NOT work (returns undefined)
```

### 7.3 Track / Arrangement Editing

```javascript
fn.removeTrack(track)                // Remove a track
fn.renameEvent(track, name)          // Rename track or event
fn.colorizeEvent(track, color)       // Set track/event color (integer)
fn.createFadeIn(event, type, len, bend)   // Create fade in
fn.createFadeOut(event, type, len, bend)  // Create fade out
```

**Fade types:**

| Value | Type |
|---|---|
| `0` | Linear |
| `1` | Logarithmic |
| `2` | Exponential |

### 7.4 Execute Immediately Flag

```javascript
fn.executeImmediately = true;   // Execute operations immediately (for real-time dialog updates)
// ... perform edits ...
fn.executeImmediately = false;  // Reset after use
```

### 7.5 Accessing Root / Environment

```javascript
fn.root                              // Root document object
fn.root.environment                  // Document environment
fn.root.environment.find("MixerConsole")  // Access Mixer Console

fn.root.getLayer(0)                  // Returns first layer object
fn.root.isEmpty()                    // Check if root is empty
fn.root.getRoot()                    // Get root object
fn.root.asEventList()                // Returns root as event list
fn.root.createIterator()             // Iterates layer/region CONTAINERS (not notes)
fn.root.findTrackByID(trackID)       // Find track by ID
```

### 7.6 Arranger Track

```javascript
var arranger = context.editor.model.arranger;
var track    = arranger.getArrangerTrack();

var start = fn.newMediaTime();
var end   = fn.newMediaTime();
start.seconds = startTimeInSeconds;
end.seconds   = endTimeInSeconds;

var event = arranger.addArrangerEvent(track, start, end);
fn.renameEvent(event, "Section Name");
fn.colorizeEvent(event, colorIntValue);
arranger.showArrangerTrack();
```

---

## 8. Editor Object

### 8.1 Editor Properties

```javascript
context.editor.activeRegion          // Active Instrument Part (MIDI Clip)
context.editor.model                 // Editor model
context.editor.model.arranger        // Arranger object
context.editor.model.selectAllOnTrack(track)
context.editor.model.synchronizeEnvelopeSelection()

context.editor.cursorInfo                        // Cursor info
context.editor.cursorInfo.cursorTime.musical     // Cursor position in beats
context.editor.cursorInfo.cursorTime.seconds     // Cursor position in seconds
context.editor.cursorInfo.setCursorTime(pos)     // Set cursor position
context.editor.cursorInfo.setEditCursorTime(pos) // Set edit cursor

context.editor.quantize.getPeriod()              // Current grid period in beats (read-only)
context.editor.quantize.snapTime(time)           // Snap to grid
context.editor.quantize.quantizeTime(time)       // Quantize time value
context.editor.quantize.nextTime(time)           // Next grid position

context.editor.getTimeSelectionOffset()          // Returns 0
context.editor.getItemType(note)                 // Returns "NoteEvent" for notes
context.editor.isSameItem(n1, n2)               // Returns 1 if same note
context.editor.canSelect(note)                   // Returns 1
context.editor.deleteItem(note)                  // DELETES note from editor ✓
context.editor.editItem(note)                    // Returns 0 (success)
context.editor.pixelToTime(pixel)               // Returns time-like object
```

### 8.2 Selection Control

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
selector.selectMultiple(arrayOfNotes);   // Multi-select ✓
selector.select(singleNote);             // Single select ✓
```

> ⚠️ `editor.selectMultiple()` does **not** exist. Use `editor.createSelectFunctions().selectMultiple()` instead.

---

## 9. Host API

### 9.1 Host Top-Level Namespaces

`Interfaces`, `Results`, `Classes`, `Objects`, `Services`, `Console`, `Signals`, `Locales`, `SystemInfo`, `IO`, `FileTypes`, `Security`, `GUI`, `Graphics`, `Engine`, `Settings`

### 9.2 Host.GUI.Commands

```javascript
// Execute any menu command:
Host.GUI.Commands.interpretCommand(category, name)
Host.GUI.Commands.interpretCommand(category, name, clearSelection, attrs)

// Execute after script finishes (for commands that open dialogs):
Host.GUI.Commands.deferCommand(category, name)

// Find / enumerate (limited utility):
Host.GUI.Commands.findCommand(cat, name)   // returns object (non-enumerable props)
Host.GUI.Commands.newCommandIterator()     // iterates all ~1660 commands
Host.GUI.Commands.newCategoryIterator()    // returns 54 categories
```

> 📖 **Full command reference:** For the complete list of all ~1660 commands across 54 categories, see [docs/COMMAND_REFERENCE.md](docs/COMMAND_REFERENCE.md).

**Passing attributes to commands:**

```javascript
Host.GUI.Commands.interpretCommand("Transport", "Cursor follows Edit Position", false,  Host.Attributes(["State", "1"]));

Host.GUI.Commands.interpretCommand(  "File", "Save New Version", false,  Host.Attributes(["Description", "Before Operation"]));
```

### 9.3 Host.studioapp (Alternative Command Interpreter)

```javascript
Host.studioapp.interpretCommand("Edit", "Create Range from Cursor");
Host.studioapp.interpretCommand("Zoom", "Zoom Full", false,
  Host.Attributes(["State", "1"]));
Host.studioapp.findParameter(name)
Host.studioapp.find(name)
```

`Host.studioapp` is the same object as `Host.Objects.getObjectByUrl("://hostapp")`.

### 9.4 Host.GUI.Dialogs

```javascript
Host.GUI.alert(msg)           // Modal alert — auto-stringifies any value
Host.GUI.ask(msg)             // Yes/No dialog — compare result to Host.GUI.Constants.kYes
Host.GUI.runDialog(theme, "FormName", controller)  // Show skin.xml dialog
Host.GUI.Desktop.closeModalWindows()               // Close open modals
Host.GUI.Desktop.closeTopModal()
Host.GUI.Desktop.getApplicationWindow()
```

**Dialog constants:**

`kMouseNone`, `kMouseDown`, `kMouseOver`, `kLButton`, `kMButton`, `kRButton`, `kShift`, `kCommand`, `kOption`, `kControl`, `kClick`, `kDrag`, `kDoubleClick`, `kWheel`, `kCancel`, `kOkay`, `kClose`, `kApply`, `kYes`, `kOk`, `kRetry`, `kNo`, `kAlertCancel`

### 9.5 Host.GUI.Clipboard

```javascript
Host.GUI.Clipboard.setText(text)   // Set clipboard text ✓
Host.GUI.Clipboard.getText()       // Get clipboard text ✓
```

> ⚠️ Text-only. Binary DAW data (MIDI clips, etc.) is not accessible via the clipboard.

### 9.6 Host.Objects (URL-Based Object Access)

```javascript
Host.Objects.getObjectByUrl(url)    // Get internal host object by URL ✓
Host.Objects.getObjectByName(name)  // Get by name
Host.Objects.getObjectByID(id)      // Get by ID
Host.Objects.registerObject(name, object)
Host.Objects.unregisterObject(name)
```

**Confirmed accessible URLs:**

```
"://hostapp"
"://hostapp/DocumentManager"
"://hostapp/DocumentManager/ActiveDocument"
"://hostapp/DocumentManager/ActiveDocument/Environment"
"://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
"://studioapp"  (same as ://hostapp)
"://studioapp/DocumentManager"
"://studioapp/DocumentManager/ActiveDocument"
"object://hostapp/.../EventInspector"
"object://hostapp/.../EventInspector/EventInfo"
"://hostapp/.../Editor"
"://hostapp/.../TrackList"
"://hostapp/.../MediaPool"
```

All URL objects share: `obj.findParameter(name)`, `obj.interpretCommand(...)`, `obj.find(name)`

### 9.7 Host.Classes (Factory Instantiation)

```javascript
Host.Classes.createInstance(classID)        // Create instance ✓
Host.Classes.getClassDescription(classID)   // Get class description ✓
Host.Classes.newIterator()                  // Returns empty iterator
```

**Instantiable built-in classes:**

| Class ID | Description |
|---|---|
| `"CCL:FileSelector"` | File picker dialog |
| `"CCL:ParamList"` | Parameter list for persistent dialogs |
| `"CCL:ProgressDialog"` | Progress indicator |
| `"CCL:CheckBox"` | Checkbox UI element |
| `"CCL:Label"` | Label UI element |
| `"CCL:RadioButton"` | RadioButton UI element |
| `"CCL:ScrollView"` | ScrollView UI element |
| `"CCL:View"` | View UI element |
| `"Host:PresetParam"` | Preset parameter |
| `"Host:ListViewModel"` | List/table data model |
| `"CCL:CommandBarModel"` | Command bar |
| `"CCL:CommandSelector"` | Command selector |
| `"Devices:PortParam"` | Port/MIDI parameter |

### 9.8 Host.Engine

```javascript
Host.Engine.TrackFormats              // 17 track format types
Host.Engine.TrackFormats.at(i)        // Access by index
Host.Engine.TrackFormats.newIterator()
Host.Engine.TrackFormats.findEqual("Instrument")

Host.Engine.TrackColorPalette         // 256 colors
Host.Engine.TrackColorPalette.getAt(i)  // Returns color as ARGB integer

Host.Engine.TrackIcons
Host.Engine.Speakers
Host.Engine.CrossFadeFinder
Host.Engine.createFormatter(name)     // Create display formatter
Host.Engine.createTrackFormatWithPort(type, port)
```

**Formatters:**

```javascript
var pitchFormatter    = Host.Engine.createFormatter("Media.MusicNote");
var velocityFormatter = Host.Engine.createFormatter("Media.MusicVelocity");
param.setFormatter(pitchFormatter);  // Displays "C3" instead of "60"
```

### 9.9 Host.Settings (Script-Local Key-Value Store)

```javascript
var attrs = Host.Settings.getAttributes();
attrs.setAttribute(key, value)   // Set value ✓
attrs.getAttribute(key)          // Get value ✓
attrs.contains(key)              // Check existence (returns 0 or 1)
attrs.countAttributes()          // Count entries
attrs.getAttributeName(index)
attrs.getAttributeValue(index)
```

> ⚠️ `Host.Settings` is a **blank, script-local** store — not a way to read Studio Pro preferences. No DAW settings are pre-populated. Useful for persisting state between `prepareEdit` and `performEdit` phases.

### 9.10 Host.Console

```javascript
Host.Console.writeLine(text)   // Console output (alternative to alert for debugging)
```

### 9.11 Host.Graphics (Image Utility)

```javascript
Host.Graphics.loadImage(path)
Host.Graphics.saveImage(bitmap, path)
Host.Graphics.createBitmap(width, height)   // Returns bitmap with .width/.height ✓
Host.Graphics.copyBitmap(src, dst)
Host.Graphics.createBitmapFilter()
```

> ⚠️ `Host.Graphics` has **no drawing primitives** (no drawRect, drawLine, drawText). It is an image loading/saving utility only. Deep testing of Graphics methods can crash Studio Pro.

### 9.12 Host.Security

```javascript
Host.Security.checkAccess(packageID, featureName)  // Returns 0 (restricted)
```

### 9.13 Host.Interfaces (Complete List — 28)

`IUnknown`, `IClassFactory`, `IComponent`, `IObjectNode`, `IObserver`, `IPersistAttributes`, `ICommandHandler`, `IContextMenuHandler`, `IParamObserver`, `IViewStateHandler`, `ITimerTask`, `IController`, `IScriptComponent`, `IHelpTutorialHandler`, `IPortFilter`, `IBrowserExtension`, `IDocumentTemplateHandler`, `IDocumentEventHandler`, `IEditTask`, `IToolConfiguration`, `IToolMode`, `IToolHelp`, `IToolSet`, `IToolAction`, `IEditHandlerHook`, `IEditHandler`, `IPresetMediator`, `IExtensionHandler`

> All interfaces only expose an `equals()` method. They are COM-style type markers for the `this.interfaces` array.

---

## 10. Transport API

```javascript
var tp = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
);
```

**Readable and writable parameters:**

| Name | Description |
|---|---|
| `"tempo"` | BPM value |
| `"loop"` | Loop enabled (0/1) |
| `"loopStart"` | Loop start in beats |
| `"loopEnd"` | Loop end in beats |
| `"loopLength"` | Loop length in beats (derived) |
| `"record"` | Recording state (0/1) |
| `"precount"` | Precount enabled (0/1) |
| `"punchIn"` | Punch in (0/1) |
| `"punchOut"` | Punch out (0/1) |

**Read-only parameters:**

| Name | Description |
|---|---|
| `"primaryTime"` | Current cursor position |
| `"start"` | Transport start state |
| `"stop"` | Transport stop state |
| `"rewind"` | Rewind state |

**Parameter object structure:**

```javascript
var param = tp.findParameter("tempo");
param.value        // number — read/write
param.string       // string — formatted display
param.min          // minimum value
param.max          // maximum value
param.default      // default value
param.name         // parameter key name
param.enabled      // 0 or 1
param.setValue(val) // alternative write method
```

---

## 11. Dialog & UI System

Two separate dialog systems exist. Choose based on your use case.

### 11.1 System 1 — context.parameters (Blocking Dialog)

Used when `prepareEdit()` should show a dialog before `performEdit()` runs. Parameters persist between phases on `this`.

```javascript
MyTask.prototype.prepareEdit = function(context) {
  this.MyValue = context.parameters.addInteger(0, 127, "MyValue");
  this.MyValue.value = 64;  // default

  this.MyFloat = context.parameters.addFloat(0.0, 1.0, "MyFloat");
  this.MyText  = context.parameters.addString("MyText");

  this.MyList  = context.parameters.addList("MyList");
  this.MyList.appendString("Option 1");
  this.MyList.appendString("Option 2");

  this.MyColor = context.parameters.addColor(0xFF0000FF, "MyColor");

  // Show dialog (returns kResultOk if OK, kResultFailed if cancelled):
  return context.runDialog("DialogFormName", "com.your.packageid");
  //  arg 1 = Form name (matches <Form name="..."> in skin.xml)
  //  arg 2 = Package:ID from metainfo.xml
};

MyTask.prototype.performEdit = function(context) {
  var intVal   = this.MyValue.value;
  var floatVal = this.MyFloat.value;
  var textVal  = this.MyText.value;
  var listSel  = this.MyList.value;   // 0-based index
  var colorVal = this.MyColor.value;
  // ...
};
```

### 11.2 System 2 — CCL:ParamList (Persistent Dialog / Panel)

Used for persistent panels that remain open across multiple interactions.

```javascript
function MyTask() {
  this.interfaces = [
    Host.Interfaces.IEditTask,
    Host.Interfaces.IController,
    Host.Interfaces.IParamObserver
  ];

  this.paramList = Host.Classes.createInstance("CCL:ParamList");
  this.paramList.controller = this;  // binds paramChanged callback

  this.MyParam = this.paramList.addInteger(0, 127, "MyParam");
  this.MyMenu  = this.paramList.addMenu("MyMenu");
  this.MyMenu.appendString("Option A");
  this.MyMenu.appendString("Option B");
  this.MyColor = this.paramList.addColor("MyColor");
  this.MyColor.palette = Host.Engine.TrackColorPalette;
  this.MyColor.value   = Host.Engine.TrackColorPalette.getAt(0);
}

MyTask.prototype.paramChanged = function(param) {
  if (param === this.MyParam) { /* handle */ }
  if (param.name === "MyButton" && param.value === 1) {
    param.value = 0;  // reset button after handling
  }
};

MyTask.prototype.performEdit = function(context) {
  var theme = Host.GUI.Themes.getTheme(kPackageID);
  Host.GUI.runDialog(theme, "FormName", this);
  return Host.Results.kResultOk;
};
```

**ParamList methods:**

```javascript
paramList.addInteger(min, max, name)   // Integer slider/editbox
paramList.addFloat(min, max, name)     // Float slider/editbox
paramList.addString(name)              // String editbox
paramList.addColor(name)               // Color picker
paramList.addMenu(name)                // Dropdown menu
paramList.addList(name)                // List / dropdown
paramList.addParam(name)               // Generic param (button trigger)
paramList.addCommand(cat, name, id)    // Command binding
paramList.remove(name)                 // Remove a parameter

param.value                            // Get/set current value
param.string                           // Get/set as string
param.enabled                          // Enable/disable
param.palette                          // Color palette (for color params)
param.setFormatter(formatter)          // Set display formatter
param.appendString(text)               // Add item to list/menu
param.removeAll()                      // Clear list items
```

### 11.3 List View (Host:ListViewModel)

```javascript
var list = Host.Classes.createInstance("Host:ListViewModel");
list.columns.addColumn(width, title, field, columnWidth, flags);
var item = list.newItem(id);
item.details.myField = "value";
list.addItem(item);
list.removeAll();
list.itemCount
list.getItem(index)
list.getFocusItem()
list.getSelectedItems()            // Returns collection with .newIterator()
list.changed()                     // Trigger UI refresh
list.itemView.setFocusItem(index, scroll)

Host.Signals.advise(list, this);   // Observe list events
Host.Signals.unadvise(list, this);
```

---

## 12. skin.xml Reference

Required when using custom dialogs. Must declare `Package:SkinFile` in metainfo.xml:
```xml
<Attribute id="Package:SkinFile" value="skin/"/>
```

### 12.1 Full skin.xml Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Skin>
  <!-- Optional: Custom style definitions (see Section 12.11) -->
  <Styles/>

  <!-- Required: Dialog definitions -->
  <Forms>
    <Form name="MyDialog" title="My Dialog">
      <!-- Topmost layout MUST have margin="0" for button alignment -->
      <Horizontal margin="0">
        <DialogGroup>
          <Vertical margin="10" spacing="5">
            <!-- Form content here -->
          </Vertical>
        </DialogGroup>
      </Horizontal>
    </Form>
  </Forms>
</Skin>
```

**Top-level elements:**

| Element | Description |
|---|---|
| `<Styles>` | Optional. Custom style definitions (fonts, colors). See Section 12.11. |
| `<Align>` | Undocumented. Effect unclear. |
| `<Forms>` | Required. Container for `<Form>` dialogs. |
| `<Form>` | Individual dialog definition. Attributes: `name` (required), `title` (required). |

### 12.2 Confirmed Working Elements

| Element | Description | Confirmed Attributes | Binds To | Confirmed `options` Values |
|---|---|---|---|---|
| `<Slider>` | Horizontal or vertical slider | `name`, `width`, `height`, `options` | `addInteger`, `addFloat` | `"horizontal"`, `"vertical"` |
| `<EditBox>` | Text / number input | `name`, `width`, `height`, `options`, `multiline`, `style`, `tooltip` | `addString`, `addInteger`, `addFloat` | `"password"`, `"focus"`, `"return"`, `"readonly"` |
| `<ColorBox>` | Color picker (requires nested SelectBox) | `name`, `width`, `height` | `addColor` | — |
| `<Label>` | Static text label | `title`, `name`, `style` | - | — |
| `<CheckBox>` | Independent on/off toggle | `name`, `value`, `title` | `addInteger(0, 1, "name")` | — |
| `<Button>` | Push button (custom actions) | `name`, `title`, `width`, `height`, `tooltip` | `addInteger(0, 1, "name")` | — |
| `<Knob>` | Rotary control | `name`, `width`, `height` | `addInteger`, `addFloat` | — |
| `<ComboBox>` | Dropdown selector | `name`, `style` | `addList` (populate via JS) | — |
| `<SelectBox>` | Dropdown selector (taller than ComboBox) | `name`, `options` | `addList` | `"border"`, `"transparent"`, `"hidetext"`, `"hidefocus"` |
| `<RadioButton>` | Mutually exclusive selector (grouped by `name`) | `name`, `value`, `title` | `addInteger` | — |
| `<ToggleGroup>` | Groups toggle buttons | `name`, `attach` | Multiple `addInteger(0,1,"name")` | - |
| `<Toggle>` | Toggle button (only inside ToggleGroup) | `name`, `title` | `addInteger(0, 1, "name")` | — |
| `<ButtonGroup>` | Groups momentary buttons | `name` | Multiple `addInteger` | — |
| `<Vertical>` | Vertical layout container | `spacing`, `margin`, `attach` | - | — |
| `<Horizontal>` | Horizontal layout container | `spacing`, `margin`, `attach` | - | — |
| `<DialogGroup>` | Creates rounded background panel | `options` | - | `"primary"`, `"secondary"` |

> **Button behavior:** Click detected via `IParamObserver.paramChanged()`. When clicked, parameter value changes to 1. Must reset to 0 in `paramChanged` to allow re-triggering.

> **EditBox `multiline`:** Requires parameter binding and a defined `height` value to render as multi-line.


### 12.3 Layout Containers

```xml
<Vertical spacing="8" margin="10" attach="left right">
  <!-- children stacked vertically -->
</Vertical>

<Horizontal spacing="4" margin="5" attach="left right">
  <!-- children arranged horizontally -->
</Horizontal>


> ⚠️ **Layout padding quirk:** The topmost `<Horizontal>` or `<Vertical>` container directly inside `<Form>` must have `margin="0"` to eliminate default dialog padding. Without it, a visible gap appears between your DialogGroups and the dialog button edges. Example:
> ```xml
> <Form name="MyDialog" title="My Dialog">
>     <Horizontal margin="0">  ← required for button alignment
>         <DialogGroup>...</DialogGroup>
>         <DialogGroup>...</DialogGroup>
>     </Horizontal>
> </Form>
> ```
```

### 12.4 ColorBox (Requires Nested SelectBox)

```xml
<ColorBox name="Color1" width="100" height="16">
  <SelectBox name="Color1" width="100" height="16"
             options="border transparent hidetext hidefocus"/>
</ColorBox>
```

```javascript
this.Color1 = params.addColor("Color1");
this.Color1.palette = Host.Engine.TrackColorPalette;
this.Color1.value   = Host.Engine.TrackColorPalette.getAt(0);
// Strip alpha byte when using the value: color & 0x00FFFFFF
```

### 12.5 RadioButton Grouping

Multiple `<RadioButton>` elements sharing the same `name` form a mutually exclusive group:

```xml
<RadioButton name="Mode" value="0" title="Beats"/>
<RadioButton name="Mode" value="1" title="Ticks"/>
<RadioButton name="Mode" value="2" title="Seconds"/>
<RadioButton name="Mode" value="3" title="Samples"/>
<RadioButton name="Mode" value="4" title="Bars"/>
```

```javascript
this.Mode = context.parameters.addInteger(0, 4, "Mode");
this.Mode.value = 0;  // default selection
```

> RadioButton `title` always renders to the **right** of the button circle — no attribute can change this. For title-on-left, use a `<Horizontal>` layout with a `<Label>` and an empty-title `<RadioButton>`.

### 12.6 ToggleGroup (Mutual Exclusivity Pattern)

```xml
<Horizontal spacing="0" attach="left right">
  <ToggleGroup name="VelMode" attach="left right">
    <Toggle name="VelUp"   title="Up"/>
    <Toggle name="VelDown" title="Down"/>
    <Toggle name="VelAlt"  title="Alt"/>
  </ToggleGroup>
</Horizontal>
```

```javascript
this.VelUp   = params.addInteger(0, 1, "VelUp");   this.VelUp.value = 1;
this.VelDown = params.addInteger(0, 1, "VelDown");  this.VelDown.value = 0;
this.VelAlt  = params.addInteger(0, 1, "VelAlt");   this.VelAlt.value = 0;

this.paramChanged = function(param) {
  var toggles = [this.VelUp, this.VelDown, this.VelAlt];
  for (var i = 0; i < toggles.length; i++) {
    if (param === toggles[i] && toggles[i].value === 1) {
      for (var j = 0; j < toggles.length; j++) {
        if (j !== i) toggles[j].value = 0;
      }
      break;
    }
  }
};
```

> Wrap `<ToggleGroup>` in `<Horizontal spacing="0">` to render horizontally. `options="horizontal"` on ToggleGroup itself has no effect.

### 12.7 Button (Custom Action Buttons)

```xml
<Button name="Defaults" title="Reset Defaults" width="120" height="24"/>
```

```javascript
this.Defaults = context.parameters.addInteger(0, 1, "Defaults");
this.Defaults.value = 0;

this.interfaces = [Host.Interfaces.IEditTask, Host.Interfaces.IParamObserver];

this.paramChanged = function(param) {
  if (param === this.Defaults && this.Defaults.value === 1) {
    // Handle button click
    this.SomeParam.value = 50;  // reset to defaults
    this.Defaults.value = 0;    // REQUIRED: reset to allow re-triggering
  }
};
```

### 12.8 Range Slider Pattern (Two Sliders)

Undiscovered native dual-handle range slider exists. Use two separate sliders with enforcement for now:

```xml
<Label title="Min:"/>
<Horizontal spacing="2" attach="left right">
  <Slider  name="RangeMin" width="350" height="20" options="horizontal"/>
  <EditBox name="RangeMin" width="40"  height="20" options="readonly"/>
</Horizontal>
<Label title="Max:"/>
<Horizontal spacing="2" attach="left right">
  <Slider  name="RangeMax" width="350" height="20" options="horizontal"/>
  <EditBox name="RangeMax" width="40"  height="20" options="readonly"/>
</Horizontal>
```

```javascript
this.RangeMin = params.addInteger(0, 127, "RangeMin"); this.RangeMin.value = 20;
this.RangeMax = params.addInteger(0, 127, "RangeMax"); this.RangeMax.value = 100;

this.paramChanged = function(param) {
  if (param === this.RangeMin && this.RangeMin.value >= this.RangeMax.value)
    this.RangeMax.value = this.RangeMin.value + 1;
  if (param === this.RangeMax && this.RangeMax.value <= this.RangeMin.value)
    this.RangeMin.value = this.RangeMax.value - 1;
};
```

### 12.9 Slider with Unit Label

```xml
<Horizontal spacing="2" attach="left right">
  <Slider  name="TimeSlider" width="200" height="20" options="horizontal"/>
  <EditBox name="TimeSlider" width="60"  height="20"/>
  <Label title="ms"/>
</Horizontal>
```

> Slider `height` controls handle size. Recommended: `20`. Default is `16`.

### 12.10 Knob Element

```xml
<Vertical spacing="5">
  <Knob    name="MyKnob"        width="60" height="60"/>
  <EditBox name="MyKnobDisplay" width="60" height="20" options="readonly"/>
</Vertical>
```

```javascript
this.MyKnob        = params.addInteger(0, 127, "MyKnob");
this.MyKnobDisplay = params.addString("MyKnobDisplay");
this.MyKnobDisplay.value = String(this.MyKnob.value);

this.paramChanged = function(param) {
  if (param === this.MyKnob)
    this.MyKnobDisplay.value = String(this.MyKnob.value);
};
```

> Knob fill is always left-to-min. Bipolar/center-fill is **not possible** — no attribute achieves this. Recommended sizes: Small=40×40, Medium=60×60, Large=80×80.

### 12.11 Styles System

```xml
<Styles>
  <Style name="MyEditBox" inherit="Standard.AddIn.EditBox">
    <Color name="backcolor"  color="#1A1A2E"/>
    <Color name="textcolor"  color="#FFFFFF"/>
    <Font  name="textfont"   themeid="PresonusUI" size="13" bold="true"/>
  </Style>
</Styles>
```

**Confirmed working style properties:** `backcolor` (on focus/press), `textcolor`, font `size`, font `bold`, style `inherit`.

**Not working:** hover/pressed colors on buttons, focused colors on EditBox, italic font, all separator/panel/DialogGroup background overrides, slider colors.

### 12.12 Confirmed Non-Working Elements

Elements that render as plain text or nothing: `<Group>`, `<Section>`, `<Frame>`, `<Box>`, `<Container>`, `<FieldSet>`, `<GroupBox>`, `<Panel>`, `<Separator>`, `<RadioGroup>`, `<SegmentedControl>`

Attributes that have no effect: text alignment (`align`, `halign`, `justify`), ComboBox options from XML (`<Item>`, `items=`, `values=`), CheckBox initial state from XML (`value=`, `checked=`, `default=`), RadioButton group from `group=` attribute (use shared `name` instead).

---

## 13. File I/O

### 13.1 Host.Url (Path Construction)

```javascript
var path = Host.Url("local://$USERCONTENT/folder/file.txt");
// $USERCONTENT:
//   Windows: %AppData%\PreSonus\Studio One\UserContent\
//   macOS:   ~/Library/PreSonus/Studio One/UserContent/

path.ascend();               // Navigate up one directory
path.descend("subfolder");   // Navigate into subdirectory

// Package resource path:
var pkgPath = Host.Url("package://" + PackageID + "/resources/file.xml");

// Folder path (trailing slash, second arg = true):
var folder = Host.Url("local://$USERCONTENT/StudioOneX/", true);
```

### 13.2 Host.IO

```javascript
// Read text file:
var file = Host.IO.openTextFile(path);
if (file) {
  while (!file.endOfStream) {
    var line = file.readLine();
  }
  file.close();
}

// Write text file:
var file = Host.IO.createTextFile(path);
if (file) {
  file.writeLine("content");
  file.close();
}

// File operations:
Host.IO.File(path).exists()          // Boolean ✓
Host.IO.File(path).copyTo(destPath)  // Copy ✓
Host.IO.File(path).remove()          // Delete ✓

// Find files matching a pattern:
var it = Host.IO.findFiles(folderPath, "*.xml");
while (!it.done()) {
  var file = it.next();
  var name = file.name;  // filename with extension
}

// Base64:
Host.IO.toBase64(data)     // ✓
Host.IO.fromBase64(data)   // ✓

// Package:
Host.IO.openPackage(path)    // Returns null for non-package files
Host.IO.createPackage(path)  // Returns package object ✓
```

### 13.3 Platform Detection

```javascript
Host.getPlatform()   // Returns "win" or "mac"
```

### 13.4 Date / Time

```javascript
var end = Host.DateTime("2026/01/01");     // Parse date string ✓
var now = Host.SystemInfo.getLocalTime();  // Current local time ✓
end.toSeconds() < now.toSeconds()         // Compare times ✓
```

### 13.5 Document Path Access

```javascript
function getSongFolder(fileName) {
  var docManager = Host.Objects.getObjectByUrl("://studioapp/DocumentManager");
  var doc  = docManager.activeDocument;
  var path = doc.path;
  path.ascend();
  path.descend(fileName);
  return path;
}
```

---

## 14. Cross-Script Communication

### 14.1 Host.Signals (Pub/Sub)

```javascript
// Implement in task:
this.interfaces = [Host.Interfaces.IComponent, Host.Interfaces.IObserver, /* ... */];

this.notify = function(subject, msg) {
  var cmd = msg.id;         // Signal name (second arg to signal())
  var arg = msg.getArg(0);  // Payload (third arg to signal())
  // handle signal
};

// Subscribe to a channel:
Host.Signals.advise("my-channel-name", this);

// Unsubscribe:
Host.Signals.unadvise("my-channel-name", this);

// Emit a signal:
Host.Signals.signal("my-channel-name", "EventName", payload);
```

Channel names are arbitrary strings — define your own. Signals without IObserver subscribers are silently ignored.

---

## 15. Known Limitations & Dead Ends

### 15.1 Confirmed Dead Ends (Re-Investigate If You'd Like)

| API | Status |
|---|---|
| `editor.createSequenceIterator()` | Does NOT exist — use `event.region.createSequenceIterator()` |
| `editor.selectMultiple()` | Does NOT exist — use `editor.createSelectFunctions().selectMultiple()` |
| `fn.root.createFunctions()` | Returns broken stub; worse than `context.functions` |
| `fn.createEvent(template, ...)` | Returns undefined; no note appears regardless of args |
| `interpretCommand("Music", "Insert Note")` | No effect |
| `Host.GUI.Alerts` | Empty namespace — use `Host.GUI.alert()` directly |
| `Host.Graphics` drawing | Image loading only — no canvas/draw API; may crash |
| `Host.Signals` without IObserver | Returns undefined by design — implement IObserver |
| `note.clone()` + `fn.insertEvent(note)` | Clone properties are read-only; must use `insertEvent(region, note)` |
| Knob center/bipolar fill | Impossible — no attribute achieves this |
| `ComboBox` items from `<Item>` XML | Ignored — populate via `addList().appendString()` |

### 15.2 Confirmed Limitations

| Limitation | Detail |
|---|---|
| **One script per package** | Only the first `<ScriptClass>` in `classfactory.xml` is loaded |
| **Package caching** | Replacing `.package` alone is not always sufficient — change ID or filename |
| **No automation access** | Automation tracks cannot be scripted |
| **No FX chain access** | `channel.effects/inserts/plugins` are all undefined |
| **No MIDI CC iteration** | CC events may not appear in standard iterators |
| **Selection is not undoable** | Disable journaling before any selection operations |
| **Piano editor quantize UI** | Read-only via `context.editor.quantize` — cannot change UI |
| **context.iterator properties** | May return undefined in some editor contexts |
| **Note properties are read-only** | Only `note.startTime.seconds` is confirmed writable |
| **No event listener / polling** | Cannot monitor DAW state changes; must re-run script |
| **Bar Offset is visual only** | `activeRegion.start` ignores the Bar Offset setting |
| **Scripts folder (macOS)** | `/Applications/Studio Pro 8.app/Contents/Scripts/` — not `~/Library/...` |

### 15.3 Known Gaps

- Full command list for `interpretCommand()` (~1660 commands across 54 categories — names only partially documented)
- MIDI CC / controller event handling
- Complete `skin.xml` element and attribute reference (Centered labels, dual handle range sliders, etc.)
- `functions.newMediaTime()` full property set
- Arranger API: full `addArrangerEvent()` signature
- `Host.GUI.openUrl()` — seen in source, not yet confirmed
- Multiple scripts per package

---

## 16. Complete API Index

### 16.1 Host.GUI Namespaces

`Constants`, `Commands`, `Themes`, `Desktop`, `Help`, `Configuration`, `Clipboard`, `Alerts`

### 16.2 Host.Engine Properties

`TrackFormats`, `TrackColorPalette`, `TrackIcons`, `MediaClips`, `Speakers`, `CrossFadeFinder`

### 16.3 context.functions — Full Method List

```
beginMultiple, endMultiple, setJournalEnabled, isJournalEnabled,
insertEvent, deleteEvent, moveEvent, resizeEvent,
modifyPitch, modifyVelocity, muteEvent,
freezeVelocity, freezePitch, freezeQuantize,
quantize, quantizeEvent, setLyrics, createEvent,
renameEvent, colorizeEvent, removeTrack,
createFadeIn, createFadeOut,
newMusicalTime, newMediaTime,
root (object), executeImmediately (flag)
```

### 16.4 Iterator — Full Method List

```
done(), first(), last(), next(), previous()
```

### 16.5 note.startTime — Full Method List

```
as()          → seconds as plain number
clone()       → valid time object copy
convert()     → undefined
toMusicalTime() → undefined
```

### 16.6 Editor Object — Key Confirmed Working Methods

```
getItemType(note)           → "NoteEvent"
canSelect(note)             → 1
isSameItem(n1, n2)          → 1 if same
deleteItem(note)            → deletes note ✓
editItem(note)              → 0 (success)
pixelToTime(pixel)          → time-like object
pixelToVertical(pixel)      → coordinate number
createSelectFunctions(fn)   → selectFunctions object ✓
showSelection(bool)
split(event, time)
sizeLeft(event, size)
sizeRight(event, size)
newTimeSegment(time)
select(note), unselect(note)
```

### 16.7 Color Utilities

**Hex string to color integer:**

```javascript
function getColorVal(hexcolor) {
  var value = parseInt(hexcolor, 16);
  var r = (value >> 16) & 0xff;
  var g = (value >>  8) & 0xff;
  var b =  value        & 0xff;
  return ((b << 16) | (g << 8) | r) | 0xff000000;
}
```

**Color interpolation (gradient):**

```javascript
function interpolateColor(color1, color2, t) {
  var r1 = (color1 & 0xff0000) >> 16, g1 = (color1 & 0xff00) >> 8, b1 = color1 & 0xff;
  var r2 = (color2 & 0xff0000) >> 16, g2 = (color2 & 0xff00) >> 8, b2 = color2 & 0xff;
  return (Math.round(r1 + (r2 - r1) * t) << 16) +
         (Math.round(g1 + (g2 - g1) * t) << 8) +
          Math.round(b1 + (b2 - b1) * t);
}
// t = 0.0 → color1, t = 1.0 → color2
// Strip alpha from addColor() value: color & 0x00FFFFFF
```

**dB conversion:**

```javascript
function dbToFloat(db)   { return Math.pow(10, parseFloat(db / 20)); }
function floatToDb(f)    { return (Math.log(parseFloat(f)) / Math.LN10) * 20; }
```

**Prototype chain introspection (debugging):**

```javascript
function getAllPropertyNames(obj) {
  var props = [];
  do { props = props.concat(Object.getOwnPropertyNames(obj)); }
  while (obj = Object.getPrototypeOf(obj));
  Host.GUI.alert(props.join('\r\n'));
}
```

**Version detection (fallback pattern):**

```javascript
var iterator = editor.createSequenceIterator
  ? editor.createSequenceIterator()           // newer API (does NOT exist in Studio Pro)
  : (editor.model && editor.model.activeRegion
     ? editor.model.activeRegion.createIterator()
     : null);
// Correct approach: use event.region.createSequenceIterator()
```

### 16.8 Application Configuration Access

```javascript
var value = Host.studioapp.find("Application").Configuration
  .getValue("Engine.Editing", "midiValuePresentationEnabled");
```

### 16.9 Pitch Name List

```javascript
var musicPartFunctions = context.editor.activeRegion.getRoot()
  .createFunctions("MusicPartFunctions");
var nameList = musicPartFunctions.createPitchNameList(track);
for (var i = 127; i >= 0; i--) {
  var name = nameList.getPitchName(i).trim();
  if (name.length > 0) { /* pitch i has a named keyswitch/articulation */ }
}
```

---

## 17. Examples

### 17.1 Flam Tool — Complete Working Example

The **Flam Tool** script in this repository is a complete, working example demonstrating:
- `classfactory.xml` with `EditTask` registration
- `metainfo.xml` with `Package:SkinFile` declaration
- `skin.xml` with `DialogGroup`, `Slider`, `EditBox`, `CheckBox`, `Knob`, and `Label` elements
- `main.js` with `prepareEdit()`, `performEdit()`, `IParamObserver`, and note manipulation

**Source code:** [`scripts/sources/flam-tool-source/`](scripts/sources/flam-tool-source/)

**Files:**
- [`classfactory.xml`](scripts/sources/flam-tool-source/classfactory.xml)
- [`metainfo.xml`](scripts/sources/flam-tool-source/metainfo.xml)
- [`main.js`](scripts/sources/flam-tool-source/main.js)
- [`skin/skin.xml`](scripts/sources/flam-tool-source/skin/skin.xml)

---

## 18. Community Resources & Sources

| Resource | URL |
|---|---|
| PreSonus Forums | https://studiooneforum.com/ |
| Studio One Toolbox (Lukas Ruschitzka) | https://s1toolbox.com/ |
| GitHub — DjFix functions helper | https://github.com/DjFix/studioone_functions |
| KVR Audio Forum | https://www.kvraudio.com/forum/ |
| VI-CONTROL | https://vi-control.net/ |

### Reference Scripts to Study
- **Navigation Essentials 2.0.1** (Lukas Ruschitzka) — track selection, colorize, piano editor tasks
- **Studio One X v2.6.1** (Narech Kontcell) (`studioonex.package`) — extensive source reference; reverse engineered via PACKAGEF extraction

---

*Community-compiled, not affiliated with PreSonus or Fender*
