// Developed with agentic coding assistance.

include_file("resource://{main}/sdk/cclapp.js");

var kPackageID = "marker.creator.panel"
var kSlots = 16
var kPresetDir = "local://$USERCONTENT/Script Presets/Marker Creator"
var kPresetExt = ".markerslots"

function MarkerCreatorController()
{
    var self = this

    this.interfaces = [
        Host.Interfaces.IComponent, Host.Interfaces.IExtensionHandler,
        Host.Interfaces.IController, Host.Interfaces.IParamObserver,
        Host.Interfaces.IObserver,
        Host.Interfaces.IPersistAttributes,         Host.Interfaces.IViewStateHandler,
        Host.Interfaces.IObjectNode
    ]
    this.children = []

    this.initialize = function(ctx)
    {
        Host.Objects.registerObject(this, "MarkerCreatorController")

        this.paramList = Host.Classes.createInstance("CCL:ParamList")
        this.paramList.controller = this

        for (var i = 0; i < kSlots; i++)
        {
            this["SlotName" + i] = this.paramList.addString("SlotName" + i)
            this["SlotDisplay" + i] = this.paramList.addString("SlotDisplay" + i)
            this["SlotBtn" + i] = this.paramList.addParam("SlotBtn" + i)
            this["onSlotCtx" + i] = (function(idx) {
                return function() { self.openRenameDialog(idx) }
            })(i)
        }

        this.PresetList = this.paramList.addList("PresetList")
        this.UndoBtn = this.paramList.addParam("UndoBtn")
        this.RedoBtn = this.paramList.addParam("RedoBtn")
        this.SaveBtn = this.paramList.addParam("SaveBtn")
        this.ClearBtn = this.paramList.addParam("ClearBtn")
        this.AutoNumBtn = this.paramList.addInteger(0, 1, "AutoNumBtn")
        this.OffsetSlider = this.paramList.addInteger(0, 1000, "OffsetSlider")
        this.OffsetSlider.value = 0
        this.OffsetMs = this.paramList.addInteger(-1000, 0, "OffsetMs")
        this.OffsetMs.value = 0
        this.OffsetMs.reverse = 1
        this.OffsetUnit = this.paramList.addList("OffsetUnit")
        this.OffsetUnit.appendString("ms")
        this.OffsetUnit.appendString("Frames")
        this.FrameRateList = this.paramList.addList("FrameRateList")
        var rates = ["23.976 fps","24 fps","24.975 fps","25 fps","29.97 dfps","29.97 fps","30 dfps","30 fps","50 fps","59.94 dfps","59.94 fps","60 dfps","60 fps"]
        for (var r = 0; r < rates.length; r++) this.FrameRateList.appendString(rates[r])
        this.FrameRateList.value = 7
        this.updateFrameRateDim()
        this._offsetSyncing = false
        this.autoNumCounts = {}
        this.scanPresets()
        this.updateBtnStates()
        return Host.Results.kResultOk
    }

    this.terminate = function()
    {
        try { Host.Objects.unregisterObject("MarkerCreatorController") } catch(e) {}
        try { if (this.paramList) this.paramList.controller = null } catch(e) {}
        return Host.Results.kResultOk
    }

    this.startupExtension = function(d) { return 1 }

    this.updateFrameRateDim = function()
    {
        if (this.FrameRateList)
            this.FrameRateList.enabled = (this.OffsetUnit && this.OffsetUnit.value === 1) ? 1 : 0
    }

    this.getFrameRateValue = function()
    {
        var fpsStr = this.FrameRateList ? this.FrameRateList.string : ""
        var m = fpsStr.match(/(\d+\.?\d*)/)
        return m ? parseFloat(m[1]) : 30
    }

    this.ensurePresetDir = function()
    {
        var dir = Host.Url(kPresetDir)
        dir.descend("__tmp__")
        var f = Host.IO.createTextFile(dir)
        if (f) {
            f.close()
            Host.IO.File(dir).remove()
        }
    }

    this.scanPresets = function(selectName)
    {
        try {
            this.ensurePresetDir()
            this.PresetList.removeAll()
            this.PresetList.appendString("(No Preset)")
            var count = 0
            var foundIndex = -1
            var dir = Host.Url(kPresetDir, true)
            if (!dir || !Host.IO.File(dir).exists()) { if (selectName) this.PresetList.string = selectName; return }
            var it = Host.IO.findFiles(dir, "*" + kPresetExt)
            if (!it) return
            var f = it.next()
            while (f)
            {
                var displayName = f.name
                var idx = displayName.lastIndexOf(kPresetExt)
                if (idx > 0) displayName = displayName.substring(0, idx)
                count++
                if (selectName && displayName === selectName) foundIndex = count
                this.PresetList.appendString(displayName)
                f = it.next()
            }
            if (foundIndex >= 0) this.PresetList.value = foundIndex
            else if (selectName) this.PresetList.string = selectName
        } catch(e) {}
    }

    this.updateBtnStates = function()
    {
        for (var i = 0; i < kSlots; i++)
        {
            var name = this["SlotName" + i] ? this["SlotName" + i].string : ""
            if (name && name !== "")
                this["SlotDisplay" + i].string = name
            else
                this["SlotDisplay" + i].string = String(i + 1)
            this["SlotBtn" + i].enabled = (name && name !== "") ? 1 : 0
        }
    }

    this.clearAll = function()
    {
        for (var i = 0; i < kSlots; i++)
            if (this["SlotName" + i]) this["SlotName" + i].string = ""
        this.updateBtnStates()
    }

    this.loadPresetByName = function(presetName)
    {
        if (!presetName || presetName === "" || presetName === "(No Preset)") return
        try {
            var path = Host.Url(kPresetDir, true)
            path.descend(presetName + kPresetExt)
            if (!Host.IO.File(path).exists()) return
            var file = Host.IO.openTextFile(path)
            if (!file) return
            var loaded = []
            while (!file.endOfStream)
            {
                var line = file.readLine()
                if (line === "---END---") break
                loaded.push(line)
            }
            file.close()
            for (var i = 0; i < kSlots && i < loaded.length; i++)
            {
                if (this["SlotName" + i])
                    this["SlotName" + i].string = loaded[i] || ""
            }
        } catch(e) {}
        this.updateBtnStates()
    }

    this.writeNamesToFile = function(path, names)
    {
        try {
            var file = Host.IO.createTextFile(path)
            if (file)
            {
                for (var i = 0; i < names.length; i++)
                    file.writeLine(names[i])
                file.writeLine("---END---")
                file.close()
            }
        } catch(e) {}
    }

    this.savePreset = function()
    {
        var names = []
        for (var i = 0; i < kSlots; i++)
        {
            var v = this["SlotName" + i] ? this["SlotName" + i].string : ""
            names.push(v || "")
        }

        var fs = Host.Classes.createInstance("CCL:FileSelector")
        fs.addFilter({ extension: "markerslots", description: "Marker Slots Preset" })
        fs.setFileName("preset.markerslots")
        this.ensurePresetDir()
        try { fs.setFolder(Host.Url(kPresetDir, true)) } catch(e) {}
        var result = fs.runSave("Save Marker Slots Preset")
        if (result !== 1) return

        var path = fs.getPath()
        if (!path) return

        this.writeNamesToFile(path, names)

        var savedName = path.name
        if (savedName)
        {
            var extIdx = savedName.lastIndexOf(kPresetExt)
            if (extIdx > 0) savedName = savedName.substring(0, extIdx)
        }
        this.scanPresets(savedName || null)
    }

    this.createMarker = function(idx)
    {
        var name = this["SlotName" + idx] ? this["SlotName" + idx].string : ""
        if (name && name !== "")
        {
            var markerName = name
            if (this.AutoNumBtn && this.AutoNumBtn.value === 1)
            {
                if (!this.autoNumCounts[name]) this.autoNumCounts[name] = 0
                this.autoNumCounts[name]++
                if (this.autoNumCounts[name] > 1)
                    markerName = name + " " + this.autoNumCounts[name]
            }
            var offsetVal = this.OffsetMs ? this.OffsetMs.value : 0
            if (offsetVal !== 0)
            {
                var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
                var fps = isFrames ? this.getFrameRateValue() : 30
                var offsetSec = isFrames ? offsetVal / fps : offsetVal / 1000.0
                try {
                    var tp = Host.Objects.getObjectByUrl("://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel")
                    var cursor = tp ? tp.findParameter("primaryTime") : null
                    if (cursor)
                    {
                        var curPos = cursor.value
                        cursor.setValue(curPos + offsetSec, true)
                    }
                } catch(e) {}
            }

            Host.GUI.Commands.interpretCommand(
                "Marker", "Insert Named", false,
                Host.Attributes(["Name", markerName])
            )

            if (offsetVal !== 0)
            {
                var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
                var fps = isFrames ? this.getFrameRateValue() : 30
                var offsetSec = isFrames ? offsetVal / fps : offsetVal / 1000.0
                try {
                    var tp = Host.Objects.getObjectByUrl("://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel")
                    var cursor = tp ? tp.findParameter("primaryTime") : null
                    if (cursor)
                    {
                        var curPos = cursor.value
                        cursor.setValue(curPos - offsetSec, true)
                    }
                } catch(e) {}
            }
        }
    }

    this.openRenameDialog = function(idx)
    {
        var dlg = new RenameDialogController(
            this["SlotName" + idx] ? this["SlotName" + idx].string : "")
        dlg.initialize()

        var theme = Host.GUI.Themes.getTheme(kPackageID)
        var result = Host.GUI.runDialog(theme, "RenameDialog", dlg)

        if (result === Host.GUI.Constants.kOkay && dlg.RenameText)
        {
            var newName = dlg.RenameText.string
            if (this["SlotName" + idx])
                this["SlotName" + idx].string = newName
        }

        dlg.terminate()
        this.updateBtnStates()
    }

    this.paramChanged = function(param)
    {
        if (param && param.name === "UndoBtn" && param.value === 1)
        {
            param.value = 0
            Host.GUI.Commands.interpretCommand("Edit", "Undo")
            return
        }

        if (param && param.name === "RedoBtn" && param.value === 1)
        {
            param.value = 0
            Host.GUI.Commands.interpretCommand("Edit", "Redo")
            return
        }

        if (param && param.name === "SaveBtn" && param.value === 1)
        {
            param.value = 0
            this.savePreset()
            return
        }

        if (param && param.name === "ClearBtn" && param.value === 1)
        {
            param.value = 0
            if (Host.GUI.ask("Clear all slot names? This cannot be undone.") === Host.GUI.Constants.kYes)
                this.clearAll()
            return
        }

        if (param && param.name === "OffsetSlider")
        {
            if (this._offsetSyncing) return
            this._offsetSyncing = true
            var sv = this.OffsetSlider.value
            var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
            if (isFrames)
                this.OffsetMs.value = -Math.round(sv * this.getFrameRateValue() / 1000)
            else
                this.OffsetMs.value = -sv
            this._offsetSyncing = false
            return
        }

        if (param && param.name === "OffsetMs")
        {
            if (this._offsetSyncing) return
            this._offsetSyncing = true
            var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
            if (isFrames)
            {
                var fps = this.getFrameRateValue()
                var maxFrames = fps
                if (this.OffsetMs.value < -maxFrames) this.OffsetMs.value = -maxFrames
                if (this.OffsetMs.value > 0) this.OffsetMs.value = 0
                var clamped = Math.abs(this.OffsetMs.value)
                var sv = Math.round(clamped * 1000 / fps)
                this.OffsetSlider.value = Math.min(sv, 1000)
            }
            this._offsetSyncing = false
            return
        }

        if (param && param.name === "OffsetUnit")
        {
            this.updateFrameRateDim()
            var sv = this.OffsetSlider.value
            var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
            if (isFrames)
                this.OffsetMs.value = -Math.round(sv * this.getFrameRateValue() / 1000)
            else
                this.OffsetMs.value = -sv
            return
        }

        if (param && param.name === "FrameRateList")
        {
            var isFrames = this.OffsetUnit && this.OffsetUnit.value === 1
            if (isFrames)
            {
                var sv = this.OffsetSlider.value
                this.OffsetMs.value = -Math.round(sv * this.getFrameRateValue() / 1000)
            }
            return
        }

        if (param && param.name === "PresetList")
        {
            var selected = this.PresetList.string
            if (selected === "(No Preset)")
                this.clearAll()
            else if (selected && selected !== "")
                this.loadPresetByName(selected)
            return
        }

        var pn = param.name
        if (pn && pn.indexOf("SlotBtn") === 0 && param.value === 1)
        {
            param.value = 0
            this.createMarker(parseInt(pn.substring(7), 10))
        }
    }
    this.notify = function(s, m) {}

    this.findParameter = function(name)
    {
        if (name === "PresetList") return this.PresetList
        if (name === "UndoBtn") return this.UndoBtn
        if (name === "RedoBtn") return this.RedoBtn
        if (name === "SaveBtn") return this.SaveBtn
        if (name === "ClearBtn") return this.ClearBtn
        if (name === "AutoNumBtn") return this.AutoNumBtn
        if (name === "OffsetSlider") return this.OffsetSlider
        if (name === "OffsetMs") return this.OffsetMs
        if (name === "OffsetUnit") return this.OffsetUnit
        if (name === "FrameRateList") return this.FrameRateList
        for (var i = 0; i < kSlots; i++)
        {
            if (name === "SlotName" + i) return this["SlotName" + i]
            if (name === "SlotDisplay" + i) return this["SlotDisplay" + i]
            if (name === "SlotBtn" + i) return this["SlotBtn" + i]
        }
        return null
    }

    this.storeValues = function(a) { return Host.Results.kResultOk }
    this.restoreValues = function(a) { return Host.Results.kResultOk }
    this.saveViewState = function() { return true }
    this.loadViewState = function() { return true }
}

function RenameDialogController(currentName)
{
    this.interfaces = [Host.Interfaces.IController, Host.Interfaces.IParamObserver]

    this.initialize = function()
    {
        this.paramList = Host.Classes.createInstance("CCL:ParamList")
        this.paramList.controller = this
        this.RenameText = this.paramList.addString("RenameText")
        this.RenameText.string = currentName || ""
        return this.paramList
    }

    this.terminate = function()
    {
        try { if (this.paramList) this.paramList.controller = null } catch(e) {}
    }

    this.paramChanged = function(param) {}
    this.findParameter = function(name) { return name === "RenameText" ? this.RenameText : null }
}

function createInstance() { return new MarkerCreatorController() }
