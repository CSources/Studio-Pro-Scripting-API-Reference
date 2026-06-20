---
sidebar_position: 6
---
# Interfaces

Interface names are listed here as a reference inventory for `this.interfaces` usage. Most act as capability markers.

## Interface Index

| Interface | Description |
|---|---|
| `IClassFactory` | Registers classes dynamically via `this.classes` array |
| `ICommandHandler` | Handles command interpretation callbacks |
| `IComponent` | Base component / shared object interface |
| `IController` | Controller for dialog and view parameter bindings |
| `IEditTask` | Editable action lifecycle |
| `IExtensionHandler` | Extension lifecycle handler |
| `IObjectNode` | Object-tree node interface for UI models |
| `IObserver` | Receives callbacks from `Host.Signals` |
| `IParamObserver` | Parameter-change observer for bound dialog/control parameters |
| `IPersistAttributes` | Saves and restores attributes/state |
| `IViewStateHandler` | Saves and restores view state for add-ins |

## Callback Contracts

Each interface defines a set of required callbacks or properties that must be present on an implementing object.

| Interface | Required callback(s) |
|---|---|
| `IClassFactory` | `this.classes`, `this.version`, `createInstance(classID)` |
| `ICommandHandler` | `checkCommandCategory(category)`, `interpretCommand(msg)` |
| `IComponent` | `initialize(context?)`, `terminate()` |
| `IController` | `paramChanged(param)` |
| `IEditTask` | `prepareEdit()` and `performEdit()` |
| `IExtensionHandler` | `initialize(context)`, `startupExtension(description)`, `terminate()` |
| `IObjectNode` | `children` array property |
| `IObserver` | `notify(subject, msg)` |
| `IParamObserver` | `paramChanged(param)` |
| `IPersistAttributes` | `storeValues(attributes)`, `restoreValues(attributes)` |
| `IViewStateHandler` | `initialize(context)`, `saveViewState(viewID, viewName, attributes)`, `loadViewState(viewID, viewName, attributes)`, `terminate()` |

## IClassFactory

Registers classes dynamically at runtime via `this.classes` and `this.version`. Uses `CodeResource:Executable` in `metainfo.xml` instead of `classfactory.xml`. Requires defining `CCLGetClassFactory(codeResource)` as a global function — the host calls it on package load and expects an object implementing `IClassFactory`.

The host calls `createInstance(classID)` for `FrameworkService` class registrations. Other categories (`EditTask`, `Toolset`, etc.) are registered but not auto-instantiated — instances can be created manually via `factory.createInstance()`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `classes` | `Array` | Yes | `[{ name: "MyTask", category: "EditTask", classID: Host.UID("{...}") }]` | Array of class descriptors with `name`, `category`, `classID` |
| `version` | `object` | Yes | `{ name: "My Package", version: "1.0.0", vendor: "MyVendor" }` | Version descriptor with `name`, `version`, `vendor` strings |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `createInstance(classID)` | `object` | `classID` — `Host.UID` to match against registered classes | Creates an instance for the matching class |

```javascript
var gFactory = null;

function CCLGetClassFactory(codeResource)
{
    gFactory = {
        interfaces: [Host.Interfaces.IClassFactory],
        classes: [
            { name: "MyService", category: "FrameworkService", classID: Host.UID("{...}") },
            { name: "MyTask", category: "EditTask", classID: Host.UID("{...}") }
        ],
        version: {
            name: "My Package",
            version: "1.0.0",
            vendor: "MyVendor"
        },
        createInstance: function(classID) {
            if (classID.equals(Host.UID("{...}")))
                return { interfaces: [Host.Interfaces.IComponent], initialize: function(c) { return Host.Results.kResultOk }, terminate: function() {} };
            return null;
        }
    };
    return gFactory;
}
```

In `metainfo.xml`:
```xml
<Attribute id="CodeResource:Executable" value="main.js"/>
```

## ICommandHandler

