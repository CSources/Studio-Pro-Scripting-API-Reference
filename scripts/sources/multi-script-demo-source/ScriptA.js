function ScriptATask() {
  this.interfaces = [Host.Interfaces.IEditTask];
}

ScriptATask.prototype.prepareEdit = function(context) {
  Host.GUI.alert("Script A is ready.");
  return Host.Results.kResultOk;
};

ScriptATask.prototype.performEdit = function(context) {
  Host.GUI.alert("Script A ran successfully.");
  return Host.Results.kResultOk;
};

function createInstance() {
  return new ScriptATask();
}
