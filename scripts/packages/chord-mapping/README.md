# Chord Mapping

## Overview
Scrapes selected chord events from the Chord Track, extracts data (name, type, root/bass pitches, timing), saves Chord_Mapping.json & Chord_Mapping_Results.txt to local://$USERCONTENT/.

## Installation
| Platform | Scripts folder |
|----------|----------------|
| Windows  | `C:\\Program Files\\Fender\\Studio Pro 8\\Scripts\\` |
| macOS    | `/Applications/Studio Pro 8.app/Contents/Scripts/` |

Copy Chord Mapping.package to the folder. Restart Studio Pro if needed.

## Usage
1. Open Chord Track in Arrangement View, select desired chords (or Edit > Select All).
2. Run \"Chord Mapping\" from Action menu (API Tests > EventEdit).
3. Check local://$USERCONTENT/Chord_Mapping.json & Chord_Mapping_Results.txt (e.g., ~/Library/Application Support/Studio Pro/ on macOS).

## Tips
- Processes **only selected chords** (no auto-select).
- Use in EventEdit context on Chord Track.
- JSON includes: name, type, root/bass, pitches, start/end times, isLydian.
