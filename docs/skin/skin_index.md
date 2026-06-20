---
sidebar_position: 10
---

# Skin Index

## Top-Level Elements

| Element | Purpose |
|---|---|
| `External` | One imported namespace pattern |
| `Externals` | Container for imported host namespaces |
| `Form` | One dialog/window definition |
| `Forms` | Container for dialog definitions |
| `Resources` | Container for named reusable assets |
| `Shapes` | Container for named vector shape resources |
| `Skin` | Root container for the entire `skin.xml` document |
| `Styles` | Container for custom style definitions |

## Confirmed Elements

| Element | Category | Binding / Nesting |
|---|---|---|
| `ActivityIndicator` | Text & Display | Image animation resource |
| `Align` | Style Helpers | `Style` definitions |
| `AlignView` | Layout Containers | - |
| `Button` | Input Controls | `addInteger(0,1)` |
| `CheckBox` | Input Controls | `addInteger(0,1,...)` |
| `Color` | Style Helpers | - |
| `ColorBox` | Input Controls | `addColor` |
| `ComboBox` | Input Controls | `addList` |
| `define` | Template & Control Flow | - |
| `Delegate` | Template & Control Flow | Controller method / form |
| `DialogButton` | Input Controls | Dialog result |
| `DialogGroup` | Layout Containers | - |
| `Divider` | Text & Display | - |
| `EditBox` | Input Controls | `addString`, `addInteger`, `addFloat` |
| `Ellipse` | Image & Shape Resources | Nested in `Shape` |
| `External` | Document Structure | - |
| `Externals` | Document Structure | - |
| `Flexbox` | Layout Containers | - |
| `Font` | Style Helpers | - |
| `Form` | Document Structure | - |
| `Forms` | Document Structure | - |
| `Horizontal` | Layout Containers | - |
| `HelpAnchor` | Template & Control Flow | HelpID assignment |
| `if` | Template & Control Flow | Host/controller property |
| `Image` | Image & Shape Resources | Referenced by `ImageView` / styles |
| `ImageFilter` | Image & Shape Resources | Nested in `ImagePart` |
| `ImagePart` | Image & Shape Resources | Referenced by `ImageView` |
| `ImageView` | Text & Display | - |
| `Invoker` | Template & Control Flow | Controller method |
| `Knob` | Input Controls | `addInteger`, `addFloat` |
| `Label` | Text & Display | - |
| `Line` | Image & Shape Resources | Nested in `Shape` |
| `Link` | Text & Display | `addParam(...)`, `paramChanged(...)` |
| `ListView` | Collection & Navigation Controls | `Host:ListViewModel` |
| `Metric` | Style Helpers | `Style` definitions |
| `ProgressBar` | Text & Display | `addInteger`, `addFloat` |
| `PopupBox` | Input Controls | Popup trigger with `form.name` or `options="vertical slider"` |
| `RadioButton` | Input Controls | `addInteger`, `addList` |
| `RangeSlider` | Input Controls | `addFloat` (two values) |
| `Rectangle` | Image & Shape Resources | Nested in `Shape` |
| `Resources` | Document Structure | - |
| `SelectBox` | Input Controls | `addList` |
| `Shape` | Image & Shape Resources | Referenced by `ShapeImage` |
| `ShapeImage` | Image & Shape Resources | Referenced by `ImageView` / styles |
| `Shapes` | Document Structure | - |
| `Skin` | Document Structure | - |
| `Slider` | Input Controls | `addInteger`, `addFloat` |
| `Space` | Layout Containers | - |
| `Style` | Style Helpers | - |
| `Styles` | Document Structure | - |
| `SwipeBox` | Template & Control Flow | - |
| `Table` | Layout Containers | - |
| `TabView` | Layout Containers | - |
| `TextEditor` | Input Controls | `addString` / `CCL:ParamList.addString` |
| `TextBox` | Text & Display | `addString` |
| `Toggle` | Input Controls | `addInteger(0,1,...)` |
| `ToolButton` | Input Controls | `addInteger` |
| `Triangle` | Image & Shape Resources | Nested in `Shape` |
| `Trigger` | Style Helpers | Host/controller property |
| `TriggerView` | Template & Control Flow | - |
| `Triggers` | Style Helpers | - |
| `UpDownButton` | Input Controls | `addInteger` |
| `using` | Template & Control Flow | Host controller |
| `ValueBox` | Input Controls | `addString`, `addInteger`, `addFloat` |
| `Variant` | Template & Control Flow | Bound parameter / host property |
| `Vertical` | Layout Containers | - |
| `View` | Layout Containers | - |
| `styleselector` | Template & Control Flow | Host/controller property |

