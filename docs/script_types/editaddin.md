---
sidebar_position: 3
---
# EditAddIn

An `EditAddIn` panel is a persistent, non-blocking UI strip that's auto-docked in Studio Pro's panel area, beneath the main or editor surface toolbar. Its open/closed state persists in saved files.

## How It Connects

1. **`classfactory.xml`** — declares the script as `category="EditAddIn"` with `subCategory` matching the intended context and `groupName` for panel location.
2. **`skin/skin.xml`** — a `<Form>` defines the panel controls, referenced by the `formName` attribute.
3. **`scriptname.js`** — implements `IComponent` with `initialize()` and `terminate()` callbacks.

## classfactory.xml

```xml
<ScriptClass
    classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    metaClassID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    category="EditAddIn"
    subCategory="Engine"
    name="My Panel"
    sourceFile="main.js"
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
<Form name="MyPanelForm" attach="all fitsize" windowstyle="panelstyle">
    <!-- panel controls here -->
</Form>
```

## scriptname.js

```javascript
function MyPanel()
{
    this.interfaces = [
        Host.Interfaces.IComponent  // Required for EditAddIn lifecycle
    ]

    this.initialize = function(context)
    {
    }

    this.terminate = function()
    {
    }
}

// Function name matches classfactory.xml functionName.
function createInstance() {
    return new MyPanel()
}
```