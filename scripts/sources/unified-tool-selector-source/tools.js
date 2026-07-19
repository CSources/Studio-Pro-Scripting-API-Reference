// Developed with agentic coding assistance.

var TOOL_CATEGORY = "Toolbar";

function ToolAction(name, slot) {
    this.interfaces = [Host.Interfaces.IEditTask];
    this.prepareEdit = function(context) {
        return Host.Results.kResultOk;
    };
    this.performEdit = function(context) {
        if (slot > 0) {
            Host.GUI.Commands.interpretCommand(TOOL_CATEGORY, "Tool " + slot);
        }
        return Host.Results.kResultOk;
    };
}

// EventEdit (Arrangement + Audio Editor)
function createArrow()   { return new ToolAction("Arrow Tool",   1); }
function createRange()  { return new ToolAction("Range Tool",   2); }
function createSplit()  { return new ToolAction("Split Tool",   3); }
function createErase()  { return new ToolAction("Erase Tool",   4); }
function createPaint()  { return new ToolAction("Paint Tool",   5); }
function createMute()   { return new ToolAction("Mute Tool",    6); }
function createBend()   { return new ToolAction("Bend Tool",    7); }
function createListen() { return new ToolAction("Listen Tool",  8); }

// MusicEdit (Note Editor)
function createArrowM()   { return new ToolAction("Arrow Tool",   1); }
function createRangeM()   { return new ToolAction("Range Tool",   0); }
function createSplitM()   { return new ToolAction("Split Tool",   2); }
function createEraseM()   { return new ToolAction("Erase Tool",   4); }
function createPaintM()   { return new ToolAction("Paint Tool",   3); }
function createMuteM()    { return new ToolAction("Mute Tool",    5); }
function createBendM()    { return new ToolAction("Bend Tool",    0); }
function createListenM()  { return new ToolAction("Listen Tool",  6); }