Receives command dispatch from CCL menus, context menus, and the host command system.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `checkCommandCategory(category)` | `boolean` | `category` — command category string | Called to query whether this handler can process the given category. Return `true` to accept commands of this category |
| `interpretCommand(msg)` | `boolean` | `msg` — command message | Called when a command is dispatched — first with `msg.checkOnly = 1` to probe for availability, then with `msg.checkOnly = 0` for execution. Return `true` if handled, `false` to pass through |

**Command `msg` object properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `category` | `string` | No | `"View"` | Command category |
| `name` | `string` | No | `"Browser"` | Command name |
| `checkOnly` | `flag` | No | `1` | `1` if this is a query call to check availability, `0` for actual execution |

```javascript
this.interfaces = [Host.Interfaces.ICommandHandler];

this.checkCommandCategory = function(category) {
    return category == "MyCategory";
};

this.interpretCommand = function(msg) {
    if (msg.checkOnly) return true;   // probe — always claim if willing to handle
    // msg.category, msg.name, msg.checkOnly (0 → execute)
    return true;                      // true = handled, false = not handled
};
```

## IComponent

Base lifecycle interface for components. `initialize(context)` is called when the component starts; `terminate()` is called on shutdown.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `initialize(context)` | — | `context` — host context for registration and lookup | Called when the component starts |
| `terminate()` | — | none | Called on component shutdown for cleanup |

```javascript
this.interfaces = [Host.Interfaces.IComponent];

this.initialize = function(context) {
    return Host.Results.kResultOk;
};

this.terminate = function() {
    return Host.Results.kResultOk;
};
```

## IController

