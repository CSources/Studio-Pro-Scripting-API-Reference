---
sidebar_position: 8
---

# Select by Sound Variation

A Studio Pro script for selecting notes in the Note Editor by their Sound Variation name(s).

![Select by Sound Variation](/img/select-sound-variation.png)

<details>

<summary>Click for details</summary>

The **Select by Sound Variation** script in this repository is a working example demonstrating:

- `ListViewModel` with named items populated from `context.editor.activeRegion.soundVariationMap`
- `Host.Signals.advise` to observe selection changes on the list view
- `IParamObserver` and `IController` interfaces for param list integration
- `context.editor.selectFunctions.selectMultiple()` for batch selection of matching notes
- `context.editor.activeRegion.getSoundVariationForNote(note)` for per-note variation lookup

**Source Code Files:**

- [`classfactory.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/select-sound-variation-source/classfactory.xml)
- [`metainfo.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/select-sound-variation-source/metainfo.xml)
- [`main.js`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/select-sound-variation-source/main.js)
- [`skin/skin.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/select-sound-variation-source/skin/skin.xml)

**Key features:**
- Lists all Sound Variations available in the active region's Sound Variation Map
- Supports multi-selection via the list view or direct text entry in the edit box
- Selects matching notes in the Note Editor on apply
- Reports any unmatched variation names via an alert dialog

</details>

[⬇ Download Package](https://raw.githubusercontent.com/CSources/Studio-Pro-Scripting-API-Reference/main/scripts/packages/select-sound-variation/Select%20by%20Sound%20Variation.package)

## Overview

The Select by Sound Variation script reads the Sound Variation Map from the active region and presents the available variation names in a list view. You can select one or more variations, and the script will select all notes in the region that match those variations.

## User Interface Controls

### Variation List

- **Type:** ListView
- **Description:** Displays all named Sound Variations found in the active region's Sound Variation Map. Select one or more entries to target those variations.

### Variation Names (Edit Box)

- **Type:** EditBox
- **Description:** Displays the names of selected variations as a comma-separated list. Can also be typed into directly to target variations by name without using the ListView.

## Value Calculations

### Selection Mapping

The script parses the comma-separated list of variation names entered in the edit box. Each name is matched case-insensitively against variations in the Sound Variation Map.

```javascript
var terms = raw.split(",")
for (var t = 0; t < terms.length; t++) {
  var term = terms[t].trim()
  var lowerTerm = term.toLowerCase()
  // match against svm.lookupVariationByID(id).name
}
```

| Input | Matched Variation Name | Match Type |
|---|---|---|
| `mute` | `Mute` | Case-insensitive |
| `Open` | `open` | Case-insensitive |
| `HALF_MUTE` | `Half_Mute` | Case-insensitive |
| `open, mute` | `Open`, `Mute` | Multiple terms |

### Note Matching

Once target variation indices are identified, the script iterates through the region's notes and selects those that match:

```javascript
var seqIt = region.createSequenceIterator()
while (!seqIt.done()) {
  var note = seqIt.next()
  var idx = region.getSoundVariationForNote(note)
  if (targetIndices[idx]) matching.push(note)
}
```

## Scripting API Notes

### Sound Variation Map Access

The script retrieves the Sound Variation Map from the active region:

```javascript
var svm = region.soundVariationMap
if (svm) {
  for (var id = 0; id < 50; id++) {
    var v = svm.lookupVariationByID(id)
    if (v && typeof v.name === "string" && v.name.length > 0) {
      // add to list
    }
  }
}
```

### Per-Note Variation Lookup

Each note in the region can be queried for its assigned Sound Variation index:

```javascript
var idx = region.getSoundVariationForNote(note)
```

### Multi-Select With Edit Functions

The script uses `createSelectFunctions` to perform a batch select operation:

```javascript
var sf = editor.createSelectFunctions(context.functions)
sf.executeImmediately = true
sf.selectMultiple(matching)
```

### Observer Pattern

The script implements `IObserver` to stay notified of selection changes in the list view. When the selection in the `VariationList` changes, `notify()` is called, which updates the `VariationNames` parameter with the comma-separated names.

```javascript
this.notify = function(subject, msg) {
  if (subject === this.VariationList) {
    var names = []
    var sel = this.VariationList.getSelectedItems()
    // build comma-separated list from selected item names
    this.VariationNames.value = names.join(", ")
  }
}
```

## Usage

1. Select an Instrument Part with Sound Variations assigned.
2. Run the **Select by Sound Variation** script from the Action Menu in the Note Editor or via Find Command (Ctrl/Cmd + K).
3. The dialog opens listing all available Sound Variations from the region's Sound Variation Map.
4. Select one or more variations from the list view (or type variation names directly into the edit box, comma-separated).
5. Click **OK** to apply.
6. Notes matching the selected variations will be selected in the Note Editor.

## Tips

- If the variations list is empty that indicates the active region does not have a Sound Variation Map to reference, select an Instrument Part containing variations.
- Typing names directly in the edit box allows you to target variations without scrolling through the list.