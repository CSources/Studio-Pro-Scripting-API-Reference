---
sidebar_position: 2
---
# Classes

`Host.Classes` provides class creation and inspection helpers.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Classes.createInstance(classID)` | `object` | `classID` — class identifier string | Create an instance of a built-in class |
| `Host.Classes.getClassDescription(classID)` | `object` | `classID` — class identifier string | Get the class description object |
| `Host.Classes.newIterator()` | `object` | none | Create a new empty iterator |

## Instantiable built-in classes

- [`CCL:CommandBarModel`](#cclcommandbarmodel)
- [`CCL:CommandBarView`](#cclcommandbarview)
- [`CCL:CommandSelector`](#cclcommandselector)
- [`CCL:FileSelector`](#cclfileselector)
- [`CCL:ParamList`](#cclparamlist)
- [`CCL:ProgressDialog`](#cclprogressdialog)
- [`Host:ListViewModel`](#hostlistviewmodel)
- [`Host:PresetParam`](#hostpresetparam)

## `CCL:CommandBarModel`

`CCL:CommandBarModel` is the data model for a macro-style toolbar with pages and items. Created via `Host.Classes.createInstance("CCL:CommandBarModel")`.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getRootItem()` | `object` | none | Get the root item (type `"Root"`, contains pages) |
| `getParentItem(item)` | `object` | `item` — child item | Get the parent of an item |
| `createPage(id)` | `object` | `id` — page identifier string | Create a new page item (type `"Page"`). Has the same properties and methods as rootItem. |
| `getPage(index)` | `object` | `index` — 0-based page index | Get a page by index |
| `countPages()` | `number` | none | Number of pages |
| `addItem(item, parent)` | — | `item` — item object, `parent` — parent item | Add an item to the model |
| `invalidate()` | — | none | Refresh the view |
| `loadItemFromFile(path)` | `object` | `path` — `Host.Url` path to a `.macropage` file | Load a macro page from file |
| `saveToFile(path)` | — | `path` — `Host.Url` destination | Save the model to a file |
| `loadFromFile(path)` | — | `path` — `Host.Url` source | Load the model from a file |
| `checkItemsIDs()` | — | none | Validate item IDs |

**Root item properties (from `getRootItem()`):**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | Yes | `""` | Item name |
| `title` | `string` | Yes | `"My Tools"` | Display title |
| `type` | `string` | No | `"Root"`, `"Page"` | Item type identifier |
| `id` | `string` | Yes | `"myPage"` | Item identifier |
| `layout` | `string` | Yes | `""` | Layout definition |
| `revision` | `number` | No | `0` | Revision number |
| `numChilds` | `number` | No | `0` | Number of child items |
| `flags` | `number` | No | `0` | Behavior flags |
| `isReadOnly` | `number` | No | `0` | Read-only flag |
| `isTemporary` | `number` | No | `0` | Temporary flag |
| `isLeftClickContextMenu` | `number` | No | `0` | Context menu on left click |

**Root item methods:**

Returned by `getRootItem()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addChildItem(item)` | — | `item` — child item object | Add a child item |
| `removeChildItem(item)` | — | `item` — child item object | Remove a child item |
| `removeAll()` | — | none | Remove all children |
| `getChildItem(index)` | `object` | `index` — 0-based index | Get a child by index |
| `getChildIndex(item)` | `number` | `item` — child item | Get child index |
| `cloneItem()` | `object` | none | Clone the item |
| `saveToFile(path)` | — | `path` — `Host.Url` destination | Save item to file |

```javascript
var model = Host.Classes.createInstance("CCL:CommandBarModel");
var root = model.getRootItem();

var page = model.createPage("myPage");
page.title = "My Tools";
root.addChildItem(page);

var item = model.createPage("myButton");
item.title = "Do Something";
page.addChildItem(item);

model.invalidate();
```

## `CCL:CommandBarView`

`CCL:CommandBarView` is a view component that renders a `CCL:CommandBarModel` as a toolbar UI. Created via `Host.Classes.createInstance("CCL:CommandBarView")`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `""` | View name |
| `title` | `string` | No | `""` | Display title |
| `parent` | `object` | No | — | Parent object |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `dragItem(item)` | — | `item` — item object | Initiate drag for a toolbar item |

```javascript
var view = Host.Classes.createInstance("CCL:CommandBarView");
view.name = "myToolbar";
```

## `CCL:CommandSelector`

