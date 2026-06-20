---
sidebar_position: 6
---

# Multi Script Demo

Test package for validating that a single `.package` can register more than one script.

<details>

<summary>Click for details</summary>

The **Multi Script Demo** package in this repository is a working example demonstrating:

- Multiple `<ScriptClass>` entries in one `classfactory.xml`
- Separate `sourceFile` values for `ScriptA.js` and `ScriptB.js` (packages may also share one `sourceFile` when that file exports multiple factory functions)
- A shared `skin.xml` with one `<Form>` per script
- A valid `metainfo.xml` using `Package:SkinFile`
- A real UI flow where each script opens its own dialog before running

**Source Code Files:**

- [`classfactory.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/multi-script-demo-source/classfactory.xml)
- [`metainfo.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/multi-script-demo-source/metainfo.xml)
- [`ScriptA.js`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/multi-script-demo-source/ScriptA.js)
- [`ScriptB.js`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/multi-script-demo-source/ScriptB.js)
- [`skin/skin.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/multi-script-demo-source/skin/skin.xml)

**Key features:**
- Shows how Studio Pro loads more than one script from a single package
- Uses distinct entry points for each script
- Opens separate dialogs for Script A and Script B
- Shows the shared dialog structure used by multi-script packages

</details>

[⬇ Download Package](https://raw.githubusercontent.com/CSources/Studio-Pro-Scripting-API-Reference/main/scripts/packages/multi-script-demo/Multi%20Script%20Demo.package)

## Contents

- `Script A`
- `Script B`

## Usage

1. Navigate to the Track menu in the menu bar. You should see `Script A` and `Script B` populating the Track menu.
2. Run either script, a dialog will appear.
3. Use the checkbox to toggle whether it shows the alert window after pressing 'OK' in the dialog window.