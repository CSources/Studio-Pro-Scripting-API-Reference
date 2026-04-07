/**
 * Flam Tool - Proper flam creation with UI controls
 * 
 * Features:
 * - Time slider (-1 to 1) for shift amount
 * - Absolute button for ms-based shifting
 * - Before button to reverse shift direction
 * - Velocity slider (1-100%) for new note velocity
 * - Works on selected notes or all notes in region
 */

function FlamToolTask() {
    this.interfaces = [Host.Interfaces.IEditTask, Host.Interfaces.IParamObserver];
}

FlamToolTask.prototype.prepareEdit = function(context) {
    var params = context.parameters;
    
    // Time slider: -1 to 1, default -0.25
    this.TimeSlider = params.addFloat(-1, 1, "TimeSlider");
    this.TimeSlider.value = -0.25;
    
    // Absolute button: 0 = musical, 1 = milliseconds
    this.Absolute = params.addInteger(0, 1, "Absolute");
    this.Absolute.value = 0;
    
    // Before button: 0 = default, 1 = reverse direction
    this.Before = params.addInteger(0, 1, "Before");
    this.Before.value = 0;
    
    // Velocity slider: 1-100%, default 75
    this.VelocityPercent = params.addInteger(1, 100, "VelocityPercent");
    this.VelocityPercent.value = 75;
    
    // Defaults button: triggers reset to defaults
    this.Defaults = params.addInteger(0, 1, "Defaults");
    this.Defaults.value = 0;
    
    context.restore();
    return context.runDialog("FlamToolDialog", "flam.tool");
};

FlamToolTask.prototype.paramChanged = function(param) {
    // Handle Defaults button click
    if (param === this.Defaults && this.Defaults.value === 1) {
        this.TimeSlider.value = -0.25;
        this.VelocityPercent.value = 75;
        this.Absolute.value = 0;
        this.Before.value = 0;
        this.Defaults.value = 0; // Reset button state
    }
};

FlamToolTask.prototype.performEdit = function(context) {
    var editor = context.editor;
    var iterator = context.iterator;
    var functions = context.functions;
    
    if (!editor || !iterator || !functions) {
        Host.GUI.alert("Error: Could not get editor, iterator, or functions.");
        return Host.Results.kResultFailed;
    }
    
    // Collect selected notes
    var selectedNotes = [];
    while (!iterator.done()) {
        selectedNotes.push(iterator.next());
    }
    
    // If no notes selected, get all notes from region
    if (selectedNotes.length === 0) {
        var regionIter = null;
        
        // Try to get region iterator
        if (editor.activeRegion) {
            regionIter = editor.activeRegion.createSequenceIterator();
        }
        
        if (regionIter) {
            while (!regionIter.done()) {
                var note = regionIter.next();
                if (note && note.pitch !== undefined) {
                    selectedNotes.push(note);
                }
            }
        }
        
        if (selectedNotes.length === 0) {
            Host.GUI.alert("No notes found.\nPlease select notes or ensure you have an Instrument Part open.");
            return Host.Results.kResultFailed;
        }
    }
    
    // Get template event and region
    var templateEvent = selectedNotes[0];
    var region = templateEvent.region;
    
    if (!region) {
        Host.GUI.alert("Could not get region from notes.");
        return Host.Results.kResultFailed;
    }
    
    // Get tempo for absolute mode conversion
    var tempo = 120; // Default
    try {
        var tp = Host.Objects.getObjectByUrl("://hostapp/DocumentManager/ActiveDocument/Environment/TransportPanel");
        if (tp) {
            tempo = Number(tp.findParameter("tempo").string);
        }
    } catch (e) {
        // Use default tempo
    }
    
    // Read parameter values
    var timeSlider = this.TimeSlider.value;
    var absolute = this.Absolute.value;
    var before = this.Before.value;
    var velocityPercent = this.VelocityPercent.value;
    
    // Calculate shift amount
    var shift = 0;
    if (absolute === 0) {
        // Musical mode: max shift = 0.25 (1/4 note)
        shift = timeSlider * 0.25;
    } else {
        // Absolute mode: max shift = 100ms
        var shiftMs = timeSlider * 100;
        // Convert ms to musical beats: ms * (tempo / 60000)
        shift = shiftMs * (tempo / 60000);
    }
    
    functions.executeImmediately = true;
    
    var notesCreated = 0;
    var errors = 0;
    
    // Process each note
    for (var n = 0; n < selectedNotes.length; n++) {
        var note = selectedNotes[n];
        var originalStart = note.start;
        var originalVelocity = note.velocity;
        var originalPitch = note.pitch;
        var originalLength = note.length;
        
        try {
            // Calculate shift amount (always positive for "back" direction)
            var shiftAmount = Math.abs(shift);
            
            // Calculate new start positions
            var newNoteStart = originalStart;
            var originalNoteStart = originalStart;
            
            if (before === 0) {
                // Default mode: notes shift BACK (later in time, toward right)
                // Slider -1: Original shifts back, new note takes original's start position
                // Slider +1: New note shifts back, original maintains start position
                if (timeSlider < 0) {
                    // Original note shifts back (later)
                    originalNoteStart = originalStart + shiftAmount;
                    // New note stays at original start position
                    newNoteStart = originalStart;
                } else if (timeSlider > 0) {
                    // New note shifts back (later)
                    newNoteStart = originalStart + shiftAmount;
                    // Original note stays at original start position
                    originalNoteStart = originalStart;
                }
            } else {
                // Before mode: notes shift BEFORE original start position (earlier, toward left)
                // Slider -1: New note shifts before original
                // Slider +1: Original note shifts before original
                if (timeSlider < 0) {
                    // New note shifts before original
                    newNoteStart = originalStart - shiftAmount;
                    // Original note stays at original start position
                    originalNoteStart = originalStart;
                } else if (timeSlider > 0) {
                    // Original note shifts before original
                    originalNoteStart = originalStart - shiftAmount;
                    // New note stays at original start position
                    newNoteStart = originalStart;
                }
            }
            
            // Calculate new velocity
            var newVelocity = originalVelocity * (velocityPercent / 100.0);
            
            // Clone template and create new note
            var newNote = templateEvent.clone();
            functions.insertEvent(region, newNote);
            functions.moveEvent(newNote, newNoteStart);
            functions.resizeEvent(newNote, originalLength);
            functions.modifyPitch(newNote, originalPitch);
            functions.modifyVelocity(newNote, newVelocity);
            functions.muteEvent(newNote, false);
            
            // Move original note if needed
            if (Math.abs(originalNoteStart - originalStart) > 0.0001) {
                functions.moveEvent(note, originalNoteStart);
            }
            
            notesCreated++;
        } catch (e) {
            errors++;
        }
    }
    
    return Host.Results.kResultOk;
};

function createInstance() {
    return new FlamToolTask();
}