## Probed / Unconfirmed Elements

| Element | Observed Role | Current Status |
|---|---|---|
| `CommandBarView` | Command bar container | Untested |
| `Scrollbar` | Standalone scrollbar | Unknown Use |
| `ScrollView` | Scrollable container | Untested |
| `TreeView` | Tree-style navigation view | Untested |
| `WebView` | Blank web surface | Binding Unknown |

## Attribute Index
Backticked values are literal XML values; unformatted values describe accepted value classes.

## adaptive

| Value | Type | Description |
|---|---|---|
| `true` | `flag` | - |

## align

| Value | Type | Description |
|---|---|---|
| `bottom` | `token` | Bottom alignment. |
| `center` | `token` | Center alignment. |
| `hcenter` | `token` | Horizontal center alignment. |
| `left` | `token` | Left alignment. |
| `right` | `token` | Right alignment. |
| `top` | `token` | Top alignment. |
| `vcenter` | `token` | Vertical center alignment. |

## appstyle

| Value | Type | Description |
|---|---|---|
| `true` | `flag` | - |

## attach

| Value | Type | Description |
|---|---|---|
| `all` | `token` | Attaches the control on all sides. |
| `bottom` | `token` | Attaches the control to the bottom edge. |
| `fill` | `token` | Fills the available space. |
| `fitsize` | `token` | Fits the control to its available size. |
| `hcenter` | `token` | Centers the control horizontally. |
| `hfit` | `token` | Fits the control horizontally. |
| `left` | `token` | Attaches the control to the left edge. |
| `prefercurrent` | `token` | - |
| `right` | `token` | Attaches the control to the right edge. |
| `top` | `token` | Attaches the control to the top edge. |
| `vcenter` | `token` | Centers the control vertically. |
| `vfit` | `token` | Fits the control vertically. |

## backcolor

| Value | Type | Description |
|---|---|---|
| Hex value (`#RRGGBB`), named color, or theme variable | `color` | Style background color. |

## border

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Style border mode or width. |

## Brush.color

| Value | Type | Description |
|---|---|---|
| Hex value (`#RRGGBB`), named color, or theme variable | `color` | Shape fill color. |

## Brush.gradient

| Value | Type | Description |
|---|---|---|
| Any gradient name | `identifier` | Fill gradient reference. |

## buttons

| Value | Type | Description |
|---|---|---|
| `apply` | `token` | Apply changes without closing. |
| `cancel` | `token` | Cancel and close without applying. |
| `close` | `token` | Close the dialog. |
| `okay` | `token` | Confirm and close the dialog. |

## cellratio

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Cell sizing ratio. |

## color

| Value | Type | Description |
|---|---|---|
| `#FFFFFF` | `color` | Hex color value. |
| `#FFFFFF00` | `color` | Hex color value with alpha. |
| `black`, `white`, ... | `color` | Text color name. |
| `hsl(*,*,*)` | `color` | HSL color value. |
| `hsl(*,*,*,*)` | `color` | HSL color value with alpha. |

## colorname

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Color binding name. |

## columns

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Number of columns. |

## controller

| Value | Type | Description |
|---|---|---|
| Any controller path | `identifier` | Host/controller object path. |
| Any binding name | `identifier` | Controller binding name. |

## datatarget

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Data target binding. |

## defined

| Value | Type | Description |
|---|---|---|
| Substitution variable | `identifier` | Requires an existing substitution. |

## duration

