---
sidebar_position: 4
---

# Template & Control Flow

## Variant

`Variant` is a dynamic XML switch that swaps child branches based on a bound
parameter or host/controller property.

**skin.xml Snippet:**

```xml
<RadioButton name="FlowMode" value="0" title="Branch 0"/>
<RadioButton name="FlowMode" value="1" title="Branch 1"/>
<RadioButton name="FlowMode" value="2" title="Branch 2"/>

<Variant name="FlowMode" options="boundvalue" width="300" height="40">
  <View width="300" height="40">
    <Label title="Variant branch 0 is active."/>
  </View>
  <View width="300" height="40">
    <Label title="Variant branch 1 is active."/>
  </View>
  <View width="300" height="40">
    <Label title="Variant branch 2 is active."/>
  </View>
</Variant>
```

**scriptname.js Snippet:**

```javascript
this.FlowMode = context.parameters.addInteger(0, 2, "FlowMode");
this.FlowMode.value = 0;
```

| Attribute Name | Description | Type |
|---|---|---|
| `attach` | Layout attachment/alignment. | token |
| `controller` | Controller path or binding. | identifier |
| `height` | Explicit height. | number |
| `name` | Branch selector binding. | identifier |
| `options` | Visual or behavioral options. | token |
| `property` | Controller property name. | identifier |
| `size` | Position and size geometry. | tuple |
| `sizelimits` | Defines size limits. | tuple |
| `width` | Explicit width. | number |

| **options** | Description |
|---|---|
| `boundvalue` | Switches children based on the current bound value. |
| `fill` | - |
| `invert` | - |
| `selectalways` | - |
| `vertical` | Vertical orientation. |

## styleselector

`styleselector` is a conditional style switch that reads a bound parameter value and selects one of several style names to assign to a skin `$variable`. Child elements reference the selected style via `$variable`.

**skin.xml Snippet:**

```xml
<styleselector name="mode" variable="$labelStyle" styles="NormalStyle HighlightedStyle">
  <Label title="This label changes style" height="40" style="$labelStyle" attach="left right"/>
</styleselector>
<RadioButton name="mode" value="0" title="Normal"/>
<RadioButton name="mode" value="1" title="Highlight"/>
```

**scriptname.js Snippet:**

```javascript
this.mode = context.parameters.addInteger(0, 1, "mode");
```

| Attribute Name | Description | Type |
|---|---|---|
| `name` | Bound parameter name — value selects style index. | identifier |
| `property` | Controller property name (alternative to `name`). | identifier |
| `variable` | Skin variable to assign the selected style name to. | identifier |
| `styles` | Space-separated style names; indexed by param value (0 = first, 1 = second, etc.). | text |

**Notes**

- Similar to `<Variant>` but at the style level — children stay rendered, only their style changes.
- Value `0` selects `styles[0]`, value `1` selects `styles[1]`, etc.
- Works with CCL:ParamList and `context.parameters`.

## using

`using` sets the active controller context for nested content.

**skin.xml Snippet:**

```xml
<using controller="object://studioapp/Application">
  <if property="isVideoEnabled" value="1">
    <Label title="Application controller resolved: video enabled."/>
  </if>
</using>
```

| Attribute Name | Description | Type |
|---|---|---|
| `controller` | Controller path or binding. | identifier |
| `optional` | Allows missing controllers. | flag |

| **optional** | Description |
|---|---|
| `true` | - |

## define

`define` creates local substitution values for nested XML content.

**skin.xml Snippet:**

```xml
<define statusText="Defined branch rendered." showDetails="1">
  <if defined="$showDetails">
    <Label title="$statusText"/>
  </if>
</define>
```

**Notes**

- `define` accepts user-defined substitution attributes.
- Nested XML can reference those values with `$attributeName`, such as `$statusText` or `$showDetails`.
- Substitution values can be text, numbers, identifiers, tuples, or other XML attribute values.

## if

`if` conditionally renders nested content based on a property or substitution variable.

**skin.xml Snippet:**

```xml
<if not.defined="$missingFlag">
  <Label title="missingFlag is not defined."/>
</if>
```

| Attribute Name | Description | Type |
|---|---|---|
| `controller` | Controller path or binding. | identifier |
| `defined` | Requires an existing substitution. | identifier |
| `not.defined` | Requires a missing substitution. | identifier |
| `property` | Controller property name. | identifier |
| `value` | Value to compare against. | text |

## TriggerView

`TriggerView` is a transparent gesture wrapper that intercepts mouse and touch events on its content area. It references a `<Style>` with `<Triggers>` defined.

**skin.xml Snippet:**

```xml
<TriggerView style="ClickTrigger" height="50" attach="all"/>
```

**scriptname.js Snippet (controller callbacks):**

```javascript
this.onTrigger = function(eventName) {
    // Called when Invoker target="controller" fires
};
```

| Attribute Name | Description | Type |
|---|---|---|
| `attach` | Layout attachment/alignment. | token |
| `gesturepriority` | Gesture routing priority. | token |
| `height` | Explicit height. | number |
| `name` | Binding name when used. | identifier |
| `options` | Visual or behavioral options. | tokens |
| `size` | Position and size geometry. | tuple |
| `style` | Style reference containing `<Triggers>`. | identifier |
| `width` | Explicit width. | number |

