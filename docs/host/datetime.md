---
sidebar_position: 14
---
# DateTime

Parse a date string into a DateTime object, or get the current time via `Host.SystemInfo.getLocalTime()`.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.DateTime(date)` | `object` | `date` — date string (e.g. `"2026/01/01"`) | Parse a date string into a DateTime object |

**DateTime object properties:**

| Property | Type | Example | Description |
|---|---|---|---|
| `year` | `number` | `2026` | Year |
| `month` | `number` | `5` | Month (1-based) |
| `day` | `number` | `28` | Day of month |
| `hour` | `number` | `14` | Hour (0-23) |
| `minute` | `number` | `30` | Minute |
| `second` | `number` | `15` | Second |

```javascript
var end = Host.DateTime("2026/01/01");
var now = Host.SystemInfo.getLocalTime();
```

## SystemInfo

`Host.SystemInfo` provides system-level time access via `getLocalTime()`.


**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.SystemInfo.getLocalTime()` | `object` | none | Get current local system time as a DateTime object |

```javascript
var now = Host.SystemInfo.getLocalTime();
```

The returned object has the same properties as `Host.DateTime` object properties.
