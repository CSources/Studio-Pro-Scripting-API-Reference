---
sidebar_position: 5
---
# Mixer Channels

Mixer channels are accessed via the Mixer Console, not through track object `.channel` property. Use `console.getChannelList(type)` to retrieve different channel lists.

See [Channel Object](channel_object.md) for `MusicTrack` and `AudioTrack` channels (accessed via the `.channel` property).

## Channel Types

Each channel list entry has a `channelType` string that identifies its role.

**Channel List Types:**

| Type | Contents | Example channelType values |
|---|---|---|
| `1` | Normal mixer channels | AudioSynth, AudioTrack, AudioAux, MusicTrack, AudioEffect, AudioGroup, AudioVCA |
| `2` | Sub-output busses | AudioOutput |
| `3` | Master output + listen bus | AudioOutput, AudioListenBus |
| `4` | Hardware inputs | AudioInput |

```javascript
var console = context.functions.root.environment.find("MixerConsole");
var normal    = console.getChannelList(1);  // All mixer channels
var subOuts   = console.getChannelList(2);  // Sub-output busses
var master    = console.getChannelList(3);  // Master + listen bus
var hwInputs  = console.getChannelList(4);  // Hardware inputs
```

Each `getChannelList(type)` returns an object for iterating and accessing channels:

## Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `numChannels` | `number` | No | `16` | Total count of channels in the list. |
| `numSelectedChannels` | `number` | No | `1` | Count of selected channels in the list. |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `getChannel(index)` | `object` | `index` (`number`, req): 0-based index. | Returns the channel at the given index. |
| `getSelectedChannel(index)` | `object` | `index` (`number`, req): 0-based index. | Returns the selected channel at the given index. |

### AudioGroup

