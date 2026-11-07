var kControllerName = "MacroPageOrganizerController";
var kDefaultCommandbarUrl = "local://$USERCONTENT/Macros/commandbar-v3.xml";
var kNativeMacroPanelClass = "EditAddIn:Engine:Macros (Arrangement)";

function MacroPageOrganizerController()
{
    this.interfaces = [
        Host.Interfaces.IComponent,
        Host.Interfaces.IController,
        Host.Interfaces.IParamObserver,
        Host.Interfaces.IObserver
    ];

    this.paramList = Host.Classes.createInstance("CCL:ParamList");
    this.paramList.controller = this;
    this.OrderState = this.paramList.addString("OrderState");
    this.EditName = this.paramList.addString("EditName");
    this.ReloadBtn = this.paramList.addParam("ReloadBtn");
    this.UpBtn = this.paramList.addParam("UpBtn");
    this.DownBtn = this.paramList.addParam("DownBtn");
    this.SaveBtn = this.paramList.addParam("SaveBtn");
    this.ExtensionsFirst = this.paramList.addInteger(0, 1, "ExtensionsFirst");
    this.RemovePageMenu = this.paramList.addMenu("RemovePageMenu");
    this.RemovePageMenu.appendString("Remove Page");
    // This is a one-command menu. Its selected marker is cleared when the
    // native menu is built, without changing the one-item menu range.
    this.RemovePageMenu.signalAlways = true;

    this.list = Host.Classes.createInstance("Host:ListViewModel");
    // Keep the total column width below the ListView's usable width so it
    // never creates a horizontal scrollbar that steals a row of vertical space.
    this.list.columns.addColumn(196, " Page", "pageName", 140, 64);
    this.list.columns.addColumn(108, " Source", "pageSource", 60, 0);

    this._context = null;
    this._filePath = null;
    this._model = null;
    this._rootItems = [];
    this._pages = [];
    this._originalPages = [];
    this._originalTitles = [];
    this._pageSlots = [];
    this._temporaryPages = [];
    this._displayPages = [];
    this._extensionsFirst = false;
    this._activeEdit = null;
    this._lastCellEdit = null;
    this._contextPage = null;
    this._rightClickPending = false;
    this._dirty = false;

    this.initialize = function(ctx)
    {
        this._context = ctx;
        try
        {
            this._extensionsFirst = this.readExtensionsFirstPreference();
            this.ExtensionsFirst.value = this._extensionsFirst ? 1 : 0;
            Host.Objects.registerObject(this, kControllerName);
            Host.Signals.advise(this.list, this);
            this.reload();
        }
        catch (e)
        {
            this.logFailure("initialize()", e);
            this.setStatus("Could not initialize. See MacroPageOrganizer.log.");
        }
    };

    this.terminate = function()
    {
        try { Host.Signals.unadvise(this.list, this); } catch (e) {}
        try { Host.Objects.unregisterObject(kControllerName); } catch (e) {}
        try { this.paramList.controller = null; } catch (e) {}
    };

    this.findParameter = function(name)
    {
        if (name === "OrderState") return this.OrderState;
        if (name === "EditName") return this.EditName;
        if (name === "ReloadBtn") return this.ReloadBtn;
        if (name === "UpBtn") return this.UpBtn;
        if (name === "DownBtn") return this.DownBtn;
        if (name === "SaveBtn") return this.SaveBtn;
        if (name === "ExtensionsFirst") return this.ExtensionsFirst;
        return null;
    };

    this.paramChanged = function(param)
    {
        if (!param) return;

        if (param === this.ExtensionsFirst)
        {
            var previousValue = this._extensionsFirst;
            var focusedIndex = this.selectedIndex();
            var focusedEntry = focusedIndex >= 0 ? this._displayPages[focusedIndex] : null;
            var focusedTitle = focusedEntry ? focusedEntry.title : null;
            var focusedTemporary = focusedEntry ? focusedEntry.isTemporary : false;

            this._extensionsFirst = param.value === 1;
            this.saveExtensionsFirstPreference();

            if (!this.loadTemporaryPages())
            {
                this._extensionsFirst = previousValue;
                this.ExtensionsFirst.value = previousValue ? 1 : 0;
                this.saveExtensionsFirstPreference();
                this.loadTemporaryPages();
            }

            var restoredFocus = -1;
            if (focusedTitle !== null)
            {
                for (var f = 0; f < this._displayPages.length; f++)
                {
                    if (this._displayPages[f].title === focusedTitle &&
                        this._displayPages[f].isTemporary === focusedTemporary)
                    {
                        restoredFocus = f;
                        break;
                    }
                }
            }
            this.refreshList(restoredFocus);
            return;
        }

        if (param === this.EditName)
        {
            try { this.applyEditedTitle(param.string); }
            catch (e)
            {
                this.logFailure("rename page", e);
                this.setStatus("Rename failed. See MacroPageOrganizer.log.");
            }
            return;
        }

        if (param === this.RemovePageMenu)
        {
            try { this.removeContextPage(); }
            catch (e)
            {
                this.logFailure("remove page", e);
                this.setStatus("Remove failed. See MacroPageOrganizer.log.");
            }
            return;
        }

        if (param.value !== 1) return;
        var name = param.name;
        param.value = 0;

        try
        {
            if (name === "ReloadBtn") this.reload(false, true);
            else if (name === "UpBtn") this.moveFocused(-1);
            else if (name === "DownBtn") this.moveFocused(1);
            else if (name === "SaveBtn") this.save();
        }
        catch (e)
        {
            this.logFailure(name + " action", e);
            this.setStatus("Action failed. See MacroPageOrganizer.log.");
        }
    };

    this.readExtensionsFirstPreference = function()
    {
        try
        {
            var settings = Host.Settings.getAttributes("MacroToolBar");
            var value = settings.getAttribute("MacroPageOrganizer.ExtensionsFirst");
            return value === 1 || value === "1" || value === true;
        }
        catch (e)
        {
            this.logFailure("readExtensionsFirstPreference()", e);
            return false;
        }
    };

    this.saveExtensionsFirstPreference = function()
    {
        try
        {
            var settings = Host.Settings.getAttributes("MacroToolBar");
            settings.setAttribute("MacroPageOrganizer.ExtensionsFirst", this._extensionsFirst ? 1 : 0);
        }
        catch (e)
        {
            this.logFailure("saveExtensionsFirstPreference()", e);
            this.setStatus("Could not save the Extensions first preference.");
        }
    };

    this.reloadOnOpen = function()
    {
        try
        {
            // Let the form and ListView finish attaching before rebuilding the
            // model. This makes the startup refresh reach the rendered view.
            Host.Signals.postMessage(this, 100, "reloadOrganizerAfterAttach");
        }
        catch (e)
        {
            this.logFailure("reloadOnOpen()", e);
            this.setStatus("Could not refresh the page list. See MacroPageOrganizer.log.");
        }
    };

    this.reload = function(discardUnsaved, preserveSelection)
    {
        if (this._dirty && !discardUnsaved && !this.confirmDiscardChanges())
            return;

        var path = Host.Url(kDefaultCommandbarUrl);
        if (!Host.IO.File(path).exists())
        {
            this._filePath = null;
            this._model = null;
            this._rootItems = [];
            this._pages = [];
            this._pageSlots = [];
            this._temporaryPages = [];
            this.refreshList(-1);
            this.setStatus("Could not find the default Macros/commandbar-v3.xml file.");
            return;
        }

        var focusIndex = preserveSelection ? this.selectedIndex() : -1;
        if (this.loadPath(path))
        {
            this.loadTemporaryPages();
            // Preserve the current selection when possible. Opening or reloading
            // the organizer must not move the list to the bottom automatically.
            this.refreshList(focusIndex);
        }
    };

    this.loadPath = function(path)
    {
        var nextModel = Host.Classes.createInstance("CCL:CommandBarModel");
        nextModel.loadFromFile(path);

        var root = nextModel.getRootItem();
        var rootCount = root.numChilds;
        if (typeof rootCount !== "number" || rootCount < 1)
        {
            this.setStatus("The default commandbar-v3.xml has no entries.");
            return false;
        }

        var rootItems = [];
        var pages = [];
        var pageSlots = [];

        for (var i = 0; i < rootCount; i++)
        {
            var item = root.getChildItem(i);
            rootItems.push(item);

            // commandbar-v3.xml also has a CommandBar.SetupGroup. Page entries
            // are the titled top-level items; keep all other items in place.
            if (this.isPage(item))
            {
                pages.push(item);
                pageSlots.push(i);
            }
        }

        if (pages.length < 1)
        {
            this.setStatus("No titled macro pages were found in commandbar-v3.xml.");
            return false;
        }

        this._activeEdit = null;
        this._filePath = Host.Url(path.url);
        this._model = nextModel;
        this._rootItems = rootItems;
        this._pages = pages;
        this.captureBaseline();
        this._pageSlots = pageSlots;
        this._temporaryPages = [];
        this._dirty = false;
        return true;
    };

    this.loadTemporaryPages = function()
    {
        var nativePanel = null;
        var panelInitialized = false;
        var loaded = false;

        try
        {
            // Native Macro Toolbar reload imports extension-owned pages into
            // the shared live model and marks them temporary/read-only.
            nativePanel = Host.Classes.createInstance(kNativeMacroPanelClass);
            if (!nativePanel)
                throw new Error("Studio Pro did not create the native Macro Toolbar panel.");

            var editEnvironment = Host.Objects.getObjectByUrl("://hostapp/DocumentManager/ActiveDocument/EditEnvironment");
            var panelContext = { activeEditor: editEnvironment ? editEnvironment.activeEditor : null };
            var initResult = nativePanel.initialize(panelContext);
            if (initResult !== Host.Results.kResultOk)
                throw new Error("The native Macro Toolbar panel failed to initialize: " + initResult);
            panelInitialized = true;

            var selectedPage = nativePanel.getSelectedPage();
            var selectedPageID = selectedPage ? selectedPage.id : null;
            var selectedPageTitle = selectedPage ? this.pageTitle(selectedPage) : null;

            nativePanel.loadCommandBar(true);
            var liveModel = nativePanel.macroBar;
            if (!this.hasCommandBarModel(liveModel))
                throw new Error("Reloading the native Macro Toolbar did not return a live model.");

            this.captureTemporaryPages(liveModel);
            if (this._extensionsFirst)
                this.moveTemporaryPagesToStart(liveModel);
            var restoredPageIndex = this.findPageIndex(liveModel, selectedPageID, selectedPageTitle);
            if (restoredPageIndex >= 0)
                nativePanel.selectPage(restoredPageIndex);
            liveModel.invalidate();
            nativePanel.saveCommandBar(false);
            loaded = true;
        }
        catch (e)
        {
            this.logFailure("loadTemporaryPages()", e);
            this._temporaryPages = [];
        }
        finally
        {
            if (nativePanel && panelInitialized)
            {
                try { nativePanel.terminate(); }
                catch (terminateError) { this.logFailure("terminate native Macro Toolbar panel", terminateError); }
            }
        }

        return loaded;
    };

    this.moveTemporaryPagesToStart = function(model)
    {
        if (!model || this._temporaryPages.length === 0)
            return;

        var root = model.getRootItem();
        var extensionItems = [];
        for (var i = 0; i < this._temporaryPages.length; i++)
            extensionItems.push(this._temporaryPages[i].item);

        for (var r = 0; r < extensionItems.length; r++)
            root.removeChildItem(extensionItems[r]);

        var insertIndex = 0;
        while (insertIndex < root.numChilds && root.getChildItem(insertIndex).type !== "Page")
            insertIndex++;

        for (var a = 0; a < extensionItems.length; a++)
            root.addChildItem(extensionItems[a], insertIndex + a);
    };

    this.captureTemporaryPages = function(model)
    {
        var pages = [];
        var root = model.getRootItem();
        var matchedSavedPages = [];

        // Some extension pages are not marked isTemporary by the host. Match
        // every live saved page against the file-backed pages, then treat any
        // unmatched live page as extension-owned. This keeps extension
        // discovery automatic and avoids relying only on the temporary flag.
        for (var i = 0; i < root.numChilds; i++)
        {
            var item = root.getChildItem(i);
            if (!this.isPage(item)) continue;

            if (item.isTemporary)
            {
                pages.push({ item: item, title: this.pageTitle(item) });
                continue;
            }

            var savedIndex = -1;
            for (var s = 0; s < this._pages.length; s++)
            {
                if (matchedSavedPages[s]) continue;
                if (item.id && this._pages[s].id === item.id)
                {
                    savedIndex = s;
                    break;
                }
            }

            if (savedIndex < 0)
            {
                var liveTitle = this.pageTitle(item);
                for (var t = 0; t < this._pages.length; t++)
                {
                    if (!matchedSavedPages[t] && this.pageTitle(this._pages[t]) === liveTitle)
                    {
                        savedIndex = t;
                        break;
                    }
                }
            }

            if (savedIndex >= 0)
                matchedSavedPages[savedIndex] = true;
            else
                pages.push({ item: item, title: this.pageTitle(item) });
        }

        pages.sort(function(a, b)
        {
            return a.title.localeCompare(b.title, undefined, { numeric: true });
        });
        this._temporaryPages = pages;
    };

    this.isPage = function(item)
    {
        return !!(item && typeof item.title === "string" && item.title !== "");
    };

    this.beginPageContextClick = function()
    {
        this._lastCellEdit = null;
        this._contextPage = null;
        this._rightClickPending = true;
    };

    this.endPageContextClick = function()
    {
        this._rightClickPending = false;
    };

    this.showRemovePagePopup = function(row, editInfo)
    {
        if (!row || !editInfo)
            return;

        var displayIndex = -1;
        for (var i = 0; i < this._displayPages.length; i++)
        {
            if (this.list.getItem(i) === row)
            {
                displayIndex = i;
                break;
            }
        }

        if (displayIndex < 0)
            return;

        var entry = this._displayPages[displayIndex];
        if (!entry || entry.isTemporary || this._pages.length < 2)
            return;

        this._contextPage = entry.item;
        // doPopup consumes EditInfo's view and cell rectangle. Call it from
        // the synchronous editItemCell notification while those references are valid.
        this.list.doPopup(this.RemovePageMenu, editInfo);
    };

    this.removeContextPage = function()
    {
        var page = this._contextPage;
        this._contextPage = null;
        if (!page) return;

        var pageIndex = -1;
        for (var i = 0; i < this._pages.length; i++)
        {
            if (this._pages[i] === page)
            {
                pageIndex = i;
                break;
            }
        }

        if (pageIndex < 0 || this._pages.length < 2)
            return;

        var focusIndex = Math.min(pageIndex, this._pages.length - 2);
        if (this._extensionsFirst)
            focusIndex += this._temporaryPages.length;
        var root = this._model.getRootItem();
        var retainedItems = [];
        for (var r = 0; r < root.numChilds; r++)
        {
            var item = root.getChildItem(r);
            if (item !== page)
                retainedItems.push(item);
        }

        root.removeAll();
        for (var a = 0; a < retainedItems.length; a++)
            root.addChildItem(retainedItems[a]);

        this.collectCurrentEntries();
        this._dirty = this.orderHasChanged();
        this.refreshList(focusIndex);
        this.setStatus("Page removed. Apply to save.");
    };

    this.moveFocused = function(direction)
    {
        if (!this._model)
        {
            this.setStatus("The default commandbar-v3.xml is not loaded.");
            return;
        }

        var focused = this.list.getFocusItem();
        var displayIndex = -1;
        for (var i = 0; i < this.list.itemCount; i++)
        {
            if (this.list.getItem(i) === focused)
            {
                displayIndex = i;
                break;
            }
        }

        if (displayIndex < 0 || displayIndex >= this._displayPages.length)
        {
            this.setStatus("Select a macro page first.");
            return;
        }

        this._activeEdit = null;
        var selectedEntry = this._displayPages[displayIndex];
        if (selectedEntry.isTemporary)
        {
            this.setStatus("Extension \"" + selectedEntry.title + "\" can't be moved.");
            return;
        }
        if (this._pages.length < 2)
        {
            this.setStatus("At least two saved macro pages are needed to reorder.");
            return;
        }

        var index = selectedEntry.pageIndex;
        var nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= this._pages.length)
        {
            this.setStatus("The selected page is already at the end of the list.");
            return;
        }

        var page = this._pages[index];
        this._pages[index] = this._pages[nextIndex];
        this._pages[nextIndex] = page;
        this._dirty = this.orderHasChanged();

        // Replace only page entries at their original root positions. This
        // preserves SetupGroup and any other non-page root children.
        var orderedItems = [];
        for (var r = 0; r < this._rootItems.length; r++)
            orderedItems.push(this._rootItems[r]);
        for (var p = 0; p < this._pageSlots.length; p++)
            orderedItems[this._pageSlots[p]] = this._pages[p];

        var root = this._model.getRootItem();
        root.removeAll();
        for (var a = 0; a < orderedItems.length; a++)
            root.addChildItem(orderedItems[a]);
        this._rootItems = orderedItems;

        this.refreshList(nextIndex + (this._extensionsFirst ? this._temporaryPages.length : 0));
    };

    this.save = function()
    {
        if (!this._model || !this._filePath)
        {
            this.setStatus("The default commandbar-v3.xml is not loaded.");
            return;
        }

        var focusIndex = this.selectedIndex();
        var backupPath = null;
        var nativePanel = null;
        var panelInitialized = false;

        try
        {
            backupPath = this.createBackupPath();
            Host.IO.File(this._filePath).copyTo(backupPath);

            // Create and initialize the native panel controller. Its macroBar
            // reference resolves to Studio Pro's shared, live CommandBarModel.
            nativePanel = Host.Classes.createInstance(kNativeMacroPanelClass);
            if (!nativePanel)
                throw new Error("Studio Pro did not create the native Macro Toolbar panel.");

            var editEnvironment = Host.Objects.getObjectByUrl("://hostapp/DocumentManager/ActiveDocument/EditEnvironment");
            var panelContext = { activeEditor: editEnvironment ? editEnvironment.activeEditor : null };
            var initResult = nativePanel.initialize(panelContext);
            if (initResult !== Host.Results.kResultOk)
                throw new Error("The native Macro Toolbar panel failed to initialize: " + initResult);
            panelInitialized = true;

            var liveModel = nativePanel.macroBar;
            if (!this.hasCommandBarModel(liveModel))
                throw new Error("The native Macro Toolbar did not expose its live model.");

            var selectedPage = nativePanel.getSelectedPage();
            var selectedPageID = selectedPage ? selectedPage.id : null;
            var selectedPageTitle = selectedPage ? this.pageTitle(selectedPage) : null;
            // Preserve the selected toolbar page when its staged title changed.
            for (var selectedIndex = 0; selectedIndex < this._pages.length; selectedIndex++)
            {
                var selectedCandidate = this._pages[selectedIndex];
                var isSelected = selectedPageID && selectedCandidate.id === selectedPageID;
                for (var baselineIndex = 0; !isSelected && baselineIndex < this._originalPages.length; baselineIndex++)
                {
                    if (this._originalPages[baselineIndex] === selectedCandidate &&
                        this._originalTitles[baselineIndex] === selectedPageTitle)
                        isSelected = true;
                }
                if (isSelected)
                {
                    selectedPageTitle = this.pageTitle(selectedCandidate);
                    break;
                }
            }
            this._activeEdit = null;

            // Write the reordered persistent pages first. The native reload
            // method then refreshes the shared model and reimports temporary pages.
            this._model.saveToFile(this._filePath);
            nativePanel.loadCommandBar(true);

            liveModel = nativePanel.macroBar;
            if (!this.hasCommandBarModel(liveModel))
                throw new Error("Reloading the native Macro Toolbar did not return a live model.");

            this.captureTemporaryPages(liveModel);
            if (this._extensionsFirst)
                this.moveTemporaryPagesToStart(liveModel);

            var restoredPageIndex = this.findPageIndex(liveModel, selectedPageID, selectedPageTitle);
            if (restoredPageIndex >= 0)
                nativePanel.selectPage(restoredPageIndex);

            liveModel.invalidate();
            nativePanel.saveCommandBar(true);
            this.verifyPersistentPageOrder(liveModel);
            this.captureTemporaryPages(liveModel);

            var verify = Host.Classes.createInstance("CCL:CommandBarModel");
            verify.loadFromFile(this._filePath);
            if (verify.getRootItem().numChilds !== this._rootItems.length)
                throw new Error("Saved root entry count does not match the loaded entry count.");
            this.verifyPersistentPageOrder(verify);

            nativePanel.terminate();
            panelInitialized = false;

            this._model = verify;
            this.collectCurrentEntries();
            this.captureBaseline();
            this._dirty = false;
            this.refreshList(focusIndex);
        }
        catch (e)
        {
            // Restore both the file and live model if any part of Apply fails.
            try
            {
                if (backupPath && Host.IO.File(backupPath).exists())
                {
                    Host.IO.File(this._filePath).remove();
                    Host.IO.File(backupPath).copyTo(this._filePath);
                }
            }
            catch (fileRollbackError)
            {
                this.logFailure("restore commandbar-v3.xml", fileRollbackError);
            }

            if (nativePanel && this.hasCommandBarModel(nativePanel.macroBar))
            {
                try
                {
                    nativePanel.loadCommandBar(true);
                    this.captureTemporaryPages(nativePanel.macroBar);
                    if (this._extensionsFirst)
                        this.moveTemporaryPagesToStart(nativePanel.macroBar);
                    nativePanel.macroBar.invalidate();
                    nativePanel.saveCommandBar(false);
                }
                catch (modelRollbackError)
                {
                    this.logFailure("restore live Macro Toolbar", modelRollbackError);
                }
            }

            if (nativePanel && panelInitialized)
            {
                try { nativePanel.terminate(); }
                catch (terminateError) { this.logFailure("terminate native Macro Toolbar panel", terminateError); }
            }
            throw e;
        }
    };

    this.createBackupPath = function()
    {
        var folder = Host.Url(this._filePath.url);
        folder.ascend();
        var backupPath = Host.Url(folder.url);
        backupPath.descend(this._filePath.name + ".backup");
        if (Host.IO.File(backupPath).exists())
        {
            backupPath = Host.Url(folder.url);
            backupPath.descend(this._filePath.name + ".backup-" + new Date().getTime());
        }
        return backupPath;
    };

    this.hasCommandBarModel = function(value)
    {
        try
        {
            return !!(value && typeof value.getRootItem === "function" && typeof value.saveToFile === "function");
        }
        catch (e) { return false; }
    };

    this.findPageIndex = function(model, pageID, title)
    {
        var root = model.getRootItem();
        var pageIndex = 0;
        var titleMatch = -1;
        for (var i = 0; i < root.numChilds; i++)
        {
            var item = root.getChildItem(i);
            if (!this.isPage(item)) continue;
            if (pageID && item.id === pageID) return pageIndex;
            if (titleMatch < 0 && this.pageTitle(item) === title) titleMatch = pageIndex;
            pageIndex++;
        }
        return titleMatch;
    };

    this.verifyPersistentPageOrder = function(model)
    {
        var root = model.getRootItem();
        var actual = [];
        for (var i = 0; i < root.numChilds; i++)
        {
            var item = root.getChildItem(i);
            if (this.isPage(item) && !item.isTemporary)
                actual.push(item);
        }

        if (actual.length !== this._pages.length)
            throw new Error("Live/saved macro page count does not match the organizer list.");

        for (var j = 0; j < this._pages.length; j++)
        {
            var expected = this._pages[j];
            var received = actual[j];
            // Studio Pro can regenerate internal page IDs during loadCommandBar().
            // Titles and persistent page count are the stable visible-order check.
            if (this.pageTitle(received) !== this.pageTitle(expected))
                throw new Error("Macro Toolbar page order verification failed at page " + (j + 1) + ".");
        }
    };

    this.collectCurrentEntries = function()
    {
        var root = this._model.getRootItem();
        this._rootItems = [];
        this._pages = [];
        this._pageSlots = [];

        for (var i = 0; i < root.numChilds; i++)
        {
            var item = root.getChildItem(i);
            this._rootItems.push(item);
            if (this.isPage(item))
            {
                this._pages.push(item);
                this._pageSlots.push(i);
            }
        }
    };

    this.captureBaseline = function()
    {
        this._originalPages = this._pages.slice(0);
        this._originalTitles = [];
        for (var i = 0; i < this._pages.length; i++)
            this._originalTitles.push(this.pageTitle(this._pages[i]));
    };

    this.orderHasChanged = function()
    {
        if (this._pages.length !== this._originalPages.length) return true;
        for (var i = 0; i < this._pages.length; i++)
            if (this._pages[i] !== this._originalPages[i] ||
                this.pageTitle(this._pages[i]) !== this._originalTitles[i]) return true;
        return false;
    };

    this.confirmDiscardChanges = function()
    {
        return Host.GUI.ask(
            "Discard the unsaved page changes?"
        ) === Host.GUI.Constants.kYes;
    };

    this.applyEditedTitle = function(value)
    {
        var edit = this._activeEdit;
        if (!edit) return;

        var title = value == null ? "" : String(value);
        // The editor can emit a transient empty value while replacing the
        // selected text. Ignore it without showing a validation error.
        if (!title.replace(/^\s+|\s+$/g, ""))
            return;

        if (edit.page.title !== title)
        {
            edit.page.title = title;
            edit.entry.title = title;
            edit.row.details.pageName = "\u00A0 " + title;
            this._dirty = this.orderHasChanged();
            this.OrderState.string = this._dirty ? "Unsaved changes" : "No pending changes";
            this.list.changed();
        }
    };

    this.editListItem = function(message)
    {
        var row = message.getArg(0);
        var column = message.getArg(1);
        var editInfo = message.getArg(2);
        var cellEdit = this._lastCellEdit;
        this._lastCellEdit = null;
        if (cellEdit && cellEdit.columnID === "pageName" &&
            (cellEdit.row === row || (cellEdit.row && row && cellEdit.row.id === row.id)))
            editInfo = cellEdit.editInfo;
        if (!row || column !== 0 || !editInfo) return;

        for (var i = 0; i < this._displayPages.length; i++)
        {
            var entry = this._displayPages[i];
            if (this.list.getItem(i) !== row) continue;
            this._activeEdit = null;
            if (entry.isTemporary)
            {
                this.setStatus("Extension \"" + entry.title + "\" can't be renamed.");
                return;
            }

            this.EditName.string = this.pageTitle(entry.item);
            this._activeEdit = { page: entry.item, entry: entry, row: row };
            this.list.editValue(this.EditName, editInfo);
            return;
        }
    };

    this.selectedIndex = function()
    {
        var focused = this.list.getFocusItem();
        for (var i = 0; i < this.list.itemCount; i++)
            if (this.list.getItem(i) === focused) return i;
        return -1;
    };

    this.refreshList = function(focusIndex)
    {
        // Match Studio Pro's own Macro Organizer population path: clear the
        // model in one operation before adding the current rows.
        this.list.removeAll();

        var savedEntries = [];
        var extensionEntries = [];
        var usedIDs = {};
        for (var p = 0; p < this._pages.length; p++)
            savedEntries.push({ item: this._pages[p], title: this.pageTitle(this._pages[p]), pageIndex: p, isTemporary: false });
        for (var t = 0; t < this._temporaryPages.length; t++)
            extensionEntries.push({ item: this._temporaryPages[t].item, title: this._temporaryPages[t].title, pageIndex: -1, isTemporary: true });
        this._displayPages = this._extensionsFirst ?
            extensionEntries.concat(savedEntries) : savedEntries.concat(extensionEntries);

        for (var i = 0; i < this._displayPages.length; i++)
        {
            var entry = this._displayPages[i];
            var baseID = (entry.isTemporary ? "extension-" : "page-") + entry.title;
            var rowID = baseID;
            var duplicate = 2;
            while (usedIDs[rowID])
            {
                rowID = baseID + " (" + duplicate + ")";
                duplicate++;
            }
            usedIDs[rowID] = true;

            var row = this.list.newItem(rowID);
            row.details.pageName = (entry.isTemporary ? "* " : "\u00A0 ") + entry.title;
            row.details.pageSource = entry.isTemporary ? "\u00A0 Extension" : "\u00A0 Page";
            this.list.addItem(row);
        }

        this.OrderState.string = this._dirty ? "Unsaved changes" : "No pending changes";
        this.list.changed();
        Host.Signals.flush();

        if (focusIndex >= 0 && focusIndex < this.list.itemCount && this.list.itemView)
        {
            this.list.itemView.setFocusItem(focusIndex, true);
        }

    };

    this.pageTitle = function(page)
    {
        if (!page) return "(Missing page)";
        if (page.title && page.title !== "") return page.title;
        if (page.name && page.name !== "") return page.name;
        return "(Untitled page)";
    };

    this.setStatus = function(message)
    {
        if (this.OrderState)
            this.OrderState.string = message;
    };

    this.logFailure = function(functionName, error)
    {
        try
        {
            var logFile = Host.IO.createTextFile(Host.Url("local://$USERCONTENT/MacroPageOrganizer.log"));
            if (logFile)
            {
                logFile.writeLine(
                    "Macro Page Organizer | context=" + this._context +
                    " | " + functionName + " | " + error
                );
                logFile.close();
            }
        }
        catch (ignored) {}
    };

    this.notify = function(subject, message)
    {
        if (!message) return;
        try
        {
            if (subject === this.RemovePageMenu && message.id === "extendMenu")
            {
                var menu = message.getArg(0);
                var removeItem = menu && menu.getItem ? menu.getItem(0) : null;
                if (removeItem) removeItem.checked = false;
                return;
            }
            if (message.id === "reloadOrganizerAfterAttach")
            {
                this.reload(true, false);
                // The ListView can receive the initial model before its skin
                // metrics finish attaching. Re-issue the model change on the
                // next UI turn so its row extent and scrollbar are recalculated.
                Host.Signals.postMessage(this, 101, "recalculateOrganizerListAfterAttach");
                return;
            }
            if (message.id === "recalculateOrganizerListAfterAttach")
            {
                this.list.changed();
                Host.Signals.flush();
                return;
            }
            if (subject === this.list && message.id === "editItemCell")
            {
                var cellRow = message.getArg(0);
                var columnID = message.getArg(1);
                var cellInfo = message.getArg(2);
                this._lastCellEdit = {
                    row: cellRow,
                    columnID: columnID,
                    editInfo: cellInfo
                };

                if (this._rightClickPending)
                {
                    this._rightClickPending = false;
                    if (columnID === "pageName")
                        this.showRemovePagePopup(cellRow, cellInfo);
                }
                return;
            }
            if (subject === this.list && message.id === "itemOpened")
            {
                this.editListItem(message);
                return;
            }
        }
        catch (e)
        {
            this.logFailure("deferred ListView update", e);
            this.setStatus("Could not refresh the page list. See MacroPageOrganizer.log.");
        }
    };
    this.saveViewState = function() { return true; };
    this.loadViewState = function() { return true; };
}

function createInstance()
{
    return new MacroPageOrganizerController();
}
