# Studio Pro Scripting API

Welcome to the Studio Pro scripting API reference. This documentation is intended to cover the exposed scripting surface of Studio Pro, formerly Studio One. Thanks to the work of people in the community who have provided insight or created scripts over the years, we're able to further explore and document the scripting API.

This is not a complete reference. There is plenty of missing, improperly structured, and potentially incorrect information in this documentation. Community participation is welcome and necessary to improve the documentation further.

---

## Table of Contents

| Section | Description |
|---|---|
| [Package Structure](package_structure/package_structure.md) | Required files, metainfo.xml, classfactory.xml |
| [Script Interface](script_interface.md) | Task lifecycle, factory functions, include_file |
| [Host API](host/host_overview.md) | Host namespace — Classes, Engine, GUI, IO, Signals, etc. |
| [SDK Files](sdk/sdk_files.md) | CCL.JS, Engine.JS, Devices.JS, HostUtils, etc. |
| [Context Object](context/context_object.md) | editor, functions, iterator, parameters, track list |
| [Objects](objects/event_object.md) | Event, Region, Track, Channel, Mixer, Time objects |
| [Skin XML Reference](skin/skin_overview.md) | Known skin.xml element and attribute reference |
| [Utilities](utilities/utilities.md) | Color, tempo, level conversions; debugging tools |
| [Scripts](scripts/index.md) | Real-world script implementation examples |
| [API Index](api_index.md) | Map of all documentation pages |

<br/>
⚠️ **Disclaimer:** Fender/PreSonus does not provide official public documentation for this API. This reference is entirely community-derived and incomplete. The API is internal and undocumented.