# Studio Pro Scripting API Reference

**Platform:** Fender Studio Pro / PreSonus Studio One

> ⚠️ **Disclaimer:** Fender/PreSonus does not provide official public documentation for this API. This reference is entirely community-derived and incomplete. The API is internal and undocumented. Scripts may break between versions. Use defensive coding practices throughout.

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
15. [Complete API Index](#15-complete-api-index)
16. [Known Limitations, Dead Ends & Debugging](#16-known-limitations--dead-ends)
17. [Examples](#17-examples)
18. [Community Resources & References](#18-community-resources)

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

**Multi-script packages:**

For multi-script packages, the structure is the same at the ZIP root, but each script has its own uniquely named `sourceFile` and unique `classID`, and each of those files is referenced in a single `classfactory.xml`. Shared UI definitions live in one `skin.xml`, with one `<Form>` per script when dialogs are used. See [17.3 Multi Script Demo](#173-multi-script-demo--complete-working-example) for a working example.

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
| `"AudioEdit"` | Audio editor |
| `"EventEdit"` | Arrangement editor events |
| `"FrameworkService"` | Background service, no menu entry |
| `"MusicEdit"` | Piano roll / MIDI editor |
| `"MusicPartEdit"` | Instrument Part editor |
| `"ProjectEdit"` | Project-level operations |
| `"TrackEdit"` | Track list operations |

**Optional `<Attribute>` entries:**

| ID | Description |
|---|---|
| `arguments` | Comma-separated param names (e.g., `"Volume,Pan"`) |
| `alwaysEnabled` | `"1"` skips `prepareEdit()` result for enable/disable |
| `commandCategory` | Category in macro/key binding system |
| `formName` | skin.xml Form name (for `EditAddIn` panels) |
| `groupName` | Panel group location (e.g., `"Song.AddInPanel"`) |
| `hidden` | `"1"` hides from menus; accessible via command system only |
| `menuGroup` | Group name for menu clustering |
| `menuPriority` | Integer sort order; `-1` hides from menu |
| `metaClassID` | Optional unique GUID for internal metadata binding; (**purpose unclear**)|
| `musicEditorOnly` | `"1"` restricts to music editor context |
| `supportsProject` | `"1"` for project-level operation |
| `TrackContextMenu` | `"1"` adds to track right-click menu |
| `wantAudioParts` | `"1"` to include audio clips in iteration |

**Adding an icon (`ScriptMetaClass`):**

```xml
<ScriptMetaClass classID="{your-metaClassID}">
  <ScriptClassResource id="Class:ImageResource"
    url="theme://$package/IconName"/>
</ScriptMetaClass>
```

### 1.4 Installation

For Studio Pro 8, place your `.package` files in the following directory:

| Platform | Scripts folder |
|---|---|
| **Windows** | `C:\Program Files\Fender\Studio Pro 8\Scripts\` |
| **macOS** | `/Applications/Studio Pro 8.app/Contents/Scripts/` |

**Hot-reloading behavior:**
- **Initial recognition**: Restart Studio Pro or change Package:ID/classID to cache new metadata.
- **Development iteration**: Once recognized, replace .package file to hot-reload main.js, skin.xml changes without restart (metainfo.xml/classfactory.xml changes may still require restart/GUID update).

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

### 2.7 Version Detection (Fallback Pattern)

Because the API is undocumented and changes between versions, use feature-detection rather than version checks when calling methods that may not exist:

```javascript
var iterator = editor.createSequenceIterator
  ? editor.createSequenceIterator()           // newer API (does NOT exist in Studio Pro)
  : (editor.model && editor.model.activeRegion
     ? editor.model.activeRegion.createIterator()
     : null);
// Correct approach: use event.region.createSequenceIterator()
```

---

## 3. Context Object

The `context` object is passed to both `prepareEdit()` and `performEdit()`. Not all properties are available in both phases.

### 3.1 Context Availability

| Property / Method | prepareEdit | performEdit |
|---|---|---|
| `context.mainTrackList` | — | ✓ |
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

⚠️ __IMPORTANT LIMITATION__: `context.mainTrackList` is __always NULL in prepareEdit()__ regardless of context. It only becomes available in performEdit() when NO Instrument Part is actively open in the editor (i.e., `context.editor.activeRegion` is null). To check track availability, perform your validation in performEdit() or use alternative approaches in prepareEdit().

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
channel.findParameter("tempo")          // Tempo (BPM) as float
```

**Additional channel properties:**

```javascript
channel.input                // Input routing object
channel.editGroup            // Edit group (undefined if unassigned)
channel.editor               // ChannelEditor object
channel.editor.windowClass   // e.g., "F11E8B6D6A4D46E79FC5CE67F540E592"
channel.editor.name          // "ChannelEditor"
channel.editor.title         // "ChannelEditor"
channel.overview             // ChannelOverview object
channel.overview.windowClass // e.g., "F11E8B6D6A4D46E79FC5CE67F540E592.o"
channel.overview.name        // "ChannelOverview"
channel.overview.title       // "ChannelOverview"
```

**Channel parent chain (MusicTrack example):**

```javascript
// channel.parent             → MusicTrack       (title = "MusicTrack")
// channel.parent.parent      → Channels         (title = "Channels")
// channel.parent.parent.parent           → MusicTrackDevice  (title = "Instrument Channels")
// channel.parent.parent.parent.parent    → SongEnvironment   (title = "SongEnvironment")
```

**Channel routing:**

```javascript
// Find a bus (sub-out) by name
var subList = console.getChannelList(2); // Sub-outs
var dimSoloBus = null;
for (var i = 0; i < subList.numChannels; i++) {
  var bus = subList.getChannel(i);
  if (bus.label === "Dim Solo") {
    dimSoloBus = bus;
    break;
  }
}

// Route the channel to the dim solo bus
if (dimSoloBus) {
  channel.connectTo(dimSoloBus);
}

// Route back to master
channel.connectTo(masterBus);

// Check current routing
if (channel.getDestinationChannel() === dimSoloBus) {
  // Channel is routed to dim solo bus
}
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

**URL-based MixerConsole access:**

```javascript
var mixerConsole = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/MixerConsole"
);
mixerConsole.name    // "MixerConsole"
mixerConsole.title   // "Console"
```

**audioMixer object (via MixerConsole):**

```javascript
var audioMixer = mixerConsole.audioMixer;
audioMixer.name    // "AudioMixer"
audioMixer.title   // "Audio Channels"

audioMixer.getOutputPortList()       // Returns output port list
audioMixer.getMaxSendSlotCount()     // Maximum send slot count
audioMixer.getMaxSlotCount()         // Maximum insert slot count
audioMixer.getMasterSpeakerType()    // Master speaker type identifier
```

> ⚠️ `mixerConsole.parent` is a circular reference — do not enumerate it.

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
region.createSequenceIterator()  // Iterator over ALL notes in region
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

### 5.6 Chord Events (Chord Track)

Chord events are special runtime objects on the Chord Track. They are **not stored as XML nodes** in the `.song` file — they only appear as event objects iterated in an **EventEdit** or **TrackEdit** context when the Chord Track is targeted.

**Identification:**

```javascript
// Chord events have mediaType === undefined
// Filter them from context.iterator:
while (!it.done()) {
  var event = it.next();
  if (event.chord) {
    // This is a chord event
  }
}
```

**event.chord properties:**

```javascript
event.chord.name       // Full chord name string, e.g., "B♭7 #11", "B5/D".
event.chord.type       // Chord type ID (integer) 0-6 (0 maj, 1 min, 2 dim, 3 aug, 4 sus2, 5 sus4, 6 power)
event.chord.root       // Root note offset as absolute directional coordinate on circle of fifths spiral
event.chord.bass       // Bass note offset as absolute directional coordinate on circle of fifths spiral
event.chord.rootPitch  // Root pitch as absolute MIDI value (0 = C, 1 = C#, …, 7 = G, etc.)
event.chord.bassPitch  // Bass pitch as absolute MIDI value (0 = C, 1 = C#, …, 7 = G, etc.)
event.chord.hasInterval(interval)  // Boolean — checks if chord contains a given interval
                                   // e.g., hasInterval(11) to test for #11/Lydian
```
> `rootPitch` / `bassPitch` are **absolute MIDI values** anchored to the engine's fixed C=0 reference — independent of the project Key Signature. No transposition math is needed: if rootPitch is 7, the root is G.

> `root` / `bass` are **absolute directional coordinate values** on the Circle of Fifths Spiral, where C = 0. They allow the script to distinguish between enharmonic notes (like G♯ vs A♭) and identify chord inversions by calculating the spiral distance between the chord's foundation and its lowest note. 

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

**Chord-scrape workflow:**

For a ready-to-use chord scraping script, see the [Chord Mapping package](scripts/packages/chord-mapping/) ([source](scripts/sources/chord-mapping-source/main.js)). It automates the process above, exporting chord data to JSON and a results log.

### 5.7 Event Iterator — Additional Methods

```javascript
// On events from context.iterator (MusicEdit context):
context.iterator.createSequenceIterator()      // Known sequence iterator
event.getSoundVariationForNote(note)           // Sound variation for a given note
event.getLyricsForNote(note)                   // Lyrics string for a given note
```

---

## 6. Time Objects

### 6.1 Time Object Structure

Time objects represent positions in musical time and can be created via `functions.newMediaTime()` or `functions.newMusicalTime()`. They are used throughout the API for event timing, cursor positions, and time-based operations.

```javascript
var t = event.startTime;  // or fn.newMediaTime()

// Core properties:
t.musical           // Musical time sub-object (see below)
t.seconds           // Absolute seconds (writable on note.startTime)
t.samples           // Absolute samples at session sample rate
t.time              // Internal time units (read-only)
t.string            // Formatted string: "00:00:00.000" or "1.1.1.000"

// Methods:
t.as()              // Returns seconds as plain number
t.clone()           // Returns valid time object copy
t.convert()         // Returns undefined (non-functional)
t.toMusicalTime()   // Returns undefined (non-functional)

// Musical sub-object structure:
t.musical.bar       // Bar number (1-based)
t.musical.beat      // Beat position (0.0 to beat_count, fractional)
t.musical.value     // Total beats from project start
```

### 6.2 Property Details

**Writable Properties:**
- `t.seconds` - Can be set to any numeric value (seconds)
- `t.musical.beat` - Can be set to adjust beat position
- `t.musical.bar` - Can be set to adjust bar number
- `t.musical.value` - Can be set to total beats from project start

**Read-only Properties:**
- `t.samples` - Derived from seconds and project sample rate
- `t.time` - Internal representation (purpose unclear)
- `t.string` - Formatted display string

**musical sub-object:**
The `musical` property contains bar/beat musical time representation. When writing to `t.musical.beat` or `t.musical.bar`, other time representations (seconds, samples) are automatically updated to maintain consistency.

### 6.3 Creating New Time Objects

```javascript
// Create empty time object (all properties initialized to 0)
// ✅ fn.newMediaTime() works in AudioEdit, EventEdit, TrackEdit, and MusicEdit contexts
var t1 = fn.newMediaTime();  // Returns {seconds: 0, string: "00:00:00.000"}

// Create musical time with beat position
var t2 = fn.newMusicalTime(beats);  // beats from project start

// Create musical time with bar and beat
var t3 = fn.newMusicalTime(totalBeats, bar, beat);

// Alternative creation (not recommended for edit operations):
var t4 = note.region.getTrack().getRoot().createFunctions().newMediaTime();
t4.seconds = targetSeconds;
// or:
t4.musical = {bar: 1, beat: 1.0, value: 4.0};  // Set musical time
```

**✅ Definitive Context Availability (Based on Comprehensive Testing):**

| Function | Available Contexts | Returns | Notes |
|---|---|---|---|
| `fn.newMediaTime()` | **AudioEdit, EventEdit, TrackEdit, MusicEdit** | `{seconds: 0, string: "00:00:00.000"}` | **Universal time creation method** - works in 4 out of 5 contexts |
| `fn.newMusicalTime()` | **Only MusicEdit** (Piano roll/MIDI editor) | Musical time objects | Specialized for MIDI editor only |
| `createFunctions().newMediaTime()` | All contexts (when note/region available) | Media time objects | Alternative method requiring selected note |

**Test Results Summary:**
- **AudioEdit** (Audio editor): `fn.newMediaTime()` ✓ Works, `fn.newMusicalTime()` ✗ Not available
- **EventEdit** (Arrangement editor): `fn.newMediaTime()` ✓ Works, `fn.newMusicalTime()` ✗ Not available  
- **TrackEdit** (Track list): `fn.newMediaTime()` ✓ Works, `fn.newMusicalTime()` ✗ Not available
- **MusicEdit** (MIDI editor): Both functions ✓ Work
- **ProjectEdit** (Project level): `fn.newMusicalTime()` ✓ (returns broken objects), `fn.newMediaTime()` ✗ Not available

**Universal Time Creation Pattern:**

```javascript
// Works in AudioEdit, EventEdit, TrackEdit, and MusicEdit contexts
function createTime(fn) {
    if (typeof fn.newMediaTime === 'function') {
        var time = fn.newMediaTime();
        // Returns: {seconds: 0, string: "00:00:00.000"}
        if (time && time.seconds !== undefined) {
            return time;  // Valid time object
        }
    }
    return null;  // No time creation available (ProjectEdit context)
}

// Set time in seconds (seconds property is writable)
var time = createTime(fn);
if (time) {
    time.seconds = 5.0;  // Set to 5 seconds
    // time.string updates automatically: "00:00:05.000"
}
```

**Context-Specific Optimization:**

```javascript
// For MIDI editor scripts (MusicEdit context only)
function createMusicalTime(fn, beats) {
    if (typeof fn.newMusicalTime === 'function') {
        return fn.newMusicalTime(beats);  // MusicEdit only
    }
    // Fallback for other contexts
    return createTime(fn);
}
```

### 6.4 Time Object Usage Patterns

**Writing to note timing:**
```javascript
note.startTime.seconds = newTimeInSeconds;
fn.moveEvent(note, note.startTime);  // Required to apply the change
```

**Time arithmetic:**
```javascript
var start = fn.newMediaTime();
var end = fn.newMediaTime();
start.seconds = 5.0;
end.seconds = 10.0;
var duration = end.seconds - start.seconds;  // 5.0 seconds
```

**Musical time manipulation:**
```javascript
var time = fn.newMusicalTime(8.0);  // 8 beats from start
time.musical.bar = 3;               // Move to bar 3
time.musical.beat = 2.5;            // Bar 3, beat 2.5
```

**Formatting for display:**
```javascript
var display = time.string;  // "00:00:05.000" or "3.2.2.500"
```

### 6.5 Time Conversion Utilities

```javascript
// Convert seconds to beats (requires tempo context)
function secondsToBeats(seconds, bpm) {
    return seconds * (bpm / 60.0);
}

// Convert beats to seconds
function beatsToSeconds(beats, bpm) {
    return beats * (60.0 / bpm);
}

// Get current tempo for conversion
var tp = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
);
var bpm = Number(tp.findParameter("tempo").string);
```

### 6.6 Transport / Cursor Time Access

```javascript
var tp = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
);

var bpm     = tp.findParameter("tempo").string;      // e.g., "120.0"
var cursor  = tp.findParameter("primaryTime");       // cursor position (time object)
var isPlay  = tp.findParameter("start").value;       // playback state

// Get cursor position in seconds
var cursorSeconds = cursor.value.seconds;

// Set cursor position
var newTime = fn.newMediaTime();
newTime.seconds = 30.5;
// Note: Direct cursor manipulation may require command execution
```

---

## 7. Edit Functions (context.functions)

`fn` is a common local alias used for `context.functions`; it must be defined in
the script before use.

`context.functions` is the **only reliable** function object for note manipulation. Do not use `fn.root.createFunctions()` for note editing — it returns a different broken stub in tested note-edit paths.

For root-specific function families such as `AudioFunctions` and `MusicPartFunctions`, call `createFunctions("FamilyName")` from the correct object root for the item being edited. For example, audio event operations should create `AudioFunctions` from an audio event or region root, not from an unrelated note-edit function stub.

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

**Confirmed working pattern:**

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

**Arranger object:**

```javascript
arranger.addArrangerEvent(track, start, end) // Create arranger section
arranger.getArrangerTrack()                 // Returns ArrangerTrack handle
arranger.showArrangerTrack()                // Shows the Arranger Track
```

**ArrangerTrack object:**

```javascript
track.name   // "Arranger Track"
```

The `ArrangerTrack` object is primarily a handle passed to `addArrangerEvent()`.

**Arranger event object:**

```javascript
event.name
event.startTime
event.endTime
event.length
event.lengthTime
event.color
```

Confirmed edit support:

```javascript
fn.renameEvent(event, "Section Name")
fn.colorizeEvent(event, colorIntValue)
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
context.editor.deleteItem(note)                  // DELETES note from editor
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
selector.selectMultiple(arrayOfNotes);   // Multi-select
selector.select(singleNote);             // Single select
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

**Audio crossfade command attributes:**

```javascript
var attrs = Host.Attributes([
  "Length", "0.02",
  "Type", "Linear",
  "Bend", "0"
]);

Host.GUI.Commands.interpretCommand("Audio", "Create Crossfades", false, attrs);
```

`Audio -> Create Crossfades` accepts `Length`, `Type`, and `Bend` attributes. Confirmed `Type` values are `Linear`, `Logarithmic`, and `Exponential`. For a full working package using this command alongside `AudioFunctions.createCrossFades(...)`, see [17.4 Crossfade Tool](#174-crossfade-tool--complete-working-example).

### 9.3 Host.studioapp (Alternative Command Interpreter)

> An alternative to `Host.GUI.Commands.interpretCommand()`:

```javascript
Host.studioapp.interpretCommand("Edit", "Create Range from Cursor");
Host.studioapp.interpretCommand("Edit", "Move Range Back");
Host.studioapp.interpretCommand("Transport", "Locate Selection");
Host.studioapp.interpretCommand("Track", "Select Scene 1");
Host.studioapp.interpretCommand("Zoom", "Zoom Full", false, Host.Attributes(["State", "1"]));
```

- Direct application-level command interpreter
- Some commands only work through this interface (not GUI.Commands)
- Same signature: `interpretCommand(category, name, [clearSelection], [attrs])`

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

**Dialog constants (with numeric values):**

| Constant | Value | Category |
|---|---|---|
| `kMouseNone` | 0 | Mouse state |
| `kMouseDown` | 1 | Mouse state |
| `kMouseOver` | 2 | Mouse state |
| `kLButton` | 1 | Mouse button |
| `kMButton` | 2 | Mouse button |
| `kRButton` | 4 | Mouse button |
| `kShift` | 8 | Modifier key |
| `kCommand` | 16 | Modifier key |
| `kOption` | 32 | Modifier key |
| `kControl` | 64 | Modifier key |
| `kClick` | 65536 | Mouse event |
| `kDrag` | 131072 | Mouse event |
| `kDoubleClick` | 262144 | Mouse event |
| `kWheel` | 1048576 | Mouse event |
| `kCancel` | 0 | Dialog result |
| `kOkay` | 1 | Dialog result |
| `kClose` | 2 | Dialog result |
| `kApply` | 3 | Dialog result |
| `kYes` | 0 | Alert result |
| `kNo` | 1 | Alert result |
| `kAlertCancel` | 2 | Alert result |
| `kOk` | 3 | Alert result |
| `kRetry` | 4 | Alert result |

### 9.5 Host.GUI.Clipboard

```javascript
Host.GUI.Clipboard.setText(text)   // Set clipboard text
Host.GUI.Clipboard.getText()       // Get clipboard text
```

> ⚠️ Text-only. Binary DAW data (MIDI clips, etc.) is not accessible via the clipboard.

### 9.6 Host.GUI.openUrl

```javascript
Host.GUI.openUrl(url)   // Open a local file or URL in the host
```

`Host.GUI.openUrl()` accepts a `Host.Url` object and returns a numeric status
code. `0` indicates success.

**Usage:**

```javascript
var targetPath = Host.Url("local://$USERCONTENT/OpenUrlProbe_Target.txt");
var status = Host.GUI.openUrl(targetPath);
Host.Console.writeLine("openUrl status: " + status);
```

> 📖 The call can open local files and folders.   
> ⚠️ Passing a plain string returns a nonzero failure code.

### 9.7 Host.Objects (URL-Based Object Access)

```javascript
Host.Objects.getObjectByUrl(url)    // Get internal host object by URL
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
"://hostapp/DocumentManager/ActiveDocument/Environment/MixerConsole"
"://studioapp"  (same as ://hostapp)
"://studioapp/DocumentManager"
"://studioapp/DocumentManager/ActiveDocument"
"object://hostapp/.../EventInspector"
"object://hostapp/.../EventInspector/EventInfo"
"object://hostapp/.../EventInspector/EventInfo/ChordSelector"
"://hostapp/.../Editor"
"://hostapp/.../TrackList"
"://hostapp/.../MediaPool"
```

All URL objects share: `obj.findParameter(name)`, `obj.interpretCommand(...)`, `obj.find(name)`

### 9.8 Host.Classes (Factory Instantiation)

```javascript
Host.Classes.createInstance(classID)        // Create instance
Host.Classes.getClassDescription(classID)   // Get class description
Host.Classes.newIterator()                  // Returns empty iterator
```

**Instantiable built-in classes:**

| Class ID | Description |
|---|---|
| `"CCL:ButtonGroup"` | Button group UI element |
| `"CCL:CommandBarModel"` | Command bar |
| `"CCL:CommandSelector"` | Command selector |
| `"CCL:CheckBox"` | Checkbox UI element |
| `"CCL:Divider"` | Divider UI element |
| `"CCL:FileSelector"` | File picker dialog |
| `"CCL:Label"` | Label UI element |
| `"CCL:ParamList"` | Parameter list for persistent dialogs |
| `"CCL:ProgressDialog"` | Progress indicator |
| `"CCL:RadioButton"` | RadioButton UI element |
| `"CCL:ScrollView"` | ScrollView UI element |
| `"CCL:View"` | View UI element |
| `"Devices:PortParam"` | Port/MIDI parameter |
| `"Host:ListViewModel"` | List/table data model |
| `"Host:PresetParam"` | Preset parameter |

**Command tree / selector notes:**

- `CCL:CommandBarModel` exposes a mutable root/page tree via `getRootItem()` and `createPage()`. The returned nodes expose `addChildItem()`, `removeChildItem()`, `getChildItem()`, `getChildIndex()`, `cloneItem()`, `saveToFile()`, and `loadFromFile()`.
- `CCL:CommandBarModel` tree nodes expose fields such as `name`, `layout`, `revision`, `id`, `title`, `type`, `numChilds`, `flags`, `isReadOnly`, `isTemporary`, and `isLeftClickContextMenu`.
- `CCL:CommandBarModel.cloneItem()` preserves the root node `id` field in the returned tree object.
- `CCL:CommandBarView` exposes `dragItem()`.
- `CCL:CommandSelector` exposes `name`, `argColumnEnabled`, and `focusCommand`, plus `addExcludedCategory()`.
- `CCL:Divider` exposes `jump()` and behaves like a skin/native divider proxy from JavaScript.

### 9.9 Host.Engine

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

### 9.10 Host.Settings (Script-Local Key-Value Store)

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

### 9.11 Host.Console

```javascript
Host.Console.writeLine(text)   // Console output (alternative to alert for debugging)
```

### 9.12 Host.Graphics (Image Utility)

```javascript
Host.Graphics.loadImage(path)
Host.Graphics.saveImage(bitmap, path)
Host.Graphics.createBitmap(width, height)   // Returns bitmap with .width/.height ✓
Host.Graphics.copyBitmap(src, dst)
Host.Graphics.createBitmapFilter()
```

> ⚠️ `Host.Graphics` has **no drawing primitives** (no drawRect, drawLine, drawText). It is an image loading/saving utility only. Deep testing of Graphics methods can crash Studio Pro.

### 9.13 Host.Security

```javascript
Host.Security.checkAccess(packageID, featureName)  // Returns 0 (restricted)
```

### 9.14 Host.Interfaces (Complete List — 28)

`IUnknown`, `IClassFactory`, `IComponent`, `IObjectNode`, `IObserver`, `IPersistAttributes`, `ICommandHandler`, `IContextMenuHandler`, `IParamObserver`, `IViewStateHandler`, `ITimerTask`, `IController`, `IScriptComponent`, `IHelpTutorialHandler`, `IPortFilter`, `IBrowserExtension`, `IDocumentTemplateHandler`, `IDocumentEventHandler`, `IEditTask`, `IToolConfiguration`, `IToolMode`, `IToolHelp`, `IToolSet`, `IToolAction`, `IEditHandlerHook`, `IEditHandler`, `IPresetMediator`, `IExtensionHandler`

> All interfaces only expose an `equals()` method. They are COM-style type markers for the `this.interfaces` array.
>
> `IEditTask` is the interface for scripts that run editable actions in Studio Pro. Use it when a script should validate first in `prepareEdit()` and then make changes in `performEdit()`.

### 9.15 Host.Locales

```javascript
Host.Locales.getStrings(key)   // Look up a localized i18n string by key
```

### 9.16 Host.SystemInfo

```javascript
Host.SystemInfo.getLocalTime()   // Returns current local system time object
                                  // (same DateTime object as Host.DateTime — use .toSeconds())
```

### Application Configuration Access

```javascript
var value = Host.studioapp.find("Application").Configuration
  .getValue("Engine.Editing", "midiValuePresentationEnabled");
```

> ⚠️ The configuration object is reachable, but section and key names are not
> documented. Treat them as exploratory lookups and verify them by probing.

### 9.17 Host.Signals.postMessage

```javascript
Host.Signals.postMessage(/* args */)   // Exposed API, but tested as a silent no-op
```

> ⚠️ `postMessage()` is unclear. Tested in `EditTask`, `FrameworkService`, `MusicEdit`, and list-observer contexts; it returned `undefined` every time and never triggered `notify()`. Prefer `Host.Signals.signal()` for cross-script messaging.

### 9.18 Host.FileTypes

```javascript
Host.FileTypes.registerFileType(/* args */)              // Register a custom file type
Host.FileTypes.getFileTypeByExtension(ext)               // Look up type by file extension
Host.FileTypes.getFileTypeByMimeType(mimeType)           // Look up type by MIME type
Host.FileTypes.registerHandler(fileType, handler)        // Register a file handler
Host.FileTypes.unregisterHandler(fileType, handler)      // Unregister a file handler
```

### 9.19 Host.GUI.Help (Tutorial System)

```javascript
Host.GUI.Help.alignActiveTutorial()      // Align the active tutorial overlay
Host.GUI.Help.centerActiveTutorial()     // Center the active tutorial overlay
Host.GUI.Help.focusActiveTutorial()      // Focus the active tutorial overlay
Host.GUI.Help.highlightControl(control)  // Highlight a UI control
Host.GUI.Help.discardHighlights()        // Remove all highlights
Host.GUI.Help.modifyHighlights(/* */)   // Modify existing highlights
Host.GUI.Help.dimAllWindows()            // Dim all windows (tutorial focus effect)
```

### 9.20 Host.Settings — Additional Method

```javascript
Host.Settings.sleep(ms)   // Thread sleep in milliseconds
```

> ⚠️ `sleep()` may block the UI thread. Use with caution and only for short durations.

### 9.20 Script Instance (`this`) — __userdata

```javascript
this.__userdata   // Undocumented userdata object on the script instance
                  // Purpose unclear — empty prototype chain
```

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
| `"loop"` | Loop enabled (0/1) |
| `"loopEnd"` | Loop end in beats |
| `"loopLength"` | Loop length in beats (derived) |
| `"loopStart"` | Loop start in beats |
| `"precount"` | Precount enabled (0/1) |
| `"punchIn"` | Punch in (0/1) |
| `"punchOut"` | Punch out (0/1) |
| `"record"` | Recording state (0/1) |
| `"tempo"` | BPM value |

**Read-only parameters:**

| Name | Description |
|---|---|
| `"primaryTime"` | Current cursor position |
| `"rewind"` | Rewind state |
| `"start"` | Transport start state |
| `"stop"` | Transport stop state |

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

**Additional confirmed `Host:PresetParam` methods:**
- `setValue(val)`
- `fromString(text)`
- `setNormalized(value)`
- `getNormalized()`
- `setCurve(value)`
- `isType()`
- `setSignalAlways(value)`

### 11.3 List View (Host:ListViewModel)

**Instantiate the list model:**
```javascript
var list = Host.Classes.createInstance("Host:ListViewModel");
```

**Define columns:** `list.columns.addColumn(width, title, field, columnWidth, flags);`
**Create/populate items:**
```javascript
var item = list.newItem(id);
item.details.myField = "value";  // 'myField' matches column 'field'
list.addItem(item);
list.changed();  // Refresh UI
```

**Key properties/methods:**
- `list.itemCount`
- `list.getItem(index)`
- `list.getFocusItem()`
- `list.getSelectedItems()` — iterate with `.newIterator()`
- `list.itemView.setFocusItem(index, scroll)`
- `list.doPopup()`
- `list.addTitleSorter()`
- `list.addDetailSorter()`

**Observe changes:**
```javascript
Host.Signals.advise(list, this);
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

| Element | Description | Confirmed `options` / style tokens |
|---|---|---|
| `<Form>` | Individual dialog definition. Attributes: `name` (required), `title` (required). | `windowstyle=("dialogstyle", "sizable", "restorepos", "restoresize", "titlebar", "maximize", "inflate", "center", "pluginhost")` |
| `<Forms>` | Required. Container for `<Form>` dialogs. | - |
| `<Resources>` | Top-level container for reusable named assets. See Section 12.21. | - |
| `<Styles>` | Optional. Custom style definitions (fonts, colors). See Section 12.10. | - |

### 12.2 Confirmed Working Elements

| Element | Description | Confirmed Attributes | Binds To | Confirmed `options` Values |
|---|---|---|---|---|
| `<Align>` | Style helper for text alignment inside styles | `name`, `align` | `Style` definitions | `"left"`, `"center"`, `"right"`, `"top"`, `"bottom"` |
| `<Button>` | Push button (custom actions) | `name`, `title`, `width`, `height`, `tooltip` | `addInteger(0, 1, "name")` | `"transparent"` |
| `<ButtonGroup>` | Groups momentary buttons | `name` | Multiple `addInteger` | - |
| `<CheckBox>` | Independent on/off toggle | `name`, `value`, `title` | `addInteger(0, 1, "name")` | - |
| `<ColorBox>` | Color picker (requires nested SelectBox) | `name`, `width`, `height` | `addColor` | - |
| `<ComboBox>` | Dropdown selector | `name`, `style` | `addList` (populate via JS) | - |
| `<DialogGroup>` | Creates rounded background panel | `options` | - | `"primary"`, `"secondary"` |
| `<Divider>` | Visible divider line | `name`, `width`, `height`, `style` | - | - |
| `<EditBox>` | Text / number input | `name`, `width`, `height`, `options`, `multiline`, `style`, `tooltip` | `addString`, `addInteger`, `addFloat` | `"password"`, `"focus"`, `"return"`, `"transparent"`, `"immediate"`, `"multiline"` |
| `<Horizontal>` | Horizontal layout container | `spacing`, `margin`, `attach` | - | - |
| `<Image>` | Named image resource stored inside `<Resources>` | `name`, `url` | Referenced by `ImageView` | - |
| `<ImageView>` | Displays a named image resource | `image`, `width`, `height`, `attach`, `tooltip` | - | - |
| `<Knob>` | Rotary control | `name`, `width`, `height` | `addInteger`, `addFloat` | - |
| `<Label>` | Static text label | `title`, `name`, `style` | - | - |
| `<ListView>` | Table-style list | `name`, `width`, `height`, `options`, `scrolloptions` | `Host:ListViewModel` | `"header"`, `"selection"`, `"swallowalphachars"`|
| `<RadioButton>` | Mutually exclusive selector (grouped by `name`) | `name`, `value`, `title` | `addInteger` | - |
| `<SelectBox>` | Dropdown selector (taller than ComboBox) | `name`, `options` | `addList` | `"border"`, `"transparent"`, `"hidetext"`, `"hidefocus"`, `"hidebutton"`, `"trailingbutton"`, `"nowheel"` |
| `<Slider>` | Horizontal or vertical slider | `name`, `width`, `height`, `options` | `addInteger`, `addFloat` | `"horizontal"`, `"vertical"` |
| `<Space>` | Layout spacer | `width`, `height` | - | - |
| `<TabView>` | Visible tab/view container | `name`, `width`, `height` | - | - |
| `<Table>` | Container-style layout element | `name`, `width`, `height` | - | - |
| `<TextBox>` | Display-only text field | `name`, `width`, `height`, `style` | `addString` | `multiline`, `fittext` |
| `<ToolButton>` | Small visible tool-style button | `name`, `title`, `width`, `height` | `addInteger(0, 1, "name")` | - |
| `<Toggle>` | Toggle button (only inside ToggleGroup) | `name`, `title` | `addInteger(0, 1, "name")` | - |
| `<ToggleGroup>` | Groups toggle buttons | `name`, `attach` | Multiple `addInteger(0,1,"name")` | - |
| `<ValueBox>` | Editable value field | `name`, `width`, `height` | `addString`, `addInteger`, `addFloat` | - |
| `<Vertical>` | Vertical layout container | `spacing`, `margin`, `attach` | - | - |

> 📖 `scrolloptions` Used to add scrollbars to supported elements, `vertical`, `horizontal`, `autohide`, `autohideboth`, `border`, `transparent`


<details>
<summary>Probed / Unconfirmed elements and options:</summary>

These are elements and options discovered or probed in tests that are not yet fully confirmed as stable standalone examples or have unknown use cases.

| Element | Description | Confirmed Attributes | Binds To | Confirmed `options` Values |
|---|---|---|---|---|
| `<AlignView>` | Context-menu passthrough / layout anchoring | `attach`, `options` | - | `"passcontextmenu"` |
| `<ActivityIndicator>` | Activity indicator | `width`, `height` | - | - |
| `<CommandBarView>` | Command bar container | `name`, `height`, `attach`, `style` | - | `"horizontal vertical"` |
| `<Control>` | Empty shell/container | `name`, `width`, `height` | - | - |
| `<Heading>` | Title-style text element | `title`, `name`, `width`, `height` | - | - |
| `<Link>` | Clickable folder-link style control | `name`, `title`, `attach` | - | - |
| `<ProgressBar>` | Progress indicator | `name`, `width`, `height` | - | - |
| `<RangeSlider>` | Dual-handle slider variant | `name`, `width`, `height`, `min`, `max`, `value` | `addInteger`, `addFloat` | `"horizontal"`, `"vertical"` |
| `<Scrollbar>` | Standalone scrollbar control | `name`, `width`, `height` | `addInteger` | `"vertical"`, `"horizontal"` |
| `<ScrollView>` | Scrollable view container / scroll chrome host | `name`, `width`, `height`, `options`, `hscroll.style` | - | `"canscrollh"`, `"autobuttonsh"`, `"extendtarget"`, `"noscreenscroll"` |
| `<Table>` | Generic layout container | `name`, `width`, `height` | - | - |
| `<TreeView>` | Visible tree-style view | `name`, `width`, `height`, `options`, `scrolloptions` | - | `"noroot"`, `"noicons"`, `"nodrag"`, `"selectfullwidth"`, `"selection"`, `"exclusive"`, `"autoexpand"`, `"swallowalphachars"` |
| `<TriggerView>` | Click/gesture wrapper | `style`, `gesturepriority`, `attach` | - | - |
| `<View>` | Empty shell/container | `name`, `width`, `height` | - | - |
| `<WebView>` | Visible blank web surface | `name`, `width`, `height` | - | - |

> ⚠️ **`<ActivityIndicator>`** Renders a visual indicator. Not script-instantiable from current inspection. `CCL:ActivityIndicator` and `Host:ActivityIndicator` do not resolve, so there is no meaningful JavaScript surface to dump from the control itself.Unknown use case.  
> ⚠️ **`<RangeSlider>`** Every test rendered a single-handle slider. A true dual-handle range slider render has not been acheived yet.   
> ⚠️ **`<Scrollbar>`** Works as a standalone visible control when bound to an integer parameter, but it did not expose a script-visible change event path in the binding tests. Unknown use case.   
> ⚠️ **`<ScrollView>`** Remains opaque and does not provide a useful direct JS-visible control surface. Unknown use case.  
> ⚠️ **`<TreeView>`** Remains opaque and does not provide a useful direct JS-visible control surface. Unknown use case.    
> ⚠️ **`<Table>`** Can host nested children and stacks them vertically by default, similar to `DialogGroup`. No binding confirmed. Unknown use case.   


</details>


### 12.3 (Layout) Vertical & Horizontal

`Vertical` and `Horizontal` are layout containers.

```xml
<Vertical spacing="8" margin="10" attach="left right">
  <!-- children stacked vertically -->
</Vertical>

<Horizontal spacing="4" margin="5" attach="left right">
  <!-- children arranged horizontally -->
</Horizontal>
```

⚠️ **Layout padding quirk:** The topmost `<Horizontal>` or `<Vertical>` container directly inside `<Form>` must have `margin="0"` to eliminate default dialog padding. Without it, a visible gap appears between your DialogGroups and the dialog button edges. Example:

> ```xml
> <Form name="MyDialog" title="My Dialog">
>     <Horizontal margin="0">  ← required for button alignment
>         <DialogGroup>...</DialogGroup>
>         <DialogGroup>...</DialogGroup>
>     </Horizontal>
> </Form>
> ```


### 12.4 ColorBox

`ColorBox` is a compound color picker that requires a nested `SelectBox` to render its popup and bound color value.

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

### 12.5 RadioButton

`RadioButton` selector. 

 Grouping elements with the same `name` for a mutually exclusive group example:

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

### 12.6 ToggleGroup

`ToggleGroup` provides grouped toggle buttons.

Grouping with manual exclusivity handled in script example:

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

> ⚠️ **Horizontal Toggles:** Wrap `<ToggleGroup>` in `<Horizontal spacing="0">` to render horizontally.

### 12.7 Button

`Button` is a momentary action trigger.

Custom Reset Defaults action button example:

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

> ⚠️ **Button behavior:** Click detected via `IParamObserver.paramChanged()`. When clicked, parameter value changes to 1. Must reset to 0 in `paramChanged` to allow re-triggering.


### 12.8 Slider

`Slider` is a slider control.

Slider with shared name unit label example:

```xml
<Horizontal spacing="2" attach="left right">
  <Slider  name="TimeSlider" width="100" height="20" options="horizontal"/>
  <EditBox name="TimeSlider" width="45" height="20"/>
  <Label title="ms"/>
</Horizontal>
```

```javascript
this.TimeSlider = params.addFloat(-1, 1, "TimeSlider");
this.TimeSlider.value = -0.25;
```

> 📖 Slider `height` appears to alter handle size. Recommended: `20`. Default is `16`.

### 12.9 Knob Element

`Knob` is a rotary control.

Knob with unit label and paramChanged logic example:

```xml
<Vertical spacing="5">
  <Knob    name="MyKnob" width="60" height="60"/>
  <ValueBox name="MyKnobDisplay" width="60" height="20"/>
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

> ⚠️ Bipolar/center-fill is **not possible** — no attribute achieves this. Recommended sizes: Small=40×40, Medium=60×60, Large=80×80.

### 12.10 Styles System

`Styles` lets you define reusable skin styling rules for controls, including colors and fonts.

```xml
<Styles>
  <Style name="MyEditBox" inherit="Standard.AddIn.EditBox">
    <Color name="backcolor"  color="#1A1A2E"/>
    <Color name="textcolor"  color="#FFFFFF"/>
    <Font  name="textfont"   themeid="PresonusUI" size="13" bold="true"/>
  </Style>
</Styles>
```

> ⚠️ **Style Requirement:** Requires top level `Styles` element.   
📖 **Style properties:** `backcolor` (on focus/press), `textcolor`, font `size`, style `inherit`.   
📖 **Align helper:** Use `<Align name="textalign" align="left|center|right|top|bottom|..."/>` inside a `Style` to control text alignment on supported elements. Combined values like `align="right top"` are supported.


### 12.11 TabView (Multi-Page Container)

`TabView` is a multi-page container.

Multi-page with varying container types example:

```xml
<TabView name="MainTabs" width="360" height="220">
  <DialogGroup title="Page One">
    <Label title="Page One Content"/>
    <EditBox name="PageOneText" width="180" height="22"/>
  </DialogGroup>
  <Control title="Page Two" width="340" height="180">
    <Label title="Page Two Content"/>
    <CheckBox name="PageTwoCheck" value="0" title="Page Two Check"/>
  </Control>
  <View title="Page Three" width="340" height="180">
    <Label title="Page Three Content"/>
    <Knob name="PageThreeKnob" width="60" height="60"/>
  </View>
</TabView>
```

> 📖 **Page container types:** `DialogGroup`, `Control`, `View`, `Table`   
📖 **Tab labels:** Use the child page container `title`  
📖 **Overflow behavior:** Automatically adds a dropdown menu when the tab strip exceeds the available width.

### 12.12 Divider (Separator Control)

`Divider` is a visible separator control with handle **(unknown)**.

Divider style and default dividing behavior examples:

```xml
<Styles>
  <Style name="DividerBlue">
    <Property id="backcolor" value="#336699"/>
  </Style>
</Styles>

<Form name="DividerExample" title="Divider Example">
  <DialogGroup title="Divider Example" width="240" height="90">
    <Vertical spacing="8" margin="8">
      <Label title="Above"/>
      <Divider name="DividerBlue" height="4"/>
      <Label title="Below"/>
    </Vertical>
  </DialogGroup>
</Form>
```

> ⚠️ In the default skin, a small center handle-like visual appears; this looks like the collapsible section handles used in native Studio Pro panels (Inspector), but we have not yet figured out how to make it function as a collapsible handle in a custom script layout.


### 12.13 Align

`Align` is a style helper that sets text alignment on controls that support it.

```xml
<Styles>
  <Style name="AlignCenterEditBox" inherit="Standard.AddIn.EditBox">
    <Align name="textalign" align="center"/>
  </Style>
  <Style name="AlignRightTopEditBox" inherit="Standard.AddIn.EditBox">
    <Align name="textalign" align="right top"/>
  </Style>
</Styles>
```

```javascript
this.CenterEdit = context.parameters.addString("CenterEdit");
this.CenterEdit.value = "Centered text";
```

> 📖 **Related binding reference:** `Align` is used inside `<Style>` definitions. For the parameter-side population patterns used by the tested controls, see [Section 11.2 ParamList](#112-system-2-cclparamlist-persistent-dialog--panel).   
> 📖 **Applicable Elements:** Confirmed working for `EditBox`, `ValueBox`, `TextBox`, `SelectBox`, and `ComboBox`.  
> 📖 **Combined Attributes:** Accepts more than one token in the `align` attribute, so you can combine horizontal and vertical alignment in one helper, for example `align="right top"`.


### 12.14 ComboBox

`ComboBox` is a dropdown selector for choosing one item from a list of script-provided values.

It is bound to a `ParamList` list parameter and populated from script with `appendString()`.

```xml
<ComboBox name="Choice" width="180" style="MyComboBox"/>
```

```javascript
this.Choice = context.parameters.addList("Choice");
this.Choice.appendString("Option 1");
this.Choice.appendString("Option 2");
this.Choice.value = 0;
```

> 📖 **Population reference:** See [Section 11.2 ParamList](#112-system-2-cclparamlist-persistent-dialog--panel) for `addList()` and `appendString()`.

### 12.15 SelectBox

`SelectBox` is a taller dropdown selector than `ComboBox`, intended for list-style selection in dialogs.

It is also bound to a `ParamList` list parameter and populated from script with `appendString()`.

```xml
<SelectBox name="Choice" width="180" options="border"/>
```

```javascript
this.Choice = context.parameters.addList("Choice");
this.Choice.appendString("Option 1");
this.Choice.appendString("Option 2");
this.Choice.value = 0;
```

> 📖 **Population reference:** See [Section 11.2 ParamList](#112-system-2-cclparamlist-persistent-dialog--panel) for `addList()` and `appendString()`.

### 12.16 TextBox

`TextBox` is an unedittable display field.

String value from script displayed in TextBox example:

```xml
<TextBox name="DisplayText" width="260" height="48"/>
```

```javascript
this.DisplayText = context.parameters.addString("DisplayText");
this.DisplayText.value = "";
```

> 📖 **Prefill note:** TextBox can be prefilled by setting the parameter `.value` before the dialog opens.   
> ⚠️ **TextBox styling:** Having `textcolor` with no defined `backcolor` will default to white background.  
> ⚠️ **Visibility alignment:** For multiline `TextBox` controls, apply a style alignment such as `<Align name="textalign" align="left top"/>`. Without explicit style alignment, default centering can push top lines partly out of the visible bounds.

### 12.17 ListView

`ListView` is a table-style UI element that displays rows from a `Host:ListViewModel`.

```xml
<ListView name="list" height="400" width="500"/>
```

> 📖 The `name` attribute binds to the `this.list` property on the controller scope. See [11.3 List View (Host:ListViewModel)](#113-list-view-hostlistviewmodel)    
> 📖 **ScrollBar Rendering:** Render scrollbars using the `scrolloptions` attribute

### 12.18 ValueBox 

`ValueBox` is an editable value field that can accept typed values and can be written back from script.

```xml
<ValueBox name="ValueText" width="140" height="22"/>
```

**Prefill:** ValueBox text can be prefilled by setting the parameter `.value` before the dialog opens.

```javascript
this.ValueText = context.parameters.addString("ValueText");
this.ValueText.value = "";
```


**Display-vs-storage translation:** `ValueBox` can show a user-friendly display unit while the script stores and uses a different underlying unit. Such as storing crossfade length in seconds internally, but displaying milliseconds in the UI.

```javascript
function displayMs(valueSeconds) {
  return Math.round(Math.max(0, Number(valueSeconds || 0)) * 1000);
}

function storageSeconds(valueMs) {
  return Math.max(0, Number(valueMs || 0)) / 1000;
}

// Example:
// UI shows: 20 ms
// Script stores: 0.02
```

> 📖 **Formatting note:** The label next to the field can remain the visible unit marker, while the script handles translation before command execution.

### 12.19 EditBox 

`EditBox` is an edittable text field that accepts typed text and commits its value back to script.

```xml
<EditBox name="InputText" width="180" height="22"/>
```

```javascript
this.InputText = context.parameters.addString("InputText");
this.InputText.value = "";
```
> 📖 **Prefill note:** EditBox text can be prefilled by setting the parameter `.value` before the dialog opens.   
> ⚠️ **EditBox `multiline`:** Requires parameter binding and a defined `height` value to render as multi-line.  
> ⚠️ **Visibility alignment:** For multiline `EditBox` controls, apply a style alignment such as `<Align name="textalign" align="left top"/>`. Without explicit style alignment, default centering can push top lines partly out of the visible bounds.  
> 📖 **Edit/Focus state scrollbar:** Use `options="multiline vertical"` with long overflow content. Scrollbar is only visible in edit/focus state.  

### 12.20 DialogGroup (Titled Container)

`DialogGroup` is a visible container for housing other elements.

```xml
<Form name="DialogGroupExample" title="DialogGroup Example">
  <DialogGroup title="Value Fields" width="220" height="100">
    <Vertical margin="8" spacing="4">
      <Label title="ValueBox and TextBox"/>
      <ValueBox name="ValueText" width="140" height="22"/>
      <TextBox name="DisplayText" width="180" height="22"/>
    </Vertical>
  </DialogGroup>
</Form>
```

> 📖 **Centered Label:** The title/header is centered automatically when the `title` attribute is set.

### 12.21 Space

`Space` is a lightweight layout spacer used to add fixed blank area between controls.

```xml
<Vertical margin="0" spacing="8">
  <Label title="Top Control"/>
  <Space height="4"/>
  <Label title="Bottom Control"/>
</Vertical>
```

### 12.22 Resources

`Resources` is a top-level skin block used to define reusable named assets for the form.

```xml
<Skin>
  <Resources>
    <Image name="LinearPreview" url="images/linear.png"/>
  </Resources>
</Skin>
```

> 📖 **Top-level placement:** `Resources` sits directly under `<Skin>`, alongside `<Styles>` and `<Forms>`.   
> 📖 **Usage:** Declare named images and reference them from `ImageView`.

### 12.23 Image Resource + ImageView

`ImageView` displays a named image resource defined in the form `Resources` block.

```xml
<Resources>
  <Image name="LinearPreview" url="images/linear.png"/>
</Resources>

<Vertical spacing="4">
  <ImageView image="LinearPreview" width="48" height="48" tooltip="Linear"/>
</Vertical>
```

> 📖 **Nested behavior:** `ImageView` can sit inside a container like a normal visual control.

## 13. File I/O

### 13.1 Host.Url (Path Construction)

```javascript
var path = Host.Url("local://$USERCONTENT/folder/file.txt");
// $USERCONTENT:
//   Windows: C:\Users\[YourUsername]\Documents\Studio One
//   macOS:   ~/Documents/Studio One
//   Windows: C:\Users\[YourUsername]\Documents\Studio Pro
//   macOS:   ~/Documents/Studio Pro

path.ascend();               // Navigate up one directory
path.descend("subfolder");   // Navigate into subdirectory


### 13.2 Host.IO

**Read text file:**
```javascript
var file = Host.IO.openTextFile(path);
if (file) {
  while (!file.endOfStream) {
    var line = file.readLine();
  }
  file.close();
}
```

**Write JSON file (see [Chord Mapping example](#17.2-chord-mapping-complete-working-example)):**
```javascript
var path = Host.Url("local://$USERCONTENT/file_name.json");
var file = Host.IO.createTextFile(path);
if (file) {
  file.writeLine(JSON.stringify(data, null, 2));
  file.close();
}
```



**File operations:**
```javascript
Host.IO.File(path).exists()     // Boolean
Host.IO.File(path).copyTo(dest) // Copy
Host.IO.File(path).remove()     // Delete
```

**Find files matching pattern:**
```javascript
var it = Host.IO.findFiles(folder, "*.xml");
while (!it.done()) {
  var file = it.next();
  var name = file.name;
}
```

**Base64 encoding/decoding:**
```javascript
Host.IO.toBase64(data)
Host.IO.fromBase64(data)
```

**Package operations:**
```javascript
Host.IO.openPackage(path)   // null for non-packages
Host.IO.createPackage(path) // Returns package object
```

**JSON loading:**
```javascript
var data = Host.IO.loadJsonFile(Host.Url("local://$USERCONTENT/myfile.json"));
// Native JS object - fast C++ parsing
```

**XML tree parsing:**
```javascript
var tree = Host.IO.XmlTree(path);
var root = tree.getRoot(); // or tree.root
```


**XmlTree node API:**

```javascript
// Node properties (all strings unless noted):
node.name                          // Tag name
node.parent                        // Parent node object
node.text                          // Text content
node.comment                       // Comment content

// Node methods:
node.newNode()                     // Create a new child node
node.setAttribute(name, value)     // Set an attribute
node.getAttribute(name)            // Get attribute value (string)
node.addChild(node)                // Add a child node
node.findNode(name)                // Find first child with matching tag name
node.newIterator()                 // Create an iterator over child nodes
```

**XmlTree usage example:**

```javascript
// Load DAW config:
var tree = Host.IO.XmlTree(Host.Url("local://$APPCONFIG/User.options"));
var root = tree.getRoot();
var child = root.findNode("SomeSection");
var val   = child.getAttribute("someAttr");

// Walk all child nodes:
var it = root.newIterator();
while (!it.done()) {
  var node = it.next();
  Host.Console.writeLine(node.name);
}
```

> ⚠️ **Host.Url display quirk:** `path.string` returns `undefined` and `String(path)` returns `"[object Object]"`. This is cosmetic only — the path object works correctly when passed to `Host.IO` methods. Hardcode path strings for logging (e.g., `"local://$USERCONTENT/file.json"`).

```javascript
// Development file path utility:
Host.IO.getDevelopmentFileLocation()   // Returns path for development/debug use
```

### 13.3 Platform Detection

```javascript
Host.getPlatform()   // Returns "win" or "mac"
```

### 13.4 Date / Time

```javascript
var end = Host.DateTime("2026/01/01");     // Parse date string
var now = Host.SystemInfo.getLocalTime();  // Current local time
end.toSeconds() < now.toSeconds()         // Compare times
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

## 15. Complete API Index

### 15.1 Host.GUI Namespaces

`Constants`, `Commands`, `Themes`, `Desktop`, `Help`, `Configuration`, `Clipboard`, `Alerts`

**Host.GUI.Desktop:** `closeModalWindows()`, `closeTopModal()`, `getApplicationWindow()`

**Host.GUI.Help (Tutorial System):** `alignActiveTutorial()`, `centerActiveTutorial()`, `focusActiveTutorial()`, `highlightControl()`, `discardHighlights()`, `modifyHighlights()`, `dimAllWindows()`

### 15.2 Host.Engine Properties

`TrackFormats`, `TrackColorPalette`, `TrackIcons`, `MediaClips`, `Speakers`, `CrossFadeFinder`, `createFormatter(name)`, `createTrackFormatWithPort(type, port)`

### 15.3 Host Top-Level Summary

| Namespace | Key Methods / Properties |
|---|---|
| `Host.Signals` | `advise()`, `unadvise()`, `signal()`, `postMessage()` |
| `Host.Locales` | `getStrings(key)` |
| `Host.SystemInfo` | `getLocalTime()` |
| `Host.IO` | `openTextFile()`, `createTextFile()`, `File()`, `findFiles()`, `loadJsonFile()`, `XmlTree()`, `getDevelopmentFileLocation()`, `toBase64()`, `fromBase64()`, `openPackage()`, `createPackage()` |
| `Host.FileTypes` | `registerFileType()`, `getFileTypeByExtension()`, `getFileTypeByMimeType()`, `registerHandler()`, `unregisterHandler()` |
| `Host.Settings` | `getAttributes()`, `sleep(ms)` |

### 15.4 context.functions — Full Method List

```
beginMultiple, endMultiple, setJournalEnabled, isJournalEnabled,
insertEvent, deleteEvent, moveEvent, resizeEvent,
modifyPitch, modifyVelocity, muteEvent,
freezeVelocity, freezePitch, freezeQuantize,
quantize, quantizeEvent, setLyrics, createEvent,
renameEvent, colorizeEvent, removeTrack,
createFadeIn, createFadeOut, createCrossFade,
newMusicalTime, newMediaTime,
root (object), executeImmediately (flag)
```

**Root-created function families:**

Some edit functions are exposed through root-specific function families created with `root.createFunctions("FamilyName")`.

```javascript
var root = audioEvent.getRoot();
var audioFunctions = root.createFunctions("AudioFunctions");
audioFunctions.createCrossFades(events, fadeLengthSeconds);
```

| Family | Confirmed Methods |
|---|---|
| `AudioFunctions` | `createCrossFades(events, fadeLengthSeconds)` |
| `MusicPartFunctions` | `createPitchNameList(track)` |

> 📖 **Context note:** `createFunctions(...)` is root dependent. Use the root belonging to the event, region, or editor object you intend to operate on.  
> 📖 **Crossfade note:** `context.functions.createCrossFade(leftEvent, rightEvent)` is the singular overlap-based method. `AudioFunctions.createCrossFades(events, fadeLengthSeconds)` is the plural timed method used when explicit crossfade length is needed.

### 15.5 Iterator — Full Method List

```
done(), first(), last(), next(), previous()
```

### 15.6 note.startTime — Full Method List

```
as()          → seconds as plain number
clone()       → valid time object copy
convert()     → undefined
toMusicalTime() → undefined
```

### 15.7 Editor Object — Key Confirmed Working Methods

```
getItemType(note)           → "NoteEvent"
canSelect(note)             → 1
isSameItem(n1, n2)          → 1 if same
deleteItem(note)            → deletes note
editItem(note)              → 0 (success)
pixelToTime(pixel)          → time-like object
pixelToVertical(pixel)      → coordinate number
createSelectFunctions(fn)   → selectFunctions object
showSelection(bool)
split(event, time)
sizeLeft(event, size)
sizeRight(event, size)
newTimeSegment(time)
select(note), unselect(note)
```

### 15.8 Color Utilities

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

### 15.9 Application Configuration Access

```javascript
var value = Host.studioapp.find("Application").Configuration
  .getValue("Engine.Editing", "midiValuePresentationEnabled");
```

### 15.10 Pitch Name List

```javascript
var musicPartFunctions = context.editor.activeRegion.getRoot()
  .createFunctions("MusicPartFunctions");
var nameList = musicPartFunctions.createPitchNameList(track);
for (var i = 127; i >= 0; i--) {
  var name = nameList.getPitchName(i).trim();
  if (name.length > 0) { /* pitch i has a named keyswitch/articulation */ }
}
```

### 15.11 Value Conversions

Utility functions for converting between the value representations used by the API and human-readable equivalents. More conversions to be documented as the API is further explored.

**dB ↔ float (gain/volume)** — `channel.volume` and similar properties use a linear float, not dB:

```javascript
function dbToFloat(db) { return Math.pow(10, parseFloat(db) / 20); }
function floatToDb(f)  { return (Math.log(parseFloat(f)) / Math.LN10) * 20; }
```

---

## 16. Known Limitations & Dead Ends

### 16.1 Confirmed Dead Ends (Re-Investigate If You'd Like)

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
| `Host.Signals.postMessage()` | Returns undefined and does not notify in tested EditTask, FrameworkService, MusicEdit, or list-observer contexts |
| `note.clone()` + `fn.insertEvent(note)` | Clone properties are read-only; must use `insertEvent(region, note)` |
| Knob center/bipolar fill | No tested attribute achieves this |

### 16.2 Confirmed Limitations

| Limitation | Detail |
|---|---|
| **No automation access** | Automation tracks cannot be scripted |
| **No FX chain access** | `channel.effects/inserts/plugins` are all undefined |
| **No MIDI CC iteration** | MIDI CC / controller data did not appear in `context.iterator`, `editor.selection.newIterator()`, or `activeRegion.createSequenceIterator()` tests; only note events were exposed |
| **Selection is not undoable** | Disable journaling before any selection operations |
| **Piano editor quantize UI** | Read-only via `context.editor.quantize` — cannot change UI |
| **context.iterator properties** | May return undefined in some editor contexts |
| **Note properties are read-only** | Only `note.startTime.seconds` is confirmed writable |
| **No event listener / polling** | Cannot monitor DAW state changes; must re-run script |
| **Bar Offset is visual only** | `activeRegion.start` doesn't consider the Bar Offset setting |
| **Scripts folder (macOS)** | `/Applications/Studio Pro 8.app/Contents/Scripts/` — not `~/Library/...` |
| **Chord Events** | They are not stored as XML nodes in the `.song` file.

### 16.3 Known Gaps

- Complete `skin.xml` element and attribute reference (Dual handle range sliders, EditBox / TextBox scrollbars, etc.)
- `Host.Signals.postMessage()` caller semantics beyond `signal()`-style dispatch are unresolved, but the current test evidence suggests it is inert in normal script contexts
- `Host.studioapp.find("Application").Configuration.getValue(...)` works, but the section/key namespaces are still exploratory and need more cataloging

### 16.4 Debugging Utilities

**Prototype chain introspection** — useful for discovering what properties and methods an unknown API object exposes at runtime:

```javascript
function getAllPropertyNames(obj) {
  var props = [];
  do { props = props.concat(Object.getOwnPropertyNames(obj)); }
  while (obj = Object.getPrototypeOf(obj));
  Host.GUI.alert(props.join('\r\n'));
}
```

---

## 17. Examples

### [17.1 Flam Tool — Complete Working Example](scripts/packages/flam-tool/)

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

### [17.2 Chord Mapping — Complete Working Example](scripts/packages/chord-mapping/)

The **Chord Mapping** script in this repository is a complete, working example demonstrating:

- Chord event scraping from the Chord Track
- JSON file output using `Host.IO.createTextFile()` and `JSON.stringify()`
- Data extraction from chord events (name, type, root/bass pitches, timing)
- File I/O operations with `Host.Url()` path construction

**Source code:** [`scripts/sources/chord-mapping-source/`](scripts/sources/chord-mapping-source/)

**Files:**
- [`classfactory.xml`](scripts/sources/chord-mapping-source/classfactory.xml)
- [`metainfo.xml`](scripts/sources/chord-mapping-source/metainfo.xml)
- [`main.js`](scripts/sources/chord-mapping-source/main.js)

**Key features:**
- Processes selected chord events in EventEdit context
- Saves chord data to `Chord_Mapping.json` in `local://$USERCONTENT/`
- Creates both JSON and text output files
- Demonstrates proper error handling for file operations

### [17.3 Multi Script Demo — Complete Working Example](scripts/packages/multi-script-demo/)

The **Multi Script Demo** package in this repository is a complete, working example demonstrating:

- Multiple `<ScriptClass>` entries in one `classfactory.xml`
- Separate `sourceFile` values for `ScriptA.js` and `ScriptB.js`
- A shared `skin.xml` with one `<Form>` per script
- A valid `metainfo.xml` using `Package:SkinFile`
- A real UI flow where each script opens its own dialog before running

**Source code:** [`scripts/sources/multi-script-demo-source/`](scripts/sources/multi-script-demo-source/)

**Files:**
- [`classfactory.xml`](scripts/sources/multi-script-demo-source/classfactory.xml)
- [`metainfo.xml`](scripts/sources/multi-script-demo-source/metainfo.xml)
- [`ScriptA.js`](scripts/sources/multi-script-demo-source/ScriptA.js)
- [`ScriptB.js`](scripts/sources/multi-script-demo-source/ScriptB.js)
- [`skin/skin.xml`](scripts/sources/multi-script-demo-source/skin/skin.xml)

**Key features:**
- Shows how Studio Pro loads more than one script from a single package
- Uses distinct entry points for each script
- Opens separate dialogs for Script A and Script B
- Shows the shared dialog structure used by multi-script packages
- Matches the package layout currently deployed for testing

### [17.4 Crossfade Tool — Complete Working Example](scripts/packages/crossfade-tool/)

The **Crossfade Tool** package in this repository is a complete, working example demonstrating:

- `AudioEdit` `EditTask` registration for an audio-event-only workflow
- `skin.xml` with `Resources`, `Image`, `ImageView`, `Space`, `Slider`, `ValueBox`, `CheckBox`, and `RadioButton`
- named image resources displayed through `ImageView`
- grouped `RadioButton` controls used as a visual Type selector
- display-vs-storage translation for millisecond UI values and second-based API values
- `Host.GUI.Commands.interpretCommand("Audio", "Create Crossfades", false, attrs)` with `Length`, `Type`, and `Bend`
- `AudioFunctions.createCrossFades(events, fadeLengthSeconds)` for the actual edit operation

**Source code:** [`scripts/sources/crossfade-tool-source/`](scripts/sources/crossfade-tool-source/)

**Files:**
- [`classfactory.xml`](scripts/sources/crossfade-tool-source/classfactory.xml)
- [`metainfo.xml`](scripts/sources/crossfade-tool-source/metainfo.xml)
- [`main.js`](scripts/sources/crossfade-tool-source/main.js)
- [`skin/skin.xml`](scripts/sources/crossfade-tool-source/skin/skin.xml)
- [`skin/images/linear.png`](scripts/sources/crossfade-tool-source/skin/images/linear.png)
- [`skin/images/logarithmic.png`](scripts/sources/crossfade-tool-source/skin/images/logarithmic.png)
- [`skin/images/exponential.png`](scripts/sources/crossfade-tool-source/skin/images/exponential.png)

**Key features:**
- Processes selected audio events in `AudioEdit` context
- Supports Linear, Logarithmic, and Exponential crossfade types
- Supports Bend as a user-facing percentage value
- Supports optional split-duration behavior so the entered duration can be divided evenly between both clips
- Demonstrates how command arguments and edit functions can be combined in one script

---

## 18. Community Resources & Sources


| Resource | URL |
|---|---|
| Studio One Toolbox | https://s1toolbox.com/navigationessentials
| GitHub — DjFix functions helper | https://github.com/DjFix/studioone_functions |
| KVR Audio Forum | https://www.kvraudio.com/forum/viewtopic.php?t=506195 |
| audiosex.pro Forum| https://audiosex.pro/threads/how-do-you-install-studio-one-x.30244/ |

### References Used
- **Navigation Essentials 2.0.1** (Lukas Ruschitzka) — track selection, colorize, piano editor tasks
- **Studio One X v2.6.1** (Narech Kontcell) (`studioonex.package`) — extensive source reference; reverse engineered via PACKAGEF extraction
- **Studio One Scripts.exe** (LawrenceF:**KVR**) - referenced source files
- **ChordstoBiabTextFile** (crossovercable:**KVR**, tonedef71:**KVR**) - reference source files for chord events

---

*Community-compiled, not affiliated with Fender or PreSonus*
