---
sidebar_position: 12
---
# Signals

`Host.Signals` provides pub/sub messaging between scripts and observers.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.Signals.advise(channel, observer)` | — | `channel` — channel name string, `observer` — object with `notify()` | Subscribe an observer to a signal channel |
| `Host.Signals.unadvise(channel, observer)` | — | `channel` — channel name string, `observer` — previously subscribed object | Unsubscribe an observer from a signal channel |
| `Host.Signals.signal(channel, eventName, payload)` | — | `channel` — channel name string, `eventName` — event identifier, `payload` — Attributes object or string | Emit a signal to subscribed observers |
| `Host.Signals.flush()` | — | none | Flush pending host signals |
| `Host.Signals.postMessage(subject, delay, eventName)` | — | `subject` — target object, `delay` — delay in ms, `eventName` — event identifier | Posts a message to the subject |

## Observer Callback

Subscribers must implement `Host.Interfaces.IObserver` with a `notify(subject, msg)` method:

```javascript
this.interfaces = [Host.Interfaces.IObserver];

this.notify = function(subject, msg) {
  if (msg.id === "someEvent") {
    var payload = msg.getArg(0);
  }
};
```

See [Interfaces - IObserver](interfaces.md#iobserver) for full IObserver surface.