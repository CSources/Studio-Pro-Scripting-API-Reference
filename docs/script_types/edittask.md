---
sidebar_position: 2
---
# EditTask

An `EditTask` is a command/action script that optionally collects input and performs an action. When used with `context.runDialog()` it opens a blocking dialog for collecting input before performing the action.

## How It Works

1. **`classfactory.xml`** — declares the script as `category="EditTask"` with [`subCategory`](../package_structure/classfactory.md#subcategory-values) for the target context.
2. **`prepareEdit(context)`** — called first; validates state and optionally collects input. Returns `kResultOk` to proceed, or another value to cancel.
3. **`performEdit(context)`** — called only if `prepareEdit` returned `kResultOk`; performs the action.

## classfactory.xml

```xml
<ScriptClass
    classID="{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}"
    category="EditTask"
    subCategory="TrackEdit"
    name="My Action"
    sourceFile="scriptname.js"
    functionName="createInstance">
    <Attribute id="commandCategory" value="MyCategory"/>
    <Attribute id="menuPriority" value="0"/>
</ScriptClass>
```

## skin.xml

Optional for EditTask. The `<Form>` referenced by `context.runDialog()` must be defined in the package's skin:

```xml
<Form name="MyForm" title="My Dialog" width="240" height="80">
    <!-- dialog controls here -->
</Form>
```

## scriptname.js

```javascript
function MyAction()
{
    this.interfaces = [
        Host.Interfaces.IEditTask  // Required for EditTask lifecycle
    ]

    this.prepareEdit = function(context)
    {
        context.restore()           // Must restore before opening dialog
        return context.runDialog("MyForm", "com.yourname.scriptname")  // Optional — EditTask scripts can work without a dialog
    }

    this.performEdit = function(context)
    {
        // Action runs here only if dialog was confirmed
    }
}

// Function name matches classfactory.xml functionName
function createInstance() {
    return new MyAction() 
}
```

## Task Arguments

Tasks with `arguments` defined in `classfactory.xml` receive typed parameters at invocation.

See [context.getArguments()](../context/methods.md#get-arguments) for full reference.