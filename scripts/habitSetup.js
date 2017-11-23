document.ready = function(){openCloseHabitSetup("close")};
function openCloseHabitSetup(x){
  if(x == "open"){
    document.getElementById("habitSetup").innerHTML = setupToString;
    document.getElementById("saveHabitChanges").onclick = openCloseHabitSetup("close");
  }else if(x == "close"){
    document.getElementById("habitSetup").innerHTML = "<button id='createHabitBttn'>Create habit</button>";
    document.getElementById("createHabitBttn").onclick = function(){openHabitSetup("open")};
}
var setupToString = "<p>The habit setup will be implemented soon.</p>"+
    "<button id='saveHabitChanges'>Commit</button>";