| **gesturepriority** | Description |
|---|---|
| `high`| - |

| **options** | Description |
|---|---|
| `nohelp` | - |
| `transparent` | - |

**Notes:**
- TriggerView wraps child controls or sits standalone as a gesture target.
- The style should define `<Triggers>` with `<Trigger>` elements and `<Invoker>` actions.
- Multiple `<Invoker>` elements in one `<Trigger>` all fire in order.
- `Invoker target="controller"` requires `Host.Interfaces.IController` — the controller is passed as the third argument to `Host.GUI.runDialog()`.
- Confirmed working events: `onMouseDown`, `onDrag`, `onDoubleClick`, `onContextMenu`, `onAttached`, `onRemoved`.

## Delegate

`Delegate` embeds another form from the same skin file at the delegate's position in the layout.

**skin.xml Snippet:**

```xml
<Form name="MainForm">
  <Vertical>
    <Delegate form.name="EmbeddedForm" height="50"/>
  </Vertical>
</Form>

<Form name="EmbeddedForm">
  <Vertical>
    <Button name="MyButton" title="Click" width="200" height="30"/>
  </Vertical>
</Form>
```

**scriptname.js Snippet:**

```javascript
this.MyButton = this.paramList.addParam("MyButton");
```

| Attribute Name | Description | Type |
|---|---|---|
| `attach` | Layout attachment/alignment. | token |
| `controller` | Controller sub-path for the embedded form. | identifier |
| `form.name` | Name of the target form to embed. | identifier |
| `height` | Explicit height. | number |
| `options` | Behavior tokens. | token |
| `size` | Position and size geometry. | tuple |
| `width` | Explicit width. | number |

| **options** | Description |
|---|---|
| `keepview` | - |
| `transparent` | - |
| `trigger` | - |

**Notes:**
- The embedded form is resolved from the same skin file. Both forms must be defined in `<Forms>`.
- Controls in the embedded form bind to the same `CCL:ParamList` as the parent form.

## HelpAnchor

`HelpAnchor` is a wrapper element that assigns a helpID to its child controls. The helpID can be used with `Host.GUI.Help.highlightControl()` to visually highlight the control on a dimmed background.

**skin.xml Snippet:**

```xml
<HelpAnchor helpid="MyKnobOne" attach="vcenter">
  <Knob name="Knob1" size="-13,-15,74,74"/>
</HelpAnchor>
```

**scriptname.js Snippet:**

```javascript
Host.GUI.Help.dimAllWindows();
Host.GUI.Help.highlightControl("MyKnobOne");
// ...
Host.GUI.Help.discardHighlights();
```

| Attribute | Description | Type |
|---|---|---|
| `attach` | Layout attachment/alignment. | token |
| `helpid` | HelpID string for the control. Used with `Host.GUI.Help.highlightControl()`. | string |

## SwipeBox

`SwipeBox` wraps a container of `Toggle` (or other target) elements and enables chain-drag, allowing you to click and drag across adjacent elements to activate/deactivate each one in sequence without releasing the mouse button.

**skin.xml Snippet (toggle row):**

```xml
<SwipeBox target="Toggle" attach="left right">
  <Horizontal width="600" height="32" spacing="0" attach="left right">
    <Toggle name="opt1" title="Option 1" width="100" height="32"/>
    <Toggle name="opt2" title="Option 2" width="100" height="32"/>
    <Toggle name="opt3" title="Option 3" width="100" height="32"/>
  </Horizontal>
</SwipeBox>
```

| Attribute Name | Description | Type |
|---|---|---|
| `attach` | Layout attachment/alignment. | token |
| `options` | Behavior flags for swipe direction and target matching. | token |
| `target` | Element type to enable chain-drag for. | identifier |

| **options** | Description |
|---|---|
| `vertical` | Enables vertical swipe/drag direction (default is horizontal). |
| `ignorename` | Do not match swipe targets by name. |
| `ignoretag` | Do not match swipe targets by tag. |

**Notes**

- SwipeBox implicitly sets `options="immediate"` on its child content.

## Invoker

`Invoker` defines a method call to execute when its parent `<Trigger>` fires. Exclusive to `<Trigger>` — not used standalone.

**skin.xml Snippet:**

```xml
<Invoker target="controller" name="myMethod" arg1="value"/>
```

**scriptname.js Snippet:**

```javascript
this.myMethod = function(arg1) {
  // Called when the trigger event fires
};
```

| Attribute | Description | Type |
|---|---|---|
| `arg1` | First argument | string |
| `arg2` | Second argument | string |
| `arg3` | Third argument | string |
| `name` | Method name to invoke | identifier |
| `target` | Object to call the method on | identifier |

**Notes:**
- `target="controller"` requires `Host.Interfaces.IController`. The controller object is passed as the third argument to `Host.GUI.runDialog(theme, formName, controller)`.
- `target="object://hostapp/..."` calls a method on a Host.Objects URL.
- `target="window"` calls window methods like `close`.
- Arguments defined in skin.xml (`arg1`, `arg2`, `arg3`) are always passed as strings to the target method.