`CCL:CommandSelector` provides a command selection UI for choosing and configuring commands. Created via `Host.Classes.createInstance("CCL:CommandSelector")`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | Yes | `"CommandSelector"` | Component name (write-only) |
| `argColumnEnabled` | — | Yes | `true` | Enable argument column (write-only) |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addExcludedCategory(category)` | — | `category` — category string | Exclude a command category from the selector |

**Signals (sent by CommandSelector, received in `notify`):**

The CommandSelector is added to an `IObjectNode` panel's `children` array and binds to skin elements via `<using controller="CommandSelector">`. Selection signals are sent by the CommandSelector and received through `IObserver.notify()` after calling `Host.Signals.advise(commandSelector, this)`.

**Signals:**

| Signal ID | Retrieves command via | Description |
|---|---|---|
| `"commandSelected"` | `getArg(0)` | Fires when a command is confirmed (double-click/Enter) |
| `"commandFocused"` | `getArg(0)` | Fires when a command is focused/highlighted in the tree |
| `"propertyChanged"` | `getArg(0)` — property name | Fires when search/filter state changes |

**Command object:**

Returned by `getArg(0)` in `commandFocused`/`commandSelected`.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"Keyboard Shortcuts"` | Command display name |
| `category` | `string` | No | `"Application"` | Command category |
| `classID` | `string` | No | `"{5EB7D908-...}"` | Command class ID (GUID) |
| `arguments` | `string` | No | `"InitialCategory,InitialCommand"` | Comma-separated argument names |

**skin.xml Snippet:**
```xml
<using controller="CommandSelector">
  <EditBox name="searchString" width="500" height="20" options="border immediate" attach="left right"/>
  <TreeView name="commandTree" width="500" options="autoexpand exclusive noroot noicons nodrag selectfullwidth selection" scrolloptions="transparent autohideboth" attach="all"/>
</using>
```

**scriptname.js Snippet:**
```javascript
var sel = Host.Classes.createInstance("CCL:CommandSelector");
sel.name = "CommandSelector";
sel.argColumnEnabled = true;
this.children.push(sel);
Host.Signals.advise(sel, this);

this.notify = function(subject, msg) {
    if (msg.id === "commandSelected") {
        var cmd = msg.getArg(0);
    }
    if (msg.id === "commandFocused") {
        var cmd = msg.getArg(0);
        if (cmd) this._selectedCmd = cmd;
    }
};
```

## `CCL:FileSelector`

`CCL:FileSelector` displays a native OS file dialog for opening or saving files. Created via `Host.Classes.createInstance("CCL:FileSelector")`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `fileName` | `string` | Yes | `"export.txt"` | Default file name for save dialogs |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addFilter(fileType)` | — | `fileType` — object with `.extension` and `.description` | Add a file type filter |
| `countPaths()` | `number` | none | Number of selected paths (for multi-select) |
| `getPath()` | `object` | none | Get selected file path as a `Host.Url` object |
| `runOpen(title)` | `number` | `title` — dialog title | Show an open file dialog. Returns `1` if a file was selected, `0` if cancelled. |
| `runSave(title)` | `number` | `title` — dialog title | Show a save file dialog. Returns `1` if saved, `0` if cancelled. |
| `setFileName(name)` | — | `name` — file name string | Set the default file name |
| `setFolder(folder)` | — | `folder` — folder path (string or Url) | Set the default folder |

```javascript
var fs = Host.Classes.createInstance("CCL:FileSelector");
fs.addFilter({ extension: "txt", description: "Text Files" });
fs.addFilter({ extension: "xml", description: "XML Files" });
fs.setFileName("output.txt");

var result = fs.runOpen("Select a file");
if (result === 1) {
    var path = fs.getPath();
    // path.url  → "file:///Users/.../file.txt"
    // path.name → "file.txt"
}
```

## `CCL:ParamList`

`CCL:ParamList` is created via `Host.Classes.createInstance("CCL:ParamList")` and is used for persistent dialogs and panels that remain open across multiple interactions.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `controller` | `object` | Yes | `this` | Controller object for dialog parameter bindings |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addColor(name)` | `object` | `name` — parameter name | Add a color picker parameter |
| `addCommand(cat, name, id)` | `object` | `cat` — category, `name` — command name, `id` — identifier | Add a command binding parameter |
| `addFloat(min, max, name)` | `object` | `min` — minimum, `max` — maximum, `name` — parameter name | Add a float slider or editbox |
| `addInteger(min, max, name)` | `object` | `min` — minimum, `max` — maximum, `name` — parameter name | Add an integer slider or editbox |
| `addList(name)` | `object` | `name` — parameter name | Add a list / dropdown parameter |
| `addMenu(name)` | `object` | `name` — parameter name | Add a dropdown menu parameter |
| `addParam(name)` | `object` | `name` — parameter name | Add a generic parameter (button trigger) |
| `addString(name)` | `object` | `name` — parameter name | Add a string editbox parameter |
| `remove(name)` | — | `name` — parameter name | Remove a parameter from the list |