Bus/subgroup channel (e.g. "Bus 1").

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioGroup"` | Channel type identifier. |
| `editor` | `object` | No | — | Channel editor object. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `mute` | `flag` | Yes | `0` | Mute state. |
| `name` | `string` | No | `"Channel01"` | Internal channel name. |
| `overview` | `object` | No | — | Channel overview object. |
| `pan` | `number` | Yes | `0.5` | Pan position. |
| `parent` | `object` | No | — | Parent bus object. |
| `solo` | `flag` | Yes | `0` | Solo state. |
| `title` | `string` | No | `"Bus 1"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `connectTo(targetChannel)` | `number` | `targetChannel` (`object`, req): Destination channel. | Route to another output. Returns `1` on success. |
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor. Returns `1` when opened. |
| `getDestinationChannel()` | `object` | (none) | Returns the current output destination. |

### AudioOutput

Master or sub-output bus (e.g. "Main").

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioOutput"` | Channel type identifier. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `name` | `string` | No | `"Channel01"` | Internal name. |
| `title` | `string` | No | `"Main"` | Display name. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `editor` | `object` | No | — | [Channel editor object](../objects/channel_object.md#editor) |
| `overview` | `object` | No | — | [Channel overview object](../objects/channel_object.md#overview) |
| `parent` | `object` | No | — | Parent bus object. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `connectTo(targetChannel)` | `number` | `targetChannel` (`object`, req): Destination channel. | Route to another output. Returns `1` on success. |
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor for this output. Returns `1` when opened. |

**Parent chain:** `AudioOutput → Channels → AudioMixer` (not `MusicTrackDevice`).

### AudioSynth

Instrument/synth channel.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioSynth"` | Channel type identifier. |
| `editor` | `object` | No | — | Channel editor object. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `mute` | `flag` | Yes | `0` | Mute state. |
| `name` | `string` | No | `"Channel04"` | Internal channel name. |
| `overview` | `object` | No | — | Channel overview object. |
| `pan` | `number` | Yes | `0.5` | Pan position. |
| `parent` | `object` | No | — | Parent bus object. |
| `solo` | `flag` | Yes | `0` | Solo state. |
| `title` | `string` | No | `"SampleOne 3"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|---|
| `connectTo(targetChannel)` | `number` | `targetChannel` (`object`, req): Destination channel. | Route to another output. Returns `1` on success. |
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor. Returns `1` when opened. |
| `getDestinationChannel()` | `object` | (none) | Returns the current output destination. |

### AudioAux

Aux channel.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioAux"` | Channel type identifier. |
| `editor` | `object` | No | — | Channel editor object. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `mute` | `flag` | Yes | `0` | Mute state. |
| `name` | `string` | No | `"Channel01"` | Internal channel name. |
| `overview` | `object` | No | — | Channel overview object. |
| `pan` | `number` | Yes | `0.5` | Pan position. |
| `parent` | `object` | No | — | Parent bus object. |
| `solo` | `flag` | Yes | `0` | Solo state. |
| `title` | `string` | No | `"Aux 1"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `connectTo(targetChannel)` | `number` | `targetChannel` (`object`, req): Destination channel. | Route to another output (returns `1`, but routing does not change — aux channels are receive-only). |
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor. Returns `1` when opened. |
| `getDestinationChannel()` | — | (none) | — |

### AudioEffect

FX channel.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioEffect"` | Channel type identifier. |
| `editor` | `object` | No | — | Channel editor object. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `mute` | `flag` | Yes | `0` | Mute state. |
| `name` | `string` | No | `"Channel01"` | Internal channel name. |
| `overview` | `object` | No | — | Channel overview object. |
| `pan` | `number` | Yes | `0.5` | Pan position. |
| `parent` | `object` | No | — | Parent bus object. |
| `solo` | `flag` | Yes | `0` | Solo state. |
| `title` | `string` | No | `"FX 1"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|---|
| `connectTo(targetChannel)` | `number` | `targetChannel` (`object`, req): Destination channel. | Route to another output. Returns `1` on success. |
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor. Returns `1` when opened. |
| `getDestinationChannel()` | `object` | (none) | Returns the current output destination. |

### AudioVCA

VCA channel.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioVCA"` | Channel type identifier. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `mute` | `flag` | Yes | `0` | Mute state. |
| `name` | `string` | No | `"Channel01"` | Internal channel name. |
| `parent` | `object` | No | — | Parent bus object. |
| `solo` | `flag` | Yes | `0` | Solo state. |
| `title` | `string` | No | `"VCA 1"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |

### AudioListenBus

Listen bus channel.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioListenBus"` | Channel type identifier. |
| `editor` | `object` | No | — | Channel editor object. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `name` | `string` | No | `"Channel01"` | Internal channel name. |
| `overview` | `object` | No | — | Channel overview object. |
| `parent` | `object` | No | — | Parent bus object. |
| `title` | `string` | No | `"Listen Bus"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor. Returns `1` when opened. |

### AudioInput

Hardware input channel. Represents a physical audio interface/mixer input.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `channelType` | `string` | No | `"AudioInput"` | Channel type identifier. |
| `editor` | `object` | No | — | Channel editor object. |
| `environment` | `string` | No | `"SongEnvironment"` | Environment identifier. |
| `label` | `string` | No | Same as title | Display label (alias). |
| `maxVolume` | `number` | No | `3.162` | Maximum fader value. |
| `mediaType` | `string` | No | `"Audio"` | Media type. |
| `name` | `string` | No | `"Channel01"` | Internal channel name. |
| `overview` | `object` | No | — | Channel overview object. |
| `parent` | `object` | No | — | Parent bus object. |
| `solo` | `flag` | Yes | `0` | Solo state. |
| `title` | `string` | No | `"Desk Mic"` | Display name. |
| `volume` | `number` | Yes | `1` | Fader level. |

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `focus()` | — | (none) | Scroll the mixer view to bring this channel into focus. |
| `openEditor()` | `number` | (none) | Open the Channel Editor. Returns `1` when opened. |

## Focus Example

```javascript
var console = context.functions.root.environment.find("MixerConsole");
var list = console.getChannelList(1);

// Focus a specific channel by its display name
for (var i = 0; i < list.numChannels; i++) {
    var ch = list.getChannel(i);
    if (ch.title === "VCA 1") {
        ch.focus();
        break;
    }
}
```