---

sidebar_position: 7

---

# Media.JS

`include_file("resource://{main}/sdk/media.js")` provides media type and speaker format enumerations.

```javascript
include_file("resource://{main}/sdk/media.js");

if (trackFormat.mediaType == Media.JS.MediaType.kMediaTypeAudio) { ... }
```

## Media.JS.Speakers

| Constant | Value |
|---|---|
| `kMono` | `0x1` |
| `kStereo` | `0x3` |

## Media.JS.MediaType

| Constant | Value |
|---|---|
| `kMediaTypeNone` | `"None"` |
| `kMediaTypeAudio` | `"Audio"` |
| `kMediaTypeVideo` | `"Video"` |
| `kMediaTypeMidi` | `"Midi"` |
| `kMediaTypeMusic` | `"Music"` |
| `kMediaTypePattern` | `"Pattern"` |
| `kMediaTypeDocument` | `"Document"` |
| `kMediaTypeSound` | `"Sound"` |