**Individual Param Properties (returned by `add*` methods):**

All individual params share these 10 properties. The `value` type varies by param kind (number for numeric types, string for string params).

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `type` | `number` | No | `1` | Internal type: `0`=button, `1`=integer, `2`=float, `3`=string, `4`=list/menu, `5`=command, `6`=color |
| `value` | varies | Yes | `42` | Current value (number or string depending on type) |
| `min` | `number` | No | `0` | Minimum allowed value |
| `max` | `number` | No | `127` | Maximum allowed value |
| `default` | varies | No | `0` | Default value |
| `name` | `string` | No | `"MyParam"` | Parameter name |
| `string` | `string` | Yes | `"50"` | String representation of the current value |
| `enabled` | `flag` | Yes | `0` | Enable state (`1` = enabled) |
| `signalAlways` | `flag` | Yes | `0` | Signal on every change (`1` = on) |
| `reverse` | `flag` | Yes | `0` | Reverse display (`1` = reversed) |

Color params (type `6`) also support a `palette` property for assigning a color palette, such as `Host.Engine.TrackColorPalette`. Setting `palette = null` clears the palette.

**Individual Param Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setValue(val)` | — | `val` — new value | Set value programmatically |
| `setFormatter(formatter)` | — | `formatter` — formatter object | Set a display formatter |
| `appendString(text)` | — | `text` — item text | Add an item to a list/menu param |
| `removeAll()` | — | none | Clear all items from a list/menu param |

**Required interfaces:** `IController`, `IParamObserver`.

```javascript
function MyTask() {
  var kPackageID = "com.your.packageid";

  this.interfaces = [
    Host.Interfaces.IEditTask,
    Host.Interfaces.IController,
    Host.Interfaces.IParamObserver
  ];

  this.paramList = Host.Classes.createInstance("CCL:ParamList");
  this.paramList.controller = this;

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
      param.value = 0;
    }
  };

  this.performEdit = function(context) {
    var theme = Host.GUI.Themes.getTheme(kPackageID);
    Host.GUI.runDialog(theme, "FormName", this);
    return Host.Results.kResultOk;
  };
}
```

## `CCL:ProgressDialog`

`CCL:ProgressDialog` displays a modal progress dialog with status text and a progress bar. Created via `Host.Classes.createInstance("CCL:ProgressDialog")`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `title` | `string` | Yes | `"Processing..."` | Dialog window title |
| `text` | `string` | Yes | `"Step 3 of 10"` | Status text displayed in the dialog |
| `value` | `number` | Yes | `0.5` | Progress bar position (`0.0` = empty, `1.0` = full) |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `beginProgress()` | — | none | Show the progress dialog |
| `endProgress()` | — | none | Close the progress dialog |

```javascript
var progress = Host.Classes.createInstance("CCL:ProgressDialog");
progress.title = "Quantizing Events";
progress.text = "Starting...";
progress.beginProgress();

var total = 100;
for (var i = 0; i < total; i++) {
    progress.text = "Processing event " + (i + 1) + " of " + total;
    progress.value = (i + 1) / total;
    // ... do work ...
}

progress.text = "Complete";
progress.endProgress();
```

## `Host:ListViewModel`

`Host:ListViewModel` is the script-owned data model used to populate a `ListView`, created via `Host.Classes.createInstance("Host:ListViewModel")`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `itemCount` | `number` | No | `itemCount` | Current number of items in the list |
| `columns` | `object` | No | `columns.addColumn(...)` | Column definition surface |
| `itemView` | `object` | No | `itemView.setFocusItem(index, scroll)` | Item view reference (null until model is attached to a rendered dialog via `Host.GUI.runDialog()`) |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `newItem(id)` | `object` | `id` — item identifier | Create a new list item with a `.details` surface for custom fields |
| `addItem(item)` | — | `item` — item object from `newItem()` | Add an item to the list |
| `removeItem(item)` | — | `item` — item object to remove | Remove an item from the list |
| `getItem(index)` | `object` | `index` — 0-based index | Get an item by index |
| `getFocusItem()` | `object` | none | Get the currently focused item |
| `getSelectedItems()` | `object` | none | Get selection object with `.count` and `.newIterator()` for traversal |
| `changed()` | — | none | Notify the view that the model has changed (refresh UI) |
| `doPopup()` | — | none | Open the list's context popup |
| `addTitleSorter()` | — | none | Add title-based sorting |
| `addDetailSorter()` | — | none | Add detail-based sorting |

**Columns:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addColumn(width, title, field, columnWidth, flags)` | — | `width` — column width, `title` — display title, `field` — data field name, `columnWidth` — width value, `flags` — bitmask of `CCL.JS.Columns.*` constants | Add a column definition to the list |

