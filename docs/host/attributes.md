---
sidebar_position: 13
---
# Attributes

`Host.Attributes(array)` wraps a flat key-value array into an Attributes object. Attributes objects are returned by `Host.Settings.getAttributes()`, `context.getArguments()`, and passed to `storeValues`/`restoreValues`/`saveViewState`/`loadViewState` callbacks. They can also be passed as arguments to `interpretCommand()` calls.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `contains(key)` | `number` | `key` — the attribute key to check | Check if attribute exists (returns `1` if found, `0` if not) |
| `countAttributes()` | `number` | none | Count key-value pairs |
| `getAttribute(key)` | `string` | `key` — the attribute key to look up | Get attribute value by key |
| `getAttributeName(index)` | `string` | `index` — 0-based integer | Get attribute key by index |
| `getAttributeValue(index)` | `string` | `index` — 0-based integer | Get attribute value by index |
| `queueAttribute(key, value)` | — | `key` — attribute key to queue, `value` — attribute value to queue | Queue an attribute for batch notification |
| `newQueueIterator(key)` | `object` | `key` — attribute key to iterate over | Create an iterator over queued attributes |
| `setAttribute(key, value)` | — | `key` — attribute key to set, `value` — value to assign | Set or add an attribute |

```javascript
var attrs = Host.Attributes([
  "State", "1",
  "Description", "My Description"
]);

Host.GUI.Commands.interpretCommand("View", "Track List", false, attrs);
Host.studioapp.interpretCommand("Zoom", "Zoom Full", false, attrs);
```