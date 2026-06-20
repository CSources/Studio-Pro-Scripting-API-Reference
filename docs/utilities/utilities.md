---
sidebar_position: 1
---
# Utilities & Conversions

Utility helpers for color values, unit conversions, and related data formatting.

## Color Utilities

### Hex string to color integer

```javascript
function getColorVal(hexcolor) {
  var value = parseInt(hexcolor, 16);
  var r = (value >> 16) & 0xff;
  var g = (value >>  8) & 0xff;
  var b =  value        & 0xff;
  return ((b << 16) | (g << 8) | r) | 0xff000000;
}
```

### Color interpolation (gradient)

```javascript
function interpolateColor(color1, color2, t) {
  var r1 = (color1 & 0xff0000) >> 16, g1 = (color1 & 0xff00) >> 8, b1 = color1 & 0xff;
  var r2 = (color2 & 0xff0000) >> 16, g2 = (color2 & 0xff00) >> 8, b2 = color2 & 0xff;
  return (Math.round(r1 + (r2 - r1) * t) << 16) +
         (Math.round(g1 + (g2 - g1) * t) << 8) +
          Math.round(b1 + (b2 - b1) * t);
}
// t = 0.0 → color1, t = 1.0 → color2
// Strip alpha from addColor() value: color & 0x00FFFFFF
```

## Value Conversions

### BPM ↔ seconds ↔ beats

```javascript
function secondsToBeats(seconds, bpm) {
    return seconds * (bpm / 60.0);
}
function beatsToSeconds(beats, bpm) {
    return beats * (60.0 / bpm);
}
```

### dB ↔ float (gain/volume)

`channel.volume` and similar properties use a linear float, not dB:

```javascript
function dbToFloat(db) { return Math.pow(10, parseFloat(db) / 20); }
function floatToDb(f)  { return (Math.log(parseFloat(f)) / Math.LN10) * 20; }
```
