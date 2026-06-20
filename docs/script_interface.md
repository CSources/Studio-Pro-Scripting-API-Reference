# Script Interface

The script interface defines how JavaScript tasks are structured, registered, and executed by the host. Every script implements a task object and exports a factory function.

## Basic Task Structure

Every script implements a task object and exports a factory function named by `classfactory.xml`.

```javascript
function MyTask() {
  this.interfaces = [Host.Interfaces.IEditTask];

  this.prepareEdit = function(context) {
    return Host.Results.kResultOk;
  };

  this.performEdit = function(context) {
    return Host.Results.kResultOk;
  };
}
// Function name matches classfactory.xml functionName.
function createInstance() {
  return new MyTask();
}
```

## Execution Phases

The task lifecycle has two phases: validation in `prepareEdit()` and execution in `performEdit()`.

| Phase | When Called | Can Modify | Typical Use |
|---|---|---|---|
| `prepareEdit(context)` | Always, before `performEdit` | No | Validate state, show dialog, enable/disable menu item |
| `performEdit(context)` | Only if `prepareEdit` returns `kResultOk` | Yes | Do the actual work |

See [Context Object](context/context_object.md) for the full `context` surface.

## Task Arguments

Tasks with `arguments` defined in `classfactory.xml` receive typed parameters at invocation.

See [context.getArguments()](context/methods.md#get-arguments) for the full reference.

## Task Categories

The `category` attribute in `classfactory.xml` determines which interface and lifecycle the script follows.

| Category | Interfaces | Lifecycle Callbacks | Purpose |
|---|---|---|---|
| `"EditTask"` | `IEditTask` | `prepareEdit()`, `performEdit()` | Command/action script — invoked from menu or toolbar |
| `"EditAddIn"` | `IController`, `IParamObserver` (minimum); also supports `IComponent`, `IObjectNode`, `IObserver`, `ICommandHandler`, `IViewStateHandler`, `IContextMenuHandler` | `initialize()`, `paramChanged()`, `terminate()`, `saveViewState()`/`loadViewState()`, `appendContextMenu()` | Persistent add-in panel or toolbar integration |
| `"ExtensionHandler"` | `IExtensionHandler`, `IComponent` | `initialize()`, `startupExtension()`, `terminate()` | Extension discovery handler — receives notifications for installed extensions at startup |
| `"FrameworkService"` | `IComponent` (minimum); also supports `IObserver` | `initialize()`, `terminate()` | Headless background service — not shown in menus. Auto-instantiated at startup |

See [Interfaces - Callback Contracts](host/interfaces.md#callback-contracts) for the full interface callback contracts.

## Multiple Commands from One JS File

A single JavaScript file can export multiple factory functions, each registered as a separate `<ScriptClass>` entry in `classfactory.xml`.

```xml
<classfactory.xml>
<ScriptClass name="Remove Empty Tracks"
  sourceFile="code.js"
  functionName="removeEmpty"/>

<ScriptClass name="Remove Disabled Tracks"
  sourceFile="code.js"
  functionName="removeDisabled"/>
```

```javascript
// code.js
function removeEmpty()    { return new TrackAction("removeEmptyTracks"); }
function removeDisabled() { return new TrackAction("removeDisabledTracks"); }
```

## Including Other JS Files

Include helper JavaScript files from the package root or known resource paths.

```javascript
include_file('helper.js');
include_file('constants.js');
```

See [SDK Files](sdk/sdk_files.md) for list of bundled files.