| Value | Type | Description |
|---|---|---|
| Any time value (ms, s) | `time` | Total animation cycle time. |

## editname

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Associated editable field binding. |

## end

| Value | Type | Description |
|---|---|---|
| `x,y` | `tuple` | Line end point. |

## event

| Value | Type | Description |
|---|---|---|
| `onAttached` | `token` | Fires when the element is attached to the DOM. |
| `onContextMenu` | `token` | Fires on context menu request. |
| `onDoubleClick` | `token` | Fires on double-click. |
| `onDrag` | `token` | Fires on drag. |
| `onMouseDown` | `token` | Fires on mouse down. |
| `onRemoved` | `token` | Fires when the element is removed from the DOM. |
| `onSingleClick` | `token` | Fires on single-click. |
| `onSingleTap` | `token` | Fires on single tap (touch). |
| `onTouch` | `token` | Fires on touch. |

## face

| Value | Type | Description |
|---|---|---|
| Font face | `identifier` | Assign available font face. |

## firstfocus

| Value | Type | Description |
|---|---|---|
| Target element name | `identifier` | Initial focus target. |

## flex.align

| Value | Type | Description |
|---|---|---|
| `center` | `token` | Center children on the cross axis. |

## flex.direction

| Value | Type | Description |
|---|---|---|
| `row` | `token` | Horizontal layout (default). |
| `column` | `token` | Vertical layout. |

## flex.gap

| Value | Type | Description |
|---|---|---|
| Any number | `number` | Spacing between children. |

## flex.grow

| Value | Type | Description |
|---|---|---|
| Any number | `number` | Grow factor for filling available space. |

## flex.inset

| Value | Type | Description |
|---|---|---|
| `0` | `token` | Pins all edges, fills flex container. |
| `.right` | `token` | Right edge inset distance. |
| `.bottom` | `token` | Bottom edge inset distance. |

## flex.justify

| Value | Type | Description |
|---|---|---|
| `center` | `token` | Center children on the main axis. |
| `spacebetween` | `token` | Distribute children evenly with space between. |

## flex.margin

| Value | Type | Description |
|---|---|---|
| Any number | `number` | Margin around the flex container. |

## flex.padding

| Value | Type | Description |
|---|---|---|
| `top,right,bottom,left` | `tuple` | Padding inside the flex container. |

## flex.positiontype

| Value | Type | Description |
|---|---|---|
| `absolute` | `token` | Positions child outside flow layout. |

## forecolor

| Value | Type | Description |
|---|---|---|
| Hex value (`#RRGGBB`), named color, or theme variable | `color` | Style foreground color. |

## form.name

| Value | Type | Description |
|---|---|---|
| `form.name` | identifier | Form to open as popup content. |
| `form.name` | identifier | Name of the target form to embed. |

## frames

| Value | Type | Description |
|---|---|---|
| `normal` | `token` | Default image frame. |
| `normalOn` | `token` | On-state frame. |
| `normal0 normal1 normal2` | `token` | - |
| `pressed` | `token` | Pressed state frame. |
| `pressedOn` | `token` | Pressed on-state frame. |
| `mouseover` | `token` | Mouse hover frame. |
| `mouseoverOn` | `token` | Mouse hover on-state frame. |
| `disabled` | `token` | Disabled state frame. |
| `disabledOn` | `token` | Disabled on-state frame. |
| `darkframe` | `token` | Dark variant frame. |
| `lightframe` | `token` | Light variant frame. |
| `phaseOn` | `token` | Phase on-state frame. |
| `small` | `token` | Small variant frame. |
| `h:` | `token` | Horizontal frame set prefix. |
| `v:` | `token` | Vertical frame set prefix. |
| `t: *x* *` | `token` | Tiled sprite-sheet frame expression. |
| `embedded` | `token` | - |
| Positive integer | `number` | Numeric frame count. |

## gesturepriority

| Value | Type | Description |
|---|---|---|
| `high`| `token` | Gesture routing priority. |

## headerstyle

| Value | Type | Description |
|---|---|---|
| Reference to a defined Style name | `identifier` | Header style reference. |

