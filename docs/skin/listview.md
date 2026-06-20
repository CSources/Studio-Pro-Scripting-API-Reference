---
sidebar_position: 7
---

# List Controls

## ListView

`ListView` is a table-style UI element that displays rows from a `Host:ListViewModel`.

**skin.xml Snippet:**

```xml
<ListView name="list" height="400" width="500"/>
```

| Attribute Name | Description | Type |
|---|---|---|
| `attach` | Layout attachment/alignment. | token |
| `height` | Explicit height. | number |
| `headerstyle` | Header style reference. | identifier |
| `hscroll.style` | Horizontal scrollbar style reference. | identifier |
| `name` | Binds to the controller-owned `Host:ListViewModel` property. | identifier |
| `options` | Visual and behavioral options. | token |
| `persistence.id` | Persistent layout state key. | identifier |
| `scrolloptions` | Scrollbar rendering. | token |
| `size` | Position and size geometry. | tuple |
| `sizelimits` | Defines size limits. | tuple |
| `style` | Style reference. | identifier |
| `viewtype` | View presentation mode. | identifier |
| `vscroll.style` | Vertical scrollbar style reference. | identifier |
| `title` | Display title. | text |
| `tooltip` | Tooltip text. | text |
| `width` | Explicit width. | number |

| **options** | Description |
|---|---|
| `columnfocus` | - |
| `exclusive` | Enables exclusive selection behavior. |
| `extendlastcolumn` | - |
| `header` | Shows the header row. |
| `hide` | - |
| `mousescroll` | - |
| `nodoubleclick` | - |
| `nodrag` | Disables dragging. |
| `nofocus` | - |
| `nolinebreak` | - |
| `nounselect` | - |
| `norubber` | - |
| `resizedraw` | - |
| `selection` | Enables row selection behavior. |
| `simplemouse` | - |
| `swallowalphachars` | - |
| `thumbnails` | - |
| `translucent` | - |
| `transparent` | - |
| `vertical` | - |

| **scrolloptions** | Description |
|---|---|
| `autobuttonsh` | Auto button show/hide. |
| `autohideboth` | Auto-hide both scrollbars. |
| `autohideh` | Auto-hide horizontal scrollbar. |
| `autohidev` | Auto-hide vertical scrollbar. |
| `border` | Scrollbar border. |
| `horizontal` | Renders horizontal scrollbar. |
| `noscreenscroll` | Disables screen scrolling. |
| `small` | Uses smaller UI metrics. |
| `transparent` | Renders transparent background. |
| `vertical` | Renders vertical scrollbar. |

**Notes**

- The controller must expose a `list` property containing the `Host:ListViewModel` instance.
- See [Host:ListViewModel](../host/classes.md#hostlistviewmodel) for the documented `Host:ListViewModel` binding path.

