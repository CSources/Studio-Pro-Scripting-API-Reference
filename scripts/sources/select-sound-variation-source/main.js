// Developed with agentic coding assistance.

function SelectVariations() {
  this.interfaces = [
    Host.Interfaces.IEditTask,
    Host.Interfaces.IParamObserver,
    Host.Interfaces.IController,
    Host.Interfaces.IObserver
  ]

  this.paramList = Host.Classes.createInstance("CCL:ParamList")
  this.paramList.controller = this

  this.prepareEdit = function(context) {
    context.restore()

    this.VariationNames = this.paramList.addString("VariationNames")
    this.VariationNames.value = ""

    this.VariationList = Host.Classes.createInstance("Host:ListViewModel")
    this.VariationList.columns.addColumn(260, "Name", "name", 50, 1 | 64)

    var region = context.editor && context.editor.activeRegion
    if (region) {
      var svm = region.soundVariationMap
      if (svm) {
        for (var id = 0; id < 50; id++) {
          try {
            var v = svm.lookupVariationByID(id)
            if (v && typeof v.name === "string" && v.name.length > 0) {
              var item = this.VariationList.newItem(id)
              item.details.name = v.name
              item.details.id = id
              this.VariationList.addItem(item)
            }
          } catch (e) {}
        }
      }
      this.VariationList.changed()
    }
    if (this.VariationList.itemCount === 0) {
      var item = this.VariationList.newItem(-1)
      item.details.name = "(No variations)"
      item.details.id = -1
      this.VariationList.addItem(item)
      this.VariationList.changed()
    }

    Host.Signals.advise(this.VariationList, this)

    return context.runDialog("SelectVariationsDialog", "select.sound.variation")
  }

  this.findParameter = function(name) {
    return this.paramList.findParameter(name)
  }

  this.notify = function(subject, msg) {
    if (subject === this.VariationList) {
      var names = []
      var sel = this.VariationList.getSelectedItems()
      if (sel) {
        var iter = sel.newIterator()
        while (!iter.done()) {
          var item = iter.next()
          if (item && item.details && item.details.name && item.details.id !== -1) {
            names.push(item.details.name)
          }
        }
      }
      this.VariationNames.value = names.join(", ")
    }
  }

  this.paramChanged = function(param) {
  }

  this.performEdit = function(context) {
    var editor = context.editor
    if (!editor || !editor.activeRegion) return Host.Results.kResultFailed
    var region = editor.activeRegion

    var raw = (this.VariationNames.value || "").trim()
    if (raw.length === 0) return Host.Results.kResultOk

    var svm = region.soundVariationMap
    if (!svm) return Host.Results.kResultOk

    var targetIndices = {}
    var unmatchedTerms = []

    var terms = raw.split(",")
    for (var t = 0; t < terms.length; t++) {
      var term = terms[t].trim()
      if (term.length === 0) continue

      var matched = false
      var lowerTerm = term.toLowerCase()
      for (var id = 0; id < 50; id++) {
        try {
          var v = svm.lookupVariationByID(id)
          if (v && typeof v.name === "string" && v.name.toLowerCase() === lowerTerm) {
            targetIndices[id] = true
            matched = true
            break
          }
        } catch (e) {}
      }
      if (!matched) unmatchedTerms.push(term)
    }

    if (Object.keys(targetIndices).length === 0) {
      if (unmatchedTerms.length > 0) {
        Host.GUI.alert("No matching variation found for:\n" + unmatchedTerms.join(", "))
      }
      return Host.Results.kResultOk
    }

    var seqIt = region.createSequenceIterator()
    var matching = []
    while (!seqIt.done()) {
      var note = seqIt.next()
      if (!note) continue
      var idx = region.getSoundVariationForNote(note)
      if (targetIndices[idx]) matching.push(note)
    }

    if (matching.length > 0) {
      editor.selection.unselectAll()
      var sf = editor.createSelectFunctions(context.functions)
      sf.executeImmediately = true
      sf.selectMultiple(matching)
    }

    if (unmatchedTerms.length > 0) {
      Host.GUI.alert("No matching variation found for:\n" + unmatchedTerms.join(", "))
    }

    return Host.Results.kResultOk
  }
}

function createSelectVariationsInstance() {
  return new SelectVariations()
}