## height

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Explicit height. |

## helpid

| Value | Type | Description |
|---|---|---|
| Help topic ID (e.g. `"NewSongDialog"`) | `identifier` | Help identifier. |

## hscroll.style

| Value | Type | Description |
|---|---|---|
| Reference to a defined Style name | `identifier` | Horizontal scrollbar style reference. |

## icon

| Value | Type | Description |
|---|---|---|
| Any image resource name | `identifier` | Overlay icon image resource. |

## image

| Value | Type | Description |
|---|---|---|
| Any image resource name | `identifier` | Named image resource. |
| Any image part name | `identifier` | Named image part resource. |
| Any shape image name | `identifier` | Named shape image resource. |

## inherit

| Value | Type | Description |
|---|---|---|
| Reference to a defined Style name | `identifier` | Style to inherit from. |

## labelname

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Label binding name. |

## layerbacking

| Value | Type | Description |
|---|---|---|
| `optional` | `token` | - |
| `true` | `token` | - |

## localize

| Value | Type | Description |
|---|---|---|
| `false` | `flag` | No localization. |

## margin

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Uniform margin. |
| Per-edge tuple | `tuple` | Per-edge margin. |

## mode

| Value | Type | Description |
|---|---|---|
| `relative` | `identifier` | - |

## modename

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Mode binding name. |

## name

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Script or controller binding name. |
| Any resource name | `identifier` | Named XML resource. |
| Reference to a defined Style name | `identifier` | Named style definition. |
| Style property slot name | `token` | Named style/helper slot. |
| Any controller path | `identifier` | Host/controller object path. |
| `@Main.*` | `identifier` | Main variable reference. |
| `backcolor` | `token` | Style background color. |
| `backcolor.off` | `token` | Off-state background color. |
| `backcolor.on` | `token` | On-state background color. |
| `background` | `token` | Background image. |
| `blend` | `token` | Blend mode. |
| `button` | `token` | Button arrow. |
| `buttonMinWidth` | `token` | Scroll button minimum width. |
| `buttonSize` | `token` | Scroll button size. |
| `buttonstyle` | `token` | Button style selector. |
| `cellBottomAreaHeight` | `token` | Cell bottom area. |
| `cellCornerRadius` | `token` | Cell corner radius. |
| `cellWidth` | `token` | Cell width. |
| `circle` | `token` | Circular knob style. |
| `colorize` | `token` | Colorize image. |
| `colorize.icon` | `token` | Colorize icon. |
| `disabled` | `token` | Disabled state image. |
| `disabledOn` | `token` | Disabled on-state image. |
| `fill.icon` | `token` | Fill icon. |
| `first` | `token` | First element. |
| `focus` | `token` | Focus state image. |
| `forecolor` | `token` | Style foreground color. |
| `foreground` | `token` | Foreground image. |
| `hBack` | `token` | Horizontal track background. |
| `hHandle` | `token` | Horizontal drag handle. |
| `hSmallBack` | `token` | Small horizontal track. |
| `hSmallThumb` | `token` | Small horizontal thumb. |
| `headerHeight` | `token` | Header height. |
| `hilitecolor` | `token` | Highlight color. |
| `indicator` | `token` | Indicator dot/arc. |
| `indicatormargin` | `token` | Indicator inset. |
| `indicatorwidth` | `token` | Indicator arc width. |
| `last` | `token` | Last element. |
| `lightadapt` | `token` | Light adaptation. |
| `linkcolor` | `token` | Link text color. |
| `margin` | `token` | Style margin inset. |
| `middle` | `token` | Middle element. |
| `minfontsize` | `token` | Minimum font size. |
| `mouseover` | `token` | Hover state image. |
| `mouseoverOn` | `token` | Hover on-state image. |
| `normal` | `token` | Normal state image. |
| `normalOn` | `token` | On-state image. |
| `overlay` | `token` | Overlay image. |
| `overlay.filmstrip` | `token` | Filmstrip overlay image. |
| `padding.bottom` | `token` | Bottom padding. |
| `padding.left` | `token` | Left padding. |
| `padding.right` | `token` | Right padding. |
| `padding.top` | `token` | Top padding. |
| `phaseOn` | `token` | Phase on-state image. |
| `PresonusUI` | `identifier` | Default Presonus theme. |
| `pressed` | `token` | Pressed state image. |
| `pressedOn` | `token` | Pressed on-state image. |
| `range` | `token` | Value range. |
| `rowHeight` | `token` | Row height. |
| `scrollBarSize` | `token` | Scrollbar size. |
| `selectedtextcolor` | `token` | Selected text color. |
| `single` | `token` | Single value mode. |
| `spacing` | `token` | Style spacing. |
| `Standard.*` | `identifier` | Standard style prefix. |
| `tabHeight` | `token` | Tab height. |
| `tabSpacing` | `token` | Tab spacing. |
| `textcolor` | `token` | Style text color. |
| `textcolor.on` | `token` | On-state text color. |
| `textfont` | `token` | Text font resource. |
| `textoffset` | `token` | Text position offset. |
| `thinhandle` | `token` | Thin slider handle. |
| `tilesize` | `token` | Tile background size. |
| `tint` | `token` | Color tint. |
| `topoverlay` | `token` | Top overlay image. |
| `topoverlay.filmstrip` | `token` | Filmstrip top overlay. |
| `vBack` | `token` | Vertical track background. |
| `vHandle` | `token` | Vertical drag handle. |
| `vSmallBack` | `token` | Vertical scrollbar track. |
| `vSmallThumb` | `token` | Vertical scrollbar thumb. |

