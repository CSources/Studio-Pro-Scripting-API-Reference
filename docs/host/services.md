---
sidebar_position: 10
---
# Services

`Host.Services` provides inter-script singleton lookup. A script registers a service via `classfactory.xml` with `category="FrameworkService"`, and other scripts retrieve it by its class ID GUID.

## Methods:

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Services.getInstance(classID)` | `object` | `classID` — GUID string from the framework service's class factory | Retrieve a registered singleton service by class ID |

```javascript
var service = Host.Services.getInstance("{00000000-0000-0000-0000-000000000000}");
if (service) {
  service.someMethod();
}
```

## Registering a Service

Add a `ScriptClass` with `category="FrameworkService"` to your `classfactory.xml`:

```xml
<ScriptClass
  classID="{00000000-0000-0000-0000-000000000000}"
  category="FrameworkService"
  name="My Service"
  sourceFile="service.js"
  functionName="createMyServiceInstance">
</ScriptClass>
```

The associated script must implement `IComponent` or `IExtensionHandler` to serve as the singleton object retrieved by other scripts.
