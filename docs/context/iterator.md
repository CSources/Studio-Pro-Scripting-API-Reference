---
sidebar_position: 4
---
# Iterator

`context.iterator` is available in `performEdit` only (not `prepareEdit`). Iterates over **selected** events. The returned event type depends on the editor context — see [Event Object](../objects/event_object.md) for properties by event type.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `done()` | `flag` | (none) | Returns `0` while events remain, `1` when exhausted. Resets to `0` after `.first()` or `.last()`. |
| `next()` | `object` — [Event Object](../objects/event_object.md) | (none) | Returns the next selected event. |
| `first()` | — | (none) | Resets to first event. Sets `done()` → `0`. |
| `last()` | — | (none) | Positions at last event. Sets `done()` → `0`. |
| `previous()` | `object` — [Event Object](../objects/event_object.md) | (none) | Returns the previous selected event. |

## Usage

```javascript
var it = context.iterator;
while (!it.done()) {
  var event = it.next();
  if (!event) continue;
}
```