## name2

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Secondary binding name. |

## not.defined

| Value | Type | Description |
|---|---|---|
| Undefined template variable | `identifier` | Requires a missing substitution. |

## optional

| Value | Type | Description |
|---|---|---|
| `true` | `flag` | Allows missing controllers. |

## options

| Value | Type | Description |
|---|---|---|
| `adaptive` | `token` | - |
| `allowstretch` | `token` | - |
| `allowzoom` | `token` | Zoom behavior. |
| `autohidev` | `token` | Auto-hide vertical scrollbar. |
| `bargraph` | `token` | - |
| `border` | `token` | Visible field border. |
| `boundvalue` | `token` | Switches children based on the current bound value. |
| `button` | `token` | Dropdown button arrow. |
| `centered` | `token` | - |
| `centerimage` | `token` | Center image. |
| `colorize` | `token` | - |
| `columnfocus` | `token` | - |
| `composited` | `token` | - |
| `decrement` | `token` | Decrement button. |
| `dialogedit` | `token` | - |
| `directupdate` | `token` | - |
| `doubleclick` | `token` | - |
| `email` | `token` | Email input field. |
| `exclusive` | `token` | Enables exclusive selection behavior. |
| `extended` | `token` | Extended editing. |
| `extendtabs` | `token` | - |
| `extendlastcolumn` | `token` | - |
| `fill` | `token` | - |
| `fitallviews` | `token` | - |
| `fitimage` | `token` | Fit image to area. |
| `fittext` | `token` | Fit text. |
| `fittitle` | `token` | - |
| `focus` | `token` | - |
| `fontbold` | `token` | - |
| `globalmode` | `token` | - |
| `header` | `token` | Shows the header row. |
| `hfit` | `token` | - |
| `hide` | `token` | - |
| `hidebutton` | `token` | Hides the dropdown button. |
| `hidefocus` | `token` | Suppresses focus highlighting. |
| `hidepriority` | `token` | - |
| `hidetext` | `token` | Hide text area. |
| `highquality` | `token` | High-quality rendering. |
| `horizontal` | `token` | Horizontal orientation. |
| `ignoreimagesize` | `token` | Ignore image size. |
| `ignorekeys` | `token` | Ignore keys. |
| `ignorename` | `token` | - |
| `ignoretag` | `token` | - |
| `immediate` | `token` | Immediate action. |
| `increment` | `token` | Increment button. |
| `insertdata` | `token` | - |
| `intermediate` | `token` | - |
| `inversewheel` | `token` | Invert wheel direction. |
| `invert` | `token` | - |
| `invertible` | `token` | Allows inverted slider behavior. |
| `keepview` | `token` | Keep current view on data change. |
| `leadingbutton` | `token` | Places button at leading edge. |
| `leadingicon` | `token` | - |
| `left` | `token` | Left visual segment drawing position. |
| `markup` | `token` | - |
| `master` | `token` | - |
| `middle` | `token` | Middle visual segment drawing position. |
| `momentary` | `token` | Momentary state flag. |
| `mousescroll` | `token` | - |
| `multiline` | `token` | Enables multi-line text display. |
| `musthittext` | `token` | - |
| `needsoptionkey` | `token` | - |
| `nocontextmenu` | `token` | Disable the context menu. |
| `nodoubleclick` | `token` | - |
| `nodrag` | `token` | Disables dragging. |
| `nofocus` | `token` | - |
| `nohelp` | `token` | Suppresses help behavior. |
| `nohoveractivate` | `token` | - |
| `nolinebreak` | `token` | - |
| `nomodifier` | `token` | Suppress modifier-key. |
| `norubber` | `token` | - |
| `nounselect` | `token` | - |
| `nowheel` | `token` | Disable mousewheel interaction. |
| `offstate` | `token` | - |
| `outreachbottom` | `token` | - |
| `outreachleft` | `token` | - |
| `outreachright` | `token` | - |
| `outreachtop` | `token` | - |
| `passive` | `token` | - |
| `password` | `token` | Password input field. |
| `push` | `token` | - |
| `relative` | `token` | - |
| `reorder` | `token` | - |
| `resizedraw` | `token` | - |
| `reverse` | `token` | Reverse value direction. |
| `right` | `token` | Right visual segment drawing position. |
| `scaletext` | `token` | - |
| `secondary` | `token` | - |
| `selectalways` | `token` | Always select on click. |
| `selection` | `token` | Enables selection behavior. |
| `showtitle` | `token` | - |
| `simplemouse` | `token` | - |
| `slave` | `token` | - |
| `slider` | `token` | Enable slider control. |
| `small` | `token` | Uses smaller UI metrics. |
| `stayopenonclick` | `token` | Keep popup open on click. |
| `swallowalphachars` | `token` | - |
| `swallowmouse` | `token` | - |
| `swipe` | `token` | - |
| `thinhandle` | `token` | Thin handle. |
| `thumbnails` | `token` | Show thumbnails. |
| `tickscale` | `token` | - |
| `toggle` | `token` | Toggle behavior. |
| `tooltip` | `token` | Value adjustment tooltip. |
| `trailingbutton` | `token` | Places button at trailing edge. |
| `trailingicon` | `token` | - |
| `translucent` | `token` | Renders translucency. |
| `transparent` | `token` | Renders the control transparently. |
| `trigger` | `token` | Trigger behavior. |
| `tristate` | `token` | - |
| `unifysizes` | `token` | Equalizes child sizes in the container. |
| `urltitle` | `token` | - |
| `vertical` | `token` | Vertical orientation. |
| `windowmovable` | `token` | Allow drag from form area. |
| `wrap` | `token` | - |
| `xyediting` | `token` | Allows vertical drag adjustment. |

