---
sidebar_position: 11
---
# Settings

`Host.Settings` provides a script-local key-value store for persisting state between `prepareEdit` and `performEdit` phases.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Settings.getAttributes()` | `object` | none | Get the settings attributes object |

The returned object has the same surface as [`Host.Attributes`](attributes.md).

## Persistence

Values persist between `prepareEdit()` and `performEdit()` within the same script session. They do not persist across application restarts.

```javascript
var attrs = Host.Settings.getAttributes();
attrs.setAttribute("myKey", "myValue");
var val = attrs.getAttribute("myKey");
```