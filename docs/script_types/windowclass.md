---
sidebar_position: 4
---
# WindowClass

A `<WindowClass>` in `skin.xml` binds a `FrameworkService` controller to a non-blocking workspace window. `WindowClass` panels exist only for the current session. Restart is required after any change to the script files.

## How It Connects

1. **`classfactory.xml`** — declares the script as `category="FrameworkService"` (see [classfactory.xml](../package_structure/classfactory.md)).
2. **`skin/skin.xml`** — `<WindowClass controller="Name">` — references the registered controller name and binds a `<Form>` as the window content.
3. **`scriptname.js` — `Host.Objects.registerObject(this, "Name")`** — registers the controller as a named host object in `initialize()`.

## classfactory.xml

```xml
<ScriptClass
    classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    category="FrameworkService"
    name="My Window Service"
    sourceFile="scriptname.js"
    functionName="createInstance"/>
```

## skin.xml

```xml
<WindowClasses>
    <WindowClass name="MyPanel"
        title="My Panel"
        controller="MyControllerName"
        form.name="MyForm"
        command.category="MyCategory" command.name="My Panel"/>
</WindowClasses>
<Forms>
    <Form name="MyForm">
    </Form>
</Forms>
```

- The `command.category` and `command.name` attributes on `<WindowClass>` register it as a command in Studio Pro. It can be assigned in the Keyboard Shortcuts menu or launched via **Find Command** (Ctrl/Cmd + K).
- The `controller` attribute must match the string passed to `Host.Objects.registerObject()`.
- See [Skin Reference - WindowClass](../skin/structure.md#windowclass) for all attributes.

## scriptname.js

```javascript
function MyController()
{
    this.interfaces = [
        Host.Interfaces.IComponent  // Required for controller lifecycle
    ]

    this.initialize = function(ctx)
    {
        Host.Objects.registerObject(this, "MyControllerName")  // Must match controller="..." in WindowClass
    }

    this.terminate = function()
    {
        try { Host.Objects.unregisterObject("MyControllerName") } catch(e) {}
    }
}

// Function name matches classfactory.xml functionName
function createInstance() {
    return new MyController()
}
```

## Example

See [Marker Creator](../scripts/marker-creator.md) for a full working example.