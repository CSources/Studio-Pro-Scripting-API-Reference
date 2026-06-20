---
sidebar_position: 1
---
# Host Overview

The `Host` namespace is the top-level entry point for all host services — command execution, dialog management, object access, engine services, file I/O, signals, and more.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| [`Classes`](host/classes.md) | `object` | No | `Host.Classes.createInstance(id)` | Class factory and inspection |
| [`Console`](host/utilities.md#console) | `object` | No | `Host.Console.writeLine(text)` | Console output for debugging |
| [`Engine`](host/engine.md) | `object` | No | `Host.Engine.TrackFormats` | Track format, color, speaker, and formatter helpers |
| [`GUI`](host/gui.md) | `object` | No | `Host.GUI.Commands.interpretCommand(...)` | Command execution, dialogs, clipboard, themes, URL handling |
| [`Interfaces`](host/interfaces.md) | `object` | No | `Host.Interfaces.IEditTask` | Interface capability markers for `this.interfaces` |
| [`IO`](host/io.md) | `object` | No | `Host.IO.openTextFile(path)` | File read/write, JSON, XML, Base64 |
| [`Objects`](host/objects.md) | `object` | No | `Host.Objects.getObjectByUrl(url)` | URL-based host object access |
| [`Results`](results.md) | `object` | No | `Host.Results.kResultOk` | Standard result code constants |
| [`Services`](host/services.md) | `object` | No | `Host.Services.getInstance(id)` | Service locator for inter-script singleton access |
| [`Settings`](host/settings.md) | `object` | No | `Host.Settings.getAttributes()` | Script-local key-value persistence between phases |
| [`Signals`](host/signals.md) | `object` | No | `Host.Signals.signal(ch, name, payload)` | Pub/sub messaging between scripts |
| [`SystemInfo`](datetime.md#systeminfo) | `object` | No | `Host.SystemInfo.getLocalTime()` | System time access |
| [`studioapp`](host/objects.md#root-url-object) | `object` | No | `Host.studioapp.interpretCommand(...)` | Root URL object, same as `://hostapp` |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| [`Host.Attributes(array)`](host/attributes.md) | `object` | `array` — flat key-value array (`["key", "val", ...]`) | Wrap a key-value array into an Attributes object |
| [`Host.DateTime(date)`](host/datetime.md) | `object` | `date` — date string (e.g. `"2026/01/01"`) | Parse a date string into a DateTime object |
| [`Host.Url(path)`](host/url.md) | `object` | `path` — URL string (e.g. `"local://$USERCONTENT/..."`) | Construct a URL path object |
| [`Host.getPlatform()`](host/utilities.md#platform-detection) | `string` | none | Detect current platform (`"win"` or `"mac"`) |
| [`Host.sleep(ms)`](host/utilities.md#sleep) | — | `ms` — milliseconds to sleep | Sleep for a given duration |