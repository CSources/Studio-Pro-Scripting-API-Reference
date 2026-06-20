---
sidebar_position: 4
---
# GUI

`Host.GUI` provides command execution, dialog management, clipboard, theme, desktop window, and help tutorial services.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `Clipboard` | `object` | No | `Host.GUI.Clipboard.setText(text)` | Text clipboard read/write |
| `Commands` | `object` | No | `Host.GUI.Commands.interpretCommand(...)` | Command execution, discovery, and management |
| `Constants` | `object` | No | `Host.GUI.Constants.kYes` | Mouse button, modifier, dialog, and alert constants |
| `Desktop` | `object` | No | `Host.GUI.Desktop.closeTopModal()` | Desktop window and modal management |
| `Help` | `object` | No | `Host.GUI.Help.showLocation("Console")` | Reference manual navigation and UI focus effects |
| `Themes` | `object` | No | `Host.GUI.Themes.getTheme(pkgID)` | Theme/skin retrieval for dialogs |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.GUI.alert(msg)` | — | `msg` — any value (auto-stringified) | Show a modal alert dialog |
| `Host.GUI.ask(msg)` | — | `msg` — question string | Show a Yes/No dialog; compare result to `Host.GUI.Constants.kYes` |
| `Host.GUI.keyStateToString(mask)` | `string` | `mask` — modifier key bitmask | Format modifier keys for display (e.g. `"Command+Shift"`) |
| `Host.GUI.openUrl(url)` | — | `url` — `Host.Url` path | Open a local file or URL in the host |
| `Host.GUI.runDialog(theme, formName, controller)` | — | `theme` — theme object, `formName` — form name, `controller` — controller object | Open a skin.xml dialog (blocking) |
| `Host.GUI.runDialogWithParameters(params, title)` | — | `params` — param list, `title` — dialog title | Open a parameter dialog with a param list |
| `Host.GUI.showFile(url)` | — | `url` — `Host.Url` path | Reveal a file in the host |

## Clipboard

`Host.GUI.Clipboard` provides simple text clipboard access.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.GUI.Clipboard.getText()` | `string` | none | Get clipboard text |
| `Host.GUI.Clipboard.setText(text)` | — | `text` — string to copy | Set clipboard text |

## Commands

`Host.GUI.Commands` provides command execution, deferred execution, and command discovery helpers.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.GUI.Commands.assignKey(command, key)` | — | `command` — command object, `key` — key string | Assign a keyboard shortcut to a command |
| `Host.GUI.Commands.beginTransaction(title)` | — | `title` — transaction label | Start a command transaction for batching |
| `Host.GUI.Commands.deferCommand(category, name)` | — | `category` — command category, `name` — command name | Defer a host command for sequenced execution |
| `Host.GUI.Commands.endTransaction()` | — | none | End a command transaction |
| `Host.GUI.Commands.findCommand(cat, name)` | `object` | `cat` — category, `name` — command name | Find a command object (`.name`, `.classID`) |
| `Host.GUI.Commands.interpretCommand(category, name)` | — | `category` — command category, `name` — command name | Execute a host command |
| `Host.GUI.Commands.interpretCommand(category, name, clearSelection, attrs)` | — | `clearSelection` — 0/1, `attrs` — `Host.Attributes(...)` object | Execute with optional selection clear and attributes |
| `Host.GUI.Commands.lookupBindings(command)` | `object` | `command` — command object | Look up keyboard bindings for a command |
| `Host.GUI.Commands.lookupKeyEvent(command)` | — | `command` — command object | Look up the key event for a command |
| `Host.GUI.Commands.newCategoryIterator()` | `object` | none | Create iterator over all categories |
| `Host.GUI.Commands.newCommandIterator()` | `object` | none | Create iterator over all commands |
| `Host.GUI.Commands.registerCommand(category, name, group, title, englishName)` | — | `category` — category, `name` — command name, `group` — group name, `title` — display title, `englishName` — English name | Register a new command |
| `Host.GUI.Commands.unregisterCommand(category, name)` | — | `category` — command category, `name` — command name | Unregister a previously registered command |

See [Command Reference](command_reference.md#command-list) for full command reference.

`findCommand(category, name)` returns a command object with at least `classID` and `name`. The resolved `classID` can be passed back into `interpretCommand(...)`.

**Attribute Example:**

```javascript
var attrs = Host.Attributes([
  "Length", "0.02",
  "Type", "Linear",
  "Bend", "0"
]);

