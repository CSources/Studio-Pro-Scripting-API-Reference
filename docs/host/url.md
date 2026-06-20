---
sidebar_position: 15
---
# Url

`Host.Url(path)` constructs a URL path object for file operations, package resources, and navigation.

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"file.txt"` | Last path component |
| `url` | `string` | No | `"local://$USERCONTENT/folder/file.txt"` | Full URL string |
| `extension` | `string` | No | `"txt"` | File extension |
| `protocol` | `string` | No | `"local"`, `"memory"` | URL protocol scheme |
| `hostname` | `string` | No | `"$USERCONTENT"`, `"test"` | Host portion of the URL |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `ascend()` | — | none | Navigate up one directory level |
| `descend(name)` | — | `name` — subdirectory or file name string | Navigate into a subdirectory |
| `contains(filter)` | — | `filter` — filter string | Check or apply a named filter |
| `fromDisplayString(str)` | — | `str` — display string | Parse a file path from a display string |
| `getName()` | `string` | none | Get the last path component (same as `.name`) |
| `makeUnique()` | — | none | Generate a unique file name variant |
| `toDisplayString()` | `string` | none | Convert the path to a display string |

## URL Schemes

**local://$USERCONTENT/** — User content directory for persistent file storage.

```javascript
var path = Host.Url("local://$USERCONTENT/folder/file.txt");
path.ascend();                  // -> $USERCONTENT/folder/
path.descend("file.txt");       // -> $USERCONTENT/folder/file.txt
```

**package://PackageID/** — Package resources directory (PackageID from metainfo.xml).

```javascript
var res = Host.Url("package://" + packageID + "/resources/menu.xml");
```

**memory://** — Temporary in-memory URL. Supports `ascend()`/`descend()` navigation and `Host.IO.findFiles()`.

```javascript
var mem = Host.Url("memory://MyNamespace/", true);
mem.descend("child");   // url -> "memory://MyNamespace/child"
mem.ascend();           // url -> "memory://MyNamespace/"
```

## Document Path Access

The active document's `.path` property returns a `Host.Url`-like object.

```javascript
function getSongFolder(fileName) {
  var docManager = Host.Objects.getObjectByUrl("://hostapp/DocumentManager");
  var doc  = docManager.activeDocument;
  var path = doc.path;
  path.ascend();
  path.descend(fileName);
  return path;
}
```