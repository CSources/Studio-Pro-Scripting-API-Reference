---
sidebar_position: 9
---

# Unified Tool Selector

A Studio Pro script package that provides consistent tool shortcuts across Arrangement, Audio Editor, and Note Editor views.

<details>

<summary>Click for details</summary>

The **Unified Tool Selector** package in this repository is a working example demonstrating:

- Multiple `EditTask` registrations in a single `classfactory.xml` (16 entries: 8 tools × 2 view contexts)
- `EventEdit` subCategory covering both Arrangement and Audio Editor (shared tool slot order)
- `MusicEdit` subCategory for Note Editor (different tool slot order)
- `menuPriority="-1"` to hide commands from menus while keeping them available via Keyboard Shortcuts
- `Host.GUI.Commands.interpretCommand("Toolbar", "Tool N")` for native tool activation
- `alwaysEnabled="1"` to allow commands to work regardless of selection state
- Single shared `tools.js` source file with multiple factory functions

**Source Code Files:**

- [`classfactory.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/unified-tool-selector-source/classfactory.xml)
- [`metainfo.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/unified-tool-selector-source/metainfo.xml)
- [`tools.js`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/unified-tool-selector-source/tools.js)

**Key feature:**
- Assign a single keyboard shortcut to each semantic tool (e.g., "Split Tool") and it works in every view

</details>

[⬇ Download Package](https://raw.githubusercontent.com/CSources/Studio-Pro-Scripting-API-Reference/main/scripts/packages/unified-tool-selector/Unified%20Tool%20Selector.package)

## Overview

The Unified Tool Selector solves the problem where Studio Pro's native keyboard shortcuts (1–8) activate different tools depending on which view is focused. By registering semantic tool commands (e.g., "Split Tool", "Paint Tool"), users can bind a single shortcut that always activates the correct tool regardless of view.

## Tool Mapping

| Tool | Arrangement / Audio Editor (EventEdit) | Note Editor (MusicEdit) |
|---|---|---|
| Arrow Tool | Tool 1 | Tool 1 |
| Range Tool | Tool 2 | *not available* |
| Split Tool | Tool 3 | Tool 2 |
| Erase Tool | Tool 4 | Tool 4 |
| Paint Tool | Tool 5 | Tool 3 |
| Mute Tool | Tool 6 | Tool 5 |
| Bend Tool | Tool 7 | *not available* |
| Listen Tool | Tool 8 | Tool 6 |

Range Tool and Bend Tool have no equivalent in the Note Editor — pressing their shortcut in the Note Editor does nothing.

## How It Works

Each tool is registered as two `EditTask` script classes:

- **EventEdit registration** — used in Arrangement and Audio Editor. Calls the tool slot number for that view (e.g., Split = Tool 3).
- **MusicEdit registration** — used in Note Editor. Calls the tool slot number for that view (e.g., Split = Tool 2).

Since Arrangement and Audio Editor share the same tool slot order, they use a single `EventEdit` registration. The `subCategory` on each `ScriptClass` entry determines which slot number is used — the host automatically routes to the correct entry based on the active view.

When a tool doesn't exist in a view (Range and Bend in Note Editor), the mapping is set to `0` and the script does nothing.

## Usage

1. Open **Studio Pro > Keyboard Shortcuts** in the menu bar.
2. Search for a tool name under the **Tools** category (e.g., "Split Tool").
3. Assign your preferred keyboard shortcut.
4. Repeat for each tool you want to assign.

## Tips

- Unbind the native **Tool 1** through **Tool 8** commands (under the **Toolbar** category) from number keys 1-8 and assign them to the tool commands provided by this script.

---

> **Development Note:** This script and its documentation were developed with the assistance of agentic coding tools.