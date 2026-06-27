# API Index

## Setup & Packaging

| Page | Description |
|---|---|
| [Package Structure](package_structure/package_structure.md) | Required/optional files in a `.package` |
| [metainfo.xml](package_structure/metainfo.md) | Package identity and metadata |
| [classfactory.xml](package_structure/classfactory.md) | Script registration and categories |
| [Resources](package_structure/resources.md) | Runtime resource access via `package://` |
| [Installation](package_structure/installation.md) | Scripts folder locations and hot-reloading |
| [Creating a .package File](package_structure/package_creation.md) | Zip-based packaging for distribution |

## Script Types

| Page | Description |
|---|---|
| [Script Interfaces](script_types/script_interfaces.md) | Category reference |
| [EditTask](script_types/edittask.md) | Command/action scripts with optional dialog |
| [EditAddIn](script_types/editaddin.md) | Persistent add-in panels |
| [WindowClass](script_types/windowclass.md) | Non-blocking workspace windows via FrameworkService |

## Host API

| Page | Description |
|---|---|
| [Host Overview](host/host_overview.md) | Top-level Host object and platform access |
| [Attributes](host/attributes.md) | Key-value attribute read/write and iteration |
| [Classes](host/classes.md) | Built-in class instantiation |
| [Command Reference](host/command_reference.md) | All host commands by category |
| [DateTime](host/datetime.md) | Date string parsing and formatting |
| [Engine](host/engine.md) | Formatters and track presentation helpers |
| [GUI](host/gui.md) | Dialog, command, and theme management |
| [Interfaces](host/interfaces.md) | Required interface tokens for script lifecycle |
| [IO](host/io.md) | File and package I/O operations |
| [Objects](host/objects.md) | Object lookup and registration |
| [Results](host/results.md) | Standard result code constants |
| [Services](host/services.md) | Host service instance lookup |
| [Settings](host/settings.md) | Session-level persistent attributes |
| [Signals](host/signals.md) | Pub/sub messaging between scripts and observers |
| [URL](host/url.md) | Host path manipulation and display |
| [Utilities](host/utilities.md) | Console logging, platform detection, sleep |

## SDK Files

| Page | Description |
|---|---|
| [CCL.JS](sdk/cclapp.md) | Application and window manager API wrappers |
| [Engine.JS](sdk/engine.md) | Track class and media pool constants |
| [Devices.JS](sdk/devices.md) | Port type and device constants |
| [HostUtils](sdk/hostutils.md) | Package, mixer, and document utility accessors |

## Context & Objects

| Page | Description |
|---|---|
| [Context Object](context/context_object.md) | Script execution entry point |
| [Context Methods](context/methods.md) | Context state and attribute management |
| [Editor](context/editor.md) | Active editor surface and operations |
| [Functions](context/functions.md) | Document edit operation dispatch |
| [Iterator](context/iterator.md) | Selected event iteration |
| [mainTrackList](context/mainTrackList.md) | Track selection and indexing |
| [Parameters](context/parameters.md) | Dialog parameter creation and bindings |
| [Event Object](objects/event_object.md) | Event types and common properties |
| [Region Object](objects/region_object.md) | Part/region hierarchy and iteration |
| [Track Object](objects/track_object.md) | Track properties and channel access |
| [Channel Object](objects/channel_object.md) | Channel strip controls and routing |
| [Mixer Channels](objects/mixer_channels.md) | Channel list access and mixer navigation |
| [Time Object](objects/time_object.md) | Time representation and conversions |

## Skin XML Reference

| Page | Description |
|---|---|
| [Document Structure](skin/structure.md) | Skin file structure and top-level elements |
| [Layout Containers](skin/layout_containers.md) | All layout and container elements |
| [Control Flow](skin/control_flow.md) | Template, conditional, and delegate elements |
| [Text & Display](skin/text_display.md) | Read-only display and content elements |
| [Input Controls](skin/input_controls.md) | All interactive input widget elements |
| [List Controls](skin/listview.md) | List view element |
| [Style Helpers](skin/style_helpers.md) | Visual property and metric definition elements |
| [Image & Shape Resources](skin/image_shape.md) | Image and geometric resource elements |
| [Skin.xml Index](skin/skin_index.md) | Complete element table and attribute index |

## Utilities & Tools

| Page | Description |
|---|---|
| [Utilities & Conversions](utilities/utilities.md) | Unit conversion and utility helpers |
| [Debugging Utilities](utilities/debugging_utilities.md) | Runtime introspection and probe utilities |