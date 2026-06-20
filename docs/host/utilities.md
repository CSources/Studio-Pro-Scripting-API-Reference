---
sidebar_position: 16
---
# Utilities

## Console

`Host.Console` provides console output for debugging (View > Additional Views > Messages).

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Console.writeLine(text)` | — | `text` — string or number | Write a line to the console |

## Platform Detection

`Host.getPlatform()` detects the current platform for path handling and file workflows.

```javascript
Host.getPlatform()   // Returns "win" or "mac"
```

## Sleep

`Host.sleep()` pauses the current script thread.

```javascript
Host.sleep(100);  // 100ms
```