---
sidebar_position: 1
---
# Context Overview

The `context` object is passed into edit tasks and dialog flows. Its availability depends on whether the script is in `prepareEdit()` or `performEdit()`.

## Properties

| Property | prepareEdit | performEdit | Description |
|---|---|---|---|
| [`context.editor`](editor.md) | x | ✓ | Active editor surface. |
| [`context.functions`](functions.md) | x | ✓ | Active edit-function surface. |
| [`context.iterator`](iterator.md) | x | ✓ | Iterate selected events. |
| [`context.mainTrackList`](mainTrackList.md) | x | ✓ | Track-list surface. Also accessible as `context.trackList` (same reference). |
| [`context.parameters`](parameters.md) | ✓ | ✓ | Dialog parameter surface. |

## Methods

See [methods](methods.md) for full documentation of each method.

| Method | prepareEdit | performEdit | Description |
|---|---|---|---|
| [`context.contains(name)`](methods.md#contains) | ✓ | ✓ | Check whether a named attribute exists. |
| [`context.countAttributes()`](methods.md#count-attributes) | ✓ | ✓ | Count context properties and attributes in the current phase. |
| [`context.getArguments()`](methods.md#get-arguments) | ✓ | ✓ | Read task arguments. |
| [`context.getAttribute(name)`](methods.md#get-attribute) | ✓ | ✓ | Get a context attribute or property value by name. |
| [`context.getAttributeName(index)`](methods.md#get-attribute-name) | ✓ | ✓ | Get a context attribute name by index. |
| [`context.getAttributeValue(index)`](methods.md#get-attribute-value) | ✓ | ✓ | Get a context attribute value by index. |
| [`context.isSilentMode()`](methods.md#silent-mode) | ✓ | ✓ | Check whether the script is running in silent mode. |
| [`context.runDialog(name, pkgID)`](methods.md#run-dialog) | ✓ | x | Open a dialog from the package's skin.xml. Must be returned from prepareEdit. |
| [`context.setAttribute(name, value)`](methods.md#set-attribute) | ✓ | ✓ | Set a context attribute by name. |