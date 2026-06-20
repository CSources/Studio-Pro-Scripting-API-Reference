---
sidebar_position: 8
---
# Objects

`Host.Objects` provides URL-based access to host objects.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Objects.getObjectByUrl(url)` | `object` | `url` — URL string (e.g. `"://hostapp/DocumentManager"`) | Get an internal host object by URL path |
| `Host.Objects.getObjectByName(name)` | `object` | `name` — object name string | Get an object by name |
| `Host.Objects.getObjectByID(id)` | `object` | `id` — object ID string | Get an object by ID |
| `Host.Objects.registerObject(object, name)` | `number` | `object` — the object to register, `name` — registration name | Register a script as a named host object. Returns `0` on success. |
| `Host.Objects.unregisterObject(name)` | — | `name` — registration name | Unregister a previously registered object |

## Returned URL Objects

Most URL objects returned by `getObjectByUrl()` share these properties and methods:

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"root"`, `"DocumentManager"` | Object identifier. Usually matches the URL path segment. |
| `title` | `string` | No | `"Studio Pro"`, `"Browser"` | Display name. May differ from `name`. |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `find(name)` | `object` | `name` — sub-object name string | Navigate to a direct sub-object by name. Equivalent to extending the URL path. |
| `findParameter(name)` | `object` | `name` — parameter name string | Get a parameter from the object by name. |
| `interpretCommand(...)` | — | `category` — command category, `name` — command name, `clearSelection` — `true` to clear selection before executing, `attrs` — optional `Host.Attributes` object | Send a command to the object |

## Root URL Object

`Host.studioapp` is equivalent to `Host.Objects.getObjectByUrl("://hostapp")`. It represents the root of the URL object tree. `name` is `"root"`, `title` is `"Studio Pro"`.

```javascript
Host.studioapp.interpretCommand("Edit", "Create Range from Cursor");
Host.studioapp.interpretCommand("Edit", "Move Range Back");
Host.studioapp.interpretCommand("Transport", "Locate Selection");
Host.studioapp.interpretCommand("Track", "Select Scene 1");
Host.studioapp.interpretCommand("Zoom", "Zoom Full", false, Host.Attributes(["State", "1"]));
```

**Application Configuration Access:**

Configuration values are accessed by section/key name. Available keys are not yet documented.

```javascript
var value = Host.studioapp.find("Application").Configuration
  .getValue("Engine.Editing", "midiValuePresentationEnabled");
```

## Parameter Access

`findParameter(name)` returns a parameter object.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `value` | `number` | Yes | `120.0` | Numeric value |
| `string` | `string` | No | `"120.00 BPM"` | Formatted display string |
| `min` | `number` | No | `20.0` | Minimum allowed value |
| `max` | `number` | No | `999.0` | Maximum allowed value |
| `default` | `number` | No | `120.0` | Default value |
| `name` | `string` | No | `"tempo"` | Parameter key name |
| `enabled` | `number` | No | `1` | `1` = enabled, `0` = disabled |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setValue(val)` | — | `val` — new numeric value | Sets the parameter value programmatically |

<br/>
<details>
<summary><b>Observed URLs</b></summary>

```
://hostapp  (same as ://studioapp)
://hostapp/Application
://hostapp/Browser
://hostapp/Configuration/Engine.Editing.trackColorEnabled
://hostapp/DocumentHandler/Customization
://hostapp/DocumentManager
://hostapp/DocumentManager/ActiveDocument
://hostapp/DocumentManager/ActiveDocument/EditEnvironment
://hostapp/DocumentManager/ActiveDocument/EditEnvironment/MainEditor/ChordEditComponent/tabNumber
://hostapp/DocumentManager/ActiveDocument/Editor
://hostapp/DocumentManager/ActiveDocument/Editor/AudioEditor
://hostapp/DocumentManager/ActiveDocument/Environment
://hostapp/DocumentManager/ActiveDocument/Environment/MixerConsole
://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel
://hostapp/DocumentManager/ActiveDocument/EventInspector
://hostapp/DocumentManager/ActiveDocument/EventInspector/EventInfo
://hostapp/DocumentManager/ActiveDocument/EventInspector/EventInfo/ChordSelector
://hostapp/DocumentManager/ActiveDocument/GlobalTranspositionHandler
://hostapp/DocumentManager/ActiveDocument/InfoPopup
://hostapp/DocumentManager/ActiveDocument/LauncherPlaylist
://hostapp/DocumentManager/ActiveDocument/Lyrics/trackLane
://hostapp/DocumentManager/ActiveDocument/MediaPool
://hostapp/DocumentManager/ActiveDocument/MusicPatternPartEditor
://hostapp/DocumentManager/ActiveDocument/ProjectEdit
://hostapp/DocumentManager/ActiveDocument/ProjectEdit/AutomationTrackList/laneSelected.0
://hostapp/DocumentManager/ActiveDocument/ProjectEdit/AutomationTrackList/laneSelected.1
://hostapp/DocumentManager/ActiveDocument/ProjectEdit/CurrentTrack
://hostapp/DocumentManager/ActiveDocument/RecordDiskSpaceObserver
://hostapp/DocumentManager/ActiveDocument/ShowEdit/TransportHandler
://hostapp/DocumentManager/ActiveDocument/SongSetup
://hostapp/DocumentManager/ActiveDocument/TempoEditor
://hostapp/DocumentManager/ActiveDocument/TrackList
://hostapp/DocumentManager/ActiveDocument/TrackList/InputChord/ChordSelector
://hostapp/DocumentManager/ActiveDocument/TrackListInspector
://hostapp/DocumentManager/ActiveDocument/TrackListOverview
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
://hostapp/Studio/ActiveEnvironment/FXMaster/bypassAll
://hostapp/Studio/ActiveEnvironment/HardwareStorageManager
://hostapp/Studio/ActiveEnvironment/MixerConsole
://hostapp/Studio/ActiveEnvironment/PerformanceMonitor/AudioCache
```
</details>

### Mixer Console Access

```javascript
var mixerConsole = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/MixerConsole"
);
```

**MixerConsole properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"MixerConsole"` | Object identifier |
| `title` | `string` | No | `"Console"` | Display name |
| `audioMixer` | `object` | No | — | Audio mixer surface |

