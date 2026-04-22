var kPackageID = "crossfadetool";

function CrossfadeToolTask() {
  this.interfaces = [Host.Interfaces.IEditTask, Host.Interfaces.IParamObserver];
}

CrossfadeToolTask.prototype.prepareEdit = function(context) {
  var params = context.parameters;
  if (!params) {
    Host.GUI.alert("Crossfade Tool: no parameter list available.");
    return Host.Results.kResultFailed;
  }

  this.FadeLength = params.addInteger(0, 1000, "FadeLength");
  this.FadeLength.value = 20;

  this.Type = params.addInteger(0, 2, "Type");
  this.Type.value = 0;

  this.Bend = params.addInteger(0, 100, "Bend");
  this.Bend.value = 100;

  this.SplitCrossfade = params.addParam("SplitCrossfade");
  this.SplitCrossfade.value = 0;

  this.Status = params.addString("Status");
  this.Status.value = "This tool needs at least two audio events selected.";


  context.restore();
  return context.runDialog("CrossfadeToolDialog", kPackageID);
};

CrossfadeToolTask.prototype.paramChanged = function(param) {
  if ((param === this.FadeLength || param === this.Type || param === this.Bend || param === this.SplitCrossfade) && this.Status) {
    var total = formatSeconds(this.FadeLength.value / 1000);
    var bendPct = Math.round(bendValueFromField(this) * 100);
    var head = "Type " + typeNameFromIndex(this.Type ? this.Type.value : 0) + ", Bend " + bendPct + "% | ";
    if (this.SplitCrossfade && this.SplitCrossfade.value) {
      this.Status.value = head + "Split evenly: " + total + " total, " + formatSeconds((this.FadeLength.value || 0) / 2) + " per side";
      return;
    }
    this.Status.value = head + "Full amount per side: " + total;
  }
};

CrossfadeToolTask.prototype.performEdit = function(context) {
  var events = collectAudioEvents(context);
  if (events.length < 2) {
    Host.GUI.alert("Crossfade Tool:\nSelect at least two audio events.");
    return Host.Results.kResultFailed;
  }

  var functions = getAudioFunctions(context, events[0]);
  if (!functions || !functions.createCrossFades) {
    Host.GUI.alert("Crossfade Tool:\nCould not create AudioFunctions.createCrossFades.");
    return Host.Results.kResultFailed;
  }

  var length = Math.max(0, Math.min(1000, Number(this.FadeLength.value || 0))) / 1000;
  if (this.SplitCrossfade && this.SplitCrossfade.value) {
    length = length / 2;
  }

  var typeName = typeNameFromIndex(this.Type ? this.Type.value : 0);
  var bendValue = bendValueForType(this);
  var attrs = Host.Attributes(["Length", String(length), "Type", typeName, "Bend", String(bendValue)]);
  try {
    Host.GUI.Commands.interpretCommand("Audio", "Create Crossfades", false, attrs);
  } catch (e) {
    Host.GUI.alert("Crossfade Tool:\nCould not create crossfades.");
    return Host.Results.kResultFailed;
  }

  functions.createCrossFades(events, length);

  return Host.Results.kResultOk;
};

function collectAudioEvents(context) {
  var out = [];
  var iterator = context.iterator || context.eventIterator;
  if (!iterator) return out;

  while (!iterator.done()) {
    var event = iterator.next();
    if (event && event.mediaType == "Audio") {
      out.push(event);
    }
  }
  return out;
}

function getAudioFunctions(context, event) {
  var root = null;
  if (event && event.getRoot) root = event.getRoot();
  else if (event && event.region && event.region.getRoot) root = event.region.getRoot();
  else if (context.functions && context.functions.root) root = context.functions.root;
  return root && root.createFunctions ? root.createFunctions("AudioFunctions") : null;
}

function formatSeconds(value) {
  var seconds = Math.max(0, Math.min(1, Number(value || 0)));
  var ms = Math.round(seconds * 1000);
  return ms + " ms";
}

function typeNameFromIndex(index) {
  return ["Linear", "Logarithmic", "Exponential"][Math.max(0, Math.min(2, Number(index) || 0))] || "Linear";
}

function bendValueFromField(task) {
  return Number(task.Bend ? task.Bend.value : 0);
}

function bendValueForType(task) {
  var raw = Math.max(0, Math.min(100, bendValueFromField(task))) / 100;
  var type = typeNameFromIndex(task.Type ? task.Type.value : 0);
  if (type === "Logarithmic") return 1 - raw;
  if (type === "Exponential") return raw;
  return raw;
}

function safeString(value) {
  try {
    if (value === null) return "<null>";
    if (value === undefined) return "<undefined>";
    return String(value);
  } catch (e) {
    return "<error>";
  }
}


function createInstance() {
  return new CrossfadeToolTask();
}
