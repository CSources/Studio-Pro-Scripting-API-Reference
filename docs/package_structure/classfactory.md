---
sidebar_position: 3
---
# classfactory.xml

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

## Core attributes

| Attribute | Description |
|---|---|
| `classID` | Unique GUID — generate with any GUID tool |
| `category` | Script class type |
| `subCategory` | Host context selector |
| `name` | Display name in menus |
| `sourceFile` | JS filename (relative to package root) |
| `functionName` | Function exported by the JS file |

## Optional attributes

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

## category values

| Value | Context |
|---|---|
| `"EditTask"` | Command/action script |
| `"EditAddIn"` | Native add-in panel or toolbar integration |
| `"ExtensionHandler"` | Extension lifecycle handler |
| `"FrameworkService"` | Host-managed service surface, not shown in menus |
| `"Gadget"` | - |

See [Script Interfaces](../script_types/script_interfaces.md) for the minimal interface and lifecycle associated with documented categories.

## subCategory values

| Value | Context |
|---|---|
| `"AudioEdit"` | Audio editor |
| `"EventEdit"` | Arrangement editor events |
| `"Engine"` | Song add-in toolbar panels |
| `"FrameworkService"` | Host-managed service surface, not shown in menus |
| `"MusicEdit"` | Piano view / Note editor |
| `"MusicPartEdit"` | Instrument Part operations |
| `"Project"` | Project add-in toolbar panels |
| `"ProjectEdit"` | Project-level operations |
| `"Show"` | Show add-in toolbar panels |
| `"ShowEdit"` | Show page operations |
| `"TrackEdit"` | Track operations |

## groupName values

| Value | Context |
|---|---|
| `"Song.AddInPanel"` | Song add-in panel strip |
| `"SongOnly.AddInPanel"` | Arrangement-only add-in panel strip |
| `"MusicOnly.AddInPanel"` | Music editor add-in panel strip |
| `"AudioOnly.AddInPanel"` | Audio editor add-in panel strip |
| `"Project.AddInPanel"` | Project page add-in panel strip |
| `"Show.AddInPanel"` | Show page add-in panel strip |

## menuGroup values

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

## ScriptMetaClass (Icon and Resource Binding)

`ScriptMetaClass` binds an icon resource to a script class. The binding is declared in `classfactory.xml` using `<ScriptClassResource>`.

**Icon binding (toolbar buttons and menu items):**

For `EditAddIn` toolbar buttons, the script class uses an addin specific `subCategory` (`"Engine"`, `"Project"`, `"Show"`) with `groupName` for panel location. For `EditTask` menu items, use `menuGroup` for menu categorization.

The image is declared in `skin.xml` as an `<Image>` and referenced from `classfactory.xml` with `theme://$package/...`.

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

## Multiple Scripts from One JS File

A single JavaScript file can export multiple factory functions, each registered as a separate `<ScriptClass>` entry in `classfactory.xml`.

```xml
<classfactory.xml>
<ScriptClass name="Remove Empty Tracks"
  sourceFile="code.js"
  functionName="removeEmpty"/>

<ScriptClass name="Remove Disabled Tracks"
  sourceFile="code.js"
  functionName="removeDisabled"/>
```

```javascript
// code.js
function removeEmpty()    { return new TrackAction("removeEmptyTracks"); }
function removeDisabled() { return new TrackAction("removeDisabledTracks"); }
```