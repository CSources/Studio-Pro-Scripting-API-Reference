function ScriptATask() {
  this.interfaces = [Host.Interfaces.IEditTask];
}

ScriptATask.prototype.prepareEdit = function(context) {
  this.ShowMessage = context.parameters.addInteger(0, 1, "ShowMessage");
  this.ShowMessage.value = 1;
  context.restore();
  return context.runDialog("ScriptADialog", "com.chris.multi-script-demo");
};

ScriptATask.prototype.performEdit = function(context) {
  if (this.ShowMessage && this.ShowMessage.value === 1) {
    Host.GUI.alert("Script A ran successfully.");
  }
  return Host.Results.kResultOk;
};

function createInstance() {
  return new ScriptATask();
}