## outreach

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Divider outreach amount. |

## override

| Value | Type | Description |
|---|---|---|
| `true` | `token` | Overrides inherited style values. |

## Pen.color

| Value | Type | Description |
|---|---|---|
| Hex value (`#RRGGBB`), named color, or theme variable | `color` | Stroke color. |

## Pen.width

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Stroke width. |

## persistence.id

| Value | Type | Description |
|---|---|---|
| State persistence key (e.g. `"Browser"`) | `identifier` | Persistent layout state key. |

## placeholder

| Value | Type | Description |
|---|---|---|
| Display text string | `text` | Placeholder text. |

## point1

| Value | Type | Description |
|---|---|---|
| `x,y` | `tuple` | First triangle point. |

## point2

| Value | Type | Description |
|---|---|---|
| `x,y` | `tuple` | Second triangle point. |

## point3

| Value | Type | Description |
|---|---|---|
| `x,y` | `tuple` | Third triangle point. |

## popup

| Value | Type | Description |
|---|---|---|
| `bottom` | `token` | - |
| `left` | `token` | - |
| `right` | `token` | - |
| `vmouse` | `token` | - |

## popupstyle

| Value | Type | Description |
|---|---|---|
| Reference to a defined Style name | `identifier` | Popup style reference. |

## property

