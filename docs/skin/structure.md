---
sidebar_position: 2
---

# Document Structure

## Skin

`Skin` is the top-level root element for the file. Top-level elements appear directly under `<Skin>`.

**skin.xml Snippet:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Skin>
  <Styles/>
  <Forms>
    <Form name="MyDialog" title="My Dialog"/>
  </Forms>
</Skin>
```

## Externals / External

`Externals` is a top-level namespace import block. `External` declares one
imported namespace pattern that can be referenced elsewhere in the skin.

**skin.xml Snippet:**

```xml
<Externals>
  <External name="@Main.*"/>
  <External name="Standard.*"/>
</Externals>

<Styles>
  <Style name="MyLabel" inherit="Standard.AddIn.Label"/>
</Styles>

```

| Attribute Name | Description | Type |
|---|---|---|
| `name` | Namespace pattern imported by `External`. | identifier |

| **name** | Description |
|---|---|
| `@Main.*` | - |
| `PresonusUI` | - |
| `PresonusUI*` | - |
| `Standard.*` | - |

**Notes**

- Imported names do not render on their own; they make host-provided resources available for later references.

## Resources

`Resources` is a top-level skin block used to define reusable named assets for
the form.

**skin.xml Snippet:**

```xml
<Resources>
  <Image name="ImagePreview" url="images/image.png"/>
</Resources>
```

**Notes**

- Declare named assets here and reference them from other elements/controls.

## Shapes

`Shapes` is a top-level container for named vector shape resources. Child element details for `Shape`, `ShapeImage`, `Rectangle`, `Triangle`, `Ellipse`, and `Line` are grouped under [Image & Shape Resources](image_shape.md).

**skin.xml Snippet:**

```xml
<Shapes>
  <Shape name="DividerShape" size="0,0,120,12" style="scale">
    <Rectangle size="0,4,120,4"
               style="fill stroke"
               Brush.color="hsl(204,11,64)"
               Pen.color="hsl(0,0,12)"/>
  </Shape>
</Shapes>
```

## Styles

`Styles` is a top-level container for defining reusable skin styling rules for controls, including
colors, fonts, and alignment helpers. Style-level details for `Style`, `Color`, `Font`, and `Align` are grouped in [Style Helpers & Host Styles](style_helpers.md#host-styles).

**skin.xml Snippet:**

```xml
<Styles>
  <Style name="MyEditBox" inherit="Standard.AddIn.EditBox">
    <Color name="backcolor" color="#1A1A2E"/>
    <Color name="textcolor" color="#FFFFFF"/>
    <Font name="textfont" themeid="PresonusUI" size="13" bold="true"/>
  </Style>
</Styles>
```

## Forms

`Forms` is the required container for dialog definitions.

**skin.xml Snippet:**

```xml
<Forms>
  <Form name="MyDialog" title="My Dialog"/>
</Forms>
```

## Form

`Form` defines one dialog surface.

**skin.xml Snippet:**

```xml
<Form name="MyDialog" title="My Dialog" firstfocus="NameHere">
  <Horizontal margin="0">
    <DialogGroup>
      <Vertical margin="10" spacing="5">
        <!-- Form content here -->
        <EditBox name="NameHere" attach="left right"/>
      </Vertical>
    </DialogGroup>
  </Horizontal>
</Form>
```

| Attribute Name | Description | Type |
|---|---|---|
| `attach` | Content attachment/alignment. | token |
| `buttons` | Dialog button set for `Host.GUI.runDialog()`. | token |
| `firstfocus` | Initial focus target. | identifier |
| `height` | Explicit height. | number |
| `datatarget` | Data target binding. | identifier |
| `helpid` | Help identifier. | identifier |
| `image` | Background image resource reference. | identifier |
| `layerbacking` | - | token |
| `name` | Dialog identifier used by `runDialog(...)`. | identifier |
| `options` | Visual or behavioral options.| token |
| `selectname` | - | identifier |
| `sizelimits` | Defines size limits. | tuple |
| `size` | Explicit size geometry. | tuple |
| `style` | Style reference. | identifier |
| `title` | Visible title text. | text |
| `tooltip` | Tooltip text. | text |
| `width` | Explicit width. | number |
| `windowstyle` | Host window chrome and behavior. | token |

| **buttons** | Description |
|---|---|
| `apply` | Apply changes without closing. |
| `cancel` | Cancel and close without applying. |
| `close` | Close the dialog. |
| `okay` | Confirm and close the dialog. |

| **layerbacking** | Description |
|---|---|
| `optional` | - |
| `true` | - |


| **options** | Description |
|---|---|
| `colorize` | Colors the form area. |
| `windowmovable` | Allow drag from form area. |


| **windowstyle** | Description |
|---|---|
| `above` | - |
| `center` | - |
| `customframe` | - |
| `dialogstyle` | - |
| `floating` | - |
| `fullscreen` | Uses fullscreen window behavior. |
| `inflate` | Expands the dialog content area. |
| `maximize` | Enables a maximize-capable window. |
| `intermediate` | - |
| `panelstyle` | - |
| `pluginhost` | - |
| `roundedcorners` | - |
| `restorepos` | Restores the previous window position. |
| `restoresize` | Restores the previous window size. |
| `sheetstyle` | - |
| `sizable` | Makes the window resizable. |
| `titlebar` | - |
| `translucent` | Uses translucent window chrome. |

- `Form image="..."` sets a background image for the whole dialog.
- `context.runDialog()` automatically creates Cancel and OK buttons.