**MixerConsole methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getChannelList(type)` | `object` | `type` — channel type (`1`, `2`, or `3`) | Get a channel list by type |

### Channel List

Returned by `getChannelList(type)`.

**Channel List Types:**

| Type | Meaning |
|---|---|
| `1` | Normal (tracks/instruments) |
| `2` | Sub-outs (busses) |
| `3` | Master bus |

**ChannelList properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `numChannels` | `number` | No | `15` | Total channel count |
| `numSelectedChannels` | `number` | No | `1` | Selected channel count |

**ChannelList methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getChannel(index)` | `object` | `index` — 0-based integer | Get channel by index |
| `getSelectedChannel(index)` | `object` | `index` — 0-based integer | Get selected channel by index |

**Mixer channel objects** (returned by `getChannel()` / `getSelectedChannel()`) have the same base surface as [URL objects](#returned-url-objects).

### audioMixer

Accessed via `mixerConsole.audioMixer`.

**audioMixer properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"AudioMixer"` | Object identifier |
| `title` | `string` | No | `"Audio Channels"` | Display name |
| `setup` | `object` | No | — | Mixer setup surface |

**audioMixer methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getOutputPortList()` | `object` | none | Get output ports |
| `getMaxSendSlotCount()` | `number` | none | Maximum send slots |
| `getMaxSlotCount()` | `number` | none | Maximum slots |
| `getMasterSpeakerType()` | `number` | none | Master speaker type |

#### audioMixer setup object

Accessed via `audioMixer.setup`.

**audioMixer.setup properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | — | Object identifier |
| `title` | `string` | No | — | Display name |

**audioMixer.setup methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addChannel(type)` | — | `type` — channel type string (e.g. `"AudioGroup"`) | Create a new mixer channel |
| `focusChannel(channel)` | — | `channel` — channel object | Open/focus the mixer on an existing channel |

### Transport Panel Parameters

The transport panel is accessed through the active document's host application object.

```javascript
var tp = Host.Objects.getObjectByUrl(
  "://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel"
);
```

**Readable and writable parameters:**

| Name | Type | Example | Description |
|---|---|---|---|
| `"loop"` | `flag` | `1` | Loop enabled |
| `"loopEnd"` | `number` | `9.0` | Loop end in beats |
| `"loopLength"` | `number` | `8.0` | Loop length in beats |
| `"loopStart"` | `number` | `1.0` | Loop start in beats |
| `"precount"` | `flag` | `0` | Precount enabled |
| `"punchIn"` | `flag` | `0` | Punch in |
| `"punchOut"` | `flag` | `0` | Punch out |
| `"record"` | `flag` | `0` | Recording state |
| `"tempo"` | `number` | `120.0` | BPM value |

**Read-only parameters:**

| Name | Type | Example | Description |
|---|---|---|---|
| `"primaryTime"` | `object` | — | Current cursor position |
| `"rewind"` | `number` | `0` | Rewind state |
| `"start"` | `number` | `0` | Transport start state |
| `"stop"` | `number` | `1` | Transport stop state |