| Value | Type | Description |
|---|---|---|
| Any property name | `identifier` | Controller property name. |

## provider

| Value | Type | Description |
|---|---|---|
| Any provider name | `identifier` | Host-provided image source. |

## radius

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Corner radius. |

## referencename

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Reference binding name. |

## result

| Value | Type | Description |
|---|---|---|
| `okay` | `token` | Returns result equivalent to OK. |
| `cancel` | `token` | Returns result equivalent to Cancel. |
| `close` | `token` | Returns result equivalent to Close. |
| `apply` | `token` | Applies changes without closing. |

## scalealign

| Value | Type | Description |
|---|---|---|
| `bottom` | `token` | - |
| `right` | `token` | - |

## scrolloptions

| Value | Type | Description |
|---|---|---|
| `autobuttonsh` | `token` | Auto button show/hide. |
| `autohideboth` | `token` | Auto-hide both scrollbars. |
| `autohideh` | `token` | Auto-hide horizontal scrollbar. |
| `autohidev` | `token` | Auto-hide vertical scrollbar. |
| `border` | `token` | Scrollbar border. |
| `horizontal` | `token` | Renders horizontal scrollbar. |
| `noscreenscroll` | `token` | Disables screen scrolling. |
| `small` | `token` | Uses smaller UI metrics. |
| `transparent` | `token` | Renders transparent background. |
| `vertical` | `token` | Renders vertical scrollbar. |

## selectname

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Selection binding name. |

## size

| Value | Type | Description |
|---|---|---|
| `x,y,w,h` | `tuple` | Horizontal and vertical offsets; width and height of the control. |

## sizelimits

| Value | Type | Description |
|---|---|---|
| `none` | `token` | No size limits; control uses its natural content size. |
| `minWidth,minHeight,maxWidth,maxHeight` | `tuple` | Defines min and max size values; `-1` defines unconstrained for that slot. |

## smoothing

| Value | Type | Description |
|---|---|---|
| `antialias` | `token` | - |

## spacing

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Space between children or font spacing. |

## start

| Value | Type | Description |
|---|---|---|
| `x,y` | `tuple` | Line start point. |

## style

| Value | Type | Description |
|---|---|---|
| Reference to a defined Style name | `identifier` | Style reference. |
| `fill` | `token` | Enable fill. |
| `margin` | `token` | - |
| `scale` | `token` | - |
| `stroke` | `token` | Enable stroke line. |
| `tiled` | `token` | - |
| `bold` | `token` | Bold font weight. |
| `italic` | `token` | Italic font style. |
| `normal` | `token` | Normal font weight. |
| `underline` | `token` | Underlined text. |

## styles

| Value | Type | Description |
|---|---|---|
| Param Value (0 = first, 1 = second, etc.) | `text` | Space-separated style names indexed by param value. |

## target

| Value | Type | Description |
|---|---|---|
| `target` | `identifier` | Element type to enable chain-drag for. |
| `target` | `identifier` | Object to call the method on |

## template

| Value | Type | Description |
|---|---|---|
| `true` | `flag` | - |

## textalign

| Value | Type | Description |
|---|---|---|
| `center` | `token` | Center aligned text. |
| `left` | `token` | Left aligned text. |
| `top` | `token` | Top aligned text. |
| `true` | `token` | - |
| `vcenter` | `token` | Vertical center aligned text. |

## textcolor

| Value | Type | Description |
|---|---|---|
| Hex value (`#RRGGBB`), named color, or theme variable | `color` | Style text color. |

## textoptions

