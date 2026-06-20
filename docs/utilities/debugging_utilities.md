---
sidebar_position: 2
---
# Debugging Utilities

Useful runtime probe helpers for inspecting unknown API surfaces. Native host objects can stringify as `[object Object]`, hide members, or expose empty own-property lists even when the object is valid, so `typeof`, targeted property reads, and working call-site probes are often more reliable than generic reflection alone.

## Object Prototype Chain Walk

Walk the full prototype chain with level separation, separating methods from properties. Also detects non-enumerable native accessor properties (like `root`, `executeImmediately`) that `getOwnPropertyNames` misses.

```javascript
function walkChain(label, obj) {
  var lines = [label + ":"];
  var o = obj, level = 1, seen = [];
  while (o && level <= 20) {
    for (var s = 0; s < seen.length; s++) { if (seen[s] === o) { lines.push("  level " + level + ": CYCLE"); return; } }
    seen.push(o);
    var names = [];
    try { names = Object.getOwnPropertyNames(o); } catch(e) { lines.push("  level " + level + ": ERROR"); break; }
    var funcs = [], props = [];
    for (var i = 0; i < names.length; i++) {
      try {
        var t = typeof o[names[i]];
        if (t === "function") funcs.push(names[i]);
        else if (names[i] !== "__proto__") props.push(names[i] + " [" + t + "]");
      } catch(e) {}
    }
    if (level === 1) {
      ["root", "executeImmediately"].forEach(function(n) {
        try { if (n in o) props.push(n + " [" + typeof o[n] + "] [accessor]"); } catch(e) {}
      });
    }
    funcs.sort(); props.sort();
    lines.push("  level " + level + " (" + funcs.length + " methods, " + props.length + " props):");
    funcs.forEach(function(n) { lines.push("    " + n + " → function"); });
    props.forEach(function(p) { lines.push("    " + p); });
    try { o = Object.getPrototypeOf(o); } catch(e) { break; }
    level++;
  }
  Host.GUI.alert(lines.join("\n"));
}
```

## Iterator Dump

Inspect iterator output and confirm what item types a host iterator is actually returning.

```javascript
function dumpIterator(label, iterator, limit) {
  var lines = [label + ":"];
  var count = 0;
  limit = limit || 16;

  while (iterator && !iterator.done() && count < limit) {
    var item = iterator.next();
    lines.push("  [" + count + "] typeof = " + typeof item);
    count++;
  }

  lines.push("  count = " + count);
  Host.GUI.alert(lines.join("\n"));
}
```

## Parameter Dump

Inspect a parameter object returned by `findParameter(...)`.

```javascript
function dumpParameter(label, param) {
  if (!param) {
    Host.GUI.alert(label + ": <null>");
    return;
  }

  Host.GUI.alert([
    label,
    "name = " + param.name,
    "value = " + param.value,
    "string = " + param.string,
    "min = " + param.min,
    "max = " + param.max,
    "default = " + param.default,
    "enabled = " + param.enabled
  ].join("\n"));
}
```

## Method Arity Sweep

Test a method with various argument types (none, null, number, boolean, string, object) to determine its expected signature.

```javascript
function sweepMethod(fn, methodName) {
  var lines = [methodName + ":"];
  var argSets = [[], [null], [0], [true], [""], [{}]];
  for (var i = 0; i < argSets.length; i++) {
    try {
      var r = fn[methodName].apply(fn, argSets[i]);
      lines.push("  " + methodName + "(" + typeof argSets[i][0] + ") -> " + (typeof r) + " = " + (r === null ? "null" : r === undefined ? "undefined" : r));
    } catch(e) {
      lines.push("  " + methodName + "(" + typeof argSets[i][0] + ") -> ERROR: " + e.message);
    }
  }
  Host.GUI.alert(lines.join("\n"));
}
```

## Property Existence Check

Check whether a property exists on an object using `in`, `getOwnPropertyNames`, `for...in`, and getter detection.

```javascript
function probeProperty(label, obj, name) {
  var lines = [label + "." + name + ":"];
  lines.push("  in operator: " + (name in obj));
  lines.push("  getOwnPropertyNames: " + (Object.getOwnPropertyNames(obj).indexOf(name) !== -1));
  lines.push("  for...in: " + (function(){ for(var k in obj){ if(k===name) return true; } return false; })());
  try { lines.push("  typeof: " + typeof obj[name]); } catch(e) {}
  if (typeof obj.__lookupGetter__ === "function") {
    lines.push("  has getter: " + !!obj.__lookupGetter__(name));
  }
  Host.GUI.alert(lines.join("\n"));
}
```