Column flags are defined in `CCL.JS.Columns` (after `include_file("resource://{main}/sdk/cclapp.js")`):

| Flag | Value | Description |
|---|---|---|
| `CCL.JS.Columns.kSizable` | `1` (`0x0001`) | Column width is resizable |
| `CCL.JS.Columns.kMoveable` | `2` (`0x0002`) | Column can be reordered |
| `CCL.JS.Columns.kSortable` | `32` (`0x0020`) | Column is sortable by click |
| `CCL.JS.Columns.kCanFit` | `64` (`0x0040`) | Column can stretch to fit available space |

Combine flags with bitwise OR: `CCL.JS.Columns.kSizable | CCL.JS.Columns.kSortable`, or use hex values like `0x0021` (= `kSizable | kSortable`).

**itemView:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setFocusItem(index, scroll)` | — | `index` — 0-based item index, `scroll` — whether to scroll into view (`true` or `false`) | Set keyboard focus to an item and optionally scroll it into view |

**Observe changes:**
```javascript
Host.Signals.advise(list, this);
Host.Signals.unadvise(list, this);
```

**Populate rows example:**
```javascript
var list = Host.Classes.createInstance("Host:ListViewModel");
var item = list.newItem("item1");
item.details.myField = "value";
list.addItem(item);
list.changed();
```

## `Host:PresetParam`

`Host:PresetParam` is a host-backed preset-selection object created via `Host.Classes.createInstance("Host:PresetParam")`. It shares the same 10-property surface as other param objects but adds preset-management methods.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `type` | `number` | No | `4` | Internal type (always `4` for preset params) |
| `value` | `number` | Yes | `2` | Current selected index |
| `min` | `number` | No | `0` | Minimum allowed index |
| `max` | `number` | No | `0` | Maximum allowed index (updates as items are added) |
| `default` | `number` | No | `0` | Default value |
| `name` | `string` | No | `""` | Parameter name |
| `string` | `string` | Yes | `"Selected"` | String representation of current selection |
| `enabled` | `flag` | Yes | `1` | Enable state (`1` = enabled) |
| `signalAlways` | `flag` | Yes | `1` | Signal on every change (`1` = on) |
| `reverse` | `flag` | Yes | `0` | Reverse display (`1` = reversed) |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `appendString(text)` | — | `text` — preset label string | Add a preset entry by display name |
| `appendValue(value)` | — | `value` — preset value | Add a preset entry by value |
| `fromString(text)` | — | `text` — preset label string | Select a preset by its display name |
| `getNormalized()` | `number` | none | Get the current value as a normalized float (0–1) |
| `getSelectedValue()` | `string` | none | Get the currently selected preset's stored value |
| `getValueAt(index)` | `string` | `index` — entry index (0-based) | Get the value at a given index |
| `isType(type)` | `number` | `type` — value to test | Check whether the parameter matches a given type |
| `removeAll()` | — | none | Clear all preset entries |
| `selectRelativePath(path)` | — | `path` — relative preset path string | Select an entry by relative preset path |
| `selectValue(value)` | — | `value` — preset value to select | Select an entry by its stored value |
| `setCurve(value)` | — | `value` — curve value | Set the parameter curve |
| `setFormatter(formatter)` | — | `formatter` — formatter object | Set a display formatter |
| `setMetaInfo(attrs)` | — | `attrs` — `Host.Attributes(...)` object | Set metadata used to populate or filter preset content |
| `setNormalized(value)` | — | `value` — normalized float (0–1) | Set the value using a normalized float |
| `setSignalAlways(value)` | — | `value` — `1` to enable, `0` to disable | Set whether the param signals on every change |
| `setValue(val)` | — | `val` — index or value | Set the current selection |
| `shouldShowFolders(value)` | — | `value` — `1` to show, `0` to hide | Control whether preset folders are shown |