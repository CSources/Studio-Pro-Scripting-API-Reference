---
sidebar_position: 6
---

# Marker Creator

A non-blocking workspace panel for creating named markers during playback with a 4×4 button grid.

![Marker Creator](/img/marker-creator.png)

<details>

<summary>Click for details</summary>

The **Marker Creator** script in this repository is a working example demonstrating:

- `FrameworkService` + `WindowClass` registration for non-blocking workspace panels
- `Host.Objects.registerObject()` for binding a script controller to a WindowClass
- `skin.xml` with `WindowClasses`, `View`, `Button`, `TriggerView`, `TextBox`, `Slider`, `ValueBox`, `SelectBox`, `Toggle`, `DialogGroup`, `Label`, `Space`, and `Image` resources
- `View` + `Button` + `TriggerView` overlay pattern for simultaneous left-click (marker creation) and right-click (rename dialog) handling
- SVG icons on toolbar buttons (`Undo`, `Redo`, `Save`, `Clear`, `Auto #`)
- `TriggerView` + `Invoker` pattern for right-click rename dialog handling on individual buttons
- `Host.GUI.Commands.interpretCommand("Marker", "Insert Named")` with attributes
- `Host.GUI.Commands.interpretCommand("Edit", "Undo")` / `"Redo"` for undo/redo
- `Host.GUI.runDialog()` for the secondary rename popup form.
- `Host.GUI.ask()` for confirmation dialogs
- `CCL:FileSelector` for native save dialogs
- Preset save/load via `Host.IO.createTextFile()` / `Host.IO.openTextFile()`
- `Host.Objects.getObjectByUrl()` to access the TransportPanel for cursor-based marker offset
- Dynamic frame rate scaling for offset calculation (23.976–60 fps)
- Dynamic control dimming via `param.enabled`: empty grid buttons are dimmed, and the Frame Rate selector dims when offset unit is set to ms

**Source Code Files:**

