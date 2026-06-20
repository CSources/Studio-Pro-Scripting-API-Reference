---

sidebar_position: 6

---

# HelpID

`include_file("resource://{main}/sdk/helpids.js")` provides the `HelpID` namespace with constants for UI areas used by `Host.GUI.Help.highlightControl()`.

```javascript
include_file("resource://{main}/sdk/helpids.js");

Host.GUI.Help.highlightControl(HelpID.kBrowser);
```

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `makePath(...ids)` | `string` | `...ids` — help ID strings to join | Joins multiple help IDs into a dot-separated path |

## Constants

| Constant | Value | Category |
|---|---|---|
| `kArrangement` | `"Arrangement"` | Main areas |
| `kBrowser` | `"Browser"` | Main areas |
| `kClient` | `"client"` | Main areas |
| `kConsole` | `"Console"` | Main areas |
| `kInspector` | `"Inspector"` | Main areas |
| `kLauncher` | `"Launcher"` | Main areas |
| `kSong` | `"Song"` | Main areas |
| `kTrackListInspector` | `"TrackListInspector"` | Main areas |
| `kTransportPanel` | `"TransportPanel"` | Main areas |
| `kUpperArrangement` | `"UpperArrangement"` | Main areas |
| `kArrangerTrack` | `"@TrackController{ArrangerTrack}"` | Track |
| `kTrackControls0` | `"TrackControls0"` | Track controls |
| `kTrackControls1` | `"TrackControls1"` | Track controls |
| `kRecord` | `"record"` | Transport |
| `kVolume` | `"volume"` | Mixer |
| `kMeterDisplay` | `"meterDisplay"` | Mixer |
| `kRecordArmed` | `"recordArmed"` | Track |
| `kInstrumentEditor` | `"instrumentEditor"` | Editor |
| `kSongToolBarArrowTool` | `"SongToolbar.Arrow Tool"` | Toolbar |
| `kSongToolBarEraserTool` | `"SongToolbar.Eraser Tool"` | Toolbar |
| `kSongToolBarLauncherToggle` | `"SongToolbar.Launcher@Launcher"` | Toolbar |
| `kSongToolBarLauncherButtons` | `"LauncherToolbarButtons"` | Toolbar |
| `kAudioFXEditorFocusDevice` | `"takeFocus"` | FX editor |
| `kSpatialAudioMasterEditor` | `"masterEditor"` | Spatial audio |
| `kSpatialAudioEditorWindow` | `"SpatialAudioEditor"` | Spatial audio |
| `kMixerAudioIOSetup` | `"MixerAudioIOSetupButton"` | Mixer |
| `kChannelOutputPort` | `"outputPort"` | Channel |
| `kChannelPannerMenu` | `"pannerMenu"` | Channel |
| `kChannelInsertsSpeakerSetup` | `"SpeakerMap"` | Channel |
| `kLauncherScenes` | `"LauncherScenes"` | Launcher |
| `kLauncherPlaylist` | `"LauncherPlaylist"` | Launcher |
| `kLauncherPlaylistActivate` | `"activatePlaylist"` | Launcher |
| `kLauncherPlaylistMenu` | `"playlistMenu"` | Launcher |
| `kPatternShowLanes` | `"showLanes"` | Pattern editor |
| `kPatternEditor` | `"@Song/MusicPatternPartEditor/PatternEdit"` | Pattern editor |
| `kPatternSetEvery4thStep` | `"@Song/MusicPatternPartEditor/PatternEdit.Pattern^.Set Every 4th Step"` | Pattern editor |
| `kPatternControlLanes` | `"MusicPatternControlLanes"` | Pattern editor |
| `kPatternShowVariations` | `"ShowVariations"` | Pattern editor |
| `kPatternLaneToolButtons` | `"LaneToolButtons"` | Pattern editor |
| `kAmpireInputGainSection` | `"InputGainSection"` | Ampire |
| `kAmpireInputGain` | `"InputGainSection.level"` | Ampire |
| `kHomeDeviceSetup` | `"DeviceSetup"` | Home page |
| `kHomeArtistProfile` | `"ArtistProfile"` | Home page |
| `kHomeSelectorStartPageDocuments` | `"SelectorStartPageDocuments"` | Home page |
| `kHomeFileButtons` | `"FileButtons"` | Home page |

See [GUI Help](../host/gui.md#help) for usage with `Host.GUI.Help` methods.