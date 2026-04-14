function ScriptBTask() {
  this.interfaces = [Host.Interfaces.IEditTask];
}

ScriptBTask.prototype.prepareEdit = function(context) {
  Host.GUI.alert("Script B is ready.");
  return Host.Results.kResultOk;
};

ScriptBTask.prototype.performEdit = function(context) {
  Host.GUI.alert("Script B ran successfully.");
  return Host.Results.kResultOk;
};

function createInstance() {
  return new ScriptBTask();
}
