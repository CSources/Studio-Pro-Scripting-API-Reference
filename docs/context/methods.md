---
sidebar_position: 7
---
# Methods

The following methods are available directly on the `context` object. See the [Methods table](context_object.md#methods) for phase support.

## Contains

`context.contains(name)` checks whether a named attribute or property exists in the current context. Returns `1` if present, `0` if not.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `contains(name)` | `number` | `name` (`string`, req): Attribute name. | Checks for presence of a named attribute. |

```javascript
context.contains("editor")
```

## Count Attributes

`context.countAttributes()` counts context properties and attributes in the current phase.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `countAttributes()` | `number` | (none) | Counts available context properties and user-set attributes. |

```javascript
context.countAttributes()
```

## Get Arguments

`context.getArguments()` reads arguments passed to the task at invocation time. When invoked with arguments (via `environment.runEditTask(uid, args)`), returns an object created by `Host.Attributes([name1, val1, ...])`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getArguments()` | `object` | (none) | Returns an arguments object when invoked with arguments. |

**Arguments object:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `countAttributes()` | `number` | (none) | Number of arguments. |
| `getAttribute(name)` | variant | `name` (`string`, req): Argument name. | Get an argument value by name. |
| `getAttributeName(index)` | `string` | `index` (`number`, req): Argument index. | Get an argument name by index. |
| `getAttributeValue(index)` | variant | `index` (`number`, req): Argument index. | Get an argument value by index. |
| `setAttribute(name, value)` | — | `name, value`. | Sets an argument value. |
| `toString()` | `string` | (none) | Returns string representation. |

```javascript
var args = context.getArguments();
if (args) {
  var colorCode = args.getAttribute("color");
  var name = args.getAttribute("name");
  for (var i = 0; i < args.countAttributes(); i++) {
    var key = args.getAttributeName(i);
    var val = args.getAttributeValue(i);
  }
}
```

## Get Attribute

`context.getAttribute(name)` reads a context attribute or property value by name.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getAttribute(name)` | `object` | `name` (`string`, req): Attribute name. | Reads a context value by name. |

```javascript
context.getAttribute("editor")
```

## Get Attribute Name

`context.getAttributeName(index)` reads a context attribute name by its index position.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getAttributeName(index)` | `string` | `index` (`number`, req): Attribute index. | Reads attribute name by position. |

```javascript
context.getAttributeName(0)
```

## Get Attribute Value

`context.getAttributeValue(index)` reads a context attribute value by its index position.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getAttributeValue(index)` | `object` | `index` (`number`, req): Attribute index. | Reads attribute value by position. |

```javascript
context.getAttributeValue(0)
```

## Silent Mode

`context.isSilentMode()` checks whether the script is running in silent mode (e.g., invoked from a macro or non-interactive context).

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `isSilentMode()` | `flag` | (none) | Returns `1` if silent, `0` if interactive. |

```javascript
if (!context.isSilentMode()) {
  // Show UI or dialog
}
```

## Run Dialog

`context.runDialog(name, pkgID)` opens a dialog defined in the script package's `skin.xml`. Available in `prepareEdit` only — call it inside `prepareEdit` and return the result. Use `Host.GUI.runDialog()` for dialogs in `performEdit`. The host auto-creates OK and Cancel buttons — the Form's `buttons` attribute is ignored.

**Requirements:** `metainfo.xml` must contain `<Attribute id="Package:SkinFile" value="skin/"/>`. The dialog form must be defined in `skin/skin.xml`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `runDialog(name, pkgID)` | `number` | `name` (`string`, req): Form name in `skin.xml`. **`pkgID`** (`string`, req): Package ID from `metainfo.xml`. | Opens a dialog from the package's skin. Blocking. Returns `0` (kResultOk) when accepted, error code on failure. |

```javascript
context.restore();
return context.runDialog("FlamToolDialog", "flam.tool");
```

## Set Attribute

`context.setAttribute(name, value)` sets a context attribute by name. Available in both `prepareEdit` and `performEdit`. Values do not persist between phases.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setAttribute(name, value)` | `number` | `name` (`string`, req): Attribute name. **`value`** (`string` / `number`, req): Attribute value. | Writes a value readable in the current phase. |

```javascript
context.setAttribute("MyAttr", 42);
```

## Restore

`context.restore(true)` restores the current edit context state before a dialog or task proceeds. Typically called from `prepareEdit` before `context.runDialog()`.

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `restore(true)` | — | Must be `true`. | Restores the edit context state. |

```javascript
context.restore(true);
return context.runDialog("FlamToolDialog", "flam.tool");
```