- [`classfactory.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/classfactory.xml)
- [`metainfo.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/metainfo.xml)
- [`main.js`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/main.js)
- [`skin/skin.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/skin/skin.xml)
- [`skin/images/undo.svg`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/skin/images/undo.svg)
- [`skin/images/redo.svg`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/skin/images/redo.svg)
- [`skin/images/save.svg`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/skin/images/save.svg)
- [`skin/images/clear.svg`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/skin/images/clear.svg)
- [`skin/images/number.svg`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/marker-creator-source/skin/images/number.svg)

**Key features:**
- 4×4 grid of 16 named marker buttons with dynamic names via `titlename`
- Left-click creates a marker at the current cursor position with the slot's name
- Right-click opens a rename dialog for the slot
- Preset save/load system with native file dialogs
- Undo/Redo buttons
- Auto-numbering toggle for creating numbered duplicate markers
- Offset slider to compensate for reaction delay (ms or frames)
- 13 selectable frame rates for frame-based offset (23.976–60 fps)

</details>

[⬇ Download Package](https://raw.githubusercontent.com/CSources/Studio-Pro-Scripting-API-Reference/main/scripts/packages/marker-creator/Marker%20Creator.package)

## Overview

The Marker Creator is a non-blocking workspace panel that provides a 4×4 grid of buttons, each associated with a text name. During playback, click a button to instantly create a named marker at the cursor position. Right-click any button to rename it. The panel uses the `FrameworkService` + `WindowClass` pattern, so it runs alongside Studio Pro's native UI without blocking it.

## Registration Pattern

Unlike typical `EditTask` scripts that use modal dialogs (`context.runDialog()`), the Marker Creator is registered as a `FrameworkService` with a `WindowClass` form:

**classfactory.xml:**
```xml
<ScriptClass
    classID="{B1A2B3C4-0003-4000-8000-000000000030}"
    category="FrameworkService"
    name="Marker Creator Service"
    sourceFile="main.js"
    functionName="createInstance"/>
```

The controller registers itself as a named host object in `initialize()`:

```javascript
Host.Objects.registerObject(this, "MarkerCreatorController")
```

The `skin.xml` defines a `<WindowClass>` that references this controller:

```xml
<WindowClass name="MarkerCreatorPanel"
    title="Marker Creator"
    controller="MarkerCreatorController"
    form.name="MarkerCreatorForm"
    command.category="Marker" command.name="Marker Creator"
```

The form is rendered as a non-blocking workspace window toggleable from Find Command: **Marker Creator**. Can also be assigned to a keyboard shortcut under command category "Marker > Marker Creator".

## User Interface Controls

### Toolbar

| Control | Type | Description |
|---------|------|-------------|
| Undo | Button (SVG) | Executes `Edit > Undo` to revert the last marker creation |
| Redo | Button (SVG) | Executes `Edit > Redo` |
| Preset List | SelectBox | Select and load a saved preset. "(No Preset)" clears all names |
| Save | Button (SVG) | Opens a save dialog to export all 16 names as a `.markerslots` file |
| Clear | Button (SVG) | Clears all 16 slot names. Shows a confirmation dialog before clearing |
| Auto # | Toggle (SVG) | When enabled, repeatedly using the same slot appends a number ("Hit 2", "Hit 3") |

### 4×4 Button Grid

16 buttons, each bound to a `StringParam` via `titlename`. The param's value is set by `updateBtnStates()`:

- **Slot has a name:** Button shows the name, button is enabled, click creates a marker
- **Slot is empty:** Button shows the slot number (1–16), button is disabled

Right-click any button to open the rename dialog. The right-click is handled by a `TriggerView` overlaid on the button via `size` positioning.

### Offset Controls

| Control | Type | Description |
|---------|------|-------------|
| Offset Slider | Slider | 0 (no offset) to 1000 ms / selected frame rate (max offset). Bargraph option shows fill line |
| ValueBox | ValueBox | Displays the offset as a negative value (e.g., `-120`) to indicate backward placement |
| Unit Selector | SelectBox | Choose between `ms` and `Frames` |
| Frame Rate | SelectBox | 13 frame rates matching Studio Pro's Session Setup: 23.976, 24, 24.975, 25, 29.97 dfps, 29.97, 30 dfps, 30, 50, 59.94 dfps, 59.94, 60 dfps, 60 fps |

### Rename Dialog

A modal dialog (`Host.GUI.runDialog`) with a single edit box. Opens on right-click. Pre-filled with the current name. Uses `firstfocus="RenameText"` for immediate typing.

## Offset Calculation

The offset compensates for reaction delay by placing the marker **before** the cursor position:

1. Read the current cursor position from the TransportPanel via `Host.Objects.getObjectByUrl()`
2. Move the cursor backward by the offset amount
3. Create the marker at the new cursor position
4. Restore the cursor to its original position

> **Note:** Moving the cursor during active playback will cause a brief audible and visual stutter. This is inherent to the cursor-move approach — use offset at 0 for no-stutter operation.

```javascript
var tp = Host.Objects.getObjectByUrl("://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel")
var cursor = tp ? tp.findParameter("primaryTime") : null
if (cursor) {
    var curPos = cursor.value
    cursor.setValue(curPos + offsetSec, true)  // move backward
}
// create marker...
cursor.setValue(curPos - offsetSec, true)  // restore
```

### Unit Conversion

The offset amount is converted to seconds based on the selected unit:

| Unit | Formula | Example |
|------|---------|---------|
| ms | `offsetVal / 1000` | 500 ms = 0.5 seconds |
| Frames | `offsetVal / fps` | 15 frames @ 30fps = 0.5 seconds |

The slider range is 0–1000. The ValueBox displays a negated value (`-500` for 500ms offset). When switching between ms and frames, the value rescales so max slider always equals ~1 second of compensation.

### Dual-Param Slider

The slider and ValueBox use separate parameters to allow the slider to increase left→right while the ValueBox shows a negative value:

```javascript
// Slider param: 0 to 1000
this.OffsetSlider = this.paramList.addInteger(0, 1000, "OffsetSlider")
// ValueBox param: -1000 to 0  
this.OffsetMs = this.paramList.addInteger(-1000, 0, "OffsetMs")

// Sync in paramChanged:
if (param && param.name === "OffsetSlider") {
    var sv = this.OffsetSlider.value
    var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
    if (isFrames)
        this.OffsetMs.value = -Math.round(sv * this.getFrameRateValue() / 1000)
    else
        this.OffsetMs.value = -sv
}
```

A `_offsetSyncing` guard flag prevents update loops when the ValueBox drag adjusts the slider position and vice versa.

## Frame Rate Parsing

Frame rates are parsed from the SelectBox string using a regex to extract the numeric value:

```javascript
this.getFrameRateValue = function() {
    var fpsStr = this.FrameRateList ? this.FrameRateList.string : ""
    var m = fpsStr.match(/(\d+\.?\d*)/)
    return m ? parseFloat(m[1]) : 30
}
```

Both `"29.97 dfps"` and `"29.97 fps"` correctly resolve to `29.97`. 

### Dynamic Dimming

The Frame Rate dropdown is dimmed via `param.enabled = 0` when the unit is set to `ms`, since the frame rate is not used in ms mode. This is handled by `updateFrameRateDim()`:

```javascript
this.updateFrameRateDim = function() {
    if (this.FrameRateList)
        this.FrameRateList.enabled = (this.OffsetUnit && this.OffsetUnit.value === 1) ? 1 : 0
}
```

Similarly, empty grid buttons are dimmed (`SlotBtn.enabled = 0`) to visually indicate they have no name assigned and won't create a marker on click. This demonstrates using `param.enabled` to control visual dimming of controls based on application state.

## Button Right-Click Pattern

The button grid uses a **View + Button + TriggerView overlay** pattern to handle both left-click (marker creation) and right-click (rename):

```xml
<View width="75" height="22">
    <Button name="SlotBtn0" titlename="SlotDisplay0" size="0,0,75,22" style="Standard.AddIn.Button"/>
    <TriggerView style="Ctx0" size="0,0,75,22"/>
</View>
```

The `Ctx0` style defines the right-click handler:

```xml
<Style name="Ctx0">
    <Triggers>
        <Trigger event="onContextMenu">
            <Invoker target="controller" name="onSlotCtx0"/>
        </Trigger>
    </Triggers>
</Style>
```

The `size="0,0,75,22"` attribute on both the Button and TriggerView positions them at the same coordinates, overlaying the transparent TriggerView on top of the visible Button. Only `onContextMenu` is defined on the TriggerView, so left-clicks pass through to the Button's `paramChanged`.

## Auto-Numbering

When the Auto # toggle is enabled, repeated use of the same button appends an incrementing number:

```javascript
if (this.AutoNumBtn && this.AutoNumBtn.value === 1) {
    if (!this.autoNumCounts[name]) this.autoNumCounts[name] = 0
    this.autoNumCounts[name]++
    if (this.autoNumCounts[name] > 1)
        markerName = name + " " + this.autoNumCounts[name]
}
```

The counter is per-name, so using two different slots with the same name still increments.

## Preset Save/Load

The preset system uses a line-based file format (one name per line, `---END---` terminator) stored as `.markerslots` files:

```javascript
// Save
for (var i = 0; i < names.length; i++)
    file.writeLine(names[i])
file.writeLine("---END---")
```

```javascript
// Load
while (!file.endOfStream) {
    var line = file.readLine()
    if (line === "---END---") break
    loaded.push(line)
}
```

The `CCL:FileSelector` provides the native save dialog with a `.markerslots` filter. The preset directory is created automatically on first save — `Host.IO.createTextFile()` builds any missing parent directories.

## Slot Display States

The `updateBtnStates()` function manages what each button shows:

```javascript
this.updateBtnStates = function() {
    for (var i = 0; i < kSlots; i++) {
        var name = this["SlotName" + i] ? this["SlotName" + i].string : ""
        if (name && name !== "")
            this["SlotDisplay" + i].string = name
        else
            this["SlotDisplay" + i].string = String(i + 1)
        this["SlotBtn" + i].enabled = (name && name !== "") ? 1 : 0
    }
}
```

- **Named slot:** Shows the name, button enabled, click creates marker
- **Empty slot:** Shows the slot number (1–16), button disabled

This function is called after rename, load, clear, and on initialize.

## Scripting API Notes

### FrameworkService Requirements

A `FrameworkService` controller for WindowClass panels must include at minimum the IComponent interface:

```javascript
this.interfaces = [
    Host.Interfaces.IComponent
]
```

### WindowClass Binding

The controller must register itself and implement `findParameter()`:

```javascript
Host.Objects.registerObject(this, "MarkerCreatorController")
```

```javascript
this.findParameter = function(name) {
    // Return params for all named controls in the form
    if (name === "PresetList") return this.PresetList
    if (name === "SaveBtn") return this.SaveBtn
    // ...etc
    for (var i = 0; i < kSlots; i++) {
        if (name === "SlotName" + i) return this["SlotName" + i]
        if (name === "SlotDisplay" + i) return this["SlotDisplay" + i]
        if (name === "SlotBtn" + i) return this["SlotBtn" + i]
    }
    return null
}
```

### SVG Icons

SVG files in `skin/images/` are referenced via `<Resources>` and applied to buttons with the `icon` attribute:

```xml
<Resources>
    <Image name="UndoIcon" url="images/undo.svg"/>
</Resources>
...

<Button name="UndoBtn" title="" icon="UndoIcon" width="24" height="22" tooltip="Undo last action"/>
```

### Rename Dialog

The rename dialog is opened via `Host.GUI.runDialog()` with a separate controller:

```javascript
var dlg = new RenameDialogController(currentName)
dlg.initialize()
var theme = Host.GUI.Themes.getTheme(kPackageID)
var result = Host.GUI.runDialog(theme, "RenameDialog", dlg)
if (result === Host.GUI.Constants.kOkay && dlg.RenameText) {
    this["SlotName" + idx].string = dlg.RenameText.string
}
dlg.terminate()
```

## Usage

1. Open Find Command **(Ctrl/Cmd + K)**: then search and select "Marker Creator" to open the panel.
2. Right-click any button to rename it. Type the desired marker name and click OK.
3. During playback, click a named button to create a marker at the current cursor position.
4. Use the **Offset** slider to compensate for reaction delay (negative values = marker is placed before the cursor).
5. Enable **#** to auto-number repeated markers.
6. **Save** your 16 names as a preset for reuse, **Load** via the preset SelectBox to restore.
7. Use **Undo** / **Redo** to revert/restore marker creation.
8. **Clear** (with confirmation) to wipe all slot names.

## Tips

- The panel is non-blocking — you can interact with Studio Pro while it's open.
- Create multiple named presets for different songs or use cases (Film Scoring, Dialog, Sound Design)
- Adjust the frame rate in the offset controls to match your project's Session Setup Frame Rate for accurate frame-based offset.
- The Clear button shows a confirmation dialog — the "(No Preset)" SelectBox option does not, save before selecting it.

---

> **Development Note:** This script and its documentation were developed with the assistance of agentic coding tools.