Host.GUI.Commands.interpretCommand("Audio", "Create Crossfades", false, attrs);
```

`Create Crossfades` accepts `Length`, `Type`, and `Bend` attributes.

## Constants

`Host.GUI.Constants` provides modifier key constants and dialog result codes. Modifier key values are bitwise constants — combine with `|` (e.g. `kShift | kCommand` = `24`). Compound masks produce joined names in `keyStateToString` (e.g. `"Command+Shift"`).


| Constant | Value | Category |
|---|---|---|
| `kShift` | 8 | Modifier key |
| `kCommand` | 16 | Modifier key |
| `kOption` | 32 | Modifier key |
| `kControl` | 64 | Modifier key |
| `kCancel` | 0 | Dialog result |
| `kOkay` | 1 | Dialog result |
| `kClose` | 2 | Dialog result |
| `kApply` | 3 | Dialog result |
| `kYes` | 0 | Alert result |
| `kNo` | 1 | Alert result |
| `kAlertCancel` | 2 | Alert result |
| `kOk` | 3 | Alert result |
| `kRetry` | 4 | Alert result |

## Desktop

`Host.GUI.Desktop` provides desktop window and modal management.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.GUI.Desktop.closeModalWindows()` | — | none | Close all open modal dialogs |
| `Host.GUI.Desktop.closeTopModal()` | — | none | Close the topmost modal dialog |
| `Host.GUI.Desktop.getApplicationWindow()` | `object` | none | Get the application window object |

## Help

`Host.GUI.Help` provides window dimming and UI control highlighting for focus effects. HelpIDs can reference both native UI elements and custom controls in third-party dialogs (via `<HelpAnchor helpid="...">` or `<Form helpid="...">` in `skin.xml`).

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.GUI.Help.dimAllWindows()` | — | none | Dim background windows |
| `Host.GUI.Help.discardHighlights()` | — | none | Remove all active highlights and restore dimmed windows |
| `Host.GUI.Help.highlightControl(helpID)` | — | `helpID` — control identifier string | Highlight a UI control by its HelpID (e.g. `"Console"`, `"Arrangement"`, `"Inspector"`) |
| `Host.GUI.Help.modifyHighlights()` | — | none | — |
| `Host.GUI.Help.showLocation()` | — | none | Open the Studio Pro Reference Manual |

**helpID:**

Controls are referenced by helpID string constants. See [HelpID](../sdk/helpids.md) for the full list of recognized constants.

**Custom helpID:** 

Custom helpID's can be defined in third-party `skin.xml` files via `<HelpAnchor helpid="...">` wrapping a control or `<Form helpid="...">` on a form for the entire dialog window. Use with `highlightControl()` to highlight the specified control while the display is dimmed.

## Themes

`Host.GUI.Themes` provides theme retrieval for dialog rendering and skin resource access. The returned theme object is passed to `Host.GUI.runDialog()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.GUI.Themes.getTheme(packageID)` | `object` | `packageID` — `Package:ID` from `metainfo.xml` | Get a theme object for a package's skin |
| `Host.GUI.Themes.loadTheme(packageID)` | `object` | `packageID` — package identifier string | Load a theme object |

**Theme object:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `theme.getImage(name)` | `object` | `name` — image resource name | Get a named image from the skin's resources |

**Example:**

```javascript
var theme = Host.GUI.Themes.getTheme(kPackageID);
Host.GUI.runDialog(theme, "MyForm", this);
```

## alert

`Host.GUI.alert()` provides a modal alert dialog.

```javascript
Host.GUI.alert(msg)   // Auto-stringifies any value
```

## ask

`Host.GUI.ask()` provides a Yes/No modal dialog.

```javascript
var result = Host.GUI.ask(msg);
if (result === Host.GUI.Constants.kYes) { /* yes */ }
```

## keyStateToString

`Host.GUI.keyStateToString()` formats modifier-key masks for display. Compound masks produce joined names (e.g. `"Command+Shift"`). Modifier key values are defined in [Host.GUI.Constants](#constants).

```javascript
// Modifier key values: kShift=8, kCommand=16, kOption=32, kControl=64
Host.GUI.keyStateToString(8)    // "Shift"
Host.GUI.keyStateToString(24)   // "Command+Shift"
Host.GUI.keyStateToString(255)  // "Command+Shift+Option+Control"
```

## openUrl

`Host.GUI.openUrl()` opens a local file or URL in the host. Accepts a `Host.Url` object.

```javascript
var targetPath = Host.Url("local://$USERCONTENT/your-file.txt");
Host.GUI.openUrl(targetPath);
```

## runDialog

`Host.GUI.runDialog()` opens a skin.xml dialog (blocking). Requires `Package:SkinFile` in `metainfo.xml`.

```javascript
var theme = Host.GUI.Themes.getTheme(packageID);
var result = Host.GUI.runDialog(theme, "FormName", controller);
```

## runDialogWithParameters

`Host.GUI.runDialogWithParameters()` opens a parameter dialog with a `CCL:ParamList` object. Returns a dialog result constant.

```javascript
var params = Host.Classes.createInstance("CCL:ParamList");
var result = Host.GUI.runDialogWithParameters(params, "Dialog Title");
```

## showFile

`Host.GUI.showFile()` reveals a file in the host or system file browser. Accepts a `Host.Url` object.

```javascript
var path = Host.Url("local://$USERCONTENT/folder/");
Host.GUI.showFile(path);
```
