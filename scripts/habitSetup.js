document.getElementById("createHabitBttn").onclick = function(){openHabitSetup()};
function openHabitSetup(){
  document.getElementById("habitSetup").innerHTML = setupToString;
  document.getElementById("hidden").class = "";
}
var setupToString = "<p>The habit setup will be implemented soon.</p>";
