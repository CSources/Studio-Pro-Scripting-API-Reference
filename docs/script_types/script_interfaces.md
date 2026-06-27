---
sidebar_position: 1
---
# Script Interfaces

Script Interfaces define the contracts between a script and the host. Each interface (IComponent, IEditTask, etc.) corresponds to a set of lifecycle callbacks the host invokes on the script. The minimum interface required depends on the script category.

## Category Reference

The `category` attribute in `classfactory.xml` determines which interface and lifecycle the script follows.

| Category | Minimum Interfaces | Lifecycle Callbacks | Purpose |
|---|---|---|---|
| [`"EditTask"`](edittask.md) | `IEditTask` | `prepareEdit()`, `performEdit()` | Command/action script with optional dialog |
| [`"EditAddIn"`](editaddin.md) | `IComponent` | `initialize()`, `terminate()` | Persistent add-in panel |
| [`"FrameworkService"`](windowclass.md) | `IComponent` | `initialize()`, `terminate()` | Headless background service — auto-started at startup |

See [Interfaces - Callback Contracts](host/interfaces.md#callback-contracts) for the full interface and callback contract reference.