| Value | Type | Description |
|---|---|---|
| `wordbreak` | `token` | - |

## textsize

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Text size. |

## textstyle

| Value | Type | Description |
|---|---|---|
| `underline` | `token` | - |

## textthemeid

| Value | Type | Description |
|---|---|---|
| Theme resource key (e.g. `PresonusUI`) | `identifier` | Theme identifier for text styling. |
| `StandardUI` | `identifier` | Default text theme preset. |

## texttrimmode

| Value | Type | Description |
|---|---|---|
| `keepend` | `token` | Keep the beginning and trim the end. |
| `middle` | `token` | Trim the middle. |
| `right` | `token` | Trim the right side. |

## themeid

| Value | Type | Description |
|---|---|---|
| Theme resource key (e.g. `PresonusUI`) | `identifier` | - |

## tile

| Value | Type | Description |
|---|---|---|
| `repeat-x` | `token` | - |
| `repeat-xy` | `token` | - |
| `repeat-y` | `token` | - |
| `stretch-xy` | `token` | - |
| `stretch-y` | `token` | - |
| `tile-x` | `token` | - |
| `tile-xy` | `token` | - |
| `tile-y` | `token` | - |

## title

| Value | Type | Description |
|---|---|---|
| Display text string | `text` | Display title text. |

## titlename

| Value | Type | Description |
|---|---|---|
| Any binding name | `identifier` | Title binding name. |

## tooltip

| Value | Type | Description |
|---|---|---|
| Display text string | `text` | Tooltip text. |

## type

| Value | Type | Description |
|---|---|---|
| View presentation subtype (e.g. `"CheckBox"`, `"ComboBox"`, `"EditBox"`) | `identifier` | View subtype or control variant type. |

## units

| Value | Type | Description |
|---|---|---|
| Unit label (e.g. `"dB, Hz, %"`) | `identifier` | Display unit. |

## url

| Value | Type | Description |
|---|---|---|
| Any asset path | `identifier` | Asset path for an image resource. |
| Any shape name | `identifier` | Referenced `Shape` name. |

## value

| Value | Type | Description |
|---|---|---|
| Any numeric value | `number` | Option, state, or numeric filter value. |
| Display text string | `text` | Field or comparison value. |
| Any flag value | `flag` | Boolean-style value. |

## variable

| Value | Type | Description |
|---|---|---|
| `variable` | `identifier` | Skin variable to assign the selected style name to. |

## viewtype

| Value | Type | Description |
|---|---|---|
| View presentation mode key (e.g. `"icons"`) | `identifier` | View presentation mode. |

## vscroll.style

| Value | Type | Description |
|---|---|---|
| Reference to a defined Style name | `identifier` | Vertical scrollbar style reference. |

## width

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Explicit width. |

## windowstyle

| Value | Type | Description |
|---|---|---|
| `above` | `token` | - |
| `center` | `token` | Centers the dialog window. |
| `customframe` | `token` | Uses a custom-framed window. |
| `dialogstyle` | `token` | Standard dialog chrome. |
| `floating` | `token` | - |
| `fullscreen` | `token` | Uses fullscreen window behavior. |
| `inflate` | `token` | Expands the dialog content area. |
| `intermediate` | `token` | Uses intermediate window behavior. |
| `maximize` | `token` | Enables a maximize-capable window. |
| `panelstyle` | `token` | Uses panel-style window chrome. |
| `pluginhost` | `token` | Uses plugin-host window behavior. |
| `roundedcorners` | `token` | Uses rounded window corners. |
| `restorepos` | `token` | Restores the previous window position. |
| `restoresize` | `token` | Restores the previous window size. |
| `sheetstyle` | `token` | Uses sheet-style window chrome. |
| `sizable` | `token` | Makes the window resizable. |
| `titlebar` | `token` | Shows the title bar. |
| `translucent` | `token` | Uses translucent window styling. |
| `windowstyle` | `token` | Uses the named window-style prefix. |

## xyediting

| Value | Type | Description |
|---|---|---|
| Positive integer | `number` | Vertical drag sensitivity. |
