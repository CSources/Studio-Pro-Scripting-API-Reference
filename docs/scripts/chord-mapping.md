---
sidebar_position: 3
---

# Chord Mapping

<details>

<summary>Click for details</summary>

The **Chord Mapping** script in this repository is a working example demonstrating:

- Chord event scraping from the Chord Track
- JSON file output using `Host.IO.createTextFile()` and `JSON.stringify()`
- Data extraction from chord events (name, type, root/bass pitches, timing)
- File I/O operations with `Host.Url()` path construction

**Source Code Files:**

- [`classfactory.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/chord-mapping-source/classfactory.xml)
- [`metainfo.xml`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/chord-mapping-source/metainfo.xml)
- [`main.js`](https://github.com/CSources/Studio-Pro-Scripting-API-Reference/blob/main/scripts/sources/chord-mapping-source/main.js)

**Key features:**
- Processes selected chord events in EventEdit context
- Saves chord data to `Chord_Mapping.json` in `local://$USERCONTENT/`
- Creates both JSON and text output files
- Demonstrates proper error handling for file operations

</details>

[**⬇ Download Package**](https://raw.githubusercontent.com/CSources/Studio-Pro-Scripting-API-Reference/main/scripts/packages/chord-mapping/Chord%20Mapping.package)

## Overview
Scrapes selected chord events from the Chord Track, extracts data (name, type, root/bass pitches, timing), saves `Chord_Mapping.json` & `Chord_Mapping_Results.txt` to `local://$USERCONTENT/`.

## Usage
1. Open Chord Track in Arrangement View, select desired chords (or Edit > Select All).
2. Run "Chord Mapping" from Action menu (API Tests > EventEdit).
3. Check `local://$USERCONTENT/Chord_Mapping.json` & `Chord_Mapping_Results.txt` (e.g., `~/Library/Application Support/Studio Pro/` on macOS).

## Tips
- Processes **only selected chords** (no auto-select).
- Use in EventEdit context on Chord Track.
- JSON includes: name, type, root/bass, pitches, start/end times, isLydian.