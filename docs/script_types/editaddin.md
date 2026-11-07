---
sidebar_position: 3
---
# EditAddIn

An `EditAddIn` panel is a persistent, non-blocking UI strip that's auto-docked in Studio Pro's panel area, beneath the main or editor surface toolbar. Its open/closed state persists in saved files.

## How It Connects

1. **`classfactory.xml`** — declares the script as `category="EditAddIn"` with `subCategory` matching the intended context and `groupName` for panel location.
2. **`skin/skin.xml`** — a `<Form>` defines the panel controls, referenced by the `formName` attribute.
3. **`scriptname.js`** — can inherit from `CCL.JS.Component` ([CCL](../sdk/cclapp.md)) and add control parameters to `this.paramList` in `initialize()`.

## classfactory.xml

```xml
<ScriptClass
    classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    metaClassID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    category="EditAddIn"
    subCategory="Engine"
    name="My Panel"
    sourceFile="scriptname.js"
    functionName="createInstance">
    <Attribute id="groupName" value="Song.AddInPanel"/>
    <Attribute id="formName" value="MyPanelForm"/>
</ScriptClass>

<ScriptMetaClass classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}">
    <ScriptClassResource id="Class:ImageResource" url="theme://$package/ToolbarIcon"/>
</ScriptMetaClass>
```

- `subCategory` specifies the Studio Pro environment context: `Engine` (Song), `Project`, `Show`.
- `groupName` controls docking location. Values: `"Song.AddInPanel"`, `"Project.AddInPanel"`, `"Show.AddInPanel"`, `"MusicOnly.AddInPanel"`, `"AudioOnly.AddInPanel"`, `"SongOnly.AddInPanel"`.
- `formName` references a `<Form name="MyPanelForm">` in `skin.xml`.
- `metaClassID` and `ScriptMetaClass` bind an icon to the script for a toolbar button. See [classfactory.xml - ScriptMetaClass](../package_structure/classfactory.md#scriptmetaclass-icon-and-resource-binding) for icon resource details.

## skin.xml

```xml
<Form name="MyPanelForm" attach="all fitsize" windowstyle="floating">
    <!-- panel controls here -->
</Form>
```

## scriptname.js

```javascript
include_file("resource://{main}/sdk/cclapp.js");

MyPanel.prototype = new CCL.JS.Component();

function MyPanel()
{
    this.initialize = function(context)
    {
        return CCL.JS.Component.prototype.initialize.call(this, context);
    }

    this.terminate = function()
    {
        return CCL.JS.Component.prototype.terminate.call(this);
    }
}

// Function name matches classfactory.xml functionName.
function createInstance(args)
{
    __init(args);
    return new MyPanel();
}
```

This example inherits `CCL.JS.Component`, which provides the interface set. The call to the base `initialize()` creates the instance-bound `this.paramList` and sets its controller. If adding parameters, call the base initializer first, then add them before returning the result. Controls in the form bind to parameters with matching names.