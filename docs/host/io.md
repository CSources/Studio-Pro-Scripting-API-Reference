---
sidebar_position: 7
---
# IO

Read, write, and inspect files through `Host.IO`. All file paths use [`Host.Url`](url.md) objects.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `Host.IO.createPackage(path, type)` | `object` | `path` — `Host.Url` path, `type` — format (e.g. `"application/zip"`) | Create a `.package` archive. Returned object has `setOption()`, `create()`, `embedd(folder)`, `flush()`, `close()` |
| `Host.IO.createTextFile(path)` | `object` | `path` — `Host.Url` path | Create a text file for writing (`.writeLine(text)`, `.close()`) |
| `Host.IO.File(path)` | `object` | `path` — `Host.Url` path | Get a file operation object (`.exists()`, `.copyTo()`, `.remove()`) |
| `Host.IO.findFiles(folder, pattern)` | `object` | `folder` — folder path, `pattern` — glob pattern | Find files matching a pattern. |
| `Host.IO.fromBase64(data)` | `string` | `data` — Base64 string | Decode Base64 data |
| `Host.IO.getDevelopmentFileLocation()` | `string` | none | Get the development file storage path |
| `Host.IO.loadJsonFile(path)` | `object` | `path` — `Host.Url` path | Load a JSON file into a native JavaScript object |
| `Host.IO.toBase64(data)` | `string` | `data` — string data to encode | Encode data as Base64 |
| `Host.IO.openPackage(path, type)` | `object` | `path` — `Host.Url` path, `type` — format (e.g. `"application/zip"`) | Open a `.package` archive. Returned object: `extract(folder)` |
| `Host.IO.openTextFile(path)` | `object` | `path` — `Host.Url` path | Open a text file for reading (`.readLine()`, `.endOfStream`, `.close()`) |
| `Host.IO.XmlTree(path)` | `object` | `path` — `Host.Url` path | Parse an XML file into a navigable tree |

## Create Package

`Host.IO.createPackage()` returns a package builder object.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setOption(name, value)` | — | `name` — option name, `value` — option value | Set a package option (e.g. `"compressed"`, `true`) |
| `create()` | — | none | Create the package file |
| `embedd(folder)` | — | `folder` — `Host.Url` path to a folder | Embed all files from a folder into the package |
| `flush()` | — | none | Flush pending writes |
| `close()` | — | none | Close and finalize the package |

```javascript
var folder = Host.Url("local://$USERCONTENT/my-folder/");
var pkg = Host.IO.createPackage(path, "application/zip");
pkg.setOption("compressed", true);
pkg.create();
pkg.embedd(folder);
pkg.flush();
pkg.close();
```

## Create Text File

`Host.IO.createTextFile()` returns a text file writer object.

```javascript
var file = Host.IO.createTextFile(path);
if (file) {
  file.writeLine("content");
  file.close();
}
```

## File Operations Object

`Host.IO.File()` returns a file operation object for the given path.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `exists()` | `number` | none | Check whether a file exists (returns `1` if found, `0` if not) |
| `copyTo(dest)` | — | `dest` — destination `Host.Url` | Copy a file to a destination |
| `remove()` | — | none | Delete a file or directory |

## Find Files

`Host.IO.findFiles()` returns an iterator of matching files as `Host.Url` objects.

**Iterator methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `done()` | `number` | none | Check whether iteration is complete (returns `0` while items remain, `1` when exhausted) |
| `next()` | `object` | none | Get the next file item |
| `first()` | — | none | Move to the first item |
| `last()` | — | none | Move to the last item |
| `previous()` | `object` | none | Get the previous file item |

```javascript
var it = Host.IO.findFiles(folder, "*.xml");
while (!it.done()) {
  var file = it.next();
  var name = file.name;
}
```

## From Base64

`Host.IO.fromBase64()` decodes a Base64 string.

```javascript
var decoded = Host.IO.fromBase64(data);
```

## Load JSON File

`Host.IO.loadJsonFile()` loads and parses a JSON file.

```javascript
var data = Host.IO.loadJsonFile(Host.Url("local://$USERCONTENT/myfile.json"));
```

## Open Package

`Host.IO.openPackage()` opens an existing `.package` archive for reading.

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `extract(folder)` | — | `folder` — `Host.Url` path to extract to | Extract all package contents to a folder |

```javascript
var pkg = Host.IO.openPackage(path, "application/zip");
if (pkg) {
  var folder = Host.Url("memory://ExtractTarget/", true);
  pkg.extract(folder);
}
```

## Open Text File

`Host.IO.openTextFile()` opens a text file for reading.

```javascript
var file = Host.IO.openTextFile(path);
if (file) {
  while (!file.endOfStream) {
    var line = file.readLine();
  }
  file.close();
}
```

## To Base64

`Host.IO.toBase64()` encodes a string as Base64.

```javascript
var encoded = Host.IO.toBase64(data);
```

## XML Tree

`Host.IO.XmlTree()` parses an XML file into a navigable tree. The tree object has `root` and `errorMessage` properties. Nodes are returned by `tree.root` and `node.findNode()`.

**Tree properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `errorMessage` | `string` | No | `""` | Error message, empty on success |
| `root` | `object` | No | — | Root node of the parsed XML |

**Tree methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `loadFromFile()` | — | none | Reload the XML from file |
| `saveToFile()` | — | none | Save modifications back to file |

**Node properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"SomeSection"` | Tag name |
| `text` | `string` | No | `"value"` | Text content |
| `comment` | `string` | No | `"<!-- comment -->"` | Comment content |
| `parent` | `object` | No | — | Parent node object |

**Node methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addChild(node)` | — | `node` — child node object | Add a child node |
| `find(name)` | `object` | `name` — tag name | Find first child with matching tag name (alias for `findNode`) |
| `findNode(name)` | `object` | `name` — tag name | Find first child with matching tag name |
| `getAttribute(name)` | `string` | `name` — attribute name | Get an attribute value |
| `newIterator()` | `object` | none | Create an iterator over child nodes |
| `newNode()` | `object` | none | Create a new child node |
| `setAttribute(name, value)` | — | `name` — attribute name, `value` — attribute value | Set an attribute |

```javascript
var tree = Host.IO.XmlTree(Host.Url("local://$APPCONFIG/User.options"));
var root = tree.root;
var child = root.findNode("SomeSection");
var val = child.getAttribute("someAttr");

var it = root.newIterator();
while (!it.done()) {
  var node = it.next();
  Host.Console.writeLine(node.name);
}
```