Identity marker for dialog and view parameter bindings. `paramChanged(param)` fires when a bound control changes.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `paramChanged(param)` | — | `param` — [param object](../context/parameters.md#param-object). | Called when a bound parameter changes |

`param` supports identity comparison (`param === this.myParam`)

```javascript
this.interfaces = [Host.Interfaces.IController, Host.Interfaces.IParamObserver];

this.initialize = function(panel) {
    this.paramList = Host.Classes.createInstance("CCL:ParamList");
    this.paramList.controller = this;
};

this.paramChanged = function(param) {
    // Called when a bound parameter changes.
};
```

## IEditTask

Editable action lifecycle. `prepareEdit(context)` sets up parameters and optionally shows a dialog; `performEdit(context)` executes the action.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `prepareEdit(context)` | — | `context` — edit context (see [context object](../context/context_object.md)). | Called first. Set up parameters and return `runDialog()` or `kResultOk` |
| `performEdit(context)` | — | `context` — edit context (see [context object](../context/context_object.md)) | Called after dialog closes to execute the action |

```javascript
this.interfaces = [Host.Interfaces.IEditTask];

this.prepareEdit = function(context) {
    return Host.Results.kResultOk;
};

this.performEdit = function(context) {
    return Host.Results.kResultOk;
};
```

## IExtensionHandler

Receives notifications about installed extensions at startup. Uses `category="ExtensionHandler"` in `classfactory.xml`. `startupExtension(description)` fires once per detected extension during host startup.

Typically paired with `IComponent`.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `initialize(context)` | — | `context` — host context for registration and lookup | Called when the extension handler starts |
| `startupExtension(description)` | — | `description` — Extension descriptor | Called once per installed extension at startup |
| `terminate()` | — | none | Called on handler shutdown for cleanup |

### Extension descriptor

The `description` object passed to `startupExtension` identifies an available extension package. The `platformIndependentId` matches the extension's `Package:ID` in its `metainfo.xml`.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `path` | `object` | No | `description.path` | Host.Url-like object with `.saveToFile()`/`.loadFromFile()` |
| `platformIndependentId` | `string` | No | `"com.test.extension"` | Matches the extension's `Package:ID` |
| `id` | `string` | No | `"com.test.extension"` | Platform-specific identifier (often same as `platformIndependentId`) |

```javascript
this.interfaces = [Host.Interfaces.IExtensionHandler, Host.Interfaces.IComponent];

this.initialize = function(context) {
    Host.Objects.registerObject(this, "MacroExtensionHandler");
    return Host.Results.kResultOk;
};

this.startupExtension = function(description) {
    return 1;
};

this.terminate = function() {
    Host.Objects.unregisterObject(this);
    return Host.Results.kResultOk;
};
```

## IObjectNode

Represents a node in an object tree.

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `children` | `Array` | Yes | `this.children = []` | Array of child objects. |

```javascript
this.interfaces = [Host.Interfaces.IObjectNode];

this.children = [];

this.initialize = function(context) {
    this.children.push(someChildObject);
};

this.terminate = function() {
    this.children.length = 0;
};
```

## IObserver

`notify(subject, msg)` receives signals from advised objects. The `msg` object carries the signal data.

**Method:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `notify(subject, msg)` | — | `subject` — the signal source object, `msg` — signal payload | Called when an advised signal fires on the channel |

### msg object

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `id` | `string` | Yes | `"commandFocused"` | Signal identifier |
| `argCount` | `number` | No | `1` | Number of arguments |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getArg(index)` | `object` | `index` — 0-based argument index | Returns the argument at the given index. Surface depends on the signal `id` |

```javascript
this.interfaces = [Host.Interfaces.IObserver];

Host.Signals.advise("my-channel-name", this);

this.notify = function(subject, msg) {
    if (msg.id === "someSignal") {
        var arg = msg.getArg(0);
    }
};
```

## IParamObserver

Parameter-change observer for bound dialog/control parameters.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `paramChanged(param)` | — | `param` — [param](../context/parameters.md#param-object) | Called when a bound parameter changes |

```javascript
this.interfaces = [Host.Interfaces.IParamObserver];

this.paramChanged = function(param) {
    // Called when a dialog/control parameter changes.
};
```

## IPersistAttributes

Saves and restores attribute state across invocations. `storeValues(attributes)` fires before the dialog closes; `restoreValues(attributes)` fires when the dialog reopens. Persistence scope matches `context.parameters` (across invocations within a session, not across app restarts).

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `storeValues(attributes)` | — | `attributes` - [attributes object](#attributes-object) | Called to persist attribute state |
| `restoreValues(attributes)` | — | `attributes` — [attributes object](#attributes-object) | Called to restore attribute state |

### attributes object

The `attributes` parameter is passed to `storeValues`/`restoreValues` (IPersistAttributes) and `saveViewState`/`loadViewState` (IViewStateHandler). It has the same surface as [`Host.Attributes`](attributes.md).

```javascript
this.interfaces = [Host.Interfaces.IPersistAttributes];

this.storeValues = function(attributes) {
    attributes.setAttribute("myValue", this.myParam.value);
    return Host.Results.kResultOk;
};

this.restoreValues = function(attributes) {
    var val = attributes.getAttribute("myValue");
    if (val !== undefined) this.myParam.value = val;
    return Host.Results.kResultOk;
};
```

## IViewStateHandler

Persists and restores panel/view state across song sessions. Works with EditAddIn panels.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `initialize(context)` | — | `context` — add-in context | Called on add-in startup |
| `terminate()` | — | none | Called on add-in shutdown for cleanup |
| `saveViewState(viewID, viewName, attributes)` | — | `viewID` — the script classID GUID from classfactory.xml, `viewName` - the groupName from classfactory.xml, `attributes` — [attributes object](#attributes-object) | Called to persist panel state |
| `loadViewState(viewID, viewName, attributes)` | — | `viewID` — the script classID GUID from classfactory.xml, `viewName` — the groupName from classfactory.xml, `attributes` — [attributes object](#attributes-object) | Called to restore panel state |

```javascript
this.interfaces = [Host.Interfaces.IViewStateHandler];

this.initialize = function(context) {
    return Host.Results.kResultOk;
};

this.saveViewState = function(viewID, viewName, attributes) {
    attributes.setAttribute("selectedPage", this.pageSelector.value);
    return true;
};

this.loadViewState = function(viewID, viewName, attributes) {
    var val = attributes.getAttribute("selectedPage");
    if (val !== undefined) this.pageSelector.value = val;
    return true;
};

this.terminate = function() {
    return Host.Results.kResultOk;
};
```