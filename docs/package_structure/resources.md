---
sidebar_position: 4
---
# Resources

The `resources/` directory stores auxiliary files that the script loads at runtime, such as CommandBar menu and toolbar XML layouts.

Files in `resources/` are accessed with `Host.Url()` using the `package://` scheme and the package ID declared in `metainfo.xml`:

```javascript
var menuUrl = Host.Url("package://" + PackageID + "/resources/menu.xml");
```

The returned `Host.Url` object can be passed to file reading methods like `Host.IO.openTextFile()` or `Host.IO.XmlTree()`. See [`Host.Url`](../host/url.md) and [`Host.IO`](../host/io.md) for full surfaces.