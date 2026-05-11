# Studio Pro Scripting API Reference

**Platform:** Fender Studio Pro / PreSonus Studio One

> ⚠️ **Disclaimer:** Fender/PreSonus does not provide official public documentation for this API. This reference is entirely community-derived and incomplete. The API is internal and undocumented.

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
10. [Transport Panel Parameters](#10-transport-panel-parameters)
11. [Dialog & UI System](#11-dialog--ui-system)
12. [skin.xml Reference](docs/skinxml-reference/README.md)
13. [File I/O](#13-file-io)
14. [Cross-Script Communication](#14-cross-script-communication)
15. [Utilities & Conversions](#15-utilities--conversions)
16. [Complete API Index](#16-complete-api-index)
17. [Known Limitations & Debugging](#17-known-limitations--debugging)
18. [Examples](#18-examples)
19. [Community Resources & Sources](#19-community-resources--sources)

---

## 1. Package Structure & Deployment

### 1.1 Package Format

A `.package` is the script bundle format used by Studio Pro. It is typically distributed as a ZIP archive renamed with the `.package` extension, with files at the archive root. For development, Studio Pro can also load an unpacked directory with the same structure.

**Required files:**

```
your-script.package (ZIP)
├── metainfo.xml          ← Package metadata
├── classfactory.xml      ← Script registration & entry points
└── scriptname.js             ← Script source (filename can be anything; classfactory.xml points to it)
```

**Optional files:**

```
├── helper.js             ← Loaded via include_file('helper.js')
├── skin/
│   ├── skin.xml          ← Dialog skin definitions (required for custom dialogs)
│   └── images/
│       ├── icon.png      ← Optional image assets
│       └── icon.svg
└── translations/
    └── en.xml            ← i18n strings
```

**Multi-script packages:**

For multi-script packages, the package root uses the same structure. Each `<ScriptClass>` needs a unique `classID`, and `functionName` only needs to name the factory function inside that entry's `sourceFile`. Multiple entries may point at the same `sourceFile` when one JavaScript file exports several factory functions. Shared dialog definitions live in one `skin.xml`, with one `<Form>` per script when dialogs are used. See [18.3 Multi Script Demo](#183-multi-script-demo--complete-working-example) for a working example.

### 1.2 metainfo.xml

Manifest metadata and package identity.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<MetaInformation>
  <Attribute id="Package:ID"      value="com.yourname.scriptname"/> <!-- required for simple command-only packages -->
  <Attribute id="Package:Name"    value="Display Name"/>             <!-- optional metadata -->
  <Attribute id="Package:Version" value="1.0.0"/>                    <!-- optional metadata -->
  <Attribute id="Package:Vendor"  value="Your Name"/>                <!-- optional metadata -->
  <Attribute id="Package:Email"   value="you@example.com"/>          <!-- optional metadata -->
  <Attribute id="Package:SkinFile" value="skin/"/>                   <!-- required when using skin.xml dialogs -->
</MetaInformation>
```

### 1.3 classfactory.xml

Script registration, entry points, and attributes.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ClassFactory>
  <ScriptClass
    classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    metaClassID="{YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY}"
    category="EditTask"
    subCategory="TrackEdit"
    name="My Script Name"
    sourceFile="scriptname.js"
    functionName="createInstance">
    <Attribute id="menuPriority"    value="0"/>
    <Attribute id="commandCategory" value="MyCategory"/>
  </ScriptClass>
</ClassFactory>
```

**Core attributes:**

| Attribute | Description |
|---|---|
| `classID` | Unique GUID — generate with any GUID tool |
| `category` | Script class type |
| `subCategory` | Host context selector |
| `name` | Display name in menus |
| `sourceFile` | JS filename (relative to package root) |
| `functionName` | Function exported by the JS file |

**Optional attributes:**

| ID | Description |
|---|---|
| `arguments` | Comma-separated param names (e.g., `"Volume,Pan"`) |
| `alwaysEnabled` | `"1"` keeps the command enabled regardless of normal `prepareEdit` gating |
| `commandCategory` | Category in macro/key binding system |
| `formName` | User-defined `skin.xml` Form name (for `EditAddIn` panels) |
| `groupName` | Panel group location (e.g., `"Song.AddInPanel"`) |
| `hidden` | `"1"` hides from menus; accessible via command system only |
| `menuGroup` | Group name for menu bar, right-click and action menu categorization. |
| `menuPriority` | Integer sort order; `-1` hides from menu |
| `menuFollow` | `"1"` |
| `metaClassID` | Optional unique GUID for internal metadata binding, such as `ScriptMetaClass` |
| `allowPatternParts` | `"1"` |
| `ignoreAudioEvents` | `"1"` |
| `ignoreEventLock` | `"1"` |
| `ignoreTrackLock` | `"1"` |
| `musicEditorOnly` | `"1"` restricts to music editor context |
| `supportsLauncher` | `"1"` |
| `supportsProject` | `"1"` for project-level operation |
| `useChannelSelection` | `"1"` |
| `useEventSelection` | `"1"` |
| `useLayerSegments` | `"1"` |
| `useTimeSelection` | `"1"` |
| `useTrackSelection` | `"1"` |
| `TrackContextMenu` | `"1"` adds to track right-click menu |
| `TrackSourceContextMenu` | `"1"` |
| `wantAudioParts` | `"1"` to include audio clips in iteration |

**category values:**

| Value | Context |
|---|---|
| `"EditTask"` | Command/action script |
| `"EditAddIn"` | Native add-in panel or toolbar integration |
| `"ExtensionHandler"` | Extension lifecycle handler |
| `"FrameworkService"` | Host-managed service surface, not shown in menus |
| `"Gadget"` | - |

**subCategory values:**

| Value | Context |
|---|---|
| `"AudioEdit"` | Audio editor |
| `"EventEdit"` | Arrangement editor events |
| `"Engine"` | Song add-in toolbar panels |
| `"FrameworkService"` | Host-managed service surface, not shown in menus |
| `"MusicEdit"` | Piano roll / MIDI editor |
| `"MusicPartEdit"` | Instrument Part editor |
| `"Project"` | Project add-in toolbar panels |
| `"ProjectEdit"` | Project-level operations |
| `"Show"` | Show add-in toolbar panels |
| `"ShowEdit"` | Show page operations |
| `"TrackEdit"` | Track operations |

**groupName values:**

| Value | Context |
|---|---|
| `"Song.AddInPanel"` | Song add-in panel strip |
| `"SongOnly.AddInPanel"` | Arrangement-only add-in panel strip |
| `"MusicOnly.AddInPanel"` | Music editor add-in panel strip |
| `"AudioOnly.AddInPanel"` | Audio editor add-in panel strip |
| `"Project.AddInPanel"` | Project page add-in panel strip |
| `"Show.AddInPanel"` | Show page add-in panel strip |

**menuGroup values**

| Value | Menu | subCategory | Grouping |
|---|---|---|---|
| `"AudioProcess"` | Audio | `AudioEdit` | Audio Processing category |
| `"AudioVolume"` | Audio |  `AudioEdit` | Volume Curve category |
| `"AudioBend"` | Audio |  `AudioEdit` | Audio Bend category |
| `"AudioChords"` | Audio |  `AudioEdit` | Chords category |
| `"AudioParts"` | Audio |  `AudioEdit` | Audio Parts category |
| `"EventGeneral"` | Event | `EventEdit` | First non-header category |
| `"EventMute"` | Event | `EventEdit` | Second non-header category |
| `"EventOther"` | Event | `EventEdit` | Third non-header category |
| `"EventQuantize"` | Event, Musical Functions | `EventEdit`, `MusicEdit` | Quantize category |
| `"MusicMute"` | Event, Musical Functions | `EventEdit`, `MusicEdit` | Mute category |
| `"MusicGlobal"` | Musical Functions | `MusicEdit` | Global category |
| `"MusicPitch"` | Musical Functions | `MusicEdit` | Pitch category |
| `"MusicVelocity"` | Musical Functions | `MusicEdit` | Velocity category |
| `"MusicTime"` | Musical Functions | `MusicEdit` | Time category |
| `"MusicProcess"` | Musical Functions | `MusicEdit` | Process category |

**Multiple commands from one JS file:**

Several `<ScriptClass>` entries can point to the same JS source file while exposing different factory functions, helpers, or action modes.

```xml
<!-- classfactory.xml -->
<ScriptClass name="Remove Empty Tracks"
  sourceFile="code.js"
  functionName="removeEmpty"/>

<ScriptClass name="Remove Disabled Tracks"
  sourceFile="code.js"
  functionName="removeDisabled"/>
```

```javascript
// scriptname.js
function removeEmpty()    { return new TrackAction("removeEmptyTracks"); }
function removeDisabled() { return new TrackAction("removeDisabledTracks"); }
```

**Adding an icon-button to native Toolbars (`ScriptMetaClass`):**

`ScriptMetaClass` binds an icon resource to an `EditAddIn` script class and exposes it as a button in the Toolbar.

- The class uses `subCategory="Engine"`.
- `groupName` determines location of icon-button.
- The image is loaded from `skin/images/...`, declared in `skin.xml` as an `Image`.
- The image is referenced from `classfactory.xml` with `theme://$package/...`.

```xml
<!-- skin.xml -->
<Image name="IconName" url="images/IconName.png"/>
```

```xml
<!-- classfactory.xml -->
<ScriptMetaClass classID="{your-metaClassID}">
  <ScriptClassResource id="Class:ImageResource"
    url="theme://$package/IconName"/>
</ScriptMetaClass>
```

**Adding an icon to script menu items (`ScriptMetaClass`):**

`ScriptMetaClass` binds an icon resource to an `EditTask` script class and exposes it in menus.

- The class uses `menuGroup` to determine where the script appears.
- The image is loaded from `skin/images/...`, declared in `skin.xml` as an `Image`.
- The image is referenced from `classfactory.xml` with `theme://$package/...`.

```xml
<!-- skin.xml -->
<Image name="IconName" url="images/IconName.png"/>
```

```xml
<!-- classfactory.xml -->
<ScriptMetaClass classID="{your-metaClassID}">
  <ScriptClassResource id="Class:ImageResource"
    url="theme://$package/IconName"/>
</ScriptMetaClass>
```

**Gadget resource binding (`ScriptMetaClass`):**

`ScriptMetaClass` can also bind a gadget resource XML to a `Gadget` script class.

- The class uses `category="Gadget"`.
- The meta class points to a `resources/gadget.xml` file with `Class:GadgetResource`.
- The gadget XML carries the gadget's `themeName`, `formName`, `iconName`, and `menuIconName`.

```xml
<!-- resources/gadget.xml -->
<Gadget
  themeName="theme.name"
  formName="FormName"
  iconName="IconName"
  menuIconName="MenuIconName"
  />
```

```xml
<!-- classfactory.xml -->
<ScriptMetaClass classID="{your-metaClassID}">
  <ScriptClassResource id="Class:GadgetResource"
    url="resources/gadget.xml"/>
</ScriptMetaClass>
```

### 1.4 Installation

Install script packages into Studio Pro's `Scripts` folder:

| Platform | Scripts folder |
|---|---|
| **Windows** | `C:\Program Files\Fender\Studio Pro 8\Scripts\` |
| **macOS** | `/Applications/Studio Pro 8.app/Contents/Scripts/` |

**Initial recognition:**

Studio Pro discovers scripts on startup. If Studio Pro is already open when you install a new package, restart the application so it picks up the new script(s).

**Hot-reloading behavior:**

Replacing the contents of an installed package can hot-swap script source files, `skin.xml`, and `metainfo.xml` changes when the script is reopened. `classfactory.xml` registration changes still require a restart.

### 1.5 Creating a .package File

**Manual:**

For distribution, compress the script files into a `.zip` archive with the files at the archive root, then rename it to `my-script.package`.

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

Every script implements a task object and exports a factory function named by `classfactory.xml`.

```javascript
function MyTask() {
  this.interfaces = [Host.Interfaces.IEditTask];

  this.prepareEdit = function(context) {
    return Host.Results.kResultOk;
  };

  this.performEdit = function(context) {
    return Host.Results.kResultOk;
  };
}
// Function name matches classfactory.xml functionName.
function createInstance() {
  return new MyTask();
}
```

### 2.2 Execution Phases

The task lifecycle has two phases: validation in `prepareEdit()` and execution in `performEdit()`.

| Phase | When Called | Can Modify | Typical Use |
|---|---|---|---|
| `prepareEdit(context)` | Always, before `performEdit` | No | Validate state, show dialog, enable/disable menu item |
| `performEdit(context)` | Only if `prepareEdit` returns `kResultOk` | Yes | Do the actual work |

### 2.3 Undo Grouping

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

### 2.4 Selection Journaling

Selection operations are not undoable. Disable journaling before selecting:

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

Include helper JavaScript files from the package root or known resource paths.

```javascript
include_file('helper.js');
include_file('constants.js');
```

### 2.6 Return Codes

These are the standard result codes returned by script APIs and task methods.

| Constant | Value | Meaning |
|---|---|---|
| `Host.Results.kResultOk` | 0 | Success |
| `Host.Results.kResultTrue` | 0 | True |
| `Host.Results.kResultFalse` | 1 | False |
| `Host.Results.kResultInvalidArgument` | -2147024809 | Invalid argument |
| `Host.Results.kResultOutOfMemory` | -2147024882 | Out of memory |
| `Host.Results.kResultClassNotFound` | -2147221164 | Class not found |
| `Host.Results.kResultWrongThread` | -2147417842 | Wrong thread |
| `Host.Results.kResultUnexpected` | -2147418113 | Unexpected error |
| `Host.Results.kResultFailed` | -2147467259 | Failure |
| `Host.Results.kResultInvalidPointer` | -2147467261 | Invalid pointer |
| `Host.Results.kResultNoInterface` | -2147467262 | No interface |
| `Host.Results.kResultNotImplemented` | -2147467263 | Not implemented |

---

## 3. Context Object

The `context` object is passed to both `prepareEdit()` and `performEdit()`.

### 3.1 Context Availability

Context property availability varies by phase.

| Property / Method | prepareEdit | performEdit | Description |
|---|---|---|---|
| `context.contains(name)` | - | - | Check whether a named context attribute exists |
| `context.countAttributes()` | - | - | Count context attributes |
| `context.editor` | x | ✓ | Active editor surface |
| `context.functions` | x | ✓ | Active edit-function surface |
| `context.getArguments()` | ✓ | ✓ | Read arguments defined in `classfactory.xml` |
| `context.getAttribute(name)` | - | - | Get a context attribute by name |
| `context.getAttributeName(index)` | - | - | Get a context attribute name by index |
| `context.getAttributeValue(index)` | - | - | Get a context attribute value by index |
| `context.isSilentMode()` | - | - | Check whether the script is running silently |
| `context.iterator` | x | ✓ | Iterate selected events in the active editor |
| `context.mainTrackList` | x | ✓ | Track-list surface used for selection and track creation workflows |
| `context.parameters` | ✓ | x | Parameters used by the dialog flow |
| `context.restore(true)` | - | - | Restore the current edit context state before continuing |
| `context.runDialog(name, pkgID)` | - | - | Open a dialog for the current package |
| `context.setAttribute(name, value)` | - | - | Set a context attribute by name |
| `context.trackList` | - | - | Active track list surface |

### 3.2 context.mainTrackList

`context.mainTrackList` is the track-list surface used for selection and track creation workflows.

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

**Direct creation flow:**

`context.mainTrackList` provides the insertion index. `MusicPartFunctions`
creates the folder and child tracks, then `moveToFolder(parentFolder, track,
childIndex)` moves the child track into the folder.

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

### 3.3 context.iterator

Iterates over **selected** events in the active editor.

```javascript
var it = context.iterator;
while (!it.done()) {
  var event = it.next();
  if (!event) continue;
  // use event
}
```

### 3.4 context.editor

`context.editor` exposes the active editor surface for the current script context. See [Section 8](#8-editor-object) for the full editor object reference.

```javascript
context.editor.activeRegion       // The active Instrument Part (MIDI clip)
context.editor.cursorInfo         // Cursor position info
context.editor.model              // Editor model
context.editor.selection          // Selection control object
context.editor.quantize           // Quantize grid (read-only)
...
```

### 3.5 context.functions

`context.functions` exposes the edit-function surface for the current script context. See [Section 7](#7-edit-functions-contextfunctions) for the full `context.functions` reference.

```javascript
var fn = context.functions;
fn.beginMultiple("Operation Name");
fn.endMultiple(false);
```

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

### 3.7 context.trackList

Available in edit-task contexts where the active track list is exposed.

```javascript
var tl = context.trackList;

tl.numSelectedTracks      // Selected track count
tl.getSelectedTrack(i)    // Get selected track by index
```

### 3.8 context.restore(true)

`context.restore(true)` restores the current edit context state before a dialog or task proceeds. Used as an action-style helper.

```javascript
context.restore(true);
```

---

## 4. Track & Channel API

### 4.1 Track Object Properties

`track` exposes the core track surface and basic selection / folder state.

**Properties:**
| Property | Description |
|---|---|
| `track.channel` | Channel strip object |
| `track.color` | Color integer (read/write) |
| `track.flags` | Bitfield of track properties |
| `track.folded` | Boolean - folder track is collapsed |
| `track.hidden` | Boolean - visibility state |
| `track.layers.count` | Number of layers on track |
| `track.mediaType` | `"Audio"`, `"Music"`, etc. |
| `track.name` | String - track display name (read/write) |
| `track.parentFolder` | Parent folder track object |

**Methods:**
| Method | Description |
|---|---|
| `track.getTrack()` | Returns parent track (when called on event) |
| `track.isEmpty()` | True if no media on active layer |

### 4.2 Channel Object

`track.channel` is the main channel-strip object for routing, mix state, and editor access. It is also accessible through the Mixer Console (see [Section 4.3](#43-mixer-console-access)).

**Properties:**
| Property | Description |
|---|---|
| `channel.canDisable` | Boolean - whether track can be disabled |
| `channel.canMuteSolo` | Boolean - whether mute/solo is available |
| `channel.channelType` | `"MusicTrack"`, `"AudioTrack"`, etc. |
| `channel.disabled` | Track disabled state |
| `channel.editGroup` | Edit group (undefined if unassigned) |
| `channel.editor` | ChannelEditor object |
| `channel.editor.name` | ChannelEditor |
| `channel.editor.title` | ChannelEditor |
| `channel.editor.windowClass` | e.g., `"F11E8B6D6A4D46E79FC5CE67F540E592"` |
| `channel.environment` | `"SongEnvironment"` |
| `channel.input` | Input routing object |
| `channel.label` | Same as title |
| `channel.maxVolume` | Maximum fader value |
| `channel.mediaType` | `"Music"`, `"Audio"`, etc. |
| `channel.mute` | `0` or `1` (readable and writable) |
| `channel.name` | `"Channel02"` - internal channel name |
| `channel.overview` | ChannelOverview object |
| `channel.overview.name` | Channel Overview |
| `channel.overview.title` | ChannelOverview |
| `channel.overview.windowClass` | e.g., `"F11E8B6D6A4D46E79FC5CE67F540E592.o"` |
| `channel.pan` | Pan position: `0.0`=left, `0.5`=center, `1.0`=right |
| `channel.recordUnit.monitorActive` | Monitor state (readable and writable) |
| `channel.recordUnit.recordArmed` | Arm state (readable and writable) |
| `channel.solo` | `0` or `1` (readable and writable) |
| `channel.soloSave` | Solo safe state |
| `channel.title` | `"Impact"` - display name / label |
| `channel.volume` | Fader level float (readable and writable) |

**Methods:**
| Method | Description |
|---|---|
| `channel.connectTo(targetChannel)` | Route to another channel (bus assign) |
| `channel.find(name)` | Find child object |
| `channel.findParameter(name)` | Find parameter by name |
| `channel.focus()` | Focus channel in mixer |
| `channel.getDestinationChannel()` | Get current routing destination |
| `channel.interpretCommand(cat, name)` | Execute command on channel |
| `channel.openEditor()` | Open channel editor window |

**`findParameter()` Examples:**

`findParameter()` exposes named channel parameters for mix state and routing-related values.

```javascript
channel.findParameter("automationMode") // value: 0, string: "Auto: Off"
channel.findParameter("color")          // value: int, string: "#RRGGBBAA"
channel.findParameter("monitor")        // value: 0/1
channel.findParameter("mute")           // value: 0/1
channel.findParameter("solo")           // value: 0/1
channel.findParameter("tempo")          // Tempo (BPM) as float
channel.findParameter("transpose")      // Transposition in semitones
channel.findParameter("velocity")       // MIDI velocity scaling
```

**Parent Chain:**

The parent chain shows where the channel sits in the host object hierarchy.

```javascript
// channel.parent             → MusicTrack       (title = "MusicTrack")
// channel.parent.parent      → Channels         (title = "Channels")
// channel.parent.parent.parent           → MusicTrackDevice  (title = "Instrument Channels")
// channel.parent.parent.parent.parent    → SongEnvironment   (title = "SongEnvironment")
```

**Routing Example:**

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

**Save / Restore Pattern:**

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

`MixerConsole` can be accessed through the environment object or by URL.

**Environment Access:**

Access MixerConsole through the active environment object.

```javascript
var console = context.functions.root.environment.find("MixerConsole");
var channelList = console.getChannelList(type);

channelList.numChannels             // Total count
channelList.numSelectedChannels     // Selected count
channelList.getChannel(i)           // Get by 0-based index
channelList.getSelectedChannel(i)   // Get selected channel by index
```

**Channel List Types:**

| Type | Meaning |
|---|---|
| `1` | Normal (tracks/instruments) |
| `2` | Sub-outs (busses) |
| `3` | Master bus |

**Master Bus Example:**

```javascript
var masterBus = console.getChannelList(3).getChannel(0);
```

**URL-Based Access:**

Access MixerConsole directly by object URL.

```javascript
var mixerConsole = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/MixerConsole"
);
mixerConsole.name    // "MixerConsole"
mixerConsole.title   // "Console"
```

**audioMixer Surface:**

The audioMixer object exposes mixer-port and channel-setup helpers.

```javascript
var audioMixer = mixerConsole.audioMixer;
audioMixer.name    // "AudioMixer"
audioMixer.title   // "Audio Channels"
audioMixer.getOutputPortList()       // Read/query surface for mixer ports
audioMixer.getMaxSendSlotCount()     // Read/query surface for mixer limits
audioMixer.getMaxSlotCount()         // Read/query surface for mixer limits
audioMixer.getMasterSpeakerType()    // Read/query surface for speaker type

audioMixer.setup.addChannel("AudioGroup")  // Create a new mixer channel
audioMixer.setup.focusChannel(channel)      // Open/focus the mixer on an existing channel
```

---

## 5. Event & Note API

### 5.1 Event Object Properties

`event` exposes the note/event surface for timing, identity, and selection state.

**Properties**

| Property | Description |
|---|---|
| `event.color` | Integer color |
| `event.end` | End in beats (shorthand) |
| `event.endTime` | Time object |
| `event.isMuted` | Boolean mute state |
| `event.length` | Duration (time object or plain number in beats) |
| `event.lengthTime` | Duration as time object (alias) |
| `event.name` | String |
| `event.pitch` | MIDI note number (notes only, 0–127) |
| `event.region` | The Instrument Part (MIDI Clip) containing this note |
| `event.selected` | Boolean |
| `event.start` | Start in beats (shorthand) |
| `event.startTime` | Time object (see Section 6) |
| `event.timeContext` | Time context object (for conversions) |
| `event.timeFormat` | Time format identifier |
| `event.velocity` | MIDI velocity (notes only, 0–127 integer) |

**Methods**

| Method | Description |
|---|---|
| `event.clone()` | Clone note (returns new note object - all props read-only) |
| `event.globalToRegionData(pos)` | Convert global to region coordinates |
| `event.getLyricsForNote(note)` | Lyrics string for a given note |
| `event.getSoundVariationForNote(note)` | Sound variation for a given note |
| `event.nextEvent()` | Next event in sequence (often returns undefined) |
| `event.previousEvent()` | Previous event (often returns undefined) |
| `event.regionDataToGlobal(pos)` | Convert region to global coordinates |
| `event.select(addToSelection)` | `addToSelection`: bool |
| `event.selectExclusive()` | Select exclusively |

**Event Length Handling Example:**

`event.length` may return a time object or a plain number in beats.

```javascript
var noteLength = event.length;
var beats;
if (noteLength && noteLength.musical) {
  beats = noteLength.musical.beat;
} else if (typeof noteLength === 'number') {
  beats = noteLength;
}
```

### 5.2 The Region Object (event.region)

`event.region` is an Instrument Part. It is the correct container object for note insertion.

```javascript
var region = event.region;
```

**Properties:**

| Property | Description |
|---|---|
| `region.end` | Beat position where part ends |
| `region.endTime.musical` | End in beats |
| `region.length` | Length in beats |
| `region.lengthTime.musical` | Length in beats |
| `region.name` | Track name containing this part |
| `region.offset` | Region offset |
| `region.start` | Beat position where part starts |
| `region.startTime.musical` | Start in beats |

**Methods:**
| Method | Description |
|---|---|
| `region.asEventList()` | Returns as event list |
| `region.createSequenceIterator()` | Iterator over ALL notes in region |
| `region.getEndTime()` | End time of the part |
| `region.getRoot()` | Returns root object |
| `region.getStartTime()` | Start time of the part |
| `region.getTrack()` | Returns the containing track |

### 5.3 Iterating All Notes in a Region

Iterate the notes in the containing region through `region.createSequenceIterator()`.

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

### 5.4 Note Creation (Workaround)

The scripting API does not provide a direct note-creation path here, so note creation is done by cloning an existing note and inserting it into a region.

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

Convert a note's time context between seconds, beats, and bar-relative positions.

```javascript
note.timeContext.secondsToPpq(seconds)        // seconds → beats
note.timeContext.ppqToSeconds(beats)          // beats → seconds
note.timeContext.getBarStart(musicalBeat)     // get bar start for a beat position

// Get subposition within bar:
var barStart     = note.timeContext.getBarStart(note.startTime.musical);
var subposition  = note.startTime.musical - barStart;
```

### 5.6 Chord Events (Chord Track)

Chord events are runtime objects on the Chord Track. They appear as event objects iterated in an **EventEdit** or **TrackEdit** context when the Chord Track is targeted.

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

**event.chord Properties:**

| Property / Method | Description |
|---|---|
| `event.chord.name` | Full chord name string, e.g., `"B♭7 #11"` or `"B5/D"` |
| `event.chord.type` | Chord type ID (0 maj, 1 min, 2 dim, 3 aug, 4 sus2, 5 sus4, 6 power) |
| `event.chord.root` | Root note offset as an absolute directional coordinate on the Circle of Fifths Spiral |
| `event.chord.bass` | Bass note offset as an absolute directional coordinate on the Circle of Fifths Spiral |
| `event.chord.rootPitch` | Root pitch as an absolute MIDI value (`0 = C`, `1 = C#`, `7 = G`, etc.) |
| `event.chord.bassPitch` | Bass pitch as an absolute MIDI value (`0 = C`, `1 = C#`, `7 = G`, etc.) |
| `event.chord.hasInterval(interval)` | Boolean check for whether the chord contains a given interval |

**`rootPitch` / `bassPitch`:**

These are absolute MIDI pitch values anchored to C=0, independent of key signature.

**`root` / `bass`:**

There are absolute directional coordinates on the Circle of Fifths Spiral, used to distinguish enharmonic spellings and chord inversion position.

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

**Chord-Scrape Workflow:**

For a ready-to-use chord scraping script, see the [Chord Mapping package](scripts/packages/chord-mapping/) ([source](scripts/sources/chord-mapping-source/main.js)). It automates the process of exporting chord data to JSON and a results log.

---

## 6. Time Objects

### 6.1 Time Object Structure

Time objects represent positions in musical time used throughout the API for event timing, cursor positions, and time-based operations.

```javascript
var t = event.startTime;  // or fn.newMediaTime() or fn.newMusicalTime()
```

**Properties:**

| Property | Description |
|---|---|
| `t.musical` | Musical time sub-object (see below) |
| `t.seconds` | Absolute seconds (writable on note.startTime) |
| `t.samples` | Absolute samples at session sample rate |
| `t.time` | Internal time units (read-only) |
| `t.string` | Formatted string: `"00:00:00.000"` or `"1.1.1.000"` |

**Methods:**

| Method | Description |
|---|---|
| `t.as()` | Returns seconds as plain number |
| `t.clone()` | Returns valid time object copy |
| `t.convert()` | Returns `undefined` (non-functional) |
| `t.toMusicalTime()` | Returns `undefined` (non-functional) |

**Musical Sub-Object Structure:**

| Property | Description |
|---|---|
| `t.musical.bar` | Bar number (1-based) |
| `t.musical.beat` | Beat position (`0.0` to `beat_count`, fractional) |
| `t.musical.value` | Total beats from project start |

### 6.2 Creating New Time Objects

Create time objects with newMediaTime() or newMusicalTime() depending on the editor context.

```javascript
// Create empty time object (all properties initialized to 0)
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

**Context Availability:**

| Function | Available Contexts | Returns |
|---|---|---|
| `fn.newMediaTime()` | **AudioEdit, EventEdit, TrackEdit, MusicEdit** | `{seconds: 0, string: "00:00:00.000"}` |
| `fn.newMusicalTime()` | **Only MusicEdit** (Instrument Part/MIDI Editor) | Musical time objects |
| `createFunctions().newMediaTime()` | All contexts (when note/region available) | Media time objects |

**Universal Time Creation Pattern:**

```javascript
function createTime(fn) {
    if (typeof fn.newMediaTime === 'function') {
        var time = fn.newMediaTime();
        // Returns: {seconds: 0, string: "00:00:00.000"}
        if (time && time.seconds !== undefined) {
            return time;  // Valid time object
        }
    }
    return null;
}

// Set time in seconds
var time = createTime(fn);
if (time) {
    time.seconds = 5.0;  // Set to 5 seconds
    // time.string updates automatically: "00:00:05.000"
}
```

**Context-Specific Optimization (MIDI Editor):**

```javascript
function createMusicalTime(fn, beats) {
    if (typeof fn.newMusicalTime === 'function') {
        return fn.newMusicalTime(beats);
    }
    // Fallback for other contexts
    return createTime(fn);
}
```

### 6.3 Time Object Usage Patterns

**Writing to Note Timing:**
```javascript
note.startTime.seconds = newTimeInSeconds;
fn.moveEvent(note, note.startTime);  // Required to apply the change
```

**Time Arithmetic:**
```javascript
var start = fn.newMediaTime();
var end = fn.newMediaTime();
start.seconds = 5.0;
end.seconds = 10.0;
var duration = end.seconds - start.seconds;  // 5.0 seconds
```

**Musical Time Manipulation:**
```javascript
var time = fn.newMusicalTime(8.0);  // 8 beats from start
time.musical.bar = 3;               // Move to bar 3
time.musical.beat = 2.5;            // Bar 3, beat 2.5
```

**Formatting for Display:**
```javascript
var display = time.string;  // "00:00:05.000" or "3.2.2.500"
```

### 6.4 Time Conversion Utilities

Convert between seconds and beats on time objects.

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

### 6.5 Transport / Cursor Time Access

Access transport tempo, playback state, and cursor time through the transport panel.

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

`fn` is a common local alias for `context.functions` and must be defined before use.

`context.functions` is the reliable edit-function surface for note manipulation. Use `createFunctions("FamilyName")` from the correct object root when you need a root-specific family such as `AudioFunctions` or `MusicPartFunctions`.

### 7.1 Undo / Journal Control

Control undo grouping and journaling for edit operations.

```javascript
fn.beginMultiple(name)      // Start named undo group
fn.endMultiple(cancelled)   // End undo group (true = rollback)
fn.isJournalEnabled()       // Returns boolean
fn.setJournalEnabled(bool)  // Enable/disable journaling
```

### 7.2 Note / Event Editing

Edit note and event objects through context.functions.

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
```

### 7.3 Track / Arrangement Editing

Use `context.functions` for track and arrangement-level editing operations. See [Section 16.12](#164-contextfunctions-full-method-list) for the full direct `context.functions` method list.

```javascript
fn.addMediaTrack(index, name, trackFormat)   // Create a media track
fn.addTrack(classID, index, name)            // Create a track by class ID
fn.moveToFolder(parentFolder, track, childIndex) // Move a track into a folder track
fn.removeAllAutomation(trackOrEvent)         // Remove automation from a track or event
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

Set `executeImmediately` when edits need to apply in real time.

```javascript
fn.executeImmediately = true;   // Execute operations immediately (for real-time dialog updates)
// ... perform edits ...
fn.executeImmediately = false;  // Reset after use
```

### 7.5 Accessing Root / Environment

Use `fn.root` to access the document root, environment, and related root-level helpers.

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

Use `context.editor.model.arranger` to access the Arranger Track and create arranger sections.

**Arranger Object:**

The arranger object exposes the main Arranger Track creation and visibility helpers.

```javascript
arranger.addArrangerEvent(track, start, end) // Create arranger section
arranger.getArrangerTrack()                 // Returns ArrangerTrack handle
arranger.showArrangerTrack()                // Shows the Arranger Track
```

**ArrangerTrack Object:**

The `ArrangerTrack` object is primarily a handle passed to `addArrangerEvent()`.

```javascript
track.name   // "Arranger Track"
```

**Arranger event object:**

Arranger sections expose the standard event timing and display fields.

```javascript
event.name        // Section name
event.startTime   // Start time object
event.endTime     // End time object
event.length      // Duration value
event.lengthTime  // Duration as time object
event.color       // Event color
```

**Supported Methods:**

Supported `context.functions` methods.

```javascript
fn.renameEvent(event, "Section Name")
fn.colorizeEvent(event, colorIntValue)
```

**Working Pattern:**

Create time objects first, add the arranger event, then apply any standard event edits.

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

### 7.7 Specialized Function Families

Some edit operations are exposed through root-specific function families created with `root.createFunctions("FamilyName")`.

Create the family from the root of the object you intend to edit, since the same family may not work from another context.

**AudioFunctions**

| Method | Description |
|---|---|
| `createCrossFades(events, fadeLengthSeconds)` | - |
| `createCrossFade(leftEvent, rightEvent)` | - |
| `createFadeIn(event, fadeType, fadeLength, fadeBend)` | - |
| `createFadeOut(event, fadeType, fadeLength, fadeBend)` | - |
| `removeCrossFade(event)` | - |
| `removeEvent(event)` | - |
| `modifyVolume(event, volume)` | - |

**AudioEffectFunctions**

| Method | Description |
|---|---|
| `beginMultiple()` | - |
| `endMultiple()` | - |
| `insertEventEffect(audioEvent, presetOrClassID)` | - |
| `isJournalEnabled()` | - |
| `setEventEffectTail(eventEffect, seconds)` | - |
| `setJournalEnabled(enabled)` | - |

**AutomationFunctions**

| Method | Description |
|---|---|
| `addEvent(event)` | - |
| `addEventOnParent(event)` | - |
| `addEventOnTrack(event)` | - |
| `addMediaTrack(index, name, trackFormat)` | - |
| `addTrack(classID, index, name)` | - |
| `beginMultiple()` | - |
| `colorizeEvent(event, color)` | - |
| `duplicateTrack(track)` | - |
| `enableLoop(enable)` | - |
| `enableSyncPoint(enable)` | - |
| `endMultiple()` | - |
| `importFile(path)` | - |
| `importFiles(paths)` | - |
| `insertNewClip(track, event)` | - |
| `isJournalEnabled()` | - |
| `makeIndependent(event)` | - |
| `moveEvent(event, time)` | - |
| `moveToFolder(parentFolder, track, childIndex)` | - |
| `muteEvent(event, mute)` | - |
| `newMediaTime()` | - |
| `removeAllAutomation(trackOrEvent)` | - |
| `removeEvent(event)` | - |
| `removeRange(start, end)` | - |
| `removeTrack(track)` | - |
| `renameEvent(event, name)` | - |
| `resizeEvent(event, length)` | - |
| `setEventAttribute(event, name, value)` | - |
| `setEventIndex(event, index)` | - |
| `setFocusRegion(region)` | - |
| `setIconID(id)` | - |
| `setJournalEnabled(enabled)` | - |
| `setLoopRange(start, end)` | - |
| `setSyncPoint(time)` | - |
| `setTrackDelay(track, delay)` | - |
| `splitEvent(event, time)` | - |
| `toBack(event)` | - |
| `toFront(event)` | - |
| `transferEvent(source, destination)` | - |
| `transposeEvent(event, semitones)` | - |

**DeviceEditFunctions**

| Method | Description |
|---|---|
| `beginMultiple()` | - |
| `colorizeChannel(channel, colorCode)` | - |
| `connectChannel(channel, destinationInput)` | - |
| `endMultiple()` | - |
| `insertDevice(folder, presetOrClassID)` | - |
| `isJournalEnabled()` | - |
| `setJournalEnabled(enabled)` | - |

**MusicFunctions**

| Method | Description |
|---|---|
| `beginMultiple()` | - |
| `createEvent()` | - |
| `deleteEvent()` | - |
| `endMultiple()` | - |
| `freezePitch()` | - |
| `freezeQuantize()` | - |
| `freezeVelocity()` | - |
| `insertEvent()` | - |
| `isJournalEnabled()` | - |
| `modifyPitch()` | - |
| `modifyVelocity()` | - |
| `moveEvent()` | - |
| `muteEvent()` | - |
| `newMusicalTime()` | - |
| `quantize()` | - |
| `quantizeEvent()` | - |
| `resizeEvent()` | - |
| `setJournalEnabled()` | - |
| `setLyrics()` | - |

**MusicPartFunctions**

| Method | Description |
|---|---|
| `addEvent()` | - |
| `addEventOnParent()` | - |
| `addEventOnTrack()` | - |
| `addInstrument()` | - |
| `addInstrumentTrack()` | - |
| `addMediaTrack(index, name, trackFormat)` | - |
| `addMusicPart()` | - |
| `addNoteFX()` | - |
| `addTrack(classID, index, name)` | - |
| `beginMultiple()` | - |
| `colorizeEvent()` | - |
| `connectTrackWithInstrument()` | - |
| `createPitchNameList(track)` | - |
| `duplicateTrack()` | - |
| `enableLoop()` | - |
| `enableSyncPoint()` | - |
| `endMultiple()` | - |
| `importFile()` | - |
| `importFiles()` | - |
| `insertNewClip()` | - |
| `isJournalEnabled()` | - |
| `makeIndependent()` | - |
| `moveEvent()` | - |
| `moveToFolder(parentFolder, track, childIndex)` | - |
| `muteEvent()` | - |
| `newMediaTime()` | - |
| `removeAllNoteControllerEnvelopes()` | - |
| `removeEvent()` | - |
| `removeInstrument()` | - |
| `removeRange()` | - |
| `removeTrack()` | - |
| `renameEvent()` | - |
| `replaceInstrument()` | - |
| `resizeEvent()` | - |
| `setEventAttribute()` | - |
| `setEventIndex()` | - |
| `setIconID()` | - |
| `setJournalEnabled()` | - |
| `setLoopRange()` | - |
| `setSyncPoint()` | - |
| `setTrackDelay()` | - |
| `splitEvent()` | - |
| `toBack()` | - |
| `toFront()` | - |
| `transferEvent()` | - |
| `transposeEvent()` | - |

**Pitch Name List Example (MusicPartFunctions):**

Map track pitches to names, keyswitches, or articulations.

```javascript
var musicPartFunctions = context.editor.activeRegion.getRoot()
  .createFunctions("MusicPartFunctions");
var nameList = musicPartFunctions.createPitchNameList(track);
for (var i = 127; i >= 0; i--) {
  var name = nameList.getPitchName(i).trim();
  if (name.length > 0) { /* pitch i has a named keyswitch/articulation */ }
}
```

**Root-Specific Function Family Example:**

```javascript
var root = event.getRoot ? event.getRoot() : event.region.getRoot();
var audioFunctions = root.createFunctions("AudioFunctions");
audioFunctions.createCrossFades(events, fadeLengthSeconds);
```

---

## 8. Editor Object

### 8.1 Editor Properties

`context.editor` exposes the active editor surface, model, cursor state, quantize helper, and selection object.

| Property | Description |
|---|---|
| `context.editor.activeRegion` | Active Instrument Part (MIDI Clip) |
| `context.editor.cursorInfo` | Cursor info |
| `context.editor.cursorInfo.cursorTime.musical` | Cursor position in beats |
| `context.editor.cursorInfo.cursorTime.seconds` | Cursor position in seconds |
| `context.editor.environment` | - |
| `context.editor.model` | Editor model |
| `context.editor.model.arranger` | Arranger object |
| `context.editor.model.root.environment` | - |
| `context.editor.quantize` | Quantize helper object |
| `context.editor.selection` | Selection control object |
| `context.editor.selection.showHideSuspended` | Selection redraw suspension flag |

### 8.2 Editor Methods

| Method | Description |
|---|---|
| `context.editor.beginPreview()` | - |
| `context.editor.canSelect(note)` | - |
| `context.editor.createEditHandler()` | - |
| `context.editor.createSelectFunctions(context.functions)` | Create a selection helper |
| `context.editor.cursorInfo.setCursorTime(pos)` | Set cursor position |
| `context.editor.cursorInfo.setEditCursorTime(pos)` | Set edit cursor |
| `context.editor.deleteItem(note)` | Deletes note from editor |
| `context.editor.detectDoubleClick()` | - |
| `context.editor.detectDrag()` | - |
| `context.editor.drawFigure()` | - |
| `context.editor.dragEraser()` | - |
| `context.editor.dragSelection()` | - |
| `context.editor.dragTimeSegment()` | - |
| `context.editor.editItem(note)` | - |
| `context.editor.editTempo()` | - |
| `context.editor.editVelocity()` | - |
| `context.editor.findAdjacentItem()` | - |
| `context.editor.findItem()` | - |
| `context.editor.findItems()` | - |
| `context.editor.findTimeSegment()` | - |
| `context.editor.getEditArea()` | - |
| `context.editor.getItemSize()` | - |
| `context.editor.getItemType(note)` | - |
| `context.editor.getSelectionRange()` | - |
| `context.editor.getSelectionSize()` | - |
| `context.editor.getTimeSelectionOffset()` | - |
| `context.editor.isSameItem(n1, n2)` | - |
| `context.editor.model.root.environment` | - |
| `context.editor.model.setDocumentDirty()` | - |
| `context.editor.model.selectAllOnTrack(track)` | Select all events on a track |
| `context.editor.model.synchronizeEnvelopeSelection()` | Synchronize envelope selection |
| `context.editor.newTimeSegment()` | - |
| `context.editor.newTimeSegmentSprite()` | - |
| `context.editor.paintEvents()` | - |
| `context.editor.pixelToTime(pixel)` | Returns time-like object |
| `context.editor.pixelToVertical(pixel)` | - |
| `context.editor.quantize.getPeriod()` | Current grid period in beats |
| `context.editor.quantize.nextTime(time)` | Next grid position |
| `context.editor.quantize.quantizeTime(time)` | Quantize time value |
| `context.editor.quantize.snapTime(time)` | Snap to grid |
| `context.editor.selection.unselectAll()` | Deselect all items |
| `context.editor.setAnchorItem()` | - |
| `context.editor.setCursor()` | - |
| `context.editor.setEditCursorToSelection()` | - |
| `context.editor.showSelection(bool)` | Toggle editor selection redraw |
| `context.editor.sizeAdjacent()` | - |
| `context.editor.sizeLeft()` | - |
| `context.editor.sizeRight()` | - |
| `context.editor.sizeTimeSegment()` | - |
| `context.editor.suspendFollowEvents()` | - |
| `context.editor.timeToPixel(time)` | - |

### 8.3 Selection Control

`context.editor.selection` and `context.editor.showSelection()` control editor selection state and redraw behavior.

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

---

## 9. Host API

### 9.1 Host Top-Level Namespaces

These are the top-level namespaces exposed by `Host`.

| Namespace |
|---|
| `Classes` |
| `Console` |
| `Engine` |
| `FileTypes` |
| `Graphics` |
| `GUI` |
| `Interfaces` |
| `IO` |
| `Locales` |
| `Objects` |
| `Results` |
| `Security` |
| `Services` |
| `Settings` |
| `Signals` |
| `SystemInfo` |

### 9.2 Host.GUI.Commands

`Host.GUI.Commands` provides command execution, deferred execution, and command discovery helpers.

**Execution:**
```javascript
Host.GUI.Commands.interpretCommand(category, name)
Host.GUI.Commands.interpretCommand(category, name, clearSelection, attrs)
Host.GUI.Commands.deferCommand(category, name)
```

**Discovery:**
```javascript
Host.GUI.Commands.findCommand(cat, name)   // returns object (non-enumerable props)
Host.GUI.Commands.newCommandIterator()     // iterates all ~1660 commands
Host.GUI.Commands.newCategoryIterator()    // returns 54 categories
```

See [docs/COMMAND_REFERENCE.md](docs/COMMAND_REFERENCE.md) for the full command list.

**Attribute Example:**

```javascript
var attrs = Host.Attributes([
  "Length", "0.02",
  "Type", "Linear",
  "Bend", "0"
]);

Host.GUI.Commands.interpretCommand("Audio", "Create Crossfades", false, attrs);
```

`Create Crossfades` accepts `Length`, `Type`, and `Bend` attributes. See [18.4 Crossfade Tool](#184-crossfade-tool--complete-working-example).

### 9.3 Host.GUI.Dialogs

`Host.GUI.Dialogs` provides dialog and modal window helpers.

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

### 9.4 Host.GUI.Clipboard

`Host.GUI.Clipboard` provides simple text clipboard access.

```javascript
Host.GUI.Clipboard.setText(text)   // Set clipboard text
Host.GUI.Clipboard.getText()       // Get clipboard text
```

### 9.5 Host.GUI.openUrl

`Host.GUI.openUrl` opens a local file or URL in the host.

```javascript
Host.GUI.openUrl(url)   // Open a local file or URL in the host
```

Example:
```javascript
var targetPath = Host.Url("local://$USERCONTENT/your-file.txt");
Host.GUI.openUrl(targetPath);
```

### 9.6 Host.GUI.keyStateToString

`Host.GUI.keyStateToString` formats modifier-key masks for display.

```javascript
Host.GUI.keyStateToString(mask)   // Formats modifier masks for display
// 8 = Shift, 16 = Command, 32 = Option, 64 = Control
// 255 = Command+Shift+Option+Control
```

See [9.3 Host.GUI.Dialogs](#93-hostguidialogs) for the full constant table used by these modifier values.

### 9.7 Host.GUI.Help (Tutorial System)

```javascript
Host.GUI.Help.alignActiveTutorial()      // Align the active tutorial overlay
Host.GUI.Help.centerActiveTutorial()     // Center the active tutorial overlay
Host.GUI.Help.focusActiveTutorial()      // Focus the active tutorial overlay
Host.GUI.Help.highlightControl(control)  // Highlight a UI control
Host.GUI.Help.discardHighlights()        // Remove all highlights
Host.GUI.Help.modifyHighlights()   // Modify existing highlights
Host.GUI.Help.dimAllWindows()            // Dim all windows (tutorial focus effect)
```

`Host.GUI.Help` is observed in native/tutorial workflows, but its full scripting behavior is not yet documented in this guide.

### 9.8 Host.studioapp (Application-Level Command Interpreter)

Use `Host.studioapp.interpretCommand(...)` when a command needs the application-level command interpreter rather than `Host.GUI.Commands.interpretCommand(...)`.

```javascript
Host.studioapp.interpretCommand("Edit", "Create Range from Cursor");
Host.studioapp.interpretCommand("Edit", "Move Range Back");
Host.studioapp.interpretCommand("Transport", "Locate Selection");
Host.studioapp.interpretCommand("Track", "Select Scene 1");
Host.studioapp.interpretCommand("Zoom", "Zoom Full", false, Host.Attributes(["State", "1"]));
```

Same signature as `Host.GUI.Commands.interpretCommand(...)`:
`interpretCommand(category, name, [clearSelection], [attrs])`.

`Host.studioapp` is the same object as `Host.Objects.getObjectByUrl("://hostapp")`.

### 9.9 Host.Objects (URL-Based Object Access)

`Host.Objects` provides URL-based access to host objects.

```javascript
Host.Objects.getObjectByUrl(url)    // Get internal host object by URL
Host.Objects.getObjectByName(name)  // Get by name
Host.Objects.getObjectByID(id)      // Get by ID
Host.Objects.registerObject(name, object)
Host.Objects.unregisterObject(name)
```

<br>
<details>
<summary><b>Observed URLs</b></summary>

```
://hostapp
* ://hostapp/.../Editor
* ://hostapp/.../EventInspector
* ://hostapp/.../EventInspector/EventInfo
* ://hostapp/.../EventInspector/EventInfo/ChordSelector
* ://hostapp/.../TrackList
* ://hostapp/.../MediaPool
://hostapp/Configuration/Engine.Editing.trackColorEnabled
://hostapp/DocumentManager
://hostapp/DocumentManager/ActiveDocument
://hostapp/DocumentManager/ActiveDocument/Environment
://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel
://hostapp/DocumentManager/ActiveDocument/Environment/MixerConsole
://hostapp/DocumentHandler/Customization
://hostapp/DocumentManager/ActiveDocument/ProjectEdit/AutomationTrackList/laneSelected.0
://hostapp/DocumentManager/ActiveDocument/ProjectEdit/AutomationTrackList/laneSelected.1
://hostapp/MultitrackHandler
://hostapp/SongCustomization
://hostapp/SongCustomization/Browser.Cloud
://hostapp/SongCustomization/Browser.Effects
://hostapp/SongCustomization/Browser.Files
://hostapp/SongCustomization/Browser.Instruments
://hostapp/SongCustomization/Browser.Loops
://hostapp/SongCustomization/Browser.Pool
://hostapp/SongCustomization/EventInspector.BendMarker
://hostapp/SongCustomization/EventInspector.EditLock
://hostapp/SongCustomization/EventInspector.FadeIn
://hostapp/SongCustomization/EventInspector.FadeOut
://hostapp/SongCustomization/EventInspector.FileTempo
://hostapp/SongCustomization/EventInspector.Gain
://hostapp/SongCustomization/EventInspector.GainEnvelope
://hostapp/SongCustomization/EventInspector.Loop
://hostapp/SongCustomization/EventInspector.Normalize
://hostapp/SongCustomization/EventInspector.PlayMode
://hostapp/SongCustomization/EventInspector.Speedup
://hostapp/SongCustomization/EventInspector.StretchEvents
://hostapp/SongCustomization/EventInspector.SyncPoint
://hostapp/SongCustomization/EventInspector.TimeLock
://hostapp/SongCustomization/EventInspector.Transpose
://hostapp/SongCustomization/EventInspector.TransposeA
://hostapp/SongCustomization/EventInspector.Tune
://hostapp/SongCustomization/EventInspector.Velocity
://hostapp/SongCustomization/Inspector.Channel
://hostapp/SongCustomization/Inspector.Chords
://hostapp/SongCustomization/Inspector.Delay
://hostapp/SongCustomization/Inspector.FollowGlobalTranspose
://hostapp/SongCustomization/Inspector.Group
://hostapp/SongCustomization/Inspector.Layers
://hostapp/SongCustomization/Inspector.NoteFX
://hostapp/SongCustomization/Inspector.Notes
://hostapp/SongCustomization/Inspector.PlayOverlaps
://hostapp/SongCustomization/Inspector.RetroRecording
://hostapp/SongCustomization/Inspector.Routing
://hostapp/SongCustomization/Inspector.Tempo
://hostapp/SongCustomization/Inspector.Timebase
://hostapp/SongCustomization/Inspector.Transpose
://hostapp/SongCustomization/Toolbar.AddIns
://hostapp/SongCustomization/Toolbar.ControlLink
://hostapp/SongCustomization/Toolbar.InfoView
://hostapp/SongCustomization/Toolbar.Launcher
://hostapp/SongCustomization/Toolbar.LinkArrowRangeTool
://hostapp/SongCustomization/Toolbar.ScratchPad
://hostapp/SongCustomization/Toolbar.VideoPlayer
://hostapp/SongCustomization/Toolbar.autoScroll
://hostapp/SongCustomization/Toolbar.autoZoom
://hostapp/SongCustomization/Toolbar.editFollowEnabled
://hostapp/SongCustomization/Toolbar.inputQuantize
://hostapp/SongCustomization/Toolbar.rippleEnabled
://hostapp/SongCustomization/Toolbar.snapEnabled
://hostapp/SongCustomization/TrackControls.AudioInput
://hostapp/SongCustomization/TrackControls.EditGroup
://hostapp/SongCustomization/TrackControls.InstrChannel
://hostapp/SongCustomization/TrackControls.InstrInput
://hostapp/SongCustomization/TrackControls.InstrOutput
://hostapp/SongCustomization/TrackControls.Layers
://hostapp/SongCustomization/TrackControls.Pan
://hostapp/SongCustomization/TrackControls.Transform
://hostapp/SongCustomization/TrackControls.Volume
://hostapp/SongCustomization/Transport.Cache
://hostapp/SongCustomization/Transport.GlobalTransposition
://hostapp/SongCustomization/Transport.Key
://hostapp/SongCustomization/Transport.Loop
://hostapp/SongCustomization/Transport.MarkerButtons
://hostapp/SongCustomization/Transport.Metronome
://hostapp/SongCustomization/Transport.MidiMonitor
://hostapp/SongCustomization/Transport.Performance
://hostapp/SongCustomization/Transport.RecordTime
://hostapp/SongCustomization/Transport.SampleRate
://hostapp/SongCustomization/Transport.SecondaryTime
://hostapp/SongCustomization/Transport.Sync
://hostapp/SongCustomization/Transport.Tempo
://hostapp/SongCustomization/Transport.Timing
://hostapp/Studio/ActiveEnvironment
://hostapp/Studio/ActiveEnvironment/HardwareStorageManager
://studioapp"  (same as ://hostapp)
://studioapp/Application
://studioapp/Browser
://studioapp/DocumentManager
://studioapp/DocumentManager/ActiveDocument
://studioapp/DocumentManager/ActiveDocument/EditEnvironment/MainEditor/ChordEditComponent/tabNumber
://studioapp/DocumentManager/ActiveDocument/Editor
://studioapp/DocumentManager/ActiveDocument/GlobalTranspositionHandler
://studioapp/DocumentManager/ActiveDocument/Lyrics/trackLane
://studioapp/DocumentManager/ActiveDocument/ProjectEdit
://studioapp/DocumentManager/ActiveDocument/ProjectEdit/CurrentTrack
://studioapp/DocumentManager/ActiveDocument/ShowEdit/TransportHandler
://studioapp/DocumentManager/ActiveDocument/TrackList
://studioapp/DocumentManager/ActiveDocument/TrackList/InputChord/ChordSelector
://studioapp/Studio/ActiveEnvironment
://studioapp/Studio/ActiveEnvironment/FXMaster/bypassAll
://studioapp/Studio/ActiveEnvironment/MixerConsole
://studioapp/Studio/ActiveEnvironment/PerformanceMonitor/AudioCache

```
</details>
<br>

All URL objects share: `obj.findParameter(name)`, `obj.interpretCommand(...)`, `obj.find(name)`

### 9.10 Host.Classes (Factory Instantiation)

`Host.Classes` provides class creation and inspection helpers.

```javascript
Host.Classes.createInstance(classID)        // Create instance
Host.Classes.getClassDescription(classID)   // Get class description
Host.Classes.newIterator()                  // Returns empty iterator
```

**Instantiable built-in classes:**

| Class ID | Description | Key Methods / Fields |
|---|---|---|
| `"CCL:ButtonGroup"` | Button group UI element | - |
| `"CCL:CheckBox"` | Checkbox UI element | - |
| `"CCL:AlignView"` | Alignment view UI element | - |
| `"CCL:CommandBarModel"` | Command bar / mutable command tree model | `getRootItem()`, `createPage()`, `addChildItem()`, `removeChildItem()`, `getChildItem()`, `getChildIndex()`, `cloneItem()`, `saveToFile()`, `loadFromFile()`, `name`, `layout`, `revision`, `id`, `title`, `type`, `numChilds`, `flags`, `isReadOnly`, `isTemporary`, `isLeftClickContextMenu` |
| `"CCL:CommandBarView"` | Command bar view | `dragItem()` |
| `"CCL:CommandSelector"` | Command selector | `name`, `argColumnEnabled`, `focusCommand`, `addExcludedCategory()` |
| `"CCL:Divider"` | Divider UI element / native divider proxy | `jump()` |
| `"CCL:FileSelector"` | File picker dialog | - |
| `"CCL:Heading"` | Heading UI element | - |
| `"CCL:Label"` | Label UI element | - |
| `"CCL:ImageView"` | Image view UI element | - |
| `"CCL:ParamList"` | Parameter list for persistent dialogs | - |
| `"CCL:ProgressDialog"` | Progress indicator | - |
| `"CCL:ProgressBar"` | Progress bar UI element | - |
| `"CCL:RadioButton"` | RadioButton UI element | - |
| `"CCL:ScrollView"` | ScrollView UI element | - |
| `"CCL:View"` | View UI element | - |
| `"Devices:PortParam"` | Port/MIDI parameter | - |
| `"Host:AudioEventEffectPlugInSelector"` | Audio event plug-in selector | - |
| `"Host:ListViewModel"` | List/table data model | - |
| `"Host:PlugInMenuParam"` | Plug-in menu parameter | `setCategory(category)`, `getSelectedClass()` |
| `"Host:PlugInSelector"` | Plug-in selector controller | `setCategories(category, "")`, `setDisplaySorted(true)`, `selectClass(classID)` |
| `"Host:PresetParam"` | Preset parameter | - |

### 9.11 Host.Engine

Track format, color, speaker, and formatter helpers for engine-level UI and track metadata.

```javascript
Host.Engine.TrackFormats              // 17 track format types
Host.Engine.TrackFormats.at(i)        // Access by index
Host.Engine.TrackFormats.newIterator()
Host.Engine.TrackFormats.findEqual("Instrument")

Host.Engine.TrackColorPalette         // 256 colors
Host.Engine.TrackColorPalette.getAt(i)  // Returns color as ARGB integer

Host.Engine.TrackIcons
Host.Engine.TrackIcons.getTrackTypeIcon(trackTypeName)
Host.Engine.Speakers
Host.Engine.Speakers.countEqualSpeakers(leftSpeakerType, rightSpeakerType)
Host.Engine.CrossFadeFinder
Host.Engine.createFormatter(name)     // Create display formatter
Host.Engine.createTrackFormatWithPort(type, port)
```

`Engine.JS` class constants are exposed after including the engine SDK module:

```javascript
include_file("resource://{main}/sdk/engine.js");

Engine.JS.kClassAutomationTrack
Engine.JS.kClassFolderTrack
Engine.JS.kClassMediaTrack
```

**Formatters:**

`Host.Engine.createFormatter(name)` creates a display formatter for parameter-backed controls. Apply the formatter with `param.setFormatter(formatter)`; the backing `param.value` remains numeric while the UI displays a host-formatted string.

```javascript
var pitchFormatter    = Host.Engine.createFormatter("Media.MusicNote");
var velocityFormatter = Host.Engine.createFormatter("Media.MusicVelocity");
param.setFormatter(pitchFormatter);  // Displays "C3" instead of "60"
```

| Formatter | Display behavior |
|---|---|
| `"Media.MusicNote"` | Displays MIDI pitch integer values as note names such as `D#2` or `C3` |
| `"Media.MusicVelocity"` | Displays velocity values using the host velocity presentation mode, including percent-style display when enabled |

### 9.12 Host.Settings (Script-Local Key-Value Store)

`Host.Settings` is a script-local key-value store for persisting state between `prepareEdit` and `performEdit` script phases.

```javascript
var attrs = Host.Settings.getAttributes();
attrs.setAttribute(key, value)   // Set value
attrs.getAttribute(key)          // Get value
attrs.contains(key)              // Check existence (returns 0 or 1)
attrs.countAttributes()          // Count entries
attrs.getAttributeName(index)
attrs.getAttributeValue(index)
```

```javascript
Host.Settings.sleep(ms)   // Thread sleep in milliseconds
```

`sleep()` is exposed on `Host.Settings`, but its scripting behavior is not yet documented in this guide.

### 9.13 Host.Console

Host.Console provides console output for debugging.

```javascript
Host.Console.writeLine(text)   // Console output (alternative to alert for debugging)
```

### 9.14 Host.Graphics (Image Utility)

`Host.Graphics` provides image-related host utilities.

```javascript
Host.Graphics.loadImage(path)
Host.Graphics.saveImage(bitmap, path)
Host.Graphics.createBitmap(width, height)   // Returns bitmap with .width/.height
Host.Graphics.copyBitmap(src, dst)
Host.Graphics.createBitmapFilter()
```

### 9.15 Host.Security

```javascript
Host.Security.checkAccess(packageID, featureName)  // Returns 0 (restricted)
```
Behavior not yet documented in this guide.

### 9.16 Host.UID

```javascript
Host.UID(classDescription.classID)   // Wrap a class ID for host APIs
```
Behavior not yet documented in this guide.

### 9.17 Host.Interfaces (Known List — 28)

Interface names are listed here as a reference inventory for `this.interfaces` usage. Most act as capability markers.

**Interface Index:**

| Interface | Description |
|---|---|
| `IBrowserExtension` | - |
| `IClassFactory` | - |
| `ICommandHandler` | Handles command interpretation callbacks |
| `IComponent` | Base component / shared object interface |
| `IContextMenuHandler` | Builds context menus |
| `IController` | Controller for dialog and view parameter bindings |
| `IDocumentEventHandler` | Document lifecycle event handler |
| `IDocumentTemplateHandler` | Document template handler |
| `IEditHandler` | Edit-handler interface for tool and edit subsystems |
| `IEditHandlerHook` | Hook for edit-handler coordination |
| `IEditTask` | Editable action lifecycle |
| `IExtensionHandler` | Extension lifecycle handler |
| `IHelpTutorialHandler` | Tutorial/help lifecycle handler |
| `IObjectNode` | Object-tree node interface for UI models |
| `IObserver` | Receives callbacks from `Host.Signals` |
| `IPersistAttributes` | Saves and restores attributes/state |
| `IParamObserver` | Parameter-change observer for bound dialog/control parameters |
| `IPortFilter` | Filters available ports for a dialog or task |
| `IPresetMediator` | Mediates preset selection / preset state |
| `IScriptComponent` | Component bridge for script-side UI composition |
| `IToolAction` | Executable action within a tool or toolset |
| `IToolConfiguration` | Configuration object for a tool or tool family |
| `IToolHelp` | Tool help / help metadata |
| `IToolMode` | Selectable tool mode |
| `IToolSet` | Group of related tools or modes |
| `ITimerTask` | Timer-driven task |
| `IUnknown` | - |
| `IViewStateHandler` | Saves and restores view state for add-ins |

**Callback Contracts:**

| Interface | Required callback(s) |
|---|---|
| `IContextMenuHandler` | `extendMenu(menu)` |
| `IController` | `paramChanged(param)` |
| `IEditTask` | `prepareEdit()` and `performEdit()` |
| `IExtensionHandler` | `initialize(context)`, `startupExtension(description)`, `terminate()` |
| `IObserver` | `notify(subject, msg)` |
| `IParamObserver` | `paramChanged(param)` |
| `IPersistAttributes` | `storeValues(attributes)`, `restoreValues(attributes)` |
| `IViewStateHandler` | `initialize(context)`, `saveViewState(viewID, viewName, attributes)`, `loadViewState(viewID, viewName, attributes)`, `terminate()` |

**Interface Pattern Examples:**

**IContextMenuHandler**

```javascript
this.interfaces = [Host.Interfaces.IContextMenuHandler];

this.extendMenu = function(menu) {
  // Add commands or separators to the context menu.
  menu.addCommandItem("Clear", " ", " ", this);
};
```

**IController**

```javascript
this.interfaces = [Host.Interfaces.IController, Host.Interfaces.IParamObserver];

this.initialize = function(panel) {
  // Create the parameter list and bind it to this controller.
  this.paramList = Host.Classes.createInstance("CCL:ParamList");
  this.paramList.controller = this;
};

this.paramChanged = function(param) {
  // Called when a bound parameter changes.
};
```

**IEditTask**

```javascript
this.interfaces = [Host.Interfaces.IEditTask];

this.prepareEdit = function(context) {
  return Host.Results.kResultOk;
};

this.performEdit = function(context) {
  return Host.Results.kResultOk;
};
```

**IExtensionHandler:**

Long-lived extensions can use `IExtensionHandler` to initialize, register, and clean up host objects.

```javascript
this.interfaces = [Host.Interfaces.IExtensionHandler, Host.Interfaces.IComponent];

this.initialize = function(context) {
  // Register the shared handler object.
  Host.Objects.registerObject(this, "MacroExtensionHandler");
  return Host.Results.kResultOk;
};

this.startupExtension = function(description) {
  // Runs once for each loaded extension package.
  return 1;
};

this.terminate = function() {
  // Unregister the handler during shutdown.
  Host.Objects.unregisterObject(this);
  return Host.Results.kResultOk;
};
```

**IObserver**

```javascript
this.interfaces = [Host.Interfaces.IObserver];

// Subscribe the object to a signal channel.
Host.Signals.advise("my-channel-name", this);

this.notify = function(subject, msg) {
  // Handle Host.Signals callbacks.
};
```

**IParamObserver**

```javascript
this.interfaces = [Host.Interfaces.IParamObserver];

this.paramChanged = function(param) {
  // Called when a dialog/control parameter changes.
};
```

**IPersistAttributes**

```javascript
this.interfaces = [Host.Interfaces.IPersistAttributes];

this.storeValues = function(attributes) {
  // Save persistent state into attributes.
  return Host.Results.kResultOk;
};

this.restoreValues = function(attributes) {
  // Restore persistent state from attributes.
  return Host.Results.kResultOk;
};
```

**IViewStateHandler**

```javascript
this.interfaces = [Host.Interfaces.IViewStateHandler];

this.saveViewState = function(viewID, viewName, attributes) {
  // Save view-specific state.
  return true;
};

this.loadViewState = function(viewID, viewName, attributes) {
  // Restore view-specific state.
  return true;
};
```

### 9.18 Host.Locales

```javascript
Host.Locales.getStrings(key)   // Look up a localized i18n string by key
```

Behavior not yet documented in this guide.

### 9.19 Host.SystemInfo

```javascript
Host.SystemInfo.getLocalTime()   // Returns current local system time object
                                  // (same DateTime object as Host.DateTime — use .toSeconds())
```

Behavior not yet documented in this guide.

### 9.20 Application Configuration Access

```javascript
var value = Host.studioapp.find("Application").Configuration
  .getValue("Engine.Editing", "midiValuePresentationEnabled");
```

Configuration values are accessed by section/key name. Available keys are not yet documented in this guide.

### 9.21 Host.FileTypes

```javascript
Host.FileTypes.registerFileType(/* args */)              // Register a custom file type
Host.FileTypes.getFileTypeByExtension(ext)               // Look up type by file extension
Host.FileTypes.getFileTypeByMimeType(mimeType)           // Look up type by MIME type
Host.FileTypes.registerHandler(fileType, handler)        // Register a file handler
Host.FileTypes.unregisterHandler(fileType, handler)      // Unregister a file handler
```

Behavior not yet documented in this guide.

### 9.22 Script Instance (`this`) — __userdata

```javascript
this.__userdata
```

`this.__userdata` is exposed on the script instance, but its scripting behavior is not yet documented in this guide.

---

## 10. Transport Panel Parameters

The transport panel is accessed through the active document's host application object.

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
| `"loopLength"` | Loop length in beats |
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

**Parameter access:**

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
function MyTask() {
  this.prepareEdit = function(context) {
    this.MyValue = context.parameters.addInteger(0, 127, "MyValue");
    this.MyValue.value = 64;  // default

    this.MyFloat = context.parameters.addFloat(0.0, 1.0, "MyFloat");
    this.MyText  = context.parameters.addString("MyText");

    this.MyList  = context.parameters.addList("MyList");
    this.MyList.appendString("Option 1");
    this.MyList.appendString("Option 2");

    this.MyColor = context.parameters.addColor(0xFF0000FF, "MyColor");

    //  arg 1 = Form name (matches <Form name="..."> in skin.xml)
    //  arg 2 = Package:ID from metainfo.xml
    // Show dialog (returns kResultOk if OK, kResultFailed if cancelled):
    return context.runDialog("DialogFormName", "com.your.packageid");
  };

  this.performEdit = function(context) {
    var intVal   = this.MyValue.value;
    var floatVal = this.MyFloat.value;
    var textVal  = this.MyText.value;
    var listSel  = this.MyList.value;   // 0-based index
    var colorVal = this.MyColor.value;
    // ...
  };
}
```

### 11.2 System 2 — CCL:ParamList (Persistent Dialog / Panel)

Used for persistent panels that remain open across multiple interactions and
need controller callbacks.

```javascript
function MyTask() {
  var kPackageID = "com.your.packageid";

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
  this.MyButton = this.paramList.addParam("MyButton");

  this.paramChanged = function(param) {
    if (param === this.MyParam) { /* handle */ }
    if (param.name === "MyButton" && param.value === 1) {
      param.value = 0;  // reset button after handling
    }
  };

  this.performEdit = function(context) {
    var theme = Host.GUI.Themes.getTheme(kPackageID);
    Host.GUI.runDialog(theme, "FormName", this);
    return Host.Results.kResultOk;
  };
}
```

**ParamList methods:**

| Method | Description |
|---|---|
| `param.appendString(text)` | Add item to list/menu |
| `param.enabled` | Enable/disable |
| `param.palette` | Color palette (for color params) |
| `param.removeAll()` | Clear list items |
| `param.setFormatter(formatter)` | Set display formatter |
| `param.string` | Get/set as string |
| `param.value` | Get/set current value |
| `paramList.addColor(name)` | Color picker |
| `paramList.addCommand(cat, name, id)` | Command binding |
| `paramList.addFloat(min, max, name)` | Float slider/editbox |
| `paramList.addInteger(min, max, name)` | Integer slider/editbox |
| `paramList.addList(name)` | List / dropdown |
| `paramList.addMenu(name)` | Dropdown menu |
| `paramList.addParam(name)` | Generic param (button trigger) |
| `paramList.addString(name)` | String editbox |
| `paramList.remove(name)` | Remove a parameter |

### 11.3 Host:PresetParam

`Host:PresetParam` is a host-backed preset-selection object.

**Methods:**

| Method | Description |
|---|---|
| `appendString(text)` | - |
| `appendValue(value)` | - |
| `fromString(text)` | - |
| `getNormalized()` | - |
| `getSelectedValue()` | - |
| `getValueAt()` | Get the stored value at a given entry index |
| `isType()` | - |
| `removeAll()` | - |
| `selectRelativePath()` | Select an entry by relative preset path |
| `selectValue()` | - |
| `setCurve(value)` | - |
| `setFormatter(formatter)` | - |
| `setMetaInfo(attrs)` | Set metadata used to populate or filter preset content |
| `setNormalized(value)` | - |
| `setSignalAlways(value)` | - |
| `setValue(val)` | - |
| `shouldShowFolders(value)` | Control whether preset folders are shown |

**Observed fields:**

| Field | Description |
|---|---|
| `default` | Default value |
| `enabled` | Whether the preset selector is enabled |
| `max` | Maximum value |
| `min` | Minimum value |
| `name` | Parameter name |
| `reverse` | - |
| `signalAlways` | - |
| `string` | String form of the current selection |
| `type` | - |
| `value` | Current selected preset index or value |

### 11.4 ListView (Host:ListViewModel)

`Host:ListViewModel` is the script-owned data model used to populate a `ListView`.

**Instantiate:**
```javascript
var list = Host.Classes.createInstance("Host:ListViewModel");
```

**Columns:**
```javascript
list.columns.addColumn(width, title, field, columnWidth, flags);
```

**Populate rows:**
```javascript
var item = list.newItem(id);
item.details.myField = "value";  // 'myField' matches the column 'field'
list.addItem(item);
list.changed();  // Refresh UI
```

**Methods & Properties:**

| Method / Property | Description |
|---|---|
| `list.itemCount` | - |
| `list.getItem(index)` | - |
| `list.getFocusItem()` | - |
| `list.getSelectedItems()` | Iterate with `.newIterator()` |
| `list.itemView.setFocusItem(index, scroll)` | - |
| `list.doPopup()` | - |
| `list.addTitleSorter()` | - |
| `list.addDetailSorter()` | - |

**Observe changes:**
```javascript
Host.Signals.advise(list, this);
Host.Signals.unadvise(list, this);
```

---

## 12. skin.xml Reference

The full skin and UI language reference has moved to [docs/skinxml-reference/README.md](docs/skinxml-reference/README.md).

That file contains the current `skin.xml` and UI-element reference.

## 13. File I/O

File and path utilities for local storage, package access, platform checks, and document-relative paths.

### 13.1 Host.Url (Path Construction)

Create and adjust `Host.Url` path objects.

```javascript
var path = Host.Url("local://$USERCONTENT/folder/file.txt");
// $USERCONTENT:
//   Studio One:
//     Windows: C:\Users\[YourUsername]\Documents\Studio One
//     macOS:   ~/Documents/Studio One
//   Studio Pro:
//     Windows: C:\Users\[YourUsername]\Documents\Studio Pro
//     macOS:   ~/Documents/Studio Pro

path.ascend();               // Navigate up one directory
path.descend("subfolder");   // Navigate into subdirectory
```

### 13.2 Host.IO

Read, write, and inspect files through `Host.IO`.

**Read Text File:**

Open a text file and read it line by line.
```javascript
var file = Host.IO.openTextFile(path);
if (file) {
  while (!file.endOfStream) {
    var line = file.readLine();
  }
  file.close();
}
```

**Write JSON File (see [Chord Mapping example](#182-chord-mapping-complete-working-example)):**

Create a text file and write formatted JSON to it.
```javascript
var path = Host.Url("local://$USERCONTENT/file_name.json");
var file = Host.IO.createTextFile(path);
if (file) {
  file.writeLine(JSON.stringify(data, null, 2));
  file.close();
}
```
**File Operations:**

Check existence, copy, or remove files.
```javascript
Host.IO.File(path).exists()     // Boolean
Host.IO.File(path).copyTo(dest) // Copy
Host.IO.File(path).remove()     // Delete
```

**Find Files Matching Pattern:**

Iterate files in a folder that match a filename pattern.
```javascript
var it = Host.IO.findFiles(folder, "*.xml");
while (!it.done()) {
  var file = it.next();
  var name = file.name;
}
```

**JSON Loading:**

Load JSON directly into a JavaScript object.
```javascript
var data = Host.IO.loadJsonFile(Host.Url("local://$USERCONTENT/myfile.json"));
// Native JS object - fast C++ parsing
```

**XML Tree Parsing:**

Parse an XML file into an inspectable tree.
```javascript
var tree = Host.IO.XmlTree(path);
var root = tree.getRoot(); // or tree.root
```

**Package Operations:**

Open or create a `.package` archive.
```javascript
Host.IO.openPackage(path)   // null for non-packages
Host.IO.createPackage(path) // Returns package object
```

**Base64 Encoding/Decoding:**

Encode or decode data as Base64.
```javascript
Host.IO.toBase64(data)
Host.IO.fromBase64(data)
```


**XmlTree Node API:**

Inspect and traverse XML tree nodes returned by `Host.IO.XmlTree()`.

**Properties:**

| Property | Description |
|---|---|
| `node.comment` | Comment content |
| `node.name` | Tag name |
| `node.parent` | Parent node object |
| `node.text` | Text content |

**Methods:**

| Method | Description |
|---|---|
| `node.addChild(node)` | Add a child node |
| `node.findNode(name)` | Find first child with matching tag name |
| `node.getAttribute(name)` | Get attribute value (string) |
| `node.newIterator()` | Create an iterator over child nodes |
| `node.newNode()` | Create a new child node |
| `node.setAttribute(name, value)` | Set an attribute |

**XmlTree Usage Example:**

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

```javascript
// Development file path utility:
Host.IO.getDevelopmentFileLocation()   // Returns path for development/debug use
```

### 13.3 Platform Detection

Detect the current platform for path handling and file workflows.

```javascript
Host.getPlatform()   // Returns "win" or "mac"
```

### 13.4 Date / Time

Create and compare timestamps used by file-related workflows.

```javascript
var end = Host.DateTime("2026/01/01");     // Parse date string
var now = Host.SystemInfo.getLocalTime();  // Current local time
end.toSeconds() < now.toSeconds()         // Compare times
```

### 13.5 Document Path Access

Get the active document path and derive document-relative locations.

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

`Host.Signals` provides pub/sub messaging between scripts and observers.

| Method | Description |
|---|---|
| `Host.Signals.advise(channel, observer)` | Subscribe an observer to a signal channel. |
| `Host.Signals.unadvise(channel, observer)` | Unsubscribe an observer from a signal channel. |
| `Host.Signals.signal(channel, eventName, payload)` | Emit a signal to subscribed observers. |
| `Host.Signals.flush()` | Flush pending host signals. |
| `Host.Signals.postMessage()` | - |

```javascript
// Implement in task:
this.interfaces = [Host.Interfaces.IObserver];

this.notify = function(subject, msg) {
  var cmd = msg.id;         // Signal name (second arg to signal())
  var arg = msg.getArg(0);  // Payload (third arg to signal())
  // handle signal
};

Host.Signals.advise("my-channel-name", this);
Host.Signals.unadvise("my-channel-name", this);
Host.Signals.signal("my-channel-name", "EventName", payload);
```

---

## 15. Utilities & Conversions

Utility helpers for color values, unit conversions, and related data formatting.

### 15.1 Color Utilities

Color utility helpers for conversion and interpolation.

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

### 15.2 Value Conversions

Utility functions for converting between the value representations used by the API and human-readable equivalents. More conversions to be documented as the API is further explored.

**dB ↔ float (gain/volume)** — `channel.volume` and similar properties use a linear float, not dB:

```javascript
function dbToFloat(db) { return Math.pow(10, parseFloat(db) / 20); }
function floatToDb(f)  { return (Math.log(parseFloat(f)) / Math.LN10) * 20; }
```

---

## 16. Complete API Index

### 16.1 Host Top-Level Summary

| Namespace | Key Methods / Properties |
|---|---|
| `Host.Attributes` | - |
| `Host.Classes` | `createInstance()`, `getClassDescription()`, `newIterator()` |
| `Host.Console` | `writeLine(text)` |
| `Host.DateTime` | Parse date string |
| `Host.Signals` | `advise()`, `unadvise()`, `signal()`, `flush()`, `postMessage()` |
| `Host.Graphics` | `loadImage()`, `saveImage()`, `createBitmap()`, `copyBitmap()`, `createBitmapFilter()` |
| `Host.Interfaces` | known interface inventory and callback contracts |
| `Host.Locales` | `getStrings(key)` |
| `Host.Objects` | `getObjectByUrl()`, `getObjectByName()`, `getObjectByID()`, `registerObject()`, `unregisterObject()` |
| `Host.studioapp` | Application-level command interpreter |
| `Host.Security` | `checkAccess(packageID, featureName)` |
| `Host.SystemInfo` | `getLocalTime()` |
| `Host.UID` | Wrap a class ID for host APIs |
| `Host.Url` | Create a host path object |
| `Host.IO` | `openTextFile()`, `createTextFile()`, `File()`, `findFiles()`, `loadJsonFile()`, `XmlTree()`, `getDevelopmentFileLocation()`, `toBase64()`, `fromBase64()`, `openPackage()`, `createPackage()` |
| `Host.FileTypes` | `registerFileType()`, `getFileTypeByExtension()`, `getFileTypeByMimeType()`, `registerHandler()`, `unregisterHandler()` |
| `Host.Settings` | `getAttributes()`, `sleep(ms)` |
| `Host.Services` | - |
| `Host.getPlatform()` | Returns `"win"` or `"mac"` |

### 16.2 Host.GUI Namespaces

| Namespace | Key Methods / Properties |
|---|---|
| `Host.GUI.Constants` | UI constants |
| `Host.GUI.Commands` | Command dispatch helpers |
| `Host.GUI.openUrl` | Open URL / file helper |
| `Host.GUI.keyStateToString` | Modifier mask formatting helper |
| `Host.GUI.Themes` | Theme lookup and selection |
| `Host.GUI.Desktop` | `closeModalWindows()`, `closeTopModal()`, `getApplicationWindow()` |
| `Host.GUI.Help` | `alignActiveTutorial()`, `centerActiveTutorial()`, `focusActiveTutorial()`, `highlightControl()`, `discardHighlights()`, `modifyHighlights()`, `dimAllWindows()` |
| `Host.GUI.Configuration` | Configuration access helpers |
| `Host.GUI.Clipboard` | Clipboard helpers |

**Common Methods:**

| Method | Description |
|---|---|
| `Host.GUI.Commands.interpretCommand(category, name, clearSelection, attrs)` | Execute a host command |
| `Host.GUI.Commands.deferCommand(category, name)` | Defer a host command |
| `Host.GUI.Commands.findCommand(cat, name)` | Find a command object |
| `Host.GUI.Commands.newCommandIterator()` | Iterate commands |
| `Host.GUI.Commands.newCategoryIterator()` | Iterate command categories |
| `Host.GUI.alert(msg)` | Modal alert |
| `Host.GUI.ask(msg)` | Yes/No dialog |
| `Host.GUI.runDialog(theme, "FormName", controller)` | Show a `skin.xml` dialog |
| `Host.GUI.openUrl(url)` | Open a local file or URL |
| `Host.GUI.keyStateToString(mask)` | Format modifier-key masks |
| `Host.GUI.Clipboard.setText(text)` | Set clipboard text |
| `Host.GUI.Clipboard.getText()` | Get clipboard text |

### 16.3 Host.Engine Properties

| Namespace | Key Methods / Properties |
|---|---|
| `Host.Engine.TrackFormats` | Track format collection |
| `Host.Engine.TrackColorPalette` | Track color palette |
| `Host.Engine.TrackIcons` | Track icon collection |
| `Host.Engine.MediaClips` | Media clip collection |
| `Host.Engine.Speakers` | Speaker collection |
| `Host.Engine.CrossFadeFinder` | Crossfade helper object |
| `Host.Engine.createFormatter(name)` | Create a formatter |
| `Host.Engine.createTrackFormatWithPort(type, port)` | Create a track format from a port |

### 16.4 Host.Signals

| Method | Description |
|---|---|
| `Host.Signals.advise(channel, observer)` | Subscribe an observer to a signal channel |
| `Host.Signals.unadvise(channel, observer)` | Unsubscribe an observer from a signal channel |
| `Host.Signals.signal(channel, eventName, payload)` | Emit a signal to subscribed observers |
| `Host.Signals.flush()` | Flush pending host signals |
| `Host.Signals.postMessage()` | - |

### 16.5 Host.Objects

**Object Access:**

| Method | Description |
|---|---|
| `Host.Objects.getObjectByUrl(url)` | Get internal host object by URL |
| `Host.Objects.getObjectByName(name)` | Get object by name |
| `Host.Objects.getObjectByID(id)` | Get object by ID |
| `Host.Objects.registerObject(name, object)` | Register object |
| `Host.Objects.unregisterObject(name)` | Unregister object |

**Shared URL Object Methods:**

| Method | Description |
|---|---|
| `obj.find(name)` | Find a named child object |
| `obj.findParameter(name)` | Get a parameter object by key |
| `obj.interpretCommand(category, name, clearSelection, attrs)` | Execute a command on the object |

### 16.6 Host.Url / Path Object

**Function:**

| Function | Description |
|---|---|
| `Host.Url(path)` | Create a host path object |

**Methods:**

| Method | Description |
|---|---|
| `path.ascend()` | Move up one directory |
| `path.descend(name)` | Move into a child path |

### 16.7 Host.Settings Attributes

| Method | Description |
|---|---|
| `attrs.contains(key)` | Check whether a key exists |
| `attrs.countAttributes()` | Count stored attributes |
| `attrs.getAttribute(key)` | Get a value by key |
| `attrs.getAttributeName(index)` | Get a key name by index |
| `attrs.getAttributeValue(index)` | Get a value by index |
| `attrs.setAttribute(key, value)` | Store a value by key |

### 16.8 Host.IO

| Method | Description |
|---|---|
| `Host.IO.openTextFile(path)` | Open a text file for reading |
| `Host.IO.createTextFile(path)` | Create a text file for writing |
| `Host.IO.File(path).exists()` | Check file existence |
| `Host.IO.File(path).copyTo(dest)` | Copy a file |
| `Host.IO.File(path).remove()` | Delete a file |
| `Host.IO.findFiles(folder, pattern)` | Iterate files matching a pattern |
| `Host.IO.loadJsonFile(path)` | Load JSON into a JavaScript object |
| `Host.IO.XmlTree(path)` | Parse XML into an inspectable tree |
| `Host.IO.openPackage(path)` | Open a `.package` archive |
| `Host.IO.createPackage(path)` | Create a `.package` archive |
| `Host.IO.toBase64(data)` | Encode data as Base64 |
| `Host.IO.fromBase64(data)` | Decode data from Base64 |
| `Host.IO.getDevelopmentFileLocation()` | Returns path for development/debug use |

### 16.9 Host.IO.XmlTree Node API

**Properties:**

| Property | Description |
|---|---|
| `node.comment` | Comment content |
| `node.name` | Tag name |
| `node.parent` | Parent node object |
| `node.text` | Text content |

**Methods:**

| Method | Description |
|---|---|
| `node.addChild(node)` | Add a child node |
| `node.findNode(name)` | Find first child with matching tag name |
| `node.getAttribute(name)` | Get attribute value |
| `node.newIterator()` | Create an iterator over child nodes |
| `node.newNode()` | Create a new child node |
| `node.setAttribute(name, value)` | Set an attribute |

### 16.10 Host.Results

| Constant | Meaning |
|---|---|
| `Host.Results.kResultOk` | Success |
| `Host.Results.kResultTrue` | True |
| `Host.Results.kResultFalse` | False |
| `Host.Results.kResultInvalidArgument` | Invalid argument |
| `Host.Results.kResultOutOfMemory` | Out of memory |
| `Host.Results.kResultClassNotFound` | Class not found |
| `Host.Results.kResultWrongThread` | Wrong thread |
| `Host.Results.kResultUnexpected` | Unexpected error |
| `Host.Results.kResultFailed` | Failure |
| `Host.Results.kResultInvalidPointer` | Invalid pointer |
| `Host.Results.kResultNoInterface` | No interface |
| `Host.Results.kResultNotImplemented` | Not implemented |

### 16.11 Context Object

| Property / Method | Description |
|---|---|
| `context.contains(name)` | Check whether a named context attribute exists |
| `context.countAttributes()` | Count context attributes |
| `context.editor` | Active editor surface |
| `context.functions` | Active edit-function surface |
| `context.getArguments()` | Read arguments defined in `classfactory.xml` |
| `context.getAttribute(name)` | Get a context attribute by name |
| `context.getAttributeName(index)` | Get a context attribute name by index |
| `context.getAttributeValue(index)` | Get a context attribute value by index |
| `context.isSilentMode()` | Check whether the script is running silently |
| `context.iterator` | Iterate selected events in the active editor |
| `context.mainTrackList` | Track-list surface used for selection and track creation workflows |
| `context.parameters` | Parameters used by the dialog flow |
| `context.restore(true)` | Restore the current edit context state before continuing |
| `context.runDialog(name, pkgID)` | Open a dialog for the current package |
| `context.setAttribute(name, value)` | Set a context attribute by name |
| `context.trackList` | Active track list surface |

**context.mainTrackList Methods:**

| Method | Description |
|---|---|
| `tl.numTracks` | Total track count |
| `tl.numSelectedTracks` | Selected track count |
| `tl.getInsertPosition()` | Where new tracks would be inserted |
| `tl.getTrack(index)` | Get track by index |
| `tl.getSelectedTrack(i)` | Get selected track by index |
| `tl.selectTrack(track, select, exclusive)` | Select a track |
| `tl.unselectAll()` | Deselect all tracks |

<a id="164-contextfunctions-full-method-list"></a>
### 16.12 context.functions — Full Method / Property List

**Properties:**

| Property | Description |
|---|---|
| `executeImmediately` | Immediate-execution flag for live edit application |
| `root` | Root document object / access point for root-level helpers |

**Methods:**

| Method | Description |
|---|---|
| `addEvent()` | - |
| `addEventOnParent()` | - |
| `addEventOnTrack()` | - |
| `addMediaTrack()` | - |
| `addTrack()` | - |
| `beginMultiple()` | - |
| `colorizeChannel()` | - |
| `colorizeEvent()` | - |
| `connectChannel()` | - |
| `createCrossFade()` | - |
| `createCrossFades()` | - |
| `createFadeIn()` | - |
| `createFadeOut()` | - |
| `deleteEvent()` | - |
| `duplicateTrack()` | - |
| `enableLoop()` | - |
| `enableSyncPoint()` | - |
| `endMultiple()` | - |
| `freezePitch()` | - |
| `freezeQuantize()` | - |
| `freezeVelocity()` | - |
| `importFile()` | - |
| `importFiles()` | - |
| `insertEvent()` | - |
| `insertNewClip()` | - |
| `isJournalEnabled()` | - |
| `makeIndependent()` | - |
| `modifyPitch()` | - |
| `modifyVelocity()` | - |
| `modifyVolume()` | - |
| `moveEvent()` | - |
| `moveToFolder()` | - |
| `muteEvent()` | - |
| `newMediaTime()` | - |
| `newMusicalTime()` | - |
| `quantize()` | - |
| `quantizeEvent()` | - |
| `removeAllAutomation()` | - |
| `removeEvent()` | - |
| `removeRange()` | - |
| `removeTrack()` | - |
| `renameEvent()` | - |
| `resizeEvent()` | - |
| `setEventAttribute()` | - |
| `setEventIndex()` | - |
| `setFocusRegion()` | - |
| `setIconID()` | - |
| `setJournalEnabled()` | - |
| `setLoopRange()` | - |
| `setLyrics()` | - |
| `setSyncPoint()` | - |
| `setTrackDelay()` | - |
| `splitEvent()` | - |
| `toBack()` | - |
| `toFront()` | - |
| `transferEvent()` | - |
| `transposeEvent()` | - |

### 16.13 Iterator — Full Method List

| Method | Description |
|---|---|
| `done()` | Return whether iteration is complete |
| `first()` | Reset to first item |
| `last()` | Move to last item |
| `next()` | Advance to next item |
| `previous()` | Move to previous item |

### 16.14 Editor Object — Key Confirmed Working Methods

| Method | Description |
|---|---|
| `canSelect(note)` | Returns `1` when selectable |
| `createSelectFunctions(fn)` | Returns a select functions object |
| `deleteItem(note)` | Deletes note |
| `editItem(note)` | Returns `0` on success |
| `getItemType(note)` | Returns `"NoteEvent"` |
| `isSameItem(n1, n2)` | Returns `1` if items match |
| `newTimeSegment(time)` | Creates a new time segment |
| `pixelToTime(pixel)` | Returns a time-like object |
| `pixelToVertical(pixel)` | Returns a coordinate number |
| `select(note)` | Select a note |
| `showSelection(bool)` | Show or hide selection |
| `sizeLeft(event, size)` | Resize left edge |
| `sizeRight(event, size)` | Resize right edge |
| `split(event, time)` | Split an event |
| `unselect(note)` | Unselect a note |

### 16.15 Track Object

**Properties:**

| Property | Description |
|---|---|
| `track.channel` | Channel strip object |
| `track.color` | Color integer (read/write) |
| `track.flags` | Bitfield of track properties |
| `track.folded` | Boolean - folder track is collapsed |
| `track.hidden` | Boolean - visibility state |
| `track.layers.count` | Number of layers on track |
| `track.mediaType` | `"Audio"`, `"Music"`, etc. |
| `track.name` | String - track display name (read/write) |
| `track.parentFolder` | Parent folder track object |

**Methods:**

| Method | Description |
|---|---|
| `track.getTrack()` | Returns parent track (when called on event) |
| `track.isEmpty()` | True if no media on active layer |

### 16.16 Channel Object

**Properties:**

| Property | Description |
|---|---|
| `channel.canDisable` | Boolean - whether track can be disabled |
| `channel.canMuteSolo` | Boolean - whether mute/solo is available |
| `channel.channelType` | `"MusicTrack"`, `"AudioTrack"`, etc. |
| `channel.disabled` | Track disabled state |
| `channel.editGroup` | Edit group (undefined if unassigned) |
| `channel.editor` | ChannelEditor object |
| `channel.environment` | `"SongEnvironment"` |
| `channel.input` | Input routing object |
| `channel.label` | Same as title |
| `channel.maxVolume` | Maximum fader value |
| `channel.mediaType` | `"Music"`, `"Audio"`, etc. |
| `channel.mute` | `0` or `1` (readable and writable) |
| `channel.name` | Internal channel name |
| `channel.overview` | ChannelOverview object |
| `channel.pan` | Pan position: `0.0`=left, `0.5`=center, `1.0`=right |
| `channel.recordUnit.monitorActive` | Monitor state (readable and writable) |
| `channel.recordUnit.recordArmed` | Arm state (readable and writable) |
| `channel.solo` | `0` or `1` (readable and writable) |
| `channel.soloSave` | Solo safe state |
| `channel.title` | Display name / label |
| `channel.volume` | Fader level float (readable and writable) |

**Methods:**

| Method | Description |
|---|---|
| `channel.connectTo(targetChannel)` | Route to another channel |
| `channel.find(name)` | Find child object |
| `channel.findParameter(name)` | Find parameter by name |
| `channel.focus()` | Focus channel in mixer |
| `channel.getDestinationChannel()` | Get current routing destination |
| `channel.interpretCommand(cat, name)` | Execute command on channel |
| `channel.openEditor()` | Open channel editor window |

### 16.17 Event Object

**Properties:**

| Property | Description |
|---|---|
| `event.color` | Integer color |
| `event.end` | End in beats |
| `event.endTime` | Time object |
| `event.isMuted` | Boolean mute state |
| `event.length` | Duration |
| `event.lengthTime` | Duration as time object |
| `event.name` | String |
| `event.pitch` | MIDI note number |
| `event.region` | Instrument Part containing this note |
| `event.selected` | Boolean |
| `event.start` | Start in beats |
| `event.startTime` | Time object |
| `event.timeContext` | Time context object |
| `event.timeFormat` | Time format identifier |
| `event.velocity` | MIDI velocity |

**Methods:**

| Method | Description |
|---|---|
| `event.clone()` | Clone note |
| `event.globalToRegionData(pos)` | Convert global to region coordinates |
| `event.getLyricsForNote(note)` | Lyrics string for a given note |
| `event.getSoundVariationForNote(note)` | Sound variation for a given note |
| `event.nextEvent()` | Next event in sequence |
| `event.previousEvent()` | Previous event |
| `event.regionDataToGlobal(pos)` | Convert region to global coordinates |
| `event.select(addToSelection)` | Select event |
| `event.selectExclusive()` | Select exclusively |

### 16.18 Region Object

**Properties:**

| Property | Description |
|---|---|
| `region.end` | Beat position where part ends |
| `region.endTime.musical` | End in beats |
| `region.length` | Length in beats |
| `region.lengthTime.musical` | Length in beats |
| `region.name` | Track name containing this part |
| `region.offset` | Region offset |
| `region.start` | Beat position where part starts |
| `region.startTime.musical` | Start in beats |

**Methods:**

| Method | Description |
|---|---|
| `region.asEventList()` | Returns as event list |
| `region.createSequenceIterator()` | Iterator over all notes in region |
| `region.getEndTime()` | End time of the part |
| `region.getRoot()` | Returns root object |
| `region.getStartTime()` | Start time of the part |
| `region.getTrack()` | Returns the containing track |

### 16.19 Time Object

**Properties:**

| Property | Description |
|---|---|
| `t.musical` | Musical time sub-object |
| `t.seconds` | Absolute seconds |
| `t.samples` | Absolute samples at session sample rate |
| `t.time` | Internal time units |
| `t.string` | Formatted string |
| `t.musical.bar` | Bar number |
| `t.musical.beat` | Beat position |
| `t.musical.value` | Total beats from project start |

**Methods:**

| Method | Description |
|---|---|
| `t.as()` | Seconds as plain number |
| `t.clone()` | Valid time object copy |
| `t.convert()` | Returns `undefined` |
| `t.toMusicalTime()` | Returns `undefined` |

### 16.20 note.startTime — Full Method List

| Method | Description |
|---|---|
| `as()` | Seconds as plain number |
| `clone()` | Valid time object copy |
| `convert()` | Returns `undefined` |
| `toMusicalTime()` | Returns `undefined` |

### 16.21 Host.Classes

| Method | Description |
|---|---|
| `Host.Classes.createInstance(classID)` | Create instance |
| `Host.Classes.getClassDescription(classID)` | Get class description |
| `Host.Classes.newIterator()` | Returns empty iterator |

**Instantiable built-in classes:**

| Class ID | Description |
|---|---|
| `"CCL:AlignView"` | Alignment view UI element |
| `"CCL:ButtonGroup"` | Button group UI element |
| `"CCL:CheckBox"` | Checkbox UI element |
| `"CCL:CommandBarModel"` | Command bar / mutable command tree model |
| `"CCL:CommandBarView"` | Command bar view |
| `"CCL:CommandSelector"` | Command selector |
| `"CCL:Divider"` | Divider UI element / native divider proxy |
| `"CCL:FileSelector"` | File picker dialog |
| `"CCL:Heading"` | Heading UI element |
| `"CCL:ImageView"` | Image view UI element |
| `"CCL:Label"` | Label UI element |
| `"CCL:ParamList"` | Parameter list for persistent dialogs |
| `"CCL:ProgressBar"` | Progress bar UI element |
| `"CCL:ProgressDialog"` | Progress indicator |
| `"CCL:RadioButton"` | RadioButton UI element |
| `"CCL:ScrollView"` | ScrollView UI element |
| `"CCL:View"` | View UI element |
| `"Devices:PortParam"` | Port/MIDI parameter |
| `"Host:AudioEventEffectPlugInSelector"` | Audio event plug-in selector |
| `"Host:ListViewModel"` | List/table data model |
| `"Host:PlugInMenuParam"` | Plug-in menu parameter |
| `"Host:PlugInSelector"` | Plug-in selector controller |
| `"Host:PresetParam"` | Preset parameter |

### 16.22 CCL:ParamList

**Param Members:**

| Member | Description |
|---|---|
| `param.appendString(text)` | Add item to list or menu |
| `param.enabled` | Enable or disable the parameter |
| `param.palette` | Color palette for color parameters |
| `param.removeAll()` | Clear list items |
| `param.setFormatter(formatter)` | Set a display formatter |
| `param.string` | Get or set as string |
| `param.value` | Get or set current value |

**ParamList Methods:**

| Method | Description |
|---|---|
| `paramList.addColor(name)` | Add a color picker |
| `paramList.addCommand(cat, name, id)` | Add a command binding |
| `paramList.addFloat(min, max, name)` | Add a float slider or edit field |
| `paramList.addInteger(min, max, name)` | Add an integer slider or edit field |
| `paramList.addList(name)` | Add a list parameter |
| `paramList.addMenu(name)` | Add a menu parameter |
| `paramList.addParam(name)` | Add a generic trigger parameter |
| `paramList.addString(name)` | Add a string parameter |
| `paramList.remove(name)` | Remove a parameter |

### 16.23 Host:PresetParam

**Methods:**

| Method | Description |
|---|---|
| `appendString(text)` | - |
| `appendValue(value)` | - |
| `fromString(text)` | - |
| `getNormalized()` | - |
| `getSelectedValue()` | - |
| `getValueAt()` | Get the stored value at a given entry index |
| `isType()` | - |
| `removeAll()` | - |
| `selectRelativePath()` | Select an entry by relative preset path |
| `selectValue()` | - |
| `setCurve(value)` | - |
| `setFormatter(formatter)` | - |
| `setMetaInfo(attrs)` | Set metadata used to populate or filter preset content |
| `setNormalized(value)` | - |
| `setSignalAlways(value)` | - |
| `setValue(val)` | - |
| `shouldShowFolders(value)` | Control whether preset folders are shown |

**Properties:**

| Property | Description |
|---|---|
| `default` | Default value |
| `enabled` | Whether the preset selector is enabled |
| `max` | Maximum value |
| `min` | Minimum value |
| `name` | Parameter name |
| `reverse` | - |
| `signalAlways` | - |
| `string` | String form of the current selection |
| `type` | - |
| `value` | Current selected preset index or value |

### 16.24 Host:ListViewModel

**Properties:**

| Property | Description |
|---|---|
| `list.itemCount` | - |

**Methods:**

| Method | Description |
|---|---|
| `list.addDetailSorter()` | - |
| `list.addTitleSorter()` | - |
| `list.addItem(item)` | Add a row item |
| `list.changed()` | Refresh the view |
| `list.doPopup()` | - |
| `list.getFocusItem()` | - |
| `list.getItem(index)` | - |
| `list.getSelectedItems()` | Iterate with `.newIterator()` |
| `list.newItem(id)` | Create a row item |
| `list.itemView.setFocusItem(index, scroll)` | - |
| `list.columns.addColumn(width, title, field, columnWidth, flags)` | Add a column definition |

### 16.25 Transport Panel Parameters

**Read / Write Parameters:**

| Name | Description |
|---|---|
| `"loop"` | Loop enabled (`0` / `1`) |
| `"loopEnd"` | Loop end in beats |
| `"loopLength"` | Loop length in beats |
| `"loopStart"` | Loop start in beats |
| `"precount"` | Precount enabled (`0` / `1`) |
| `"punchIn"` | Punch in (`0` / `1`) |
| `"punchOut"` | Punch out (`0` / `1`) |
| `"record"` | Recording state (`0` / `1`) |
| `"tempo"` | BPM value |

**Read-Only Parameters:**

| Name | Description |
|---|---|
| `"primaryTime"` | Current cursor position |
| `"rewind"` | Rewind state |
| `"start"` | Transport start state |
| `"stop"` | Transport stop state |

**Parameter Members:**

| Member | Description |
|---|---|
| `param.default` | Default value |
| `param.enabled` | Enabled state (`0` or `1`) |
| `param.max` | Maximum value |
| `param.min` | Minimum value |
| `param.name` | Parameter key name |
| `param.setValue(val)` | Alternative write method |
| `param.string` | Formatted display value |
| `param.value` | Numeric value |

### 16.26 Host.Interfaces

| Interface | Description |
|---|---|
| `IBrowserExtension` | - |
| `IClassFactory` | - |
| `ICommandHandler` | Handles command interpretation callbacks |
| `IComponent` | Base component / shared object interface |
| `IContextMenuHandler` | Builds context menus |
| `IController` | Controller for dialog and view parameter bindings |
| `IDocumentEventHandler` | Document lifecycle event handler |
| `IDocumentTemplateHandler` | Document template handler |
| `IEditHandler` | Edit-handler interface for tool and edit subsystems |
| `IEditHandlerHook` | Hook for edit-handler coordination |
| `IEditTask` | Editable action lifecycle |
| `IExtensionHandler` | Extension lifecycle handler |
| `IHelpTutorialHandler` | Tutorial/help lifecycle handler |
| `IObjectNode` | Object-tree node interface for UI models |
| `IObserver` | Receives callbacks from `Host.Signals` |
| `IPersistAttributes` | Saves and restores attributes/state |
| `IParamObserver` | Parameter-change observer for bound dialog/control parameters |
| `IPortFilter` | Filters available ports for a dialog or task |
| `IPresetMediator` | Mediates preset selection / preset state |
| `IScriptComponent` | Component bridge for script-side UI composition |
| `IToolAction` | Executable action within a tool or toolset |
| `IToolConfiguration` | Configuration object for a tool or tool family |
| `IToolHelp` | Tool help / help metadata |
| `IToolMode` | Selectable tool mode |
| `IToolSet` | Group of related tools or modes |
| `ITimerTask` | Timer-driven task |
| `IUnknown` | - |
| `IViewStateHandler` | Saves and restores view state for add-ins |

### 16.27 Host.Graphics

| Method | Description |
|---|---|
| `Host.Graphics.loadImage(path)` | Load image |
| `Host.Graphics.saveImage(bitmap, path)` | Save image |
| `Host.Graphics.createBitmap(width, height)` | Returns bitmap with `.width` / `.height` |
| `Host.Graphics.copyBitmap(src, dst)` | Copy bitmap |
| `Host.Graphics.createBitmapFilter()` | Create bitmap filter |

### 16.28 Host.FileTypes

| Method | Description |
|---|---|
| `Host.FileTypes.registerFileType(/* args */)` | Register a custom file type |
| `Host.FileTypes.getFileTypeByExtension(ext)` | Look up type by file extension |
| `Host.FileTypes.getFileTypeByMimeType(mimeType)` | Look up type by MIME type |
| `Host.FileTypes.registerHandler(fileType, handler)` | Register a file handler |
| `Host.FileTypes.unregisterHandler(fileType, handler)` | Unregister a file handler |

### 16.29 Misc Host Helpers

| Method / Property | Description |
|---|---|
| `Host.Console.writeLine(text)` | Console output |
| `Host.Locales.getStrings(key)` | Look up a localized i18n string by key |
| `Host.Security.checkAccess(packageID, featureName)` | Returns `0` when restricted |
| `Host.SystemInfo.getLocalTime()` | Returns current local system time object |
| `Host.UID(classDescription.classID)` | Wrap a class ID for host APIs |
| `Host.studioapp.find("Application").Configuration.getValue(section, key)` | Access application configuration value |
| `this.__userdata` | - |

---

## 17. Known Limitations & Debugging

### 17.1 Potential Limitations / Observational Quirks

| Limitation | Detail |
|---|---|
| **No MIDI CC iteration** | `context.iterator`, `editor.selection.newIterator()`, and `activeRegion.createSequenceIterator()` exposed only note events; CC/controller fields stayed undefined |
| **mainTrackList availability** | `context.mainTrackList` is undefined in `MusicEdit` |
| **Selection is not undoable** | Disable journaling before any selection operations |
| **Piano editor quantize UI** | Read-only via `context.editor.quantize` — cannot change UI |
| **context.iterator availability** | May be sparse or unavailable depending on the active editor surface and selection state |
| **Note timing property** | Only `note.startTime.seconds` is confirmed writable; other note changes should use edit functions |
| **Bar Offset is visual only** | `editor.activeRegion.start` and `event.region.start` return the absolute beat position and do not consider Bar Offset |

### 17.2 Open Items

- Complete `skin.xml` element and attribute reference. Still missing a lot of documentation.
- Many entries in the API Index still have missing descriptions, so it is incomplete even where the member names are listed.
- `Host.GUI.Help` is observed in native/tutorial workflows, but its full scripting behavior is not yet documented in this guide.
- `Host.Settings.sleep(ms)` is exposed, but its scripting behavior is not yet documented in this guide.
- `Host.studioapp.find("Application").Configuration.getValue(...)` section/key namespaces are not yet cataloged in this guide.
- `this.__userdata` is exposed on the script instance, but its scripting behavior is not yet documented in this guide.

### 17.3 Debugging Utilities

Useful runtime probe helpers for inspecting unknown API surfaces. Native host objects can stringify as `[object Object]`, hide members, or expose empty own-property lists even when the object is valid, so `typeof`, targeted property reads, and working call-site probes are often more reliable than generic reflection alone.

**Object Surface Dump:**

Inspect an object surface by walking own properties and inherited members.

```javascript
function dumpSurface(label, obj) {
  var lines = [label + ": typeof = " + typeof obj];
  var seen = {};
  var current = obj;

  while (current) {
    var names = [];
    try { names = Object.getOwnPropertyNames(current); }
    catch (e) { lines.push("  <own props unavailable>"); break; }

    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (seen[name]) continue;
      seen[name] = true;

      var kind = "?";
      try { kind = typeof obj[name]; } catch (e) {}
      lines.push("  " + name + " = " + kind);
    }

    try { current = Object.getPrototypeOf(current); }
    catch (e) { break; }
  }

  Host.GUI.alert(lines.join("\n"));
}
```

**Iterator Dump:**

Inspect iterator output and confirm what item types a host iterator is actually returning.

```javascript
function dumpIterator(label, iterator, limit) {
  var lines = [label + ":"];
  var count = 0;
  limit = limit || 16;

  while (iterator && !iterator.done() && count < limit) {
    var item = iterator.next();
    lines.push("  [" + count + "] typeof = " + typeof item);
    count++;
  }

  lines.push("  count = " + count);
  Host.GUI.alert(lines.join("\n"));
}
```

**Parameter Dump:**

Inspect a parameter object returned by `findParameter(...)`.

```javascript
function dumpParameter(label, param) {
  if (!param) {
    Host.GUI.alert(label + ": <null>");
    return;
  }

  Host.GUI.alert([
    label,
    "name = " + param.name,
    "value = " + param.value,
    "string = " + param.string,
    "min = " + param.min,
    "max = " + param.max,
    "default = " + param.default,
    "enabled = " + param.enabled
  ].join("\n"));
}
```

---

## 18. Examples

### [18.1 Flam Tool — Complete Working Example](scripts/packages/flam-tool/)

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

### [18.2 Chord Mapping — Complete Working Example](scripts/packages/chord-mapping/)

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

### [18.3 Multi Script Demo — Complete Working Example](scripts/packages/multi-script-demo/)

The **Multi Script Demo** package in this repository is a complete, working example demonstrating:

- Multiple `<ScriptClass>` entries in one `classfactory.xml`
- Separate `sourceFile` values for `ScriptA.js` and `ScriptB.js` (packages may also share one `sourceFile` when that file exports multiple factory functions)
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

### [18.4 Crossfade Tool — Complete Working Example](scripts/packages/crossfade-tool/)

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
- Supports Linear, Logarithmic, and Exponential crossfade types
- Supports Bend as a user-facing percentage value
- Supports optional split-duration behavior so the entered duration can be divided evenly between both clips
- Demonstrates how command arguments and edit functions can be combined in one script

---

## 19. Community Resources & Sources


| Resource | URL |
|---|---|
| Studio One Toolbox | https://s1toolbox.com/navigationessentials |
| GitHub — DjFix functions helper | https://github.com/DjFix/studioone_functions |
| KVR Audio Forum | https://www.kvraudio.com/forum/viewtopic.php?t=506195 |
| audiosex.pro Forum | https://audiosex.pro/threads/how-do-you-install-studio-one-x.30244/ |
| GitHub - Track-Actions | https://github.com/jamesg545454/Track-Actions |

### References Used
- **Navigation Essentials 2.0.1** (Lukas Ruschitzka) — reference track selection, colorize, piano editor tasks
- **Studio One X v2.6.1** (Narech Kontcell) (`studioonex.package`) — extensive source reference
- **Studio One Scripts.exe** (LawrenceF:**KVR**) - referenced source files
- **ChordstoBiabTextFile** (crossovercable:**KVR**, tonedef71:**KVR**) - reference source files for chord events
- **Track-Actions** (Jamesg545454) - reference multi-command .JS files
- **Logical Editor** (Jamesg545454) - reference display formatter for parameter-backed controls, form background, view layout wrapper

*Community-compiled, not affiliated with Fender or PreSonus*
