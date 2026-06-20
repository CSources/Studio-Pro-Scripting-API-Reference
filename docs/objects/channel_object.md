---
sidebar_position: 4
---
# Channel Object

The channel object is accessed via the `.channel` property on a track object from `context.mainTrackList`. It is the main channel-strip surface for routing, mix state, and editor access. Only exposes `MusicTrack` and `AudioTrack`. For other mixer-only channel types (`AudioGroup`, `AudioSynth`, `AudioAux`, `AudioEffect`, `AudioVCA`, etc.), see [Mixer Channels](mixer_channels.md).

See [Track Object](track_object.md) for the full track surface.

## Properties

Properties vary by channel type (`"MusicTrack"` vs `"AudioTrack"`)

| Property | Type | Writable | MusicTrack Ex. | AudioTrack Ex. | Description |
|---|---|---|---|---|---|
| `canDisable` | `flag` | — | `0` | `1` | `0` = MusicTrack (not disableable), `1` = AudioTrack (disableable) |
| `canMuteSolo` | `flag` | — | `1` | `1` | `1` = mute/solo available on all track types |
| `channelType` | `string` | — | `"MusicTrack"` | `"AudioTrack"` | Channel type identifier. |
| `disabled` | `flag` | Conditional | `0` | `0` | Track disabled state. Writable when `canDisable` is `1` (AudioTrack). MusicTrack ignores writes. |
| `editGroup` | `string` | — | group name | Edit group name. |
| `editor` | `object` | — | ChannelEditor | ChannelEditor | Channel editor object. See [Editor](#editor). |
| `environment` | `string` | — | `"SongEnvironment"` | `"SongEnvironment"` | Environment identifier. |
| `inserts` | `object` | — | — | Inserts object | Channel insert effects chain (AudioTrack only). See [Inserts](#inserts). |
| `label` | `string` | — | Same as title | Same as title | Display label (alias). |
| `maxVolume` | `number` | — | — | `3.162` | Maximum fader value (AudioTrack only). |
| `mediaType` | `string` | — | `"Music"` | `"Audio"` | Media type. |
| `mute` | `flag` | Yes | `0` | `0` | `0` = not muted, `1` = muted |
| `name` | `string` | — | `"Channel02"` | `"Channel01"` | Internal channel name. |
| `overview` | `object` | — | ChannelOverview | ChannelOverview | Channel overview object. See [Overview](#overview). |
| `pan` | `number` | Yes | — | `0.5` | Pan position (AudioTrack only). `0.0` = left, `0.5` = center, `1.0` = right. |
| `recordUnit` | `object` | — | RecordUnit | RecordUnit | Record unit object. See [Record Unit](#record-unit). |
| `solo` | `flag` | Yes | `0` | `0` | `0` = not soloed, `1` = soloed |
| `soloSafe` | `flag` | Yes | `0` | `0` | `0` = not safe, `1` = solo safe |
| `title` | `string` | — | `"Instrument"` | `"Audio"` | Display name / label. |
| `volume` | `number` | Yes | — | `1` | Fader level (AudioTrack only). Range 0.0–`maxVolume`. |

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `connectTo(targetChannel)` | `number` | `targetChannel` (`object`, req): Destination channel. | Route to another channel (bus assign). |
| `find(name)` | — | `name` (`string`, req): Child name. | Find a child object by name. |
| `findParameter(name)` | `object` — [`param`](../context/parameters.md#param-object) | `name` (`string`, req): Parameter key. | Find a parameter by name. |
| `focus()` | — | (none) | Focus channel in the mixer. |
| `getDestinationChannel()` | `object` — [`AudioOutput`](mixer_channels.md#audiooutput) | (none) | Get current routing destination. |
| `interpretCommand(category, name)` | — | `category, name` (`string`, req): Command to execute. | Execute a command on this channel. |
| `openEditor()` | `number` | (none) | Open the channel editor window. |

## Sub-Objects

All channel sub-objects share a common surface.

### Common Surface

**Properties:**

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"ChannelEditor"` | Object identifier |
| `title` | `string` | No | `"ChannelEditor"` | Display name |
| `parent` | `object` | No | Channel | Back-reference to owning channel |

**Methods:**

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `find(name)` | `object` | `name` — child name | Find a child object |
| `findParameter(name)` | `object` — [`param`](../context/parameters.md#param-object) | `name` — parameter key | Find a parameter by name |
| `interpretCommand(category, name)` | — | `category` — command category, `name` — command name | Execute a command on this channel |

### Editor

Accessed via the `.editor` property of the channel object.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `windowClass` | `string` | No | `"ChannelEditor"` | Editor window class |

Also has the [common surface](#common-surface).

### Inserts

Accessed via the `.inserts` property of the channel object. Present only on AudioTrack channels.

#### Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `addDeviceParamName` | `string` | No | `"AudioFXRack/PlugInSelector/plugList"` | Parameter path for adding devices. |
| `channel` | `object` | No | — | Back-reference to owning channel. |
| `hasAddDeviceParam` | `number` | No | `1` | Flag indicating the inserts chain supports adding devices via parameter. |
| `hasManagedDevices` | `number` | No | `0` | Flag indicating managed device support. |
| `name` | `string` | No | `"Inserts"` | Internal name. |
| `numChildren` | `number` | No | `8` | Number of insert slots. Varies by project audio configuration. |
| `parent` | `object` | No | — | Back-reference to owning channel. |

### Overview

Accessed via the `.overview` property of the channel object. Only has the [common surface](#common-surface).

### Record Unit

Accessed via the `.recordUnit` property of the channel object. Exposes recording state. Same surface on MusicTrack and AudioTrack.

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `monitorActive` | `flag` | Yes | `0` | `0` = monitor off, `1` = monitor on |
| `recordArmed` | `flag` | Yes | `0` | `0` = not armed, `1` = armed |

Also has the [common surface](#common-surface).

### AudioOutput

`AudioOutput` is the audio Output returned by `getDestinationChannel()` on routed AudioTracks. Not available on MusicTracks. See [Mixer Channels — AudioOutput](mixer_channels.md#audiooutput) for the full surface.

## `findParameter()` Availability

| Parameter | MusicTrack | AudioTrack |
|---|---|---|
| `"automationMode"` | ✓ | ✓ |
| `"color"` | ✓ | ✓ |
| `"monitor"` | ✓ | ✓ |
| `"mute"` | ✓ | ✓ |
| `"pan"` | — | ✓ |
| `"solo"` | ✓ | ✓ |
| `"tempo"` | — | — |
| `"transpose"` | ✓ | — |
| `"velocity"` | ✓ | — |
| `"volume"` | — | ✓ |

### Parameter object surface

Returned by `findParameter(name)`. The returned parameter object has the following properties:

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `name` | `string` | No | `"mute"` | Parameter name |
| `value` | `number` | No | `0` | Current value |
| `string` | `string` | No | `"0"` | Formatted string (e.g. `"0dB"` for volume) |

```javascript
// channel — from track.channel, track - from context.mainTrackList.getTrack(index)
var param = channel.findParameter("mute");
// param.name  → "mute"
// param.value → 0
// param.string → "0"
```

#### `automationMode` values:

| value | `.string` | Available on |
|---|---|---|
| `0` | `"Auto: Off"` | MusicTrack, AudioTrack |
| `1` | `"Read"` | AudioTrack |
| `2` | `"Touch"` | AudioTrack |
| `3` | `"Latch"` | AudioTrack |
| `4` | `"Write"` | AudioTrack |

#### `color` values:

Returns an integer color value. `.string` returns `"#RRGGBBAA"` hex format.

| value | `.string` |
|---|---|
| -14342725 | "#BB2525FF" |

## Save / Restore Pattern

```javascript
// channel — from track.channel, track - from context.mainTrackList.getTrack(index)
// Only available in performEdit (TrackEdit context)

// Save
var data = {
  mute:     channel.mute,
  solo:     channel.solo,
  disabled: channel.disabled,
  vol:      channel.volume,
  pan:      channel.pan
};
if (channel.recordUnit) {
  data.arm = channel.recordUnit.recordArmed;
  data.mon = channel.recordUnit.monitorActive;
}

// Restore
if (channel.canMuteSolo) {
  channel.mute = data.mute;
  channel.solo = data.solo;
}
if (channel.canDisable) channel.disabled = data.disabled;
if (typeof channel.volume !== "undefined") channel.volume = data.vol;
if (typeof channel.pan    !== "undefined") channel.pan    = data.pan;
```

## Routing Example

```javascript
// console — from context.functions.root.environment.find("MixerConsole")
// channel — from track.channel, track - from context.mainTrackList.getTrack(index)
// Only available in performEdit (TrackEdit context)

// Find a bus (sub-out) by name
var subList = console.getChannelList(2); // Sub-outs
var dimSoloBus = null;
for (var i = 0; i < subList.numChannels; i++) {
  var bus = subList.getChannel(i);
  if (bus.label === "Dim Solo") {
    dimSoloBus = bus;
    break;
  }
}

// Route the channel to the dim solo bus
if (dimSoloBus) {
  channel.connectTo(dimSoloBus);
}

// Route back to master (masterBus retrieved via console.getChannelList(3).getChannel(0))
channel.connectTo(masterBus);

// Check current routing
if (channel.getDestinationChannel() === dimSoloBus) {
  // Channel is routed to dim solo bus
}
```