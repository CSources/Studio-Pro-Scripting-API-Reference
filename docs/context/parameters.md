---
sidebar_position: 6
---
# Parameters

`context.parameters` creates dialog fields in `prepareEdit()` and exposes their values in `performEdit()`.

## Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `addColor(default, name)` | `object` — [param](#param-object) | `default` (`integer color`, req). `name` (`string`, req): Field name. | Add a color field. |
| `addFloat(min, max, name)` | `object` — [param](#param-object) | `min, max` (`float`, req): Range. `name` (`string`, req): Field name. | Add a float field. |
| `addInteger(min, max, name)` | `object` — [param](#param-object) | `min, max` (`integer`, req): Range. `name` (`string`, req): Field name. | Add an integer field. |
| `addList(name)` | `object` — [param](#param-object) | `name` (`string`, req): Field name. | Add a list/select field. Items must be populated via the dialog UI. |
| `addMenu(name)` | `object` — [param](#param-object) | `name` (`string`, req): Field name. | Add a menu/dropdown field. |
| `addParam(name)` | `object` — [param](#param-object) | `name` (`string`, req): Field name. | Add a generic button/toggle field. |
| `addString(name)` | `object` — [param](#param-object) | `name` (`string`, req): Field name. | Add a string/text field. |
| `remove(name)` | — | `name` (`string`, req): Parameter name. | Removes a parameter by name. |

### param object

Every `add*` method returns a param object. Create fields in `prepareEdit()` and read values in `performEdit()`. `add*` also works in `performEdit` if needed.

#### Properties

| Property | Type | Writable | Example | Description |
|---|---|---|---|---|
| `default` | `number` / `string` | yes | `0` | Default value. Writing persists through same session |
| `enabled` | `number` | yes | `1` | `1` = enabled in the dialog, `0` = disabled. |
| `max` | `number` | yes | `7` | Maximum value of the parameter range. |
| `min` | `number` | yes | `-7` | Minimum value of the parameter range. |
| `name` | `string` | yes | `"IntParam"` | Parameter name as passed to `add*`. |
| `reverse` | `number` | yes | `0` | Reverse flag for control direction. |
| `signalAlways` | `number` | yes | `0` | Signal-always flag. |
| `string` | `string` | yes | `"42"` | String representation of the current value. |
| `type` | `number` | No | `1` | Internal type code: `0`=button, `1`=integer, `2`=float, `3`=string, `4`=list/menu, `6`=color. |
| `value` | `number` / `string` | yes | `7` | Current value. Type depends on param type. |

#### Methods

| Method | Returns | Parameters | Description |
|---|---|---|---|
| `setValue(value)` | — | `value` — new value | Sets the value programmatically. |
| `setFormatter(name)` | — | `name` — formatter name (e.g. `"Media.MusicNote"`) | Sets a display formatter for the parameter value. |
| `fromString(str)` | — | `str` — string to parse | Sets the value from a string representation. |
| `setNormalized(value)` | — | `value` — normalized 0–1 | Sets the value in normalized range. |
| `getNormalized()` | `number` | none | Returns the current value normalized to 0–1. |
| `setCurve(curve)` | — | `curve` — curve value | Sets the parameter's curve/response shape. |
| `isType(type)` | `number` | `type` — type code to check | Checks whether the param matches a given type code. |
| `setSignalAlways(flag)` | — | `flag` — `1` or `0` | Sets whether the parameter always signals changes. |

## Dialog Flow

A full dialog using `context.parameters` and `context.runDialog()` in a task lifecycle.

```javascript
function MyTask() {
  this.prepareEdit = function(context) {
    this.MyValue = context.parameters.addInteger(0, 127, "MyValue");
    this.MyValue.value = 64;

    this.MyFloat = context.parameters.addFloat(0.0, 1.0, "MyFloat");
    this.MyText  = context.parameters.addString("MyText");

    this.MyList  = context.parameters.addList("MyList");
    this.MyList.appendString("Option 1");
    this.MyList.appendString("Option 2");

    this.MyColor = context.parameters.addColor(0xFF0000FF, "MyColor");

    return context.runDialog("DialogFormName", "com.your.packageid");
  };

  this.performEdit = function(context) {
    var intVal   = this.MyValue.value;
    var floatVal = this.MyFloat.value;
    var textVal  = this.MyText.value;
    var listSel  = this.MyList.value;
    var colorVal = this.MyColor.value;
  };
}
```