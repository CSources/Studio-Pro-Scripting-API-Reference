---
sidebar_position: 2
---
# CCL

After including `resource://{main}/sdk/cclapp.js`, the `CCL.JS` namespace provides runtime helpers and constants.

```javascript
include_file("resource://{main}/sdk/cclapp.js");
```

## Constants

### Columns

`CCL.JS.Columns` provides column flag constants for `list.columns.addColumn()`:

| Constant | Value | Description |
|---|---|---|
| `CCL.JS.Columns.kIconID` | `"icon"` | Field name for icon column |
| `CCL.JS.Columns.kTitleID` | `"title"` | Field name for title column |
| `CCL.JS.Columns.kCheckBoxID` | `"check"` | Field name for checkbox column |
| `CCL.JS.Columns.kSizable` | `1` | Column width is resizable |
| `CCL.JS.Columns.kMoveable` | `2` | Column can be reordered |
| `CCL.JS.Columns.kSortable` | `32` | Column is sortable by click |
| `CCL.JS.Columns.kCanFit` | `64` | Column can stretch to fit available space |

### Document Events

`CCL.JS.DocumentEvent` provides document lifecycle event constants:

| Constant | Value |
|---|---|
| `CCL.JS.DocumentEvent.kCreated` | `0` |
| `CCL.JS.DocumentEvent.kBeforeLoad` | `1` |
| `CCL.JS.DocumentEvent.kLoadFinished` | `2` |
| `CCL.JS.DocumentEvent.kLoadFailed` | `3` |
| `CCL.JS.DocumentEvent.kBeforeSave` | `4` |
| `CCL.JS.DocumentEvent.kSaveFinished` | `5` |
| `CCL.JS.DocumentEvent.kClose` | `6` |
| `CCL.JS.DocumentEvent.kActivate` | `7` |
| `CCL.JS.DocumentEvent.kDeactivate` | `8` |
| `CCL.JS.DocumentEvent.kViewActivated` | `9` |
| `CCL.JS.DocumentEvent.kDestroyed` | `10` |
| `CCL.JS.DocumentEvent.kBeforeAutoSave` | `11` |
| `CCL.JS.DocumentEvent.kAutoSaveFinished` | `12` |

### Signal/Event Name Constants

| Constant | Value |
|---|---|
| `CCL.JS.kChanged` | `"changed"` |
| `CCL.JS.kExtendMenu` | `"extendMenu"` |
| `CCL.JS.kRequestFocus` | `"requestFocus"` |
| `CCL.JS.kSelectionChanged` | `"selectionChanged"` |
| `CCL.JS.kItemOpened` | `"itemOpened"` |
| `CCL.JS.kItemFocused` | `"itemFocused"` |
| `CCL.JS.kEditItemCell` | `"editItemCell"` |
| `CCL.JS.kCommandSelected` | `"commandSelected"` |
| `CCL.JS.kOpenFile` | `"openFile"` |
| `CCL.JS.kWindowOpened` | `"WindowOpened"` |
| `CCL.JS.kWindowClosed` | `"WindowClosed"` |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `CCL.JS.getApplication()` | `object` | none | Get the application object (`.name`, `.title`, `.parent`) |
| `CCL.JS.getWindowManager()` | `object` | none | Get the window manager object |
| `CCL.JS.ResourceUrl(fileName, isFolder)` | `object` | `fileName` — resource file name, `isFolder` — whether it's a directory | Create a resource URL (returns a `Host.Url`-like object) |
| `CCL.JS.LegalFileName(fileName)` | `string` | `fileName` — raw file name | Sanitize a file name for the filesystem |
| `CCL.JS.variantToBool(value)` | `boolean` | `value` — value to convert | Convert a host variant to a JavaScript boolean |
| `CCL.JS.Component()` | — | none | Component factory function |