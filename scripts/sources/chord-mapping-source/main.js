
function ChordMappingTask() {
  this.interfaces = [Host.Interfaces.IEditTask];
}

ChordMappingTask.prototype.prepareEdit = function(context) {
  Host.GUI.alert("Chord Mapping: Scraping selected chords from Chord Track");
  return Host.Results.kResultOk;
};

ChordMappingTask.prototype.performEdit = function(context) {
  var results = [];
  var iterator = context.iterator;
  var chordMap = [];
  
  iterator.first();
  var totalEvents = 0;
  var chordCount = 0;
  
  while (!iterator.done()) {
    totalEvents++;
    var event = iterator.next();
    if (event && event.chord) {
      chordCount++;
      var chordData = {
        name: event.chord.name,
        type: event.chord.type,
        root: event.chord.root,
        bass: event.chord.bass,
        rootPitch: event.chord.rootPitch,
        bassPitch: event.chord.bassPitch,
        start: event.startTime ? event.startTime.string : "undefined",
        end: event.endTime ? event.endTime.string : "undefined",
        isLydian: event.chord.hasInterval ? event.chord.hasInterval(11) : false
      };
      chordMap.push(chordData);
      results.push("Chord: " + chordData.name + " (rootPitch " + chordData.rootPitch + ") at " + chordData.start);
    }
  }
  
  results.push("Total events iterated: " + totalEvents);
  results.push("Chords found: " + chordCount);
  
  if (chordMap.length === 0) {
    results.push("No chords found - select chords on Chord Track first");
  } else {
    results.push("Scraped " + chordMap.length + " chords into map");
  }

  // Save JSON map
  var mapPath = Host.Url("local://$USERCONTENT/Chord_Mapping.json");
  var file = Host.IO.createTextFile(mapPath);
  if (file) {
    file.writeLine(JSON.stringify(chordMap, null, 2));
    file.close();
    results.push("Chord map saved to Chord_Mapping.json");
  }

  // Output results
  var resultPath = Host.Url("local://$USERCONTENT/Chord_Mapping_Results.txt");
  var file2 = Host.IO.createTextFile(resultPath);
  if (file2) {
    for (var k = 0; k < results.length; k++) {
      file2.writeLine(results[k]);
    }
    file2.close();
  }

  Host.GUI.alert("Chord Mapping complete! Check Chord_Mapping.json & Chord_Mapping_Results.txt");
  return Host.Results.kResultOk;
};

function createInstance() {
  return new ChordMappingTask();
}
